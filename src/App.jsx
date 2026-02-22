import React from 'react'
import { Toaster } from 'react-hot-toast'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './pages/home/Layout'
import DashBoard from './pages/home/DashBoard'
import Leads from './pages/leads/Leads'
import Signin from './pages/auth/Signin'
import ProtectedRoute from './components/ProtectedRoute'
import CallLogs from './pages/calllogs/CallLogs'

const App = () => {
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
        </Route>
        <Route path="/login" element={<Signin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App