import 'module-alias/register'
import 'reflect-metadata'
import 'source-map-support/register'

import { DocumentType } from '@typegoose/typegoose'
import { Product, findAllProducts } from '@/models/Product'
import { findUserBySubscribedProduct } from '@/models/User'
import { getProductAvailabilities } from '@/api/BookingLayer'
import notify from '@/helpers/botNotifier'
import startMongo from '@/helpers/startMongo'

async function run() {
  console.log('Starting app...')
  // Mongo
  await startMongo()
  console.log('Mongo connected')

  const allProducts: DocumentType<Product>[] = await findAllProducts().exec()
  console.log(`Found ${allProducts.length} products`)

  for (const product of allProducts) {
    const apiProductAvailabilities = await getProductAvailabilities(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      product.id,
      new Date(),
      14,
      // mock data
      true
    )
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const allSubscribedUsers = await findUserBySubscribedProduct(product.id)
    console.log('The number of subscribed users:', allSubscribedUsers.length)
    for (const user of allSubscribedUsers) {
      await notify(user, apiProductAvailabilities, product)
    }
  }
  console.log('Done')
  process.exit(0)
}

void run()
