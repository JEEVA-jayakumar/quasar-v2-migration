// Remove 'api' import since it's not used
// import api from "../api.js";
import * as Vue from "vue";

export const SO_TO_SAT = ({
  // Remove 'commit' since it's not used
  // commit,
  rootState
}, request) => {
  return api
    .put(rootState.GlobalVariables.STATE_APP_API + 'store-full-lead-information/' + request.url.id + "/" + request.url.action, request.data1)
    .then(response => {
      console.log(response);
    })
};