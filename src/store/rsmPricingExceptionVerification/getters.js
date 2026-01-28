const getPricingExceptionList = (state) => {
  return state.pricingExceptionList
}
const getPricingRsmList = (state) => {
  return state.pricingRSMList
}
const pricingExceptionByRsmIDList = (state) => {
  return state.pricingExceptionByRsmIDList
}


export default {
  getPricingExceptionList,
  getPricingRsmList,
  pricingExceptionByRsmIDList
};
