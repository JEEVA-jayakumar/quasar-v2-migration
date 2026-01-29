const getSendToRepairDetails = (state) => {
  return state.SendToRepairDetails
}
/*AGGREGATORS API */
const getAggregatorsSendToRepairDetails = (state) => {
  return state.AggregatorsSendToRepairDetails
}

const getMovedToScrapDetails = (state) => {
  return state.MovedToScrapDetails
}
 /*Aggregators API */
const getAggregatorsMovedToScrapDetails = (state) => {
  return state.AggregatorsMovedToScrapDetails
}
/*Aggregators API */


export default {
  getSendToRepairDetails,
  getAggregatorsSendToRepairDetails,
  getMovedToScrapDetails,
  getAggregatorsMovedToScrapDetails
};
