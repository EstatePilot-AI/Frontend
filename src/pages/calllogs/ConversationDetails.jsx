import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import {
  fetchConversationDataById,
  fetchAudioById,
} from '../../redux/slices/CallLogSlice/CallLogsReducer'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'

const ConversationDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { conversationData, conversationLoading, conversationError, audioUrl, audioLoading } =
    useSelector((state) => state.callLogs)

  useEffect(() => {
    if (id) dispatch(fetchConversationDataById(id))
  }, [dispatch, id])

  const data = conversationData?.data?.data

  useEffect(() => {
    if (id && data?.transcript?.some((msg) => msg.source_medium === 'audio')) {
      dispatch(fetchAudioById(id))
    }
  }, [data, dispatch, id])

  if (conversationLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="space-y-3 w-full max-w-md">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    )

  if (conversationError)
    return (
      <div className="p-6 text-[var(--color-danger)]">{conversationError}</div>
    )

  if (!data) return null

  const collectedData = data.data_collection_results_list?.filter((i) => i.value !== null)
  const transcript = data.transcript
  const vars = data.dynamic_variables

  const totalCost = transcript?.reduce((acc, msg) => {
    const usage = msg.llm_usage?.model_usage
    if (!usage) return acc
    return (
      acc +
      Object.values(usage).reduce(
        (s, m) => s + (m.input?.price || 0) + (m.output_total?.price || 0),
        0
      )
    )
  }, 0)

  const totalTokens = transcript?.reduce((acc, msg) => {
    const usage = msg.llm_usage?.model_usage
    if (!usage) return acc
    return (
      acc +
      Object.values(usage).reduce(
        (s, m) => s + (m.input?.tokens || 0) + (m.output_total?.tokens || 0),
        0
      )
    )
  }, 0)

  const modelName =
    Object.keys(transcript?.find((m) => m.llm_usage)?.llm_usage?.model_usage || {})[0] || 'N/A'

  const agentMeta = transcript?.find((msg) => msg.agent_metadata)?.agent_metadata
  const audioTurns = transcript?.filter((msg) => msg.source_medium === 'audio')

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-[var(--color-text-muted)] border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-1.5 hover:bg-[var(--color-surface-muted)] transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-xl font-semibold text-[var(--color-text)]">Conversation Details</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Lead Name', value: vars?.['leadInfo__name'] },
            { label: 'Agent', value: vars?.['agentName'] },
            { label: 'Call Type', value: vars?.['leadInfo__callType'] },
            { label: 'Duration', value: `${vars?.['system__call_duration_secs']} sec` },
            { label: 'Phone', value: vars?.['leadInfo__phone'] },
            { label: 'Caller ID', value: vars?.['system__caller_id'] },
            { label: 'Agent Turns', value: vars?.['system__agent_turns'] },
            { label: 'Time', value: vars?.['system__time'] },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] p-4">
              <p className="text-xs text-[var(--color-text-muted)] mb-1">{label}</p>
              <p className="text-sm font-medium text-[var(--color-text)]">{value || 'N/A'}</p>
            </div>
          ))}
        </div>

        <Card className="p-5 mb-4">
          <p className="text-xs text-[var(--color-text-muted)] font-medium mb-3 uppercase tracking-wide">Call Cost</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] p-4">
              <p className="text-xs text-[var(--color-text-muted)] mb-1">Total Cost</p>
              <p className="text-sm font-medium text-[var(--color-text)]">
                ${totalCost?.toFixed(6) || '0.000000'}
              </p>
            </div>
            <div className="bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] p-4">
              <p className="text-xs text-[var(--color-text-muted)] mb-1">Total Tokens</p>
              <p className="text-sm font-medium text-[var(--color-text)]">{totalTokens || 0}</p>
            </div>
            <div className="bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] p-4">
              <p className="text-xs text-[var(--color-text-muted)] mb-1">Model</p>
              <p className="text-sm font-medium text-[var(--color-text)]">{modelName}</p>
            </div>
          </div>
        </Card>

        {data.evaluation_criteria_results_list?.map((ev) => (
          <Card key={ev.criteria_id} className="p-5 mb-4">
            <p className="text-xs text-[var(--color-text-muted)] font-medium mb-3 uppercase tracking-wide">Evaluation Result</p>
            <div className="flex items-start gap-3">
              <Badge tone={ev.result === 'success' ? 'success' : 'danger'}>{ev.result}</Badge>
              <div>
                <p className="text-sm font-medium text-[var(--color-text)] mb-1">{ev.criteria_id}</p>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{ev.rationale}</p>
              </div>
            </div>
          </Card>
        ))}

        {collectedData?.length > 0 && (
          <Card className="p-5 mb-4">
            <p className="text-xs text-[var(--color-text-muted)] font-medium mb-3 uppercase tracking-wide">Collected Data</p>
            <div className="flex flex-wrap gap-2">
              {collectedData.map((item) => (
                <div key={item.data_collection_id} className="bg-[var(--color-surface-muted)] rounded-[var(--radius-sm)] px-3 py-1.5">
                  <span className="text-xs text-[var(--color-text-muted)]">{item.data_collection_id} · </span>
                  <span className="text-xs font-medium text-[var(--color-success)]">{String(item.value)}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="p-5 mb-4">
          <p className="text-xs text-[var(--color-text-muted)] font-medium mb-3 uppercase tracking-wide">Dynamic Variables</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {Object.entries(vars || {})
              .filter(([key]) => key !== 'system__conversation_history')
              .map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between items-center py-2 border-b border-[var(--color-border-subtle)] last:border-0"
                >
                  <span className="text-xs text-[var(--color-text-muted)] shrink-0 mr-4">{key}</span>
                  <span className="text-xs font-medium text-[var(--color-text)] max-w-50 truncate text-right">
                    {value === null ? '—' : String(value)}
                  </span>
                </div>
              ))}
          </div>
        </Card>

        {agentMeta && (
          <Card className="p-5 mb-4">
            <p className="text-xs text-[var(--color-text-muted)] font-medium mb-3 uppercase tracking-wide">Agent Metadata</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              {Object.entries(agentMeta).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between items-center py-2 border-b border-[var(--color-border-subtle)] last:border-0"
                >
                  <span className="text-xs text-[var(--color-text-muted)] shrink-0 mr-4">{key}</span>
                  <span className="text-xs font-medium text-[var(--color-text)] max-w-50 truncate text-right">
                    {value === null ? '—' : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {audioTurns?.length > 0 && (
          <Card className="p-5 mb-4">
            <p className="text-xs text-[var(--color-text-muted)] font-medium mb-3 uppercase tracking-wide">Audio Turns</p>
            <div className="flex flex-col gap-2">
              {audioTurns.map((msg, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-[var(--color-border-subtle)] last:border-0"
                >
                  <p className="text-sm text-[var(--color-text)] flex-1 mr-4">{msg.message}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge tone="info">audio</Badge>
                    <span className="text-xs text-[var(--color-text-muted)]">{msg.time_in_call_secs}s</span>
                    {msg.conversation_turn_metrics?.convai_asr_provider && (
                      <span className="text-xs text-[var(--color-text-muted)]">
                        {msg.conversation_turn_metrics.convai_asr_provider}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {(audioUrl || audioLoading) && (
          <Card className="p-5 mb-4">
            <p className="text-xs text-[var(--color-text-muted)] font-medium mb-3 uppercase tracking-wide">Call Recording</p>
            {audioLoading ? (
              <div className="flex justify-center items-center h-12">
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <audio controls className="w-full">
                <source src={audioUrl} />
              </audio>
            )}
          </Card>
        )}

        <Card className="p-5">
          <p className="text-xs text-[var(--color-text-muted)] font-medium mb-4 uppercase tracking-wide">Transcript</p>
          <div className="flex flex-col gap-4">
            {transcript?.map((msg, i) => {
              const isAgent = msg.role === 'agent'
              return (
                <div
                  key={i}
                  className={`flex items-start gap-3 ${!isAgent ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                      isAgent
                        ? 'bg-[var(--color-info-soft)] text-[var(--color-info)]'
                        : 'bg-[var(--color-success-soft)] text-[var(--color-success)]'
                    }`}
                  >
                    {isAgent ? vars?.agentName?.[0] : vars?.['leadInfo__name']?.[0]}
                  </div>
                  <div className={`flex flex-col ${!isAgent ? 'items-end' : ''}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {isAgent ? vars?.agentName : vars?.['leadInfo__name']} · {msg.time_in_call_secs}s
                      </p>
                      {msg.interrupted && <Badge tone="warning">interrupted</Badge>}
                    </div>
                    <div
                      className={`max-w-md px-4 py-2.5 rounded-[var(--radius-lg)] text-sm leading-relaxed ${
                        isAgent
                          ? 'bg-[var(--color-surface-muted)] text-[var(--color-text)]'
                          : 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
    </>
  )
}

export default ConversationDetails
