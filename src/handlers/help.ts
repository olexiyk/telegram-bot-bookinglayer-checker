import Context from '@/models/Context'
import env from '@/helpers/env'

export default function handleHelp(ctx: Context) {
  return ctx.reply(ctx.i18n.t('help', { business: env.BUSINESS_DOMAIN }), {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: ctx.i18n.t('showProducts'),
            callback_data: 'buttonShowProducts',
          },
        ],
      ],
    },
  })
}
