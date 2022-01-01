import * as crypto from 'crypto'
import { ApiProductAvailabilities } from '@/api/ApiProductAvailabilities'
import { Product } from '@/models/Product'
import { User } from '@/models/User'
import {
  createOrUpdateLastNotifiedDate,
  findLastNotification,
} from '@/models/Notification'

export default async function shouldNotify(
  user: User,
  productId: string,
  apiProductAvailabilities: ApiProductAvailabilities
): Promise<boolean> {
  const lastNotification = await findLastNotification(user.id, productId).exec()
  if (!lastNotification) {
    return true
  }

  if (
    hash(apiProductAvailabilities.getFingerprint()) ===
    lastNotification.productAvailabilityHash
  ) {
    console.info(
      `Notification skipped because ${productId} availability has not changed`
    )
    return false
  }

  if (
    user.notificationInterval > 0 &&
    Date.now() - lastNotification.lastNotifiedDate.getTime() >
      user.notificationInterval * 1000
  ) {
    return true
  } else {
    console.info(
      `Notification skipped because user ${user.id} has not been notified recently`
    )
    return false
  }
}

function hash(string: string): string {
  return crypto.createHash('md5').update(string).digest('hex')
}

export async function saveNotification(
  user: User,
  product: Product,
  apiProductAvailabilities: ApiProductAvailabilities
) {
  return await createOrUpdateLastNotifiedDate(
    user.id,
    product.id,
    new Date(),
    hash(apiProductAvailabilities.getFingerprint())
  ).exec()
}
