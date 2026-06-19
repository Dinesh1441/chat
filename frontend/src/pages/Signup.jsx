// src/pages/Signup.jsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { User, Mail, Lock, Eye, EyeOff, Sparkles, Users } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import { useAuth } from '../context/AuthContext'



const Signup = () => {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedGender, setSelectedGender] = useState('')
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password')
  const [generalError, setGeneralError] = useState('')
  

  const onSubmit = async (data) => {
    if (!selectedGender) {
      setGeneralError('Please select your gender');
      return
    }else {
      setGeneralError('')
    }
    setIsLoading(true)
    const success = await signup(data.name, data.email, data.password, selectedGender)
    setIsLoading(false)
    if (success) navigate('/dashboard')
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
        <Card className="p-4">
          <div className="text-center mb-4">
           
            <h2 className="text-2xl font-bold mb-2">Create Account </h2>
           
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              icon={User}
              {...register('name', { 
                required: 'Full name is required', 
                minLength: {
                  value: 3,
                  message: 'Name must be at least 3 characters'
                }
              })}
              error={errors.name?.message}
            />
            
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              icon={Mail}
              {...register('email', { 
                required: 'Email is required', 
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Please enter a valid email address'
                }
              })}
              error={errors.email?.message}
            />

            <div>
              <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {genderOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedGender(option.value)}
                    className={`px-2 py-1 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 font-medium ${
                      selectedGender === option.value
                        ? 'border-accent-purple bg-accent-purple/20 text-accent-purple shadow-lg'
                        : 'border-[var(--border-color)] hover:border-accent-purple/50 text-[var(--text-secondary)] hover:text-accent-purple'
                    }`}
                  >
                    <span className="text-xl">{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
              {!selectedGender && (
                <p className="text-red-500 text-sm mt-1">{generalError}</p>
              )}
            </div>
            
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password (min. 6 characters)"
              icon={Lock}
              {...register('password', { 
                required: 'Password is required', 
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              error={errors.password?.message}
              rightIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              icon={Lock}
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
              error={errors.confirmPassword?.message}
              rightIcon={
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="focus:outline-none">
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" className="rounded border-[var(--border-color)]" required />
              <span className="text-[var(--text-secondary)]">
                I agree to the <Link to="/terms" className="text-accent-purple hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-accent-purple hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <Button type="submit" isLoading={isLoading} className="w-full bg-yellow-600 rounded p-2">
              Sign Up
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-[var(--text-secondary)]">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-purple hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  )
}

export default Signup