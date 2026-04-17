import React, { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Layout from './pages/home/Layout'
import DashBoard from './pages/home/DashBoard'
import Leads from './pages/leads/Leads'
import Deals from './pages/deals/Deals'
import Signin from './pages/auth/Signin'
import ProtectedRoute from './components/ProtectedRoute'
import CallLogs from './pages/calllogs/CallLogs'
import Settings from './pages/settings/Settings'
import Properties from './pages/properties/Properties'
import Clients from './pages/clients/Clients'
import Requests from './pages/requests/Requests'
import Tasks from './pages/tasks/Tasks'
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
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
          },
        }}
      />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout theme={theme} onToggleTheme={toggleTheme} />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashBoard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="deals" element={<Deals />} />
          <Route path="calllogs" element={<CallLogs />} />
          <Route path="settings" element={<Settings />} />
          <Route path="conversation/:id" element={<ConversationDetails />} />
          <Route path="properties" element={<Properties />} />
          <Route path="clients" element={<Clients />} />
          <Route path="requests" element={<Requests />} />
          <Route path="tasks" element={<Tasks />} />
        </Route>
        <Route path="/login" element={<Signin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
