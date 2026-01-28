const SET_APP_MERCHANT_DOCUMENT_TYPE = (state, payload) => {
  state.appMerchantTypes = payload
}

const SET_SO_RENTAL_PLAN = (state, payload) => {
  state.sorentalplan = payload
}


export default {
  SET_APP_MERCHANT_DOCUMENT_TYPE,
  SET_SO_RENTAL_PLAN
};
