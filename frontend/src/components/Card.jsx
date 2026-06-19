// src/components/Card.jsx
import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ children, className, hover = true, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5, scale: 1.01 } : {}}
      transition={{ duration: 0.2 }}
      className={`glass rounded-2xl border border-[var(--border-color)] p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card