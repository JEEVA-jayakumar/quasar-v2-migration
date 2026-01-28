// Removed unused imports: import api from "../api.js"; import * as Vue from "vue";
// Keep api import if you might use it later
import api from "../api.js";

export const SALES_PERSON_FROM_MARS = ({
  commit,
  rootState
}, request) => {
  // Using api instead of api for Vue 3 compatibility
  
  const baseURL = rootState.GlobalVariables?.STATE_MARS_API_URL || '';
  
  return api
    .get(`${baseURL}sales-person?institutionCode=${request}`)
    .then(response => {
      console.log('Salesperson', response);
      commit("SET_SALES_PERSON_FROM_MARS", response.data);
    })
    .catch(error => {
      console.error("Error fetching sales person from MARS:", error);
      throw error;
    });
};

export const QR_SALES_PERSON_FROM_MARS = ({
  commit,
  rootState
}, request) => {
  const baseURL = rootState.GlobalVariables?.STATE_MARS_API_URL || '';
  
  return api
    .get(`${baseURL}sales-person?institutionCode=${request}`)
    .then(response => {
      console.log('Salesperson', response);
      commit("SET_QR_SALES_PERSON_FROM_MARS", response.data.items);
    })
    .catch(error => {
      console.error("Error fetching QR sales person from MARS:", error);
      throw error;
    });
};