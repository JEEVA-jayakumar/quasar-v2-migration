import api from '../api.js'

const CREATE_QR_CODE = (_, request) => {
  return api.get(
    `qr-implementatiion/${request.url.leadSource}/${request.url.count}`
  )
}

export default {
  CREATE_QR_CODE
};
