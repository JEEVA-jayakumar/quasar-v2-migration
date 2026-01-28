export default {
  SET_BANK_SO: (state, payload) => {
    state.bankSO = payload;
  },
  
  // Add the missing SET_MERCHANT mutation that your actions.js is calling
  SET_MERCHANT: (state, payload) => {
    state.merchant = payload;
  },
  
  // Add other mutations based on your getters
  SET_REGION: (state, payload) => {
    state.region = payload;
  },
  
  SET_DEVICE: (state, payload) => {
    state.device = payload;
  },
  
  SET_PINCODE: (state, payload) => {
    state.pincode = payload;
  },
  
  SET_REGION_STATE: (state, payload) => {
    state.regionstate = payload;
  },
  
  SET_BANK_BRANCH: (state, payload) => {
    state.bankBranch = payload;
  }
}