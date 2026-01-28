import api from "../api.js";
// Removed unused Vue import
// import * as Vue from "vue";

export const RENTAL_PLAN = (context, request) => {  // Removed unused commit and rootState parameters
  return api
    .post('manage/data/rental-plan-details/' + request.url.leadSource + "/" + request.url.device + "/" + request.url.plan, request.params)
}