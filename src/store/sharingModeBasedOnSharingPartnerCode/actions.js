// Remove unused api import
// import api from "../api.js";
import * as Vue from "vue";

const FETCH_SHARING_MODEL_BASED_SHARING_PARTNER_CODE = ({
  commit,
  rootState
}, request) => {
  return api
    .get(rootState.GlobalVariables.STATE_MARS_API + "sharing-partner/" + request)
    .then(response => {
      let sharingModeBasedSharingPartner = [];
      
      // Fixed: Use response.data instead of response.body
      if (response.data && response.data.items && response.data.items.length > 0) {
        // Remove unused 'key' parameter from map callback
        response.data.items.map(function (value) {
          console.log("FETCH_SHARING_MODEL_BASED_SHARING_PARTNER_CODE response.data.items ----->", JSON.stringify(value))
          sharingModeBasedSharingPartner.push({
            label: value.name,
            value: value.code,
          });
        });
      }
      
      commit("SET_ALL_SHARINGMODE_BASED_SHARINGPARTNER", sharingModeBasedSharingPartner);
    });
};

export default {
  FETCH_SHARING_MODEL_BASED_SHARING_PARTNER_CODE
};
