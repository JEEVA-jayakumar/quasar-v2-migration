import api from "../api.js";

const VERIFY_DEVICE_ON_REQUEST = (_, request) => {
  return api.get(
    "check-device-recovery-status/" +
    request.device +
    "/" +
    request.serialNumber
  );
};

const DEVICE_INVENTORY_UPLOAD = (_, request) => {
  return api.put("device-recovery-update-inventory/" + request.action, request);
};

const DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID = (_, request) => {
  return api.get(
    "verify-fault-central-inventory/" + request.device + "/" + request.barcode
  );
};

const AGGREGATOR_DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID = (_, request) => {
  return api.get(
    "aggregator-inventory/agg-verify-fault-central-inventory/"+JSON.parse(localStorage.getItem("selectedTab").split('|')[1])+"/"+ request.device + "/" + request.barcode
  );
};

const DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_ALLOCATION = (_, request) => {
  return api.get(
    "verify-central-to-regional-inventory/" +
    request.device +
    "/" +
    request.barcode
  );
};

/*PHONE PE API */
const PHONE_PE_DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_ALLOCATION = (_, request) => {
  console.log("PHONE_PE_DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_ALLOCATION ---->",JSON.stringify(request))
  return api.get(
    "aggregator-inventory/agg-verify-central-to-regional-inventory/"+JSON.parse(localStorage.getItem("selectedTab").split('|')[1])+"/" +
    request.device +
    "/" +
    request.barcode
  );
};

/*PHONE PE API */
const DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_SO_ALLOCATION = (_, request) => {
  return api.get(
    "verify-regional-To-so-reseller-inventory/" +
    request.device +
    "/" +
    request.barcode
  );
};

const BIJLIPAY_SELF_ASSIGNMENT_TRACKER = (_, request) => {
  return api.get(
    "self-assignment-tracker-list/1?page="+
    request.pagination.page +
      '&size=' +
      request.pagination.rowsPerPage +
      '&search=' +
      request.filter
  );
};

const AGGREGATOR_SELF_ASSIGNMENT_TRACKER = (_, request) => {
  return api.get(
    "self-assignment-tracker-list/2?page="+
    request.pagination.page +
      '&size=' +
      request.pagination.rowsPerPage +
      '&search=' +
      request.filter
  );
};

const DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_SO_TO_SO_ALLOCATION = (_, request) => {
  return api.post(
    "scan-sat-so-device/" +
    1 +
    "/" +
    request.barcode
  );
};

const APPROVE_BIJLIPAY_SELF_ASSIGNMENT = (_, request) => {
  return api.post(
    "sat-accept/1",request
  );
};

const APPROVE_AGGREGATOR_SELF_ASSIGNMENT = (_, request) => {
  return api.post(
    "sat-accept/2",request
  );
};

const REJECT_SELF_ASSIGNMENT = (_, request) => {
  return api.post(
    "sat-reject",request
  );
};

const AGGREGATOR_DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_SO_TO_SO_ALLOCATION = (_, request) => {
  return api.post(
    "scan-sat-so-device/" +
    2 +
    "/" +
    request.barcode
  );
};

/* AGGREGATOR API */
const AGGREGATORS_DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_SO_ALLOCATION = (_, request) => {
  return api.get(
    "aggregator-inventory/agg-verify-regional-To-so-reseller-inventory/"+JSON.parse(localStorage.getItem("selectedTab").split('|')[1])+"/"+
    request.device +
    "/" +
    request.barcode
  );
};

/* AGGREGATOR API */
const DEVICE_VERIFICATION_IN_CENTRAL_FOR_ACTIVE = (_, request) => {
  return api.get(
    "verify-device-active-in-central/" + request.device + "/" + request.barcode
  );
};

/* Aggregators API */
const AGGREAGATORS_DEVICE_VERIFICATION_IN_CENTRAL_FOR_ACTIVE = (_, request) => {
  return api.get(
    "aggregator-inventory/agg-verify-device-active-in-central/"+JSON.parse(localStorage.getItem("selectedTab").split('|')[1])+ "/" + request.device + "/" + request.barcode
  );
};

/* Aggregators API */
const VERIFY_DEVICE_BEFORE_ADDING_CENTRAL_INVENTORY = (_, request) => {
  return api.get(
    "verify-device-in-central-inventory/" +
    request.device +
    "/" +
    request.barcode
  );
};

/* Aggregators API */
const AGGREGATORS_VERIFY_DEVICE_BEFORE_ADDING_CENTRAL_INVENTORY = (_, request) => {
  return api.get(
    "aggregator-inventory/agg-verify-device-in-central-inventory/"+JSON.parse(localStorage.getItem("selectedTab").split('|')[1])+"/"+
    request.device +
    "/" +
    request.barcode
  );
};

/* Aggregators API */
const GET_INVOICE_NUMBER_FROM_INVENTORY = (_, request) => {
  return api.get(
    "invoice/" + request
  );
};

const VERIFY_DEVICE_ON_REGIONAL_TO_CENTRAL_FOR_FAULTY = (_, request) => {
  return api.get(
    "verify-regional-to-central/" + request.device + "/" + request.barcode
  );
};

/*Aggregator API */
const VERIFY_AGGREGATORS_DEVICE_ON_REGIONAL_TO_CENTRAL_FOR_FAULTY = (_, request) => {
  return api.get(
    "aggregator-inventory/agg-verify-regional-to-central/"+JSON.parse(localStorage.getItem("selectedTab").split('|')[1])+ "/" + request.device + "/" + request.barcode
  );
};

export default {
  VERIFY_DEVICE_ON_REQUEST,
  DEVICE_INVENTORY_UPLOAD,
  DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID,
  AGGREGATOR_DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID,
  DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_ALLOCATION,
  PHONE_PE_DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_ALLOCATION,
  DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_SO_ALLOCATION,
  BIJLIPAY_SELF_ASSIGNMENT_TRACKER,
  AGGREGATOR_SELF_ASSIGNMENT_TRACKER,
  DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_SO_TO_SO_ALLOCATION,
  APPROVE_BIJLIPAY_SELF_ASSIGNMENT,
  APPROVE_AGGREGATOR_SELF_ASSIGNMENT,
  REJECT_SELF_ASSIGNMENT,
  AGGREGATOR_DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_SO_TO_SO_ALLOCATION,
  AGGREGATORS_DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_SO_ALLOCATION,
  DEVICE_VERIFICATION_IN_CENTRAL_FOR_ACTIVE,
  AGGREAGATORS_DEVICE_VERIFICATION_IN_CENTRAL_FOR_ACTIVE,
  VERIFY_DEVICE_BEFORE_ADDING_CENTRAL_INVENTORY,
  AGGREGATORS_VERIFY_DEVICE_BEFORE_ADDING_CENTRAL_INVENTORY,
  GET_INVOICE_NUMBER_FROM_INVENTORY,
  VERIFY_DEVICE_ON_REGIONAL_TO_CENTRAL_FOR_FAULTY,
  VERIFY_AGGREGATORS_DEVICE_ON_REGIONAL_TO_CENTRAL_FOR_FAULTY
};
