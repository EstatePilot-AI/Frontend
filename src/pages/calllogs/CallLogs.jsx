import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCallLogs, fetchCallLogById, fetchCallOutcomes } from '../../redux/slices/CallLogSlice/CallLogsReducer'
import CallLogDetailModal from './CallLogDetailModal'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Skeleton, { SkeletonRow } from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import Pagination from '../../components/ui/Pagination'
import { FiSearch, FiPhone, FiCalendar } from 'react-icons/fi'

const PAGE_SIZE = 10

const outcomeToneMap = {
  Interested: 'success',
  'Not Interested': 'danger',
  'Not Answer': 'warning',
  Failed: 'neutral',
}

const sessionStateToneMap = {
  Answered: 'success',
  'Not Answerd': 'neutral',
}

const CallLogs = () => {
  const dispatch = useDispatch()
  const { callLogs, loading, error, selectedCallLog, detailLoading, detailError, pagination, callOutcomes } = useSelector(
    (state) => state.callLogs,
  )
  const [activeOutcomeId, setActiveOutcomeId] = useState(null)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchCallOutcomes())
  }, [dispatch])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    const params = { pageNumber: currentPage, pageSize: PAGE_SIZE }
    if (activeOutcomeId != null) params.callOutcomeId = activeOutcomeId
    if (debouncedSearch.trim()) params.searchTerm = debouncedSearch.trim()
    if (fromDate) params.fromDate = fromDate
    if (toDate) params.toDate = toDate
    dispatch(fetchCallLogs(params))
  }, [currentPage, activeOutcomeId, debouncedSearch, fromDate, toDate, dispatch])

  const handleOutcomeFilter = (outcomeId) => {
    setActiveOutcomeId(outcomeId)
    setCurrentPage(1)
  }

  const handleDateChange = (field, value) => {
    if (field === 'from') setFromDate(value)
    else setToDate(value)
    setCurrentPage(1)
  }

  const handleClearDates = () => {
    setFromDate('')
    setToDate('')
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleViewDetails = (callId) => {
    dispatch(fetchCallLogById(callId))
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-(--color-text)">Call Logs</h1>
        <p className="text-sm text-(--color-text-muted) mt-1">Review call history and outcomes</p>
      </div>

      {error && (
        <div className="bg-(--color-danger-soft) border border-(--color-danger) text-(--color-danger) px-4 py-3 rounded-md mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 mb-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => handleOutcomeFilter(null)} variant={activeOutcomeId === null ? 'primary' : 'secondary'} size="sm">
            All
          </Button>
          {callOutcomes.map((outcome) => {
            const id = outcome.id ?? outcome.callOutcomeId ?? outcome.value
            const name = outcome.name ?? outcome.callOutcomeName ?? outcome.label
            return (
              <Button
                key={id}
                onClick={() => handleOutcomeFilter(id)}
                variant={activeOutcomeId === id ? 'primary' : 'secondary'}
                size="sm"
              >
                {name}
              </Button>
            )
          })}
        </div>
        <div className="w-full sm:w-64 shrink-0">
          <Input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            leftElement={<FiSearch size={16} className="text-(--color-text-muted) ml-3" />}
            inputClassName="min-h-9 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3 mb-6">
        <div>
          <label className="block text-xs text-(--color-text-muted) mb-1.5">From</label>
          <div className="relative">
            <FiCalendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted) pointer-events-none" />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => handleDateChange('from', e.target.value)}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] py-2 pl-9 pr-3 text-sm text-[var(--color-text)] outline-none transition-all duration-150 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-ring)]"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-(--color-text-muted) mb-1.5">To</label>
          <div className="relative">
            <FiCalendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted) pointer-events-none" />
            <input
              type="date"
              value={toDate}
              onChange={(e) => handleDateChange('to', e.target.value)}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] py-2 pl-9 pr-3 text-sm text-[var(--color-text)] outline-none transition-all duration-150 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-ring)]"
            />
          </div>
        </div>
        {(fromDate || toDate) && (
          <Button variant="ghost" size="sm" onClick={handleClearDates}>
            Clear dates
          </Button>
        )}
      </div>

      {loading ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-(--color-border) bg-(--color-surface-muted)">
                  <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Buyer</th>
                  <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Type</th>
                  <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Status</th>
                  <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Outcome</th>
                  <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Duration</th>
                  <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Time</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} cells={6} />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : callLogs.length === 0 ? (
        <Card>
          <EmptyState
            icon={FiPhone}
            title="No call logs found"
            description="No call logs match your current filters."
          />
        </Card>
      ) : (
        <>
          <Card className="hidden md:block overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-(--color-border) bg-(--color-surface-muted)">
                    <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Buyer</th>
                    <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Type</th>
                    <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Status</th>
                    <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Outcome</th>
                    <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Duration</th>
                    <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {callLogs.map((call) => (
                    <tr
                      key={call.callId}
                      className="border-b border-(--color-border-subtle) last:border-b-0 hover:bg-(--color-surface-muted) transition-colors cursor-pointer"
                      onClick={() => handleViewDetails(call.callId)}
                    >
                      <td className="py-3 px-5 text-sm font-medium text-(--color-text)">{call.buyerName}</td>
                      <td className="py-3 px-5 text-sm text-(--color-text-secondary)">{call.callType}</td>
                      <td className="py-3 px-5"><Badge tone={sessionStateToneMap[call.callSessionState] || 'neutral'}>{call.callSessionState}</Badge></td>
                      <td className="py-3 px-5"><Badge tone={outcomeToneMap[call.callOutcome] || 'neutral'}>{call.callOutcome}</Badge></td>
                      <td className="py-3 px-5 text-sm text-(--color-text-secondary)">{call.duration}s</td>
                      <td className="py-3 px-5 text-sm text-(--color-text-secondary) whitespace-nowrap">{call.timeStamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="md:hidden space-y-3">
            {callLogs.map((call) => (
              <Card key={call.callId} className="p-4" hover onClick={() => handleViewDetails(call.callId)}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-sm font-semibold text-(--color-text)">{call.buyerName}</p>
                    <p className="text-sm text-(--color-text-secondary)">{call.callType}</p>
                  </div>
                  <Badge tone={outcomeToneMap[call.callOutcome] || 'neutral'}>{call.callOutcome}</Badge>
                </div>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-xs text-(--color-text-muted)">Duration: </span>
                    <span className="text-(--color-text-secondary)">{call.duration}s</span>
                  </div>
                  <div>
                    <span className="text-xs text-(--color-text-muted)">Time: </span>
                    <span className="text-(--color-text-secondary)">{call.timeStamp}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Pagination
            pageNumber={pagination.pageNumber}
            pageSize={pagination.pageSize}
            totalCount={pagination.totalCount}
            totalPages={pagination.totalPages}
            hasPreviousPage={pagination.hasPreviousPage}
            hasNextPage={pagination.hasNextPage}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <CallLogDetailModal
        callLog={selectedCallLog}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        loading={detailLoading}
        error={detailError}
      />
    </>
  )
}

export default CallLogs
