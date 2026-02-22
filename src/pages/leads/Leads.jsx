import React, { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLeads } from '../../redux/slices/LeadsSclice/LeadesReducer'

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'initiated', label: 'Initiated' },
  { id: 'not-interested', label: 'Not Interested' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'retry-pending', label: 'Retry Pending' },
  { id: 'invalid-number', label: 'Invalid Number' },
]

const statusStyles = {
  Initiated: 'bg-sky-100 text-sky-800',
  'Not Interested': 'bg-red-100 text-red-800',
  'Qualified for property': 'bg-emerald-100 text-emerald-800',
  'Retry Pending': 'bg-violet-100 text-violet-800',
  'Invalid number': 'bg-gray-100 text-gray-600',
}

const Leads = () => {
  const dispatch = useDispatch()
  const { leads, loading, error } = useSelector((state) => state.leads)
  const [activeFilter, setActiveFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    dispatch(fetchLeads())
  }, [dispatch])

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchFilter =
        activeFilter === 'all' ||
        lead.statusName.toLowerCase().replace(/\s/g, '-') === activeFilter ||
        (activeFilter === 'qualified' && lead.statusName === 'Qualified for property')
      const matchSearch =
        !search.trim() ||
        lead.buyerName.toLowerCase().includes(search.toLowerCase()) ||
        lead.buyerPhone.includes(search)
      return matchFilter && matchSearch
    })
  }, [leads, activeFilter, search])

  if (loading) {
    return (
      <div className="w-full max-w-[1600px] mx-auto">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Leads</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Leads</h1>

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
              className={`min-h-[44px] px-4 py-2.5 rounded-lg text-sm font-medium transition-colors touch-manipulation ${
                activeFilter === id
                  ? 'bg-[#6366F1] text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="w-full sm:w-56 md:w-64 flex-shrink-0">
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full min-h-[44px] px-4 py-2.5 border border-gray-200 rounded-lg text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F39F6] focus:border-transparent"
          />
        </div>
      </div>


      <div className="md:hidden space-y-3">
        {filteredLeads.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-12 text-center text-gray-500 text-sm">
            No leads match your filters.
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <div
              key={lead.requestId}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{lead.buyerName}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{lead.buyerPhone}</p>
                </div>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${statusStyles[lead.statusName] || 'bg-gray-100 text-gray-600'}`}>
                  {lead.statusName}
                </span>
              </div>
              <dl className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <dt className="text-gray-500 text-xs uppercase tracking-wider">Request ID</dt>
                  <dd className="text-gray-900 mt-0.5">{lead.requestId}</dd>
                </div>
              </dl>
            </div>
          ))
        )}
      </div>

      {/* Desktop: Table */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-3 lg:py-4 lg:px-5">Buyer Name</th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-3 lg:py-4 lg:px-5">Phone Number</th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-3 lg:py-4 lg:px-5">Status</th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-3 lg:py-4 lg:px-5">Request ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.requestId} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-3 lg:py-4 lg:px-5 text-sm text-gray-900 font-medium">{lead.buyerName}</td>
                  <td className="py-3 px-3 lg:py-4 lg:px-5 text-sm text-gray-600">{lead.buyerPhone}</td>
                  <td className="py-3 px-3 lg:py-4 lg:px-5">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[lead.statusName] || 'bg-gray-100 text-gray-600'}`}>
                      {lead.statusName}
                    </span>
                  </td>
                  <td className="py-3 px-3 lg:py-4 lg:px-5 text-sm text-gray-600">{lead.requestId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredLeads.length === 0 && (
          <div className="py-12 text-center text-gray-500 text-sm">No leads match your filters.</div>
        )}
      </div>
    </div>
  )
}

export default Leads
