import api from '../api.js'
import moment from 'moment'

function commonDateFormat(selectedDate) {
  if (!selectedDate || selectedDate === 'Invalid date') {
    return null
  }
  return moment(selectedDate).format('DD/MM/YYYY')
}

function getNiiHeaders() {
  const variable = localStorage.getItem('a_t')
  const v = variable.lastIndexOf('|')
  const res = variable.substring(v + 1)
  return {
    nii: res,
    res
  }
}

const CMS_EDIT_MDR = ({ rootState }, request) => {
  const { nii, res } = getNiiHeaders()

  const baseUrl =
    res == 104
      ? rootState.GlobalVariables.STATE_MARS_AXIS_ON_BOARD_API_URL
      : rootState.GlobalVariables.STATE_MARS_ON_BOARD_API_URL

  return api.put(
    `${baseUrl}merchant/${request.url.id}/updateMdr`,
    request.params,
    { headers: { NII: nii } }
  )
}

const CMS_EDIT_MERCHANT = ({ rootState }, request) => {
  const { nii, res } = getNiiHeaders()

  const baseUrl =
    res == 104
      ? rootState.GlobalVariables.STATE_MARS_AXIS_ON_BOARD_API_URL
      : rootState.GlobalVariables.STATE_MARS_ON_BOARD_API_URL

  return api.put(
    `${baseUrl}merchant/${request.url.id}/update`,
    request.params,
    { headers: { NII: nii } }
  )
}

const CMS_EDIT_TERMINAL = ({ rootState }, request) => {
  request.terminalparams.merchant.paymentDetails.installationDate =
    commonDateFormat(
      request.terminalparams.merchant.paymentDetails.installationDate
    )

  request.terminalparams.merchant.paymentDetails.deinstallationDate =
    commonDateFormat(
      request.terminalparams.merchant.paymentDetails.deinstallationDate
    )

  const { nii, res } = getNiiHeaders()

  const baseUrl =
    res == 104
      ? rootState.GlobalVariables.STATE_MARS_AXIS_ON_BOARD_API_URL
      : rootState.GlobalVariables.STATE_MARS_ON_BOARD_API_URL

  return api.put(
    `${baseUrl}terminal/${request.terminal.id}/update`,
    request.terminalparams,
    { headers: { NII: nii } }
  )
}

const CMS_EDIT_TERMINAL_DEVICE = ({ rootState }, request) => {
  request.terminalparams.merchant.paymentDetails.installationDate =
    commonDateFormat(
      request.terminalparams.merchant.paymentDetails.installationDate
    )

  request.terminalparams.merchant.paymentDetails.deinstallationDate =
    commonDateFormat(
      request.terminalparams.merchant.paymentDetails.deinstallationDate
    )

  const { nii, res } = getNiiHeaders()

  if (
    request.data.leadInformation.leadCategory == 1 ||
    request.data.leadInformation.leadCategory == 2
  ) {
    const baseUrl =
      res == 104
        ? rootState.GlobalVariables.STATE_MARS_AXIS_ON_BOARD_API_URL
        : rootState.GlobalVariables.STATE_MARS_ON_BOARD_API_URL

    return api.put(
      `${baseUrl}terminal/${request.terminal.id}/installation`,
      request.terminalparams,
      { headers: { NII: nii } }
    )
  }

  return api.put(
    `${rootState.GlobalVariables.STATE_MARS_EDC_ON_BOARD_API_URL}terminal/${request.terminal.id}/installation`,
    request.terminalparams,
    { headers: { NII: nii } }
  )
}

const CMS_STATUS_CHANGE = ({ rootState }, request) => {
  return api.put(
    `${rootState.GlobalVariables.STATE_APP_API}submit-cms-data-to-mars/${request}`
  )
}

const CMS_EDIT_KYC = ({ rootState }, request) => {
  const { nii, res } = getNiiHeaders()

  const baseUrl =
    res == 104
      ? rootState.GlobalVariables.STATE_MARS_AXIS_ON_BOARD_API_URL
      : rootState.GlobalVariables.STATE_MARS_ON_BOARD_API_URL

  return api.put(
    `${baseUrl}merchant/${request.url.id}/updateKyc`,
    request.params,
    { headers: { NII: nii } }
  )
}


export default {
  CMS_EDIT_MDR,
  CMS_EDIT_MERCHANT,
  CMS_EDIT_TERMINAL,
  CMS_EDIT_TERMINAL_DEVICE,
  CMS_STATUS_CHANGE,
  CMS_EDIT_KYC
};
