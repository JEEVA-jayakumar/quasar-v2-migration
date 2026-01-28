import api from '../api.js';

export const FETCHING_APPROVED_POD_LIST_DETAILS = ({
  commit
}, request) => {
  console.log("API ACTION REQUEST DETAILS-------->",request)
  let sorting = request.pagination.descending ? 'asc' : 'desc';
  return api
    .get(
      "spare-pod/getPod"+"/3"+"/5?page=" +
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
      commit('SET_APPROVED_POD_LIST_DETAILS', response.data.data);
    });
};

export const FETCHING_PHONEPE_APPROVED_POD_LIST_DETAILS = ({
  commit
}, request) => {
  console.log("API ACTION REQUEST DETAILS-------->",request)
  let sorting = request.pagination.descending ? 'asc' : 'desc';
  return api
    .get(
      "aggregator-spare-parts/agg-getPod"+"/3"+"/5"+"/"+JSON.parse(localStorage.getItem("selectedTab").split('|')[1])+"?page=" +
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
      commit('SET_PHONEPE_APPROVED_POD_LIST_DETAILS', response.data.data);
    });
};

export const FETCHING_REJECTED_POD_LIST_DETAILS = ({
  commit
}, request) => {
  console.log("API ACTION REQUEST DETAILS-------->",request)
  let sorting = request.pagination.descending ? 'asc' : 'desc';
  return api
    .get(
      "spare-pod/getPod"+"/2"+"/6?page=" +
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
      commit('SET_REJECTED_POD_LIST_DETAILS', response.data.data);
    });
};

export const FETCHING_PHONEPE_REJECTED_POD_LIST_DETAILS = ({
  commit
}, request) => {
  console.log("API ACTION REQUEST DETAILS-------->",request)
  let sorting = request.pagination.descending ? 'asc' : 'desc';
  return api
    .get(
      "aggregator-spare-parts/agg-getPod"+"/2"+"/6"+"/"+JSON.parse(localStorage.getItem("selectedTab").split('|')[1])+"?page=" +
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
      commit('SET_PHONEPE_REJECTED_POD_LIST_DETAILS', response.data.data);
    });
};

// Remove unused commit and rootState parameters
export const UPDATE_SO_REJECTED_POD_DETAILS = (context, request) => {
  console.log("SUBMIT request ----> Action",JSON.stringify(request))
  return api.post("spare-pod/updatePod/"+request.pod_number+"/2", request)
};