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
  const computedLeftPadding = leftElement ? leftPaddingClass || 'pl-10' : 'pl-4'
  const computedRightPadding = rightElement ? rightPaddingClass || 'pr-11' : 'pr-4'

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
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
          className={`w-full rounded-xl border border-gray-200 py-2.5 ${computedLeftPadding} ${computedRightPadding} text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary-ring) ${inputClassName}`.trim()}
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
