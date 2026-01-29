const getImplementationQueueAssignedList = (state) => {
  // console.log("GETTER of assigned datas----------->",JSON.stringify(state.implementationQueueAssignedList))
  return state.implementationQueueAssignedList
}
const getImplementationQueueUnassignedList = (state) => {
  // console.log("GETTER of unassigned datas----------->",JSON.stringify(state.implementationQueueUnassignedList))
  return state.implementationQueueUnassignedList
}
const getImplementationQueueCourierList = (state) => {
  // console.log("GETTER of unassigned datas----------->",JSON.stringify(state.implementationQueueUnassignedList))
  return state.implementationQueueCourierList
}
const getImplementationCancelledMerchants = (state) => {
  // console.log("GETTER of CancelledMerchants----------->",JSON.stringify(state.getPhonepeCancelledMerchants))
  return state.implementationcancelledMerchants
}


export default {
  getImplementationQueueAssignedList,
  getImplementationQueueUnassignedList,
  getImplementationQueueCourierList,
  getImplementationCancelledMerchants
};
