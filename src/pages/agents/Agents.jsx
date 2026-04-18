import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import Button from '../../components/ui/Button'
import { FiUsers, FiPlus, FiLock } from 'react-icons/fi'
import { GetAllAgents } from '../../redux/slices/AgentSlice/AgentReducer'
import { SkeletonRow } from '../../components/ui/Skeleton'
import Badge from '../../components/ui/Badge'

const Agents = () => {
  const dispatch = useDispatch()
  const { profile } = useSelector((state) => state.user)
  const { agents, loading, error } = useSelector((state) => state.agent)

  const isAgent = profile?.role?.toLowerCase() === 'agent'

  useEffect(() => {
    if (!isAgent) {
      dispatch(GetAllAgents())
    }
  }, [dispatch, isAgent])

  if (isAgent) {
    return (
      <>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Agents</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Manage your agents directory
          </p>
        </div>
        <Card>
          <EmptyState
            icon={FiLock}
            title="Access Restricted"
            description="This view is for administrators only. You do not have permission to access the agents directory."
          />
        </Card>
      </>
    )
  }

  let displayList = Array.isArray(agents) ? agents : []
  const hasAgentRole = displayList.some((u) => {
    const r = (u?.role || u?.userRole || u?.roleName || '').toLowerCase()
    return r.includes('agent')
  })

  if (hasAgentRole) {
    displayList = displayList.filter((u) => {
      const r = (u?.role || u?.userRole || u?.roleName || '').toLowerCase()
      return r.includes('agent')
    })
  }

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Agents</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Manage your agents directory
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-[var(--color-danger-soft)] border border-[var(--color-danger)] text-[var(--color-danger)] px-4 py-3 rounded-[var(--radius-md)] mb-6 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  <th className="py-3 px-5">Name</th>
                  <th className="py-3 px-5">Email</th>
                  <th className="py-3 px-5">Phone</th>
                  <th className="py-3 px-5">Role</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonRow key={i} cells={4} />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : displayList.length === 0 ? (
        <Card>
          <EmptyState
            icon={FiUsers}
            title="No agents found"
            description="There are currently no agents in the system."
            action={
              <Button>
                <FiPlus size={16} className="mr-2" />
                Add Agent
              </Button>
            }
          />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)] text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  <th className="py-3 px-5">Name</th>
                  <th className="py-3 px-5">Email</th>
                  <th className="py-3 px-5">Phone</th>
                  <th className="py-3 px-5">Role</th>
                </tr>
              </thead>
              <tbody>
                {displayList.map((agent, idx) => (
                  <tr
                    key={agent.id || idx}
                    className="border-b border-[var(--color-border-subtle)] last:border-b-0 hover:bg-[var(--color-surface-muted)] transition-colors"
                  >
                    <td className="py-3 px-5 text-sm font-medium text-[var(--color-text)]">
                      {agent.name || agent.personName || 'Unknown'}
                    </td>
                    <td className="py-3 px-5 text-sm text-[var(--color-text-secondary)]">
                      {agent.email || '-'}
                    </td>
                    <td className="py-3 px-5 text-sm text-[var(--color-text-secondary)]">
                      {agent.phoneNumber || agent.phone || '-'}
                    </td>
                    <td className="py-3 px-5">
                      <Badge tone="info">
                        {agent.role || agent.userRole || agent.roleName || 'Agent'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  )
}

export default Agents
