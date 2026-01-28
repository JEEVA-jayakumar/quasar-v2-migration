<template>
  <q-page class="q-pa-md">
    <!-- content -->
    <div>
      <div
        class="
          text-h5
          q-px-lg q-py-md
          text-weight-regular
          bottom-border
          text-grey-9
        "
      >
        Service Request
      </div>
      <!--END: table title -->
      <!--START: table Footer -->
      <q-card class="group q-pa-md" v-if="selectedTab == 'unAssigned'">
        <div class="row items-center q-col-gutter-y-sm">
          <div
            class="col-md-3 col-sm-6 col-xs-6 text-grey-7 text-weight-medium"
            style="text-align: left"
          >
            <span class="text-h2">{{
              formData.marsDeviceIdsCooked.length
            }}</span
            >/ selected
          </div>
          <div class="col-md-3 col-sm-6 col-xs-6">
            <b>Request Mode</b>
            <div class="col-md-2 col-sm-6 col-xs-6">
              <q-radio
                v-for="(item, index) in requestOptions"
                :key="index"
                color="grey-9"
                v-model="formData.requestMode"
                :val="item.value"
                :label="item.label"
              />
            </div>
          </div>
          
          <div
            v-if="formData.requestMode == 1"
            class="col-md-2 col-sm-6 col-xs-6"
          >
            <q-input
              v-model="formData.podNumber"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="Enter Pod Number*"
              placeholder="Enter Pod Number*"
            />
          </div>
          
          <div
            v-if="formData.requestMode == 1"
            class="col-md-3 col-sm-6 col-xs-6"
          >
            <q-select
              v-model="formData.assignTo"
              outlined
              color="grey-9"
              :options="assignToOptions"
              :filter="true"
              clearable
              placeholder="Assign To"
            />
          </div>

          <div v-if="formData.requestMode == 0" class="col-md-3 col-sm-6 col-xs-6">
            <q-select
              :filter="true"
              clearable
              v-model="formData.assignTo"
              outlined
              color="grey-9"
              :options="assignToOptions"
              placeholder="Assign To"
            />
          </div>

          <div class="col-md-3 col-sm-6 col-xs-6" style="text-align: right">
            <q-btn
              no-caps
              :disabled="
                formData.marsDeviceIdsCooked.length == 0 ? true : false
              "
              label="Submit"
              class="common-dark-blue"
              @click="assignImplementationUser"
            />
          </div>
        </div>
      </q-card>
      <q-card class="group q-pa-md" v-if="selectedTab == 'assigned'">
        <div class="row items-center q-col-gutter-y-sm">
          <div class="col-md-9 col-sm-12 col-xs-12">
            <div class="row items-center">
              <div class="col-md-4 col-sm-6 col-xs-6 group"></div>
            </div>
          </div>
        </div>
      </q-card>
      <q-card class="group q-pa-md" v-if="selectedTab == 'closed'">
        <div class="row items-center q-col-gutter-y-sm">
          <div class="col-md-9 col-sm-12 col-xs-12">
            <div class="row items-center">
              <div class="col-md-4 col-sm-6 col-xs-6 group"></div>
            </div>
          </div>
        </div>
      </q-card>
      <!--END: table Footer -->
      <q-tabs
        v-model="selectedTab"
        class="shadow-1"
        align="left"
        @update:model-value="goToUnassignedTab"
      >
        <q-tab
          name="unAssigned"
          label="Unassigned"
        />
        <q-tab
          name="assigned"
          label="Assigned"
        />
        <q-tab
          name="closed"
          label="Closed"
        />
      </q-tabs>
      
      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="unAssigned">
          <!--START: table Data    :data="tableData1" -->
          <q-table
            :rows="tableData1"
            :columns="columnDataUnassigned"
            table-class="customTableClass"
            :filter="filterSearch1"
            v-model:selected="formData.marsDeviceIdsCooked"
            :pagination="paginationControl1"
            row-key="id"
            :loading="tableAjaxLoading1"
            :rows-per-page-options="[5, 10, 15, 20]"
            color="dark"
            @update:pagination="ajaxLoadAllLeadInfo1"
            selection="multiple"
          >
            <template #body-cell-leadNumber="props">
              <q-td :props="props" class="cursor-pointer">
                <span class="label text-primary" @click="toggleLeadInformation(props.row.leadInformation)">
                  # {{ props.row.leadInformation.leadNumber }}
                </span>
              </q-td>
            </template>
            
            <template #body-cell-submitToMarsDate="props">
              <q-td :props="props">
                {{ formatDate(props.row.leadInformation.submitToMarsDate) }}
              </q-td>
            </template>
            
            <template #body-cell-createdAt="props">
              <q-td :props="props">
                {{ formatDate(props.row.createdAt) }}
              </q-td>
            </template>
            
            <template #body-cell-tid="props">
              <q-td :props="props" class="customTd">
                <div class="text-primary">{{ props.row.tid }}</div>
              </q-td>
            </template>
            
            <template #body-cell-mid="props">
              <q-td :props="props" class="customTd">
                <div class="text-primary">{{ props.row.mid }}</div>
              </q-td>
            </template>
            
            <template #body-cell-deviceAddress="props">
              <q-td :props="props" class="customTd customCellLength">
                <div>
                  {{ props.row.deviceAddress }}
                </div>
              </q-td>
            </template>
          </q-table>
          <!--END: table Data -->
        </q-tab-panel>
        
        <q-tab-panel name="assigned">
          <!--START: table Data    :data="tableData" -->
          <q-table
            :rows="tableData"
            :columns="columnDataAssigned"
            table-class="customTableClass"
            :filter="filterSearch"
            :pagination="paginationControl"
            v-model:selected="formData.marsDeviceIdsCookedUnAssinged"
            row-key="id"
            :loading="tableAjaxLoading"
            :rows-per-page-options="[5, 10, 15, 20]"
            color="dark"
            @update:pagination="ajaxLoadAllLeadInfo"
          >
            <template #body-cell-leadNumber="props">
              <q-td :props="props" class="cursor-pointer">
                <span class="label text-primary" @click="toggleLeadInformation(props.row.leadInformation)">
                  # {{ props.row.leadInformation.leadNumber }}
                </span>
              </q-td>
            </template>
            
            <template #body-cell-submitToMarsDate="props">
              <q-td :props="props">
                {{ formatDate(props.row.leadInformation.submitToMarsDate) }}
              </q-td>
            </template>
            
            <template #body-cell-createdAt="props">
              <q-td :props="props">
                {{ formatDate(props.row.createdAt) }}
              </q-td>
            </template>
            
            <template #body-cell-deviceAddress="props">
              <q-td :props="props" class="customTd customCellLength">
                <div>{{ props.row.deviceAddress }}</div>
              </q-td>
            </template>

            <template #body-cell-tid="props">
              <q-td :props="props" class="customTd">
                <div class="text-primary">{{ props.row.tid }}</div>
              </q-td>
            </template>
            
            <template #body-cell-mid="props">
              <q-td :props="props" class="customTd">
                <div class="text-primary">{{ props.row.mid }}</div>
              </q-td>
            </template>
            
            <template #body-cell-action="props">
              <q-td :props="props">
                <q-btn
                  outline
                  class="q-mx-sm"
                  color="purple-9"
                  size="sm"
                  @click="financeApproveSubmit(props.row.leadId)"
                  >Approve</q-btn
                >
                <q-btn
                  outline
                  class="q-mx-sm"
                  color="negative"
                  @click="openRejectModel(props.row)"
                  size="sm"
                  >Reject</q-btn
                >
              </q-td>
            </template>
          </q-table>
          <!--END: table Data -->
        </q-tab-panel>
        
        <q-tab-panel name="closed">
          <!--START: table Data -->
          <q-table
            :rows="closedDatas"
            :columns="columns"
            table-class="customTableClass"
            :filter="filterSearch2"
            :pagination="paginationControl2"
            v-model:selected="formData.marsDeviceIdsCookedUnAssinged"
            row-key="id"
            :loading="tableAjaxLoading"
            :rows-per-page-options="[5, 10, 15, 20]"
            color="dark"
            @update:pagination="ajaxLoadAllLeadInfoClosed"
          >
            <template #body-cell-leadNumber="props">
              <q-td :props="props" class="cursor-pointer">
                <span class="label text-primary" @click="toggleLeadInformation(props.row.leadInformation)">
                  # {{ props.row.leadInformation.leadNumber }}
                </span>
              </q-td>
            </template>
            
            <template #body-cell-submitToMarsDate="props">
              <q-td :props="props">
                {{ formatDate(props.row.leadInformation.submitToMarsDate) }}
              </q-td>
            </template>
            
            <template #body-cell-createdAt="props">
              <q-td :props="props">
                {{ formatDate(props.row.createdAt) }}
              </q-td>
            </template>
            
            <template #body-cell-deviceAddress="props">
              <q-td :props="props" class="customTd customCellLength">
                <div>{{ props.row.deviceAddress }}</div>
              </q-td>
            </template>

            <template #body-cell-tid="props">
              <q-td :props="props" class="customTd">
                <div class="text-primary">{{ props.row.tid }}</div>
              </q-td>
            </template>
            
            <template #body-cell-mid="props">
              <q-td :props="props" class="customTd">
                <div class="text-primary">{{ props.row.mid }}</div>
              </q-td>
            </template>
            
            <template #body-cell-action="props">
              <q-td :props="props">
                <q-btn
                  outline
                  class="q-mx-sm"
                  color="purple-9"
                  size="sm"
                  @click="financeApproveSubmit(props.row.leadId)"
                  >Approve</q-btn
                >
                <q-btn
                  outline
                  class="q-mx-sm"
                  color="negative"
                  @click="openRejectModel(props.row)"
                  size="sm"
                  >Reject</q-btn
                >
              </q-td>
            </template>
          </q-table>
          <!--END: table Data -->
        </q-tab-panel>
      </q-tab-panels>
      
      <div class="row items-center q-col-gutter-y-sm">
        <div class="col-md-9 col-sm-12 col-xs-12">
          <div class="row items-center"></div>
        </div>
      </div>
      <!-- END >> COMPONENT: Update device address -->
    </div>
    
    <!-- Lead Information Dialog -->
    <q-dialog v-model="propToggleLeadInformation">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Lead Information</div>
        </q-card-section>
        <q-card-section v-if="addtnLeadInformation">
          <!-- Display lead information here -->
          <div>Lead Number: {{ addtnLeadInformation.leadNumber }}</div>
          <!-- Add more fields as needed -->
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import { format } from 'date-fns'

const $q = useQuasar()
const store = useStore()

// Reactive state
const propToggleLeadInformation = ref(false)
const addtnLeadInformation = ref(null)
const toggleAjaxLoadFilter = ref(false)
const closedDatas = ref([])
const filterSearch = ref('')
const filterSearch1 = ref('')
const filterSearch2 = ref('')
const selectedTab = ref('assigned')
const tableData = ref([])
const tableData1 = ref([])

// Form data
const formData = ref({
  marsDeviceIdsCooked: [],
  marsDeviceIdsCookedUnAssinged: [],
  triggerWelcomeMail: false,
  assignTo: '',
  podNumber: '',
  requestMode: ''
})

// Pagination controls
const paginationControl = ref({
  sortBy: null,
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

const paginationControl1 = ref({
  sortBy: null,
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

const paginationControl2 = ref({
  sortBy: null,
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

const tableAjaxLoading = ref(false)
const tableAjaxLoading1 = ref(false)

// Static data
const requestOptions = [
  {
    label: "Direct Dispatch",
    value: 1,
  },
  {
    label: "SO",
    value: 0,
  },
]

const assignToOptions = ref([])

// Computed properties
const getDeviceReplacementQueueAssignedList = computed(() => 
  store.getters["DeviceReplacement/getDeviceReplacementQueueAssignedList"]
)

const getDeviceReplacementQueueUnassignedList = computed(() => 
  store.getters["DeviceReplacement/getDeviceReplacementQueueUnassignedList"]
)

const getImplementationExecutiveList = computed(() => 
  store.getters["ImplementationExecutive/getImplementationExecutiveList"]
)





// Columns definitions
const columns = [
  {
    name: "leadNumber",
    required: true,
    label: "Lead Number",
    align: "left",
    field: (row) => row.leadInformation?.leadNumber,
    sortable: false,
  },
  {
    name: "createdAt",
    required: true,
    label: "Date of TID Generation",
    align: "left",
    field: "createdAt",
    sortable: true,
  },
  {
    name: "tid",
    required: true,
    label: "TID",
    align: "left",
    field: (row) => row.tid,
    sortable: true,
  },
  {
    name: "mid",
    required: true,
    label: "MID",
    align: "left",
    field: (row) => row.mid,
    sortable: true,
  },
  {
    name: "merchant_name",
    required: true,
    label: "Merchant Name",
    align: "left",
    field: (row) => row.leadInformation?.leadName,
    sortable: false,
  },
  {
    name: "mobile_number",
    required: true,
    label: "Mobile Number",
    align: "center",
    field: (row) => row.leadInformation?.contactNumber,
    sortable: false,
  },
  {
    name: "deviceAddress",
    required: true,
    label: "Address",
    align: "left",
    field: (row) => row.deviceAddress,
    sortable: false,
  },
  {
    name: "source",
    required: true,
    label: "Source",
    align: "left",
    field: (row) => row.leadInformation?.leadSource?.sourceName,
    sortable: false,
  },
  {
    name: "assigned_to",
    required: true,
    label: "Assigned To",
    align: "left",
    field: (row) => row.replacedBy == null ? "NA" : row.replacedBy.name,
    sortable: false,
  },
  {
    name: "leadInformation",
    required: true,
    label: "Device Type",
    align: "left",
    field: (row) => row.leadInformation?.device?.deviceName,
    sortable: false,
  },
  {
    name: "serial_number",
    required: true,
    label: "Serial Number",
    align: "left",
    field: (row) => row.regionalInventory == null ? "NA" : row.regionalInventory.serialNumber,
    sortable: true,
  },
  {
    name: "submitToMarsDate",
    required: true,
    label: "Date of Submission",
    align: "left",
    field: (row) => row.leadInformation?.submitToMarsDate,
    sortable: true,
  },
  {
    name: "action",
    required: true,
    label: "",
    align: "center",
    field: "action",
    sortable: false,
  },
]

const columnDataAssigned = [...columns]

const columnDataUnassigned = [
  {
    name: "leadNumber",
    required: true,
    label: "Ticket No ",
    align: "left",
    field: (row) => row.leadInformation?.leadNumber,
    sortable: false,
  },
  {
    name: "createdAt",
    required: true,
    label: "BP Region ",
    align: "left",
    field: "createdAt",
    sortable: true,
  },
  {
    name: "tid",
    required: true,
    label: "TID",
    align: "left",
    field: (row) => row.tid,
    sortable: true,
  },
  {
    name: "mid",
    required: true,
    label: "Device Type ",
    align: "left",
    field: (row) => row.mid,
    sortable: true,
  },
  {
    name: "merchant_name",
    required: true,
    label: "Service Type ",
    align: "left",
    field: (row) => row.leadInformation?.leadName,
    sortable: false,
  },
  {
    name: "mobile_number",
    required: true,
    label: "Request Mode ",
    align: "center",
    field: (row) => row.leadInformation?.contactNumber,
    sortable: false,
  },
  {
    name: "deviceAddress",
    required: true,
    label: "SO Name ",
    align: "left",
    field: (row) => row.deviceAddress,
    sortable: false,
  },
]

// Lifecycle
onMounted(() => {
  ajaxLoadAllLeadInfo({
    pagination: paginationControl.value,
    filter: filterSearch.value
  })
  ajaxLoadAllLeadInfo1({
    pagination: paginationControl1.value,
    filter: filterSearch1.value
  })
  ajaxLoadAllLeadInfoClosed({
    pagination: paginationControl2.value,
    filter: filterSearch2.value
  })
  getPincodeInformations()
})

// Watchers
watch(selectedTab, (newTab) => {
  goToUnassignedTab(newTab)
})

// Methods
const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    return format(new Date(dateString), 'do MMM y')
  } catch  {

    return dateString
  }
}

const getPincodeInformations = () => {
  store.dispatch("SuperAdminUsers/FETCH_ALL_STATES_DATA")
}

const ajaxLoadAllLeadInfo1 = async ({ pagination, filter }) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Fetching data ..",
  })
  
  try {
    await store.dispatch("DeviceReplacement/DEVICE_REPLACEMENT_QUEUE_UNASSIGNED_LIST", { pagination, filter })
    
    // Load implementation executives
    await store.dispatch("ImplementationExecutive/IMPLEMENTATION_EXECUTIVE_LIST")
    
    // Update assignToOptions
    assignToOptions.value = getImplementationExecutiveList.value.map(value => ({
      label: value.name,
      value: value.id
    }))
    
    // Update pagination and data
    paginationControl1.value = {
      ...pagination,
      rowsNumber: getDeviceReplacementQueueUnassignedList.value.totalElements,
      page: getDeviceReplacementQueueUnassignedList.value.number + 1
    }
    
    tableData1.value = getDeviceReplacementQueueUnassignedList.value.content || []
    
    if (getDeviceReplacementQueueUnassignedList.value.sort?.[0]) {
      paginationControl1.value.sortBy = getDeviceReplacementQueueUnassignedList.value.sort[0].property
      paginationControl1.value.descending = getDeviceReplacementQueueUnassignedList.value.sort[0].ascending
    }
    
  } catch (error) {

    console.error("Error loading unassigned data:", error)
  } finally {
    $q.loading.hide()
  }
}

const ajaxLoadAllLeadInfo = async ({ pagination, filter }) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Fetching data ..",
  })
  
  try {
    await store.dispatch("DeviceReplacement/DEVICE_REPLACEMENT_QUEUE_ASSIGNED_LIST", { pagination, filter })
    
    paginationControl.value = {
      ...pagination,
      rowsNumber: getDeviceReplacementQueueAssignedList.value.totalElements,
      page: getDeviceReplacementQueueAssignedList.value.number + 1
    }
    
    tableData.value = getDeviceReplacementQueueAssignedList.value.content || []
    
    if (getDeviceReplacementQueueAssignedList.value.sort?.[0]) {
      paginationControl.value.sortBy = getDeviceReplacementQueueAssignedList.value.sort[0].property
      paginationControl.value.descending = getDeviceReplacementQueueAssignedList.value.sort[0].ascending
    }
    
  } catch (error) {

    console.error("Error loading assigned data:", error)
  } finally {
    $q.loading.hide()
  }
}

const ajaxLoadAllLeadInfoClosed = async ({ pagination, filter }) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Fetching data ..",
  })
  
  try {
    await store.dispatch("DeviceReplacement/DEVICE_REPLACEMENT_QUEUE_ASSIGNED_LIST", { pagination, filter })
    
    paginationControl2.value = {
      ...pagination,
      rowsNumber: getDeviceReplacementQueueAssignedList.value.totalElements,
      page: getDeviceReplacementQueueAssignedList.value.number + 1
    }
    
    closedDatas.value = getDeviceReplacementQueueAssignedList.value.content || []
    
    if (getDeviceReplacementQueueAssignedList.value.sort?.[0]) {
      paginationControl2.value.sortBy = getDeviceReplacementQueueAssignedList.value.sort[0].property
      paginationControl2.value.descending = getDeviceReplacementQueueAssignedList.value.sort[0].ascending
    }
    
  } catch (error) {

    console.error("Error loading closed data:", error)
  } finally {
    $q.loading.hide()
  }
}

const goToUnassignedTab = async (tab) => {
  if (tab == "unAssigned") {
    const request = {
      pagination: paginationControl1.value,
      filter: filterSearch1.value,
    }
    toggleAjaxLoadFilter.value = true
    try {
      await store.dispatch("DeviceReplacement/DEVICE_REPLACEMENT_QUEUE_UNASSIGNED_LIST", request)
    } finally {
      toggleAjaxLoadFilter.value = false
    }
  } else if (tab == "assigned") {
    const request = {
      pagination: paginationControl.value,
      filter: filterSearch.value,
    }
    toggleAjaxLoadFilter.value = true
    try {
      await store.dispatch("DeviceReplacement/DEVICE_REPLACEMENT_QUEUE_ASSIGNED_LIST", request)
    } finally {
      toggleAjaxLoadFilter.value = false
    }
  } else {
    await ajaxLoadAllLeadInfoClosed({
      pagination: paginationControl2.value,
      filter: filterSearch2.value,
    })
  }
}

const assignImplementationUser = async () => {
  if (formData.value.marsDeviceIdsCooked.length == 0) {
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "Select atleast one item to assign",
      icon: "thumb_down",
    })
    return
  }
  
  if (formData.value.assignTo == "") {
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "Implementation officer cannot be empty!",
      icon: "thumb_down",
    })
    return
  }
  
  if (formData.value.requestMode == 1 && !formData.value.podNumber) {
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "Pod Number cannot be empty!",
      icon: "thumb_down",
    })
    return
  }
  
  const marsDeviceIdsCooked = formData.value.marsDeviceIdsCooked.map(value => value.id)
  
  const postValues = {
    marsDeviceIds: marsDeviceIdsCooked,
    userId: formData.value.assignTo,
    podNumber: formData.value.podNumber,
    requestMode: formData.value.requestMode
  }
  
  try {
    await store.dispatch("DeviceReplacement/DEVICE_REPLACEMENT_QUEUE_SUBMIT", postValues)
    
    // Refresh data
    await Promise.all([
      ajaxLoadAllLeadInfo({
        pagination: paginationControl.value,
        filter: filterSearch.value
      }),
      ajaxLoadAllLeadInfo1({
        pagination: paginationControl1.value,
        filter: filterSearch1.value
      })
    ])
    
    // Reset form
    formData.value.marsDeviceIdsCooked = []
    formData.value.assignTo = ""
    formData.value.podNumber = ""
    
    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Successfully assigned!",
      icon: "thumb_up",
    })
    
  } catch {

    $q.notify({
      color: "negative",
      position: "bottom",
      message: "Please try again",
      icon: "thumb_down",
    })
  }
}

const toggleLeadInformation = (leadDetails) => {
  propToggleLeadInformation.value = !propToggleLeadInformation.value
  if (leadDetails != undefined) {
    addtnLeadInformation.value = leadDetails
  }
}

// Placeholder methods for other actions
const financeApproveSubmit = (leadId) => {
  console.log("Finance approve for lead:", leadId)
  // Implement actual logic here
}

const openRejectModel = (row) => {
  console.log("Open reject model for:", row)
  // Implement actual logic here
}
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
  border-bottom: 2px solid #e0e0e0;
}
.common-dark-blue {
  background-color: #1976d2;
  color: white;
}
</style>