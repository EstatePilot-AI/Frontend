import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { dashboardService } from '../../../api/services/dashboardService'
import { getErrorMessage } from '../../../common/utils/errorHandler'

export const fetchGlobalAnalytics = createAsyncThunk(
  'dashboard/fetchGlobalAnalytics',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getGlobalAnalytics(params)
      if (response.status === 204) return null
      return response.data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch analytics'))
    }
  }
)

const initialState = {
  analytics: null,
  loading: false,
  error: null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGlobalAnalytics.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGlobalAnalytics.fulfilled, (state, action) => {
        state.loading = false
        state.analytics = action.payload
        state.error = null
      })
      .addCase(fetchGlobalAnalytics.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearDashboardError } = dashboardSlice.actions
export default dashboardSlice.reducer
