const getOnboardingMerchantAssignedList = (state) => {
    // console.log("ASSIGNED GETTERS DATAS----------------->"+JSON.stringify(state.deviceRecoveryAssignedList))
    return state.OnboardingMerchantAssignedList
  }
  const getHitachiIndianOnboarding = (state) => {
    // console.log("UNASSIGNED GETTERS DATAS----------------->"+JSON.stringify(state.deviceRecoveryUnassignedList))
    return state.HitachiIndianOnboarding
  }


export default {
  getHitachiIndianOnboarding,
  getOnboardingMerchantAssignedList
};
