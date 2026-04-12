import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCallLogs, fetchCallLogById } from '../../redux/slices/CallLogSlice/CallLogsReducer'
import CallLogDetailModal from './CallLogDetailModal'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'answered', label: 'Answered' },
  { id: 'not-answered', label: 'Not Answered' },
]

const OUTCOME_STYLES = {
  Interested: 'bg-green-100 text-green-800',
  'Not Interested': 'bg-red-100 text-red-800',
  'Not Answer': 'bg-yellow-100 text-yellow-800',
  Failed: 'bg-gray-100 text-gray-800',
}

const SESSION_STATE_STYLES = {
  Answered: 'bg-emerald-100 text-emerald-800',
  'Not Answerd': 'bg-gray-100 text-gray-600',
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
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages = [1]
    const start = Math.max(2, safeCurrentPage - 1)
    const end = Math.min(totalPages - 1, safeCurrentPage + 1)

    if (start > 2) pages.push('start-ellipsis')

    for (let i = start; i <= end; i += 1) {
      pages.push(i)
    }

    if (end < totalPages - 1) pages.push('end-ellipsis')

    pages.push(totalPages)
    return pages
  }, [safeCurrentPage, totalPages])

  if (loading) {
    return (
      <div className="w-full max-w-400 mx-auto">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Call Logs</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="w-full max-w-400 mx-auto">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Call Logs</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 mb-4 sm:mb-6">
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map(({ id, label }) => (
              <Button
                key={id}
                onClick={() => {
                  setActiveFilter(id)
                  setCurrentPage(1)
                }}
                variant={activeFilter === id ? 'primary' : 'secondary'}
                className="min-h-11 px-4 rounded-lg touch-manipulation"
              >
                {label}
              </Button>
            ))}
          </div>
          <div className="w-full sm:w-56 md:w-64 shrink-0">
            <Input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              inputClassName="min-h-11 text-sm sm:text-base"
            />
          </div>
        </div>

        <div className="md:hidden space-y-3">
          {filteredLogs.length === 0 ? (
            <Card className="py-12 text-center text-gray-500 text-sm">
              No call logs match your filters.
            </Card>
          ) : (
            paginatedLogs.map((call) => (
              <Card
                key={call.callId}
                className="p-4 space-y-3 cursor-pointer"
                hover
                onClick={() => handleViewDetails(call.callId)}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{call.buyerName}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{call.callType}</p>
                  </div>
                  <Badge className={`shrink-0 ${OUTCOME_STYLES[call.callOutcome] || 'bg-gray-100 text-gray-600'}`}>
                    {call.callOutcome}
                  </Badge>
                </div>
                <dl className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <dt className="text-gray-500 text-xs uppercase tracking-wider">Status</dt>
                    <dd className="text-gray-900 mt-0.5">
                      <Badge className={SESSION_STATE_STYLES[call.callSessionState] || 'bg-gray-100 text-gray-600'}>
                        {call.callSessionState}
                      </Badge>
                    </dd>
                  </div>
                  <div className="flex flex-wrap gap-4 sm:gap-6">
                    <div>
                      <dt className="text-gray-500 text-xs uppercase tracking-wider">Duration</dt>
                      <dd className="text-gray-900 mt-0.5">{call.duration}s</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500 text-xs uppercase tracking-wider">Time</dt>
                      <dd className="text-gray-900 mt-0.5">{call.timeStamp}</dd>
                    </div>
                  </div>
                </dl>
              </Card>
            ))
          )}
        </div>

        {/* Desktop: Table */}
        <Card className="hidden md:block overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-200">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-3 lg:py-4 lg:px-5">
                    Buyer Name
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-3 lg:py-4 lg:px-5">
                    Call Type
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-3 lg:py-4 lg:px-5">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-3 lg:py-4 lg:px-5">
                    Outcome
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-3 lg:py-4 lg:px-5">
                    Duration
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-3 lg:py-4 lg:px-5">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.map((call) => (
                  <tr
                    key={call.callId}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => handleViewDetails(call.callId)}
                  >
                    <td className="py-3 px-3 lg:py-4 lg:px-5 text-sm text-gray-900 font-medium">
                      {call.buyerName}
                    </td>
                    <td className="py-3 px-3 lg:py-4 lg:px-5 text-sm text-gray-600">
                      {call.callType}
                    </td>
                    <td className="py-3 px-3 lg:py-4 lg:px-5">
                      <Badge className={SESSION_STATE_STYLES[call.callSessionState] || 'bg-gray-100 text-gray-600'}>
                        {call.callSessionState}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 lg:py-4 lg:px-5">
                      <Badge className={OUTCOME_STYLES[call.callOutcome] || 'bg-gray-100 text-gray-600'}>
                        {call.callOutcome}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 lg:py-4 lg:px-5 text-sm text-gray-600">
                      {call.duration}s
                    </td>
                    <td className="py-3 px-3 lg:py-4 lg:px-5 text-sm text-gray-600 whitespace-nowrap">
                      {call.timeStamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {filteredLogs.length > 0 && (
          <div className="mt-4 sm:mt-6 flex flex-col gap-3 items-center">
            <p className="text-sm text-gray-500 text-center">
              Showing {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}
              {' - '}
              {Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredLogs.length)} of {filteredLogs.length}
            </p>

            <div className="flex items-center justify-center gap-2 flex-wrap w-full">
              <Button
                variant="secondary"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={safeCurrentPage === 1}
                className="px-3 py-2"
              >
                Prev
              </Button>

              {visiblePageNumbers.map((pageNumber) => {
                if (typeof pageNumber !== 'number') {
                  return (
                    <span key={pageNumber} className="px-2 text-gray-500">
                      ...
                    </span>
                  )
                }

                return (
                  <Button
                    key={pageNumber}
                    variant={safeCurrentPage === pageNumber ? 'primary' : 'secondary'}
                    onClick={() => setCurrentPage(pageNumber)}
                    className="min-w-10 px-3 py-2"
                  >
                    {pageNumber}
                  </Button>
                )
              })}

              <Button
                variant="secondary"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={safeCurrentPage === totalPages}
                className="px-3 py-2"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

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
