import {
  getModelForClass,
  modelOptions,
  prop,
  queryMethod,
} from '@typegoose/typegoose'

@queryMethod(findUserBySubscribedProduct)
@modelOptions({ schemaOptions: { timestamps: true } })
export class User {
  @prop({ required: true, index: true, unique: true })
  id!: number
  @prop({ required: true, default: 'en' })
  language!: string
  @prop({ required: true, default: [], index: true })
  subscribedProducts!: string[]
  @prop({ default: 86_400 })
  notificationInterval?: number
}

const UserModel = getModelForClass(User)

export function findOrCreateUser(id: number) {
  return UserModel.findOneAndUpdate(
    { id },
    {},
    {
      upsert: true,
      new: true,
    }
  )
}

export function findUserBySubscribedProduct(productId: string) {
  return UserModel.find({ subscribedProducts: productId })
}
