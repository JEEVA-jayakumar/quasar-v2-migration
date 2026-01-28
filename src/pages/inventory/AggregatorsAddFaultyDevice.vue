<template>
  <!-- CHANGE: q-modal to q-dialog -->
  <q-dialog
    v-model="toggleModal"
    fullscreen
    persistent
  >
    <q-card style="padding: 50px 5px; height: 100vh">
      <!-- Header -->
      <div class="row items-center q-pa-md text-weight-regular bottom-border text-grey-9">
        <div class="col q-title">Lead Details Faulty</div>
        <div class="col-auto">
          <q-btn round outline color="dark" icon="clear" @click="$emit('emitRefreshList')" />
        </div>
      </div>

      <div class="q-pa-sm group">
        <!-- Device Selection & Buttons -->
        <div class="row items-center">
          <div class="col-12 col-lg-6">
            <q-select
              clearable
              :disable="!formData.region"
              v-model="formData.device_type"
              label="Select Device Type"
              color="grey-9"
              :options="deviceOptions"
              @update:model-value="fnSetDevicesByDeviceId"
              @clear="fnClearingDeviceTypeSelection"
              emit-value
              map-options
            />
          </div>
          <div class="col-12 col-lg-6 group text-right">
            <q-btn
              v-if="scannerToggleOption"
              :disabled="!formData.device_type"
              color="light-blue"
              label="Start scan"
              @click="openScannerComp"
            />
            <q-btn
              color="amber-9"
              class="q-py-xs"
              :disable="formData.scannedItems.length === 0"
              label="Send to repair"
              @click="toggleDamagedDevices"
            />
          </div>
        </div>

        <!-- Scanned Items List -->
        <div class="row text-weight-regular text-grey-9">
          <div class="col" v-for="(item, index) in formData.scannedItems" :key="item.device.id">
            <q-card class="shadow-4 q-mb-md">
              <q-list highlight separator>
                <q-list-header style="border-bottom: 1px solid #ccc;">
                  <q-icon name="fas fa-tablet-alt" style="color:#202c3f" />
                  {{ item.device.deviceName }}
                </q-list-header>

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
                  <div v-if="item.deviceSerialNumbers.length">
                    <q-item
                      v-for="(subItem, subIndex) in item.deviceSerialNumbers"
                      :key="subIndex"
                      separator
                      class="text-light-blue"
                    >
                      <q-item-section>{{ subItem }}</q-item-section>
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
                      <q-item-section>No data to display</q-item-section>
                      <q-item-section side>
                        <q-btn
                          round
                          size="sm"
                          color="negative"
                          icon="clear"
                          @click="fnRemoveDeviceTypeFromList(index)"
                        />
                      </q-item-section>
                    </q-item>
                  </div>
                </q-scroll-area>
              </q-list>
            </q-card>
          </div>
        </div>
      </div>
    </q-card>

    <!-- Repair Confirmation Modal -->
    <showRepairConfirmation
      v-if="showRepairModal"
      :showRepairModal="showRepairModal"
      :propAllScannedItemArr="formData"
      @closeModel="clearAfterSubmit"
    />
  </q-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, watch } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import showRepairConfirmation from "./showRepairConfirmation.vue";

// Note: VueBarcodeScanner might need Vue 3 compatible version
// If not available, you may need to find an alternative or custom implementation
// import VueBarcodeScanner from "vue-barcode-scanner";

const store = useStore();
const $q = useQuasar();

const props = defineProps({
  faultyInventoryComponent: Boolean
});

const emit = defineEmits(["emitRefreshList"]);

const toggleModal = ref(props.faultyInventoryComponent);
const scannerToggleOption = ref(true);
const showRepairModal = ref(false);

const formData = reactive({
  region: null, // Set your region here if needed
  device_type: null,
  scannedItems: []
});

const deviceOptions = ref([]);

// Watch prop to sync modal
watch(() => props.faultyInventoryComponent, (val) => {
  toggleModal.value = val;
});

// Fetch all device types
const fnAjaxGetAllDevicesTypesData = async () => {
  try {
    await store.dispatch("InventoryCentral/FETCH_ALL_INVENTORY_DEVICES_TYPES_DATA");
    const devices = store.getters["InventoryCentral/getAllInventoryDevicesTypesData"] || [];
    deviceOptions.value = devices.map(d => ({ 
      label: d.deviceName, 
      value: d,
      id: d.id 
    }));
  } catch (error) {
    console.error("Fetch devices error:", error);
    deviceOptions.value = [];
  }
};

// Set selected device type
const fnSetDevicesByDeviceId = () => {
  scannerToggleOption.value = true;
  // Remove previous barcode listeners if any
  if (window.$barcodeScanner) window.$barcodeScanner.destroy();

  const exists = formData.scannedItems.find(item => item.device.id === formData.device_type?.id);
  if (!exists && formData.device_type) {
    formData.scannedItems.unshift({
      device: { 
        deviceName: formData.device_type.deviceName || formData.device_type.label, 
        id: formData.device_type.id || formData.device_type.value?.id 
      },
      deviceSerialNumbers: []
    });
  }
};

// Open scanner
const openScannerComp = () => {
  if (!formData.device_type) return;
  
  $q.notify({
    color: "positive",
    position: "bottom",
    message: `Start scanning for ${formData.device_type.deviceName || formData.device_type.label}`,
    icon: "list"
  });
  scannerToggleOption.value = false;

  // Initialize barcode scanner if available
  if (window.$barcodeScanner && !window.$barcodeScanner?.hasListener?.()) {
    window.$barcodeScanner.init(onBarcodeScanned);
  }
};

// Barcode callback
const onBarcodeScanned = async (barcode) => {
  const deviceId = formData.device_type?.id || formData.device_type?.value?.id;
  if (!deviceId) return;

  const item = formData.scannedItems.find(i => i.device.id === deviceId);
  if (!item) return;

  if (item.deviceSerialNumbers.includes(barcode)) {
    $q.notify({
      color: "primary",
      position: "bottom",
      message: `${barcode} - already exists in ${item.device.deviceName}`,
      icon: "info"
    });
    return;
  }

  try {
    await store.dispatch("VerifyDevice/DEVICE_VERIFICATION_IN_CENTRAL_FOR_ACTIVE", {
      device: deviceId,
      barcode
    });
    item.deviceSerialNumbers.push(barcode);
  } catch (error) {
    console.error("Barcode verification error:", error);
    $q.notify({
      color: "primary",
      position: "bottom",
      message: `${barcode} is invalid`,
      icon: "info"
    });
  }
};

// Remove scanned item
const fnRemoveScannedItems = (index, subIndex) => {
  formData.scannedItems[index].deviceSerialNumbers.splice(subIndex, 1);
};

// Remove entire device type
const fnRemoveDeviceTypeFromList = (index) => {
  formData.scannedItems.splice(index, 1);
};

// Clear device selection
const fnClearingDeviceTypeSelection = () => {
  formData.device_type = null;
  formData.scannedItems = [];
};

// Toggle repair modal
const toggleDamagedDevices = () => {
  showRepairModal.value = !showRepairModal.value;
};

// Clear after repair submission
const clearAfterSubmit = () => {
  toggleDamagedDevices();
  formData.device_type = null;
  formData.scannedItems = [];
};

// Lifecycle hooks
onMounted(() => {
  fnAjaxGetAllDevicesTypesData();
  // Initialize barcode scanner if needed
  // if (!window.$barcodeScanner) window.$barcodeScanner = VueBarcodeScanner;
});

onBeforeUnmount(() => {
  if (window.$barcodeScanner && window.$barcodeScanner.destroy) {
    window.$barcodeScanner.destroy();
  }
});
</script>

<style scoped>
.group {
  margin-bottom: 1rem;
}
.q-scrollarea__thumb {
  background-color: grey !important;
  opacity: 0.5 !important;
}
.bottom-border {
  border-bottom: 1px solid #ddd;
}
.q-title {
  font-size: 1.5rem;
  font-weight: 500;
}
</style>