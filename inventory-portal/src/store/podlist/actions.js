import api from "../api.js";
// Removed unused Vue import

const FETCH_POD_LIST = ({
    commit
  }, request) => {
     let sorting = request.pagination.descending ? 'asc' : 'desc';
    return api
      .get(
        'pod-list?page=' +
        request.pagination.page +
        '&size=' +
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
        commit('SET_ALL_POD_LIST', response.data.data);
      });
  };

export default {
  FETCH_POD_LIST
};
