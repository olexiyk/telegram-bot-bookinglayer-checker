import 'reflect-metadata'
// Setup @/ aliases for modules
import 'module-alias/register'
// Config dotenv
import * as dotenv from 'dotenv'
import { DocumentType } from '@typegoose/typegoose'
import { Product, findAllProducts } from '@/models/Product'
import { findUserBySubscribedProduct } from '@/models/User'
import getProductAvailabilities from '@/api/BookingLayer'
import notify from '@/helpers/botNotifier'
import startMongo from '@/helpers/startMongo'

dotenv.config({ path: `${__dirname}/../../.env` })

async function run() {
  console.log('Starting app...')
  // Mongo
  await startMongo()
  console.log('Mongo connected')

  const allProducts: DocumentType<Product>[] = await findAllProducts().exec()

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
    for (const user of allSubscribedUsers) {
      await notify(user, apiProductAvailabilities, product)
    }
  }
}

void run()
