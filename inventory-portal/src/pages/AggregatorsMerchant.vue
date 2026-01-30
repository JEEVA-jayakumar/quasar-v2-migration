<template>
  <q-page>
    <!-- Title -->
    <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
      Aggregator Inventory with Merchant
    </div>

    <!-- Table -->
    <q-table
      class="customTableClass q-py-none"
      row-key="tid"
      :rows="tableData"
      :columns="columns"
      :filter="filter"
      :loading="toggleAjaxLoadFilter"
      :rows-per-page-options="[100, 200, 300, 400, 500]"
      v-model:pagination="paginationControl"
      @request="onRequest"
    >
      <!-- Top -->
      <template v-slot:top>
        <div class="row full-width items-center q-gutter-md">
          <div class="col">
            <q-input
              dense
              outlined
              debounce="500"
              v-model="filter"
              color="grey-9"
              placeholder="Search by Device Serial Number, MID, TID, Merchant Name"
            />
          </div>

          <div class="col-md-6 text-right">
            <q-btn
              outline
              color="purple-9"
              label="Download as Excel"
              @click="toggleDownload"
            />
          </div>
        </div>
      </template>

      <!-- Implementation Date -->
      <template v-slot:body-cell-deviceStatusDate="props">
        <q-td :props="props">
          {{ formatDate(props.row.deviceStatusDate) }}
        </q-td>
      </template>
    </q-table>

    <!-- Download Modal -->
    <DownloadAggregatorsInventoryMerchant
      v-if="propInventoryWithMerchant"
      :propInventoryWithMerchant="propInventoryWithMerchant"
      @emitfnshowInventoryWithMerchant="toggleDownload"
    />

    <!-- Loader -->
    <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
      <q-spinner-bars
        class="absolute-center"
        style="color:#61116a"
        size="35px"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import moment from 'moment'

import DownloadAggregatorsInventoryMerchant
  from '../components/DownloadAggregatorsInventoryMerchant.vue'

/* -------------------- setup -------------------- */
const $q = useQuasar()
const store = useStore()

/* -------------------- state -------------------- */
const filter = ref('')
const tableData = ref([])
const toggleAjaxLoadFilter = ref(false)
const propInventoryWithMerchant = ref(false)

const paginationControl = reactive({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
  sortBy: 'tid',
  descending: false
})

/* -------------------- columns -------------------- */
const columns = [
  {
    name: 'serial',
    label: 'Device Serial Number',
    field: row =>
      row.aggregatorRegionalInventory?.serialNumber ?? 'NA',
    align: 'left',
    sortable: true
  },
  {
    name: 'device',
    label: 'Device Type',
    field: row =>
      row.leadInformation?.aggregatorDevice?.deviceName ?? 'NA',
    align: 'left'
  },
  {
    name: 'deviceStatusDate',
    label: 'Implementation Date',
    field: 'deviceStatusDate',
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
    name: 'mid',
    label: 'MID',
    field: 'mid',
    align: 'left',
    sortable: true
  },
  {
    name: 'merchant',
    label: 'Merchant Name',
    field: row => row.leadInformation?.leadName ?? 'NA',
    align: 'left'
  },
  {
    name: 'region',
    label: 'Region',
    field: row =>
      row.leadInformation?.region?.regionAreaName ?? 'NA',
    align: 'left'
  },
  {
    name: 'address',
    label: 'Address',
    field: row => row.leadInformation?.leadAddress ?? 'NA',
    align: 'left'
  }
]

/* -------------------- helpers -------------------- */
const formatDate = value =>
  value ? moment(value).format('Do MMM YYYY') : 'NA'

const toggleDownload = () => {
  propInventoryWithMerchant.value = !propInventoryWithMerchant.value
}

/* -------------------- table request -------------------- */
const onRequest = async ({ pagination, filter }) => {
  toggleAjaxLoadFilter.value = true
  $q.loading.show({ message: 'Fetching data...' })

  try {
    await store.dispatch(
      'InventoryCentral/FETCH_AGGREGATORS_INVENTORY_WITH_MERCHANT_DATA',
      { pagination, filter }
    )

    const response = store.getters[
      'InventoryCentral/getAggregatorsInventoryWithMerchantData'
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

/* initial load */
onRequest({
  pagination: paginationControl,
  filter: filter.value
})
</script>

<style scoped>
.customTableClass {
  min-height: 300px;
}
</style>
