// import * as Vue from "vue" // Removed - api doesn't exist in Vue 3
import api from "./api.js";

/* START >> Store modules => Super Admin Users */
const InventoryBulkUploadDevice = {
  namespaced: true,

  /* ===================================
    >>>>>>>>>>>>>>>>STATE<<<<<<<<<<<<<<<<<
    ====================================== */

  /*START >> State setup goes here */
  state: {
    allStatesData: [],
    apiStatusLog: {
      apiStatusCode: null,
      apiPending: false,
      apiSuccess: false,
      apiFailure: false,
      apiData: []
    },

    /*START >> Module>> all allInventoryDevicesTypesData data*/
    allInventoryDevicesTypesData: [],
    /*END >> Module>> allInventoryDevicesTypesData data*/
  },
  /*END << State setup goes here */

  /* ===================================
    >>>>>>>>>>>>>>>>MUTATIONS<<<<<<<<<<<<<<<<<
    ====================================== */

  /*START >> Mutation actions goes here */
  mutations: {
    API_RESPONSE_LOG(state, payload) {
      console.log("API_RESPONSE >>", payload);
      let statusMessage;
      if (payload.apiStatusCode == 200) {
        statusMessage = "Success";
      } else if (payload.apiStatusCode == 409) {
        statusMessage = "Data confict!";
      } else if (payload.apiStatusCode == 400) {
        statusMessage = "Bad Request! Please try again";
      } else {
        statusMessage = "Oops! Something went wrong, please again";
      }
      state.apiStatusLog = {
        apiStatusCode: payload.apiStatusCode,
        apiStatusMessage: statusMessage,
        apiPending: payload.apiPending,
        apiSuccess: payload.apiSuccess,
        apiFailure: payload.apiFailure,
        apiData: payload.apiData
      };
      console.log("state.apiPending >>", state.apiStatusLog.apiPending);
      console.log("state.apiSuccess >>", state.apiStatusLog.apiSuccess);
      console.log("state.apiFailure >>", state.apiStatusLog.apiFailure);
      console.log(
        "state.apiStatusMessage >>",
        state.apiStatusLog.apiStatusMessage
      );
    },

    /*START >> Module>> device types data*/
    SET_ALL_INVENTORY_DEVICES_TYPES_DATA(state, payload) {
      console.log("SET_ALL_INVENTORY_DEVICES_TYPES_DATA >>", payload);
      state.allInventoryDevicesTypesData = payload;
    },
    /*END >> Module>> device types data*/
  },
  /*END << Mutation actions goes here */

  /* ===================================
    >>>>>>>>>>>>>>>>ACTIONS<<<<<<<<<<<<<<<<<
    ====================================== */

  /*START >> All actions like vuex, goes here*/
  actions: {
    /*START >> Module>> DEVICES_TYPES_DATA*/
    FETCH_ALL_INVENTORY_DEVICES_TYPES_DATA({commit}) {
      // Removed unused 'request' parameter
      return api
        .get("device")
        .then(response => {
          console.log(
            "RESPONSE >> PASSED >> FETCH_ALL_INVENTORY_DEVICES_TYPES_DATA",
            response
          );
          // commit("API_RESPONSE_LOG", true); // This expects an object, not boolean
          console.log(
            "PASSED >> FETCH_ALL_INVENTORY_DEVICES_TYPES_DATA >>",
            response.data.data
          );
          // START=> COMMIT with data received'
          commit("SET_ALL_INVENTORY_DEVICES_TYPES_DATA", response.data.data);
          // END=> COMMIT with data received'
        });
    },

    /*START >> Module>> device tracker inventory scanned data*/
    FEED_DEVICE_BULK_UPLOAD_DATA({ commit }, request) {
      // Using api instead of api for Vue 3 compatibility
      const formData = new FormData();
      formData.append('file', request.file);

      return api
        .post(`inventory/add-bulk-device-to-central-inventory/${request.device_type}`, formData, {
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
    },

    /* PHONEPE API START*/
    FEED_PHONEPE_DEVICE_BULK_UPLOAD_DATA({ commit }, request) {
      const formData = new FormData();
      formData.append('file', request.file);

      return api
        .post(`aggregator-inventory/add-bulk-device-to-agg-central-inventory/${request.device_type}/${request.aggregator}`, formData, {
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
    },
    /* PHONEPE API END*/

    /*END >> Module>> inventory scan data*/
    FEED_PHONEPE_SEND_TO_REPAIR_DEVICE_BULK_UPLOAD_DATA({ commit }, request) {
      const formData = new FormData();
      formData.append('file', request.file);

      return api
        .put("inventory/add-bulk-device-for-sent-to-repair", formData, {
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
    },

    FEED_PHONEPE_MOVIE_TO_SCRAP_DEVICE_BULK_UPLOAD_DATA({ commit }, request) {
      const formData = new FormData();
      formData.append('file', request.file);

      return api
        .put("inventory/add-bulk-device-for-moved-to-scrap", formData, {
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
    },
  },
  /*END << All actions like vuex, goes here */

  /* ===================================
    >>>>>>>>>>>>>>>>GETTERS<<<<<<<<<<<<<<<<<
    ====================================== */

  /*START >> getter actions goes here*/
  getters: {
    getAllInventoryDevicesTypesData(state) {
      return state.allInventoryDevicesTypesData;
    },
  }
  /*END << getter actions goes here */
};
/* END >> Store modules => Super Admin Users */

/* ============================================
  >>>>>>>>>>>>>>>>FINAL EXPORT<<<<<<<<<<<<<<<<<
  ========================================== */
export default InventoryBulkUploadDevice;