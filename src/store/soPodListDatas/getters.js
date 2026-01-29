const getapprovedSoPodListDatas = (state) => {
    return state.approvedSoPodListDatas
  }

  const getrejectedSoPodListDatas = (state) => {
    return state.rejectedSoPodListData
  }


  const getPhonepeApprovedSoPodListDatas = (state) => {
    return state.PhonepeApprovedSoPodListDatas
  }

  // PhonepeRejectedSoPodListData

  const getPhoneperejectedSoPodListDatas = (state) => {
    return state.PhonepeRejectedSoPodListData
  }


export default {
  getPhonepeApprovedSoPodListDatas,
  getPhoneperejectedSoPodListDatas,
  getapprovedSoPodListDatas,
  getrejectedSoPodListDatas
};
