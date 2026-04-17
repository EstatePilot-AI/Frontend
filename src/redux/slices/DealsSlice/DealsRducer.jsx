import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { dealsService } from '../../../api/services/dealsService'

export const GetAllDeals = createAsyncThunk(
  'deals/getAllDeals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dealsService.getAllDeals()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

const dealsSlice = createSlice({
  name: 'deals',
  initialState: {
    deals: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetAllDeals.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(GetAllDeals.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload
        const items = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : []
        state.deals = items
        state.error = null
      })
      .addCase(GetAllDeals.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default dealsSlice.reducer
