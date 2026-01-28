<template>
  <div>
    <q-dialog
      v-model="opened"
      persistent
      maximized
      class="q-mt-lg capitalize"
      @hide="emitToggleRemarks"
    >
      <q-card :style="{ padding: '50px 20px' }">
        <!-- Common Lead Information Popup -->
        <generalLeadInformation
          v-if="propToggleLeadInformation"
          :propLeadInformation="addtnLeadInformation"
          :propToggleLeadInformationPop="propToggleLeadInformation"
          @closeLeadInformation="toggleLeadInformation"
        />

        <!-- Header -->
        <q-card-section class="row items-center bottom-border q-py-sm">
          <div class="col">Lead Information</div>
          <div class="col-auto">
            <q-btn
              round
              size="sm"
              outline
              color="dark"
              icon="clear"
              @click="emitToggleRemarks"
            />
          </div>
        </q-card-section>

        <!-- Table Filter -->
        <q-card-section class="bottom-border row q-pt-none q-pb-md">
          <div class="col-md-5">
            <q-input
              outlined
              clearable
              dense
              v-model="filter"
              placeholder="Type.."
              label="Search by SO name, Merchant Name, Lead ID"
            />
          </div>
        </q-card-section>

        <!-- Lead Table -->
        <q-table
          title="Lead Validation"
          :columns="columns"
          :rows="tableData"
          row-key="leadNumber"
          :filter="filter"
          flat
          dense
          grid
        >
          <!-- Table Custom Cells -->
          <template v-slot:body-cell-createdAt="props">
            {{ formatDate(props.row.createdAt) }}
          </template>

          <template v-slot:body-cell-lead_id="props">
            <span
              class="cursor-pointer"
              :class="[
                props.row.priority ? 'text-negative text-weight-bold' : 'text-primary'
              ]"
              @click="toggleLeadInformation(props.row)"
            >
              # {{ props.row.leadNumber }}
            </span>
          </template>

          <template v-slot:body-cell-leadName="props">
            <span class="capitalize">{{ props.row.leadName }}</span>
          </template>

          <template v-slot:body-cell-state="props">
            <span class="capitalize">{{ props.row.state }}</span>
          </template>

          <template v-slot:body-cell-so_name="props">
            <span v-if="props.row.createdBy">{{ props.row.createdBy.name }}</span>
            <span v-else>NA</span>
          </template>

          <template v-slot:body-cell-finance_approval="props">
            <span
              v-if="props.row.verifiedFinanceStatus === VERIFIED_FINANCE_STATUS_SUCCESS"
              class="label text-positive"
            >
              Approved
            </span>
            <span
              v-else-if="props.row.verifiedFinanceStatus === VERIFIED_FINANCE_STATUS_PENDING"
              class="label text-negative"
            >
              Pending
            </span>
            <span
              v-else-if="props.row.verifiedFinanceStatus === VERIFIED_FINANCE_STATUS_REJECT"
              class="label text-negative"
            >
              Rejected
            </span>
            <span v-else class="label">NA</span>
          </template>

          <template v-slot:body-cell-status="props">
            <span
              v-if="props.row.verifiedFinanceStatus === LEAD_STATUS_SUBMIT_TO_SAT_LEAD && props.row.verifiedFinanceStatus === VERIFIED_FINANCE_STATUS_SUCCESS"
              class="label text-positive"
            >
              New
            </span>
            <span
              v-if="props.row.verifiedFinanceStatus === LEAD_STATUS_SUBMIT_TO_SAT_LEAD && props.row.verifiedFinanceStatus === VERIFIED_DOCUMENT_STATUS_REJECT"
              class="label text-negative"
            >
              Rejected
            </span>
            <span
              v-else-if="props.row.leadStatus === LEAD_STATUS_DATA_ENTRY_PENDING"
              class="label text-primary"
            >
              WIP
            </span>
            <span
              v-else-if="props.row.leadStatus === LEAD_STATUS_SUBMITED_TO_MARS"
              class="label text-orange"
            >
              With ops
            </span>
            <span v-else class="label text-negative">Pending</span>
          </template>
        </q-table>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import generalLeadInformation from "../generalLeadInformation.vue";
import moment from "moment";

// Status constants - define these based on your application's constants
const VERIFIED_FINANCE_STATUS_SUCCESS = 1; // Adjust based on your actual values
const VERIFIED_FINANCE_STATUS_PENDING = 2;
const VERIFIED_FINANCE_STATUS_REJECT = 3;
const VERIFIED_DOCUMENT_STATUS_REJECT = 4; // Adjust based on your actual values
const LEAD_STATUS_SUBMIT_TO_SAT_LEAD = 5; // Adjust based on your actual values
const LEAD_STATUS_DATA_ENTRY_PENDING = 6;
const LEAD_STATUS_SUBMITED_TO_MARS = 7;
const SALES_MANAGER_STATUS_SHORT_LEADS = 'shortLeads';
const SALES_MANAGER_STATUS_WIP_LEADS = 'wipLeads';
const SALES_MANAGER_STATUS_REJECTED_LEADS = 'rejectedLeads';
const SALES_MANAGER_STATUS_SUBMIT_TO_SAT_LEADS = 'submitToSatLeads';
const SALES_MANAGER_STATUS_IMPLEMENTATION_LEADS = 'implementationLeads';

export default {
  components: { generalLeadInformation },
  props: {
    propUserId: { type: [String, Number], required: true },
    propToggleLeadInformationModal: { type: Boolean, required: true },
    propAction: { type: String, required: true }
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const store = useStore();
    
    const opened = ref(props.propToggleLeadInformationModal);
    const propToggleLeadInformation = ref(false);
    const addtnLeadInformation = ref(null);
    const filter = ref("");
    const tableData = ref([]);

    // Computed property for store data
    const getuserBasedLeadsData = computed(() => store.getters['SM_LeadStatusInDetail/getuserBasedLeadsData']);

    const columns = [
      { name: "createdAt", label: "Date(C)", align: "left", field: "createdAt", sortable: true },
      { name: "lead_id", label: "Lead ID", align: "center", field: "leadNumber", sortable: true },
      { name: "leadName", label: "Merchant Name", align: "left", field: "leadName", sortable: true },
      { name: "state", label: "State", align: "left", field: "state", sortable: true },
      { name: "so_name", label: "SO Name", align: "left", field: row => row.createdBy?.name || "NA", sortable: true },
      {
        name: "finance_approval",
        label: "Finance Approval",
        align: "left",
        field: row =>
          row.verifiedFinanceStatus === VERIFIED_FINANCE_STATUS_SUCCESS
            ? "Success"
            : row.verifiedFinanceStatus === VERIFIED_FINANCE_STATUS_PENDING
            ? "Pending"
            : row.verifiedFinanceStatus === VERIFIED_FINANCE_STATUS_REJECT
            ? "Rejected"
            : "NA",
        sortable: true
      },
      { name: "status", label: "Status", align: "left", field: "status", sortable: true },
      { name: "action", label: "", align: "left", field: "action", sortable: false }
    ];

    const emitToggleRemarks = () => {
      emit("fetchCurrentUserLeads");
    };

    const toggleLeadInformation = leadDetails => {
      propToggleLeadInformation.value = !propToggleLeadInformation.value;
      if (leadDetails) addtnLeadInformation.value = leadDetails;
    };

    const formatDate = date => (date ? moment(date).format("Do MMM Y") : "");

    const ajaxLoadAllLeadInfo = async () => {
      $q.loading.show({ delay: 0, spinnerColor: "purple-9" });
      tableData.value = [];

      try {
        await store.dispatch('SM_LeadStatusInDetail/FETCH_ALL_SALES_MANAGER_LEAD_VALIDATIONS_DATA', {
          userId: props.propUserId,
          action: props.propAction
        });

        const leadList = getuserBasedLeadsData.value?.leadList || {};

        switch (props.propAction) {
          case SALES_MANAGER_STATUS_SHORT_LEADS:
            tableData.value = leadList.shortLeads || [];
            break;
          case SALES_MANAGER_STATUS_WIP_LEADS:
            tableData.value = leadList.submitToSatLeads || [];
            break;
          case SALES_MANAGER_STATUS_REJECTED_LEADS:
            tableData.value = leadList.rejectedLeads || [];
            break;
          case SALES_MANAGER_STATUS_SUBMIT_TO_SAT_LEADS:
            tableData.value = leadList.submitToSatLeads || [];
            break;
          case SALES_MANAGER_STATUS_IMPLEMENTATION_LEADS:
            tableData.value = leadList.implementedLeads || [];
            break;
          default:
            tableData.value = [];
        }
      } catch (error) {
        console.error('Error loading lead info:', error);
      } finally {
        $q.loading.hide();
      }
    };

    onMounted(() => ajaxLoadAllLeadInfo());

    return {
      opened,
      propToggleLeadInformation,
      addtnLeadInformation,
      columns,
      tableData,
      filter,
      emitToggleRemarks,
      toggleLeadInformation,
      formatDate,
      // Export constants for template use
      VERIFIED_FINANCE_STATUS_SUCCESS,
      VERIFIED_FINANCE_STATUS_PENDING,
      VERIFIED_FINANCE_STATUS_REJECT,
      VERIFIED_DOCUMENT_STATUS_REJECT,
      LEAD_STATUS_SUBMIT_TO_SAT_LEAD,
      LEAD_STATUS_DATA_ENTRY_PENDING,
      LEAD_STATUS_SUBMITED_TO_MARS
    };
  }
};
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.label {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
}

.capitalize {
  text-transform: capitalize;
}
</style>