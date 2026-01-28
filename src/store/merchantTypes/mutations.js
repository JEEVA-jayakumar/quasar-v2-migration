const SET_MERCHANT_TYPE_ACTIVE_LIST = (state, payload) => {
  console.log("Merchant Type  PAYLOAD--------------->"+JSON.stringify(payload))
  state.activeMerchantTypes = payload;
};
const SET_MERCHANT_TYPE_DEACTIVED_LIST = (state, payload) => {
  state.deActivatedMerchantTypes = payload;
};

export default {
  SET_MERCHANT_TYPE_ACTIVE_LIST,
  SET_MERCHANT_TYPE_DEACTIVED_LIST
};
