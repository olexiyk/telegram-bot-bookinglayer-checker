import {
  BUTTON_SET_LANGUAGE,
  BUTTON_SET_NOTIFICATION_INTERVAL,
  BUTTON_SHOW_PRODUCTS,
} from '@/helpers/consts'
import Context from '@/models/Context'
import env from '@/helpers/env'
import notificationIntervalToLocalText from '@/helpers/notificationIntervalToLocalText'

export default function handleHelp(ctx: Context) {
  return ctx.reply(ctx.i18n.t('help', { business: env.BUSINESS_DOMAIN }), {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: ctx.i18n.t('showProducts'),
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
            text: `${ctx.i18n.t('setNotificationInterval')} \
            ${ctx.i18n.t('currentNotificationInterval', {
              interval: notificationIntervalToLocalText(
                ctx.dbuser.notificationInterval,
                ctx.i18n
              ),
            })}`,
            callback_data: BUTTON_SET_NOTIFICATION_INTERVAL,
          },
        ],
      ],
    },
  })
}
