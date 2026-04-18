import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { dealsService } from '../../../api/services/dealsService'

export const GetAllDeals = createAsyncThunk(
  'deals/getAllDeals',
  async (arg = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState().deals
      const params = {
        PageNumber: state.pagination.PageNumber,
        PageSize: state.pagination.PageSize,
        ...(state.filter.DealStatusId && { DealStatusId: state.filter.DealStatusId }),
        ...arg,
      }
      const response = await dealsService.getAllDeals(params)
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
    pagination: {
      PageNumber: 1,
      PageSize: 10,
      totalCount: 0,
    },
    filter: {
      DealStatusId: '',
    },
  },
  reducers: {
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    setDealStatusFilter: (state, action) => {
      state.filter.DealStatusId = action.payload
      state.pagination.PageNumber = 1
    },
    resetFilters: (state) => {
      state.filter.DealStatusId = ''
      state.pagination.PageNumber = 1
    },
  },
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

        // Depending on API response structure, update totalCount
        if (payload && payload.totalCount !== undefined) {
          state.pagination.totalCount = payload.totalCount
        } else if (payload && payload.totalRecords !== undefined) {
          state.pagination.totalCount = payload.totalRecords
        }

        state.error = null
      })
      .addCase(GetAllDeals.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { setPagination, setDealStatusFilter, resetFilters } = dealsSlice.actions

export default dealsSlice.reducer
