const getAllRentalPlanDetails = (state) => {
  return state.AllRentalPlanDetails
};

const getAllRentalPlanEditDetails = (state) => {
  return state.AllRentalPlanEditDetails
};
const getDeactivatedRentalPlanDetails = (state) => {
  return state.DeactivatedRentalPlanDetails
};


export default {
  getAllRentalPlanDetails,
  getAllRentalPlanEditDetails,
  getDeactivatedRentalPlanDetails
};
