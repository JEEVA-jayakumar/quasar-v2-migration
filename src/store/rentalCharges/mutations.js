const SET_ALL_RENTAL_PLAN_DETAILS = (state, payload) => {
  
    state.AllRentalPlanDetails = payload;
  };

const SET_ALL_RENTAl_PLAN_EDIT_DETAILS = (state, payload) => {
  
    state.AllRentalPlanEditDetails = payload;
  };
  const SET_DEACTIVATED_RENTAL_PLAN_DETAILS = (state, payload) => {
  
    state.DeactivatedRentalPlanDetails = payload;
  };


export default {
  SET_ALL_RENTAL_PLAN_DETAILS,
  SET_ALL_RENTAl_PLAN_EDIT_DETAILS,
  SET_DEACTIVATED_RENTAL_PLAN_DETAILS
};
