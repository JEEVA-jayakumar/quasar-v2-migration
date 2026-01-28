// Export as default object
export default {
  getBankRegion: state => state.region,
  getBankDevice: state => state.device,
  getPincodeBasedStateandCity: state => state.pincode,
  getBankRegionBasedState: state => state.regionstate,
  getMerchantTid: state => state.merchant,
  getBankBranchCode: state => state.bankBranch
}