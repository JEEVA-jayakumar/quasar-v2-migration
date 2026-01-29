import api from "../api.js";

/**
 * FETCH_AXIS_BANK_PINCODE_LOCATION
 * Fetches Axis Bank pin code locations based on the input request (pincode or area code).
 * Commits structured data to Vuex state.
 * @param {Object} commit - Vuex commit
 * @param {String} request - pincode or search term
 */
const FETCH_AXIS_BANK_PINCODE_LOCATION = async ({ commit, rootState }, request) => {
  try {
    // Using axios instance instead of api
    const response = await api.get(`${rootState.GlobalVariables.STATE_AXIS_API}Pincode/${request}`);
    
    // Structure the response as { label, value }
    const axisBankPincode = response.data.data.map(value => ({
      label: value,
      value: value
    }));

    commit("SET_ALL_AXIS_BANK_PINCODE_LOCATION", axisBankPincode);

    return axisBankPincode; // Optional return if needed by component
  } catch (error) {
    console.error("FETCH_AXIS_BANK_PINCODE_LOCATION error:", error);
    throw error; // Allow calling component to handle errors
  }
};


export default {
  FETCH_AXIS_BANK_PINCODE_LOCATION
};
