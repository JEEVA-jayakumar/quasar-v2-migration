import api from '../api.js'

const FETCH_ISSUE_DATAS = async ({ commit }, request) => {
  try {
    console.log('FETCH_ISSUE_DATAS request:', request)

    const response = await api.get('internal/getIssue/1')

    console.log('FETCH_ISSUE_DATAS response:', response)
    commit('SET_FETCH_ISSUE_DATAS', response.data.data)

    return response
  } catch (error) {
    console.error('FETCH_ISSUE_DATAS error:', error)
    throw error
  }
}

const FETCH_SUB_ISSUE_DATAS = async ({ commit }, request) => {
  try {
    console.log('FETCH_SUB_ISSUE_DATAS request:', request)

    const response = await api.get(`internal/subIssuesData/${request}`)

    console.log('FETCH_SUB_ISSUE_DATAS response:', response)
    commit('SET_FETCH_SUB_ISSUE_DATAS', response.data.data)

    return response
  } catch (error) {
    console.error('FETCH_SUB_ISSUE_DATAS error:', error)
    throw error
  }
}

const FETCH_REMARKS_ISSUE_DATAS = async ({ commit }, request) => {
  try {
    console.log('FETCH_REMARKS_ISSUE_DATAS request:', request)

    const response = await api.get('internal/resolutionRemark/1/2')

    console.log('FETCH_REMARKS_ISSUE_DATAS response:', response)
    commit('SET_FETCH_REMARKS_ISSUE_DATAS', response.data.data)

    return response
  } catch (error) {
    console.error('FETCH_REMARKS_ISSUE_DATAS error:', error)
    throw error
  }
}


export default {
  FETCH_ISSUE_DATAS,
  FETCH_SUB_ISSUE_DATAS,
  FETCH_REMARKS_ISSUE_DATAS
};
