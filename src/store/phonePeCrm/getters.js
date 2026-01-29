const getPhonepeMerchantDetails = state => {
    return state.phonepeMerchantDetails;
  };
  const getPhonepeCompletedData = state => {
    return state.phonepeCompletedDetails;
  };
  const getphonepeDate = state => {
    console.log("CRM DATE GETTER",JSON.stringify(state.phonepeDate))
    return state.phonepeDate;
  };
  function getupdateRemarks(state) {
    return state.updateRemarks
}
const getstaticNewRequestsLead = state => {
  console.log("GetterstaticNewRequestsLead",JSON.stringify(state.staticNewRequestsLead))
  return state.staticNewRequestsLead;
};
const getstaticReferBackLead = state => {
  console.log("GetterstaticReferBackLead",JSON.stringify(state.staticNewRequestsLead))
  return state.staticReferBackLead;
};
const getstaticCourierLead = state => {
  console.log("GetterstaticCourierLeadLead",JSON.stringify(state.staticNewRequestsLead))
  return state.staticCourierLead;
};
function getupdateSacnQRNumber(state) {
  return state.updateSacnQRNumber
};
function getupdateSacnSoundBoxNumber(state) {
  return state.updateSacnSoundBoxNumber
};
function getpaperPdf(state) {
  return state.paperPdf
};
function getphonepeCompletedPaperRoll(state) {
  return state.phonepeCompletedPaperRoll
};
function getphonepeRtoTicket(state) {
  return state.phonepeRtoTicket
};

const getphonepePaperRoll = state => {
  console.log("phonepePaperRoll",JSON.stringify(state.phonepeDate))
  return state.phonepePaperRoll;
};
function getupdatePodNumber(state) {
  return state.updatePodNumber
};


function getattemptLog(state) {
  return state.attemptLog
};

function getoptionsList(state) {
  return state.optionsList
};

function getResolutionStatus(state) {
  return state.resolutionList
};

function getFetchIssueList(state) {
  return state.fetchIssueList
};



function getIssueAction(state) {
  return state.fetchActionList
};

function getviewlogs(state) {
  return state.viewlogs
};


export default {
  getFetchIssueList,
  getIssueAction,
  getPhonepeCompletedData,
  getPhonepeMerchantDetails,
  getResolutionStatus,
  getattemptLog,
  getoptionsList,
  getpaperPdf,
  getphonepeCompletedPaperRoll,
  getphonepeDate,
  getphonepePaperRoll,
  getphonepeRtoTicket,
  getstaticCourierLead,
  getstaticNewRequestsLead,
  getstaticReferBackLead,
  getupdatePodNumber,
  getupdateRemarks,
  getupdateSacnQRNumber,
  getupdateSacnSoundBoxNumber,
  getviewlogs
};
