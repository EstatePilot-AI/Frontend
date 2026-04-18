import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { agentService } from '../../../api/services/agentService'

export const GetAllAgents = createAsyncThunk(
  'agent/getAllAgents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await agentService.getAllAgents()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

const agentSlice = createSlice({
  name: 'agent',
  initialState: {
    agents: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetAllAgents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(GetAllAgents.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload
        const items = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : []

        state.agents = items.filter(
          (u) =>
            u?.role?.toLowerCase() === 'agent' ||
            u?.role?.toLowerCase() === 'sales agent' ||
            u?.userRole?.toLowerCase() === 'agent'
        )

        state.agents = items
        state.error = null
      })
      .addCase(GetAllAgents.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default agentSlice.reducer
