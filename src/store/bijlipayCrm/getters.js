const getBijlipayMerchantDetails = (state) => {
  return state.bijlipayMerchantDetails;
};

const getBijlipayCompletedData = (state) => {
  return state.bijlipayCompletedDetails;
};

const getBijlipayDate = (state) => {
  return state.bijlipayDate;
};

const getupdateRemarks = (state) => {
  return state.updateRemarks;
};


export default {
  getBijlipayMerchantDetails,
  getBijlipayCompletedData,
  getBijlipayDate,
  getupdateRemarks
};
