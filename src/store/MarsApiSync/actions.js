// Removed Vue 2 specific imports: import * as Vue from "vue" import VueResource from 'vue-resource';
import api from "../api.js";

const DEVICE_MODEL_MARS = (_, request) => {
  // Changed from { commit, rootState } to _ since neither is used
  console.log("DEVICE_MODEL_MARS-----------", request);
  let headers = {
    'Authorization': request
  };
  console.log("HEADERS_TOKEN_DETAILS-----------", {headers: headers});
  
  // Using api instead of api for Vue 3 compatibility
  // Note: You need to configure api.js to handle this specific base URL
  return api.get("https://smart.bijlipay.co.in:8080/api/deviceModel?NII=101", {headers: headers})
    .then(response => {
      console.log("SEND DEVICE MODEL MARS-----------", JSON.stringify(response));
      return response;
    });
};

const CITY_MARS = (_, request) => {
  // Changed from { commit, rootState } to _ since neither is used
  console.log("CITY_MARS-----------", request);
  let headers = {
    'Authorization': request
  };
  console.log("HEADERS_TOKEN_DETAILS-----------", {headers: headers});
  
  return api.get("https://smart.bijlipay.co.in:8080/api/city", {headers: headers})
    .then(response => {
      console.log("SEND CITY MARS-----------", JSON.stringify(response));
      return response;
    });
};

const REGION_MARS = (_, request) => {
  // Changed from { commit, rootState } to _ since neither is used
  console.log("REGION_MARS-----------", request);
  let headers = {
    'Authorization': request
  };
  console.log("HEADERS_TOKEN_DETAILS-----------", {headers: headers});
  
  return api.get("https://smart.bijlipay.co.in:8080/api/marsregion", {headers: headers})
    .then(response => {
      console.log("SEND REGION MARS-----------", JSON.stringify(response));
      return response;
    });
};

const RENTAL_PLAN_MARS = (_, request) => {
  // Changed from { commit, rootState } to _ since neither is used
  console.log("RENTAL_PLAN_MARS_REQUEST-----------", request);
  let headers = {
    'NII': '101'
  };
  console.log("HEADERS_TOKEN_DETAILS-----------", {headers: headers});
  
  return api.get("https://mars01.bijlipay.co.in:9090/v1/parameters/rental-plan?institutionCode=101", {headers: headers})
    .then(response => {
      console.log("SEND RENTAL PLAN MARS-----------", JSON.stringify(response));
      return response;
    });
};

const LEAD_FORM_MARS = (_, request) => {
  // Changed from { commit, rootState } to _ since neither is used
  console.log("LEAD_FORM_MARS-----------", request);
  let headers = {
    'Authorization': request
  };
  console.log("HEADERS_TOKEN_DETAILS-----------", {headers: headers});
  
  return api.get("https://smart.bijlipay.co.in:8080/api/leadFrom", {headers: headers})
    .then(response => {
      console.log("SEND LEAD FORM MARS-----------", JSON.stringify(response));
      return response;
    });
};

const STATE_MARS = (_, request) => {
  // Changed from { commit, rootState } to _ since neither is used
  console.log("STATE_MARS-----------", request);
  let headers = {
    'Authorization': request
  };
  console.log("HEADERS_TOKEN_DETAILS-----------", {headers: headers});
  
  return api.get("https://smart.bijlipay.co.in:8080/api/state", {headers: headers})
    .then(response => {
      console.log("SEND STATE MARS-----------", JSON.stringify(response));
      return response;
    });
};

export default {
  DEVICE_MODEL_MARS,
  CITY_MARS,
  REGION_MARS,
  RENTAL_PLAN_MARS,
  LEAD_FORM_MARS,
  STATE_MARS
};
