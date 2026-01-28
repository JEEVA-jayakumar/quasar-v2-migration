import api from "../api.js";
const FETCH_LEAD_SOURCE_SAT_PORTAL = ({
  commit
}, request) => {
  return api.get("manage/data/leadsource/", request).then(response => {
    commit("SET_LEAD_SOURCE_SAT_PORTAL", response.data.data);
  });
};

export default {
  FETCH_LEAD_SOURCE_SAT_PORTAL
};
