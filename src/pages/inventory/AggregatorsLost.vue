<template>
  <q-page>
    <!-- Title -->
    <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
      Aggregator Lost Or Stolen Devices
    </div>

    <!-- Lead Information Popup -->
    <generalLeadInformation
      v-if="propToggleLeadInformation"
      :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation"
      @closeLeadInformation="toggleLeadInformation"
    />

    <!-- Table -->
    <q-table
      class="customTableClass"
      :rows="tableData"
      :columns="columns"
      row-key="serialNumber"
      v-model:pagination="paginationControl"
      :filter="filterSearch"
      :loading="toggleAjaxLoadFilter"
      :rows-per-page-options="[5, 10, 15, 20, 25]"
      @request="onRequest"
    >
      <!-- Top slot -->
      <template v-slot:top>
        <div class="row full-width items-center q-gutter-md">
          <div class="col-md-5">
            <q-input
              dense
              outlined
              debounce="500"
              v-model="filterSearch"
              color="grey-9"
              placeholder="Search Using Device Serial Number"
            />
          </div>

          <div class="col-md-5 text-right">
            <q-btn
              outline
              color="purple-9"
              label="Download as Excel"
              @click="downloadAggregatorsLostOrStolenList"
            />
          </div>
        </div>
      </template>

      <!-- Updated Date Column -->
      <template v-slot:body-cell-updated_at="props">
        <q-td :props="props">
          {{ props.row.updated_at ? formatDate(props.row.updated_at) : 'NA' }}
        </q-td>
      </template>
    </q-table>

    <!-- Download Modal -->
    <DownloadAggregatorsLostOrStolen
      v-if="propLostOrStolenList"
      :propLostOrStolenList="propLostOrStolenList"
      @emitfnshowLostOrStolenList="downloadAggregatorsLostOrStolenList"
    />

    <!-- Merchant Transaction Popup -->
    <showMerchantTransactionLevelDetails
      v-if="valueToggleMerchantTransaction"
      :valueToggleMerchantTransaction="valueToggleMerchantTransaction"
      @revertRowClick="rowClick"
    />

    <!-- Loader -->
    <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
      <q-spinner-bars class="absolute-center" style="color:#61116a" size="35px" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import moment from 'moment'

import DownloadAggregatorsLostOrStolen from '../../components/inventory/DownloadAggregatorsLostOrStolen.vue'
import showMerchantTransactionLevelDetails from '../../components/sat/showMerchantTransactionLevelDetails.vue'
import generalLeadInformation from '../../components/generalLeadInformation.vue'

const $q = useQuasar()
const store = useStore()

/* -------------------- State -------------------- */
const propToggleLeadInformation = ref(false)
const propLostOrStolenList = ref(false)
const toggleAjaxLoadFilter = ref(false)
const valueToggleMerchantTransaction = ref(false)
const addtnLeadInformation = ref(null)
const filterSearch = ref('')
const tableData = ref([])

const paginationControl = reactive({
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 0,
  sortBy: 'serialNumber',
  descending: false
})

/* -------------------- Columns -------------------- */
const columns = [
  {
    name: 'serialNumber',
    label: 'Device Serial Number',
    field: 'serialNumber',
    align: 'left'
  },
  {
    name: 'device',
    label: 'Device Type',
    field: row => row.aggregatorDevice?.deviceName || 'NA',
    align: 'left'
  },
  {
    name: 'updated_at',
    label: 'Receive Date',
    field: 'updated_at',
    align: 'center'
  }
]

/* -------------------- Methods -------------------- */
const formatDate = date =>
  moment(date).format('DD/MM/YYYY')

const downloadAggregatorsLostOrStolenList = () => {
  propLostOrStolenList.value = !propLostOrStolenList.value
}

const toggleLeadInformation = (leadDetails) => {
  propToggleLeadInformation.value = !propToggleLeadInformation.value
  if (leadDetails) {
    addtnLeadInformation.value = leadDetails
  }
}

/* QTable server-side request */
const onRequest = async ({ pagination, filter }) => {
  toggleAjaxLoadFilter.value = true
  $q.loading.show({ message: 'Fetching data...' })

  try {
    await store.dispatch(
      'inventoryStolenData/FETCH_AGGREGATORS_INVENTORY_STOLEN_DATA',
      { pagination, filter }
    )

    const response = store.getters[
      'inventoryStolenData/getAggregatorsinventoryStolenData'
    ]

    tableData.value = response.content || []
    paginationControl.rowsNumber = response.totalElements
    paginationControl.page = response.number + 1

    if (response.sort?.length) {
      paginationControl.sortBy = response.sort[0].property
      paginationControl.descending = !response.sort[0].ascending
    }
  } finally {
    toggleAjaxLoadFilter.value = false
    $q.loading.hide()
  }
}

/* Initial load */
onRequest({
  pagination: paginationControl,
  filter: filterSearch.value
})
</script>

<style scoped>
.customTableClass {
  min-height: 300px;
}
</style>
