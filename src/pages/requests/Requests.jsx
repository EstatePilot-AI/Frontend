import React from 'react'
import { useSelector } from 'react-redux'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import { FiInbox } from 'react-icons/fi'
import UploadCSVSection from './components/UploadCSVSection'

const Requests = () => {
  const profile = useSelector((state) => state.user?.profile)

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Requests</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Track and manage service requests</p>
      </div>

      {(() => {
        const userRole = (profile?.role || profile?.userRole || profile?.roleName || '').toLowerCase()
        if (userRole === 'super admin' || userRole === 'superadmin') {
          return (
            <div className="mb-6">
              <UploadCSVSection />
            </div>
          )
        }
        return null
      })()}

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
