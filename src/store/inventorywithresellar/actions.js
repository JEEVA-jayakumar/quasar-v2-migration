import api from "../api.js";

const FETCH_INVENTORY_WITH_RESELLAR = ({commit}) => {
    return api.get("allresellerinventorydetails").then(response => {
        commit("SET_ALL_INVENTORY_WITH_RESELLAR_LIST", response.data.data);
    });
};

export default {
  FETCH_INVENTORY_WITH_RESELLAR
};
