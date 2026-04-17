import React from 'react'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import Button from '../../components/ui/Button'
import { FiHome, FiPlus } from 'react-icons/fi'

const Properties = () => {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Properties</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Manage your property listings</p>
      </div>
      <Card>
        <EmptyState
          icon={FiHome}
          title="No properties yet"
          description="Properties you add will appear here. Start by adding your first property listing."
          action={<Button><FiPlus size={16} className="mr-2" />Add Property</Button>}
        />
      </Card>
    </>
  )
}

export default Properties
