const SET_REJECT_STATUS_LIST = (state, payload) => {
    return state.rejectStatusList = payload
  }
  const SET_LEAD_STATUS_LIST = (state, payload) => {
    return state.leadStatusList = payload
  }
  


export default {
  SET_LEAD_STATUS_LIST,
  SET_REJECT_STATUS_LIST
};
