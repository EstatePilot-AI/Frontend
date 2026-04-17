import React from 'react'

const baseClasses =
  'inline-flex items-center justify-center rounded-[var(--radius-md)] font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'

const sizeClasses = {
  xs: 'px-2.5 py-1.5 text-xs',
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
}

const variantClasses = {
  primary:
    'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-hover)]',
  secondary:
    'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-surface-muted)]',
  ghost:
    'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]',
  danger:
    'bg-[var(--color-danger)] text-white hover:opacity-90 active:opacity-90',
  chipActive:
    'bg-[var(--color-primary)] text-[#022C22] hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-hover)]',
  chipInactive:
    'bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-surface-muted)]',
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
