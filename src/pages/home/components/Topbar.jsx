import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaBuilding } from 'react-icons/fa6'
import { FiMoon, FiSun, FiMenu } from 'react-icons/fi'

const Topbar = ({ theme, onToggleTheme, onMenuToggle }) => {
  const navigate = useNavigate()

  return (
    <header className="ep-topbar">
      <button
        onClick={onMenuToggle}
        className="md:hidden w-9 h-9 mr-2 rounded-md flex items-center justify-center text-(--color-text-muted) hover:bg-(--color-surface-muted) hover:text-(--color-text) transition-colors"
        aria-label="Open menu"
      >
        <FiMenu size={20} />
      </button>

      <button
        type="button"
        onClick={() => navigate('/')}
        className="ep-brand-logo ep-topbar-logo"
        aria-label="Go to dashboard"
      >
        <FaBuilding className="ep-brand-logo-icon" aria-hidden="true" />
        <span className="ep-brand-logo-text">
          <span className="ep-brand-logo-serif">Estate</span>
          <span className="ep-brand-logo-sans">Pilot</span>
        </span>
      </button>

      <div className="flex items-center gap-1 ml-auto">
        <button
          onClick={onToggleTheme}
          className="w-9 h-9 rounded-md flex items-center justify-center text-(--color-text-muted) hover:bg-(--color-surface-muted) hover:text-(--color-text) transition-colors"
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
      </div>
    </header>
  )
}

export default Topbar
