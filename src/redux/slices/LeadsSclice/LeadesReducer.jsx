import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { leadsService } from '../../../api/services/leadsService'
import { getErrorMessage } from '../../../common/utils/errorHandler'

export const fetchLeads = createAsyncThunk(
  'leads/fetchLeads',
  async (_, { rejectWithValue }) => {
    try {
      const response = await leadsService.getAllLeads()
      return response.data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch leads'))
    }
  }
)

const initialState = {
  leads: [],
  loading: false,
  error: null,
}

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload
        const items = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
          ? payload.data
          : []
        state.leads = items
        state.error = null
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = leadsSlice.actions
export default leadsSlice.reducer
