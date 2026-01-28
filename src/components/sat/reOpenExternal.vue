<template>
  <q-page>
    <!-- Service Request Popup -->
    <div v-if="propToggleServiceRequest">
      <internal-service-request-popup
        :service-request="addtnServiceRequest"
        :prop-toggle-service-request-pop="propToggleServiceRequest"
        @close-service-request="toggleServiceRequest"
      />
    </div>

    <!-- Unassigned Tab Footer -->
    <q-card v-if="selectedTab === 'unAssigned'" class="q-pa-md">
      <div class="row items-center q-col-gutter-y-sm">
        <div class="col-md-3 col-sm-6 col-xs-6 text-grey-7 text-weight-medium">
          <span class="text-h6">{{ formData.marsDeviceIdsCooked.length }}</span> / selected
        </div>
        <div class="col-md-3 col-sm-6 col-xs-6 text-grey-7 text-weight-medium">
          <div class="text-weight-bold q-mb-sm">Request Mode</div>
          <div>
            <q-radio
              v-for="(item, index) in requestOptions"
              :key="index"
              v-model="formData.serviceRequestMode"
              :val="item.value"
              :label="item.label"
              color="grey-9"
            />
          </div>
        </div>
        <div v-if="formData.serviceRequestMode === 'SO'" class="col-md-3 col-sm-6 col-xs-6">
          <q-select
            v-model="formData.assignTo.id"
            :options="assignToOptions"
            label="Assign To"
            color="grey-9"
            outlined
            clearable
            use-input
            @filter="filterFn"
          />
        </div>
        <div class="col-md-3 col-sm-6 col-xs-6 text-right">
          <q-btn
            label="Assign"
            color="primary"
            no-caps
            :disable="formData.marsDeviceIdsCooked.length === 0"
            @click="assignImplementationUser"
          />
        </div>
      </div>
    </q-card>

    <!-- Assigned Tab Footer -->
    <q-card v-if="selectedTab === 'assigned'" class="q-pa-md">
      <div class="row items-center q-col-gutter-y-sm">
        <div class="col-md-9 col-sm-12 col-xs-12">
          <div class="row items-center">
            <div class="col-md-4 col-sm-6 col-xs-6"></div>
          </div>
        </div>
      </div>
    </q-card>

    <!-- Tabs -->
    <q-tabs v-model="selectedTab" class="shadow-1 text-grey-9" @update:model-value="goToUnassignedTab">
      <q-tab name="unAssigned" label="Unassigned" />
      <q-tab name="assigned" label="Assigned" />
    </q-tabs>

    <q-tab-panels v-model="selectedTab" animated>
      <!-- Unassigned Tab Panel -->
      <q-tab-panel name="unAssigned">
        <q-table
          v-model:selected="formData.marsDeviceIdsCooked"
          v-model:pagination="paginationControl1"
          :rows="tableData3"
          :columns="columnDataUnassigned"
          :filter="filterSearch1"
          :loading="tableAjaxLoading1"
          :rows-per-page-options="[5, 10, 15, 20]"
          row-key="id"
          selection="multiple"
          color="primary"
          flat
          bordered
          @request="ajaxLoadAllLeadInfo1"
        >
          <template #top>
            <div class="col-md-5">
              <q-input
                v-model="filterSearch1"
                debounce="300"
                placeholder="Search By ServiceReqTicketId, TID..."
                outlined
                dense
                clearable
              >
                <template #prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </template>

          <template #body-cell-serviceReqTicketId="props">
            <q-td :props="props" class="cursor-pointer" @click="toggleServiceRequest(props.row)">
              <span class="text-primary"># {{ props.row.serviceReqTicketId }}</span>
            </q-td>
          </template>

          <template #body-cell-createdDate="props">
            <q-td :props="props">
              {{ formatDate(props.row.createdDate) }}
            </q-td>
          </template>

          <template #body-cell-updatedDate="props">
            <q-td :props="props">
              {{ formatDate(props.row.updatedDate) }}
            </q-td>
          </template>

          <template #body-cell-serviceRequestSubTicketStatus="props">
            <q-td :props="props">
              <q-badge :color="getSubTicketStatusColor(props.row.serviceRequestSubTicketStatus)">
                {{ getSubTicketStatusLabel(props.row.serviceRequestSubTicketStatus) }}
              </q-badge>
            </q-td>
          </template>

          <template #body-cell-serviceRequestTicketStatus="props">
            <q-td :props="props">
              <q-badge :color="getTicketStatusColor(props.row.serviceRequestTicketStatus)">
                {{ getTicketStatusLabel(props.row.serviceRequestTicketStatus) }}
              </q-td>
          </template>

          <template #body-cell-kaptureDueDate="props">
            <q-td :props="props">
              {{ props.row.kaptureDueDate ? formatDate(props.row.kaptureDueDate) : 'NA' }}
            </q-td>
          </template>

          <template #body-cell-appointmentDate="props">
            <q-td :props="props">
              {{ props.row.appointmentDate ? formatDate(props.row.appointmentDate) : 'NA' }}
            </q-td>
          </template>

          <template #body-cell-courierDueDate="props">
            <q-td :props="props">
              {{ props.row.courierDueDate ? formatDate(props.row.courierDueDate) : 'NA' }}
            </q-td>
          </template>

          <template #body-cell-scheduleDate="props">
            <q-td :props="props">
              {{ props.row.scheduleDate ? formatDate(props.row.scheduleDate) : 'NA' }}
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- Assigned Tab Panel -->
      <q-tab-panel name="assigned">
        <q-table
          v-model:selected="formData.marsDeviceIdsCookedUnAssinged"
          v-model:pagination="paginationControl"
          :rows="tableData1"
          :columns="columnDataAssigned"
          :filter="filterSearch"
          :loading="tableAjaxLoading"
          :rows-per-page-options="[5, 10, 15, 20]"
          row-key="id"
          color="primary"
          flat
          bordered
          @request="ajaxLoadAllLeadInfo"
        >
          <template #top>
            <div class="col-md-5">
              <q-input
                v-model="filterSearch"
                debounce="300"
                placeholder="Search..."
                outlined
                dense
                clearable
              >
                <template #prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </template>

          <template #header="props">
            <q-tr :props="props">
              <q-th auto-width />
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <template #body="props">
            <q-tr :props="props" class="bottom-border">
              <q-td key="serviceReqTicketId">
                <q-checkbox
                  v-model="props.row.expand"
                  checked-icon="expand_less"
                  unchecked-icon="expand_more"
                  color="grey-9"
                  class="q-mr-md"
                  @update:model-value="expandRowPlease(props.row)"
                />
                <span>{{ props.row.serviceReqTicketId }}</span>
              </q-td>
              <q-td key="tid">{{ props.row.tid }}</q-td>
              <q-td key="mid">{{ props.row.mid || 'NA' }}</q-td>
              <q-td key="createdDate">{{ formatDate(props.row.createdDate) }}</q-td>
              <q-td key="updatedDate">{{ formatDate(props.row.updatedDate) }}</q-td>
              <q-td key="meName">{{ props.row.meName }}</q-td>
              <q-td key="bpRegion">{{ props.row.bpRegion?.regionAreaName || 'NA' }}</q-td>
              <q-td key="assignedTo">{{ props.row.assignedTo?.name || 'NA' }}</q-td>
              <q-td key="crmRemark">
                <div v-if="props.row.crmRemark" v-html="props.row.crmRemark"></div>
                <span v-else>NA</span>
              </q-td>
              <q-td key="deviceType">{{ props.row.deviceType }}</q-td>
              <q-td key="serviceRequestTicketStatus">
                <q-badge :color="getTicketStatusColor(props.row.serviceRequestTicketStatus)">
                  {{ getTicketStatusLabel(props.row.serviceRequestTicketStatus) }}
                </q-badge>
              </q-td>
              <q-td key="serviceRequestMode">{{ props.row.serviceRequestMode }}</q-td>
              <q-td key="serviceRequestSubTicketStatus">
                <q-badge :color="getSubTicketStatusColor(props.row.serviceRequestSubTicketStatus)">
                  {{ getSubTicketStatusLabel(props.row.serviceRequestSubTicketStatus) }}
                </q-badge>
              </q-td>
            </q-tr>

            <!-- Expanded Row -->
            <q-tr v-if="props.row.expand" :props="props" class="wordWrapCustom bottom-border">
              <q-td colspan="100%">
                <div class="row q-col-gutter-md q-pa-md">
                  <div v-if="props.row.subTicketsList?.length > 0" class="col-12">
                    <q-markup-table flat bordered>
                      <thead>
                        <tr>
                          <th>Request Type</th>
                          <th>Issue Type</th>
                          <th>SubTicket Status</th>
                          <th>Schedule Date</th>
                          <th>Pod Number</th>
                          <th>Service Remarks</th>
                          <th>Cancel Reason</th>
                          <th>Issue Remark</th>
                          <th>Remark</th>
                          <th>Latitude</th>
                          <th>Longitude</th>
                          <th>Implementation Form</th>
                          <th>Picture Of Shop</th>
                          <th>Old Sim Number</th>
                          <th>Old Sim Network</th>
                          <th>New Sim Number</th>
                          <th>New Sim Network</th>
                          <th>Scan Sim Number</th>
                          <th>Scan Device</th>
                          <th>Part Type</th>
                          <th>Paper Roll Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="col in props.row.subTicketsList" :key="col.serviceRequestType?.id">
                          <td>{{ col.serviceRequestType?.name || 'NA' }}</td>
                          <td>{{ col.serviceRequestIssueType || 'NA' }}</td>
                          <td>{{ col.serviceRequestSubTicketStatus?.name || 'NA' }}</td>
                          <td>{{ col.scheduleDate || 'NA' }}</td>
                          <td>{{ col.podNumber || 'NA' }}</td>
                          <td>{{ col.serviceRemarks || 'NA' }}</td>
                          <td>{{ col.cancelReason || 'NA' }}</td>
                          <td>{{ col.issueRemark || 'NA' }}</td>
                          <td>{{ col.remark || 'NA' }}</td>
                          <td>{{ col.latitude || 'NA' }}</td>
                          <td>{{ col.longitude || 'NA' }}</td>
                          <td>{{ col.implementationForm || 'NA' }}</td>
                          <td>{{ col.pictureOfShop || 'NA' }}</td>
                          <td>{{ col.oldSimNumber || 'NA' }}</td>
                          <td>{{ col.oldSimNetwork || 'NA' }}</td>
                          <td>{{ col.newSimNumber || 'NA' }}</td>
                          <td>{{ col.newSimNetwork || 'NA' }}</td>
                          <td>{{ col.scanSimNumber || 'NA' }}</td>
                          <td>{{ col.scanDeviceSerialNumber || 'NA' }}</td>
                          <td>{{ col.partType || 'NA' }}</td>
                          <td>{{ col.paperRollCount || 'NA' }}</td>
                        </tr>
                      </tbody>
                    </q-markup-table>
                  </div>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { date } from 'quasar'
import internalServiceRequestPopup from '../../components/sat/internalServiceRequestPopup.vue'

const $q = useQuasar()
const store = useStore()

// Reactive state
const propToggleServiceRequest = ref(false)
const addtnServiceRequest = ref(null)
const filterSearch = ref('')
const filterSearch1 = ref('')
const selectedTab = ref('assigned')
const assignToOptions = ref([])
const tableData1 = ref([])
const tableData3 = ref([])

const requestOptions = [
  { label: 'SO', value: 'SO' }
]

const formData = ref({
  marsDeviceIdsCooked: [],
  marsDeviceIdsCookedUnAssinged: [],
  triggerWelcomeMail: false,
  assignTo: { id: '' },
  podNumber: '',
  serviceRequestMode: ''
})

const columnDataAssigned = [
  {
    name: 'serviceReqTicketId',
    required: true,
    label: 'ServiceReqTicketId',
    align: 'left',
    field: row => row.serviceReqTicketId || 'NA',
    sortable: false
  },
  {
    name: 'tid',
    required: true,
    label: 'TID',
    align: 'left',
    field: row => row.tid || 'NA',
    sortable: false
  },
  {
    name: 'mid',
    required: true,
    label: 'MID',
    align: 'left',
    field: row => row.mid || 'NA',
    sortable: false
  },
  {
    name: 'createdDate',
    required: true,
    label: 'CreatedDate',
    align: 'left',
    field: row => row.createdDate,
    sortable: true
  },
  {
    name: 'updatedDate',
    required: true,
    label: 'UpdatedDate',
    align: 'left',
    field: row => row.updatedDate,
    sortable: false
  },
  {
    name: 'meName',
    required: true,
    label: 'ME Name',
    align: 'left',
    field: row => row.meName || 'NA',
    sortable: false
  },
  {
    name: 'bpRegion',
    required: true,
    label: 'BpRegion',
    align: 'left',
    field: row => row.bpRegion?.regionAreaName || 'NA',
    sortable: false
  },
  {
    name: 'assignedTo',
    required: true,
    label: 'AssignedTo',
    align: 'left',
    field: row => row.assignedTo ? `${row.assignedTo.name} | ${row.assignedTo.employeeID}` : 'NA',
    sortable: false
  },
  {
    name: 'crmRemark',
    required: true,
    label: 'CRM Remark',
    align: 'left',
    field: row => row.crmRemark || 'NA',
    sortable: false
  },
  {
    name: 'deviceType',
    required: true,
    label: 'DeviceType',
    align: 'left',
    field: row => row.deviceType || 'NA',
    sortable: false
  },
  {
    name: 'serviceRequestSubTicketStatus',
    required: true,
    label: 'ServiceReqIssueStatus',
    align: 'left',
    field: row => row.serviceRequestSubTicketStatus,
    sortable: false
  },
  {
    name: 'serviceRequestMode',
    required: true,
    label: 'RequestMode',
    align: 'left',
    field: row => row.serviceRequestMode || 'NA',
    sortable: false
  },
  {
    name: 'serviceRequestTicketStatus',
    required: true,
    label: 'TicketStatus',
    align: 'left',
    field: row => row.serviceRequestTicketStatus,
    sortable: false
  }
]

const columnDataUnassigned = [...columnDataAssigned]

const paginationControl = ref({
  sortBy: 'createdDate',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

const paginationControl1 = ref({
  sortBy: 'createdDate',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

const tableAjaxLoading = ref(false)
const tableAjaxLoading1 = ref(false)

// Methods
const formatDate = (dateString) => {
  if (!dateString) return 'NA'
  return date.formatDate(dateString, 'Do MMM YYYY')
}

const getSubTicketStatusLabel = (status) => {
  const statusMap = {
    1: 'SR_TICKET_RAISED',
    2: 'SR_TICKET_ESCALATED_TO_SAT',
    3: 'SR_ASSIGNED_TO_ENGINEER',
    4: 'SR_ISSUE_RESOLVED_COURIERED',
    5: 'SR_DEVICE_COURIERED',
    6: 'SR_ISSUE_RESOLVED_REMOTELY',
    7: 'SR_SCHEDULED_ENGINEER_VISIT',
    8: 'SR_ISSUE_RESOLVED',
    9: 'SR_MERCHANT_NOT_REACHABLE',
    10: 'SR_CANCELLED'
  }
  return statusMap[status] || 'NA'
}

const getSubTicketStatusColor = (status) => {
  return status === 10 ? 'negative' : 'positive'
}

const getTicketStatusLabel = (status) => {
  const statusMap = {
    1: 'REQUEST_UNASSIGNED',
    2: 'REQUEST_ASSIGNED',
    3: 'REQUEST_CLOSED'
  }
  return statusMap[status] || 'NA'
}

const getTicketStatusColor = (status) => {
  return status === 1 ? 'positive' : 'negative'
}

const filterFn = (val, update) => {
  update(() => {
    const implementationExecutiveList = store.getters['ImplementationExecutive/getImplementationExecutiveList']
    if (val === '') {
      assignToOptions.value = implementationExecutiveList.map(value => ({
        label: value.name,
        value: value.id
      }))
    } else {
      const needle = val.toLowerCase()
      assignToOptions.value = implementationExecutiveList
        .filter(v => v.name.toLowerCase().indexOf(needle) > -1)
        .map(value => ({
          label: value.name,
          value: value.id
        }))
    }
  })
}

const getPincodeInformations = () => {
  store.dispatch('SuperAdminUsers/FETCH_ALL_STATES_DATA')
}

const ajaxLoadAllLeadInfo1 = ({ pagination, filter }) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: 'purple-9',
    message: 'Fetching data ..'
  })

  tableAjaxLoading1.value = true

  store.dispatch('serviceRequestPhonepeSat/FETCH_PHONEPE_REOPEN_TICKET', { pagination, filter })
    .then(() => {
      return store.dispatch('ImplementationExecutive/IMPLEMENTATION_EXECUTIVE_LIST')
    })
    .then(() => {
      const implementationExecutiveList = store.getters['ImplementationExecutive/getImplementationExecutiveList']
      const serviceRequestReopenTicket = store.getters['serviceRequestPhonepeSat/getserviceRequestReopenTicket']
      
      assignToOptions.value = implementationExecutiveList.map(value => ({
        label: value.name,
        value: value.id
      }))

      paginationControl1.value = pagination
      paginationControl1.value.rowsNumber = serviceRequestReopenTicket.totalElements
      paginationControl1.value.page = serviceRequestReopenTicket.number + 1

      tableData3.value = serviceRequestReopenTicket.content

      if (serviceRequestReopenTicket.sort != null) {
        paginationControl1.value.sortBy = serviceRequestReopenTicket.sort[0].property
        paginationControl1.value.descending = serviceRequestReopenTicket.sort[0].ascending
      }

      $q.loading.hide()
      tableAjaxLoading1.value = false
    })
    .catch(() => {
      $q.loading.hide()
      tableAjaxLoading1.value = false
    })
}

const ajaxLoadAllLeadInfo = ({ pagination, filter }) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: 'purple-9',
    message: 'Fetching data ..'
  })

  tableAjaxLoading.value = true

  store.dispatch('serviceRequestPhonepeSat/FETCH_PHONEPE_REOPENED_ASSIGNED_TICKET', { pagination, filter })
    .then(() => {
      const phonepeAssignedReopenTicket = store.getters['serviceRequestPhonepeSat/getphonepeAssignedReopenTicket']
      
      paginationControl.value = pagination
      paginationControl.value.rowsNumber = phonepeAssignedReopenTicket.totalElements
      paginationControl.value.page = phonepeAssignedReopenTicket.number + 1

      tableData1.value = phonepeAssignedReopenTicket.content

      if (phonepeAssignedReopenTicket.sort != null) {
        paginationControl.value.sortBy = phonepeAssignedReopenTicket.sort[0].property
        paginationControl.value.descending = phonepeAssignedReopenTicket.sort[0].ascending
      }

      $q.loading.hide()
      tableAjaxLoading.value = false
    })
    .catch(() => {
      $q.loading.hide()
      tableAjaxLoading.value = false
    })
}

const goToUnassignedTab = (tab) => {
  if (tab === 'unAssigned') {
    ajaxLoadAllLeadInfo1({ pagination: paginationControl1.value, filter: filterSearch1.value })
  } else {
    ajaxLoadAllLeadInfo({ pagination: paginationControl.value, filter: filterSearch.value })
  }
}

const assignImplementationUser = () => {
  if (formData.value.marsDeviceIdsCooked.length === 0) {
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Select atleast one item to assign',
      icon: 'thumb_down'
    })
    return
  }

  if (formData.value.assignTo.id === '') {
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Request Mode cannot be empty!',
      icon: 'thumb_down'
    })
    return
  }

  const marsDeviceIdsCooked = formData.value.marsDeviceIdsCooked.map(value => ({
    ...value,
    podNumber: formData.value.podNumber,
    serviceRequestMode: formData.value.serviceRequestMode
  }))

  const postValues = {
    request: marsDeviceIdsCooked,
    userId: formData.value.assignTo.id
  }

  store.dispatch('serviceRequestPhonepeSat/PHONEPE_REOPENED_UNASSIGED_TO_ASSIGNED_STATE', postValues)
    .then((res) => {
      if (res.status === 200 && (res.data.data.serviceRequest != null || res.data.data.Success != null)) {
        formData.value.marsDeviceIdsCooked = []
        formData.value.assignTo = { id: '' }
        $q.notify({
          color: 'positive',
          position: 'bottom',
          message: 'Successfully assigned!',
          icon: 'thumb_up'
        })
        ajaxLoadAllLeadInfo1({ pagination: paginationControl1.value, filter: filterSearch1.value })
      } else if (res.status === 200 && res.data.data.Failed != null) {
        // Handle failed case - you may need to implement router navigation
        console.log('Failed assignments:', res.data.data.Failed)
      } else {
        $q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'INTERNAL SERVER ERROR !!',
          icon: 'thumb_down'
        })
      }
    })
    .catch(() => {
      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: 'Please try again',
        icon: 'thumb_down'
      })
    })
}

const expandRowPlease = (row) => {
  // Handle row expansion logic if needed
  console.log('Row expanded:', row)
}

const toggleServiceRequest = (leadDetails) => {
  propToggleServiceRequest.value = !propToggleServiceRequest.value
  if (leadDetails !== undefined) {
    addtnServiceRequest.value = leadDetails
  }
}

// Lifecycle hooks
onMounted(() => {
  ajaxLoadAllLeadInfo({
    pagination: paginationControl.value,
    filter: filterSearch.value
  })
  ajaxLoadAllLeadInfo1({
    pagination: paginationControl1.value,
    filter: filterSearch1.value
  })
  getPincodeInformations()
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

.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.wordWrapCustom {
  word-wrap: break-word;
  white-space: normal;
}
</style>