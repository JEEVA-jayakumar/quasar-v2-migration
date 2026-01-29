import api from "../api.js";

const REGIONAL_SUMMARY_LIST = ({commit}) => {
  // Removed unused 'request' parameter
  return api.get("getDevicesRegion").then(response => {
    commit("SET_REGIONAL_SUMMARY_LIST", response.data.data);
  });
};

const FETCH_ALL_SIM_STATUS_BY_REGION = ({ commit }, request) => {
  let sorting = request.pagination.descending ? "asc" : "desc";
  console.log("FILTER", request.filter);
  
  if (request.filter == '') {
    return api
      .get(
        "sim/getSimStatusByRegion?page=" +
        request.pagination.page +
        "&size=" +
        request.pagination.rowsPerPage +
        "&sort=" +
        request.pagination.sortBy +
        "&" +
        request.pagination.sortBy +
        ".dir=" +
        sorting
      )
      .then(response => {
        commit("SET_FETCH_ALL_SIM_STATUS_BY_REGION", response.data.data);
      });
  } else {
    return api
      .get(
        "sim/getSimStatusByRegion?page=" +
        request.pagination.page +
        "&size=" +
        request.pagination.rowsPerPage +
        "&search=" +
        request.filter +
        "&sort=" +
        request.pagination.sortBy +
        "&" +
        request.pagination.sortBy +
        ".dir=" +
        sorting
      )
      .then(response => {
        commit("SET_FETCH_ALL_SIM_STATUS_BY_REGION", response.data.data);
      });
  }
};

const FETCH_ALL_SIM_STATUS = ({ commit }, request) => {
  console.log("FILTER", request.filter);
  let sorting = request.pagination.descending ? "asc" : "desc";
  
  if (request.filter == '') {
    return api
      .get(
        "sim/getTotalSim?page=" +
        request.pagination.page +
        "&size=" +
        request.pagination.rowsPerPage +
        "&search=" +
        request.filter +
        "&sort=" +
        request.pagination.sortBy +
        "&" +
        request.pagination.sortBy +
        ".dir=" +
        sorting
      )
      .then(response => {
        commit("SET_FETCH_ALL_SIM_STATUS", response.data.data);
      });
  } else {
    return api
      .get(
        "sim/getTotalSim?page=" +
        request.pagination.page +
        "&size=" +
        request.pagination.rowsPerPage +
        "&search=" +
        request.filter +
        "&sort=" +
        request.pagination.sortBy +
        "&" +
        request.pagination.sortBy +
        ".dir=" +
        sorting
      )
      .then(response => {
        commit("SET_FETCH_ALL_SIM_STATUS", response.data.data);
      });
  }
};

export default {
  REGIONAL_SUMMARY_LIST,
  FETCH_ALL_SIM_STATUS_BY_REGION,
  FETCH_ALL_SIM_STATUS
};
