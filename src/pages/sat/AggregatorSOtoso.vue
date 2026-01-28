<template>
  <q-page>
    <div>
      <!-- Filter / Action Section -->
      <div class="row bottom-border group q-px-md q-py-md items-center text-weight-regular text-grey-9">
        <div class="col-md-2">
          <q-select
            v-model="formData.so"
            :options="assignToOptions"
            filter
            clearable
            float-label="Select SO"
            color="grey-9"
            @update:model-value="SelectedSo"
          />
        </div>

        <div class="col-12 col-lg-4 group" align="right">
          <q-btn
            v-if="scannerToggleOption"
            :disabled="!formData.device_type"
            color="light-blue"
            label="Start scan"
            class="q-py-xs"
            @click="openScannerComp"
          />
          <q-btn
            icon="shopping_cart"
            outline
            label="Re-Assign"
            class="q-py-xs"
            @click="fnAllocateDeviceToSO"
          />
        </div>
      </div>

      <!-- Scanned Items Display -->
      <div class="row text-weight-regular text-grey-9">
        <div v-for="(item, index) in formData.scannedItems" :key="index" class="col group">
          <q-card
            class="shadow-4"
            :style="{ border: formData.device_type?.id === item.device.id ? '2px solid #61116a' : 'unset' }"
          >
            <q-list highlight separator class="q-pa-none" :class="{ activeDeviceTab: formData.device_type?.id === item.device.id }">
              <q-list-header style="border-bottom: 1px solid #ccc;">
                <q-icon :style="{ color: formData.device_type?.id === item.device.id ? '#fff' : '#202c3f' }" name="fas fa-tablet-alt" />
                {{ item.device.deviceName }}
              </q-list-header>

              <q-scroll-area
                style="height:400px"
                :thumb-style="{ right: '4px', borderRadius: '5px', background: 'grey', width: '5px', opacity: 0.5 }"
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
                    <q-item-section>{{ item.userName[subIndex] }}</q-item-section>
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
      <showAggregatorsPDOSotoSO
        v-if="showAggregatorsPDOSotoSO"
        :propshowRegionBasedSo="showAggregatorsPDOSotoSO"
        :propAllScannedItemArr="formData"
        @closeModel="fnAllocateDeviceToSO"
        @emittedAfterPODsubmission="fnClearingDeviceTypeSelection"
      />
    </div>
  </q-page>
</template>

<script>
import { reactive, ref, onMounted, onBeforeUnmount } from "vue";
import { useQuasar } from "quasar";
import VueBarcodeScanner from "vue-barcode-scanner";
import { mapGetters, mapActions } from "vuex";
import showAggregatorsPDOSotoSO from "../../components/inventory/showAggregatorsPDOSotoSO.vue";

export default {
  name: "allocateDevice",
  components: { showAggregatorsPDOSotoSO },

  setup() {
    const $q = useQuasar();

    const formData = reactive({
      region: "",
      device_type: null,
      so: "",
      scannedItems: [],
      assignedUserId: ""
    });

    const scannerToggleOption = ref(true);
    const showAggregatorsPDOSotoSO = ref(false);
    const assignToOptions = ref([]);
    const regionOptions = ref([]);
    const deviceOptions = ref([]);
    const userName = ref("");

    const barcodeScanner = new VueBarcodeScanner();

    // Vuex Actions & Getters
    const { FETCH_ALL_REGIONS_DATA, IMPLEMENTATION_EXECUTIVE_LIST, AGGREGATOR_DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_SO_TO_SO_ALLOCATION } = mapActions({
      FETCH_ALL_REGIONS_DATA: "InventoryCentral/FETCH_ALL_REGIONS_DATA",
      FETCH_REGION_BASED_SO: "InventoryCentral/FETCH_REGION_BASED_SO",
      IMPLEMENTATION_EXECUTIVE_LIST: "ImplementationExecutive/IMPLEMENTATION_EXECUTIVE_LIST",
      GET_ACTIVE_CREATED_DEVICE_LIST: "superAdminAggregatorsDevice/GET_ACTIVE_CREATED_DEVICE_LIST",
      AGGREGATOR_DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_SO_TO_SO_ALLOCATION: "VerifyDevice/AGGREGATOR_DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_SO_TO_SO_ALLOCATION"
    });

    const { getImplementationExecutiveList, getAllRegionsData } = mapGetters({
      getImplementationExecutiveList: "ImplementationExecutive/getImplementationExecutiveList",
      getCreatedActiveDeviceList: "superAdminAggregatorsDevice/getCreatedActiveDeviceList",
      getRegionBasedSO: "InventoryCentral/getRegionBasedSO",
      getAllRegionsData: "InventoryCentral/getAllRegionsData"
    });

    // Initialize lists on mount
    onMounted(() => {
      implementationExecutiveList();
      fnAjaxGetAllRegionsData();
    });

    onBeforeUnmount(() => {
      barcodeScanner.destroy();
    });

    // Methods
    const implementationExecutiveList = async () => {
      await IMPLEMENTATION_EXECUTIVE_LIST();
      assignToOptions.value = getImplementationExecutiveList.value.map((item) => ({
        label: `${item.name} | ${item.employeeID} | ${item.email}`,
        value: item.id
      }));
    };

    const fnAjaxGetAllRegionsData = async () => {
      try {
        await FETCH_ALL_REGIONS_DATA();
        regionOptions.value = getAllRegionsData.value.map((r) => ({ label: r.regionAreaName, value: r.id }));
      } catch {
        regionOptions.value = [];
      }
    };

    const SelectedSo = () => {
      scannerToggleOption.value = true;
      barcodeScanner.destroy();
    };

    const openScannerComp = () => {
      $q.notify({ color: "positive", position: "bottom", message: `Start scanning for ${formData.device_type.deviceName}`, icon: "list" });
      scannerToggleOption.value = false;
      if (!barcodeScanner.hasListener()) barcodeScanner.init(onBarcodeScanned);
    };

    const fnSetDevicesByDeviceId = () => {
      barcodeScanner.destroy();
      const exists = formData.scannedItems.find((item) => item.device.id === formData.device_type.id);
      if (!exists) {
        formData.scannedItems.unshift({
          device: { id: formData.device_type.id, deviceName: formData.device_type.deviceName },
          deviceSerialNumbers: [],
          userName: []
        });
      }
    };

    const onBarcodeScanned = (barcode) => {
      fnSetDevicesByDeviceId();
      const scannedItem = formData.scannedItems.find((item) => item.device.id === formData.device_type.id);

      if (!scannedItem.deviceSerialNumbers.includes(barcode)) {
        AGGREGATOR_DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID_SO_TO_SO_ALLOCATION({ device: formData.device_type.id, barcode })
          .then((res) => {
            userName.value = res.body.data.user.username;
            scannedItem.deviceSerialNumbers.push(barcode);
            scannedItem.userName.push(userName.value);
            formData.assignedUserId = res.body.data.user.id;
            scannerToggleOption.value = false;
          })
          .catch((err) => {
            $q.notify({ color: "primary", position: "bottom", message: `${barcode} - ${err.data.message}`, icon: "info" });
          });
      } else {
        $q.notify({ color: "info", position: "bottom", message: `${barcode} already scanned` });
      }
    };

    const fnRemoveScannedItems = (index, subIndex) => {
      formData.scannedItems[index].deviceSerialNumbers.splice(subIndex, 1);
      formData.scannedItems[index].userName.splice(subIndex, 1);
      scannerToggleOption.value = true;
    };

    const fnRemoveDeviceTypeFromList = (index) => {
      formData.scannedItems.splice(index, 1);
      scannerToggleOption.value = true;
    };

    const fnAllocateDeviceToSO = (token) => {
      showAggregatorsPDOSotoSO.value = !showAggregatorsPDOSotoSO.value;
      if (token === "refresh") {
        formData.device_type = null;
        formData.scannedItems = [];
        formData.region = "";
        formData.so = "";
      }
    };

    const fnClearingDeviceTypeSelection = () => {
      formData.device_type = null;
      formData.scannedItems = [];
      formData.region = "";
      formData.so = "";
    };

    return {
      formData,
      scannerToggleOption,
      assignToOptions,
      regionOptions,
      deviceOptions,
      showAggregatorsPDOSotoSO,
      fnRemoveScannedItems,
      fnRemoveDeviceTypeFromList,
      fnAllocateDeviceToSO,
      SelectedSo,
      openScannerComp,
      fnClearingDeviceTypeSelection
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
