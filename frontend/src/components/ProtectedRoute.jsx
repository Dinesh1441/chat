// src/components/ProtectedRoute.jsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from './Layout'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    
    return <Navigate to="/login" replace />
  }

  console.log('User authenticated')
  return <Layout>{children}</Layout>
}

export default ProtectedRoute