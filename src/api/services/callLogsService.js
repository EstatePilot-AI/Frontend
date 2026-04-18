import client from '../client'
import { ENDPOINTS } from '../endpoints'

export const callLogsService = {
  getAllCallLogs: (params = {}) => client.get(ENDPOINTS.CALL_LOGS.GET_ALL, { params }),
  getCallLogById: (callId) => client.get(`${ENDPOINTS.CALL_LOGS.GET_BY_ID}/${callId}`),
  getCallOutcome: () => client.get(ENDPOINTS.CALL_LOGS.GET_CALL_OUTCOME),
  getConversationDataById: (id) => client.get(`${ENDPOINTS.CONVERSATION.GET_DATA_BY_ID}/${id}`),
  getAudioById: (id) => client.get(`${ENDPOINTS.CONVERSATION.GET_AUDIO_BY_ID}/${id}`, { responseType: 'blob' }),
}
