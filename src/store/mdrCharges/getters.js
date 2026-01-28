const getAllMdrPlanDetails = (state) => {
  return state.AllMdrPlanDetails
};

// export const getAllDeactivatedMdrPlanDetails = (state) => {
//   console.log("getAllDeactivatedMdrPlanDetails---------->",JSON.stringify(state))
//   return state.AllDeactivatedMdrPlanDetails
// };

const getAllMdrPlanEditDetails = (state) => {
  return state.AllMdrPlanEditDetails
};


export default {
  getAllMdrPlanDetails,
  getAllMdrPlanEditDetails
};
