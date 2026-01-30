<template>
  <q-page>
    <div>
      <!-- Title -->
      <div
        class="col-md-6 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
      >
        Bijlipay POD List
      </div>

      <!-- Table -->
      <q-table
        table-class="customTableClass"
        :rows="tableData"
        :columns="columns"
        row-key="podNumber"
        :loading="toggleAjaxLoadFilter"
        v-model:pagination="paginationControl"
        :rows-per-page-options="[5, 10, 15, 20, 25]"
        :filter="filter"
        @request="ajaxLoadAllLeadInfo"
      >
        <!-- TOP SLOT -->
        <template #top>
          <div class="row full-width items-center">
            <div class="col-md-5">
              <q-input
                dense
                outlined
                debounce="300"
                v-model="filter"
                placeholder="Search By Pod Number, BP Region"
                color="grey-9"
                clearable
              />
            </div>

            <div class="col-md-6 text-right">
              <q-btn
                outline
                color="purple-9"
                label="Download as Excel"
                class="q-mr-lg"
                @click="downloadPodList"
              />
            </div>
          </div>
        </template>

        <!-- ACTION COLUMN -->
        <template #body-cell-action="props">
          <q-td :props="props">
            <q-btn
              flat
              dense
              no-caps
              icon="edit"
              label="Modify"
              class="text-light-blue"
              @click="fnShowEditRegion(props.row)"
            />
          </q-td>
        </template>

        <!-- RECEIVED DATE -->
        <template #body-cell-receivedAt="props">
          <q-td :props="props">
            {{ formatDate(props.row.receivedAt) }}
          </q-td>
        </template>

        <!-- CREATED DATE -->
        <template #body-cell-createdAt="props">
          <q-td :props="props">
            {{ formatDate(props.row.createdAt) }}
          </q-td>
        </template>
      </q-table>

      <!-- DOWNLOAD POD -->
      <DownloadPod
        v-if="propPodListDatas"
        :propPodListDatas="propPodListDatas"
        @emitfnshowPodList="downloadPodList"
      />

      <!-- EDIT REGION -->
      <editRegion
        v-if="propShowEditRegion"
        :propShowEditRegion="propShowEditRegion"
        :propRowDetails="propRowDetails"
        @emitfnshowEditRegion="fnShowEditRegion"
      />

      <!-- FULLSCREEN SPINNER -->
      <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
        <q-spinner-bars class="absolute-center" color="purple-9" size="35" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import moment from 'moment'

import editRegion from '../components/editRegion.vue'
import DownloadPod from '../components/DownloadPod.vue'

/* ------------------------------------------------------------------
   Setup
------------------------------------------------------------------ */
const $q = useQuasar()
const store = useStore()

/* ------------------------------------------------------------------
   State
------------------------------------------------------------------ */
const tableData = ref([])
const filter = ref('')
const toggleAjaxLoadFilter = ref(false)

const propShowEditRegion = ref(false)
const propPodListDatas = ref(false)
const propRowDetails = ref(null)

const paginationControl = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
  sortBy: 'createdAt',
  descending: false
})

/* ------------------------------------------------------------------
   Columns
------------------------------------------------------------------ */
const columns = [
  {
    name: 'podNumber',
    label: 'Pod Number',
    field: 'podNumber',
    align: 'center',
    sortable: true
  },
  {
    name: 'device',
    label: 'Device Type',
    align: 'center',
    field: row => row.device?.deviceName
  },
  {
    name: 'receivedAt',
    label: 'Received Date',
    align: 'center'
  },
  {
    name: 'createdAt',
    label: 'Create Date',
    align: 'center'
  },
  {
    name: 'region',
    label: 'BP Region',
    align: 'center',
    field: row => row.region?.regionAreaName
  },
  {
    name: 'action',
    label: 'Modify POD',
    align: 'left'
  }
]

/* ------------------------------------------------------------------
   Helpers
------------------------------------------------------------------ */
const formatDate = value => {
  if (!value) return 'NA'
  return moment(value).format('DD MMM YYYY')
}

/* ------------------------------------------------------------------
   API Calls
------------------------------------------------------------------ */
const ajaxLoadAllLeadInfo = async ({ pagination, filter }) => {
  toggleAjaxLoadFilter.value = true
  $q.loading.show({ message: 'Fetching data...' })

  try {
    await store.dispatch('PodList/FETCH_POD_LIST', { pagination, filter })

    const response = store.getters['PodList/getAllPodList']

    tableData.value = response.content
    paginationControl.value.rowsNumber = response.totalElements
    paginationControl.value.page = response.number + 1
  } finally {
    toggleAjaxLoadFilter.value = false
    $q.loading.hide()
  }
}

/* ------------------------------------------------------------------
   UI Actions
------------------------------------------------------------------ */
const downloadPodList = () => {
  propPodListDatas.value = !propPodListDatas.value
}

const fnShowEditRegion = row => {
  propShowEditRegion.value = !propShowEditRegion.value
  if (row) propRowDetails.value = row
}

/* ------------------------------------------------------------------
   Lifecycle
------------------------------------------------------------------ */
onMounted(() => {
  ajaxLoadAllLeadInfo({
    pagination: paginationControl.value,
    filter: filter.value
  })
})
</script>

<style scoped>
.spinner-overlay {
  background: rgba(255, 255, 255, 0.6);
}
</style>
