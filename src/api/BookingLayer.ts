import * as mockData from '@/api/mock.json'
import {
  ApiProductAvailabilities,
  JsonProductAvailability,
} from '@/api/ApiProductAvailabilities'
import { addDays, format } from 'date-fns'
import { fetch } from 'grammy/out/shim.node'
import ApiProduct from '@/api/ApiProduct'
import env from '@/helpers/env'

const BASE_API = 'https://api.bookinglayer.io/public'

function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export async function getProductAvailabilities(
  productId: string,
  startDate: Date,
  numberOfDays: number,
  mock = false
) {
  if (mock) {
    return new ApiProductAvailabilities(mockData)
  }
  const endDate = addDays(startDate, numberOfDays)
  const queryUrl = `${BASE_API}/products/${productId}/availabilities?start=${formatDate(
    startDate
  )}&end=${formatDate(endDate)}&business_domain=${env.BUSINESS_DOMAIN}`
  console.log(queryUrl)
  const response = await fetch(queryUrl)
  const data = (await response.json()) as JsonProductAvailability

  return new ApiProductAvailabilities(data)
}

export async function getAllProductIds(): Promise<string[]> {
  const queryUrl = `${BASE_API}/widgets?business_domain=${env.BUSINESS_DOMAIN}`
  console.log(queryUrl)
  const response = await fetch(queryUrl)
  const data = await response.json()

  return data.data
    .filter((widget: { type: string }) => widget.type === 'calendar')[0]
    .products.map((product: { id: string }) => product.id)
}

export async function getProductById(productId: string): Promise<ApiProduct> {
  const queryUrl = `${BASE_API}/products/${productId}?business_domain=${env.BUSINESS_DOMAIN}`
  console.log(queryUrl)
  const response = await fetch(queryUrl)
  const data: {
    data: { id: string; translations: { en: { title: string } } }
  } = await response.json()

  return new ApiProduct(data.data.id, data.data.translations.en.title)
}
