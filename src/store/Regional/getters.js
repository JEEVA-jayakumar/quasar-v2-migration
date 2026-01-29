const getRegionalSummaryList = (state) => {
    return state.RegionalSummaryList 
  } 

  const getSimStatus = (state) => {
   
    return state.simStatus 
  }

  const getInventorySimStatus = (state) => {
   
    return state.simStatus 
  }


export default {
  getInventorySimStatus,
  getRegionalSummaryList,
  getSimStatus
};
