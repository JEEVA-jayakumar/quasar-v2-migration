const getserviceRequestUnassignedDatas = (state) => {
  // console.log("getserviceRequestUnassignedDatas--------->",JSON.stringify(state.serviceRequestUnassignedDatas))
    return state.serviceRequestUnassignedDatas
  }

  const getserviceRequestassignedDatas = (state) => {
    // console.log("getserviceRequestassignedDatas--------->",JSON.stringify(state.serviceRequestassignedDatas))
    return state.serviceRequestassignedDatas
  }
  const getserviceRequestClosedDatas = (state) => {
    return state.serviceRequestClosedDatas
  }
  const getserviceRequestCancelledDatas = (state) => {
    return state.serviceRequestCancelledDatas
  }
  const getserviceRequestCountDatas = (state) => {
      // console.log("getserviceRequestCountDatas--------->",JSON.stringify(state.serviceRequestCountDatas))
    return state.serviceRequestCountDatas
  }
  


export default {
  getserviceRequestCancelledDatas,
  getserviceRequestClosedDatas,
  getserviceRequestCountDatas,
  getserviceRequestUnassignedDatas,
  getserviceRequestassignedDatas
};
