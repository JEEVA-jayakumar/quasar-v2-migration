import api from "../api.js";
// Removed unused Vue import

export const MATM_SUBMIT_PLAN_DETAILS = (_, request) => {
  // Changed from { commit, rootState } to _ since neither is used
  return api
    .post('m-atm-plan-details/' + request.url.leadSource + "/" + request.url.device, request.params)
}