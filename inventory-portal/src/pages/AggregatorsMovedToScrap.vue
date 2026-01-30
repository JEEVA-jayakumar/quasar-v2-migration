<template>
  <q-page>
    <q-pull-to-refresh @refresh="onPullToRefresh">
      <!-- Title -->
      <div
        class="col-md-12 capitalize q-title q-px-lg q-py-md
               text-weight-regular bottom-border text-grey-9"
      >
        Aggregator Moved To Scrap
      </div>

      <!-- Table -->
      <q-table
        table-class="customTableClass"
        color="grey-9"
        :columns="columns"
        :rows="tableData"
        row-key="serialNumber"
        :loading="loading"
        :filter="filterSearch"
        v-model:pagination="pagination"
        :rows-per-page-options="[5, 10, 15, 20, 25]"
        @request="onRequest"
      >
        <!-- Top controls -->
        <template v-slot:top>
          <div class="row full-width items-center q-col-gutter-md">
            <div class="col-md-5">
              <q-input
                dense
                outlined
                clearable
                v-model="filterSearch"
                label="Search Using Device Serial Number"
                debounce="400"
              />
            </div>

            <div class="col-md-5">
              <q-btn
                outline
                color="purple-9"
                label="Download as Excel"
                class="float-right"
                @click="toggleDownloadPopup"
              />
            </div>
          </div>
        </template>
      </q-table>
    </q-pull-to-refresh>

    <!-- Download popup -->
    <DownloadAggregatorsMovedToScrap
      v-if="showDownloadPopup"
      :propMovedToScrapList="showDownloadPopup"
      @emitfnshowMovedToScrapList="toggleDownloadPopup"
    />

    <!-- Lead information popup -->
    <generalLeadInformation
      v-if="showLeadInfo"
      :leadInformation="leadInformation"
      :propToggleLeadInformationPop="showLeadInfo"
      @closeLeadInformation="toggleLeadInformation"
    />

    <!-- Fullscreen loader -->
    <div v-if="loading" class="fullscreen spinner-overlay">
      <q-spinner-bars
        class="absolute-center"
        color="purple-9"
        size="35"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

import DownloadAggregatorsMovedToScrap from '../components/DownloadAggregatorsMovedToScrap.vue'

// ------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------
const $q = useQuasar()
const store = useStore()

// ------------------------------------------------------------------
// State
// ------------------------------------------------------------------
const tableData = ref([])
const loading = ref(false)
const filterSearch = ref('')

const showDownloadPopup = ref(false)
const showLeadInfo = ref(false)
const leadInformation = ref(null)

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 0,
  sortBy: 'updatedAt',
  descending: true
})

// ------------------------------------------------------------------
// Columns (Quasar 2 format)
// ------------------------------------------------------------------
const columns = [
  {
    name: 'serialNumber',
    label: 'Device Serial Number',
    field: 'serialNumber',
    align: 'left',
    sortable: true
  },
  {
    name: 'deviceName',
    label: 'Device Type',
    align: 'left',
    field: row => row.aggregatorDevice?.deviceName ?? '-'
  },
  {
    name: 'updatedAt',
    label: 'Updated Date',
    align: 'center',
    sortable: true,
    field: row => new Date(row.updatedAt).toLocaleDateString()
  },
  {
    name: 'lostOrStolenRemarks',
    label: 'Remarks',
    field: 'lostOrStolenRemarks',
    align: 'left'
  }
]

// ------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------
const toggleDownloadPopup = () => {
  showDownloadPopup.value = !showDownloadPopup.value
}

const toggleLeadInformation = (lead = null) => {
  leadInformation.value = lead
  showLeadInfo.value = !showLeadInfo.value
}

const onPullToRefresh = done => {
  fetchData()
  done()
}

const onRequest = props => {
  pagination.value = props.pagination
  fetchData()
}

// ------------------------------------------------------------------
// API Call (Vuex)
// ------------------------------------------------------------------
const fetchData = async () => {
  loading.value = true

  $q.loading.show({
    message: 'Fetching data...',
    spinnerColor: 'purple-9'
  })

  try {
    await store.dispatch(
      'SendToRepair/FETCH_AGGREGATORS_ALL_MOVED_TO_SCRAP_DATA',
      {
        pagination: pagination.value,
        filter: filterSearch.value
      }
    )

    const response =
      store.getters['SendToRepair/getAggregatorsMovedToScrapDetails']

    tableData.value = response.content
    pagination.value.rowsNumber = response.totalElements
    pagination.value.page = response.number + 1
  } finally {
    loading.value = false
    $q.loading.hide()
  }
}

// ------------------------------------------------------------------
// Lifecycle
// ------------------------------------------------------------------
onMounted(fetchData)
</script>

<style scoped>
.spinner-overlay {
  background: rgba(255, 255, 255, 0.6);
}
</style>
