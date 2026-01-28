const API_RESPONSE_LOG = (state, payload) => {
  let statusMessage

  if (payload.apiStatusCode === 200) {
    statusMessage = 'Success'
  } else if (payload.apiStatusCode === 409) {
    statusMessage = 'Data conflict!'
  } else if (payload.apiStatusCode === 400) {
    statusMessage = 'Bad Request! Please try again'
  } else {
    statusMessage = 'Oops! Something went wrong, please try again'
  }

  state.apiStatusLog = {
    apiStatusCode: payload.apiStatusCode,
    apiStatusMessage: statusMessage,
    apiPending: payload.apiPending,
    apiSuccess: payload.apiSuccess,
    apiFailure: payload.apiFailure,
    apiData: payload.apiData
  }
}

const SET_FETCH_CRM_GLOBAL_SEARCH_DATAS = (state, payload) => {
  state.crmGlobalSearchTicketId = payload
}


export default {
  API_RESPONSE_LOG,
  SET_FETCH_CRM_GLOBAL_SEARCH_DATAS
};
