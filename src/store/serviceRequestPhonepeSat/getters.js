const getserviceRequestPhonepeUnassignedDatas = (state) => {
    //  console.log("getserviceRequestPhonepeUnassignedDatas--------->",JSON.stringify(state.serviceRequestPhonepeUnassignedDatas))
      return state.serviceRequestPhonepeUnassignedDatas
    }
    const getPhonepeAssignRegion = (state) => {
        return state.PhonepeAssignToRegion
      }  
  
    const getserviceRequestPhonepeAssignedDatas = (state) => {
      // console.log("getserviceRequestPhonepeAssignedDatas--------->",JSON.stringify(state.serviceRequestPhonepeAssignedDatas))
      return state.serviceRequestPhonepeAssignedDatas
    }
    const getserviceRequestPhonepeClosedDatas = (state) => {
      console.log("getserviceRequestPhonepeClosedDatas=========>>>>>>>>",JSON.stringify(state.serviceRequestPhonepeClosedDatas))
      return state.serviceRequestPhonepeClosedDatas
    } 
    const getserviceRequestPhonepeCancelledDatas = (state) => {
      console.log("serviceRequestPhonepeCancelledDatas=========>>>>>>>>",JSON.stringify(state.serviceRequestPhonepeCancelledDatas))
      return state.serviceRequestPhonepeCancelledDatas
    }
    const getserviceRequestPhonepeCountDatas = (state) => {
        // console.log("getserviceRequestPhonepeCountDatas--------->",JSON.stringify(state.serviceRequestPhonepeCountDatas))
      return state.serviceRequestPhonepeCountDatas
    }
    
     const getserviceRequestReopenTicket = (state) => {
        // console.log("getserviceRequestPhonepeCountDatas--------->",JSON.stringify(state.serviceRequestPhonepeCountDatas))
      return state.serviceRequestReopenTicket
    }
    
    const getphonepeAssignedReopenTicket = (state) => {
      // console.log("getserviceRequestPhonepeCountDatas--------->",JSON.stringify(state.serviceRequestPhonepeCountDatas))
    return state.phonepeAssignedReopenTicket
  }

  const getphonepeOpenedTickets = (state) => {
    // console.log("getserviceRequestPhonepeCountDatas--------->",JSON.stringify(state.serviceRequestPhonepeCountDatas))
  return state.phonepeOpenedTickets
}

 const getphonepeResolvedTickets = (state) => {
    // console.log("getserviceRequestPhonepeCountDatas--------->",JSON.stringify(state.serviceRequestPhonepeCountDatas))
  return state.phonepeResolvedTickets
}
const getcrmLogsLists = (state) => {
  // console.log("getserviceRequestPhonepeCountDatas--------->",JSON.stringify(state.serviceRequestPhonepeCountDatas))
return state.crmLogsLists
}
const getassignHistoryLists = (state) => {
  // console.log("getserviceRequestPhonepeCountDatas--------->",JSON.stringify(state.serviceRequestPhonepeCountDatas))
return state.assignHistoryLists
}


export default {
  getPhonepeAssignRegion,
  getassignHistoryLists,
  getcrmLogsLists,
  getphonepeAssignedReopenTicket,
  getphonepeOpenedTickets,
  getphonepeResolvedTickets,
  getserviceRequestPhonepeAssignedDatas,
  getserviceRequestPhonepeCancelledDatas,
  getserviceRequestPhonepeClosedDatas,
  getserviceRequestPhonepeCountDatas,
  getserviceRequestPhonepeUnassignedDatas,
  getserviceRequestReopenTicket
};
