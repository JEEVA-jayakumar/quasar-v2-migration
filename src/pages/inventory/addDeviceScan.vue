<template>
  <q-page>
    <!-- Page Header -->
    <div class="row bottom-border q-px-md q-py-md items-center">
      <div class="col-md-8 q-title text-weight-regular text-grey-9">
        Bijlipay Add New Devices - Scan & Upload
      </div>
      <div class="col-md-12 col-md-6 q-pt-md group" align="right">
        <q-btn
          @click="$router.push('/inventory/central')"
          outline
          label="Cancel Allocation"
          color="negative"
        />
      </div>
    </div>

    <!-- Controls: Device Type, Invoice, Scan/Upload Buttons -->
    <div class="row bottom-border q-px-md q-py-md items-center text-weight-regular text-grey-9">
      <div class="col" ref="clickHeretoStartParent">
        <q-select
          ref="clickHeretoStartChild"
          @input="disableDeviceTypeSelection"
          v-model="formData.device.id"
          :disable="tempTableData.length > 0"
          float-label="Select Device Type"
          color="grey-9"
          :options="deviceOptions"
        />
      </div>

      <div class="col q-ml-md">
        <q-input
          type="text"
          v-model="formData.invoiceNumber"
          :disable="tempTableData.length > 0"
          float-label="Invoice Number"
          color="grey-9"
          @blur="v$.formData.invoiceNumber.$touch()"
          :error="v$.formData.invoiceNumber.$error"
        />
      </div>

      <div class="col group" align="right">
        <q-btn
          v-if="scanningActive"
          :disabled="!isScanButtonEnabled"
          color="primary"
          label="Start scan"
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

    <!-- Scanned Devices Table -->
    <q-table
      :data="tempTableData"
      :columns="columnData"
      table-class="customTableClass shadow-0"
      :filter="filterSearch"
      v-model:pagination="paginationControl"
      row-key="index"
      :loading="tableAjaxLoading"
      color="light-blue"
    >
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            @click="removeScannedItem(props.row)"
            label="Remove"
            icon="close"
            color="red-6"
            size="sm"
          />
        </q-td>
      </template>

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
import { ref, reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useBarcodeScanner } from 'vue-barcode-scanner';
import _ from 'lodash';

// Quasar and Vuex
const $q = useQuasar();
const store = useStore();

// Reactive state
const filterSearch = ref('');
const scanningActive = ref(true);
const tempTableData = ref([]);
const tableAjaxLoading = ref(false);
const deviceOptions = ref([]);
const formData = reactive({
  device: { id: '' },
  invoiceNumber: '',
  deviceSerialNumbers: []
});

// Vuelidate setup
const rules = {
  formData: {
    invoiceNumber: { required }
  }
};
const v$ = useVuelidate(rules, { formData });

// Table columns
const columnData = [
  { name: 'deviceSerialNumbers', label: 'Serial Number', align: 'left', field: 'deviceSerialNumbers', sortable: true },
  { name: 'action', label: '', align: 'left', field: 'action' }
];

// Pagination
const paginationControl = reactive({ rowsPerPage: 10 });

// Getters
const getAllInventoryDevicesTypesData = computed(
  () => store.getters['InventoryScanAddDevice/getAllInventoryDevicesTypesData']
);

// Vuex Actions - Add this section
const VERIFY_DEVICE_BEFORE_ADDING_CENTRAL_INVENTORY = (payload) => 
  store.dispatch('VerifyDevice/VERIFY_DEVICE_BEFORE_ADDING_CENTRAL_INVENTORY', payload);

const FEED_DEVICE_SCAN_BY_ID_DATA = (payload) => 
  store.dispatch('InventoryScanAddDevice/FEED_DEVICE_SCAN_BY_ID_DATA', payload);

// Computed for enabling scan button
const isScanButtonEnabled = computed(() => formData.device.id !== '' && formData.invoiceNumber.trim() !== '');


// Populate device types on mounted
onMounted(async () => {
  deviceOptions.value = getAllInventoryDevicesTypesData.value.map(d => ({ label: d.deviceName, value: d.id }));
});

// Disable device type selection after scanning
function disableDeviceTypeSelection() {
  scanningActive.value = true;
  VueBarcodeScanner.destroy();
}

// Start scanner
function startScanner() {
  VueBarcodeScanner.init(onBarcodeScanned);
  scanningActive.value = false;
}

// Barcode scanned callback
function onBarcodeScanned(barcode) {
  const duplicate = _.find(tempTableData.value, o => o.deviceSerialNumbers === barcode);
  if (!duplicate) {
    VERIFY_DEVICE_BEFORE_ADDING_CENTRAL_INVENTORY({
      device: formData.device.id,
      barcode
    })
      .then(() => {
        tempTableData.value.push({ deviceSerialNumbers: barcode });
      })
      .catch(() => {
        $q.notify({
          color: 'primary',
          position: 'bottom',
          message: `${barcode} - device already available in the inventory`,
          icon: 'info'
        });
      });
  } else {
    $q.notify({
      color: 'primary',
      position: 'bottom',
      message: `${barcode} - device already scanned`,
      icon: 'info'
    });
  }
}

// Remove scanned item
function removeScannedItem(item) {
  const index = tempTableData.value.indexOf(item);
  if (index > -1) {
    tempTableData.value.splice(index, 1);
    if (tempTableData.value.length === 0) scanningActive.value = true;
  }
}

// Final submit scanned devices
function finalSubmit() {
  formData.deviceSerialNumbers = tempTableData.value.map(v => v.deviceSerialNumbers);
  const param = {
    request: { device: formData.device, deviceSerialNumbers: formData.deviceSerialNumbers },
    invoiceNumber: formData.invoiceNumber
  };

  FEED_DEVICE_SCAN_BY_ID_DATA(param)
    .then(() => {
      $q.notify({ color: 'positive', position: 'bottom', message: 'Devices are added successfully!', icon: 'thumb_up' });
      $q.router.push('/inventory/central');
    })
    .catch(() => {
      $q.notify({ color: 'negative', position: 'bottom', message: 'Error in updating devices!', icon: 'thumb_down' });
    });
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

.disabled {
  opacity: 0.5;
}
</style>