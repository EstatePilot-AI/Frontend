import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaBuilding } from 'react-icons/fa6'
import { FiMoon, FiSun, FiMenu, FiSettings, FiLogOut, FiUser } from 'react-icons/fi'
import { logout, logoutApi } from '../../../redux/slices/AuthSlice/authReducer'
import Avatar from '../../../components/ui/Avatar'

const Topbar = ({ theme, onToggleTheme, onMenuToggle }) => {
  const user = useSelector((state) => state.user.profile)
  const token = useSelector((state) => state.auth.token)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false)
  const avatarMenuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(e.target)) {
        setAvatarMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    setAvatarMenuOpen(false)
    dispatch(logout())
    dispatch(logoutApi(token))
    navigate('/login')
  }

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

        <div className="relative ml-2" ref={avatarMenuRef}>
          <button
            onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
            className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-(--color-surface-muted) transition-colors"
          >
            <Avatar name={user?.name || 'User'} size="sm" />
            <span className="text-sm font-medium text-(--color-text) hidden sm:block max-w-24 truncate">
              {user?.name || 'User'}
            </span>
          </button>

          {avatarMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-(--color-surface) border border-(--color-border) rounded-lg shadow-(--shadow-lg) py-1 z-50">
              <button
                onClick={() => { navigate('/settings'); setAvatarMenuOpen(false) }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-(--color-text-secondary) hover:bg-(--color-surface-muted) transition-colors"
              >
                <FiUser size={15} />
                Profile
              </button>
              <button
                onClick={() => { navigate('/settings'); setAvatarMenuOpen(false) }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-(--color-text-secondary) hover:bg-(--color-surface-muted) transition-colors"
              >
                <FiSettings size={15} />
                Settings
              </button>
              <div className="border-t border-(--color-border) my-1" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-(--color-danger) hover:bg-(--color-danger-soft) transition-colors"
              >
                <FiLogOut size={15} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Topbar
