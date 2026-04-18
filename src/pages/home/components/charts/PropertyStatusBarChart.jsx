import React from 'react'
import ChartCard from './ChartCard'

const PropertyStatusBarChart = ({ data = [], loading = false }) => {
  const totalProperties = data.reduce((sum, item) => sum + item.count, 0)
  const hasData = data.length > 0 && totalProperties > 0
  const normalizedData = totalProperties > 0
    ? data.map((item) => ({
        ...item,
        normalizedWidth: (item.count / totalProperties) * 100,
        normalizedPercentage: (item.count / totalProperties) * 100,
      }))
    : data.map((item) => ({
        ...item,
        normalizedWidth: 0,
        normalizedPercentage: 0,
      }))

  return (
    <ChartCard
      title="Property Inventory Status"
      subtitle="Current property count by lifecycle stage"
      loading={loading}
      isEmpty={!hasData}
    >
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-4 items-center">
          <div className="rounded-lg border border-(--color-border) bg-(--color-surface-muted) px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-(--color-text-muted)">Total Properties</p>
            <p className="mt-1 text-3xl font-bold text-(--color-text)">{totalProperties.toLocaleString()}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-(--color-text-muted) mb-2">Distribution</p>
            <div className="h-3 w-full rounded-full bg-(--color-surface-muted) overflow-hidden border border-(--color-border)">
              {normalizedData.map((item, index) => (
                <div
                  key={`distribution-${item.name}-${index}`}
                  className="h-full float-left"
                  style={{ width: `${Math.max(0, Math.min(100, item.normalizedWidth))}%`, backgroundColor: item.color }}
                  title={`${item.name}: ${item.normalizedPercentage.toFixed(1)}%`}
                />
              ))}
            </div>
          </div>
        </div>

        <ul className="space-y-3 pr-1">
          {normalizedData.map((item, index) => (
            <li key={`${item.name}-${index}`} className="rounded-md border border-(--color-border) bg-(--color-surface-muted) p-3">
              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-(--color-text-secondary) truncate">{item.name}</span>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-(--color-text)">{item.count}</p>
                  <p className="text-xs text-(--color-text-muted)">{item.normalizedPercentage.toFixed(1)}%</p>
                </div>
              </div>

              <div className="mt-2 h-1.5 w-full rounded-full bg-(--color-surface) overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.max(0, Math.min(100, item.normalizedWidth))}%`, backgroundColor: item.color }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </ChartCard>
  )
}

export default PropertyStatusBarChart
