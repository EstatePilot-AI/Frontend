import React from 'react'
import { FiInbox } from 'react-icons/fi'

const EmptyState = ({
  icon,
  title = 'Nothing here yet',
  description = '',
  action,
  className = '',
}) => {
  const IconComponent = icon || FiInbox
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className="w-14 h-14 rounded-[var(--radius-lg)] bg-[var(--color-surface-muted)] flex items-center justify-center mb-4">
        <IconComponent size={24} className="text-[var(--color-text-muted)]" />
      </div>
      <h3 className="text-base font-semibold text-[var(--color-text)] mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--color-text-muted)] max-w-sm mb-4">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

export default EmptyState
