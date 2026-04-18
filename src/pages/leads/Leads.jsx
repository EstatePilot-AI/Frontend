import React, { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLeads } from '../../redux/slices/LeadsSclice/LeadesReducer'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Skeleton, { SkeletonRow } from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import { FiSearch, FiUsers } from 'react-icons/fi'

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'initiated', label: 'Initiated' },
  { id: 'not-interested', label: 'Not Interested' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'retry-pending', label: 'Retry Pending' },
  { id: 'invalid-number', label: 'Invalid Number' },
]

const statusToneMap = {
  Initiated: 'info',
  'Not Interested': 'danger',
  'Qualified for property': 'success',
  'Retry Pending': 'warning',
  'Invalid number': 'neutral',
}

const Leads = () => {
  const dispatch = useDispatch()
  const { leads, loading, error } = useSelector((state) => state.leads)
  const [activeFilter, setActiveFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    dispatch(fetchLeads())
  }, [dispatch])

  const filteredLeads = useMemo(() => {
    const list = Array.isArray(leads) ? leads : []
    if (!Array.isArray(leads)) console.warn('`leads` is not an array:', leads)

    return list.filter((lead) => {
      const statusName = lead?.statusName || ''
      const buyerName = (lead?.buyerName || '').toLowerCase()
      const buyerPhone = lead?.buyerPhone || ''

      const matchFilter =
        activeFilter === 'all' ||
        statusName.toLowerCase().replace(/\s/g, '-') === activeFilter ||
        (activeFilter === 'qualified' && statusName === 'Qualified for property')

      const matchSearch =
        !search.trim() ||
        buyerName.includes(search.toLowerCase()) ||
        buyerPhone.includes(search)

      return matchFilter && matchSearch
    })
  }, [leads, activeFilter, search])

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)

  const paginatedLeads = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE
    return filteredLeads.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredLeads, safeCurrentPage])

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
        <h1 className="text-2xl font-bold text-(--color-text)">Leads</h1>
        <p className="text-sm text-(--color-text-muted) mt-1">Manage and track your property leads</p>
      </div>

      {error && (
        <div className="bg-(--color-danger-soft) border border-(--color-danger) text-(--color-danger) px-4 py-3 rounded-md mb-6 text-sm">
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
            placeholder="Search leads..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            leftElement={<FiSearch size={16} className="text-(--color-text-muted) ml-3" />}
            inputClassName="min-h-9 text-sm"
          />
        </div>
      </div>

      {loading ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-(--color-border) bg-(--color-surface-muted)">
                  <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Buyer Name</th>
                  <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Phone</th>
                  <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Status</th>
                  <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Request ID</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} cells={4} />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : filteredLeads.length === 0 ? (
        <Card>
          <EmptyState
            icon={FiUsers}
            title="No leads found"
            description="No leads match your current filters. Try adjusting your search or filters."
          />
        </Card>
      ) : (
        <>
          <Card className="hidden md:block overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-(--color-border) bg-(--color-surface-muted)">
                    <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Buyer Name</th>
                    <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Phone</th>
                    <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Status</th>
                    <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Request ID</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLeads.map((lead) => (
                    <tr key={lead.requestId} className="border-b border-(--color-border-subtle) last:border-b-0 hover:bg-(--color-surface-muted) transition-colors">
                      <td className="py-3 px-5 text-sm font-medium text-(--color-text)">{lead.buyerName}</td>
                      <td className="py-3 px-5 text-sm text-(--color-text-secondary)">{lead.buyerPhone}</td>
                      <td className="py-3 px-5">
                        <Badge tone={statusToneMap[lead.statusName] || 'neutral'}>{lead.statusName}</Badge>
                      </td>
                      <td className="py-3 px-5 text-sm text-(--color-text-muted)">{lead.requestId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="md:hidden space-y-3">
            {paginatedLeads.map((lead) => (
              <Card key={lead.requestId} className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="text-sm font-semibold text-(--color-text)">{lead.buyerName}</p>
                    <p className="text-sm text-(--color-text-secondary) mt-0.5">{lead.buyerPhone}</p>
                  </div>
                  <Badge tone={statusToneMap[lead.statusName] || 'neutral'}>{lead.statusName}</Badge>
                </div>
                <p className="text-xs text-(--color-text-muted)">ID: {lead.requestId}</p>
              </Card>
            ))}
          </div>

          {filteredLeads.length > 0 && (
            <div className="mt-6 flex flex-col gap-3 items-center">
              <p className="text-sm text-(--color-text-muted)">
                Showing {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredLeads.length)} of {filteredLeads.length}
              </p>
              <div className="flex items-center gap-1">
                <Button variant="secondary" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={safeCurrentPage === 1}>Prev</Button>
                {visiblePageNumbers.map((pn) =>
                  typeof pn !== 'number' ? (
                    <span key={pn} className="px-2 text-(--color-text-muted) text-sm">...</span>
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
    </>
  )
}

export default Leads
