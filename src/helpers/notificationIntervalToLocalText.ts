import { I18nContext } from '@grammyjs/i18n'

export default (interval: number, i18n: I18nContext): string =>
  i18n.t(`notificationInterval.${interval}`)
