import 'module-alias/register'
import 'reflect-metadata'
import 'source-map-support/register'

import { findOrCreateProduct } from '@/models/Product'
import { getAllProductIds, getProductById } from '@/api/BookingLayer'
import startMongo from '@/helpers/startMongo'

async function run() {
  console.log('Starting app...')
  // Mongo
  await startMongo()
  console.log('Mongo connected')

  const allProductIds = await getAllProductIds()

  for (const productId of allProductIds) {
    const apiProduct = await getProductById(productId)
    await findOrCreateProduct(apiProduct.id, apiProduct.name)
  }
  console.log(`Updated/created ${allProductIds.length} products`)
  console.log('Done')
  process.exit(0)
}

void run()
