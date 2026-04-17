import React, { useMemo } from 'react'
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceDot,
} from 'recharts'
import ChartCard from './ChartCard'
import { getDashboardChartTheme } from './chartTheme'

const ActivityTooltip = ({ active, payload, label, theme }) => {
  if (!active || !payload || !payload.length) return null

  return (
    <div
      className="rounded-md border px-3 py-2 text-xs"
      style={{ backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }}
    >
      <p className="font-medium">{label}</p>
      <p className="mt-1" style={{ color: theme.mutedText }}>
        Volume: <span style={{ color: theme.text }}>{payload[0].value}</span>
      </p>
    </div>
  )
}

const PeakActivityAreaChart = ({ data = [], loading = false }) => {
  const theme = getDashboardChartTheme()
  const hasData = data.length > 0

  const peakPoint = useMemo(() => {
    if (!hasData) return null

    return data.reduce((currentPeak, item) => {
      if (!currentPeak || item.volume > currentPeak.volume) return item
      return currentPeak
    }, null)
  }, [data, hasData])

  return (
    <ChartCard
      title="Peak Activity Hours"
      subtitle="Call volume trend throughout the day"
      loading={loading}
      isEmpty={!hasData}
      className="h-full"
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 14, right: 8, left: -14, bottom: 8 }}>
            <defs>
              <linearGradient id="peakActivityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.accent} stopOpacity={0.35} />
                <stop offset="100%" stopColor={theme.accent} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={theme.border} strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="slot"
              tick={{ fill: theme.mutedText, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: theme.mutedText, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<ActivityTooltip theme={theme} />} />
            <Area
              type="monotone"
              dataKey="volume"
              stroke={theme.accent}
              strokeWidth={2.5}
              fill="url(#peakActivityGradient)"
              activeDot={{ r: 5, strokeWidth: 0, fill: theme.accent }}
            />
            {peakPoint && (
              <ReferenceDot
                x={peakPoint.slot}
                y={peakPoint.volume}
                r={5}
                fill={theme.accent}
                stroke={theme.surface}
                strokeWidth={2}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export default PeakActivityAreaChart
