import { getModelForClass, index, modelOptions, prop } from '@typegoose/typegoose'

@index({ userId: 1, productId: 1 }, { unique: true }) // compound index
@modelOptions({ schemaOptions: { timestamps: true } })
export class Notification {
  @prop({ required: true })
  userId!: number
  @prop({ required: true })
  productId!: string
  @prop({ required: true })
  lastNotifiedDate!: Date
}

const NotificationModel = getModelForClass(Notification)

export function createOrUpdateLastNotifiedDate(userId: number, productId: string, date: Date) {
  return NotificationModel.findOneAndUpdate(
    { userId, productId },
    { lastNotifiedDate: date },
    { upsert: true, new: true }
  )
}

export function findLastNotification(userId: number, productId: string) {
  return NotificationModel.findOne({ userId, productId })
}
