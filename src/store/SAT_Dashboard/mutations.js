const SET_SAT_DASHBOARD_COUNT = (state, payload) => {
  state.satDashboard = payload;
};
// SET_AGGREGATORS_DASHBOARD_COUNT
const SET_AGGREGATORS_DASHBOARD_COUNT = (state, payload) => {
  state.AggregatorssatDashboard = payload;
};
const SET_SAT_AGING_TRACKER_DATA = (state, payload) => {
  state.satAgingTrackerData = payload;
};
const SET_SAT_AGING_TRACKER_LEADS_DATA = (state, payload) => {
  state.satAgingTrackerLeadsData = payload;
};
const SET_SAT_DASHBOARD_CHART_DATA = (state, payload) => {
  state.satDashboardGraphData = payload;
};
const SET_SAT_DASHBOARD_AGING_CHART_DATA = (state, payload) => {
  state.satDashboardAgingGraphData = payload;
};


export default {
  SET_SAT_DASHBOARD_COUNT,
  SET_AGGREGATORS_DASHBOARD_COUNT,
  SET_SAT_AGING_TRACKER_DATA,
  SET_SAT_AGING_TRACKER_LEADS_DATA,
  SET_SAT_DASHBOARD_CHART_DATA,
  SET_SAT_DASHBOARD_AGING_CHART_DATA
};
