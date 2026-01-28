<template>
  <q-page>
    <div>
      <!-- HEADER -->
      <div class="row bottom-border q-px-md q-py-sm items-center">
        <div class="col-12 col-lg-4 q-title text-weight-regular text-grey-9">
          Bijlipay Central Inventory
        </div>

        <div class="col-12 col-lg-8 text-right">
          <q-btn outline no-caps label="Allocate to SO" to="central/allocate/device/so" />
          <q-btn outline no-caps label="Allocate to Region" to="central/allocate/device/region" />
          <q-btn outline no-caps label="Allocate to Reseller" to="central/allocate/device/resellar" />
          <q-btn outline no-caps label="Add Faulty Device" @click="toggleFaultyDevice" />

          <q-btn-dropdown outline no-caps label="Add new device from manufacturer">
            <q-list>
              <q-item clickable to="central/add/device/scan">
                <q-item-section avatar>
                  <q-icon name="search" />
                </q-item-section>
                <q-item-section>Scan and Upload</q-item-section>
              </q-item>

              <q-item clickable @click="toggleBulkUpload">
                <q-item-section avatar>
                  <q-icon name="attach_file" />
                </q-item-section>
                <q-item-section>Bulk upload</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </div>

      <!-- BODY -->
      <div class="row">
        <!-- LEFT DEVICE TYPE PANEL -->
        <div class="col-md-3 q-pa-md">
          <div
            v-for="(deviceInfo, index) in deviceTypesWithCount"
            :key="index"
            class="q-pa-md cursor-pointer"
            :class="activeItemId === index ? 'shadow-5 bg-grey-5' : 'shadow-0'"
            :style="{ background: deviceInfo.device.colorCode }"
            align="center"
            @click="filterByDeviceType(index, deviceInfo)"
          >
            <big>{{ deviceInfo.count }}</big>
            <div>{{ deviceInfo.device.deviceName }}</div>
          </div>
        </div>

        <!-- TABLE -->
        <div class="col-md-9">
          <q-table
            class="customTableClass shadow-0"
            :rows="devicesData"
            :columns="columns"
            row-key="serialNumber"
            :filter="filterSearch"
            v-model:pagination="pagination"
            :loading="tableLoading"
          >
            <template v-slot:top>
              <div class="row full-width items-center">
                <div class="col-md-5">
                  <q-input
                    outlined
                    clearable
                    v-model="filterSearch"
                    label="Search By Device Serial Number"
                  />
                </div>

                <div class="col-md-7 text-right">
                  <download-excel
                    :data="devicesData"
                    :fields="excelFields"
                    name="CentralInventory.xls"
                  >
                    <q-btn outline color="grey-9" label="Download as Excel" />
                  </download-excel>
                </div>
              </div>
            </template>
          </q-table>
        </div>
      </div>

      <!-- BULK UPLOAD MODAL -->
      <openAddBulkDeviceModelComp
        v-if="openBulkUpload"
        :propOpenBulkUploadModal="openBulkUpload"
        :propAllDevicestypes="deviceTypes"
        @closeModel="toggleBulkUpload"
        @emitToggleinventoryBulkUploadOnSuccess="reloadAllData"
      />

      <!-- FAULTY DEVICE COMPONENT -->
      <showAddDamagedDevices
        v-if="showFaultyDevice"
        :faultyInventoryComponent="showFaultyDevice"
        @emitRefreshList="loadDevicesWithCount"
      />
    </div>
  </q-page>
</template>

<script setup>
/* ---------------- IMPORTS ---------------- */
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import downloadExcel from 'vue-json-excel'

import openAddBulkDeviceModelComp from '../../components/inventory/openAddBulkDeviceModelComp.vue'
import showAddDamagedDevices from '../../components/inventory/showAddDamagedDevices.vue'

/* ---------------- SETUP ---------------- */
const store = useStore()

/* ---------------- STATE ---------------- */
const activeItemId = ref(0)
const openBulkUpload = ref(false)
const showFaultyDevice = ref(false)
const tableLoading = ref(false)
const filterSearch = ref('')

const pagination = ref({
  page: 1,
  rowsPerPage: 10
})

/* ---------------- TABLE CONFIG ---------------- */
const columns = [
  {
    name: 'serialNumber',
    label: 'Device Serial Number',
    field: 'serialNumber',
    sortable: true,
    align: 'left'
  },
  {
    name: 'device',
    label: 'Device Type',
    field: row => row.device.deviceName,
    sortable: true,
    align: 'center'
  }
]

const excelFields = {
  SerialNumber: 'serialNumber',
  DeviceType: 'device.deviceName'
}

/* ---------------- GETTERS ---------------- */
const devicesData = computed(() =>
  store.getters['InventoryCentral/getAllInventoryDevicesData']
)

const deviceTypes = computed(() =>
  store.getters['InventoryCentral/getAllInventoryDevicesTypesData']
)

const deviceTypesWithCount = computed(() =>
  store.getters['InventoryCentral/getAllInventoryDevicesTypesWithCountData']
)

/* ---------------- METHODS ---------------- */
const toggleBulkUpload = () => {
  openBulkUpload.value = !openBulkUpload.value
}

const toggleFaultyDevice = () => {
  showFaultyDevice.value = !showFaultyDevice.value
}

const filterByDeviceType = (index, deviceInfo) => {
  activeItemId.value = index
  loadDevicesList(deviceInfo)
}

const loadDevicesWithCount = async () => {
  tableLoading.value = true
  await store.dispatch('InventoryCentral/FETCH_ALL_INVENTORY_DEVICES_TYPES_WITH_COUNT_DATA')
  await store.dispatch('InventoryCentral/FETCH_ALL_INVENTORY_DEVICES_BY_DEVICE_TYPE')

  const total = {
    count: devicesData.value.length,
    device: { deviceName: 'Total', colorCode: '#666' }
  }

  deviceTypesWithCount.value.unshift(total)
  tableLoading.value = false
}

const loadDevicesList = async deviceInfo => {
  tableLoading.value = true
  await store.dispatch('InventoryCentral/FETCH_ALL_INVENTORY_DEVICES_BY_DEVICE_TYPE', deviceInfo)
  tableLoading.value = false
}

const loadDeviceTypes = async () => {
  await store.dispatch('InventoryCentral/FETCH_ALL_INVENTORY_DEVICES_TYPES_DATA')
}

const reloadAllData = async () => {
  await loadDevicesWithCount()
  await loadDeviceTypes()
}

/* ---------------- LIFECYCLE ---------------- */
onMounted(async () => {
  await loadDevicesWithCount()
  await loadDeviceTypes()
})
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
