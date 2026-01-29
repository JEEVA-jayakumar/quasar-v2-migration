const SET_ADDITIONAL_TID_FROM_MARS = (state, payload) => {
    state.TidFromMars = payload
  }
  const SET_ADDITIONAL_TID_FROM_BACK_END = (state, payload) => {
    // console.log("PAYLOAD----------->"+JSON.stringify(this.payload))
    state.TidFromBackEnd = payload
  }

export default {
  SET_ADDITIONAL_TID_FROM_BACK_END,
  SET_ADDITIONAL_TID_FROM_MARS
};
