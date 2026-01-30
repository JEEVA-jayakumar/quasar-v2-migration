<template>
  <q-page>
    <div>
      <!-- Table -->
      <q-table
        class="customTableClass q-py-none"
        :rows="tableData"
        :columns="columns"
        :filter="filter"
        :rows-per-page-options="[5, 10, 15, 20, 25]"
        v-model:pagination="paginationControl"
        :loading="toggleAjaxLoadFilter"
        row-key="tid"
        @request="ajaxLoadAllLeadInfo"
      >
        <!-- Top Filter -->
        <template v-slot:top>
          <div class="row full-width items-center bottom-border q-pb-sm">
            <div class="col">
              <q-select
                v-model="filter"
                label="Select SO"
                :options="soMenulistOptions"
                emit-value
                map-options
                clearable
                use-input
                color="grey-9"
              />
            </div>

            <div class="col-md-6 text-right">
              <q-btn
                square
                outline
                color="purple-9"
                label="Download as Excel"
                class="q-mr-lg q-py-sm"
                size="md"
                @click="toggleDownloadPopup"
              />
            </div>
          </div>
        </template>

        <!-- Custom Date Columns -->
        <template v-slot:body-cell-TidCreationDate="props">
          <q-td :props="props">
            {{ formatDate(props.row.TidCreationDate) }}
          </q-td>
        </template>

        <template v-slot:body-cell-ReceivedDate="props">
          <q-td :props="props">
            {{ formatDate(props.row.ReceivedDate) }}
          </q-td>
        </template>
      </q-table>

      <!-- Download Popup -->
      <DownloadFSEReport
        v-if="propFSEReport"
        :propFSEReport="propFSEReport"
        @emitfnshowFSEReport="toggleDownloadPopup"
      />

      <!-- Loader -->
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
/* ---------------- imports ---------------- */
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import moment from 'moment'
import DownloadFSEReport from '../components/DownloadFSEReport.vue'

/* ---------------- setup ---------------- */
const store = useStore()
const $q = useQuasar()

/* ---------------- state ---------------- */
const propFSEReport = ref(false)
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

const soMenulistOptions = ref([])

/* ---------------- columns ---------------- */
const columns = [
  { name: 'MID', label: 'MID', field: 'mid', align: 'left', sortable: true },
  { name: 'TID', label: 'TID', field: 'tid', align: 'left', sortable: true },
  {
    name: 'TidCreationDate',
    label: 'TID Creation Date',
    field: 'TidCreationDate',
    align: 'left',
    sortable: true
  },
  { name: 'Ageing', label: 'Ageing', field: 'Aging', align: 'left', sortable: true },
  { name: 'BPRegion', label: 'BP Region', field: 'BpRegion', align: 'left', sortable: true },
  {
    name: 'SO',
    label: 'SO Id',
    field: row => `${row.soId} | ${row.soEmpId}`,
    align: 'left',
    sortable: true
  },
  {
    name: 'ReceivedDate',
    label: 'Received Date',
    field: 'ReceivedDate',
    align: 'left',
    sortable: true
  },
  {
    name: 'DeviceType',
    label: 'Device Type',
    field: 'deviceType',
    align: 'left',
    sortable: true
  }
]

/* ---------------- helpers ---------------- */
const formatDate = value =>
  value ? moment(value).format('Do MMM YYYY') : 'NA'

/* ---------------- actions ---------------- */
const fnAjaxgetDeviceWithFse = async () => {
  try {
    await store.dispatch('FSEDevice/FSE_MENU')
    soMenulistOptions.value = store.getters['FSEDevice/getFseMenu'].map(v => ({
      label: `${v.name} | ${v.employeeID} | ${v.email}`,
      value: v.name
    }))
  } catch {
    soMenulistOptions.value = []
  }
}

const ajaxLoadAllLeadInfo = async ({ pagination, filter }) => {
  $q.loading.show({
    spinnerColor: 'purple-9',
    message: 'Fetching data ..'
  })

  try {
    await store.dispatch('FSE/DEVICE_WITH_FSE', { pagination, filter })
    const res = store.getters['FSE/getDeviceWithFse']

    tableData.value = res.content
    paginationControl.value.rowsNumber = res.totalElements
    paginationControl.value.page = res.number + 1

    if (res.sort?.length) {
      paginationControl.value.sortBy = res.sort[0].property
      paginationControl.value.descending = !res.sort[0].ascending
    }
  } finally {
    $q.loading.hide()
  }
}

const toggleDownloadPopup = () => {
  propFSEReport.value = !propFSEReport.value
}

/* ---------------- lifecycle ---------------- */
onMounted(() => {
  fnAjaxgetDeviceWithFse()
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
