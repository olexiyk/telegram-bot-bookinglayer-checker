import { Product } from '@/models/Product'
import { User } from '@/models/User'
import {
  createOrUpdateLastNotifiedDate,
  findLastNotification,
} from '@/models/Notification'

export default async function shouldNotify(
  user: User,
  productId: string
): Promise<boolean> {
  const lastNotification = await findLastNotification(user.id, productId).exec()
  if (!lastNotification || !user.notificationInterval) {
    return true
  }

  return (
    user.notificationInterval > 0 &&
    Date.now() - lastNotification.lastNotifiedDate.getTime() >
      user.notificationInterval * 1000
  )
}

export async function saveNotification(user: User, product: Product) {
  return await createOrUpdateLastNotifiedDate(
    user.id,
    product.id,
    new Date()
  ).exec()
}
