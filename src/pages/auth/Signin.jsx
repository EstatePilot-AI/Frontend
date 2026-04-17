import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { MdEmail, MdLock } from 'react-icons/md'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { login, clearError } from '../../redux/slices/AuthSlice/authReducer'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const Signin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

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

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(login({ email, password }))
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
            <span className="text-lg font-bold text-[var(--color-text)]">EstatePilot</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">Welcome back</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Sign in to your account to continue</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-[var(--radius-md)] bg-[var(--color-danger-soft)] border border-[var(--color-danger)] text-[var(--color-danger)] text-sm">
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
            leftElement={<MdEmail className="h-5 w-5 text-[var(--color-text-muted)] ml-3" />}
            inputClassName="py-3"
          />

          <Input
            id="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            leftElement={<MdLock className="h-5 w-5 text-[var(--color-text-muted)] ml-3" />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="pr-3 flex items-center"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible className="h-5 w-5 text-[var(--color-text-muted)]" />
                ) : (
                  <AiOutlineEye className="h-5 w-5 text-[var(--color-text-muted)]" />
                )}
              </button>
            }
            inputClassName="py-3"
          />

          <Button
            type="submit"
            disabled={loading}
            fullWidth
            className="py-3"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-8 text-center text-xs text-[var(--color-text-muted)]">
          Protected by enterprise-grade security
        </p>
      </div>
    </div>
  )
}

export default Signin
