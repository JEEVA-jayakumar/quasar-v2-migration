import api from '../api.js'

export const CREATE_QR_CODE = (_, request) => {
  return api.get(
    `qr-implementatiion/${request.url.leadSource}/${request.url.count}`
  )
}