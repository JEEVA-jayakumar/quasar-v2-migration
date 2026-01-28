const getMatmPlanDropdownDetails = state => {
    // console.log("GETTER OF DROP DOWN DETAILS 1234-------------------->"+JSON.stringify(state.MatmPlanDropdownDetails))
    return state.MatmPlanDropdownDetails;
  };

  const getMAtmPlanDropdown = (state) => {
    console.log("GETTER OF FETCHING PLAN DATAS-------------------->"+JSON.stringify(state.MAtmPlanDropdown))
    return state.MAtmPlanDropdown;
  }

export default {
  getMAtmPlanDropdown,
  getMatmPlanDropdownDetails
};
