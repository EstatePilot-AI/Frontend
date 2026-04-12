import React from 'react'

const Card = ({
  className = '',
  hover = false,
  children,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm ${hover ? 'hover:shadow-md transition' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
