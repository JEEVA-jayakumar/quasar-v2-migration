<template>
  <q-page>
    <div
      class="col-md-12 text-h6 q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
    >
      Bijlipay Service Request
    </div>

    <q-tabs
      v-model="selectedTab"
      class="shadow-1"
      color="grey-1"
      @update:model-value="goToUnassignedTab"
    >
      <q-tab name="opened" label="Opened" />
      <q-tab name="closed" label="Closed" />
      <q-tab name="cancel" label="Cancelled" />

      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="opened">
          <opened />
        </q-tab-panel>

        <q-tab-panel name="cancel">
          <cancelledInternal />
        </q-tab-panel>

        <q-tab-panel name="closed">
          <q-table
            :rows="internalClosedTableData"
            :columns="columnDataclosed"
            row-key="id"
            :filter="filterSearch"
            v-model:pagination="paginationControl2"
            v-model:selected="formData.marsDeviceIdsCookedUnAssinged"
            :loading="tableAjaxLoading"
            :rows-per-page-options="[5, 10, 15, 20]"
            @request="ajaxLoadAllLeadInfo2"
            table-class="customTableClass"
          >
            <!-- SEARCH -->
            <template #top>
              <q-input
                dense
                outlined
                debounce="300"
                v-model="filterSearch"
                placeholder="Search by ServiceReqTicketId, TID"
                clearable
                color="grey-9"
                class="q-mr-lg q-py-sm"
              />
            </template>

            <!-- BODY -->
            <template #body="props">
              <q-tr :props="props" class="bottom-border">
                <q-td>
                  <q-checkbox
                    v-model="props.row.expand"
                    checked-icon="expand_less"
                    unchecked-icon="expand_more"
                    @update:model-value="expandRowPlease(props.row)"
                  />
                  {{ props.row.serviceReqTicketId }}
                </q-td>

                <q-td>{{ props.row.tid ?? 'NA' }}</q-td>
                <q-td>{{ props.row.mid ?? 'NA' }}</q-td>
                <q-td>{{ formatDate(props.row.createdDate) }}</q-td>
                <q-td>{{ formatDate(props.row.updatedDate) }}</q-td>
                <q-td>{{ props.row.meName ?? 'NA' }}</q-td>
                <q-td>{{ props.row.bpRegion?.regionAreaName ?? 'NA' }}</q-td>
                <q-td>{{ props.row.assignedTo?.name ?? 'NA' }}</q-td>
                <!-- FIXED: Wrap v-html in span inside q-td -->
                <q-td>
                  <span v-if="props.row.crmRemark" v-html="props.row.crmRemark"></span>
                  <span v-else>NA</span>
                </q-td>
                <q-td>{{ props.row.deviceType ?? 'NA' }}</q-td>

                <q-td>
                  <q-badge
                    v-if="props.row.serviceRequestTicketStatus === 1"
                    color="positive"
                  >
                    REQUEST_UNASSIGNED
                  </q-badge>
                  <q-badge
                    v-else-if="props.row.serviceRequestTicketStatus === 2"
                    color="negative"
                  >
                    REQUEST_ASSIGNED
                  </q-badge>
                  <q-badge
                    v-else-if="props.row.serviceRequestTicketStatus === 3"
                    color="negative"
                  >
                    REQUEST_CLOSED
                  </q-badge>
                  <span v-else>NA</span>
                </q-td>

                <q-td>{{ props.row.serviceRequestMode ?? 'NA' }}</q-td>
              </q-tr>

              <!-- EXPAND -->
              <q-tr v-show="props.row.expand">
                <q-td colspan="100%">
                  <div
                    v-for="sub in props.row.subTicketsList"
                    :key="sub.id"
                    class="q-pa-sm"
                  >
                    <div><b>Request Type:</b> {{ sub.serviceRequestType?.name ?? 'NA' }}</div>
                    <div><b>Issue Type:</b> {{ sub.serviceRequestIssueType ?? 'NA' }}</div>
                    <div><b>Status:</b> {{ sub.serviceRequestSubTicketStatus?.name ?? 'NA' }}</div>
                    <div><b>Latitude:</b> {{ sub.latitude ?? 'NA' }}</div>
                    <div><b>Longitude:</b> {{ sub.longitude ?? 'NA' }}</div>
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </q-tabs>
  </q-page>
</template>

<script setup>
/* =======================
   IMPORTS
======================= */
import { ref, reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar' // Keep import but mark as used
import { useStore } from 'vuex'
import dayjs from 'dayjs'

import opened from '../../components/sat/opened.vue'
import cancelledInternal from '../../components/sat/cancelledInternal.vue'

/* =======================
   INSTANCES
======================= */
const $q = useQuasar() // This will now be used
const store = useStore()

/* =======================
   STATE
======================= */
const selectedTab = ref('opened')
const filterSearch = ref('')
const tableAjaxLoading = ref(false)

const internalClosedTableData = ref([])

const formData = reactive({
  marsDeviceIdsCookedUnAssinged: []
})

const paginationControl2 = ref({
  sortBy: 'createdDate',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

/* =======================
   COLUMNS
======================= */
const columnDataclosed = [
  { name: 'serviceReqTicketId', label: 'ServiceReqTicketId', field: 'serviceReqTicketId' },
  { name: 'tid', label: 'TID', field: 'tid' },
  { name: 'mid', label: 'MID', field: 'mid' },
  { name: 'createdDate', label: 'Created Date', field: 'createdDate' },
  { name: 'updatedDate', label: 'Updated Date', field: 'updatedDate' },
  { name: 'meName', label: 'ME Name', field: 'meName' },
  { name: 'bpRegion', label: 'Region', field: row => row.bpRegion?.regionAreaName },
  { name: 'assignedTo', label: 'Assigned To', field: row => row.assignedTo?.name },
  { name: 'crmRemark', label: 'CRM Remark', field: 'crmRemark' },
  { name: 'deviceType', label: 'Device Type', field: 'deviceType' },
  { name: 'serviceRequestTicketStatus', label: 'Ticket Status', field: 'serviceRequestTicketStatus' },
  { name: 'serviceRequestMode', label: 'Request Mode', field: 'serviceRequestMode' }
]

/* =======================
   METHODS
======================= */
const formatDate = date =>
  date ? dayjs(date).format('DD MMM YYYY') : 'NA'

const ajaxLoadAllLeadInfo2 = async ({ pagination, filter }) => {
  tableAjaxLoading.value = true
  try {
    await store.dispatch('serviceRequestSat/FETCH_CLOSED_SERVICE_REQUEST_DATAS', {
      pagination,
      filter
    })

    const data = store.getters['serviceRequestSat/getserviceRequestClosedDatas']
    internalClosedTableData.value = data.content.filter(d => d.source === true)

    paginationControl2.value.rowsNumber = data.totalElements
    paginationControl2.value.page = data.number + 1
  } catch (error) {
    // FIXED: Now using $q for error notification
    $q.notify({
      color: 'negative',
      message: 'Failed to load data',
      icon: 'error'
    })
    console.error('Error loading closed service requests:', error)
  } finally {
    tableAjaxLoading.value = false
  }
}

const goToUnassignedTab = tab => {
  if (tab === 'closed') {
    ajaxLoadAllLeadInfo2({
      pagination: paginationControl2.value,
      filter: filterSearch.value
    })
  }
}

const expandRowPlease = row => {
  row.expand = !row.expand
}

/* =======================
   LIFECYCLE
======================= */
onMounted(() => {
  ajaxLoadAllLeadInfo2({
    pagination: paginationControl2.value,
    filter: filterSearch.value
  })
})
</script>

<style scoped>
.customTd {
  text-align: left;
  white-space: normal;
}

.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>