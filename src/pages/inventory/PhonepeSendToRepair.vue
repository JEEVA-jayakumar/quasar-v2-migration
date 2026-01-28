<template>
  <q-page>
    <q-pull-to-refresh @refresh="pullToRefresh">
      <!-- Title -->
      <div class="q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Send To Repair
      </div>

      <!-- Table -->
      <q-table
        class="customTableClass"
        :columns="columns"
        :rows="tableData"
        row-key="serialNumber"
        color="grey-9"
        :filter="filterSearch"
        v-model:pagination="pagination"
        :rows-per-page-options="[5, 10, 15, 20, 25]"
        :loading="loading"
        @request="ajaxLoadAllLeadInfo"
      >
        <!-- Top Section -->
        <template #top>
          <div class="row full-width items-center q-gutter-md">
            <div class="col-md-4">
              <q-input
                dense
                outlined
                clearable
                v-model="filterSearch"
                label="Search Using Device Serial Number"
              />
            </div>

            <div class="col-md-4">
              <q-btn
                outline
                color="purple-9"
                label="Download as Excel"
                @click="toggleDownload"
              />
            </div>

            <div class="col-md-4 text-right">
              <q-btn
                outline
                color="grey-9"
                icon="attach_file"
                label="Bulk Upload"
                @click="toggleBulkModal"
              />
            </div>
          </div>
        </template>

        <!-- Body -->
        <template #body="props">
          <q-tr :props="props" class="bottom-border">
            <q-td>{{ props.row.device.deviceName }}</q-td>
            <q-td>{{ props.row.serialNumber }}</q-td>
            <q-td class="text-center">
              {{ formatDate(props.row.updatedAt) }}
            </q-td>
            <q-td class="text-center">
              <q-btn
                color="positive"
                size="sm"
                label="Accept"
                class="q-mr-sm"
                @click="openAcceptModel(props.row)"
              />
              <q-btn
                color="negative"
                size="sm"
                label="Moved To Scrap"
                @click="moveToScrap(props.row)"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-pull-to-refresh>

    <!-- Download Modal -->
    <PhonepeDownloadSendToRepair
      v-if="showDownload"
      :propSendToRepair="showDownload"
      @emitfnshowSendToRepair="toggleDownload"
    />

    <!-- Bulk Upload -->
    <PhonepeOpenAddBulkModelComp
      v-if="showBulkModal"
      :propOpenBulkModal="showBulkModal"
      @closeModel="toggleBulkModal"
      @emitToggleinventoryBulkUploadOnSuccess="reloadData"
    />

    <!-- Move to Scrap -->
    <phonepemoveToScrapComp
      v-if="showScrapModal"
      :showScrapModel="showScrapModal"
      :propShowScrapComponent="selectedRow"
      @closeScrapModel="moveToScrap"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import moment from 'moment'

import phonepemoveToScrapComp from '../../components/inventory/phonepemoveToScrapComp.vue'
import PhonepeOpenAddBulkModelComp from '../../components/inventory/PhonepeOpenAddBulkModelComp.vue'
import PhonepeDownloadSendToRepair from '../../components/inventory/PhonepeDownloadSendToRepair.vue'

const $q = useQuasar()
const store = useStore()

const filterSearch = ref('')
const loading = ref(false)

const showBulkModal = ref(false)
const showDownload = ref(false)
const showScrapModal = ref(false)
const selectedRow = ref(null)

const tableData = ref([])

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 0,
  sortBy: 'serialNumber',
  descending: false
})

const columns = [
  { name: 'device', label: 'Device Type', align: 'left' },
  { name: 'serialNumber', label: 'Device Serial Numbers', align: 'left' },
  { name: 'updatedAt', label: 'Receive Date', align: 'center' },
  { name: 'action', label: '', align: 'center' }
]

const formatDate = (date) =>
  date ? moment(date).format('Do MMM YYYY') : 'NA'

const ajaxLoadAllLeadInfo = async ({ pagination, filter }) => {
  loading.value = true
  $q.loading.show({ message: 'Fetching data...' })

  try {
    await store.dispatch('AggregatorSendToRepair/FETCH_PHONEPE_SEND_TO_REPAIR_DETAILS', {
      pagination,
      filter
    })

    const res = store.getters['AggregatorSendToRepair/getPhonepeSendToRepairDetails']
    tableData.value = res.content
    pagination.rowsNumber = res.totalElements
    pagination.page = res.number + 1
  } finally {
    loading.value = false
    $q.loading.hide()
  }
}

const pullToRefresh = (done) => {
  ajaxLoadAllLeadInfo({ pagination: pagination.value, filter: filterSearch.value })
  done()
}

const toggleBulkModal = () => (showBulkModal.value = !showBulkModal.value)
const toggleDownload = () => (showDownload.value = !showDownload.value)

const reloadData = () => {
  ajaxLoadAllLeadInfo({ pagination: pagination.value, filter: filterSearch.value })
}

const moveToScrap = (row) => {
  selectedRow.value = row || null
  showScrapModal.value = !showScrapModal.value
}

const openAcceptModel = (row) => {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure want to approve ?',
    ok: 'Continue',
    cancel: 'Cancel'
  }).onOk(async () => {
    $q.loading.show({ message: 'Processing...' })
    try {
      await store.dispatch('AggregatorSendToRepair/APPROVE_PHONEPE_SEND_TO_REPAIR', row)
      $q.notify({ type: 'positive', message: 'Successfully Approved!' })
      reloadData()
    } catch {
      $q.notify({ type: 'negative', message: 'Please try again later!' })
    } finally {
      $q.loading.hide()
    }
  })
}

onMounted(() => {
  ajaxLoadAllLeadInfo({ pagination: pagination.value, filter: filterSearch.value })
})
</script>
