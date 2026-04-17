import client from '../client'
import { ENDPOINTS } from '../endpoints'

export const dashboardService = {
  getGlobalAnalytics: (params = {}) => client.get(ENDPOINTS.DASHBOARD.GET_GLOBAL_ANALYTICS, { params }),
}
