import api from "../api.js";
import moment from "moment";
// Removed unused Vue import

function commonDateFormat(selectedDate) {
  if (
    selectedDate == "" ||
    selectedDate == null ||
    selectedDate == "Invalid date"
  ) {
    return null;
  } else {
    return moment(selectedDate).format("DD/MM/YYYY");
  }
}

export const MARS_DATA_SUBMIT_INTERNAL = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.post(
    "submit-to-mars-data-information/" +
    request.merchant.leadId +
    "/" +
    request.action,
    request.merchant
  );
};

export const MARS_DATA_SUBMIT_INTERNAL_CHANGEMANAGEMENT = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.post(
    "submit-to-mars-data-information/" +
    request.url.leadId +
    "/1",
    request.params.merchant
  );
};

export const MARS_DATA_SUBMIT_EXTERNAL = ({
  rootState // Keep rootState, removed unused commit
}, request) => {
  console.log("Test" + localStorage.getItem("aa_t"));
  let variable = localStorage.getItem("aa_t")
  let v = variable.lastIndexOf('|')
  let res = variable.substring(v + 1)
  let headers = {
    'NII': res
  };
  
  //Date formatting for MARS
  request.params.merchant.salesInformation.applicationDate = commonDateFormat(
    request.params.merchant.salesInformation.applicationDate
  );

  request.params.merchant.salesInformation.aggreementDate = commonDateFormat(
    request.params.merchant.salesInformation.aggreementDate
  );

  request.params.merchant.salesInformation.loanDisbursementDate = commonDateFormat(
    request.params.merchant.salesInformation.loanDisbursementDate
  );

  request.params.merchant.salesInformation.tenureStartDate = commonDateFormat(
    request.params.merchant.salesInformation.tenureStartDate
  );

  request.params.merchant.companyInformation.establishYear = commonDateFormat(
    request.params.merchant.companyInformation.establishYear
  );

  request.params.merchant.bankInformation.collectionDetails.chequeDepositedDate = commonDateFormat(
    request.params.merchant.bankInformation.collectionDetails
      .chequeDepositedDate
  );

  request.params.merchant.bankInformation.collectionDetails.collectedDate = commonDateFormat(
    request.params.merchant.bankInformation.collectionDetails.collectedDate
  );

  request.params.merchant.bankInformation.collectionDetails.chequeDate = commonDateFormat(
    request.params.merchant.bankInformation.collectionDetails.chequeDate
  );
  
  request.params.merchant.additionalInfo.ownerDOB = commonDateFormat(
    request.params.merchant.additionalInfo.ownerDOB
  );

  request.params.merchant.businessInformation.memberSince = commonDateFormat(
    request.params.merchant.businessInformation.memberSince
  );
  
  // Remove self-assignments - these lines do nothing
  if (request.params.merchant.businessInformation.gstId == "") {
    request.params.merchant.businessInformation.gstId = null;
  }
  // Removed: else { request.params.merchant.businessInformation.gstId = request.params.merchant.businessInformation.gstId; }
  
  if (request.params.merchant.additionalInfo.installationBranchCode == "" || request.params.merchant.salesInformation.institutionCode != 104) {
    request.params.merchant.additionalInfo.installationBranchCode = null;
  }
  // Removed self-assignment
  
  if (request.params.merchant.additionalInfo.iaLocation == "" || request.params.merchant.salesInformation.institutionCode != 104) {
    request.params.merchant.additionalInfo.iaLocation = null;
  }
  // Removed self-assignment
  
  if (request.params.merchant.additionalInfo.iaDistrict == "" || request.params.merchant.salesInformation.institutionCode != 104) {
    request.params.merchant.additionalInfo.iaDistrict = null;
  }
  // Removed self-assignment
  
  if (request.params.merchant.additionalInfo.branchZone == "" || request.params.merchant.salesInformation.institutionCode != 104) {
    request.params.merchant.additionalInfo.branchZone = null;
  }
  // Removed self-assignment
  
  if (request.params.merchant.additionalInfo.raDistrict == "" || request.params.merchant.salesInformation.institutionCode != 104) {
    request.params.merchant.additionalInfo.raDistrict = null;
  }
  // Removed self-assignment
  
  if (request.params.merchant.additionalInfo.od1District == "" || request.params.merchant.salesInformation.institutionCode != 104) {
    request.params.merchant.additionalInfo.od1District = null;
  }
  // Removed self-assignment
  
  if (request.params.merchant.additionalInfo.od2District == "" || request.params.merchant.salesInformation.institutionCode != 104) {
    request.params.merchant.additionalInfo.od2District = null;
  }
  // Removed self-assignment
  
  if (request.params.merchant.additionalInfo.lorState == "" || request.params.merchant.salesInformation.institutionCode != 104) {
    request.params.merchant.additionalInfo.lorState = null;
  }
  // Removed self-assignment
  
  if (request.params.merchant.additionalInfo.iaSalutation == "" || request.params.merchant.salesInformation.institutionCode != 104) {
    request.params.merchant.additionalInfo.iaSalutation = null;
  }
  // Removed self-assignment
  
  if (request.params.merchant.additionalInfo.iaGender == "" || request.params.merchant.salesInformation.institutionCode != 104) {
    request.params.merchant.additionalInfo.iaGender = null;
  }
  // Removed self-assignment
  
  if (request.params.merchant.additionalInfo.od1Salutation == "" || request.params.merchant.salesInformation.institutionCode != 104) {
    request.params.merchant.additionalInfo.od1Salutation = null;
  }
  // Removed self-assignment
  
  if (request.params.merchant.additionalInfo.od1Gender == "" || request.params.merchant.salesInformation.institutionCode != 104) {
    request.params.merchant.additionalInfo.od1Gender = null;
  }
  // Removed self-assignment
  
  if (request.params.merchant.additionalInfo.od2Salutation == "" || request.params.merchant.salesInformation.institutionCode != 104) {
    request.params.merchant.additionalInfo.od2Salutation = null;
  }
  // Removed self-assignment
  
  if (request.params.merchant.additionalInfo.od2Gender == "" || request.params.merchant.salesInformation.institutionCode != 104) {
    request.params.merchant.additionalInfo.od2Gender = null;
  }
  // Removed self-assignment
  
  if (request.params.merchant.additionalInfo.states == "" || request.params.merchant.paymentDetails.terminalType != "MPOS") {
    request.params.merchant.additionalInfo.states = null;
  }
  // Removed self-assignment

  if (request.params.merchant.additionalInfo.fillingTypes == "" || request.params.merchant.paymentDetails.terminalType != "MPOS") {
    request.params.merchant.additionalInfo.fillingTypes = null;
  }
  // Removed self-assignment
  
  if (request.params.merchant.additionalInfo.category == "" || request.params.merchant.paymentDetails.terminalType != "MPOS") {
    request.params.merchant.additionalInfo.category = null;
  }
  // Removed self-assignment
  
  if (request.params.merchant.additionalInfo.subCategory == "" || request.params.merchant.paymentDetails.terminalType != "MPOS") {
    request.params.merchant.additionalInfo.subCategory = null;
  }
  // Removed self-assignment
  
  if (request.leadStatus == 102) {
    if(res == 104){
      // Using api instead of api for Vue 3 compatibility
      const baseURL = rootState.GlobalVariables?.STATE_MARS_AXIS_ON_BOARD_API_URL || '';
      return api.put(
        `${baseURL}merchant/${request.refNumber}`,
        request.params, {
        headers: headers
      }
      );
    }else{
      const baseURL = rootState.GlobalVariables?.STATE_MARS_ON_BOARD_API_URL || '';
      return api.put(
        `${baseURL}merchant/${request.refNumber}`,
        request.params, {
        headers: headers
      }
      );
    }
  } else {
    if(res == 104){
      const baseURL = rootState.GlobalVariables?.STATE_MARS_AXIS_ON_BOARD_API_URL || '';
      return api.post(
        `${baseURL}merchant`,
        request.params, {
        headers: headers
      }
      );
    }else{
      const baseURL = rootState.GlobalVariables?.STATE_MARS_ON_BOARD_API_URL || '';
      return api.post(
        `${baseURL}merchant`,
        request.params, {
        headers: headers
      }
      );
    }
  }
};

export const MARS_DATA_EXTERNAL_SUBMIT_RESPONSE = (
  _, // Changed from { commit, rootState } to _ since neither is used
  request
) => {
  return api.put(
    "submit-to-mars-response-data/" + request.leadId,
    request.request
  );
}; 

export const SAT_TO_MARS_LEADDETAILS_SHARING_TO_HITACHI = (_, request) => {
  // Changed from { commit, rootState } to _ since neither is used
  console.log("SAT_TO_MARS_LEADDETAILS_SHARING_TO_HITACHI datasss --------->", request)
  return api.post("update-lead_data-submit-to-mars/" + request.leadId, request.request);
};

//mars-device-details/submit-sub-tid-merchant-ref-code
export const SUBMIT_SUB_TID_MERCHANT_REF_CODE_DETAILS = (_, request) => {
  // Changed from { commit, rootState } to _ since neither is used
  return api.post("mars-device-details/submit-sub-tid-merchant-ref-code/" + request.marsDeviceId + "/" + request.merchantRefCode);
};

export const FETCH_SAVED_DATA_FROM_OWN_DB = ({
  commit // Keep commit, removed unused rootState
},
  request
) => {
  return api
    .get("get-mars-data-information/" + request.leadId)
    .then(response => {
      commit("SET_SAVED_DATA_FROM_OWN_DB", response.data.data);
      return response.data.data;
    });
};

export const MARS_STATIC_QR_DATA_SUBMIT = ({
  rootState // Keep rootState, removed unused commit
}, request) => {
  let variable = localStorage.getItem("bb_t")
  let v = variable.lastIndexOf('|')
  let res = variable.substring(v + 1)
  let headers = {
    'NII': res
  };
  
  if(request.qrLeadStatus == 9){
    console.log("REFFER BACK");
    const baseURL = rootState.GlobalVariables?.STATE_MARS_ON_BOARD_API_URL || '';
    // Using api instead of api for Vue 3 compatibility
    return api.put(
      `${baseURL}merchant/${request.refNumber}`,
      request.params, {
      headers: headers 
    }
    );
  }else{  
    console.log("NEW LEAD");
    const baseURL = rootState.GlobalVariables?.STATE_MARS_ON_BOARD_API_URL || '';
    return api.post(
      `${baseURL}merchant`,
      request.params, {
      headers: headers 
    }
    );
  }
}

export const MARS_CHECK_STATUS_API = ({
  rootState // Keep rootState, removed unused commit
},
  request
) => {
  let variable = localStorage.getItem("aa_t")
  let v = variable.lastIndexOf('|')
  let res = variable.substring(v + 1)
  let headers = {
    'NII': res
  };

  const baseURL = rootState.GlobalVariables?.STATE_MARS_ON_BOARD_API_URL || '';
  let url = `${baseURL}parameters/merchantStatus?institutionCode=${request.merchant.salesInformation.institutionCode}&applicationNumber=${request.merchant.salesInformation.applicationNumber}`;
  
  // Using api instead of api for Vue 3 compatibility
  return api.get(url , {headers : headers})
    .then(response => {
      console.log("RESPONSE VALUE",response);
      return response;
    });
};

export const EQUITAS_FRM_DATA = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.post(
    "store-equitas-frm-details",request
  );
};