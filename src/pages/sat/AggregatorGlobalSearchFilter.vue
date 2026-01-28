<template>
  <q-page class="q-pa-md">
    <!-- content -->
    <div>
      <div class="col-md-12 text-h5 q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Aggregator Global Serial Number/TID Search
      </div>
      
      <div class="row gutter-x-xs gutter-y-xs q-pt-md justify-around items-end">
        <div class="col-md-6">
          <q-input
            clearable
            color="grey-9"
            v-model="formData.searchTerm"
            placeholder="Search .."
            class="q-mr-lg q-py-sm"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        
        <div class="col-md-3">
          <div class="group">
            <q-option-group
              :options="flagOptions"
              type="radio"
              v-model="formData.flag"
              color="grey-9"
              inline
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
      v-if="tableData.length == 0"
      class="row gutter-x-xs gutter-y-xs justify-center q-pt-lg q-mr-lg q-ml-lg q-mt-lg q-mb-lg"
      style="min-height: calc(80vh - 52px);"
    >
      <div class="row" align="center">
        <q-icon name="warning" color="warning" size="4rem" />
        <div class="text-h6 text-bold text-grey-9" style="align-self: center;">
          No Data Available
        </div>
      </div>
    </div>
    
    <div v-for="tdata in tableData" :key="tdata.id" class="row gutter-x-xs gutter-y-xs justify-center q-pt-lg q-mr-lg q-ml-lg q-mt-lg q-mb-lg">
      <!-- Lead Status Card -->
      <div class="col-lg-4 col-md-6 col-sm-12">
        <q-card class="q-card q-py-md items-center round-borders q-pa-sm">
          <q-card-section>
            <div class="text-h6 text-bold text-grey-9">Lead Status</div>
          </q-card-section>
          
          <q-separator />
          
          <q-card-section>
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">
                {{ filedKeys.leadStatus.leadNumber.label }}
              </span>
              <span class="col-md-8 text-wrap text-primary">
                # {{ tdata.leadNumber }}
              </span>
            </div>
            
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">
                {{ filedKeys.leadStatus.leadName.label }}
              </span>
              <span class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10">
                {{ tdata.leadName }}
              </span>
            </div>
            
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">
                {{ filedKeys.leadStatus.leadAddress.label }}
              </span>
              <span class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10">
                {{ tdata.leadAddress }}
              </span>
            </div>
            
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">
                {{ filedKeys.leadStatus.leadDevice.label }}
              </span>
              <span class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10">
                {{ tdata.leadDevice }}
              </span>
            </div>
            
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">
                {{ filedKeys.leadStatus.leadDeviceCount.label }}
              </span>
              <span class="col-md-4">{{ tdata.ledDeviceCount }}</span>
            </div>
            
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">
                {{ filedKeys.leadStatus.leadRegionName.label }}
              </span>
              <span class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10">
                {{ tdata.leadRegionName }}
              </span>
            </div>
            
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">
                {{ filedKeys.leadStatus.leadStatus.label }}
              </span>
              <span
                class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                :style="`
                  background-color: ${funcValidate(tdata.leadStatus, 'LS')};
                  border: solid 1px ${funcValidate(tdata.leadStatus, 'LS')};
                  padding: 2px; border-radius: 5px; text-align: center
                `"
              >
                {{ processStatus(tdata.leadStatus, "LS") }}
              </span>
            </div>
          </q-card-section>
        </q-card>
      </div>
      
      <!-- TID Status Card -->
      <div class="col-lg-4 col-md-6 col-sm-12">
        <q-card class="q-card q-py-md round-borders q-pa-sm">
          <q-card-section>
            <div class="text-h6 text-bold text-grey-9">Tid Status</div>
          </q-card-section>
          
          <q-separator />
          
          <q-card-section>
            <div v-if="tdata.tidStatus == 6" class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">
                {{ filedKeys.tidStatus.tid.label }}
              </span>
              <span class="col-md-8 text-wrap text-primary">
                # {{ tdata.tid }}
              </span>
            </div>
            
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">
                {{ filedKeys.tidStatus.tidStatus.label }}
              </span>
              <span
                class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                :style="`
                  background-color: ${funcValidate(tdata.tidStatus, 'TS')};
                  border: solid 2px ${funcValidate(tdata.tidStatus, 'TS')};
                  padding: 2px; border-radius: 5px; text-align: center
                `"
              >
                {{ processStatus(tdata.tidStatus, "TS") }}
              </span>
            </div>
            
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">
                {{ filedKeys.tidStatus.tidAssignedTo.label }}
              </span>
              <span
                class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                :style="`
                  background-color: ${tdata.tidAssignedTo == 'NA' ? 'springgreen' : 'tomato'};
                  padding: 2px; border-radius: 5px; text-align: center
                `"
              >
                {{ tdata.tidAssignedTo }}
              </span>
            </div>
            
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">
                {{ filedKeys.tidStatus.tidImplementedDate.label }}
              </span>
              <span class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10">
                {{ tdata.tidImplementedDate }}
              </span>
            </div>
            
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">
                {{ filedKeys.tidStatus.deviceRecoveryStatus.label }}
              </span>
              <span
                class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                :style="`
                  background-color: ${funcValidate(tdata.deviceRecoveryStatus, 'TRCS')};
                  border: solid 2px ${funcValidate(tdata.deviceRecoveryStatus, 'TRCS')};
                  padding: 2px; border-radius: 5px; text-align: center
                `"
              >
                {{ processStatus(tdata.deviceRecoveryStatus, "TRCS") }}
              </span>
            </div>
            
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">
                {{ filedKeys.tidStatus.recoveredBy.label }}
              </span>
              <span
                class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                :style="`
                  background-color: ${tdata.recoveredBy == 'NA' ? 'springgreen' : 'tomato'};
                  padding: 2px; border-radius: 5px; text-align: center
                `"
              >
                {{ tdata.recoveredBy }}
              </span>
            </div>
            
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">
                {{ filedKeys.tidStatus.deviceReplacementStatus.label }}
              </span>
              <span
                class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                :style="`
                  background-color: ${funcValidate(tdata.deviceReplacementStatus, 'TRPS')};
                  border: solid 2px ${funcValidate(tdata.deviceReplacementStatus, 'TRPS')};
                  padding: 2px; border-radius: 5px; text-align: center
                `"
              >
                {{ processStatus(tdata.deviceReplacementStatus, "TRPS") }}
              </span>
            </div>
            
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">
                {{ filedKeys.tidStatus.replacedBy.label }}
              </span>
              <span
                class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                :style="`
                  background-color: ${tdata.replacedBy == 'NA' ? 'springgreen' : 'tomato'};
                  padding: 2px; border-radius: 5px; text-align: center;
                `"
              >
                {{ tdata.replacedBy }}
              </span>
            </div>
          </q-card-section>
        </q-card>
      </div>
      
      <!-- Serial Number Status Card -->
      <div class="col-lg-4 col-md-6 col-sm-12 no-wrap">
        <q-card class="q-card q-py-md round-borders q-pa-sm">
          <q-card-section>
            <div class="text-h6 text-bold text-grey-9">
              Serial Number Status
            </div>
          </q-card-section>
          
          <q-separator />
          
          <q-card-section>
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">
                {{ filedKeys.serialNumberStatus.serialNumber.label }}
              </span>
              <span class="col-md-8 text-wrap text-primary">
                # {{ tdata.serialNumber }}
              </span>
            </div>
            
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">
                {{ filedKeys.serialNumberStatus.ciDeviceType.label }}
              </span>
              <span class="col-md-4 text-wrap content-center text-weight-regular text-blue-grey-10">
                {{ tdata.ciDeviceType }}
              </span>
              
              <span
                class="col-md-4 text-wrap content-center text-weight-regular text-blue-grey-10"
                :style="`
                  background-color: ${tdata.deviceCategoryType == null ? 'tomato' : 'springgreen'};
                  padding: 2px; border-radius: 5px; text-align: center;
                `"
              >
                {{ tdata.deviceCategoryType == null ? "NA" : tdata.deviceCategoryType }}
              </span>
            </div>
            
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">
                {{ filedKeys.serialNumberStatus.ciDeviceStauts.label }}
              </span>
              <span
                class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                :style="`
                  background-color: ${funcValidate(tdata.ciDeviceStauts, 'CIDS')};
                  border: solid 2px ${funcValidate(tdata.ciDeviceStauts, 'CIDS')};
                  padding: 2px; border-radius: 5px; text-align: center
                `"
              >
                {{ processStatus(tdata.ciDeviceStauts, "CIDS") }}
              </span>
            </div>
            
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">
                {{ filedKeys.serialNumberStatus.deviceAllocatedtoRegion.label }}
              </span>
              <span
                class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                :style="`
                  background-color: ${tdata.deviceAllocatedtoRegion ? 'springgreen' : 'tomato'};
                  padding: 2px; border-radius: 5px; text-align: center
                `"
              >
                {{
                  tdata.deviceAllocatedtoRegion
                    ? "Allocated"
                    : "Not Allocated"
                }}
              </span>
            </div>
            
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">
                {{ filedKeys.serialNumberStatus.riDeviceStatus.label }}
              </span>
              <span
                class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                :style="`
                  background-color: ${funcValidate(tdata.riDeviceStatus, 'RIDS')};
                  border: solid 2px ${funcValidate(tdata.riDeviceStatus, 'RIDS')};
                  padding: 2px; border-radius: 5px; text-align: center
                `"
              >
                {{ processStatus(tdata.riDeviceStatus, "RIDS") }}
              </span>
            </div>
            
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">
                {{ filedKeys.serialNumberStatus.riDeviceAllocatedOrImplemented.label }}
              </span>
              <span
                class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                :style="`
                  background-color: ${
                    tdata.riDeviceAllocatedOrImplemented
                      ? 'springgreen'
                      : 'tomato'
                  };
                  padding: 2px; border-radius: 5px; text-align: center
                `"
              >
                {{
                  tdata.riDeviceAllocatedOrImplemented
                    ? "Allocated / Implemented"
                    : "Not Allocated / Implemented"
                }}
              </span>
            </div>
            
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">
                {{ filedKeys.serialNumberStatus.isDeviceReceivedInRi.label }}
              </span>
              <span
                class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                :style="`
                  background-color: ${
                    tdata.isDeviceReceivedInRi == 1 ? 'springgreen' : 'tomato'
                  };
                  padding: 2px; border-radius: 5px; text-align: center
                `"
              >
                {{
                  tdata.isDeviceReceivedInRi == 1
                    ? "Received"
                    : "Not Received"
                }}
              </span>
            </div>
            
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">
                {{ filedKeys.serialNumberStatus.riAssignedSO.label }}
              </span>
              <span
                class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                :style="`
                  background-color: ${
                    tdata.isDeviceReceivedInRi == 1 ? 'springgreen' : 'tomato'
                  };
                  padding: 2px; border-radius: 5px; text-align: center
                `"
              >
                {{ tdata.riAssignedSO }}
              </span>
            </div>
            
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">
                {{ filedKeys.serialNumberStatus.riStatusUpdatedDate.label }}
              </span>
              <span class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10">
                {{ tdata.riStatusUpdatedDate }}
              </span>
            </div>
            
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">
                {{ filedKeys.serialNumberStatus.riPodNumber.label }}
              </span>
              <span class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10">
                {{ tdata.riPodNumber }}
              </span>
            </div>
            
            <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
              <span class="col-md-4 text-weight-medium">
                {{ filedKeys.serialNumberStatus.regionInventoryName.label }}
              </span>
              <span class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10">
                {{ tdata.regionInventoryName }}
              </span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    
    <!-- Ajax Spinner -->
    <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
      <q-spinner-bars class="absolute-center" style="color:#61116a" size="35" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const store = useStore();

// Helper function
const deCapitalizeFirstLetter = ([first, ...rest]) =>
  first === undefined ? '' : first.toLowerCase() + rest.join('');

// Reactive variables
const toggleAjaxLoadFilter = ref(false);
const tableData = ref([]);

const formData = ref({
  flag: '',
  searchTerm: ''
});

const flagOptions = [
  { label: 'Tid', value: 1 },
  { label: 'Serial Number', value: 2 },
  { label: 'Mid', value: 3 },
  { label: 'Lead Number', value: 4 },
  { label: 'Application Number', value: 5 },
];

const filedKeys = {
  leadStatus: {
    leadNumber: { label: 'Lead Number' },
    leadName: { label: 'Lead Name' },
    leadAddress: { label: 'Address' },
    leadDevice: { label: 'Device Type' },
    leadDeviceCount: { label: 'Device Count' },
    leadRegionName: { label: 'Region Name' },
    leadStatus: { label: 'Lead Status' }
  },
  tidStatus: {
    tid: { label: 'TID' },
    tidStatus: { label: 'Status' },
    tidAssignedTo: { label: 'Assigned To' },
    tidImplementedDate: { label: 'Status Date' },
    deviceRecoveryStatus: { label: 'Recovery Status' },
    recoveredBy: { label: 'Recovered By' },
    deviceReplacementStatus: { label: 'Replacement Status' },
    replacedBy: { label: 'Replaced By' }
  },
  serialNumberStatus: {
    serialNumber: { label: 'Serial Number' },
    ciDeviceType: { label: 'CI Device Type' },
    ciDeviceStauts: { label: 'CI Device Status' },
    deviceAllocatedtoRegion: { label: 'IS Device Allocated To Region' },
    riDeviceStatus: { label: 'RI Device Status' },
    riDeviceAllocatedOrImplemented: {
      label: 'RI Device Allocated Or Implemented'
    },
    isDeviceReceivedInRi: { label: 'Device Received In RI' },
    riAssignedSO: { label: 'RI Assigned SO' },
    riStatusUpdatedDate: { label: 'RI Status Updated Date' },
    riPodNumber: { label: 'RI POD Number' },
    regionInventoryName: { label: 'Regional Inventory Name' }
  }
};

const paginationControl = ref({
  rowsNumber: 10,
  page: 1,
  sortBy: 'leadNumber',
  descending: false,
  rowsPerPage: 25
});

// Computed properties
const getAggregatorsGlobalSearchSerialNumber = computed(() => 
  store.getters['globalSearchSerialNumber/getAggregatorsGlobalSearchSerialNumber']);

const GLOBAL_STATUS_FETCH = computed(() => 
  store.getters['GlobalVariables/GLOBAL_STATUS_FETCH']);

// Methods
const getFlagKeyByValue = (object, value) => {
  if (object.value === value) {
    return object.label;
  }
};

const globalSearchSubmit = () => {
  if (!formData.value.flag || !formData.value.searchTerm.trim()) {
    $q.notify({
      color: 'negative',
      message: 'Please select a search type and enter a search term'
    });
    return;
  }

  const sort = flagOptions.filter(sFlag => getFlagKeyByValue(sFlag, formData.value.flag));
  paginationControl.value.sortBy = formData.value.flag != 2 
    ? deCapitalizeFirstLetter(sort[0].label.replaceAll(/\s/g, '')) 
    : 'c.serialNumber';

  const params = {
    flag: formData.value.flag,
    searchTerm: formData.value.searchTerm.trim(),
    pagination: paginationControl.value
  };

  $q.loading.show({
    delay: 0,
    spinnerColor: 'purple-9',
    message: 'Searching...'
  });

  store.dispatch('globalSearchSerialNumber/FETCH_PHONE_PE_GLOBAL_SEARCH_DATAS', params)
    .then(() => {
      const data = getAggregatorsGlobalSearchSerialNumber.value;
      
      paginationControl.value.rowsNumber = data.totalElements || 0;
      paginationControl.value.page = data.number !== undefined ? data.number + 1 : 1;
      
      if (data.sort?.[0]) {
        paginationControl.value.sortBy = data.sort[0].property;
        paginationControl.value.descending = data.sort[0].ascending;
      }
      
      tableData.value = data.content || [];
      
      $q.loading.hide();
      
      if (tableData.value.length === 0) {
        $q.notify({
          color: 'warning',
          message: 'No results found'
        });
      }
    })
    .catch((error) => {
      console.error('Search error:', error);
      $q.loading.hide();
      $q.notify({
        color: 'negative',
        message: 'Search failed. Please try again.'
      });
    });
};

const processStatus = (obj, key) => {
  if (obj == null || obj === undefined) return 'NA';
  
  const statusMap = GLOBAL_STATUS_FETCH.value;
  if (!statusMap) return 'NA';
  
  let value = '';
  switch (key) {
    case 'LS':
      value = statusMap.LEAD_STATUS?.[obj];
      break;
    case 'TS':
      value = statusMap.TID_STATUS?.[obj];
      break;
    case 'TRPS':
      value = statusMap.TID_REPLACEMENT_STATUS?.[obj];
      break;
    case 'TRCS':
      value = statusMap.TID_RECOVERY_STATUS?.[obj];
      break;
    case 'CIDS':
      value = statusMap.CENTRAL_INVENTORY_DEVICE_STATUS?.[obj];
      break;
    case 'RIDS':
      value = statusMap.REGIONAL_INVENTORY_DEVICE_STATUS?.[obj];
      break;
    default:
      value = 'NA';
  }
  return value || 'NA';
};

const funcValidate = (obj, key) => {
  if (obj == null || obj === undefined) return 'tomato';
  
  const colors = [
    'tomato', 'pink', 'purple', 'indigo', 'blue', 'lightblue',
    'lightsalmon', 'teal', 'wheat', 'lightgreen', 'lightcoral',
    'springgreen', 'lightseagreen', 'amber', 'orange', 'deep-orange',
    'brown', 'grey', 'blue-grey', 'tomato'
  ];
  
  const tColors = [
    'lightcoral', 'lightgreen', 'orange', 'red', 'lightblue',
    'blue', 'springgreen', 'lightsalmon'
  ];
  
  const riColors = [
    'tomato', 'lightgreen', 'orange', 'indigo', 'blue', 'lightblue',
    'wheat', 'lightsalmon', 'lightcoral', 'springgreen', 'tomato'
  ];
  
  const ciColors = [
    'tomato', 'springgreen', 'tomato', 'lightsalmon', 'lightcoral', 'amber'
  ];
  
  const trpsColors = [
    'tomato', 'lightcoral', 'lightsalmon', 'springgreen', 'lightgreen'
  ];
  
  const trcsColors = ['tomato', 'lightcoral', 'lightgreen', 'springgreen'];
  
  switch (key) {
    case 'LS':
      if (obj == '101') return colors[19];
      if (obj == '102') return colors[16];
      return colors[obj] || 'tomato';
    case 'TS':
      return tColors[obj] || 'tomato';
    case 'TRPS':
      return trpsColors[obj] || 'tomato';
    case 'TRCS':
      return trcsColors[obj] || 'tomato';
    case 'CIDS':
      return ciColors[obj] || 'tomato';
    case 'RIDS':
      return riColors[obj] || 'tomato';
    default:
      return 'tomato';
  }
};
</script>

<style scoped>
.text-wrap {
  overflow-wrap: anywhere;
  color: #242225;
}

.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.round-borders {
  border-radius: 8px;
}

.spinner-overlay {
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 9999;
}

.q-card {
  min-height: 400px;
}
</style>