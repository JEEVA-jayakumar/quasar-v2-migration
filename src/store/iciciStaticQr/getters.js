function getAllStaticQrLeadsValidationInfo (state) {
  return state.staticQrLeadsValidationData
}
function getAllStaticQrShortLeadDatas (state) {
  return state.staticQrShortLeadDatas
}
function getStaicQrInventoryCount (state) {
  return state.staicQrInventoryCount
}
function getStaicQrExistingMerchantMarsId (state) {
  return state.staicQrExistingMerchantMarsId
}


export default {
  getAllStaticQrLeadsValidationInfo,
  getAllStaticQrShortLeadDatas,
  getStaicQrInventoryCount,
  getStaicQrExistingMerchantMarsId
};
