import React from 'react'

const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-[skeleton-pulse_1.5s_ease-in-out_infinite] rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] ${className}`}
      {...props}
    />
  )
}

export const SkeletonRow = ({ cells = 4, className = '' }) => (
  <tr className={className}>
    {Array.from({ length: cells }).map((_, i) => (
      <td key={i} className="py-4 px-5">
        <Skeleton className="h-4 w-3/4" />
      </td>
    ))}
  </tr>
)

export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6 ${className}`}>
    <Skeleton className="h-4 w-1/3 mb-4" />
    <Skeleton className="h-8 w-1/2 mb-2" />
    <Skeleton className="h-3 w-2/3" />
  </div>
)

export default Skeleton
