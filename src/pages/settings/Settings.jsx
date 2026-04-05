import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiEye, FiEyeOff, FiLock, FiRefreshCw, FiShield } from 'react-icons/fi'
import toast from 'react-hot-toast'
import {
  changePassword,
  clearChangePasswordState,
  clearForgetPasswordState,
  clearResetPasswordState,
  clearCreateUserState,
  forgetPassword,
  getUser,
  resetPassword,
  createNewUser,
} from '../../redux/slices/UserSlice/UserReducer'

const cardBaseClasses =
  'bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6'

const Settings = () => {
  const dispatch = useDispatch()
  const {
    profile,
    loading,
    changePasswordLoading,
    forgetPasswordLoading,
    resetPasswordLoading,
    createUserLoading,
  } = useSelector((state) => state.user)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const [resetEmail, setResetEmail] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [resetNewPassword, setResetNewPassword] = useState('')
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [resetStep, setResetStep] = useState(1)

const [newUserPassword, setNewUserPassword] = useState('')
  const [newUserName, setNewUserName] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserPhone, setNewUserPhone] = useState('')
  const [selectedRole, setSelectedRole] = useState('')

  useEffect(() => {
    dispatch(getUser())
  }, [dispatch])

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error('Please enter current and new password')
      return
    }
    if (currentPassword === newPassword) {
      toast.error('New password must be different')
      return
    }
    try {
      await dispatch(changePassword({ currentPassword, newPassword })).unwrap()
      toast.success('Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
      dispatch(clearChangePasswordState())
    } catch (errorMessage) {
      toast.error(errorMessage || 'Failed to change password')
    }
  }

  const handleForgetPassword = async () => {
    if (!resetEmail) {
      toast.error('Please enter your email')
      return
    }
    try {
      await dispatch(forgetPassword({ email: resetEmail })).unwrap()
      toast.success('Reset token sent! Check your email.')
      dispatch(clearForgetPasswordState())
      setResetStep(2)
    } catch (errorMessage) {
      toast.error(errorMessage || 'Failed to send reset email')
    }
  }

  const handleResetPassword = async () => {
    if (!resetToken || !resetNewPassword) {
      toast.error('Please enter the token and new password')
      return
    }
    try {
      await dispatch(
        resetPassword({ email: resetEmail, token: resetToken, newPassword: resetNewPassword })
      ).unwrap()
      toast.success('Password reset successfully!')
      setResetEmail('')
      setResetToken('')
      setResetNewPassword('')
      setResetStep(1)
      dispatch(clearResetPasswordState())
    } catch (errorMessage) {
      toast.error(errorMessage || 'Failed to reset password')
    }
  }


  const formatPhoneNumber = (phone) => {
    const value = phone.replace(/\D/g, '').trim()
    if (!value) return ''
    if (value.startsWith('+2')) return value
    if (value.startsWith('20')) return `+${value}`
    if (value.startsWith('0')) return `+20${value.slice(1)}`
    if (value.startsWith('1')) return `+20${value}`
    return `+20${value}`
  }

  const handleCreateNewUser = async () => {
    if (!newUserName || !newUserEmail || !newUserPhone || !selectedRole || !newUserPassword) {
      toast.error('Please fill in all fields')
      return
    }
    try {
      await dispatch(
        createNewUser({
          personName: newUserName,
          email: newUserEmail,
          phoneNumber: formatPhoneNumber(newUserPhone),
          role: selectedRole,
          password: newUserPassword
        })
      ).unwrap()
      toast.success('User created successfully!')
      setNewUserName('')
      setNewUserEmail('')
      setNewUserPhone('')
      setSelectedRole('')
      dispatch(clearCreateUserState())
    } catch (errorMessage) {
      toast.error(errorMessage || 'Failed to create user')
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-2 sm:py-4">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-2">
          Manage account security and admin access.
        </p>
      </div>

      {/* Profile Information */}
      <section className={`${cardBaseClasses} mb-5 sm:mb-6`}>
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
            <p className="text-sm text-gray-500">Basic account details overview.</p>
          </div>
          <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1">
            Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Name</p>
            <p className="text-sm sm:text-base font-medium text-gray-900 mt-1">
              {loading ? 'Loading...' : profile?.name || '-'}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Email</p>
            <p className="text-sm sm:text-base font-medium text-gray-900 mt-1">
              {loading ? 'Loading...' : profile?.email || '-'}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Role</p>
            <p className="text-sm sm:text-base font-medium text-gray-900 mt-1">
              {loading ? 'Loading...' : profile?.role || '-'}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Phone Number</p>
            <p className="text-sm sm:text-base font-medium text-gray-900 mt-1">
              {loading ? 'Loading...' : profile?.phoneNumber || '-'}
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
        {/* Change Password */}
        <section className={cardBaseClasses}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FiLock size={18} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
              <p className="text-sm text-gray-500">Update your current password.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <FiLock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-11 py-2.5 text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showCurrentPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
              <div className="relative">
                <FiLock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-11 py-2.5 text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Tip: use at least 8 characters and mix letters, numbers, and symbols.
            </p>
            <button
              type="button"
              onClick={handleChangePassword}
              disabled={changePasswordLoading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {changePasswordLoading ? 'Saving...' : 'Save Password'}
            </button>
          </div>
        </section>  

 
      {profile?.role === 'superadmin' && (
        <section className={`${cardBaseClasses} mt-5 sm:mt-6`}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FiShield size={18} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Admin Access</h2>
              <p className="text-sm text-gray-500">Create a new user and assign their role.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="user@company.com"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-600">+2</span>
                <input
                  type="tel"
                  placeholder="01272237716"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 pl-12 pr-4 py-2.5 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 text-gray-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-white"
              >
                <option value="">Select a role</option>
                <option value="superadmin">Super Admin</option>
                <option value="agent">Agent</option>
              </select>
            </div>
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={handleCreateNewUser}
              disabled={createUserLoading}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {createUserLoading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </section>
      )}

        
      </div>

     
    </div>
  )
}

export default Settings