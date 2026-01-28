const SET_REGISTERED_APPROVE_DATA = (state, payload) => {
  state.documentApprove = payload;
};

const SET_REGISTERED_REJECT_DATA = (state, payload) => {
  state.documentReject = payload;
};


export default {
  SET_REGISTERED_APPROVE_DATA,
  SET_REGISTERED_REJECT_DATA
};
