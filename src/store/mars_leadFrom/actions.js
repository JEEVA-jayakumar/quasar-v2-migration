// Removed unused imports: import api from "../api.js"; import * as Vue from "vue";
// Keep api import if you might use it later
import api from "../api.js";

const LEAD_FROM_FROM_MARS = ({
  commit,
  rootState
}, request) => {
  // Using api instead of api for Vue 3 compatibility
  
  const baseURL = rootState.GlobalVariables?.STATE_MARS_API || '';
  
  return api
    .get(`${baseURL}lead-from?institutionCode=${request}`)
    .then(response => {
      // console.log("terminal code 12345 : --- : ", response)
      commit("SET_LEAD_FROM_FROM_MARS", response.data);
      return response;
    })
    .catch(error => {
      console.error("Error fetching lead from from MARS:", error);
      throw error;
    });
}

export default {
  LEAD_FROM_FROM_MARS
};
