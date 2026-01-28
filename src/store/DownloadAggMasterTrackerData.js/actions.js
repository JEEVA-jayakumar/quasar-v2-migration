import api from "../api.js";

const AGG_MASTER_TRACKER_LIST_ALL_DATAS = async ({ commit }, request) => {
  const sorting = request.pagination.descending ? "asc" : "desc";

  const response = await api.get(
    `aggregator-inventory/agg-master-tracker-list?page=${request.pagination.page}` +
      `&size=${request.pagination.rowsPerPage}` +
      `&search=${request.filter}` +
      `&sort=${request.pagination.sortBy}` +
      `&${request.pagination.sortBy}.dir=${sorting}`
  );

  commit("SET_AGG_MASTER_TRACKER_LIST_ALL_DATAS", response.data.data);

  return response;
};


export default {
  AGG_MASTER_TRACKER_LIST_ALL_DATAS
};
