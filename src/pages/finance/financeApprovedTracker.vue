<template>
  <q-page>
    <div>
      <q-pull-to-refresh :handler="PullToRefresh" inline>
        <!-- Table title -->
        <div
          class="col-md-12 capitalize q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
        >
          Finance Approved Tracker
        </div>

        <!-- Tabs for POS & QR Merchant -->
        <q-tabs v-model="activeTab" class="shadow-1" color="grey-1" @update:model-value="goToQrMerchant">
          <q-tab name="tab-1" label="POS Merchant" />
          <q-tab name="tab-2" label="QR Merchant" />
        </q-tabs>

        <!-- POS Merchant Table -->
        <q-tab-panels v-model="activeTab" animated>
          <q-tab-panel name="tab-1">
            <q-table
              :rows="tableData"
              :columns="columns"
              :filter="filter"
              v-model:pagination="paginationControl"
              row-key="leadNumber"
              :rows-per-page-options="[5, 10, 15, 20]"
              @request="ajaxLoadAllFinanceApprovedData"
              table-class="customTableClass"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="leadNumber" :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row)">
                    <span class="label text-primary"># {{ props.row.leadNumber }}</span>
                  </q-td>
                  <q-td key="leadName" :props="props">{{ props.row.merchantName }}</q-td>
                  <q-td key="soName" :props="props">{{ props.row.soName }}</q-td>
                  <q-td key="submissionDate" :props="props">{{ formatDate(props.row.submissionDate) }}</q-td>
                  <q-td key="submittedToFinanceDate" :props="props">{{ formatDate(props.row.submittedToFinanceDate) }}</q-td>
                  <q-td key="paymentReference" :props="props">{{ props.row.paymentReference }}</q-td>
                  <q-td key="amount" :props="props">{{ props.row.amount }}</q-td>
                  <q-td key="leadLastUpdated" :props="props">{{ formatDate(props.row.leadLastUpdated) }}</q-td>
                </q-tr>
              </template>

              <!-- Top slot: Search & Download -->
              <template v-slot:top>
                <div class="row items-center q-px-md q-py-sm">
                  <div class="col-md-5">
                    <q-input
                      v-model="filter"
                      clearable
                      outlined
                      dense
                      placeholder="Search..."
                      debounce="300"
                      prepend-inner-icon="search"
                    />
                  </div>
                  <div class="col-md-4 offset-md-3 text-right">
                    <q-btn outline color="dark" label="Download as Excel" @click="downloadReport" />
                  </div>
                </div>
              </template>
            </q-table>
          </q-tab-panel>

          <!-- QR Merchant Table -->
          <q-tab-panel name="tab-2">
            <q-table
              :rows="tableData1"
              :columns="columns1"
              :filter="filter1"
              v-model:pagination="paginationControl1"
              row-key="qrLeadNumber"
              :rows-per-page-options="[5, 10, 15, 20]"
              @request="ajaxLoadAllFinanceQrApprovedData"
              table-class="customTableClass"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="qrLeadNumber" :props="props" class="cursor-pointer" @click="toggleQrLeadInformation(props.row)">
                    <span class="label text-primary"># {{ props.row.qrLeadNumber }}</span>
                  </q-td>
                  <q-td key="leadName" :props="props">{{ props.row.merchantName }}</q-td>
                  <q-td key="soName" :props="props">{{ props.row.soName }}</q-td>
                  <q-td key="submissionDate" :props="props">{{ formatDate(props.row.submissionDate) }}</q-td>
                  <q-td key="paymentReference" :props="props">{{ props.row.paymentReference ?? "NA" }}</q-td>
                  <q-td key="amount" :props="props">{{ props.row.amount }}</q-td>
                </q-tr>
              </template>

              <!-- Top slot: Search & Download -->
              <template v-slot:top>
                <div class="row items-center q-px-md q-py-sm">
                  <div class="col-md-5">
                    <q-input
                      v-model="filter1"
                      clearable
                      outlined
                      dense
                      placeholder="Search..."
                      debounce="300"
                      prepend-inner-icon="search"
                    />
                  </div>
                  <div class="col-md-4 offset-md-3 text-right">
                    <q-btn outline color="dark" label="Download as Excel" @click="downloadQrReport" />
                  </div>
                </div>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </q-pull-to-refresh>

      <!-- Download component -->
      <download-financeapproval
        v-if="propFinanceApprovalDatas"
        :propFinanceApprovalDatas="propFinanceApprovalDatas"
        @emitfnshowFinanceapproval="downloadApproval"
      />

      <!-- Lead Info Popups -->
      <general-lead-information
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />
      <general-qr-lead-information
        v-if="propToggleQrLeadInformation"
        :QrleadInformation="addQrLeadInformation"
        :propToggleQrLeadInformationPop="propToggleQrLeadInformation"
        @closeLeadInformation="toggleQrLeadInformation"
      />
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from "vue";
import { mapGetters, mapActions } from "vuex";
import moment from "moment";

import downloadFinanceapproval from "../../components/finance/downloadFinanceapproval.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import generalQrLeadInformation from "../../components/generalQrLeadInformation.vue";

export default {
  name: "financeApprovedTracker",
  components: {
    downloadFinanceapproval,
    generalLeadInformation,
    generalQrLeadInformation,
  },
  setup() {
    const activeTab = ref("tab-1");
    const filter = ref("");
    const filter1 = ref("");
    const paginationControl = ref({
      rowsNumber: 10,
      page: 1,
      sortBy: "leadNumber",
      descending: false,
      rowsPerPage: 10,
    });
    const paginationControl1 = ref({
      rowsNumber: 10,
      page: 1,
      sortBy: "qrLeadNumber",
      descending: false,
      rowsPerPage: 10,
    });

    const tableData = ref([]);
    const tableData1 = ref([]);

    const propToggleLeadInformation = ref(false);
    const propToggleQrLeadInformation = ref(false);
    const addtnLeadInformation = ref(null);
    const addQrLeadInformation = ref(null);
    const propFinanceApprovalDatas = ref(false);

    // Vuex
    const { getAllApprovedFinaceData } = mapGetters("Finance", ["getAllApprovedFinaceData"]);
    const { getstaticQrApprovedTrackerData } = mapGetters("qrFinance", ["getstaticQrApprovedTrackerData"]);

    const { FETCH_ALL_APPROVED_FINANCE_DATA } = mapActions("Finance", ["FETCH_ALL_APPROVED_FINANCE_DATA"]);
    const { FETCH_ALL_APPROVED_QR_FINANCE_DATA } = mapActions("qrFinance", ["FETCH_ALL_APPROVED_QR_FINANCE_DATA"]);
    const { REPORT_FINANCE_APPROVED, REPORT_QR_FINANCE_APPROVED } = mapActions("reports", [
      "REPORT_FINANCE_APPROVED",
      "REPORT_QR_FINANCE_APPROVED",
    ]);

    // Format date helper
    const formatDate = (dateValue) => {
      return dateValue ? moment(dateValue).format("Do MMM YYYY") : "";
    };

    // Pull to refresh
    const PullToRefresh = (done) => {
      done();
    };

    const toggleLeadInformation = (leadDetails) => {
      propToggleLeadInformation.value = !propToggleLeadInformation.value;
      if (leadDetails) addtnLeadInformation.value = leadDetails;
    };

    const toggleQrLeadInformation = (qrLeadDetails) => {
      propToggleQrLeadInformation.value = !propToggleQrLeadInformation.value;
      if (qrLeadDetails) addQrLeadInformation.value = qrLeadDetails;
    };

    const goToQrMerchant = (tab) => {
      activeTab.value = tab;
      if (activeTab.value === "tab-1") {
        tableData1.value = [];
      } else {
        tableData.value = [];
      }
    };

    const ajaxLoadAllFinanceApprovedData = ({ pagination, filter }) => {
      const payload = { pagination, filter };
      FETCH_ALL_APPROVED_FINANCE_DATA(payload)
        .then(() => {
          paginationControl.value = pagination;
          paginationControl.value.rowsNumber = getAllApprovedFinaceData.totalElements;
          paginationControl.value.page = getAllApprovedFinaceData.number + 1;
          tableData.value = getAllApprovedFinaceData.content;
          if (getAllApprovedFinaceData.sort) {
            paginationControl.value.sortBy = getAllApprovedFinaceData.sort[0].property;
            paginationControl.value.descending = getAllApprovedFinaceData.sort[0].ascending;
          }
        })
        .catch((err) => console.error(err));
    };

    const ajaxLoadAllFinanceQrApprovedData = ({ pagination, filter }) => {
      const payload = { pagination, filter };
      FETCH_ALL_APPROVED_QR_FINANCE_DATA(payload)
        .then(() => {
          paginationControl1.value = pagination;
          paginationControl1.value.rowsNumber = getstaticQrApprovedTrackerData.totalElements;
          paginationControl1.value.page = getstaticQrApprovedTrackerData.number + 1;
          tableData1.value = getstaticQrApprovedTrackerData.content;
          if (getstaticQrApprovedTrackerData.sort) {
            paginationControl1.value.sortBy = getstaticQrApprovedTrackerData.sort[0].property;
            paginationControl1.value.descending = getstaticQrApprovedTrackerData.sort[0].ascending;
          }
        })
        .catch((err) => console.error(err));
    };

    const downloadReport = () => {
      REPORT_FINANCE_APPROVED({}).then(() => {
        console.log("Downloaded POS report");
      });
    };

    const downloadQrReport = () => {
      REPORT_QR_FINANCE_APPROVED({}).then(() => {
        console.log("Downloaded QR report");
      });
    };

    const downloadApproval = () => {
      propFinanceApprovalDatas.value = !propFinanceApprovalDatas.value;
    };

    onMounted(() => {
      ajaxLoadAllFinanceApprovedData({ pagination: paginationControl.value, filter: filter.value });
      ajaxLoadAllFinanceQrApprovedData({ pagination: paginationControl1.value, filter: filter1.value });
    });

    return {
      activeTab,
      filter,
      filter1,
      paginationControl,
      paginationControl1,
      tableData,
      tableData1,
      propToggleLeadInformation,
      propToggleQrLeadInformation,
      addtnLeadInformation,
      addQrLeadInformation,
      propFinanceApprovalDatas,
      formatDate,
      PullToRefresh,
      toggleLeadInformation,
      toggleQrLeadInformation,
      goToQrMerchant,
      ajaxLoadAllFinanceApprovedData,
      ajaxLoadAllFinanceQrApprovedData,
      downloadReport,
      downloadQrReport,
      downloadApproval,
    };
  },
};
</script>

<style>
/* Add your table / UI custom styles */
.customTableClass {
  font-size: 12px;
}
</style>
