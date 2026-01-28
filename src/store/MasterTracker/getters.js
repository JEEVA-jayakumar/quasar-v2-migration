const getMasterTrackerList = (state) => {
  return state.masterTrackerList
}
 /*AGGREGATORS API */

const getAggregatorsMasterTrackerList = (state) => {
  return state.AggregatorsMasterTrackerList
}


/*AGGREGATORS API */
const getApproveLostOrStolenData = (state) => {
  return state.ApproveLostOrStolenData
}



export default {
  getMasterTrackerList,
  getAggregatorsMasterTrackerList,
  getApproveLostOrStolenData
};
