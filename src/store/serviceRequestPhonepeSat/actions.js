import api from '../api.js'

export const FETCH_PHONEPE_UNASSIGNED_SERVICE_REQUEST_DATAS1 = ({
  commit
}, request) => {
  let sorting = request.pagination.descending ? 'asc' : 'desc'
  return api
    .get(
      'service-request/getTptRequest/5/1?page=' +
      request.pagination.page +
      '&size=' +
      request.pagination.rowsPerPage +
      '&searchTerm=' +
      request.filter +
      '&sort=' +
      request.pagination.sortBy +
      '&' +
      request.pagination.sortBy +
      '.dir=' +
      sorting
    )
    .then(response => {
      commit('SET_PHONEPE_UNASSIGNED_SERVICE_REQUEST_DATAS', response.data.data)
      return response
    })
}

export const FETCH_PHONEPE_ASSIGNED_SERVICE_REQUEST_DATAS = ({
  commit
}, request) => {
  let sorting = request.pagination.descending ? 'asc' : 'desc'
  return api
    .get(
      'service-request/getTptRequest/2/1?page=' +
        request.pagination.page +
        '&size=' +
        request.pagination.rowsPerPage +
        '&searchTerm=' +
        request.filter +
        '&sort=' +
        request.pagination.sortBy +
        '&' +
        request.pagination.sortBy +
        '.dir=' +
        sorting
    )
    .then(response => {
      commit('SET_PHONEPE_ASSIGNED_SERVICE_REQUEST_DATAS', response.data.data)
    })
}

export const FETCH_PHONEPE_CANCELLED_SERVICE_REQUEST_DATAS = ({
  commit
}, request) => {
  let sorting = request.pagination.descending ? 'asc' : 'desc'
  return api
    .get(
      'service-request/getTptRequest/4/1?page=' +
        request.pagination.page +
        '&size=' +
        request.pagination.rowsPerPage  +
        '&searchTerm=' +
        request.filter +
        '&sort=' +
        request.pagination.sortBy +
        '&' +
        request.pagination.sortBy +
        '.dir=' +
        sorting
    )
    .then(response => {
      commit('SET_PHONEPE_CANCELLED_SERVICE_REQUEST_DATAS', response.data.data)
      return response
    })
}

// Remove unused commit parameter
export const PHONEPE_SERVICE_REQUEST_UNASSIGED_TO_ASSIGNED_STATE = (context, request) => {
  console.log('PHONEPE_SERVICE_REQUEST_UNASSIGED_TO_ASSIGNED_STATE-->', JSON.stringify(request))
  return api
    .post(
      'service-request/assignReqList/' + request.userId, request.request
    )
}

// Remove unused commit parameter
export const PHONEPE_SERVICE_REQUEST_TO_ASSIGNED_REGION = (context, request) => {
  return api
    .post(
      'crm-request/change-region', JSON.stringify(request)
    )
}

// Remove unused request parameter
export const FETCH_PHONEPE_SERVICE_REQUEST_COUNT_DETAILS = ({commit}) => {
  return api
    .get('service-request/getRequestCount').then(response => {
      console.log('FETCH_PHONEPE_SERVICE_REQUEST_COUNT_DETAILS', response)
      commit('SET_PHONEPE_SERVICE_REQUEST_COUNT_DETAILS', response.data.data)
    })
}

export const FETCH_PHONEPE_REOPEN_TICKET = ({
  commit
}, request) => {
  let sorting = request.pagination.descending ? 'asc' : 'desc'
  return api
    .get(
      'service-request/getTptRequest/6/1?page=' +
      request.pagination.page +
      '&size=' +
      request.pagination.rowsPerPage +
      '&searchTerm=' +
      request.filter +
      '&sort=' +
      request.pagination.sortBy +
      '&' +
      request.pagination.sortBy +
      '.dir=' +
      sorting
    )
    .then(response => {
      commit('SET_FETCH_PHONEPE_REOPEN_TICKET', response.data.data)
    })
}

export const FETCH_PHONEPE_REOPENED_ASSIGNED_TICKET = ({
  commit
}, request) => {
  console.log("Request", JSON.stringify(request))
  let sorting = request.pagination.descending ? 'asc' : 'desc'
  return api
    .get(
      'service-request/getTptRequest/7/1?page=' + 
        request.pagination.page +
        '&size=' +
        request.pagination.rowsPerPage +
        '&searchTerm=' +
        request.filter +
        '&sort=' +
        request.pagination.sortBy +
        '&' +
        request.pagination.sortBy +
        '.dir=' +
        sorting
    )
    .then(response => {
      commit('SET_FETCH_PHONEPE_REOPENED_ASSIGNED_TICKET', response.data.data)
    })  
}

// Remove unused commit parameter
export const PHONEPE_REOPENED_UNASSIGED_TO_ASSIGNED_STATE = (context, request) => {
  return api
    .post(
      'service-request/assignTicket/' + request.userId + "/1", request.request
    )
}

export const FETCH_PHONEPE_OPENED_TICKETS = ({
  commit
}, request) => {
  let sorting = request.pagination.descending ? 'asc' : 'desc'
  return api
    .get(
      'service-request/v1/getTptRequest/1?page=' +
        request.pagination.page +
        '&size=' +
        request.pagination.rowsPerPage  +
        '&searchTerm=' +
        request.filter +
        '&sort=' +
        request.pagination.sortBy +
        '&' +
        request.pagination.sortBy +
        '.dir=' +
        sorting
    )
    .then(response => {
      commit('SET_PHONEPE_OPENED_TICKETS', response.data.data)
      return response
    })
}

export const FETCH_PHONEPE_RESOLVED_TICKET = ({
  commit
}, request) => {
  let sorting = request.pagination.descending ? 'asc' : 'desc'
  return api
  .get(
          'service-request/getTptRequest/3/1?page=' +
            request.pagination.page +
            '&size=' +
            request.pagination.rowsPerPage +
            '&searchTerm=' +
            request.filter +
            '&sort=' +
            request.pagination.sortBy +
            '&' +
            request.pagination.sortBy +
            '.dir=' +
            sorting
        )
    .then(response => {
      commit('SET_PHONEPE_RESOLVED_TICKET', response.data.data)
      return response
    })
}

// Remove unused commit parameter
export const PHONEPE_PICKUP_TICKET_ASSIGNED = (context, request) => {
  console.log('PHONEPE_PICKUP_TICKET_ASSIGNED-->', JSON.stringify(request))
  return api
    .post(
      'service-request/assignReqList/' + request.userId, request.request
    )
}

// Remove unused commit parameter
export const PHONEPE_REASSIGNED_MERCHANT_TICKETS = (context, request) => {
  console.log("PHONEPE_REASSIGNED_MERCHANT_TICKETS", JSON.stringify(request))
  return api
  .post(
    'service-request/assignTicket/' + request.userId + "/2", request.request
  )
}

export const CRM_LOGS_LISTS = ({
  commit
}, request) => {
  return api
    .get("call-log/fetch-data/" + request.subTicketsId)
    .then(response => {
      commit("SET_CRM_LOGS_LISTS", response.data.data)
    })
}

export const ASSIGN_HISTORY_REMARKS_LIST = ({
  commit
}, request) => {
  return api
    .get("assign-history/" + request.Id)
    .then(response => {
      commit("SET_ASSIGN_HISTORY_REMARKS_LIST", response.data.data)
    })
}