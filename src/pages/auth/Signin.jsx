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
      const customError = error.includes('400') || error.includes('validation') || error.includes('Invalid') ? 'Invalid email or password' : error
      toast.error(customError)
    }
    return () => dispatch(clearError())
  }, [error, dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(login({ email, password }))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-md p-8">

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-600 text-sm">Sign in to your account to continue</p>
        </div>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
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
            leftElement={<MdEmail className="h-5 w-5 text-gray-400 ml-3" />}
            inputClassName="py-3 rounded-lg"
          />

         
          <Input
            id="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            leftElement={<MdLock className="h-5 w-5 text-gray-400 ml-3" />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="pr-3 flex items-center"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible className="h-5 w-5 text-gray-400" />
                ) : (
                  <AiOutlineEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            }
            inputClassName="py-3 rounded-lg"
          />
          {/* <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4  text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Remember me</span>
            </label>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Forgot password?
            </a>
          </div> */}
          <Button
            type="submit"
            disabled={loading}
            fullWidth
            className="py-3 rounded-lg"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        
        <p className="mt-8 text-center text-xs text-gray-500">
          Protected by enterprise-grade security
        </p>
      </div>
    </div>
  )
}

export default Signin