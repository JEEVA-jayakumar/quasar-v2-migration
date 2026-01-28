// Removed unused imports: import api from "../api.js"; import * as Vue from "vue";
// Keep api import if you might use it later
import api from "../api.js";

export const DEVICE_MODEL_FROM_MARS = ({ commit }, request) => {
  // Removed unused rootState parameter
  // Using api instead of api for Vue 3 compatibility
  
  // Note: You're using a hardcoded URL, which is generally not recommended
  // Consider moving this to environment variables or configuration
  
  const hardcodedUrl = "https://smart.bijlipay.co.in:8080/staticApi/rental-plan-details/";
  
  return api
    .get(`${hardcodedUrl}${request.leadSource}/${request.device}/${request.plan}`, request)
    .then(response => {
      // Note: Changed from response.body.data to response.data for axios compatibility
      // If your response structure is different, adjust accordingly
      commit("SET_DEVICE_MODEL_FROM_MARS", response.data.data?.marsDeviceModel || response.data?.marsDeviceModel);
      return response;
    })
    .catch(error => {
      console.error("Error fetching device model from MARS:", error);
      throw error;
    });
}