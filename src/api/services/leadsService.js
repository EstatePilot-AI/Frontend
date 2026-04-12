import client from '../client'
import { ENDPOINTS } from '../endpoints'

export const leadsService = {
  getAllLeads: () => client.get(ENDPOINTS.LEADS.GET_ALL),
}
