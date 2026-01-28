<template>
  <q-page>
    <div>
      <!-- Table Title -->
      <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Bijlipay Master Tracker-Implemented
      </div>

      <!-- Lead Info Popup -->
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />

      <!-- Master Tracker Table -->
      <q-table
        table-class="customTableClass"
        :data="tableData"
        :columns="columns"
        :filter="filter"
        v-model:pagination="paginationControl"
        row-key="tid"
        :loading="toggleAjaxLoadFilter"
        :rows-per-page-options="[5,10,15,20,25]"
        @request="ajaxLoadAllLeadInfo"
      >
        <!-- Body Cell Templates -->
        <template v-slot:body-cell-tid="props">
          <span class="label text-primary"># {{ props.row.tid }}</span>
        </template>

        <template v-slot:body-cell-mid="props">
          <span class="label text-primary"># {{ props.row.mid }}</span>
        </template>

        <template v-slot:body-cell-leadNumber="props">
          <span
            class="label text-primary cursor-pointer"
            @click="toggleLeadInformation(props.row.leadInformation)"
          >
            # {{ props.row.leadInformation?.leadNumber }}
          </span>
        </template>

        <template v-slot:body-cell-mobileNumber="props">
          {{ props.row.leadInformation?.contactNumber ?? 'NA' }}
        </template>

        <template v-slot:body-cell-leadAddress="props">
          {{ props.row.leadInformation?.leadAddress ?? 'NA' }}
        </template>

        <template v-slot:body-cell-deviceStatusDate="props">
          <span class="label">{{ formatDate(props.row.deviceStatusDate) }}</span>
        </template>

        <!-- Top Slot: Search + Download -->
        <template v-slot:top>
          <div class="row q-pa-sm items-center">
            <div class="col-5">
              <q-search
                clearable
                v-model="filter"
                separator
                color="grey-9"
                placeholder="Type.."
                float-label="Search by MID, TID, Merchant Name"
                class="q-mr-lg q-py-sm"
              />
            </div>

            <div class="col-6 text-right">
              <q-btn
                square
                outline
                color="purple-9"
                label="Download as Excel"
                class="q-mr-lg q-py-sm"
                size="md"
                @click="downloadmastertrackerlist"
              />
            </div>
          </div>
        </template>
      </q-table>

      <!-- Download Modal -->
      <DownloadMasterTracker
        v-if="propMasterTrackerList"
        :propMasterTrackerList="propMasterTrackerList"
        @emitfnshowMasterTrackerList="downloadmastertrackerlist"
      />

      <!-- Merchant Transaction Details -->
      <showMerchantTransactionLevelDetails
        v-if="valueToggleMerchantTransaction"
        :valueToggleMerchantTransaction="valueToggleMerchantTransaction"
        @revertRowClick="rowClick"
      />

      <!-- Ajax Spinner -->
      <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
        <q-spinner-bars class="absolute-center" style="color:#61116a" :size="35" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { date } from 'quasar'

// Components
import showMerchantTransactionLevelDetails from "../../components/sat/showMerchantTransactionLevelDetails.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import DownloadMasterTracker from "../../components/sat/DownloadMasterTracker.vue";

// Get Vuex store
const store = useStore();

// Reactive States
const propToggleLeadInformation = ref(false);
const propMasterTrackerList = ref(false);
const addtnLeadInformation = ref(null);
const toggleAjaxLoadFilter = ref(false);
const valueToggleMerchantTransaction = ref(false);
const filter = ref("");
const tableData = ref([]);
const paginationControl = ref({
  rowsNumber: 10,
  page: 1,
  sortBy: "tid",
  descending: false,
  rowsPerPage: 10
});

// Date formatting method
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    // Using Quasar's date utilities
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return dateString;
    
    return date.formatDate(dateObj, 'Do MMM Y');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Define ajaxLoadAllLeadInfo function
const ajaxLoadAllLeadInfo = async (props) => {
  try {
    toggleAjaxLoadFilter.value = true;
    
    const { page, rowsPerPage, sortBy, descending } = props.pagination;
    const filterText = props.filter || filter.value;
    
    // Prepare request parameters
    const requestParams = {
      page: page,
      rows: rowsPerPage,
      filter: filterText,
      sortBy: sortBy,
      descending: descending
    };
    
    // Dispatch Vuex action to load data
    await store.dispatch('MasterTracker/LOAD_MASTER_TRACKER_DATA', requestParams);
    
    // Get data from store
    const masterTrackerData = store.getters['MasterTracker/getMasterTrackerData'];
    const paginationData = store.getters['MasterTracker/getMasterTrackerPagination'];
    
    // Update table data
    tableData.value = masterTrackerData || [];
    
    // Update pagination
    if (paginationData) {
      paginationControl.value.rowsNumber = paginationData.total || 0;
      paginationControl.value.page = paginationData.page || 1;
      paginationControl.value.rowsPerPage = paginationData.rowsPerPage || 10;
    }
    
  } catch (error) {
    console.error('Error loading master tracker data:', error);
    // Handle error - you might want to show a notification here
  } finally {
    toggleAjaxLoadFilter.value = false;
  }
};

// Define rowClick function (used in merchant transaction component)
const rowClick = () => {
  valueToggleMerchantTransaction.value = false;
};

const toggleLeadInformation = leadDetails => {
  propToggleLeadInformation.value = !propToggleLeadInformation.value;
  if (leadDetails) addtnLeadInformation.value = leadDetails;
};

const downloadmastertrackerlist = () => {
  propMasterTrackerList.value = !propMasterTrackerList.value;
};

// Columns
const columns = [
  { name: "tid", label: "TID", align: "left", field: "tid", sortable: true },
  { name: "mid", label: "MID", align: "left", field: "mid", sortable: true },
  {
    name: "leadNumber",
    label: "Lead Id",
    align: "left",
    field: row => row.leadInformation?.leadNumber,
    sortable: false
  },
  {
    name: "leadInformation",
    label: "ME Name",
    align: "left",
    field: row => row.leadInformation?.leadName,
    sortable: false
  },
  {
    name: "leadAddress",
    label: "Merchant Address",
    align: "center",
    field: row => row.leadInformation?.leadAddress,
    sortable: false
  },
  {
    name: "deviceName",
    label: "Device type",
    align: "right",
    field: row => row.leadInformation?.device?.deviceName,
    sortable: false
  },
  {
    name: "device_serial_number",
    label: "Device Serial Number",
    align: "left",
    field: row => row.regionalInventory?.serialNumber ?? "NA",
    sortable: true
  },
  {
    name: "deviceStatusDate",
    label: "Implementation Date",
    align: "left",
    field: "deviceStatusDate",
    sortable: true,
    format: (val) => formatDate(val) // Add format function to column
  },
  {
    name: "assignedTo",
    label: "Implemented by",
    align: "left",
    field: row =>
      row.assignedTo ? `${row.assignedTo.name} | ${row.assignedTo.employeeID}` : "NA",
    sortable: true
  },
  {
    name: "deviceAddress",
    label: "Implemented Address",
    align: "left",
    field: row => row.deviceAddress,
    sortable: true
  },
  {
    name: "mobileNumber",
    label: "Mobile Number",
    align: "center",
    field: row => row.leadInformation?.contactNumber ?? "NA",
    sortable: false
  }
];

// On mounted
onMounted(() => {
  ajaxLoadAllLeadInfo({ pagination: paginationControl.value, filter: filter.value });
});
</script>

<style scoped>
.fullscreen.spinner-overlay {
  background: rgba(0, 0, 0, 0.3);
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 9999;
}
</style>