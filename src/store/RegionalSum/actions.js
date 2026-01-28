import api from "../api.js";

export const REGIONAL_SUMMARY = ({ commit }, request) => {
  // Removed the unused 'sorting' variable
  return api
    .get(
      "getDevicesMenu?page=" +
      request.pagination.page +
      "&size=" +
      request.pagination.rowsPerPage +
      "&search=" +
      request.filter
    )
    .then(response => {
      commit("SET_REGIONAL_SUMMARY", response.data.data);
    });
};