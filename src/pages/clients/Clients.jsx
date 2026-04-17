import React from 'react'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import Button from '../../components/ui/Button'
import { FiUsers, FiPlus } from 'react-icons/fi'

const Clients = () => {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Clients</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Manage your client relationships</p>
      </div>
      <Card>
        <EmptyState
          icon={FiUsers}
          title="No clients yet"
          description="Clients will appear here as they are added to the system."
          action={<Button><FiPlus size={16} className="mr-2" />Add Client</Button>}
        />
      </Card>
    </>
  )
}

export default Clients
