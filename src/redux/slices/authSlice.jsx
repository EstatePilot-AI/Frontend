import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/Account/Login`, {
        email,
        password,
      })
      return data
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Login failed'
      return rejectWithValue(message)
    }
  }
)

export const logoutApi = createAsyncThunk(
  'auth/logout',
  async (token, { getState }) => {
    const authToken = token ?? getState().auth.token
    if (!authToken) return
    try {
      await axios.post(`${BASE_URL}/Account/Logout`, null, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
    } catch {
     
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.user = action.payload?.user ?? action.payload
        state.token = action.payload?.token ?? action.payload?.accessToken ?? null
        state.isAuthenticated = !!state.token
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Login failed'
      })
      .addCase(logoutApi.pending, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = null
      })
      .addCase(logoutApi.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = null
      })
      .addCase(logoutApi.rejected, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = null
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
