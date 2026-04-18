import React from 'react'

const baseClasses =
  'inline-flex items-center justify-center rounded-md font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary) disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'

const sizeClasses = {
  xs: 'px-2.5 py-1.5 text-xs',
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
}

const variantClasses = {
  primary:
    'bg-(--color-primary) text-white hover:bg-(--color-primary-hover) active:bg-(--color-primary-hover)',
  secondary:
    'bg-(--color-surface) border border-(--color-border) text-(--color-text-secondary) hover:bg-(--color-surface-muted) active:bg-(--color-surface-muted)',
  ghost:
    'bg-transparent text-(--color-text-secondary) hover:bg-(--color-surface-muted)',
  danger:
    'bg-(--color-danger) text-white hover:opacity-90 active:opacity-90',
  chipActive:
    'bg-(--color-primary) text-(--color-text-inverse) hover:bg-(--color-primary-hover) active:bg-(--color-primary-hover)',
  chipInactive:
    'bg-(--color-surface-elevated) text-(--color-text-secondary) hover:bg-(--color-surface-muted) active:bg-(--color-surface-muted)',
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
