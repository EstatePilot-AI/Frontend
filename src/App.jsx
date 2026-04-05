import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Layout from './pages/home/Layout'
import DashBoard from './pages/home/DashBoard'
import Leads from './pages/leads/Leads'
import Signin from './pages/auth/Signin'
import ProtectedRoute from './components/ProtectedRoute'
import CallLogs from './pages/calllogs/CallLogs'
import Settings from './pages/settings/Settings'
import { getUser } from './redux/slices/UserSlice/UserReducer'
import { logout } from './redux/slices/AuthSlice/authReducer'

const App = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)

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

  return (
    <>
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
          <Route path="calllogs" element={<CallLogs />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/login" element={<Signin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App