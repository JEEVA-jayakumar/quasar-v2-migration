const getOnboardingMerchantAssignedList = (state) => {
    // console.log("ASSIGNED GETTERS DATAS----------------->"+JSON.stringify(state.deviceRecoveryAssignedList))
    return state.OnboardingMerchantAssignedList
  }
  const getOnboardingMerchantUnassignedList = (state) => {
    // console.log("UNASSIGNED GETTERS DATAS----------------->"+JSON.stringify(state.deviceRecoveryUnassignedList))
    return state.OnboardingMerchantUnassignedList
  }


export default {
  getOnboardingMerchantAssignedList,
  getOnboardingMerchantUnassignedList
};
