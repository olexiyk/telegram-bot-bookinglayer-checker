import * as express from 'express'
import env from '@/helpers/env'
import notifyAllSubscribedUsers from '@/logic/botNotifier'

export default function startWebserver() {
  const app = express()

  app.get('/notify', async (req, res) => {
    console.log('/notify was called')
    await notifyAllSubscribedUsers()
    res.send('ok')
  })

  app.listen(env.PORT, () => {
    console.log(`Bot is listening on port 3000!`)
  })
}
