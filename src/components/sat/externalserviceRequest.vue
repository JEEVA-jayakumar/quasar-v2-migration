<template>
  <q-page>
    <!-- Header -->
    <div class="text-h6 q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
      Aggregator Service Request
    </div>

    <!-- Footer actions (Unassigned) -->
    <q-card class="group q-pa-md" v-if="selectedTab === 'unAssigned'">
      <div class="row items-center gutter-y-sm">
        <div class="col-md-3 col-sm-6 col-xs-6 text-grey-7 text-weight-medium">
          <span class="text-h6">{{ formData.marsDeviceIdsCooked.length }}</span> / selected
        </div>

        <div class="col-md-3 col-sm-6 col-xs-6" style="max-width:200px" align="right">
          <q-select
            v-model="formData.assignTo.region"
            :options="assignToRegionOptions"
            clearable
            emit-value
            map-options
            color="grey-9"
            label="Assign To Region"
            :disable="formData.marsDeviceIdsCooked.length === 0"
            outlined
          />
        </div>

        <div class="col-md-3 col-sm-6 col-xs-6" align="right">
          <q-btn
            class="common-dark-blue"
            label="Assign"
            no-caps
            :disable="!formData.assignTo.region"
            @click="assignImplementationUser"
          />
        </div>
      </div>
    </q-card>

    <!-- Tabs -->
    <q-tabs v-model="selectedTab" class="shadow-1" align="left">
      <q-tab name="unAssigned" label="Opened" />
      <q-tab name="assigned" label="Resolved Tickets" />
      <q-tab name="Ticket" label="Ticket Bulk Assign/Reassign" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="selectedTab" animated>
      <!-- Assigned -->
      <q-tab-panel name="assigned">
        <q-table
          row-key="id"
          :rows="tableData"
          :columns="columnDataAssigned"
          :loading="tableAjaxLoading"
          v-model:pagination="paginationControl"
          @request="ajaxLoadResolved"
        >
          <template #top>
            <q-input
              v-model="filterSearch"
              dense
              debounce="300"
              label="Search by TID"
              clearable
              outlined
            />
          </template>

          <template #body-cell-actionContact="props">
            <q-btn size="sm" color="primary" label="View" @click="fnContactDetails(props.row)" />
          </template>

          <template #body-cell-actionLog="props">
            <q-btn size="sm" color="primary" label="Logs" @click="fnCrmLogsView(props.row)" />
          </template>

          <!-- FIXED: Removed unused props parameter -->
          <template #body-cell-actionClosed>
            <q-btn size="sm" color="negative" label="Closed" />
          </template>
        </q-table>
      </q-tab-panel>

      <!-- Unassigned -->
      <q-tab-panel name="unAssigned">
        <q-table
          row-key="serviceReqTicketId"
          selection="multiple"
          v-model:selected="formData.marsDeviceIdsCooked"
          :rows="tableData1"
          :columns="columnDataUnassigned"
          :loading="tableAjaxLoading1"
          v-model:pagination="paginationControl1"
          @request="ajaxLoadOpened"
        >
          <template #top>
            <q-input
              v-model="filterSearch1"
              dense
              debounce="300"
              label="Search Ticket / TID"
              clearable
              outlined
            />
          </template>

          <template #body-cell-actionContact="props">
            <q-btn size="sm" color="primary" label="View" @click="fnContactDetails(props.row)" />
          </template>

          <template #body-cell-actionLog="props">
            <q-btn size="sm" color="primary" label="Logs" @click="fnCrmLogsView(props.row)" />
          </template>

          <template #body-cell-actionPickTickets="props">
            <q-btn
              v-if="props.row.serviceRequestTicketStatus === 5"
              size="sm"
              color="positive"
              label="Pick"
              @click="fnPickTicket(props.row)"
            />
          </template>

          <template #body-cell-actionReassign="props">
            <q-btn
              v-if="props.row.serviceRequestTicketStatus === 2"
              size="sm"
              color="negative"
              label="Reassign"
              @click="fnReassignTicket(props.row)"
            />
          </template>
        </q-table>
      </q-tab-panel>

      <!-- Ticket Assign -->
      <q-tab-panel name="Ticket">
        <ticketAssign />
      </q-tab-panel>
    </q-tab-panels>

    <!-- Dialogs -->
    <pickTicketpopup
      v-model="propShowUpdatePickTicket"
      :propRowDetails="propRowDetails"
    />
    <reassignTicketPopup
      v-model="propShowUpdateReassignTicket"
      :propRowDetails="propRowDetails"
    />
    <contactDetailsPopup
      v-model="propShowUpdateContactDetails"
      :propRowDetails="propRowDetails"
    />
    <crmLogsView
      v-model="propShowUpdateCrmLogsView"
      :propRowDetails="propRowDetails"
    />
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'

import pickTicketpopup from 'src/components/sat/pickTicketpopup.vue'
import reassignTicketPopup from 'src/components/sat/reassignTicketPopup.vue'
import contactDetailsPopup from 'src/components/sat/contactDetailsPopup.vue'
import crmLogsView from 'src/components/sat/crmLogsView.vue'
import ticketAssign from 'src/components/sat/ticketAssign.vue'

const $q = useQuasar()
const store = useStore()

/* ---------------- state ---------------- */
const selectedTab = ref('assigned')
const filterSearch = ref('')
const filterSearch1 = ref('')

const propShowUpdatePickTicket = ref(false)
const propShowUpdateReassignTicket = ref(false)
const propShowUpdateContactDetails = ref(false)
const propShowUpdateCrmLogsView = ref(false)
const propRowDetails = ref(null)

const tableData = ref([])
const tableData1 = ref([])
const tableAjaxLoading = ref(false)
const tableAjaxLoading1 = ref(false)

const assignToRegionOptions = ref([])

const formData = reactive({
  marsDeviceIdsCooked: [],
  assignTo: { region: '' }
})

const paginationControl = ref({ 
  page: 1, 
  rowsPerPage: 10,
  rowsNumber: 0,
  sortBy: 'createdDate',
  descending: false
})
const paginationControl1 = ref({ 
  page: 1, 
  rowsPerPage: 10,
  rowsNumber: 0,
  sortBy: 'createdDate',
  descending: false
})

/* ---------------- columns ---------------- */
const columnDataAssigned = [
  { name: 'merchant_name', label: 'Merchant', field: row => row.meName ?? 'NA', align: 'left' },
  { name: 'tid', label: 'TID', field: 'tid', align: 'left' },
  { name: 'actionContact', label: 'Contact', align: 'center' },
  { name: 'dateCreated', label: 'Created', field: 'createdDate', align: 'left' },
  { name: 'tat', label: 'TAT', field: 'createdDate', align: 'left' },
  { name: 'actionLog', label: 'CRM Logs', align: 'center' },
  { name: 'actionClosed', label: 'Status', align: 'center' }
]

const columnDataUnassigned = [
  { name: 'serviceReqTicketId', label: 'Ticket ID', field: 'serviceReqTicketId', align: 'left' },
  { name: 'merchant_name', label: 'Merchant', field: row => row.meName ?? 'NA', align: 'left' },
  { name: 'assignedTo', label: 'Assigned SO', field: row => row.assignedTo?.name ?? 'NA', align: 'left' },
  { name: 'tid', label: 'TID', field: 'tid', align: 'left' },
  { name: 'actionContact', label: 'Contact', align: 'center' },
  { name: 'dateCreated', label: 'Created', field: 'createdDate', align: 'left' },
  { name: 'tat', label: 'TAT', field: 'createdDate', align: 'left' },
  { name: 'actionLog', label: 'CRM Logs', align: 'center' },
  { name: 'actionPickTickets', label: 'Action', align: 'center' },
  { name: 'actionReassign', label: '', align: 'center' }
]

/* ---------------- methods ---------------- */
const fnPickTicket = row => {
  propRowDetails.value = row
  propShowUpdatePickTicket.value = !propShowUpdatePickTicket.value
}

const fnReassignTicket = row => {
  propRowDetails.value = row
  propShowUpdateReassignTicket.value = !propShowUpdateReassignTicket.value
}

const fnContactDetails = row => {
  propRowDetails.value = row
  propShowUpdateContactDetails.value = !propShowUpdateContactDetails.value
}

const fnCrmLogsView = row => {
  propRowDetails.value = row
  propShowUpdateCrmLogsView.value = !propShowUpdateCrmLogsView.value
}

const assignImplementationUser = async () => {
  if (!formData.marsDeviceIdsCooked.length) {
    $q.notify({ 
      type: 'negative', 
      message: 'Select at least one ticket',
      position: 'bottom'
    })
    return
  }

  try {
    $q.loading.show({
      message: 'Assigning tickets...',
      spinnerColor: 'primary'
    })
    
    await store.dispatch('serviceRequestPhonepeSat/PHONEPE_SERVICE_REQUEST_TO_ASSIGNED_REGION',
      formData.marsDeviceIdsCooked.map(t => ({
        serviceReqTicketId: t.serviceReqTicketId,
        bpRegion: { regionAreaName: formData.assignTo.region }
      }))
    )
    
    formData.marsDeviceIdsCooked = []
    formData.assignTo.region = ''
    
    $q.notify({ 
      type: 'positive', 
      message: 'Assigned successfully',
      position: 'bottom'
    })
    
    // Refresh the table data
    ajaxLoadOpened({ pagination: paginationControl1.value })
  } catch (error) {
    $q.notify({ 
      type: 'negative', 
      message: error?.body?.message || 'Failed to assign tickets',
      position: 'bottom'
    })
  } finally {
    $q.loading.hide()
  }
}

const ajaxLoadOpened = async ({ pagination }) => {
  tableAjaxLoading1.value = true
  try {
    await store.dispatch('serviceRequestPhonepeSat/FETCH_PHONEPE_OPENED_TICKETS', {
      pagination,
      filter: filterSearch1.value
    })
    const data = store.getters['serviceRequestPhonepeSat/getphonepeOpenedTickets']
    tableData1.value = data?.content ?? []
    paginationControl1.value.rowsNumber = data?.totalElements ?? 0
  } catch (error) {
    console.error('Error loading opened tickets:', error)
  } finally {
    tableAjaxLoading1.value = false
  }
}

const ajaxLoadResolved = async ({ pagination }) => {
  tableAjaxLoading.value = true
  try {
    await store.dispatch('serviceRequestPhonepeSat/FETCH_PHONEPE_RESOLVED_TICKET', {
      pagination,
      filter: filterSearch.value
    })
    const data = store.getters['serviceRequestPhonepeSat/getphonepeResolvedTickets']
    tableData.value = data?.content ?? []
    paginationControl.value.rowsNumber = data?.totalElements ?? 0
  } catch (error) {
    console.error('Error loading resolved tickets:', error)
  } finally {
    tableAjaxLoading.value = false
  }
}

/* ---------------- mounted ---------------- */
onMounted(async () => {
  try {
    const res = await store.dispatch('generateQR/FETCH_REGION_LIST')
    assignToRegionOptions.value = res.data.data.map(r => ({
      label: r.regionAreaName,
      value: r.regionAreaName
    }))
    
    // Load initial data
    ajaxLoadResolved({ pagination: paginationControl.value })
    ajaxLoadOpened({ pagination: paginationControl1.value })
  } catch (error) {
    console.error('Error fetching regions:', error)
  }
})
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.customTd {
  word-wrap: break-word;
  white-space: normal;
}
</style>