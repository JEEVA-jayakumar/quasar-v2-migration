import api from '../api.js';
// Removed unused import: import { req } from 'vuelidate/lib/validators/common.js';

const FETCH_PHONEPE_CLIENT_CRM = ({
  commit
}, request) => {
  let sorting = request.pagination.descending ? 'asc' : 'desc';
  return api
    .get("crm-request/getClientData/0/1?page="+
    request.pagination.page +
    "&size=" +
    request.pagination.rowsPerPage +
    "&searchTerm=" +
    request.filter +
    "&sort=" +
    request.pagination.sortBy +
    "&" +
    request.pagination.sortBy +
    ".dir=" +
    sorting)
    .then(response => {
        // console.log("PHONEPE ACTION",JSON.stringify(response));
 
      commit('SET_PHONEPE_CLIENT_CRM', response.data.data);
    });
};

const FETCH_PHONEPE_COMPLETED_DATA = ({
  commit
}, request) => {
if(request.pagination.sortBy == null){
  return api
  .get("crm-request/getClientData/0/0?page="+
  request.pagination.page +
  "&size=" +
  request.pagination.rowsPerPage +
  "&searchTerm=" +
  request.filter 
      // '&sort=' +
      // request.pagination.sortBy +
      // '&' +
      // request.pagination.sortBy +
      // '.dir=' +
      // sorting  
      )
    .then(response => {
      console.log("PHONEPE ACTION",JSON.stringify(response));
      commit('SET_PHONEPE_COMPLETED_DATA', response.data.data);

    })
}else{
  let sorting = request.pagination.descending ? 'asc' : 'desc'
  return api
  .get("crm-request/getClientData/0/0?page="+
  request.pagination.page +
  "&size=" +
  request.pagination.rowsPerPage +
  "&searchTerm=" +
  request.filter +
  "&sort=" +
  request.pagination.sortBy +
  "&" +
  request.pagination.sortBy +
  ".dir=" +
  sorting)
  .then(response => {
    console.log("PHONEPE ACTION",JSON.stringify(response));
      commit('SET_PHONEPE_COMPLETED_DATA', response.data.data);
  })
}
};

const PHONEPE_CRM_DATE = ({
  commit
}, request) => {
if(request.pagination.sortBy == null){
  return api
    .get("crm-request/ticketData/0/"+request.date
      +"?page="+
    request.pagination.page +
    "&size=" +
    request.pagination.rowsPerPage +
    "&searchTerm=" +
    request.filter 
      // '&sort=' +
      // request.pagination.sortBy +
      // '&' +
      // request.pagination.sortBy +
      // '.dir=' +
      // sorting  
      )
    .then(response => {
      commit('SET_PHONEPE_CRM_DATE', response.data.data);

    })
}else{
  let sorting = request.pagination.descending ? 'asc' : 'desc'
  return api
  .get("crm-request/ticketData/0/"+request.date+"?page="+
  request.pagination.page +
  "&size=" +
  request.pagination.rowsPerPage +
  "&searchTerm=" +
  request.filter +
  "&sort=" +
  request.pagination.sortBy +
  "&" +
  request.pagination.sortBy +
  ".dir=" +
  sorting)
  .then(response => {
    commit('SET_PHONEPE_CRM_DATE', response.data.data);
  })
}
};

const UPDATE_CRM_REMARKS = ({
  commit
}, request) => {
  console.log("DAGA : ==== : ", JSON.stringify(request))
  return api.put("crm-request/updateCrmRemark/" + request.serviceRequest, request)
    .then(response => {
      console.log();
      commit("SET_CRM_REMARKS", response);
    });
};

const ASSIGN_TO_COMPLETE = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.put("crm-request/assignTicket/1" , request)
};

const ESCALATE_TO_SAT = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.put("crm-request/assignTicket/2" , request)
};

const FETCH_STATIC_QR_NEW_REQUESTS = ({
  commit
}, request) => {
  let sorting = request.pagination.descending ? 'asc' : 'desc';
  return api
    .get("getAllSQRLeads?page="+
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
   sorting)
    .then(response => {
      commit('SET_STATIC_QR_NEW_REQUESTS', response.data.data);
    });
};

const UPDATE_SCAN_QR_NUMBER = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.post("kvb-qr-scan-details/"+ request.data1.id+ "/" + 1,request.formsList);
};

const UPDATE_SCAN_SOUNDBOX_NUMBER = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.post("kvb-qr-scan-details/"+ request.data1.id+ "/" + 2,request.formsList);
};

const SUBMIT_STATIC_QR_NEW_REQUESTS = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.put("update-print-info/"+ request.id, request)
};

const FETCH_STATIC_QR_REFER_BACK_REQUESTS = ({
  commit
}, request) => {
  let sorting = request.pagination.descending ? 'asc' : 'desc';
  return api
    .get("getReferBackLeads?page="+
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
   sorting)
    .then(response => {
      commit('SET_STATIC_QR_REFER_BACK_REQUESTS', response.data.data);
  
    });
};

const REFERBACK_RESUMBIT_LEAD = (_, request) => {
  // Changed from _ to _ since commit is not used
  // console.log("REQUEST_UPDATE_SCAN_SOUNDBOX_NUMBER------------------->"+JSON.stringify(request.id))
  return api.post("submit-full-lead/"+ request.id,request);
};

const UPDATE_CALL_LOG_CRM_REMARKS = (_, request) => {
  // Changed from _ to _ since commit is not used
  // console.log("REQUEST_UPDATE_SCAN_SOUNDBOX_NUMBER------------------->"+JSON.stringify(request.id))
  return api.post("call-log/store-data",request);
};

const FETCH_STATIC_QR_COURIER_REQUESTS = ({
  commit
}, request) => {
  // console.log("REQUEST------------------->"+JSON.stringify(request.id))
  let sorting = request.pagination.descending ? 'asc' : 'desc';
  return api
    .get("getAllCourierList?page="+
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
   sorting)
    .then(response => {
      commit('SET_STATIC_QR_COURIER_REQUESTS', response.data.data);
     
    });
};

const COURIER_POD_NUMBER_LEAD = (_, request) => {
  // Changed from _ to _ since commit is not used
  // console.log("REQUEST_UPDATE_SCAN_SOUNDBOX_NUMBER------------------->"+JSON.stringify(request.id))
  return api.put("update-pod-details/"+ request.data1.id,request.formsList);
};

const PHONEPE_PAPER_ROLL_PDF = ({
  commit
}, request) => {

  return api
    .get("crm-request/generatePdf/"+request)
    .then(response => {
      commit('SET_PHONEPE_PAPER_ROLL_PDF', response.data.data);
    });
};

const FETCH_PHONEPE_PAPER_ROLL_COMPLETED_DATA = ({
  commit
}, request) => {
  if (request.pagination.sortBy == null) {
    return api
    .get("crm-request/getPaperRollTickets/0/0?page="+
    request.pagination.page +
    "&size=" +
    request.pagination.rowsPerPage +
    "&searchTerm=" +
    request.filter).then(response => {
      console.log("PHONEPE ACTION",JSON.stringify(response));
    commit('SET_PHONEPE_PAPER_ROLL_COMPLETED_DATA', response.data.data);
  });
}else{
  console.log("REQUEST",request.pagination.descending);
  let sorting = request.pagination.descending ? 'asc' : 'desc';
  return api
    .get("crm-request/getPaperRollTickets/0/0?page="+
    request.pagination.page +
    "&size=" +
    request.pagination.rowsPerPage +
    "&searchTerm=" +
    request.filter +
    "&sort=" +
    request.pagination.sortBy +
    "&" +
    request.pagination.sortBy +
    ".dir=" +
    sorting)
    .then(response => {
        
      commit('SET_PHONEPE_PAPER_ROLL_COMPLETED_DATA', response.data.data);
    });
  }
};

const FETCH_PHONEPE_RTO_TICKET = ({
  commit
}, request) => {
  if (request.pagination.sortBy == null) {
    return api
    .get("crm-request/getRTOPaperRollTickets/0/0/?page="+
    request.pagination.page +
    "&size=" +
    request.pagination.rowsPerPage +
    "&searchTerm=" +
    request.filter).then(response => {
      commit('SET_PHONEPE_RTO_TICKET', response.data.data);
    });
}else{
  let sorting = request.pagination.descending ? 'asc' : 'desc';
  return api
    .get("crm-request/getRTOPaperRollTickets/0/0/?page="+
    request.pagination.page +
    "&size=" +
    request.pagination.rowsPerPage +
    "&searchTerm=" +
    request.filter +
    "&sort=" +
    request.pagination.sortBy +
    "&" +
    request.pagination.sortBy +
    ".dir=" +
    sorting)
    .then(response => {
      commit('SET_PHONEPE_RTO_TICKET', response.data.data);
    });
  }
};

const PHONEPE_PAPER_ROLL_SUBMIT = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.put("crm-request/ticketUpdate/"+request)
};

const MARK_RTO = (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.put("crm-request/mark-rto/"+request)
};

const UPDATE_PHONEPE_PAPERROLL_PODNUMBER = ({
  commit
}, request) => {
  // data = {
  //   podNumber : request.podNumber
  // }

  return api.put("crm-request/podNumberUpdate/" + request.ticketId, request.podNumber)
    .then(response => {
    
      commit("SET_UPDATE_PHONEPE_PAPERROLL_PODNUMBER", response);
    });
};

const PHONEPE_PAPER_ROLL_PENDING = ({
  commit
}, request) => {
  let sorting = request.pagination.descending ? 'asc' : 'desc';
  return api
    .get("crm-request/paperRollTickets/0/"+request.date+"?page="+
    request.pagination.page +
   "&size=" +
   request.pagination.rowsPerPage +
   "&searchTerm=" +
   request.filter +
   "&sort=" +
   request.pagination.sortBy +
   "&" +
   request.pagination.sortBy +
   ".dir=" +
   sorting)
    .then(response => {
      commit('SET_PHONEPE_PAPER_ROLL_PENDING', response.data.data);
    });
};

const PPE_CALLBACK_RESOLVED= (_, request) => {
  // Changed from _ to _ since commit is not used
  return api.put("crm-request/assignTicket/3" , request)
};

const PHONEPE_CRM_CALL_LOG_ATTEMPTS = ({
  commit
}, request) => {

  return api
    .get("call-log/getAttempts/"+request)
    .then(response => {
      commit('SET_PHONEPE_CRM_CALL_LOG_ATTEMPTS', response.data.data);
    });
};

const PHONEPE_CRM_OPTION_LIST_DETAILS = ({commit}) => {
  // Removed unused 'request' parameter
  return api
  .get("issue-options")
  .then(response => {
    commit('SET_PHONEPE_CRM_OPTION_LIST_DETAILS', response.data.data);
  });
};

const PHONEPE_CRM_RESOLUTION_STATUS = ({
  commit
}, request) => {
  return api
  .get("resolution-status/"+request)
  .then(response => {
    commit('SET_PHONEPE_CRM_RESOLUTION_STATUS', response.data.data);
  });
};

const PHONE_PE_VIEW_CALL_LOGS = ({
  commit
}, request) => {

  return api
    .get("call-log/fetch-data/"+request.serviceTicketId)
    .then(response => {
      commit('SET_PHONE_PE_VIEW_CALL_LOGS', response.data.data);
    });
};
  
const PHONEPE_CRM_FETCH_ISSUE_STATUS = ({
  commit
}, request) => {
  return api
  .get("issue/fetch/"+request)
  .then(response => {
    commit('SET_PHONEPE_CRM_FETCH_ISSUE_STATUS', response.data.data);
  });
};

const PHONEPE_CRM_ISSUE_ACTION_STATUS = ({
  commit
}, request) => {
  return api
  .get("action/fetch/"+request)
  .then(response => {
    commit('SET_PHONEPE_CRM_ISSUE_ACTION_STATUS', response.data.data);
  });
};

const ISSUE_RESOLVED_BY_CRM   = (_, request) => {
  // Changed from _ to _ since commit is not used
  // console.log("REQUEST_UPDATE_SCAN_SOUNDBOX_NUMBER------------------->"+JSON.stringify(request.id))
  return api.put("crm-request/assignTicket/1",request);
};

const ISSUE_NOT_RESOLVED_BY_CRM   = (_, request) => {
  // Changed from _ to _ since commit is not used
  console.log("REQ ACTION",request);
  
  // console.log("REQUEST_UPDATE_SCAN_SOUNDBOX_NUMBER------------------->"+JSON.stringify(request.id))
  return api.put("crm-request/assignTicket/3",request);
};

const MOVE_TO_SAT = (_, request) => {
  // Changed from _ to _ since commit is not used
  // console.log("REQUEST_UPDATE_SCAN_SOUNDBOX_NUMBER------------------->"+JSON.stringify(request.id))
  return api.put("crm-request/assignTicket/2",request);
};

export default {
  FETCH_PHONEPE_CLIENT_CRM,
  FETCH_PHONEPE_COMPLETED_DATA,
  PHONEPE_CRM_DATE,
  UPDATE_CRM_REMARKS,
  ASSIGN_TO_COMPLETE,
  ESCALATE_TO_SAT,
  FETCH_STATIC_QR_NEW_REQUESTS,
  UPDATE_SCAN_QR_NUMBER,
  UPDATE_SCAN_SOUNDBOX_NUMBER,
  SUBMIT_STATIC_QR_NEW_REQUESTS,
  FETCH_STATIC_QR_REFER_BACK_REQUESTS,
  REFERBACK_RESUMBIT_LEAD,
  UPDATE_CALL_LOG_CRM_REMARKS,
  FETCH_STATIC_QR_COURIER_REQUESTS,
  COURIER_POD_NUMBER_LEAD,
  PHONEPE_PAPER_ROLL_PDF,
  FETCH_PHONEPE_PAPER_ROLL_COMPLETED_DATA,
  FETCH_PHONEPE_RTO_TICKET,
  PHONEPE_PAPER_ROLL_SUBMIT,
  MARK_RTO,
  UPDATE_PHONEPE_PAPERROLL_PODNUMBER,
  PHONEPE_PAPER_ROLL_PENDING,
  PPE_CALLBACK_RESOLVED,
  PHONEPE_CRM_CALL_LOG_ATTEMPTS,
  PHONEPE_CRM_OPTION_LIST_DETAILS,
  PHONEPE_CRM_RESOLUTION_STATUS,
  PHONE_PE_VIEW_CALL_LOGS,
  PHONEPE_CRM_FETCH_ISSUE_STATUS,
  PHONEPE_CRM_ISSUE_ACTION_STATUS,
  ISSUE_RESOLVED_BY_CRM,
  ISSUE_NOT_RESOLVED_BY_CRM,
  MOVE_TO_SAT
};
