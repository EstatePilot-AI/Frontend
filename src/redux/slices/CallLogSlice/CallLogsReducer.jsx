import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_BASE_URL

export const fetchCallLogs = createAsyncThunk(
  'callLogs/fetchCallLogs',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState()
      const token = state.auth.token
      
      const response = await axios.get(`${API_BASE_URL}/CallLog/GetAllCallLogs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const fetchCallLogById = createAsyncThunk(
  'callLogs/fetchCallLogById',
  async (callId, { rejectWithValue, getState }) => {
    try {
      const state = getState()
      const token = state.auth.token
      
      const response = await axios.get(`${API_BASE_URL}/CallLog/GetCallLogById/${callId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

const initialState = {
  callLogs: [],
  selectedCallLog: null,
  loading: false,
  detailLoading: false,
  error: null,
  detailError: null,
}

const callLogsSlice = createSlice({
  name: 'callLogs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearDetailError: (state) => {
      state.detailError = null
    },
    clearSelectedCallLog: (state) => {
      state.selectedCallLog = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCallLogs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCallLogs.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload
        const items = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
          ? payload.data
          : []
        state.callLogs = items
        state.error = null
      })
      .addCase(fetchCallLogs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchCallLogById.pending, (state) => {
        state.detailLoading = true
        state.detailError = null
      })
      .addCase(fetchCallLogById.fulfilled, (state, action) => {
        state.detailLoading = false
        state.selectedCallLog = action.payload
        state.detailError = null
      })
      .addCase(fetchCallLogById.rejected, (state, action) => {
        state.detailLoading = false
        state.detailError = action.payload
      })
  },
})

export const { clearError, clearDetailError, clearSelectedCallLog } = callLogsSlice.actions
export default callLogsSlice.reducer
