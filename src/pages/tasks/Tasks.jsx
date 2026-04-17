import React from 'react'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import { FiCheckSquare } from 'react-icons/fi'

const Tasks = () => {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Tasks</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Manage your tasks and to-dos</p>
      </div>
      <Card>
        <EmptyState
          icon={FiCheckSquare}
          title="No tasks yet"
          description="Tasks will appear here as they are created or assigned."
        />
      </Card>
    </>
  )
}

export default Tasks
