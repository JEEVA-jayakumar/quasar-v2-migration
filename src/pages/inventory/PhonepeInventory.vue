<template>
  <q-page>
    <div>
      <!-- Header -->
      <div class="row bottom-border q-px-md q-py-sm items-center">
        <div class="col-12 col-lg-4 q-title text-weight-regular text-grey-9">
          Aggregator Inventory
        </div>

        <div class="col-12 col-lg-8 text-right">
          <!-- Refurbished -->
          <q-btn-dropdown outline no-caps label="Add Refurbished Device">
            <q-list>
              <q-item clickable @click="fnPhonePeOpenRefurbishedBulkUploadModal">
                <q-item-section avatar>
                  <q-icon name="attach_file" />
                </q-item-section>
                <q-item-section>Bulk upload</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <q-btn outline no-caps label="Allocate to SO" to="PhonepeallocateToSo" />
          <q-btn outline no-caps label="Allocate to Region" to="PhonepeallocateDevice" />
          <q-btn outline no-caps label="Add Faulty Device" to="showAggregatorsAddDamagedDevices" @click="fnShowAddDevice" />

          <!-- New device -->
          <q-btn-dropdown outline no-caps label="Add new device from manufacturer">
            <q-list>
              <q-item clickable to="PhonepeAddDeviceScan">
                <q-item-section avatar>
                  <q-icon name="search" />
                </q-item-section>
                <q-item-section>Scan and Upload</q-item-section>
              </q-item>

              <q-item clickable @click="fnPhonePeOpenBulkUploadModal">
                <q-item-section avatar>
                  <q-icon name="attach_file" />
                </q-item-section>
                <q-item-section>Bulk upload</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </div>

      <div class="row">
        <!-- Left device menu -->
        <div class="col-md-3 q-pa-md">
          <div
            v-for="(deviceInfo, index) in getAllPhonepeInventoryDevicesTypesWithCountData"
            :key="index"
            class="q-pa-md cursor-pointer"
            :class="activeItemId === index ? 'shadow-5 bg-grey-5' : 'shadow-0'"
            :style="{ background: deviceInfo.aggregatorDevice?.colorCode }"
            align="center"
            @click="ajaxLoadDataForCentralInventoryByDeviceIdFilter(index, deviceInfo)"
          >
            <big>{{ deviceInfo.count }}</big>
            <div>{{ deviceInfo.aggregatorDevice?.deviceName }}</div>
          </div>
        </div>

        <!-- Table -->
        <div class="col-md-9">
          <q-table
            class="customTableClass shadow-0"
            :rows="getAllPhonepeInventoryDevicesData"
            :columns="columnData"
            row-key="serialNumber"
            :filter="filterSearch"
            :loading="tableAjaxLoading"
          >
            <template v-slot:top>
              <div class="col-md-5">
                <q-input
                  v-model="filterSearch"
                  type="search"
                  clearable
                  dense
                  label="Search By Device Serial Number"
                  class="q-mr-lg q-py-sm"
                />
              </div>

              <div class="col-md-5">
                <downloadExcel
                  :data="getAllPhonepeInventoryDevicesData"
                  :fields="jsonFields"
                  name="CentralInventory.xls"
                >
                  <q-btn outline color="grey-9" label="Download as excel" />
                </downloadExcel>
              </div>
            </template>
          </q-table>
        </div>
      </div>

      <!-- Bulk upload -->
      <PhonepeopenAddBulkDeviceModelComp
        v-if="openBulkUploadModal"
        :propOpenBulkUploadModal="openBulkUploadModal"
        :propAllDevicestypes="getAllInventoryDevicesTypesData"
        @closeModel="fnPhonePeOpenBulkUploadModal"
        @emitToggleinventoryBulkUploadOnSuccess="fnReloadPageInformation"
      />

      <phonepeAddRefurbishedBulkUploadDevice
        v-if="openRefurbishedBulkUploadModal"
        :propOpenRefurbishedBulkUploadModal="openRefurbishedBulkUploadModal"
        :propAllDevicestypes="getAllInventoryDevicesTypesData"
        @closeModel="fnPhonePeOpenRefurbishedBulkUploadModal"
        @emitToggleinventoryRefurbishedBulkUploadOnSuccess="fnReloadPageInformation"
      />

      <showAggregatorsAddDamagedDevices
        v-if="faultyInventoryComponent"
        :faultyInventoryComponent="faultyInventoryComponent"
        @emitRefreshList="fnAjaxPopulateAllDevicesWithCount"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import downloadExcel from "vue-json-excel";

import PhonepeopenAddBulkDeviceModelComp from "../../components/inventory/PhonepeopenAddBulkDeviceModelComp.vue";
import phonepeAddRefurbishedBulkUploadDevice from "../../components/inventory/phonepeAddRefurbishedBulkUploadDevice.vue";
import showAggregatorsAddDamagedDevices from "../../components/inventory/showAggregatorsAddDamagedDevices.vue";

/* ---------------- Setup ---------------- */
const store = useStore();

/* ---------------- State ---------------- */
const filterSearch = ref("");
const tableAjaxLoading = ref(false);
const openBulkUploadModal = ref(false);
const openRefurbishedBulkUploadModal = ref(false);
const faultyInventoryComponent = ref(false);
const activeItemId = ref(0);

/* ---------------- Table ---------------- */
const jsonFields = {
  SerialNumber: "serialNumber",
  Aggregator: "aggregator.name",
  DeviceType: "aggregatorDevice.deviceName"
};

const columnData = [
  { name: "serialNumber", label: "Device Serial Number", field: "serialNumber", sortable: true },
  {
    name: "deviceCategoryType",
    label: "Device Category",
    field: row => row.deviceCategoryType ?? "NA"
  },
  {
    name: "aggregator",
    label: "Aggregator",
    field: row => row.aggregator.name,
    sortable: true
  },
  {
    name: "device",
    label: "Device Type",
    field: row => row.aggregatorDevice.deviceName,
    sortable: true
  }
];

/* ---------------- Getters ---------------- */
const getAllInventoryDevicesTypesData =
  store.getters["InventoryCentral/getAllInventoryDevicesTypesData"];
const getAllPhonepeInventoryDevicesData =
  store.getters["InventoryCentral/getAllPhonepeInventoryDevicesData"];
const getAllPhonepeInventoryDevicesTypesWithCountData =
  store.getters["InventoryCentral/getAllPhonepeInventoryDevicesTypesWithCountData"];

/* ---------------- Lifecycle ---------------- */
onMounted(() => {
  fnAjaxPopulateAllDevicesWithCount();
  fnAjaxPopulateAllDevicesList();
});

/* ---------------- Methods ---------------- */
function ajaxLoadDataForCentralInventoryByDeviceIdFilter(index, deviceInfo) {
  activeItemId.value = index;
  fnAjaxPopulateAllDevicesList(deviceInfo);
}

function fnPhonePeOpenBulkUploadModal() {
  openBulkUploadModal.value = !openBulkUploadModal.value;
}

function fnPhonePeOpenRefurbishedBulkUploadModal() {
  openRefurbishedBulkUploadModal.value = !openRefurbishedBulkUploadModal.value;
}

function fnAjaxPopulateAllDevicesWithCount() {
  tableAjaxLoading.value = true;
  store.dispatch("InventoryCentral/FETCH_ALL_PHONE_PE_INVENTORY_DEVICES_TYPES_WITH_COUNT_DATA")
    .finally(() => (tableAjaxLoading.value = false));
}

function fnAjaxPopulateAllDevicesList(deviceInfo) {
  tableAjaxLoading.value = true;
  store.dispatch("InventoryCentral/FETCH_ALL_PHOEPE_INVENTORY_DEVICES_BY_DEVICE_TYPE", deviceInfo)
    .finally(() => (tableAjaxLoading.value = false));
}

function fnReloadPageInformation() {
  fnAjaxPopulateAllDevicesWithCount();
  fnAjaxPopulateAllDevicesList();
}

function fnShowAddDevice() {
  faultyInventoryComponent.value = !faultyInventoryComponent.value;
}
</script>
