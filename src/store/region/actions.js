import api from "../api.js";

export const DEVICE_WITH_BPREGION = ({ commit }, request) => {
  if (request.filter == '') {
    return api
      .get(
        "getAllBpRegionsMenu?page=" +
        request.pagination.page +
        "&size=" +
        request.pagination.rowsPerPage
      )
      .then(response => {
        commit("SET_DEVICE_WITH_BPREGION", response.data.data);
      });
  } else {
    return api
      .get(
        "getAllBpRegionsMenu?page=" +
        request.pagination.page +
        "&size=" +
        request.pagination.rowsPerPage +
        "&search=" +
        request.filter
      )
      .then(response => {
        commit("SET_DEVICE_WITH_BPREGION", response.data.data);
      });
  }
};