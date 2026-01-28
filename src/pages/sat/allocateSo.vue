<template>
  <q-page>
    <!-- Header -->
    <div class="row bottom-border q-px-md q-py-md items-center">
      <div class="col-6 col-sm-4 col-md-8 q-title text-weight-regular text-grey-9">
        Bijlipay Allocate SO/Bill Partner/Sub Region
      </div>
    </div>

    <!-- Filters / Actions -->
    <div class="row bottom-border group q-px-md q-py-md items-center text-weight-regular text-grey-9">
      <div class="col-md-4">
        <q-select
          v-model="formData.region"
          :options="regionOptions"
          float-label="Select Region"
          :disable="formData.device_type"
          @update:model-value="regionBasedSO"
        />
      </div>

      <div class="col-md-3">
        <q-select
          v-model="formData.so"
          :options="regionBasedSo"
          filter
          clearable
          float-label="Select SO"
        />
      </div>

      <div class="col-md-4">
        <q-select
          v-model="formData.device_type"
          :options="deviceOptions"
          float-label="Select Device Type"
          clearable
          :disable="!formData.region"
          @update:model-value="fnSetDevicesByDeviceId"
          @clear="fnClearingDeviceTypeSelection"
        />
      </div>

      <div class="col-12 col-lg-4 text-right">
        <q-btn
          v-if="scannerToggleOption"
          :disabled="!formData.device_type || !formData.region"
          color="light-blue"
          label="Start scan"
          class="q-py-xs"
          @click="openScannerComp"
        />
        <q-btn
          outline
          icon="shopping_cart"
          label="Add to cart"
          class="q-py-xs"
          @click="fnAllocateDeviceToRegion"
        />
      </div>
    </div>

    <!-- Scanned Items -->
    <div class="row text-weight-regular text-grey-9">
      <div v-for="(item, index) in formData.scannedItems" :key="index" class="col group">
        <q-card
          class="shadow-4"
          :style="{ border: formData.device_type?.id === item.device.id ? '2px solid #61116a' : 'unset' }"
        >
          <q-list highlight separator class="q-pa-none" :class="{ activeDeviceTab: formData.device_type?.id === item.device.id }">
            <q-list-header style="border-bottom:1px solid #ccc;">
              <q-icon :style="{ color: formData.device_type?.id === item.device.id ? '#fff' : '#202c3f' }" name="fas fa-tablet-alt" />
              {{ item.device.deviceName }}
            </q-list-header>

            <q-scroll-area
              style="height:400px"
              :thumb-style="{ right:'4px', borderRadius:'5px', background:'grey', width:'5px', opacity:0.5 }"
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
                    <q-btn round size="sm" color="negative" icon="clear" @click="fnRemoveScannedItems(index, subIndex)" />
                  </q-item-section>
                </q-item>
              </div>

              <div v-else>
                <q-item>
                  <q-item-section>No data to display</q-item-section>
                  <q-item-section side>
                    <q-btn round size="sm" color="negative" icon="clear" @click="fnRemoveDeviceTypeFromList(index)" />
                  </q-item-section>
                </q-item>
              </div>
            </q-scroll-area>
          </q-list>
        </q-card>
      </div>
    </div>

    <!-- PDO Modal -->
    <showPDORegionBasedSo
      v-if="showPDORegionBasedSo"
      :propshowRegionBasedSo="showPDORegionBasedSo"
      :propAllScannedItemArr="formData"
      @closeModel="fnAllocateDeviceToRegion"
    />
  </q-page>
</template>

<script>
import { reactive, ref, onMounted, onBeforeUnmount } from "vue";
import { useQuasar } from "quasar";
import VueBarcodeScanner from "vue-barcode-scanner";
import showPDORegionBasedSo from "../../components/inventory/showPDORegionBasedSo.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "allocateDevice",
  components: { showPDORegionBasedSo },

  setup() {
    const $q = useQuasar();

    const formData = reactive({
      region: "",
      so: "",
      device_type: null,
      scannedItems: []
    });

    const regionOptions = ref([]);
    const deviceOptions = ref([]);
    const regionBasedSo = ref([]);
    const scannerToggleOption = ref(true);
    const showPDORegionBasedSo = ref(false);

    const barcodeScanner = new VueBarcodeScanner();

    // Vuex Actions
    const { FETCH_ALL_INVENTORY_DEVICES_TYPES_DATA, FETCH_ALL_REGIONS_DATA, FETCH_REGION_BASED_SO, DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_SO_ALLOCATION } = mapActions({
      FETCH_ALL_INVENTORY_DEVICES_TYPES_DATA: "InventoryCentral/FETCH_ALL_INVENTORY_DEVICES_TYPES_DATA",
      FETCH_ALL_REGIONS_DATA: "InventoryCentral/FETCH_ALL_REGIONS_DATA",
      FETCH_REGION_BASED_SO: "InventoryCentral/FETCH_REGION_BASED_SO",
      DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_SO_ALLOCATION: "VerifyDevice/DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_SO_ALLOCATION"
    });

    // Vuex Getters
    const { getAllInventoryDevicesTypesData, getAllRegionsData, getRegionBasedSO } = mapGetters({
      getAllInventoryDevicesTypesData: "InventoryCentral/getAllInventoryDevicesTypesData",
      getAllRegionsData: "InventoryCentral/getAllRegionsData",
      getRegionBasedSO: "InventoryCentral/getRegionBasedSO"
    });

    // Load data on mount
    onMounted(() => {
      fnAjaxGetAllDevicesTypesData();
      fnAjaxGetAllRegionsData();
    });

    onBeforeUnmount(() => {
      barcodeScanner.destroy();
    });

    const fnAjaxGetAllDevicesTypesData = async () => {
      try {
        await FETCH_ALL_INVENTORY_DEVICES_TYPES_DATA();
        deviceOptions.value = getAllInventoryDevicesTypesData.value.map(d => ({ label: d.deviceName, value: d }));
      } catch {
        deviceOptions.value = [];
      }
    };

    const fnAjaxGetAllRegionsData = async () => {
      try {
        await FETCH_ALL_REGIONS_DATA();
        regionOptions.value = getAllRegionsData.value.map(r => ({ label: r.regionAreaName, value: r.id }));
      } catch {
        regionOptions.value = [];
      }
    };

    const regionBasedSO = async () => {
      if (!formData.region) return;
      await FETCH_REGION_BASED_SO(formData.region);
      regionBasedSo.value = getRegionBasedSO.value.map(so => ({
        label: `${so.name} | ${so.employeeID} | ${so.email}`,
        value: so.id
      }));
    };

    const fnSetDevicesByDeviceId = () => {
      scannerToggleOption.value = true;
      barcodeScanner.destroy();

      const exists = formData.scannedItems.find(i => i.device.id === formData.device_type.id);
      if (!exists) {
        formData.scannedItems.unshift({
          device: { id: formData.device_type.id, deviceName: formData.device_type.deviceName },
          deviceSerialNumbers: []
        });
      }
    };

    const onBarcodeScanned = barcode => {
      const scannedItem = formData.scannedItems.find(i => i.device.id === formData.device_type.id);
      if (!scannedItem.deviceSerialNumbers.includes(barcode)) {
        DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_SO_ALLOCATION({ device: formData.device_type.id, barcode })
          .then(() => {
            scannedItem.deviceSerialNumbers.push(barcode);
          })
          .catch(() => {
            $q.notify({ color: "primary", position: "bottom", message: `${barcode} is invalid`, icon: "info" });
          });
      } else {
        $q.notify({ color: "info", position: "bottom", message: `${barcode} already scanned` });
      }
    };

    const openScannerComp = () => {
      $q.notify({ color: "positive", position: "bottom", message: `Start scanning for ${formData.device_type.deviceName}`, icon: "list" });
      scannerToggleOption.value = false;
      if (!barcodeScanner.hasListener()) barcodeScanner.init(onBarcodeScanned);
    };

    const fnRemoveScannedItems = (index, subIndex) => {
      formData.scannedItems[index].deviceSerialNumbers.splice(subIndex, 1);
    };

    const fnRemoveDeviceTypeFromList = index => {
      formData.scannedItems.splice(index, 1);
    };

    const fnClearingDeviceTypeSelection = () => {
      formData.device_type = null;
      formData.scannedItems = [];
    };

    const fnAllocateDeviceToRegion = () => {
      showPDORegionBasedSo.value = !showPDORegionBasedSo.value;
    };

    return {
      formData,
      regionOptions,
      deviceOptions,
      regionBasedSo,
      scannerToggleOption,
      showPDORegionBasedSo,
      fnSetDevicesByDeviceId,
      fnRemoveScannedItems,
      fnRemoveDeviceTypeFromList,
      fnClearingDeviceTypeSelection,
      fnAllocateDeviceToRegion,
      openScannerComp,
      regionBasedSO
    };
  }
};
</script>

<style scoped>
.activeDeviceTab .q-list-header {
  border-bottom: 1px solid #ccc;
  background: #61116a;
  color: #fff;
}
</style>
