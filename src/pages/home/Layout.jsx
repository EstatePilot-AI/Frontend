import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from './components/Sidebar'

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar />
      <main className="flex-1 p-4 sm:p-6 overflow-auto min-w-0">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
