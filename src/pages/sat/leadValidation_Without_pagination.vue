<template>
  <q-page>
    <div>
      <!-- Common lead information in popup -->
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :propLeadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />

      <q-pull-to-refresh :distance="30" :handler="PullToRefresh" inline>
        <!-- Table title -->
        <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
          Lead Validation
        </div>

        <!-- Lead validation table -->
        <q-table
          title="Lead Validation"
          table-class="customTableClass"
          class="q-py-none"
          :rows="tableData"
          :columns="columns"
          row-key="id"
          :filter="filter"
          v-model:pagination="paginationControl"
        >
          <!-- Table body slots -->
          <template v-slot:body-cell-date="props">
            {{ formatDate(props.row.submitteSATDate) }}
          </template>

          <template v-slot:body-cell-lead_id="props">
            <span
              class="label"
              :class="[props.row.priority ? 'text-negative text-weight-bolder' : 'text-primary']"
              @click="toggleLeadInformation(props.row)"
              style="cursor:pointer"
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
            <span v-if="props.row.createdBy" class="capitalize">{{ props.row.createdBy.name }}</span>
            <span v-else>NA</span>
          </template>

          <template v-slot:body-cell-finance_approval="props">
            <span
              v-if="props.row.verifiedFinanceStatus === $VERIFIED_FINANCE_STATUS_SUCCESS"
              class="label text-positive"
            >Approved</span>
            <span
              v-else-if="props.row.verifiedFinanceStatus === $VERIFIED_FINANCE_STATUS_PENDING"
              class="label text-negative"
            >Pending</span>
            <span
              v-else-if="props.row.verifiedFinanceStatus === $VERIFIED_FINANCE_STATUS_REJECT"
              class="label text-negative"
            >Rejected</span>
            <span v-else class="label">NA</span>
          </template>

          <template v-slot:body-cell-status="props">
            <span
              v-if="props.row.leadStatus === $LEAD_STATUS_DATA_ENTRY_PENDING"
              class="label text-primary"
            >WIP</span>
            <span
              v-else-if="props.row.leadStatus === $LEAD_STATUS_SUBMITED_TO_MARS"
              class="label text-orange"
            >With ops</span>
            <span
              v-else-if="props.row.leadStatus === $LEAD_STATUS_REFER_BACK"
              class="label text-negative"
            >Referred Back</span>
            <span v-else class="label text-grey-9">Pending</span>
          </template>

          <template v-slot:body-cell-action="props">
            <q-btn
              v-if="props.row.leadStatus === $LEAD_STATUS_DATA_ENTRY_PENDING"
              color="purple-9"
              outline
              push
              size="sm"
              @click="$router.push('/sat/lead/validation/' + props.row.id + '/data/entry')"
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
              :to="'/sat/lead/validation/' + props.row.id"
            >Validate</q-btn>

            <q-btn
              v-else-if="props.row.leadStatus === $LEAD_STATUS_REFER_BACK"
              color="amber-9"
              outline
              push
              size="sm"
              @click="$router.push('/sat/lead/validation/' + props.row.id)"
            >Referred Back</q-btn>

            <q-btn
              v-else-if="props.row.leadStatus === $LEAD_STATUS_MARS_REFERRAL_BACK_DATA_ENTRY_PENDING"
              color="amber-9"
              outline
              push
              size="sm"
              @click="$router.push('/sat/lead/validation/' + props.row.id + '/data/entry')"
            >RB - data entry</q-btn>

            <q-btn
              v-else
              color="grey-9"
              outline
              push
              size="sm"
              disabled
            >Validate</q-btn>
          </template>

          <!-- Top slot: Search -->
          <template v-slot:top>
            <div class="col-md-5">
              <q-input
                filled
                clearable
                debounce="300"
                v-model="filter"
                placeholder="Search by SO name, Merchant Name, Lead ID"
                class="q-mr-lg q-py-sm"
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
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import { date } from 'quasar'

export default {
  name: "leadValidation",
  components: { generalLeadInformation },
  data() {
    return {
      propToggleLeadInformation: false,
      addtnLeadInformation: null,
      filter: "",
      paginationControl: { rowsPerPage: 10, page: 1 },
      columns: [
        { 
          name: "date", 
          label: "Date(C)", 
          align: "left", 
          field: "submitteSATDate", 
          sortable: true,
          format: (val) => this.formatDate(val) 
        },
        { name: "lead_id", label: "Lead ID", align: "center", field: row => "# " + row.leadNumber, sortable: true },
        { name: "leadName", label: "Merchant Name", align: "left", field: "leadName", sortable: true },
        { name: "state", label: "State", align: "left", field: "state", sortable: true },
        { name: "so_name", label: "SO Name", align: "left", field: row => (row.createdBy ? row.createdBy.name : "NA"), sortable: true },
        { name: "finance_approval", label: "Finance Approval", align: "left", field: row => {
          return row.verifiedFinanceStatus === this.$VERIFIED_FINANCE_STATUS_SUCCESS
            ? "Success"
            : row.verifiedFinanceStatus === this.$VERIFIED_FINANCE_STATUS_PENDING
            ? "Pending"
            : row.verifiedFinanceStatus === this.$VERIFIED_FINANCE_STATUS_REJECT
            ? "Rejected"
            : "NA";
        }, sortable: true },
        { name: "status", label: "Status", align: "left", field: "status", sortable: true },
        { name: "action", label: "", align: "left", field: "action", sortable: true },
      ],
      tableData: []
    };
  },
  computed: {
    ...mapGetters("SatLeadValidation", ["getAllLeadsValidationInfo"])
  },
  created() {
    this.loadAllLeadInfo();
  },
  methods: {
    ...mapActions("SatLeadValidation", ["FETCH_ALL_LEAD_VALIDATIONS_DATA"]),
    
    loadAllLeadInfo() {
      this.$q.loading.show({ spinnerColor: "purple-9", message: "Fetching data .." });
      this.FETCH_ALL_LEAD_VALIDATIONS_DATA()
        .then(() => {
          this.tableData = this.getAllLeadsValidationInfo;
        })
        .finally(() => {
          this.$q.loading.hide();
        });
    },

    PullToRefresh(done) {
      this.FETCH_ALL_LEAD_VALIDATIONS_DATA()
        .then(() => {
          this.tableData = this.getAllLeadsValidationInfo;
        })
        .finally(() => done());
    },

    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails) this.addtnLeadInformation = leadDetails;
    },

    formatDate(dateString) {
      if (!dateString) return '';
      
      try {
        const dateObj = new Date(dateString);
        if (isNaN(dateObj.getTime())) return dateString;
        
        return date.formatDate(dateObj, 'Do MMM Y');
      } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
      }
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