import React from 'react'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home/DashBoard'
import Signin from './pages/auth/Signin'

const App = () => {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <Routes>
        <Route path='/' element={<Home />} />
         <Route path='/login' element={<Signin />} />
      </Routes>
    </>
  )
}

export default App