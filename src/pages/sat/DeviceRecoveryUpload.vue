<template>
  <q-page padding>
    <!-- Header -->
    <div class="row bottom-border q-px-md q-py-md items-center">
      <div class="col-md-8 q-title text-weight-regular text-grey-9">
        Aggregator Add Device Recovery - Scan & Upload
      </div>
    </div>

    <!-- Select Device & Status -->
    <div class="row bottom-border q-px-md q-py-md items-center text-weight-regular text-grey-9">
      <div class="col-md-4">
        <q-select
          v-model="formData.device.id"
          float-label="Select Device Type"
          radio
          color="grey-9"
          :options="deviceOptions"
        />
      </div>
      <div class="col-md-4">
        <q-select
          :disabled="!formData.device.id"
          v-model="action"
          float-label="Select Device Status"
          radio
          color="grey-9"
          :options="actionOptions"
          @input="disableDeviceTypeSelection"
        />
      </div>

      <!-- Buttons -->
      <div class="col-12 col-lg-4 group" align="right">
        <q-btn
          :disabled="!formData.device.id || !scanningActive"
          v-if="scanningActive"
          color="primary"
          label="Start Scan"
          @click="startScanner"
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
        />
      </div>
    </div>

    <!-- Table -->
    <q-table
      :rows="tempTableData"
      :columns="columnData"
      row-key="deviceSerialNumbers"
      :filter="filterSearch"
      v-model:pagination="paginationControl"
      :loading="tableAjaxLoading"
      table-class="customTableClass shadow-0"
      color="light-blue"
    >
      <!-- Action Column -->
      <template v-slot:body-cell-action="props">
        <q-btn
          label="Remove"
          icon="close"
          color="red-6"
          size="sm"
          @click="removeScannedItem(props.row)"
        />
      </template>

      <!-- Top Slot: Search -->
      <template v-slot:top>
        <div class="row q-mb-sm">
          <div class="col-md-5">
            <q-search
              v-model="filterSearch"
              clearable
              color="grey-9"
              placeholder="Type.."
              float-label="Search .."
              class="q-mr-lg q-py-sm"
            />
          </div>
        </div>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { useBarcodeScanner } from "vue-barcode-scanner"; // Vue 3 compatible

// ---------------------------
// Reactive State
// ---------------------------
const store = useStore();

const filterSearch = ref("");
const scanningActive = ref(true);
const action = ref("");
const tempTableData = ref([]);
const deviceOptions = ref([]);

const formData = reactive({
  device: {
    id: "",
    isDisable: false
  },
  deviceSerialNumbers: []
});

const columnData = ref([
  { name: "deviceSerialNumbers", label: "Serial Number", align: "left", field: "deviceSerialNumbers", sortable: true },
  { name: "action", label: "", align: "left", field: "action" }
]);

const actionOptions = ref([
  { label: "Good", value: 1 },
  { label: "Fault", value: 2 }
]);

const paginationControl = ref({ rowsPerPage: 10 });
const tableAjaxLoading = ref(false);

// ---------------------------
// Vuex Getters & Actions
// ---------------------------

const PHONEPE_VERIFY_DEVICE_AFTER_RECOVERY = store.dispatch.bind(store, "PhonepeDeviceRecovery/PHONEPE_VERIFY_DEVICE_AFTER_RECOVERY");
const FEED_PHONEPE_DEVICE_AFTER_SCANNED_TO_SUBMIT = store.dispatch.bind(store, "PhonepeDeviceRecovery/FEED_PHONEPE_DEVICE_AFTER_SCANNED_TO_SUBMIT");
const GET_ACTIVE_CREATED_DEVICE_LIST = store.dispatch.bind(store, "superAdminAggregatorsDevice/GET_ACTIVE_CREATED_DEVICE_LIST");

// ---------------------------
// Barcode Scanner
// ---------------------------
const { initScanner, destroyScanner } = useBarcodeScanner();

function onBarcodeScanned(barcode) {
  const duplicate = tempTableData.value.find(item => item.deviceSerialNumbers === barcode);

  if (!duplicate) {
    PHONEPE_VERIFY_DEVICE_AFTER_RECOVERY({
      device: formData.device.id,
      barcode
    })
      .then(() => {
        tempTableData.value.push({ deviceSerialNumbers: barcode });
      })
      .catch(() => {
        notifyInfo(`${barcode} - device already available in the inventory`);
      });
  } else {
    notifyInfo(`${barcode} - device already scanned`);
  }
}

// ---------------------------
// Scanner Controls
// ---------------------------
function startScanner() {
  initScanner(onBarcodeScanned);
  scanningActive.value = false;
}

function disableDeviceTypeSelection() {
  if (!scanningActive.value) {
    scanningActive.value = true;
  }
  destroyScanner();
}

// ---------------------------
// Remove Scanned Item
// ---------------------------
function removeScannedItem(item) {
  tempTableData.value = tempTableData.value.filter(i => i.deviceSerialNumbers !== item.deviceSerialNumbers);
  if (tempTableData.value.length === 0) scanningActive.value = true;
}

// ---------------------------
// Final Submit
// ---------------------------
function finalSubmit() {
  if (!tempTableData.value.length) return;

  formData.deviceSerialNumbers = tempTableData.value.map(item => item.deviceSerialNumbers);

  const param = {
    deviceId: formData.device.id,
    action: action.value,
    request: {
      serialNumber: formData.deviceSerialNumbers
    }
  };

  FEED_PHONEPE_DEVICE_AFTER_SCANNED_TO_SUBMIT(param)
    .then(() => {
      notifyPositive("Devices are added successfully!");
      // Reset form
      formData.device.id = "";
      action.value = "";
      tempTableData.value = [];
    })
    .catch(() => {
      notifyNegative("Error in updating devices!");
    });
}

// ---------------------------
// Utility Notifications
// ---------------------------
import { useQuasar } from "quasar";
const $q = useQuasar();

function notifyInfo(msg) {
  $q.notify({ color: "primary", position: "bottom", message: msg, icon: "info" });
}
function notifyPositive(msg) {
  $q.notify({ color: "positive", position: "bottom", message: msg, icon: "thumb_up" });
}
function notifyNegative(msg) {
  $q.notify({ color: "negative", position: "bottom", message: msg, icon: "thumb_down" });
}

// ---------------------------
// Fetch Device Options on Mount
// ---------------------------
onMounted(() => {
  GET_ACTIVE_CREATED_DEVICE_LIST().then(() => {
    deviceOptions.value = store.getters["superAdminAggregatorsDevice/getCreatedActiveDeviceList"].map(item => ({
      value: item.id,
      label: item.deviceName
    }));
  });
});
</script>

<style scoped>
.customTableClass {
  font-size: 0.9rem;
}
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>
