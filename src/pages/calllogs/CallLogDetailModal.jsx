import React from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'

const sessionStateTone = (state) =>
  state === 'Answered' ? 'success' : 'neutral'

const outcomeTone = (outcome) => {
  if (outcome === 'Interested') return 'success'
  if (outcome === 'Not Interested') return 'danger'
  if (outcome === 'Not Answer') return 'warning'
  return 'neutral'
}

const CallLogDetailModal = ({ callLog, isOpen, onClose, loading, error }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/conversation/${callLog.callRecordingId}`)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Call Details">
      {error && (
        <div className="bg-[var(--color-danger-soft)] border border-[var(--color-danger)] text-[var(--color-danger)] px-4 py-3 rounded-[var(--radius-md)] mb-6 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ) : callLog ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailField label="Buyer Name" value={callLog.buyerName} />
            <DetailField label="Call Type" value={callLog.callType} />
            <div>
              <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide mb-1">Session State</p>
              <Badge tone={sessionStateTone(callLog.callSessionState)}>{callLog.callSessionState}</Badge>
            </div>
            <div>
              <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide mb-1">Outcome</p>
              <Badge tone={outcomeTone(callLog.callOutcome)}>{callLog.callOutcome}</Badge>
            </div>
            <DetailField label="Duration" value={`${callLog.duration} seconds`} />
            <DetailField label="Retry Count" value={callLog.retryCount} />
            <DetailField label="Call ID" value={callLog.callId} />
            <DetailField label="Timestamp" value={new Date(callLog.timeStamp).toLocaleString()} />
          </div>

          {callLog.callRecordingId && (
            <button
              onClick={handleClick}
              className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              View full conversation →
            </button>
          )}
        </div>
      ) : (
        <p className="text-center text-[var(--color-text-muted)]">No call details available</p>
      )}
    </Modal>
  )
}

const DetailField = ({ label, value }) => (
  <div>
    <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide mb-1">{label}</p>
    <p className="text-sm font-medium text-[var(--color-text)]">{value || 'N/A'}</p>
  </div>
)

export default CallLogDetailModal
