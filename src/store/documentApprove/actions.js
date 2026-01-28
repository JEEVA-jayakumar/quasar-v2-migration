import api from "../api.js";

const DOCUMENT_APPROVE = async ({ commit }, request) => {
  const response = await api.put(
    `implementation-Validation/${request}/2`
  );

  // Optional: store response if UI uses it
  commit("SET_REGISTERED_APPROVE_DATA", response.data);

  return response;
};

const DOCUMENT_REJECT = async ({ commit }, request) => {
  const response = await api.put(
    `implementation-Validation/${request.data.data}/3/${request.url.reason}`
  );

  // Optional: store response if UI uses it
  commit("SET_REGISTERED_REJECT_DATA", response.data);

  return response;
};


export default {
  DOCUMENT_APPROVE,
  DOCUMENT_REJECT
};
