const SET_FETCH_ISSUE_DATAS = (state, payload) => {
  state.issueDatasDetails = payload
}

const SET_FETCH_SUB_ISSUE_DATAS = (state, payload) => {
  state.subIssueDatasDetails = payload
}

const SET_FETCH_REMARKS_ISSUE_DATAS = (state, payload) => {
  state.remarksDatasDetails = payload
}


export default {
  SET_FETCH_ISSUE_DATAS,
  SET_FETCH_SUB_ISSUE_DATAS,
  SET_FETCH_REMARKS_ISSUE_DATAS
};
