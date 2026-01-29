const SET_LEAD_SOURCE_ACTIVE_LIST = (state, payload) => {
  state.activeLeadSource = payload;
};
const SET_LEAD_SOURCE_DEACTIVED_LIST = (state, payload) => {
  state.deActivatedLeadSource = payload;
};


export default {
  SET_LEAD_SOURCE_ACTIVE_LIST,
  SET_LEAD_SOURCE_DEACTIVED_LIST
};
