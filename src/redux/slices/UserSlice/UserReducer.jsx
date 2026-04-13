import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { userService } from '../../../api/services/userService'
import { getErrorMessage } from '../../../common/utils/errorHandler'

export const getUser = createAsyncThunk(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await userService.getUserProfile()
      return {
        id: data?.id ?? '',
        name: data?.name ?? '',
        email: data?.email ?? '',
        phoneNumber: data?.phoneNumber ?? '',
        role: data?.role ?? '',
      }
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to fetch profile')
      return rejectWithValue(message)
    }
  }
)

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const { data } = await userService.changePassword({ currentPassword, newPassword })
      return data
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to change password')
      return rejectWithValue(message)
    }
  }
)

export const forgetPassword = createAsyncThunk(
  'user/forgetPassword',
  async ({ email }, { rejectWithValue }) => {
    try {
      const { data } = await userService.forgetPassword({ email })
      return data
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to send reset email')
      return rejectWithValue(message)
    }
  }
)

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async ({ email, token, newPassword }, { rejectWithValue }) => {
    try {
      const { data } = await userService.resetPassword({ email, token, newPassword })
      return data
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to reset password')
      return rejectWithValue(message)
    }
  }
)

export const createNewUser = createAsyncThunk(
  'user/createNewUser',
  async ({ personName, email, phoneNumber, role, password }, { rejectWithValue }) => {
    try {
      const { data } = await userService.createNewUser({ personName, email, phoneNumber, role, password })
      return data
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to create user')
      return rejectWithValue(message)
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    loading: false,
    error: null,

    changePasswordLoading: false,
    changePasswordError: null,
    changePasswordSuccess: null,

    forgetPasswordLoading: false,
    forgetPasswordError: null,
    forgetPasswordSuccess: null,

    resetPasswordLoading: false,
    resetPasswordError: null,
    resetPasswordSuccess: null,

    
    createUserLoading: false,
    createUserError: null,
    createUserSuccess: null,
  },
  reducers: {
    clearUserError: (state) => {
      state.error = null
    },
    clearUserProfile: (state) => {
      state.profile = null
      state.error = null
      state.loading = false
      state.changePasswordLoading = false
      state.changePasswordError = null
      state.changePasswordSuccess = null
      state.forgetPasswordLoading = false
      state.forgetPasswordError = null
      state.forgetPasswordSuccess = null
      state.resetPasswordLoading = false
      state.resetPasswordError = null
      state.resetPasswordSuccess = null
      state.createUserLoading = false
      state.createUserError = null
      state.createUserSuccess = null
    },
    clearChangePasswordState: (state) => {
      state.changePasswordLoading = false
      state.changePasswordError = null
      state.changePasswordSuccess = null
    },
    clearForgetPasswordState: (state) => {
      state.forgetPasswordLoading = false
      state.forgetPasswordError = null
      state.forgetPasswordSuccess = null
    },
    clearResetPasswordState: (state) => {
      state.resetPasswordLoading = false
      state.resetPasswordError = null
      state.resetPasswordSuccess = null
    },

    clearCreateUserState: (state) => {
      state.createUserLoading = false
      state.createUserError = null
      state.createUserSuccess = null
    },
  },
  extraReducers: (builder) => {
    builder
  
      .addCase(getUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch profile'
      })

  
      .addCase(changePassword.pending, (state) => {
        state.changePasswordLoading = true
        state.changePasswordError = null
        state.changePasswordSuccess = null
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.changePasswordLoading = false
        state.changePasswordSuccess = action.payload?.message || 'Password changed successfully'
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.changePasswordLoading = false
        state.changePasswordError = action.payload || 'Failed to change password'
      })


      .addCase(forgetPassword.pending, (state) => {
        state.forgetPasswordLoading = true
        state.forgetPasswordError = null
        state.forgetPasswordSuccess = null
      })
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.forgetPasswordLoading = false
        state.forgetPasswordSuccess = action.payload?.message || 'Reset email sent successfully'
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.forgetPasswordLoading = false
        state.forgetPasswordError = action.payload || 'Failed to send reset email'
      })


      .addCase(resetPassword.pending, (state) => {
        state.resetPasswordLoading = true
        state.resetPasswordError = null
        state.resetPasswordSuccess = null
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.resetPasswordLoading = false
        state.resetPasswordSuccess = action.payload?.message || 'Password reset successfully'
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPasswordLoading = false
        state.resetPasswordError = action.payload || 'Failed to reset password'
      })


      .addCase(createNewUser.pending, (state) => {
        state.createUserLoading = true
        state.createUserError = null
        state.createUserSuccess = null
      })
      .addCase(createNewUser.fulfilled, (state, action) => {
        state.createUserLoading = false
        state.createUserSuccess = action.payload?.message || 'User created successfully'
      })
      .addCase(createNewUser.rejected, (state, action) => {
        state.createUserLoading = false
        state.createUserError = action.payload || 'Failed to create user'
      })
  },
})

export const {
  clearUserError,
  clearUserProfile,
  clearChangePasswordState,
  clearForgetPasswordState,
  clearResetPasswordState,
  clearCreateUserState, 
} = userSlice.actions

export default userSlice.reducer