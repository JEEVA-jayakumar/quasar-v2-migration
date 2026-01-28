<template>
  <q-page>
    <!-- Service Request Popup -->
    <div>
      <internalServiceRequestPopup
        v-if="propToggleServiceRequest"
        :ServiceRequest="addtnServiceRequest"
        :propToggleServiceRequestPop="propToggleServiceRequest"
        @closeServiceRequest="toggleServiceRequest"
      />
    </div>

    <div>
      <!-- Unassigned Tab Footer -->
      <q-card class="group q-pa-md" v-if="selectedTab === 'unAssigned'">
        <div class="row items-center q-gutter-y-sm" style="display: flex; justify-content: space-between; width: 100%;">
          <div class="col-md-3 col-sm-6 col-xs-6 text-grey-7 text-weight-medium" style="text-align: left;">
            <span class="text-h6">{{ formData.marsDeviceIdsCooked.length }}</span> / selected
          </div>

          <div class="col-md-3 col-sm-6 col-xs-6" style="flex: 1; max-width: 200px; text-align: right;">
            <q-select
              filled
              use-input
              input-debounce="0"
              clearable
              v-model="formData.assignTo.id"
              color="grey-9"
              :disable="formData.marsDeviceIdsCooked.length === 0"
              :options="filteredAssignToOptions"
              label="Assign To"
              @filter="filterAssignTo"
            />
          </div>

          <div class="col-md-3 col-sm-6 col-xs-6" style="flex: 1; max-width: 200px; text-align: right;">
            <q-select
              filled
              use-input
              input-debounce="0"
              clearable
              v-model="formData.assignTo.region"
              color="grey-9"
              :disable="formData.marsDeviceIdsCooked.length === 0"
              :options="filteredRegionOptions"
              label="Assign To Region"
              @filter="filterRegion"
            />
          </div>

          <div class="col-md-3 col-sm-6 col-xs-6" style="text-align: right;">
            <q-btn
              no-caps
              :disabled="((formData.assignTo.id === '' || formData.assignTo.id === null) && (formData.assignTo.region === '' || formData.assignTo.region === null))"
              label="Assign"
              color="primary"
              @click="assignImplementationUser"
            />
          </div>
        </div>
      </q-card>

      <!-- Assigned Tab Footer -->
      <q-card class="group q-pa-md" v-if="selectedTab === 'assigned'">
        <div class="row items-center q-gutter-y-sm">
          <div class="col-md-9 col-sm-12 col-xs-12">
            <div class="row items-center">
              <div class="col-md-4 col-sm-6 col-xs-6 group"></div>
            </div>
          </div>
        </div>
      </q-card>

      <!-- Tabs -->
      <q-tabs
        v-model="selectedTab"
        class="shadow-1"
        dense
        active-color="dark"
        @update:model-value="goToUnassignedTab"
      >
        <q-tab name="unAssigned" label="Unassigned" />
        <q-tab name="assigned" label="Assigned" />
      </q-tabs>

      <q-tab-panels v-model="selectedTab" animated>
        <!-- Unassigned Tab Panel -->
        <q-tab-panel name="unAssigned">
          <q-table
            :rows="tableData3"
            :columns="columnDataUnassigned"
            row-key="id"
            :filter="filterSearch1"
            selection="multiple"
            v-model:selected="formData.marsDeviceIdsCooked"
            v-model:pagination="paginationControl1"
            :loading="tableAjaxLoading1"
            :rows-per-page-options="[5, 10, 15, 20]"
            color="dark"
            @request="ajaxLoadAllLeadInfo1"
          >
            <template v-slot:body-cell-serviceReqTicketId="props">
              <q-td :props="props" class="cursor-pointer" @click="toggleServiceRequest(props.row)">
                <span class="text-primary"># {{ props.row.serviceReqTicketId }}</span>
              </q-td>
            </template>

            <template v-slot:body-cell-createdDate="props">
              <q-td :props="props">
                {{ formatDate(props.row.createdDate, 'Do MMM Y') }}
              </q-td>
            </template>

            <template v-slot:body-cell-updatedDate="props">
              <q-td :props="props">
                {{ formatDate(props.row.updatedDate, 'Do MMM Y') }}
              </q-td>
            </template>

            <template v-slot:body-cell-serviceRequestTicketStatus="props">
              <q-td :props="props">
                <span class="text-positive" v-if="props.row.serviceRequestTicketStatus === 1">REQUEST_UNASSIGNED</span>
                <span class="text-negative" v-else-if="props.row.serviceRequestTicketStatus === 2">REQUEST_ASSIGNED</span>
                <span class="text-negative" v-else-if="props.row.serviceRequestTicketStatus === 3">REQUEST_CLOSED</span>
                <span v-else>NA</span>
              </q-td>
            </template>

            <template v-slot:body-cell-kaptureDueDate="props">
              <q-td :props="props">
                {{ props.row.kaptureDueDate ? formatDate(props.row.kaptureDueDate, 'Do MMM Y') : 'NA' }}
              </q-td>
            </template>

            <template v-slot:body-cell-appointmentDate="props">
              <q-td :props="props">
                {{ props.row.appointmentDate ? formatDate(props.row.appointmentDate, 'Do MMM Y') : 'NA' }}
              </q-td>
            </template>

            <template v-slot:body-cell-courierDueDate="props">
              <q-td :props="props">
                {{ props.row.courierDueDate ? formatDate(props.row.courierDueDate, 'Do MMM Y') : 'NA' }}
              </q-td>
            </template>

            <template v-slot:body-cell-scheduleDate="props">
              <q-td :props="props">
                {{ props.row.scheduleDate ? formatDate(props.row.scheduleDate, 'Do MMM Y') : 'NA' }}
              </q-td>
            </template>

            <template v-slot:top>
              <div class="col-md-5">
                <q-input
                  filled
                  clearable
                  color="grey-9"
                  v-model="filterSearch1"
                  label="Search By ServiceReqTicketId, TID .."
                  class="q-mr-lg q-py-sm"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- Assigned Tab Panel -->
        <q-tab-panel name="assigned">
          <q-table
            :rows="tableData1"
            :columns="columnDataAssigned"
            row-key="id"
            :filter="filterSearch"
            v-model:pagination="paginationControl"
            v-model:selected="formData.marsDeviceIdsCookedUnAssinged"
            :loading="tableAjaxLoading"
            :rows-per-page-options="[5, 10, 15, 20]"
            color="dark"
            @request="ajaxLoadAllLeadInfo"
          >
            <template v-slot:body="props">
              <q-tr :props="props" class="bottom-border">
                <q-td key="serviceReqTicketId">
                  <q-checkbox
                    v-model="props.row.expand"
                    checked-icon="fas fa-chevron-up"
                    unchecked-icon="fas fa-chevron-down"
                    color="grey-9"
                    class="q-mr-md"
                    @update:model-value="expandRowPlease(props.row)"
                  />
                  <span>{{ props.row.serviceReqTicketId }}</span>
                </q-td>
                <q-td key="tid">{{ props.row.tid }}</q-td>
                <q-td key="mid">
                  <span v-if="props.row.mid">{{ props.row.mid }}</span>
                  <span v-else>NA</span>
                </q-td>
                <q-td key="createdDate">{{ formatDate(props.row.createdDate, 'Do MMM Y') }}</q-td>
                <q-td key="updatedDate">{{ formatDate(props.row.updatedDate, 'Do MMM Y') }}</q-td>
                <q-td key="meName">{{ props.row.meName }}</q-td>
                <q-td key="address">{{ props.row.address }}</q-td>
                <q-td key="contactNumber">{{ props.row.contactNumber }}</q-td>
                <q-td key="pincode">{{ props.row.pincode }}</q-td>
                <q-td key="bpRegion">{{ props.row.bpRegion.regionAreaName }}</q-td>
                <q-td key="assignedTo">
                  {{ props.row.assignedTo ? `${props.row.assignedTo.name} | ${props.row.assignedTo.employeeID}` : 'NA' }}
                </q-td>
                <q-td key="crmRemark">
                  <span v-if="props.row.crmRemark" v-html="props.row.crmRemark"></span>
                  <span v-else>NA</span>
                </q-td>
                <q-td key="deviceType">{{ props.row.deviceType }}</q-td>
                <q-td key="serviceRequestSubTicketStatus">
                  {{ props.row.subTicketsList[0] ? props.row.subTicketsList[0].serviceRequestSubTicketStatus.name : 'NA' }}
                </q-td>
                <q-td key="serviceRequestMode">{{ props.row.serviceRequestMode }}</q-td>
                <q-td key="serviceRequestTicketStatus">
                  <span class="text-positive" v-if="props.row.serviceRequestTicketStatus === 1">REQUEST_UNASSIGNED</span>
                  <span class="text-negative" v-else-if="props.row.serviceRequestTicketStatus === 2">REQUEST_ASSIGNED</span>
                  <span class="text-negative" v-else-if="props.row.serviceRequestTicketStatus === 3">REQUEST_CLOSED</span>
                  <span v-else>NA</span>
                </q-td>
                <q-td key="remarks">
                  <span v-if="props.row.reAssignRemark" v-html="props.row.reAssignRemark"></span>
                  <span v-else>NA</span>
                </q-td>
                <q-td key="action">
                  <q-btn
                    push
                    class="q-mx-sm"
                    color="positive"
                    size="sm"
                    @click="fnReassignData(props.row)"
                  >
                    Re-Assign
                  </q-btn>
                </q-td>
              </q-tr>

              <!-- Expanded Row -->
              <q-tr v-show="props.row.expand" :props="props" class="wordWrapCustom bottom-border">
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Request Type</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id">
                      <span>{{ col.serviceRequestType ? col.serviceRequestType.name : 'NA' }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">IssueType</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id">
                      <span>{{ col.serviceRequestIssueType ? col.serviceRequestIssueType.name : 'NA' }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">SubTicket Status</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id">
                      <span>{{ col.serviceRequestSubTicketStatus ? col.serviceRequestSubTicketStatus.name : 'NA' }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Schedule Date</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id">
                      <span>{{ col.scheduleDate || 'NA' }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Pod Number</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id">
                      <span>{{ col.podNumber || 'NA' }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Service Remarks</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id">
                      <span>{{ col.serviceRemarks || 'NA' }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Cancel Reason</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id">
                      <span>{{ col.cancelReason || 'NA' }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Issue Remark</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id">
                      <span>{{ col.issueRemark || 'NA' }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Remark</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id">
                      <span>{{ col.remark || 'NA' }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Latitude</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id">
                      <span>{{ col.latitude || 'NA' }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Longitude</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id">
                      <span>{{ col.longitude || 'NA' }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Implementation Form</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id">
                      <span>{{ col.implementationForm || 'NA' }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Picture Of Shop</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id">
                      <span>{{ col.pictureOfShop || 'NA' }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Old Sim Number</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id">
                      <span>{{ col.oldSimNumber || 'NA' }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Old Sim Network</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id">
                      <span>{{ col.oldSimNetwork || 'NA' }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">New Sim Number</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id">
                      <span>{{ col.newSimNumber || 'NA' }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">New Sim Network</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id">
                      <span>{{ col.newSimNetwork || 'NA' }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Scan Sim Number</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id">
                      <span>{{ col.scanSimNumber || 'NA' }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Scan Device</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id">
                      <span>{{ col.scanDeviceSerialNumber || 'NA' }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Part Type</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id">
                      <span>{{ col.partType || 'NA' }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Paper Roll Count</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id">
                      <span>{{ col.paperRollCount || 'NA' }}</span><br />
                    </div>
                  </div>
                </q-td>
              </q-tr>
            </template>

            <template v-slot:top>
              <div class="col-md-5">
                <q-input
                  filled
                  clearable
                  color="grey-9"
                  v-model="filterSearch"
                  label="Search By ServiceReqTicketId, TID .."
                  class="q-mr-lg q-py-sm"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>

      <UpdateOpenedExternal
        v-if="propShowUpdateOpenedExternal"
        :propShowUpdateOpenedExternal="propShowUpdateOpenedExternal"
        :propRowDetails="propRowDetails"
        @emitfnshowUpdateOpenedExternal="fnReassignData"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import moment from 'moment'

// Components
import internalServiceRequestPopup from '../../components/sat/internalServiceRequestPopup.vue'
import UpdateOpenedExternal from '../../components/sat/UpdateOpenedExternal.vue'

// Composables
const $q = useQuasar()
const store = useStore()
const router = useRouter()

// Reactive state
const propToggleServiceRequest = ref(false)
const propShowUpdateOpenedExternal = ref(false)
const addtnServiceRequest = ref(null)
const propRowDetails = ref(null)

const filterSearch = ref('')
const filterSearch1 = ref('')
const selectedTab = ref('assigned')
const assignToOptions = ref([])
const assignToRegionOptions = ref([])
const filteredAssignToOptions = ref([])
const filteredRegionOptions = ref([])
const tableData1 = ref([])
const tableData3 = ref([])
const externalUnAssignedTableData = ref([])
const externalAssignedTableData = ref([])

const formData = ref({
  marsDeviceIdsCooked: [],
  marsDeviceIdsCookedUnAssinged: [],
  triggerWelcomeMail: false,
  assignTo: {
    id: '',
    region: ''
  },
  podNumber: ''
})

const columnDataAssigned = ref([
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
    label: 'Merchant Name',
    align: 'left',
    field: row => row.meName || 'NA',
    sortable: false
  },
  {
    name: 'address',
    required: true,
    label: 'Address',
    align: 'left',
    field: row => row.address || 'NA',
    sortable: false
  },
  {
    name: 'contactNumber',
    required: true,
    label: 'Contact Number',
    align: 'left',
    field: row => row.contactNumber || 'NA',
    sortable: false
  },
  {
    name: 'pincode',
    required: true,
    label: 'Pincode',
    align: 'left',
    field: row => row.pincode || 'NA',
    sortable: false
  },
  {
    name: 'bpRegion',
    required: true,
    label: 'BpRegion',
    align: 'left',
    field: row => row.bpRegion ? row.bpRegion.regionAreaName : 'NA',
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
    field: row => {
      const issues = []
      if (row.subTicketsList.length > 0) {
        row.subTicketsList.forEach((element, index) => {
          if (element.serviceRequestSubTicketStatus) {
            issues.push(`${index + 1}.${element.serviceRequestSubTicketStatus.name}   `)
          }
        })
      }
      return issues
    },
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
  },
  {
    name: 'remarks',
    required: true,
    label: 'Re-Assign Remarks',
    align: 'left',
    field: row => row.reAssignRemark,
    sortable: false
  },
  {
    name: 'action',
    required: true,
    label: 'Re-Assign',
    align: 'center',
    field: 'action',
    sortable: true
  }
])

const columnDataUnassigned = ref([
  {
    name: 'serviceReqTicketId',
    required: true,
    label: 'ServiceReqTicketId',
    align: 'left',
    field: row => row.serviceReqTicketId,
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
    label: 'Merchant Name',
    align: 'left',
    field: row => row.meName || 'NA',
    sortable: false
  },
  {
    name: 'address',
    required: true,
    label: 'Address',
    align: 'left',
    field: row => row.address || 'NA',
    sortable: false
  },
  {
    name: 'contactNumber',
    required: true,
    label: 'Contact Number',
    align: 'left',
    field: row => row.contactNumber || 'NA',
    sortable: false
  },
  {
    name: 'pincode',
    required: true,
    label: 'Pincode',
    align: 'left',
    field: row => row.pincode || 'NA',
    sortable: false
  },
  {
    name: 'bpRegion',
    required: true,
    label: 'BpRegion',
    align: 'left',
    field: row => row.bpRegion ? row.bpRegion.regionAreaName : 'NA',
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
    field: row => row.subTicketsList[0] ? row.subTicketsList[0].serviceRequestSubTicketStatus.name : 'NA',
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
])

const paginationControl = ref({
  sortBy: 'createdDate',
  descending: false,
  page: 1,
  rowsPerPage: 10
})

const paginationControl1 = ref({
  sortBy: 'createdDate',
  descending: false,
  page: 1,
  rowsPerPage: 10
})

const tableAjaxLoading = ref(false)
const tableAjaxLoading1 = ref(false)

const getImplementationExecutiveList = computed(() => 
  store.getters['ImplementationExecutive/getImplementationExecutiveList']
)
const getRegionList = computed(() => 
  store.getters['ImplementationExecutive/getRegionList']
)
const getserviceRequestPhonepeUnassignedDatas = computed(() => 
  store.getters['serviceRequestPhonepeSat/getserviceRequestPhonepeUnassignedDatas']
)
const getserviceRequestPhonepeAssignedDatas = computed(() => 
  store.getters['serviceRequestPhonepeSat/getserviceRequestPhonepeAssignedDatas']
)

// Methods
const formatDate = (date, format) => {
  return date ? moment(date).format(format) : 'NA'
}

const filterAssignTo = (val, update) => {
  update(() => {
    if (val === '') {
      filteredAssignToOptions.value = assignToOptions.value
    } else {
      const needle = val.toLowerCase()
      filteredAssignToOptions.value = assignToOptions.value.filter(
        v => v.label.toLowerCase().indexOf(needle) > -1
      )
    }
  })
}

const filterRegion = (val, update) => {
  update(() => {
    if (val === '') {
      filteredRegionOptions.value = assignToRegionOptions.value
    } else {
      const needle = val.toLowerCase()
      filteredRegionOptions.value = assignToRegionOptions.value.filter(
        v => v.label.toLowerCase().indexOf(needle) > -1
      )
    }
  })
}

const ajaxLoadAllLeadInfo1 = async ({ pagination, filter }) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: 'purple-9',
    message: 'Fetching data ..'
  })

  try {
    await store.dispatch('serviceRequestPhonepeSat/FETCH_PHONEPE_UNASSIGNED_SERVICE_REQUEST_DATAS1', {
      pagination,
      filter
    })

    await store.dispatch('ImplementationExecutive/IMPLEMENTATION_EXECUTIVE_LIST')
    const assumeArr = []
    getImplementationExecutiveList.value.map(value => {
      assumeArr.push({
        label: `${value.name} | ${value.employeeID} | ${value.email}`,
        value: value.id
      })
    })
    assignToOptions.value = assumeArr
    filteredAssignToOptions.value = assumeArr

    await store.dispatch('ImplementationExecutive/REGION_LIST')
    const assumeArrData = []
    getRegionList.value.map(value => {
      assumeArrData.push({
        label: value.regionAreaName,
        value: value.regionAreaName
      })
    })
    assignToRegionOptions.value = assumeArrData
    filteredRegionOptions.value = assumeArrData

    paginationControl1.value = pagination
    paginationControl1.value.rowsNumber = getserviceRequestPhonepeUnassignedDatas.value.totalElements
    paginationControl1.value.page = getserviceRequestPhonepeUnassignedDatas.value.number + 1

    tableData3.value = getserviceRequestPhonepeUnassignedDatas.value.content
    externalUnAssignedTableData.value = tableData3.value.filter(service => service.source === true)

    if (getserviceRequestPhonepeUnassignedDatas.value.sort) {
      paginationControl1.value.sortBy = getserviceRequestPhonepeUnassignedDatas.value.sort[0].property
      paginationControl1.value.descending = getserviceRequestPhonepeUnassignedDatas.value.sort[0].ascending
    }

    $q.loading.hide()
  } catch {
    $q.loading.hide()
  }
}

const ajaxLoadAllLeadInfo = async ({ pagination, filter }) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: 'purple-9',
    message: 'Fetching data ..'
  })

  try {
    await store.dispatch('serviceRequestPhonepeSat/FETCH_PHONEPE_ASSIGNED_SERVICE_REQUEST_DATAS', {
      pagination,
      filter
    })

    paginationControl.value = pagination
    paginationControl.value.rowsNumber = getserviceRequestPhonepeAssignedDatas.value.totalElements
    paginationControl.value.page = getserviceRequestPhonepeAssignedDatas.value.number + 1

    tableData1.value = getserviceRequestPhonepeAssignedDatas.value.content
    externalAssignedTableData.value = tableData1.value.filter(service => service.source === true)

    if (getserviceRequestPhonepeAssignedDatas.value.sort) {
      paginationControl.value.sortBy = getserviceRequestPhonepeAssignedDatas.value.sort[0].property
      paginationControl.value.descending = getserviceRequestPhonepeAssignedDatas.value.sort[0].ascending
    }

    $q.loading.hide()
  } catch {
    $q.loading.hide()
  }
}

const goToUnassignedTab = (tab) => {
  if (tab === 'unAssigned') {
    ajaxLoadAllLeadInfo1({
      pagination: paginationControl1.value,
      filter: filterSearch1.value
    })
  } else {
    ajaxLoadAllLeadInfo({
      pagination: paginationControl.value,
      filter: filterSearch.value
    })
  }
}

const assignImplementationUser = async () => {
  if (formData.value.marsDeviceIdsCooked.length === 0) {
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Select atleast one item to assign',
      icon: 'thumb_down'
    })
    return
  }

  if (formData.value.assignTo.id === '' && formData.value.assignTo.region === '') {
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Select Any One Request mode',
      icon: 'thumb_down'
    })
    return
  }

  if (formData.value.assignTo.id && formData.value.assignTo.region) {
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Select Only One Request mode',
      icon: 'thumb_down'
    })
    return
  }

  if (formData.value.assignTo.id && (!formData.value.assignTo.region || formData.value.assignTo.region === '')) {
    $q.loading.show({
      delay: 100,
      spinnerColor: 'purple-9',
      message: 'Please wait..'
    })

    const marsDeviceIdsCooked = formData.value.marsDeviceIdsCooked.map(value => {
      value.podNumber = formData.value.podNumber
      value.serviceRequestMode = formData.value.serviceRequestMode
      return value
    })

    const postValues = {
      request: marsDeviceIdsCooked,
      userId: formData.value.assignTo.id
    }

    try {
      const res = await store.dispatch('serviceRequestPhonepeSat/PHONEPE_SERVICE_REQUEST_UNASSIGED_TO_ASSIGNED_STATE', postValues)
      
      if (res.status === 200 && res.data.data.serviceRequest) {
        formData.value.marsDeviceIdsCooked = []
        formData.value.assignTo = { id: '', region: '' }
        $q.notify({
          color: 'positive',
          position: 'bottom',
          message: 'Successfully assigned!',
          icon: 'thumb_up'
        })
        $q.loading.hide()
        ajaxLoadAllLeadInfo1({
          pagination: paginationControl.value,
          filter: filterSearch.value
        })
      } else if (res.status === 200 && res.data.data.Success) {
        formData.value.marsDeviceIdsCooked = []
        formData.value.assignTo = { id: '', region: '' }
        $q.notify({
          color: 'positive',
          position: 'bottom',
          message: 'Successfully assigned!',
          icon: 'thumb_up'
        })
        $q.loading.hide()
        ajaxLoadAllLeadInfo1({
          pagination: paginationControl.value,
          filter: filterSearch.value
        })
      } else if (res.status === 200 && res.data.data.Failed) {
        router.push({
          name: 'externalServiceAddressFetch',
          params: { data: res }
        })
      } else {
        $q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'INTERNAL SERVER ERROR !!',
          icon: 'thumb_down'
        })
        $q.loading.hide()
      }
    } catch {
      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: 'Please try again',
        icon: 'thumb_down'
      })
      $q.loading.hide()
    }
  } else if (formData.value.assignTo.region && (!formData.value.assignTo.id || formData.value.assignTo.id === '')) {
    $q.loading.show({
      delay: 100,
      spinnerColor: 'purple-9',
      message: 'Please wait..'
    })

    const marsDeviceIdsCooked = formData.value.marsDeviceIdsCooked.map(value => ({
      serviceReqTicketId: value.serviceReqTicketId,
      bpRegion: {
        regionAreaName: formData.value.assignTo.region
      }
    }))

    try {
      const res = await store.dispatch('serviceRequestPhonepeSat/PHONEPE_SERVICE_REQUEST_TO_ASSIGNED_REGION', marsDeviceIdsCooked)
      
      if (res.status === 200) {
        formData.value.marsDeviceIdsCooked = []
        formData.value.assignTo = { id: '', region: '' }
        $q.notify({
          color: 'positive',
          position: 'bottom',
          message: res.body.data,
          icon: 'thumb_up'
        })
        $q.loading.hide()
        ajaxLoadAllLeadInfo1({
          pagination: paginationControl.value,
          filter: filterSearch.value
        })
      } else {
        $q.notify({
          color: 'negative',
          position: 'bottom',
          message: res.body.data,
          icon: 'thumb_down'
        })
        $q.loading.hide()
      }
    } catch (error) {
      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: error.body.data,
        icon: 'thumb_down'
      })
      $q.loading.hide()
    }
  }
}

const fnReassignData = (rowDetails) => {
  propShowUpdateOpenedExternal.value = !propShowUpdateOpenedExternal.value
  ajaxLoadAllLeadInfo({ pagination: paginationControl.value, filter: filterSearch.value })
  
  if (rowDetails !== undefined) {
    propRowDetails.value = rowDetails
  }
}

const expandRowPlease = () => {
  // Expand row logic if needed
}

const toggleServiceRequest = (leadDetails) => {
  propToggleServiceRequest.value = !propToggleServiceRequest.value
  if (leadDetails !== undefined) {
    addtnServiceRequest.value = leadDetails
  }
}

const getPincodeInformations = async () => {
  await store.dispatch('SuperAdminUsers/FETCH_ALL_STATES_DATA')
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