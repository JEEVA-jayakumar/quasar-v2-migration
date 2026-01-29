import api from '../api.js'

const UPDATE_ROLE_DATA = async (context, request) => {
  const response = await api.post('role', request)
  console.log(response)
  return response
}

export default {
  UPDATE_ROLE_DATA
};
