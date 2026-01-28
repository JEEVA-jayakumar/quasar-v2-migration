const SET_PRICING_EXCEPTION_LIST = (state, payload) => {
  state.pricingExceptionList = payload
}
const SET_PRICING_EXCEPTION_BY_RSMID_LIST = (state, payload) => {
  state.pricingExceptionByRsmIDList = payload
}
const SET_PRICING_RSM_LIST = (state, payload) => {
  state.pricingRSMList = payload
}


export default {
  SET_PRICING_EXCEPTION_LIST,
  SET_PRICING_EXCEPTION_BY_RSMID_LIST,
  SET_PRICING_RSM_LIST
};
