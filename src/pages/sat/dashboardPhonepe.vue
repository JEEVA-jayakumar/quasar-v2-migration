<template>
  <q-page class="q-pa-md">
    <!-- START: Dashboard wrapper -->
    <div class="row gutter-x-xs">
      <!-- Exception Card -->
      <div class="col-lg-4 col-md-6 col-sm-12">
        <q-card class="border-radius-10 q-pa-md" color="purple-9">
          <div class="row items-center justify-center">
            <div class="col-lg-4 col-md-8 col-sm-12 text-center">
              <div class="q-headline sm-q-caption">{{ exceptionCount.totalExceptionCount }}</div>
            </div>
            <div class="col full-height gt-md text-center">
              <div class="divider-left"></div>
            </div>
            <div class="col-lg-7 col-md-8 col-sm-12 text-center">
              <div class="lg-q-title sm-q-caption text-weight-light">Exception</div>
            </div>
          </div>
        </q-card>

        <q-card class="q-py-md">
          <div class="row items-center text-center" style="min-height:75px">
            <div class="col-md-4 q-my-xs">
              <div class="q-caption text-grey-10">KYC Exception</div>
              <q-chip
                color="purple-9"
                class="cursor-pointer"
                @click="retrieveLeadsList(exceptionCount.kycPendingLeadIds)"
              >{{ exceptionCount.kycPendingCount }}</q-chip>
            </div>
            <div class="col-md-4 q-my-xs">
              <div class="q-caption text-grey-10">Bank Exception</div>
              <q-chip
                color="purple-9"
                class="cursor-pointer"
                @click="retrieveLeadsList(exceptionCount.banksubventionPendingLeadIds)"
              >{{ exceptionCount.banksubventionPendingCount }}</q-chip>
            </div>
            <div class="col-md-4 q-my-xs">
              <div class="q-caption text-grey-10">Pricing Subvention</div>
              <q-chip
                color="purple-9"
                class="cursor-pointer"
                @click="retrieveLeadsList(exceptionCount.pricingPendingLeadIds)"
              >{{ exceptionCount.pricingPendingCount }}</q-chip>
            </div>
          </div>
        </q-card>
      </div>

      <!-- Regional Inventory Card -->
      <div class="col-lg-4 col-md-6 col-sm-12">
        <q-card class="border-radius-10 q-pa-md" color="purple-9">
          <div class="row items-center justify-center">
            <div class="col-lg-4 col-md-8 col-sm-12 text-center">
              <div class="q-headline sm-q-caption">{{ regionalInventoryCount.totalDevice }}</div>
            </div>
            <div class="col full-height gt-md text-center">
              <div class="divider-left"></div>
            </div>
            <div class="col-lg-7 col-md-8 col-sm-12 text-center">
              <div class="lg-q-title sm-q-caption text-weight-light">Stock Inventory (Bijlipay)</div>
            </div>
          </div>
        </q-card>

        <q-card class="q-py-md">
          <div class="row items-center text-center" style="min-height:75px">
            <div class="col-md-4 q-my-xs">
              <div class="q-caption text-grey-10">Allocated Devices</div>
              <q-chip color="purple-9">{{ regionalInventoryCount.allocatedDeviceCount }}</q-chip>
            </div>
            <div class="col-md-4 q-my-xs">
              <div class="q-caption text-grey-10">Pending Devices</div>
              <q-chip color="purple-9">{{ regionalInventoryCount.pendingDeviceCount }}</q-chip>
            </div>
            <div class="col-md-4 q-my-xs">
              <div class="q-caption text-grey-10">Damaged Devices</div>
              <q-chip color="purple-9">{{ regionalInventoryCount.damagedDeviceCount }}</q-chip>
            </div>
          </div>
        </q-card>
      </div>

      <!-- Mars Device Card -->
      <div class="col-lg-4 col-md-6 col-sm-12">
        <q-card class="border-radius-10 q-pa-md" color="purple-9">
          <div class="row items-center justify-center">
            <div class="col-lg-4 col-md-8 col-sm-12 text-center">
              <div class="q-headline sm-q-caption">{{ marsDeviceCount.totalMarsDeviceCount }}</div>
            </div>
            <div class="col full-height gt-md text-center">
              <div class="divider-left"></div>
            </div>
            <div class="col-lg-7 col-md-8 col-sm-12 text-center">
              <div class="lg-q-title sm-q-caption text-weight-light">Implementation</div>
            </div>
          </div>
        </q-card>

        <q-card class="q-py-md">
          <div class="row items-center text-center" style="min-height:75px">
            <div class="col-md-6 q-my-xs">
              <div class="q-caption text-grey-10">Assigned / {{ marsDeviceCount.assignedDeviceCount }}</div>
            </div>
            <div class="col-md-6 q-my-xs">
              <div class="q-caption text-negative">
                <q-icon color="amber-9" name="fa fa-bell" />
                Unassigned / {{ marsDeviceCount.unassignedDeviceCount }}
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- Aggregator Inventory -->
    <div class="q-my-md q-px-md q-py-sm bg-grey-12 round-borders">
      <q-card-title>
        <div class="q-subheading text-bold">Stock Inventory (Aggregator)</div>
      </q-card-title>

      <div class="row gutter-x-xs gutter-y-xs items-center justify-center q-mt-md">
        <div class="col">
          <q-card class="border-radius-10 q-pa-md" color="purple-9">
            <div class="row items-center justify-center">
              <div class="col-lg-4 col-md-8 col-sm-12 text-center">
                <div class="q-headline sm-q-caption">{{ aggregatorCount.totalDevice }}</div>
              </div>
              <div class="col full-height gt-md text-center">
                <div class="divider-left"></div>
              </div>
              <div class="col-lg-7 col-md-8 col-sm-12 text-center">
                <div class="lg-q-title sm-q-caption text-weight-light">Aggregators</div>
              </div>
            </div>
          </q-card>

          <q-card class="q-py-md">
            <div class="row items-center text-center" style="min-height:75px">
              <div class="col-md-4 q-my-xs">
                <div class="q-caption text-grey-10">Pending Device</div>
                <q-chip color="purple-9" class="cursor-pointer">{{ aggregatorCount.pendingDeviceCount }}</q-chip>
              </div>
              <div class="col-md-4 q-my-xs">
                <div class="q-caption text-grey-10">Allocated Device</div>
                <q-chip color="purple-9" class="cursor-pointer">{{ aggregatorCount.allocatedDeviceCount }}</q-chip>
              </div>
              <div class="col-md-4 q-my-xs">
                <div class="q-caption text-grey-10">Damaged Device</div>
                <q-chip color="purple-9" class="cursor-pointer">{{ aggregatorCount.damagedDeviceCount }}</q-chip>
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Service Requests -->
    <div class="row gutter-x-xs gutter-y-xs items-center justify-center q-mt-md">
      <div class="col">
        <q-card class="border-radius-10 q-pa-md" color="purple-9">
          <div class="row items-center justify-center">
            <div class="col-lg-4 col-md-8 col-sm-12 text-center">
              <div class="q-headline sm-q-caption">{{ serviceRequestCount.total }}</div>
            </div>
            <div class="col full-height gt-md text-center">
              <div class="divider-left-service"></div>
            </div>
            <div class="col-lg-7 col-md-8 col-sm-12 text-center">
              <div class="lg-q-title sm-q-caption text-weight-light">Service Request</div>
            </div>
          </div>
        </q-card>

        <q-card class="row border-radius-10 q-pa-md">
          <!-- Internal Requests -->
          <div class="col-6 q-py-md">
            <div class="col border-radius-10 q-pa-md text-center">
              <div class="lg-q-title sm-q-caption text-weight-light"><strong>Internal</strong></div>
            </div>
            <div class="row text-center justify-center" style="min-height:75px">
              <div v-for="field in internalFields" :key="field.label" class="col-md-4 q-my-xs">
                <div class="q-caption text-grey-10">{{ field.label }}</div>
                <q-chip color="purple-9">{{ field.value }}</q-chip>
              </div>
            </div>
          </div>

          <div class="col items-center text-center full-height gt-md">
            <div style="border-left:1px solid rgb(209 209 209);height: 200px !important;"></div>
          </div>

          <!-- External Requests -->
          <div class="col-6 q-py-md">
            <div class="col border-radius-10 q-pa-md text-center">
              <div class="lg-q-title sm-q-caption text-weight-light"><strong>External</strong></div>
            </div>
            <div class="row text-center justify-center" style="min-height:75px">
              <div v-for="field in externalFields" :key="field.label" class="col-md-4 q-my-xs">
                <div class="q-caption text-grey-10">{{ field.label }}</div>
                <q-chip color="purple-9">{{ field.value }}</q-chip>
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- Aging Tracker & Merchant Tracker -->
    <div class="row gutter-x-xs">
      <div class="col-lg-12">
        <q-card class="q-my-md q-px-md q-py-sm bg-grey-12 round-borders">
          <q-card-title>
            <div class="q-subheading text-bold">Aging Tracker</div>
          </q-card-title>
          <chartSATagingTracker :options="{ responsive: false, maintainAspectRatio: false }"
            :height="150" class="bg-white q-pa-md round-borders" />
        </q-card>

        <q-card class="q-my-md q-px-md q-py-sm bg-grey-12 round-borders">
          <q-card-title>
            <div class="row items-center">
              <div class="col-12 col-lg-9">
                <div class="q-subheading text-bold">Merchant Tracker</div>
              </div>
              <div class="col-12 col-lg-3">
                <q-select
                  inverted
                  color="purple-9"
                  v-model="dateSelection"
                  :options="dateOptions"
                  @update:model-value="changeMerchantTrackerData"
                />
              </div>
            </div>
          </q-card-title>

          <chartMerchantTracker
            v-if="renderMerchantGraph"
            :borderWidth="1"
            :height="150"
            :merchantTrackerData="getSatDashboardGraphData"
            class="bg-white q-pa-md round-borders"
          />
        </q-card>
      </div>
    </div>

    <!-- Lead List Modal -->
    <leadList
      v-if="dashboardAgingTrackerLeads"
      :propLeadInformation="rowDetails"
      :propToggleModal="dashboardAgingTrackerLeads"
      @closeLeadsList="retrieveLeadsList"
    />
  </q-page>
</template>

<script>
import { ref, reactive, onMounted, computed } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import chartMerchantTracker from "../../components/sat/chartMerchantTracker.js";
import chartSATagingTracker from "../../components/sat/chartSATagingTracker.js";
import leadList from "../../components/sat/leadList.vue";

export default {
  name: "DashboardPhonepe",
  components: { leadList, chartSATagingTracker, chartMerchantTracker },
  setup() {
    const $q = useQuasar();
    const store = useStore();

    const dateSelection = ref("DAYS");
    const renderMerchantGraph = ref(true);
    const dashboardAgingTrackerLeads = ref(false);
    const rowDetails = ref({});
    const paginationControl = reactive({ rowsPerPage: 10 });

    const exceptionCount = reactive({
      banksubventionPendingCount: 0,
      kycPendingCount: 0,
      pricingPendingCount: 0,
      totalExceptionCount: 0,
      banksubventionPendingLeadIds: [],
      kycPendingLeadIds: [],
      pricingPendingLeadIds: [],
    });

    const regionalInventoryCount = reactive({
      allocatedDeviceCount: 0,
      damagedDeviceCount: 0,
      pendingDeviceCount: 0,
      totalDevice: 0,
    });

    const marsDeviceCount = reactive({
      assignedDeviceCount: 0,
      totalMarsDeviceCount: 0,
      unassignedDeviceCount: 0,
    });

    const aggregatorCount = reactive({
      totalDevice: 0,
      pendingDeviceCount: 0,
      damagedDeviceCount: 0,
      allocatedDeviceCount: 0,
    });

    const serviceRequestCount = reactive({
      internal: { closed: 0, assigned: 0, unassigned: 0, ReOpenAssigned: 0, ReOpenedUnAssigned: 0 },
      external: { closed: 0, assigned: 0, unassigned: 0, ReOpenAssigned: 0, ReOpenedUnAssigned: 0 },
      total: 0,
      intTotal: 0,
      extTotal: 0,
    });

    const applicationPendingCount = reactive({
      totalApplicationPendingLeadIds: [],
      totalApplicationPendingCount: 0,
      financeRejectLeadIds: [],
      financeRejectCount: 0,
      financePendingLeadIds: [],
      financePendingCount: 0,
      wipLeadIds: [],
      wipCount: 0,
      withSatLeadIds: [],
      withSatCount: 0,
      withOPSLeadIds: [],
      withOPSHead: 0,
    });

    const agingTrackerPendingTableData = ref([]);
    const dateOptions = ref([
      { label: "Days", value: "DAYS" },
      { label: "Week", value: "WEEK" },
      { label: "Month", value: "MONTH" },
      { label: "Year", value: "YEAR" },
    ]);

    // Computed for service request fields
    const internalFields = computed(() => [
      { label: "closed", value: serviceRequestCount.internal.closed ?? 0 },
      { label: "assigned", value: serviceRequestCount.internal.assigned ?? 0 },
      { label: "unassigned", value: serviceRequestCount.internal.unassigned ?? 0 },
      { label: "Total", value: serviceRequestCount.intTotal ?? 0 },
      { label: "ReOpenAssigned", value: serviceRequestCount.internal.ReOpenAssigned ?? 0 },
      { label: "ReOpenedUnAssigned", value: serviceRequestCount.internal.ReOpenedUnAssigned ?? 0 },
    ]);

    const externalFields = computed(() => [
      { label: "closed", value: serviceRequestCount.external.closed ?? 0 },
      { label: "assigned", value: serviceRequestCount.external.assigned ?? 0 },
      { label: "unassigned", value: serviceRequestCount.external.unassigned ?? 0 },
      { label: "Total", value: serviceRequestCount.extTotal ?? 0 },
      { label: "ReOpenAssigned", value: serviceRequestCount.external.ReOpenAssigned ?? 0 },
      { label: "ReOpenedUnAssigned", value: serviceRequestCount.external.ReOpenedUnAssigned ?? 0 },
    ]);

    const getSatDashboard = computed(() => store.getters["SAT_Dashboard/getSatDashboard"]);
    const getAggregatorsSatDashboard = computed(() => store.getters["SAT_Dashboard/getAggregatorsSatDashboard"]);
    const getSatAgingTrackerdata = computed(() => store.getters["SAT_Dashboard/getSatAgingTrackerdata"]);
    const getSatDashboardGraphData = computed(() => store.getters["SAT_Dashboard/getSatDashboardGraphData"]);
    const getserviceRequestCountDatas = computed(() => store.getters["serviceRequestSat/getserviceRequestCountDatas"]);
    const getserviceRequestPhonepeCountDatas = computed(() => store.getters["serviceRequestPhonepeSat/getserviceRequestPhonepeCountDatas"]);

    const fetchCountInformation = async () => {
      $q.loading.show({ delay: 100, spinnerColor: "purple-9", message: "Fetching data ..." });
      try {
        await store.dispatch("SAT_Dashboard/FETCH_DASHBOARD_COUNT", JSON.parse(localStorage.getItem("u_i")).region.id);
        Object.assign(applicationPendingCount, getSatDashboard.value.applicationPendingCount);
        Object.assign(exceptionCount, getSatDashboard.value.exceptionCount);
        Object.assign(marsDeviceCount, getSatDashboard.value.marsDeviceCount);
        Object.assign(regionalInventoryCount, getSatDashboard.value.regionalInventoryCount);

        await store.dispatch("SAT_Dashboard/FETCH_SAT_AGING_TRACKER_DATA", JSON.parse(localStorage.getItem("u_i")).region.id);
        agingTrackerPendingTableData.value = getSatAgingTrackerdata.value;
      } finally {
        $q.loading.hide();
      }
    };

    const fetchAggregatorsCountInformation = async () => {
      $q.loading.show({ delay: 100, spinnerColor: "purple-9", message: "Fetching data ..." });
      try {
        const param = { region: JSON.parse(localStorage.getItem("u_i")).region.id };
        await store.dispatch("SAT_Dashboard/FETCH_AGGREGATORS_DASHBOARD_COUNT", param);
        Object.assign(aggregatorCount, getAggregatorsSatDashboard.value.regionalInventoryCount);
      } finally {
        $q.loading.hide();
      }
    };

    const fetchServiceRequestCounts = async () => {
      $q.loading.show({ delay: 100, spinnerColor: "purple-9", message: "Fetching data ..." });
      try {
        await store.dispatch("serviceRequestSat/FETCH_SERVICE_REQUEST_COUNT_DETAILS");
        Object.assign(serviceRequestCount, getserviceRequestCountDatas.value);

        await store.dispatch("serviceRequestPhonepeSat/FETCH_PHONEPE_SERVICE_REQUEST_COUNT_DETAILS");
        Object.assign(serviceRequestCount, getserviceRequestPhonepeCountDatas.value);
      } finally {
        $q.loading.hide();
      }
    };

    const changeMerchantTrackerData = async (value) => {
      renderMerchantGraph.value = false;
      $q.loading.show({ delay: 100, spinnerColor: "purple-9", message: "Fetching data ..." });
      dateSelection.value = value;
      try {
        await store.dispatch("SAT_Dashboard/FETCH_DASHBOARD_CHART_DATA", { region: JSON.parse(localStorage.getItem("u_i")).region.id, action: value });
        renderMerchantGraph.value = true;
      } catch {
        renderMerchantGraph.value = false;
      } finally {
        $q.loading.hide();
      }
    };

    const retrieveLeadsList = (props) => {
      dashboardAgingTrackerLeads.value = !dashboardAgingTrackerLeads.value;
      if (props?.length > 0) rowDetails.value = props;
      else $q.notify({ color: "amber-9", position: "bottom", message: "Oops, no lead available to display", icon: "info" });
    };

    onMounted(() => {
      fetchCountInformation();
      fetchAggregatorsCountInformation();
      fetchServiceRequestCounts();
      changeMerchantTrackerData("DAYS");
    });

    return {
      dateSelection,
      renderMerchantGraph,
      dashboardAgingTrackerLeads,
      rowDetails,
      paginationControl,
      exceptionCount,
      regionalInventoryCount,
      marsDeviceCount,
      aggregatorCount,
      serviceRequestCount,
      applicationPendingCount,
      agingTrackerPendingTableData,
      dateOptions,
      internalFields,
      externalFields,
      getSatDashboardGraphData,
      retrieveLeadsList,
      changeMerchantTrackerData,
    };
  },
};
</script>

<style scoped>
.border-radius-10 {
  border-radius: 8px !important;
}

.divider-left {
  border-left: 1px solid #fff;
  height: 35px !important;
}

.divider-left-service {
  border-left: 1px solid #fff;
  height: 35px !important;
}
</style>
