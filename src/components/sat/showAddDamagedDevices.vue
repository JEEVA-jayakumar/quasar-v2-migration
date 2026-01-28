<template>
  <div class="q-pa-md group">
    <div class="row">
      <!--START: table title -->
      <div class="col">
        <q-select
          clearable
          :disable="formData.region === ''"
          @clear="fnClearingDeviceTypeSelection"
          @update:model-value="fnSetDevicesByDeviceId"
          v-model="formData.device_type"
          float-label="Select Device Type"
          color="grey-9"
          :options="deviceOptions"
        />
      </div>

      <div class="col-auto" align="center">
        <q-btn
          :disabled="formData.device_type === ''"
          @click="openScannerComp"
          v-if="scannerToggleOption"
          color="light-blue"
          class="q-py-xs"
          label="Start scan"
        />
      </div>

      <div class="col" align="right">
        <q-btn icon="check" outline class="q-py-xs" label="Submit" @click="toggleDamagedDevices"/>
      </div>
    </div>
    <!--END: table title -->

    <div class="row text-weight-regular text-grey-9">
      <div class="col group" v-for="(item,index) in formData.scannedItems" :key="item.device.id">
        <q-card class="shadow-4">
          <q-list highlight separator>
            <q-list-header style="border-bottom: 1px solid #ccc;">
              <q-icon style="color:#202c3f" name="tablet_android"/>
              {{ item.device.deviceName }}
            </q-list-header>

            <q-scroll-area
              style="height: 400px"
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
                  separator
                  class="text-light-blue"
                  v-for="(subItem, subIndex) in item.deviceSerialNumbers"
                  :key="subIndex"
                >
                  <q-item-section>{{ subItem }}</q-item-section>
                  <q-item-section side>
                    <q-btn
                      round
                      size="sm"
                      color="negative"
                      icon="close"
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
                      icon="close"
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

    <!--START >>  Show Add Device Component -->
    <showRegionalInventoryDevicePod
      v-if="showPDOmodal"
      :propShowPDOmodal="showPDOmodal"
      :propAllScannedItemArr="formData"
      @closeModel="toggleDamagedDevices"
      @emittedAfterPODsubmission="fnClearingDeviceTypeSelection"
    />
    <!--END >>  Show Add Device Component -->
  </div>
</template>

<script>
import { ref, reactive, onMounted, onBeforeUnmount, computed } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import showRegionalInventoryDevicePod from "./showRegionalInventoryDevicePod.vue";
import VueBarcodeScanner from "vue-barcode-scanner";

export default {
  name: "DamagedDevices",
  components: { showRegionalInventoryDevicePod },
  setup() {
    const $q = useQuasar();
    const store = useStore();

    // State
    const scannerToggleOption = ref(true);
    const showPDOmodal = ref(false);
    const deviceOptions = ref([]);
    const formData = reactive({
      region: JSON.parse(localStorage.getItem("u_i")).region.id,
      device_type: null,
      scannedItems: []
    });

    // Vuex Getters
    const getAllInventoryDevicesTypesData = computed(() =>
      store.getters["InventoryCentral/getAllInventoryDevicesTypesData"]
    );

    // Barcode scanner init
    const onBarcodeScanned = async (barcode) => {
      const currentDevice = formData.scannedItems.find(
        (item) => item.device.id === formData.device_type.id
      );

      if (!currentDevice) return;

      const alreadyExists = currentDevice.deviceSerialNumbers.includes(barcode);
      if (alreadyExists) {
        $q.notify({
          color: "primary",
          position: "bottom",
          message: `${barcode} - already exists in ${formData.device_type.deviceName}`,
          icon: "info"
        });
        return;
      }

      try {
        await store.dispatch("VerifyDevice/VERIFY_DEVICE_ON_REGIONAL_TO_CENTRAL_FOR_FAULTY", {
          device: formData.device_type.id,
          barcode
        });
        currentDevice.deviceSerialNumbers.push(barcode);
      } catch {
        $q.notify({
          color: "primary",
          position: "bottom",
          message: `${barcode} is invalid`,
          icon: "info"
        });
      }
    };

    const openScannerComp = () => {
      $q.notify({
        color: "positive",
        position: "bottom",
        message: `Start scanning for ${formData.device_type.deviceName}`,
        icon: "list"
      });
      scannerToggleOption.value = false;

      if (!VueBarcodeScanner.hasListener()) {
        VueBarcodeScanner.init(onBarcodeScanned);
      }
    };

    // Methods
    const fnSetDevicesByDeviceId = () => {
      scannerToggleOption.value = true;
      VueBarcodeScanner.destroy();

      const exists = formData.scannedItems.find(
        (item) => item.device.id === formData.device_type.id
      );

      if (!exists) {
        formData.scannedItems.unshift({
          device: {
            deviceName: formData.device_type.deviceName,
            id: formData.device_type.id
          },
          deviceSerialNumbers: []
        });
      }
    };

    const fnRemoveScannedItems = (index, subIndex) => {
      formData.scannedItems[index].deviceSerialNumbers.splice(subIndex, 1);
    };

    const fnRemoveDeviceTypeFromList = (index) => {
      formData.scannedItems.splice(index, 1);
    };

    const fnClearingDeviceTypeSelection = () => {
      formData.device_type = null;
      formData.scannedItems = [];
    };

    const toggleDamagedDevices = () => {
      showPDOmodal.value = !showPDOmodal.value;
    };

    const fnAjaxGetAllDevicesTypesData = async () => {
      try {
        await store.dispatch("InventoryCentral/FETCH_ALL_INVENTORY_DEVICES_TYPES_DATA");
        deviceOptions.value = getAllInventoryDevicesTypesData.value.map((item) => ({
          label: item.deviceName,
          value: item
        }));
      } catch {
        deviceOptions.value = [];
      }
    };

    onMounted(() => {
      fnAjaxGetAllDevicesTypesData();
    });

    onBeforeUnmount(() => {
      VueBarcodeScanner.destroy();
    });

    return {
      formData,
      scannerToggleOption,
      showPDOmodal,
      deviceOptions,
      openScannerComp,
      fnSetDevicesByDeviceId,
      fnRemoveScannedItems,
      fnRemoveDeviceTypeFromList,
      fnClearingDeviceTypeSelection,
      toggleDamagedDevices
    };
  }
};
</script>