const SET_INSTANCE = (state, payload) => {
  console.log("payload----->"+JSON.stringify (state.Instance));
    state.Instance = payload;
  }


export default {
  SET_INSTANCE
};
