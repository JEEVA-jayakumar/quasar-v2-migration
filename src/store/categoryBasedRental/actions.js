import api from '../api.js'

const CATEGORY_BASED_RENTAL_PLAN = ({ commit }, request) => {
  return api
    .get(
      `/staticApi/rental-plan-details/${request.leadSource}/${request.device}/${request.plan}`
    )
    .then(response => {
      commit('SET_CATEGORY_BASED_RENTAL', response.data.data)
      return response
    })
}

const CATEGORY_BASED_RENTAL_PLAN1 = ({ commit }, request) => {
  return api
    .get(
      `/staticApi/rental-plan-details/${request.leadSource}/${request.device}/${request.plan}`
    )
    .then(response => {
      commit('SET_CATEGORY_BASED_RENTAL', response.data.data)
      return response
    })
}

const EDIT_RENTAL_PLAN = (_, request) => {
  return api.put(
    `/api/manage/data/rental-plan-details/${request.id}`,
    request
  )
}

const ENABLE_OR_DISABLE_RENTAL_PLAN = (_, request) => {
  return api.put(
    `/api/manage/data/rental-plan-details/${request.id}`,
    request
  )
}


export default {
  CATEGORY_BASED_RENTAL_PLAN,
  CATEGORY_BASED_RENTAL_PLAN1,
  EDIT_RENTAL_PLAN,
  ENABLE_OR_DISABLE_RENTAL_PLAN
};
