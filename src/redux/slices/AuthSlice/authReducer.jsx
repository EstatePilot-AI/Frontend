import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL

const AUTH_TOKEN_KEY = 'authToken'
const AUTH_USER_KEY = 'authUser'

const getStoredAuth = () => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    const userStr = localStorage.getItem(AUTH_USER_KEY)
    const user = userStr ? JSON.parse(userStr) : null
    return { token, user, isAuthenticated: !!token }
  } catch {
    return { token: null, user: null, isAuthenticated: false }
  }
}

export const saveAuthToStorage = (token, user) => {
  if (token) localStorage.setItem(AUTH_TOKEN_KEY, token)
  if (user != null) localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export const clearAuthFromStorage = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}

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

const stored = getStoredAuth()

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: stored.user,
    token: stored.token,
    isAuthenticated: stored.isAuthenticated,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      try {
        localStorage.removeItem(AUTH_TOKEN_KEY)
        localStorage.removeItem(AUTH_USER_KEY)
      } catch {}
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
        if (state.token) {
          try {
            localStorage.setItem(AUTH_TOKEN_KEY, state.token)
            if (state.user != null) {
              localStorage.setItem(AUTH_USER_KEY, JSON.stringify(state.user))
            }
          } catch {}
        }
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
        try {
          localStorage.removeItem(AUTH_TOKEN_KEY)
          localStorage.removeItem(AUTH_USER_KEY)
        } catch {}
      })
      .addCase(logoutApi.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = null
        try {
          localStorage.removeItem(AUTH_TOKEN_KEY)
          localStorage.removeItem(AUTH_USER_KEY)
        } catch {}
      })
      .addCase(logoutApi.rejected, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = null
        try {
          localStorage.removeItem(AUTH_TOKEN_KEY)
          localStorage.removeItem(AUTH_USER_KEY)
        } catch {}
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
