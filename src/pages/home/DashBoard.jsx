import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGlobalAnalytics } from '../../redux/slices/DashboardSlice/dashboardReducer'
import { FiPhone, FiUsers, FiTrendingUp, FiActivity, FiClock } from 'react-icons/fi'
import Card from '../../components/ui/Card'
import Skeleton from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, ChartTooltip, Legend)

const formatSeconds = (seconds) => {
  if (seconds == null) return '—'
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return `${m}m ${s}s`
}

const CHART_COLORS = {
  Interested: '#22C55E',
  NotAnswer: '#3B82F6',
  NotInterested: '#F59E0B',
  Failed: '#EF4444',
  Available: '#22C55E',
  Sold: '#F59E0B',
  Reserved: '#3B82F6',
}

const getCSSVar = (name) => {
  if (typeof window === 'undefined') return '#6B7280'
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#6B7280'
}

const ChartSkeleton = () => (
  <Card className="p-5">
    <Skeleton className="h-4 w-1/3 mb-4" />
    <div className="flex items-center justify-center" style={{ height: 260 }}>
      <Skeleton className="!rounded-full h-48 w-48" />
    </div>
  </Card>
)

const BarChartSkeleton = () => (
  <Card className="p-5">
    <Skeleton className="h-4 w-1/3 mb-4" />
    <div className="flex items-end justify-center gap-2" style={{ height: 260 }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="w-8 rounded-t-md" style={{ height: `${BAR_SKELETON_HEIGHTS[i]}%` }} />
      ))}
    </div>
  </Card>
)

const KpiCard = ({ label, value, icon }) => {
  const Icon = icon
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide mb-2">
            {label}
          </p>
          <p className="text-2xl font-bold text-[var(--color-text)]">{value}</p>
        </div>
        <div
          className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center shrink-0"
          style={{ backgroundColor: 'rgba(34,197,94,0.15)' }}
        >
          <Icon size={20} className="text-[#22C55E]" />
        </div>
      </div>
    </Card>
  )
}

const BAR_SKELETON_HEIGHTS = [55, 80, 95, 70, 45, 85, 60, 75]

const DashBoard = () => {
  const dispatch = useDispatch()
  const { analytics, loading, error } = useSelector((state) => state.dashboard)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  useEffect(() => {
    dispatch(fetchGlobalAnalytics())
  }, [dispatch])

  const handleApplyFilter = (e) => {
    e.preventDefault()
    const params = {}
    if (fromDate) params.fromDate = fromDate
    if (toDate) params.toDate = toDate
    dispatch(fetchGlobalAnalytics(params))
  }

  const handleClearFilter = () => {
    setFromDate('')
    setToDate('')
    dispatch(fetchGlobalAnalytics())
  }

  const kpiCards = useMemo(() => {
    if (!analytics?.keyMetrics) return []
    const m = analytics.keyMetrics
    return [
      { label: 'Total Engagements', value: m.totalEngagements?.toLocaleString() ?? '—', icon: FiPhone },
      { label: 'Qualified Leads', value: m.qualifiedLeads?.toLocaleString() ?? '—', icon: FiUsers },
      { label: 'Conversion Rate', value: m.conversionRate != null ? `${m.conversionRate.toFixed(1)}%` : '—', icon: FiTrendingUp },
      { label: 'Resource Hours', value: m.resourceOptimizationHours != null ? `${m.resourceOptimizationHours.toFixed(1)} hrs` : '—', icon: FiClock },
      { label: 'Avg Handle Time', value: formatSeconds(m.averageHandlingTime), icon: FiActivity },
    ]
  }, [analytics])

  const outcomeChartData = useMemo(() => {
    if (!analytics?.outcomeDistributions) return null
    const dist = analytics.outcomeDistributions
    return {
      labels: dist.map((d) => d.categoryName),
      datasets: [{
        data: dist.map((d) => d.occurrences),
        backgroundColor: dist.map((d) => CHART_COLORS[d.categoryName] || '#6B7280'),
        borderWidth: 0,
        hoverOffset: 6,
      }],
    }
  }, [analytics])

  const peakChartData = useMemo(() => {
    if (!analytics?.peakActivityTrends) return null
    const trends = analytics.peakActivityTrends
    return {
      labels: trends.map((t) => t.timeSlot),
      datasets: [{
        data: trends.map((t) => t.volume),
        backgroundColor: 'rgba(34,197,94,0.6)',
        hoverBackgroundColor: '#22C55E',
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 36,
      }],
    }
  }, [analytics])

  const propertyChartData = useMemo(() => {
    if (!analytics?.propertyInventoryStatus) return null
    const statuses = analytics.propertyInventoryStatus
    return {
      labels: statuses.map((s) => s.statusName),
      datasets: [{
        data: statuses.map((s) => s.count),
        backgroundColor: statuses.map((s) => CHART_COLORS[s.statusName] || '#6B7280'),
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 28,
      }],
    }
  }, [analytics])

  const chartOptions = useMemo(() => {
    const textColor = getCSSVar('--color-text-secondary')
    const gridColor = getCSSVar('--color-border')
    const mutedColor = getCSSVar('--color-text-muted')
    return {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: getCSSVar('--color-surface-elevated'),
          titleColor: getCSSVar('--color-text'),
          bodyColor: textColor,
          borderColor: gridColor,
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
          displayColors: true,
          boxPadding: 4,
        },
      },
      scales: {
        x: {
          ticks: { color: mutedColor, font: { size: 11 } },
          grid: { display: false },
          border: { display: false },
        },
        y: {
          ticks: { color: mutedColor, font: { size: 11 } },
          grid: { color: gridColor },
          border: { display: false },
          beginAtZero: true,
        },
      },
    }
  }, [])

  const doughnutOptions = useMemo(() => {
    const textColor = getCSSVar('--color-text-secondary')
    return {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor,
            padding: 16,
            usePointStyle: true,
            pointStyleWidth: 8,
            font: { size: 12 },
          },
        },
        tooltip: {
          backgroundColor: getCSSVar('--color-surface-elevated'),
          titleColor: getCSSVar('--color-text'),
          bodyColor: textColor,
          borderColor: getCSSVar('--color-border'),
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
          displayColors: true,
          boxPadding: 4,
          callbacks: {
            label: (ctx) => {
              const dist = analytics?.outcomeDistributions
              if (!dist) return ''
              const item = dist[ctx.dataIndex]
              return item ? ` ${item.categoryName}: ${item.occurrences} (${item.sharePercentage.toFixed(1)}%)` : ''
            },
          },
        },
      },
    }
  }, [analytics])

  const horizontalBarOptions = useMemo(() => {
    const textColor = getCSSVar('--color-text-secondary')
    const gridColor = getCSSVar('--color-border')
    const mutedColor = getCSSVar('--color-text-muted')
    return {
      responsive: true,
      maintainAspectRatio: true,
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: getCSSVar('--color-surface-elevated'),
          titleColor: getCSSVar('--color-text'),
          bodyColor: textColor,
          borderColor: gridColor,
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
          displayColors: true,
          boxPadding: 4,
          callbacks: {
            label: (ctx) => {
              const statuses = analytics?.propertyInventoryStatus
              if (!statuses) return ''
              const item = statuses[ctx.dataIndex]
              return item ? ` ${item.count} properties (${item.percentage.toFixed(1)}%)` : ''
            },
          },
        },
      },
      scales: {
        x: {
          ticks: { color: mutedColor, font: { size: 11 } },
          grid: { color: gridColor },
          border: { display: false },
          beginAtZero: true,
        },
        y: {
          ticks: { color: textColor, font: { size: 12, weight: '500' } },
          grid: { display: false },
          border: { display: false },
        },
      },
    }
  }, [analytics])

  if (error) {
    return (
      <EmptyState
        title="Failed to load analytics"
        description={error}
        action={
          <button
            onClick={() => dispatch(fetchGlobalAnalytics())}
            className="px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Try again
          </button>
        }
      />
    )
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Dashboard</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Overview of your CRM activity</p>
        </div>
        <form onSubmit={handleApplyFilter} className="flex items-center gap-2">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="h-9 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-ring)] transition-all"
          />
          <span className="text-[var(--color-text-muted)] text-sm">to</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="h-9 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-ring)] transition-all"
          />
          <button
            type="submit"
            className="h-9 px-4 rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Apply
          </button>
          {(fromDate || toDate) && (
            <button
              type="button"
              onClick={handleClearFilter}
              className="h-9 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="p-5">
                <Skeleton className="h-3 w-2/3 mb-3" />
                <Skeleton className="h-8 w-1/2" />
              </Card>
            ))
          : kpiCards.map((card) => (
              <KpiCard key={card.label} label={card.label} value={card.value} icon={card.icon} />
            ))
        }
      </div>

      {!loading && !analytics && (
        <EmptyState
          title="No analytics data"
          description="No data available for the selected period. Try adjusting the date range."
        />
      )}

      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <ChartSkeleton />
          <BarChartSkeleton />
        </div>
      )}

      {!loading && analytics && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {outcomeChartData && (
              <Card className="p-5">
                <h2 className="text-sm font-semibold text-[var(--color-text)] mb-4">Call Outcomes</h2>
                <div className="flex items-center justify-center" style={{ maxHeight: 300 }}>
                  <Doughnut data={outcomeChartData} options={doughnutOptions} />
                </div>
              </Card>
            )}

            {peakChartData && (
              <Card className="p-5">
                <h2 className="text-sm font-semibold text-[var(--color-text)] mb-4">Peak Activity Hours</h2>
                <div style={{ maxHeight: 300 }}>
                  <Bar data={peakChartData} options={chartOptions} />
                </div>
              </Card>
            )}
          </div>

          {propertyChartData && (
            <Card className="p-5 mb-4">
              <h2 className="text-sm font-semibold text-[var(--color-text)] mb-4">Property Inventory Status</h2>
              <div style={{ maxHeight: 200 }}>
                <Bar data={propertyChartData} options={horizontalBarOptions} />
              </div>
            </Card>
          )}
        </>
      )}
    </>
  )
}

export default DashBoard
