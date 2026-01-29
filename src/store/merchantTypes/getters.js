const getActiveMerchantTypes = state => {
  console.log("Merchant Type- GETTER-------------->"+JSON.stringify(state.activeMerchantTypes))
  return state.activeMerchantTypes;
};
const getDeActivatedMerchantTypes = state => {
  return state.deActivatedMerchantTypes;
};

export default {
  getActiveMerchantTypes,
  getDeActivatedMerchantTypes
};
