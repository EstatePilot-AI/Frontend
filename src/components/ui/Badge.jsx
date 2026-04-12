import React from 'react'

const toneClasses = {
  neutral: 'bg-gray-100 text-gray-600',
  info: 'bg-blue-100 text-blue-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
}

const Badge = ({
  tone = 'neutral',
  className = '',
  children,
  ...props
}) => {
  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${toneClasses[tone] || toneClasses.neutral} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge
