<template>
  <q-page>
    <div>
      <!-- Lead Information Modal -->
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :lead-information="addtnLeadInformation"
        :prop-toggle-lead-information-pop="propToggleLeadInformation"
        @close-lead-information="toggleLeadInformation"
      />

      <!-- Assigned / Unassigned Footer Card -->
      <q-card class="group q-pa-md" v-if="selectedTab === 'assigned'">
        <div class="row items-center gutter-y-sm">
          <div
            class="col-md-3 col-sm-12 col-xs-12 text-grey-7 text-weight-medium q-px-md"
            align="left"
          >
            <span class="q-display-2">{{ formData.marsDeviceIdsCookedUnAssigned.length }}</span>/ selected
          </div>
          <div class="col-md-9 col-sm-12 col-xs-12">
            <div class="row items-center">
              <div class="col-md-4 col-sm-6 col-xs-6">
                <q-select
                  v-model="formData.assignTo"
                  :options="assignToOptions"
                  filter
                  clearable
                  color="grey-9"
                  :disable="formData.marsDeviceIdsCookedUnAssigned.length === 0"
                  placeholder="Assign To"
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
                <div class="q-mb-sm">
                  <q-btn
                    no-caps
                    :disable="!canReAssign"
                    label="Re-Assign"
                    class="common-dark-blue"
                    @click="reAssignImplementationUser"
                  />
                </div>
                <div>
                  <q-btn
                    no-caps
                    :disable="!canUnAssign"
                    label="Un-Assign"
                    class="common-dark-blue"
                    @click="unAssignImplementationUser"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card>

      <!-- Tabs for Normal and Courier -->
      <q-tabs
        v-model="selectedTab"
        class="shadow-1"
        color="grey-1"
        @update:model-value="goToUnassignedTab"
      >
        <q-tab name="assigned" label="Normal" />
        <q-tab name="courier" label="Courier" />

        <q-tab-panels v-model="selectedTab">
          <!-- Normal Assigned Table -->
          <q-tab-panel name="assigned">
            <q-table
              :data="tableData"
              :columns="columnDataAssigned"
              table-class="customTableClass"
              :filter="filterSearch"
              v-model:pagination="paginationControl"
              selection="multiple"
              v-model:selected="formData.marsDeviceIdsCookedUnAssigned"
              row-key="id"
              :loading="tableAjaxLoading"
              :rows-per-page-options="[10, 20, 50, 100, 150, 200]"
              color="dark"
              @request="ajaxLoadAllLeadInfo"
            >
              <template v-slot:top>
                <div class="col-md-5">
                  <q-search
                    v-model="filterSearch"
                    clearable
                    color="grey-9"
                    placeholder="Type.."
                    float-label="Search By MID, Merchant Name.."
                    class="q-mr-lg q-py-sm"
                  />
                </div>
              </template>

              <template v-slot:body-cell-leadNumber="props">
                <span
                  class="label text-primary cursor-pointer"
                  @click="toggleLeadInformation(props.row.leadInformation)"
                >
                  #{{ props.row.leadInformation.leadNumber }}
                </span>
              </template>

              <template v-slot:body-cell-LeadSource="props">
                <span :class="{ 'text-red': props.row.leadInformation.leadSource.sourceName === 'LS_TOHANDS' }">
                  {{ props.row.leadInformation.leadSource.sourceName }}
                </span>
              </template>

              <template v-slot:body-cell-createdAt="props">
                {{ formatDate(props.row.createdAt) }}
              </template>

              <template v-slot:body-cell-mid="props">
                <div class="text-primary">{{ props.row.mid }}</div>
              </template>

              <template v-slot:body-cell-deviceAddress="props">
                <div>{{ props.row.deviceAddress }}</div>
              </template>

              <template v-slot:body-cell-submitToMarsDate="props">
                {{ formatDate(props.row.leadInformation.submitToMarsDate) }}
              </template>
            </q-table>
          </q-tab-panel>

          <!-- Courier Table -->
          <q-tab-panel name="courier">
            <q-table
              :data="tableData1"
              :columns="columnDataUnassigned"
              table-class="customTableClass"
              :filter="filterSearch1"
              v-model:pagination="paginationControl1"
              row-key="id"
              :rows-per-page-options="[10, 20, 50, 100, 150, 200]"
              :loading="tableAjaxLoading1"
              color="dark"
              @request="ajaxLoadAllLeadInfo1"
            >
              <template v-slot:top>
                <div class="col-md-5">
                  <q-search
                    v-model="filterSearch1"
                    clearable
                    color="grey-9"
                    placeholder="Type.."
                    float-label="Search By MID, Merchant Name.."
                    class="q-mr-lg q-py-sm"
                  />
                </div>
              </template>

              <template v-slot:body-cell-leadNumber="props">
                <span
                  class="label text-primary cursor-pointer"
                  @click="toggleLeadInformation(props.row.leadInformation)"
                >
                  #{{ props.row.leadInformation?.leadNumber || 'NA' }}
                </span>
              </template>

              <template v-slot:body-cell-LeadSource="props">
                <span :class="{ 'text-red': props.row.leadInformation?.leadSource.sourceName === 'LS_TOHANDS' }">
                  {{ props.row.leadInformation?.leadSource.sourceName || 'NA' }}
                </span>
              </template>

              <template v-slot:body-cell-createdAt="props">
                {{ formatDate(props.row.createdAt) }}
              </template>

              <template v-slot:body-cell-mid="props">
                <div class="text-primary">{{ props.row.mid || 'NA' }}</div>
              </template>

              <template v-slot:body-cell-deviceAddress="props">
                <div>
                  <q-btn
                    no-caps
                    icon="edit"
                    color="purple-9"
                    size="xs"
                    round
                    @click="UpdateDeviceAddress(props.row)"
                  />
                  {{ props.row.deviceAddress || 'NA' }}
                </div>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </q-tabs>

      <!-- Device Address Modal -->
      <DeviceAddressModal
        v-if="showDeviceAddressModal"
        :show-device-address-modal="showDeviceAddressModal"
        v-model:currentDeviceInfo="currentDeviceInfo"
        :state-information="getAllStatesData"
        :pagination-control="paginationControl"
        :selected-lead-items="formData.marsDeviceIdsCooked"
        @toggle-modal="UpdateDeviceAddressAfterEmit"
      />
    </div>
  </q-page>
</template>

<script>
import { ref, reactive, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

import DeviceAddressModal from "../../components/sat/DeviceAddressModal.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";

export default {
  name: "implementationQueue",
  components: { DeviceAddressModal, generalLeadInformation },
  setup() {
    const store = useStore();
    const $q = useQuasar();

    const propToggleLeadInformation = ref(false);
    const addtnLeadInformation = ref(null);
    const filterSearch = ref("");
    const filterSearch1 = ref("");
    const selectedTab = ref("assigned");
    const assignToOptions = ref([]);
    const tableData = ref([]);
    const tableData1 = ref([]);
    const showDeviceAddressModal = ref(false);
    const currentDeviceInfo = ref({});
    const formData = reactive({
      marsDeviceIdsCooked: [],
      marsDeviceIdsCookedUnAssigned: [],
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

    const tableAjaxLoading = ref(false);
    const tableAjaxLoading1 = ref(false);

    const columnDataAssigned = ref([
      // Same as your columns, remove old slot-scope
    ]);

    const columnDataUnassigned = ref([
      // Same as your columns
    ]);

    const formatDate = (val) => {
      if (!val) return "NA";
      return new Date(val).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    };

    const canReAssign = computed(() => {
      return formData.marsDeviceIdsCookedUnAssigned.length > 0 && formData.assignTo;
    });

    const canUnAssign = computed(() => {
      return formData.marsDeviceIdsCookedUnAssigned.length > 0;
    });

    const toggleLeadInformation = (leadDetails) => {
      propToggleLeadInformation.value = !propToggleLeadInformation.value;
      if (leadDetails) addtnLeadInformation.value = leadDetails;
    };

    // API / Vuex methods
    const ajaxLoadAllLeadInfo = async ({ pagination, filter }) => {
      $q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data.." });
      try {
        await store.dispatch("ImplementationQueue/IMPLEMENTATION_QUEUE_ASSIGNED_LIST", { pagination, filter });
        await store.dispatch("ImplementationExecutive/IMPLEMENTATION_EXECUTIVE_LIST");

        assignToOptions.value = store.getters["ImplementationExecutive/getImplementationExecutiveList"].map(v => ({
          label: `${v.name} | ${v.employeeID} | ${v.email}`,
          value: v.id
        }));

        paginationControl.rowsNumber = store.getters["ImplementationQueue/getImplementationQueueAssignedList"].totalElements;
        paginationControl.page = store.getters["ImplementationQueue/getImplementationQueueAssignedList"].number + 1;
        tableData.value = store.getters["ImplementationQueue/getImplementationQueueAssignedList"].content;
      } catch (e) {
        console.error(e);
      } finally {
        $q.loading.hide();
      }
    };

    const ajaxLoadAllLeadInfo1 = async ({ pagination, filter }) => {
      $q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data.." });
      try {
        await store.dispatch("ImplementationQueue/IMPLEMENTATION_QUEUE_COURIER_LIST", { pagination, filter });
        paginationControl1.rowsNumber = store.getters["ImplementationQueue/getImplementationQueueCourierList"].totalElements;
        paginationControl1.page = store.getters["ImplementationQueue/getImplementationQueueCourierList"].number + 1;
        tableData1.value = store.getters["ImplementationQueue/getImplementationQueueCourierList"].content;
      } catch (e) {
        console.error(e);
      } finally {
        $q.loading.hide();
      }
    };

    const goToUnassignedTab = (tab) => {
      if (tab === "courier") {
        ajaxLoadAllLeadInfo1({ pagination: paginationControl1, filter: filterSearch1.value });
        formData.marsDeviceIdsCookedUnAssigned = [];
        formData.assignTo = "";
        filterSearch.value = "";
      } else {
        ajaxLoadAllLeadInfo({ pagination: paginationControl, filter: filterSearch.value });
        formData.marsDeviceIdsCookedUnAssigned = [];
        formData.assignTo = "";
        filterSearch.value = "";
      }
    };

    onMounted(() => {
      ajaxLoadAllLeadInfo({ pagination: paginationControl, filter: filterSearch.value });
      ajaxLoadAllLeadInfo1({ pagination: paginationControl1, filter: filterSearch1.value });
      store.dispatch("SuperAdminUsers/FETCH_ALL_STATES_DATA");
    });

    return {
      propToggleLeadInformation,
      addtnLeadInformation,
      filterSearch,
      filterSearch1,
      selectedTab,
      assignToOptions,
      tableData,
      tableData1,
      formData,
      paginationControl,
      paginationControl1,
      tableAjaxLoading,
      tableAjaxLoading1,
      showDeviceAddressModal,
      currentDeviceInfo,
      columnDataAssigned,
      columnDataUnassigned,
      formatDate,
      toggleLeadInformation,
      canReAssign,
      canUnAssign,
      ajaxLoadAllLeadInfo,
      ajaxLoadAllLeadInfo1,
      goToUnassignedTab
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
