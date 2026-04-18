import client from '../client'
import { ENDPOINTS } from '../endpoints'

export const leadsService = {
  getAllLeads: (params = {}) => client.get(ENDPOINTS.LEADS.GET_ALL, { params }),
  getStatusList: () => client.get(ENDPOINTS.LEADS.GET_STATUS_LIST),
}
