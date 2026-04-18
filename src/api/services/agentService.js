import client from '../client'
import { ENDPOINTS } from '../endpoints'

export const agentService = {
  getAllAgents: () => client.get(ENDPOINTS.AGENT.GET_ALL),
}
