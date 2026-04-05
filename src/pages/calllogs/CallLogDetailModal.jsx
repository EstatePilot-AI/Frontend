import React from 'react'
import { MdClose } from 'react-icons/md'

const CallLogDetailModal = ({ callLog, isOpen, onClose, loading, error }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
     
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Call Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <MdClose size={24} />
          </button>
        </div>


        <div className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : callLog ? (
            <div className="space-y-6">
           
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Buyer Name</label>
                  <p className="text-base text-gray-900 font-medium">{callLog.buyerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Call Type</label>
                  <p className="text-base text-gray-900">{callLog.callType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Call Session State</label>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    callLog.callSessionState === 'Answered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {callLog.callSessionState}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Call Outcome</label>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    callLog.callOutcome === 'Interested'
                      ? 'bg-green-100 text-green-800'
                      : callLog.callOutcome === 'Not Interested'
                      ? 'bg-red-100 text-red-800'
                      : callLog.callOutcome === 'Not Answer'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {callLog.callOutcome}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Duration</label>
                  <p className="text-base text-gray-900">{callLog.duration} seconds</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Retry Count</label>
                  <p className="text-base text-gray-900">{callLog.retryCount}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Call ID</label>
                  <p className="text-base text-gray-900">{callLog.callId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Record ID</label>
                  <p className="text-base text-gray-900">{callLog.callRecordingId || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Timestamp</label>
                  <p className="text-base text-gray-900">
                    {new Date(callLog.timeStamp).toLocaleString()}
                  </p>
                </div>
              </div>

              {callLog.summary && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Call Summary</label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {callLog.summary}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500">No call details available</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CallLogDetailModal
