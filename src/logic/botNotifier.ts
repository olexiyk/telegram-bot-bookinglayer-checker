import {
  ApiProductAvailabilities,
  Timeslot,
} from '@/api/ApiProductAvailabilities'
import { DocumentType } from '@typegoose/typegoose'
import { I18nContext } from '@grammyjs/i18n'
import { Product, findAllProducts } from '@/models/Product'
import { User, findUserBySubscribedProduct } from '@/models/User'
import { enGB, ko, ru, uk } from 'date-fns/locale'
import { format } from 'date-fns'
import { getProductAvailabilities } from '@/api/BookingLayer'
import bot from '@/helpers/bot'
import env from '@/helpers/env'
import i18n from '@/helpers/i18n'

const locales = {
  en: enGB,
  uk: uk,
  ru: ru,
  kr: ko,
}

export default async function notifyAllSubscribedUsers() {
  const allProducts: DocumentType<Product>[] = await findAllProducts().exec()
  console.log(`Found ${allProducts.length} products`)

  for (const product of allProducts) {
    const apiProductAvailabilities = await getProductAvailabilities(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      product.id,
      new Date(),
      14,
      // mock data
      true
    )
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const allSubscribedUsers = await findUserBySubscribedProduct(product.id)
    console.log(
      `${allSubscribedUsers.length} users subscribed to updates for ${product.name}`
    )
    for (const user of allSubscribedUsers) {
      await notifyUser(user, apiProductAvailabilities, product)
    }
  }
}

function notifyAboutTimeslots(
  availableTimeslots: Timeslot[][],
  user: User,
  ctx: I18nContext,
  product: Product
) {
  const availableTimeslotsMessage: string[] = []

  for (const availableTimeslot of availableTimeslots) {
    availableTimeslotsMessage.push(
      availableTimeslot
        .map((timeslot) => {
          const formattedTime = format(timeslot.dateTime, 'yyyy-MM-dd HH:mm', {
            // @ts-ignore
            locale: locales[user.language],
          })
          return ctx.t('availableTimeAndAvailabilityLeft', {
            time: formattedTime,
            availability: timeslot.availability,
          })
        })
        .join('\n')
    )
  }
  // url: 'https://' + env.BUSINESS_DOMAIN,

  return bot.api.sendMessage(
    user.id,
    `${ctx.t('availableTimeslotsWithinNextTwoWeeks', { product: product.name })}
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
  product: Product
) {
  return bot.api.sendMessage(
    user.id,
    ctx.t('noAvailableTimeslotsWithinNextTwoWeeks', { product: product.name }),
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

  const formattedDate = format(
    apiProductAvailabilities.firstAvailableDate,
    'dd LLLL yyyy',
    // @ts-ignore
    { locale: locales[user.language] }
  )
  const firstAvailableDateMessage = ctx.t('firstAvailableDateForProduct', {
    product: product.name,
    date: formattedDate,
  })

  await bot.api.sendMessage(user.id, firstAvailableDateMessage)

  const availableTimeslots = apiProductAvailabilities.availabilities
    .filter((availability) => availability.availableForCheckin)
    .map((availability) =>
      availability.timeslots.filter((timeslot) => timeslot.availableForCheckin)
    )

  if (availableTimeslots.length > 0) {
    return notifyAboutTimeslots(availableTimeslots, user, ctx, product)
  } else {
    return notifyAboutNoneAvailableTimeslots(user, ctx, product)
  }
}
