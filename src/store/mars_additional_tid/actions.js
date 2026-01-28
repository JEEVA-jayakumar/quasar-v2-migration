import api from "../api.js";
// Removed unused Vue import for Vue 3 compatibility

export const ADDITIONAL_TID_FROM_MARS = ({
  commit,
  rootState
}, request) => {
  let variable = localStorage.getItem("a_t")
  let v = variable.lastIndexOf('|')
  let res = variable.substring(v + 1)
  let headers = {
    'NII': res
  };

  // Using api instead of api for Vue 3 compatibility
  const baseURL = res == 104 
    ? rootState.GlobalVariables?.STATE_MARS_AXIS_ON_BOARD_API_URL 
    : rootState.GlobalVariables?.STATE_MARS_ON_BOARD_API_URL;
  
  return api
    .post(`${baseURL}additionalTerminals`, request, { 
      headers: headers
    })
    .then(response => {
      commit("SET_ADDITIONAL_TID_FROM_MARS", response.data.data);
      console.log("Action Datas------------------>"+JSON.stringify(response.data.data))
      return response;
    })
    .catch(error => {
      console.error("Error fetching additional TID from MARS:", error);
      throw error;
    });
};

export const ADDITIONAL_TID_FROM_BACK_END = ({ commit }, request) => {
  // Removed unused rootState parameter
  console.log("ACTION LEAD ID------------->"+JSON.stringify(request.params.Id.leadId))
  console.log("ACTION COUNT-------------->"+JSON.stringify(request.params.Count.count))
  
  return api
    .post(`add-on-tid/${request.params.Id.leadId}/${request.params.Count.count}`)
    .then(response => {
      commit("SET_ADDITIONAL_TID_FROM_BACK_END", response.data);
      return response;
    })
    .catch(error => {
      console.error("Error fetching additional TID from backend:", error);
      throw error;
    });
};