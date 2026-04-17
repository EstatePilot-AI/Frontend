import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiEye, FiEyeOff, FiLock, FiShield } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import Skeleton from '../../components/ui/Skeleton'
import {
  changePassword,
  clearChangePasswordState,
  clearCreateUserState,
  getUser,
  createNewUser,
} from '../../redux/slices/UserSlice/UserReducer'

const Settings = () => {
  const dispatch = useDispatch()
  const { profile, loading, changePasswordLoading, createUserLoading } = useSelector(
    (state) => state.user
  )

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

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
          password: newUserPassword,
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
    <>
      <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Settings</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Manage account security and admin access.
          </p>
        </div>

        <section className="mb-6">
          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="text-base font-semibold text-[var(--color-text)]">Profile Information</h2>
                <p className="text-sm text-[var(--color-text-muted)]">Basic account details</p>
              </div>
              <span className="inline-flex items-center rounded-[var(--radius-full)] bg-[var(--color-success-soft)] text-[var(--color-success)] text-xs font-medium px-3 py-1">
                Active
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ProfileField label="Name" value={profile?.name} />
                <ProfileField label="Email" value={profile?.email} />
                <ProfileField label="Role" value={profile?.role} />
                <ProfileField label="Phone" value={profile?.phoneNumber} />
              </div>
            )}
          </Card>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card className="p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center">
                <FiLock size={18} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[var(--color-text)]">Change Password</h2>
                <p className="text-sm text-[var(--color-text-muted)]">Update your current password</p>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                id="currentPassword"
                label="Current Password"
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                leftElement={<FiLock size={16} className="text-[var(--color-text-muted)] ml-3" />}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    className="pr-3 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  >
                    {showCurrentPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                }
              />
              <Input
                id="newPassword"
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                leftElement={<FiLock size={16} className="text-[var(--color-text-muted)] ml-3" />}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="pr-3 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  >
                    {showNewPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                }
              />
              <p className="text-xs text-[var(--color-text-muted)]">
                Use at least 8 characters with a mix of letters, numbers, and symbols.
              </p>
              <Button
                type="button"
                onClick={handleChangePassword}
                disabled={changePasswordLoading}
              >
                {changePasswordLoading ? 'Saving...' : 'Save Password'}
              </Button>
            </div>
          </Card>

          {profile?.role === 'superadmin' && (
            <Card className="p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center">
                  <FiShield size={18} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[var(--color-text)]">Admin Access</h2>
                  <p className="text-sm text-[var(--color-text-muted)]">Create a new user and assign role</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="newUserName"
                  label="Full Name"
                  type="text"
                  placeholder="Name"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  inputClassName="px-4"
                />
                <Input
                  id="newUserEmail"
                  label="Email"
                  type="email"
                  placeholder="user@company.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  inputClassName="px-4"
                />
                <Input
                  id="newUserPhone"
                  label="Phone Number"
                  type="tel"
                  placeholder="01272237716"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  leftElement={<span className="text-[var(--color-text-secondary)] pl-4">+2</span>}
                  leftPaddingClass="pl-12"
                />
                <Input
                  id="newUserPassword"
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  inputClassName="px-4"
                />
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                    Role
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-ring)]"
                  >
                    <option value="">Select a role</option>
                    <option value="superadmin">Super Admin</option>
                    <option value="agent">Agent</option>
                  </select>
                </div>
              </div>

              <div className="mt-5">
                <Button
                  type="button"
                  onClick={handleCreateNewUser}
                  disabled={createUserLoading}
                >
                  {createUserLoading ? 'Creating...' : 'Create User'}
                </Button>
              </div>
            </Card>
          )}
        </div>
    </>
  )
}

const ProfileField = ({ label, value }) => (
  <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-3">
    <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">{label}</p>
    <p className="text-sm font-medium text-[var(--color-text)] mt-1">{value || '—'}</p>
  </div>
)

export default Settings
