<template>
  <q-page>
    <div>
      <!-- Header -->
      <div class="row bottom-border q-px-md q-py-md items-center">
        <div class="col-md-8 text-h6 text-grey-9">
          Aggregator Add Refurbished Devices - Scan & Upload
        </div>

        <div class="col-md-4 text-right">
          <q-btn
            outline
            color="negative"
            label="Cancel Allocation"
            @click="router.push('/inventory/PhonepeInventory')"
          />
        </div>
      </div>

      <!-- Controls -->
      <div class="row bottom-border q-px-md q-py-md items-center">
        <div class="col-md-4">
          <q-select
            v-model="formData.deviceId"
            label="Select Device Type"
            :options="deviceOptions"
            emit-value
            map-options
            @update:model-value="onDeviceChange"
          />
        </div>

        <div class="col-12 col-lg-4 text-right">
          <q-btn
            v-if="scanningActive"
            :disable="!formData.deviceId"
            color="primary"
            label="Start scan"
            @click="startScanner"
          />

          <q-btn
            class="q-ml-sm"
            color="primary"
            :disable="tempTableData.length === 0"
            label="Upload"
            @click="finalSubmit"
          />
        </div>
      </div>

      <!-- Table -->
      <q-table
        :rows="tempTableData"
        :columns="columns"
        row-key="deviceSerialNumbers"
        :filter="filterSearch"
        v-model:pagination="pagination"
        :loading="loading"
        class="customTableClass shadow-0"
      >
        <template v-slot:top>
          <q-input
            v-model="filterSearch"
            debounce="300"
            outlined
            clearable
            placeholder="Search..."
            class="q-mr-lg q-py-sm"
          />
        </template>

        <template v-slot:body-cell-action="props">
          <q-btn
            size="sm"
            color="negative"
            icon="close"
            label="Remove"
            @click="removeScannedItem(props.row.deviceSerialNumbers)"
          />
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

/* -------------------------------------------------- */
const store = useStore()
const router = useRouter()
const $q = useQuasar()

/* -------------------------------------------------- */
const filterSearch = ref('')
const scanningActive = ref(true)
const loading = ref(false)

const pagination = ref({
  rowsPerPage: 10
})

const tempTableData = ref([])

const formData = reactive({
  deviceId: null,
  deviceSerialNumbers: []
})

/* -------------------------------------------------- */
const columns = [
  {
    name: 'deviceSerialNumbers',
    label: 'Serial Number',
    field: 'deviceSerialNumbers',
    sortable: true
  },
  {
    name: 'action',
    label: '',
    field: 'action'
  }
]

const deviceOptions = ref([])

/* -------------------------------------------------- */
/* BARCODE SCANNER (Vue 3 SAFE) */
let buffer = ''
let scannerActive = false

const handleKeydown = (e) => {
  if (!scannerActive) return

  if (e.key === 'Enter') {
    processBarcode(buffer)
    buffer = ''
  } else {
    buffer += e.key
  }
}

const startScanner = () => {
  scannerActive = true
  scanningActive.value = false
  window.addEventListener('keydown', handleKeydown)
}

const stopScanner = () => {
  scannerActive = false
  scanningActive.value = true
  window.removeEventListener('keydown', handleKeydown)
}

/* -------------------------------------------------- */
const processBarcode = async (barcode) => {
  const exists = tempTableData.value.find(
    i => i.deviceSerialNumbers === barcode
  )

  if (exists) {
    $q.notify({
      color: 'info',
      position: 'bottom',
      message: `${barcode} - device already scanned`
    })
    return
  }

  try {
    await store.dispatch(
      'VerifyDevice/AGGREGATORS_VERIFY_DEVICE_BEFORE_ADDING_CENTRAL_INVENTORY',
      {
        device: formData.deviceId,
        barcode
      }
    )

    tempTableData.value.push({ deviceSerialNumbers: barcode })
  } catch {
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: `${barcode} - device already available in inventory`
    })
  }
}

/* -------------------------------------------------- */
const removeScannedItem = (serial) => {
  const index = tempTableData.value.findIndex(
    i => i.deviceSerialNumbers === serial
  )

  if (index !== -1) {
    tempTableData.value.splice(index, 1)
  }

  if (tempTableData.value.length === 0) {
    scanningActive.value = true
  }
}

/* -------------------------------------------------- */
const finalSubmit = async () => {
  const payload = {
    deviceId: formData.deviceId,
    request: {
      deviceSerialNumbers: tempTableData.value.map(
        i => i.deviceSerialNumbers
      )
    }
  }

  try {
    await store.dispatch(
      'InventoryScanAddDevice/FEED_PHONE_PE_DEVICE_SCAN_BY_ID_DATA',
      payload
    )

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Devices are added successfully!'
    })

    router.push('/inventory/PhonepeInventory')
  } catch {
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Serial Number Already Available In DB!'
    })
  }
}

/* -------------------------------------------------- */
const onDeviceChange = () => {
  stopScanner()
}

/* -------------------------------------------------- */
onMounted(async () => {
  await store.dispatch(
    'superAdminAggregatorsDevice/GET_ACTIVE_CREATED_DEVICE_LIST'
  )

  deviceOptions.value =
    store.getters[
      'superAdminAggregatorsDevice/getCreatedActiveDeviceList'
    ].map(d => ({
      label: d.deviceName,
      value: d.id
    }))
})

onBeforeUnmount(() => {
  stopScanner()
})
</script>
