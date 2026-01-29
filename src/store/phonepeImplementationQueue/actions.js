import api from "../api.js";

const PHONEPE_IMPLEMENTATION_QUEUE = (_, request) => {
  // Changed from _ to _ since commit is not used
  console.log("ACTION REQUEST------------>", JSON.stringify(request));
  return api.put("implementation-queue-assigned-to/" + request.userId + "/" + request.action, request);
};

const PHONEPE_IMPLEMENTATION_QUEUE_UNASSIGNED_LIST = ({ commit }, request) => {
  console.log("request of Unassigned datas----------->", request);
  let sorting = request.pagination.descending ? "asc" : "desc";
  console.log("Implementation Queue Unassigned Data : " + request);
  
  const tabId = JSON.parse(localStorage.getItem("selectedTab")?.split('|')[1] || 'null');
  
  return api.get(
    "implementation-queue-list-PhonePe-lead/" + tabId + "/unassigned" +
    "?page=" + request.pagination.page +
    "&size=" + request.pagination.rowsPerPage +
    "&search=" + request.filter +
    "&sort=" + request.pagination.sortBy +
    "&" + request.pagination.sortBy +
    ".dir=" + sorting
  ).then(response => {
    console.log("response of Unassigned datas----------->", response);
    commit("SET_PHONEPE_IMPLEMENTATION_QUEUE_UNASSIGNED_LIST", response.data.data);
  });
};

const PHONEPE_IMPLEMENTATION_QUEUE_ASSIGNED_LIST = ({ commit }, request) => {
  let sorting = request.pagination.descending ? "asc" : "desc";
  const tabId = JSON.parse(localStorage.getItem("selectedTab")?.split('|')[1] || 'null');
  
  return api.get(
    "implementation-data-with-without-courier-device/0/0/" + tabId +
    "?page=" + request.pagination.page +
    "&size=" + request.pagination.rowsPerPage +
    "&search=" + request.filter +
    "&sort=" + request.pagination.sortBy +
    "&" + request.pagination.sortBy +
    ".dir=" + sorting
  ).then(response => {
    console.log("response of Unassigned datas----------->", response);
    commit("SET_PHONEPE_IMPLEMENTATION_QUEUE_ASSIGNED_LIST", response.data.data);
  });
};

const PHONEPE_IMPLEMENTATION_QUEUE_COURIER_LIST = ({ commit }, request) => {
  let sorting = request.pagination.descending ? "asc" : "desc";
  const tabId = JSON.parse(localStorage.getItem("selectedTab")?.split('|')[1] || 'null');
  
  return api.get(
    "implementation-data-with-without-courier-device/0/1/" + tabId +
    "?page=" + request.pagination.page +
    "&size=" + request.pagination.rowsPerPage +
    "&search=" + request.filter +
    "&sort=" + request.pagination.sortBy +
    "&" + request.pagination.sortBy +
    ".dir=" + sorting
  ).then(response => {
    console.log("response of Unassigned courier datas----------->", response);
    commit("SET_PHONEPE_IMPLEMENTATION_QUEUE_COURIER_LIST", response.data.data);
  });
};

const PHONEPE_CANCELLED_MERCHANTS = ({ commit }, request) => {
  let sorting = request.pagination.descending ? "asc" : "desc";
  const tabId = JSON.parse(localStorage.getItem("selectedTab")?.split('|')[1] || 'null');
  
  return api.get(
    "get-cancel-onboard-phonepe-list/" + tabId +
    "?page=" + request.pagination.page +
    "&size=" + request.pagination.rowsPerPage +
    "&search=" + request.filter +
    "&sort=" + request.pagination.sortBy +
    "&" + request.pagination.sortBy +
    ".dir=" + sorting
  ).then(response => {
    console.log("response of Cancelledmerchants----------->", response);
    commit("SET_PHONEPE_CANCELLED_MERCHANTS", response.data.data);
  });
};

/* PHONEPE API START */
const PHONEPE_IMPLEMENTATION_QUEUE_SUBMIT = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.put(
    "Aggregator-implementation-queue-assigned-to/" + request.userId + "/" + request.action,
    request
  );
};
/* PHONEPE API END */

/* PHONEPE API START */
const PHONEPE_CANCELLED_MERCHANT_SUBMIT = (_, request) => {
  // Changed from _ to _ since commit is not used
  // console.log("REQUEST------------------->"+JSON.stringify(request.leadInformation.id))
  return api.post(
    "cancelOnBoarding/" + 1 + "/" + 1,
    request
  );
};
/* PHONEPE API END */

const CHANGE_REGION = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.post("reassign-region", request);
};

export default {
  PHONEPE_IMPLEMENTATION_QUEUE,
  PHONEPE_IMPLEMENTATION_QUEUE_UNASSIGNED_LIST,
  PHONEPE_IMPLEMENTATION_QUEUE_ASSIGNED_LIST,
  PHONEPE_IMPLEMENTATION_QUEUE_COURIER_LIST,
  PHONEPE_CANCELLED_MERCHANTS,
  PHONEPE_IMPLEMENTATION_QUEUE_SUBMIT,
  PHONEPE_CANCELLED_MERCHANT_SUBMIT,
  CHANGE_REGION
};
