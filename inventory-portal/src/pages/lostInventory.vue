<template>
  <q-page class="q-pa-md">
    <div>
      <!-- Table title -->
      <div class="col-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Bijlipay Lost Or Stolen Devices
      </div>

      <!-- General Lead Information Popup -->
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />

      <!-- QTable -->
      <q-table
        table-class="customTableClass"
        :columns="columns"
        :data="tableData"
        color="grey-9"
        :filter="filterSearch"
        v-model:pagination="paginationControl"
        :rows-per-page-options="[5,10,15,20,25]"
        :loading="toggleAjaxLoadFilter"
        @request="ajaxLoadAllLeadInfo"
      >
        <template v-slot:body-cell-updated_at="props">
          {{ props.row.updatedAt ? formatDate(props.row.updatedAt) : 'NA' }}
        </template>

        <template v-slot:top>
          <!-- Search -->
          <div class="col-md-5">
            <q-search
              v-model="filterSearch"
              clearable
              color="grey-9"
              placeholder="Type.."
              float-label="Search Using Device Serial Number"
              class="q-mr-lg q-py-sm"
            />
          </div>

          <!-- Download button -->
          <div class="col-md-5">
            <q-btn
              square
              outline
              color="purple-9"
              label="Download as Excel"
              class="q-mr-lg q-py-sm float-right"
              size="md"
              @click="downloadLostOrStolenList"
            />
          </div>
        </template>
      </q-table>

      <!-- Download Modal -->
      <DownloadLostOrStolen
        v-if="propLostOrStolenList"
        :propLostOrStolenList="propLostOrStolenList"
        @emitfnshowLostOrStolenList="downloadLostOrStolenList"
      />

      <!-- Merchant Transaction Popup -->
      <showMerchantTransactionLevelDetails
        v-if="valueToggleMerchantTransaction"
        :valueToggleMerchantTransaction="valueToggleMerchantTransaction"
        @revertRowClick="rowClick"
      />

      <!-- Loader overlay -->
      <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
        <q-spinner-bars class="absolute-center" color="#61116a" size="35" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import moment from "moment";

import DownloadLostOrStolen from "../components/DownloadLostOrStolen.vue";
import showMerchantTransactionLevelDetails from "../components/sat/showMerchantTransactionLevelDetails.vue";
import generalLeadInformation from "../components/generalLeadInformation.vue";

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();

// Reactive state
const propToggleLeadInformation = ref(false);
const toggleAjaxLoadFilter = ref(false);
const addtnLeadInformation = ref(null);
const propLostOrStolenList = ref(false);
const valueToggleMerchantTransaction = ref(false);
const filterSearch = ref("");
const tableData = ref([]);

const paginationControl = ref({
  rowsNumber: 10,
  page: 1,
  sortBy: "serialNumber",
  descending: false,
  rowsPerPage: 5
});

// Table columns
const columns = [
  {
    name: "serialNumber",
    required: true,
    label: "Device Serial Number",
    align: "left",
    field: "serialNumber"
  },
  {
    name: "device",
    required: true,
    label: "Device Type",
    align: "left",
    field: row => row.device.deviceName
  },
  {
    name: "updated_at",
    required: true,
    label: "Receive Date",
    align: "center",
    field: row => row.updatedAt ? formatDate(row.updatedAt) : "NA"
  }
];

// Vuex getters & actions
const getinventoryStolenData = store.getters["inventoryStolenData/getinventoryStolenData"];
const FETCH_INVENTORY_STOLEN_DATA = store.dispatch.bind(store, "inventoryStolenData/FETCH_INVENTORY_STOLEN_DATA");

// Helper: format date
const formatDate = dateStr => moment(dateStr).format("DD/MM/YYYY");

// Download toggle
function downloadLostOrStolenList() {
  propLostOrStolenList.value = !propLostOrStolenList.value;
}

// Toggle lead info popup
function toggleLeadInformation(leadDetails) {
  propToggleLeadInformation.value = !propToggleLeadInformation.value;
  if (leadDetails) addtnLeadInformation.value = leadDetails;
}

// Fetch table data
async function ajaxLoadAllLeadInfo({ pagination, filter }) {
  toggleAjaxLoadFilter.value = true;
  $q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data ..." });

  try {
    await FETCH_INVENTORY_STOLEN_DATA({ pagination, filter });
    
    paginationControl.value = { ...paginationControl.value, ...pagination };
    paginationControl.value.rowsNumber = getinventoryStolenData.totalElements;
    paginationControl.value.page = getinventoryStolenData.number + 1;

    tableData.value = getinventoryStolenData.content;

    if (getinventoryStolenData.sort?.length) {
      paginationControl.value.sortBy = getinventoryStolenData.sort[0].property;
      paginationControl.value.descending = !getinventoryStolenData.sort[0].ascending;
    }

    console.log("Table Data =>", tableData.value);
  } catch (err) {
    console.error("Error fetching stolen inventory data:", err);
  } finally {
    toggleAjaxLoadFilter.value = false;
    $q.loading.hide();
  }
}

// Load data on mount
onMounted(() => {
  ajaxLoadAllLeadInfo({ pagination: paginationControl.value, filter: filterSearch.value });
});
</script>

<style scoped>
/* Optional custom styles */
.spinner-overlay {
  background-color: rgba(255, 255, 255, 0.6);
  z-index: 9999;
}
</style>
