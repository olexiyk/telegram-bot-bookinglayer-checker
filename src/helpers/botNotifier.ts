import { ApiProductAvailabilities } from '@/api/ApiProductAvailabilities'
import { User } from '@/models/User'
import bot from '@/helpers/bot'

export default async function notify(
  user: User,
  apiProductAvailabilities: ApiProductAvailabilities
) {
  // Start bot
  await bot.init()

  await bot.api.sendMessage(user.id, apiProductAvailabilities.firstAvailable)
}
