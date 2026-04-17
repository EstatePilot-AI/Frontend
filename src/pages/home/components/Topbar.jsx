import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiMoon, FiSun, FiMenu, FiSettings, FiLogOut, FiUser } from 'react-icons/fi'
import { logout, logoutApi } from '../../../redux/slices/AuthSlice/authReducer'
import Avatar from '../../../components/ui/Avatar'

const ROUTE_TITLES = {
  '/': 'Dashboard',
  '/properties': 'Properties',
  '/clients': 'Clients',
  '/leads': 'Leads',
  '/deals': 'Deals',
  '/requests': 'Requests',
  '/calllogs': 'Call Logs',
  '/tasks': 'Tasks',
  '/settings': 'Settings',
}

const getPageTitle = (pathname) => {
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname]
  const match = Object.keys(ROUTE_TITLES)
    .filter((k) => k !== '/')
    .find((k) => pathname.startsWith(k))
  return match ? ROUTE_TITLES[match] : 'EstatePilot'
}

const Topbar = ({ theme, onToggleTheme, onMenuToggle }) => {
  const user = useSelector((state) => state.user.profile)
  const token = useSelector((state) => state.auth.token)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
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

  const pageTitle = getPageTitle(location.pathname)

  return (
    <header className="ep-topbar">
      <button
        onClick={onMenuToggle}
        className="md:hidden w-9 h-9 mr-2 rounded-[var(--radius-md)] flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)] transition-colors"
        aria-label="Open menu"
      >
        <FiMenu size={20} />
      </button>

      <h1 className="text-base font-semibold text-[var(--color-text)]">{pageTitle}</h1>

      <div className="flex items-center gap-1 ml-auto">
        <button
          onClick={onToggleTheme}
          className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)] transition-colors"
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        <div className="relative ml-2" ref={avatarMenuRef}>
          <button
            onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
            className="flex items-center gap-2 py-1 px-2 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-muted)] transition-colors"
          >
            <Avatar name={user?.name || 'User'} size="sm" />
            <span className="text-sm font-medium text-[var(--color-text)] hidden sm:block max-w-24 truncate">
              {user?.name || 'User'}
            </span>
          </button>

          {avatarMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] py-1 z-50">
              <button
                onClick={() => { navigate('/settings'); setAvatarMenuOpen(false) }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors"
              >
                <FiUser size={15} />
                Profile
              </button>
              <button
                onClick={() => { navigate('/settings'); setAvatarMenuOpen(false) }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors"
              >
                <FiSettings size={15} />
                Settings
              </button>
              <div className="border-t border-[var(--color-border)] my-1" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)] transition-colors"
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
