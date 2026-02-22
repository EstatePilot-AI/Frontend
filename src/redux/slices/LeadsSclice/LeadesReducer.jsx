import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_BASE_URL

export const fetchLeads = createAsyncThunk(
  'leads/fetchLeads',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState()
      const token = state.auth.token
      
      const response = await axios.get(`${API_BASE_URL}/LeadRequest/GetAllLeads`, {
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
        state.leads = action.payload
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
