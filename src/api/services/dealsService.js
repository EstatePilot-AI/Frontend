import client from '../client'
import { ENDPOINTS } from '../endpoints'

export const dealsService = {
  getAllDeals: () => client.get(ENDPOINTS.DEALS.GET_ALL),
}
