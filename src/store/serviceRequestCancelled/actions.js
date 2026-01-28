import api from '../api.js'

// Remove unused request parameter
const FETCH_SERVICE_REQUEST_CANCELLED_DETAILS = ({commit}) => {
  return api.get('service-cancel/getServiceCancelReason').then(response => {
    console.log(
      'SERVICE REQUEST CANCELLED DETAILS FETCHED',
      response.data.data.length, 'items'
    )
    commit('SET_SERVICE_REQUEST_CANCELLED_DETAILS', response.data.data)
    return response
  })
}

// Remove unused commit parameter
const POST_CANCEL_STATUS_TYPES = (context, request) => {
  console.log('POST_SERVICE_CANCEL_TYPES --->', JSON.stringify(request))
  return api.post('service-cancel/createServiceCancelReason', request)
}

// Remove unused commit parameter
const EDIT_SERVICE_CANCEL_STATUS_TYPES = (context, request) => {
  console.log('SUBMIT SERVICE_STATUS_TYPES request', JSON.stringify(request))
  return api.put('service-cancel/updateServiceCancelReason/' + request.id, request.request)
}

// Remove unused commit parameter
const DELETE_SERVICE_CANCEL_STATUS_TYPES = (context, request) => {
  console.log('SUBMIT SERVICE_STATUS_TYPES request', JSON.stringify(request))
  return api.delete('service-cancel/deleteServiceCancelReason/' + request.id)
}

// Remove duplicate function or remove unused commit parameter
// Note: EDIT_CANCEL_STATUS_TYPES seems to be a duplicate of EDIT_SERVICE_CANCEL_STATUS_TYPES
const EDIT_CANCEL_STATUS_TYPES = (context, request) => {
  console.log("SUBMIT SERVICE_STATUS_TYPES request", JSON.stringify(request))
  return api.put("service-cancel/updateServiceCancelReason/" + request.id, request.request)
}

export default {
  FETCH_SERVICE_REQUEST_CANCELLED_DETAILS,
  POST_CANCEL_STATUS_TYPES,
  EDIT_SERVICE_CANCEL_STATUS_TYPES,
  DELETE_SERVICE_CANCEL_STATUS_TYPES,
  EDIT_CANCEL_STATUS_TYPES
};
