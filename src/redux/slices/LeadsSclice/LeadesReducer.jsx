import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { leadsService } from '../../../api/services/leadsService'
import { getErrorMessage } from '../../../common/utils/errorHandler'

export const fetchLeads = createAsyncThunk(
  'leads/fetchLeads',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await leadsService.getAllLeads(params)
      return response.data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch leads'))
    }
  }
)

export const fetchStatusList = createAsyncThunk(
  'leads/fetchStatusList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await leadsService.getStatusList()
      return response.data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch status list'))
    }
  }
)

const initialState = {
  leads: [],
  loading: false,
  error: null,
  pagination: {
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  },
  statusList: [],
  statusListLoading: false,
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
        if (payload && typeof payload === 'object' && Array.isArray(payload.data)) {
          state.leads = payload.data
          state.pagination = {
            totalCount: payload.totalCount ?? 0,
            pageNumber: payload.pageNumber ?? 1,
            pageSize: payload.pageSize ?? 10,
            totalPages: payload.totalPages ?? 0,
            hasPreviousPage: payload.hasPreviousPage ?? false,
            hasNextPage: payload.hasNextPage ?? false,
          }
        } else if (Array.isArray(payload)) {
          state.leads = payload
        } else {
          state.leads = []
        }
        state.error = null
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchStatusList.pending, (state) => {
        state.statusListLoading = true
      })
      .addCase(fetchStatusList.fulfilled, (state, action) => {
        state.statusListLoading = false
        state.statusList = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(fetchStatusList.rejected, (state) => {
        state.statusListLoading = false
      })
  },
})

export const { clearError } = leadsSlice.actions
export default leadsSlice.reducer
