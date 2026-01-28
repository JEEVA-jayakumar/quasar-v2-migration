<template>
  <q-page padding>

    <!-- Tabs -->
    <q-tabs
      v-model="activeTab"
      class="shadow-1"
      color="grey-1"
      @update:model-value="goToCompleteTab"
      dense
    >
      <q-tab name="tab-1" label="Pending Tickets" />
      <q-tab name="tab-2" label="Completed Tickets" />
    </q-tabs>

    <!-- Pending Tickets Tab -->
    <q-tab-panels v-model="activeTab" animated>

      <q-tab-panel name="tab-1">
        <div class="row items-center q-mb-md">

          <div class="col-auto">
            <strong>Open For</strong>
          </div>

          <div class="col">
            <q-select
              v-model="formData.date"
              :options="dateType"
              label="Select Date"
              dense
              color="grey"
              @update:model-value="dateClick"
              emit-value
              map-options
            />
          </div>

          <div class="col-5" />

          <div class="col-5">
            <q-input
              v-model="filter"
              clearable
              dense
              placeholder="Search By Ticket No, Merchant No..."
              debounce="300"
              outlined
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </div>

        <!-- Pending Tickets Table -->
        <q-table
          :rows="tableData"
          :columns="columns"
          row-key="serviceReqTicketId"
          :filter="filter"
          v-model:pagination="paginationControl"
          :rows-per-page-options="[5,10,15]"
          :loading="toggleAjaxLoadFilter"
          flat
          dense
        >
          <template v-slot:body-cell-Date="props">
            {{ props.row?.createdDate ? $moment(props.row.createdDate).format("Do MMM Y") : "NA" }}
          </template>

          <template v-slot:body-cell-action="props">
            <div class="row no-wrap no-padding">
              <q-btn
                :disable="props.row.serviceRequestTicketStatus !== 1"
                dense
                no-caps
                label="Resolved"
                icon="far fa-plus-square"
                size="md"
                flat
                class="custom-green"
                @click="fnResolve(props.row)"
              />
              <q-btn
                :disable="props.row.serviceRequestTicketStatus !== 1"
                dense
                no-caps
                label="Escalate to Sat"
                icon="far fa-plus-square"
                size="md"
                flat
                class="custom-negative"
                @click="fnEscalateToSat(props.row)"
              />
            </div>
          </template>

          <template v-slot:body-cell-updateRemarks="props">
            <div class="row no-wrap no-padding items-center">
              <q-btn
                :disable="props.row.serviceRequestTicketStatus !== 1"
                round
                dense
                icon="edit"
                color="purple-9"
                size="xs"
                @click="toggleAddremarks(props.row)"
              />
              <span class="q-ma-sm" v-html="props.row.crmRemark || 'NA'"></span>
            </div>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- Completed Tickets Tab -->
      <q-tab-panel name="tab-2">
        <div class="row q-mb-md">
          <div class="col-4">
            <q-input
              v-model="filter1"
              clearable
              dense
              placeholder="Search By Ticket No, Merchant No..."
              debounce="300"
              outlined
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </div>

        <!-- Completed Tickets Table -->
        <q-table
          :rows="tableData1"
          :columns="columns2"
          row-key="serviceReqTicketId"
          :filter="filter1"
          v-model:pagination="paginationControl1"
          :rows-per-page-options="[5,10,15]"
          :loading="toggleAjaxLoadFilter1"
          flat
          dense
        >
          <template v-slot:body-cell-updateRemarks="props">
            <span class="q-ma-sm" v-html="props.row.crmRemark || 'NA'"></span>
          </template>
          <template v-slot:body-cell-createdDate="props">
            {{ props.row?.createdDate ? $moment(props.row.createdDate).format("Do MMM Y") : "NA" }}
          </template>
          <template v-slot:body-cell-updatedDate="props">
            {{ props.row?.updatedDate ? $moment(props.row.updatedDate).format("Do MMM Y") : "NA" }}
          </template>
        </q-table>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Add Remarks Modal -->
    <bijlipay-add-remarks
      v-if="propToggleRemarks"
      :remarks-info="addBasicInformation"
      :prop-toggle-remarks-pop="propToggleRemarks"
      @reload-bijlipay-pending-details="loadingData({ pagination: paginationControl, filter, date: formData.date })"
      @close-remarks-info="toggleAddremarks"
    />

    <!-- Loading Spinner -->
    <div v-if="toggleAjaxLoadFilter || toggleAjaxLoadFilter1" class="fullscreen spinner-overlay">
      <q-spinner-bars class="absolute-center" color="#61116a" size="35" />
    </div>
  </q-page>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import bijlipayAddRemarks from "../../components/crm/bijlipayAddRemarks.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "bijlipayCrm",
  components: { bijlipayAddRemarks },
  setup() {
    const $q = useQuasar();

    // State
    const activeTab = ref("tab-1");
    const filter = ref("");
    const filter1 = ref("");
    const toggleAjaxLoadFilter = ref(false);
    const toggleAjaxLoadFilter1 = ref(false);

    const paginationControl = reactive({
      rowsNumber: 5,
      page: 1,
      sortBy: "createdDate",
      descending: false,
      rowsPerPage: 5,
    });

    const paginationControl1 = reactive({
      rowsNumber: 5,
      page: 1,
      sortBy: "createdDate",
      descending: false,
      rowsPerPage: 5,
    });

    const formData = reactive({ date: 0 });

    const propToggleRemarks = ref(false);
    const addBasicInformation = reactive({ remarks: null, action: 0 });

    const tableData = ref([]);
    const tableData1 = ref([]);

    const dateType = [
      { label: "Today", value: 0 },
      { label: "T+1", value: 1 },
      { label: "T+2", value: 2 },
      { label: "All", value: 3 },
    ];

    const columns = [
      { name: "serviceReqTicketId", label: "Ticket No", field: (row) => row.serviceReqTicketId },
      { name: "merchantName", label: "Merchant Name", field: "meName" },
      { name: "emailId", label: "Merchant Email", field: "emailId" },
      { name: "contactNumber", label: "Merchant No", field: "contactNumber" },
      {
        name: "subTickets",
        label: "Issue Reported",
        field: (row) =>
          row.subTicketsList?.length
            ? row.subTicketsList.map((el, i) => `${i + 1}.${el.serviceRequestType?.name || ""}`).join(", ")
            : "NA",
      },
      { name: "createdDate", label: "Date", field: "createdDate", sortable: true },
      {
        name: "Remarks",
        label: "Status",
        field: (row) =>
          row.subTicketsList?.length
            ? row.subTicketsList.map((el, i) => `${i + 1}.${el.serviceRequestSubTicketStatus?.name || ""}`).join(", ")
            : "NA",
      },
      { name: "updateRemarks", label: "Remarks", field: "updateRemarks" },
      { name: "action", label: "Action", field: "action" },
    ];

    const columns2 = [
      { name: "serviceReqTicketId", label: "Ticket No", field: (row) => row.serviceReqTicketId },
      { name: "merchantName", label: "Merchant Name", field: "meName" },
      { name: "emailId", label: "Merchant Email", field: "emailId" },
      { name: "contactNumber", label: "Merchant Number", field: "contactNumber" },
      {
        name: "name",
        label: "Status Reported",
        field: (row) =>
          row.subTicketsList?.length
            ? row.subTicketsList.map((el, i) => `${i + 1}.${el.serviceRequestType?.name || ""}`).join(", ")
            : "NA",
      },
      { name: "updateRemarks", label: "Remarks", field: "updateRemarks" },
      { name: "createdDate", label: "Open Date", field: "createdDate", sortable: true },
      { name: "updatedDate", label: "Closed Date", field: "updatedDate" },
    ];

    // Vuex Actions & Getters
    const {
      FETCH_BIJLIPAY_COMPLETED_DATA,
      BIJLIPAY_CRM_DATE,
      ASSIGN_TO_COMPLETE,
      ESCALATE_TO_SAT,
    } = mapActions("bijlipayCrm", [
      "FETCH_BIJLIPAY_PENDING_CRM",
      "FETCH_BIJLIPAY_COMPLETED_DATA",
      "BIJLIPAY_CRM_DATE",
      "ASSIGN_TO_COMPLETE",
      "ESCALATE_TO_SAT",
    ]);

    const { getBijlipayDate, getBijlipayCompletedData } = mapGetters("bijlipayCrm", [
      "getBijlipayDate",
      "getBijlipayCompletedData",
    ]);

    // Methods
    const loadingData = async ({ pagination, filter, date }) => {
      toggleAjaxLoadFilter.value = true;
      try {
        await BIJLIPAY_CRM_DATE({ pagination, filter, date });
        paginationControl.rowsNumber = getBijlipayDate.totalElements;
        paginationControl.page = getBijlipayDate.number + 1;
        tableData.value = getBijlipayDate.content;
        if (getBijlipayDate.sort) {
          paginationControl.sortBy = getBijlipayDate.sort[0].property;
          paginationControl.descending = getBijlipayDate.sort[0].ascending;
        }
      } finally {
        toggleAjaxLoadFilter.value = false;
      }
    };

    const dateClick = (value) => {
      addBasicInformation.action = value;
      loadingData({ pagination: paginationControl, filter: filter.value, date: value });
    };

    const fnResolve = (row) => {
      $q.dialog({
        title: "Confirm",
        message: "Are you sure?",
        cancel: true,
        ok: true,
      }).onOk(async () => {
        await ASSIGN_TO_COMPLETE({ ticketId: row.serviceReqTicketId, pagination: paginationControl, filter: filter.value });
        $q.notify({ color: "positive", message: "Successfully Resolved!", icon: "thumb_up" });
        loadingData({ pagination: paginationControl, filter: filter.value, date: addBasicInformation.action });
      }).onCancel(() => {
        $q.notify({ color: "negative", message: "No changes made!", icon: "thumb_down" });
      });
    };

    const fnEscalateToSat = (row) => {
      $q.dialog({
        title: "Confirm",
        message: "Are you sure?",
        cancel: true,
        ok: true,
      }).onOk(async () => {
        await ESCALATE_TO_SAT({ ticketId: row.serviceReqTicketId });
        $q.notify({ color: "positive", message: "Escalated To SAT!", icon: "thumb_up" });
        loadingData({ pagination: paginationControl, filter: filter.value, date: addBasicInformation.action });
      }).onCancel(() => {
        $q.notify({ color: "negative", message: "No changes made!", icon: "thumb_down" });
      });
    };

    const goToCompleteTab = (tab) => {
      if (tab === "tab-2") {
        ajaxLoadAllLeadInfo1({ pagination: paginationControl1, filter: filter1.value });
      } else {
        loadingData({ pagination: paginationControl, filter: filter.value, date: formData.date });
      }
    };

    const ajaxLoadAllLeadInfo1 = async ({ pagination, filter }) => {
      toggleAjaxLoadFilter1.value = true;
      try {
        await FETCH_BIJLIPAY_COMPLETED_DATA({ pagination, filter });
        paginationControl1.rowsNumber = getBijlipayCompletedData.totalElements;
        paginationControl1.page = getBijlipayCompletedData.number + 1;
        tableData1.value = getBijlipayCompletedData.content;
        if (getBijlipayCompletedData.sort) {
          paginationControl1.sortBy = getBijlipayCompletedData.sort[0].property;
          paginationControl1.descending = getBijlipayCompletedData.sort[0].ascending;
        }
      } finally {
        toggleAjaxLoadFilter1.value = false;
      }
    };

    const toggleAddremarks = (row) => {
      propToggleRemarks.value = !propToggleRemarks.value;
      if (row) {
        addBasicInformation.remarks = row;
        addBasicInformation.action = formData.date;
      }
    };

    // Load completed data initially
    onMounted(() => {
      ajaxLoadAllLeadInfo1({ pagination: paginationControl1, filter: filter1.value });
      loadingData({ pagination: paginationControl, filter: filter.value, date: formData.date });
    });

    return {
      $q,
      activeTab,
      filter,
      filter1,
      toggleAjaxLoadFilter,
      toggleAjaxLoadFilter1,
      paginationControl,
      paginationControl1,
      formData,
      propToggleRemarks,
      addBasicInformation,
      tableData,
      tableData1,
      dateType,
      columns,
      columns2,
      dateClick,
      fnResolve,
      fnEscalateToSat,
      goToCompleteTab,
      toggleAddremarks,
    };
  },
};
</script>

<style scoped>
.custom-green {
  color: #2e7d32;
}
.custom-negative {
  color: #d32f2f;
}
</style>
