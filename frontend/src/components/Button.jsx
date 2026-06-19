// src/components/Button.jsx
import React from 'react'
import { motion } from 'framer-motion'

const Button = ({ children, variant = 'primary', size = 'md', isLoading, icon: Icon, ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-accent-purple to-accent-pink text-white hover:shadow-lg hover:shadow-accent-purple/30',
    secondary: 'glass border border-[var(--border-color)] hover:bg-white/10',
    ghost: 'hover:bg-white/10',
    danger: 'bg-red-500/20 text-red-500 hover:bg-red-500/30',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${variants[variant]} ${sizes[size]}  rounded-lg font-medium transition-all duration-200 flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed`}
      disabled={isLoading}
      {...props}
    >
      {isLoading && (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
      {Icon && !isLoading && <Icon size={18} />}
      {children}
    </motion.button>
  )
}

export default Button