import api from "../api.js";

const FSE_MENU = ({commit}) => {
  return api.get("soMenulist").then(response => {
    console.log(response);
    // START=> COMMIT with data received'
    commit("SET_FSE_MENU", response.data.data);
    // END=> COMMIT with data received'
  });
};

export default {
  FSE_MENU
};
