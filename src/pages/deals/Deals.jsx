import React, { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GetAllDeals } from '../../redux/slices/DealsSlice/DealsRducer'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'canceled', label: 'Canceled' },
]

const statusStyles = {
  'In Progress': 'bg-sky-100 text-sky-800',
  Completed: 'bg-emerald-100 text-emerald-800',
  Canceled: 'bg-red-100 text-red-800',
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
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Deals</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-400 mx-auto">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Deals</h1>

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
            placeholder="Search buyer, seller, agent..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            inputClassName="min-h-11 text-sm sm:text-base"
          />
        </div>
      </div>

      <div className="md:hidden space-y-4">
        {filteredDeals.length === 0 ? (
          <Card className="py-12 text-center text-gray-500 text-sm">
            No deals match your filters.
          </Card>
        ) : (
          paginatedDeals.map((deal) => (
            <Card key={deal.dealId || Math.random()} className="p-4 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-snug">
                    Buyer: {deal.buyer}
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">Seller: {deal.seller}</p>
                </div>
                <Badge
                  className={`shrink-0 ${statusStyles[deal.dealStatus] || 'bg-gray-100 text-gray-600'}`}
                >
                  {deal.dealStatus || 'N/A'}
                </Badge>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div>
                    <dt className="text-gray-500 text-xs uppercase tracking-wider">Amount</dt>
                    <dd className="text-gray-900 mt-0.5 font-medium">
                      EGP {deal.finalSaleAmount?.toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 text-xs uppercase tracking-wider">Agent</dt>
                    <dd className="text-gray-900 mt-0.5">{deal.agent}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 text-xs uppercase tracking-wider">Deal Date</dt>
                    <dd className="text-gray-900 mt-0.5">{deal.dealDate}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 text-xs uppercase tracking-wider">
                      Meeting Status
                    </dt>
                    <dd className="text-gray-900 mt-0.5">{deal.meetingStatus}</dd>
                  </div>
                </dl>
              </div>
            </Card>
          ))
        )}
      </div>

      <Card className="hidden md:block overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-200">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-3 lg:py-4 lg:px-5">
                  Deal ID
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-3 lg:py-4 lg:px-5">
                  Buyer
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-3 lg:py-4 lg:px-5">
                  Seller
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-3 lg:py-4 lg:px-5">
                  Agent
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-3 lg:py-4 lg:px-5">
                  Amount
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-3 lg:py-4 lg:px-5">
                  Date
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-3 lg:py-4 lg:px-5">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedDeals.map((deal) => (
                <tr
                  key={deal.dealId || Math.random()}
                  className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-3 px-3 lg:py-4 lg:px-5 text-sm text-gray-600">
                    #{deal.dealId}
                  </td>
                  <td className="py-3 px-3 lg:py-4 lg:px-5 text-sm text-gray-900 font-medium">
                    {deal.buyer}
                  </td>
                  <td className="py-3 px-3 lg:py-4 lg:px-5 text-sm text-gray-600">{deal.seller}</td>
                  <td className="py-3 px-3 lg:py-4 lg:px-5 text-sm text-gray-600">{deal.agent}</td>
                  <td className="py-3 px-3 lg:py-4 lg:px-5 text-sm font-medium text-gray-900">
                    EGP {deal.finalSaleAmount?.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 lg:py-4 lg:px-5 text-sm text-gray-600">
                    {deal.dealDate}
                  </td>
                  <td className="py-3 px-3 lg:py-4 lg:px-5">
                    <Badge className={statusStyles[deal.dealStatus] || 'bg-gray-100 text-gray-600'}>
                      {deal.dealStatus || 'N/A'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredDeals.length === 0 && (
          <div className="py-12 text-center text-gray-500 text-sm">
            No deals match your filters.
          </div>
        )}
      </Card>

      {filteredDeals.length > 0 && (
        <div className="mt-4 sm:mt-6 flex flex-col gap-3 items-center">
          <p className="text-sm text-gray-500 text-center">
            Showing {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}
            {' - '}
            {Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredDeals.length)} of{' '}
            {filteredDeals.length}
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
  )
}

export default Deals
