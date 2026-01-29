
const SET_ALL_STATIC_QR_LEAD_VALIDATIONS_DATA = (state, payload) => {
  state.staticQrLeadsValidationData = payload
}
const SET_STATIC_QR_SHORT_LEAD_DATA = (state, payload) => {
  state.staticQrShortLeadDatas = payload
}

const SET_STATIC_QR_INVENTORY_COUNT = (state, payload) => {
  state.staicQrInventoryCount = payload
}
const SET_MARS_ID_DATA = (state, payload) => {
  state.staicQrExistingMerchantMarsId = payload
}


export default {
  SET_ALL_STATIC_QR_LEAD_VALIDATIONS_DATA,
  SET_STATIC_QR_SHORT_LEAD_DATA,
  SET_STATIC_QR_INVENTORY_COUNT,
  SET_MARS_ID_DATA
};
