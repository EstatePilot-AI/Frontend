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

export const uploadCSVForSellers = createAsyncThunk(
  'dashboard/uploadCSVForSellers',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append('file', file, file.name)
      const response = await dashboardService.uploadCSVForSellers(formData)
      return response.data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to upload CSV'))
    }
  }
)

const initialState = {
  analytics: null,
  loading: false,
  error: null,
  uploading: false,
  uploadSuccess: false,
  uploadData: null,
  uploadError: null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null
      state.uploadError = null
      state.uploadSuccess = false
      state.uploadData = null
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
      .addCase(uploadCSVForSellers.pending, (state) => {
        state.uploading = true
        state.uploadError = null
        state.uploadSuccess = false
      })
      .addCase(uploadCSVForSellers.fulfilled, (state, action) => {
        state.uploading = false
        state.uploadSuccess = true
        state.uploadData = action.payload
        state.uploadError = null
      })
      .addCase(uploadCSVForSellers.rejected, (state, action) => {
        state.uploading = false
        state.uploadError = action.payload
        state.uploadSuccess = false
      })
  },
})

export const { clearDashboardError } = dashboardSlice.actions
export default dashboardSlice.reducer
