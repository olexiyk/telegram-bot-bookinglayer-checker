import { Bot } from 'grammy'
import Context from '@/models/Context'
import i18n from '@/helpers/i18n'

export const COMMAND_PRODUCTS = 'products'
export const COMMAND_LANGUAGE = 'language'
export const COMMAND_HELP = 'help'
export const COMMAND_NOTIFICATIONS = 'notifications'

export function initCommandsMenu(bot: Bot<Context>) {
  return bot.api.setMyCommands([
    {
      command: COMMAND_PRODUCTS,
      description: i18n.t('en', 'selectAvailableProducts'),
    },
    {
      command: COMMAND_LANGUAGE,
      description: i18n.t('en', 'languageSelector'),
    },
    {
      command: COMMAND_NOTIFICATIONS,
      description: 'Change notification interval',
    },
    { command: COMMAND_HELP, description: 'Show help text' },
  ])
}
