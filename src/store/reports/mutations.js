const SET_LEAD_APPROVAL_TRACKER = (state, payload) => {
  state.leadApprovalTracker = payload
}
const SET_PROXY_LEAD_MISSELLING = (state, payload) => {
  state.proxyLeadMisselling = payload
}


export default {
  SET_LEAD_APPROVAL_TRACKER,
  SET_PROXY_LEAD_MISSELLING
};
