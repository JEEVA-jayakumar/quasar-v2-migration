<template>
  <q-page class="q-pa-md">

    <!-- Header -->
    <div class="row items-center text-weight-regular bottom-border text-grey-9 q-pa-md">
      <div class="col-md-8 q-title">Bijlipay Faulty Device</div>
      <div class="col-md-12 col-md-6 q-pt-md text-right">
        <q-btn
          @click="$router.push('/inventory/central')"
          outline
          label="Cancel Allocation"
          color="negative"
        />
      </div>
    </div>

    <!-- Device Selection & Actions -->
    <div class="q-pa-sm">
      <div class="row items-center">

        <!-- Device Type Select -->
        <div class="col-12 col-lg-6">
          <q-select
            v-model="formData.device_type"
            :options="deviceOptions"
            clearable
            @clear="fnClearingDeviceTypeSelection"
            @update:model-value="fnSetDevicesByDeviceId"
            float-label="Select Device Type"
            color="grey-9"
          />
        </div>

        <!-- Actions -->
        <div class="col-12 col-lg-6 text-right">
          <q-btn
            v-if="scannerToggleOption"
            :disabled="!formData.device_type"
            @click="openScannerComp"
            color="light-blue"
            label="Start scan"
          />
          <q-btn
            :disable="formData.scannedItems.length === 0"
            color="amber-9"
            class="q-ml-sm"
            @click="toggleDamagedDevices"
            label="Send to repair"
          />
        </div>
      </div>

      <!-- Scanned Items List -->
      <div class="row text-weight-regular text-grey-9 q-mt-md">
        <div class="col" v-for="(item, index) in formData.scannedItems" :key="index">
          <q-card class="shadow-4 q-mb-md">
            <q-list separator highlight>

              <!-- Device Name Header -->
              <q-list-header style="border-bottom: 1px solid #ccc;">
                <q-icon name="tablet_mac" style="color:#202c3f;" />
                {{ item.device.deviceName }}
              </q-list-header>

              <!-- Scrollable Serial Numbers -->
              <q-scroll-area
                style="height: 400px;"
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

    <!-- Repair Confirmation Modal -->
    <showRepairConfirmation
      v-if="showRepairModal"
      :showRepairModal="showRepairModal"
      :propAllScannedItemArr="formData"
      @closeModel="clearAfterSubmit"
    />
    
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import showRepairConfirmation from "./showRepairConfirmation.vue";
import VueBarcodeScanner from "vue-barcode-scanner";

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();

// Reactive State
const scannerToggleOption = ref(true);
const showRepairModal = ref(false);
const deviceOptions = ref([]);
const formData = ref({
  device_type: null,
  scannedItems: []
});

// Barcode Scanner Setup
onMounted(() => {
  if (!VueBarcodeScanner.installed) {
    VueBarcodeScanner.install();
  }
  fnAjaxGetAllDevicesTypesData();
});

onBeforeUnmount(() => {
  if (window.$barcodeScanner) window.$barcodeScanner.destroy();
});

// Methods

// Set devices in scannedItems based on selected device type
const fnSetDevicesByDeviceId = () => {
  scannerToggleOption.value = true;

  const exists = formData.value.scannedItems.find(
    item => item.device.id === formData.value.device_type.id
  );

  if (!exists) {
    formData.value.scannedItems.unshift({
      device: {
        deviceName: formData.value.device_type.deviceName,
        id: formData.value.device_type.id
      },
      deviceSerialNumbers: []
    });
  }
};

// Open barcode scanner
const openScannerComp = () => {
  $q.notify({
    color: "positive",
    position: "bottom",
    message: `Start scanning for ${formData.value.device_type.deviceName}`,
    icon: "list"
  });
  scannerToggleOption.value = false;

  if (!window.$barcodeScanner?.hasListener()) {
    window.$barcodeScanner?.init(onBarcodeScanned);
  }
};

// Handle scanned barcode
const onBarcodeScanned = (barcode) => {
  const selectedDevice = formData.value.scannedItems.find(
    item => item.device.id === formData.value.device_type.id
  );

  if (!selectedDevice.deviceSerialNumbers.includes(barcode)) {
    store.dispatch("VerifyDevice/DEVICE_VERIFICATION_IN_CENTRAL_FOR_ACTIVE", {
      device: formData.value.device_type.id,
      barcode
    })
      .then(() => {
        selectedDevice.deviceSerialNumbers.push(barcode);
      })
      .catch(() => {
        $q.notify({
          color: "primary",
          position: "bottom",
          message: `${barcode} is invalid`,
          icon: "info"
        });
      });
  } else {
    $q.notify({
      color: "primary",
      position: "bottom",
      message: `${barcode} already exists in ${formData.value.device_type.deviceName}`,
      icon: "info"
    });
  }
};

// Remove a scanned item
const fnRemoveScannedItems = (index, subIndex) => {
  formData.value.scannedItems[index].deviceSerialNumbers.splice(subIndex, 1);
};

// Remove an entire device from scannedItems
const fnRemoveDeviceTypeFromList = (index) => {
  formData.value.scannedItems.splice(index, 1);
};

// Clear device selection
const fnClearingDeviceTypeSelection = () => {
  formData.value.device_type = null;
  formData.value.scannedItems = [];
};

// Toggle repair modal
const toggleDamagedDevices = () => {
  showRepairModal.value = !showRepairModal.value;
};

// Clear after submission
const clearAfterSubmit = () => {
  toggleDamagedDevices();
  formData.value.device_type = null;
  formData.value.scannedItems = [];
};

// Fetch all device types
const fnAjaxGetAllDevicesTypesData = async () => {
  try {
    await store.dispatch("InventoryCentral/FETCH_ALL_INVENTORY_DEVICES_TYPES_DATA");

    deviceOptions.value = store.getters["InventoryCentral/getAllInventoryDevicesTypesData"].map(
      device => ({
        label: device.deviceName,
        value: device
      })
    );
  } catch {
    deviceOptions.value = [];
  }
};
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #ddd;
}
.group {
  margin-top: 12px;
}
</style>
