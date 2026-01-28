import api from '../api.js';

export const FETCH_UNASSIGNED_SERVICE_REQUEST_DATAS = ({
  commit
}, request) => {
  let sorting = request.pagination.descending ? 'asc' : 'desc';
  return api
    .get(
      "service-request/getRequest/5?page=" +
      request.pagination.page +
      "&size=" +
      request.pagination.rowsPerPage +
      "&searchTerm=" +
      request.filter +
      "&sort=" +
      request.pagination.sortBy +
      "&" +
      request.pagination.sortBy +
      ".dir=" +
      sorting
    )
    .then(response => {
      console.log("UNASSIGNED_SERVICE_REQUEST_DATAS-----------", JSON.stringify(response))
      commit('SET_UNASSIGNED_SERVICE_REQUEST_DATAS', response.data.data);
    });
};

export const FETCH_ASSIGNED_SERVICE_REQUEST_DATAS = ({
  commit
}, request) => {
  let sorting = request.pagination.descending ? 'asc' : 'desc';
  return api
    .get(
      "service-request/getRequest/2?page=" +
      request.pagination.page +
      "&size=" +
      request.pagination.rowsPerPage +
      "&searchTerm=" +
      request.filter +
      "&sort=" +
      request.pagination.sortBy +
      "&" +
      request.pagination.sortBy +
      ".dir=" +
      sorting
    )
    .then(response => {
      commit('SET_ASSIGNED_SERVICE_REQUEST_DATAS', response.data.data);
      console.log("1234567 ASSIGNED_SERVICE_REQUEST_DATAS-----------", JSON.stringify(response.data.data))
    });
};

export const FETCH_CLOSED_SERVICE_REQUEST_DATAS = ({
  commit
}, request) => {
  let sorting = request.pagination.descending ? 'asc' : 'desc';
  return api
    .get(
      "service-request/getRequest/3?page=" +
      request.pagination.page +
      "&size=" +
      request.pagination.rowsPerPage +
      "&searchTerm=" +
      request.filter +
      "&sort=" +
      request.pagination.sortBy +
      "&" +
      request.pagination.sortBy +
      ".dir=" +
      sorting
    )
    .then(response => {
      commit('SET_CLOSED_SERVICE_REQUEST_DATAS', response.data.data);
    });
};

export const FETCH_CANCELLED_SERVICE_REQUEST_DATAS = ({
  commit
}, request) => {
  let sorting = request.pagination.descending ? 'asc' : 'desc';
  return api
    .get(
      "service-request/getRequest/4?page=" +
      request.pagination.page +
      "&size=" +
      request.pagination.rowsPerPage +
      "&searchTerm=" +
      request.filter +
      "&sort=" +
      request.pagination.sortBy +
      "&" +
      request.pagination.sortBy +
      ".dir=" +
      sorting
    )
    .then(response => {
      commit('SET_CANCELLED_SERVICE_REQUEST_DATAS', response.data.data);
    });
};

// Remove unused commit parameter
export const SERVICE_REQUEST_UNASSIGED_TO_ASSIGNED_STATE = (context, request) => {
  console.log("SERVICE_REQUEST_UNASSIGED_TO_ASSIGNED_STATE-->", JSON.stringify(request))
  return api
    .post(
      "service-request/assignReqList/" + request.userId, request.request
    );
};

// Remove unused request parameter
export const FETCH_SERVICE_REQUEST_COUNT_DETAILS = ({commit}) => {
  return api
    .get("service-request/getRequestCount").then(response => {
      console.log("FETCH_SERVICE_REQUEST_COUNT_DETAILS", response)
      commit("SET_SERVICE_REQUEST_COUNT_DETAILS", response.data.data);
    });
};