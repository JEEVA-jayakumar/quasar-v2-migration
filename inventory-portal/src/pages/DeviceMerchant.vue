<template>
  <q-page>
    <!-- Title -->
    <div
      class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
    >
      Devices with Merchants
    </div>

    <!-- Table -->
    <q-table
      class="q-py-none customTableClass"
      :rows="tableData"
      :columns="columns"
      row-key="tid"
      :loading="loading"
      :filter="filter"
      v-model:pagination="pagination"
      :rows-per-page-options="[5, 10, 15, 20]"
      @request="onRequest"
    >
      <!-- Top -->
      <template #top>
        <div class="row full-width items-center bottom-border q-pb-sm">
          <div class="col">
            <q-input
              dense
              outlined
              clearable
              v-model="filter"
              placeholder="Search by MID, TID"
              color="grey-9"
              class="q-mr-lg"
            />
          </div>

          <div class="col-md-6 text-right">
            <q-btn
              outline
              color="purple-9"
              label="Download as Excel"
              class="q-mr-lg"
              @click="toggleDownloadPopup"
            />
          </div>
        </div>
      </template>

      <!-- Implemented Date -->
      <template #body-cell-implementedDate="props">
        <q-td :props="props">
          {{ formatDate(props.row.implementedDate) }}
        </q-td>
      </template>
    </q-table>

    <!-- Download Popup -->
    <DownloadDeviceMerchantReport
      v-if="showDownloadPopup"
      :propDeviceMerchantReport="showDownloadPopup"
      @emitfnshowDeviceMerchant="toggleDownloadPopup"
    />

    <!-- Loader Overlay -->
    <div v-if="loading" class="fullscreen spinner-overlay">
      <q-spinner-bars class="absolute-center" color="purple-9" size="35" />
    </div>
  </q-page>
</template>

<script setup>
/* =======================
   Imports
======================= */
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import moment from 'moment'

import DownloadDeviceMerchantReport from
  'src/components/inventory/DownloadDeviceMerchantReport.vue'

/* =======================
   Quasar & Store
======================= */
const $q = useQuasar()
const store = useStore()

/* =======================
   State
======================= */
const tableData = ref([])
const filter = ref('')
const loading = ref(false)
const showDownloadPopup = ref(false)

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 0,
  sortBy: 'tid',
  descending: false
})

/* =======================
   Columns
======================= */
const columns = [
  {
    name: 'mid',
    label: 'MID',
    field: 'mid',
    align: 'left',
    sortable: true
  },
  {
    name: 'tid',
    label: 'TID',
    field: 'tid',
    align: 'left',
    sortable: true
  },
  {
    name: 'merchantName',
    label: 'Merchant Name',
    field: 'merchantName',
    align: 'left',
    sortable: true
  },
  {
    name: 'bpRegions',
    label: 'BP Region',
    field: 'bpRegions',
    align: 'left',
    sortable: true
  },
  {
    name: 'soId',
    label: 'SO ID',
    field: 'soId',
    align: 'left',
    sortable: true
  },
  {
    name: 'implementedDate',
    label: 'Implemented Date',
    field: 'implementedDate',
    align: 'left',
    sortable: true
  },
  {
    name: 'deviceSerialNumber',
    label: 'Device Serial Number',
    field: 'deviceSerialNumber',
    align: 'left',
    sortable: true
  },
  {
    name: 'deviceType',
    label: 'Device Type',
    field: 'deviceType',
    align: 'left',
    sortable: true
  }
]

/* =======================
   Helpers
======================= */
const formatDate = (val) => {
  if (!val) return 'NA'
  return moment(val).format('Do MMM YYYY')
}

const toggleDownloadPopup = () => {
  showDownloadPopup.value = !showDownloadPopup.value
}

/* =======================
   Table Request
======================= */
const onRequest = async ({ pagination: p, filter: f }) => {
  loading.value = true
  $q.loading.show({
    spinnerColor: 'purple-9',
    message: 'Fetching data...'
  })

  try {
    await store.dispatch('merchant/DEVICE_WITH_MERCHANT', {
      pagination: p,
      filter: f
    })

    const response =
      store.getters['merchant/getDeviceWithMerchant']

    tableData.value = response.content
    pagination.value.rowsNumber = response.totalElements
    pagination.value.page = response.number + 1

    if (response.sort?.length) {
      pagination.value.sortBy = response.sort[0].property
      pagination.value.descending = !response.sort[0].ascending
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
    $q.loading.hide()
  }
}

/* =======================
   Lifecycle
======================= */
onMounted(() => {
  onRequest({
    pagination: pagination.value,
    filter: filter.value
  })
})
</script>

<style scoped>
.customTableClass {
  min-height: 300px;
}
</style>
