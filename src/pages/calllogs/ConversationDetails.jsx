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
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center p-6">
        <div className="w-full max-w-md p-4 rounded-md bg-(--color-danger-soft) border border-(--color-danger) text-(--color-danger) text-sm">
          {conversationError}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-(--color-primary) hover:underline"
        >
          ← Back
        </button>
      </div>
    )

  if (!data) return null

  // const collectedData = data.data_collection_results_list?.filter((i) => i.value !== null)
  const collectedData = data.data_collection_results_list
  const dynamicVariables = data.dynamic_variables_list
  const transcript = data.transcript
  const vars = data.dynamic_variables_list.reduce((acc, curr) => {
    acc[curr.dynamic_variable_id] = curr.value
    return acc
  }, {})
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
          { label: 'Lead Name', value: vars?.leadInfo__name },
          { label: 'Agent', value: vars?.agentName },
          { label: 'Call Type', value: vars?.leadInfo__callType },
          { label: 'Duration', value: `${vars?.system__call_duration_secs} sec` },
          { label: 'Phone', value: vars?.leadInfo__phone },
          { label: 'Caller ID', value: vars?.system__caller_id },
          { label: 'Agent Turns', value: vars?.system__agent_turns },
          { label: 'Time', value: vars?.system__time },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] p-4"
          >
            <p className="text-xs text-[var(--color-text-muted)] mb-1">{label}</p>
            <p className="text-sm font-medium text-[var(--color-text)]">{value || 'N/A'}</p>
          </div>
        ))}
      </div>

      <Card className="p-5 mb-4">
        <p className="text-xs text-[var(--color-text-muted)] font-medium mb-3 uppercase tracking-wide">
          Call Cost
        </p>
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
          <p className="text-xs text-[var(--color-text-muted)] font-medium mb-3 uppercase tracking-wide">
            Evaluation Result
          </p>
          <div className="flex items-start gap-3">
            <Badge tone={ev.result === 'success' ? 'success' : 'danger'}>{ev.result}</Badge>
            <div>
              <p className="text-sm font-medium text-[var(--color-text)] mb-1">{ev.criteria_id}</p>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                {ev.rationale}
              </p>
            </div>
          </div>
        </Card>
      ))}

      {collectedData?.length > 0 && (
        <Card className="p-5 mb-4">
          <p className="text-xs text-[var(--color-text-muted)] font-medium mb-3 uppercase tracking-wide">
            Collected Data
          </p>
          <div className="flex flex-wrap gap-2">
            {collectedData.map((item) => (
              <div
                key={item.data_collection_id}
                className="bg-[var(--color-surface-muted)] rounded-[var(--radius-sm)] px-3 py-1.5"
              >
                <span className="text-xs text-[var(--color-text-muted)]">
                  {item.data_collection_id} ·{' '}
                </span>
                {item.value === null ? (
                  <span className="text-xs font-medium text-[var(--color-danger)]">null</span>
                ) : (
                  <span className="text-xs font-medium text-[var(--color-success)]">
                    {String(item.value)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
      {dynamicVariables?.length > 0 && (
        <Card className="p-5 mb-4">
          <p className="text-xs text-[var(--color-text-muted)] font-medium mb-3 uppercase tracking-wide">
            Dynamic Variables
          </p>
          <div className="flex flex-wrap gap-2">
            {dynamicVariables.map((item) => (
              <div
                key={item.dynamic_variable_id}
                className="bg-[var(--color-surface-muted)] rounded-[var(--radius-sm)] px-3 py-1.5"
              >
                <span className="text-xs text-[var(--color-text-muted)]">
                  {item.dynamic_variable_id} ·{' '}
                </span>
                <span className="text-xs font-medium text-[var(--color-success)]">
                  {String(item.value)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {(audioUrl || audioLoading) && (
        <Card className="p-5 mb-4">
          <p className="text-xs text-[var(--color-text-muted)] font-medium mb-3 uppercase tracking-wide">
            Call Recording
          </p>
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

      <Card className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)] font-semibold">
              Transcript
            </p>
            <h3 className="text-lg font-semibold mt-1">Call Conversation</h3>
          </div>
        </div>

        <div className="flex flex-col gap-5 max-h-[600px] overflow-y-auto pr-2">
          {transcript?.map((msg, i) => {
            const isAgent = msg.role === 'agent'

            const formattedMessage = msg.message
              ?.replace(/\s+/g, ' ')
              ?.replace(/\.(?=\S)/g, '. ')
              ?.trim()

            const originalTrimmed = msg.original_message?.trim()
            const showOriginal = msg.interrupted && originalTrimmed && originalTrimmed !== msg.message?.trim()

            return (
              <div key={i} className={`flex gap-3 ${isAgent ? 'justify-start' : 'justify-end'}`}>
                {isAgent && (
                  <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center bg-[var(--color-info-soft)] text-[var(--color-info)] font-semibold text-sm">
                    {vars?.agentName?.[0] || 'A'}
                  </div>
                )}

                <div className={`flex flex-col max-w-[75%] ${!isAgent ? 'items-end' : ''}`}>
                  <div className="flex items-center gap-2 mb-1 px-1 flex-wrap">
                    <span className="text-xs font-medium text-[var(--color-text)]">
                      {isAgent ? vars?.agentName : vars?.leadInfo__name || 'Customer'}
                    </span>

                    <span className="text-[11px] text-[var(--color-text-muted)]">
                      {msg.time_in_call_secs}s
                    </span>

                    {msg.interrupted && <Badge tone="warning">Interrupted</Badge>}
                  </div>

                  <div
                    dir="auto"
                    className={`
                px-4 py-3 rounded-2xl
                text-sm leading-7
                whitespace-pre-wrap wrap-break-word
                shadow-sm transition-all duration-200
                hover:shadow-md
                text-right
                ${
                  isAgent
                    ? `
                      bg-(--color-surface-muted)
                      text-(--color-text)
                      rounded-tl-md
                    `
                    : `
                      bg-(--color-primary)
                      text-white
                      rounded-tr-md
                    `
                }
              `}
                  >
                    {formattedMessage}
                    {showOriginal && (
                      <span className={`italic opacity-50 ${isAgent ? 'text-(--color-text)' : 'text-white'}`}>
                        {' '}{originalTrimmed}
                      </span>
                    )}
                  </div>
                </div>

                {!isAgent && (
                  <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-semibold text-sm">
                    {vars?.leadInfo__name?.[0] || 'U'}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Card>
    </>
  )
}

export default ConversationDetails
