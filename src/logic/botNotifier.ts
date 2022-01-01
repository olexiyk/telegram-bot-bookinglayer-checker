import {
  ApiProductAvailabilities,
  Timeslot,
} from '@/api/ApiProductAvailabilities'
import { DocumentType } from '@typegoose/typegoose'
import { I18nContext } from '@grammyjs/i18n'
import { Product, findAllProducts } from '@/models/Product'
import { User, findUserBySubscribedProduct } from '@/models/User'
import { getProductAvailabilities } from '@/api/BookingLayer'
import bot from '@/helpers/bot'
import env from '@/helpers/env'
import i18n from '@/helpers/i18n'
import shouldNotify, { saveNotification } from '@/logic/notificationDecider'

const locales: {
  [key: string]: string
} = {
  en: 'en-GB',
  uk: 'uk',
  ru: 'ru',
  kr: 'ko',
  de: 'de',
}

export default async function notifyAllSubscribedUsers() {
  const allProducts: DocumentType<Product>[] = await findAllProducts().exec()
  console.log(`Found ${allProducts.length} products`)

  for (const product of allProducts) {
    const allSubscribedUsers = await findUserBySubscribedProduct(product.id)
    console.log(
      `${allSubscribedUsers.length} users subscribed to updates for ${product.name}`
    )
    if (allSubscribedUsers.length === 0) {
      continue
    }

    const apiProductAvailabilities = await getProductAvailabilities(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      product.id,
      new Date(),
      14
    )

    for (const user of allSubscribedUsers) {
      if (await shouldNotify(user, product.id, apiProductAvailabilities)) {
        await notifyUser(user, apiProductAvailabilities, product)
        await saveNotification(user, product, apiProductAvailabilities)
      }
    }
  }
}

function notifyAboutTimeslots(
  availableTimeslots: Timeslot[][],
  user: User,
  ctx: I18nContext,
  product: Product,
  firstAvailableDateMessage: string
) {
  const availableTimeslotsMessage: string[] = []

  for (const availableTimeslot of availableTimeslots) {
    availableTimeslotsMessage.push(
      availableTimeslot
        .map((timeslot) => {
          const formattedTime = timeslot.dateTime.toLocaleTimeString(
            locales[user.language],
            {
              weekday: 'short',
              year: 'numeric',
              day: 'numeric',
              month: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }
          )
          return ctx.t('availableTimeAndAvailabilityLeft', {
            time: formattedTime,
            availability: timeslot.availability,
          })
        })
        .join('\n')
    )
  }

  return bot.api.sendMessage(
    user.id,
    `${firstAvailableDateMessage} 
${ctx.t('availableTimeslotsWithinNextTwoWeeks')}
${availableTimeslotsMessage.join('\n')}`,
    {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: ctx.t('goToBookingPage'),
              url: 'https://' + env.BUSINESS_DOMAIN,
            },
          ],
        ],
      },
    }
  )
}

function notifyAboutNoneAvailableTimeslots(
  user: User,
  ctx: I18nContext,
  product: Product,
  firstAvailableDateMessage: string
) {
  return bot.api.sendMessage(
    user.id,
    `${firstAvailableDateMessage} 
${ctx.t('noAvailableTimeslotsWithinNextTwoWeeks')}`,
    {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: ctx.t('goToBookingPage'),
              url: 'https://' + env.BUSINESS_DOMAIN,
            },
          ],
        ],
      },
    }
  )
}

async function notifyUser(
  user: User,
  apiProductAvailabilities: ApiProductAvailabilities,
  product: Product
) {
  // Start bot
  await bot.init()

  const ctx: I18nContext = i18n.createContext(user.language, {})
  const firstAvailableDateMessage = ctx.t('firstAvailableDateForProduct', {
    product: product.name,
    date: apiProductAvailabilities.firstAvailableDate.toLocaleDateString(
      locales[user.language],
      { weekday: 'long', year: 'numeric', day: 'numeric', month: 'long' }
    ),
  })

  const availableTimeslots = apiProductAvailabilities.availabilities
    .filter((availability) => availability.availableForCheckin)
    .map((availability) =>
      availability.timeslots.filter((timeslot) => timeslot.availableForCheckin)
    )

  if (availableTimeslots.length > 0) {
    return notifyAboutTimeslots(
      availableTimeslots,
      user,
      ctx,
      product,
      firstAvailableDateMessage
    )
  } else {
    return notifyAboutNoneAvailableTimeslots(
      user,
      ctx,
      product,
      firstAvailableDateMessage
    )
  }
}
