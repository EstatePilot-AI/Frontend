import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCallLogs, fetchCallLogById } from '../../redux/slices/CallLogSlice/CallLogsReducer'
import CallLogDetailModal from './CallLogDetailModal'

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
    return callLogs.filter((call) => {
      const matchFilter =
        activeFilter === 'all' ||
        (activeFilter === 'answered' && call.callSessionState === 'Answered') ||
        (activeFilter === 'not-answered' && call.callSessionState === 'Not Answerd')
      const matchSearch =
        !search.trim() || call.buyerName.toLowerCase().includes(search.toLowerCase())
      return matchFilter && matchSearch
    })
  }, [callLogs, activeFilter, search])

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
              <button
                key={id}
                onClick={() => setActiveFilter(id)}
                className={`min-h-11 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors touch-manipulation ${
                  activeFilter === id
                    ? 'bg-(--color-primary) text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="w-full sm:w-56 md:w-64 shrink-0">
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full min-h-11 px-4 py-2.5 border border-gray-200 rounded-lg text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
            />
          </div>
        </div>

        <div className="md:hidden space-y-3">
          {filteredLogs.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-12 text-center text-gray-500 text-sm">
              No call logs match your filters.
            </div>
          ) : (
            filteredLogs.map((call) => (
              <div
                key={call.callId}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3 cursor-pointer hover:shadow-md transition"
                onClick={() => handleViewDetails(call.callId)}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{call.buyerName}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{call.callType}</p>
                  </div>
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${OUTCOME_STYLES[call.callOutcome] || 'bg-gray-100 text-gray-600'}`}
                  >
                    {call.callOutcome}
                  </span>
                </div>
                <dl className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <dt className="text-gray-500 text-xs uppercase tracking-wider">Status</dt>
                    <dd className="text-gray-900 mt-0.5">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${SESSION_STATE_STYLES[call.callSessionState] || 'bg-gray-100 text-gray-600'}`}
                      >
                        {call.callSessionState}
                      </span>
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
              </div>
            ))
          )}
        </div>

        {/* Desktop: Table */}
        <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
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
                {filteredLogs.map((call) => (
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
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${SESSION_STATE_STYLES[call.callSessionState] || 'bg-gray-100 text-gray-600'}`}
                      >
                        {call.callSessionState}
                      </span>
                    </td>
                    <td className="py-3 px-3 lg:py-4 lg:px-5">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${OUTCOME_STYLES[call.callOutcome] || 'bg-gray-100 text-gray-600'}`}
                      >
                        {call.callOutcome}
                      </span>
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
        </div>
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
