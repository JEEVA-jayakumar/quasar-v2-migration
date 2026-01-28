// Removed unused imports: import api from "../api.js"; import * as Vue from "vue";
// Keep api import if you might use it later
import api from "../api.js";

export const FETCH_ALL_MPOS_STATE = ({
  commit,
  rootState
}) => {
  // Removed unused 'request' parameter
  // Using api instead of api for Vue 3 compatibility
  
  // Get base URL from rootState or use api's default base URL
  const baseURL = rootState.GlobalVariables?.STATE_LOCAL_API || '';
  
  return api
    .get(baseURL + "getmarstates")
    .then(response => {
      // Using map() properly - it returns a new array
      const mposState = response.data.map(value => ({
        label: value,
        value: value,
      }));
      commit("SET_ALL_MPOS_STATE", mposState);
    })
    .catch(error => {
      console.error("Error fetching MPOS states:", error);
      throw error;
    });
};