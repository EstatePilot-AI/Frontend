import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCallLogs } from '../../redux/slices/CallLogSlice/CallLogsReducer'
import { fetchLeads } from '../../redux/slices/LeadsSclice/LeadesReducer'
import { IoCallOutline } from 'react-icons/io5'
import { TbUsers } from 'react-icons/tb'
import Card from '../../components/ui/Card'

const DashBoard = () => {
  const dispatch = useDispatch()
  const { callLogs, loading: callsLoading } = useSelector((state) => state.callLogs)
  const { leads, loading: leadsLoading } = useSelector((state) => state.leads)

  useEffect(() => {
    dispatch(fetchCallLogs())
    dispatch(fetchLeads())
  }, [dispatch])

  const callLogsCount = callLogs.length
  const leadsCount = leads.length

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
      
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        <Card className="p-6" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">Total Call Logs</p>
              <p className="text-3xl font-bold text-gray-900">
                {callsLoading ? (
                  <span className="text-gray-400">Loading...</span>
                ) : (
                  callLogsCount
                )}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <IoCallOutline size={32} className="text-blue-600" />
            </div>
          </div>
        </Card>

        {/* Leads Card */}
        <Card className="p-6" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">Total Leads</p>
              <p className="text-3xl font-bold text-gray-900">
                {leadsLoading ? (
                  <span className="text-gray-400">Loading...</span>
                ) : (
                  leadsCount
                )}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TbUsers size={32} className="text-green-600" />
            </div>
          </div>
        </Card>
      </div>
      <Card className="p-6">
        <p className="text-gray-600">Welcome to your dashboard.</p>
      </Card>
    </div>
  )
}

export default DashBoard
