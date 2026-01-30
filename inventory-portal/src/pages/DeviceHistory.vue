<template>
  <q-page>
    <!-- Title -->
    <div
      class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
    >
      Device History
    </div>

    <!-- Table -->
    <q-table
      class="q-py-none customTableClass"
      :rows="tableData"
      :columns="columns"
      row-key="SerialNumber"
      :loading="loading"
      :filter="filter"
      v-model:pagination="pagination"
      :rows-per-page-options="[100, 200, 300, 400, 500]"
      @request="onRequest"
    >
      <!-- Top section -->
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

      <!-- Installed Date -->
      <template #body-cell-installationDate="props">
        <q-td :props="props">
          {{ formatDate(props.row.installationDate) }}
        </q-td>
      </template>

      <!-- De-Installed Date -->
      <template #body-cell-deInstallationDate="props">
        <q-td :props="props">
          {{ formatDate(props.row.deInstallationDate) }}
        </q-td>
      </template>
    </q-table>

    <!-- Download Popup -->
    <DownloadDeviceHistoryReport
      v-if="showDownloadPopup"
      :propDeviceHistoryReport="showDownloadPopup"
      @emitfnshowDeviceHistory="toggleDownloadPopup"
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

import DownloadDeviceHistoryReport from
  'src/components/inventory/DownloadDeviceHistoryReport.vue'

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
  rowsPerPage: 10,
  rowsNumber: 0,
  sortBy: 'deInstallationDate',
  descending: false
})

/* =======================
   Columns
======================= */
const columns = [
  {
    name: 'SerialNumber',
    label: 'Device Serial Number',
    field: 'SerialNumber',
    align: 'left',
    sortable: true
  },
  {
    name: 'mId',
    label: 'MID',
    field: 'mId',
    align: 'left',
    sortable: true
  },
  {
    name: 'tId',
    label: 'TID',
    field: 'tId',
    align: 'left',
    sortable: true
  },
  {
    name: 'BpRegion',
    label: 'BpRegion',
    field: 'BpRegion',
    align: 'left',
    sortable: true
  },
  {
    name: 'installationDate',
    label: 'Installed Date',
    field: 'installationDate',
    align: 'center',
    sortable: true
  },
  {
    name: 'deInstallationDate',
    label: 'De-Installed Date',
    field: 'deInstallationDate',
    align: 'center',
    sortable: true
  }
]

/* =======================
   Methods
======================= */
const formatDate = (val) => {
  if (!val) return 'NA'
  return moment(val).format('Do MMM YYYY')
}

const toggleDownloadPopup = () => {
  showDownloadPopup.value = !showDownloadPopup.value
}

const onRequest = async (props) => {
  const { pagination: p, filter: f } = props

  loading.value = true
  $q.loading.show({
    spinnerColor: 'purple-9',
    message: 'Fetching data...'
  })

  try {
    await store.dispatch('devicehistory/DEVICE_WITH_HISTORY', {
      pagination: p,
      filter: f
    })

    const response = store.getters['devicehistory/getDeviceWithHistory']

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
