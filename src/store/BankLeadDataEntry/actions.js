import api from "../api.js";

export default {
  /**
   * FETCH_ALL_MERCHANTTID
   * Fetches merchant TIDs based on search term
   */
  async FETCH_ALL_MERCHANTTID({ commit, rootState }, request) {
    try {
      const response = await api.get(`${rootState.GlobalVariables.STATE_MERCHANT}tids?searchTerm=${request}`);
      
      // Structure response as { label, value }
      const merchant = response.data.data.map(value => ({
        label: value.tid,
        value: value.tid
      }));

      commit("SET_MERCHANT", merchant);
      return merchant;
    } catch (error) {
      console.error("FETCH_ALL_MERCHANTTID error:", error);
      throw error;
    }
  },

  /**
   * SAVE_MERCHANT
   * Sends merchant data to API (notification)
   */
  async SAVE_MERCHANT({ rootState }, request) {
    try {
      const response = await api.post(`${rootState.GlobalVariables.STATE_MERCHANT}send-notification`, request);
      return response.data;
    } catch (error) {
      console.error("SAVE_MERCHANT error:", error);
      throw error;
    }
  }
}