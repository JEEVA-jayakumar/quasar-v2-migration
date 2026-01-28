import api from '../api.js';

export const FECTCH_ALL_BRANCH = async ({ commit, rootState }, request) => {
  try {
    const response = await api.get(
      `${rootState.GlobalVariables.STATE_LOCAL_API}getbranch/${request}`
    );

    const allBranchName = response.data.branch.map((value) => ({
      label: value.branchName,
      value: value.branchCode
    }));

    commit('SET_ALL_BRANCHNAME', allBranchName);
    return response.data;
  } catch (error) {
    console.error('FECTCH_ALL_BRANCH error:', error);
    throw error;
  }
};
