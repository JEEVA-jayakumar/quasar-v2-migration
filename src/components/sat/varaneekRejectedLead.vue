<template>
  <q-page>
    <generalLeadInformation
      v-if="propToggleLeadInformation"
      :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation"
      @closeLeadInformation="toggleLeadInformation"
    />

    <q-tab-panel name="rejectedTab">
      <q-table
        class="customTableClass"
        :rows="tableData"
        :columns="columnData"
        row-key="id"
        :loading="tableAjaxLoading"
        :filter="filterSearch"
        v-model:pagination="paginationControl"
        v-model:selected="formData.marsDeviceIdsCookedUnAssinged"
        :rows-per-page-options="[10, 20, 50, 100, 150, 200]"
        @request="ajaxLoadAllLeadInfo"
      >
        <!-- Lead Number -->
        <template #body-cell-leadNumber="{ row }">
          <q-td class="cursor-pointer" @click="toggleLeadInformation(row.leadNumber)">
            <span class="text-primary"># {{ row.leadNumber }}</span>
          </q-td>
        </template>

        <!-- Submit Date -->
        <template #body-cell-submitToMarsDate="{ row }">
          <q-td>{{ formatDate(row.submitToMarsDate) }}</q-td>
        </template>

        <!-- Top Search -->
        <template #top>
          <div class="col-md-5">
            <q-input
              v-model="filterSearch"
              debounce="300"
              clearable
              dense
              label="Search By Lead Number"
              class="q-mr-lg q-py-sm"
            />
          </div>
        </template>
      </q-table>
    </q-tab-panel>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { Loading } from 'quasar'
import moment from 'moment'

import generalLeadInformation from '../../components/generalLeadInformation.vue'

/* ================= STORE ================= */
const store = useStore()

/* ================= STATE ================= */
const propToggleLeadInformation = ref(false)
const addtnLeadInformation = ref(null)

const filterSearch = ref('')
const tableData = ref([])
const tableAjaxLoading = ref(false)

const formData = ref({
  marsDeviceIdsCooked: [],
  marsDeviceIdsCookedUnAssinged: []
})

const paginationControl = ref({
  sortBy: 'createdAt',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

/* ================= GETTERS ================= */
const getrejectStatusList = computed(
  () => store.getters['varaneekImplementationQueue/getrejectStatusList']
)


/* ================= COLUMNS ================= */
const columnData = [
  {
    name: 'leadNumber',
    label: 'Lead Number',
    field: row => row.leadNumber
  },
  {
    name: 'submitToMarsDate',
    label: 'Date of Submission',
    field: row => row.submitToMarsDate,
    sortable: true
  },
  {
    name: 'leadInformation',
    label: 'Device Type',
    field: row => row.device?.deviceName ?? 'NA'
  },
  {
    name: 'rejectedAt',
    label: 'Rejected At',
    field: row => row.marsReason ?? 'NA'
  },
  {
    name: 'reason',
    label: 'Reason',
    field: row => row.marsReason ?? 'NA'
  }
]

/* ================= METHODS ================= */
const formatDate = (date) => {
  return date ? moment(date).format('Do MMM Y') : 'NA'
}

const toggleLeadInformation = (leadDetails) => {
  propToggleLeadInformation.value = !propToggleLeadInformation.value
  if (leadDetails !== undefined) {
    addtnLeadInformation.value = leadDetails
  }
}

const ajaxLoadAllLeadInfo = async ({ pagination, filter }) => {
  tableAjaxLoading.value = true
  Loading.show({ message: 'Fetching data...' })

  try {
    await store.dispatch('varaneekImplementationQueue/REJECT_STATUS_LIST', {
      pagination,
      filter
    })

    await store.dispatch('ImplementationExecutive/IMPLEMENTATION_EXECUTIVE_LIST')

    paginationControl.value.rowsNumber = getrejectStatusList.value.totalElements
    paginationControl.value.page = getrejectStatusList.value.number + 1

    if (getrejectStatusList.value.sort) {
      paginationControl.value.sortBy = getrejectStatusList.value.sort[0].property
      paginationControl.value.descending =
        !getrejectStatusList.value.sort[0].ascending
    }

    tableData.value = getrejectStatusList.value.content
  } finally {
    tableAjaxLoading.value = false
    Loading.hide()
  }
}

/* ================= INIT ================= */
onMounted(() => {
  ajaxLoadAllLeadInfo({
    pagination: paginationControl.value,
    filter: filterSearch.value
  })
  store.dispatch('SuperAdminUsers/FETCH_ALL_STATES_DATA')
})
</script>

<style scoped>
.customTd {
  text-align: left !important;
  word-wrap: break-word;
  white-space: normal;
}
.customTd.customCellLength {
  min-width: 300px !important;
  overflow-x: auto;
}
</style>
