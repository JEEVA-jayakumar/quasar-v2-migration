// Removed unused imports: import api from "../api.js"; import * as Vue from "vue";
// Keep api import if you might use it later
import api from "../api.js";

export const LEAD_AND_DEVICE_BASED_RENTAL1 = ({
  commit
}, request) => {
  console.log("ACTION LEAD_AND_DEVICE_BASED_RENTAL 124345 -------->", JSON.stringify(request));
  
  // Using api instead of api for Vue 3 compatibility
  return api.get("https://smart.bijlipay.co.in:8080/staticApi/plan-and-deivce-list-based-on-lead-source/" + request.leadSource + "/" + request.device)
    .then(response => {
      // Using map() properly - removing unused 'key' parameter
      const rental = response.data.data.plan.map(function (value) {
        return {
          label: value.planName,
          value: value,
        };
      });
      commit("LEAD_SOURCE_BASED_RENTAL", rental);
    })
    .catch(error => {
      console.error("Error fetching lead and device based rental 1:", error);
      throw error;
    });
};

export const LEAD_AND_DEVICE_BASED_RENTAL = ({
  commit
}, request) => {
  console.log("ACTION LEAD_AND_DEVICE_BASED_RENTAL 124345 -------->", JSON.stringify(request));
  
  // Using api instead of api for Vue 3 compatibility
  return api.get("https://smart.bijlipay.co.in:8080/staticApi/plan-and-deivce-list-based-on-lead-source/" + request.leadSource.id + "/" + request.device.id)
    .then(response => {
      // Using map() properly - removing unused 'key' parameter
      const rental = response.data.data.plan.map(function (value) {
        return {
          label: value.planName,
          value: value,
        };
      });
      commit("LEAD_SOURCE_BASED_RENTAL", rental);
    })
    .catch(error => {
      console.error("Error fetching lead and device based rental:", error);
      throw error;
    });
};