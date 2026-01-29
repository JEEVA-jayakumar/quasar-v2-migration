const getserviceRequestStatusDetails= (state) => {
  console.log("GETTER SERVICE STATUS: ------------ : " +  JSON.stringify(state.sparePartsGetTypes))
  return state.serviceStatusRequest
}

export default {
  getserviceRequestStatusDetails
};
