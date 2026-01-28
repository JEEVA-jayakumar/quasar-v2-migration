<template>
  <q-page>
    <div>
      <!-- Page Header -->
      <div class="q-title q-px-lg q-py-md text-grey-9"></div>

      <!-- Lead Info Popup -->
      <generalLeadInformation
        v-if="showLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="showLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />

      <!-- Table -->
      <q-table
        class="customTableClass"
        :rows="tableData"
        :columns="columns"
        row-key="pod_number"
        color="grey-9"
        :filter="filterSearch"
        v-model:pagination="pagination"
        :rows-per-page-options="[5,10,15,20,25]"
        :loading="toggleAjaxLoadFilter"
        @request="ajaxLoadAllLeadInfo"
      >
        <!-- Search -->
        <template #top>
          <div class="row q-col-gutter-md">
            <div class="col-md-5">
              <q-input
                dense
                outlined
                clearable
                v-model="filterSearch"
                label="Search Using POD Number"
              />
            </div>

            <div class="col-md-5">
              <q-btn
                color="purple-9"
                label="Add Spare"
                @click="router.push('/inventory/master/PhonepesparePartsInventory')"
              />
            </div>
          </div>
        </template>

        <!-- Dates -->
        <template #body-cell-created_date="props">
          <q-td>{{ formatDate(props.row.created_date) }}</q-td>
        </template>

        <template #body-cell-updated_date="props">
          <q-td>{{ formatDate(props.row.updated_date) }}</q-td>
        </template>

        <!-- Region -->
        <template #body-cell-regionAreaName="props">
          <q-td>
            {{ props.row.allocate_region?.regionAreaName || 'NA' }}
          </q-td>
        </template>

        <!-- SO -->
        <template #body-cell-name="props">
          <q-td>
            {{
              props.row.allocate_so
                ? `${props.row.allocate_so.name} | ${props.row.allocate_so.employeeID}`
                : 'NA'
            }}
          </q-td>
        </template>

        <!-- Status -->
        <template #body-cell-status="props">
          <q-td>
            <span
              class="label"
              :class="statusClass(props.row.status)"
            >
              {{ statusText(props.row.status) }}
            </span>
          </q-td>
        </template>

        <!-- Action -->
        <template #body-cell-action="props">
          <q-td align="center">
            <q-btn
              size="sm"
              color="positive"
              label="Update"
              :disable="disableUpdate(props.row)"
              @click="updatePodDetails(props.row)"
            />
          </q-td>
        </template>
      </q-table>

      <!-- Loader Overlay -->
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
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import moment from 'moment'

import generalLeadInformation from '../../components/generalLeadInformation.vue'

const $q = useQuasar()
const store = useStore()
const router = useRouter() // Added router import

/* ---------------- STATE ---------------- */
const showLeadInformation = ref(false) // Renamed for clarity
const toggleAjaxLoadFilter = ref(false)
const addtnLeadInformation = ref(null)

const tableData = ref([])
const filterSearch = ref('')

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 0,
  sortBy: 'updated_date',
  descending: false
})

/* ---------------- TABLE COLUMNS ---------------- */
const columns = [
  { name: 'pod_number', label: 'Pod Number', field: 'pod_number', align: 'left' },
  { name: 'total_count', label: 'Total Count', field: 'total_count', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'regionAreaName', label: 'Region', align: 'left' },
  { name: 'name', label: 'Assigned SO', align: 'left' },
  { name: 'created_date', label: 'Created Date', align: 'left' },
  { name: 'updated_date', label: 'Updated Date', align: 'left' },
  { name: 'action', label: '', align: 'center' }
]

/* ---------------- HELPERS ---------------- */
const formatDate = d => (d ? moment(d).format('Do MMM YYYY') : 'NA')

const statusText = status =>
  ({
    1: 'Created',
    2: 'Assigned to R.I',
    3: 'Approved By R.I',
    4: 'Assigned To SO',
    5: 'Approved By SO',
    6: 'Rejected'
  }[status] || 'NA')

const statusClass = status =>
  ({
    1: 'text-positive',
    2: 'text-primary',
    3: 'text-orange',
    4: 'text-orange',
    5: 'text-orange',
    6: 'text-negative'
  }[status])

const disableUpdate = row =>
  [1, 3, 5, 6].includes(row.status) ||
  (row.status === 6 && row.owner === 2)

/* ---------------- API ---------------- */
const ajaxLoadAllLeadInfo = async ({ pagination: tablePagination, filter }) => {
  toggleAjaxLoadFilter.value = true
  $q.loading.show({ message: 'Fetching data...' })

  try {
    await store.dispatch(
      'sparePartsPodListInventoryDetails/FETCH_PHONEPE_SPARE_PARTS_POD_LIST_INVENTORY_DETAILS',
      { pagination: tablePagination, filter }
    )

    const res =
      store.getters[
        'sparePartsPodListInventoryDetails/getPhonepesparePartsPodListDetails'
      ]

    tableData.value = res.content || []
    pagination.value.rowsNumber = res.totalElements || 0
    pagination.value.page = (res.number || 0) + 1
  } catch (error) {
    console.error('Error loading lead info:', error)
    tableData.value = []
  } finally {
    toggleAjaxLoadFilter.value = false
    $q.loading.hide()
  }
}

const updatePodDetails = row => {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure want to Update?',
    ok: 'Continue',
    cancel: 'Cancel'
  }).onOk(async () => {
    $q.loading.show({ message: 'Processing...' })
    try {
      await store.dispatch(
        'getInventoryUpdatedPodDetails/FETCH_PHONEPE_INVENTORY_UPDATED_POD_DETAILS',
        { podNumber: row.pod_number }
      )

      const data =
        store.getters[
          'getInventoryUpdatedPodDetails/getPhonepeInventoryUpdatedPodDetails'
        ]

      router.push({ 
        name: 'PhonepeUpdateSparePartsPodList', 
        params: { data } 
      })
    } catch {
      $q.notify({
        color: 'negative',
        message: 'Failed to update pod details',
        icon: 'error'
      })
    } finally {
      $q.loading.hide()
    }
  })
}

const toggleLeadInformation = lead => {
  showLeadInformation.value = !showLeadInformation.value
  if (lead) addtnLeadInformation.value = lead
}

/* ---------------- INIT ---------------- */
onMounted(() => {
  ajaxLoadAllLeadInfo({
    pagination: pagination.value,
    filter: filterSearch.value
  })
})
</script>

<style scoped>
.spinner-overlay {
  background: rgba(255, 255, 255, 0.7);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>