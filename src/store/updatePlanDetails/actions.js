import * as Vue from "vue";
// Removed unused 'api' import
const UPDATE_PLAN_DETAILS_DATAS = ({ commit }, request) => {
  // Removed unused 'rootState' parameter
  return api
    .put("update-m-atm-plan-details/" + request.params.id, request)
    .then(response => {
      commit("SET_UPDATE_PLAN_DETAILS_DATAS", response.data);
      return response;
    });
};

export default {
  UPDATE_PLAN_DETAILS_DATAS
};
