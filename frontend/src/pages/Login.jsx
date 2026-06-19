// src/pages/Login.jsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Mail, Lock, Eye, EyeOff, User, Users } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const {login, guestLogin } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showGuestModal, setShowGuestModal] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [guestGender, setGuestGender] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    const success = await login(data.email, data.password)
    setIsLoading(false)
    if (success) navigate('/dashboard')
  }

  const handleGuestLogin = async () => {
    if (guestName.trim() && guestGender) {
      setIsLoading(true)
      const success = await guestLogin(guestName.trim(), guestGender)
      console.log('Guest login success:', success);
      navigate('/dashboard');
      setIsLoading(false)
    }
  }

  const genderOptions = [
    { value: 'male', label: 'Male', icon: '♂' },
    { value: 'female', label: 'Female', icon: '♀' }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent-purple/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-pink/20 rounded-full blur-3xl animate-float delay-1000"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
          
            <h2 className="text-2xl font-bold mb-1">Welcome Back!</h2>
            <p className="text-[var(--text-secondary)]">Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              icon={Mail}
              {...register('email', { required: 'Email is required' })}
              error={errors.email?.message}
            />
            
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              icon={Lock}
              {...register('password', { required: 'Password is required', minLength: 6 })}
              error={errors.password?.message}
              rightIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <div className="flex justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-accent-purple hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full p-2 bg-yellow-600 rounded">
              Sign In
            </Button>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border-color)]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)]">Or</span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="secondary" 
              className="w-full bg-gray-500 p-2 rounded flex items-center justify-center gap-2"
              onClick={() => setShowGuestModal(true)}
            >
              Continue as Guest
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-[var(--text-secondary)]">
            Don't have an account?{' '}
            <Link to="/signup" className="text-accent-purple hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </Card>
      </motion.div>

      {/* Guest Modal */}
      {showGuestModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowGuestModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[var(--bg-secondary)] rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2">Continue as Guest</h3>
            <p className="text-[var(--text-secondary)] mb-6">
              Enter your details to continue as a guest user.
            </p>
            
            <div className="space-y-4">
              <Input
                label="Your Name"
                type="text"
                placeholder="Enter your name"
                icon={User}
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && guestName.trim() && guestGender && handleGuestLogin()}
                autoFocus
              />

              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                  Gender
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {genderOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setGuestGender(option.value)}
                      className={`px-4 py-1 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 font-medium ${
                        guestGender === option.value
                          ? 'border-accent-purple bg-accent-purple/20 text-accent-purple'
                          : 'border-[var(--border-color)] hover:border-accent-purple/50 text-[var(--text-secondary)] hover:text-accent-purple'
                      }`}
                    >
                      <span className="text-xl">{option.icon}</span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button 
                variant="secondary" 
                className="flex-1 bg-gray-500 p-2 rounded"
                onClick={() => {
                  setShowGuestModal(false)
                  setGuestName('')
                  setGuestGender('')
                }}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-yellow-600 p-2 rounded"
                onClick={handleGuestLogin}
                disabled={!guestName.trim() || !guestGender}
              >
                Continue
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Login