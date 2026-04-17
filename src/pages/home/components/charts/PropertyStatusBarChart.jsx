import React from 'react'
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
} from 'recharts'
import ChartCard from './ChartCard'
import { getDashboardChartTheme } from './chartTheme'

const PropertyTooltip = ({ active, payload, label, theme }) => {
  if (!active || !payload || !payload.length) return null

  const item = payload[0].payload

  return (
    <div
      className="rounded-md border px-3 py-2 text-xs"
      style={{ backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }}
    >
      <p className="font-medium">{label}</p>
      <p className="mt-1" style={{ color: theme.mutedText }}>
        {item.count} properties ({item.percentage.toFixed(1)}%)
      </p>
    </div>
  )
}

const PropertyStatusBarChart = ({ data = [], loading = false }) => {
  const theme = getDashboardChartTheme()
  const hasData = data.length > 0

  return (
    <ChartCard
      title="Property Inventory Status"
      subtitle="Current property count by lifecycle stage"
      loading={loading}
      isEmpty={!hasData}
      className="h-full"
    >
      <div className="h-75">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 8, right: 18, left: 8, bottom: 8 }}>
            <CartesianGrid stroke={theme.border} strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: theme.mutedText, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: theme.text, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={90}
            />
            <Tooltip content={<PropertyTooltip theme={theme} />} />
            <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell key={`${entry.name}-${index}`} fill={entry.color} />
              ))}
              <LabelList dataKey="count" position="right" fill={theme.text} fontSize={11} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export default PropertyStatusBarChart
