<template>
  <q-page padding>
    <div>
      <!-- Table Title -->
      <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
        Aggregator Master Tracker - Implemented
      </div>

      <!-- General Lead Information Popup -->
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />

      <!-- QTable -->
      <q-table
        table-class="customTableClass"
        :rows="tableData"
        :columns="columns"
        :filter="filter"
        v-model:pagination="paginationControl"
        row-key="tid"
        :loading="toggleAjaxLoadFilter"
        :rows-per-page-options="[5,10,15,20,25]"
        @request="ajaxLoadAllLeadInfo"
      >

        <!-- Top Slot: Search & Download -->
        <template v-slot:top>
          <div class="row items-center q-px-md q-py-sm bottom-border">
            <div class="col-5">
              <q-input
                v-model="filter"
                clearable
                dense
                outlined
                placeholder="Type.."
                label="Search by MID, TID, Merchant Name"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-6 text-right">
              <q-btn 
                square 
                outline 
                color="purple-9" 
                label="Download as Excel" 
                size="md" 
                @click="downloadAggrMasterTrackerList" 
              />
            </div>
          </div>
        </template>

        <!-- Body Cell Templates -->
        <template v-slot:body-cell-tid="props">
          <span class="label text-primary"># {{ props.row.tid }}</span>
        </template>

        <template v-slot:body-cell-mid="props">
          <span class="label text-primary"># {{ props.row.mid }}</span>
        </template>

        <template v-slot:body-cell-leadNumber="props">
          <span
            class="label text-primary cursor-pointer"
            @click="toggleLeadInformation(props.row.leadInformation)"
          >
            # {{ props.row.leadInformation?.leadNumber || 'NA' }}
          </span>
        </template>

        <template v-slot:body-cell-mobileNumber="props">
          <span>
            {{ props.row.leadInformation?.contactNumber || 'NA' }}
          </span>
        </template>

        <template v-slot:body-cell-leadAddress="props">
          <span>
            {{ props.row.leadInformation?.leadAddress || 'NA' }}
          </span>
        </template>

        <template v-slot:body-cell-deviceStatusDate="props">
          <span>
            {{ formatDate(props.row.deviceStatusDate) }}
          </span>
        </template>

      </q-table>

      <!-- Download Aggr Master Tracker Popup -->
      <DownloadAggrMasterTracker
        v-if="propAggrMasterTrackerList"
        :propAggrMasterTrackerList="propAggrMasterTrackerList"
        @emitfnshowAggrMasterTrackerList="downloadAggrMasterTrackerList"
      />

      <!-- Merchant Transaction Details Popup -->
      <showMerchantTransactionLevelDetails
        v-if="valueToggleMerchantTransaction"
        :valueToggleMerchantTransaction="valueToggleMerchantTransaction"
        @revertRowClick="rowClick"
      />

      <!-- Loading Spinner -->
      <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
        <q-spinner-bars class="absolute-center" :size="35" color="#61116a" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, reactive } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';

import showMerchantTransactionLevelDetails from '../../components/sat/showMerchantTransactionLevelDetails.vue';
import generalLeadInformation from '../../components/generalLeadInformation.vue';
import DownloadAggrMasterTracker from '../../components/sat/DownloadAggrMasterTracker.vue';

export default {
  name: 'merchantTransactionLevel',
  components: {
    showMerchantTransactionLevelDetails,
    generalLeadInformation,
    DownloadAggrMasterTracker,
  },
  setup() {
    const tableData = ref([]);
    const filter = ref('');
    const toggleAjaxLoadFilter = ref(false);
    const propToggleLeadInformation = ref(false);
    const addtnLeadInformation = ref(null);
    const propAggrMasterTrackerList = ref(false);
    const valueToggleMerchantTransaction = ref(false);

    const paginationControl = reactive({
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
      sortBy: 'tid',
      descending: false
    });

    const formatDate = (date) => {
      return date ? moment(date).format('Do MMM Y') : 'NA';
    };

    return {
      tableData,
      filter,
      toggleAjaxLoadFilter,
      propToggleLeadInformation,
      addtnLeadInformation,
      propAggrMasterTrackerList,
      valueToggleMerchantTransaction,
      paginationControl,
      formatDate
    };
  },
  computed: {
    ...mapGetters('MasterTracker', ['getAggregatorsMasterTrackerList'])
  },
  mounted() {
    this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filter });
  },
  methods: {
    ...mapActions('MasterTracker', ['AGGREGATORS_MASTER_TRACKER_LIST']),

    ajaxLoadAllLeadInfo({ pagination, filter } = {}) {
      this.toggleAjaxLoadFilter = true;
      this.$q.loading.show({
        delay: 0,
        spinnerColor: 'purple-9',
        message: 'Fetching data ..'
      });

      this.AGGREGATORS_MASTER_TRACKER_LIST({ pagination, filter })
        .then(() => {
          if (this.getAggregatorsMasterTrackerList) {
            this.paginationControl.rowsNumber = this.getAggregatorsMasterTrackerList.totalElements;
            this.paginationControl.page = this.getAggregatorsMasterTrackerList.number + 1;
            this.tableData = this.getAggregatorsMasterTrackerList.content;
            if (this.getAggregatorsMasterTrackerList.sort) {
              this.paginationControl.sortBy = this.getAggregatorsMasterTrackerList.sort[0].property;
              this.paginationControl.descending = this.getAggregatorsMasterTrackerList.sort[0].ascending;
            }
          }
          this.toggleAjaxLoadFilter = false;
          this.$q.loading.hide();
        })
        .catch(() => {
          this.toggleAjaxLoadFilter = false;
          this.$q.loading.hide();
        });
    },

    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails) this.addtnLeadInformation = leadDetails;
    },

    downloadAggrMasterTrackerList() {
      this.propAggrMasterTrackerList = !this.propAggrMasterTrackerList;
    }
  },
  data() {
    return {
      columns: [
        { name: 'tid', label: 'TID', align: 'left', field: 'tid', sortable: true },
        { name: 'mid', label: 'MID', align: 'left', field: 'mid', sortable: true },
        { name: 'leadNumber', label: 'Lead Id', align: 'left', field: row => row.leadInformation?.leadNumber || 'NA', sortable: false },
        { name: 'leadInformation', label: 'Merchant Name', align: 'left', field: row => row.leadInformation?.leadName || 'NA', sortable: false },
        { name: 'leadAddress', label: 'Merchant Address', align: 'left', field: row => row.leadInformation?.leadAddress || 'NA', sortable: false },
        { name: 'deviceName', label: 'Device Type', align: 'left', field: row => row.leadInformation?.aggregatorDevice?.deviceName || 'NA', sortable: false },
        { name: 'device_serial_number', label: 'Device Serial Number', align: 'left', field: row => row.aggregatorRegionalInventory?.serialNumber || 'NA', sortable: true },
        { name: 'deviceStatusDate', label: 'Implementation Date', align: 'left', field: 'deviceStatusDate', sortable: true },
        { name: 'assignedTo', label: 'Implemented By', align: 'left', field: row => row.assignedTo ? `${row.assignedTo.name} | ${row.assignedTo.employeeID}` : 'NA', sortable: true },
        { name: 'deviceAddress', label: 'Implemented Address', align: 'left', field: row => row.deviceAddress || 'NA', sortable: true },
        { name: 'mobileNumber', label: 'Mobile Number', align: 'center', field: row => row.leadInformation?.contactNumber || 'NA', sortable: false }
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
