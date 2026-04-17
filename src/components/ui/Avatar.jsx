const Avatar = ({ name = '', size = 'md', className = '' }) => {
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  }

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-semibold bg-[var(--color-primary)] text-[var(--color-text-inverse)] ${sizeClasses[size] || sizeClasses.md} ${className}`}
      title={name}
    >
      {initials || '?'}
    </div>
  )
}

export default Avatar
