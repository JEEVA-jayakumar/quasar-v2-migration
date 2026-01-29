const SET_SERVICE_REQUEST_GET_TYPES = (state, payload) => {
    console.log("Spare parts Mutations: ------------ : " +  JSON.stringify(payload))
    state.serviceRequestGetTypes = payload;
  } 
  const SET_ACTIVE_ISSUE_MAPPING = (state, payload) => {
    console.log("ACTIVE_ISSUE_MAPPING ------------ : " +  JSON.stringify(payload))
    state.activeIssueMapping = payload;
  }
  const SET_DEACTIVE_ISSUE_MAPPING = (state, payload) => {
    console.log("DEACTIVE_ISSUE_MAPPING ------------ : " +  JSON.stringify(payload))
    state.deactiveIssueMapping = payload;
  }
  const SET_SERVICE_RESOLUTION_REMARKS = (state, payload) => {
    console.log("Spare parts Mutations: ------------ : " +  JSON.stringify(payload))
    state.serviceResolutionRemarks = payload;
  }

  const SET_GET_SERVICE_ISSUE_TYPES = (state, payload) => {
    console.log("Spare parts Mutations: ------------ : " +  JSON.stringify(payload))
    state.serviceRequestIssueTypes = payload;
  }
  const SET_CS_SUB_ISSUE = (state, payload) => {
    console.log("Spare parts Mutations: ------------ : " +  JSON.stringify(payload))
    state.csSubIssue = payload;
  }
  const SET_SUB_TASK_DATAS = (state, payload) => {
    console.log("Spare parts Mutations subTaskDetails: ------------ : " +  JSON.stringify(payload))
    state.subTaskDetails = payload;
  } 

  const SET_ACTIVE_SERVICE_RESOLUTION_DATAS = (state, payload) => {
    console.log("ACTIVE_SERVICE_RESOLUTION_DATAS: ------------ : " +  JSON.stringify(payload))
    state.serviceActiveResolutionDeatils = payload;
  }
  const SET_DEACTIVE_SERVICE_RESOLUTION_DATAS = (state, payload) => {
    console.log("DEACTIVE_SERVICE_RESOLUTION_DATAS: ------------ : " +  JSON.stringify(payload))
    state.serviceDeactiveResolutionDeatils = payload;
  }
  const SET_ACTIVE_CS_SUB_ISSUE_DATAS = (state, payload) => {
    console.log("SET_ACTIVE_CS_SUB_ISSUE_DATAS: ------------ : " +  JSON.stringify(payload))
    state.csActiveSubIssueDetails = payload;
  } 
  const SET_DEACTIVE_CS_SUB_ISSUE_DATAS = (state, payload) => {
    console.log("SET_DEACTIVE_CS_SUB_ISSUE_DATAS: ------------ : " +  JSON.stringify(payload))
    state.csDeactiveSubIssueDetails = payload;
  } 


export default {
  SET_ACTIVE_CS_SUB_ISSUE_DATAS,
  SET_ACTIVE_ISSUE_MAPPING,
  SET_ACTIVE_SERVICE_RESOLUTION_DATAS,
  SET_CS_SUB_ISSUE,
  SET_DEACTIVE_CS_SUB_ISSUE_DATAS,
  SET_DEACTIVE_ISSUE_MAPPING,
  SET_DEACTIVE_SERVICE_RESOLUTION_DATAS,
  SET_GET_SERVICE_ISSUE_TYPES,
  SET_SERVICE_REQUEST_GET_TYPES,
  SET_SERVICE_RESOLUTION_REMARKS,
  SET_SUB_TASK_DATAS
};
