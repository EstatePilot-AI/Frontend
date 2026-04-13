import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { callLogsService } from '../../../api/services/callLogsService'
import { getErrorMessage } from '../../../common/utils/errorHandler'

export const fetchCallLogs = createAsyncThunk(
  'callLogs/fetchCallLogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await callLogsService.getAllCallLogs()
      return response.data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch call logs'))
    }
  }
)

export const fetchCallLogById = createAsyncThunk(
  'callLogs/fetchCallLogById',
  async (callId, { rejectWithValue }) => {
    try {
      const response = await callLogsService.getCallLogById(callId)
      return response.data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch call log details'))
    }
  }
)

export const fetchConversationDataById = createAsyncThunk(
  'callLogs/consversation',
  async (id, { rejectWithValue }) => {
    try {
      const response = await callLogsService.getConversationDataById(id)
      return response.data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch conversation data'))
    }
  }
)

export const fetchAudioById = createAsyncThunk(
  'callLogs/fetchAudio',
  async (id, { rejectWithValue }) => {
    try {
      const response = await callLogsService.getAudioById(id)
      const audioUrl = URL.createObjectURL(response.data)
      return audioUrl
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch conversation audio'))
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
  conversationData: null,
  conversationLoading: false,
  conversationError: null,
  audioUrl: null,
  audioLoading: false,
  audioError: null,
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
      .addCase(fetchConversationDataById.pending, (state) => {
        state.conversationLoading = true
        state.conversationError = null
      })
      .addCase(fetchConversationDataById.fulfilled, (state, action) => {
        state.conversationLoading = false
        state.conversationData = action.payload
      })
      .addCase(fetchConversationDataById.rejected, (state, action) => {
        state.conversationLoading = false
        state.conversationError = action.payload
      })
      .addCase(fetchAudioById.pending, (state) => {
        state.audioLoading = true
        state.audioError = null
      })
      .addCase(fetchAudioById.fulfilled, (state, action) => {
        state.audioLoading = false
        state.audioUrl = action.payload
      })
      .addCase(fetchAudioById.rejected, (state, action) => {
        state.audioLoading = false
        state.audioError = action.payload
      })
  },
})

export const { clearError, clearDetailError, clearSelectedCallLog } = callLogsSlice.actions
export default callLogsSlice.reducer
