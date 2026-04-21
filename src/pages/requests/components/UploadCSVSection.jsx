import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiUpload, FiFileText, FiX, FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi'
import toast from 'react-hot-toast'
import {
  uploadCSVForSellers,
  clearDashboardError,
} from '../../../redux/slices/DashboardSlice/dashboardReducer'
import Card from '../../../components/ui/Card'

const UploadCSVSection = () => {
  const dispatch = useDispatch()
  const { uploading, uploadSuccess, uploadData, uploadError } = useSelector(
    (state) => state.dashboard
  )
  const [selectedFile, setSelectedFile] = useState(null)
  const [localError, setLocalError] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setLocalError(null)
    dispatch(clearDashboardError())

    if (!file) {
      setSelectedFile(null)
      return
    }

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setLocalError('Please select a valid CSV file.')
      setSelectedFile(null)
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setLocalError('No file selected.')
      return
    }

    const uploadPromise = dispatch(uploadCSVForSellers(selectedFile)).unwrap()

    toast.promise(uploadPromise, {
      loading: 'Processing CSV file...',
      success: (data) => {
        setSelectedFile(null)
        if (data?.save === 0 && data?.errors?.length > 0) {
          return data.errors[0]
        }
        if (data?.totalRead !== undefined) {
          return `Processed ${data.totalRead} rows (${data.save} saved).`
        }
        return data?.message || 'File uploaded successfully!'
      },
      error: (err) => {
        return err || 'An error occurred during upload.'
      },
    })

    try {
      await uploadPromise
      setTimeout(() => {
        dispatch(clearDashboardError())
      }, 5000)
    } catch (err) {}
  }

  const clearSelectedFile = () => {
    setSelectedFile(null)
    setLocalError(null)
    dispatch(clearDashboardError())
  }

  return (
    <Card className="p-6 border-dashed border-2 border-(--color-primary-soft) bg-(--color-surface-muted)/30">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-(--color-text) flex items-center gap-2">
            <FiUpload className="text-(--color-primary)" />
            Bulk Seller Upload
          </h3>
          <p className="text-sm text-(--color-text-muted) mt-1">
            Import new sellers quickly using a CSV file. Only authorized super admins can perform
            this action.
          </p>
        </div>

        <div className="flex flex-col gap-3 min-w-0 md:min-w-80">
          {!selectedFile ? (
            <label className="relative flex flex-col items-center justify-center h-32 px-4 py-6 border-2 border-dashed border-(--color-border) rounded-xl cursor-pointer hover:bg-(--color-surface-muted) hover:border-(--color-primary) transition-all group">
              <div className="flex flex-col items-center justify-center space-y-2">
                <FiFileText
                  size={24}
                  className="text-(--color-text-muted) group-hover:text-(--color-primary) transition-colors"
                />
                <span className="text-sm font-medium text-(--color-text-secondary)">
                  Click to choose CSV
                </span>
              </div>
              <input type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
            </label>
          ) : (
            <div className="flex items-center justify-between p-4 bg-(--color-surface) border border-(--color-primary-soft) rounded-xl">
              <div className="flex items-center gap-3 min-w-0">
                <FiFileText className="text-(--color-primary) shrink-0" />
                <span className="text-sm font-medium text-(--color-text) truncate">
                  {selectedFile.name}
                </span>
              </div>
              <button
                onClick={clearSelectedFile}
                className="p-1 hover:bg-(--color-surface-muted) rounded-full text-(--color-text-muted) hover:text-(--color-error) transition-colors"
                disabled={uploading}
              >
                <FiX size={18} />
              </button>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className={`
                h-11 w-full rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all
                ${
                  !selectedFile || uploading
                    ? 'bg-(--color-surface-muted) text-(--color-text-muted) cursor-not-allowed'
                    : 'bg-(--color-primary) text-white shadow-lg shadow-(--color-primary-soft) hover:bg-(--color-primary-hover) active:scale-[0.98]'
                }
              `}
            >
              {uploading ? (
                <>
                  <FiLoader className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <FiUpload />
                  Submit CSV
                </>
              )}
            </button>

            {/* Feedback Messages */}
            {(localError || uploadError) && (
              <div className="flex items-center gap-2 p-3 text-sm text-(--color-error) bg-(--color-error-soft)/20 border border-(--color-error-soft) rounded-lg mt-1 animate-in fade-in slide-in-from-top-1 duration-300">
                <FiAlertCircle className="shrink-0" />
                <span className="font-medium">{localError || uploadError}</span>
              </div>
            )}

            {uploadSuccess && uploadData && (
              <div className="flex flex-col gap-3 p-4 text-sm text-(--color-success) bg-(--color-success-soft)/20 border border-(--color-success-soft) rounded-lg mt-1 animate-in fade-in slide-in-from-top-1 duration-300">
                <div className="flex items-center justify-between border-b border-(--color-success-soft)/30 pb-2">
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="shrink-0" />
                    <span className="font-bold text-base">Upload Summary</span>
                  </div>
                  <div className="flex gap-3 text-xs font-medium">
                    <span className="px-2 py-1 bg-(--color-success-soft)/40 rounded-md">
                      Total: {uploadData.totalRead || 0}
                    </span>
                    <span className="px-2 py-1 bg-(--color-primary-soft)/40 rounded-md text-(--color-primary)">
                      Saved: {uploadData.save || 0}
                    </span>
                  </div>
                </div>

                {uploadData.errors && uploadData.errors.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider opacity-70">
                        Details:
                      </span>
                      {uploadData.errors.length === 1 && (
                        <span className="text-[10px] bg-(--color-error-soft)/20 text-(--color-error) px-1.5 py-0.5 rounded border border-(--color-error-soft)/30">
                          Attention Required
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                      {uploadData.errors.map((msg, idx) => (
                        <div
                          key={idx}
                          className="text-sm border-l-2 border-(--color-primary) pl-3 py-1 bg-(--color-surface-muted)/30 rounded-r-md"
                        >
                          <span className="text-(--color-text)">{msg}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!uploadData.errors || uploadData.errors.length === 0) && (
                  <div className="text-xs opacity-90">
                    All rows processed and saved successfully!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default UploadCSVSection
