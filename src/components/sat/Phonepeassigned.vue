<template>
  <q-page class="q-pa-md">
    <!-- Lead Information Modal -->
    <generalLeadInformation
      v-if="propToggleLeadInformation"
      :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation"
      @closeLeadInformation="toggleLeadInformation"
    />

    <!-- Table Footer for Assigned -->
    <q-card v-if="selectedTab === 'assigned'" class="group q-pa-md">
      <div class="row items-center gutter-y-sm">
        <div
          class="col-md-3 col-sm-12 col-xs-12 text-grey-7 text-weight-medium q-px-md"
        >
          <span class="q-display-2">{{ formData.marsDeviceIdsCookedUnAssinged.length }}</span>/
          selected
        </div>
        <div class="col-md-9 col-sm-12 col-xs-12">
          <div class="row items-center">
            <div class="col-md-4 col-sm-6 col-xs-6">
              <q-select
                v-model="formData.assignTo"
                :options="assignToOptions"
                placeholder="Assign To"
                color="grey-9"
                filter
                clearable
                :disable="formData.marsDeviceIdsCookedUnAssinged.length === 0"
              />
            </div>
            <div class="col-md-4 col-sm-6 col-xs-6">
              <q-checkbox
                v-model="formData.triggerWelcomeMail"
                color="dark"
                label="Trigger welcome email"
              />
            </div>
            <div class="col-md-4 col-sm-6 col-xs-6 group">
              <q-btn
                no-caps
                label="Re-Assign"
                class="common-dark-blue q-mb-sm"
                :disabled="formData.marsDeviceIdsCookedUnAssinged.length === 0 || !formData.assignTo"
                @click="reAssignImplementationUser"
              />
              <q-btn
                no-caps
                label="Un-Assign"
                class="common-dark-blue"
                :disabled="formData.marsDeviceIdsCookedUnAssinged.length === 0"
                @click="unAssignImplementationUser"
              />
            </div>
          </div>
        </div>
      </div>
    </q-card>

    <!-- Tabs -->
    <q-tabs v-model="selectedTab" class="shadow-1" color="grey-1" @update:model-value="goToTab">
      <q-tab name="assigned" label="Normal" color="dark" />
      <q-tab name="courier" label="Courier" color="dark" />
    </q-tabs>

    <!-- Assigned Tab Table -->
    <q-tab-panels v-model="selectedTab" animated>
      <q-tab-panel name="assigned">
        <q-table
          :rows="tableData"
          :columns="columnDataAssigned"
          row-key="id"
          :filter="filterSearch"
          v-model:pagination="paginationControl"
          selection="multiple"
          v-model:selected="formData.marsDeviceIdsCookedUnAssinged"
          table-class="customTableClass"
          :rows-per-page-options="[10, 20, 50, 100, 150, 200]"
          color="dark"
          :loading="tableAjaxLoading"
          @request="ajaxLoadAllLeadInfo"
        >
          <template v-slot:top>
            <q-search
              v-model="filterSearch"
              clearable
              placeholder="Type.."
              float-label="Search By MID, Merchant Name.."
              color="grey-9"
              class="q-mr-lg q-py-sm"
            />
          </template>
          <template v-slot:body-cell-leadNumber="props">
            <span
              class="label text-primary cursor-pointer"
              @click="toggleLeadInformation(props.row.leadInformation)"
              ># {{ props.row.leadInformation.leadNumber }}</span
            >
          </template>
          <template v-slot:body-cell-submitToMarsDate="props">
            {{ formatDate(props.row.leadInformation.submitToMarsDate) }}
          </template>
          <template v-slot:body-cell-createdAt="props">
            {{ formatDate(props.row.createdAt) }}
          </template>
          <template v-slot:body-cell-deviceAddress="props">
            <div class="customTd customCellLength">{{ props.row.deviceAddress }}</div>
          </template>
          <template v-slot:body-cell-mid="props">
            <div class="text-primary">{{ props.row.mid }}</div>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- Courier Tab Table -->
      <q-tab-panel name="courier">
        <q-table
          :rows="tableData1"
          :columns="columnDataUnassigned"
          row-key="id"
          :filter="filterSearch1"
          v-model:pagination="paginationControl1"
          :rows-per-page-options="[10, 20, 50, 100, 150, 200]"
          color="dark"
          :loading="tableAjaxLoading1"
          @request="ajaxLoadAllLeadInfo1"
        >
          <template v-slot:top>
            <q-search
              v-model="filterSearch1"
              clearable
              placeholder="Type.."
              float-label="Search By MID, Merchant Name.."
              color="grey-9"
              class="q-mr-lg q-py-sm"
            />
          </template>
          <template v-slot:body-cell-leadNumber="props">
            <span
              class="label text-primary cursor-pointer"
              @click="toggleLeadInformation(props.row.leadInformation)"
              ># {{ props.row.leadInformation ? props.row.leadInformation.leadNumber : 'NA' }}</span
            >
          </template>
          <template v-slot:body-cell-createdAt="props">
            {{ formatDate(props.row.createdAt) }}
          </template>
          <template v-slot:body-cell-mid="props">
            <div class="text-primary">{{ props.row.mid ?? 'NA' }}</div>
          </template>
          <template v-slot:body-cell-deviceAddress="props">
            <div class="customTd customCellLength">
              <q-btn
                no-caps
                icon="edit"
                color="purple-9"
                size="xs"
                round
                @click="updateDeviceAddress(props.row)"
              />
              {{ props.row.deviceAddress ?? 'NA' }}
            </div>
          </template>
        </q-table>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Update Device Address Modal -->
    <DeviceAddressModal
      v-if="showDeviceAddressModal"
      :showDeviceAddressModal="showDeviceAddressModal"
      v-model:currentDeviceInfo="currentDeviceInfo"
      :stateInformation="getAllStatesData"
      :paginationControl="paginationControl"
      :selectedLeadItems="formData.marsDeviceIdsCooked"
      @toggleModal="updateDeviceAddressAfterEmit"
    />
  </q-page>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import DeviceAddressModal from "../../components/sat/DeviceAddressModal.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";

export default {
  name: "implementationQueue",
  components: {
    DeviceAddressModal,
    generalLeadInformation
  },
  setup() {
    const store = useStore();

    // Reactive State
    const propToggleLeadInformation = ref(false);
    const addtnLeadInformation = ref(null);
    const selectedTab = ref("assigned");
    const filterSearch = ref("");
    const filterSearch1 = ref("");
    const assignToOptions = ref([]);
    const tableData = ref([]);
    const tableData1 = ref([]);
    const showDeviceAddressModal = ref(false);
    const currentDeviceInfo = ref({});
    const tableAjaxLoading = ref(false);
    const tableAjaxLoading1 = ref(false);

    const formData = reactive({
      marsDeviceIdsCooked: [],
      marsDeviceIdsCookedUnAssinged: [],
      triggerWelcomeMail: false,
      courierDevice: false,
      assignTo: ""
    });

    const paginationControl = reactive({
      sortBy: "deviceStatusDate",
      descending: false,
      page: 1,
      rowsPerPage: 10
    });

    const paginationControl1 = reactive({
      sortBy: "deviceStatusDate",
      descending: false,
      page: 1,
      rowsPerPage: 10
    });

    // Column Definitions
    const columnDataAssigned = ref([
      { name: "leadNumber", label: "Lead Number", align: "left", field: row => row.leadInformation.leadNumber },
      { name: "createdAt", label: "Date of TID Generation", align: "left", field: "createdAt", sortable: true },
      { name: "mid", label: "MID", align: "left", field: row => row.mid, sortable: true },
      { name: "merchant_name", label: "Merchant Name", align: "left", field: row => row.leadInformation.leadName },
      { name: "mobile_number", label: "Mobile Number", align: "center", field: row => row.leadInformation.contactNumber },
      { name: "deviceAddress", label: "Address", align: "left", field: row => row.deviceAddress },
      { name: "assigned_to", label: "Assigned To", align: "left", field: row => row.assignedTo ? row.assignedTo.name + " | " + row.assignedTo.employeeID : "NA" },
      { name: "leadInformation", label: "Device Type", align: "left", field: row => row.leadInformation.aggregatorDevice ? row.leadInformation.aggregatorDevice.deviceName : "NA" },
      { name: "serial_number", label: "Serial Number", align: "left", field: row => row.aggregatorRegionalInventory ? row.aggregatorRegionalInventory.serialNumber : "NA", sortable: true },
      { name: "submitToMarsDate", label: "Date of Submission", align: "left", field: row => row.leadInformation.submitToMarsDate, sortable: true },
      { name: "lead_source", label: "Lead Source", align: "left", field: row => row.leadInformation.leadSource ? row.leadInformation.leadSource.sourceName : "NA" }
    ]);

    const columnDataUnassigned = ref([
      { name: "leadNumber", label: "Lead Number", align: "left", field: row => row.leadInformation ? row.leadInformation.leadNumber : "NA" },
      { name: "createdAt", label: "Date of TID Generation", align: "left", field: row => row.createdAt ?? "NA", sortable: true },
      { name: "mid", label: "MID", align: "left", field: row => row.mid ?? "NA", sortable: true },
      { name: "merchant_name", label: "Merchant Name", align: "left", field: row => row.leadInformation ? row.leadInformation.leadName : "NA" },
      { name: "mobile_number", label: "Mobile Number", align: "center", field: row => row.leadInformation ? row.leadInformation.contactNumber : "NA" },
      { name: "deviceAddress", label: "Address", align: "left", field: row => row.deviceAddress ?? "NA" },
      { name: "leadInformation", label: "Device Type", align: "left", field: row => row.leadInformation.aggregatorDevice ? row.leadInformation.aggregatorDevice.deviceName : "NA" },
      { name: "serial_number", label: "Serial Number", align: "left", field: row => row.aggregatorRegionalInventory ? row.aggregatorRegionalInventory.serialNumber : "NA", sortable: true },
      { name: "lead_source", label: "Lead Source", align: "left", field: row => row.leadInformation.leadSource ? row.leadInformation.leadSource.sourceName : "NA" }
    ]);

    // Methods
    const formatDate = (val) => {
      if (!val) return "NA";
      const d = new Date(val);
      return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    };

    const toggleLeadInformation = (leadDetails) => {
      propToggleLeadInformation.value = !propToggleLeadInformation.value;
      if (leadDetails) addtnLeadInformation.value = leadDetails;
    };

    const goToTab = (tab) => {
      if (tab === "courier") ajaxLoadAllLeadInfo1({ pagination: paginationControl1, filter: filterSearch1.value });
      else ajaxLoadAllLeadInfo({ pagination: paginationControl, filter: filterSearch.value });
    };

    const updateDeviceAddress = (row) => {
      currentDeviceInfo.value = { ...row };
      showDeviceAddressModal.value = true;
    };

    const updateDeviceAddressAfterEmit = (pagination) => {
      showDeviceAddressModal.value = false;
      Object.assign(paginationControl, pagination);
    };

    const assignImplementationUser = () => {
      if (formData.marsDeviceIdsCooked.length === 0) {
        return store.$q.notify({ color: "negative", message: "Select atleast one item to assign", position: "bottom", icon: "thumb_down" });
      }
      if (!formData.assignTo) {
        return store.$q.notify({ color: "negative", message: "Implementation officer cannot be empty!", position: "bottom", icon: "thumb_down" });
      }
      const marsDeviceIds = formData.marsDeviceIdsCooked.map(v => v.id);
      const postValues = {
        action: store.$MARS_DEVICE_STATUS_SAT_ASSIGNED,
        marsDeviceIds,
        triggerWelcomeMail: formData.triggerWelcomeMail,
        userId: formData.assignTo
      };
      store.PHONEPE_IMPLEMENTATION_QUEUE_SUBMIT(postValues)
        .then(() => {
          formData.marsDeviceIdsCooked = [];
          formData.assignTo = "";
          store.$q.notify({ color: "positive", message: "Successfully assigned!", position: "bottom", icon: "thumb_up" });
          ajaxLoadAllLeadInfo1({ pagination: paginationControl, filter: filterSearch.value });
        })
        .catch(() => {
          store.$q.notify({ color: "negative", message: "Please try again", position: "bottom", icon: "thumb_down" });
        });
    };

    // TODO: Implement unAssignImplementationUser and reAssignImplementationUser similarly (same as original logic)

    const ajaxLoadAllLeadInfo = ({ pagination, filter }) => {
      store.$q.loading.show({ message: "Fetching data.." });
      store.PHONEPE_IMPLEMENTATION_QUEUE_ASSIGNED_LIST({ pagination, filter })
        .then(() => {
          tableData.value = store.getPhonepeImplementationQueueassignedList.content;
          paginationControl.rowsNumber = store.getPhonepeImplementationQueueassignedList.totalElements;
          store.$q.loading.hide();
        })
        .catch(() => store.$q.loading.hide());
    };

    const ajaxLoadAllLeadInfo1 = ({ pagination, filter }) => {
      store.$q.loading.show({ message: "Fetching data.." });
      store.PHONEPE_IMPLEMENTATION_QUEUE_COURIER_LIST({ pagination, filter })
        .then(() => {
          tableData1.value = store.getPhonepeImplementationQueueCourierList.content;
          paginationControl1.rowsNumber = store.getPhonepeImplementationQueueCourierList.totalElements;
          store.$q.loading.hide();
        })
        .catch(() => store.$q.loading.hide());
    };

    onMounted(() => {
      ajaxLoadAllLeadInfo({ pagination: paginationControl, filter: filterSearch.value });
      ajaxLoadAllLeadInfo1({ pagination: paginationControl1, filter: filterSearch1.value });
    });

    return {
      propToggleLeadInformation,
      addtnLeadInformation,
      selectedTab,
      filterSearch,
      filterSearch1,
      assignToOptions,
      tableData,
      tableData1,
      columnDataAssigned,
      columnDataUnassigned,
      formData,
      paginationControl,
      paginationControl1,
      showDeviceAddressModal,
      currentDeviceInfo,
      tableAjaxLoading,
      tableAjaxLoading1,
      formatDate,
      toggleLeadInformation,
      goToTab,
      updateDeviceAddress,
      updateDeviceAddressAfterEmit,
      assignImplementationUser,
      ajaxLoadAllLeadInfo,
      ajaxLoadAllLeadInfo1
    };
  }
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
</style>
