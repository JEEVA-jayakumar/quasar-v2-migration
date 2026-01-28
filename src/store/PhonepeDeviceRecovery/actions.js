// import * as Vue from 'vue'; // Removed - api doesn't exist in Vue 3
import api from "../api.js";

const FETCH_PHONEPE_DEVICE_RECOVERY_DATAS = ({ commit }, request) => {
  const tabId = JSON.parse(localStorage.getItem("selectedTab")?.split('|')[1] || 'null');
  const endpoint = tabId === '3' 
    ? "aggregator-inventory/agg-device-recovery-data-list" 
    : "aggregator-inventory/agg-device-recovery-data-lst";
  
  let sorting = request.pagination.descending ? 'asc' : 'desc';
  return api
    .get(
      `${endpoint}/?page=` +
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
      commit('SET_PHONEPE_DEVICE_RECOVERY_DATAS', response.data.data);
    });
};

function COMMON_FILE_DOWNLOAD(response) {
  return new Blob([response.data], {
    type: response.headers["content-type"],
  });
}

const DOWNLOAD_PHONEPE_DEVICE_RECOVERY_DATAS = async () => {
  // Removed unused _ and request parameters
  const tabId = JSON.parse(localStorage.getItem("selectedTab")?.split('|')[1] || 'null');
  const endpoint = tabId === '3' 
    ? "aggregator-inventory/agg-download-device-recovery-data-list" 
    : "aggregator-inventory/agg-download-device-recovery-list";
  
  try {
    const response = await api.get(endpoint, {
      responseType: "arraybuffer",
    });
    
    let blob = COMMON_FILE_DOWNLOAD(response);
    let link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "inventorywithsolist.xls";
    link.click();
    
    // Clean up
    window.URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Download failed:", error);
    throw error;
  }
};

const PHONEPE_VERIFY_DEVICE_AFTER_RECOVERY = (_, request) => {
  // Changed from _ to _ since commit is not used
  const tabId = JSON.parse(localStorage.getItem("selectedTab")?.split('|')[1] || 'null');
  
  return api.get(
    "aggregator-inventory/agg-device-recovery-scan-pick/" + tabId +
    "/" +
    request.device +
    "/" +
    request.barcode
  );
};

const FEED_PHONEPE_DEVICE_AFTER_SCANNED_TO_SUBMIT = ({ commit }, request) => {
  const tabId = JSON.parse(localStorage.getItem("selectedTab")?.split('|')[1] || 'null');
  
  return api
    .put("aggregator-inventory/agg-device-recovery-scan-pick-submit/" + tabId + "/" + request.deviceId + "/" + request.action, request.request)
    .then(() => {
      // Removed unused 'response' parameter
      // Note: API_RESPONSE_LOG expects an object, not boolean
      commit("API_RESPONSE_LOG", {
        apiStatusCode: 200,
        apiPending: false,
        apiSuccess: true,
        apiFailure: false,
        apiData: []
      });
      commit("SET_PHONEPE_DEVICE_AFTER_SCANNED_TO_SUBMIT", []);
    })
    .catch(error => {
      commit("API_RESPONSE_LOG", {
        apiStatusCode: error.response?.status || 500,
        apiPending: false,
        apiSuccess: false,
        apiFailure: true,
        apiData: error.response?.data || []
      });
    });
};

const FEED_PHONEPE_RECOVERY_DEVICE_BULK_UPLOAD_DATA = ({ commit }, request) => {
  // Removed unused rootState parameter
  const tabId = JSON.parse(localStorage.getItem("selectedTab")?.split('|')[1] || 'null');
  
  const formData = new FormData();
  formData.append('file', request.file);
  
  return api
    .put("aggregator-inventory/agg-add-bulk-recovery-device-to-inventory/" + tabId + "/" + request.action, formData, {
      headers: {
        "Content-Type": 'multipart/form-data',
        "Authorization": "Token " + localStorage.getItem("auth_token")
      }
    })
    .then(() => {
      // Removed unused 'response' parameter
      commit("API_RESPONSE_LOG", {
        apiStatusCode: 200,
        apiPending: false,
        apiSuccess: true,
        apiFailure: false,
        apiData: []
      });
    })
    .catch(error => {
      commit("API_RESPONSE_LOG", {
        apiStatusCode: error.response?.status || 500,
        apiPending: false,
        apiSuccess: false,
        apiFailure: true,
        apiData: error.response?.data || []
      });
    });
};

export default {
  FETCH_PHONEPE_DEVICE_RECOVERY_DATAS,
  DOWNLOAD_PHONEPE_DEVICE_RECOVERY_DATAS,
  PHONEPE_VERIFY_DEVICE_AFTER_RECOVERY,
  FEED_PHONEPE_DEVICE_AFTER_SCANNED_TO_SUBMIT,
  FEED_PHONEPE_RECOVERY_DEVICE_BULK_UPLOAD_DATA
};
