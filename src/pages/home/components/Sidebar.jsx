import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  FiLayout,
  FiUsers,
  FiBriefcase,
  FiPhone,
  FiSettings,
  FiLogOut,
  FiHome,
  FiCheckSquare,
  FiInbox,
  FiUser,
  FiX,
} from 'react-icons/fi'
import { logout, logoutApi } from '../../../redux/slices/AuthSlice/authReducer'
import Avatar from '../../../components/ui/Avatar'

const NAV_GROUPS = [
  {
    label: 'MAIN',
    items: [
      { icon: FiLayout, label: 'Dashboard', path: '/' },
    ],
  },
  {
    label: 'MANAGEMENT',
    items: [
      { icon: FiUsers, label: 'Agents', path: '/agents' },
      { icon: FiUser, label: 'Leads', path: '/leads' },
      { icon: FiBriefcase, label: 'Deals', path: '/deals' },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { icon: FiInbox, label: 'Requests', path: '/requests' },
      { icon: FiPhone, label: 'Call Logs', path: '/calllogs' },
    ],
  },
  {
    label: 'SETTINGS',
    items: [
      { icon: FiSettings, label: 'Settings', path: '/settings' },
    ],
  },
]

const NavItem = ({ icon, label, isActive, onClick }) => {
  const Icon = icon
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-colors duration-150 ${
        isActive
          ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
          : 'text-[var(--color-text-secondary)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--color-text)]'
      }`}
    >
      <Icon size={18} className={isActive ? '' : 'opacity-60'} />
      <span>{label}</span>
    </button>
  )
}

const SideBar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const token = useSelector((state) => state.auth.token)
  const user = useSelector((state) => state.user.profile)

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const handleNav = (path) => {
    navigate(path)
    onClose()
  }

  const handleLogout = () => {
    dispatch(logout())
    dispatch(logoutApi(token))
    navigate('/login')
  }

  return (
    <>
      <div
        className={`ep-sidebar-overlay ${isOpen ? 'ep-sidebar-overlay-visible' : ''}`}
        onClick={onClose}
      />
      <aside className={`ep-sidebar ${isOpen ? 'ep-sidebar-open' : ''}`}>
        <div className="p-4 border-b border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar name={user?.name || 'User'} size="sm" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--color-text)] truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] truncate">
                  {user?.role || 'Staff'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)]"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-3">
              <div className="px-3 pt-5 pb-1.5">
                <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-[var(--color-text-muted)]">
                  {group.label}
                </span>
              </div>
              {group.items.map((item) => {
                if (item.label === 'Agents' && user?.role?.toLowerCase() === 'agent') {
                  return null
                }
                return (
                  <NavItem
                    key={item.path}
                    icon={item.icon}
                    label={item.label}
                    isActive={isActive(item.path)}
                    onClick={() => handleNav(item.path)}
                  />
                )
              })}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-[var(--color-border)]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-sm font-medium text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)] transition-colors"
          >
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default SideBar
