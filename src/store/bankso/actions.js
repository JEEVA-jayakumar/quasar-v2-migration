import api from "../api.js";

/**
 * SAVE_BANK_SO
 * Saves Bank SO data
 */
const SAVE_BANK_SO = async (_, request) => {
  try {
    const response = await api.post(
      "http://182.156.237.85:8080/apibanks/bank-SoList",
      request
    );

    // If later you want to store response:
    // commit("SET_BANK_SO", response.data);

    return response.data;
  } catch (error) {
    console.error("SAVE_BANK_SO error:", error);
    throw error;
  }
};

export default {
  SAVE_BANK_SO
};
