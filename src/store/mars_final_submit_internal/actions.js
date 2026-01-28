import api from "../api.js";
// Removed unused Vue import

export const MARS_FINAL_SUBMIT_INTERNAL = (_, request) => {
  // Changed from _ to _ since commit is not used
  console.log("REQUEST---------------------->" + request.merchant.leadInformation);
  return api.post(
    "submit-to-mars-data-information/" +
    request.merchant.leadInformation.id +
    "/" +
    request.action,
    request.merchant
  );
};