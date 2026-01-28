import api from "../api.js";

/**
 * DELETE_ASSIGN_USER
 * Calls the API to reassign an existing lead to SO.
 * @param {Object} request - API payload
 * @returns {Promise} Axios response
 */
export const DELETE_ASSIGN_USER = async (_, request) => {
  try {
    const response = await api.put("user/reassign-existing-lead-toSo", request);
    console.log("DELETE_ASSIGN_USER response:", response);
    // If in future you want to commit the response to state:
    // commit("SET_SOME_STATE", response.data.data);
    return response.data;
  } catch (error) {
    console.error("DELETE_ASSIGN_USER API error:", error);
    throw error;
  }
};