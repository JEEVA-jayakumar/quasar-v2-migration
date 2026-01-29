import * as Vue from 'vue';
import api from "./api.js";

const FETCH_SHORT_LEAD = ({
  commit,
  rootState
}) => {
  return api.get(rootState.GlobalVariables.STATE_APP_API + 'create-or-assign-short-lead-from-sat').then(response => {
    commit("SET_SHORT_LEAD", response.data.data.soLeads);
  });
};

export default {
  FETCH_SHORT_LEAD
};
