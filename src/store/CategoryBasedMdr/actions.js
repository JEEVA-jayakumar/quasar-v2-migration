import api from '../api.js';

export const CATEGORY_BASED_MDR_PLAN = async ({ commit }, request) => {
  console.log(
    'REQUEST DATAS 1234---------------->',
    JSON.stringify(request)
  );

  try {
    const response = await api.get(
      `https://smart.bijlipay.co.in:8080/staticApi/mdr-details/${request.leadSource}/${request.device}/${request.merchantType}`
    );

    commit('SET_CATEGORY_BASED_MDR', response.data.data);
    return response;
  } catch (error) {
    console.error('CATEGORY_BASED_MDR_PLAN error:', error);
    throw error;
  }
};

// Remove unused 'commit' parameter
export const EDIT_MDR_PLAN = async (_, request) => {
  try {
    return await api.put(
      `https://smart.bijlipay.co.in:8080/api/manage/data/mdr-details/${request.id}`,
      request
    );
  } catch (error) {
    console.error('EDIT_MDR_PLAN error:', error);
    throw error;
  }
};

// Remove unused 'commit' parameter
export const ENABLE_OR_DISABLE_MDR_PLAN = async (_, request) => {
  try {
    return await api.put(
      `https://smart.bijlipay.co.in:8080/api/manage/data/mdr-details/${request.id}`,
      request
    );
  } catch (error) {
    console.error('ENABLE_OR_DISABLE_MDR_PLAN error:', error);
    throw error;
  }
};