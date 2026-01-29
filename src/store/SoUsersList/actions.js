import api from "../api.js";

const SO_USERS_LIST = ({
  commit
}) => { // Removed unused request parameter
  return api
    .get("so-user-list/" + JSON.parse(localStorage.getItem("u_i")).roles[0].hierarchy.id + "/" + JSON.parse(localStorage.getItem("u_i")).region.id)
    .then(response => {
      // START=> COMMIT with data received'
      commit("SET_DEVICE_RECOVERY_SO_LIST", response.data.data);
      // END=> COMMIT with data received'
    })
}

export default {
  SO_USERS_LIST
};
