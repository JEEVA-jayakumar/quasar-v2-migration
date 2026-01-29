import api from "../api.js";
// Removed unused Vue import
// import * as Vue from "vue";

const PRICING_EXCEPTION_LIST = ({commit}) => {  // Removed unused request parameter
  return api.get("get-pricing-exceptions").then(response => {
    commit("SET_PRICING_EXCEPTION_LIST", response.data.data.leadInformation);
  });
};

const PRICING_RSM_LIST = ({commit}) => {  // Removed unused request parameter
  return api.get("national-head-pricing-exceptions").then(response => {
    commit("SET_PRICING_RSM_LIST", response.data.data.userList);
  });
};

const PRICING_EXCEPTION_LIST_WHERE_RSMID = ({ commit }, request) => {
  return api.get("get-pricing-exceptions/" + request.id).then(response => {
    commit(
      "SET_PRICING_EXCEPTION_BY_RSMID_LIST",
      response.data.data.leadInformation
    );
  });
};

const PRICING_EXCEPTION_VERIFICATION = (context, request) => {  // Removed unused commit parameter
  return api.post(
    "rsm/pricing-verification/" + request.leadId + "/" + request.action,
    request.remarks
  );
};

export default {
  PRICING_EXCEPTION_LIST,
  PRICING_RSM_LIST,
  PRICING_EXCEPTION_LIST_WHERE_RSMID,
  PRICING_EXCEPTION_VERIFICATION
};
