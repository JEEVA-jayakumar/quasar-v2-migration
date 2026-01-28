<template>
  <q-page>
    <div>
      <!-- Page Title -->
      <div class="col-md-6 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Sim Status
      </div>

      <!-- Table -->
      <q-table
        row-key="id"
        table-class="customTableClass"
        :columns="columns"
        :data="tableData"
        v-model:pagination="paginationControl"
        :filter="filter"
        :rows-per-page-options="[5, 10, 15, 20]"
        :loading="toggleAjaxLoadFilter"
        @request="ajaxLoadAllLeadInfo"
      >
        <!-- Top slot: Search + Buttons -->
        <template v-slot:top>
          <div class="row q-col-gutter-md items-center q-pa-md">
            <div class="col-md-5 col-sm-12">
              <q-search
                v-model="filter"
                placeholder="Type.."
                label="Sim Number"
                clearable
                color="grey-9"
              />
            </div>

            <div class="col-md-7 col-sm-12 text-right">
              <q-btn
                no-caps
                label="Upload file for Activation"
                class="common-dark-blue q-mr-sm"
                @click="UploadSimActivation"
              />
              <q-btn
                no-caps
                label="Upload file for De-Activation"
                class="common-dark-blue"
                @click="SimDeActivation"
              />
            </div>
          </div>
        </template>
      </q-table>

      <!-- Upload Modals -->
      <uploadSimActivation
        v-if="propSimActivationList"
        :propSimActivationList="propSimActivationList"
        @emitpropSimActivationList="UploadSimActivation"
      />
      <uploadSimDeactivation
        v-if="propSimDeactivation"
        :propSimDeactivation="propSimDeactivation"
        @emitpropSimDeactivation="SimDeActivation"
      />
    </div>
  </q-page>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import moment from "moment";

import uploadSimActivation from "../../components/inventory/uploadSimActivation.vue";
import uploadSimDeactivation from "../../components/inventory/uploadSimDeactivation.vue";

export default {
  name: "SimStatusPage",
  components: {
    uploadSimActivation,
    uploadSimDeactivation,
  },
  setup() {
    const store = useStore();

    const tableData = ref([]);
    const filter = ref("");
    const toggleAjaxLoadFilter = ref(false);
    const propSimActivationList = ref(false);
    const propSimDeactivation = ref(false);

    const paginationControl = ref({
      rowsPerPage: 10,
      page: 1,
      sortBy: "id",
      descending: false,
      rowsNumber: 0,
    });

    const columns = [
      {
        name: "simNo",
        label: "Sim Number",
        align: "center",
        field: row => row.simNo,
        sortable: true,
      },
      {
        name: "activationDate",
        label: "Activation Date",
        align: "center",
        field: row =>
          row.activationDate ? moment(row.activationDate).format("DD/MM/YYYY") : "NA",
        sortable: true,
      },
      {
        name: "deactivationDate",
        label: "Deactivation Date",
        align: "center",
        field: row =>
          row.deactivationDate ? moment(row.deactivationDate).format("DD/MM/YYYY") : "NA",
        sortable: true,
      },
      {
        name: "deployedDate",
        label: "Sim Card Deployed",
        align: "center",
        field: row =>
          row.deployedDate ? moment(row.deployedDate).format("DD/MM/YYYY") : "NA",
      },
      {
        name: "simRecoveredDate",
        label: "Sim Recovered",
        align: "center",
        field: row =>
          row.simRecoveredDate ? moment(row.simRecoveredDate).format("DD/MM/YYYY") : "NA",
      },
      {
        name: "logonDate",
        label: "Logon Date",
        align: "center",
        field: row =>
          row.logonDate ? moment(row.logonDate).format("DD/MM/YYYY") : "NA",
        sortable: true,
      },
      {
        name: "simStatus",
        label: "Sim Status",
        align: "center",
        field: row => row.simStatus,
        sortable: true,
      },
    ];

    const getSimStatus = computed(() => store.getters["Regional/getSimStatus"]);

    // Load table data
    const ajaxLoadAllLeadInfo = async ({ pagination, filter }) => {
      toggleAjaxLoadFilter.value = true;

      try {
        await store.dispatch("Regional/FETCH_ALL_SIM_STATUS", { pagination, filter });
        const data = getSimStatus.value;

        tableData.value = data.content || [];
        paginationControl.value = {
          ...pagination,
          rowsNumber: data.totalElements,
          page: data.number + 1,
          sortBy: data.sort?.[0]?.property || pagination.sortBy,
          descending: data.sort?.[0]?.ascending || pagination.descending,
        };
      } catch (err) {
        console.error(err);
      } finally {
        toggleAjaxLoadFilter.value = false;
      }
    };

    const UploadSimActivation = () => {
      ajaxLoadAllLeadInfo({ pagination: paginationControl.value, filter: filter.value });
      propSimActivationList.value = !propSimActivationList.value;
    };

    const SimDeActivation = () => {
      ajaxLoadAllLeadInfo({ pagination: paginationControl.value, filter: filter.value });
      propSimDeactivation.value = !propSimDeactivation.value;
    };

    onMounted(() => {
      ajaxLoadAllLeadInfo({ pagination: paginationControl.value, filter: filter.value });
    });

    return {
      tableData,
      filter,
      columns,
      paginationControl,
      toggleAjaxLoadFilter,
      propSimActivationList,
      propSimDeactivation,
      UploadSimActivation,
      SimDeActivation,
      ajaxLoadAllLeadInfo,
    };
  },
};
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
.common-dark-blue {
  background-color: #1a237e;
  color: #fff;
}
</style>
