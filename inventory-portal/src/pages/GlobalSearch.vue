<template>
  <q-page>
    <!-- content -->
    <div>
      <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Bijlipay Global Serial Number/TID Search
      </div>
      <div class="row q-pt-md justify-around items-end q-gutter-md">
        <div class="col-md-6">
          <q-input
            clearable
            color="grey-9"
            v-model="formData.searchTerm"
            placeholder="Type.."
            label="Search .."
            class="q-py-sm"
            filled
            dense
          />
        </div>
        <div class="col-md-3">
          <div class="group q-gutter-sm">
            <q-radio
              v-for="(item, index) in flagOptions"
              :key="index"
              color="grey-9"
              v-model="formData.flag"
              :val="item.value"
              :label="item.label"
              dense
            />
          </div>
        </div>
        <div class="col-md-2">
          <q-btn
            class="auto"
            size="md"
            type="button"
            color="purple-9"
            @click="globalSearchSubmit(formData)"
          >
            Submit
          </q-btn>
        </div>
      </div>
    </div>

    <div
      v-if="tableData.length === 0"
      class="row justify-center q-pt-lg q-px-lg q-py-lg dFont"
      style="min-height: calc(80vh - 52px);"
    >
      <div class="column items-center q-gutter-sm">
        <q-icon name="warning" color="warning" size="4rem" />
        <div class="text-subtitle1 text-bold text-grey-9">No Data Available</div>
      </div>
    </div>

    <div
      v-for="tdata in tableData"
      :key="tdata.id"
      class="row q-pt-lg q-px-lg q-py-lg dFont q-col-gutter-md"
    >
      <div class="col-lg-4 col-md-6 col-sm-12">
        <q-card class="q-py-md q-pa-sm">
          <q-card-section>
            <div class="text-subtitle1 text-bold text-grey-9">Lead Status</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div v-if="tableData.length > 0">
              <div class="row q-pa-sm text-grey-9 items-center">
                <span class="col-md-4 text-weight-medium">
                  {{ filedKeys.leadStatus.leadNumber.label }}
                </span>
                <span class="col-md-8 text-wrap text-primary">
                  {{ "# " + tdata.leadNumber }}
                </span>
              </div>
              <div class="row q-pa-sm text-grey-9 items-center">
                <span class="col-md-4 text-weight-medium">
                  {{ filedKeys.leadStatus.leadName.label }}
                </span>
                <span class="col-md-8 text-wrap text-blue-grey-10">
                  {{ tdata.leadName }}
                </span>
              </div>
              <div class="row q-pa-sm text-grey-9 items-center">
                <span class="col-md-4 text-weight-medium">
                  {{ filedKeys.leadStatus.leadAddress.label }}
                </span>
                <span class="col-md-8 text-wrap text-blue-grey-10">
                  {{ tdata.leadAddress }}
                </span>
              </div>
              <div class="row q-pa-sm text-grey-9 items-center">
                <span class="col-md-4 text-weight-medium">
                  {{ filedKeys.leadStatus.leadDevice.label }}
                </span>
                <span class="col-md-8 text-wrap text-blue-grey-10">
                  {{ tdata.leadDevice }}
                </span>
              </div>
              <div class="row q-pa-sm text-grey-9 items-center">
                <span class="col-md-4 text-weight-medium">
                  {{ filedKeys.leadStatus.leadDeviceCount.label }}
                </span>
                <span class="col-md-4">
                  {{ tdata.ledDeviceCount }}
                </span>
              </div>
              <div class="row q-pa-sm text-grey-9 items-center">
                <span class="col-md-4 text-weight-medium">
                  {{ filedKeys.leadStatus.leadRegionName.label }}
                </span>
                <span class="col-md-8 text-wrap text-blue-grey-10">
                  {{ tdata.leadRegionName }}
                </span>
              </div>
              <div class="row q-pa-sm text-grey-9 items-center">
                <span class="col-md-4 text-weight-medium">
                  {{ filedKeys.leadStatus.leadStatus.label }}
                </span>
                <span
                  class="col-md-8 text-wrap text-blue-grey-10 q-pa-xs rounded-borders text-center"
                  :style="`
                    background-color: ${funcValidate(tdata.leadStatus, 'LS')}; 
                    border: solid 1px ${funcValidate(tdata.leadStatus, 'LS')};
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
        <q-card class="q-py-md q-pa-sm">
          <q-card-section>
            <div class="text-subtitle1 text-bold text-grey-9">Tid Status</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div v-if="tableData.length > 0">
              <div v-if="tdata.tidStatus == 6" class="row q-pa-sm text-grey-9 items-center">
                <span class="col-md-4 text-weight-medium">
                  {{ filedKeys.tidStatus.tid.label }}
                </span>
                <span class="col-md-8 text-wrap text-primary">
                  {{ "# " + tdata.tid }}
                </span>
              </div>
              <div class="row q-pa-sm text-grey-9 items-center">
                <span class="col-md-4 text-weight-medium">
                  {{ filedKeys.tidStatus.tidStatus.label }}
                </span>
                <span
                  class="col-md-8 text-wrap text-blue-grey-10 q-pa-xs rounded-borders text-center"
                  :style="`
                    background-color: ${funcValidate(tdata.tidStatus, 'TS')}; 
                    border: solid 2px ${funcValidate(tdata.tidStatus, 'TS')};
                  `"
                >
                  {{ processStatus(tdata.tidStatus, "TS") }}
                </span>
              </div>
              <div class="row q-pa-sm text-grey-9 items-center">
                <span class="col-md-4 text-weight-medium">
                  {{ filedKeys.tidStatus.tidAssignedTo.label }}
                </span>
                <span
                  class="col-md-8 text-wrap q-pa-xs rounded-borders text-center"
                  :style="`
                    background-color: ${tdata.tidAssignedTo == 'NA' ? 'springgreen' : 'tomato'};
                  `"
                >
                  {{ tdata.tidAssignedTo }}
                </span>
              </div>
              <div class="row q-pa-sm text-grey-9 items-center">
                <span class="col-md-4 text-weight-medium">
                  {{ filedKeys.tidStatus.tidImplementedDate.label }}
                </span>
                <span class="col-md-8 text-wrap text-blue-grey-10">
                  {{ tdata.tidImplementedDate }}
                </span>
              </div>
              <div class="row q-pa-sm text-grey-9 items-center">
                <span class="col-md-4 text-weight-medium">
                  {{ filedKeys.tidStatus.deviceRecoveryStatus.label }}
                </span>
                <span
                  class="col-md-8 text-wrap text-blue-grey-10 q-pa-xs rounded-borders text-center"
                  :style="`
                    background-color: ${funcValidate(tdata.deviceRecoveryStatus, 'TRCS')}; 
                    border: solid 2px ${funcValidate(tdata.deviceRecoveryStatus, 'TRCS')};
                  `"
                >
                  {{ processStatus(tdata.deviceRecoveryStatus, "TRCS") }}
                </span>
              </div>
              <div class="row q-pa-sm text-grey-9 items-center">
                <span class="col-md-4 text-weight-medium">
                  {{ filedKeys.tidStatus.recoveredBy.label }}
                </span>
                <span
                  class="col-md-8 text-wrap q-pa-xs rounded-borders text-center"
                  :style="`
                    background-color: ${tdata.recoveredBy == 'NA' ? 'springgreen' : 'tomato'};
                  `"
                >
                  {{ tdata.recoveredBy }}
                </span>
              </div>
              <div class="row q-pa-sm text-grey-9 items-center">
                <span class="col-md-4 text-weight-medium">
                  {{ filedKeys.tidStatus.deviceReplacementStatus.label }}
                </span>
                <span
                  class="col-md-8 text-wrap text-blue-grey-10 q-pa-xs rounded-borders text-center"
                  :style="`
                    background-color: ${funcValidate(tdata.deviceReplacementStatus, 'TRPS')}; 
                    border: solid 2px ${funcValidate(tdata.deviceReplacementStatus, 'TRPS')};
                  `"
                >
                  {{ processStatus(tdata.deviceReplacementStatus, "TRPS") }}
                </span>
              </div>
              <div class="row q-pa-sm text-grey-9 items-center">
                <span class="col-md-4 text-weight-medium">
                  {{ filedKeys.tidStatus.replacedBy.label }}
                </span>
                <span
                  class="col-md-8 text-wrap q-pa-xs rounded-borders text-center"
                  :style="`
                    background-color: ${tdata.replacedBy == 'NA' ? 'springgreen' : 'tomato'};
                  `"
                >
                  {{ tdata.replacedBy }}
                </span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-lg-4 col-md-6 col-sm-12">
        <q-card class="q-py-md q-pa-sm">
          <q-card-section>
            <div class="text-subtitle1 text-bold text-grey-9">
              Serial Number Status
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div v-if="tableData.length > 0">
              <div class="row q-pa-sm text-grey-9 items-center">
                <span class="col-md-4 text-weight-medium">
                  {{ filedKeys.serialNumberStatus.serialNumber.label }}
                </span>
                <span class="col-md-8 text-wrap text-primary">
                  {{ "# " + tdata.serialNumber }}
                </span>
              </div>
              <div class="row q-pa-sm text-grey-9 items-center">
                <span class="col-md-4 text-weight-medium">
                  {{ filedKeys.serialNumberStatus.ciDeviceType.label }}
                </span>
                <span class="col-md-8 text-wrap text-blue-grey-10">
                  {{ tdata.ciDeviceType }}
                </span>
              </div>
              <div class="row q-pa-sm text-grey-9 items-center">
                <span class="col-md-4 text-weight-medium">
                  {{ filedKeys.serialNumberStatus.ciDeviceStauts.label }}
                </span>
                <span
                  class="col-md-8 text-wrap text-blue-grey-10 q-pa-xs rounded-borders text-center"
                  :style="`
                    background-color: ${funcValidate(tdata.ciDeviceStauts, 'CIDS')}; 
                    border: solid 2px ${funcValidate(tdata.ciDeviceStauts, 'CIDS')};
                  `"
                >
                  {{ processStatus(tdata.ciDeviceStauts, "CIDS") }}
                </span>
              </div>
              <div class="row q-pa-sm text-grey-9 items-center">
                <span class="col-md-4 text-weight-medium">
                  {{ filedKeys.serialNumberStatus.deviceAllocatedtoRegion.label }}
                </span>
                <span
                  class="col-md-8 text-wrap q-pa-xs rounded-borders text-center"
                  :style="`
                    background-color: ${tdata.deviceAllocatedtoRegion ? 'springgreen' : 'tomato'};
                  `"
                >
                  {{ tdata.deviceAllocatedtoRegion ? "Allocated" : "Not Allocated" }}
                </span>
              </div>
              <div class="row q-pa-sm text-grey-9 items-center">
                <span class="col-md-4 text-weight-medium">
                  {{ filedKeys.serialNumberStatus.riDeviceStatus.label }}
                </span>
                <span
                  class="col-md-8 text-wrap text-blue-grey-10 q-pa-xs rounded-borders text-center"
                  :style="`
                    background-color: ${funcValidate(tdata.riDeviceStatus, 'RIDS')}; 
                    border: solid 2px ${funcValidate(tdata.riDeviceStatus, 'RIDS')};
                  `"
                >
                  {{ processStatus(tdata.riDeviceStatus, "RIDS") }}
                </span>
              </div>
              <div class="row q-pa-sm text-grey-9 items-center">
                <span class="col-md-4 text-weight-medium">
                  {{ filedKeys.serialNumberStatus.riDeviceAllocatedOrImplemented.label }}
                </span>
                <span
                  class="col-md-8 text-wrap q-pa-xs rounded-borders text-center"
                  :style="`
                    background-color: ${tdata.riDeviceAllocatedOrImplemented ? 'springgreen' : 'tomato'};
                  `"
                >
                  {{ tdata.riDeviceAllocatedOrImplemented ? "Allocated / Implemented" : "Not Allocated / Implemented" }}
                </span>
              </div>
              <div class="row q-pa-sm text-grey-9 items-center">
                <span class="col-md-4 text-weight-medium">
                  {{ filedKeys.serialNumberStatus.isDeviceReceivedInRi.label }}
                </span>
                <span
                  class="col-md-8 text-wrap q-pa-xs rounded-borders text-center"
                  :style="`
                    background-color: ${tdata.isDeviceReceivedInRi == 1 ? 'springgreen' : 'tomato'};
                  `"
                >
                  {{ tdata.isDeviceReceivedInRi == 1 ? "Received" : "Not Received" }}
                </span>
              </div>
              <div class="row q-pa-sm text-grey-9 items-center">
                <span class="col-md-4 text-weight-medium">
                  {{ filedKeys.serialNumberStatus.riAssignedSO.label }}
                </span>
                <span
                  class="col-md-8 text-wrap q-pa-xs rounded-borders text-center"
                  :style="`
                    background-color: ${tdata.isDeviceReceivedInRi == 1 ? 'springgreen' : 'tomato'};
                  `"
                >
                  {{ tdata.riAssignedSO }}
                </span>
              </div>
              <div class="row q-pa-sm text-grey-9 items-center">
                <span class="col-md-4 text-weight-medium">
                  {{ filedKeys.serialNumberStatus.riStatusUpdatedDate.label }}
                </span>
                <span class="col-md-8 text-wrap text-blue-grey-10">
                  {{ tdata.riStatusUpdatedDate }}
                </span>
              </div>
              <div class="row q-pa-sm text-grey-9 items-center">
                <span class="col-md-4 text-weight-medium">
                  {{ filedKeys.serialNumberStatus.riPodNumber.label }}
                </span>
                <span class="col-md-8 text-wrap text-blue-grey-10">
                  {{ tdata.riPodNumber }}
                </span>
              </div>
              <div class="row q-pa-sm text-grey-9 items-center">
                <span class="col-md-4 text-weight-medium">
                  {{ filedKeys.serialNumberStatus.regionInventoryName.label }}
                </span>
                <span class="col-md-8 text-wrap text-blue-grey-10">
                  {{ tdata.regionInventoryName }}
                </span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!--START >> Show Ajax Spinner -->
    <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
      <q-spinner-bars
        class="absolute-center"
        style="color:#61116a"
        :size="35"
      />
    </div>
    <!--END >> Show Ajax Spinner -->
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { QSpinnerBars } from 'quasar';
import { useStore } from 'vuex';

const store = useStore();



// Refs
const toggleAjaxLoadFilter = ref(false);
const tableData = ref([]);

// Form Data
const formData = reactive({
  flag: '',
  searchTerm: ''
});

// Field Keys
const filedKeys = {
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
};

// Flag Options
const flagOptions = [
  {
    label: "Tid",
    value: 1
  },
  {
    label: "Serial Number",
    value: 2
  },
  {
    label: "Mid",
    value: 3
  },
  {
    label: "Lead Number",
    value: 4
  },
  {
    label: "Application Number",
    value: 5
  }
];

const GLOBAL_STATUS_FETCH = computed(() => 
  store.getters['GlobalVariables/GLOBAL_STATUS_FETCH'] || {}
);


const processStatus = (statusCode, key) => {
  const statusMap = GLOBAL_STATUS_FETCH.value;
  
  if (!statusMap) return 'NA';
  
  switch (key) {
    case "LS":
      return statusMap.LEAD_STATUS?.[statusCode] || 'NA';
    case "TS":
      return statusMap.TID_STATUS?.[statusCode] || 'NA';
    case "TRPS":
      return statusMap.TID_REPLACEMENT_STATUS?.[statusCode] || 'NA';
    case "TRCS":
      return statusMap.TID_RECOVERY_STATUS?.[statusCode] || 'NA';
    case "CIDS":
      return statusMap.CENTRAL_INVENTORY_DEVICE_STATUS?.[statusCode] || 'NA';
    case "RIDS":
      return statusMap.REGIONAL_INVENTORY_DEVICE_STATUS?.[statusCode] || 'NA';
    default:
      return 'NA';
  }
};

const funcValidate = (statusCode, key) => {
  const colors = [
    "tomato", "pink", "purple", "indigo", "blue", "lightblue", "lightsalmon",
    "teal", "wheat", "lightgreen", "lightcoral", "springgreen", "lightseagreen",
    "amber", "orange", "deep-orange", "brown", "grey", "blue-grey", "tomato"
  ];
  
  const tColors = [
    "lightcoral", "lightgreen", "orange", "red", "lightblue", "blue", 
    "springgreen", "lightsalmon"
  ];
  
  const riColors = [
    "tomato", "lightgreen", "orange", "indigo", "blue", "lightblue", 
    "wheat", "lightsalmon", "lightcoral", "springgreen", "tomato"
  ];
  
  const ciColors = [
    "tomato", "springgreen", "tomato", "lightsalmon", "lightcoral", "amber"
  ];
  
  const trpsColors = [
    "tomato", "lightcoral", "lightsalmon", "springgreen", "lightgreen"
  ];
  
  const trcsColors = ["tomato", "lightcoral", "lightgreen", "springgreen"];
  
  // Convert statusCode to number for array indexing
  const index = typeof statusCode === 'string' ? parseInt(statusCode) : statusCode;
  
  switch (key) {
    case "LS":
      if (statusCode === "101") return colors[19];
      if (statusCode === "102") return colors[16];
      return colors[index] || 'grey';
      
    case "TS":
      return tColors[index] || 'grey';
      
    case "TRPS":
      return trpsColors[index] || 'grey';
      
    case "TRCS":
      return trcsColors[index] || 'grey';
      
    case "CIDS":
      return ciColors[index] || 'grey';
      
    case "RIDS":
      return riColors[index] || 'grey';
      
    default:
      return 'grey';
  }
};

// Lifecycle
onMounted(() => {
  // Initial setup if needed
});
</script>

<style scoped>
.text-wrap {
  overflow-wrap: anywhere;
  color: #242225;
}

.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.dFont {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.spinner-overlay {
  background: rgba(255, 255, 255, 0.7);
  z-index: 9999;
}

.rounded-borders {
  border-radius: 4px;
}

.q-gutter-md {
  gap: 16px;
}

.q-col-gutter-md > * {
  padding: 8px;
}

@media (max-width: 768px) {
  .q-title {
    font-size: 1.25rem;
  }
  
  .text-subtitle1 {
    font-size: 1rem;
  }
  
  .row.q-pa-sm {
    padding: 4px;
  }
  
  .col-md-4,
  .col-md-8 {
    width: 100%;
    margin-bottom: 4px;
  }
}
</style>