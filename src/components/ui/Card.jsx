import React from 'react'

const Card = ({
  className = '',
  hover = false,
  children,
  ...props
}) => {
  return (
    <div
      className={`bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] ${hover ? 'hover:shadow-[var(--shadow-md)] hover:border-[var(--color-primary)] transition-all duration-200 cursor-pointer' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
