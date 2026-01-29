// Removed unused imports: import api from "../api.js"; import * as Vue from "vue";
// Keep api import if you might use it later
import api from "../api.js";

const FECTCH_MCC_BASED_LEADSOURCE = (_, request) => {
  // Changed from { commit, rootState } to _ since neither is used
  // Using api instead of api for Vue 3 compatibility
  
  // Note: You'll need to adjust this to use your api instance
  // If you need rootState.GlobalVariables.STATE_LOCAL_API, you have options:
  
  return api
    .post("getMccLeadSourceBasedOnMccAndLeadSource", request);
};

export default {
  FECTCH_MCC_BASED_LEADSOURCE
};
