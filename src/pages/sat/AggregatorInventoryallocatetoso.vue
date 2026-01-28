<template>
  <q-page padding>

    <!-- Filters and Actions -->
    <div class="row bottom-border group q-px-md q-py-md items-center text-weight-regular text-grey-9">
      <div class="col-md-2">
        <q-select
          v-model="formData.region"
          :options="regionOptions"
          label="Select Region"
          :disable="formData.device_type !== ''"
          :class="{ 'no-pointer-events': formData.device_type !== '' }"
          emit-value
          map-options
          @update:model-value="regionBasedSO"
        />
      </div>

      <div class="col-md-2">
        <q-select
          v-model="formData.so"
          :options="regionBasedSo"
          label="Select SO"
          :disable="!formData.region"
          emit-value
          map-options
          clearable
          @update:model-value="SelectedSo"
        />
      </div>

      <div class="col-md-2">
        <q-select
          v-model="formData.device_type"
          :options="deviceOptions"
          label="Select Device Type"
          :disable="!formData.so"
          clearable
          emit-value
          map-options
          @update:model-value="fnSetDevicesByDeviceId"
          @clear="fnClearingDeviceTypeSelection"
        />
      </div>

      <div class="col-12 col-lg-4 group text-right">
        <q-btn
          v-if="scannerToggleOption"
          :disable="!formData.device_type || !formData.region"
          color="light-blue"
          label="Start scan"
          class="q-py-xs"
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

    <!-- Scanned Items Cards -->
    <div class="row text-weight-regular text-grey-9 mt-md">
      <div
        class="col group"
        v-for="(item, index) in formData.scannedItems"
        :key="item.device.id"
      >
        <q-card
          class="shadow-4"
          :style="{ border: formData.device_type?.id === item.device.id ? '2px solid #61116a' : 'unset' }"
        >
          <q-list
            highlight
            separator
            class="q-pa-none"
            :class="{ activeDeviceTab: formData.device_type?.id === item.device.id }"
          >
            <q-list-header style="border-bottom:1px solid #ccc;">
              <q-icon name="tablet" :color="formData.device_type?.id === item.device.id ? 'white' : 'dark'" />
              {{ item.device.deviceName }}
            </q-list-header>

            <q-scroll-area
              style="height: 400px"
              :thumb-style="{ right: '4px', borderRadius: '5px', background: 'grey', width: '5px', opacity: 0.5 }"
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
    <showAggregatorsPDORegionBasedSo
      v-if="showAggregatorsPDORegionBasedSo"
      :propshowRegionBasedSo="showAggregatorsPDORegionBasedSo"
      :propAllScannedItemArr="formData"
      @closeModel="fnAllocateDeviceToRegion"
      @emittedAfterPODsubmission="fnClearingDeviceTypeSelection"
    />
  </q-page>
</template>

<script>
import { ref, onBeforeUnmount } from "vue";
import { mapGetters, mapActions } from "vuex";
import showAggregatorsPDORegionBasedSo from "../../components/inventory/showAggregatorsPDORegionBasedSo.vue";
import VueBarcodeScanner from "vue-barcode-scanner";

export default {
  name: "allocateDevice",
  components: { showAggregatorsPDORegionBasedSo },
  setup() {
    const formData = ref({
      region: "",
      so: "",
      device_type: "",
      scannedItems: []
    });

    const regionOptions = ref([]);
    const deviceOptions = ref([]);
    const regionBasedSo = ref([]);
    const scannerToggleOption = ref(true);
    const showAggregatorsPDORegionBasedSo = ref(false);

    const barcodeScanner = new VueBarcodeScanner();

    const destroyScanner = () => {
      barcodeScanner.destroy();
    };

    onBeforeUnmount(() => {
      destroyScanner();
    });

    return {
      formData,
      regionOptions,
      deviceOptions,
      regionBasedSo,
      scannerToggleOption,
      showAggregatorsPDORegionBasedSo,
      barcodeScanner
    };
  },
  computed: {
    ...mapGetters("InventoryCentral", [
      "getAllInventoryDevicesTypesData",
      "getAllRegionsData",
      "getRegionBasedSO"
    ]),
    ...mapGetters("superAdminAggregatorsDevice", ["getCreatedActiveDeviceList"]),
    ...mapGetters("superAdminAggregators", ["getCreatedAggregatorList", "getActiveCreatedAggregatorList"])
  },
  methods: {
    ...mapActions("commonLoader", ["TOGGLE_COMMON_LOADER"]),
    ...mapActions("InventoryCentral", [
      "FETCH_ALL_INVENTORY_DEVICES_TYPES_DATA",
      "FETCH_ALL_REGIONS_DATA",
      "FETCH_REGION_BASED_SO"
    ]),
    ...mapActions("superAdminAggregatorsDevice", ["GET_ACTIVE_CREATED_DEVICE_LIST"]),
    ...mapActions("superAdminAggregators", ["GET_CREATED_AGGREGATORS_LIST", "GET_ACTIVE_CREATED_AGGREGATORS_LIST"]),
    ...mapActions("VerifyDevice", [
      "DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_ALLOCATION",
      "DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_SO_ALLOCATION",
      "AGGREGATORS_DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_SO_ALLOCATION"
    ]),

    fnSetDevicesByDeviceId() {
      this.scannerToggleOption = true;
      this.barcodeScanner.destroy();

      const exists = this.formData.scannedItems.find(
        item => item.device.id === this.formData.device_type.id
      );
      if (!exists) {
        this.formData.scannedItems.unshift({
          device: {
            deviceName: this.formData.device_type.deviceName,
            id: this.formData.device_type.id
          },
          deviceSerialNumbers: []
        });
      }
    },

    fnClearingDeviceTypeSelection() {
      this.formData.device_type = "";
      this.formData.scannedItems = [];
      this.formData.region = "";
      this.formData.so = "";
    },

    SelectedSo() {
      this.AggregatorsDevice();
    },

    AggregatorsDevice() {
      this.GET_ACTIVE_CREATED_DEVICE_LIST().then(() => {
        this.deviceOptions = this.getCreatedActiveDeviceList.map(item => ({
          label: item.deviceName,
          value: item
        }));
      });
    },

    onBarcodeScanned(barcode) {
      const selectedDevice = this.formData.scannedItems.find(
        item => item.device.id === this.formData.device_type.id
      );

      if (!selectedDevice.deviceSerialNumbers.includes(barcode)) {
        this.AGGREGATORS_DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_SO_ALLOCATION({
          device: this.formData.device_type.id,
          barcode
        })
          .then(() => selectedDevice.deviceSerialNumbers.push(barcode))
          .catch(() => {
            this.$q.notify({
              color: "primary",
              position: "bottom",
              message: `${barcode} is invalid`,
              icon: "info"
            });
          });
      } else {
        this.$q.notify({
          color: "warning",
          position: "bottom",
          message: `${barcode} already scanned`,
          icon: "warning"
        });
      }
    },

    openScannerComp() {
      this.$q.notify({
        color: "positive",
        position: "bottom",
        message: "Start scanning for " + this.formData.device_type.deviceName,
        icon: "list"
      });

      this.scannerToggleOption = false;

      if (!this.barcodeScanner.hasListener()) {
        this.barcodeScanner.init(this.onBarcodeScanned);
      }
    },

    fnRemoveScannedItems(index, subIndex) {
      this.formData.scannedItems[index].deviceSerialNumbers.splice(subIndex, 1);
    },

    fnRemoveDeviceTypeFromList(index) {
      this.formData.scannedItems.splice(index, 1);
    },

    fnAllocateDeviceToRegion(token) {
      this.showAggregatorsPDORegionBasedSo = !this.showAggregatorsPDORegionBasedSo;

      if (token === "refresh") {
        this.fnClearingDeviceTypeSelection();
      }
    },

    regionBasedSO() {
      this.FETCH_REGION_BASED_SO(this.formData.region).then(() => {
        this.regionBasedSo = this.getRegionBasedSO.map(item => ({
          label: `${item.name} | ${item.employeeID} | ${item.email}`,
          value: item.id
        }));
      });
    },

    fnAjaxGetAllRegionsData() {
      this.FETCH_ALL_REGIONS_DATA()
        .then(() => {
          this.regionOptions = this.getAllRegionsData.map(item => ({
            label: item.regionAreaName,
            value: item.id
          }));
        })
        .catch(() => {
          this.regionOptions = [];
        });
    }
  },

  mounted() {
    this.fnAjaxGetAllRegionsData();
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
