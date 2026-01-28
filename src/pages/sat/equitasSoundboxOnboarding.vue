<template>
  <q-page>
    <!-- content -->
    <div
      class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9 row justify-between items-center"
    >
      Equitas SoundBox Onboarding
      <q-btn
        no-caps
        label="Download Error Data"
        @click="downloadErrorData"
        class="common-dark-blue"
      />
    </div>

    <q-tabs
      v-model="selectedTab"
      class="shadow-1"
      color="grey-1"
      @update:model-value="goToUnassignedTab"
    >
      <q-tab
        default
        color="dark"
        name="unassigned"
        label="Un Assigned"
      />
      <q-tab color="dark" name="assigned" label="Assigned" />
      <q-tab color="dark" name="completed" label="Completed" />

      <q-tab-pane name="unassigned">
        <q-card class="group q-pa-md">
          <div
            class="row items-center gutter-y-sm"
            style="display: flex; justify-content: space-between; width: 100%;"
          >
            <div
              class="col-md-3 col-sm-6 col-xs-6 text-grey-7 text-weight-medium"
              align="left"
            >
              <span class="q-display-2">{{
                formData.marsDeviceIdsCooked.length
              }}</span
              >/ selected
            </div>

            <div
              class="col-md-3 col-sm-6 col-xs-6"
              style="flex: 1;  max-width: 200px;"
              align="right"
            >
              <q-select
                filter
                clearable
                v-model="formData.assignTo.id"
                color="grey-9"
                :disable="
                  formData.marsDeviceIdsCooked.length == 0 ? true : false
                "
                :options="assignToOptions"
                placeholder="Assign To"
              />
            </div>
            <div
              class="col-md-3 col-sm-6 col-xs-6"
              style="flex: 1;  max-width: 200px;"
              align="right"
            >
              <q-select
                filter
                clearable
                v-model="formData.region"
                color="grey-9"
                :disable="
                  formData.marsDeviceIdsCooked.length == 0 ? true : false
                "
                :options="assignToRegionOptions"
                placeholder="Assign To Region"
              />
            </div>
            <div class="col-md-3 col-sm-6 col-xs-6" align="right">
              <q-btn
                no-caps
                label="Assign"
                @click="assignImplementationUser"
                class="common-dark-blue"
              />
            </div>
          </div>
        </q-card>
        <q-table
          :rows="tableData1"
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
          @update:current-page="handlePageChange1"
          @update:rows-per-page="handleRowsPerPageChange1"
        >
          <template #body-cell-leadNumber="props">
            <q-td :props="props" class="cursor-pointer">
              <span class="label text-primary">{{
                props.row.qrLeadInformation.id
              }}</span>
            </q-td>
          </template>
          
          <template #body-cell-merchantName="props">
            <q-td :props="props">
              {{
                props.row.qrLeadInformation.merchantName == null
                  ? "NA"
                  : props.row.qrLeadInformation.merchantName
              }}
            </q-td>
          </template>
          
          <template #body-cell-contactEmail="props">
            <q-td :props="props">
              {{
                props.row.qrLeadInformation.contactEmail == null
                  ? "NA"
                  : props.row.qrLeadInformation.contactEmail
              }}
            </q-td>
          </template>
          
          <template #body-cell-contactAddress="props">
            <q-td :props="props">
              {{
                props.row.qrLeadInformation.contactAddress == null
                  ? "NA"
                  : props.row.qrLeadInformation.contactAddress
              }}
            </q-td>
          </template>
          
          <template #body-cell-contactNumber="props">
            <q-td :props="props">
              {{
                props.row.qrLeadInformation.contactNumber == null
                  ? "NA"
                  : props.row.qrLeadInformation.contactNumber
              }}
            </q-td>
          </template>

          <template #body-cell-alternateContactNumber="props">
            <q-td :props="props">
              {{
                props.row.qrLeadInformation.alternateContactNumber == null
                  ? "NA"
                  : props.row.qrLeadInformation.alternateContactNumber
              }}
            </q-td>
          </template>
          
          <template #body-cell-pincode="props">
            <q-td :props="props">
              {{
                props.row.qrLeadInformation.pincode == null
                  ? "NA"
                  : props.row.qrLeadInformation.pincode
              }}
            </q-td>
          </template>
          
          <template #body-cell-sim="props">
            <q-td :props="props">
              {{ props.row.sim == null ? "NA" : props.row.sim }}
            </q-td>
          </template>

          <template #body-cell-tid="props">
            <q-td :props="props">
              {{ props.row.tid == null ? "NA" : props.row.tid }}
            </q-td>
          </template>
          
          <template #body-cell-mid="props">
            <q-td :props="props">
              {{ props.row.mid == null ? "NA" : props.row.mid }}
            </q-td>
          </template>
          
          <template #body-cell-vpa="props">
            <q-td :props="props">
              {{ props.row.vpa == null ? "NA" : props.row.vpa }}
            </q-td>
          </template>
          
          <template #top>
            <!--START: table filter,search -->
            <div class="col-md-5">
              <q-input
                clearable
                color="grey-9"
                v-model="filterSearch1"
                placeholder="Type.."
                label="Search By Mob No, VPA, Merchant Name"
                class="q-mr-lg q-py-sm"
                @update:model-value="handleFilterSearch1"
              />
            </div>
            <!--END: table filter,search -->
          </template>
        </q-table>
      </q-tab-pane>
      
      <q-tab-pane name="assigned">
        <!--START: table Data -->
        <q-table
          :rows="tableData"
          :columns="columnDataAssigned"
          table-class="customTableClass"
          :filter="filterSearch"
          v-model:pagination="paginationControl"
          row-key="id"
          :loading="tableAjaxLoading"
          :rows-per-page-options="[5, 10, 15, 20]"
          color="dark"
          @update:current-page="handlePageChange"
          @update:rows-per-page="handleRowsPerPageChange"
        >
          <template #body-cell-leadNumber="props">
            <q-td :props="props" class="cursor-pointer">
              <span class="label text-primary">{{
                props.row.qrLeadInformation.id
              }}</span>
            </q-td>
          </template>
          
          <template #body-cell-merchantName="props">
            <q-td :props="props">
              {{
                props.row.qrLeadInformation.merchantName == null
                  ? "NA"
                  : props.row.qrLeadInformation.merchantName
              }}
            </q-td>
          </template>
          
          <template #body-cell-contactEmail="props">
            <q-td :props="props">
              {{
                props.row.qrLeadInformation.contactEmail == null
                  ? "NA"
                  : props.row.qrLeadInformation.contactEmail
              }}
            </q-td>
          </template>
          
          <template #body-cell-contactAddress="props">
            <q-td :props="props">
              {{
                props.row.qrLeadInformation.contactAddress == null
                  ? "NA"
                  : props.row.qrLeadInformation.contactAddress
              }}
            </q-td>
          </template>
          
          <template #body-cell-contactNumber="props">
            <q-td :props="props">
              {{
                props.row.qrLeadInformation.contactNumber == null
                  ? "NA"
                  : props.row.qrLeadInformation.contactNumber
              }}
            </q-td>
          </template>

          <template #body-cell-alternateContactNumber="props">
            <q-td :props="props">
              {{
                props.row.qrLeadInformation.alternateContactNumber == null
                  ? "NA"
                  : props.row.qrLeadInformation.alternateContactNumber
              }}
            </q-td>
          </template>
          
          <template #body-cell-assignedTo="props">
            <q-td :props="props">
              {{
                props.row.assignedTo.name == null
                  ? "NA"
                  : props.row.assignedTo.name
              }}
            </q-td>
          </template>
          
          <template #body-cell-pincode="props">
            <q-td :props="props">
              {{
                props.row.qrLeadInformation.pincode == null
                  ? "NA"
                  : props.row.qrLeadInformation.pincode
              }}
            </q-td>
          </template>
          
          <template #body-cell-sim="props">
            <q-td :props="props">
              {{ props.row.sim == null ? "NA" : props.row.sim }}
            </q-td>
          </template>

          <template #body-cell-tid="props">
            <q-td :props="props">
              {{ props.row.tid == null ? "NA" : props.row.tid }}
            </q-td>
          </template>
          
          <template #body-cell-mid="props">
            <q-td :props="props">
              {{ props.row.mid == null ? "NA" : props.row.mid }}
            </q-td>
          </template>
          
          <template #body-cell-vpa="props">
            <q-td :props="props">
              {{ props.row.vpa == null ? "NA" : props.row.vpa }}
            </q-td>
          </template>

          <template #body-cell-action="props">
            <q-td :props="props">
              <q-btn
                highlight
                push
                class="q-mx-sm"
                color="positive"
                size="sm"
                @click="fnReassignData(props.row)"
              >Re-Assign</q-btn
              >
            </q-td>
          </template>
          
          <template #top>
            <!--START: table filter,search -->
            <div class="col-md-5">
              <q-input
                clearable
                color="grey-9"
                v-model="filterSearch"
                placeholder="Type.."
                label="Search By Mob No, VPA, Merchant Name"
                class="q-mr-lg q-py-sm"
                @update:model-value="handleFilterSearch"
              />
            </div>
          </template>
        </q-table>
        <!--END: table Data -->
      </q-tab-pane>
      
      <q-tab-pane name="completed">
        <q-table
          :rows="tableData2"
          :columns="completed"
          table-class="customTableClass"
          :filter="filterSearch2"
          v-model:selected="formData.marsDeviceIdsCooked"
          v-model:pagination="paginationControl2"
          row-key="id"
          :loading="tableAjaxLoading2"
          :rows-per-page-options="[5, 10, 15, 20]"
          color="dark"
          @update:current-page="handlePageChange2"
          @update:rows-per-page="handleRowsPerPageChange2"
        >
          <template #body-cell-leadNumber="props">
            <q-td :props="props" class="cursor-pointer">
              <span class="label text-primary">{{
                props.row.qrLeadInformation.id
              }}</span>
            </q-td>
          </template>
          
          <template #body-cell-merchantName="props">
            <q-td :props="props">
              {{
                props.row.qrLeadInformation.merchantName == null
                  ? "NA"
                  : props.row.qrLeadInformation.merchantName
              }}
            </q-td>
          </template>
          
          <template #body-cell-contactEmail="props">
            <q-td :props="props">
              {{
                props.row.qrLeadInformation.contactEmail == null
                  ? "NA"
                  : props.row.qrLeadInformation.contactEmail
              }}
            </q-td>
          </template>
          
          <template #body-cell-contactAddress="props">
            <q-td :props="props">
              {{
                props.row.qrLeadInformation.contactAddress == null
                  ? "NA"
                  : props.row.qrLeadInformation.contactAddress
              }}
            </q-td>
          </template>
          
          <template #body-cell-contactNumber="props">
            <q-td :props="props">
              {{
                props.row.qrLeadInformation.contactNumber == null
                  ? "NA"
                  : props.row.qrLeadInformation.contactNumber
              }}
            </q-td>
          </template>

          <template #body-cell-alternateContactNumber="props">
            <q-td :props="props">
              {{
                props.row.qrLeadInformation.alternateContactNumber == null
                  ? "NA"
                  : props.row.qrLeadInformation.alternateContactNumber
              }}
            </q-td>
          </template>
          
          <template #body-cell-state="props">
            <q-td :props="props">
              {{
                props.row.qrLeadInformation.merchantStateName == null
                  ? "NA"
                  : props.row.qrLeadInformation.merchantStateName
              }}
            </q-td>
          </template>
          
          <template #body-cell-city="props">
            <q-td :props="props">
              {{
                props.row.qrLeadInformation.merchantDistrictName == null
                  ? "NA"
                  : props.row.qrLeadInformation.merchantDistrictName
              }}
            </q-td>
          </template>
          
          <template #body-cell-pincode="props">
            <q-td :props="props">
              {{
                props.row.qrLeadInformation.pincode == null
                  ? "NA"
                  : props.row.qrLeadInformation.pincode
              }}
            </q-td>
          </template>
          
          <template #body-cell-vpa="props">
            <q-td :props="props">
              {{ props.row.vpa == null ? "NA" : props.row.vpa }}
            </q-td>
          </template>
          
          <template #body-cell-updatedAt="props">
            <q-td :props="props">
              {{
                props.row.qrLeadInformation.updatedAt == null
                  ? "NA"
                  : props.row.qrLeadInformation.updatedAt
              }}
            </q-td>
          </template>
          
          <template #body-cell-equitasLat="props">
            <q-td :props="props">
              {{
                props.row.qrLeadInformation.equitasLat == null
                  ? "NA"
                  : props.row.qrLeadInformation.equitasLat
              }}
            </q-td>
          </template>
          
          <template #body-cell-equitasLan="props">
            <q-td :props="props">
              {{
                props.row.qrLeadInformation.equitasLan == null
                  ? "NA"
                  : props.row.qrLeadInformation.equitasLan
              }}
            </q-td>
          </template>
          
          <template #top>
            <div class="col-md-5">
              <q-input
                color="grey-9"
                v-model="filterSearch2"
                placeholder="Type.."
                label="Search By Merchant Name"
                class="q-mr-lg q-py-sm"
                @update:model-value="handleFilterSearch2"
              />
            </div>
            <div class="col-md-5"></div>
            <div class="col-md-2" align="right">
              <q-btn
                no-caps
                label="Download"
                @click="downloadCompletedData"
                class="common-dark-blue"
              />
            </div>
          </template>
        </q-table>
        <!--END: table Data -->
      </q-tab-pane>
    </q-tabs>
    
    <div class="row items-center gutter-y-sm">
      <div class="col-md-9 col-sm-12 col-xs-12">
        <div class="row items-center"></div>
      </div>
    </div>
    
    <EquitasReassign
      v-if="propShowReassign"
      :propShowReassign="propShowReassign"
      :propRowDetails="propRowDetails"
      @emitfnshowUpdateOpenedExternal="fnReassignData"
    />
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';
import EquitasReassign from '../../components/sat/equitasReassign.vue';

const $q = useQuasar();
const store = useStore();

// Refs
const filterSearch1 = ref('');
const filterSearch = ref('');
const filterSearch2 = ref('');
const tableAjaxLoading1 = ref(false);
const tableAjaxLoading = ref(false);
const tableAjaxLoading2 = ref(false);
const selectedTab = ref('assigned');
const propShowReassign = ref(false);
const propRowDetails = ref(null);
const assignToOptions = ref([]);
const assignToRegionOptions = ref([]);

// Reactive objects
const formData = reactive({
  marsDeviceIdsCooked: [],
  marsDeviceIdsCookedUnAssinged: [],
  triggerWelcomeMail: false,
  assignTo: {
    id: '',
  },
  region: '',
});

const tableData1 = ref([]);
const tableData = ref([]);
const tableData2 = ref([]);

const paginationControl1 = reactive({
  sortBy: 'createdAt',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
});

const paginationControl = reactive({
  sortBy: 'createdAt',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
});

const paginationControl2 = reactive({
  sortBy: 'createdAt',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
});

// Table columns
const columnDataUnassigned = [
  {
    name: 'leadNumber',
    required: true,
    label: 'Lead Id',
    align: 'left',
    field: 'leadNumber',
    sortable: false,
  },
  {
    name: 'merchantName',
    required: true,
    label: 'Merchant Name',
    align: 'left',
    field: 'merchantName',
    sortable: false,
  },
  {
    name: 'contactEmail',
    required: true,
    label: 'Merchant Email',
    align: 'left',
    field: 'contactEmail',
    sortable: false,
  },
  {
    name: 'contactAddress',
    required: true,
    label: 'Merchant Address',
    align: 'left',
    field: 'contactAddress',
    sortable: false,
  },
  {
    name: 'contactNumber',
    required: true,
    label: 'Merchant Number',
    align: 'left',
    field: 'contactNumber',
    sortable: false,
  },
  {
    name: 'alternateContactNumber',
    required: true,
    label: 'Alternate Number',
    align: 'left',
    field: 'alternateContactNumber',
    sortable: false,
  },
  {
    name: 'pincode',
    required: true,
    label: 'Merchant Pincode',
    align: 'left',
    field: 'pincode',
    sortable: false,
  },
  {
    name: 'sim',
    required: true,
    label: 'Sim No',
    align: 'left',
    field: 'sim',
    sortable: false
  },
  {
    name: 'tid',
    required: true,
    label: 'TID',
    align: 'left',
    field: row => row.tid,
    sortable: false
  },
  {
    name: 'mid',
    required: true,
    label: 'MID',
    align: 'left',
    field: row => row.mid,
    sortable: false
  },
  {
    name: 'vpa',
    required: true,
    label: 'VPA',
    align: 'left',
    field: row => row.vpa,
    sortable: false
  }
];

const columnDataAssigned = [
  {
    name: 'leadNumber',
    required: true,
    label: 'Lead Id',
    align: 'left',
    field: 'leadNumber',
    sortable: false
  },
  {
    name: 'merchantName',
    required: true,
    label: 'Merchant Name',
    align: 'left',
    field: 'merchantName',
    sortable: false
  },
  {
    name: 'contactEmail',
    required: true,
    label: 'Merchant Email',
    align: 'left',
    field: 'contactEmail',
    sortable: false
  },
  {
    name: 'contactAddress',
    required: true,
    label: 'Merchant Address',
    align: 'left',
    field: 'contactAddress',
    sortable: false
  },
  {
    name: 'contactNumber',
    required: true,
    label: 'Merchant Number',
    align: 'left',
    field: 'contactNumber',
    sortable: false
  },
  {
    name: 'alternateContactNumber',
    required: true,
    label: 'Alternate Number',
    align: 'left',
    field: 'alternateContactNumber',
    sortable: false
  },
  {
    name: 'assignedTo',
    required: true,
    label: 'SO Name',
    align: 'left',
    field: 'assignedTo',
    sortable: false
  },
  {
    name: 'pincode',
    required: true,
    label: 'Merchant Pincode',
    align: 'left',
    field: 'pincode',
    sortable: false
  },
  {
    name: 'sim',
    required: true,
    label: 'Sim No',
    align: 'left',
    field: 'sim',
    sortable: false
  },
  {
    name: 'tid',
    required: true,
    label: 'TID',
    align: 'left',
    field: row => row.tid,
    sortable: false
  },
  {
    name: 'mid',
    required: true,
    label: 'MID',
    align: 'left',
    field: row => row.mid,
    sortable: false
  },
  {
    name: 'vpa',
    required: true,
    label: 'VPA',
    align: 'left',
    field: row => row.vpa,
    sortable: false
  },
  {
    name: 'action',
    required: true,
    label: 'Re-Assign',
    align: 'center',
    field: 'action',
    sortable: false
  }
];

const completed = [
  {
    name: 'leadNumber',
    required: true,
    label: 'Lead Id',
    align: 'left',
    field: 'leadNumber',
    sortable: false
  },
  {
    name: 'merchantName',
    required: true,
    label: 'Merchant Name',
    align: 'left',
    field: 'merchantName',
    sortable: false
  },
  {
    name: 'contactEmail',
    required: true,
    label: 'Merchant Email',
    align: 'left',
    field: 'contactEmail',
    sortable: false
  },
  {
    name: 'contactNumber',
    required: true,
    label: 'Merchant Number',
    align: 'left',
    field: 'contactNumber',
    sortable: false
  },
  {
    name: 'alternateContactNumber',
    required: true,
    label: 'Alternate Number',
    align: 'left',
    field: 'alternateContactNumber',
    sortable: false
  },
  {
    name: 'state',
    required: true,
    label: 'State',
    align: 'left',
    field: 'state',
    sortable: false
  },
  {
    name: 'city',
    required: true,
    label: 'City',
    align: 'left',
    field: 'city',
    sortable: false
  },
  {
    name: 'pincode',
    required: true,
    label: 'Pincode',
    align: 'left',
    field: 'pincode',
    sortable: false
  },
  {
    name: 'contactAddress',
    required: true,
    label: 'Address',
    align: 'left',
    field: 'contactAddress',
    sortable: false
  },
  {
    name: 'vpa',
    required: true,
    label: 'VPA',
    align: 'left',
    field: 'vpa',
    sortable: false
  },
  {
    name: 'updatedAt',
    required: true,
    label: 'Implementation Date',
    align: 'left',
    field: 'updatedAt',
    sortable: false
  },
  {
    name: 'equitasLat',
    required: true,
    label: 'Lat',
    align: 'left',
    field: 'equitasLat',
    sortable: false
  },
  {
    name: 'equitasLan',
    required: true,
    label: 'Lan',
    align: 'left',
    field: 'equitasLan',
    sortable: false
  }
];

// Computed properties
const getImplementationExecutiveList = computed(() => 
  store.getters['ImplementationExecutive/getImplementationExecutiveList']
);

const getRegionList = computed(() => 
  store.getters['ImplementationExecutive/getRegionList']
);

const getEquitasQueueAssignedList = computed(() => 
  store.getters['DeviceReplacement/getEquitasQueueAssignedList']
);

const getEquitasQueueUnAssignedList = computed(() => 
  store.getters['DeviceReplacement/getEquitasQueueUnAssignedList']
);

const getEquitasQueueCompletedList = computed(() => 
  store.getters['DeviceReplacement/getEquitasQueueCompletedList']
);

// Lifecycle hooks
onMounted(() => {
  ajaxLoadAllLeadInfo1({
    pagination: paginationControl1,
    filter: filterSearch1.value
  });
  ajaxLoadAllLeadInfo2({
    pagination: paginationControl2,
    filter: filterSearch2.value
  });
});

// Methods
const ajaxLoadAllLeadInfo1 = async ({ pagination, filter }) => {
  tableAjaxLoading1.value = true;
  $q.loading.show({
    delay: 0,
    spinnerColor: 'purple-9',
    message: 'Fetching data ..'
  });

  try {
    await store.dispatch('DeviceReplacement/EQUITAS_ONBOARDING_QUEUE_UNASSIGNED_LIST', {
      pagination,
      filter
    });

    // Load implementation executives
    await store.dispatch('ImplementationExecutive/IMPLEMENTATION_EXECUTIVE_LIST');
    const execOptions = getImplementationExecutiveList.value.map(value => ({
      label: `${value.name} | ${value.employeeID} | ${value.email}`,
      value: value.id
    }));
    assignToOptions.value = execOptions;

    // Load regions
    await store.dispatch('ImplementationExecutive/REGION_LIST');
    const regionOptions = getRegionList.value.map(value => ({
      label: value.regionAreaName,
      value: value.code
    }));
    assignToRegionOptions.value = regionOptions;

    // Update pagination
    Object.assign(paginationControl1, {
      rowsNumber: getEquitasQueueUnAssignedList.value.totalElements,
      page: getEquitasQueueUnAssignedList.value.number + 1,
      sortBy: getEquitasQueueUnAssignedList.value.sort?.[0]?.property || 'createdAt',
      descending: !(getEquitasQueueUnAssignedList.value.sort?.[0]?.ascending)
    });

    // Update table data
    tableData1.value = getEquitasQueueUnAssignedList.value.content || [];

    $q.loading.hide();
    tableAjaxLoading1.value = false;
  } catch (error) {
    $q.loading.hide();
    tableAjaxLoading1.value = false;
    
    let errorMessage = 'Please Try Again';
    if (error && error.message) {
      errorMessage = error.message;
    } else if (error && error.status === 404) {
      tableData1.value = [];
      errorMessage = 'No Data Found';
    }

    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: errorMessage,
      icon: 'thumb_down'
    });
  }
};

const ajaxLoadAllLeadInfo = async ({ pagination, filter }) => {
  tableAjaxLoading.value = true;
  $q.loading.show({
    delay: 0,
    spinnerColor: 'purple-9',
    message: 'Fetching data ..'
  });

  try {
    await store.dispatch('DeviceReplacement/EQUITAS_ONBOARDING_QUEUE_ASSIGNED_LIST', { 
      pagination, 
      filter 
    });

    // Update pagination
    Object.assign(paginationControl, {
      rowsNumber: getEquitasQueueAssignedList.value.totalElements,
      page: getEquitasQueueAssignedList.value.number + 1,
      sortBy: getEquitasQueueAssignedList.value.sort?.[0]?.property || pagination.sortBy,
      descending: !(getEquitasQueueAssignedList.value.sort?.[0]?.ascending)
    });

    // Update table data
    tableData.value = getEquitasQueueAssignedList.value.content || [];

    $q.loading.hide();
    tableAjaxLoading.value = false;
  } catch (error) {
    $q.loading.hide();
    tableAjaxLoading.value = false;
    
    let errorMessage = 'Please Try Again';
    if (error && error.message) {
      errorMessage = error.message;
    } else if (error && error.status === 404) {
      tableData.value = [];
      errorMessage = 'No Data Found';
    }

    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: errorMessage,
      icon: 'thumb_down'
    });
  }
};

const ajaxLoadAllLeadInfo2 = async ({ pagination, filter }) => {
  tableAjaxLoading2.value = true;
  $q.loading.show({
    delay: 0,
    spinnerColor: 'purple-9',
    message: 'Fetching data ..'
  });

  try {
    await store.dispatch('DeviceReplacement/EQUITAS_ONBOARDING_QUEUE_COMPLETED_LIST', { 
      pagination, 
      filter 
    });

    // Update pagination
    Object.assign(paginationControl2, {
      rowsNumber: getEquitasQueueCompletedList.value.totalElements,
      page: getEquitasQueueCompletedList.value.number + 1,
      sortBy: getEquitasQueueCompletedList.value.sort?.[0]?.property || pagination.sortBy,
      descending: !(getEquitasQueueCompletedList.value.sort?.[0]?.ascending)
    });

    // Update table data
    tableData2.value = getEquitasQueueCompletedList.value.content || [];

    $q.loading.hide();
    tableAjaxLoading2.value = false;
  } catch (error) {
    $q.loading.hide();
    tableAjaxLoading2.value = false;
    
    let errorMessage = 'Please Try Again';
    if (error && error.message) {
      errorMessage = error.message;
    } else if (error && error.status === 404) {
      tableData2.value = [];
      errorMessage = 'No Data Found';
    }

    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: errorMessage,
      icon: 'thumb_down'
    });
  }
};

const goToUnassignedTab = (tab) => {
  if (tab === 'unassigned') {
    ajaxLoadAllLeadInfo1({
      pagination: paginationControl1,
      filter: filterSearch1.value
    });
  } else if (tab === 'assigned') {
    ajaxLoadAllLeadInfo({
      pagination: paginationControl,
      filter: filterSearch.value
    });
  } else if (tab === 'completed') {
    ajaxLoadAllLeadInfo2({
      pagination: paginationControl2,
      filter: filterSearch2.value
    });
  }
};

const fnReassignData = (rowDetails) => {
  propShowReassign.value = !propShowReassign.value;
  ajaxLoadAllLeadInfo({
    pagination: paginationControl,
    filter: filterSearch.value
  });
  
  if (rowDetails !== undefined) {
    propRowDetails.value = rowDetails;
  }
};

const assignImplementationUser = async () => {
  const self = this;
  
  if (formData.marsDeviceIdsCooked.length === 0) {
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Select at least one item to assign',
      icon: 'thumb_down'
    });
    return;
  }

  if (formData.assignTo.id && (!formData.region || formData.region === '')) {
    // Assign to user
    $q.loading.show({
      delay: 100,
      spinnerColor: 'purple-9',
      message: 'Please wait..'
    });

    const marsDeviceIdsCooked = formData.marsDeviceIdsCooked.map(value => value.id);
    const postValues = {
      userId: formData.assignTo.id,
      marsDeviceIds: {
        marsDeviceIds: marsDeviceIdsCooked
      }
    };

    try {
      const res = await store.dispatch('DeviceReplacement/EQUITAS_SOUNDBOX_REQUEST_UNASSIGED_TO_ASSIGNED_STATE', postValues);
      
      if (res.status === 200) {
        formData.marsDeviceIdsCooked = [];
        formData.assignTo.id = '';
        formData.region = '';
        
        $q.notify({
          color: 'positive',
          position: 'bottom',
          message: 'Successfully assigned!',
          icon: 'thumb_up'
        });
        
        ajaxLoadAllLeadInfo1({
          pagination: paginationControl1,
          filter: filterSearch1.value
        });
      }
    } catch (error) {
      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: error.message || 'Please try again',
        icon: 'thumb_down'
      });
    } finally {
      $q.loading.hide();
    }
  } else if (formData.region && (!formData.assignTo.id || formData.assignTo.id === '')) {
    // Assign to region
    $q.loading.show({
      delay: 100,
      spinnerColor: 'purple-9',
      message: 'Please wait..'
    });

    const marsDeviceIdsCooked = formData.marsDeviceIdsCooked.map(value => value.id);
    const data = {
      regionCode: formData.region,
      marsDeviceIds: {
        marsDeviceIds: marsDeviceIdsCooked
      }
    };

    try {
      const res = await store.dispatch('DeviceReplacement/EQUITAS_ONBOARDING_REQUEST_TO_ASSIGNED_REGION', data);
      
      if (res.status === 200) {
        formData.marsDeviceIdsCooked = [];
        formData.assignTo.id = '';
        formData.region = '';
        
        $q.notify({
          color: 'positive',
          position: 'bottom',
          message: res.body?.data || 'Successfully assigned to region!',
          icon: 'thumb_up'
        });
        
        ajaxLoadAllLeadInfo1({
          pagination: paginationControl1,
          filter: filterSearch1.value
        });
      }
    } catch (error) {
      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: error.body?.data || error.message || 'Please try again',
        icon: 'thumb_down'
      });
    } finally {
      $q.loading.hide();
    }
  } else if (formData.assignTo.id && formData.region) {
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Select Only One Request mode',
      icon: 'thumb_down'
    });
  } else {
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Select Any One Request mode',
      icon: 'thumb_down'
    });
  }
};

const downloadCompletedData = async () => {
  $q.loading.show({
    delay: 100,
    spinnerColor: 'purple-9',
    message: 'Please wait..'
  });

  try {
    await store.dispatch('staticQrDownloads/DOWNLOAD_COMPLETED_DATA');
    
    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Successfully Downloaded',
      icon: 'thumb_up'
    });
  } catch (error) {
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: error.message || 'Download failed',
      icon: 'thumb_down'
    });
  } finally {
    $q.loading.hide();
  }
};

const downloadErrorData = async () => {
  $q.loading.show({
    delay: 100,
    spinnerColor: 'purple-9',
    message: 'Please wait...'
  });

  try {
    await store.dispatch('staticQrDownloads/DOWNLOAD_ERROR_DATA');
    
    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Successfully Downloaded',
      icon: 'thumb_up'
    });
  } catch (error) {
    let errorMessage = 'Download failed.';
    if (error && error.message) {
      errorMessage = error.message;
    } else if (error && error.status === 404) {
      errorMessage = 'No Data Found';
    }

    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: errorMessage,
      icon: 'thumb_down'
    });
  } finally {
    $q.loading.hide();
  }
};

// Pagination handlers
const handlePageChange1 = (page) => {
  paginationControl1.page = page;
  ajaxLoadAllLeadInfo1({
    pagination: paginationControl1,
    filter: filterSearch1.value
  });
};

const handleRowsPerPageChange1 = (rowsPerPage) => {
  paginationControl1.rowsPerPage = rowsPerPage;
  paginationControl1.page = 1;
  ajaxLoadAllLeadInfo1({
    pagination: paginationControl1,
    filter: filterSearch1.value
  });
};

const handleFilterSearch1 = (value) => {
  filterSearch1.value = value;
  paginationControl1.page = 1;
  ajaxLoadAllLeadInfo1({
    pagination: paginationControl1,
    filter: filterSearch1.value
  });
};

const handlePageChange = (page) => {
  paginationControl.page = page;
  ajaxLoadAllLeadInfo({
    pagination: paginationControl,
    filter: filterSearch.value
  });
};

const handleRowsPerPageChange = (rowsPerPage) => {
  paginationControl.rowsPerPage = rowsPerPage;
  paginationControl.page = 1;
  ajaxLoadAllLeadInfo({
    pagination: paginationControl,
    filter: filterSearch.value
  });
};

const handleFilterSearch = (value) => {
  filterSearch.value = value;
  paginationControl.page = 1;
  ajaxLoadAllLeadInfo({
    pagination: paginationControl,
    filter: filterSearch.value
  });
};

const handlePageChange2 = (page) => {
  paginationControl2.page = page;
  ajaxLoadAllLeadInfo2({
    pagination: paginationControl2,
    filter: filterSearch2.value
  });
};

const handleRowsPerPageChange2 = (rowsPerPage) => {
  paginationControl2.rowsPerPage = rowsPerPage;
  paginationControl2.page = 1;
  ajaxLoadAllLeadInfo2({
    pagination: paginationControl2,
    filter: filterSearch2.value
  });
};

const handleFilterSearch2 = (value) => {
  filterSearch2.value = value;
  paginationControl2.page = 1;
  ajaxLoadAllLeadInfo2({
    pagination: paginationControl2,
    filter: filterSearch2.value
  });
};
</script>