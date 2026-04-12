import React from 'react'

const baseClasses =
  'inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed'

const sizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
}

const variantClasses = {
  primary: 'bg-(--color-primary) text-white hover:bg-(--color-primary-hover)',
  secondary: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-50',
}

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  fullWidth = false,
  disabled = false,
  ...props
}) => {
  const resolvedSize = sizeClasses[size] || sizeClasses.md
  const resolvedVariant = variantClasses[variant] || variantClasses.primary

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${resolvedSize} ${resolvedVariant} ${fullWidth ? 'w-full' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
