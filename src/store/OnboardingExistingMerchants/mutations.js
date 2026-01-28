const SET_ONBOARDING_MERCHANT_ASSIGNED_LIST = (state, payload) => {
    // console.log("Mutations assigned:--------------->"+JSON.stringify(payload))
    state.OnboardingMerchantAssignedList = payload
  }
  const SET_ONBOARDING_MERCHANT_UNASSIGNED_LIST = (state, payload) => {
    // console.log("Mutations Unassigned:--------------->"+JSON.stringify(payload))
    state.OnboardingMerchantUnassignedList = payload
  }


export default {
  SET_ONBOARDING_MERCHANT_ASSIGNED_LIST,
  SET_ONBOARDING_MERCHANT_UNASSIGNED_LIST
};
