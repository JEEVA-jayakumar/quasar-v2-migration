<template>
  <q-page class="q-pa-md">

    <!-- Table: Device Requests -->
    <q-table
      table-class="customTableClass"
      :rows="tableData"
      :columns="columns"
      row-key="id"
      :loading="toggleAjaxLoadFilter"
      v-model:pagination="paginationControl"
      :rows-per-page-options="[5, 10, 15, 20]"
      :filter="filter"
      @request="onRequest"
    >
      <!-- Custom cell: SO Name -->
      <template #body-cell-soName="props">
        {{ props.row.soName ?? "NA" }}
      </template>

      <!-- Custom cell: Action -->
      <template #body-cell-action="props">
        <q-btn
          v-if="props.row.status === 0"
          color="positive"
          size="sm"
          push
          class="q-mx-sm"
          @click="approveDeviceRequest(props.row)"
        >
          Approve
        </q-btn>

        <q-btn
          v-if="props.row.status === 0"
          color="negative"
          size="sm"
          push
          class="q-mx-sm"
          @click="openRejectModal(props.row)"
        >
          Reject
        </q-btn>

        <span v-if="props.row.status === 1" class="label text-green">
          Device Allocated Successfully
        </span>

        <div v-if="props.row.status === 2">
          <span class="label text-red">Rejected</span><br />
          <span class="label text">Remarks: {{ props.row.remarks ?? "NA" }}</span>
        </div>
      </template>

      <!-- Top slot: Search -->
      <template #top>
        <div class="col-5">
          <q-input
            clearable
            dense
            outlined
            v-model="filter"
            placeholder="Type.."
            label="Search Using POD, Serial No, Merchant Name"
            class="q-mr-lg q-py-sm"
          >
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </template>
    </q-table>

    <!-- Reject Modal -->
    <AggregatorRequestRejectRemarks
      v-model:showRejectModal="showRejectModal"
      :propsRejectDeviceComponent="propsRejectData"
      @closeLostModel="closeRejectModal"
    />

    <!-- Global Spinner -->
    <div v-if="toggleAjaxLoadFilter || toggleAjaxLoadFilter1" class="fullscreen spinner-overlay">
      <q-spinner-bars class="absolute-center" color="purple-9" :size="35" />
    </div>
  </q-page>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import moment from "moment";
import AggregatorRequestRejectRemarks from "../../components/sat/AggregatorRequestRejectRemarks.vue";
import { useStore } from "vuex";

export default {
  name: "DeviceRequestList",

  components: {
    AggregatorRequestRejectRemarks,
  },

  setup() {
    const $q = useQuasar();
    const store = useStore();

    // Table & Filter
    const filter = ref("");
    const tableData = ref([]);
    const toggleAjaxLoadFilter = ref(false);
    const toggleAjaxLoadFilter1 = ref(false);

    // Pagination
    const paginationControl = reactive({
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
    });

    // Reject modal
    const showRejectModal = ref(false);
    const propsRejectData = ref({});

    // Table Columns
    const columns = [
      {
        name: "soName",
        label: "SO Name",
        align: "left",
        field: "soName",
        sortable: true,
      },
      {
        name: "serialNumber",
        label: "Serial Number",
        align: "left",
        field: (row) =>
          row.aggregatorRegionalInventory?.serialNumber ?? "NA",
        sortable: true,
      },
      {
        name: "podNumber",
        label: "POD",
        align: "left",
        field: (row) => row.podNumber ?? "NA",
        sortable: false,
      },
      {
        name: "requestedAt",
        label: "Requested Date",
        align: "left",
        field: (row) => moment(row.requestedAt).format("DD/MM/YYYY"),
        sortable: false,
      },
      {
        name: "actionedAt",
        label: "Actioned Date",
        align: "center",
        field: (row) =>
          row.actionedAt ? moment(row.actionedAt).format("DD/MM/YYYY") : "NA",
        sortable: false,
      },
      {
        name: "action",
        label: "Action",
        align: "center",
        field: "action",
        sortable: true,
      },
    ];

    // ----------------------------
    // API Calls
    // ----------------------------
    const loadLeadInfo = async () => {
      toggleAjaxLoadFilter.value = true;
      try {
        const res = await store.dispatch("VerifyDevice/AGGREGATOR_SELF_ASSIGNMENT_TRACKER", {
          pagination: paginationControl,
          filter: filter.value,
        });
        tableData.value = res.body.data.content;
        paginationControl.rowsNumber = res.body.data.totalElements;
        paginationControl.page = res.body.data.number + 1;
      } catch (err) {
        console.error(err);
      } finally {
        toggleAjaxLoadFilter.value = false;
      }
    };

    // ----------------------------
    // Table Event Handlers
    // ----------------------------
    const onRequest = (props) => {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      
      // Update pagination control
      paginationControl.page = page;
      paginationControl.rowsPerPage = rowsPerPage;
      paginationControl.sortBy = sortBy;
      paginationControl.descending = descending;
      
      // Reload data with new pagination
      loadLeadInfo();
    };

    const approveDeviceRequest = async (row) => {
      const param = {
        selfAssignmentId: row.id,
        serialNumber: row.aggregatorRegionalInventory.serialNumber,
      };
      try {
        await $q.dialog({
          title: "Confirm",
          message: "Are you sure want to Approve the lead?",
          cancel: true,
          ok: "Continue",
        });
        $q.loading.show({ message: "Processing ..", spinnerColor: "purple-9" });
        await store.dispatch(
          "VerifyDevice/APPROVE_AGGREGATOR_SELF_ASSIGNMENT",
          param
        );
        await loadLeadInfo();
        $q.notify({ color: "positive", message: "Approved Successfully" });
      } catch (err) {
        $q.notify({
          color: "negative",
          message:
            err?.body?.message ?? "Something went wrong. Please try again!",
        });
      } finally {
        $q.loading.hide();
      }
    };

    const openRejectModal = (row) => {
      propsRejectData.value = row;
      showRejectModal.value = true;
    };

    const closeRejectModal = () => {
      showRejectModal.value = false;
      loadLeadInfo();
    };

    // ----------------------------
    // Lifecycle
    // ----------------------------
    onMounted(() => {
      loadLeadInfo();
    });

    return {
      filter,
      tableData,
      columns,
      paginationControl,
      toggleAjaxLoadFilter,
      toggleAjaxLoadFilter1,
      showRejectModal,
      propsRejectData,
      approveDeviceRequest,
      openRejectModal,
      closeRejectModal,
      onRequest,
    };
  },
};
</script>

<style scoped>
.spinner-overlay {
  background: rgba(255, 255, 255, 0.6);
  z-index: 9999;
}
</style>