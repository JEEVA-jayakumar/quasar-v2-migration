const getLeadStatusUserDetails = state => {
  return state.leadStatusUserDetails;
};
const getLeadStatusUserDetails_ShortLeads = state => {
  return state.leadStatusUserDetails_ShortLeads;
};
const getLeadStatusUserDetails_WIP = state => {
  return state.leadStatusUserDetails_WIP;
};
const getLeadStatusUserDetails_Rejected = state => {
  return state.leadStatusUserDetails_Rejected;
};
const getLeadStatusUserDetails_Implementation = state => {
  return state.leadStatusUserDetails_Implementation;
};
const getuserBasedLeadsData = state => {
  return state.userBasedLeadsData;
};


export default {
  getLeadStatusUserDetails,
  getLeadStatusUserDetails_ShortLeads,
  getLeadStatusUserDetails_WIP,
  getLeadStatusUserDetails_Rejected,
  getLeadStatusUserDetails_Implementation,
  getuserBasedLeadsData
};
