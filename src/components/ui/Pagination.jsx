import React, { useMemo } from 'react'
import Button from './Button'

const Pagination = ({ pageNumber, pageSize, totalCount, totalPages, hasPreviousPage, hasNextPage, onPageChange }) => {
  const visiblePages = useMemo(() => {
    if (totalPages <= 0) return []
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages = [1]
    const start = Math.max(2, pageNumber - 1)
    const end = Math.min(totalPages - 1, pageNumber + 1)
    if (start > 2) pages.push('start-ellipsis')
    for (let i = start; i <= end; i += 1) pages.push(i)
    if (end < totalPages - 1) pages.push('end-ellipsis')
    pages.push(totalPages)
    return pages
  }, [pageNumber, totalPages])

  if (totalCount === 0) return null

  const rangeStart = (pageNumber - 1) * pageSize + 1
  const rangeEnd = Math.min(pageNumber * pageSize, totalCount)

  return (
    <div className="mt-6 flex flex-col gap-3 items-center">
      <p className="text-sm text-(--color-text-muted)">
        Showing {rangeStart}&ndash;{rangeEnd} of {totalCount}
      </p>
      <div className="flex items-center gap-1">
        <Button variant="secondary" size="sm" onClick={() => onPageChange(pageNumber - 1)} disabled={!hasPreviousPage}>
          Prev
        </Button>
        {visiblePages.map((pn) =>
          typeof pn !== 'number' ? (
            <span key={pn} className="px-2 text-(--color-text-muted) text-sm">
              &hellip;
            </span>
          ) : (
            <Button key={pn} variant={pageNumber === pn ? 'primary' : 'secondary'} size="sm" onClick={() => onPageChange(pn)} className="min-w-9">
              {pn}
            </Button>
          ),
        )}
        <Button variant="secondary" size="sm" onClick={() => onPageChange(pageNumber + 1)} disabled={!hasNextPage}>
          Next
        </Button>
      </div>
    </div>
  )
}

export default Pagination
