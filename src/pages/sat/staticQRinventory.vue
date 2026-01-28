<template>
  <q-page>
    <div>
      <div class="col-md-9 col-sm-12 col-xs-12">
        <div v-if="RegionalInventoryQrCount.length > 0" class="row">
          <q-card 
            v-for="menu in RegionalInventoryQrCount" 
            :key="menu.value"
            class="border-radius-10 q-pa-md q-ma-md" 
            style="height: auto; width: auto;"
          >
            <div>
              <big>{{ menu.label.requestCount || 0 }}</big>
            </div>
            <div>
              <label>{{ menu.value }}</label>
            </div>
          </q-card>
        </div>
        <div v-else class="row group">
          <q-banner class="bg-purple-9 text-white">
            <template #avatar>
              <q-icon name="info" color="white" />
            </template>
            No data available to display
          </q-banner>
        </div>
      </div>
      
      <div>
        <q-tabs v-model="activeTab" class="shadow-1 text-grey-1">
          <q-tab name="tab-1" label="Pending QR" />
          <q-tab name="tab-2" label="Approved QR" />
          <q-tab name="tab-3" label="Allocate To SO" />
        </q-tabs>
        
        <q-tab-panels v-model="activeTab" animated>
          <!-- Pending QR Tab -->
          <q-tab-panel name="tab-1">
            <div class="row items-center q-mb-md">
              <div class="col-8"></div>
              <div class="col-4">
                <q-input 
                  v-model="filter"
                  clearable
                  color="grey-9"
                  placeholder="Search By POD Number"
                  dense
                  outlined
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </div>
            
            <q-table
              :data="tableData"
              :columns="columns"
              :filter="filter"
              :rows-per-page-options="[5, 10, 15]"
              v-model:pagination="paginationControl"
              :loading="toggleAjaxLoadFilter"
              @request="ajaxLoadAllLeadInfo"
              row-key="id"
            >
              <template #body-cell-updatedAt="props">
                <q-td :props="props">
                  {{ formatDate(props.row.updatedAt) }}
                </q-td>
              </template>
              
              <template #body-cell-Action="props">
                <q-td :props="props">
                  <q-btn
                    dense
                    no-caps
                    label="Approve"
                    icon="edit"
                    @click="ApproveIncomingData(props.row)"
                    flat
                    class="text-primary"
                  />
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>
          
          <!-- Approved QR Tab -->
          <q-tab-panel name="tab-2">
            <div class="row q-mb-md">
              <div class="col-8"></div>
              <div class="col-4">
                <q-input
                  v-model="filter1"
                  clearable
                  color="grey-9"
                  placeholder="Search By POD Number"
                  dense
                  outlined
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </div>
            
            <q-table
              :data="tableData1"
              :columns="columns2"
              :filter="filter1"
              :rows-per-page-options="[5, 10, 15]"
              v-model:pagination="paginationControl1"
              :loading="toggleAjaxLoadFilter1"
              @request="ajaxLoadAllLeadInfo1"
              row-key="id"
            >
              <template #body-cell-updatedAt="props">
                <q-td :props="props">
                  {{ formatDate(props.row.updatedAt) }}
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>
          
          <!-- Allocate To SO Tab -->
          <q-tab-panel name="tab-3">
            <div>
              <!-- Form Section -->
              <div class="row q-mb-md">
                <div class="col-md-2 size7">
                  <strong>Select Bank</strong>
                </div>
                <div class="col-md-3">
                  <q-select
                    v-model="formData.id"
                    :options="bankListOptions"
                    label="Select Bank"
                    outlined
                    clearable
                    :error="v$.formData.id.$error"
                    @update:model-value="onBankSelect"
                  />
                </div>
              </div>
              
              <div class="row q-mb-md">
                <div class="col-md-2 size7">
                  <strong>Select SO</strong>
                </div>
                <div class="col-md-3">
                  <q-select
                    v-model="formData.soList"
                    :options="SoListData"
                    label="Select SO"
                    outlined
                    clearable
                    :disable="!formData.id"
                    :error="v$.formData.soList.$error"
                  />
                </div>
              </div>
              
              <div class="row q-mb-md">
                <div class="col-md-2 size7">
                  <strong>Enter no of QR</strong>
                </div>
                <div class="col-md-3">
                  <q-input
                    v-model.number="formData.count"
                    type="number"
                    min="1"
                    label="Enter no of QR"
                    outlined
                    :disable="!formData.soList"
                    :error="v$.formData.count.$error"
                  />
                </div>
              </div>
              
              <div class="row q-mb-md">
                <div class="col-md-2 size7">
                  <strong>Enter POD</strong>
                </div>
                <div class="col-md-3">
                  <q-input
                    v-model="formData.podNumber"
                    label="Enter POD"
                    outlined
                    readonly
                    :error="v$.formData.podNumber.$error"
                  />
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6 text-right">
                  <q-btn
                    label="Assign"
                    color="primary"
                    :disable="!formData.count || !formData.id || !formData.soList"
                    @click="fnAssignsubmit"
                  />
                </div>
              </div>
              
              <!-- Tab Section for Lists -->
              <q-tabs v-model="innerTab" class="shadow-1 q-mt-lg">
                <q-tab name="tab-4" label="Pending List" />
                <q-tab name="tab-5" label="Approved List" />
                <q-tab name="tab-6" label="Rejected List" />
              </q-tabs>
              
              <q-tab-panels v-model="innerTab" animated>
                <!-- Pending List -->
                <q-tab-panel name="tab-4">
                  <div class="row q-mb-md">
                    <div class="col-8"></div>
                    <div class="col-4">
                      <q-input
                        v-model="filter4"
                        clearable
                        color="grey-9"
                        placeholder="Search By POD Number"
                        dense
                        outlined
                      >
                        <template v-slot:append>
                          <q-icon name="search" />
                        </template>
                      </q-input>
                    </div>
                  </div>
                  
                  <q-table
                    :data="tableData4"
                    :columns="columns4"
                    :filter="filter4"
                    :rows-per-page-options="[5, 10, 15]"
                    v-model:pagination="paginationControl4"
                    :loading="toggleAjaxLoadFilter4"
                    @request="ajaxLoadAllLeadInfo4"
                    row-key="id"
                  >
                    <template #body-cell-createdAt="props">
                      <q-td :props="props">
                        {{ formatDate(props.row.createdAt) }}
                      </q-td>
                    </template>
                  </q-table>
                </q-tab-panel>
                
                <!-- Approved List -->
                <q-tab-panel name="tab-5">
                  <div class="row q-mb-md">
                    <div class="col-8"></div>
                    <div class="col-4">
                      <q-input
                        v-model="filter5"
                        clearable
                        color="grey-9"
                        placeholder="Search By POD Number"
                        dense
                        outlined
                      >
                        <template v-slot:append>
                          <q-icon name="search" />
                        </template>
                      </q-input>
                    </div>
                  </div>
                  
                  <q-table
                    :data="tableData5"
                    :columns="columns5"
                    :filter="filter5"
                    :rows-per-page-options="[5, 10, 15]"
                    v-model:pagination="paginationControl5"
                    :loading="toggleAjaxLoadFilter5"
                    @request="ajaxLoadAllLeadInfo5"
                    row-key="id"
                  >
                    <template #body-cell-createdAt="props">
                      <q-td :props="props">
                        {{ formatDate(props.row.createdAt) }}
                      </q-td>
                    </template>
                  </q-table>
                </q-tab-panel>
                
                <!-- Rejected List -->
                <q-tab-panel name="tab-6">
                  <div class="row q-mb-md">
                    <div class="col-8"></div>
                    <div class="col-4">
                      <q-input
                        v-model="filter6"
                        clearable
                        color="grey-9"
                        placeholder="Search By POD Number"
                        dense
                        outlined
                      >
                        <template v-slot:append>
                          <q-icon name="search" />
                        </template>
                      </q-input>
                    </div>
                  </div>
                  
                  <q-table
                    :data="tableData6"
                    :columns="columns6"
                    :filter="filter6"
                    :rows-per-page-options="[5, 10, 15]"
                    v-model:pagination="paginationControl6"
                    :loading="toggleAjaxLoadFilter6"
                    @request="ajaxLoadAllLeadInfo6"
                    row-key="id"
                  >
                    <template #body-cell-createdAt="props">
                      <q-td :props="props">
                        {{ formatDate(props.row.createdAt) }}
                      </q-td>
                    </template>
                  </q-table>
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
      
      <!-- Loading Overlay -->
      <q-inner-loading :showing="toggleAjaxLoadFilter || toggleAjaxLoadFilter1">
        <q-spinner-bars size="35px" color="primary" />
      </q-inner-loading>
    </div>
    
    <!-- Modal Component -->
    <staticQrRegionApprove
      v-if="staticQrRegionApproveModal"
      :propsApproveRegionModal="staticQrRegionApproveModal"
      :propsApproveRegion="Data"
      @closeModel="onCloseApproveModal"
    />
  </q-page>
</template>
<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useQuasar, date } from 'quasar'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, minValue } from '@vuelidate/validators'
import staticQrRegionApprove from '../../components/sat/staticQrRegionApprove.vue'

const $q = useQuasar()
const store = useStore()

// Reactive state
const RegionalInventoryQrCount = ref([])
const bankListOptions = ref([])
const SoListData = ref([])
const toggleAjaxLoadFilter = ref(false)
const toggleAjaxLoadFilter1 = ref(false)
const toggleAjaxLoadFilter4 = ref(false)
const toggleAjaxLoadFilter5 = ref(false)
const toggleAjaxLoadFilter6 = ref(false)
const activeTab = ref('tab-1')
const innerTab = ref('tab-4')
const filter = ref('')
const filter1 = ref('')
const filter4 = ref('')
const filter5 = ref('')
const filter6 = ref('')
const staticQrRegionApproveModal = ref(false)
const Data = ref(null)

// Pagination controls
const paginationControl = ref({
  rowsNumber: 5,
  page: 1,
  sortBy: 'updatedAt',
  descending: false,
  rowsPerPage: 5
})

const paginationControl1 = ref({
  rowsNumber: 5,
  page: 1,
  sortBy: 'updatedAt',
  descending: false,
  rowsPerPage: 5
})

const paginationControl4 = ref({
  rowsNumber: 5,
  page: 1,
  sortBy: 'createdAt',
  descending: false,
  rowsPerPage: 5
})

const paginationControl5 = ref({
  rowsNumber: 5,
  page: 1,
  sortBy: 'createdAt',
  descending: false,
  rowsPerPage: 5
})

const paginationControl6 = ref({
  rowsNumber: 5,
  page: 1,
  sortBy: 'createdAt',
  descending: false,
  rowsPerPage: 5
})

// Form data
const formData = reactive({
  id: '',
  soList: '',
  count: '',
  podNumber: '',
  allocate_region: ''
})

// Table data
const tableData = ref([])
const tableData1 = ref([])
const tableData4 = ref([])
const tableData5 = ref([])
const tableData6 = ref([])

// Columns configuration
const columns = [
  {
    name: 'updatedAt',
    label: 'Date',
    align: 'left',
    field: 'updatedAt',
    sortable: true
  },
  {
    name: 'qrBank',
    label: 'Bank Name',
    align: 'left',
    field: row => row.qrBank?.name || 'N/A',
    sortable: false
  },
  {
    name: 'podNumber',
    label: 'Pod Number',
    align: 'left',
    field: 'podNumber',
    sortable: false
  },
  {
    name: 'requestCount',
    label: 'QR Count',
    align: 'left',
    field: 'requestCount',
    sortable: false
  },
  {
    name: 'Action',
    label: 'Action',
    align: 'left',
    sortable: false
  }
]

const columns2 = [
  {
    name: 'updatedAt',
    label: 'Date',
    align: 'left',
    field: 'updatedAt',
    sortable: true
  },
  {
    name: 'qrBank',
    label: 'Bank Name',
    align: 'left',
    field: row => row.qrBank?.name || 'N/A',
    sortable: false
  },
  {
    name: 'podNumber',
    label: 'Pod Number',
    align: 'left',
    field: 'podNumber',
    sortable: false
  },
  {
    name: 'requestCount',
    label: 'QR Count',
    align: 'left',
    field: 'requestCount',
    sortable: false
  }
]

const columns4 = [
  {
    name: 'createdAt',
    label: 'Date',
    align: 'left',
    field: 'createdAt',
    sortable: true
  },
  {
    name: 'qrBank',
    label: 'Bank Name',
    align: 'left',
    field: row => row.qrBank?.name || 'N/A',
    sortable: false
  },
  {
    name: 'podNumber',
    label: 'Pod Number',
    align: 'left',
    field: 'podNumber',
    sortable: false
  },
  {
    name: 'requestCount',
    label: 'QR Count',
    align: 'left',
    field: 'requestCount',
    sortable: false
  },
  {
    name: 'region',
    label: 'Region',
    align: 'left',
    field: row => row.region?.regionAreaName || 'N/A',
    sortable: false
  },
  {
    name: 'so',
    label: 'SO Name',
    align: 'left',
    field: row => row.so ? `${row.so.name} | ${row.so.employeeID}` : 'N/A',
    sortable: false
  }
]

const columns5 = columns4 // Same structure as columns4
const columns6 = columns4 // Same structure as columns4

// Validation rules
const rules = {
  formData: {
    count: { required, minValue: minValue(1) },
    id: { required },
    soList: { required },
    podNumber: { required }
  }
}

const v$ = useVuelidate(rules, { formData })

// Computed properties
const userInfo = computed(() => {
  try {
    return JSON.parse(localStorage.getItem('u_i'))
  } catch  {
    return null
  }
})

// Getters from store
const getpendingQrList = computed(() => store.getters['staticQrInventory/getpendingQrList'])
const getApprovedQrList = computed(() => store.getters['staticQrInventory/getApprovedQrList'])
const getpendingQrListOfSo = computed(() => store.getters['staticQrInventory/getpendingQrListOfSo'])
const getApprovedQrListOfSo = computed(() => store.getters['staticQrInventory/getApprovedQrListOfSo'])
const getRejectedQrListOfSo = computed(() => store.getters['staticQrInventory/getRejectedQrListOfSo'])
const getRegionBasedSO = computed(() => store.getters['InventoryCentral/getRegionBasedSO'])
const getStaticQrReginolInventory = computed(() => store.getters['staticQrInventory/getStaticQrReginolInventory'])

// Methods
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return date.formatDate(dateString, 'Do MMM Y')
}

const loadingData = async (request) => {
  $q.loading.show({
    delay: 0,
    message: 'Fetching data...'
  })
  
  try {
    await store.dispatch('staticQrInventory/FETCH_UNAPPROVED_QR_LIST', request)
    
    const data = getpendingQrList.value
    if (data) {
      paginationControl.value.rowsNumber = data.totalElements || 0
      paginationControl.value.page = (data.number || 0) + 1
      tableData.value = data.content || []
      
      if (data.sort && data.sort.length > 0) {
        paginationControl.value.sortBy = data.sort[0].property
        paginationControl.value.descending = !data.sort[0].ascending
      }
    }
  } catch {

    $q.notify({
      type: 'negative',
      message: 'Failed to load data'
    })
  } finally {
    $q.loading.hide()
  }
}

const ajaxLoadAllLeadInfo = (props) => {
  loadingData({
    pagination: props.pagination,
    filter: props.filter
  })
}

const ajaxLoadAllLeadInfo1 = async (props) => {
  $q.loading.show({
    delay: 0,
    message: 'Fetching approved QR list...'
  })
  
  try {
    await store.dispatch('staticQrInventory/FETCH_APPROVED_QR_LIST', {
      pagination: props.pagination,
      filter: props.filter
    })
    
    const data = getApprovedQrList.value
    if (data) {
      paginationControl1.value.rowsNumber = data.totalElements || 0
      paginationControl1.value.page = (data.number || 0) + 1
      tableData1.value = data.content || []
      
      if (data.sort && data.sort.length > 0) {
        paginationControl1.value.sortBy = data.sort[0].property
        paginationControl1.value.descending = !data.sort[0].ascending
      }
    }
  } catch {

    $q.notify({
      type: 'negative',
      message: 'Failed to load approved QR list'
    })
  } finally {
    $q.loading.hide()
  }
}

const ajaxLoadAllLeadInfo4 = async (props) => {
  $q.loading.show({
    delay: 0,
    message: 'Fetching pending SO list...'
  })
  
  try {
    await store.dispatch('staticQrInventory/FETCH_UNAPPROVED_QR_LIST_OF_SO', {
      pagination: props.pagination,
      filter: props.filter
    })
    
    const data = getpendingQrListOfSo.value
    if (data) {
      paginationControl4.value.rowsNumber = data.totalElements || 0
      paginationControl4.value.page = (data.number || 0) + 1
      tableData4.value = data.content || []
    }
  } catch {

    $q.notify({
      type: 'negative',
      message: 'Failed to load pending SO list'
    })
  } finally {
    $q.loading.hide()
  }
}

const ajaxLoadAllLeadInfo5 = async (props) => {
  $q.loading.show({
    delay: 0,
    message: 'Fetching approved SO list...'
  })
  
  try {
    await store.dispatch('staticQrInventory/FETCH_APPROVED_QR_LIST_OF_SO', {
      pagination: props.pagination,
      filter: props.filter
    })
    
    const data = getApprovedQrListOfSo.value
    if (data) {
      paginationControl5.value.rowsNumber = data.totalElements || 0
      paginationControl5.value.page = (data.number || 0) + 1
      tableData5.value = data.content || []
    }
  } catch {

    $q.notify({
      type: 'negative',
      message: 'Failed to load approved SO list'
    })
  } finally {
    $q.loading.hide()
  }
}

const ajaxLoadAllLeadInfo6 = async (props) => {
  $q.loading.show({
    delay: 0,
    message: 'Fetching rejected SO list...'
  })
  
  try {
    await store.dispatch('staticQrInventory/FETCH_REJECTED_QR_LIST_OF_SO', {
      pagination: props.pagination,
      filter: props.filter
    })
    
    const data = getRejectedQrListOfSo.value
    if (data) {
      paginationControl6.value.rowsNumber = data.totalElements || 0
      paginationControl6.value.page = (data.number || 0) + 1
      tableData6.value = data.content || []
    }
  } catch {

    $q.notify({
      type: 'negative',
      message: 'Failed to load rejected SO list'
    })
  } finally {
    $q.loading.hide()
  }
}

const regionalInventoryCount = async () => {
  try {
    await store.dispatch('staticQrInventory/FETCH_STATIC_QR_REGIONAL_INVENTORY_COUNT')
    const data = getStaticQrReginolInventory.value || []
    
    RegionalInventoryQrCount.value = data.map(item => ({
      label: item,
      value: item.qrBank?.name || 'Unknown'
    }))
  } catch (error) {

    console.error('Failed to load regional inventory count:', error)
  }
}

const fnAjaxGetAllBankList = async () => {
  try {
    const response = await store.dispatch('generateQR/FETCH_BANK_LIST')
    bankListOptions.value = (response?.data?.data || []).map(bank => ({
      label: bank.name,
      value: bank.id
    }))
  } catch (error) {

    bankListOptions.value = []
    console.error('Failed to load bank list:', error)
  }
}

const regionBasedSoLoad = async () => {
  if (!userInfo.value?.region?.id) return
  
  try {
    await store.dispatch('InventoryCentral/FETCH_REGION_BASED_SO', userInfo.value.region.id)
    
    SoListData.value = (getRegionBasedSO.value || []).map(so => ({
      label: `${so.name} | ${so.employeeID} | ${so.email}`,
      value: so.id
    }))
  } catch (error) {

    console.error('Failed to load region based SO:', error)
    SoListData.value = []
  }
}

const onBankSelect = () => {
  // Clear SO selection when bank changes
  formData.soList = ''
  formData.count = ''
}

const podGeneration = () => {
  const name = 'SO'
  const d = new Date()
  const number = d.getTime()
  formData.podNumber = `${name}${number}`
}

const ApproveIncomingData = (rowData) => {
  staticQrRegionApproveModal.value = true
  Data.value = rowData
}

const onCloseApproveModal = () => {
  staticQrRegionApproveModal.value = false
  // Refresh data
  loadingData({
    pagination: paginationControl.value,
    filter: filter.value
  })
  regionalInventoryCount()
}

const fnAssignsubmit = async () => {
  const isValid = await v$.value.$validate()
  
  if (!isValid) {
    $q.notify({
      type: 'warning',
      message: 'Please fill all required fields correctly'
    })
    return
  }
  
  $q.loading.show({
    delay: 0,
    message: 'Assigning QR to SO...'
  })
  
  const request = {
    staticQrBank: {
      id: formData.id
    },
    so: {
      id: formData.soList
    },
    region: {
      id: userInfo.value?.region?.id
    },
    requestedCount: formData.count,
    podNumber: formData.podNumber
  }
  
  try {
    await store.dispatch('generateQR/ASSIGN_SO', request)
    
    $q.notify({
      type: 'positive',
      message: 'Successfully Assigned!'
    })
    
    // Reset form
    formData.id = ''
    formData.soList = ''
    formData.count = ''
    podGeneration()
    
    // Refresh data
    ajaxLoadAllLeadInfo4({ pagination: paginationControl4.value, filter: filter4.value })
    loadingData({ pagination: paginationControl.value, filter: filter.value })
    ajaxLoadAllLeadInfo5({ pagination: paginationControl5.value, filter: filter5.value })
  } catch {

    $q.notify({
      type: 'negative',
      message: 'Failed to assign QR to SO'
    })
  } finally {
    $q.loading.hide()
  }
}

// Lifecycle hooks
onMounted(() => {
  // Initial data loading
  loadingData({
    pagination: paginationControl.value,
    filter: filter.value
  })
  
  ajaxLoadAllLeadInfo4({
    pagination: paginationControl4.value,
    filter: filter4.value
  })
  
  ajaxLoadAllLeadInfo5({
    pagination: paginationControl5.value,
    filter: filter5.value
  })
  
  ajaxLoadAllLeadInfo6({
    pagination: paginationControl6.value,
    filter: filter6.value
  })
  
  regionalInventoryCount()
  fnAjaxGetAllBankList()
  regionBasedSoLoad()
  podGeneration()
})

// Watchers
watch(() => activeTab.value, (newTab) => {
  if (newTab === 'tab-2') {
    ajaxLoadAllLeadInfo1({
      pagination: paginationControl1.value,
      filter: filter1.value
    })
  } else if (newTab === 'tab-1') {
    loadingData({
      pagination: paginationControl.value,
      filter: filter.value
    })
  }
})

watch(() => innerTab.value, (newTab) => {
  if (newTab === 'tab-4') {
    ajaxLoadAllLeadInfo4({
      pagination: paginationControl4.value,
      filter: filter4.value
    })
  } else if (newTab === 'tab-5') {
    ajaxLoadAllLeadInfo5({
      pagination: paginationControl5.value,
      filter: filter5.value
    })
  } else if (newTab === 'tab-6') {
    ajaxLoadAllLeadInfo6({
      pagination: paginationControl6.value,
      filter: filter6.value
    })
  }
})
</script>
<style scoped>
.size7 {
  margin-top: 20px;
  display: flex;
  align-items: center;
}

.border-radius-10 {
  border-radius: 10px;
}

.q-card {
  min-width: 120px;
  text-align: center;
}

.customTableClass :deep(.q-table__top) {
  background-color: #f5f5f5;
}

.q-page {
  padding: 16px;
}
</style>