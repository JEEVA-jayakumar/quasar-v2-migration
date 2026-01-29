const getSatDashboard = state => {
  return state.satDashboard;
};
 const getAggregatorsSatDashboard = state => {
  return state.AggregatorssatDashboard;
};
const getSatAgingTrackerdata = state => {
  return state.satAgingTrackerData;
};
const getSatAgingTrackerListdata = state => {
  return state.satAgingTrackerLeadsData;
};
const getSatDashboardGraphData = state => {
  return state.satDashboardGraphData;
};
const getSatDashboardAgingGraphData = state => {
  return state.satDashboardAgingGraphData;
};


export default {
  getAggregatorsSatDashboard,
  getSatAgingTrackerListdata,
  getSatAgingTrackerdata,
  getSatDashboard,
  getSatDashboardAgingGraphData,
  getSatDashboardGraphData
};
