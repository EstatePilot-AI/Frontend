import client from '../client'
import { ENDPOINTS } from '../endpoints'

export const dashboardService = {
  getGlobalAnalytics: (params = {}) => client.get(ENDPOINTS.DASHBOARD.GET_GLOBAL_ANALYTICS, { params }),
  uploadCSVForSellers: (formData) => client.post(ENDPOINTS.DASHBOARD.UPLOAD_CSV_FOR_SELLERS, formData),
}
