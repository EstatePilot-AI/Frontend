import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLeads, fetchStatusList } from '../../redux/slices/LeadsSclice/LeadesReducer'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Skeleton, { SkeletonRow } from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import Pagination from '../../components/ui/Pagination'
import { FiSearch, FiUsers } from 'react-icons/fi'

const PAGE_SIZE = 10

const statusToneMap = {
  Initiated: 'info',
  'Not Interested': 'danger',
  'Qualified for property': 'success',
  'Retry Pending': 'warning',
  'Invalid number': 'neutral',
}

const Leads = () => {
  const dispatch = useDispatch()
  const { leads, loading, error, pagination, statusList } = useSelector((state) => state.leads)
  const [activeStatusId, setActiveStatusId] = useState(null)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    dispatch(fetchStatusList())
  }, [dispatch])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    const params = { pageNumber: currentPage, pageSize: PAGE_SIZE }
    if (activeStatusId != null) params.statusId = activeStatusId
    if (debouncedSearch.trim()) params.searchTerm = debouncedSearch.trim()
    dispatch(fetchLeads(params))
  }, [currentPage, activeStatusId, debouncedSearch, dispatch])

  const handleStatusFilter = (statusId) => {
    setActiveStatusId(statusId)
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
          <Button onClick={() => handleStatusFilter(null)} variant={activeStatusId === null ? 'primary' : 'secondary'} size="sm">
            All
          </Button>
          {statusList.map((status) => {
            const id = status.id ?? status.statusId ?? status.value
            const name = status.name ?? status.statusName ?? status.label
            return (
              <Button
                key={id}
                onClick={() => handleStatusFilter(id)}
                variant={activeStatusId === id ? 'primary' : 'secondary'}
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
      ) : leads.length === 0 ? (
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
                  {leads.map((lead) => (
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
            {leads.map((lead) => (
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
    </>
  )
}

export default Leads
