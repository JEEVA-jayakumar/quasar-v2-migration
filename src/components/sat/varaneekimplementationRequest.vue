<template>
  <q-page>
    <!-- Lead Information Modal -->
    <generalLeadInformation
      v-if="propToggleLeadInformation"
      :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation"
      @closeLeadInformation="toggleLeadInformation"
    />

    <!-- Tabs -->
    <q-tabs
      v-model="selectedTab"
      class="shadow-1"
      color="grey-1"
      @update:model-value="goToTab"
    >
      <q-tab name="statusTab" label="TID & MID STATUS" />
      <q-tab name="rejectedTab" label="Rejected Leads" />
    </q-tabs>

    <!-- Tab Panes -->
    <div v-if="selectedTab === 'statusTab'">
      <q-table
        :rows="tableData1"
        :columns="columnData"
        row-key="id"
        :filter="filterSearch"
        v-model:pagination="paginationControl1"
        :rows-per-page-options="[10, 20, 50, 100, 150, 200]"
        :loading="tableAjaxLoading1"
        flat
        dense
        grid
        color="dark"
        @request="ajaxLoadAllLeadInfo1"
      >
        <template v-slot:body-cell-leadNumber="props">
          <span
            class="cursor-pointer label text-primary"
            @click="toggleLeadInformation(props.row.leadInformation)"
          >
            # {{ props.row.leadInformation.leadNumber }}
          </span>
        </template>

        <template v-slot:body-cell-submitToMarsDate="props">
          {{ formatDate(props.row.leadInformation.submitToMarsDate) }}
        </template>

        <template v-slot:body-cell-createdAt="props">
          {{ formatDate(props.row.createdAt) }}
        </template>

        <template v-slot:body-cell-mid="props">
          <div class="customTd text-primary">{{ props.row.mid }}</div>
        </template>

        <template v-slot:top>
          <div class="col-md-5">
            <q-input
              outlined
              clearable
              dense
              v-model="filterSearch"
              placeholder="Type.."
              label="Search By MID, TID"
              class="q-mr-lg q-py-sm"
            />
          </div>
        </template>
      </q-table>
    </div>

    <div v-else-if="selectedTab === 'rejectedTab'">
      <varaneekRejectedLead />
    </div>

    <!-- Device Address Modal -->
    <DeviceAddressModal
      v-if="showDeviceAddressModal"
      :showDeviceAddressModal="showDeviceAddressModal"
      v-model:currentDeviceInfo="currentDeviceInfo"
      :stateInformation="getAllStatesData"
      :paginationControl="paginationControl"
      :selectedLeadItems="formData.marsDeviceIdsCooked"
      @toggleModal="UpdateDeviceAddressAfterEmit"
    />
  </q-page>
</template>

<script>
import { ref, reactive, onMounted, computed } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import DeviceAddressModal from "../../components/sat/DeviceAddressModal.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import varaneekRejectedLead from "../../components/sat/varaneekRejectedLead.vue";
import moment from "moment";

export default {
  name: "VaraneekImplementationQueue",
  components: { DeviceAddressModal, generalLeadInformation, varaneekRejectedLead },
  setup() {
    const $q = useQuasar();
    const store = useStore();

    // Reactive State
    const selectedTab = ref("rejectedTab");
    const propToggleLeadInformation = ref(false);
    const addtnLeadInformation = ref(null);
    const filterSearch = ref("");
    const tableData1 = ref([]);
    const tableAjaxLoading1 = ref(false);
    const currentDeviceInfo = ref({});
    const showDeviceAddressModal = ref(false);

    const paginationControl1 = reactive({
      sortBy: "deviceStatusDate",
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0
    });

    const formData = reactive({
      marsDeviceIdsCooked: [],
      marsDeviceIdsCookedUnAssinged: [],
      triggerWelcomeMail: false,
      courier: false,
      assignTo: ""
    });

    const columnData = [
      { name: "leadNumber", label: "Lead Number", align: "left", field: row => row.leadInformation.leadNumber },
      { name: "createdAt", label: "Date of TID Generation", align: "left", field: "createdAt", sortable: true },
      { name: "tid", label: "TID", align: "left", field: row => row.tid, sortable: true },
      { name: "mid", label: "MID", align: "left", field: row => row.mid, sortable: true },
      { name: "leadInformation", label: "Device Type", align: "left", field: row => row.leadInformation.device.deviceName },
      { name: "submitToMarsDate", label: "Date of Submission", align: "left", field: row => row.leadInformation.submitToMarsDate }
    ];

    // Vuex Getters as computed properties
    const getleadStatusList = computed(() => store.getters["varaneekImplementationQueue/getleadStatusList"]);
    const getAllStatesData = computed(() => store.getters["SuperAdminUsers/getAllStatesData"]);

    const formatDate = date => (date ? moment(date).format("Do MMM Y") : "");

    const toggleLeadInformation = leadDetails => {
      propToggleLeadInformation.value = !propToggleLeadInformation.value;
      if (leadDetails) addtnLeadInformation.value = leadDetails;
    };

    const ajaxLoadAllLeadInfo1 = async ({ pagination = paginationControl1, filter = filterSearch.value }) => {
      tableAjaxLoading1.value = true;
      $q.loading.show({ spinnerColor: "purple-9", message: "Fetching data .." });
      try {
        await store.dispatch("varaneekImplementationQueue/LEAD_STATUS_LIST", { pagination, filter });

        await store.dispatch("ImplementationExecutive/IMPLEMENTATION_EXECUTIVE_LIST").then(() => {
          // assignToOptions generation (kept for reference but not used)
          // Note: assignToOptions is generated but not used - removed to fix ESLint warning
        });

        paginationControl1.rowsNumber = getleadStatusList.value.totalElements;
        paginationControl1.page = getleadStatusList.value.number + 1;

        if (getleadStatusList.value.sort?.length > 0) {
          paginationControl1.sortBy = getleadStatusList.value.sort[0].property;
          paginationControl1.descending = !getleadStatusList.value.sort[0].ascending;
        }

        tableData1.value = getleadStatusList.value.content;
      } catch (err) {
        console.error('Error loading lead info:', err);
      } finally {
        tableAjaxLoading1.value = false;
        $q.loading.hide();
      }
    };

    const goToTab = tab => {
      if (tab === "statusTab") {
        ajaxLoadAllLeadInfo1({ pagination: paginationControl1, filter: filterSearch.value });
      }
    };

    const UpdateDeviceAddress = deviceInfo => {
      currentDeviceInfo.value = {
        id: formData.marsDeviceIdsCooked.length
          ? formData.marsDeviceIdsCooked.map(v => v.id)
          : [deviceInfo.id],
        marsDeviceAddress: {
          deviceAddress: deviceInfo.deviceAddress,
          latitude: 0,
          longitude: 0,
          pincode: deviceInfo.pincode,
          city: deviceInfo.city,
          state: deviceInfo.state
        }
      };
      showDeviceAddressModal.value = true;
    };

    const UpdateDeviceAddressAfterEmit = pagination => {
      showDeviceAddressModal.value = false;
      paginationControl1.page = pagination.page;
      paginationControl1.rowsPerPage = pagination.rowsPerPage;
    };

    onMounted(() => {
      ajaxLoadAllLeadInfo1({ pagination: paginationControl1, filter: filterSearch.value });
      store.dispatch("SuperAdminUsers/FETCH_ALL_STATES_DATA");
    });

    return {
      selectedTab,
      propToggleLeadInformation,
      addtnLeadInformation,
      tableData1,
      tableAjaxLoading1,
      paginationControl1,
      formData,
      filterSearch,
      columnData,
      currentDeviceInfo,
      showDeviceAddressModal,
      getAllStatesData,
      formatDate,
      toggleLeadInformation,
      ajaxLoadAllLeadInfo1,
      goToTab,
      UpdateDeviceAddress,
      UpdateDeviceAddressAfterEmit
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