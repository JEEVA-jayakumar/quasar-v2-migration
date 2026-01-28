<template>
  <q-page class="q-pa-md">
    <div>
      <!-- Header -->
      <div class="row bottom-border q-px-md q-py-md items-center">
        <div class="col-md-8 q-title text-weight-regular text-grey-9">
          Aggregator Add New Devices - Scan & Upload
        </div>
        <div class="col-md-4 text-right">
          <q-btn
            @click="router.push('/inventory/PhonepeInventory')"
            outline
            label="Cancel Allocation"
            color="negative"
          />
        </div>
      </div>

      <!-- Device selection & actions -->
      <div class="row bottom-border q-px-md q-py-md items-center text-weight-regular text-grey-9">
        <div class="col-md-4">
          <q-select
            v-model="formData.device.id"
            :options="deviceOptions"
            float-label="Select Device Type"
            color="grey-9"
            @input="fnDisableDeviceTypeSelection"
          />
        </div>

        <div class="col-12 col-lg-4 text-right">
          <q-btn
            v-if="scanningActive"
            :disabled="!formData.device.id"
            color="primary"
            label="Start scan"
            @click="fnStartScanner"
          />
          <q-btn
            v-if="tempTableData.length > 0"
            class="common-btn q-py-xs"
            label="Upload"
            @click="finalSubmit"
          />
          <q-btn
            v-else
            class="disabled common-btn q-py-xs no-pointer-events"
            label="Upload"
            @click="finalSubmit"
          />
        </div>
      </div>

      <!-- Table -->
      <q-table
        :data="tempTableData"
        :columns="columnData"
        row-key="deviceSerialNumbers"
        table-class="customTableClass shadow-0"
        :filter="filterSearch"
        v-model:pagination="paginationControl"
        :loading="tableAjaxLoading"
        color="light-blue"
      >
        <!-- Action column -->
        <template #body-cell-action="props">
          <q-btn
            @click="removeScannedItems(props.row)"
            label="Remove"
            icon="close"
            color="red-6"
            size="sm"
          />
        </template>

        <!-- Top slot: search -->
        <template #top>
          <div class="col-md-5">
            <q-search
              v-model="filterSearch"
              placeholder="Type.."
              float-label="Search .."
              clearable
              color="grey-9"
              class="q-mr-lg q-py-sm"
            />
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import VueBarcodeScanner from "vue-barcode-scanner";

// Install Barcode Scanner plugin in Vue 3
const $q = useQuasar();
const store = useStore();
const router = useRouter(); // Import and initialize Vue Router
VueBarcodeScanner.install();

// Reactive state
const filterSearch = ref("");
const scanningActive = ref(true);
const tableAjaxLoading = ref(false);

const deviceOptions = ref([]);
const tempTableData = ref([]);

const formData = reactive({
  device: { id: "" },
  deviceSerialNumbers: []
});

const paginationControl = reactive({
  rowsPerPage: 10
});

// Table columns
const columnData = [
  {
    name: "deviceSerialNumbers",
    required: true,
    label: "Serial Number",
    align: "left",
    field: "deviceSerialNumbers",
    sortable: true
  },
  {
    name: "action",
    required: true,
    label: "",
    align: "left",
    field: "action"
  }
];

// Vuex getters
const getCreatedActiveDeviceList = store.getters["superAdminAggregatorsDevice/getCreatedActiveDeviceList"];

// Vuex actions
const GET_ACTIVE_CREATED_DEVICE_LIST = () => store.dispatch("superAdminAggregatorsDevice/GET_ACTIVE_CREATED_DEVICE_LIST");
const AGGREGATORS_VERIFY_DEVICE_BEFORE_ADDING_CENTRAL_INVENTORY = (payload) =>
  store.dispatch("VerifyDevice/AGGREGATORS_VERIFY_DEVICE_BEFORE_ADDING_CENTRAL_INVENTORY", payload);
const FEED_PHONE_PE_DEVICE_SCAN_BY_ID_DATA = (payload) =>
  store.dispatch("InventoryScanAddDevice/FEED_PHONE_PE_DEVICE_SCAN_BY_ID_DATA", payload);

// Methods

// Populate device options
async function AggregatorsDevice() {
  await GET_ACTIVE_CREATED_DEVICE_LIST(); // Remove unused variable assignment
  deviceOptions.value = getCreatedActiveDeviceList.map(item => ({
    value: item.id,
    label: item.deviceName
  }));
}

// Disable device type selection
function fnDisableDeviceTypeSelection() {
  if (!scanningActive.value) scanningActive.value = true;
  if (window.$barcodeScanner) window.$barcodeScanner.destroy();
}

// Start barcode scanner
function fnStartScanner() {
  if (window.$barcodeScanner) window.$barcodeScanner.init(onBarcodeScanned);
  scanningActive.value = false;
}

// Barcode scanned callback
async function onBarcodeScanned(barcode) {
  const duplicate = tempTableData.value.find(item => item.deviceSerialNumbers === barcode);
  if (!duplicate) {
    try {
      await AGGREGATORS_VERIFY_DEVICE_BEFORE_ADDING_CENTRAL_INVENTORY({
        device: formData.device.id,
        barcode
      });
      tempTableData.value.push({ deviceSerialNumbers: barcode });
    } catch {
      $q.notify({
        color: "primary",
        position: "bottom",
        message: `${barcode} - device already available in the inventory`,
        icon: "info"
      });
    }
  } else {
    $q.notify({
      color: "primary",
      position: "bottom",
      message: `${barcode} - device already scanned`,
      icon: "info"
    });
  }
}

// Remove scanned item
function removeScannedItems(item) {
  const index = tempTableData.value.findIndex(i => i.deviceSerialNumbers === item.deviceSerialNumbers);
  if (index > -1) tempTableData.value.splice(index, 1);
  if (tempTableData.value.length === 0) scanningActive.value = true;
}

// Final submit
async function finalSubmit() {
  formData.deviceSerialNumbers = tempTableData.value.map(item => item.deviceSerialNumbers);
  const payload = {
    deviceId: formData.device.id,
    request: { deviceSerialNumbers: formData.deviceSerialNumbers }
  };

  try {
    await FEED_PHONE_PE_DEVICE_SCAN_BY_ID_DATA(payload);
    $q.notify({ color: "positive", position: "bottom", message: "Devices are added successfully!", icon: "thumb_up" });
    router.push("/inventory/PhonepeInventory"); // Use router instead of $router
  } catch {
    $q.notify({ color: "negative", position: "bottom", message: "Serial Number Already Available In DB!", icon: "thumb_down" });
  }
}

// On mounted
onMounted(() => {
  AggregatorsDevice();
});
</script>

<style scoped>
</style>