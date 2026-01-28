<template>
  <q-page padding>

    <!-- Table Title -->
    <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
      Aggregator Lead Validation
    </div>

    <!-- General Lead Information Popup -->
    <generalLeadInformation
      v-if="propToggleLeadInformation"
      :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation"
      @closeLeadInformation="toggleLeadInformation"
    />

    <!-- Lead Validation Table -->
    <q-table
      table-class="customTableClass"
      :rows="tableData"
      :columns="columns"
      :filter="filter"
      v-model:pagination="paginationControl"
      row-key="leadNumber"
      :loading="toggleAjaxLoadFilter"
      :rows-per-page-options="[5,10,15,20]"
      @request="ajaxLoadAllLeadInfo"
    >

      <!-- Top Slot: Search -->
      <template v-slot:top>
        <div class="row items-center q-px-md q-py-sm bottom-border">
          <div class="col-5">
            <q-input
              v-model="filter"
              clearable
              placeholder="Type..."
              label="Search By Merchant Name, Lead ID.."
              dense
              outlined
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </div>
      </template>

      <!-- Custom Cells -->
      <template v-slot:body-cell-leadNumber="props">
        <span
          class="label text-primary cursor-pointer"
          @click="toggleLeadInformation(props.row)"
        >
          {{ props.row.leadNumber }}
        </span>
      </template>

      <template v-slot:body-cell-contactName="props">
        <span class="label text-primary">
          {{ props.row.leadInformation?.contactName || 'NA' }}
        </span>
      </template>

      <template v-slot:body-cell-date="props">
        <span>
          {{ props.row.date ? formatDate(props.row.date) : 'NA' }}
        </span>
      </template>

      <template v-slot:body-cell-verifiedFinanceStatus="props">
        <span
          v-if="props.row.verifiedFinanceStatus === $VERIFIED_FINANCE_STATUS_SUCCESS"
          class="label text-positive"
        >
          Approved
        </span>
        <span
          v-else-if="props.row.verifiedFinanceStatus === $VERIFIED_FINANCE_STATUS_PENDING"
          class="label text-negative"
        >
          Pending
        </span>
        <span
          v-else-if="props.row.verifiedFinanceStatus === $VERIFIED_FINANCE_STATUS_REJECT"
          class="label text-negative"
        >
          Rejected
        </span>
        <span v-else class="label">NA</span>
      </template>

      <template v-slot:body-cell-leadStatus="props">
        <q-btn
          v-if="props.row.leadStatus === $LEAD_STATUS_MARS_APPROVED"
          highlight
          push
          class="disabled"
          color="positive"
          size="sm"
        >
          Mars Approved
        </q-btn>

        <q-btn
          v-else-if="props.row.leadStatus === $LEAD_STATUS_SUBMITED_TO_MARS"
          highlight
          push
          class="disabled"
          color="purple-9"
          size="sm"
        >
          Submitted To Mars
        </q-btn>

        <span
          v-else-if="props.row.leadStatus === $LEAD_STATUS_DATA_ENTRY_PENDING"
          class="label text-primary"
        >
          WIP
        </span>

        <span v-else class="label text-negative">Pending</span>
      </template>

      <template v-slot:body-cell-mid="props">
        <span class="label text-primary"># {{ props.row.mid }}</span>
      </template>

      <template v-slot:body-cell-contactNumber="props">
        <span class="label text-primary">
          {{ props.row.leadInformation?.contactNumber || 'NA' }}
        </span>
      </template>

      <template v-slot:body-cell-leadAddress="props">
        <span>
          {{ props.row.leadInformation?.leadAddress || 'NA' }}
        </span>
      </template>

    </q-table>

    <!-- Merchant Transaction Details Popup -->
    <showMerchantTransactionLevelDetails
      v-if="valueToggleMerchantTransaction"
      :valueToggleMerchantTransaction="valueToggleMerchantTransaction"
      @revertRowClick="rowClick"
    />

    <!-- PhonePe Validation Popup -->
    <Phonepe_validation
      v-if="propShowLeadNumberDetails"
      :propShowLeadNumberDetails="propShowLeadNumberDetails"
      :propRowDetails="propRowDetails"
    />

    <!-- Ajax Spinner Overlay -->
    <div v-if="toggleAjaxLoadFilter || toggleAjaxLoadFilter1" class="fullscreen spinner-overlay">
      <q-spinner-bars class="absolute-center" :size="35" color="#61116a" />
    </div>

  </q-page>
</template>

<script>
import { ref, reactive } from 'vue';
import { mapGetters, mapActions } from 'vuex';

import showMerchantTransactionLevelDetails from '../../components/sat/showMerchantTransactionLevelDetails.vue';
import generalLeadInformation from '../../components/generalLeadInformation.vue';
import Phonepe_validation from '../../components/sat/Phonepe_validation.vue';

export default {
  name: 'getaggregatorLeadValidationData',

  components: {
    showMerchantTransactionLevelDetails,
    generalLeadInformation,
    Phonepe_validation
  },

  setup() {
    const tableData = ref([]);
    const filter = ref('');
    const toggleAjaxLoadFilter = ref(false);
    const toggleAjaxLoadFilter1 = ref(false);
    const propToggleLeadInformation = ref(false);
    const addtnLeadInformation = ref(null);
    const propShowLeadNumberDetails = ref(false);
    const propRowDetails = ref('');
    const valueToggleMerchantTransaction = ref(false);

    const paginationControl = reactive({
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
      sortBy: 'leadNumber',
      descending: false
    });

    const formatDate = (date) => {
      return date ? new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) : 'NA';
    };

    return {
      tableData,
      filter,
      toggleAjaxLoadFilter,
      toggleAjaxLoadFilter1,
      propToggleLeadInformation,
      addtnLeadInformation,
      propShowLeadNumberDetails,
      propRowDetails,
      valueToggleMerchantTransaction,
      paginationControl,
      formatDate
    };
  },

  computed: {
    ...mapGetters('aggregatorLeadValidation', ['getaggregatorLeadValidationData'])
  },

  mounted() {
    this.ajaxLoadAllLeadInfo({
      pagination: this.paginationControl,
      filter: this.filter
    });
  },

  methods: {
    ...mapActions('aggregatorLeadValidation', ['FETCH_AGGREGATOR_LEAD_VALIDATION_DATAS']),

    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails) this.addtnLeadInformation = leadDetails;
    },

    getLeadNumberDetails(rowDetails) {
      this.propShowLeadNumberDetails = !this.propShowLeadNumberDetails;
      if (rowDetails) this.propRowDetails = rowDetails;
    },

    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.toggleAjaxLoadFilter = true;
      this.$q.loading.show({
        delay: 0,
        spinnerColor: 'purple-9',
        message: 'Fetching data ..'
      });

      this.FETCH_AGGREGATOR_LEAD_VALIDATION_DATAS({ pagination, filter })
        .then(() => {
          this.toggleAjaxLoadFilter = false;
          this.paginationControl.rowsNumber = this.getaggregatorLeadValidationData.totalElements;
          this.paginationControl.page = this.getaggregatorLeadValidationData.number + 1;
          this.tableData = this.getaggregatorLeadValidationData.content;

          if (this.getaggregatorLeadValidationData.sort) {
            this.paginationControl.sortBy = this.getaggregatorLeadValidationData.sort[0].property;
            this.paginationControl.descending = this.getaggregatorLeadValidationData.sort[0].ascending;
          }

          this.$q.loading.hide();
        })
        .catch(() => {
          this.toggleAjaxLoadFilter = false;
          this.$q.loading.hide();
        });
    },
  },

  data() {
    return {
      columns: [
        { name: 'date', label: 'Date', align: 'left', field: 'date', sortable: false },
        { name: 'leadNumber', label: 'Lead Number', align: 'left', field: 'leadNumber', sortable: true },
        { name: 'leadId', label: 'Lead Id', align: 'left', field: 'leadId', sortable: false },
        { name: 'merchantName', label: 'Merchant Name', align: 'left', field: 'merchantName', sortable: false },
        { name: 'state', label: 'State', align: 'center', field: 'state', sortable: false },
        {
          name: 'salesOfficerName',
          label: 'SO Name',
          align: 'center',
          field: row => `${row.salesOfficerName} | ${row.salesOfficerEmpId}`,
          sortable: false
        },
        {
          name: 'verifiedFinanceStatus',
          label: 'Finance Approval',
          align: 'left',
          field: row => {
            return row.verifiedFinanceStatus === this.$VERIFIED_FINANCE_STATUS_SUCCESS
              ? 'Success'
              : row.verifiedFinanceStatus === this.$VERIFIED_FINANCE_STATUS_PENDING
              ? 'Pending'
              : row.verifiedFinanceStatus === this.$VERIFIED_FINANCE_STATUS_REJECT
              ? 'Rejected'
              : 'NA';
          },
          sortable: true
        },
        { name: 'leadStatus', label: 'Status', align: 'center', field: 'leadStatus', sortable: true }
      ]
    };
  }
};
</script>

<style scoped>
.spinner-overlay {
  background-color: rgba(255, 255, 255, 0.7);
}
</style>
