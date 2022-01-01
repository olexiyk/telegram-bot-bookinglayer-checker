import 'module-alias/register'
import 'reflect-metadata'
import 'source-map-support/register'

import {
  BUTTON_SET_LANGUAGE,
  BUTTON_SET_NOTIFICATION_INTERVAL,
  BUTTON_SHOW_PRODUCTS,
} from '@/helpers/consts'
import { ignoreOld, sequentialize } from 'grammy-middlewares'
import { run } from '@grammyjs/runner'
import attachUser from '@/middlewares/attachUser'
import bot from '@/helpers/bot'
import configureI18n from '@/middlewares/configureI18n'
import handleLanguage from '@/handlers/language'
import handleShowNotificationIntervalMenu, {
  notificationIntervalMenu,
} from '@/handlers/notificationIntervalMenu'
import i18n from '@/helpers/i18n'
import languageMenu from '@/menus/languageMenu'
import sendHelp from '@/handlers/help'
import showProducts from '@/handlers/showProducts'
import startMongo from '@/helpers/startMongo'
import startWebserver from '@/helpers/startWebserver'
import subscribe from '@/handlers/subscribe'

async function runApp() {
  console.log('Starting app...')
  // Mongo
  await startMongo()
  console.log('Mongo connected')
  bot
    // Middlewares
    .use(sequentialize())
    .use(ignoreOld())
    .use(attachUser)
    .use(i18n.middleware())
    .use(configureI18n)
    // Menus
    .use(languageMenu)
    .use(notificationIntervalMenu)
  // Commands
  bot.command(['help', 'start'], sendHelp)
  bot.command('language', handleLanguage)
  bot.command('showProducts', showProducts)
  bot.callbackQuery(BUTTON_SHOW_PRODUCTS, showProducts)
  bot.callbackQuery(BUTTON_SET_LANGUAGE, handleLanguage)
  bot.callbackQuery(
    BUTTON_SET_NOTIFICATION_INTERVAL,
    handleShowNotificationIntervalMenu
  )
  bot.callbackQuery(/^subscribe:/, subscribe)
  // Errors
  bot.catch(console.error)
  // Start bot
  await bot.init()
  run(bot)
  console.info(`Bot ${bot.botInfo.username} is up and running`)
}

void runApp()
void startWebserver()
