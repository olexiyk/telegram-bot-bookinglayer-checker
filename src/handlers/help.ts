import {
  BUTTON_SET_LANGUAGE,
  BUTTON_SET_NOTIFICATION_INTERVAL,
  BUTTON_SHOW_PRODUCTS,
} from '@/helpers/consts'
import { localisedServerTimezone } from '@/helpers/i18n'
import Context from '@/models/Context'
import env from '@/helpers/env'
import notificationIntervalToLocalText from '@/helpers/notificationIntervalToLocalText'

export default function handleHelp(ctx: Context) {
  return ctx.reply(
    ctx.i18n.t('help', {
      business: env.BUSINESS_DOMAIN,
      interval: notificationIntervalToLocalText(
        ctx.dbuser.notificationInterval,
        ctx.i18n
      ),
      timezoneCode: env.TIMEZONE,
      timezone: localisedServerTimezone(ctx.dbuser.language),
    }),
    {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: ctx.i18n.t('selectAvailableProducts'),
              callback_data: BUTTON_SHOW_PRODUCTS,
            },
          ],
          [
            {
              text: ctx.i18n.t('languageSelector'),
              callback_data: BUTTON_SET_LANGUAGE,
            },
          ],
          [
            {
              text: ctx.i18n.t('changeNotificationInterval'),
              callback_data: BUTTON_SET_NOTIFICATION_INTERVAL,
            },
          ],
        ],
      },
    }
  )
}
