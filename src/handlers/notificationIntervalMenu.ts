import { Menu } from '@grammyjs/menu'
import Context from '@/models/Context'
import notificationIntervalToLocalText from '@/helpers/notificationIntervalToLocalText'
import sendOptions from '@/helpers/sendOptions'

const enabledNotificationIntervals = [28800, 43200, 86400, 172800, 259200]

const setNotificationInterval =
  (notificationInterval: number) => async (ctx: Context) => {
    ctx.dbuser.notificationInterval = notificationInterval
    await ctx.dbuser.save()
    return ctx.editMessageText(
      ctx.i18n.t('notificationIntervalWasUpdated', {
        interval: notificationIntervalToLocalText(
          notificationInterval,
          ctx.i18n
        ),
      }),
      {
        parse_mode: 'HTML',
        reply_markup: undefined,
      }
    )
  }

export const notificationIntervalMenu = new Menu<Context>(
  'notificationIntervalSelector'
)
enabledNotificationIntervals.forEach((interval) => {
  notificationIntervalMenu
    .text(
      (ctx) =>
        (ctx.dbuser.notificationInterval === interval ? '✅ ' : '') +
        ctx.i18n.t(`notificationInterval.${interval}`),
      setNotificationInterval(interval)
    )
    .row()
})

export default function handleShowNotificationIntervalMenu(ctx: Context) {
  return ctx.replyWithLocalization('notificationIntervalSelector', {
    ...sendOptions(ctx),
    reply_markup: notificationIntervalMenu,
  })
}
