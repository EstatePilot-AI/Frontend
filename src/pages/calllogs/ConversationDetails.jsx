import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import {
  fetchConversationDataById,
  fetchAudioById,
} from '../../redux/slices/CallLogSlice/CallLogsReducer'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )

  if (conversationError) return <div className="p-6 text-red-500">{conversationError}</div>

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
    <div className="w-full max-w-400 mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50"
        >
          ← Back
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Conversation Details</h1>
      </div>

      {/* Info Cards */}
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
          <div key={label} className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="text-base font-medium text-gray-900">{value || 'N/A'}</p>
          </div>
        ))}
      </div>

      {/* Call Cost */}
      <Card className="p-5 mb-4">
        <p className="text-xs text-gray-500 font-medium mb-3">Call Cost</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Total Cost</p>
            <p className="text-base font-medium text-gray-900">
              ${totalCost?.toFixed(6) || '0.000000'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Total Tokens</p>
            <p className="text-base font-medium text-gray-900">{totalTokens || 0}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Model</p>
            <p className="text-base font-medium text-gray-900">{modelName}</p>
          </div>
        </div>
      </Card>

      {data.evaluation_criteria_results_list?.map((ev) => (
        <Card key={ev.criteria_id} className="p-5 mb-4">
          <p className="text-xs text-gray-500 font-medium mb-3">Evaluation Result</p>
          <div className="flex items-start gap-3">
            <Badge
              className={`shrink-0 ${
                ev.result === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {ev.result}
            </Badge>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">{ev.criteria_id}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{ev.rationale}</p>
            </div>
          </div>
        </Card>
      ))}

      {/* Collected Data */}
      {collectedData?.length > 0 && (
        <Card className="p-5 mb-4">
          <p className="text-xs text-gray-500 font-medium mb-3">Collected Data</p>
          <div className="flex flex-wrap gap-2">
            {collectedData.map((item) => (
              <div key={item.data_collection_id} className="bg-gray-50 rounded-lg px-3 py-1.5">
                <span className="text-xs text-gray-500">{item.data_collection_id} · </span>
                <span className="text-xs font-medium text-green-700">{String(item.value)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-5 mb-4">
        <p className="text-xs text-gray-500 font-medium mb-3">Dynamic Variables</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          {Object.entries(vars || {})
            .filter(([key]) => key !== 'system__conversation_history')
            .map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
              >
                <span className="text-xs text-gray-500 shrink-0 mr-4">{key}</span>
                <span className="text-xs font-medium text-gray-900 max-w-50 truncate text-right">
                  {value === null ? '—' : String(value)}
                </span>
              </div>
            ))}
        </div>
      </Card>

      {agentMeta && (
        <Card className="p-5 mb-4">
          <p className="text-xs text-gray-500 font-medium mb-3">Agent Metadata</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {Object.entries(agentMeta).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
              >
                <span className="text-xs text-gray-500 shrink-0 mr-4">{key}</span>
                <span className="text-xs font-medium text-gray-900 max-w-50 truncate text-right">
                  {value === null ? '—' : String(value)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {audioTurns?.length > 0 && (
        <Card className="p-5 mb-4">
          <p className="text-xs text-gray-500 font-medium mb-3">Audio Turns</p>
          <div className="flex flex-col gap-2">
            {audioTurns.map((msg, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <p className="text-sm text-gray-900 flex-1 mr-4">{msg.message}</p>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge className="bg-blue-100 text-blue-700 px-2 py-0.5">audio</Badge>
                  <span className="text-xs text-gray-400">{msg.time_in_call_secs}s</span>
                  {msg.conversation_turn_metrics?.convai_asr_provider && (
                    <span className="text-xs text-gray-400">
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
          <p className="text-xs text-gray-500 font-medium mb-3">Call Recording</p>
          {audioLoading ? (
            <div className="flex justify-center items-center h-12">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
            </div>
          ) : (
            <audio controls className="w-full">
              <source src={audioUrl} />
            </audio>
          )}
        </Card>
      )}

      <Card className="p-5">
        <p className="text-xs text-gray-500 font-medium mb-4">Transcript</p>
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
                    isAgent ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}
                >
                  {isAgent ? vars?.agentName?.[0] : vars?.['leadInfo__name']?.[0]}
                </div>
                <div className={`flex flex-col ${!isAgent ? 'items-end' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs text-gray-400">
                      {isAgent ? vars?.agentName : vars?.['leadInfo__name']} ·{' '}
                      {msg.time_in_call_secs}s
                    </p>
                    {msg.interrupted && (
                      <Badge className="bg-yellow-100 text-yellow-700 px-2 py-0.5">interrupted</Badge>
                    )}
                    {msg.source_medium === 'audio' && (
                      <Badge className="bg-blue-100 text-blue-700 px-2 py-0.5">audio</Badge>
                    )}
                  </div>
                  <div
                    className={`bg-gray-50 px-4 py-2.5 text-sm text-gray-900 leading-relaxed max-w-lg ${
                      isAgent
                        ? 'rounded-tr-xl rounded-br-xl rounded-bl-xl'
                        : 'rounded-tl-xl rounded-bl-xl rounded-br-xl text-right'
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
    </div>
  )
}

export default ConversationDetails
