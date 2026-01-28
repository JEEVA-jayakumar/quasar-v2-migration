export const API_RESPONSE_LOG = (state, payload) => {
  console.log('API_RESPONSE >>', payload)

  let statusMessage = 'Oops! Something went wrong, please again'

  if (payload.apiStatusCode === 200) {
    statusMessage = 'Success'
  } else if (payload.apiStatusCode === 409) {
    statusMessage = 'Data conflict!'
  } else if (payload.apiStatusCode === 400) {
    statusMessage = 'Bad Request! Please try again'
  }

  state.apiStatusLog = {
    apiStatusCode: payload.apiStatusCode,
    apiStatusMessage: statusMessage,
    apiPending: payload.apiPending,
    apiSuccess: payload.apiSuccess,
    apiFailure: payload.apiFailure,
    apiData: payload.apiData
  }

  console.log('state.apiStatusLog >>', state.apiStatusLog)
}

export const SET_ADDITIONAL_TID_DATAS = (state, payload) => {
  console.log(
    'ADDITIONAL TID Payload ------------ : ',
    JSON.stringify(payload)
  )
  state.additionalTid = payload
}

export const SET_ADDITIONAL_TID_VERIFY_DATA = (state, payload) => {
  console.log(
    'ADDITIONAL TID VERIFY Payload ------------ : ',
    JSON.stringify(payload)
  )
  state.additionalTidVerifyData = payload
}
