import api from "../api.js";
// Removed unused Vue import

const MDR_PLAN = (_, request) => {
  // Changed from { commit, rootState } to _ since neither is used
  return api
    .post('manage/data/mdr-details/' + request.url.leadSource + "/" + request.url.device + "/" + request.url.merchantType, request.params)
}

export default {
  MDR_PLAN
};
