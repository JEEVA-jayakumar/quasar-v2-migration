import api from "../api.js";

export const BPREGION_MENU = ({commit}) => {
  // Removed unused 'request' parameter
  return api.get("getBpRegionsMenu").then(response => {
    console.log(response);
    commit("SET_BPREGION_MENU", response.data.data);
  });
};