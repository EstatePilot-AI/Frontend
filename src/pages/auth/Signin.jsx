import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { MdEmail, MdLock } from 'react-icons/md'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { login, clearError } from '../../redux/slices/AuthSlice/authReducer'
import {
  forgetPassword,
  resetPassword,
  clearForgetPasswordState,
  clearResetPasswordState,
} from '../../redux/slices/UserSlice/UserReducer'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const Signin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth)
  const {
    forgetPasswordLoading,
    forgetPasswordError,
    forgetPasswordSuccess,
    resetPasswordLoading,
    resetPasswordError,
    resetPasswordSuccess,
  } = useSelector((state) => state.user)

  const [view, setView] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [forgotEmail, setForgotEmail] = useState('')

  const [resetEmail, setResetEmail] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Welcome back! Login successful.')
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (error) {
      const customError =
        error.includes('400') || error.includes('validation') || error.includes('Invalid')
          ? 'Invalid email or password'
          : error
      toast.error(customError)
    }
    return () => dispatch(clearError())
  }, [error, dispatch])

  useEffect(() => {
    if (forgetPasswordSuccess) {
      toast.success('Reset email sent! Check your inbox for the token.')
      setResetEmail(forgotEmail)
      setForgotEmail('')
      dispatch(clearForgetPasswordState())
      setView('reset')
    }
  }, [forgetPasswordSuccess, forgotEmail, dispatch])

  useEffect(() => {
    if (forgetPasswordError) {
      toast.error(forgetPasswordError)
      dispatch(clearForgetPasswordState())
    }
  }, [forgetPasswordError, dispatch])

  useEffect(() => {
    if (resetPasswordSuccess) {
      toast.success('Password reset successfully! Please sign in.')
      setResetToken('')
      setNewPassword('')
      setResetEmail('')
      dispatch(clearResetPasswordState())
      setView('login')
    }
  }, [resetPasswordSuccess, dispatch])

  useEffect(() => {
    if (resetPasswordError) {
      toast.error(resetPasswordError)
      dispatch(clearResetPasswordState())
    }
  }, [resetPasswordError, dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(login({ email, password }))
  }

  const handleForgotSubmit = (e) => {
    e.preventDefault()
    dispatch(forgetPassword({ email: forgotEmail }))
  }

  const handleResetSubmit = (e) => {
    e.preventDefault()
    dispatch(resetPassword({ email: resetEmail, token: resetToken, newPassword }))
  }

  const handleBackToLogin = () => {
    setView('login')
    setForgotEmail('')
    setResetEmail('')
    setResetToken('')
    setNewPassword('')
    dispatch(clearForgetPasswordState())
    dispatch(clearResetPasswordState())
  }

  const headings = {
    login: { title: 'Welcome back', sub: 'Sign in to your account to continue' },
    forgot: { title: 'Forgot password?', sub: "Enter your email and we'll send you a reset link." },
    reset: {
      title: 'Reset password',
      sub: 'Enter the token from your email and your new password.',
    },
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[var(--color-primary)] opacity-5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-[var(--color-accent)] opacity-5 blur-3xl" />
      </div>

      <div className="relative bg-[var(--color-surface)] rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] border border-[var(--color-border)] w-full max-w-md p-8">
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--color-primary)] flex items-center justify-center">
              <span className="text-white text-sm font-bold">E</span>
            </div>
            <span className="text-lg font-bold text-(--color-text)">EstatePilot</span>
          </div>
          <h1 className="text-2xl font-bold text-(--color-text) mb-2">{headings[view].title}</h1>
          <p className="text-sm text-(--color-text-muted)">{headings[view].sub}</p>
        </div>

        {view === 'login' && (
          <>
            {error && (
              <div className="mb-4 p-3 rounded-md bg-(--color-danger-soft) border border-(--color-danger) text-(--color-danger) text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                id="email"
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                leftElement={<MdEmail className="h-5 w-5 text-(--color-text-muted) ml-3" />}
                inputClassName="py-3"
              />
              <div className="space-y-1">
                <Input
                  id="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  leftElement={<MdLock className="h-5 w-5 text-(--color-text-muted) ml-3" />}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible className="h-5 w-5 text-(--color-text-muted)" />
                      ) : (
                        <AiOutlineEye className="h-5 w-5 text-(--color-text-muted)" />
                      )}
                    </button>
                  }
                  inputClassName="py-3"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setView('forgot')}
                    className="text-xs text-(--color-primary) hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={loading} fullWidth className="py-3">
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </>
        )}

        {view === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-5">
            <Input
              id="forgot-email"
              label="Email address"
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="you@company.com"
              required
              leftElement={<MdEmail className="h-5 w-5 text-(--color-text-muted) ml-3" />}
              inputClassName="py-3"
            />
            <Button type="submit" disabled={forgetPasswordLoading} fullWidth className="py-3">
              {forgetPasswordLoading ? 'Sending...' : 'Send reset link'}
            </Button>
            <button
              type="button"
              onClick={handleBackToLogin}
              className="w-full text-center text-sm text-(--color-primary) hover:underline"
            >
              Back to sign in
            </button>
          </form>
        )}

        {view === 'reset' && (
          <form onSubmit={handleResetSubmit} className="space-y-5">
            <Input
              id="reset-email"
              label="Email address"
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="you@company.com"
              required
              leftElement={<MdEmail className="h-5 w-5 text-(--color-text-muted) ml-3" />}
              inputClassName="py-3"
            />
            <Input
              id="reset-token"
              label="Reset token"
              type="text"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              placeholder="Paste the token from your email"
              required
              inputClassName="py-3"
            />
            <Input
              id="new-password"
              label="New password"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              required
              leftElement={<MdLock className="h-5 w-5 text-(--color-text-muted) ml-3" />}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="pr-3 flex items-center"
                >
                  {showNewPassword ? (
                    <AiOutlineEyeInvisible className="h-5 w-5 text-(--color-text-muted)" />
                  ) : (
                    <AiOutlineEye className="h-5 w-5 text-(--color-text-muted)" />
                  )}
                </button>
              }
              inputClassName="py-3"
            />
            <Button type="submit" disabled={resetPasswordLoading} fullWidth className="py-3">
              {resetPasswordLoading ? 'Resetting...' : 'Reset password'}
            </Button>
            <button
              type="button"
              onClick={handleBackToLogin}
              className="w-full text-center text-sm text-(--color-primary) hover:underline"
            >
              Back to sign in
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-xs text-(--color-text-muted)">
          Protected by enterprise-grade security
        </p>
      </div>
    </div>
  )
}

export default Signin
