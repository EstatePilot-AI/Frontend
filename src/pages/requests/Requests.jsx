import React from 'react'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import { FiInbox } from 'react-icons/fi'

const Requests = () => {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Requests</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Track and manage service requests</p>
      </div>
      <Card>
        <EmptyState
          icon={FiInbox}
          title="No requests yet"
          description="Incoming requests will appear here when they are submitted."
        />
      </Card>
    </>
  )
}

export default Requests
