const SET_ONBOARDING_MERCHANT_ASSIGNED_LIST = (state, payload) => {
    // console.log("Mutations assigned:--------------->"+JSON.stringify(payload))
    state.OnboardingMerchantAssignedList = payload
  }
  const SET_HITACHI_INDIAN_ONBOARDING_LIST = (state, payload) => {
    // console.log("Mutations Unassigned:--------------->"+JSON.stringify(payload))
    state.HitachiIndianOnboarding = payload
  }


export default {
  SET_HITACHI_INDIAN_ONBOARDING_LIST,
  SET_ONBOARDING_MERCHANT_ASSIGNED_LIST
};
