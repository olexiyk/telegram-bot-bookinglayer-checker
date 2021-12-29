// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths
import * as mockData from './mock.json'
import { ApiProductAvailabilities } from '@/api/ApiProductAvailabilities'
import { addDays, format } from 'date-fns'
import { fetch } from 'grammy/out/shim.node'
import env from '@/helpers/env'

const BASE_API = 'https://api.bookinglayer.io/public'

function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export default async function getProductAvailabilities(
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
  const data = await response.json()

  return new ApiProductAvailabilities(data)
}
