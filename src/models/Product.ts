import {
  getModelForClass,
  modelOptions,
  prop,
  queryMethod,
} from '@typegoose/typegoose'

@queryMethod(findProductById)
@queryMethod(findByName)
@queryMethod(findAllProducts)
@modelOptions({ schemaOptions: { timestamps: true } })
export class Product {
  @prop({ required: true, index: true, unique: true })
  id!: string
  @prop({ required: true })
  name!: string
}

const ProductModel = getModelForClass(Product)

export function findOrCreateProduct(id: string, name: string) {
  return ProductModel.findOneAndUpdate(
    { id },
    { name },
    {
      upsert: true,
      new: true,
    }
  )
}

export function findProductById(id: string) {
  return ProductModel.findOne({ id }) // important to not do an "await" and ".exec"
}

export function findByName(name: string) {
  return ProductModel.find({ name }) // important to not do an "await" and ".exec"
}

export function findAllProducts() {
  return ProductModel.find() // important to not do an "await" and ".exec"
}
