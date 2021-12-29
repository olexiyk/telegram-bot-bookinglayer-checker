import { DocumentType } from '@typegoose/typegoose'
import { InlineKeyboardButton } from '@grammyjs/types/inline'
import { Product, findAllProducts } from '@/models/Product'
import Context from '@/models/Context'

export default async function showProducts(ctx: Context) {
  const allProducts: DocumentType<Product>[] = await findAllProducts().exec()
  const inlineKeyboard: InlineKeyboardButton[][] = []

  for (const product of allProducts) {
    if (ctx.dbuser.subscribedProducts.includes(product.id)) {
      inlineKeyboard.push([
        {
          text: `✅ ${product.name} - ${ctx.i18n.t('youAreSubscribed')}`,
          callback_data: `subscribe:${product.id}`,
        },
      ])
    } else {
      inlineKeyboard.push([
        {
          text: `🔴 ${product.name}`,
          callback_data: `subscribe:${product.id}`,
        },
      ])
    }
  }
  return ctx.reply(ctx.i18n.t('availableProducts'), {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: inlineKeyboard,
    },
  })
}
