const SET_MERCHANT_TIER_MAPPING_GET_STATE_DETAILS = (state, payload) => {
    state.MerchantTierMappingStateDetails = payload;
  };

  const SET_MERCHANT_TIER_MAPPING_SEARCH_DISTRICT = (state, payload) => {
    state.MerchantTierMappingDistrictDetails = payload;
  };

  const SET_MERCHANT_TIER_MAPPING_SUB_DISTRICT_DETAILS = (state, payload) => {
    state.MerchantTierMappingSubDistrictDetails = payload;
  };
//   SET_MERCHANT_TIER_MAPPING_TOWN_OR_VILLAGE_DETAILS

const SET_MERCHANT_TIER_MAPPING_TOWN_OR_VILLAGE_DETAILS = (state, payload) => {
    state.MerchantTierMappingTownOrVillageDetails = payload;
  };

//   SET_MERCHANT_TIER_MAPPING_VILLAGE_TIER_DETAILS

const SET_MERCHANT_TIER_MAPPING_VILLAGE_TIER_DETAILS = (state, payload) => {
    state.MerchantTierMappingVillageTierDetails = payload;
  };

  const SET_MERCHANT_TIER_MAPPING_VILLAGE_BASED_TIER_AND_LOCATION_DETAILS = (state, payload) => {
    state.MerchantTierMappingVillageBasedTierAndLocationDetails = payload;
  };

export default {
  SET_MERCHANT_TIER_MAPPING_GET_STATE_DETAILS,
  SET_MERCHANT_TIER_MAPPING_SEARCH_DISTRICT,
  SET_MERCHANT_TIER_MAPPING_SUB_DISTRICT_DETAILS,
  SET_MERCHANT_TIER_MAPPING_TOWN_OR_VILLAGE_DETAILS,
  SET_MERCHANT_TIER_MAPPING_VILLAGE_BASED_TIER_AND_LOCATION_DETAILS,
  SET_MERCHANT_TIER_MAPPING_VILLAGE_TIER_DETAILS
};
