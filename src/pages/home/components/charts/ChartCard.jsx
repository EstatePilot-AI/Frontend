import React from 'react'
import { FiBarChart2 } from 'react-icons/fi'
import Card from '../../../../components/ui/Card'
import Skeleton from '../../../../components/ui/Skeleton'
import EmptyState from '../../../../components/ui/EmptyState'

const ChartSkeleton = ({ variant = 'cartesian' }) => {
  if (variant === 'circular') {
    return (
      <div className="flex items-center justify-center h-75">
        <Skeleton className="h-56 w-56 rounded-full" />
      </div>
    )
  }

  return (
    <div className="h-75 flex items-end gap-2">
      {[38, 62, 76, 55, 88, 60, 49, 72].map((height, index) => (
        <Skeleton key={height + index} className="flex-1 rounded-t-sm" style={{ height: `${height}%` }} />
      ))}
    </div>
  )
}

const ChartCard = ({
  title,
  subtitle,
  loading = false,
  isEmpty = false,
  emptyTitle = 'No chart data',
  emptyDescription = 'Try changing your date range to load chart insights.',
  skeletonVariant = 'cartesian',
  children,
  className = '',
}) => {
  return (
    <Card className={`p-5 ${className}`.trim()}>
      <div className="mb-4">
        <h2 className="text-sm font-semibold tracking-wide text-(--color-text)">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-(--color-text-muted)">{subtitle}</p>}
      </div>

      {loading && <ChartSkeleton variant={skeletonVariant} />}

      {!loading && isEmpty && (
        <EmptyState
          icon={FiBarChart2}
          title={emptyTitle}
          description={emptyDescription}
          className="py-10"
        />
      )}

      {!loading && !isEmpty && children}
    </Card>
  )
}

export default ChartCard
