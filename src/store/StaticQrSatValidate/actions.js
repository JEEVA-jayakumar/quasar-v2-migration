import api from '../api.js'
// Removed unused Vue import

const REJECT_QR_LEAD_DOCUMENTS = (request) => {
  // Removed unused commit parameter
  return api.get('qr-reject-lead/' + request.id)
}

export default {
  REJECT_QR_LEAD_DOCUMENTS
};
