// Removed unused imports: import api from "../api.js"; import * as Vue from "vue";
// Keep api import if you might use it later
import api from "../api.js";

const RENTAL_PLAN_FROM_MARS = ({
  commit,
  rootState
}, request) => {
  // Using api instead of api for Vue 3 compatibility
  
  const baseURL = rootState.GlobalVariables?.STATE_MARS_API || '';
  
  return api
    .get(`${baseURL}rental-plan?institutionCode=${request}`)
    .then(response => {
      // console.log(response)
      commit("SET_RENTAL_PLAN_FROM_MARS", response.data);
    })
    .catch(error => {
      console.error("Error fetching rental plan from MARS:", error);
      throw error;
    });
};

export default {
  RENTAL_PLAN_FROM_MARS
};
