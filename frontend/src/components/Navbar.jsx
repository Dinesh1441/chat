// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react'
import { Search, Bell, Menu, Sun, Moon, Users, MessageSquare, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { NavLink, useNavigate } from 'react-router-dom'

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { darkMode, toggleDarkMode } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const notificationRef = useRef(null)
  const searchRef = useRef(null)

  const notifications = [
    { id: 1, message: 'New message from Anonymous', time: '2 min ago', read: false },
    { id: 2, message: 'Someone started a chat with you', time: '1 hour ago', read: false },
    { id: 3, message: 'Your profile was viewed', time: '3 hours ago', read: true },
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setShowSearch(false)
      setSearchQuery('')
    }
  }

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <nav className="glass border-b border-[var(--border-color)] px-2 sm:px-4 md:px-6 py-2 sm:py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between gap-2">
        {/* Left Section */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors touch-manipulation"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-2 flex-1">
            <h2 className="text-sm sm:text-base font-medium truncate">New Chat</h2>
            
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="md:hidden p-1.5 hidden sm:p-2 rounded-lg hover:bg-white/10 transition-colors touch-manipulation ml-auto"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-xs ml-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 rounded-lg px-4 py-1.5 pl-10 text-sm border border-[var(--border-color)] focus:border-accent-purple focus:outline-none transition-colors"
              />
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            </form>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Online Users - Desktop */}
          <button className="hidden sm:flex relative p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors touch-manipulation">
            <Users size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          </button>
          
          {/* Notifications */}
          <div className="relative hidden" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors touch-manipulation"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-accent-pink rounded-full text-[10px] flex items-center justify-center px-1 font-bold animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>
            
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-72 sm:w-80 glass rounded-xl border border-[var(--border-color)] shadow-2xl z-50 max-h-[80vh] overflow-hidden"
                >
                  <div className="p-3 border-b border-[var(--border-color)] flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                      <button className="text-xs text-accent-purple hover:underline">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto overscroll-contain">
                    {notifications.length > 0 ? (
                      notifications.map((notif, index) => (
                        <motion.div
                          key={notif.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-3 hover:bg-white/5 cursor-pointer transition-colors ${
                            !notif.read ? 'bg-accent-purple/5 border-l-2 border-accent-purple' : ''
                          }`}
                        >
                          <p className="text-sm">{notif.message}</p>
                          <p className="text-xs text-[var(--text-secondary)] mt-1">{notif.time}</p>
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-[var(--text-secondary)]">
                        <Bell size={32} className="mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No notifications</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors touch-manipulation"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          {/* Profile */}
          <NavLink 
            to="/profile" 
            className="p-1 rounded-lg hover:bg-white/10 transition-colors touch-manipulation ml-1"
          >
            <img
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=partner'}
              alt={user?.name || 'User'}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full cursor-pointer hover:ring-2 ring-accent-purple transition-all object-cover"
              loading="lazy"
            />
          </NavLink>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            ref={searchRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-2 overflow-hidden"
          >
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search users, chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 rounded-lg px-4 py-2 pl-10 pr-10 text-sm border border-[var(--border-color)] focus:border-accent-purple focus:outline-none transition-colors"
                autoFocus
              />
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10"
                >
                  <X size={14} />
                </button>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar