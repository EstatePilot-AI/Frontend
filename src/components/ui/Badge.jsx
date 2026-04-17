import React from 'react'

const toneClasses = {
  neutral: 'bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]',
  info: 'bg-[var(--color-info-soft)] text-[var(--color-info)]',
  success: 'bg-[var(--color-success-soft)] text-[var(--color-success)]',
  warning: 'bg-[var(--color-warning-soft)] text-[var(--color-warning)]',
  danger: 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]',
  emerald: 'bg-[var(--color-emerald-50)] text-[var(--color-emerald-700)]',
}

const Badge = ({
  tone = 'neutral',
  className = '',
  children,
  ...props
}) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-[var(--radius-full)] text-xs font-medium whitespace-nowrap ${toneClasses[tone] || toneClasses.neutral} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge
