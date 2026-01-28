<template>
  <q-page>
    <!-- Page Header -->
    <div class="row bottom-border q-px-md q-py-md items-center">
      <div class="col-md-8 q-title text-weight-regular text-grey-9">
        Add New Devices - Scan & Upload
      </div>
      <div class="col-md-4 col-sm-12 col-xs-12 q-title text-weight-regular text-grey-9" align="right">
        <q-btn
          @click="$router.push('/inventory/central')"
          outline
          label="Go Back"
          color="black"
        />
      </div>
    </div>

    <!-- Controls: Device Type, Scan Buttons, Upload -->
    <div class="row bottom-border q-px-md q-py-md items-center text-weight-regular text-grey-9">
      <div class="col-md-4">
        <q-select
          v-model="formData.device_type"
          float-label="Select Device Type"
          color="grey-9"
          :options="deviceOptions"
        />
      </div>

      <div class="col-md-3 text-center">
        <q-btn
          v-if="!scannerToggleOption"
          @click="openScannerComp"
          color="light-blue"
          class="q-py-xs"
          label="Start Scan"
        />
        <q-btn
          v-if="scannerToggleOption"
          @click="closeScannerComp"
          color="negative"
          class="q-py-xs"
          label="Stop Scan"
        />
      </div>

      <div class="col-md-5 text-right">
        <q-btn
          class="common-btn q-py-xs"
          label="Upload"
          @click="finalSubmit"
        />
      </div>
    </div>

    <!-- Scanned Devices Table -->
    <q-table
      :data="getAddDeviceScannedItems"
      :columns="columnData"
      table-class="customTableClass shadow-0"
      :filter="filterSearch"
      v-model:pagination="paginationControl"
      row-key="index"
      :loading="tableAjaxLoading"
      color="light-blue"
    >
      <!-- Action column -->
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            @click="removeScannedItems(props.row)"
            label="Remove"
            icon="close"
            color="red-6"
            size="sm"
          />
        </q-td>
      </template>

      <!-- Top slot: Search -->
      <template v-slot:top>
        <div class="col-md-5">
          <q-search
            clearable
            color="grey-9"
            v-model="filterSearch"
            placeholder="Type.."
            float-label="Search .."
            class="q-mr-lg q-py-sm"
          />
        </div>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import { useBarcodeScanner } from 'vue-barcode-scanner';

// Initialize Vue Barcode Scanner
const $q = useQuasar();
const store = useStore();
const barcodeScanner = VueBarcodeScanner;

// Reactive state
const scannerToggleOption = ref(false);
const filterSearch = ref('');
const tableAjaxLoading = ref(false);

const deviceOptions = [
  { value: 1, label: 'mGPRS' },
  { value: 2, label: 'GPRS' },
  { value: 3, label: 'mPOS' }
];

// Table columns
const columnData = [
  { name: 'device_type', label: 'Device Type', align: 'left', field: 'device_type', sortable: true },
  { name: 'serial_number', label: 'Serial Number', align: 'left', field: 'serial_number', sortable: true },
  { name: 'action', label: '', align: 'left', field: 'action' }
];

// Reactive form data
const formData = reactive({
  devices: [],
  device_type: ''
});

// Pagination
const paginationControl = reactive({
  rowsPerPage: 10
});

// Temp scanned data
const tempTableData = ref([]);

// Getters
const getAddDeviceScannedItems = computed(() => store.getters['InventoryScanAddDevice/getAddDeviceScannedItems']);

// Actions
const { REACTIVE_ADD_SCANNED_DEVICE_DATA } = store.dispatch ? store.dispatch('InventoryScanAddDevice', {}) : {};

// Barcode scan callback
function onBarcodeScanned(barcode) {
  tempTableData.value.push({
    device_type: formData.device_type || 'mPOS',
    serial_number: barcode
  });
  REACTIVE_ADD_SCANNED_DEVICE_DATA(tempTableData.value);
  console.log('Scanned Devices:', tempTableData.value);
}

// Open scanner
function openScannerComp() {
  $q.notify({ color: 'positive', position: 'bottom', message: 'Scan mode activated!', icon: 'search' });
  scannerToggleOption.value = true;

  if (!barcodeScanner.hasListener()) {
    barcodeScanner.init(onBarcodeScanned);
  }
}

// Close scanner
function closeScannerComp() {
  $q.notify({ color: 'negative', position: 'bottom', message: 'Scan mode deactivated!', icon: 'close' });
  scannerToggleOption.value = false;
  barcodeScanner.destroy();
}

// Remove scanned item
function removeScannedItems(item) {
  const index = getAddDeviceScannedItems.value.indexOf(item);
  if (index > -1) {
    getAddDeviceScannedItems.value.splice(index, 1);
    REACTIVE_ADD_SCANNED_DEVICE_DATA(getAddDeviceScannedItems.value);
  }
}

// Final submit
function finalSubmit() {
  $q.notify({ color: 'positive', position: 'bottom', message: 'Devices are added successfully!', icon: 'thumb_up' });
}
</script>

<style scoped>
.common-btn {
  background-color: #61116a;
  color: white;
}

.customTableClass {
  border-radius: 4px;
}
</style>
