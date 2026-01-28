<template>
  <div class="q-pa-md group">
    <div class="row">
      <!-- Device Type Selector -->
      <div class="col-md-2">
        <q-select
          clearable
          v-model="formData.device_type"
          :options="deviceOptions"
          float-label="Select Device Type"
          color="grey-9"
          @input="fnSetDevicesByDeviceId"
          @clear="fnClearingDeviceTypeSelection"
        />
      </div>

      <div class="col-auto">
        <q-btn
          v-if="scannerToggleOption"
          :disabled="!formData.device_type"
          color="light-blue"
          label="Start scan"
          class="q-py-xs"
          @click="openScannerComp"
        />
      </div>

      <div class="col text-right">
        <q-btn
          outline
          icon="check"
          label="Submit"
          class="q-py-xs"
          @click="toggleDamagedDevices"
        />
      </div>
    </div>

    <!-- Scanned Items List -->
    <div class="row text-weight-regular text-grey-9 mt-md">
      <div
        class="col group"
        v-for="(item, index) in formData.scannedItems"
        :key="item.device.id"
      >
        <q-card class="shadow-4">
          <q-list highlight separator>
            <q-list-header style="border-bottom: 1px solid #ccc;">
              <q-icon name="tablet_mac" style="color:#202c3f" />
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
                  separator
                  class="text-light-blue"
                  v-for="(subItem, subIndex) in item.deviceSerialNumbers"
                  :key="subItem"
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

    <!-- Show Add Device Component -->
    <AggregatorShowRegionalInventoryDevicePod
      v-if="showPDOmodal"
      :propShowPDOmodal="showPDOmodal"
      :propAllScannedItemArr="formData"
      @closeModel="toggleDamagedDevices"
      @emittedAfterPODsubmission="fnClearingDeviceTypeSelection"
    />
  </div>
</template>

<script>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import _ from "lodash";
import { useStore } from "vuex";
import AggregatorShowRegionalInventoryDevicePod from "./AggregatorShowRegionalInventoryDevicePod.vue";

export default {
  name: "DamagedDevices",
  components: {
    AggregatorShowRegionalInventoryDevicePod,
  },
  setup() {
    const store = useStore();

    // Refs and reactive state
    const scannerToggleOption = ref(true);
    const showPDOmodal = ref(false);
    const deviceOptions = ref([]);

    const formData = reactive({
      region: JSON.parse(localStorage.getItem("u_i")).region.id,
      device_type: null,
      scannedItems: [],
    });

    // Lifecycle
    onMounted(() => {
      fetchDevices();
    });

    onBeforeUnmount(() => {
      if (window.$barcodeScanner?.destroy) window.$barcodeScanner.destroy();
    });

    // Methods

    const fetchDevices = async () => {
      deviceOptions.value = _.map(store.getters["superAdminAggregatorsDevice/getCreatedActiveDeviceList"], (item) => ({
        value: item,
        label: item.deviceName,
      }));
    };

    const fnSetDevicesByDeviceId = () => {
      scannerToggleOption.value = true;
      if (window.$barcodeScanner?.destroy) window.$barcodeScanner.destroy();

      const exists = formData.scannedItems.find(
        (v) => v.device.id === formData.device_type.id
      );
      if (!exists) {
        formData.scannedItems.unshift({
          device: { deviceName: formData.device_type.deviceName, id: formData.device_type.id },
          deviceSerialNumbers: [],
        });
      }
    };

    const onBarcodeScanned = async (barcode) => {
      const item = formData.scannedItems.find(
        (v) => v.device.id === formData.device_type.id
      );
      if (!item) return;

      const exists = item.deviceSerialNumbers.includes(barcode);
      if (exists) {
        window.$q.notify({
          color: "primary",
          position: "bottom",
          message: `${barcode} - already exists`,
          icon: "info",
        });
        return;
      }

      try {
        await store.dispatch("VerifyDevice/VERIFY_AGGREGATORS_DEVICE_ON_REGIONAL_TO_CENTRAL_FOR_FAULTY", {
          device: formData.device_type.id,
          barcode,
        });
        item.deviceSerialNumbers.push(barcode);
      } catch {
        window.$q.notify({
          color: "primary",
          position: "bottom",
          message: `${barcode} is invalid`,
          icon: "info",
        });
      }
    };

    const openScannerComp = () => {
      window.$q.notify({
        color: "positive",
        position: "bottom",
        message: `Start scanning for ${formData.device_type.deviceName}`,
        icon: "list",
      });
      scannerToggleOption.value = false;
      if (window.$barcodeScanner && !window.$barcodeScanner.hasListener()) {
        window.$barcodeScanner.init(onBarcodeScanned);
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

    return {
      formData,
      deviceOptions,
      scannerToggleOption,
      showPDOmodal,
      fnSetDevicesByDeviceId,
      fnRemoveScannedItems,
      fnRemoveDeviceTypeFromList,
      fnClearingDeviceTypeSelection,
      openScannerComp,
      toggleDamagedDevices,
    };
  },
};
</script>

<style scoped>
/* Add custom styles if needed */
</style>
