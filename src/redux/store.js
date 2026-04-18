import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/AuthSlice/authReducer'
import callLogsReducer from './slices/CallLogSlice/CallLogsReducer'
import leadsReducer from './slices/LeadsSclice/LeadesReducer'
import userReducer from './slices/UserSlice/UserReducer'
import dealsReducer from './slices/DealsSlice/DealsRducer'
import dashboardReducer from './slices/DashboardSlice/dashboardReducer'
import agentReducer from './slices/AgentSlice/AgentReducer'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    callLogs: callLogsReducer,
    leads: leadsReducer,
    user: userReducer,
    deals: dealsReducer,
    dashboard: dashboardReducer,
    agent: agentReducer,
  },
})
