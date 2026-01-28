<template>
  <q-page class="q-pa-md">
    <div>
      <!-- Table Title -->
      <div class="col-md-6 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Sim Status
      </div>

      <!-- Sim Status Table -->
      <q-table
        table-class="customTableClass"
        :columns="columns"
        :rows="tableData"
        :filter="filter"
        v-model:pagination="paginationControl"
        row-key="id"
        :rows-per-page-options="[5, 10, 15, 20]"
        :loading="toggleAjaxLoadFilter"
        @request="ajaxLoadAllLeadInfo"
        flat
        bordered
      >
        <!-- Top Slot: Search + Buttons -->
        <template v-slot:top>
          <div class="row items-center q-mb-sm">
            <div class="col-md-5">
              <q-input
                clearable
                v-model="filter"
                placeholder="Type.."
                label="Sim Number"
                outlined
                dense
                class="q-mr-lg"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>

            <div class="col-md-5">
              <q-btn
                no-caps
                label="Upload file for Activation"
                class="common-dark-blue agnalgin1"
                @click="toggleUploadSimActivation"
              />
              &nbsp;
              <q-btn
                no-caps
                label="Upload file for De-Activation"
                class="common-dark-blue agnalgin1"
                @click="toggleSimDeActivation"
              />
            </div>
          </div>
        </template>
      </q-table>

      <!-- Upload Activation Dialog -->
      <uploadSimActivation
        v-if="propSimActivationList"
        :propSimActivationList="propSimActivationList"
        @emitpropSimActivationList="toggleUploadSimActivation"
      />

      <!-- Upload Deactivation Dialog -->
      <uploadSimDeactivation
        v-if="propSimDeactivation"
        :propSimDeactivation="propSimDeactivation"
        @emitpropSimDeactivation="toggleSimDeActivation"
      />
    </div>
  </q-page>
</template>

<script>
import { ref, reactive, computed, onMounted } from "vue";
import { useStore } from "vuex";
import moment from "moment";

import uploadSimActivation from "../../components/sat/uploadSimActivation.vue";
import uploadSimDeactivation from "../../components/sat/uploadSimDeactivation.vue";

export default {
  name: "MerchantTracker",
  components: {
    uploadSimActivation,
    uploadSimDeactivation
  },
  setup() {
    const store = useStore();

    // --- Reactive State ---
    const propSimActivationList = ref(false);
    const propSimDeactivation = ref(false);
    const tableData = ref([]);
    const filter = ref("");
    const toggleAjaxLoadFilter = ref(false);

    const paginationControl = reactive({
      page: 1,
      rowsPerPage: 10,
      sortBy: "id",
      descending: false,
      rowsNumber: 0
    });

    // --- Table Columns ---
    const columns = [
      {
        name: "simNo",
        label: "Sim Number",
        align: "center",
        field: row => row.simNo,
        sortable: true
      },
      {
        name: "activationDate",
        label: "Activation Date",
        align: "center",
        field: row => row.activationDate ? moment(row.activationDate).format("DD/MM/YYYY") : "NA",
        sortable: true
      },
      {
        name: "deactivationDate",
        label: "Deactivation Date",
        align: "center",
        field: row => row.deactivationDate ? moment(row.deactivationDate).format("DD/MM/YYYY") : "NA",
        sortable: true
      },
      {
        name: "deployedDate",
        label: "Sim Card Deployed Date",
        align: "center",
        field: row => row.deployedDate ? moment(row.deployedDate).format("DD/MM/YYYY") : "NA"
      },
      {
        name: "simRecoveredDate",
        label: "Sim Recovered Date",
        align: "center",
        field: row => row.simRecoveredDate ? moment(row.simRecoveredDate).format("DD/MM/YYYY") : "NA"
      },
      {
        name: "logonDate",
        label: "Logon Date",
        align: "center",
        field: row => row.logonDate ? moment(row.logonDate).format("DD/MM/YYYY") : "NA",
        sortable: true
      },
      {
        name: "simStatus",
        label: "Sim Status",
        align: "center",
        field: row => row.simStatus,
        sortable: true
      }
    ];

    // --- Vuex Getter ---
    const getSimStatus = computed(() => store.getters["Regional/getSimStatus"]);

    // --- Vuex Action ---
    const FETCH_ALL_SIM_STATUS_BY_REGION = (payload) =>
      store.dispatch("Regional/FETCH_ALL_SIM_STATUS_BY_REGION", payload);

    // --- Methods ---
    const ajaxLoadAllLeadInfo = async ({ pagination, filter }) => {
      toggleAjaxLoadFilter.value = true;
      try {
        const payload = { pagination, filter };
        await FETCH_ALL_SIM_STATUS_BY_REGION(payload);

        const response = getSimStatus.value;
        tableData.value = response.content;
        paginationControl.rowsNumber = response.totalElements;
        paginationControl.page = response.number + 1;

        if (response.sort && response.sort.length > 0) {
          paginationControl.sortBy = response.sort[0].property;
          paginationControl.descending = !response.sort[0].ascending;
        }
      } catch (err) {
        console.error("Error fetching SIM status:", err);
      } finally {
        toggleAjaxLoadFilter.value = false;
      }
    };

    const toggleUploadSimActivation = () => {
      propSimActivationList.value = !propSimActivationList.value;
      if (!propSimActivationList.value) {
        ajaxLoadAllLeadInfo({ pagination: paginationControl, filter: filter.value });
      }
    };

    const toggleSimDeActivation = () => {
      propSimDeactivation.value = !propSimDeactivation.value;
      ajaxLoadAllLeadInfo({ pagination: paginationControl, filter: filter.value });
    };

    // --- Lifecycle Hook ---
    onMounted(() => {
      ajaxLoadAllLeadInfo({ pagination: paginationControl, filter: filter.value });
    });

    return {
      columns,
      tableData,
      filter,
      paginationControl,
      toggleAjaxLoadFilter,
      propSimActivationList,
      propSimDeactivation,
      ajaxLoadAllLeadInfo,
      toggleUploadSimActivation,
      toggleSimDeActivation
    };
  }
};
</script>

<style scoped>
/* Add any specific styling here */
</style>
