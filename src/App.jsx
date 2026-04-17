import React, { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiMoon, FiSun } from 'react-icons/fi'
import Layout from './pages/home/Layout'
import DashBoard from './pages/home/DashBoard'
import Leads from './pages/leads/Leads'
import Deals from './pages/deals/Deals'
import Signin from './pages/auth/Signin'
import ProtectedRoute from './components/ProtectedRoute'
import CallLogs from './pages/calllogs/CallLogs'
import Settings from './pages/settings/Settings'
import { getUser } from './redux/slices/UserSlice/UserReducer'
import { logout } from './redux/slices/AuthSlice/authReducer'
import ConversationDetails from './pages/calllogs/ConversationDetails'

const THEME_STORAGE_KEY = 'estatepilot-theme'

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light'
  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
  return savedTheme === 'dark' ? 'dark' : 'light'
}

const App = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    if (token) {
      dispatch(getUser()).unwrap().catch(() => {
        dispatch(logout())
        navigate('/login')
      })
    } else {
      navigate('/login')
    }
  }, [token, dispatch, navigate])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.style.colorScheme = theme
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <>
      <button
        type="button"
        onClick={toggleTheme}
        className="ep-theme-toggle fixed top-4 right-4 z-1000 flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-(--color-primary-soft)"
        aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
        <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
      </button>

      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashBoard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="deals" element={<Deals />} />
          <Route path="calllogs" element={<CallLogs />} />
          <Route path="settings" element={<Settings />} />
          <Route path="conversation/:id" element={<ConversationDetails />} />
        </Route>
        <Route path="/login" element={<Signin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App