<template>
  <q-page>
    <div>
      <div class="row bottom-border q-px-md q-py-md items-center">
        <!--START: table title -->
        <div
          class="col-6 col-sm-4 col-md-8 q-title text-weight-regular text-grey-9"
        >
          Aggregator Allocate To So
        </div>
        <div class="col-md-12 col-md-6 q-pt-md group" align="right">
          <q-btn
            @click="$router.push('/inventory/PhonepeInventory')"
            outline
            label="Cancel Allocation"
            color="negative"
          />
        </div>
        <div class="col-6 col-sm-8 col-md-4" align="right"></div>
        <!--END: table title -->
      </div>

      <div
        class="row bottom-border group q-px-md q-py-md items-center text-weight-regular text-grey-9"
      >
        <!--START: table title -->
        <div class="col-md-2">
          <q-select
            :disable="formData.device_type.id != ''"
            v-model="formData.region"
            label="Select Region"
            color="grey-9"
            :options="regionOptions"
            @update:model-value="regionBasedSoLoad"
            emit-value
            map-options
          />
        </div>
        <div class="col-md-2">
          <q-select
            :disable="formData.region === ''"
            v-model="formData.so"
            label="Select SO"
            color="grey-9"
            :options="regionBasedSo"
            emit-value
            map-options
            clearable
            @clear="formData.so = ''"
          />
        </div>
        <div class="col-md-2">
          <q-select
            :disable="formData.region === ''"
            v-model="formData.device_type"
            label="Select Device Type"
            color="grey-9"
            :options="deviceOptions"
            emit-value
            map-options
            clearable
            @update:model-value="fnSetDevicesByDeviceId"
            @clear="fnClearingDeviceTypeSelection"
          />
        </div>

        <div class="col-12 col-lg-4 group" align="right">
          <q-btn
            :disable="formData.device_type === '' || formData.region === ''"
            @click="openScannerComp"
            v-if="scannerToggleOption"
            color="light-blue"
            class="q-py-xs"
            label="Start scan"
          />
          <q-btn
            icon="shopping_cart"
            outline
            class="q-py-xs"
            label="Add to cart"
            @click="fnAllocateDeviceToRegion"
          />
        </div>
        <!--END: table title -->
      </div>

      <div class="row text-weight-regular text-grey-9">
        <div
          class="col group"
          v-for="(item, index) in formData.scannedItems"
          :key="index"
        >
          <q-card
            class="shadow-4"
            :style="
              formData.device_type && item.device.id === formData.device_type.id
                ? 'border: 2px solid #61116a'
                : 'border: unset'
            "
          >
            <q-list
              separator
              class="q-pa-none"
              :class="[
                formData.device_type && item.device.id === formData.device_type.id
                  ? 'activeDeviceTab'
                  : ''
              ]"
            >
              <q-item class="bg-primary text-white" style="border-bottom: 1px solid #ccc;">
                <q-item-section>
                  <div class="row items-center">
                    <q-icon name="fas fa-tablet-alt" class="q-mr-sm" />
                    {{ item.device.deviceName }}
                  </div>
                </q-item-section>
              </q-item>
              <q-scroll-area
                style="height:400px"
                :thumb-style="{
                  right: '4px',
                  borderRadius: '5px',
                  background: 'grey',
                  width: '5px',
                  opacity: 0.5
                }"
                :delay="1500"
              >
                <div v-if="item.deviceSerialNumbers.length > 0">
                  <q-item
                    v-for="(subItem, subIndex) in item.deviceSerialNumbers"
                    :key="subIndex"
                    class="text-light-blue"
                  >
                    <q-item-section>
                      {{ subItem }}
                    </q-item-section>
                    <q-item-section side>
                      <q-btn
                        round
                        size="sm"
                        color="negative"
                        icon="clear"
                        @click="fnRemoveScannedItems(index, subIndex)"
                      />
                    </q-item-section>
                  </q-item>
                </div>
                <div v-else>
                  <q-item>
                    <q-item-section>
                      No data to display
                    </q-item-section>
                    <q-item-section side>
                      <q-btn
                        round
                        size="sm"
                        color="negative"
                        @click="fnRemoveDeviceTypeFromList(index)"
                        icon="clear"
                      />
                    </q-item-section>
                  </q-item>
                </div>
              </q-scroll-area>
            </q-list>
          </q-card>
        </div>
      </div>

      <!--START: Open showPDOmodal model -->
      <showAggregatorsPDORegionBasedSo
        v-if="showPDORegionBasedSo"
        :propshowRegionBasedSo="showPDORegionBasedSo"
        :propAllScannedItemArr="formData"
        @closeModel="fnAllocateDeviceToRegion"
      />
      <!--END: Open showPDOmodal model -->
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';
import showAggregatorsPDORegionBasedSo from "../../components/inventory/showAggregatorsPDORegionBasedSo.vue";

const $q = useQuasar();
const store = useStore();

// Reactive state
const scannerToggleOption = ref(true);
const showPDORegionBasedSo = ref(false);
const regionOptions = ref([]);
const deviceOptions = ref([]);
const regionBasedSo = ref([]);

const formData = reactive({
  region: '',
  device_type: '',
  so: '',
  scannedItems: []
});


const getAllRegionsData = computed(() => 
  store.getters["InventoryCentral/getAllRegionsData"]
);
const getRegionBasedSO = computed(() => 
  store.getters["InventoryCentral/getRegionBasedSO"]
);
const getCreatedActiveDeviceList = computed(() => 
  store.getters["superAdminAggregatorsDevice/getCreatedActiveDeviceList"]
);

// Lifecycle hooks
onMounted(() => {
  fnAjaxGetAllRegionsData();
  fnPhonepeDeviceDetails();
});

onUnmounted(() => {
  if (window.barcodeScanner) {
    window.barcodeScanner.destroy();
  }
});

// Methods
const fnPhonepeDeviceDetails = async () => {
  try {
    await store.dispatch("superAdminAggregatorsDevice/GET_ACTIVE_CREATED_DEVICE_LIST");
    const cookedArr = getCreatedActiveDeviceList.value.map(item => ({
      value: item.id,
      label: item.deviceName,
      ...item
    }));
    deviceOptions.value = cookedArr;
  } catch (error) {

    console.error("Error fetching device details:", error);
    $q.notify({
      color: 'negative',
      message: 'Failed to load device types'
    });
  }
};

const fnSetDevicesByDeviceId = () => {
  scannerToggleOption.value = true;
  
  if (window.barcodeScanner) {
    window.barcodeScanner.destroy();
  }

  if (!formData.device_type) return;

  const selectedDevice = deviceOptions.value.find(d => d.value === formData.device_type);
  if (!selectedDevice) return;

  const predictIfDeviceExist = formData.scannedItems.find(
    item => item.device.id === selectedDevice.id
  );

  if (!predictIfDeviceExist) {
    formData.scannedItems.unshift({
      device: {
        deviceName: selectedDevice.deviceName,
        id: selectedDevice.id
      },
      deviceSerialNumbers: []
    });
  }
};

const onBarcodeScanned = async (barcode) => {
  if (!formData.device_type) return;

  const selectedDevice = deviceOptions.value.find(d => d.value === formData.device_type);
  if (!selectedDevice) return;

  const deviceItem = formData.scannedItems.find(
    item => item.device.id === selectedDevice.id
  );

  if (!deviceItem) return;

  if (deviceItem.deviceSerialNumbers.includes(barcode)) {
    $q.notify({
      color: 'warning',
      message: 'Barcode already scanned'
    });
    return;
  }

  try {
    await store.dispatch("VerifyDevice/PHONE_PE_DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_ALLOCATION", {
      device: selectedDevice.id,
      barcode: barcode
    });
    
    deviceItem.deviceSerialNumbers.push(barcode);
    $q.notify({
      color: 'positive',
      message: 'Device scanned successfully'
    });
  } catch (error) {

    console.error("Barcode scan error:", error);
    $q.notify({
      color: 'negative',
      message: `${barcode} is invalid or already allocated`
    });
  }
};

const openScannerComp = () => {
  if (!formData.device_type) {
    $q.notify({
      color: 'warning',
      message: 'Please select a device type first'
    });
    return;
  }

  const selectedDevice = deviceOptions.value.find(d => d.value === formData.device_type);
  
  $q.notify({
    color: 'positive',
    message: `Start scanning for ${selectedDevice?.label || 'selected device'}`
  });

  scannerToggleOption.value = false;

  // Initialize barcode scanner
  if (typeof BarcodeDetector !== 'undefined') {
    initializeNativeBarcodeScanner();
  } else {
    initializeFallbackScanner();
  }
};

const initializeNativeBarcodeScanner = () => {
  const barcodeDetector = new BarcodeDetector();
  
  // Request camera access and set up video stream
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => {
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      const detectBarcode = () => {
        barcodeDetector.detect(video)
          .then(barcodes => {
            if (barcodes.length > 0) {
              onBarcodeScanned(barcodes[0].rawValue);
            }
            requestAnimationFrame(detectBarcode);
          })
          .catch(console.error);
      };
      
      video.onplaying = () => {
        detectBarcode();
      };
      
      // Store for cleanup
      window.barcodeScanner = {
        destroy: () => {
          stream.getTracks().forEach(track => track.stop());
          video.remove();
        },
        video,
        stream
      };
    })
    .catch(error => {
      console.error('Camera access error:', error);
      initializeFallbackScanner();
    });
};

const initializeFallbackScanner = () => {
  // Create a simulated barcode scanner input
  const input = document.createElement('input');
  input.type = 'text';
  input.style.position = 'fixed';
  input.style.top = '-100px';
  input.style.left = '-100px';
  document.body.appendChild(input);
  
  input.focus();
  
  let barcode = '';
  let lastTime = Date.now();
  
  const handleKeyPress = (e) => {
    const currentTime = Date.now();
    
    if (currentTime - lastTime > 100) {
      barcode = '';
    }
    
    if (e.key === 'Enter') {
      if (barcode.length > 0) {
        onBarcodeScanned(barcode);
        barcode = '';
      }
      e.preventDefault();
    } else {
      barcode += e.key;
    }
    
    lastTime = currentTime;
  };
  
  window.addEventListener('keypress', handleKeyPress);
  
  // Store for cleanup
  window.barcodeScanner = {
    destroy: () => {
      window.removeEventListener('keypress', handleKeyPress);
      input.remove();
    }
  };
};

const fnRemoveScannedItems = (index, subIndex) => {
  formData.scannedItems[index].deviceSerialNumbers.splice(subIndex, 1);
  
  // Remove the device if no serial numbers left
  if (formData.scannedItems[index].deviceSerialNumbers.length === 0) {
    formData.scannedItems.splice(index, 1);
  }
};

const fnAllocateDeviceToRegion = () => {
  if (formData.scannedItems.length === 0) {
    $q.notify({
      color: 'warning',
      message: 'Please scan at least one device before allocating'
    });
    return;
  }
  
  if (!formData.so) {
    $q.notify({
      color: 'warning',
      message: 'Please select an SO before allocating'
    });
    return;
  }
  
  showPDORegionBasedSo.value = !showPDORegionBasedSo.value;
};

const fnAjaxGetAllRegionsData = async () => {
  try {
    await store.dispatch("InventoryCentral/FETCH_ALL_REGIONS_DATA");
    const cookedArr = getAllRegionsData.value.map(item => ({
      value: item.id,
      label: item.regionAreaName,
      ...item
    }));
    regionOptions.value = cookedArr;
  } catch (error) {

    console.error("Error fetching regions:", error);
    regionOptions.value = [];
    $q.notify({
      color: 'negative',
      message: 'Failed to load regions'
    });
  }
};

const regionBasedSoLoad = async () => {
  if (!formData.region) return;
  
  try {
    await store.dispatch("InventoryCentral/FETCH_REGION_BASED_SO", formData.region);
    const cookedArr = getRegionBasedSO.value.map(item => ({
      value: item.id,
      label: `${item.name} | ${item.employeeID} | ${item.email}`,
      ...item
    }));
    regionBasedSo.value = cookedArr;
  } catch (error) {

    console.error("Error fetching region-based SO:", error);
    regionBasedSo.value = [];
    $q.notify({
      color: 'negative',
      message: 'Failed to load SO list for this region'
    });
  }
};

const fnRemoveDeviceTypeFromList = (index) => {
  formData.scannedItems.splice(index, 1);
};

const fnClearingDeviceTypeSelection = () => {
  formData.device_type = '';
  formData.scannedItems = [];
  scannerToggleOption.value = true;
  
  if (window.barcodeScanner) {
    window.barcodeScanner.destroy();
    window.barcodeScanner = null;
  }
};
</script>

<style scoped>
.activeDeviceTab .q-item {
  border-bottom: 1px solid rgb(204, 204, 204);
  background: #61116a;
  color: #fff;
}

.q-card {
  margin: 8px;
}

.group {
  padding: 4px;
}

.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.q-title {
  font-size: 1.5rem;
  line-height: 2rem;
}

@media (max-width: 600px) {
  .col {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>