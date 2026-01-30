<template>
  <q-page>
    <div>
      <!-- TITLE -->
      <div
        class="q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
      >
        Bijlipay Inventory with Merchant
      </div>

      <!-- TABLE -->
      <q-table
        class="q-py-none"
        table-class="customTableClass"
        row-key="tid"
        :rows="tableData"
        :columns="columns"
        :loading="toggleAjaxLoadFilter"
        :rows-per-page-options="[100, 200, 300, 400, 500]"
        v-model:pagination="pagination"
        :filter="filter"
        @request="ajaxLoadAllLeadInfo"
      >
        <!-- TOP BAR -->
        <template #top>
          <div class="row full-width items-center">
            <div class="col">
              <q-input
                outlined
                dense
                debounce="400"
                clearable
                color="grey-9"
                v-model="filter"
                placeholder="Search by Device Serial Number, MID, TID, Merchant Name"
              />
            </div>

            <div class="col-md-6 text-right">
              <q-btn
                square
                outline
                color="purple-9"
                label="Download as Excel"
                class="q-ml-md"
                @click="toggleDownloadPopup"
              />
            </div>
          </div>
        </template>

        <!-- CUSTOM CELL -->
        <template #body-cell-deviceStatusDate="props">
          <q-td :props="props">
            {{ formatDate(props.row.deviceStatusDate) }}
          </q-td>
        </template>
      </q-table>

      <!-- DOWNLOAD POPUP -->
      <DownloadInventoryMerchant
        v-if="showDownloadPopup"
        :propInventoryWithMerchant="showDownloadPopup"
        @emitfnshowInventoryWithMerchant="toggleDownloadPopup"
      />

      <!-- FULLSCREEN LOADER -->
      <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
        <q-spinner-bars
          class="absolute-center"
          size="35"
          color="purple-9"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import moment from 'moment'
import DownloadInventoryMerchant from '../components/DownloadInventoryMerchant.vue'

/* STORE */
const store = useStore()

/* STATE */
const filter = ref('')
const tableData = ref([])
const toggleAjaxLoadFilter = ref(false)
const showDownloadPopup = ref(false)

/* PAGINATION (server-side) */
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
  sortBy: 'tid',
  descending: false
})

/* TABLE COLUMNS */
const columns = [
  {
    name: 'device_serial_number',
    label: 'Device Serial Number',
    field: row =>
      row.regionalInventory?.serialNumber ?? 'NA',
    sortable: true,
    align: 'left'
  },
  {
    name: 'device',
    label: 'Device Type',
    field: row => row.leadInformation.device.deviceName,
    align: 'left'
  },
  {
    name: 'deviceStatusDate',
    label: 'Implementation Date',
    field: 'deviceStatusDate',
    sortable: true,
    align: 'left'
  },
  {
    name: 'tid',
    label: 'TID',
    field: 'tid',
    sortable: true,
    align: 'left'
  },
  {
    name: 'mid',
    label: 'MID',
    field: 'mid',
    sortable: true,
    align: 'left'
  },
  {
    name: 'merchant',
    label: 'Merchant Name',
    field: row => row.leadInformation.leadName,
    align: 'left'
  },
  {
    name: 'region',
    label: 'Region',
    field: row => row.leadInformation.region.regionAreaName,
    align: 'left'
  },
  {
    name: 'address',
    label: 'Address',
    field: row => row.leadInformation.leadAddress,
    align: 'left'
  }
]

/* METHODS */
const formatDate = value => {
  if (!value) return 'NA'
  return moment(value).format('Do MMM YYYY')
}

const toggleDownloadPopup = () => {
  showDownloadPopup.value = !showDownloadPopup.value
}

/* SERVER REQUEST */
const ajaxLoadAllLeadInfo = ({ pagination: pg, filter }) => {
  toggleAjaxLoadFilter.value = true

  store
    .dispatch('InventoryCentral/FETCH_INVENTORY_WITH_MERCHANT_DATA', {
      pagination: pg,
      filter
    })
    .then(() => {
      const data = store.getters['InventoryCentral/getInventoryWithMerchantData']

      tableData.value = data.content
      pagination.value.page = data.number + 1
      pagination.value.rowsNumber = data.totalElements

      if (data.sort?.length) {
        pagination.value.sortBy = data.sort[0].property
        pagination.value.descending = !data.sort[0].ascending
      }
    })
    .finally(() => {
      toggleAjaxLoadFilter.value = false
    })
}

/* INITIAL LOAD */
onMounted(() => {
  ajaxLoadAllLeadInfo({
    pagination: pagination.value,
    filter: filter.value
  })
})
</script>

<style>
.spinner-overlay {
  background: rgba(255, 255, 255, 0.6);
  z-index: 9999;
}
</style>
