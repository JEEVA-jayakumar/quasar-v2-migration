<template>
  <q-page padding>
    <!-- Lead Information Popup -->
    <generalLeadInformation
      v-if="propToggleLeadInformation.value"
      :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation.value"
      @closeLeadInformation="toggleLeadInformation"
    />

    <!-- Pull to refresh -->
    <q-pull-to-refresh :distance="30" inline @refresh="pullToRefresh">
      
      <!-- Table Title -->
      <div class="col-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Lead Validation
      </div>

      <!-- Lead Validation Table -->
      <q-table
        title="Lead Validation"
        table-class="customTableClass"
        class="q-py-none"
        :rows="tableData"
        :columns="columns"
        row-key="leadNumber"
        :filter="filter"
        v-model:pagination="paginationControl"
        :rows-per-page-options="[5, 10, 15, 20]"
        :loading="toggleAjaxLoadFilter"
        @request="ajaxLoadAllLeadInfo"
      >

        <!-- Slots for body cells using Vue 3 v-slot syntax -->
        <template v-slot:body-cell-createdAt="props">
          {{ formatDate(props.row.date) }}
        </template>

        <template v-slot:body-cell-leadNumber="props">
          <span
            class="label"
            :class="[props.row.priority ? 'text-negative text-weight-bolder' : 'text-primary']"
            style="cursor:pointer"
            @click="toggleLeadInformation(props.row)"
          ># {{ props.row.leadNumber }}</span>
        </template>

        <template v-slot:body-cell-leadName="props">
          <span class="capitalize">{{ props.row.merchantName }}</span>
        </template>

        <template v-slot:body-cell-state="props">
          <span class="capitalize">{{ props.row.state }}</span>
        </template>

        <!-- FIXED: Changed from assignedTo.name to assignedToName -->
        <template v-slot:body-cell-assignedToName="props">
          <span class="capitalize">{{ props.row.salesOfficerName }}</span>
        </template>

        <template v-slot:body-cell-verifiedFinanceStatus="props">
          <span class="label text-positive" v-if="props.row.verifiedFinanceStatus === VERIFIED_FINANCE_STATUS_SUCCESS">Approved</span>
          <span class="label text-negative" v-else-if="props.row.verifiedFinanceStatus === VERIFIED_FINANCE_STATUS_PENDING">Pending</span>
          <span class="label text-negative" v-else-if="props.row.verifiedFinanceStatus === VERIFIED_FINANCE_STATUS_REJECT">Rejected</span>
          <span class="label" v-else>NA</span>
        </template>

        <template v-slot:body-cell-leadStatus="props">
          <span class="label text-positive" v-if="props.row.leadStatus === LEAD_STATUS_SUBMIT_TO_SAT_LEAD && props.row.verifiedFinanceStatus === VERIFIED_FINANCE_STATUS_SUCCESS">New</span>
          <span class="label text-negative" v-else-if="props.row.leadStatus === LEAD_STATUS_SUBMIT_TO_SAT_LEAD && props.row.verifiedFinanceStatus === VERIFIED_DOCUMENT_STATUS_REJECT">Rejected</span>
          <span class="label text-primary" v-else-if="props.row.leadStatus === LEAD_STATUS_DATA_ENTRY_PENDING">WIP</span>
          <span class="label text-orange" v-else-if="props.row.leadStatus === LEAD_STATUS_SUBMITED_TO_MARS">With ops</span>
          <span class="label text-negative" v-else>Pending</span>
        </template>

        <template v-slot:body-cell-action="props">
          <q-btn
            v-if="props.row.leadStatus === LEAD_STATUS_DATA_ENTRY_PENDING"
            color="purple-9"
            outline
            push
            highlight
            size="sm"
            @click="$router.push('/sat/lead/validation/' + props.row.leadId + '/data/entry')"
          >Data Entry</q-btn>

          <q-btn
            v-else-if="props.row.leadStatus === LEAD_STATUS_SUBMITED_TO_MARS"
            color="purple-9"
            push
            highlight
            class="disabled"
            size="sm"
          >Pending with MARS</q-btn>

          <q-btn
            v-else-if="props.row.leadStatus === LEAD_STATUS_SUBMIT_TO_SAT_LEAD && props.row.verifiedFinanceStatus === VERIFIED_FINANCE_STATUS_SUCCESS"
            color="purple-9"
            outline
            push
            highlight
            size="sm"
            :to="'/sat/lead/validation/' + props.row.leadId"
          >Validate</q-btn>

          <q-btn
            v-else-if="props.row.leadStatus === LEAD_STATUS_REFER_BACK"
            color="amber-9"
            outline
            push
            highlight
            size="sm"
            @click="$router.push('/sat/lead/validation/' + props.row.leadId)"
          >Referred Back</q-btn>

          <q-btn
            v-else-if="props.row.leadStatus === LEAD_STATUS_MARS_REFERRAL_BACK_DATA_ENTRY_PENDING"
            color="amber-9"
            outline
            push
            highlight
            size="sm"
            @click="$router.push('/sat/lead/validation/' + props.row.leadId + '/data/entry')"
          >RB - data entry</q-btn>

          <q-btn v-else class="disabled" outline push highlight color="grey-9" size="sm">Validate</q-btn>
        </template>

        <template v-slot:body-cell-rejectLead="props">
          <q-btn
            v-if="props.row.leadStatus === LEAD_STATUS_SUBMIT_TO_SAT_LEAD"
            color="negative"
            outline
            push
            highlight
            class="q-mx-sm"
            size="sm"
            @click="openRejectLead(props.row)"
          >Reject Lead</q-btn>
        </template>

        <!-- Table Top Slot for Filter -->
        <template v-slot:top>
          <div class="col-md-5">
            <q-search
              v-model="filter"
              clearable
              debounce="600"
              placeholder="Type.."
              float-label="Search .."
              color="grey-9"
              class="q-py-sm q-mr-lg"
            />
          </div>
        </template>
      </q-table>
    </q-pull-to-refresh>

    <!-- Reject Lead Modal -->
    <openRejectLeadComp
      v-if="showRejectLeadModel.value"
      :showRejectLeadModel="showRejectLeadModel.value"
      :propShowRejectLeadComponent="propsRejectLeadAppend"
      @closeRejectLeadModel="openRejectLead"
    />
  </q-page>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import openRejectLeadComp from "../../components/sat/openRejectLeadComp.vue";

export default {
  name: "leadValidation",
  components: { generalLeadInformation, openRejectLeadComp },
  setup() {
    const store = useStore();
    const $q = useQuasar();

    // Reactive refs
    const propToggleLeadInformation = ref(false);
    const showRejectLeadModel = ref(false);
    const addtnLeadInformation = ref(null);
    const propsRejectLeadAppend = ref({});
    const filter = ref("");
    const toggleAjaxLoadFilter = ref(false);
    const tableData = ref([]);

    const paginationControl = reactive({
      rowsNumber: 10,
      page: 1,
      sortBy: "leadNumber",
      descending: false,
      rowsPerPage: 10
    });

    // Constants (replace with Vuex or global if required)
    const VERIFIED_FINANCE_STATUS_SUCCESS = 1;
    const VERIFIED_FINANCE_STATUS_PENDING = 2;
    const VERIFIED_FINANCE_STATUS_REJECT = 3;
    const VERIFIED_DOCUMENT_STATUS_REJECT = 4;
    const LEAD_STATUS_SUBMIT_TO_SAT_LEAD = 10;
    const LEAD_STATUS_DATA_ENTRY_PENDING = 20;
    const LEAD_STATUS_SUBMITED_TO_MARS = 30;
    const LEAD_STATUS_REFER_BACK = 40;
    const LEAD_STATUS_MARS_REFERRAL_BACK_DATA_ENTRY_PENDING = 50;

    // Table Columns - FIXED: Changed "assignedTo.name" to "assignedToName"
    const columns = [
      { name: "createdAt", label: "Date(C)", align: "left", field: "date", sortable: true },
      { name: "leadNumber", label: "Lead ID", align: "center", field: row => "# " + row.leadNumber, sortable: true },
      { name: "leadName", label: "Merchant Name", align: "left", field: "merchantName", sortable: true },
      { name: "state", label: "State", align: "left", field: "state", sortable: true },
      { name: "assignedToName", label: "SO Name", align: "left", field: row => row.salesOfficerName, sortable: true }, // Fixed
      { name: "verifiedFinanceStatus", label: "Finance Approval", align: "left", field: row =>
          row.verifiedFinanceStatus === VERIFIED_FINANCE_STATUS_SUCCESS ? "Success" :
          row.verifiedFinanceStatus === VERIFIED_FINANCE_STATUS_PENDING ? "Pending" :
          row.verifiedFinanceStatus === VERIFIED_FINANCE_STATUS_REJECT ? "Rejected" : "NA", sortable: true
      },
      { name: "leadStatus", label: "Status", align: "left", field: "leadStatus", sortable: true },
      { name: "action", label: "", align: "left", field: "action", sortable: false },
      { name: "rejectLead", label: "", align: "left", field: "rejectLead", sortable: false },
    ];

    // Format date helper
    const formatDate = (dateStr) => {
      return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    };

    // Fetch lead data
    const ajaxLoadAllLeadInfo = async ({ pagination = paginationControl, filter: f = filter.value } = {}) => {
      $q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });
      try {
        await store.dispatch("SatLeadValidation/FETCH_ALL_LEAD_VALIDATIONS_DATA", { pagination, filter: f });
        const data = store.getters["SatLeadValidation/getAllLeadsValidationInfo"];
        tableData.value = data.content;
        paginationControl.rowsNumber = data.totalElements;
        paginationControl.page = data.number + 1;
        if (data.sort) {
          paginationControl.sortBy = data.sort[0].property;
          paginationControl.descending = data.sort[0].ascending;
        }
      } finally {
        $q.loading.hide();
      }
    };

    // Toggle Lead Information popup
    const toggleLeadInformation = (leadDetails) => {
      propToggleLeadInformation.value = !propToggleLeadInformation.value;
      if (leadDetails) addtnLeadInformation.value = leadDetails;
    };

    // Open Reject Lead modal
    const openRejectLead = (details) => {
      showRejectLeadModel.value = !showRejectLeadModel.value;
      propsRejectLeadAppend.value = details;
    };

    // Pull-to-refresh
    const pullToRefresh = async (done) => {
      await ajaxLoadAllLeadInfo();
      done();
    };

    // Load initial data
    onMounted(() => {
      ajaxLoadAllLeadInfo();
    });

    return {
      propToggleLeadInformation,
      showRejectLeadModel,
      addtnLeadInformation,
      propsRejectLeadAppend,
      tableData,
      columns,
      paginationControl,
      toggleAjaxLoadFilter,
      filter,
      formatDate,
      toggleLeadInformation,
      openRejectLead,
      pullToRefresh,

      // Constants for template
      VERIFIED_FINANCE_STATUS_SUCCESS,
      VERIFIED_FINANCE_STATUS_PENDING,
      VERIFIED_FINANCE_STATUS_REJECT,
      VERIFIED_DOCUMENT_STATUS_REJECT,
      LEAD_STATUS_SUBMIT_TO_SAT_LEAD,
      LEAD_STATUS_DATA_ENTRY_PENDING,
      LEAD_STATUS_SUBMITED_TO_MARS,
      LEAD_STATUS_REFER_BACK,
      LEAD_STATUS_MARS_REFERRAL_BACK_DATA_ENTRY_PENDING
    };
  }
};
</script>

<style scoped>
.q-btn-flat,
.q-btn-outline {
  min-width: 100px !important;
}
</style>