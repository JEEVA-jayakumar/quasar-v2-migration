const getMerchantTierMappingStateDetails = state => {
    return state.MerchantTierMappingStateDetails;
  };

  const getMerchantTierMappingDistrictDetails = state => {
    return state.MerchantTierMappingDistrictDetails;
  };

  const getMerchantTierMappingSubDistrictDetails = state => {
    // console.log("getMerchantTierMappingDistrictDetails ---------->",JSON.stringify(state.MerchantTierMappingDistrictDetails))
  return state.MerchantTierMappingSubDistrictDetails;
};

const getMerchantTierMappingTownOrVillageDetails = state => {
    // console.log("getMerchantTierMappingTownOrVillageDetails ---------->",JSON.stringify(state.MerchantTierMappingTownOrVillageDetails))
  return state.MerchantTierMappingTownOrVillageDetails;
};

// MERCHANT_TIER_MAPPING_VILLAGE_TIER_DETAILS

const getMerchantTierMappingVillageTierDetails = state => {
     console.log("getMerchantTierMappingVillageTierDetails ---------->",JSON.stringify(state.MerchantTierMappingVillageTierDetails))
  return state.MerchantTierMappingVillageTierDetails;
};

  const getMerchantTierMappingVillageBasedTierAndLocationDetails = state => {
    return state.MerchantTierMappingVillageBasedTierAndLocationDetails;
  };


export default {
  getMerchantTierMappingDistrictDetails,
  getMerchantTierMappingStateDetails,
  getMerchantTierMappingSubDistrictDetails,
  getMerchantTierMappingTownOrVillageDetails,
  getMerchantTierMappingVillageBasedTierAndLocationDetails,
  getMerchantTierMappingVillageTierDetails
};
