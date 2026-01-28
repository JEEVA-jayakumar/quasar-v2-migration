// Removed unused imports: import api from "../api.js"; import * as Vue from "vue";
// Keep api import if you might use it later
import api from "../api.js";

const FETCH_ALL_FILLING_TYPES = ({
  commit,
  rootState
}) => {
  // Removed unused 'request' parameter
  // Using api instead of api for Vue 3 compatibility
  
  // Get base URL from rootState or use api's default base URL
  const baseURL = rootState.GlobalVariables?.STATE_LOCAL_API || '';
  
  return api
    .get(baseURL + "getfillingtypes")
    .then(response => {
      // Using map() properly - it returns a new array
      const fillingTypes = response.data.map(value => ({
        label: value,
        value: value,
      }));
      commit("SET_ALL_FILLING_TYPES", fillingTypes);
    })
    .catch(error => {
      console.error("Error fetching filling types:", error);
      throw error;
    });
};

export default {
  FETCH_ALL_FILLING_TYPES
};
