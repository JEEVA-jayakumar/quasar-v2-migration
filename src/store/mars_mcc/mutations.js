const SET_MCC_FROM_MARS = (state, payload) => {
  state.MARS_mcc = payload
}
const SET_QR_MCC_FROM_MARS = (state, payload) => {
  state.MARS_mccQR = payload
}


export default {
  SET_MCC_FROM_MARS,
  SET_QR_MCC_FROM_MARS
};
