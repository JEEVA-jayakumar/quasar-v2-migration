import api from '../api.js'

// Fetch Merchant Document Types
const APP_MERCHANT_DOCUMENT_TYPE = ({commit}) => {
  return api.get('manage/data/merchant-types')
    .then(response => {
      commit('SET_APP_MERCHANT_DOCUMENT_TYPE', response.data.data)
      return response.data.data
    })
    .catch(error => {
      console.error('APP_MERCHANT_DOCUMENT_TYPE error:', error)
      throw error
    })
}

// Fetch SO Rental Plan
const SO_RENTAL_PLAN = ({commit}) => {
  return api.get('parameters/rental-plan?institutionCode=101')
    .then(response => {
      commit('SET_SO_RENTAL_PLAN', response.data.items)
      return response.data.items
    })
    .catch(error => {
      console.error('SO_RENTAL_PLAN error:', error)
      throw error
    })
}


export default {
  APP_MERCHANT_DOCUMENT_TYPE,
  SO_RENTAL_PLAN
};
