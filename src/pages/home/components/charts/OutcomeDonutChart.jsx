import React, { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import ChartCard from './ChartCard'
import { getDashboardChartTheme } from './chartTheme'

const DonutTooltip = ({ active, payload, theme }) => {
  if (!active || !payload || !payload.length) return null

  const item = payload[0].payload

  return (
    <div
      className="rounded-md border px-3 py-2 text-xs"
      style={{ backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }}
    >
      <p className="font-medium">{item.name}</p>
      <p className="mt-1" style={{ color: theme.mutedText }}>
        {item.value} calls ({item.share.toFixed(1)}%)
      </p>
    </div>
  )
}

const OutcomeDonutChart = ({ data = [], loading = false }) => {
  const theme = getDashboardChartTheme()

  const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data])
  const hasData = data.length > 0

  return (
    <ChartCard
      title="Call Outcomes"
      subtitle="Distribution of call results across selected period"
      loading={loading}
      isEmpty={!hasData}
      skeletonVariant="circular"
      className="h-full"
    >
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_220px] gap-6 h-80 items-center">
        <div className="relative h-75 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={78}
                outerRadius={108}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<DonutTooltip theme={theme} />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-(--color-text)">{total.toLocaleString()}</p>
              <p className="text-xs text-(--color-text-muted) mt-1 uppercase tracking-wide">Total Calls</p>
            </div>
          </div>
        </div>

        <ul className="space-y-3">
          {data.map((item) => (
            <li key={item.name} className="flex items-center justify-between gap-2 text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-(--color-text-secondary) truncate">{item.name}</span>
              </div>
              <span className="text-(--color-text) font-medium shrink-0">{item.share.toFixed(1)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </ChartCard>
  )
}

export default OutcomeDonutChart
