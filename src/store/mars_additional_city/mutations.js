const SET_CITY_FORM_ADDITIONAL_TID = (state, payload) => {
    console.log("Payload city--------------->"+JSON.stringify(payload))
    state.AdditionalCity = payload
  }
  


export default {
  SET_CITY_FORM_ADDITIONAL_TID
};
