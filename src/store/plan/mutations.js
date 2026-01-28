const SET_PLAN_ACTIVE_LIST = (state, payload) => {
  state.activePlan = payload;
};
const SET_PLAN_DEACTIVED_LIST = (state, payload) => {
  state.deActivatedPlan = payload;
};


export default {
  SET_PLAN_ACTIVE_LIST,
  SET_PLAN_DEACTIVED_LIST
};
