<template>
  <q-page class="q-pa-none">
    <!-- Page Title -->
    <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
      Aggregator Lost/Stolen
    </div>

    <!-- Lead Information Modal -->
    <generalLeadInformation
      v-if="propToggleLeadInformation"
      :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation"
      @closeLeadInformation="toggleLeadInformation"
    />

    <!-- Table: All Lead Info -->
    <q-table
      table-class="customTableClass"
      :data="tableData"
      :columns="columns"
      :filter="filter"
      v-model:pagination="paginationControl"
      row-key="tid"
      :loading="toggleAjaxLoadFilter"
      :rows-per-page-options="[5, 10, 15, 20]"
      @request="ajaxLoadAllLeadInfo"
    >
      <!-- Custom Header Row -->
      <template v-slot:top-row="props">
        <q-tr>
          <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
        </q-tr>
      </template>

      <!-- TID -->
      <template v-slot:body-cell-tid="props">
        <span class="label text-primary"># {{ props.row.tid }}</span>
      </template>

      <!-- MID -->
      <template v-slot:body-cell-mid="props">
        <span class="label text-primary"># {{ props.row.mid }}</span>
      </template>

      <!-- Lead Number -->
      <template v-slot:body-cell-leadNumber="props">
        <span class="label text-primary cursor-pointer" @click="toggleLeadInformation(props.row.leadInformation)">
          # {{ props.row.leadInformation?.leadNumber }}
        </span>
      </template>

      <!-- Mobile Number -->
      <template v-slot:body-cell-mobileNumber="props">
        {{ props.row.leadInformation?.contactNumber || "NA" }}
      </template>

      <!-- Merchant Address -->
      <template v-slot:body-cell-leadAddress="props">
        {{ props.row.leadInformation?.leadAddress || "NA" }}
      </template>

      <!-- Lost/Stolen Remarks -->
      <template v-slot:body-cell-lostOrStolenRemarks="props">
        <span class="label">{{ props.row.lostOrStolenRemarks }}</span>
      </template>

      <!-- Implementation Date -->
      <template v-slot:body-cell-deviceStatusDate="props">
        <span class="label">{{ props.row.deviceStatusDate ? moment(props.row.deviceStatusDate).format("Do MMM Y") : "NA" }}</span>
      </template>

      <!-- Action Button -->
      <template v-slot:body-cell-action="props">
        <q-btn
          highlight
          push
          class="q-mx-sm"
          color="positive"
          size="sm"
          @click="Aggregatorsloststolendevice(props.row)"
        >
          Lost/Stolen
        </q-btn>
      </template>

      <!-- Top slot: Search -->
      <template v-slot:top>
        <div class="col-5">
          <q-search
            clearable
            v-model="filter"
            color="grey-9"
            placeholder="Type.."
            float-label="Search Using TID, MID, Lead ID, Merchant Name"
            class="q-mr-lg q-py-sm"
          />
        </div>
      </template>
    </q-table>

    <!-- Section Title -->
    <div class="col-md-12 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
      Add Your Remarks
    </div>

    <!-- Table: Lost/Stolen Data -->
    <q-table
      table-class="customTableClass"
      :columns="columns1"
      :data="tableData1"
      row-key="tid"
      color="grey-9"
      :filter="filter1"
      :rows-per-page-options="[5, 10, 15, 20, 25]"
      v-model:pagination="paginationControl1"
      :loading="toggleAjaxLoadFilter1"
      @request="lostOrStolenLoadInfo"
      table-style="word-break: break-all"
      class="payment_verification_table capitalize"
    >
      <!-- Receive Date -->
      <template v-slot:body-cell-updatedAt="props">
        <span>{{ props.row.aggregatorRegionalInventory?.updatedAt ? moment(props.row.aggregatorRegionalInventory.updatedAt).format("Do MMM Y") : "NA" }}</span>
      </template>

      <!-- Status Buttons -->
      <template v-slot:body-cell-action="props">
        <q-btn
          v-if="props.row.aggregatorRegionalInventory?.deviceStatus === 8"
          disable
          push
          color="purple-9"
          size="sm"
        >
          Waiting for Approval
        </q-btn>
        <q-btn
          v-else-if="props.row.aggregatorRegionalInventory?.deviceStatus === 7"
          disable
          highlight
          push
          color="blue"
          size="sm"
        >
          Submitted By SO
        </q-btn>
        <q-btn
          v-else-if="props.row.aggregatorRegionalInventory?.deviceStatus === 10"
          disable
          highlight
          push
          color="red"
          size="sm"
        >
          Rejected By Finance
        </q-btn>

        <!-- Lost/Stolen button -->
        <q-btn
          v-if="[7,8,10].includes(props.row.aggregatorRegionalInventory?.deviceStatus)"
          highlight
          push
          color="positive"
          size="sm"
          class="q-mx-sm"
          @click="Aggregatorsloststolendevice(props.row)"
        >
          Lost/Stolen
        </q-btn>
      </template>

      <!-- Top slot: Search + Download -->
      <template v-slot:top>
        <div class="col-md-5">
          <q-search
            clearable
            v-model="filter1"
            color="grey-9"
            placeholder="Type.."
            float-label="Search Using TID, MID"
            class="q-mr-lg q-py-sm"
          />
        </div>
        <div class="col-md-6">
          <q-btn
            square
            outline
            color="purple-9"
            label="Download as Excel"
            class="q-mr-lg q-py-sm float-right"
            size="md"
            @click="downloadLostDatas"
          />
        </div>
      </template>
    </q-table>

    <!-- Download Modal -->
    <DownloadAggregatorsLostOrStolen
      v-if="propLostStolenDatas"
      :propLostStolenDatas="propLostStolenDatas"
      @emitfnshowLostOrStolen="downloadLostDatas"
    />

    <!-- Merchant Transaction Details -->
    <showMerchantTransactionLevelDetails
      v-if="valueToggleMerchantTransaction"
      :valueToggleMerchantTransaction="valueToggleMerchantTransaction"
      @revertRowClick="rowClick"
    />

    <!-- Lost/Stolen Model -->
    <AggregatorsloststolendeviceComp
      v-if="showLostModel"
      :showLostModel="showLostModel"
      :propShowLostComponent="propsLostAppend"
      @closeLostModel="Aggregatorsloststolendevice"
    />

    <!-- Spinner -->
    <div v-if="toggleAjaxLoadFilter || toggleAjaxLoadFilter1" class="fullscreen spinner-overlay">
      <q-spinner-bars class="absolute-center" color="#61116a" size="35" />
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import moment from "moment";

import DownloadAggregatorsLostOrStolen from "../../components/sat/DownloadAggregatorsLostOrStolen.vue";
import AggregatorsloststolendeviceComp from "../../components/sat/AggregatorsloststolendeviceComp.vue";
import showMerchantTransactionLevelDetails from "../../components/sat/showMerchantTransactionLevelDetails.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";

export default {
  name: "merchantTransactionLevel",
  components: {
    showMerchantTransactionLevelDetails,
    AggregatorsloststolendeviceComp,
    generalLeadInformation,
    DownloadAggregatorsLostOrStolen
  },
  data() {
    return {
      propToggleLeadInformation: false,
      propLostStolenDatas: false,
      propsLostAppend: null,
      showLostModel: false,
      addtnLeadInformation: null,
      toggleAjaxLoadFilter: false,
      toggleAjaxLoadFilter1: false,
      paginationControl: { rowsNumber: 10, page: 1, sortBy: "tid", descending: false, rowsPerPage: 10 },
      paginationControl1: { rowsNumber: 10, page: 1, sortBy: "tid", descending: false, rowsPerPage: 10 },
      tableData: [],
      tableData1: [],
      valueToggleMerchantTransaction: false,
      filter: "",
      filter1: "",
      columns: [
        { name: "tid", label: "TID", align: "left", field: "tid", sortable: true },
        { name: "mid", label: "MID", align: "left", field: "mid", sortable: true },
        { name: "leadNumber", label: "Lead Id", align: "left", field: row => row.leadInformation?.leadNumber },
        { name: "leadInformation", label: "Merchant Name", align: "left", field: row => row.leadInformation?.leadName },
        { name: "leadAddress", label: "Merchant Address", align: "left", field: row => row.leadInformation?.leadAddress },
        { name: "deviceName", label: "Device Type", align: "left", field: row => row.leadInformation?.aggregatorDevice?.deviceName || "NA" },
        { name: "device_serial_number", label: "Device Serial Number", align: "left", field: row => row.aggregatorRegionalInventory?.serialNumber || "NA", sortable: true },
        { name: "deviceStatusDate", label: "Implementation Date", align: "left", field: "deviceStatusDate", sortable: true },
        { name: "assignedTo", label: "Implemented by", align: "left", field: row => row.assignedTo ? `${row.assignedTo.name} | ${row.assignedTo.employeeID}` : "NA" },
        { name: "deviceAddress", label: "Implemented Address", align: "left", field: row => row.deviceAddress },
        { name: "mobileNumber", label: "Mobile Number", align: "center", field: row => row.leadInformation?.contactNumber || "NA" },
        { name: "action", label: "", align: "center", field: "action" }
      ],
      columns1: [
        { name: "leadName", label: "Merchant Name", align: "left", field: row => row.leadInformation?.leadName },
        { name: "Address", label: "Address", align: "left", field: row => row.leadInformation?.leadAddress },
        { name: "deviceName", label: "Device Type", align: "left", field: row => row.leadInformation?.aggregatorDevice?.deviceName || "NA" },
        { name: "tid", label: "TID", align: "left", field: "tid" },
        { name: "mid", label: "MID", align: "left", field: "mid" },
        { name: "updatedAt", label: "Receive Date", align: "center", field: row => row.aggregatorRegionalInventory?.updatedAt ? moment(row.aggregatorRegionalInventory.updatedAt).format("DD/MM/YYYY") : "NA" },
        { name: "lostOrStolenRemarks", label: "Remarks", align: "left", field: row => row.aggregatorRegionalInventory?.lostOrStolenRemarks || "NA" },
        { name: "action", label: "", align: "left", field: "action" }
      ]
    };
  },
  computed: {
    ...mapGetters("MasterTracker", ["getMasterTrackerList", "getAggregatorsMasterTrackerList"]),
    ...mapGetters("lostOrStolenDatas", ["getLostOrStolenDatas", "getAggregatorsLostOrStolenDatas"]),
    ...mapGetters("superAdminAggregators", ["getCreatedAggregatorList", "getActiveCreatedAggregatorList"])
  },
  mounted() {
    this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filter });
    this.lostOrStolenLoadInfo({ pagination: this.paginationControl1, filter: this.filter1 });
  },
  methods: {
    ...mapActions("MasterTracker", ["MASTER_TRACKER_LIST", "AGGREGATORS_MASTER_TRACKER_LIST", "APPROVE_LOST_STOLEN_DEVICE"]),
    ...mapActions("lostOrStolenDatas", ["FETCH_AGGREGATORS_ALL_LOST_DEVICES_DATAS"]),
    ...mapActions("superAdminAggregators", ["GET_CREATED_AGGREGATORS_LIST", "GET_ACTIVE_CREATED_AGGREGATORS_LIST"]),

    ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.toggleAjaxLoadFilter = true;
      this.AGGREGATORS_MASTER_TRACKER_LIST({ pagination, filter })
        .finally(() => (this.toggleAjaxLoadFilter = false));
    },

    lostOrStolenLoadInfo({ pagination, filter }) {
      this.toggleAjaxLoadFilter1 = true;
      this.FETCH_AGGREGATORS_ALL_LOST_DEVICES_DATAS({ pagination, filter })
        .finally(() => (this.toggleAjaxLoadFilter1 = false));
    },

    downloadLostDatas() {
      this.propLostStolenDatas = !this.propLostStolenDatas;
    },

    Aggregatorsloststolendevice(row) {
      this.showLostModel = !this.showLostModel;
      this.propsLostAppend = row;
    },

    toggleLeadInformation(leadDetails) {
      this.propToggleLeadInformation = !this.propToggleLeadInformation;
      if (leadDetails) this.addtnLeadInformation = leadDetails;
    }
  }
};
</script>

<style scoped>
.spinner-overlay {
  background: rgba(255, 255, 255, 0.7);
  z-index: 9999;
}
</style>
