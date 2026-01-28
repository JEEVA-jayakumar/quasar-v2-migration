<template>
  <q-page>
    <!-- content -->
    <div>
      <div
        class="
          q-title q-px-lg q-py-md
          text-weight-regular
          bottom-border
          text-grey-9
        "
      >
        Bijlipay Device Recovery Tracker
      </div>
      <!--END: table title -->
      <!--START: table Footer -->
      <q-card class="group q-pa-md" v-if="selectedTab == 'unAssigned'">
        <div class="row items-center q-col-gutter-y-sm">
          <div
            class="col-md-3 col-sm-6 col-xs-6 text-grey-7 text-weight-medium"
            align="left"
          >
            <span class="text-h2">{{
              formData.marsDeviceIdsCooked.length
            }}</span
            >/ selected
          </div>
          <div class="col-md-3 col-sm-6 col-xs-6">
            <q-select
              filter
              clearable
              v-model="formData.assignTo"
              separator
              color="grey-9"
              :options="assignToOptions"
              placeholder="Assign To"
            />
          </div>
          <div class="col-md-3 col-sm-6 col-xs-6" align="right">
            <q-btn
              no-caps
              :disabled="
                formData.marsDeviceIdsCooked.length == 0 ? true : false
              "
              label="Assign"
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
      <!--END: table Footer -->
      <q-tabs
        v-model="selectedTab"
        class="shadow-1"
        color="grey-1"
        @update:model-value="goToUnassignedTab"
      >
        <q-tab name="unAssigned" label="Unassigned" />
        <q-tab name="assigned" label="Assigned" />
        
        <q-tab-panels v-model="selectedTab" animated>
          <q-tab-panel name="assigned">
            <!--START: table Data -->
            <q-table
              :rows="tableData"
              :columns="columnDataAssigned"
              table-class="customTableClass"
              :filter="filterSearch"
              v-model:pagination="paginationControl"
              v-model:selected="formData.marsDeviceIdsCookedUnAssinged"
              row-key="id"
              :loading="tableAjaxLoading"
              :rows-per-page-options="[5,10,15,20]"
              color="dark"
              @request="ajaxLoadAllLeadInfo"
            >
              <template #body-cell-leadNumber="props">
                <q-td
                  :props="props"
                  class="cursor-pointer"
                  @click="toggleLeadInformation(props.row.leadInformation)"
                >
                  <span class="label text-primary"
                    ># {{ getLeadNumber(props.row) }}</span
                  >
                </q-td>
              </template>

              <template #body-cell-submitToMarsDate="props">
                <q-td :props="props">
                  {{ formatSubmitDate(props.row) }}
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

              <template #top>
                <!--START: table filter,search -->
                <div class="col-md-5">
                  <q-input
                    clearable
                    color="grey-9"
                    v-model="filterSearch"
                    placeholder="Type.."
                    label="Search By TID, MID, Merchant Name .."
                    class="q-mr-lg q-py-sm"
                  />
                </div>
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
              :rows-per-page-options="[5,10,15,20]"
              color="dark"
              @request="ajaxLoadAllLeadInfo1"
            >
              <template #body-cell-leadNumber="props">
                <q-td
                  :props="props"
                  class="cursor-pointer"
                  @click="toggleLeadInformation(props.row.leadInformation)"
                >
                  <span class="label text-primary"
                    ># {{ getLeadNumber(props.row) }}</span
                  >
                </q-td>
              </template>

              <template #body-cell-submitToMarsDate="props">
                <q-td :props="props">
                  {{ formatSubmitDate(props.row) }}
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

              <template #top>
                <!--START: table filter,search -->
                <div class="col-md-5">
                  <q-input
                    clearable
                    color="grey-9"
                    v-model="filterSearch1"
                    placeholder="Type.."
                    label="Search By TID, MID, Merchant Name .."
                    class="q-mr-lg q-py-sm"
                  />
                </div>
              </template>
            </q-table>
            <!--END: table Data -->
          </q-tab-panel>
        </q-tab-panels>
      </q-tabs>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import moment from 'moment';

export default defineComponent({
  name: "implementationQueue",
  
  setup() {
    const store = useStore();
    const $q = useQuasar();
    
    const propToggleLeadInformation = ref(false);
    const addtnLeadInformation = ref(null);
    
    const filterSearch = ref("");
    const filterSearch1 = ref("");
    const selectedTab = ref("assigned");
    const assignTo = ref("");
    const assignToOptions = ref([]);
    const tableData = ref([]);
    const tableData1 = ref([]);
    
    const currentDeviceInfo = ref({});
    const showDeviceAddressModal = ref(false);
    
    const formData = ref({
      marsDeviceIdsCooked: [],
      marsDeviceIdsCookedUnAssinged: [],
      triggerWelcomeMail: false,
      assignTo: "",
    });
    
    const paginationControl = ref({
      sortBy: "createdAt",
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0
    });
    
    const paginationControl1 = ref({
      sortBy: "createdAt",
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0
    });
    
    const tableAjaxLoading = ref(false);
    const tableAjaxLoading1 = ref(false);
    
    // Column definitions
    const columnDataAssigned = ref([
      {
        name: "leadNumber",
        required: true,
        label: "Lead Number",
        align: "left",
        field: (row) => getLeadNumber(row),
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
        field: (row) => getMerchantName(row),
        sortable: false,
      },
      {
        name: "mobile_number",
        required: true,
        label: "Mobile Number",
        align: "center",
        field: (row) => getContactNumber(row),
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
        field: (row) => getSourceName(row),
        sortable: false,
      },
      {
        name: "assigned_to",
        required: true,
        label: "Assigned To",
        align: "left",
        field: (row) => getAssignedTo(row),
        sortable: false,
      },
      {
        name: "leadInformation",
        required: true,
        label: "Device Type",
        align: "left",
        field: (row) => getDeviceName(row),
        sortable: false,
      },
      {
        name: "serial_number",
        required: true,
        label: "Serial Number",
        align: "left",
        field: (row) => row.regionalInventory?.serialNumber || "NA",
        sortable: true,
      },
      {
        name: "submitToMarsDate",
        required: true,
        label: "Date of Submission",
        align: "left",
        field: (row) => getSubmitDate(row),
        format: (val) => formatDate(val),
        sortable: true,
      },
    ]);
    
    const columnDataUnassigned = ref([
      {
        name: "leadNumber",
        required: true,
        label: "Lead Number",
        align: "left",
        field: (row) => getLeadNumber(row),
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
        field: (row) => getMerchantName(row),
        sortable: false,
      },
      {
        name: "mobile_number",
        required: true,
        label: "Mobile Number",
        align: "center",
        field: (row) => getContactNumber(row),
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
        name: "leadInformation",
        required: true,
        label: "Device Type",
        align: "left",
        field: (row) => getDeviceName(row),
        sortable: false,
      },
      {
        name: "serial_number",
        required: true,
        label: "Serial Number",
        align: "left",
        field: (row) => row.regionalInventory?.serialNumber || "NA",
        sortable: true,
      },
      {
        name: "source",
        required: true,
        label: "Source",
        align: "left",
        field: (row) => getSourceName(row),
        sortable: false,
      },
      {
        name: "submitToMarsDate",
        required: true,
        label: "Date of Submission",
        align: "left",
        field: (row) => getSubmitDate(row),
        format: (val) => formatDate(val),
        sortable: true,
      },
    ]);
    
    // Computed properties
    const getDeviceRecoveryAssignedList = computed(() => 
      store.getters['DeviceRecovery/getDeviceRecoveryAssignedList']
    );
    
    const getDeviceRecoveryUnassignedList = computed(() => 
      store.getters['DeviceRecovery/getDeviceRecoveryUnassignedList']
    );
    
    const getImplementationExecutiveList = computed(() => 
      store.getters['ImplementationExecutive/getImplementationExecutiveList']
    );
    
    // Helper functions
    const getLeadNumber = (row) => {
      if (row.leadInformation?.leadNumber) return row.leadInformation.leadNumber;
      if (row.qrLeadInformation?.qrLeadNumber) return row.qrLeadInformation.qrLeadNumber;
      return "NA";
    };
    
    const getMerchantName = (row) => {
      if (row.leadInformation?.leadName) return row.leadInformation.leadName;
      if (row.qrLeadInformation?.merchantName) return row.qrLeadInformation.merchantName;
      return "NA";
    };
    
    const getContactNumber = (row) => {
      if (row.leadInformation?.contactNumber) return row.leadInformation.contactNumber;
      if (row.qrLeadInformation?.contactNumber) return row.qrLeadInformation.contactNumber;
      return "NA";
    };
    
    const getSourceName = (row) => {
      if (row.leadInformation?.leadSource?.sourceName) return row.leadInformation.leadSource.sourceName;
      if (row.qrLeadInformation?.leadSource?.sourceName) return row.qrLeadInformation.leadSource.sourceName;
      return "NA";
    };
    
    const getDeviceName = (row) => {
      if (row.leadInformation?.device?.deviceName) return row.leadInformation.device.deviceName;
      if (row.qrLeadInformation?.device?.deviceName) return row.qrLeadInformation.device.deviceName;
      return "NA";
    };
    
    const getAssignedTo = (row) => {
      return row.recoveredBy ? `${row.recoveredBy.name} | ${row.recoveredBy.employeeID}` : "NA";
    };
    
    const getSubmitDate = (row) => {
      if (row.leadInformation?.submitToMarsDate) return row.leadInformation.submitToMarsDate;
      if (row.qrLeadInformation?.submitMarsDate) return row.qrLeadInformation.submitMarsDate;
      return null;
    };
    
    const formatDate = (dateString) => {
      if (!dateString || dateString === "NA") return "NA";
      return moment(dateString).format("Do MMM Y");
    };
    
    const formatSubmitDate = (row) => {
      const date = getSubmitDate(row);
      return formatDate(date);
    };
    
    // Methods
    const getPincodeInformations = async () => {
      await store.dispatch('SuperAdminUsers/FETCH_ALL_STATES_DATA');
    };
    
    const ajaxLoadAllLeadInfo1 = async (props) => {
      const { pagination, filter } = props;
      
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data ..",
      });
      
      try {
        await store.dispatch('DeviceRecovery/DEVICE_RECOVERY_UNASSIGNED_LIST', { pagination, filter });
        
        // Update pagination from response
        const responseData = getDeviceRecoveryUnassignedList.value;
        paginationControl1.value = {
          ...paginationControl1.value,
          rowsNumber: responseData.totalElements || 0,
          page: responseData.number !== undefined ? responseData.number + 1 : 1
        };
        
        tableData1.value = responseData.content || [];
        
        if (responseData.sort && responseData.sort.length > 0) {
          paginationControl1.value.sortBy = responseData.sort[0].property;
          paginationControl1.value.descending = !responseData.sort[0].ascending;
        }
        
        // Load implementation executives
        await store.dispatch('ImplementationExecutive/IMPLEMENTATION_EXECUTIVE_LIST');
        assignToOptions.value = getImplementationExecutiveList.value.map(value => ({
          label: `${value.name} | ${value.employeeID} | ${value.email}`,
          value: value.id
        }));
        
      } catch (error) {

        console.error('Error loading unassigned data:', error);
      } finally {
        $q.loading.hide();
      }
    };
    
    const ajaxLoadAllLeadInfo = async (props) => {
      const { pagination, filter } = props;
      
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data ..",
      });
      
      try {
        await store.dispatch('DeviceRecovery/DEVICE_RECOVERY_ASSIGNED_LIST', { pagination, filter });
        
        // Update pagination from response
        const responseData = getDeviceRecoveryAssignedList.value;
        paginationControl.value = {
          ...paginationControl.value,
          rowsNumber: responseData.totalElements || 0,
          page: responseData.number !== undefined ? responseData.number + 1 : 1
        };
        
        tableData.value = responseData.content || [];
        
        if (responseData.sort && responseData.sort.length > 0) {
          paginationControl.value.sortBy = responseData.sort[0].property;
          paginationControl.value.descending = !responseData.sort[0].ascending;
        }
        
      } catch (error) {

        console.error('Error loading assigned data:', error);
      } finally {
        $q.loading.hide();
      }
    };
    
    const goToUnassignedTab = (tab) => {
      if (tab === "unAssigned") {
        ajaxLoadAllLeadInfo1({
          pagination: paginationControl1.value,
          filter: filterSearch1.value,
        });
      } else {
        ajaxLoadAllLeadInfo({
          pagination: paginationControl.value,
          filter: filterSearch.value,
        });
      }
    };
    
    const UpdateDeviceAddress = (currentDeviceInfo) => {
      currentDeviceInfo.value = [];
      showDeviceAddressModal.value = !showDeviceAddressModal.value;
      
      let marsDeviceIdsCooked = [];
      if (formData.value.marsDeviceIdsCooked.length === 0) {
        marsDeviceIdsCooked = [currentDeviceInfo.id];
      } else {
        marsDeviceIdsCooked = formData.value.marsDeviceIdsCooked.map(value => value.id);
      }
      
      currentDeviceInfo.value = {
        id: marsDeviceIdsCooked,
        marsDeviceAddress: {
          deviceAddress: currentDeviceInfo.deviceAddress,
          latitude: 0,
          longitude: 0,
          pincode: currentDeviceInfo.pincode,
          city: currentDeviceInfo.city,
          state: currentDeviceInfo.state,
        },
      };
    };
    
    const UpdateDeviceAddressAfterEmit = (pagination) => {
      showDeviceAddressModal.value = !showDeviceAddressModal.value;
      paginationControl.value = pagination;
    };
    
    const assignImplementationUser = async () => {
      if (formData.value.marsDeviceIdsCooked.length === 0) {
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Select atleast one item to assign",
          icon: "thumb_down",
        });
        return;
      }
      
      if (!formData.value.assignTo) {
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Implementation officer cannot be empty!",
          icon: "thumb_down",
        });
        return;
      }
      
      const marsDeviceIdsCooked = formData.value.marsDeviceIdsCooked.map(value => value.id);
      
      const postValues = {
        marsDeviceIds: marsDeviceIdsCooked,
        userId: formData.value.assignTo,
      };
      
      try {
        await store.dispatch('DeviceRecovery/DEVICE_RECOVERY_SUBMIT', postValues);
        
        // Refresh both tables
        await Promise.all([
          ajaxLoadAllLeadInfo({
            pagination: paginationControl.value,
            filter: filterSearch.value,
          }),
          ajaxLoadAllLeadInfo1({
            pagination: paginationControl1.value,
            filter: filterSearch1.value,
          })
        ]);
        
        formData.value.marsDeviceIdsCooked = [];
        formData.value.assignTo = "";
        
        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Successfully assigned!",
          icon: "thumb_up",
        });
        
      } catch  {

        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Please try again",
          icon: "thumb_down",
        });
      }
    };
    
    const unAssignImplementationUser = async () => {
      if (formData.value.marsDeviceIdsCookedUnAssinged.length === 0) {
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Select atleast one item to Unassign",
          icon: "thumb_down",
        });
        return;
      }
      
      const marsDeviceIdsCookedUnAssinged = formData.value.marsDeviceIdsCookedUnAssinged.map(value => value.id);
      
      const postValues = {
        action: 0, // Replace with actual constant if needed
        marsDeviceIds: marsDeviceIdsCookedUnAssinged,
        userId: 0, // SEND_ZERO_FOR_UNASSIGING
      };
      
      try {
        await store.dispatch('DeviceRecovery/DEVICE_RECOVERY_SUBMIT', postValues);
        
        await ajaxLoadAllLeadInfo({
          pagination: paginationControl.value,
          filter: filterSearch.value,
        });
        
        formData.value.marsDeviceIdsCookedUnAssinged = [];
        formData.value.assignTo = "";
        
        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Successfully Unassigned!",
          icon: "thumb_up",
        });
        
      } catch  {

        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Please try again",
          icon: "thumb_down",
        });
      }
    };
    
    const reAssignImplementationUser = async () => {
      if (formData.value.marsDeviceIdsCookedUnAssinged.length === 0) {
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Select atleast one item to assign",
          icon: "thumb_down",
        });
        return;
      }
      
      if (!formData.value.assignTo) {
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Implementation officer cannot be empty!",
          icon: "thumb_down",
        });
        return;
      }
      
      const marsDeviceIdsCookedUnAssinged = formData.value.marsDeviceIdsCookedUnAssinged.map(value => value.id);
      
      const postValues = {
        action: 0, // Replace with actual constant if needed
        marsDeviceIds: marsDeviceIdsCookedUnAssinged,
        triggerWelcomeMail: formData.value.triggerWelcomeMail,
        userId: formData.value.assignTo,
      };
      
      try {
        await store.dispatch('DeviceRecovery/DEVICE_RECOVERY_SUBMIT', postValues);
        
        await ajaxLoadAllLeadInfo({
          pagination: paginationControl.value,
          filter: filterSearch.value,
        });
        
        formData.value.marsDeviceIdsCookedUnAssinged = [];
        formData.value.assignTo = "";
        
        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Successfully re assigned !",
          icon: "thumb_up",
        });
        
      } catch {

        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Please try again",
          icon: "thumb_down",
        });
      }
    };
    
    const toggleLeadInformation = (leadDetails) => {
      propToggleLeadInformation.value = !propToggleLeadInformation.value;
      if (leadDetails) {
        addtnLeadInformation.value = leadDetails;
      }
    };
    
    // Lifecycle hooks
    onMounted(() => {
      getPincodeInformations();
      // Load initial data
      goToUnassignedTab(selectedTab.value);
    });
    
    // Watch for tab changes
    watch(selectedTab, (newTab) => {
      goToUnassignedTab(newTab);
    });
    
    return {
      // State
      propToggleLeadInformation,
      addtnLeadInformation,
      filterSearch,
      filterSearch1,
      selectedTab,
      assignTo,
      assignToOptions,
      tableData,
      tableData1,
      currentDeviceInfo,
      showDeviceAddressModal,
      formData,
      paginationControl,
      paginationControl1,
      tableAjaxLoading,
      tableAjaxLoading1,
      
      // Columns
      columnDataAssigned,
      columnDataUnassigned,
      
      // Methods
      goToUnassignedTab,
      UpdateDeviceAddress,
      UpdateDeviceAddressAfterEmit,
      assignImplementationUser,
      unAssignImplementationUser,
      reAssignImplementationUser,
      toggleLeadInformation,
      
      // Helper functions for template
      getLeadNumber,
      formatSubmitDate,
      formatDate
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
</style>