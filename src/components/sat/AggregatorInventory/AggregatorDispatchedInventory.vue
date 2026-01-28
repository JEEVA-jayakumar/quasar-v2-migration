<template>
  <div class="q-pa-md">
    <div class="row q-ma-md">

      <!-- Left Column: POD input & Device selection -->
      <div class="col-md-4" style="border-right: 1px solid #ccc;">

        <!-- Step 1: Enter POD number -->
        <div class="row group items-baseline q-mb-md">
          <div class="col-12">
            <q-chip color="purple-9">Step -1</q-chip>&nbsp; Enter POD number and submit
          </div>
          <div class="col">
            <q-input
              v-model="podNumber"
              color="grey-9"
              placeholder="POD Number"
              float-label="Enter POD Number"
            />
          </div>
          <div class="col-auto" align="right">
            <q-btn
              :disable="!podNumber"
              label="Submit"
              class="text-white text-weight-regular common-dark-blue q-py-sm"
              @click="fnCookDispatchedHistoryDetails"
            />
          </div>
        </div>

        <!-- Step 2: Select Device Type -->
        <div class="row">
          <div class="q-pa-sm col-12">
            <q-chip color="purple-9">Step -2</q-chip>&nbsp; Select a device type
          </div>
          <div class="col-12">
            <div
              v-for="(item, index) in deviceTableData"
              :key="index"
              class="q-pa-sm cursor-pointer"
              @click="fnShowDisptachedeviceHistory(index, item)"
            >
              <q-card
                class="text-white q-pa-sm"
                :class="[activeDispatchedItemId === index ? 'shadow-8' : 'shadow-0']"
                :style="item.aggregatorDevice.colorCode ? `background: ${item.aggregatorDevice.colorCode}` : 'background: #ccc'"
              >
                <q-card-section>
                  <div class="row text-dark">
                    <div class="col-8">
                      <div>{{ item.aggregatorDevice.deviceName }}</div>
                      <div>{{ formatDate(item.aggregatorDevice.createDate) }}</div>
                    </div>
                    <div class="col-4 text-right">
                      <div>Count</div>
                      <div class="q-title">{{ item.count }}</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Scan & Upload -->
      <div class="col-md-8">
        <div class="q-pa-sm">
          <p><q-chip color="purple-9">Step -3</q-chip>&nbsp; Click on scan</p>
          <p><q-chip color="purple-9">Step -4</q-chip>&nbsp; Once scanning is done, click on upload to regional inventory</p>
        </div>

        <!-- Lead Validation Table -->
        <q-table
          title="Lead Validation"
          class="q-py-none customTableClass"
          :rows="deviceregionalInventoryList"
          :columns="columnData"
          row-key="serialNumber"
          :filter="filter"
          v-model:pagination="paginationControl"
          :loading="toggleAjaxLoadFilter"
        >
          <template #top>
            <div class="row bottom-border q-pa-sm">
              <div class="col-12 col-lg-4">
                <q-input
                  filled
                  v-model="filter"
                  clearable
                  color="grey-9"
                  placeholder="Search by device name, serial no"
                />
              </div>
              <div class="col-12 col-lg-8 text-right">
                <q-btn
                  outline
                  class="common-dark-blue q-mr-sm"
                  :disable="currentDeviceId == null || !toggleScanButton"
                  @click="fnShowDevicesVerificationStart"
                >
                  Scan
                </q-btn>
                <q-btn
                  outline
                  class="common-dark-blue"
                  :disable="computeEnableUploadToInventory.length === 0"
                  @click="fnUploadDeviceSerialNumbersAsPending"
                >
                  Upload to regional inventory
                </q-btn>
              </div>
            </div>
          </template>

          <template #body-cell-inboundVerifiedStatus="props">
            <q-td :props="props">
              <q-btn v-if="props.row.inboundVerifiedStatus === 1" flat icon="check" color="positive" />
              <q-btn v-else-if="props.row.inboundVerifiedStatus === 2" flat icon="clear" color="negative" />
              <q-btn v-else flat icon="warning" color="amber-9" />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { date } from "quasar";

// ---------------------- STATE ----------------------
const store = useStore();

const podNumber = ref("");
const currentDeviceId = ref(null);
const toggleScanButton = ref(true);
const toggleAjaxLoadFilter = ref(false);
const activeDispatchedItemId = ref(null);

const deviceTableData = ref([]);
const deviceregionalInventoryList = ref([]);

const paginationControl = ref({ rowsPerPage: 10 });
const filter = ref("");

const columnData = [
  { name: "device_type", label: "Device", field: row => row.aggregatorDevice.deviceName, sortable: true },
  { name: "serial_number", label: "Serial Number", field: row => row.serialNumber, sortable: true },
  { name: "inboundVerifiedStatus", label: "Status", field: "inboundVerifiedStatus", sortable: true }
];

// ---------------------- COMPUTED ----------------------
const computeEnableUploadToInventory = computed(() =>
  deviceregionalInventoryList.value.filter(o => o.inboundVerifiedStatus === 1)
);

// ---------------------- METHODS ----------------------

// Format date with Quasar date util
const formatDate = (dateStr) => date.formatDate(dateStr, "MMMM Do YYYY");

// Fetch devices for POD
const fnCookDispatchedHistoryDetails = async () => {
  toggleAjaxLoadFilter.value = true;
  try {
    const requestParams = { request: { podNumber: podNumber.value } };
    const response = await store.dispatch("SAT_RegionalInventoryAllocation/FETCH_PHONE_PE_REGIONAL_INVENTORY_PDO_BASED_DEVICE_DETAIL_WITH_COUNT", requestParams);
    deviceTableData.value = response.data.data.regionalInventoryCount;
    deviceregionalInventoryList.value = response.data.data.regionalInventoryList;
  } catch (error) {

    deviceregionalInventoryList.value = [];
    deviceTableData.value = [];
    store.$q.notify({ color: "warning", position: "bottom", message: error?.data?.message || "Error fetching POD devices", icon: "info" });
  } finally {
    toggleAjaxLoadFilter.value = false;
  }
};

// Select device from dispatched list
const fnShowDisptachedeviceHistory = async (index, item) => {
  activeDispatchedItemId.value = index;
  currentDeviceId.value = item.aggregatorDevice.id;
  toggleAjaxLoadFilter.value = true;
  try {
    const requestParams = { podNumber: podNumber.value, device: item.aggregatorDevice.id };
    const response = await store.dispatch("SAT_RegionalInventoryAllocation/FETCH_PHONE_PE_REGIONAL_INVENTORY_PDO_BASED_DEVICE_DETAIL_WITH_COUNT", requestParams);
    deviceTableData.value = response.data.data.regionalInventoryCount;
    deviceregionalInventoryList.value = response.data.data.regionalInventoryList;
  } catch (error) {

    console.error(error);
  } finally {
    toggleAjaxLoadFilter.value = false;
  }
};

// Scan barcode
const fnShowDevicesVerificationStart = () => {
  if (!currentDeviceId.value) {
    store.$q.notify({ color: "negative", position: "bottom", message: "Choose a device from the list", icon: "clear" });
    return;
  }
  store.$barcodeScanner.init(onBarcodeScanned);
  toggleScanButton.value = false;
};

// Handle barcode scanned
const onBarcodeScanned = async (barcode) => {
  if (!podNumber.value) {
    store.$q.notify({ color: "negative", position: "bottom", message: "POD number is mandatory", icon: "clear" });
    return;
  }
  const formData = { podNumber: podNumber.value, device: currentDeviceId.value, serialNumber: barcode };
  try {
    await store.dispatch("SAT_RegionalInventoryAllocation/AGGREGATORS_VERIFY_DEVICE_WITH_POD_AND_DEVICE_ID", formData);
    store.$q.notify({ color: "positive", position: "bottom", message: `#${barcode} - Validated`, icon: "check" });
    await fnCookDispatchedHistoryDetails();
  } catch (error) {

    store.$q.notify({ color: "negative", position: "bottom", message: error?.data?.message || "Validation failed", icon: "clear" });
  }
};

// Upload scanned devices to regional inventory
const fnUploadDeviceSerialNumbersAsPending = async () => {
  try {
    await store.dispatch("SAT_RegionalInventoryAllocation/AGGREGATORS_CONVERT_INBOUND_TO_ACTIVE_DEVICE", { podNumber: podNumber.value });
    podNumber.value = "";
    deviceTableData.value = [];
    deviceregionalInventoryList.value = [];
    store.$emit("fetchDeviceDetailsWithCount");
    store.$q.notify({ color: "positive", position: "bottom", message: "Successfully added", icon: "check" });
  } catch {

    store.$q.notify({ color: "negative", position: "bottom", message: "Please try again", icon: "clear" });
  }
};
</script>
