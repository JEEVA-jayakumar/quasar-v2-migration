import api from "../api.js";

export const DEVICE_LIST_BASED_ON_LEAD_SOURCE = async ({ commit }, request) => {
  const response = await api.get(`device-list-based-on-lead-source/${request}`);

  const data = {
    apiStatusCode: response.status,
    apiPending: false,
    apiSuccess: true,
    apiFailure: false,
    apiData: response.data.data
  };

  commit("API_RESPONSE_LOG", data);
  commit("SET_DEVICE_LIST_BASED_ON_LEAD_SOURCE", response.data.data);

  return response;
};
