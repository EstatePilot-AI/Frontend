import React, { useState, useRef } from 'react'

const Tooltip = ({
  children,
  content,
  position = 'right',
  className = '',
}) => {
  const [visible, setVisible] = useState(false)
  const triggerRef = useRef(null)

  const positionClasses = {
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      ref={triggerRef}
    >
      {children}
      {visible && content && (
        <div
          className={`absolute z-50 px-2.5 py-1.5 rounded-[var(--radius-sm)] bg-[var(--color-slate-900)] text-[var(--color-slate-50)] text-xs font-medium whitespace-nowrap pointer-events-none ${positionClasses[position] || positionClasses.right} ${className}`}
        >
          {content}
        </div>
      )}
    </div>
  )
}

export default Tooltip
