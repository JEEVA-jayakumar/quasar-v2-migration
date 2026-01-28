// Removed unused imports: import api from "../api.js"; import * as Vue from "vue";
// Keep api import if you might use it later
import api from "../api.js";

export const MCC_FROM_MARS = ({
  commit,
  rootState
}) => {
  // Removed unused 'request' parameter
  // Using api instead of api for Vue 3 compatibility
  
  const baseURL = rootState.GlobalVariables?.STATE_MARS_API || '';
  
  return api
    .get(`${baseURL}mcc`)
    .then(response => {
      commit("SET_MCC_FROM_MARS", response.data);
    })
    .catch(error => {
      console.error("Error fetching MCC from MARS:", error);
      throw error;
    });
}

export const QR_MCC_FROM_MARS = ({
  commit,
  rootState
}) => {
  // Removed unused 'request' parameter
  const baseURL = rootState.GlobalVariables?.STATE_MARS_API || '';
  
  return api
    .get(`${baseURL}mcc`)
    .then(response => {
      // console.log("SET_QR_MCC_FROM_MARS---------->>>>",response.data.items)
      commit("SET_QR_MCC_FROM_MARS", response.data);
      return response.data;
    })
    .catch(error => {
      console.error("Error fetching QR MCC from MARS:", error);
      throw error;
    });
}