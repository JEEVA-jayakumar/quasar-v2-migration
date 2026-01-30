<template>
  <q-page>
    <div>
      <!-- HEADER -->
      <div class="row bottom-border q-px-md q-py-md items-center">
        <div class="col-6 text-grey-9 text-weight-regular">
          Bijlipay Faulty Inventory
        </div>
        <div class="col-6 text-right">
          <q-btn
            icon="attach_file"
            outline
            color="dark"
            label="Bulk upload"
            @click="toggleBulkUpload"
          />
        </div>
      </div>

      <!-- POD INPUT -->
      <div class="row bottom-border q-px-md q-py-md items-center">
        <div class="col-6">
          <q-input
            v-model="podNumber"
            label="Enter POD number"
            color="grey-9"
            outlined
          />
        </div>
        <div class="col-6 text-right">
          <q-btn
            color="light-blue"
            label="Submit"
            @click="fetchFaultyInventory"
          />
        </div>
      </div>

      <!-- DEVICE TYPE -->
      <div class="row bottom-border q-px-md q-py-md items-center">
        <div class="col-6">
          <q-select
            :disable="disableDeviceTypeSelection"
            v-model="formData.device_type"
            label="Select Device Type"
            color="grey-9"
            outlined
            :options="deviceOptions"
            option-label="label"
            option-value="value"
            @update:model-value="setDeviceById"
          />
        </div>
        <div class="col-6 text-right">
          <q-btn
            v-if="scannerToggleOption"
            :disabled="!formData.device_type"
            color="light-blue"
            label="Start scan"
            @click="startScanner"
          />
        </div>
      </div>

      <!-- ACTION BUTTONS -->
      <div class="row bottom-border q-px-md q-py-md">
        <div class="col-12 text-right">
          <q-btn
            outline
            color="amber-9"
            icon="build"
            label="Send to repair"
            :disabled="disableActionButtons"
            @click="finalSubmit(1)"
          />
          <q-btn
            outline
            color="positive"
            icon="check"
            label="Accept Devices"
            :disabled="disableActionButtons"
            @click="finalSubmit(2)"
          />
        </div>
      </div>

      <!-- TABLE -->
      <q-table
        class="q-py-none"
        table-class="customTableClass"
        row-key="serialNumber"
        :rows="tableData"
        :columns="columns"
        :filter="filter"
        v-model:pagination="pagination"
      >
        <template #top>
          <q-input
            v-model="filter"
            label="Search"
            outlined
            clearable
          />
        </template>

        <template #body-cell-deviceName="props">
          {{ props.row.deviceName }}
        </template>

        <template #body-cell-serialNumber="props">
          {{ props.row.serialNumber }}
        </template>

        <template #body-cell-status="props">
          <q-icon
            v-if="props.row.status === true"
            name="check"
            color="positive"
          />
          <q-icon
            v-else-if="props.row.status === false"
            name="clear"
            color="negative"
          />
          <q-icon v-else name="warning" color="amber-9" />
        </template>
      </q-table>

      <!-- MODALS -->
      <ShowPDOmodalComponent
        v-if="showPDOmodal"
        :propshowPDOmodal="showPDOmodal"
        :propAllScannedItemArr="formData"
        @closeModel="showPDOmodal = false"
      />

      <FaultyBulkUploadModalComponent
        v-if="toggleFaultyBulkUpload"
        :propBulkUpload="toggleFaultyBulkUpload"
        :propAllDevicestypes="deviceOptions"
        @closeModel="toggleBulkUpload"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import ShowPDOmodalComponent from '../components/showFaultymodal.vue'
import FaultyBulkUploadModalComponent from '../components/faultyBulkUploadModal.vue'

const store = useStore()
const $q = useQuasar()
const { proxy } = getCurrentInstance()

/* STATE */
const podNumber = ref('')
const filter = ref('')
const disableDeviceTypeSelection = ref(true)
const scannerToggleOption = ref(true)
const toggleFaultyBulkUpload = ref(false)
const showPDOmodal = ref(false)

const pagination = ref({ rowsPerPage: 10 })

const formData = ref({
  device_type: null,
  scannedItems: []
})

const tableData = ref([])

/* TABLE */
const columns = [
  { name: 'deviceName', label: 'Device Type', field: 'deviceName' },
  { name: 'serialNumber', label: 'Serial Number', field: 'serialNumber' },
  { name: 'status', label: '', field: 'status' }
]

/* COMPUTED */
const deviceOptions = computed(() =>
  store.getters['InventoryCentral/getAllInventoryDevicesTypesData']
    .map(d => ({ label: d.deviceName, value: d }))
)

const disableActionButtons = computed(() =>
  !formData.value.scannedItems.some(i => i.deviceSerialNumbers.length > 0)
)

/* METHODS */
const toggleBulkUpload = () => {
  toggleFaultyBulkUpload.value = !toggleFaultyBulkUpload.value
}

const setDeviceById = () => {
  scannerToggleOption.value = true
  proxy.$barcodeScanner?.destroy()

  const exists = formData.value.scannedItems.find(
    d => d.device.id === formData.value.device_type.id
  )

  if (!exists) {
    formData.value.scannedItems.unshift({
      device: {
        id: formData.value.device_type.id,
        name: formData.value.device_type.deviceName
      },
      deviceSerialNumbers: []
    })
  }
}

const onBarcodeScanned = barcode => {
  const deviceBlock = formData.value.scannedItems.find(
    d => d.device.id === formData.value.device_type.id
  )

  if (!deviceBlock.deviceSerialNumbers.includes(barcode)) {
    store.dispatch('VerifyDevice/DEVICE_VERIFICATION_ON_SCAN_USING_DEVICE_TYPE_ID', {
      device: formData.value.device_type.id,
      barcode
    }).then(() => {
      deviceBlock.deviceSerialNumbers.push(barcode)
      const row = tableData.value.find(r => r.serialNumber === barcode)
      if (row) row.status = true
    })
  }
}

const startScanner = () => {
  scannerToggleOption.value = false
  if (!proxy.$barcodeScanner.hasListener()) {
    proxy.$barcodeScanner.init(onBarcodeScanned)
  }
}

const fetchFaultyInventory = () => {
  store.dispatch('InventoryCentral/FETCH_FAULT_INVENTORY_DEVICES_FROM_REGIONAL', podNumber.value)
    .then(() => {
      disableDeviceTypeSelection.value = false
      tableData.value = store.getters['InventoryCentral/getInvenotryAsFaultyData'].map(i => ({
        serialNumber: i.serialNumber,
        deviceName: i.device.deviceName,
        device: i.device.id,
        status: false
      }))
    })
}

const finalSubmit = action => {
  $q.dialog({
    title: 'Confirm',
    message: action === 1 ? 'Send to repair?' : 'Accept devices?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    store.dispatch('InventoryCentral/FEED_FAULTY_FINAL_SUBMIT', {
      data: formData.value.scannedItems,
      action
    }).then(() => {
      formData.value = { device_type: null, scannedItems: [] }
      tableData.value = []
      $q.notify({ type: 'positive', message: 'Success' })
    })
  })
}

onMounted(() => {
  store.dispatch('InventoryCentral/FETCH_ALL_INVENTORY_DEVICES_TYPES_DATA')
})
</script>