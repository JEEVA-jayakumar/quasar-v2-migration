const SET_MATM_PLAN_DROPDOWN_DETAILS = (state, payload) => {
    // console.log("MUTATION OF DROP DOWN DETAILS- 1234-------------------->"+JSON.stringify(payload))
    state.MatmPlanDropdownDetails = payload;
  };

  const SET_FETCH_ALL_PLAN_DETAILS = (state, payload) => {
    console.log("MUTATION OF FETCHING PLAN DATAS-------------------->"+JSON.stringify(payload))
    state.MAtmPlanDropdown = payload
  }

export default {
  SET_FETCH_ALL_PLAN_DETAILS,
  SET_MATM_PLAN_DROPDOWN_DETAILS
};
