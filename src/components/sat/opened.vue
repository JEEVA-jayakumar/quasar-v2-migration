<template>
  <q-page>
    <!-- content -->
    <div>
      <internalServiceRequestPopup 
        v-if="propToggleServiceRequest" 
        :ServiceRequest="addtnServiceRequest"
        :propToggleServiceRequestPop="propToggleServiceRequest" 
        @closeServiceRequest="toggleServiceRequest" 
      />
    </div>
    
    <div>
      <!--START: table Footer -->
      <q-card class="group q-pa-md" v-if="selectedTab === 'unAssigned'">
        <div class="row items-center q-gutter-y-sm">
          <div class="col-md-3 col-sm-6 col-xs-6 text-grey-7 text-weight-medium text-left">
            <span class="text-h4">{{ formData.marsDeviceIdsCooked.length }}</span>/ selected
          </div>
          <div class="col-md-3 col-sm-6 col-xs-6 text-grey-7 text-weight-medium">
            <b>
              <label>Request Mode</label>
            </b>
            <div class="col-md-2 col-sm-6 col-xs-6">
              <q-radio 
                v-for="(item, index) in requestOptions" 
                :key="index" 
                color="grey-9"
                v-model="formData.serviceRequestMode" 
                :val="item.value" 
                :label="item.label" 
              />
            </div>
          </div>
          <div v-if="formData.serviceRequestMode === 'Direct Dispatch'" class="col-md-3 col-sm-6 col-xs-6">
            <q-select 
              use-input
              clearable 
              v-model="formData.assignTo.id" 
              color="grey-9" 
              :options="assignToOptions"
              placeholder="Assign To" 
            />
          </div>
          <div v-if="formData.serviceRequestMode === 'SO'" class="col-md-3 col-sm-6 col-xs-6">
            <q-select 
              use-input
              clearable 
              v-model="formData.assignTo.id" 
              color="grey-9" 
              :options="assignToOptions"
              placeholder="Assign To" 
            />
          </div>
          <div class="col-md-3 col-sm-6 col-xs-6 text-right">
            <q-btn 
              no-caps 
              :disable="formData.marsDeviceIdsCooked.length === 0" 
              label="Assign" 
              class="common-dark-blue" 
              @click="assignImplementationUser" 
            />
          </div>
        </div>
      </q-card>
      
      <q-card class="group q-pa-md" v-if="selectedTab === 'assigned'">
        <div class="row items-center q-gutter-y-sm">
          <div class="col-md-9 col-sm-12 col-xs-12">
            <div class="row items-center">
              <div class="col-md-4 col-sm-6 col-xs-6 group"></div>
            </div>
          </div>
        </div>
      </q-card>
      <!--END: table Footer -->
      
      <q-tabs v-model="selectedTab" class="shadow-1" active-color="dark" @update:model-value="goToUnassignedTab">
        <q-tab color="dark" name="unAssigned" label="Unassigned" />
        <q-tab color="dark" name="assigned" label="Assigned" />
      </q-tabs>

      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="unAssigned">
          <q-table 
            :rows="internalUnAssignedTableData" 
            :columns="columnDataUnassigned"
            table-class="customTableClass" 
            :filter="filterSearch1" 
            selection="multiple"
            v-model:selected="formData.marsDeviceIdsCooked" 
            v-model:pagination="paginationControl1" 
            row-key="id"
            :loading="tableAjaxLoading1" 
            :rows-per-page-options="[5, 10, 15, 20]" 
            color="dark"
            @request="ajaxLoadAllLeadInfo1"
          >
            <template v-slot:body-cell-serviceReqTicketId="props">
              <q-td :props="props" class="cursor-pointer" @click="toggleServiceRequest(props.row)">
                <span class="label text-primary"># {{ props.row.serviceReqTicketId }}</span>
              </q-td>
            </template>

            <template v-slot:body-cell-createdDate="props">
              <q-td :props="props">{{ formatDate(props.row.createdDate, "Do MMM Y") }}</q-td>
            </template>
            
            <template v-slot:body-cell-updatedDate="props">
              <q-td :props="props">{{ formatDate(props.row.updatedDate, "Do MMM Y") }}</q-td>
            </template>
            
            <template v-slot:body-cell-serviceRequestSubTicketStatus="props">
              <q-td :props="props">
                <span class="label text-positive" v-if="props.row.serviceRequestSubTicketStatus === 1">SR_TICKET_RAISED</span>
                <span class="label text-positive" v-else-if="props.row.serviceRequestSubTicketStatus === 2">SR_TICKET_ESCALATED_TO_SAT</span>
                <span class="label text-positive" v-else-if="props.row.serviceRequestSubTicketStatus === 3">SR_ASSIGNED_TO_ENGINEER</span>
                <span class="label text-positive" v-else-if="props.row.serviceRequestSubTicketStatus === 4">SR_ISSUE_RESOLVED_COURIERED</span>
                <span class="label text-positive" v-else-if="props.row.serviceRequestSubTicketStatus === 5">SR_DEVICE_COURIERED</span>
                <span class="label text-positive" v-else-if="props.row.serviceRequestSubTicketStatus === 6">SR_ISSUE_RESOLVED_REMOTELY</span>
                <span class="label text-positive" v-else-if="props.row.serviceRequestSubTicketStatus === 7">SR_SCHEDULED_ENGINEER_VISIT</span>
                <span class="label text-positive" v-else-if="props.row.serviceRequestSubTicketStatus === 8">SR_ISSUE_RESOLVED</span>
                <span class="label text-positive" v-else-if="props.row.serviceRequestSubTicketStatus === 9">SR_MERCHANT_NOT_REACHABLE</span>
                <span class="label text-negative" v-else-if="props.row.serviceRequestSubTicketStatus === 10">SR_CANCELLED</span>
                <span class="label" v-else>NA</span>
              </q-td>
            </template>
            
            <template v-slot:body-cell-serviceRequestTicketStatus="props">
              <q-td :props="props">
                <span class="label text-positive" v-if="props.row.serviceRequestTicketStatus === 1">REQUEST_UNASSIGNED</span>
                <span class="label text-negative" v-else-if="props.row.serviceRequestTicketStatus === 2">REQUEST_ASSIGNED</span>
                <span class="label text-negative" v-else-if="props.row.serviceRequestTicketStatus === 3">REQUEST_CLOSED</span>
                <span class="label" v-else>NA</span>
              </q-td>
            </template>
            
            <template v-slot:body-cell-kaptureDueDate="props">
              <q-td :props="props">{{ props.row.kaptureDueDate == null ? "NA" : formatDate(props.row.kaptureDueDate, "Do MMM Y") }}</q-td>
            </template>
            
            <template v-slot:body-cell-appointmentDate="props">
              <q-td :props="props">{{ props.row.appointmentDate == null ? "NA" : formatDate(props.row.appointmentDate, "Do MMM Y") }}</q-td>
            </template>
            
            <template v-slot:body-cell-courierDueDate="props">
              <q-td :props="props">{{ props.row.courierDueDate == null ? "NA" : formatDate(props.row.courierDueDate, "Do MMM Y") }}</q-td>
            </template>
            
            <template v-slot:body-cell-scheduleDate="props">
              <q-td :props="props">{{ props.row.scheduleDate == null ? "NA" : formatDate(props.row.scheduleDate, "Do MMM Y") }}</q-td>
            </template>
            
            <template v-slot:top>
              <div class="col-md-5">
                <q-input 
                  clearable 
                  color="grey-9" 
                  v-model="filterSearch1" 
                  placeholder="Type.."
                  label="Search By ServiceReqTicketId, TID .." 
                  class="q-mr-lg q-py-sm" 
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>
        
        <q-tab-panel name="assigned">
          <q-table 
            :rows="internalAssignedTableData" 
            :columns="columnDataAssigned"
            table-class="customTableClass" 
            :filter="filterSearch" 
            v-model:pagination="paginationControl"
            v-model:selected="formData.marsDeviceIdsCookedUnAssinged" 
            row-key="id" 
            :loading="tableAjaxLoading"
            :rows-per-page-options="[5, 10, 15, 20]" 
            color="dark" 
            @request="ajaxLoadAllLeadInfo"
          >
            <!--START: Table body -->
            <template v-slot:body="props">
              <!--START: table rows -->
              <q-tr :props="props" class="bottom-border">
                <q-td key="serviceReqTicketId">
                  <q-checkbox 
                    checked-icon="fas fa-chevron-up" 
                    unchecked-icon="fas fa-chevron-down"
                    color="grey-9" 
                    v-model="props.row.expand" 
                    class="q-mr-md"
                    @update:model-value="expandRowPlease(props.row)" 
                  />
                  <span>{{ props.row.serviceReqTicketId }}</span>
                </q-td>
                <q-td key="tid" :props="props">{{ props.row.tid }}</q-td>
                <q-td key="mid" :props="props">
                  <span v-if="props.row.mid != null">{{ props.row.mid }}</span>
                  <span v-else>NA</span>
                </q-td>
                <q-td key="createdDate" :props="props">{{ formatDate(props.row.createdDate, "Do MMM Y") }}</q-td>
                <q-td key="updatedDate" :props="props">{{ formatDate(props.row.updatedDate, "Do MMM Y") }}</q-td>
                <q-td key="meName" :props="props">{{ props.row.meName }}</q-td>
                <q-td key="bpRegion" :props="props">{{ props.row.bpRegion.regionAreaName }}</q-td>
                <q-td key="assignedTo" :props="props">{{ props.row.assignedTo.name }}</q-td>
                <q-td key="crmRemark" :props="props">
                  <span v-if="props.row.crmRemark != null" v-html="props.row.crmRemark"></span>
                  <span v-else>NA</span>
                </q-td>
                <q-td key="deviceType" :props="props">{{ props.row.deviceType }}</q-td>

                <q-td key="serviceRequestTicketStatus" :props="props">
                  <span class="label text-positive" v-if="props.row.serviceRequestTicketStatus === 1">REQUEST_UNASSIGNED</span>
                  <span class="label text-negative" v-else-if="props.row.serviceRequestTicketStatus === 2">REQUEST_ASSIGNED</span>
                  <span class="label text-negative" v-else-if="props.row.serviceRequestTicketStatus === 3">REQUEST_CLOSED</span>
                  <span class="label" v-else>NA</span>
                </q-td>
                <q-td key="serviceRequestMode" :props="props">{{ props.row.serviceRequestMode }}</q-td>
                <q-td key="serviceRequestSubTicketStatus" :props="props">
                  <span class="label text-positive" v-if="props.row.serviceRequestSubTicketStatus === 1">SR_TICKET_RAISED</span>
                  <span class="label text-positive" v-else-if="props.row.serviceRequestSubTicketStatus === 2">SR_TICKET_ESCALATED_TO_SAT</span>
                  <span class="label text-positive" v-else-if="props.row.serviceRequestSubTicketStatus === 3">SR_ASSIGNED_TO_ENGINEER</span>
                  <span class="label text-positive" v-else-if="props.row.serviceRequestSubTicketStatus === 4">SR_ISSUE_RESOLVED_COURIERED</span>
                  <span class="label text-positive" v-else-if="props.row.serviceRequestSubTicketStatus === 5">SR_DEVICE_COURIERED</span>
                  <span class="label text-positive" v-else-if="props.row.serviceRequestSubTicketStatus === 6">SR_ISSUE_RESOLVED_REMOTELY</span>
                  <span class="label text-positive" v-else-if="props.row.serviceRequestSubTicketStatus === 7">SR_SCHEDULED_ENGINEER_VISIT</span>
                  <span class="label text-positive" v-else-if="props.row.serviceRequestSubTicketStatus === 8">SR_ISSUE_RESOLVED</span>
                  <span class="label text-positive" v-else-if="props.row.serviceRequestSubTicketStatus === 9">SR_MERCHANT_NOT_REACHABLE</span>
                  <span class="label text-negative" v-else-if="props.row.serviceRequestSubTicketStatus === 10">SR_CANCELLED</span>
                  <span class="label" v-else>NA</span>
                </q-td>
              </q-tr>
              <!-- START: table expand values -->
              <q-tr v-show="props.row.expand" :props="props" class="wordWrapCustom bottom-border">
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Request Type</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id" :props="props">
                      <span>{{ col.serviceRequestType != null ? col.serviceRequestType.name : "NA" }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">IssueType</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id" :props="props">
                      <span>{{ col.serviceRequestIssueType != null ? col.serviceRequestIssueType.name : "NA" }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">SubTicket Status</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id" :props="props">
                      <span>{{ col.serviceRequestSubTicketStatus != null ? col.serviceRequestSubTicketStatus.name : "NA" }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Schedule Date</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id" :props="props">
                      <span>{{ col.scheduleDate != null ? col.scheduleDate : "NA" }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Pod Number</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id" :props="props">
                      <span>{{ col.podNumber != null ? col.podNumber : "NA" }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Service Remarks</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id" :props="props">
                      <span>{{ col.serviceRemarks != null ? col.serviceRemarks : "NA" }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Cancel Reason</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id" :props="props">
                      <span>{{ col.cancelReason != null ? col.cancelReason : "NA" }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Issue Remark</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id" :props="props">
                      <span>{{ col.issueRemark != null ? col.issueRemark : "NA" }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Remark</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id" :props="props">
                      <span>{{ col.remark != null ? col.remark : "NA" }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Latitude</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id" :props="props">
                      <span>{{ col.latitude != null ? col.latitude : "NA" }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Longitude</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id" :props="props">
                      <span>{{ col.longitude != null ? col.longitude : "NA" }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Implementation Form</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id" :props="props">
                      <span>{{ col.implementationForm != null ? col.implementationForm : "NA" }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Picture Of Shop</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id" :props="props">
                      <span>{{ col.pictureOfShop != null ? col.pictureOfShop : "NA" }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Old Sim Number</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id" :props="props">
                      <span>{{ col.oldSimNumber != null ? col.oldSimNumber : "NA" }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Old Sim Network</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id" :props="props">
                      <span>{{ col.oldSimNetwork != null ? col.oldSimNetwork : "NA" }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">New Sim Number</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id" :props="props">
                      <span>{{ col.newSimNumber != null ? col.newSimNumber : "NA" }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">New Sim Network</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id" :props="props">
                      <span>{{ col.newSimNetwork != null ? col.newSimNetwork : "NA" }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Scan Sim Number</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id" :props="props">
                      <span>{{ col.scanSimNumber != null ? col.scanSimNumber : "NA" }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Scan Device</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id" :props="props">
                      <span>{{ col.scanDeviceSerialNumber != null ? col.scanDeviceSerialNumber : "NA" }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Part Type</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id" :props="props">
                      <span>{{ col.partType != null ? col.partType : "NA" }}</span><br />
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div class="text-left text-caption text-grey-8 text-weight-medium">Paper Roll Count</div>
                  <div class="text-left" v-if="props.row.subTicketsList.length > 0">
                    <div v-for="col in props.row.subTicketsList" :key="col.serviceRequestType.id" :props="props">
                      <span>{{ col.paperRollCount != null ? col.paperRollCount : "NA" }}</span><br />
                    </div>
                  </div>
                </q-td>
              </q-tr>
            </template>
            
            <template v-slot:top>
              <div class="col-md-5">
                <q-input 
                  clearable 
                  color="grey-9" 
                  v-model="filterSearch" 
                  placeholder="Type.."
                  label="Search By ServiceReqTicketId, TID .." 
                  class="q-mr-lg q-py-sm" 
                />
              </div>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
      
      <div class="row items-center q-gutter-y-sm">
        <div class="col-md-9 col-sm-12 col-xs-12">
          <div class="row items-center"></div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import moment from 'moment';
import internalServiceRequestPopup from '../../components/sat/internalServiceRequestPopup.vue';

export default {
  name: 'implementationQueue',
  components: {
    internalServiceRequestPopup,
  },
  setup() {
    const $store = useStore();
    const $q = useQuasar();
    const $router = useRouter();

    // Reactive data
    const propToggleLeadInformation = ref(false);
    const propToggleServiceRequest = ref(false);
    const addtnLeadInformation = ref(null);
    const addtnServiceRequest = ref(null);
    const filterSearch = ref('');
    const filterSearch1 = ref('');
    const filterSearch2 = ref('');
    const selectedTab = ref('assigned');
    const assignTo = ref('');
    const assignToOptions = ref([]);
    const tableData = ref([]);
    const tableData1 = ref([]);
    const internalUnAssignedTableData = ref([]);
    const internalAssignedTableData = ref([]);
    const internalClosedTableData = ref([]);
    const tableData2 = ref([]);
    const currentDeviceInfo = ref({});
    const showDeviceAddressModal = ref(false);
    const tableAjaxLoading = ref(false);
    const tableAjaxLoading1 = ref(false);

    const formData = reactive({
      serviceRequestMode: '',
      marsDeviceIdsCooked: [],
      marsDeviceIdsCookedUnAssinged: [],
      triggerWelcomeMail: false,
      assignTo: {
        id: ''
      },
      podNumber: '',
    });

    const requestOptions = [
      {
        label: 'SO',
        value: 'SO',
      },
    ];

    const paginationControl = ref({
      sortBy: 'createdDate',
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
    });

    const paginationControl1 = ref({
      sortBy: 'createdDate',
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
    });

    const paginationControl2 = ref({
      sortBy: 'createdDate',
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
    });

    // Column definitions
    const columnDataAssigned = ref([
      {
        name: 'serviceReqTicketId',
        required: true,
        label: 'ServiceReqTicketId',
        align: 'left',
        field: (row) => row.serviceReqTicketId == null ? 'NA' : row.serviceReqTicketId,
        sortable: false,
      },
      {
        name: 'tid',
        required: true,
        label: 'TID',
        align: 'left',
        field: (row) => row.tid == null ? 'NA' : row.tid,
        sortable: false,
      },
      {
        name: 'mid',
        required: true,
        label: 'MID',
        align: 'left',
        field: (row) => row.mid == null ? 'NA' : row.mid,
        sortable: false,
      },
      {
        name: 'createdDate',
        required: true,
        label: 'CreatedDate',
        align: 'left',
        field: (row) => row.createdDate,
        sortable: true,
      },
      {
        name: 'updatedDate',
        required: true,
        label: 'UpdatedDate',
        align: 'left',
        field: (row) => row.updatedDate,
        sortable: false,
      },
      {
        name: 'meName',
        required: true,
        label: 'ME Name',
        align: 'left',
        field: (row) => row.meName == null ? 'NA' : row.meName,
        sortable: false,
      },
      {
        name: 'bpRegion',
        required: true,
        label: 'BpRegion',
        align: 'left',
        field: (row) => row.bpRegion == null ? 'NA' : row.bpRegion.regionAreaName,
        sortable: false,
      },
      {
        name: 'assignedTo',
        required: true,
        label: 'AssignedTo',
        align: 'left',
        field: (row) => row.assignedTo == null ? 'NA' : row.assignedTo.name,
        sortable: false,
      },
      {
        name: 'crmRemark',
        required: true,
        label: 'CRM Remark',
        align: 'left',
        field: (row) => row.crmRemark == null ? 'NA' : row.crmRemark,
        sortable: false,
      },
      {
        name: 'deviceType',
        required: true,
        label: 'DeviceType',
        align: 'left',
        field: (row) => row.deviceType == null ? 'NA' : row.deviceType,
        sortable: false,
      },
      {
        name: 'serviceRequestSubTicketStatus',
        required: true,
        label: 'ServiceReqIssueStatus',
        align: 'left',
        field: (row) => row.serviceRequestSubTicketStatus,
        sortable: false,
      },
      {
        name: 'serviceRequestMode',
        required: true,
        label: 'RequestMode',
        align: 'left',
        field: (row) => row.serviceRequestMode == null ? 'NA' : row.serviceRequestMode,
        sortable: false,
      },
      {
        name: 'serviceRequestTicketStatus',
        required: true,
        label: 'TicketStatus',
        align: 'left',
        field: (row) => row.serviceRequestTicketStatus,
        sortable: false,
      },
    ]);

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
        field: (row) => row.tid == null ? 'NA' : row.tid,
        sortable: false,
      },
      {
        name: 'mid',
        required: true,
        label: 'MID',
        align: 'left',
        field: (row) => row.mid == null ? 'NA' : row.mid,
        sortable: false,
      },
      {
        name: 'createdDate',
        required: true,
        label: 'CreatedDate',
        align: 'left',
        field: (row) => row.createdDate,
        sortable: true,
      },
      {
        name: 'updatedDate',
        required: true,
        label: 'UpdatedDate',
        align: 'left',
        field: (row) => row.updatedDate,
        sortable: false,
      },
      {
        name: 'meName',
        required: true,
        label: 'ME Name',
        align: 'left',
        field: (row) => row.meName == null ? 'NA' : row.meName,
        sortable: false,
      },
      {
        name: 'bpRegion',
        required: true,
        label: 'BpRegion',
        align: 'left',
        field: (row) => row.bpRegion == null ? 'NA' : row.bpRegion.regionAreaName,
        sortable: false,
      },
      {
        name: 'assignedTo',
        required: true,
        label: 'AssignedTo',
        align: 'left',
        field: (row) => row.assignedTo == null ? 'NA' : row.assignedTo.name,
        sortable: false,
      },
      {
        name: 'crmRemark',
        required: true,
        label: 'CRM Remark',
        align: 'left',
        field: (row) => row.crmRemark == null ? 'NA' : row.crmRemark,
        sortable: false,
      },
      {
        name: 'deviceType',
        required: true,
        label: 'DeviceType',
        align: 'left',
        field: (row) => row.deviceType == null ? 'NA' : row.deviceType,
        sortable: false,
      },
      {
        name: 'serviceRequestSubTicketStatus',
        required: true,
        label: 'ServiceReqIssueStatus',
        align: 'left',
        field: (row) => row.serviceRequestSubTicketStatus,
        sortable: false,
      },
      {
        name: 'serviceRequestMode',
        required: true,
        label: 'RequestMode',
        align: 'left',
        field: (row) => row.serviceRequestMode == null ? 'NA' : row.serviceRequestMode,
        sortable: false,
      },
      {
        name: 'serviceRequestTicketStatus',
        required: true,
        label: 'TicketStatus',
        align: 'left',
        field: (row) => row.serviceRequestTicketStatus,
        sortable: false,
      },
    ]);

    // Computed properties (Vuex getters)
    const getImplementationExecutiveList = computed(
      () => $store.getters['ImplementationExecutive/getImplementationExecutiveList']
    );
    const getserviceRequestUnassignedDatas = computed(
      () => $store.getters['serviceRequestSat/getserviceRequestUnassignedDatas']
    );
    const getserviceRequestassignedDatas = computed(
      () => $store.getters['serviceRequestSat/getserviceRequestassignedDatas']
    );

    // Methods
    const formatDate = (date, format) => {
      return date ? moment(date).format(format) : 'NA';
    };

    const getPincodeInformations = () => {
      $store.dispatch('SuperAdminUsers/FETCH_ALL_STATES_DATA');
    };

    const ajaxLoadAllLeadInfo1 = ({ pagination, filter }) => {
      $q.loading.show({
        delay: 0,
        spinnerColor: 'purple-9',
        message: 'Fetching data ..',
      });
      
      $store.dispatch('serviceRequestSat/FETCH_UNASSIGNED_SERVICE_REQUEST_DATAS', { pagination, filter })
        .then(() => {
          $store.dispatch('ImplementationExecutive/IMPLEMENTATION_EXECUTIVE_LIST').then(() => {
            let assumeArr = [];
            getImplementationExecutiveList.value.map(function (value) {
              assumeArr.push({ label: value.name, value: value.id });
            });
            assignToOptions.value = assumeArr;
          });
          
          paginationControl1.value = pagination;
          paginationControl1.value.rowsNumber = getserviceRequestUnassignedDatas.value.totalElements;
          paginationControl1.value.page = getserviceRequestUnassignedDatas.value.number + 1;
          
          tableData1.value = getserviceRequestUnassignedDatas.value.content;
          internalUnAssignedTableData.value = tableData1.value.filter(service => service.source === true);
          
          if (getserviceRequestUnassignedDatas.value.sort != null) {
            paginationControl1.value.sortBy = getserviceRequestUnassignedDatas.value.sort[0].property;
            paginationControl1.value.descending = getserviceRequestUnassignedDatas.value.sort[0].ascending;
          }
          
          $q.loading.hide();
        })
        .catch(() => {
          $q.loading.hide();
        });
    };

    const ajaxLoadAllLeadInfo = ({ pagination, filter }) => {
      $q.loading.show({
        delay: 0,
        spinnerColor: 'purple-9',
        message: 'Fetching data ..',
      });

      $store.dispatch('serviceRequestSat/FETCH_ASSIGNED_SERVICE_REQUEST_DATAS', { pagination, filter })
        .then(() => {
          paginationControl.value = pagination;
          paginationControl.value.rowsNumber = getserviceRequestassignedDatas.value.totalElements;
          paginationControl.value.page = getserviceRequestassignedDatas.value.number + 1;
          
          tableData.value = getserviceRequestassignedDatas.value.content;
          internalAssignedTableData.value = tableData.value.filter(service => service.source === true);
          
          if (getserviceRequestassignedDatas.value.sort != null) {
            paginationControl.value.sortBy = getserviceRequestassignedDatas.value.sort[0].property;
            paginationControl.value.descending = getserviceRequestassignedDatas.value.sort[0].ascending;
          }
          
          $q.loading.hide();
        })
        .catch(() => {
          $q.loading.hide();
        });
    };

    const goToUnassignedTab = (tab) => {
      if (tab === 'unAssigned') {
        ajaxLoadAllLeadInfo({ pagination: paginationControl.value, filter: filterSearch.value });
      } else {
        ajaxLoadAllLeadInfo1({ pagination: paginationControl.value, filter: filterSearch.value });
      }
    };

    const UpdateDeviceAddress = (currentDeviceInfoParam) => {
      currentDeviceInfo.value = [];
      showDeviceAddressModal.value = !showDeviceAddressModal.value;
      
      if (formData.marsDeviceIdsCooked.length === 0) {
        let assumeObj = {
          id: [currentDeviceInfoParam.id],
          marsDeviceAddress: {
            deviceAddress: currentDeviceInfoParam.deviceAddress,
            latitude: 0,
            longitude: 0,
            pincode: currentDeviceInfoParam.pincode,
            city: currentDeviceInfoParam.city,
            state: currentDeviceInfoParam.state,
          },
        };
        currentDeviceInfo.value = assumeObj;
      } else {
        let marsDeviceIdsCooked = [];
        formData.marsDeviceIdsCooked.map(function (value) {
          marsDeviceIdsCooked.push(value.id);
        });
        let assumeObj = {
          id: marsDeviceIdsCooked,
          marsDeviceAddress: {
            deviceAddress: currentDeviceInfoParam.deviceAddress,
            latitude: 0,
            longitude: 0,
            pincode: currentDeviceInfoParam.pincode,
            city: currentDeviceInfoParam.city,
            state: currentDeviceInfoParam.state,
          },
        };
        currentDeviceInfo.value = assumeObj;
      }
    };

    const UpdateDeviceAddressAfterEmit = (pagination) => {
      showDeviceAddressModal.value = !showDeviceAddressModal.value;
      paginationControl.value = pagination;
    };

    const assignImplementationUser = () => {
      if (formData.marsDeviceIdsCooked.length === 0) {
        $q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'Select atleast one item to assign',
          icon: 'thumb_down',
        });
      } else if (formData.assignTo === '') {
        $q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'Request Mode cannot be empty!',
          icon: 'thumb_down',
        });
      } else {
        let marsDeviceIdsCooked = [];
        formData.marsDeviceIdsCooked.map(function (value) {
          value.serviceRequestMode = formData.serviceRequestMode;
          marsDeviceIdsCooked.push(value);
        });
        
        let postValues = {
          request: marsDeviceIdsCooked,
          userId: formData.assignTo.id,
        };
        
        $store.dispatch('serviceRequestSat/SERVICE_REQUEST_UNASSIGED_TO_ASSIGNED_STATE', postValues)
          .then((res) => {
            if (res.status === 200 && res.data.data.serviceRequest != null) {
              formData.marsDeviceIdsCooked = [];
              formData.assignTo = '';
              $q.notify({
                color: 'positive',
                position: 'bottom',
                message: 'Successfully assigned!',
                icon: 'thumb_up'
              });
              ajaxLoadAllLeadInfo1({ pagination: paginationControl.value, filter: filterSearch.value });
            } else if (res.status === 200 && res.data.data.Success != null) {
              formData.marsDeviceIdsCooked = [];
              formData.assignTo = '';
              $q.notify({
                color: 'positive',
                position: 'bottom',
                message: 'Successfully assigned!',
                icon: 'thumb_up'
              });
              ajaxLoadAllLeadInfo1({ pagination: paginationControl.value, filter: filterSearch.value });
            } else if (res.status === 200 && res.data.data.Failed != null) {
              $router.push({ name: 'internalServiceAddressFetch', params: { data: res } });
            } else {
              $q.notify({
                color: 'negative',
                position: 'bottom',
                message: 'INTERNAL SERVER ERROR !!',
                icon: 'thumb_down'
              });
            }
          })
          .catch(() => {
            $q.notify({
              color: 'negative',
              position: 'bottom',
              message: 'Please try again',
              icon: 'thumb_down'
            });
          });
      }
    };

    const unAssignImplementationUser = () => {
      if (formData.marsDeviceIdsCookedUnAssinged.length === 0) {
        $q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'Select atleast one item to Unassign',
          icon: 'thumb_down',
        });
      } else {
        let marsDeviceIdsCookedUnAssinged = [];
        formData.marsDeviceIdsCookedUnAssinged.map(function (value) {
          marsDeviceIdsCookedUnAssinged.push(value.id);
        });

        // Note: You'll need to add the appropriate constants to your app config
        let postValues = {
          action: 'TID_GENERATED', // Replace with actual constant
          marsDeviceIds: marsDeviceIdsCookedUnAssinged,
          userId: 0, // Replace with actual constant for unassigning
        };
        
        $store.dispatch('DeviceReplacement/DEVICE_REPLACEMENT_QUEUE_SUBMIT', postValues)
          .then(() => {
            ajaxLoadAllLeadInfo({ pagination: paginationControl.value, filter: filterSearch.value });
            ajaxLoadAllLeadInfo1({ pagination: paginationControl1.value, filter: filterSearch1.value });
            formData.marsDeviceIdsCookedUnAssinged = [];
            formData.assignTo = '';
            $q.notify({
              color: 'positive',
              position: 'bottom',
              message: 'Successfully Unassigned!',
              icon: 'thumb_up',
            });
          })
          .catch(() => {
            $q.notify({
              color: 'negative',
              position: 'bottom',
              message: 'Please try again',
              icon: 'thumb_down',
            });
          });
      }
    };

    const reAssignImplementationUser = () => {
      if (formData.marsDeviceIdsCookedUnAssinged.length === 0) {
        $q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'Select atleast one item to assign',
          icon: 'thumb_down',
        });
      } else if (formData.assignTo === '') {
        $q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'Implementation officer cannot be empty!',
          icon: 'thumb_down',
        });
      } else {
        let marsDeviceIdsCookedUnAssinged = [];
        formData.marsDeviceIdsCookedUnAssinged.map(function (value) {
          marsDeviceIdsCookedUnAssinged.push(value.id);
        });

        let postValues = {
          action: 'SAT_ASSIGNED', // Replace with actual constant
          marsDeviceIds: marsDeviceIdsCookedUnAssinged,
          triggerWelcomeMail: formData.triggerWelcomeMail,
          serviceRequestMode: formData.serviceRequestMode,
          userId: formData.assignTo,
        };
        
        $store.dispatch('DeviceReplacement/DEVICE_REPLACEMENT_QUEUE_SUBMIT', postValues)
          .then(() => {
            $store.dispatch('DeviceReplacement/DEVICE_REPLACEMENT_QUEUE_UNASSIGNED_LIST');
            ajaxLoadAllLeadInfo({ pagination: paginationControl.value, filter: filterSearch.value });
            formData.marsDeviceIdsCookedUnAssinged = [];
            formData.assignTo = '';
            $q.notify({
              color: 'positive',
              position: 'bottom',
              message: 'Successfully re assigned !',
              icon: 'thumb_up',
            });
          })
          .catch(() => {
            $q.notify({
              color: 'negative',
              position: 'bottom',
              message: 'Please try again',
              icon: 'thumb_down',
            });
          });
      }
    };

    const expandRowPlease = () => {
      // Implement expand logic if needed
    };

    const onRowClick = () => {
      // Implement row click logic if needed
    };

    const fnPDFViewModal = () => {
      // Implement PDF view modal logic
    };

    const toggleLeadInformation = (leadDetails) => {
      propToggleLeadInformation.value = !propToggleLeadInformation.value;
      if (leadDetails !== undefined) {
        addtnLeadInformation.value = leadDetails;
      }
    };

    const toggleServiceRequest = (leadDetails) => {
      propToggleServiceRequest.value = !propToggleServiceRequest.value;
      if (leadDetails !== undefined) {
        addtnServiceRequest.value = leadDetails;
      }
    };

    // Lifecycle hooks
    onMounted(() => {
      ajaxLoadAllLeadInfo({
        pagination: paginationControl.value,
        filter: filterSearch.value,
      });
      ajaxLoadAllLeadInfo1({
        pagination: paginationControl1.value,
        filter: filterSearch1.value,
      });
      getPincodeInformations();
    });

    return {
      propToggleLeadInformation,
      propToggleServiceRequest,
      addtnLeadInformation,
      addtnServiceRequest,
      filterSearch,
      filterSearch1,
      filterSearch2,
      selectedTab,
      assignTo,
      assignToOptions,
      tableData,
      tableData1,
      internalUnAssignedTableData,
      internalAssignedTableData,
      internalClosedTableData,
      tableData2,
      currentDeviceInfo,
      showDeviceAddressModal,
      formData,
      requestOptions,
      columnDataAssigned,
      columnDataUnassigned,
      paginationControl,
      paginationControl1,
      paginationControl2,
      tableAjaxLoading,
      tableAjaxLoading1,
      formatDate,
      getPincodeInformations,
      ajaxLoadAllLeadInfo1,
      ajaxLoadAllLeadInfo,
      goToUnassignedTab,
      UpdateDeviceAddress,
      UpdateDeviceAddressAfterEmit,
      assignImplementationUser,
      unAssignImplementationUser,
      reAssignImplementationUser,
      expandRowPlease,
      onRowClick,
      fnPDFViewModal,
      toggleLeadInformation,
      toggleServiceRequest,
    };
  },
};
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

.text-left {
  text-align: left;
}
</style>