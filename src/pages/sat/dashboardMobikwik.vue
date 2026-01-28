<template>
  <q-page class="q-pa-md">
    <!-- START: Dashboard wrapper -->
    <div class="row gutter-x-xs">
      <!-- Exception Card -->
      <div class="col-lg-4 col-md-6 col-sm-12">
        <q-card class="border-radius-10 q-pa-md bg-purple-9">
          <div class="row items-center justify-center">
            <div class="col-lg-4 col-md-8 col-sm-12 text-center">
              <div class="q-headline sm-q-caption">{{ exceptionCount.totalExceptionCount }}</div>
            </div>
            <div class="col items-center text-center full-height gt-md">
              <div class="divider-left"></div>
            </div>
            <div class="col-lg-7 col-md-8 col-sm-12 text-center">
              <div class="lg-q-title sm-q-caption text-weight-light">Exception</div>
            </div>
          </div>
        </q-card>

        <q-card class="q-py-md text-center">
          <div class="row items-center justify-center" style="min-height:75px">
            <div class="col-md-4 q-my-xs">
              <div class="q-caption text-grey-10">KYC Exception</div>
              <q-chip class="cursor-pointer" color="purple-9"
                @click="retrieveLeadsList(exceptionCount.kycPendingLeadIds)">
                {{ exceptionCount.kycPendingCount }}
              </q-chip>
            </div>
            <div class="col-md-4 q-my-xs">
              <div class="q-caption text-grey-10">Bank Exception</div>
              <q-chip class="cursor-pointer" color="purple-9"
                @click="retrieveLeadsList(exceptionCount.banksubventionPendingLeadIds)">
                {{ exceptionCount.banksubventionPendingCount }}
              </q-chip>
            </div>
            <div class="col-md-4 q-my-xs">
              <div class="q-caption text-grey-10">Pricing Subvention</div>
              <q-chip class="cursor-pointer" color="purple-9"
                @click="retrieveLeadsList(exceptionCount.pricingPendingLeadIds)">
                {{ exceptionCount.pricingPendingCount }}
              </q-chip>
            </div>
          </div>
        </q-card>
      </div>

      <!-- Stock Inventory Card -->
      <div class="col-lg-4 col-md-6 col-sm-12">
        <q-card class="border-radius-10 q-pa-md bg-purple-9">
          <div class="row items-center justify-center">
            <div class="col-lg-4 col-md-8 col-sm-12 text-center">
              <div class="q-headline sm-q-caption">{{ regionalInventoryCount.totalDevice }}</div>
            </div>
            <div class="col items-center text-center full-height gt-md">
              <div class="divider-left"></div>
            </div>
            <div class="col-lg-7 col-md-8 col-sm-12 text-center">
              <div class="lg-q-title sm-q-caption text-weight-light">Stock Inventory (Bijlipay)</div>
            </div>
          </div>
        </q-card>

        <q-card class="q-py-md text-center">
          <div class="row items-center justify-center" style="min-height:75px">
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

      <!-- Implementation Card -->
      <div class="col-lg-4 col-md-6 col-sm-12">
        <q-card class="border-radius-10 q-pa-md bg-purple-9">
          <div class="row items-center justify-center">
            <div class="col-lg-4 col-md-8 col-sm-12 text-center">
              <div class="q-headline sm-q-caption">{{ marsDeviceCount.totalMarsDeviceCount }}</div>
            </div>
            <div class="col items-center text-center full-height gt-md">
              <div class="divider-left"></div>
            </div>
            <div class="col-lg-7 col-md-8 col-sm-12 text-center">
              <div class="lg-q-title md-q-caption sm-q-caption text-weight-light">Implementation</div>
            </div>
          </div>
        </q-card>

        <q-card class="q-py-md text-center">
          <div class="row items-center justify-center" style="min-height:75px">
            <div class="col-md-6 q-my-xs">
              <div class="q-caption">Assigned / {{ marsDeviceCount.assignedDeviceCount }}</div>
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

    <!-- Aggregator Stock Inventory -->
    <div class="q-my-md q-px-md q-py-sm bg-grey-12 round-borders">
      <q-card-title>
        <div class="q-subheading text-bold">Stock Inventory (Aggregator)</div>
      </q-card-title>

      <div class="row gutter-x-xs gutter-y-xs items-center justify-center q-mt-md">
        <div class="col">
          <q-card class="border-radius-10 q-pa-md bg-purple-9">
            <div class="row items-center justify-center">
              <div class="col-lg-4 col-md-8 col-sm-12 text-center">
                <div class="q-headline sm-q-caption">{{ aggregatorCount.totalDevice }}</div>
              </div>
              <div class="col items-center text-center full-height gt-md">
                <div class="divider-left"></div>
              </div>
              <div class="col-lg-7 col-md-8 col-sm-12 text-center">
                <div class="lg-q-title md-q-caption sm-q-caption text-weight-light">Aggregators</div>
              </div>
            </div>
          </q-card>

          <q-card class="q-py-md text-center">
            <div class="row items-center justify-center" style="min-height:75px">
              <div class="col-md-4 q-my-xs">
                <div class="q-caption text-grey-10">Pending Device</div>
                <q-chip color="purple-9">{{ aggregatorCount.pendingDeviceCount }}</q-chip>
              </div>
              <div class="col-md-4 q-my-xs">
                <div class="q-caption text-grey-10">Allocated Device</div>
                <q-chip color="purple-9">{{ aggregatorCount.allocatedDeviceCount }}</q-chip>
              </div>
              <div class="col-md-4 q-my-xs">
                <div class="q-caption text-grey-10">Damaged Device</div>
                <q-chip color="purple-9">{{ aggregatorCount.damagedDeviceCount }}</q-chip>
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Service Requests -->
    <div class="row gutter-x-xs gutter-y-xs items-center justify-center q-mt-md">
      <div class="col">
        <q-card class="border-radius-10 q-pa-md bg-purple-9">
          <div class="row items-center justify-center">
            <div class="col-lg-4 col-md-8 col-sm-12 text-center">
              <div class="q-headline sm-q-caption">{{ serviceRequestCount.total }}</div>
            </div>
            <div class="col items-center text-center full-height gt-md">
              <div class="divider-left-service"></div>
            </div>
            <div class="col-lg-7 col-md-8 col-sm-12 text-center">
              <div class="lg-q-title sm-q-caption text-weight-light">Service Request</div>
            </div>
          </div>
        </q-card>

        <q-card class="row border-radius-10 q-pa-md">
          <!-- Internal -->
          <div class="col-6 q-py-md text-center">
            <q-card class="q-pa-md border-radius-10">
              <div class="lg-q-title sm-q-caption text-weight-light">Internal</div>
            </q-card>
            <div class="row items-center justify-center" style="min-height:75px">
              <div v-for="(val,key) in internalServiceRequests" :key="key" class="col-md-4 q-my-xs">
                <div class="q-caption text-grey-10">{{ val.label }}</div>
                <q-chip color="purple-9">{{ val.value }}</q-chip>
              </div>
            </div>
          </div>

          <div class="col items-center text-center full-height gt-md">
            <div class="divider-left-service"></div>
          </div>

          <!-- External -->
          <div class="col-6 q-py-md text-center">
            <q-card class="q-pa-md border-radius-10">
              <div class="lg-q-title sm-q-caption text-weight-light">External</div>
            </q-card>
            <div class="row items-center justify-center" style="min-height:75px">
              <div v-for="(val,key) in externalServiceRequests" :key="key" class="col-md-4 q-my-xs">
                <div class="q-caption text-grey-10">{{ val.label }}</div>
                <q-chip color="purple-9">{{ val.value }}</q-chip>
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- Aging Tracker Table -->
    <div class="row gutter-x-xs gutter-y-xs q-my-xs items-center">
      <div class="col-12">
        <q-card square>
          <q-card-title>
            Aging Tracker - <span class="text-amber-9">Pending</span>
          </q-card-title>
          <q-card-section>
            <q-table dense :rows="agingTrackerPendingTableData" :columns="agingTrackerPendingColumns" row-key="name">
              <template v-slot:body-cell-greaterThanOneDay="props">
                <q-td class="cursor-pointer" @click="retrieveLeadsList(props.row.greaterThanOneDayLeadIdList)">
                  {{ props.row.greaterThanOneDay }}
                </q-td>
              </template>
              <template v-slot:body-cell-greaterThanTwoDays="props">
                <q-td class="cursor-pointer" @click="retrieveLeadsList(props.row.greaterThanTwoDaysLeadIdList)">
                  {{ props.row.greaterThanTwoDays }}
                </q-td>
              </template>
              <template v-slot:body-cell-greaterThanFiveDays="props">
                <q-td class="cursor-pointer" @click="retrieveLeadsList(props.row.greaterThanFiveDaysLeadIdList)">
                  {{ props.row.greaterThanFiveDays }}
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Lead List Modal -->
    <lead-list v-model="dashboardAgingTrackerLeads" :prop-lead-information="rowDetails" />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';
import leadList from '../../components/sat/leadList.vue';

const $q = useQuasar();
const store = useStore();

// STATE
const dateSelection = ref('DAYS');
const renderMerchantGraph = ref(true);
const dashboardAgingTrackerLeads = ref(false);
const rowDetails = ref({});

const exceptionCount = ref({
  banksubventionPendingCount: 0,
  kycPendingCount: 0,
  pricingPendingCount: 0,
  totalExceptionCount: 0
});

const aggregatorCount = ref({
  totalDevice: 0,
  pendingDeviceCount: 0,
  damagedDeviceCount: 0,
  allocatedDeviceCount: 0
});

const marsDeviceCount = ref({
  assignedDeviceCount: 0,
  totalMarsDeviceCount: 0,
  unassignedDeviceCount: 0
});

const regionalInventoryCount = ref({
  allocatedDeviceCount: 0,
  damagedDeviceCount: 0,
  pendingDeviceCount: 0,
  totalDevice: 0
});

const serviceRequestCount = ref({
  external: { closed: 0, assigned: 0, unassigned: 0, ReOpenAssigned: 0, ReOpenedUnAssigned: 0 },
  internal: { closed: 0, assigned: 0, unassigned: 0, ReOpenAssigned: 0, ReOpenedUnAssigned: 0 },
  total: 0,
  intTotal: 0,
  extTotal: 0
});

const applicationPendingCount = ref({
  financePendingCount: 0,
  financeRejectCount: 0,
  wipCount: 0,
  withOPSHead: 0,
  totalApplicationPendingCount: 0
});

const agingTrackerPendingColumns = ref([
  { name: "name", label: "Stage", align: "left", field: "name", sortable: false },
  { name: "greaterThanOneDay", label: ">1", align: "left", field: "greaterThanOneDay", sortable: true },
  { name: "greaterThanTwoDays", label: ">2", align: "left", field: "greaterThanTwoDays", sortable: true },
  { name: "greaterThanFiveDays", label: ">5", align: "left", field: "greaterThanFiveDays", sortable: true }
]);

const agingTrackerPendingTableData = ref([]);

const internalServiceRequests = computed(() => [
  { label: 'Closed', value: serviceRequestCount.value.internal.closed || 0 },
  { label: 'Assigned', value: serviceRequestCount.value.internal.assigned || 0 },
  { label: 'Unassigned', value: serviceRequestCount.value.internal.unassigned || 0 },
  { label: 'Total', value: serviceRequestCount.value.intTotal || 0 },
  { label: 'ReOpenAssigned', value: serviceRequestCount.value.internal.ReOpenAssigned || 0 },
  { label: 'ReOpenedUnAssigned', value: serviceRequestCount.value.internal.ReOpenedUnAssigned || 0 },
]);

const externalServiceRequests = computed(() => [
  { label: 'Closed', value: serviceRequestCount.value.external.closed || 0 },
  { label: 'Assigned', value: serviceRequestCount.value.external.assigned || 0 },
  { label: 'Unassigned', value: serviceRequestCount.value.external.unassigned || 0 },
  { label: 'Total', value: serviceRequestCount.value.extTotal || 0 },
  { label: 'ReOpenAssigned', value: serviceRequestCount.value.external.ReOpenAssigned || 0 },
  { label: 'ReOpenedUnAssigned', value: serviceRequestCount.value.external.ReOpenedUnAssigned || 0 },
]);

// METHODS
const fetchCountInformation = async () => {
  $q.loading.show({ spinnerColor: 'purple-9', message: 'Fetching data ..', delay: 100 });
  try {
    await store.dispatch('SAT_Dashboard/FETCH_DASHBOARD_COUNT', JSON.parse(localStorage.getItem('u_i')).region.id);
    const dashboard = store.getters['SAT_Dashboard/getSatDashboard'];
    Object.assign(applicationPendingCount.value, dashboard.applicationPendingCount);
    Object.assign(exceptionCount.value, dashboard.exceptionCount);
    Object.assign(marsDeviceCount.value, dashboard.marsDeviceCount);
    Object.assign(regionalInventoryCount.value, dashboard.regionalInventoryCount);

    await store.dispatch('SAT_Dashboard/FETCH_SAT_AGING_TRACKER_DATA', JSON.parse(localStorage.getItem('u_i')).region.id);
    agingTrackerPendingTableData.value = store.getters['SAT_Dashboard/getSatAgingTrackerdata'];
  } catch (e) {
    console.error(e);
  } finally {
    $q.loading.hide();
  }
};

const fetchAggregatorsCountInformation = async () => {
  $q.loading.show({ spinnerColor: 'purple-9', message: 'Fetching data ..', delay: 100 });
  try {
    const param = { region: JSON.parse(localStorage.getItem('u_i')).region.id };
    await store.dispatch('SAT_Dashboard/FETCH_AGGREGATORS_DASHBOARD_COUNT', param);
    const data = store.getters['SAT_Dashboard/getAggregatorsSatDashboard'];
    Object.assign(aggregatorCount.value, data.regionalInventoryCount);
  } catch (e) {
    console.error(e);
  } finally {
    $q.loading.hide();
  }
};

const fetchServiceRequestCounts = async () => {
  $q.loading.show({ spinnerColor: 'purple-9', message: 'Fetching data ..', delay: 100 });
  try {
    await store.dispatch('serviceRequestSat/FETCH_SERVICE_REQUEST_COUNT_DETAILS');
    Object.assign(serviceRequestCount.value, store.getters['serviceRequestSat/getserviceRequestCountDatas']);
    await store.dispatch('serviceRequestPhonepeSat/FETCH_PHONEPE_SERVICE_REQUEST_COUNT_DETAILS');
    Object.assign(serviceRequestCount.value, store.getters['serviceRequestPhonepeSat/getserviceRequestPhonepeCountDatas']);
  } catch (e) {
    console.error(e);
  } finally {
    $q.loading.hide();
  }
};

const changeMerchantTrackerData = async (value) => {
  renderMerchantGraph.value = false;
  $q.loading.show({ spinnerColor: 'purple-9', message: 'Fetching data ..', delay: 100 });
  dateSelection.value = value;
  try {
    await store.dispatch('SAT_Dashboard/FETCH_DASHBOARD_CHART_DATA', {
      region: JSON.parse(localStorage.getItem('u_i')).region.id,
      action: value
    });
    renderMerchantGraph.value = true;
  } catch (e) {
    console.error(e);
    renderMerchantGraph.value = false;
  } finally {
    $q.loading.hide();
  }
};

const retrieveLeadsList = (props) => {
  dashboardAgingTrackerLeads.value = !dashboardAgingTrackerLeads.value;
  if (props?.length) rowDetails.value = props;
  else
    $q.notify({ color: 'amber-9', position: 'bottom', message: 'Oops, no lead available to display', icon: 'info' });
};

// ON MOUNT
onMounted(() => {
  fetchCountInformation();
  fetchAggregatorsCountInformation();
  fetchServiceRequestCounts();
  changeMerchantTrackerData('DAYS');
});
</script>

<style scoped>
.border-radius-10 { border-radius: 8px !important; }
.divider-left { border-left: 1px solid #fff; height: 35px !important; }
.divider-left-service { border-left: 1px solid #d1d1d1; height: 200px !important; }
</style>
