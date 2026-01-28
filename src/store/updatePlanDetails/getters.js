export const getUpdatePlanDetailsDatas = (state) => {
  console.log("Getter Datas------------------>" + JSON.stringify(state.UpdatePlanDetailsDatas));
  // Fixed: Changed 'MARS_tid' to 'state.UpdatePlanDetailsDatas'
  return state.UpdatePlanDetailsDatas;
};