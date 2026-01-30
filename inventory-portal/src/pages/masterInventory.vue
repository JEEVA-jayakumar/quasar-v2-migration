<template>
  <q-page class="q-pa-md">
    <div>
      <!-- Table title -->
      <div class="col-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Master Inventory - Allocated to merchants
      </div>

      <!-- QTable -->
      <q-table
        table-class="customTableClass"
        class="q-py-none"
        :data="tableData"
        :columns="columns"
        :filter="filter"
        v-model:pagination="paginationControl"
        row-key="name"
      >
        <!-- Table top slot: search, filter, download -->
        <template v-slot:top>
          <div class="row q-col-gutter-md">
            <!-- Search -->
            <div class="col">
              <q-search
                v-model="filter"
                clearable
                color="grey-9"
                placeholder="Type.."
                float-label="Search by serial no, tid, merchant name, device type"
                class="q-mr-lg q-py-sm"
              />
            </div>

            <!-- Region filter -->
            <div class="col-4">
              <q-select
                v-model="regionFilter"
                clearable
                :options="regionOptions"
                color="grey-9"
                placeholder="Select"
                float-label="Filter By"
                @clear="filterMasterTrackerClear"
                @input="filterMasterTrackerByRegionId"
              />
            </div>

            <!-- Download button -->
            <div class="col-auto">
              <q-btn
                @click="downloadMasterInventory"
                outline
                color="grey-9"
                label="Download as Excel"
                class="q-mr-lg q-py-sm float-right"
                size="md"
              />
            </div>
          </div>
        </template>
      </q-table>

      <!-- Loader overlay -->
      <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
        <q-spinner-bars class="absolute-center" color="#61116a" :size="35" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();

// Reactive state
const filter = ref("");
const regionFilter = ref("");
const toggleAjaxLoadFilter = ref(false);
const tableData = ref([]);
const regionOptions = ref([]);
const paginationControl = ref({
  page: 1,
  rowsPerPage: 10
});

// Table columns
const columns = [
  {
    name: "device_serial_number",
    required: true,
    label: "Device Serial Number",
    align: "left",
    field: row => row.regionalInventory?.serialNumber ?? "NA",
    sortable: true
  },
  {
    name: "device",
    required: true,
    label: "Device type",
    align: "left",
    field: row => row.leadInformation.device.deviceName,
    sortable: false
  },
  {
    name: "tid",
    required: true,
    label: "TID",
    align: "left",
    field: "tid",
    sortable: true
  },
  {
    name: "mid",
    required: true,
    label: "MID",
    align: "left",
    field: "mid",
    sortable: true
  },
  {
    name: "leadInformation",
    required: true,
    label: "ME Name",
    align: "left",
    field: row => row.leadInformation.leadName,
    sortable: false
  },
  {
    name: "address",
    required: true,
    label: "Address",
    align: "left",
    field: row => row.leadInformation.leadAddress,
    sortable: false
  }
];

// Vuex getters & actions
const getMasterInventoryData = store.getters["InventoryCentral/getMasterInventoryData"];
const getAllRegionsData = store.getters["SuperAdminUsers/getAllRegionsData"];
const FETCH_MASTER_INVENTORY_DATA = store.dispatch.bind(store, "InventoryCentral/FETCH_MASTER_INVENTORY_DATA");
const REPORT_MASTER_INVENTORY = store.dispatch.bind(store, "InventoryCentral/REPORT_MASTER_INVENTORY");
const FETCH_ALL_REGIONS_DATA = store.dispatch.bind(store, "SuperAdminUsers/FETCH_ALL_REGIONS_DATA");

// Fetch inventory & regions
async function getAllInventoryData() {
  toggleAjaxLoadFilter.value = true;
  try {
    await FETCH_MASTER_INVENTORY_DATA();
    tableData.value = getMasterInventoryData;

    await FETCH_ALL_REGIONS_DATA();
    regionOptions.value = getAllRegionsData;
  } finally {
    toggleAjaxLoadFilter.value = false;
  }
}

// Filter by region
async function filterMasterTrackerByRegionId() {
  toggleAjaxLoadFilter.value = true;
  try {
    await FETCH_MASTER_INVENTORY_DATA(regionFilter.value);
    tableData.value = getMasterInventoryData;
  } finally {
    toggleAjaxLoadFilter.value = false;
  }
}

// Clear region filter
function filterMasterTrackerClear() {
  regionFilter.value = "";
  getAllInventoryData();
}

// Download Excel
async function downloadMasterInventory() {
  $q.loading.show({ delay: 100 });
  try {
    await REPORT_MASTER_INVENTORY(regionFilter.value);
    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Success, file has been downloaded",
      icon: "check"
    });
  } catch (err) {
    console.error(err);
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "Please try again",
      icon: "thumb_down"
    });
  } finally {
    $q.loading.hide();
  }
}

// On mounted, fetch data
onMounted(() => {
  getAllInventoryData();
});
</script>

<style scoped>
.spinner-overlay {
  background-color: rgba(255, 255, 255, 0.6);
  z-index: 9999;
}
</style>
