import React from 'react'
import { Toaster } from 'react-hot-toast'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/home/DashBoard'
import Signin from './pages/auth/Signin'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Signin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App