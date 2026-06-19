// src/App.jsx
import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ChatProvider } from './context/ChatContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import { SocketProvider } from './context/SocketContext'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
         <ChatProvider>
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/chat/:chatId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          </Routes>
        </ChatProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App