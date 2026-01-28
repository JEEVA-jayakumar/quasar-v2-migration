const getActiveMerchantDocumentTypes = state => {
  return state.activeMerchantDocumentTypes;
};
const getDeActivatedMerchantDocumentTypes = state => {
  return state.deActivatedMerchantDocumentTypes;
};


export default {
  getActiveMerchantDocumentTypes,
  getDeActivatedMerchantDocumentTypes
};
