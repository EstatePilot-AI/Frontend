import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/AuthSlice/authReducer'
import callLogsReducer from './slices/CallLogSlice/CallLogsReducer'
import leadsReducer from './slices/LeadsSclice/LeadesReducer'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    callLogs: callLogsReducer,
    leads: leadsReducer,
  },
})
