const SET_LEAD_SOURCE_ACTIVE_DEACTIVE_LIST = (state, payload) => {
  state.activeanddeactiveLeadSource = payload
}

const DEACTIVE_LIST = (state, payload) => {
  state.deactiveLeadSource = payload
}


export default {
  SET_LEAD_SOURCE_ACTIVE_DEACTIVE_LIST,
  DEACTIVE_LIST
};
