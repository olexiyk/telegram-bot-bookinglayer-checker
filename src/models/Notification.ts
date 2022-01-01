import {
  getModelForClass,
  index,
  modelOptions,
  prop,
} from '@typegoose/typegoose'

@index({ userId: 1, productId: 1 }, { unique: true }) // compound index
@modelOptions({ schemaOptions: { timestamps: true } })
export class Notification {
  @prop({ required: true })
  userId!: number
  @prop({ required: true })
  productId!: string
  @prop({ required: true })
  lastNotifiedDate!: Date
  @prop({ required: true, default: 0 })
  productAvailabilityHash!: number
}

const NotificationModel = getModelForClass(Notification)

export function createOrUpdateLastNotifiedDate(
  userId: number,
  productId: string,
  lastNotifiedDate: Date,
  productAvailabilityHash: number
) {
  return NotificationModel.findOneAndUpdate(
    { userId, productId },
    { lastNotifiedDate, productAvailabilityHash },
    { upsert: true, new: true }
  )
}

export function findLastNotification(userId: number, productId: string) {
  return NotificationModel.findOne({ userId, productId })
}
