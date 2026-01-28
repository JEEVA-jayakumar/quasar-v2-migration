// Remove unused api import
// import api from "../api.js";
import * as Vue from "vue";

export const STATE_SHORT_LEAD = ({
  // Remove unused commit parameter
  // commit,
  rootState
}, request) => {
  return api
    .post(rootState.GlobalVariables.STATE_APP_API + 'create-or-assign-short-lead-from-sat', request)
    .then(response => {
      console.log(response);
      // If you need to commit, uncomment and use:
      // commit("SET_STATE_SHORT_LEAD", response.data);
    })
}