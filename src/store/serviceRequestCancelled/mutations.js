const SET_SERVICE_REQUEST_CANCELLED_DETAILS = (state, payload) => {
    console.log("Service Status Mutations: ------------ : " +  JSON.stringify(payload))
    state.serviceCancelReasonRequest = payload;
  }


export default {
  SET_SERVICE_REQUEST_CANCELLED_DETAILS
};
