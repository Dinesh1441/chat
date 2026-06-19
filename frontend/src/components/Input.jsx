// src/components/Input.jsx
import React from 'react'

const Input = ({ label, error, icon: Icon, className, ...props }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-[var(--text-primary)]">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" size={18} />
        )}
        <input
          className={`w-full px-4 py-2.5 rounded-lg glass border border-[var(--border-color)] focus:border-accent-purple focus:outline-none transition-all ${
            Icon ? 'pl-10' : ''
          } ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export default Input