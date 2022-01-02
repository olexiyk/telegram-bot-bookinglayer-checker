import * as crypto from 'crypto'
import { ApiProductAvailabilities } from '@/api/ApiProductAvailabilities'
import {
  Notification,
  createOrUpdateLastNotifiedDate,
  findLastNotification,
} from '@/models/Notification'
import { Product } from '@/models/Product'
import { User } from '@/models/User'

function wasUserNotifiedRecently(user: User, lastNotification: Notification) {
  return (
    Date.now() - lastNotification.lastNotifiedDate.getTime() <
    user.notificationInterval * 1000
  )
}

export async function shouldNotify(
  user: User,
  productId: string,
  apiProductAvailabilities: ApiProductAvailabilities
): Promise<boolean> {
  const lastNotification: Notification | null = await findLastNotification(
    user.id,
    productId
  ).exec()
  if (lastNotification === null) {
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
  return true
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

export async function getNotifiableUsers(
  allSubscribedUsers: User[],
  productId: string
) {
  const notifiableUsers: User[] = []
  for (const user of allSubscribedUsers) {
    const lastNotification = await findLastNotification(
      user.id,
      productId
    ).exec()
    if (lastNotification === null) {
      notifiableUsers.push(user)
      continue
    }
    if (!wasUserNotifiedRecently(user, lastNotification)) {
      notifiableUsers.push(user)
    }
  }

  return notifiableUsers
}
