<template>
  <q-page>
    <!-- content -->
    <div>
      <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Aggregator Global Serial Number/TID Search
      </div>
      <div class="row gutter-x-xs gutter-y-xs q-pt-md justify-around items-end">
        <div class="col-md-4">
          <q-input
            v-model="formData.searchTerm"
            placeholder="Type.."
            label="Search .."
            class="q-mr-lg q-py-sm"
            clearable
            color="grey-9"
          />
        </div>
        <div class="col-md-3">
          <div class="group">
            <q-radio
              v-for="(item, index) in flagOptions"
              :key="index"
              color="grey-9"
              v-model="formData.flag"
              :val="item.value"
              :label="item.label"
            />
          </div>
        </div>
        <div class="col-md-2">
          <q-btn
            class="auto"
            size="md"
            type="button"
            color="purple-9"
            @click="globalSearchSubmit"
          >
            Submit
          </q-btn>
        </div>
      </div>
    </div>
    <div
      v-if="tableData.length === 0"
      class="row gutter-x-xs gutter-y-xs justify-center q-pt-lg q-mr-lg q-ml-lg q-mt-lg q-mb-lg dFont"
      style="min-height: calc(80vh - 52px);"
    >
      <div class="row" align="center">
        <q-icon name="warning" color="warning" size="4rem" />
        <div class="q-subheading text-bold text-grey-9" style="align-self: center;">
          No Data Available
        </div>
      </div>
    </div>
    <div
      v-for="tdata in tableData"
      :key="tdata.id"
      class="row gutter-x-xs gutter-y-xs justify-center q-pt-lg q-mr-lg q-ml-lg q-mt-lg q-mb-lg dFont"
    >
      <div class="col-lg-4 col-md-6 col-sm-12">
        <q-card class="q-card q-py-md items-center round-borders q-pa-sm">
          <q-card-section>
            <div class="q-subheading text-bold text-grey-9">Lead Status</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div v-if="tableData.length > 0">
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.leadStatus.leadNumber.label
                }}</span>
                <span class="col-md-8 text-wrap text-primary">{{
                  "# " + tdata.leadNumber
                }}</span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.leadStatus.leadName.label
                }}</span>
                <span class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10">
                  {{ tdata.leadName }}
                </span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.leadStatus.leadAddress.label
                }}</span>
                <span class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10">
                  {{ tdata.leadAddress }}
                </span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.leadStatus.leadDevice.label
                }}</span>
                <span class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10">
                  {{ tdata.leadDevice }}
                </span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.leadStatus.leadDeviceCount.label
                }}</span>
                <span class="col-md-4">{{ tdata.leadDeviceCount || 0 }}</span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.leadStatus.leadRegionName.label
                }}</span>
                <span class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10">
                  {{ tdata.leadRegionName }}
                </span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.leadStatus.leadStatus.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  :style="`
                    background-color: ${getStatusColor(tdata.leadStatus, 'LS')}; 
                    border: solid 1px ${getStatusColor(tdata.leadStatus, 'LS')}; 
                    padding: 2px; border-radius: 5px; text-align: center;
                    color: white;
                  `"
                >
                  {{ processStatus(tdata.leadStatus, "LS") }}
                </span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-4 col-md-6 col-sm-12">
        <q-card class="q-card q-py-md round-borders q-pa-sm">
          <q-card-section>
            <div class="q-subheading text-bold text-grey-9">Tid Status</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div v-if="tableData.length > 0">
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.tidStatus.tid.label
                }}</span>
                <span class="col-md-8 text-wrap text-primary">{{
                  "# " + tdata.tid
                }}</span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.tidStatus.tidStatus.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  :style="`
                    background-color: ${getStatusColor(tdata.tidStatus, 'TS')}; 
                    border: solid 2px ${getStatusColor(tdata.tidStatus, 'TS')}; 
                    padding: 2px; border-radius: 5px; text-align: center;
                    color: white;
                  `"
                >
                  {{ processStatus(tdata.tidStatus, "TS") }}
                </span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.tidStatus.tidAssignedTo.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  :style="`
                    background-color: ${tdata.tidAssignedTo === 'NA' ? 'springgreen' : 'tomato'}; 
                    padding: 2px; border-radius: 5px; text-align: center;
                    color: white;
                  `"
                >
                  {{ tdata.tidAssignedTo }}
                </span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.tidStatus.tidImplementedDate.label
                }}</span>
                <span class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10">
                  {{ tdata.tidImplementedDate || 'N/A' }}
                </span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.tidStatus.deviceRecoveryStatus.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  :style="`
                    background-color: ${getStatusColor(tdata.deviceRecoveryStatus, 'TRCS')}; 
                    border: solid 2px ${getStatusColor(tdata.deviceRecoveryStatus, 'TRCS')}; 
                    padding: 2px; border-radius: 5px; text-align: center;
                    color: white;
                  `"
                >
                  {{ processStatus(tdata.deviceRecoveryStatus, "TRCS") }}
                </span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.tidStatus.recoveredBy.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  :style="`
                    background-color: ${tdata.recoveredBy === 'NA' ? 'springgreen' : 'tomato'}; 
                    padding: 2px; border-radius: 5px; text-align: center;
                    color: white;
                  `"
                >
                  {{ tdata.recoveredBy || 'N/A' }}
                </span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.tidStatus.deviceReplacementStatus.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  :style="`
                    background-color: ${getStatusColor(tdata.deviceReplacementStatus, 'TRPS')}; 
                    border: solid 2px ${getStatusColor(tdata.deviceReplacementStatus, 'TRPS')}; 
                    padding: 2px; border-radius: 5px; text-align: center;
                    color: white;
                  `"
                >
                  {{ processStatus(tdata.deviceReplacementStatus, "TRPS") }}
                </span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.tidStatus.replacedBy.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  :style="`
                    background-color: ${tdata.replacedBy === 'NA' ? 'springgreen' : 'tomato'}; 
                    padding: 2px; border-radius: 5px; text-align: center;
                    color: white;
                  `"
                >
                  {{ tdata.replacedBy || 'N/A' }}
                </span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-4 col-md-6 col-sm-12 no-wrap">
        <q-card class="q-card q-py-md round-borders q-pa-sm">
          <q-card-section>
            <div class="q-subheading text-bold text-grey-9">
              Serial Number Status
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div v-if="tableData.length > 0">
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.serialNumberStatus.serialNumber.label
                }}</span>
                <span class="col-md-8 text-wrap text-primary">{{
                  "# " + tdata.serialNumber
                }}</span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.serialNumberStatus.ciDeviceType.label
                }}</span>
                <span class="col-md-4 text-wrap content-center text-weight-regular text-blue-grey-10">
                  {{ tdata.ciDeviceType }}
                </span>
                <span
                  class="col-md-4 text-wrap content-center text-weight-regular text-blue-grey-10"
                  :style="`
                    background-color: ${tdata.deviceCategoryType == null ? 'tomato' : 'springgreen'}; 
                    padding: 2px; border-radius: 5px; text-align: center;
                    color: white;
                  `"
                >
                  {{ tdata.deviceCategoryType == null ? "NA" : tdata.deviceCategoryType }}
                </span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.serialNumberStatus.ciDeviceStauts.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  :style="`
                    background-color: ${getStatusColor(tdata.ciDeviceStauts, 'CIDS')}; 
                    border: solid 2px ${getStatusColor(tdata.ciDeviceStauts, 'CIDS')}; 
                    padding: 2px; border-radius: 5px; text-align: center;
                    color: white;
                  `"
                >
                  {{ processStatus(tdata.ciDeviceStauts, "CIDS") }}
                </span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.serialNumberStatus.deviceAllocatedtoRegion.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  :style="`
                    background-color: ${tdata.deviceAllocatedtoRegion ? 'springgreen' : 'tomato'}; 
                    padding: 2px; border-radius: 5px; text-align: center;
                    color: white;
                  `"
                >
                  {{ tdata.deviceAllocatedtoRegion ? "Allocated" : "Not Allocated" }}
                </span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.serialNumberStatus.riDeviceStatus.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  :style="`
                    background-color: ${getStatusColor(tdata.riDeviceStatus, 'RIDS')}; 
                    border: solid 2px ${getStatusColor(tdata.riDeviceStatus, 'RIDS')}; 
                    padding: 2px; border-radius: 5px; text-align: center;
                    color: white;
                  `"
                >
                  {{ processStatus(tdata.riDeviceStatus, "RIDS") }}
                </span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.serialNumberStatus.riDeviceAllocatedOrImplemented.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  :style="`
                    background-color: ${tdata.riDeviceAllocatedOrImplemented ? 'springgreen' : 'tomato'}; 
                    padding: 2px; border-radius: 5px; text-align: center;
                    color: white;
                  `"
                >
                  {{ tdata.riDeviceAllocatedOrImplemented ? "Allocated / Implemented" : "Not Allocated / Implemented" }}
                </span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.serialNumberStatus.isDeviceReceivedInRi.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  :style="`
                    background-color: ${tdata.isDeviceReceivedInRi == 1 ? 'springgreen' : 'tomato'}; 
                    padding: 2px; border-radius: 5px; text-align: center;
                    color: white;
                  `"
                >
                  {{ tdata.isDeviceReceivedInRi == 1 ? "Received" : "Not Received" }}
                </span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.serialNumberStatus.riAssignedSO.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  :style="`
                    background-color: ${tdata.isDeviceReceivedInRi == 1 ? 'springgreen' : 'tomato'}; 
                    padding: 2px; border-radius: 5px; text-align: center;
                    color: white;
                  `"
                >
                  {{ tdata.riAssignedSO || 'N/A' }}
                </span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.serialNumberStatus.riStatusUpdatedDate.label
                }}</span>
                <span class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10">
                  {{ tdata.riStatusUpdatedDate || 'N/A' }}
                </span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.serialNumberStatus.riPodNumber.label
                }}</span>
                <span class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10">
                  {{ tdata.riPodNumber || 'N/A' }}
                </span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.serialNumberStatus.regionInventoryName.label
                }}</span>
                <span class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10">
                  {{ tdata.regionInventoryName || 'N/A' }}
                </span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <!--START >> Show Ajax Spinner -->
    <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
      <q-spinner-bars class="absolute-center" style="color:#61116a" :size="35" />
    </div>
    <!--END >> Show Ajax Spinner -->
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';

const $q = useQuasar();
const store = useStore();

// Reactive state
const toggleAjaxLoadFilter = ref(false);
const tableData = ref([]);
const flagOptions = ref([
  { label: "Tid", value: 1 },
  { label: "Serial Number", value: 2 },
  { label: "Mid", value: 3 },
  { label: "Lead Number", value: 4 },
  { label: "Application Number", value: 5 },
]);

const formData = reactive({
  flag: 1,
  searchTerm: ""
});

const filedKeys = reactive({
  leadStatus: {
    leadNumber: { label: "Lead Number" },
    leadName: { label: "Lead Name" },
    leadAddress: { label: "Address" },
    leadDevice: { label: "Device Type" },
    leadDeviceCount: { label: "Device Count" },
    leadRegionName: { label: "Region Name" },
    leadStatus: { label: "Lead Status" }
  },
  tidStatus: {
    tid: { label: "TID" },
    tidStatus: { label: "Status" },
    tidAssignedTo: { label: "Assigned To" },
    tidImplementedDate: { label: "Status Date" },
    deviceRecoveryStatus: { label: "Recovery Status" },
    recoveredBy: { label: "Recovered By" },
    deviceReplacementStatus: { label: "Replacement Status" },
    replacedBy: { label: "Replaced By" }
  },
  serialNumberStatus: {
    serialNumber: { label: "Serial Number" },
    ciDeviceType: { label: "CI Device Type" },
    ciDeviceStauts: { label: "CI Device Status" },
    deviceAllocatedtoRegion: { label: "IS Device Allocated To Region" },
    riDeviceStatus: { label: "RI Device Status" },
    riDeviceAllocatedOrImplemented: {
      label: "RI Device Allocated Or Implemented"
    },
    isDeviceReceivedInRi: { label: "Device Received In RI" },
    riAssignedSO: { label: "RI Assigned SO" },
    riStatusUpdatedDate: { label: "RI Status Updated Date" },
    riPodNumber: { label: "RI POD Number" },
    regionInventoryName: { label: "Regional Inventory Name" }
  }
});

// Pagination control
const paginationControl = reactive({
  rowsNumber: 10,
  page: 1,
  sortBy: "leadNumber",
  descending: false,
  rowsPerPage: 25
});

// Computed properties
const getAggregatorsGlobalSearchSerialNumber = computed(() => 
  store.getters["globalSearchSerialNumber/getAggregatorsGlobalSearchSerialNumber"]
);

const GLOBAL_STATUS_FETCH = computed(() => 
  store.getters["GlobalVariables/GLOBAL_STATUS_FETCH"] || {
    LEAD_STATUS: {},
    TID_STATUS: {},
    TID_RECOVERY_STATUS: {},
    TID_REPLACEMENT_STATUS: {},
    CENTRAL_INVENTORY_DEVICE_STATUS: {},
    REGIONAL_INVENTORY_DEVICE_STATUS: {}
  }
);

// Helper function
const deCapitalizeFirstLetter = ([first, ...rest]) => 
  first === undefined ? '' : first.toLowerCase() + rest.join('');

// Methods
const getFlagKeyByValue = (object, value) => {
  return object.value === value ? object.label : null;
};

const globalSearchSubmit = async () => {
  if (!formData.searchTerm.trim()) {
    $q.notify({
      color: 'warning',
      message: 'Please enter a search term'
    });
    return;
  }

  if (!formData.flag) {
    $q.notify({
      color: 'warning',
      message: 'Please select a search type'
    });
    return;
  }

  toggleAjaxLoadFilter.value = true;
  $q.loading.show();

  try {
    const sort = flagOptions.value.filter(sFlag => getFlagKeyByValue(sFlag, formData.flag));
    paginationControl.sortBy = formData.flag !== 2 
      ? deCapitalizeFirstLetter(sort[0]?.label?.replaceAll(/\s/g, '') || '')
      : "c.serialNumber";

    const params = {
      flag: formData.flag,
      searchTerm: formData.searchTerm,
      pagination: paginationControl
    };

    await store.dispatch("globalSearchSerialNumber/FETCH_PHONE_PE_GLOBAL_SEARCH_DATAS", params);

    // Update pagination based on response
    const response = getAggregatorsGlobalSearchSerialNumber.value;
    if (response) {
      paginationControl.rowsNumber = response.totalElements || 0;
      paginationControl.page = response.number !== undefined ? response.number + 1 : 1;
      tableData.value = response.content || [];
      
      if (response.sort && response.sort.length > 0) {
        paginationControl.sortBy = response.sort[0].property;
        paginationControl.descending = !response.sort[0].ascending;
      }
    } else {
      tableData.value = [];
    }

    $q.loading.hide();
  } catch (error) {

    console.error("Global search error:", error);
    $q.notify({
      color: 'negative',
      message: 'Failed to fetch search results'
    });
    tableData.value = [];
    $q.loading.hide();
  } finally {
    toggleAjaxLoadFilter.value = false;
  }
};

const processStatus = (statusCode, key) => {
  if (!statusCode) return "N/A";
  
  const statusMap = GLOBAL_STATUS_FETCH.value;
  
  switch (key) {
    case "LS":
      return statusMap.LEAD_STATUS?.[statusCode] || "N/A";
    case "TS":
      return statusMap.TID_STATUS?.[statusCode] || "N/A";
    case "TRPS":
      return statusMap.TID_REPLACEMENT_STATUS?.[statusCode] || "N/A";
    case "TRCS":
      return statusMap.TID_RECOVERY_STATUS?.[statusCode] || "N/A";
    case "CIDS":
      return statusMap.CENTRAL_INVENTORY_DEVICE_STATUS?.[statusCode] || "N/A";
    case "RIDS":
      return statusMap.REGIONAL_INVENTORY_DEVICE_STATUS?.[statusCode] || "N/A";
    default:
      return "N/A";
  }
};

const getStatusColor = (statusCode, key) => {
  if (!statusCode) return "grey";
  
  const colors = {
    LS: {
      "101": "#61116a",
      "102": "#795548",
      default: (code) => {
        const colors = [
          "tomato", "pink", "purple", "indigo", "blue", "lightblue", 
          "lightsalmon", "teal", "wheat", "lightgreen", "lightcoral", 
          "springgreen", "lightseagreen", "amber", "orange", "deep-orange", 
          "brown", "grey", "blue-grey", "tomato"
        ];
        return colors[code % colors.length] || "grey";
      }
    },
    TS: {
      "0": "lightcoral",
      "1": "lightgreen",
      "2": "orange",
      "3": "red",
      "4": "lightblue",
      "5": "blue",
      "6": "springgreen",
      "7": "lightsalmon",
      default: "grey"
    },
    TRPS: {
      "0": "tomato",
      "1": "lightcoral",
      "2": "lightsalmon",
      "3": "springgreen",
      "4": "lightgreen",
      default: "grey"
    },
    TRCS: {
      "0": "tomato",
      "1": "lightcoral",
      "2": "lightgreen",
      "3": "springgreen",
      default: "grey"
    },
    CIDS: {
      "0": "tomato",
      "1": "springgreen",
      "2": "tomato",
      "3": "lightsalmon",
      "4": "lightcoral",
      "5": "amber",
      default: "grey"
    },
    RIDS: {
      "0": "tomato",
      "1": "lightgreen",
      "2": "orange",
      "3": "indigo",
      "4": "blue",
      "5": "lightblue",
      "6": "wheat",
      "7": "lightsalmon",
      "8": "lightcoral",
      "9": "springgreen",
      "10": "tomato",
      default: "grey"
    }
  };

  const colorMap = colors[key];
  if (!colorMap) return "grey";
  
  return colorMap[statusCode] || (typeof colorMap.default === 'function' 
    ? colorMap.default(statusCode) 
    : colorMap.default || "grey");
};

// Initialize on mount
onMounted(() => {
  // You can add any initialization logic here if needed
});
</script>

<style scoped>
.text-wrap {
  overflow-wrap: anywhere;
  color: #242225;
}

.spinner-overlay {
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 9999;
}

.q-card {
  margin-bottom: 16px;
}

.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.q-title {
  font-size: 1.5rem;
  line-height: 2rem;
}

.dFont {
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

@media (max-width: 600px) {
  .col-lg-4,
  .col-md-6,
  .col-sm-12 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}

.gutter-x-xs {
  margin-left: -4px;
  margin-right: -4px;
}

.gutter-y-xs {
  margin-top: -4px;
  margin-bottom: -4px;
}

.gutter-x-xs > div,
.gutter-y-xs > div {
  padding-left: 4px;
  padding-right: 4px;
  padding-top: 4px;
  padding-bottom: 4px;
}

.round-borders {
  border-radius: 8px;
}

.q-subheading {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

.q-body-1 {
  font-size: 1rem;
  line-height: 1.5rem;
}
</style>