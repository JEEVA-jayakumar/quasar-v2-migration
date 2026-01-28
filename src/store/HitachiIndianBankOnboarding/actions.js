import api from "../api.js";

const ONBOARDING_MERCHANT_ASSIGNED_LIST = ({ commit }, request) => {
  const sorting = request.pagination.descending ? "asc" : "desc";
  console.log("requested datas:----------------:assigned-----" + JSON.stringify(request));
  return api
    .get("activeMerchantAssignList?page=" +
      request.pagination.page +
      "&size=" +
      request.pagination.rowsPerPage +
      "&search=" +
      request.filter +
      "&sort=" +
      request.pagination.sortBy +
      "&" +
      request.pagination.sortBy +
      ".dir=" +
      sorting
    )
    .then(response => {
      console.log("Response:------------->:Assigned----->" + JSON.stringify(response));
      // START=> COMMIT with data received'
      commit("SET_ONBOARDING_MERCHANT_ASSIGNED_LIST", response.data.data);
      // END=> COMMIT with data received'
    });
};

const HITACHI_INDIAN_ONBOARDING_LIST = ({
  commit
}, request) => {
  const sorting = request.pagination.descending ? "asc" : "desc";
  // console.log("requested datas:----------------:Unassigned-----"+JSON.stringify(request))
  return api
    .get("get-indian-bank-onboard-list?page=" +
      request.pagination.page +
      "&size=" +
      request.pagination.rowsPerPage +
      "&search=" +
      request.filter +
      "&sort=" +
      request.pagination.sortBy +
      "&" +
      request.pagination.sortBy +
      ".dir=" +
      sorting
    )
    .then(response => {
      // console.log("Response:------------->:UnAssigned----->"+JSON.stringify(response));
      // START=> COMMIT with data received'
      commit("SET_HITACHI_INDIAN_ONBOARDING_LIST", response.data.data);
      // END=> COMMIT with data received'
    });
};

const REASSIGN_HITACHI_MERCHANTS = (_, request) => {
  return api
    .put("re-submit-ogs-data/" + request.tid, request);
};

const CHANGE_HITACHI_REGION = (_, request) => {
  return api
    .post("reassign-region", request);
};

export default {
  ONBOARDING_MERCHANT_ASSIGNED_LIST,
  HITACHI_INDIAN_ONBOARDING_LIST,
  REASSIGN_HITACHI_MERCHANTS,
  CHANGE_HITACHI_REGION
};
