import api from "../api.js";

// Fetch device history
const DEVICE_WITH_HISTORY = async ({ commit }, request) => {
  // Remove unused 'sorting' variable
  // const sorting = request.pagination.descending ? "asc" : "desc";
  
  const response = await api.get(
    `getDeviceHistory?page=${request.pagination.page}&size=${request.pagination.rowsPerPage}&search=${request.filter}`
  );
  commit("SET_DEVICE_WITH_HISTORY", response.data.data);
  return response;
};

// Fetch aggregator device history
const AGGREGATORS_DEVICE_WITH_HISTORY = async ({ commit }, request) => {
  console.log("AGGREGATORS_DEVICE_WITH_HISTORY -------->", JSON.stringify(request));

  const selectedTabId = JSON.parse(localStorage.getItem("selectedTab").split('|')[1]);
  const response = await api.get(
    `aggregator-inventory/agg-getDeviceHistory/${selectedTabId}?page=${request.pagination.page}&size=${request.pagination.rowsPerPage}&search=${request.filter}`
  );
  commit("SET_AGGREGATORS_DEVICE_WITH_HISTORY", response.data.data);
  return response;
};

export default {
  DEVICE_WITH_HISTORY,
  AGGREGATORS_DEVICE_WITH_HISTORY
};
