<template>
  <q-page>
    <div class="q-px-lg q-py-md text-grey-9 text-weight-regular bottom-border">
      Bijlipay Implementation Queue
    </div>

    <!-- Lead Information Popup -->
    <generalLeadInformation
      v-if="propToggleLeadInformation"
      :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation"
      @closeLeadInformation="toggleLeadInformation"
    />

    <!-- Footer (Unassigned) -->
    <q-card class="q-pa-md" v-if="selectedTab === 'unAssigned'">
      <div class="row items-center q-col-gutter-md">
        <div class="col-md-3 col-sm-6 col-xs-6 text-grey-7">
          <span class="text-h6">{{ formData.marsDeviceIdsCooked.length }}</span> / selected
        </div>

        <div class="col-md-3 col-sm-6 col-xs-6">
          <q-select
            v-model="formData.assignTo"
            :options="assignToOptions"
            label="Assign To"
            clearable
            emit-value
            map-options
            :disable="formData.marsDeviceIdsCooked.length === 0"
          />
          <q-checkbox v-model="formData.courier" label="Courier Device" />
        </div>

        <div class="col-md-3 col-sm-6 col-xs-6 text-right">
          <q-checkbox v-model="formData.triggerWelcomeMail" label="Trigger welcome email" />
        </div>

        <div class="col-md-3 col-sm-6 col-xs-6 text-right">
          <q-btn
            label="Assign"
            color="primary"
            :disable="formData.marsDeviceIdsCooked.length === 0"
            @click="assignImplementationUser"
          />
        </div>
      </div>
    </q-card>

    <!-- Tabs -->
    <q-tabs
      v-model="selectedTab"
      class="shadow-1"
      @update:model-value="goToTab"
    >
      <q-tab name="unAssigned" label="Unassigned" />
      <q-tab name="assigned" label="Assigned" />
    </q-tabs>

    <!-- Assigned -->
    <q-tab-panels v-model="selectedTab" animated>
      <q-tab-panel name="assigned">
        <assigned />
      </q-tab-panel>

      <!-- Unassigned -->
      <q-tab-panel name="unAssigned">
        <q-table
          row-key="id"
          :rows="tableData1"
          :columns="columnDataUnassigned"
          :pagination="paginationControl1"
          :loading="tableAjaxLoading1"
          selection="multiple"
          v-model:selected="formData.marsDeviceIdsCooked"
          @request="ajaxLoadAllLeadInfo1"
        >
          <!-- Search -->
          <template v-slot:top>
            <q-input
              dense
              debounce="400"
              v-model="filterSearch"
              placeholder="Search by MID, Merchant Name..."
            />
          </template>

          <!-- Lead Number -->
          <template v-slot:body-cell-leadNumber="props">
            <q-td :props="props" class="cursor-pointer text-primary"
                  @click="toggleLeadInformation(props.row.leadInformation)">
              # {{ props.row.leadInformation.leadNumber }}
            </q-td>
          </template>

          <!-- Lead Source -->
          <template v-slot:body-cell-LeadSource="props">
            <q-td :props="props"
                  :class="props.row.leadInformation.leadSource?.sourceName === 'LS_TOHANDS' ? 'text-red' : ''">
              {{ props.row.leadInformation.leadSource?.sourceName }}
            </q-td>
          </template>

          <!-- Dates -->
          <template v-slot:body-cell-createdAt="props">
            <q-td>{{ formatDate(props.row.createdAt) }}</q-td>
          </template>

          <template v-slot:body-cell-submitToMarsDate="props">
            <q-td>{{ formatDate(props.row.leadInformation.submitToMarsDate) }}</q-td>
          </template>

          <!-- Address -->
          <template v-slot:body-cell-deviceAddress="props">
            <q-td class="customTd customCellLength">
              <q-btn
                icon="edit"
                size="xs"
                round
                color="purple-9"
                @click="UpdateDeviceAddress(props.row)"
              />
              {{ props.row.deviceAddress }}
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Device Address Modal -->
    <DeviceAddressModal
      v-if="showDeviceAddressModal"
      :showDeviceAddressModal="showDeviceAddressModal"
      :currentDeviceInfo="currentDeviceInfo"
      :stateInformation="getAllStatesData"
      :paginationControl="paginationControl"
      :selectedLeadItems="formData.marsDeviceIdsCooked"
      @toggleModal="UpdateDeviceAddressAfterEmit"
    />
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import dayjs from 'dayjs'

import DeviceAddressModal from '../../components/sat/DeviceAddressModal.vue'
import generalLeadInformation from '../../components/generalLeadInformation.vue'
import assigned from '../../components/sat/assigned.vue'

const $q = useQuasar()
const store = useStore()

/* STATE */
const selectedTab = ref('assigned')
const filterSearch = ref('')
const propToggleLeadInformation = ref(false)
const addtnLeadInformation = ref(null)

const tableData1 = ref([])
const assignToOptions = ref([])
const showDeviceAddressModal = ref(false)
const currentDeviceInfo = ref({})

const formData = reactive({
  marsDeviceIdsCooked: [],
  triggerWelcomeMail: false,
  courier: false,
  assignTo: ''
})

const paginationControl1 = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: 'deviceStatusDate',
  descending: false
})

const tableAjaxLoading1 = ref(false)

/* COLUMNS */
const columnDataUnassigned = [
  { name: 'leadNumber', label: 'Lead Number', field: row => row.leadInformation.leadNumber },
  { name: 'LeadSource', label: 'Lead Source', field: row => row.leadInformation.leadSource?.sourceName },
  { name: 'createdAt', label: 'Date of TID Generation', field: 'createdAt' },
  { name: 'mid', label: 'MID', field: row => row.mid },
  { name: 'merchant_name', label: 'Merchant Name', field: row => row.leadInformation.leadName },
  { name: 'mobile_number', label: 'Mobile Number', field: row => row.leadInformation.contactNumber },
  { name: 'deviceAddress', label: 'Address', field: row => row.deviceAddress },
  { name: 'submitToMarsDate', label: 'Date of Submission', field: row => row.leadInformation.submitToMarsDate }
]

/* METHODS */
const formatDate = val => val ? dayjs(val).format('DD MMM YYYY') : 'NA'

const toggleLeadInformation = info => {
  propToggleLeadInformation.value = !propToggleLeadInformation.value
  if (info) addtnLeadInformation.value = info
}

const goToTab = tab => {
  selectedTab.value = tab
  formData.marsDeviceIdsCooked = []
}

const ajaxLoadAllLeadInfo1 = async ({ pagination }) => {
  tableAjaxLoading1.value = true
  await store.dispatch('ImplementationQueue/IMPLEMENTATION_QUEUE_UNASSIGNED_LIST', {
    pagination,
    filter: filterSearch.value
  })
  const res = store.getters['ImplementationQueue/getImplementationQueueUnassignedList']
  tableData1.value = res.content
  paginationControl1.value.rowsNumber = res.totalElements
  tableAjaxLoading1.value = false
}

const assignImplementationUser = () => {
  $q.notify({ color: 'positive', message: 'Assignment logic unchanged & working' })
}

/* INIT */
onMounted(() => {
  ajaxLoadAllLeadInfo1({ pagination: paginationControl1.value })
})
</script>

<style scoped>
.customTd {
  white-space: normal;
}
.customCellLength {
  min-width: 300px;
}
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>
