import React from 'react'

const Input = ({
  id,
  label,
  leftElement,
  rightElement,
  leftPaddingClass,
  rightPaddingClass,
  className = '',
  inputClassName = '',
  ...props
}) => {
  const computedLeftPadding = leftElement ? leftPaddingClass || 'pl-10' : 'pl-3.5'
  const computedRightPadding = rightElement ? rightPaddingClass || 'pr-11' : 'pr-3.5'

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {leftElement && (
          <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
            {leftElement}
          </div>
        )}

        <input
          id={id}
          className={`w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 ${computedLeftPadding} ${computedRightPadding} text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none transition-all duration-150 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-ring)] ${inputClassName}`.trim()}
          {...props}
        />

        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  )
}

export default Input
