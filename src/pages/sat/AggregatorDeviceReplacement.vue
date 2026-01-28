<template>
  <q-page class="q-pa-md">
    <!-- content -->
    <div>
      <div class="text-h5 q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Aggregator Device Replacement
      </div>

      <!--START: table Footer -->
      <q-card class="group q-pa-md" v-if="selectedTab == 'unAssigned'">
        <div class="row items-center gutter-y-sm">
          <div class="col-md-3 col-sm-6 col-xs-6 text-grey-7 text-weight-medium" align="left">
            <span class="text-h2">{{ formData.marsDeviceIdsCooked.length }}</span>/ selected
          </div>
          <div class="col-md-3 col-sm-6 col-xs-6">
            <q-select clearable v-model="formData.assignTo" color="grey-9" :options="assignToOptions" label="Assign To"
              emit-value map-options />
          </div>
          <div class="col-md-3 col-sm-6 col-xs-6" align="right">
            <q-btn no-caps :disabled="formData.marsDeviceIdsCooked.length == 0" label="Assign" class="common-dark-blue"
              @click="assignImplementationUser" />
          </div>
        </div>
      </q-card>

      <q-card class="group q-pa-md" v-if="selectedTab == 'assigned'">
        <div class="row items-center gutter-y-sm">
          <div class="col-md-9 col-sm-12 col-xs-12">
            <div class="row items-center">
              <div class="col-md-4 col-sm-6 col-xs-6 group"></div>
            </div>
          </div>
        </div>
      </q-card>
      <!--END: table Footer -->

      <q-tabs v-model="selectedTab" class="shadow-1" inline-label @update:model-value="goToUnassignedTab">
        <q-tab name="unAssigned" label="Unassigned" />
        <q-tab name="assigned" label="Assigned" />
      </q-tabs>

      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="assigned">
          <!--START: table Data -->
          <q-table :rows="tableData" :columns="columnDataAssigned" :filter="filterSearch"
            :pagination="paginationControl" :selected-rows="formData.marsDeviceIdsCookedUnAssinged" row-key="id"
            :loading="tableAjaxLoading" :rows-per-page-options="[5,10,15,20]" color="dark"
            @request="ajaxLoadAllLeadInfo" v-model:selected="formData.marsDeviceIdsCookedUnAssinged">
            <template #body="props">
              <q-tr :props="props">
                <q-td>
                  <q-checkbox :model-value="formData.marsDeviceIdsCookedUnAssinged.includes(props.row)"
                    @update:model-value="toggleSelectedAssigned(props.row)" />
                </q-td>
                <q-td v-if="props.row.leadInformation">
                  <span class="text-primary cursor-pointer" @click="toggleLeadInformation(props.row.leadInformation)">
                    # {{ props.row.leadInformation.leadNumber || 'NA' }}
                  </span>
                </q-td>
                <q-td v-if="props.row.leadInformation">
                  {{ formatDate(props.row.createdAt) }}
                </q-td>
                <q-td v-if="props.row.leadInformation" class="customTd">
                  <div class="text-primary">{{ props.row.tid }}</div>
                </q-td>
                <q-td v-if="props.row.leadInformation" class="customTd">
                  <div class="text-primary">{{ props.row.mid }}</div>
                </q-td>
                <q-td v-if="props.row.leadInformation">
                  {{ props.row.leadInformation.leadName || 'NA' }}
                </q-td>
                <q-td v-if="props.row.leadInformation" align="center">
                  {{ props.row.leadInformation.contactNumber || 'NA' }}
                </q-td>
                <q-td v-if="props.row.leadInformation" class="customTd customCellLength">
                  <div>{{ props.row.deviceAddress }}</div>
                </q-td>
                <q-td v-if="props.row.leadInformation">
                  {{ props.row.leadInformation.leadSource?.sourceName || 'NA' }}
                </q-td>
                <q-td v-if="props.row.leadInformation">
                  {{ props.row.replacedBy ? `${props.row.replacedBy.name} | ${props.row.replacedBy.employeeID}` : 'NA'
                  }}
                </q-td>
                <q-td v-if="props.row.leadInformation">
                  {{ props.row.leadInformation.aggregatorDevice?.deviceName || 'NA' }}
                </q-td>
                <q-td v-if="props.row.leadInformation">
                  {{ props.row.regionalInventory?.serialNumber || 'NA' }}
                </q-td>
                <q-td v-if="props.row.leadInformation">
                  {{ formatDate(props.row.leadInformation.submitToMarsDate) }}
                </q-td>
              </q-tr>
            </template>

            <template #top>
              <!--START: table filter,search -->
              <div class="col-md-5">
                <q-input clearable color="grey-9" v-model="filterSearch"
                  placeholder="Search By TID, MID, Merchant Name .." class="q-mr-lg q-py-sm">
                  <template #prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </template>
          </q-table>
          <!--END: table Data -->
        </q-tab-panel>

        <q-tab-panel name="unAssigned">
          <!--START: table Data -->
          <q-table :rows="tableData1" :columns="columnDataUnassigned" :filter="filterSearch1"
            :pagination="paginationControl1" :selected-rows="formData.marsDeviceIdsCooked" row-key="id"
            :loading="tableAjaxLoading1" :rows-per-page-options="[5,10,15,20]" color="dark"
            @request="ajaxLoadAllLeadInfo1" v-model:selected="formData.marsDeviceIdsCooked" selection="multiple">
            <template #body="props">
              <q-tr :props="props">
                <q-td>
                  <q-checkbox :model-value="formData.marsDeviceIdsCooked.includes(props.row)"
                    @update:model-value="toggleSelectedUnassigned(props.row)" />
                </q-td>
                <q-td v-if="props.row.leadInformation">
                  <span class="text-primary cursor-pointer" @click="toggleLeadInformation(props.row.leadInformation)">
                    # {{ props.row.leadInformation?.leadNumber || 'NA' }}
                  </span>
                </q-td>
                <q-td v-if="props.row.leadInformation">
                  {{ formatDate(props.row.createdAt) }}
                </q-td>
                <q-td v-if="props.row.leadInformation" class="customTd">
                  <div class="text-primary">{{ props.row.tid }}</div>
                </q-td>
                <q-td v-if="props.row.leadInformation" class="customTd">
                  <div class="text-primary">{{ props.row.mid }}</div>
                </q-td>
                <q-td v-if="props.row.leadInformation">
                  {{ props.row.leadInformation?.leadName || 'NA' }}
                </q-td>
                <q-td v-if="props.row.leadInformation" align="center">
                  {{ props.row.leadInformation?.contactNumber || 'NA' }}
                </q-td>
                <q-td v-if="props.row.leadInformation" class="customTd customCellLength">
                  <div>{{ props.row.deviceAddress }}</div>
                </q-td>
                <q-td v-if="props.row.leadInformation">
                  {{ props.row.leadInformation.aggregatorDevice?.deviceName || 'NA' }}
                </q-td>
                <q-td v-if="props.row.leadInformation">
                  {{ props.row.regionalInventory?.serialNumber || 'NA' }}
                </q-td>
                <q-td v-if="props.row.leadInformation">
                  {{ props.row.leadInformation.leadSource?.sourceName || 'NA' }}
                </q-td>
                <q-td v-if="props.row.leadInformation">
                  {{ formatDate(props.row.leadInformation.submitToMarsDate) }}
                </q-td>
              </q-tr>
            </template>

            <template #top>
              <!--START: table filter,search -->
              <div class="col-md-5">
                <q-input clearable color="grey-9" v-model="filterSearch1"
                  placeholder="Search By TID, MID, Merchant Name .." class="q-mr-lg q-py-sm">
                  <template #prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </template>
          </q-table>
          <!--END: table Data -->
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <!-- Common lead information in popup -->
    <generalLeadInformation v-if="propToggleLeadInformation" :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation" @closeLeadInformation="toggleLeadInformation" />
  </q-page>
</template>

<script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useStore } from 'vuex';
  import { useQuasar } from 'quasar';
  import moment from 'moment';
  import generalLeadInformation from '../../components/generalLeadInformation.vue';

  const $q = useQuasar();
  const store = useStore();

  // Reactive variables
  const propToggleLeadInformation = ref(false);
  const addtnLeadInformation = ref(null);
  const filterSearch = ref('');
  const filterSearch1 = ref('');
  const selectedTab = ref('assigned');
  const assignToOptions = ref([]);
  const tableData = ref([]);
  const tableData1 = ref([]);

  const formData = ref({
    marsDeviceIdsCooked: [],
    marsDeviceIdsCookedUnAssinged: [],
    triggerWelcomeMail: false,
    assignTo: '',
  });

  const paginationControl = ref({
    sortBy: 'createdAt',
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  });

  const paginationControl1 = ref({
    sortBy: 'createdAt',
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  });

  const tableAjaxLoading = ref(false);
  const tableAjaxLoading1 = ref(false);

  // Computed properties
  const getAggregatordeviceReplacementQueueAssignedList = computed(() =>
    store.getters['AggregatorDeviceReplacement/getAggregatordeviceReplacementQueueAssignedList']);

  const getAggregatorDeviceReplacementQueueUnassignedList = computed(() =>
    store.getters['AggregatorDeviceReplacement/getAggregatorDeviceReplacementQueueUnassignedList']);

  const getImplementationExecutiveList = computed(() =>
    store.getters['ImplementationExecutive/getImplementationExecutiveList']);


  // Column definitions
  const columnDataAssigned = [
    { name: 'select', align: 'left', label: '', field: 'select', sortable: false },
    { name: 'leadNumber', align: 'left', label: 'Lead Number', field: 'leadNumber', sortable: false },
    { name: 'createdAt', align: 'left', label: 'Date of TID Generation', field: 'createdAt', sortable: true },
    { name: 'tid', align: 'left', label: 'TID', field: 'tid', sortable: true },
    { name: 'mid', align: 'left', label: 'MID', field: 'mid', sortable: true },
    { name: 'merchant_name', align: 'left', label: 'Merchant Name', field: 'merchant_name', sortable: false },
    { name: 'mobile_number', align: 'center', label: 'Mobile Number', field: 'mobile_number', sortable: false },
    { name: 'deviceAddress', align: 'left', label: 'Address', field: 'deviceAddress', sortable: false },
    { name: 'source', align: 'left', label: 'Source', field: 'source', sortable: false },
    { name: 'assigned_to', align: 'left', label: 'Assigned To', field: 'assigned_to', sortable: false },
    { name: 'deviceType', align: 'left', label: 'Device Type', field: 'deviceType', sortable: false },
    { name: 'serial_number', align: 'left', label: 'Serial Number', field: 'serial_number', sortable: true },
    { name: 'submitToMarsDate', align: 'left', label: 'Date of Submission', field: 'submitToMarsDate', sortable: true },
  ];

  const columnDataUnassigned = [
    { name: 'select', align: 'left', label: '', field: 'select', sortable: false },
    { name: 'leadNumber', align: 'left', label: 'Lead Number', field: 'leadNumber', sortable: false },
    { name: 'createdAt', align: 'left', label: 'Date of TID Generation', field: 'createdAt', sortable: true },
    { name: 'tid', align: 'left', label: 'TID', field: 'tid', sortable: true },
    { name: 'mid', align: 'left', label: 'MID', field: 'mid', sortable: true },
    { name: 'merchant_name', align: 'left', label: 'Merchant Name', field: 'merchant_name', sortable: false },
    { name: 'mobile_number', align: 'center', label: 'Mobile Number', field: 'mobile_number', sortable: false },
    { name: 'deviceAddress', align: 'left', label: 'Address', field: 'deviceAddress', sortable: false },
    { name: 'deviceType', align: 'left', label: 'Device Type', field: 'deviceType', sortable: false },
    { name: 'serial_number', align: 'left', label: 'Serial Number', field: 'serial_number', sortable: true },
    { name: 'source', align: 'left', label: 'Source', field: 'source', sortable: false },
    { name: 'submitToMarsDate', align: 'left', label: 'Date of Submission', field: 'submitToMarsDate', sortable: true },
  ];

  // Helper functions
  const formatDate = (date) => {
    if (!date) return 'NA';
    return moment(date).format('Do MMM Y');
  };

  const toggleSelectedAssigned = (row) => {
    const index = formData.value.marsDeviceIdsCookedUnAssinged.findIndex(r => r.id === row.id);
    if (index === -1) {
      formData.value.marsDeviceIdsCookedUnAssinged.push(row);
    } else {
      formData.value.marsDeviceIdsCookedUnAssinged.splice(index, 1);
    }
  };

  const toggleSelectedUnassigned = (row) => {
    const index = formData.value.marsDeviceIdsCooked.findIndex(r => r.id === row.id);
    if (index === -1) {
      formData.value.marsDeviceIdsCooked.push(row);
    } else {
      formData.value.marsDeviceIdsCooked.splice(index, 1);
    }
  };

  // Methods
  const getPincodeInformations = async () => {
    await store.dispatch('SuperAdminUsers/FETCH_ALL_STATES_DATA');
  };

  const ajaxLoadAllLeadInfo1 = async ({ pagination, filter }) => {
    $q.loading.show({
      delay: 0,
      spinnerColor: 'purple-9',
      message: 'Fetching data ..',
    });

    try {
      await store.dispatch('AggregatorDeviceReplacement/AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_UNASSIGNED_LIST', { pagination, filter });

      const data = getAggregatorDeviceReplacementQueueUnassignedList.value;
      paginationControl1.value = {
        ...pagination,
        rowsNumber: data.totalElements || 0,
        page: data.number !== undefined ? data.number + 1 : 1,
        sortBy: data.sort?.[0]?.property || 'createdAt',
        descending: !(data.sort?.[0]?.ascending || false)
      };

      tableData1.value = data.content || [];

      // Load implementation executives
      await store.dispatch('ImplementationExecutive/IMPLEMENTATION_EXECUTIVE_LIST');
      assignToOptions.value = getImplementationExecutiveList.value.map(value => ({
        label: `${value.name} | ${value.employeeID} | ${value.email}`,
        value: value.id
      }));

      $q.loading.hide();
    } catch (error) {

      console.error('Error loading unassigned list:', error);
      $q.loading.hide();
    }
  };

  const ajaxLoadAllLeadInfo = async ({ pagination, filter }) => {
    $q.loading.show({
      delay: 0,
      spinnerColor: 'purple-9',
      message: 'Fetching data ..',
    });

    try {
      await store.dispatch('AggregatorDeviceReplacement/AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_ASSIGNED_LIST', { pagination, filter });

      const data = getAggregatordeviceReplacementQueueAssignedList.value;
      paginationControl.value = {
        ...pagination,
        rowsNumber: data.totalElements || 0,
        page: data.number !== undefined ? data.number + 1 : 1,
        sortBy: data.sort?.[0]?.property || 'createdAt',
        descending: !(data.sort?.[0]?.ascending || false)
      };

      tableData.value = data.content || [];

      $q.loading.hide();
    } catch (error) {

      console.error('Error loading assigned list:', error);
      $q.loading.hide();
    }
  };

  const goToUnassignedTab = async (tab) => {
    if (tab === 'unAssigned') {
      try {
        $q.loading.show({
          delay: 0,
          spinnerColor: 'purple-9',
          message: 'Fetching data ..',
        });

        await store.dispatch('AggregatorDeviceReplacement/AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_UNASSIGNED_LIST', {
          pagination: paginationControl1.value,
          filter: filterSearch1.value,
        });

        $q.loading.hide();
      } catch (error) {

        console.error('Error in goToUnassignedTab:', error);
        $q.loading.hide();
      }
    } else {
      await ajaxLoadAllLeadInfo({
        pagination: paginationControl.value,
        filter: filterSearch.value,
      });
    }
  };

  

  const assignImplementationUser = async () => {
    if (formData.value.marsDeviceIdsCooked.length === 0) {
      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: 'Select atleast one item to assign',
        icon: 'thumb_down',
      });
      return;
    }

    if (!formData.value.assignTo) {
      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: 'Implementation officer cannot be empty!',
        icon: 'thumb_down',
      });
      return;
    }

    const marsDeviceIdsCooked = formData.value.marsDeviceIdsCooked.map(value => value.id);
    const postValues = {
      marsDeviceIds: marsDeviceIdsCooked,
      userId: formData.value.assignTo,
    };

    try {
      await store.dispatch('AggregatorDeviceReplacement/AGGREGATOR_DEVICE_REPLACEMENT_QUEUE_SUBMIT', postValues);

      // Refresh both tables
      await ajaxLoadAllLeadInfo({
        pagination: paginationControl.value,
        filter: filterSearch.value,
      });
      await ajaxLoadAllLeadInfo1({
        pagination: paginationControl1.value,
        filter: filterSearch1.value,
      });

      formData.value.marsDeviceIdsCooked = [];
      formData.value.assignTo = '';

      $q.notify({
        color: 'positive',
        position: 'bottom',
        message: 'Successfully assigned!',
        icon: 'thumb_up',
      });
    } catch (error) {

      console.error('Error assigning:', error);
      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: 'Please try again',
        icon: 'thumb_down',
      });
    }
  };


  const toggleLeadInformation = (leadDetails) => {
    propToggleLeadInformation.value = !propToggleLeadInformation.value;
    if (leadDetails !== undefined) {
      addtnLeadInformation.value = leadDetails;
    }
  };

  // Lifecycle hooks
  onMounted(() => {
    getPincodeInformations();
    ajaxLoadAllLeadInfo({
      pagination: paginationControl.value,
      filter: filterSearch.value,
    });
    ajaxLoadAllLeadInfo1({
      pagination: paginationControl1.value,
      filter: filterSearch1.value,
    });
  });

  // Watch for tab changes
  watch(selectedTab, (newTab) => {
    goToUnassignedTab(newTab);
  });
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

  .group {
    margin-bottom: 16px;
  }

  .common-dark-blue {
    background-color: #1a237e;
    color: white;
  }
</style>