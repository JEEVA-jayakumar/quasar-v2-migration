const SET_REGIONAL_SUMMARY_LIST = (state, payload) => {
    state.RegionalSummaryList  = payload
  } 

  

  const SET_FETCH_ALL_SIM_STATUS_BY_REGION = (state, payload) => {
    state.simStatus = payload
 
  } 

  const SET_FETCH_ALL_SIM_STATUS = (state, payload) => {
    state.simStatus = payload
 
  } 


export default {
  SET_FETCH_ALL_SIM_STATUS,
  SET_FETCH_ALL_SIM_STATUS_BY_REGION,
  SET_REGIONAL_SUMMARY_LIST
};
