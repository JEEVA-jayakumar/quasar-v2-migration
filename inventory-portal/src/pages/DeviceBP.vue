<template>
  <q-page>
    <div>
      <!-- Title -->
      <div
        class="col-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
      >
        Devices with BPRegions
      </div>

      <!-- Table -->
      <q-table
        class="customTableClass"
        :rows="tableData"
        :columns="columns"
        :filter="filter"
        row-key="tid"
        :loading="toggleAjaxLoadFilter"
        :rows-per-page-options="[5, 10, 15, 20, 25]"
        v-model:pagination="paginationControl"
        @request="ajaxLoadAllLeadInfo"
      >
        <!-- Top Slot -->
        <template v-slot:top>
          <div class="row full-width items-center bottom-border q-pb-sm">
            <div class="col-md-4">
              <q-select
                v-model="filter"
                label="Select a Region"
                color="grey-9"
                :options="getBpRegionsMenuOptions"
                emit-value
                map-options
                clearable
              />
            </div>

            <div class="col-md-8 text-right">
              <q-btn
                outline
                color="purple-9"
                label="Download as Excel"
                class="q-mr-lg q-py-sm"
                size="md"
                @click="downloadBpMenu"
              />
            </div>
          </div>
        </template>

        <!-- Custom Date Column -->
        <template v-slot:body-cell-TidCreationDate="props">
          <q-td :props="props">
            {{ formatDate(props.row.TidCreationDate) }}
          </q-td>
        </template>
      </q-table>

      <!-- Download Popup -->
      <DownloadBpRegionReport
        v-if="propBpRegionReport"
        :propBpRegionReport="propBpRegionReport"
        @emitfnshowBpRegionReport="downloadBpMenu"
      />

      <!-- Loader Overlay -->
      <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
        <q-spinner-bars
          class="absolute-center"
          color="purple-9"
          size="35"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
/* ----------------------- imports ----------------------- */
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import moment from 'moment'
import DownloadBpRegionReport from '../components/DownloadBpRegionReport.vue'

/* ----------------------- setup ----------------------- */
const store = useStore()
const $q = useQuasar()

/* ----------------------- state ----------------------- */
const propBpRegionReport = ref(false)
const filter = ref('')
const toggleAjaxLoadFilter = ref(false)
const tableData = ref([])

const paginationControl = ref({
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 10,
  sortBy: 'TidCreationDate',
  descending: false
})

const getBpRegionsMenuOptions = ref([])

/* ----------------------- columns ----------------------- */
const columns = [
  { name: 'MID', label: 'MID', field: 'mid', align: 'left' },
  { name: 'TID', label: 'TID', field: 'tid', align: 'left' },
  {
    name: 'TidCreationDate',
    label: 'TID Creation Date',
    field: 'TidCreationDate',
    align: 'left',
    sortable: true
  },
  {
    name: 'MerchantName',
    label: 'Merchant Name',
    field: 'MerchantName',
    align: 'left'
  },
  {
    name: 'BpRegion',
    label: 'Bp Region',
    field: 'BpRegion',
    align: 'left'
  },
  {
    name: 'SO',
    label: 'SO',
    field: row => `${row.soId} | ${row.soEmpId}`,
    align: 'left'
  },
  {
    name: 'Aging',
    label: 'Aging',
    field: 'Aging',
    align: 'left'
  },
  {
    name: 'DeviceType',
    label: 'Device Type',
    field: 'deviceType',
    align: 'left'
  },
  {
    name: 'PODdetails',
    label: 'POD Details',
    field: 'PODdetails',
    align: 'left'
  }
]

/* ----------------------- helpers ----------------------- */
const formatDate = val =>
  val ? moment(val).format('Do MMM YYYY') : 'NA'

/* ----------------------- actions ----------------------- */
const fnAjaxgetDeviceWithBpRegion = async () => {
  try {
    await store.dispatch('reg/BPREGION_MENU')
    getBpRegionsMenuOptions.value = store.getters['reg/getBpRegionMenu'].map(
      v => ({ label: v, value: v })
    )
  } catch {
    getBpRegionsMenuOptions.value = []
  }
}

const ajaxLoadAllLeadInfo = async ({ pagination, filter }) => {
  $q.loading.show({
    spinnerColor: 'purple-9',
    message: 'Fetching data ..'
  })

  try {
    await store.dispatch('region/DEVICE_WITH_BPREGION', {
      pagination,
      filter
    })

    const response = store.getters['region/getDeviceWithBpRegion']

    tableData.value = response.content
    paginationControl.value.rowsNumber = response.totalElements
    paginationControl.value.page = response.number + 1

    if (response.sort?.length) {
      paginationControl.value.sortBy = response.sort[0].property
      paginationControl.value.descending = !response.sort[0].ascending
    }
  } finally {
    $q.loading.hide()
  }
}

const downloadBpMenu = () => {
  propBpRegionReport.value = !propBpRegionReport.value
}

/* ----------------------- lifecycle ----------------------- */
onMounted(() => {
  fnAjaxgetDeviceWithBpRegion()
  ajaxLoadAllLeadInfo({
    pagination: paginationControl.value,
    filter: filter.value
  })
})
</script>

<style scoped>
.customTableClass {
  min-height: 300px;
}
</style>
