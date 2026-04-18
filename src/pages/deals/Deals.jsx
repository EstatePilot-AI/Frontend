import React, { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GetAllDeals } from '../../redux/slices/DealsSlice/DealsRducer'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Skeleton, { SkeletonRow } from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import { FiSearch, FiBriefcase } from 'react-icons/fi'

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'canceled', label: 'Canceled' },
]

const statusToneMap = {
  'In Progress': 'info',
  Completed: 'success',
  Canceled: 'danger',
}

const Deals = () => {
  const dispatch = useDispatch()
  const { deals, loading, error } = useSelector((state) => state.deals)
  const [activeFilter, setActiveFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    dispatch(GetAllDeals())
  }, [dispatch])

  const filteredDeals = useMemo(() => {
    const list = Array.isArray(deals) ? deals : []
    if (!Array.isArray(deals)) console.warn('`deals` is not an array:', deals)

    return list.filter((deal) => {
      const statusName = deal?.dealStatus || ''
      const buyerName = (deal?.buyer || '').toLowerCase()
      const sellerName = (deal?.seller || '').toLowerCase()
      const agentName = (deal?.agent || '').toLowerCase()

      const matchFilter =
        activeFilter === 'all' || statusName.toLowerCase().replace(/\s+/g, '-') === activeFilter

      const matchSearch =
        !search.trim() ||
        buyerName.includes(search.toLowerCase()) ||
        sellerName.includes(search.toLowerCase()) ||
        agentName.includes(search.toLowerCase())

      return matchFilter && matchSearch
    })
  }, [deals, activeFilter, search])

  const totalPages = Math.max(1, Math.ceil(filteredDeals.length / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)

  const paginatedDeals = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE
    return filteredDeals.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredDeals, safeCurrentPage])

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
        <h1 className="text-2xl font-bold text-(--color-text)">Deals</h1>
        <p className="text-sm text-(--color-text-muted) mt-1">Track and manage property deals</p>
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
              placeholder="Search buyer, seller, agent..."
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
                    <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Deal ID</th>
                    <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Buyer</th>
                    <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Seller</th>
                    <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Agent</th>
                    <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Amount</th>
                    <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Date</th>
                    <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonRow key={i} cells={7} />
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
                    <tr className="border-b border-(--color-border) bg-(--color-surface-muted)">
                      <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Deal ID</th>
                      <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Buyer</th>
                      <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Seller</th>
                      <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Agent</th>
                      <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Amount</th>
                      <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Date</th>
                      <th className="text-left text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider py-3 px-5">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedDeals.map((deal, idx) => (
                      <tr key={deal.dealId ?? `deal-${idx}`} className="border-b border-(--color-border-subtle) last:border-b-0 hover:bg-(--color-surface-muted) transition-colors">
                        <td className="py-3 px-5 text-sm text-(--color-text-muted)">#{deal.dealId}</td>
                        <td className="py-3 px-5 text-sm font-medium text-(--color-text)">{deal.buyer}</td>
                        <td className="py-3 px-5 text-sm text-(--color-text-secondary)">{deal.seller}</td>
                        <td className="py-3 px-5 text-sm text-(--color-text-secondary)">{deal.agent}</td>
                        <td className="py-3 px-5 text-sm font-medium text-(--color-text)">EGP {deal.finalSaleAmount?.toLocaleString()}</td>
                        <td className="py-3 px-5 text-sm text-(--color-text-secondary)">{deal.dealDate}</td>
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
                      <p className="text-sm font-semibold text-(--color-text)">Buyer: {deal.buyer}</p>
                      <p className="text-sm text-(--color-text-secondary) mt-0.5">Seller: {deal.seller}</p>
                    </div>
                    <Badge tone={statusToneMap[deal.dealStatus] || 'neutral'}>{deal.dealStatus || 'N/A'}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-(--color-text-muted)">Amount</p>
                      <p className="font-medium text-(--color-text)">EGP {deal.finalSaleAmount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-(--color-text-muted)">Agent</p>
                      <p className="text-(--color-text-secondary)">{deal.agent}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredDeals.length > 0 && (
              <div className="mt-6 flex flex-col gap-3 items-center">
                <p className="text-sm text-(--color-text-muted)">
                  Showing {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredDeals.length)} of {filteredDeals.length}
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

export default Deals
