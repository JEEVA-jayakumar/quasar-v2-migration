 const getserviceRequestGetTypes= (state) => {
    console.log("GETTER SPARE PARTS: ------------ : " +  JSON.stringify(state.sparePartsGetTypes))
    return state.serviceRequestGetTypes
  } 
  const getactiveIssueMapping= (state) => {
    console.log("getactiveIssueMapping ------------ : " +  JSON.stringify(state.sparePartsGetTypes))
    return state.activeIssueMapping
  } 
  const getdeactiveIssueMapping= (state) => {
    console.log("deactiveIssueMapping------------ : " +  JSON.stringify(state.sparePartsGetTypes))
    return state.deactiveIssueMapping
  } 
  const getserviceResolutionRemarks= (state) => {
    console.log("GETTER SPARE PARTS: ------------ : " +  JSON.stringify(state.sparePartsGetTypes))
    return state.serviceResolutionRemarks
  }

  const getserviceRequestIssueTypes= (state) => {
    console.log("GETTER SPARE PARTS: ------------ : " +  JSON.stringify(state.sparePartsGetTypes))
    return state.serviceRequestIssueTypes
  }
  const getcsSubIssue= (state) => {
    console.log("GETTER SPARE PARTS: ------------ : " +  JSON.stringify(state.sparePartsGetTypes))
    return state.csSubIssue
  }
  const getsubTaskDetails= (state) => {
    console.log("GETTER SPARE PARTS subTaskDetails: ------------ : " +  JSON.stringify(state.subTaskDetails))
    return state.subTaskDetails
  }

  const getserviceActiveResolutionDeatils= (state) => {
    console.log("getserviceActiveResolutionDeatils: ------------ : " +  JSON.stringify(state.serviceActiveResolutionDeatils))
    return state.serviceActiveResolutionDeatils
  }
  const getserviceDeactiveResolutionDeatils= (state) => {
    console.log("getserviceDeactiveResolutionDeatils: ------------ : " +  JSON.stringify(state.serviceDeactiveResolutionDeatils))
    return state.serviceDeactiveResolutionDeatils
  }
  const getcsActiveSubIssueDetails= (state) => {
    console.log("getcsActiveSubIssueDetails: ------------ : " +  JSON.stringify(state.csActiveSubIssueDetails))
    return state.csActiveSubIssueDetails
  }
  const getcsDeactiveSubIssueDetails= (state) => {
    console.log("GETTER getcsDeactiveSubIssueDetails: ------------ : " +  JSON.stringify(state.csDeactiveSubIssueDetails))
    return state.csDeactiveSubIssueDetails
  }


export default {
  getserviceRequestGetTypes,
  getactiveIssueMapping,
  getdeactiveIssueMapping,
  getserviceResolutionRemarks,
  getserviceRequestIssueTypes,
  getcsSubIssue,
  getsubTaskDetails,
  getserviceActiveResolutionDeatils,
  getserviceDeactiveResolutionDeatils,
  getcsActiveSubIssueDetails,
  getcsDeactiveSubIssueDetails
};
