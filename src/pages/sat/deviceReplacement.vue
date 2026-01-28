<template>
  <q-page>
    <!-- content -->
    <div>
      <div class="
        q-title q-px-lg q-py-md
        text-weight-regular
        bottom-border
        text-grey-9
      ">
        Bijlipay Device Replacement
      </div>
      <!--END: table title -->
      <!--START: table Footer -->
      <q-card class="group q-pa-md" v-if="selectedTab == 'unAssigned'">
        <div class="row items-center gutter-y-sm">
          <div class="col-md-3 col-sm-6 col-xs-6 text-grey-7 text-weight-medium" align="left">
            <span class="q-display-2">{{
              formData.marsDeviceIdsCooked.length
            }}</span>/ selected
          </div>
          <div class="col-md-3 col-sm-6 col-xs-6">
            <q-select
              clearable
              v-model="formData.assignTo"
              :options="assignToOptions"
              placeholder="Assign To"
              color="grey-9"
              emit-value
              map-options
            />
          </div>
          <div class="col-md-3 col-sm-6 col-xs-6" align="right">
            <q-btn
              no-caps
              :disabled="formData.marsDeviceIdsCooked.length == 0 ? true : false"
              label="Assign"
              class="common-dark-blue"
              @click="assignImplementationUser"
            />
          </div>
        </div>
      </q-card>
      <q-card class="group q-pa-md" v-if="selectedTab == 'assigned'">
        <div class="row items-center gutter-y-sm">
          <!-- Selected Count -->
          <div class="col-md-3 col-sm-6 col-xs-6 text-grey-7 text-weight-medium" align="left">
            <span class="q-display-2">
              {{ formData.marsDeviceIdsCookedUnAssinged.length }} </span>/ selected
          </div>

          <!-- Select Box -->
          <div class="col-md-3 col-sm-6 col-xs-6">
            <q-select
              clearable
              v-model="formData.assignToReassign"
              :options="assignToOptions"
              placeholder="Re-Assign To"
              color="grey-9"
              :disable="isReAssignDropdownDisabled"
              @click="handleReAssignDropdownClick"
              emit-value
              map-options
            />
          </div>

          <!-- Buttons Column -->
          <div class="col-md-3 col-sm-6 col-xs-6" align="right">
            <div class="column items-end">
              <!-- Re-Assign Button -->
              <q-btn
                no-caps
                label="Re-Assign"
                class="common-dark-blue q-mb-sm"
                :disabled="isReAssignDisabled"
                :loading="reAssignLoading"
                @click="reAssignImplementationUser"
              />

              <!-- Un-Assign button -->
              <q-btn
                no-caps
                label="Un-Assign"
                class="common-dark-blue q-mb-sm"
                :disabled="isUnAssignDisabled"
                :loading="unAssignLoading"
                @click="unAssignImplementationUser"
              />
            </div>
          </div>
        </div>
      </q-card>
      <!--END: table Footer -->
      
      <q-tabs v-model="selectedTab" class="shadow-1" color="grey-1">
        <q-tab name="unAssigned" label="Unassigned" />
        <q-tab name="assigned" label="Assigned" />
        
        <q-tab-panel name="assigned">
          <!--START: table Data -->
          <q-table
            :rows="tableData"
            :columns="columnDataAssigned"
            v-model:selected="formData.marsDeviceIdsCookedUnAssinged"
            selection="multiple"
            table-class="customTableClass"
            :filter="filterSearch"
            v-model:pagination="paginationControl"
            row-key="id"
            :loading="tableAjaxLoading"
            :rows-per-page-options="[5, 10, 15, 20]"
            color="dark"
            @request="ajaxLoadAllLeadInfo"
          >
            <template #body-cell-leadNumber="props">
              <q-td
                :props="props"
                class="cursor-pointer"
                @click="toggleLeadInformation(props.row.leadInformation)"
                v-if="props.row.leadInformation != null || props.row.qrLeadInformation != null"
              >
                <span class="label text-primary">#
                  {{
                    props.row.leadInformation == null
                      ? props.row.qrLeadInformation.qrLeadNumber
                      : props.row.leadInformation.leadNumber
                  }}</span>
              </q-td>
            </template>

            <template #body-cell-submitToMarsDate="props">
              <q-td :props="props" v-if="props.row.leadInformation != null || props.row.qrLeadInformation != null">
                {{
                  formatDate(
                    props.row.leadInformation != null &&
                    props.row.leadInformation.submitToMarsDate != null
                      ? props.row.leadInformation.submitToMarsDate
                      : props.row.qrLeadInformation != null &&
                        props.row.qrLeadInformation.submitMarsDate != null
                        ? props.row.qrLeadInformation.submitMarsDate
                        : "NA"
                  )
                }}
              </q-td>
            </template>

            <template #body-cell-createdAt="props">
              <q-td :props="props" v-if="props.row.leadInformation != null || props.row.qrLeadInformation != null">
                {{ formatDate(props.row.createdAt) }}
              </q-td>
            </template>

            <template #body-cell-deviceAddress="props">
              <q-td :props="props" class="customTd customCellLength" v-if="props.row.leadInformation != null || props.row.qrLeadInformation != null">
                <div>{{ props.row.deviceAddress }}</div>
              </q-td>
            </template>

            <template #body-cell-tid="props">
              <q-td :props="props" class="customTd" v-if="props.row.leadInformation != null || props.row.qrLeadInformation != null">
                <div class="text-primary">
                  {{ props.row.tid }}
                </div>
              </q-td>
            </template>

            <template #body-cell-mid="props">
              <q-td :props="props" class="customTd" v-if="props.row.leadInformation != null || props.row.qrLeadInformation != null">
                <div class="text-primary">
                  {{ props.row.mid }}
                </div>
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
                  label="Search By TID, MID"
                  class="q-mr-lg q-py-sm"
                />
              </div>
              <!--END: table filter,search -->
            </template>
          </q-table>
          <!--END: table Data -->
        </q-tab-panel>

        <q-tab-panel name="unAssigned">
          <!--START: table Data -->
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
            @request="ajaxLoadAllLeadInfo1"
          >
            <template #body-cell-leadNumber="props">
              <q-td
                :props="props"
                class="cursor-pointer"
                @click="toggleLeadInformation(props.row.leadInformation)"
                v-if="props.row.leadInformation != null || props.row.qrLeadInformation != null"
              >
                <span class="label text-primary">#
                  {{
                    props.row.leadInformation == null
                      ? props.row.qrLeadInformation.qrLeadNumber
                      : props.row.leadInformation.leadNumber
                  }}</span>
              </q-td>
            </template>

            <template #body-cell-submitToMarsDate="props">
              <q-td :props="props" v-if="props.row.leadInformation != null || props.row.qrLeadInformation != null">
                {{
                  formatDate(
                    props.row.leadInformation != null &&
                    props.row.leadInformation.submitToMarsDate != null
                      ? props.row.leadInformation.submitToMarsDate
                      : props.row.qrLeadInformation != null &&
                        props.row.qrLeadInformation.submitMarsDate != null
                        ? props.row.qrLeadInformation.submitMarsDate
                        : "NA"
                  )
                }}
              </q-td>
            </template>

            <template #body-cell-createdAt="props">
              <q-td :props="props" v-if="props.row.leadInformation != null || props.row.qrLeadInformation != null">
                {{ formatDate(props.row.createdAt) }}
              </q-td>
            </template>

            <template #body-cell-tid="props">
              <q-td :props="props" class="customTd" v-if="props.row.leadInformation != null || props.row.qrLeadInformation != null">
                <div class="text-primary">
                  {{ props.row.tid == null ? "NA" : props.row.tid }}
                </div>
              </q-td>
            </template>

            <template #body-cell-mid="props">
              <q-td :props="props" class="customTd" v-if="props.row.leadInformation != null || props.row.qrLeadInformation != null">
                <div class="text-primary">
                  {{ props.row.mid }}
                </div>
              </q-td>
            </template>

            <template #body-cell-deviceAddress="props">
              <q-td :props="props" class="customTd customCellLength" v-if="props.row.leadInformation != null || props.row.qrLeadInformation != null">
                <div>
                  {{ props.row.deviceAddress }}
                </div>
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
                  label="Search By TID, MID"
                  class="q-mr-lg q-py-sm"
                />
              </div>
              <!--END: table filter,search -->
            </template>
          </q-table>
          <!--END: table Data -->
        </q-tab-panel>
      </q-tabs>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, watch, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';
import { format } from 'date-fns';

export default defineComponent({
  name: 'implementationQueue',
  
  setup() {
    const $q = useQuasar();
    const store = useStore();

    // Refs
    const propToggleLeadInformation = ref(false);
    const addtnLeadInformation = ref(null);
    const filterSearch = ref('');
    const filterSearch1 = ref('');
    const selectedTab = ref('assigned');
    const assignToOptions = ref([]);
    const tableData = ref([]);
    const tableData1 = ref([]);
    const reAssignLoading = ref(false);
    const unAssignLoading = ref(false);
    const currentDeviceInfo = ref({});
    const showDeviceAddressModal = ref(false);
    const tableAjaxLoading = ref(false);
    const tableAjaxLoading1 = ref(false);

    const formData = ref({
      marsDeviceIdsCooked: [],
      marsDeviceIdsCookedUnAssinged: [],
      triggerWelcomeMail: false,
      assignTo: '',
      assignToReassign: ''
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

    // Columns definitions
    const columnDataAssigned = [
      {
        name: 'leadNumber',
        required: true,
        label: 'Lead Number',
        align: 'left',
        field: row => {
          return row.leadInformation != null && row.leadInformation.leadNumber != null
            ? row.leadInformation.leadNumber
            : row.qrLeadInformation != null && row.qrLeadInformation.qrLeadNumber != null
              ? row.qrLeadInformation.qrLeadNumber
              : 'NA';
        },
        sortable: false
      },
      {
        name: 'createdAt',
        required: true,
        label: 'Date of TID Generation',
        align: 'left',
        field: 'createdAt',
        sortable: true
      },
      {
        name: 'tid',
        required: true,
        label: 'TID',
        align: 'left',
        field: row => row.tid,
        sortable: true
      },
      {
        name: 'mid',
        required: true,
        label: 'MID',
        align: 'left',
        field: row => row.mid,
        sortable: true
      },
      {
        name: 'merchant_name',
        required: true,
        label: 'Merchant Name',
        align: 'left',
        field: row => {
          return row.leadInformation != null && row.leadInformation.leadName != null
            ? row.leadInformation.leadName
            : row.qrLeadInformation != null && row.qrLeadInformation.legalName != null
              ? row.qrLeadInformation.legalName
              : 'NA';
        },
        sortable: false
      },
      {
        name: 'mobile_number',
        required: true,
        label: 'Mobile Number',
        align: 'center',
        field: row => {
          return row.leadInformation != null && row.leadInformation.contactNumber != null
            ? row.leadInformation.contactNumber
            : row.qrLeadInformation != null && row.qrLeadInformation.contactNumber != null
              ? row.qrLeadInformation.contactNumber
              : 'NA';
        },
        sortable: false
      },
      {
        name: 'deviceAddress',
        required: true,
        label: 'Address',
        align: 'left',
        field: row => row.deviceAddress,
        sortable: false
      },
      {
        name: 'source',
        required: true,
        label: 'Source',
        align: 'left',
        field: row => {
          return row.leadInformation != null &&
            row.leadInformation.leadSource != null &&
            row.leadInformation.leadSource.sourceName != null
            ? row.leadInformation.leadSource.sourceName
            : row.qrLeadInformation != null &&
              row.qrLeadInformation.leadSource != null &&
              row.qrLeadInformation.leadSource.sourceName != null
              ? row.qrLeadInformation.leadSource.sourceName
              : 'NA';
        },
        sortable: false
      },
      {
        name: 'assigned_to',
        required: true,
        label: 'Assigned To',
        align: 'left',
        field: row => (row.replacedBy == null ? 'NA' : row.replacedBy.name),
        sortable: false
      },
      {
        name: 'leadInformation',
        required: true,
        label: 'Device Type',
        align: 'left',
        field: row => {
          return row.leadInformation != null &&
            row.leadInformation.device != null &&
            row.leadInformation.device.deviceName != null
            ? row.leadInformation.device.deviceName
            : row.qrLeadInformation != null &&
              row.qrLeadInformation.device != null &&
              row.qrLeadInformation.device.deviceName != null
              ? row.qrLeadInformation.device.deviceName
              : 'NA';
        },
        sortable: false
      },
      {
        name: 'serial_number',
        required: true,
        label: 'Serial Number',
        align: 'left',
        field: row => (row.regionalInventory == null ? 'NA' : row.regionalInventory.serialNumber),
        sortable: true
      },
      {
        name: 'submitToMarsDate',
        required: true,
        label: 'Date of Submission',
        align: 'left',
        field: row => {
          return row.leadInformation == null || row.leadInformation.submitToMarsDate == null
            ? 'NA'
            : row.leadInformation.submitToMarsDate ||
              row.qrLeadInformation == null ||
              row.qrLeadInformation.submitMarsDate == null
              ? 'NA'
              : row.qrLeadInformation.submitMarsDate;
        },
        format: val => formatDate(val),
        sortable: true
      }
    ];

    const columnDataUnassigned = [
      {
        name: 'leadNumber',
        required: true,
        label: 'Lead Number',
        align: 'left',
        field: row => {
          return row.leadInformation != null && row.leadInformation.leadNumber != null
            ? row.leadInformation.leadNumber
            : row.qrLeadInformation != null && row.qrLeadInformation.qrLeadNumber != null
              ? row.qrLeadInformation.qrLeadNumber
              : 'NA';
        },
        sortable: false
      },
      {
        name: 'createdAt',
        required: true,
        label: 'Date of TID Generation',
        align: 'left',
        field: 'createdAt',
        sortable: true
      },
      {
        name: 'tid',
        required: true,
        label: 'TID',
        align: 'left',
        field: row => row.tid,
        sortable: true
      },
      {
        name: 'mid',
        required: true,
        label: 'MID',
        align: 'left',
        field: row => row.mid,
        sortable: true
      },
      {
        name: 'merchant_name',
        required: true,
        label: 'Merchant Name',
        align: 'left',
        field: row => {
          return row.leadInformation != null && row.leadInformation.leadName != null
            ? row.leadInformation.leadName
            : row.qrLeadInformation != null && row.qrLeadInformation.legalName != null
              ? row.qrLeadInformation.legalName
              : 'NA';
        },
        sortable: false
      },
      {
        name: 'mobile_number',
        required: true,
        label: 'Mobile Number',
        align: 'center',
        field: row => {
          return row.leadInformation != null && row.leadInformation.contactNumber != null
            ? row.leadInformation.contactNumber
            : row.qrLeadInformation != null && row.qrLeadInformation.contactNumber != null
              ? row.qrLeadInformation.contactNumber
              : 'NA';
        },
        sortable: false
      },
      {
        name: 'deviceAddress',
        required: true,
        label: 'Address',
        align: 'left',
        field: row => row.deviceAddress,
        sortable: false
      },
      {
        name: 'leadInformation',
        required: true,
        label: 'Device Type',
        align: 'left',
        field: row => {
          return row.leadInformation != null &&
            row.leadInformation.device != null &&
            row.leadInformation.device.deviceName != null
            ? row.leadInformation.device.deviceName
            : row.qrLeadInformation != null &&
              row.qrLeadInformation.device != null &&
              row.qrLeadInformation.device.deviceName != null
              ? row.qrLeadInformation.device.deviceName
              : 'NA';
        },
        sortable: false
      },
      {
        name: 'serial_number',
        required: true,
        label: 'Serial Number',
        align: 'left',
        field: row => (row.regionalInventory == null ? 'NA' : row.regionalInventory.serialNumber),
        sortable: true
      },
      {
        name: 'source',
        required: true,
        label: 'Source',
        align: 'left',
        field: row => {
          return row.leadInformation != null &&
            row.leadInformation.leadSource != null &&
            row.leadInformation.leadSource.sourceName != null
            ? row.leadInformation.leadSource.sourceName
            : row.qrLeadInformation != null &&
              row.qrLeadInformation.leadSource != null &&
              row.qrLeadInformation.leadSource.sourceName != null
              ? row.qrLeadInformation.leadSource.sourceName
              : 'NA';
        },
        sortable: false
      },
      {
        name: 'submitToMarsDate',
        required: true,
        label: 'Date of Submission',
        align: 'left',
        field: row => {
          return row.leadInformation == null || row.leadInformation.submitToMarsDate == null
            ? 'NA'
            : row.leadInformation.submitToMarsDate ||
              row.qrLeadInformation == null ||
              row.qrLeadInformation.submitMarsDate == null
              ? 'NA'
              : row.qrLeadInformation.submitMarsDate;
        },
        sortable: true
      }
    ];

    // Computed properties
    const selectedAssignedCount = computed(() => formData.value.marsDeviceIdsCookedUnAssinged.length);
    
    const isReAssignDropdownDisabled = computed(() => selectedAssignedCount.value !== 1);
    
    const isReAssignDisabled = computed(() => 
      selectedAssignedCount.value !== 1 || !formData.value.assignToReassign
    );
    
    const isUnAssignDisabled = computed(() => 
      !!formData.value.assignToReassign || selectedAssignedCount.value === 0
    );

    // Methods
    const formatDate = (dateString) => {
      if (!dateString || dateString === 'NA') return 'NA';
      try {
        const date = new Date(dateString);
        return format(date, 'do MMM y');
      } catch  {
        return dateString;
      }
    };

    const handleReAssignDropdownClick = () => {
      if (isReAssignDropdownDisabled.value) {
        let message = 'Select at least one device to re-assign';
        
        if (selectedAssignedCount.value > 1) {
          message = 'Multiple selection not allowed';
        }
        
        $q.notify({
          color: 'warning',
          position: 'bottom',
          message,
          icon: 'info'
        });
      }
    };

    const getPincodeInformations = () => {
      store.dispatch('SuperAdminUsers/FETCH_ALL_STATES_DATA');
    };

    const ajaxLoadAllLeadInfo1 = async ({ pagination, filter }) => {
      tableAjaxLoading1.value = true;
      $q.loading.show({
        delay: 0,
        spinnerColor: 'purple-9',
        message: 'Fetching data ..'
      });

      try {
        await store.dispatch('DeviceReplacement/DEVICE_REPLACEMENT_QUEUE_UNASSIGNED_LIST', { pagination, filter });
        
        // Load implementation executives
        await store.dispatch('ImplementationExecutive/IMPLEMENTATION_EXECUTIVE_LIST');
        const executiveList = store.getters['ImplementationExecutive/getImplementationExecutiveList'];
        
        assignToOptions.value = executiveList.map(value => ({
          label: `${value.name} | ${value.employeeID} | ${value.email}`,
          value: value.id
        }));

        const unassignedList = store.getters['DeviceReplacement/getDeviceReplacementQueueUnassignedList'];
        
        paginationControl1.value = {
          ...pagination,
          rowsNumber: unassignedList.totalElements || 0,
          page: unassignedList.number ? unassignedList.number + 1 : 1,
          sortBy: unassignedList.sort?.[0]?.property || 'createdAt',
          descending: !unassignedList.sort?.[0]?.ascending
        };

        tableData1.value = unassignedList.content || [];
      } catch (error) {

        console.error('Error loading unassigned data:', error);
      } finally {
        tableAjaxLoading1.value = false;
        $q.loading.hide();
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
        await store.dispatch('DeviceReplacement/DEVICE_REPLACEMENT_QUEUE_ASSIGNED_LIST', { pagination, filter });
        
        const assignedList = store.getters['DeviceReplacement/getDeviceReplacementQueueAssignedList'];
        
        paginationControl.value = {
          ...pagination,
          rowsNumber: assignedList.totalElements || 0,
          page: assignedList.number ? assignedList.number + 1 : 1,
          sortBy: assignedList.sort?.[0]?.property || 'createdAt',
          descending: !assignedList.sort?.[0]?.ascending
        };

        tableData.value = assignedList.content || [];
      } catch (error) {

        console.error('Error loading assigned data:', error);
      } finally {
        tableAjaxLoading.value = false;
        $q.loading.hide();
      }
    };

    const goToUnassignedTab = (tab) => {
      selectedTab.value = tab;
      if (tab === 'unAssigned') {
        ajaxLoadAllLeadInfo1({
          pagination: paginationControl1.value,
          filter: filterSearch1.value
        });
      } else {
        ajaxLoadAllLeadInfo({
          pagination: paginationControl.value,
          filter: filterSearch.value
        });
      }
    };

    const UpdateDeviceAddress = (currentDeviceInfo) => {
      const deviceInfo = { ...currentDeviceInfo };
      if (formData.value.marsDeviceIdsCooked.length === 0) {
        currentDeviceInfo.value = {
          id: [deviceInfo.id],
          marsDeviceAddress: {
            deviceAddress: deviceInfo.deviceAddress,
            latitude: 0,
            longitude: 0,
            pincode: deviceInfo.pincode,
            city: deviceInfo.city,
            state: deviceInfo.state
          }
        };
      } else {
        const marsDeviceIdsCooked = formData.value.marsDeviceIdsCooked.map(value => value.id);
        currentDeviceInfo.value = {
          id: marsDeviceIdsCooked,
          marsDeviceAddress: {
            deviceAddress: deviceInfo.deviceAddress,
            latitude: 0,
            longitude: 0,
            pincode: deviceInfo.pincode,
            city: deviceInfo.city,
            state: deviceInfo.state
          }
        };
      }
      showDeviceAddressModal.value = !showDeviceAddressModal.value;
    };

    const UpdateDeviceAddressAfterEmit = (pagination) => {
      showDeviceAddressModal.value = !showDeviceAddressModal.value;
      paginationControl.value = pagination;
    };

    const assignImplementationUser = async () => {
      if (formData.value.marsDeviceIdsCooked.length === 0) {
        $q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'Select at least one item to assign',
          icon: 'thumb_down'
        });
        return;
      }

      if (!formData.value.assignTo) {
        $q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'Implementation officer cannot be empty!',
          icon: 'thumb_down'
        });
        return;
      }

      const marsDeviceIdsCooked = formData.value.marsDeviceIdsCooked.map(value => value.id);
      const postValues = {
        marsDeviceIds: marsDeviceIdsCooked,
        userId: formData.value.assignTo
      };

      try {
        await store.dispatch('DeviceReplacement/DEVICE_REPLACEMENT_QUEUE_SUBMIT', postValues);
        
        await ajaxLoadAllLeadInfo({
          pagination: paginationControl.value,
          filter: filterSearch.value
        });
        await ajaxLoadAllLeadInfo1({
          pagination: paginationControl1.value,
          filter: filterSearch1.value
        });
        
        formData.value.marsDeviceIdsCooked = [];
        formData.value.assignTo = '';
        
        $q.notify({
          color: 'positive',
          position: 'bottom',
          message: 'Successfully assigned!',
          icon: 'thumb_up'
        });
      } catch {

        $q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'Please try again',
          icon: 'thumb_down'
        });
      }
    };

    const unAssignImplementationUser = async () => {
      if (unAssignLoading.value) return;
      
      unAssignLoading.value = true;

      const marsDeviceIds = formData.value.marsDeviceIdsCookedUnAssinged.map(v => v.id);
      const postValues = {
        marsDeviceIds,
        userId: formData.value.assignToReassign
      };

      try {
        await store.dispatch('DeviceReplacement/DEVICE_REPLACEMENT_QUEUE_UNASSIGN', postValues);
        
        goToUnassignedTab('assigned');
        
        formData.value.marsDeviceIdsCookedUnAssinged = [];
        formData.value.assignToReassign = '';
        
        $q.notify({
          color: 'positive',
          position: 'bottom',
          message: 'Successfully Unassigned!',
          icon: 'thumb_up'
        });
      } catch  {

        $q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'Please try again',
          icon: 'thumb_down'
        });
      } finally {
        unAssignLoading.value = false;
      }
    };

    const reAssignImplementationUser = async () => {
      if (reAssignLoading.value) return;
      
      reAssignLoading.value = true;

      const marsDeviceIds = formData.value.marsDeviceIdsCookedUnAssinged.map(v => v.id);
      const postValues = {
        marsDeviceIds,
        userId: formData.value.assignToReassign
      };

      try {
        await store.dispatch('DeviceReplacement/DEVICE_REPLACEMENT_QUEUE_REASSIGN', postValues);
        
        await ajaxLoadAllLeadInfo({
          pagination: paginationControl.value,
          filter: filterSearch.value
        });
        await ajaxLoadAllLeadInfo1({
          pagination: paginationControl1.value,
          filter: filterSearch1.value
        });
        
        formData.value.marsDeviceIdsCookedUnAssinged = [];
        formData.value.assignToReassign = '';
        
        $q.notify({
          color: 'positive',
          position: 'bottom',
          message: 'Successfully re-assigned!',
          icon: 'thumb_up'
        });
      } catch {

        $q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'Please try again',
          icon: 'thumb_down'
        });
      } finally {
        reAssignLoading.value = false;
      }
    };

    const toggleLeadInformation = (leadDetails) => {
      propToggleLeadInformation.value = !propToggleLeadInformation.value;
      if (leadDetails !== undefined) {
        addtnLeadInformation.value = leadDetails;
      }
    };

    // Watchers
    watch(
      () => formData.value.marsDeviceIdsCookedUnAssinged,
      () => {
        if (selectedAssignedCount.value !== 1) {
          formData.value.assignToReassign = '';
        }
      }
    );

    // Lifecycle hooks
    onMounted(() => {
      ajaxLoadAllLeadInfo({
        pagination: paginationControl.value,
        filter: filterSearch.value
      });
      ajaxLoadAllLeadInfo1({
        pagination: paginationControl1.value,
        filter: filterSearch1.value
      });
      getPincodeInformations();
    });

    return {
      // Refs
      propToggleLeadInformation,
      addtnLeadInformation,
      filterSearch,
      filterSearch1,
      selectedTab,
      assignToOptions,
      tableData,
      tableData1,
      reAssignLoading,
      unAssignLoading,
      currentDeviceInfo,
      showDeviceAddressModal,
      tableAjaxLoading,
      tableAjaxLoading1,
      formData,
      paginationControl,
      paginationControl1,
      
      // Columns
      columnDataAssigned,
      columnDataUnassigned,
      
      // Computed
      selectedAssignedCount,
      isReAssignDropdownDisabled,
      isReAssignDisabled,
      isUnAssignDisabled,
      
      // Methods
      formatDate,
      handleReAssignDropdownClick,
      getPincodeInformations,
      ajaxLoadAllLeadInfo1,
      ajaxLoadAllLeadInfo,
      goToUnassignedTab,
      UpdateDeviceAddress,
      UpdateDeviceAddressAfterEmit,
      assignImplementationUser,
      unAssignImplementationUser,
      reAssignImplementationUser,
      toggleLeadInformation
    };
  }
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

.q-display-2 {
  font-size: 2rem;
  line-height: 2rem;
  font-weight: 500;
}
</style>