// src/components/Sidebar.jsx
import React, { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, 
  Users, 
  User, 
  Settings, 
  LogOut,
  Home,
  Zap,
  ChevronLeft,
  ChevronRight,
  Flame,
  Menu,
  X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth()
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobile, setIsMobile] = useState(false)
  const sidebarRef = useRef(null)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      // Don't auto-close on resize, let the user control it
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        // Check if click is on the overlay or outside
        const overlay = document.querySelector('.sidebar-overlay')
        if (overlay && overlay.contains(event.target)) {
          setIsOpen(false)
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobile, isOpen, setIsOpen])

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      setIsOpen(false)
    }
  }, [location.pathname, isMobile])

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobile, isOpen])

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/chat', icon: MessageSquare, label: 'Chat', badge: 3 },
    { path: '/users', icon: Users, label: 'Users' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="sidebar-overlay fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        ref={sidebarRef}
        initial={false}
        animate={{ 
          x: isMobile ? (isOpen ? 0 : '-100%') : 0,
          width: isMobile ? 280 : (isOpen ? 280 : 80)
        }}
        transition={{ 
          type: 'spring', 
          stiffness: 300, 
          damping: 30 
        }}
        className={`fixed lg:relative h-full glass border-r border-[var(--border-color)] z-50 flex flex-col shadow-2xl lg:shadow-none ${
          isMobile ? 'top-0 left-0' : ''
        }`}
        style={{ 
          width: isMobile ? 280 : (isOpen ? 280 : 80),
          minWidth: isMobile ? 280 : (isOpen ? 280 : 80),
          maxWidth: 280,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-[var(--border-color)] min-h-[60px]">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <Flame className="w-7 h-7 sm:w-8 sm:h-8 text-accent-purple" />
                <span className="text-lg sm:text-xl font-bold text-gradient">AnonChat</span>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mx-auto"
              >
                <Flame className="w-7 h-7 sm:w-8 sm:h-8 text-accent-purple" />
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors touch-manipulation"
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isMobile ? (
              <X size={20} />
            ) : (
              isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />
            )}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4 sm:py-6 overflow-y-auto overscroll-contain">
          <nav className="space-y-1 px-2 sm:px-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 sm:py-2 rounded-lg transition-all duration-200 touch-manipulation ${
                      isActive
                        ? 'bg-gradient-to-r from-accent-purple/20 to-accent-pink/20 text-accent-purple neon-glow'
                        : 'hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`
                  }
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {isOpen && (
                    <>
                      <span className="flex-1 text-sm truncate">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs bg-accent-pink rounded-full animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Footer */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-3 sm:p-4 border-t border-[var(--border-color)]"
          >
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <img
                src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=partner'}
                alt={user?.name || 'User'}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-[var(--text-secondary)] truncate">
                  {user?.isAnonymous ? 'Anonymous' : 'Online'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/20 text-red-500 w-full transition-colors touch-manipulation text-sm"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </motion.div>
        )}

        {/* Collapsed Footer */}
        {!isOpen && !isMobile && (
          <div className="p-3 border-t border-[var(--border-color)]">
            <img
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=partner'}
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-full mx-auto object-cover cursor-pointer"
              onClick={() => navigate('/profile')}
              loading="lazy"
            />
          </div>
        )}
      </motion.aside>
    </>
  )
}

export default Sidebar