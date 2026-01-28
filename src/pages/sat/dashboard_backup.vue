<template>
  <q-page class="q-pa-md">
    <!-- START: Dashboard wrapper -->
    <div class="row gutter-x-xs">
      <!-- Left Side: Exception / Inventory / Implementation -->
      <div class="col-lg-8">
        <div class="row gutter-x-xs gutter-y-xs items-center justify-center">
          <!-- Exception Card -->
          <div class="col-lg-4 col-md-6 col-sm-12">
            <q-card class="border-radius-10 q-pa-md bg-purple-9 text-white">
              <div class="row items-center justify-center">
                <div class="col-4 text-center">
                  <div class="q-headline sm-q-caption">{{ exceptionCount.totalExceptionCount }}</div>
                </div>
                <div class="col items-center text-center full-height gt-md">
                  <div style="border-left:1px solid #fff;height: 35px;"></div>
                </div>
                <div class="col-7 text-center">
                  <div class="lg-q-title sm-q-caption text-weight-light">Exception</div>
                </div>
              </div>
            </q-card>

            <q-card class="q-py-md">
              <div class="row items-center text-center" style="min-height:75px">
                <div class="col-4 q-my-xs">
                  <div class="q-caption text-grey-10">KYC Exception</div>
                  <q-chip
                    class="cursor-pointer"
                    color="purple-9"
                    @click="retrieveLeadsList(exceptionCount.kycPendingLeadIds)"
                  >{{ exceptionCount.kycPendingCount }}</q-chip>
                </div>
                <div class="col-4 q-my-xs">
                  <div class="q-caption text-grey-10">Bank Exception</div>
                  <q-chip
                    class="cursor-pointer"
                    color="purple-9"
                    @click="retrieveLeadsList(exceptionCount.banksubventionPendingLeadIds)"
                  >{{ exceptionCount.banksubventionPendingCount }}</q-chip>
                </div>
                <div class="col-4 q-my-xs">
                  <div class="q-caption text-grey-10">Pricing Subvention</div>
                  <q-chip
                    class="cursor-pointer"
                    color="purple-9"
                    @click="retrieveLeadsList(exceptionCount.pricingPendingLeadIds)"
                  >{{ exceptionCount.pricingPendingCount }}</q-chip>
                </div>
              </div>
            </q-card>
          </div>

          <!-- Stock Inventory Card -->
          <div class="col-lg-4 col-md-6 col-sm-12">
            <q-card class="border-radius-10 q-pa-md bg-purple-9 text-white">
              <div class="row items-center justify-center">
                <div class="col-4 text-center">
                  <div class="q-headline sm-q-caption">{{ regionalInventoryCount.totalDevice }}</div>
                </div>
                <div class="col items-center text-center full-height gt-md">
                  <div style="border-left:1px solid #fff;height: 35px;"></div>
                </div>
                <div class="col-7 text-center">
                  <div class="lg-q-title sm-q-caption text-weight-light">Stock Inventory (Bijlipay)</div>
                </div>
              </div>
            </q-card>

            <q-card class="q-py-md">
              <div class="row items-center text-center" style="min-height:75px">
                <div class="col-4 q-my-xs">
                  <div class="q-caption text-grey-10">Allocated Devices</div>
                  <q-chip color="purple-9">{{ regionalInventoryCount.allocatedDeviceCount }}</q-chip>
                </div>
                <div class="col-4 q-my-xs">
                  <div class="q-caption text-grey-10">Pending Devices</div>
                  <q-chip color="purple-9">{{ regionalInventoryCount.pendingDeviceCount }}</q-chip>
                </div>
                <div class="col-4 q-my-xs">
                  <div class="q-caption text-grey-10">Damaged Devices</div>
                  <q-chip color="purple-9">{{ regionalInventoryCount.damagedDeviceCount }}</q-chip>
                </div>
              </div>
            </q-card>
          </div>

          <!-- Implementation Card -->
          <div class="col-lg-4 col-md-6 col-sm-12">
            <q-card class="border-radius-10 q-pa-md bg-purple-9 text-white">
              <div class="row items-center justify-center">
                <div class="col-4 text-center">
                  <div class="q-headline sm-q-caption">{{ marsDeviceCount.totalMarsDeviceCount }}</div>
                </div>
                <div class="col items-center text-center full-height gt-md">
                  <div style="border-left:1px solid #fff;height: 35px;"></div>
                </div>
                <div class="col-7 text-center">
                  <div class="lg-q-title md-q-caption sm-q-caption text-weight-light">Implementation</div>
                </div>
              </div>
            </q-card>

            <q-card class="q-py-md">
              <div class="row items-center text-center" style="min-height:75px">
                <div class="col-6 q-my-xs">
                  <div class="q-caption text-grey-10">Assigned/{{ marsDeviceCount.assignedDeviceCount }}</div>
                </div>
                <div class="col-6 q-my-xs">
                  <div class="q-caption text-negative">
                    <q-icon color="amber-9" name="fa fa-bell" /> Unassigned/{{ marsDeviceCount.unassignedDeviceCount }}
                  </div>
                </div>
              </div>
            </q-card>
          </div>
        </div>

        <!-- Service Request Card -->
        <div class="row gutter-x-xs gutter-y-xs items-center justify-center q-mt-md">
          <div class="col">
            <q-card class="border-radius-10 q-pa-md bg-purple-9 text-white">
              <div class="row items-center justify-center">
                <div class="col-4 text-center">
                  <div class="q-headline sm-q-caption">{{ serviceRequestCount.total }}</div>
                </div>
                <div class="col items-center text-center full-height gt-md">
                  <div style="border-left:1px solid #fff;height: 35px;"></div>
                </div>
                <div class="col-7 text-center">
                  <div class="lg-q-title sm-q-caption text-weight-light">Service Request</div>
                </div>
              </div>
            </q-card>

            <q-card class="row border-radius-10 q-pa-md">
              <!-- Internal Requests -->
              <div class="col-6 q-py-md text-center">
                <div class="lg-q-title sm-q-caption text-weight-light"><strong>Internal</strong></div>
                <div class="row justify-center" style="min-height:75px">
                  <div class="col-4 q-my-xs" v-for="(val, key) in serviceRequestCount.internal" :key="key">
                    <div class="q-caption text-grey-10">{{ key }}</div>
                    <q-chip color="purple-9">{{ val ?? 0 }}</q-chip>
                  </div>
                  <div class="col-4 q-my-xs">
                    <div class="q-caption text-grey-10">Total</div>
                    <q-chip color="purple-9">{{ serviceRequestCount.intTotal ?? 0 }}</q-chip>
                  </div>
                </div>
              </div>

              <div class="col items-center text-center full-height gt-md">
                <div style="border-left:1px solid rgb(209 209 209);height: 200px;"></div>
              </div>

              <!-- External Requests -->
              <div class="col-6 q-py-md text-center">
                <div class="lg-q-title sm-q-caption text-weight-light"><strong>External</strong></div>
                <div class="row justify-center" style="min-height:75px">
                  <div class="col-4 q-my-xs" v-for="(val, key) in serviceRequestCount.external" :key="key">
                    <div class="q-caption text-grey-10">{{ key }}</div>
                    <q-chip color="purple-9">{{ val ?? 0 }}</q-chip>
                  </div>
                  <div class="col-4 q-my-xs">
                    <div class="q-caption text-grey-10">Total</div>
                    <q-chip color="purple-9">{{ serviceRequestCount.extTotal ?? 0 }}</q-chip>
                  </div>
                </div>
              </div>
            </q-card>
          </div>
        </div>

        <!-- Aging Tracker -->
        <div class="row gutter-x-xs">
          <div class="col-lg-12">
            <q-card class="q-my-md q-px-md q-py-sm bg-grey-12 round-borders">
              <q-card-title>
                <div class="q-subheading text-bold">Aging Tracker</div>
              </q-card-title>
              <chartSATagingTracker
                :options="{ responsive: false, maintainAspectRatio: false }"
                :height="150"
                class="bg-white q-pa-md round-borders"
              />
            </q-card>
          </div>
        </div>
      </div>

      <!-- Right Side: Application Pending -->
      <div class="col-lg-4">
        <div class="row gutter-x-xs gutter-y-xs items-center justify-center">
          <div class="col-md-5 col-sm-12">
            <q-card
              class="q-pa-sm full-height bg-orange border-radius-10 text-center text-white cursor-pointer"
              @click="retrieveLeadsList(applicationPendingCount.totalApplicationPendingLeadIds)"
            >
              <q-card-title>
                <div class="q-title">{{ applicationPendingCount.totalApplicationPendingCount }}</div>
              </q-card-title>
              <q-card-separator style="width:75px" class="bg-white" />
              <q-card-main>
                <p class="md-q-subheading sm-q-caption text-white">Application Pending</p>
              </q-card-main>
            </q-card>
          </div>
          <div class="col-md-7 col-sm-12">
            <div class="row lg-inline gutter-xs">
              <div
                v-for="item in applicationPendingItems"
                :key="item.label"
                class="col-lg-4 col-sm-4 col-xs-4"
              >
                <q-card :class="item.bg" class="q-pa-sm border-radius-10 text-center cursor-pointer" @click="retrieveLeadsList(item.ids)">
                  <div class="row items-center justify-around q-pa-xs">
                    <div class="col-12">
                      <div class="md-q-subheading sm-q-caption text-white"><small>{{ item.label }}</small></div>
                    </div>
                    <div class="col-12">
                      <div class="q-body-1 text-white">{{ item.count }}</div>
                    </div>
                  </div>
                </q-card>
              </div>
            </div>
          </div>
        </div>
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
import { ref, reactive, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import chartSATagingTracker from "../../components/sat/chartSATagingTracker.js";
import leadList from "../../components/sat/leadList.vue";

export default {
  name: "dashboardBackup",
  components: { leadList, chartSATagingTracker},
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
      totalExceptionCount: 0
    });

    const regionalInventoryCount = reactive({
      allocatedDeviceCount: 0,
      damagedDeviceCount: 0,
      pendingDeviceCount: 0,
      totalDevice: 0
    });

    const marsDeviceCount = reactive({
      assignedDeviceCount: 0,
      totalMarsDeviceCount: 0,
      unassignedDeviceCount: 0
    });

    const serviceRequestCount = reactive({
      external: { closed: 0, assigned: 0, unassigned: 0, ReOpenAssigned: 0, ReOpenedUnAssigned: 0 },
      internal: { closed: 0, assigned: 0, unassigned: 0, ReOpenAssigned: 0, ReOpenedUnAssigned: 0 },
      total: 0,
      intTotal: 0,
      extTotal: 0
    });

    const applicationPendingCount = reactive({
      totalApplicationPendingCount: 0,
      totalApplicationPendingLeadIds: [],
      financePendingCount: 0,
      financePendingLeadIds: [],
      financeRejectCount: 0,
      financeRejectLeadIds: [],
      wipCount: 0,
      wipLeadIds: [],
      withSatCount: 0,
      withSatLeadIds: [],
      withOPSHead: 0,
      withOPSLeadIds: []
    });

    const applicationPendingItems = computed(() => [
      { label: "Fin rejects", count: applicationPendingCount.financeRejectCount, ids: applicationPendingCount.financeRejectLeadIds, bg: "bg-negative" },
      { label: "Fin pending", count: applicationPendingCount.financePendingCount, ids: applicationPendingCount.financePendingLeadIds, bg: "bg-amber-9" },
      { label: "WIP", count: applicationPendingCount.wipCount, ids: applicationPendingCount.wipLeadIds, bg: "bg-blue-6" },
      { label: "New", count: applicationPendingCount.withSatCount, ids: applicationPendingCount.withSatLeadIds, bg: "bg-positive" },
      { label: "Ops", count: applicationPendingCount.withOPSHead, ids: applicationPendingCount.withOPSLeadIds, bg: "bg-purple-9" }
    ]);

    // Fetch Dashboard Data
    const fetchCountInformation = async () => {
      $q.loading.show({ delay: 100, spinnerColor: "purple-9", message: "Fetching data ..." });
      try {
        await store.dispatch("SAT_Dashboard/FETCH_DASHBOARD_COUNT", JSON.parse(localStorage.getItem("u_i")).region.id);
        Object.assign(applicationPendingCount, store.getters["SAT_Dashboard/getSatDashboard"].applicationPendingCount);
        Object.assign(exceptionCount, store.getters["SAT_Dashboard/getSatDashboard"].exceptionCount);
        Object.assign(marsDeviceCount, store.getters["SAT_Dashboard/getSatDashboard"].marsDeviceCount);
        Object.assign(regionalInventoryCount, store.getters["SAT_Dashboard/getSatDashboard"].regionalInventoryCount);

        await store.dispatch("SAT_Dashboard/FETCH_SAT_AGING_TRACKER_DATA", JSON.parse(localStorage.getItem("u_i")).region.id);
      } finally {
        $q.loading.hide();
      }
    };

    const retrieveLeadsList = (props) => {
      dashboardAgingTrackerLeads.value = !dashboardAgingTrackerLeads.value;
      if (props && props.length > 0) rowDetails.value = props;
      else if (props) $q.notify({ color: "amber-9", position: "bottom", message: "Oops, no lead available to display", icon: "info" });
    };

    onMounted(() => {
      fetchCountInformation();
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
      serviceRequestCount,
      applicationPendingCount,
      applicationPendingItems,
      retrieveLeadsList,
      $q
    };
  }
};
</script>

<style scoped>
.border-radius-10 {
  border-radius: 8px !important;
}
</style>
