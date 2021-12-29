import { findProductById } from '@/models/Product'
import Context from '@/models/Context'

export default async function subscribe(ctx: Context) {
  if (!ctx.callbackQuery?.data) {
    return
  }
  const newProductId: string = ctx.callbackQuery.data.split(':')[1]
  const existingProductIds: string[] = ctx.dbuser.subscribedProducts
  let subscribedProducts: string[]
  let hasSubscribed = false
  if (existingProductIds.includes(newProductId)) {
    subscribedProducts = existingProductIds.filter(
      (productId: string) => productId !== newProductId
    )
  } else {
    hasSubscribed = true
    subscribedProducts = [...new Set([...existingProductIds, newProductId])]
  }
  ctx.dbuser.subscribedProducts = subscribedProducts
  await ctx.dbuser.save()

  const product = await findProductById(newProductId).exec()

  if (!product) {
    return
  }

  return ctx.editMessageText(
    ctx.i18n.t(hasSubscribed ? 'subscribed' : 'unsubscribed', {
      product: product.name,
    }),
    {
      parse_mode: 'HTML',
    }
  )
}
