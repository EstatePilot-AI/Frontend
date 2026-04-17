import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCallLogs, fetchCallLogById } from '../../redux/slices/CallLogSlice/CallLogsReducer'
import CallLogDetailModal from './CallLogDetailModal'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Skeleton, { SkeletonRow } from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import { FiSearch, FiPhone } from 'react-icons/fi'

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'answered', label: 'Answered' },
  { id: 'not-answered', label: 'Not Answered' },
]

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
  const { callLogs, loading, error, selectedCallLog, detailLoading, detailError } = useSelector(
    (state) => state.callLogs
  )
  const [activeFilter, setActiveFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    dispatch(fetchCallLogs())
  }, [dispatch])

  const handleViewDetails = (callId) => {
    dispatch(fetchCallLogById(callId))
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const filteredLogs = useMemo(() => {
    const list = Array.isArray(callLogs) ? callLogs : []
    return list.filter((call) => {
      const matchFilter =
        activeFilter === 'all' ||
        (activeFilter === 'answered' && call.callSessionState === 'Answered') ||
        (activeFilter === 'not-answered' && call.callSessionState === 'Not Answerd')
      const matchSearch =
        !search.trim() || call.buyerName.toLowerCase().includes(search.toLowerCase())
      return matchFilter && matchSearch
    })
  }, [callLogs, activeFilter, search])

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)

  const paginatedLogs = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE
    return filteredLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredLogs, safeCurrentPage])

  const visiblePageNumbers = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages = [1]
    const start = Math.max(2, safeCurrentPage - 1)
    const end = Math.min(totalPages - 1, safeCurrentPage + 1)
    if (start > 2) pages.push('start-ellipsis')
    for (let i = start; i <= end; i += 1) pages.push(i)
    if (end < totalPages - 1) pages.push('end-ellipsis')
    pages.push(totalPages)
    return pages
  }, [safeCurrentPage, totalPages])

  return (
    <>
      <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Call Logs</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Review call history and outcomes</p>
        </div>

        {error && (
          <div className="bg-[var(--color-danger-soft)] border border-[var(--color-danger)] text-[var(--color-danger)] px-4 py-3 rounded-[var(--radius-md)] mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map(({ id, label }) => (
              <Button
                key={id}
                onClick={() => { setActiveFilter(id); setCurrentPage(1) }}
                variant={activeFilter === id ? 'primary' : 'secondary'}
                size="sm"
              >
                {label}
              </Button>
            ))}
          </div>
          <div className="w-full sm:w-64 shrink-0">
            <Input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
              leftElement={<FiSearch size={16} className="text-[var(--color-text-muted)] ml-3" />}
              inputClassName="min-h-9 text-sm"
            />
          </div>
        </div>

        {loading ? (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider py-3 px-5">Buyer</th>
                    <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider py-3 px-5">Type</th>
                    <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider py-3 px-5">Status</th>
                    <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider py-3 px-5">Outcome</th>
                    <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider py-3 px-5">Duration</th>
                    <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider py-3 px-5">Time</th>
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
        ) : filteredLogs.length === 0 ? (
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
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
                      <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider py-3 px-5">Buyer</th>
                      <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider py-3 px-5">Type</th>
                      <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider py-3 px-5">Status</th>
                      <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider py-3 px-5">Outcome</th>
                      <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider py-3 px-5">Duration</th>
                      <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider py-3 px-5">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedLogs.map((call) => (
                      <tr
                        key={call.callId}
                        className="border-b border-[var(--color-border-subtle)] last:border-b-0 hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer"
                        onClick={() => handleViewDetails(call.callId)}
                      >
                        <td className="py-3 px-5 text-sm font-medium text-[var(--color-text)]">{call.buyerName}</td>
                        <td className="py-3 px-5 text-sm text-[var(--color-text-secondary)]">{call.callType}</td>
                        <td className="py-3 px-5"><Badge tone={sessionStateToneMap[call.callSessionState] || 'neutral'}>{call.callSessionState}</Badge></td>
                        <td className="py-3 px-5"><Badge tone={outcomeToneMap[call.callOutcome] || 'neutral'}>{call.callOutcome}</Badge></td>
                        <td className="py-3 px-5 text-sm text-[var(--color-text-secondary)]">{call.duration}s</td>
                        <td className="py-3 px-5 text-sm text-[var(--color-text-secondary)] whitespace-nowrap">{call.timeStamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="md:hidden space-y-3">
              {paginatedLogs.map((call) => (
                <Card key={call.callId} className="p-4" hover onClick={() => handleViewDetails(call.callId)}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-text)]">{call.buyerName}</p>
                      <p className="text-sm text-[var(--color-text-secondary)]">{call.callType}</p>
                    </div>
                    <Badge tone={outcomeToneMap[call.callOutcome] || 'neutral'}>{call.callOutcome}</Badge>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-xs text-[var(--color-text-muted)]">Duration: </span>
                      <span className="text-[var(--color-text-secondary)]">{call.duration}s</span>
                    </div>
                    <div>
                      <span className="text-xs text-[var(--color-text-muted)]">Time: </span>
                      <span className="text-[var(--color-text-secondary)]">{call.timeStamp}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredLogs.length > 0 && (
              <div className="mt-6 flex flex-col gap-3 items-center">
                <p className="text-sm text-[var(--color-text-muted)]">
                  Showing {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredLogs.length)} of {filteredLogs.length}
                </p>
                <div className="flex items-center gap-1">
                  <Button variant="secondary" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={safeCurrentPage === 1}>Prev</Button>
                  {visiblePageNumbers.map((pn) =>
                    typeof pn !== 'number' ? (
                      <span key={pn} className="px-2 text-[var(--color-text-muted)] text-sm">...</span>
                    ) : (
                      <Button key={pn} variant={safeCurrentPage === pn ? 'primary' : 'secondary'} size="sm" onClick={() => setCurrentPage(pn)} className="min-w-9">{pn}</Button>
                    )
                  )}
                  <Button variant="secondary" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={safeCurrentPage === totalPages}>Next</Button>
                </div>
              </div>
            )}
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
