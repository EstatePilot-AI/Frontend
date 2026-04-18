import React, { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GetAllDeals, setPagination, setDealStatusFilter } from '../../redux/slices/DealsSlice/DealsRducer'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Skeleton, { SkeletonRow } from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import { FiSearch, FiBriefcase } from 'react-icons/fi'

const STATUS_FILTERS = [
  { id: '', label: 'All' },
  { id: 'InProgress', label: 'In Progress' },
  { id: 'Completed', label: 'Completed' },
  { id: 'Canceled', label: 'Canceled' },
]

const statusToneMap = {
  'In Progress': 'info',
  'InProgress': 'info',
  Completed: 'success',
  Canceled: 'danger',
}

const Deals = () => {
  const dispatch = useDispatch()
  const { deals, loading, error, pagination, filter } = useSelector((state) => state.deals)
  const { profile } = useSelector((state) => state.user)
  const [search, setSearch] = useState('')

  const safePageNumber = pagination?.PageNumber || 1
  const safePageSize = pagination?.PageSize || 10
  const activeFilterId = filter?.DealStatusId || ''

  const isAgent = profile?.role?.toLowerCase() === 'agent'

  useEffect(() => {
    dispatch(GetAllDeals())
  }, [dispatch, safePageNumber, safePageSize, activeFilterId])

  const filteredDeals = useMemo(() => {
    const list = Array.isArray(deals) ? deals : []
    return list.filter((deal) => {
      const buyerName = (deal?.buyer || '').toLowerCase()
      const sellerName = (deal?.seller || '').toLowerCase()
      const agentName = (deal?.agent || '').toLowerCase()

      const matchSearch =
        !search.trim() ||
        buyerName.includes(search.toLowerCase()) ||
        sellerName.includes(search.toLowerCase()) ||
        agentName.includes(search.toLowerCase())

      return matchSearch
    })
  }, [deals, search])

  const isBackendPaginated = pagination && pagination.totalCount > 0
  const totalItems = isBackendPaginated ? pagination.totalCount : filteredDeals.length
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize))

  const paginatedDeals = useMemo(() => {
    if (isBackendPaginated) {
      return filteredDeals
    }
    const startIndex = (safePageNumber - 1) * safePageSize
    return filteredDeals.slice(startIndex, startIndex + safePageSize)
  }, [filteredDeals, isBackendPaginated, safePageNumber, safePageSize])

  const visiblePageNumbers = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages = [1]
    const start = Math.max(2, safePageNumber - 1)
    const end = Math.min(totalPages - 1, safePageNumber + 1)
    if (start > 2) pages.push('start-ellipsis')
    for (let i = start; i <= end; i += 1) pages.push(i)
    if (end < totalPages - 1) pages.push('end-ellipsis')
    pages.push(totalPages)
    return pages
  }, [safePageNumber, totalPages])

  const startItem = (safePageNumber - 1) * safePageSize + 1
  const endItem = Math.min(safePageNumber * safePageSize, totalItems)

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Deals</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Track and manage property deals</p>
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
                key={id || 'all'}
                onClick={() => dispatch(setDealStatusFilter(id))}
                variant={activeFilterId === id ? 'primary' : 'secondary'}
                size="sm"
              >
                {label}
              </Button>
            ))}
          </div>
          <div className="w-full sm:w-64 shrink-0">
            <Input
              type="text"
              placeholder="Search buyer, seller, agent..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                    <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider py-3 px-5">Deal ID</th>
                    <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider py-3 px-5">Buyer</th>
                    <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider py-3 px-5">Seller</th>
                    {!isAgent && (
                      <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider py-3 px-5">Agent</th>
                    )}
                    <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider py-3 px-5">Amount</th>
                    <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider py-3 px-5">Date</th>
                    <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider py-3 px-5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonRow key={i} cells={isAgent ? 6 : 7} />
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : filteredDeals.length === 0 ? (
          <Card>
            <EmptyState
              icon={FiBriefcase}
              title="No deals found"
              description="No deals match your current filters. Try adjusting your search."
            />
          </Card>
        ) : (
          <>
            <Card className="hidden md:block overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
                      <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider py-3 px-5">Deal ID</th>
                      <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider py-3 px-5">Buyer</th>
                      <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider py-3 px-5">Seller</th>
                      {!isAgent && (
                        <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider py-3 px-5">Agent</th>
                      )}
                      <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider py-3 px-5">Amount</th>
                      <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider py-3 px-5">Date</th>
                      <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider py-3 px-5">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedDeals.map((deal, idx) => (
                      <tr key={deal.dealId ?? `deal-${idx}`} className="border-b border-[var(--color-border-subtle)] last:border-b-0 hover:bg-[var(--color-surface-muted)] transition-colors">
                        <td className="py-3 px-5 text-sm text-[var(--color-text-muted)]">#{deal.dealId}</td>
                        <td className="py-3 px-5 text-sm font-medium text-[var(--color-text)]">{deal.buyer}</td>
                        <td className="py-3 px-5 text-sm text-[var(--color-text-secondary)]">{deal.seller}</td>
                        {!isAgent && (
                          <td className="py-3 px-5 text-sm text-[var(--color-text-secondary)]">{deal.agent}</td>
                        )}
                        <td className="py-3 px-5 text-sm font-medium text-[var(--color-text)]">EGP {deal.finalSaleAmount?.toLocaleString()}</td>
                        <td className="py-3 px-5 text-sm text-[var(--color-text-secondary)]">{deal.dealDate}</td>
                        <td className="py-3 px-5"><Badge tone={statusToneMap[deal.dealStatus] || 'neutral'}>{deal.dealStatus || 'N/A'}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="md:hidden space-y-3">
              {paginatedDeals.map((deal, idx) => (
                <Card key={deal.dealId ?? `deal-card-${idx}`} className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-text)]">Buyer: {deal.buyer}</p>
                      <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">Seller: {deal.seller}</p>
                    </div>
                    <Badge tone={statusToneMap[deal.dealStatus] || 'neutral'}>{deal.dealStatus || 'N/A'}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-[var(--color-text-muted)]">Amount</p>
                      <p className="font-medium text-[var(--color-text)]">EGP {deal.finalSaleAmount?.toLocaleString()}</p>
                    </div>
                    {!isAgent && (
                      <div>
                        <p className="text-xs text-[var(--color-text-muted)]">Agent</p>
                        <p className="text-[var(--color-text-secondary)]">{deal.agent}</p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {filteredDeals.length > 0 && (
              <div className="mt-6 flex flex-col gap-3 items-center">
                <p className="text-sm text-[var(--color-text-muted)]">
                  Showing {startItem}–{endItem} of {totalItems}
                </p>
                <div className="flex items-center gap-1">
                  <Button variant="secondary" size="sm" onClick={() => dispatch(setPagination({ PageNumber: Math.max(1, safePageNumber - 1) }))} disabled={safePageNumber === 1}>Prev</Button>
                  {visiblePageNumbers.map((pn) =>
                    typeof pn !== 'number' ? (
                      <span key={pn} className="px-2 text-[var(--color-text-muted)] text-sm">...</span>
                    ) : (
                      <Button key={pn} variant={safePageNumber === pn ? 'primary' : 'secondary'} size="sm" onClick={() => dispatch(setPagination({ PageNumber: pn }))} className="min-w-9">{pn}</Button>
                    )
                  )}
                  <Button variant="secondary" size="sm" onClick={() => dispatch(setPagination({ PageNumber: Math.min(totalPages, safePageNumber + 1) }))} disabled={safePageNumber === totalPages}>Next</Button>
                </div>
              </div>
            )}
          </>
        )}
    </>
  )
}

export default Deals
