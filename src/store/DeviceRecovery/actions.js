import api from "../api.js";

const DEVICE_RECOVERY_ASSIGNED_LIST = async ({ commit }, request) => {
  const sorting = request.pagination.descending ? "asc" : "desc";

  const response = await api.get(
    `device-recovery-tracker-list/assigned?page=${request.pagination.page}` +
    `&size=${request.pagination.rowsPerPage}` +
    `&searchterm=${request.filter}` +
    `&sort=${request.pagination.sortBy}` +
    `&${request.pagination.sortBy}.dir=${sorting}`
  );

  commit("SET_DEVICE_RECOVERY_ASSIGNED_LIST", response.data.data);
  return response;
};

const DEVICE_RECOVERY_UNASSIGNED_LIST = async ({ commit }, request) => {
  const sorting = request.pagination.descending ? "asc" : "desc";
  const sortBy = request.pagination.sortBy || "createdAt";

  const response = await api.get(
    `device-recovery-tracker-list/?page=${request.pagination.page}` +
    `&size=${request.pagination.rowsPerPage}` +
    `&searchterm=${request.filter}` +
    `&sort=${sortBy}` +
    `&${sortBy}.dir=${sorting}`
  );

  commit("SET_DEVICE_RECOVERY_UNASSIGNED_LIST", response.data.data);
  return response;
};

// Remove unused 'commit' parameter
const DEVICE_RECOVERY_SUBMIT = async (_, request) => {
  const response = await api.put(
    `device-recovery-assigned-to/${request.userId}`,
    request
  );
  return response;
};

export default {
  DEVICE_RECOVERY_ASSIGNED_LIST,
  DEVICE_RECOVERY_UNASSIGNED_LIST,
  DEVICE_RECOVERY_SUBMIT
};
