import api from '../api.js';

export const FETCHING_INCOMING_POD_LIST_DETAILS = ({ commit }, request) => {
  let sorting = request.pagination.descending ? 'asc' : 'desc';
  return api
    .get(
      "spare-pod/getPod/1/2?page=" +
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
      commit('SET_INCOMING_POD_LIST_DETAILS', response.data.data);
    });
};

/* PHONEPE API START */
export const FETCHING_PHONEPE_INCOMING_POD_LIST_DETAILS = ({ commit }, request) => {
  let sorting = request.pagination.descending ? 'asc' : 'desc';
  return api
    .get(
      "aggregator-spare-parts/agg-getPod/1/2/" + 
      JSON.parse(localStorage.getItem("selectedTab").split('|')[1]) + 
      "?page=" +
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
      commit('SET_PHONEPE_INCOMING_POD_LIST_DETAILS', response.data.data);
    });
};
/* PHONEPE API END */

export const FETCHING_INCOMING_STOCKS_POD_LIST_DETAILS = ({ commit }, request) => {
  let sorting = request.pagination.descending ? 'asc' : 'desc';
  return api
    .get(
      "spare-pod/getPod/2/3?page=" +
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
      commit('SET_INCOMING_STOCKS_POD_LIST_DETAILS', response.data.data);
    });
};

/* PHONEPE API START */
export const FETCHING_PHONEPE_INCOMING_STOCKS_POD_LIST_DETAILS = ({ commit }, request) => {
  let sorting = request.pagination.descending ? 'asc' : 'desc';
  return api
    .get(
      "aggregator-spare-parts/agg-getPod/2/3/" + 
      JSON.parse(localStorage.getItem("selectedTab").split('|')[1]) + 
      "?page=" +
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
      commit('SET_PHONEPE_INCOMING_STOCKS_POD_LIST_DETAILS', response.data.data);
    });
};
/* PHONEPE API END */

export const FETCHING_INCOMING_ALLOCATED_SO_POD_LIST_DETAILS = ({ commit }, request) => {
  let sorting = request.pagination.descending ? 'asc' : 'desc';
  return api
    .get(
      "spare-pod/getPod/2/4?page=" +
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
      commit('SET_INCOMING_ALLOCATED_SO_POD_LIST_DETAILS', response.data.data);
    });
};

/* PHONEPE API START */
export const FETCHING_PHONEPE_INCOMING_ALLOCATED_SO_POD_LIST_DETAILS = ({ commit }, request) => {
  let sorting = request.pagination.descending ? 'asc' : 'desc';
  return api
    .get(
      "aggregator-spare-parts/agg-getPod/2/4/" + 
      JSON.parse(localStorage.getItem("selectedTab").split('|')[1]) + 
      "?page=" +
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
      commit('SET_PHONEPE_INCOMING_ALLOCATED_SO_POD_LIST_DETAILS', response.data.data);
    });
};
/* PHONEPE API END */

// These actions don't use the request parameter, so it's removed
export const FETCH_SPARE_PARTS_SETS_AND_COUNTS = ({commit}) => {
  return api
    .get("pod-region/regionSpareCount")
    .then(response => {
      commit('SET_SPARE_PARTS_SETS_AND_COUNTS', response.data.data);
    });
};

/* PHONEPE API START */
export const FETCH_PHONEPE_SPARE_PARTS_SETS_AND_COUNTS = ({commit}) => {
  return api
    .get("aggregator-spare-parts/agg-regionSpareCount/" + 
      JSON.parse(localStorage.getItem("selectedTab").split('|')[1]))
    .then(response => {
      commit('SET_PHONEPE_SPARE_PARTS_SETS_AND_COUNTS', response.data.data);
    });
};
/* PHONEPE API END */

// These actions don't use commit, so remove it from destructuring
export const REJECT_INCOMING_POD_DETAILS = (_, request) => {
  return api.post("spare-pod/updatePod/" + request.pod_number + "/0", request);
};

/* PHONEPE API START */
export const REJECT_PHONEPE_INCOMING_POD_DETAILS = (_, request) => {
  return api.post(
    "aggregator-spare-parts/agg-updatePod/" + 
    request.pod_number + 
    "/0/" + 
    JSON.parse(localStorage.getItem("selectedTab").split('|')[1]), 
    request
  );
};
/* PHONEPE API END */

export const APPROVE_INCOMING_POD_DETAILS = (_, request) => {
  return api.post("spare-pod/updatePod/" + request.pod_number + "/1", request);
};

/* PHONEPE API START */
export const APPROVE_PHONEPE_INCOMING_POD_DETAILS = (_, request) => {
  return api.post(
    "aggregator-spare-parts/agg-updatePod/" + 
    request.pod_number + 
    "/1/" + 
    JSON.parse(localStorage.getItem("selectedTab").split('|')[1]), 
    request
  );
};
/* PHONEPE API END */