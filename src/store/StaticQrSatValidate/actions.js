import api from '../api.js'
// Removed unused Vue import

export const REJECT_QR_LEAD_DOCUMENTS = (request) => {
  // Removed unused commit parameter
  return api.get('qr-reject-lead/' + request.id)
}