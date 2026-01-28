const SET_SALES_PERSON_FROM_MARS = (state, payload) => {
  state.MARS_salesPerson = payload
}

const SET_QR_SALES_PERSON_FROM_MARS = (state, payload) => {
  state.MARS_qrsalesPerson = payload
}


export default {
  SET_SALES_PERSON_FROM_MARS,
  SET_QR_SALES_PERSON_FROM_MARS
};
