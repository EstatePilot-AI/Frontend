import React, { useEffect } from 'react'
import { FiX } from 'react-icons/fi'

const Modal = ({
  isOpen = false,
  onClose,
  title,
  children,
  maxWidth = 'max-w-2xl',
  className = '',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[var(--color-overlay)] backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative bg-[var(--color-surface)] rounded-[var(--radius-xl)] shadow-[var(--shadow-xl)] ${maxWidth} w-full max-h-[90vh] overflow-hidden flex flex-col ${className}`}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] shrink-0">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">{title}</h2>
            {onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] transition-colors"
              >
                <FiX size={18} />
              </button>
            )}
          </div>
        )}
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  )
}

export default Modal
