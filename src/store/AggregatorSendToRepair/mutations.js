const API_PHONEPE_RESPONSE_LOG = (state, payload) => {
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

const SET_PHONEPE_SEND_TO_REPAIR_DATA = (state, payload) => {
  state.PhonepeSendToRepairDetails = payload
}

const SET_PHONEPE_ALL_MOVED_TO_SCRAP_DATA = (state, payload) => {
  state.PhonepeMovedToScrapDetails = payload
}


export default {
  API_PHONEPE_RESPONSE_LOG,
  SET_PHONEPE_SEND_TO_REPAIR_DATA,
  SET_PHONEPE_ALL_MOVED_TO_SCRAP_DATA
};
