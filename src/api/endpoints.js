export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/Account/Login',
    LOGOUT: '/Account/Logout',
  },
  USER: {
    GET_MY_PROFILE: '/Account/GetMyProfile',
    CHANGE_PASSWORD: '/Account/ChangePassword',
    FORGET_PASSWORD: '/Account/ForgetPassword',
    RESET_PASSWORD: '/Account/ResetPassword',
    CREATE_NEW_USER: '/Account/CreateNewUser',
  },
  LEADS: {
    GET_ALL: '/LeadRequest/GetAllLeads',
    FILTER: '/LeadRequest/FilterLeads',
    GET_STATUS_LIST: '/LeadRequest/GetStatusList',
  },
  CALL_LOGS: {
    GET_ALL: '/CallLog/GetAllCallLogs',
    GET_BY_ID: '/CallLog/GetCallLogById',
    GET_CALL_OUTCOME: '/CallLog/GetCallOutcome',
  },
  CONVERSATION: {
    GET_DATA_BY_ID: '/GetConversationData/GetDataById',
    GET_AUDIO_BY_ID: '/GetConversationData/GetAudioById',
  },
  DEALS: {
    GET_ALL: '/Deals/GetAllDeals',
  },
  DASHBOARD: {
    GET_GLOBAL_ANALYTICS: '/Dashboard/GetGlobalAnalytics',
  },
}
