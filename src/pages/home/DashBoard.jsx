import React, { useEffect, useState, useMemo, lazy, Suspense } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGlobalAnalytics } from '../../redux/slices/DashboardSlice/dashboardReducer'
import { FiPhone, FiUsers, FiTrendingUp, FiActivity, FiClock } from 'react-icons/fi'
import Card from '../../components/ui/Card'
import Skeleton from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import {
  formatSeconds,
  mapOutcomeDistributionData,
  mapPeakActivityData,
  mapPropertyStatusData,
} from './components/charts/dashboardMappers'
import { getCategoryColor, getDashboardChartTheme } from './components/charts/chartTheme'

const OutcomeDonutChart = lazy(() => import('./components/charts/OutcomeDonutChart'))
const PeakActivityAreaChart = lazy(() => import('./components/charts/PeakActivityAreaChart'))
const PropertyStatusBarChart = lazy(() => import('./components/charts/PropertyStatusBarChart'))

const getActiveTheme = () => {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.getAttribute('data-theme') || 'light'
}

const KpiCard = ({ label, value, icon }) => {
  const Icon = icon
  return (
    <Card className="p-5 h-full" hover>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-(--color-text-muted) uppercase tracking-wide mb-2">
            {label}
          </p>
          <p className="text-2xl font-bold text-(--color-text) leading-tight">{value}</p>
        </div>
        <div
          className="w-10 h-10 rounded-md flex items-center justify-center shrink-0 border border-(--color-border)"
          style={{ backgroundColor: 'var(--color-primary-soft)' }}
        >
          <Icon size={20} className="text-(--color-primary)" />
        </div>
      </div>
    </Card>
  )
}

const ChartSuspenseFallback = () => (
  <Card className="p-5">
    <Skeleton className="h-4 w-1/3 mb-4" />
    <div className="h-75 flex items-end gap-2">
      {[40, 68, 56, 84, 61, 72].map((height, index) => (
        <Skeleton key={height + index} className="flex-1 rounded-t-sm" style={{ height: `${height}%` }} />
      ))}
    </div>
  </Card>
)

const DashBoard = () => {
  const dispatch = useDispatch()
  const { analytics, loading, error } = useSelector((state) => state.dashboard)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [activeTheme, setActiveTheme] = useState(getActiveTheme)

  useEffect(() => {
    dispatch(fetchGlobalAnalytics())
  }, [dispatch])

  useEffect(() => {
    if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') return undefined

    const rootElement = document.documentElement
    const observer = new MutationObserver(() => {
      setActiveTheme(rootElement.getAttribute('data-theme') || 'light')
    })

    observer.observe(rootElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => observer.disconnect()
  }, [])

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
    const m = analytics?.keyMetrics || {}

    return [
      { label: 'Total Engagements', value: m.totalEngagements?.toLocaleString() ?? '—', icon: FiPhone },
      { label: 'Qualified Leads', value: m.qualifiedLeads?.toLocaleString() ?? '—', icon: FiUsers },
      { label: 'Conversion Rate', value: m.conversionRate != null ? `${m.conversionRate.toFixed(1)}%` : '—', icon: FiTrendingUp },
      { label: 'Resource Hours', value: m.resourceOptimizationHours != null ? `${m.resourceOptimizationHours.toFixed(1)} hrs` : '—', icon: FiClock },
      { label: 'Avg Handle Time', value: formatSeconds(m.averageHandlingTime), icon: FiActivity },
    ]
  }, [analytics])

  const outcomeChartData = useMemo(() => {
    const theme = getDashboardChartTheme(activeTheme)
    return mapOutcomeDistributionData(
      analytics?.outcomeDistributions,
      (name, index) => getCategoryColor(name, theme, index)
    )
  }, [analytics, activeTheme])

  const peakChartData = useMemo(() => {
    return mapPeakActivityData(analytics?.peakActivityTrends)
  }, [analytics])

  const propertyChartData = useMemo(() => {
    const theme = getDashboardChartTheme(activeTheme)
    return mapPropertyStatusData(
      analytics?.propertyInventoryStatus,
      (name, index) => getCategoryColor(name, theme, index)
    )
  }, [analytics, activeTheme])

  if (error) {
    return (
      <EmptyState
        title="Failed to load analytics"
        description={error}
        action={
          <button
            onClick={() => dispatch(fetchGlobalAnalytics())}
            className="px-4 py-2 rounded-md bg-(--color-primary) text-white text-sm font-medium hover:bg-(--color-primary-hover) transition-colors"
          >
            Try again
          </button>
        }
      />
    )
  }

  return (
    <>
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-(--color-text)">Dashboard</h1>
            <p className="text-sm text-(--color-text-muted) mt-1">
              Executive overview of your CRM performance and activity trends.
            </p>
          </div>
        </div>
        <Card className="p-4 border-dashed">
          <form onSubmit={handleApplyFilter} className="flex flex-col md:flex-row md:items-end gap-3">
            <label className="flex-1 min-w-45">
              <span className="text-xs font-medium uppercase tracking-wide text-(--color-text-muted)">
                From
              </span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="mt-1 h-10 w-full px-3 rounded-md border border-(--color-border) bg-(--color-surface-muted) text-sm text-(--color-text) outline-none focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary-ring) transition-all"
              />
            </label>

            <label className="flex-1 min-w-45">
              <span className="text-xs font-medium uppercase tracking-wide text-(--color-text-muted)">
                To
              </span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="mt-1 h-10 w-full px-3 rounded-md border border-(--color-border) bg-(--color-surface-muted) text-sm text-(--color-text) outline-none focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary-ring) transition-all"
              />
            </label>

            <button
              type="submit"
              className="h-10 px-4 rounded-md bg-(--color-primary) text-white text-sm font-medium hover:bg-(--color-primary-hover) transition-colors"
            >
              Apply Filters
            </button>

            {(fromDate || toDate) && (
              <button
                type="button"
                onClick={handleClearFilter}
                className="h-10 px-4 rounded-md border border-(--color-border) text-sm text-(--color-text-secondary) hover:bg-(--color-surface-muted) transition-colors"
              >
                Clear
              </button>
            )}
          </form>
        </Card>
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

      {(loading || analytics) && (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
            <Suspense fallback={<ChartSuspenseFallback />}>
              <OutcomeDonutChart data={outcomeChartData} loading={loading} />
            </Suspense>

            <Suspense fallback={<ChartSuspenseFallback />}>
              <PeakActivityAreaChart data={peakChartData} loading={loading} />
            </Suspense>
          </div>

          <Suspense fallback={<ChartSuspenseFallback />}>
            <PropertyStatusBarChart data={propertyChartData} loading={loading} />
          </Suspense>
        </>
      )}
    </>
  )
}

export default DashBoard
