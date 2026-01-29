import api from "../api.js";

/* ===========================
   DEVICE REPLACEMENT QUEUE
=========================== */

const DEVICE_REPLACEMENT_QUEUE_ASSIGNED_LIST = async ({ commit }, request) => {
  const sorting = request.pagination.descending ? "asc" : "desc";
  const sortBy = request.pagination.sortBy || "createdAt";

  const response = await api.get(
    `DeviceReplacement-queue-list/assigned?page=${request.pagination.page}` +
    `&size=${request.pagination.rowsPerPage}` +
    `&searchterm=${request.filter}` +
    `&sort=${sortBy}` +
    `&${sortBy}.dir=${sorting}`
  );

  commit("SET_DEVICE_REPLACEMENT_QUEUE_ASSIGNED_LIST", response.data.data);
  return response;
};

const DEVICE_REPLACEMENT_QUEUE_UNASSIGNED_LIST = async ({ commit }, request) => {
  const sorting = request.pagination.descending ? "asc" : "desc";
  const sortBy = request.pagination.sortBy || "createdAt";

  const response = await api.get(
    `DeviceReplacement-queue-list?page=${request.pagination.page}` +
    `&size=${request.pagination.rowsPerPage}` +
    `&searchterm=${request.filter}` +
    `&sort=${sortBy}` +
    `&${sortBy}.dir=${sorting}`
  );

  commit("SET_DEVICE_REPLACEMENT_QUEUE_UNASSIGNED_LIST", response.data.data);
  return response;
};

// Remove unused 'commit' parameter
const DEVICE_REPLACEMENT_QUEUE_SUBMIT = async (_, request) => {
  return await api.put(
    `DeviceReplacement-assigned-to/${request.userId}`,
    request
  );
};

// Remove unused 'commit' parameter
const DEVICE_REPLACEMENT_QUEUE_REASSIGN = async (_, request) => {
  return await api.put(
    `DeviceReplacement-ReAssigned-to/${request.userId}`,
    {
      marsDeviceIds: request.marsDeviceIds,
      userId: request.userId
    }
  );
};

// Remove unused 'commit' parameter
const DEVICE_REPLACEMENT_QUEUE_UNASSIGN = async (_, request) => {
  return await api.put(
    "DeviceReplacement-unassigned-to",
    {
      marsDeviceIds: request.marsDeviceIds,
      userId: request.userId
    }
  );
};

/* ===========================
   EQUITAS ONBOARDING QUEUE
=========================== */

const EQUITAS_ONBOARDING_QUEUE_ASSIGNED_LIST = async ({ commit }, request) => {
  const sorting = request.pagination.descending ? "asc" : "desc";
  const sortBy = request.pagination.sortBy || "createdAt";

  const response = await api.get(
    `getAssidn-list-equitas?page=${request.pagination.page}` +
    `&size=${request.pagination.rowsPerPage}` +
    `&search=${request.filter}` +
    `&sort=${sortBy}` +
    `&${sortBy}.dir=${sorting}`
  );

  commit("SET_EQUITAS_ONBOARDING_QUEUE_ASSIGNED_LIST", response.data.data);
  return response;
};

const EQUITAS_ONBOARDING_QUEUE_UNASSIGNED_LIST = async ({ commit }, request) => {
  const sorting = request.pagination.descending ? "asc" : "desc";
  const sortBy = request.pagination.sortBy || "createdAt";

  const response = await api.get(
    `getUnAssignSatEquitasImplementationLeads?page=${request.pagination.page}` +
    `&size=${request.pagination.rowsPerPage}` +
    `&search=${request.filter}` +
    `&sort=${sortBy}` +
    `&${sortBy}.dir=${sorting}`
  );

  commit("SET_EQUITAS_ONBOARDING_QUEUE_UNASSIGNED_LIST", response.data.data);
  return response;
};

const EQUITAS_ONBOARDING_QUEUE_COMPLETED_LIST = async ({ commit }, request) => {
  const sorting = request.pagination.descending ? "asc" : "desc";
  const sortBy = request.pagination.sortBy || "createdAt";

  const response = await api.get(
    `getEquitasCompletedLead/1?page=${request.pagination.page}` +
    `&size=${request.pagination.rowsPerPage}` +
    `&search=${request.filter}` +
    `&sort=${sortBy}` +
    `&${sortBy}.dir=${sorting}`
  );

  commit("SET_EQUITAS_ONBOARDING_QUEUE_COMPLETED_LIST", response.data.data);
  return response;
};

/* ===========================
   EQUITAS ACTIONS
=========================== */

// Remove unused 'commit' parameter
const EQUITAS_SOUNDBOX_REQUEST_UNASSIGED_TO_ASSIGNED_STATE = async (_, request) => {
  return await api.put(
    `equitasSoAssign/1/${request.userId}`,
    request.marsDeviceIds
  );
};

// Remove unused 'commit' parameter
const EQUITAS_SOUNDBOX_REASSIGNED_REASON_TYPE_DETAILS = async (_, request) => {
  return await api.put(
    `equitasSoAssign/3/${request.userId}`,
    request.marsDeviceIds
  );
};

// Remove unused 'commit' parameter
const EQUITAS_ONBOARDING_REQUEST_TO_ASSIGNED_REGION = async (_, request) => {
  return await api.put(
    `region-reasign-equitas/${request.regionCode}`,
    JSON.stringify(request.marsDeviceIds)
  );
};

export default {
  DEVICE_REPLACEMENT_QUEUE_ASSIGNED_LIST,
  DEVICE_REPLACEMENT_QUEUE_UNASSIGNED_LIST,
  DEVICE_REPLACEMENT_QUEUE_SUBMIT,
  DEVICE_REPLACEMENT_QUEUE_REASSIGN,
  DEVICE_REPLACEMENT_QUEUE_UNASSIGN,
  EQUITAS_ONBOARDING_QUEUE_ASSIGNED_LIST,
  EQUITAS_ONBOARDING_QUEUE_UNASSIGNED_LIST,
  EQUITAS_ONBOARDING_QUEUE_COMPLETED_LIST,
  EQUITAS_SOUNDBOX_REQUEST_UNASSIGED_TO_ASSIGNED_STATE,
  EQUITAS_SOUNDBOX_REASSIGNED_REASON_TYPE_DETAILS,
  EQUITAS_ONBOARDING_REQUEST_TO_ASSIGNED_REGION
};
