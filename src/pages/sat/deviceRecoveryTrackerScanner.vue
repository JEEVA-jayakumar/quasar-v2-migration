<template>
  <q-page padding>
    <div>
      <!-- Table Header -->
      <div class="row bottom-border q-px-md q-py-md items-center">
        <div class="col-md-8 q-title text-weight-regular text-grey-9">
          Device Recovery Tracker - Inventory
        </div>
        <div class="col-md-4 q-title text-weight-regular text-grey-9" align="right">
          <q-btn
            v-if="!scannerToggleOption"
            flat
            class="common-dark-blue q-py-xs"
            label="Start Scan"
            @click="openScannerComp"
          />
          <q-btn
            v-else
            flat
            class="common-dark-blue q-py-xs"
            label="Stop Scan"
            @click="closeScannerComp"
          />
        </div>
      </div>

      <!-- Table -->
      <q-table
        :rows="getDeviceScannedItems"
        :columns="columnData"
        row-key="serial_number"
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
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { useBarcodeScanner } from "vue-barcode-scanner"; // Vue 3 compatible

// ---------------------------
// Reactive State
// ---------------------------
const scannerToggleOption = ref(false);
const filterSearch = ref("");
const paginationControl = ref({ rowsPerPage: 10 });
const tableAjaxLoading = ref(false);

// Column Definitions
const columnData = ref([
  { name: "device_type", label: "Device Type", align: "left", field: "device_type", sortable: true },
  { name: "serial_number", label: "Serial Number", align: "left", field: "serial_number", sortable: true },
  { name: "action", label: "", align: "left", field: "action" }
]);

// Temp data storage for scanned items
const tempTableData = ref([]);

// ---------------------------
// Vuex Store
// ---------------------------
const store = useStore();
const getDeviceScannedItems = store.getters["SatDeviceTrackerScanner/getDeviceScannedItems"];
const REACTIVE_SCANNED_DEVICE_DATA = store.dispatch.bind(store, "SatDeviceTrackerScanner/REACTIVE_SCANNED_DEVICE_DATA");

// ---------------------------
// Barcode Scanner Setup
// ---------------------------
const { initScanner, destroyScanner, hasListener } = useBarcodeScanner();

// Callback on barcode scan
function onBarcodeScanned(barcode) {
  tempTableData.value.push({
    device_type: "mPOS",
    serial_number: barcode
  });

  REACTIVE_SCANNED_DEVICE_DATA(tempTableData.value);
  console.log("Scanned:", barcode, tempTableData.value);
}

// ---------------------------
// Scanner Controls
// ---------------------------
function openScannerComp() {
  scannerToggleOption.value = true;
  if (!hasListener()) {
    initScanner(onBarcodeScanned);
  }
}

function closeScannerComp() {
  scannerToggleOption.value = false;
  destroyScanner();
}

// ---------------------------
// Remove Scanned Item
// ---------------------------
function removeScannedItem(item) {
  const updatedItems = getDeviceScannedItems.filter(i => i.serial_number !== item.serial_number);
  REACTIVE_SCANNED_DEVICE_DATA(updatedItems);
}
</script>

<style scoped>
.customTableClass {
  font-size: 0.9rem;
}

.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>
