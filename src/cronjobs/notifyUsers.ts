import 'module-alias/register'
import 'reflect-metadata'
import 'source-map-support/register'
import notifyAllSubscribedUsers from '@/logic/botNotifier'
import startMongo from '@/helpers/startMongo'

async function run() {
  console.log('Starting app...')
  // Mongo
  await startMongo()
  console.log('Mongo connected')
  await notifyAllSubscribedUsers()
  console.log('Done')
  process.exit(0)
}

void run()
