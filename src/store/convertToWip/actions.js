import api from '../api.js'

// Export as default object
export default {
  CONVERT_TO_WIP({ rootState }, request) {
    return api
      .put(
        rootState.GlobalVariables.STATE_APP_API +
          'convert-wip-lead/' +
          request.url.id,
        request.data1
      )
      .then((response) => {
        console.log(response)
        return response
      })
  }
}