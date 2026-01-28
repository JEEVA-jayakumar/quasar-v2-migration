// import api from '../api.js';

// /**
//  * Activate MATM User
//  * @param {Object} context - Vuex context
//  * @param {String|Number} request - user id or request param
//  */
// export const ACTIVATE_MATM_USER_DETAILS = async (_, request) => {
//   try {
//     const response = await api.put(`user/active/${request}`);

//     // optional mutation if needed in future
//     commit('SET_ACTIVATE_MATM_RESPONSE', response.data);

//     return response;
//   } catch (error) {
//     console.error('ACTIVATE_MATM_USER_DETAILS error:', error);
//     throw error;
//   }
// };
