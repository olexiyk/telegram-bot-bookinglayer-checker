import { ApiProductAvailabilities } from '@/api/ApiProductAvailabilities'
import { I18nContext } from '@grammyjs/i18n'
import { InlineKeyboardButton } from '@grammyjs/types/inline'
import { Product } from '@/models/Product'
import { User } from '@/models/User'
import { enGB, ko, ru, uk } from 'date-fns/locale'
import { format, formatDistance, formatRelative, subDays } from 'date-fns'
import bot from '@/helpers/bot'
import env from '@/helpers/env'
import i18n from '@/helpers/i18n'

const locales = {
  en: enGB,
  uk: uk,
  ru: ru,
  kr: ko,
}

export default async function notify(
  user: User,
  apiProductAvailabilities: ApiProductAvailabilities,
  product: Product
) {
  // Start bot
  await bot.init()

  const ctx: I18nContext = i18n.createContext(user.language, {})

  const formattedDate = format(
    apiProductAvailabilities.firstAvailableDate,
    'dd LLLL, yyyy',
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

  const inlineKeyboard: InlineKeyboardButton[][] = []

  for (const availableTimeslot of availableTimeslots) {
    inlineKeyboard.push(
      availableTimeslot.map((timeslot) => {
        const formattedTime = format(timeslot.dateTime, 'yyyy-MM-dd HH:mm', {
          // @ts-ignore
          locale: locales[user.language],
        })
        return {
          text: ctx.t('availableTimeslot', {
            time: formattedTime,
            availability: timeslot.availability,
          }),
          url: 'https://' + env.BUSINESS_DOMAIN,
        }
      })
    )
  }

  return bot.api.sendMessage(user.id, ctx.t('availableTimeslots'), {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: inlineKeyboard,
    },
  })
}
