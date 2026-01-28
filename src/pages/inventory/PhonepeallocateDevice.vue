<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row bottom-border q-px-md q-py-md items-center">
      <div class="col-6 col-sm-4 col-md-8 q-title text-weight-regular text-grey-9">
        Aggregator Allocate Device
      </div>
      <div class="col-md-4 text-right">
        <q-btn
          @click="$router.push('/inventory/PhonepeInventory')"
          outline
          label="Cancel Allocation"
          color="negative"
        />
      </div>
    </div>

    <!-- Selection -->
    <div class="row bottom-border group q-px-md q-py-md items-center text-weight-regular text-grey-9">
      <div class="col-md-2">
        <q-select
          v-model="formData.region"
          :options="regionOptions"
          float-label="Select Region"
          color="grey-9"
          :disable="formData.device_type != ''"
          :class="{ 'no-pointer-events': formData.device_type != '' }"
        />
      </div>

      <div class="col-md-2">
        <q-select
          v-model="formData.device_type"
          :options="deviceOptions"
          float-label="Select Device Type"
          color="grey-9"
          clearable
          :disable="formData.region === ''"
          @input="fnSetDevicesByDeviceId"
          @clear="fnClearingDeviceTypeSelection"
        />
      </div>

      <div class="col-12 col-lg-4 text-right">
        <q-btn
          v-if="scannerToggleOption"
          :disabled="!formData.device_type || !formData.region"
          color="light-blue"
          class="q-py-xs"
          label="Start scan"
          @click="openScannerComp"
        />
        <q-btn
          icon="shopping_cart"
          outline
          class="q-py-xs"
          label="Add to cart"
          @click="fnAllocateDeviceToRegion"
        />
      </div>
    </div>

    <!-- Scanned Items -->
    <div class="row text-weight-regular text-grey-9 q-mt-md">
      <div class="col" v-for="(item, index) in formData.scannedItems" :key="item.device.id">
        <q-card class="shadow-4"
          :style="{ border: formData.device_type.id === item.device.id ? '2px solid #61116a' : 'unset' }"
        >
          <q-list
            highlight
            separator
            class="q-pa-none"
            :class="{ activeDeviceTab: formData.device_type.id === item.device.id }"
          >
            <q-list-header style="border-bottom: 1px solid #ccc;">
              <q-icon :style="{ color: formData.device_type.id === item.device.id ? '#fff' : '#202c3f' }" name="fas fa-tablet-alt" />
              {{ item.device.deviceName }}
            </q-list-header>

            <q-scroll-area
              style="height:400px"
              :thumb-style="{ right: '4px', borderRadius: '5px', background: 'grey', width: '5px', opacity: 0.5 }"
              :delay="1500"
            >
              <div v-if="item.deviceSerialNumbers.length > 0">
                <q-item separator class="text-light-blue" v-for="(subItem, subIndex) in item.deviceSerialNumbers" :key="subIndex">
                  <q-item-section>{{ subItem }}</q-item-section>
                  <q-item-section side>
                    <q-btn round size="sm" color="negative" icon="clear"
                      @click="fnRemoveScannedItems(index, subIndex)" />
                  </q-item-section>
                </q-item>
              </div>
              <div v-else>
                <q-item>
                  <q-item-section>No data to display</q-item-section>
                  <q-item-section side>
                    <q-btn round size="sm" color="negative"
                      icon="clear"
                      @click="fnRemoveDeviceTypeFromList(index)" />
                  </q-item-section>
                </q-item>
              </div>
            </q-scroll-area>
          </q-list>
        </q-card>
      </div>
    </div>

    <!-- Modal -->
    <ShowPhonePePDOmodal
      v-if="showPhonePePDOmodal"
      :propshowPDOmodal="showPhonePePDOmodal"
      :propAllScannedItemArr="formData"
      @closeModel="fnAllocateDeviceToRegion"
    />
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import VueBarcodeScanner from "vue-barcode-scanner";
import ShowPhonePePDOmodal from "../../components/inventory/showPhonePePDOmodal.vue";

const $q = useQuasar();
const store = useStore();

VueBarcodeScanner.install();

// Reactive state
const scannerToggleOption = ref(true);
const showPhonePePDOmodal = ref(false);
const regionOptions = ref([]);
const deviceOptions = ref([]);

const formData = reactive({
  region: "",
  device_type: {},
  scannedItems: []
});

// Vuex getters - using computed properties for Vue 3
const getAllRegionsData = () => store.getters["InventoryCentral/getAllRegionsData"] || [];
const getCreatedActiveDeviceList = () => store.getters["superAdminAggregatorsDevice/getCreatedActiveDeviceList"] || [];

// Vuex actions
const FETCH_ALL_REGIONS_DATA = () => store.dispatch("InventoryCentral/FETCH_ALL_REGIONS_DATA");
const GET_ACTIVE_CREATED_DEVICE_LIST = () => store.dispatch("superAdminAggregatorsDevice/GET_ACTIVE_CREATED_DEVICE_LIST");

// Added missing action
const PHONE_PE_DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_ALLOCATION = (params) => 
  store.dispatch("InventoryCentral/PHONE_PE_DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_ALLOCATION", params);

// Fetch region options
async function fnAjaxGetAllRegionsData() {
  try {
    await FETCH_ALL_REGIONS_DATA();
    const regions = getAllRegionsData();
    regionOptions.value = regions.map(region => ({
      label: region.regionAreaName,
      value: region.id
    }));
  } catch (error) {
    console.error("Error fetching regions:", error);
    regionOptions.value = [];
    $q.notify({
      color: "negative",
      message: "Failed to load regions",
      icon: "error"
    });
  }
}

// Fetch device options
async function AggregatorsDeviceType() {
  try {
    await GET_ACTIVE_CREATED_DEVICE_LIST();
    const devices = getCreatedActiveDeviceList();
    deviceOptions.value = devices.map(dev => ({
      label: dev.deviceName,
      value: dev
    }));
  } catch (error) {
    console.error("Error fetching device types:", error);
    deviceOptions.value = [];
    $q.notify({
      color: "negative",
      message: "Failed to load device types",
      icon: "error"
    });
  }
}

// Set scanned items array for selected device
function fnSetDevicesByDeviceId() {
  scannerToggleOption.value = true;

  const exists = formData.scannedItems.find(item => item.device.id === formData.device_type.id);
  if (!exists) {
    formData.scannedItems.unshift({
      device: { id: formData.device_type.id, deviceName: formData.device_type.deviceName },
      deviceSerialNumbers: []
    });
  }
}

// Barcode scanned callback
async function onBarcodeScanned(barcode) {
  const scannedItem = formData.scannedItems.find(item => item.device.id === formData.device_type.id);
  
  if (!scannedItem) {
    $q.notify({
      color: "negative",
      message: "Please select a device type first",
      icon: "warning"
    });
    return;
  }
  
  const finalAssumption = scannedItem.deviceSerialNumbers.includes(barcode);

  if (!finalAssumption) {
    try {
      await PHONE_PE_DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_ALLOCATION({
        device: formData.device_type.id,
        barcode
      });
      
      scannedItem.deviceSerialNumbers.push(barcode);
      $q.notify({
        color: "positive",
        message: `Added ${barcode} to ${scannedItem.device.deviceName}`,
        icon: "check"
      });
    } catch (error) {
      console.error("Barcode validation error:", error);
      $q.notify({ 
        color: "negative", 
        message: `${barcode} is invalid`, 
        icon: "error" 
      });
    }
  } else {
    $q.notify({
      color: "warning",
      message: `${barcode} - already exists in ${scannedItem.device.deviceName}`,
      icon: "info"
    });
  }
}

// Open scanner
function openScannerComp() {
  if (!formData.device_type.id) {
    $q.notify({
      color: "warning",
      message: "Please select a device type first",
      icon: "warning"
    });
    return;
  }
  
  $q.notify({
    color: "positive",
    message: `Start scanning for ${formData.device_type.deviceName}`,
    icon: "camera_alt"
  });
  
  scannerToggleOption.value = false;
  if (!window.$barcodeScanner?.hasListener()) {
    window.$barcodeScanner?.init(onBarcodeScanned);
  }
}

// Remove scanned items
function fnRemoveScannedItems(index, subIndex) {
  formData.scannedItems[index].deviceSerialNumbers.splice(subIndex, 1);
}

// Remove entire device
function fnRemoveDeviceTypeFromList(index) {
  formData.scannedItems.splice(index, 1);
}

// Clear device type
function fnClearingDeviceTypeSelection() {
  formData.device_type = {};
  formData.scannedItems = [];
  scannerToggleOption.value = true;
  
  // Stop scanner if running
  if (window.$barcodeScanner?.hasListener()) {
    window.$barcodeScanner?.destroy();
  }
}

// Allocate device
function fnAllocateDeviceToRegion() {
  // Validate before showing modal
  if (!formData.region) {
    $q.notify({
      color: "negative",
      message: "Please select a region first",
      icon: "warning"
    });
    return;
  }
  
  if (formData.scannedItems.length === 0) {
    $q.notify({
      color: "negative",
      message: "Please scan at least one device",
      icon: "warning"
    });
    return;
  }
  
  showPhonePePDOmodal.value = !showPhonePePDOmodal.value;
}

// Lifecycle
onMounted(() => {
  fnAjaxGetAllRegionsData();
  AggregatorsDeviceType();
});
</script>

<style scoped>
.activeDeviceTab .q-list-header {
  border-bottom: 1px solid rgb(204, 204, 204);
  background: #61116a;
  color: #fff;
}

.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.q-list-header {
  padding: 12px;
  font-weight: 500;
  font-size: 1rem;
}

.q-item {
  padding: 8px 16px;
}

.q-scroll-area {
  border: 1px solid #e0e0e0;
  border-radius: 0 0 4px 4px;
}
</style>