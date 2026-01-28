const getPhonepeImplementationQueueUnassignedList = (state) => {
    // console.log("GETTER of unassigned datas----------->",JSON.stringify(state.getPhonepeImplementationQueueUnassignedList))
    return state.phonepeimplementationQueueUnassignedList
  }

  const getPhonepeImplementationQueueassignedList = (state) => {
    // console.log("GETTER of unassigned datas----------->",JSON.stringify(state.implementationQueueUnassignedList))
    return state.phonepeimplementationQueueassignedList
  }

  const getPhonepeImplementationQueueCourierList = (state) => {
    // console.log("GETTER of unassigned datas----------->",JSON.stringify(state.implementationQueueUnassignedList))
    return state.phonepeimplementationQueueCourierList
  }

  const getPhonepeCancelledMerchants = (state) => {
    // console.log("GETTER of CancelledMerchants----------->",JSON.stringify(state.getPhonepeCancelledMerchants))
    return state.phonepecancelledMerchants
  }


export default {
  getPhonepeCancelledMerchants,
  getPhonepeImplementationQueueCourierList,
  getPhonepeImplementationQueueUnassignedList,
  getPhonepeImplementationQueueassignedList
};
