// src/components/Layout.jsx
import React, { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useAuth } from '../context/AuthContext'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, loading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user && location.pathname !== '/') {
      navigate('/login')
    }
  }, [user, loading, navigate, location.pathname])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-purple border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[var(--text-secondary)]">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return children
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)]">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-0 sm:p-2 md:p-6 bg-[var(--bg-primary)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className=" mx-auto"
            >
              {children || <Outlet />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default Layout