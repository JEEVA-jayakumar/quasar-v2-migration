<template>
  <q-page>
    <div>
      <q-tabs
        v-model="activeTab"
        class="shadow-1"
        active-color="primary"
        indicator-color="primary"
        align="left"
        @update:model-value="goToCompleteTab"
      >
        <q-tab
          name="tab-1"
          label="PPE Service Request"
          :ripple="{ early: true }"
        />
        <q-tab
          name="tab-3"
          label="Phonepe Paper Roll"
          :ripple="{ early: true }"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel name="tab-1">
          <div class="row items-center q-mb-md">
            <div class="col-auto q-mr-md">
              <strong>Open For</strong>
            </div>
            <div class="col-auto">
              <q-select
                v-model.trim="formData.date"
                :options="dateType"
                color="primary"
                @update:model-value="dateClick"
                outlined
                dense
                emit-value
                map-options
              />
            </div>
            <div class="col" />
            <div class="col-auto">
              <q-btn
                icon="download"
                color="primary"
                label="Download"
                class="q-mr-md"
                size="md"
                @click="downloadPhonepeCallback"
                :disable="tableData.length === 0"
              />
            </div>
            <div class="col-md-4">
              <q-input
                clearable
                color="primary"
                v-model="filter"
                placeholder="Search By Ticket No, Merchant No..."
                outlined
                dense
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>

          <q-table
            class="customTableClass q-py-none"
            :rows="tableData"
            :columns="columns"
            :filter="filter"
            :rows-per-page-options="[5, 10, 15]"
            v-model:pagination="paginationControl"
            :loading="toggleAjaxLoadFilter"
            @request="ajaxLoadAllLeadInfo"
            row-key="id"
          >
            <template #body-cell-createdDate="props">
              <q-td :props="props">
                {{ formatDate(props.row.createdDate) }}
              </q-td>
            </template>

            <template #body-cell-serviceReqTicketId="props">
              <q-td :props="props">
                {{ props.row.serviceReqTicketId || 'NA' }}
              </q-td>
            </template>

            <template #body-cell-statusReported="props">
              <q-td :props="props">
                {{ getStatusReported(props.row) }}
              </q-td>
            </template>

            <template #body-cell-tat="props">
              <q-td :props="props">
                <span :style="getHoursAgoColor(props.row.createdDate)">
                  {{ getHoursAgo(props.row.createdDate) }}
                </span>
              </q-td>
            </template>

            <template #body-cell-status="props">
              <q-td :props="props">
                {{ getTicketStatus(props.row) }}
              </q-td>
            </template>

            <template #body-cell-action="props">
              <q-td :props="props">
                <div class="row no-wrap no-padding q-gutter-xs">
                  <template v-if="props.row.serviceRequestTicketStatus !== 5 && 
                                 props.row.serviceRequestTicketStatus !== 3 && 
                                 props.row.serviceRequestTicketStatus !== 8 && 
                                 props.row.serviceRequestTicketStatus !== 2">
                    <q-btn
                      color="primary"
                      icon="assignment_turned_in"
                      label="Pick Ticket"
                      @click="toggleActionBar(props.row)"
                      size="sm"
                      no-wrap
                    />
                  </template>
                  
                  <span v-if="props.row.serviceRequestTicketStatus === 5" 
                        class="text-orange text-bold q-ml-sm">
                    Moved to SAT
                  </span>
                  
                  <span v-if="props.row.serviceRequestTicketStatus === 3" 
                        class="text-green text-bold q-ml-sm">
                    Completed
                  </span>
                  
                  <span v-if="props.row.serviceRequestTicketStatus === 2" 
                        class="text-secondary text-bold q-ml-sm">
                    Assigned
                  </span>
                  
                  <q-btn
                    v-if="props.row.serviceRequestTicketStatus === 8"
                    color="primary"
                    icon="arrow_forward"
                    label="Continue"
                    @click="toggleActionBar(props.row)"
                    size="sm"
                    no-wrap
                  />
                </div>
              </q-td>
            </template>

            <template #body-cell-updateRemarks="props">
              <q-td :props="props">
                <div class="row no-wrap no-padding items-center">
                  <q-btn
                    :disable="props.row.serviceRequestTicketStatus !== 1"
                    icon="edit"
                    color="primary"
                    size="xs"
                    round
                    dense
                    flat
                    @click="toggleAddremarks(props.row)"
                    class="q-mr-xs"
                  />
                  <span v-if="props.row.crmRemark" 
                        class="text-caption" 
                        v-html="props.row.crmRemark">
                  </span>
                  <span v-else class="text-grey-7 text-caption">
                    NA
                  </span>
                </div>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="tab-3">
          <q-tabs
            v-model="paperRollActiveTab"
            class="shadow-1"
            active-color="primary"
            indicator-color="primary"
            align="left"
            @update:model-value="goToPaperRollActiveTab"
          >
            <q-tab name="tab-4" label="Pending Tickets" />
            <q-tab name="tab-5" label="Completed Tickets" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="paperRollActiveTab" animated>
            <q-tab-panel name="tab-4">
              <div class="row items-center q-mb-md">
                <div class="col-auto q-mr-md">
                  <strong>Open For</strong>
                </div>
                <div class="col-auto">
                  <q-select
                    v-model.trim="formData.date1"
                    :options="dateTypePaperRoll"
                    color="primary"
                    @update:model-value="dateClickPaperRoll"
                    outlined
                    dense
                    emit-value
                    map-options
                  />
                </div>
                <div class="col" />
                <div class="col-md-4">
                  <q-input
                    clearable
                    color="primary"
                    v-model="filter3"
                    placeholder="Search By Ticket No, Merchant No..."
                    outlined
                    dense
                  >
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
              </div>

              <q-table
                class="customTableClass q-py-none"
                :rows="tableData3"
                :columns="columns3"
                :filter="filter3"
                :rows-per-page-options="[5, 10, 15]"
                v-model:pagination="paginationControl3"
                :loading="toggleAjaxLoadFilter3"
                @request="ajaxLoadAllLeadInfo3"
                row-key="id"
              >
                <template #body-cell-createdDate="props">
                  <q-td :props="props">
                    {{ formatDate(props.row.createdDate) }}
                  </q-td>
                </template>
              </q-table>
            </q-tab-panel>

            <q-tab-panel name="tab-5">
              <div class="row items-center q-mb-md">
                <div class="col-md-4">
                  <q-input
                    clearable
                    color="primary"
                    v-model="filter4"
                    placeholder="Search By Ticket No, Merchant No..."
                    outlined
                    dense
                  >
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
              </div>

              <q-table
                class="customTableClass q-py-none"
                :rows="tableData4"
                :columns="columns4"
                :filter="filter4"
                :rows-per-page-options="[5, 10, 15]"
                v-model:pagination="paginationControl4"
                :loading="toggleAjaxLoadFilter4"
                @request="ajaxLoadAllLeadInfo4"
                row-key="id"
              >
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
              </q-table>
            </q-tab-panel>
          </q-tab-panels>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <!-- Child Components -->
    <phonepe-remarks
      v-if="propToggleRemarks"
      :remarks-info="addBasicInformation"
      :prop-toggle-remarks-pop="propToggleRemarks"
      @reload-phonepe-pending-details="handleReloadData"
      @close-remarks-info="toggleAddremarks"
    />

    <ticket-action-bar
      v-if="propToggleActionBar"
      :action-bar-info="addActionBarInformation"
      :prop-toggle-action-bar-pop="propToggleActionBar"
      @reload-phonepe-pending-details="handleReloadData"
      @close-action-bar-info="toggleActionBar"
    />

    <phonepe-escalate-to-sat
      v-if="propToggleEscalateToSat"
      :escalate-to-sat-data="escalateToSatInfo"
      :prop-toggle-escalateto-sat-pop="propToggleEscalateToSat"
      @close-escalate-to-sat="fnEscalateToSat"
    />

    <phonepe-ticket-resolve
      v-if="proptoggleTicketResolve"
      :resolve-data="resolveInfo"
      :prop-toggle-resolve="proptoggleTicketResolve"
      @close-resolve="fnResolve"
    />

    <phonepe-ticket-callback
      v-if="proptoggleTicketCallback"
      :resolve-data-callback="resolveInfoppe"
      :prop-toggle-resolve-callback="proptoggleTicketCallback"
      @close-resolve-callback="fnPPE"
    />

    <download-phonepe-crm-report
      v-if="propPhonepeCrmCallback"
      :prop-phonepe-crm-callback="propPhonepeCrmCallback"
      @emitfnshow-phonepe-crm-callback="downloadPhonepeCallback"
    />

    <download-phonepe-crm-completed-report
      v-if="propPhonepeCompletedTicket"
      :prop-phonepe-completed-ticket="propPhonepeCompletedTicket"
      @emitfnshow-phonepe-crm-complete="downloadPhonepeCompletedTicket"
    />

    <!-- Loading Spinner -->
    <q-inner-loading 
      :showing="toggleAjaxLoadFilter || toggleAjaxLoadFilter1 || 
                toggleAjaxLoadFilter3 || toggleAjaxLoadFilter4"
    >
      <q-spinner-bars size="35px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import { date } from 'quasar';
import PhonepeRemarks from '../../components/crm/phonepeRemarks.vue';
import PhonepeEscalateToSat from '../../components/crm/phonepeEscalateToSat.vue';
import PhonepeTicketResolve from '../../components/crm/phonepeTicketResolve.vue';
import PhonepeTicketCallback from '../../components/crm/PhonepeTicketCallback.vue';
import DownloadPhonepeCrmReport from '../../components/inventory/DownloadPhonepeCrmReport.vue';
import DownloadPhonepeCrmCompletedReport from '../../components/inventory/DownloadPhonepeCrmCompletedReport.vue';
import TicketActionBar from '../../components/crm/ticketActionBar.vue';

// Quasar instance
const $q = useQuasar();
const store = useStore();

// Reactive state
const propToggleRemarks = ref(false);
const propToggleActionBar = ref(false);
const propPhonepeCrmCallback = ref(false);
const propPhonepeCompletedTicket = ref(false);
const propToggleEscalateToSat = ref(false);
const proptoggleTicketResolve = ref(false);
const proptoggleTicketCallback = ref(false);

const toggleAjaxLoadFilter = ref(false);
const toggleAjaxLoadFilter1 = ref(false);
const toggleAjaxLoadFilter3 = ref(false);
const toggleAjaxLoadFilter4 = ref(false);

const activeTab = ref('tab-1');
const paperRollActiveTab = ref('tab-4');
const filter = ref('');
const filter1 = ref('');
const filter3 = ref('');
const filter4 = ref('');

const escalateToSatInfo = ref('');
const resolveInfo = ref('');
const resolveInfoppe = ref('');

const formData = reactive({
  date: 1,
  date1: 0
});

const addBasicInformation = reactive({
  remarks: null,
  action: 0
});

const addActionBarInformation = reactive({
  data: null
});

// Pagination controls
const paginationControl = ref({
  rowsNumber: 0,
  page: 1,
  sortBy: 'createdDate',
  descending: false,
  rowsPerPage: 5
});

const paginationControl1 = ref({
  rowsNumber: 0,
  page: 1,
  sortBy: 'createdDate',
  descending: false,
  rowsPerPage: 5
});

const paginationControl3 = ref({
  rowsNumber: 0,
  page: 1,
  sortBy: 'createdDate',
  descending: false,
  rowsPerPage: 5
});

const paginationControl4 = ref({
  rowsNumber: 0,
  page: 1,
  sortBy: 'createdDate',
  descending: false,
  rowsPerPage: 5
});

// Data arrays
const tableData = ref([]);
const tableData1 = ref([]);
const tableData3 = ref([]);
const tableData4 = ref([]);

// Options arrays
const dateType = [
  { label: 'Pending', value: 1 },
  { label: 'Completed', value: 2 },
  { label: 'SAT', value: 3 }
];

const dateTypePaperRoll = [
  { label: 'Today', value: 0 },
  { label: 'T+1', value: 1 },
  { label: 'T+2', value: 2 },
  { label: 'All', value: 3 }
];

// Table columns
const columns = [
  {
    name: 'createdDate',
    label: 'Date',
    align: 'left',
    field: 'createdDate',
    sortable: true
  },
  {
    name: 'serviceReqTicketId',
    label: 'Ticket No',
    align: 'left',
    field: row => row.serviceReqTicketId || 'NA',
    sortable: false
  },
  {
    name: 'meName',
    label: 'Merchant Name',
    align: 'left',
    field: 'meName',
    sortable: false
  },
  {
    name: 'emailId',
    label: 'Merchant Email',
    align: 'left',
    field: 'emailId',
    sortable: false
  },
  {
    name: 'contactNumber',
    label: 'Merchant No',
    align: 'left',
    field: 'contactNumber',
    sortable: false
  },
  {
    name: 'statusReported',
    label: 'Status Reported',
    align: 'left',
    field: row => getStatusReported(row),
    sortable: false
  },
  {
    name: 'tat',
    label: 'TAT',
    align: 'left',
    field: 'createdDate',
    sortable: false
  },
  {
    name: 'status',
    label: 'Status',
    align: 'left',
    field: row => getTicketStatus(row),
    sortable: false
  },
  {
    name: 'action',
    label: 'Action',
    align: 'left',
    field: 'action',
    sortable: false
  },
  {
    name: 'updateRemarks',
    label: 'Remarks',
    align: 'left',
    field: 'updateRemarks',
    sortable: false
  }
];


const columns3 = [
  {
    name: 'createdDate',
    label: 'Created Date',
    align: 'left',
    field: 'createdDate',
    sortable: true
  },
  {
    name: 'serviceReqTicketId',
    label: 'Ticket No',
    align: 'left',
    field: row => row.serviceReqTicketId || 'NA',
    sortable: false
  },
  {
    name: 'merchantName',
    label: 'Merchant Name',
    align: 'left',
    field: row => row.meName || 'NA',
    sortable: false
  },
  {
    name: 'emailId',
    label: 'Merchant Email',
    align: 'left',
    field: row => row.emailId || 'NA',
    sortable: false
  },
  {
    name: 'contactNumber',
    label: 'Merchant No',
    align: 'left',
    field: row => row.contactNumber || 'NA',
    sortable: false
  },
  {
    name: 'address',
    label: 'Merchant Address',
    align: 'left',
    field: row => row.address || 'NA',
    sortable: false
  },
  {
    name: 'count',
    label: 'Count',
    align: 'left',
    field: row => row.subTicketsList?.[0]?.paperRollCount || 0,
    sortable: false
  }
];

const columns4 = [
  {
    name: 'serviceReqTicketId',
    label: 'Ticket No',
    align: 'left',
    field: row => row.serviceReqTicketId || 'NA',
    sortable: true
  },
  {
    name: 'merchantName',
    label: 'Merchant Name',
    align: 'left',
    field: row => row.meName || 'NA',
    sortable: false
  },
  {
    name: 'emailId',
    label: 'Merchant Email',
    align: 'left',
    field: row => row.emailId || 'NA',
    sortable: false
  },
  {
    name: 'contactNumber',
    label: 'Merchant No',
    align: 'left',
    field: row => row.contactNumber || 'NA',
    sortable: false
  },
  {
    name: 'address',
    label: 'Merchant Address',
    align: 'left',
    field: row => row.address || 'NA',
    sortable: false
  },
  {
    name: 'count',
    label: 'Count',
    align: 'left',
    field: row => row.subTicketsList?.[0]?.paperRollCount || 0,
    sortable: true
  },
  {
    name: 'podNumber',
    label: 'POD Number',
    align: 'left',
    field: row => row.podNumber || 'NA',
    sortable: true
  },
  {
    name: 'createdDate',
    label: 'Open Date',
    align: 'left',
    field: 'createdDate',
    sortable: true
  },
  {
    name: 'updatedDate',
    label: 'Close Date',
    align: 'left',
    field: 'updatedDate',
    sortable: true
  }
];

// Computed properties

const getPhonepeCompletedData = computed(() => {
  return store.getters['phonePeCrm/getPhonepeCompletedData'] || {};
});

const getphonepeDate = computed(() => {
  return store.getters['phonePeCrm/getphonepeDate'] || {};
});

const getphonepePaperRoll = computed(() => {
  return store.getters['phonePeCrm/getphonepePaperRoll'] || {};
});

const getphonepeCompletedPaperRoll = computed(() => {
  return store.getters['phonePeCrm/getphonepeCompletedPaperRoll'] || {};
});

// Lifecycle hooks
onMounted(() => {
  ajaxLoadAllLeadInfo1({
    pagination: paginationControl1.value,
    filter: filter1.value
  });
  loadingData({
    pagination: paginationControl.value,
    filter: filter.value,
    date: formData.date
  });
});

// Helper functions
const formatDate = (timestamp) => {
  if (!timestamp) return 'NA';
  return date.formatDate(timestamp, 'Do MMM Y');
};

const getStatusReported = (row) => {
  if (!row.subTicketsList || row.subTicketsList.length === 0) return 'NA';
  
  const issues = row.subTicketsList
    .filter(element => element.serviceRequestType?.name)
    .map((element, index) => `${index + 1}. ${element.serviceRequestType.name}`);
  
  return issues.length > 0 ? issues.join(', ') : 'NA';
};

const getTicketStatus = (row) => {
  if (!row.subTicketsList || row.subTicketsList.length === 0) return 'NA';
  
  const statuses = row.subTicketsList
    .filter(element => element.serviceRequestSubTicketStatus?.name)
    .map((element, index) => `${index + 1}. ${element.serviceRequestSubTicketStatus.name}`);
  
  return statuses.length > 0 ? statuses.join(', ') : 'NA';
};

// Methods
const ajaxLoadAllLeadInfo = (props) => {
  const request = {
    pagination: props?.pagination || paginationControl.value,
    filter: props?.filter || filter.value,
    date: formData.date
  };
  loadingData(request);
};

const loadingData = async (request) => {
  $q.loading.show({
    delay: 0,
    message: 'Fetching data...',
    spinnerColor: 'primary'
  });

  try {
    await store.dispatch('phonePeCrm/PHONEPE_CRM_DATE', request);
    
    const data = getphonepeDate.value;
    if (data) {
      paginationControl.value = {
        ...request.pagination,
        rowsNumber: data.totalElements || 0,
        page: (data.number || 0) + 1
      };

      if (data.sort?.[0]) {
        paginationControl.value.sortBy = data.sort[0].property;
        paginationControl.value.descending = !data.sort[0].ascending;
      }

      tableData.value = data.content || [];
    }
  } catch (error) {

    console.error('Error loading data:', error);
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: error.body?.message || 'Please Try Again Later!',
      icon: 'thumb_down'
    });
    tableData.value = [];
  } finally {
    $q.loading.hide();
  }
};

const dateClick = (value) => {
  filter.value = '';
  addBasicInformation.action = value;
  loadingData({
    pagination: paginationControl.value,
    filter: filter.value,
    date: value
  });
};

const dateClickPaperRoll = (value) => {
  loadingData1({
    pagination: paginationControl3.value,
    filter: filter3.value,
    date: value
  });
};

const loadingData1 = async (request) => {
  $q.loading.show({
    delay: 0,
    message: 'Fetching data...',
    spinnerColor: 'primary'
  });

  try {
    await store.dispatch('phonePeCrm/PHONEPE_PAPER_ROLL_PENDING', request);
    
    const data = getphonepePaperRoll.value;
    if (data) {
      paginationControl3.value = {
        ...request.pagination,
        rowsNumber: data.totalElements || 0,
        page: (data.number || 0) + 1
      };

      if (data.sort?.[0]) {
        paginationControl3.value.sortBy = data.sort[0].property;
        paginationControl3.value.descending = !data.sort[0].ascending;
      }

      tableData3.value = data.content || [];
    }
  } catch (error) {

    console.error('Error loading paper roll data:', error);
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Failed to load data',
      icon: 'error'
    });
  } finally {
    $q.loading.hide();
  }
};

const goToPaperRollActiveTab = (tab) => {
  if (tab === 'tab-4') {
    ajaxLoadAllLeadInfo3();
  } else if (tab === 'tab-5') {
    ajaxLoadAllLeadInfo4({
      pagination: paginationControl4.value,
      filter: filter4.value
    });
  }
};

const fnResolve = (request) => {
  proptoggleTicketResolve.value = !proptoggleTicketResolve.value;
  resolveInfo.value = request;
  if (!proptoggleTicketResolve.value) {
    ajaxLoadAllLeadInfo({
      pagination: paginationControl.value,
      filter: filter.value
    });
  }
};

const fnEscalateToSat = (request) => {
  propToggleEscalateToSat.value = !propToggleEscalateToSat.value;
  escalateToSatInfo.value = request;
  if (!propToggleEscalateToSat.value) {
    ajaxLoadAllLeadInfo({
      pagination: paginationControl.value,
      filter: filter.value
    });
  }
};

const fnPPE = (request) => {
  proptoggleTicketCallback.value = !proptoggleTicketCallback.value;
  resolveInfoppe.value = request;
  if (!proptoggleTicketCallback.value) {
    ajaxLoadAllLeadInfo({
      pagination: paginationControl.value,
      filter: filter.value
    });
  }
};

const goToCompleteTab = (tab) => {
  if (tab === 'tab-2') {
    ajaxLoadAllLeadInfo1({
      pagination: paginationControl1.value,
      filter: filter1.value
    });
    filter.value = '';
  } else {
    ajaxLoadAllLeadInfo({
      pagination: paginationControl.value,
      filter: filter.value
    });
    filter1.value = '';
  }
};

const ajaxLoadAllLeadInfo1 = async (props) => {
  toggleAjaxLoadFilter1.value = true;
  
  try {
    await store.dispatch('phonePeCrm/FETCH_PHONEPE_COMPLETED_DATA', {
      pagination: props.pagination,
      filter: props.filter
    });
    
    const data = getPhonepeCompletedData.value;
    if (data) {
      paginationControl1.value = {
        ...props.pagination,
        rowsNumber: data.totalElements || 0,
        page: (data.number || 0) + 1
      };

      if (data.sort?.[0]) {
        paginationControl1.value.sortBy = data.sort[0].property;
        paginationControl1.value.descending = !data.sort[0].ascending;
      }

      tableData1.value = data.content || [];
    }
  } catch (error) {

    console.error('Error loading completed data:', error);
  } finally {
    toggleAjaxLoadFilter1.value = false;
  }
};

const ajaxLoadAllLeadInfo3 = () => {
  loadingData1({
    pagination: paginationControl3.value,
    filter: filter3.value,
    date: formData.date1
  });
};

const ajaxLoadAllLeadInfo4 = async (props) => {
  $q.loading.show({
    delay: 0,
    message: 'Fetching data...',
    spinnerColor: 'primary'
  });

  try {
    await store.dispatch('phonePeCrm/FETCH_PHONEPE_PAPER_ROLL_COMPLETED_DATA', {
      pagination: props.pagination,
      filter: props.filter
    });
    
    const data = getphonepeCompletedPaperRoll.value;
    if (data) {
      paginationControl4.value = {
        ...props.pagination,
        rowsNumber: data.totalElements || 0,
        page: (data.number || 0) + 1
      };

      if (data.sort?.[0]) {
        paginationControl4.value.sortBy = data.sort[0].property;
        paginationControl4.value.descending = !data.sort[0].ascending;
      }

      tableData4.value = data.content || [];
    }
  } catch (error) {

    console.error('Error loading completed paper roll data:', error);
  } finally {
    $q.loading.hide();
  }
};

const downloadPhonepeCallback = () => {
  propPhonepeCrmCallback.value = !propPhonepeCrmCallback.value;
};

const downloadPhonepeCompletedTicket = () => {
  propPhonepeCompletedTicket.value = !propPhonepeCompletedTicket.value;
};

const toggleAddremarks = (remarks) => {
  propToggleRemarks.value = !propToggleRemarks.value;
  if (remarks) {
    addBasicInformation.remarks = remarks;
    addBasicInformation.action = formData.date;
  }
};

const toggleActionBar = (request) => {
  loadingData({
    pagination: paginationControl.value,
    filter: filter.value,
    date: formData.date
  });

  propToggleActionBar.value = !propToggleActionBar.value;
  if (request) {
    addActionBarInformation.data = request;
  }
};

const handleReloadData = () => {
  loadingData({
    pagination: paginationControl.value,
    filter: filter.value,
    date: formData.date
  });
};

const getHoursAgo = (dateInMilliseconds) => {
  if (!dateInMilliseconds) return 'N/A';
  
  const currentTime = Date.now();
  const differenceInMilliseconds = currentTime - dateInMilliseconds;
  const hoursAgo = differenceInMilliseconds / (1000 * 60 * 60);
  
  return Math.max(0, 72 - Math.floor(hoursAgo));
};

const getHoursAgoColor = (dateInMilliseconds) => {
  if (!dateInMilliseconds) return 'color: gray; font-weight: normal;';
  
  const currentTime = Date.now();
  const differenceInMilliseconds = currentTime - dateInMilliseconds;
  const hoursAgo = differenceInMilliseconds / (1000 * 60 * 60);
  const remainingHours = 72 - Math.floor(hoursAgo);
  
  if (remainingHours > 24) {
    return 'color: green; font-weight: bold;';
  } else if (remainingHours > 0) {
    return 'color: orange; font-weight: bold;';
  } else {
    return 'color: red; font-weight: bold;';
  }
};
</script>

<style scoped>
.customTableClass {
  font-size: 14px;
}

.customTableClass :deep(.q-table__top) {
  padding: 8px 16px;
}

.customTableClass :deep(.q-table__bottom) {
  padding: 8px 16px;
}

.q-tabs {
  background: white;
}

.q-tab--active {
  color: #1976d2;
}

.q-tab__indicator {
  height: 3px;
}
</style>