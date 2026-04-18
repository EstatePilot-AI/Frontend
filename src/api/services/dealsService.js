import client from '../client'
import { ENDPOINTS } from '../endpoints'

export const dealsService = {
  getAllDeals: (params) => client.get(ENDPOINTS.DEALS.GET_ALL, { params }),
}
