import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from './components/Sidebar'
import Topbar from './components/Topbar'

const Layout = ({ theme, onToggleTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="ep-layout">
      <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="ep-main-area">
        <Topbar
          theme={theme}
          onToggleTheme={onToggleTheme}
          onMenuToggle={() => setSidebarOpen(true)}
        />
        <div className="ep-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout
