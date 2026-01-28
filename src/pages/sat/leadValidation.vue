<template>
  <q-page>
    <div>
      <!-- Common lead information popup -->
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />

      <q-pull-to-refresh :distance="30" :handler="PullToRefresh" inline>
        <!-- Table title -->
        <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
          Lead Validation
        </div>

        <!-- Lead Validation Table -->
        <q-table
          title="Lead Validation"
          table-class="customTableClass"
          class="q-py-none"
          :rows="tableData"
          :columns="columns"
          row-key="leadId"
          :filter="filter"
          v-model:pagination="paginationControl"
          :rows-per-page-options="[5,10,15,20]"
          :loading="toggleAjaxLoadFilter"
          @request="ajaxLoadAllLeadInfo"
        >
          <!-- Date Column -->
          <template v-slot:body-cell-createdAt="props">
            {{ formatDate(props.row.date) }}
          </template>

          <!-- Lead Number Column -->
          <template v-slot:body-cell-leadNumber="props">
            <span
              class="label"
              :class="[props.row.priority ? 'text-negative text-weight-bolder' : 'text-primary']"
              style="cursor: pointer"
              @click="toggleLeadInformation(props.row)"
            >
              # {{ props.row.leadNumber }}
            </span>
          </template>

          <!-- Merchant Name -->
          <template v-slot:body-cell-leadName="props">
            <span class="capitalize">{{ props.row.merchantName }}</span>
          </template>

          <!-- State -->
          <template v-slot:body-cell-state="props">
            <span class="capitalize">{{ props.row.state }}</span>
          </template>

          <!-- Sales Officer -->
          <template v-slot:body-cell-salesOfficer="props">
            <span class="capitalize">{{ props.row.salesOfficerName + " | " + props.row.salesOfficerEmpId }}</span>
          </template>

          <!-- Lead Source -->
          <template v-slot:body-cell-leadSource="props">
            <span :class="{ 'text-red': props.row.leadSource === 'LS_TOHANDS' }">
              {{ props.row.leadSource }}
            </span>
          </template>

          <!-- Finance Approval -->
          <template v-slot:body-cell-verifiedFinanceStatus="props">
            <span class="label text-positive" v-if="props.row.verifiedFinanceStatus === $VERIFIED_FINANCE_STATUS_SUCCESS">
              Approved
            </span>
            <span class="label text-negative" v-else-if="props.row.verifiedFinanceStatus === $VERIFIED_FINANCE_STATUS_PENDING">
              Pending
            </span>
            <span class="label text-negative" v-else-if="props.row.verifiedFinanceStatus === $VERIFIED_FINANCE_STATUS_REJECT">
              Rejected
            </span>
            <span class="label" v-else>NA</span>
          </template>

          <!-- Status -->
          <template v-slot:body-cell-leadStatus="props">
            <span class="label text-primary" v-if="props.row.leadStatus === $LEAD_STATUS_DATA_ENTRY_PENDING">WIP</span>
            <span class="label text-orange" v-else-if="props.row.leadStatus === $LEAD_STATUS_SUBMITED_TO_MARS">With ops</span>
            <span class="label text-negative" v-else-if="props.row.leadStatus === $LEAD_STATUS_REFER_BACK">Referred Back</span>
            <span class="label text-grey-9" v-else>Pending</span>
          </template>

          <!-- Action Buttons -->
          <template v-slot:body-cell-action="props">
            <q-btn
              v-if="props.row.leadStatus === $LEAD_STATUS_DATA_ENTRY_PENDING"
              color="purple-9"
              outline
              push
              size="sm"
              @click="$router.push('/sat/lead/validation/' + props.row.leadId + '/data/entry')"
            >Data Entry</q-btn>

            <q-btn
              v-else-if="props.row.leadStatus === $LEAD_STATUS_SUBMITED_TO_MARS"
              color="purple-9"
              push
              disabled
              size="sm"
            >Pending with MARS</q-btn>

            <q-btn
              v-else-if="props.row.leadStatus === $LEAD_STATUS_SUBMIT_TO_SAT_LEAD && props.row.verifiedFinanceStatus === $VERIFIED_FINANCE_STATUS_SUCCESS"
              color="purple-9"
              outline
              push
              size="sm"
              :to="'/sat/lead/validation/' + props.row.leadId"
            >Validate</q-btn>

            <q-btn
              v-else-if="props.row.leadStatus === $LEAD_STATUS_REFER_BACK"
              color="amber-9"
              outline
              push
              size="sm"
              @click="$router.push('/sat/lead/validation/' + props.row.leadId)"
            >Referred Back</q-btn>

            <q-btn
              v-else-if="[
                $LEAD_STATUS_MARS_SUB_TID_PENDING,
                $LEAD_STATUS_BASE_TID_PENDING,
                $LEAD_STATUS_MARS_REFERRAL_BACK_DATA_ENTRY_PENDING
              ].includes(props.row.leadStatus)"
              color="amber-9"
              outline
              push
              size="sm"
              @click="$router.push('/sat/lead/validation/' + props.row.leadId + '/data/entry')"
            >
              {{ props.row.leadStatus === $LEAD_STATUS_MARS_REFERRAL_BACK_DATA_ENTRY_PENDING ? 'RB - data entry' : 'Sub Tid Validation' }}
            </q-btn>

            <q-btn
              v-else
              color="grey-9"
              outline
              push
              size="sm"
              disabled
            >Validate</q-btn>
          </template>

          <!-- Reject Lead Button -->
          <template v-slot:body-cell-rejectLead="props">
            <q-btn
              v-if="props.row.leadStatus === $LEAD_STATUS_SUBMIT_TO_SAT_LEAD"
              color="negative"
              outline
              push
              size="sm"
              class="q-mx-sm"
              @click="openRejectLead(props.row)"
            >Reject Lead</q-btn>
          </template>

          <!-- Top Slot: Search -->
          <template v-slot:top>
            <div class="col-md-5">
              <q-input
                filled
                clearable
                debounce="600"
                v-model="filter"
                placeholder="Search By Merchant Name, Lead ID, Lead Source.."
                dense
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </template>
        </q-table>
      </q-pull-to-refresh>

      <!-- Reject Lead Modal -->
      <openRejectLeadComp
        v-if="showRejectLeadModel"
        :showRejectLeadModel="showRejectLeadModel"
        :propShowRejectLeadComponent="propsRejectLeadAppend"
        @closeRejectLeadModel="openRejectLead"
      />
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import openRejectLeadComp from "../../components/sat/openRejectLeadComp.vue";
import dayjs from "dayjs";

export default {
  name: "leadValidation",
  components: { generalLeadInformation, openRejectLeadComp },
  data() {
    return {
      propToggleLeadInformation: false,
      showRejectLeadModel: false,
      addtnLeadInformation: null,
      filter: "",
      toggleAjaxLoadFilter: false,
      paginationControl: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: "leadNumber",
        descending: false
      },
      propsRejectLeadAppend: {},
      columns: [
        { name: "createdAt", label: "Date(C)", align: "left", field: "date", sortable: true },
        { name: "leadNumber", label: "Lead ID", align: "center", field: row => "# " + row.leadNumber, sortable: true },
        { name: "leadName", label: "Merchant Name", align: "left", field: "merchantName", sortable: true },
        { name: "state", label: "State", align: "left", field: "state", sortable: true },
        { name: "salesOfficer", label: "SO Name", align: "left", field: row => row.salesOfficerName + " | " + row.salesOfficerEmpId, sortable: true },
        { name: "leadSource", label: "Lead Source", align: "left", field: "leadSource", sortable: true },
        { name: "verifiedFinanceStatus", label: "Finance Approval", align: "left", field: row => {
          return row.verifiedFinanceStatus === this.$VERIFIED_FINANCE_STATUS_SUCCESS
            ? "Success"
            : row.verifiedFinanceStatus === this.$VERIFIED_FINANCE_STATUS_PENDING
            ? "Pending"
            : row.verifiedFinanceStatus === this.$VERIFIED_FINANCE_STATUS_REJECT
            ? "Rejected"
            : "NA";
        }, sortable: true },
        { name: "leadStatus", label: "Status", align: "left", field: "leadStatus", sortable: true },
        { name: "action", label: "", align: "left", field: "action", sortable: false },
        { name: "rejectLead", label: "", align: "left", field: "rejectLead", sortable: false },
      ],
      tableData: []
    };
  },
  computed: {
    ...mapGetters("SatLeadValidation", ["getAllLeadsValidationInfo"])
  },
  mounted() {
    this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filter });
  },
  methods: {
    ...mapActions("SatLeadValidation", ["FETCH_ALL_LEAD_VALIDATIONS_DATA"]),
    
    // Format date helper
    formatDate(date) {
      return date ? dayjs(date).format("DD MMM YYYY") : "";
    },

    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.$q.loading.show({ spinnerColor: "purple-9", message: "Fetching data .." });
      this.FETCH_ALL_LEAD_VALIDATIONS_DATA({ pagination, filter })
        .then(() => {
          this.tableData = this.getAllLeadsValidationInfo.content;
          this.paginationControl.rowsNumber = this.getAllLeadsValidationInfo.totalElements;
          this.paginationControl.page = this.getAllLeadsValidationInfo.number + 1;
          if (this.getAllLeadsValidationInfo.sort?.length) {
            this.paginationControl.sortBy = this.getAllLeadsValidationInfo.sort[0].property;
            this.paginationControl.descending = this.getAllLeadsValidationInfo.sort[0].ascending;
          }
        })
        .finally(() => {
          this.$q.loading.hide();
        });
    },

    openRejectLead(details) {
      this.showRejectLeadModel = !this.showRejectLeadModel;
      this.propsRejectLeadAppend = details;
    },

    PullToRefresh(done) {
      this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filter });
      done();
    },

    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails) this.addtnLeadInformation = leadDetails;
    }
  }
};
</script>

<style scoped>
.q-btn-flat,
.q-btn-outline {
  min-width: 100px !important;
}
</style>