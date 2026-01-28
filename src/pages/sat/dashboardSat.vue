<template>
  <q-page>
    <!--START: content -->
    <div class="q-pa-md">
      <!-- START: Dashboard wrapper -->
      <div class="row gutter-x-xs">
        <!-- Exception Card -->
        <div class="col-lg-4 col-md-6 col-sm-12" v-for="card in exceptionCards" :key="card.title">
          <q-card class="border-radius-10 q-pa-md" color="purple-9">
            <div class="row items-center justify-center">
              <div class="col-4 items-center text-center">
                <div class="q-headline sm-q-caption text-center">{{ card.count }}</div>
              </div>
              <div class="col items-center text-center full-height gt-md">
                <div style="border-left:1px solid #fff;height: 35px !important;"></div>
              </div>
              <div class="col-7 items-center">
                <div class="lg-q-title sm-q-caption text-weight-light text-center">{{ card.title }}</div>
              </div>
            </div>
          </q-card>
          <q-card class="q-py-md items-center">
            <div class="row items-center text-center" style="min-height:75px">
              <div
                class="col-md-4 q-my-xs"
                v-for="sub in card.subItems"
                :key="sub.label"
              >
                <div class="q-caption text-grey-10">{{ sub.label }}</div>
                <q-chip
                  class="cursor-pointer"
                  color="purple-9"
                  @click="retrieveLeadsList(sub.leadIds)"
                >
                  {{ sub.count }}
                </q-chip>
              </div>
            </div>
          </q-card>
        </div>

        <!-- Stock Inventory Card -->
        <div class="col-lg-4 col-md-6 col-sm-12" v-for="card in stockCards" :key="card.title">
          <q-card class="border-radius-10 q-pa-md" color="purple-9">
            <div class="row items-center justify-center">
              <div class="col-4 items-center text-center">
                <div class="q-headline sm-q-caption text-center">{{ card.total }}</div>
              </div>
              <div class="col items-center text-center full-height gt-md">
                <div style="border-left:1px solid #fff;height: 35px !important;"></div>
              </div>
              <div class="col-7 items-center">
                <div class="lg-q-title sm-q-caption text-weight-light text-center">{{ card.title }}</div>
              </div>
            </div>
          </q-card>
          <q-card class="q-py-md items-center">
            <div class="row items-center text-center" style="min-height:75px">
              <div
                class="col-md-4 q-my-xs"
                v-for="sub in card.subItems"
                :key="sub.label"
              >
                <div class="q-caption text-grey-10">{{ sub.label }}</div>
                <q-chip color="purple-9">{{ sub.count }}</q-chip>
              </div>
            </div>
          </q-card>
        </div>
      </div>

      <!-- Service Request Card -->
      <div class="row gutter-x-xs gutter-y-xs items-center justify-center q-mt-md">
        <div class="col">
          <q-card class="border-radius-10 q-pa-md" color="purple-9">
            <div class="row items-center justify-center">
              <div class="col-4 items-center text-center">
                <div class="q-headline sm-q-caption text-center">{{ serviceRequestCount.total }}</div>
              </div>
              <div class="col items-center text-center full-height gt-md">
                <div style="border-left:1px solid #fff;height: 35px !important;"></div>
              </div>
              <div class="col-7 items-center">
                <div class="lg-q-title sm-q-caption text-weight-light text-center">Service Request</div>
              </div>
            </div>
          </q-card>

          <q-card class="row border-radius-10 q-pa-md">
            <div class="col-6 q-py-md" v-for="type in ['internal', 'external']" :key="type">
              <div class="col border-radius-10 q-pa-md text-center">
                <div class="lg-q-title sm-q-caption text-weight-light text-center">
                  <strong>{{ capitalize(type) }}</strong>
                </div>
              </div>
              <div class="row text-center justify-center" style="min-height:75px">
                <div
                  class="col-md-4 q-my-xs"
                  v-for="(value, key) in serviceRequestCount[type]"
                  :key="key"
                >
                  <div class="q-caption text-grey-10">{{ capitalize(key) }}</div>
                  <q-chip color="purple-9">{{ value ?? 0 }}</q-chip>
                </div>
              </div>
            </div>
            <div class="col items-center text-center full-height gt-md">
              <div style="border-left:1px solid rgb(209 209 209);height: 200px !important;"></div>
            </div>
          </q-card>
        </div>
      </div>

      <!-- Aging Tracker Table -->
      <div class="row gutter-x-xs gutter-y-xs q-my-xs items-center">
        <div class="col-md-12">
          <q-card square>
            <q-card-title>
              Aging Tracker - <span class="text-amber-9">Pending</span>
            </q-card-title>
            <q-card-section>
              <q-table
                dense
                hide-bottom
                :rows="agingTrackerPendingTableData"
                :columns="agingTrackerPendingColumns"
                row-key="name"
              >
                <template #body-cell-name="props">
                  {{ props.row.name }}
                </template>
                <template #body-cell-greaterThanOneDay="props">
                  <q-td
                    class="cursor-pointer"
                    @click="retrieveLeadsList(props.row.greaterThanOneDayLeadIdList)"
                  >
                    {{ props.row.greaterThanOneDay }}
                  </q-td>
                </template>
                <template #body-cell-greaterThanTwoDays="props">
                  <q-td
                    class="cursor-pointer"
                    @click="retrieveLeadsList(props.row.greaterThanTwoDaysLeadIdList)"
                  >
                    {{ props.row.greaterThanTwoDays }}
                  </q-td>
                </template>
                <template #body-cell-greaterThanFiveDays="props">
                  <q-td
                    class="cursor-pointer"
                    @click="retrieveLeadsList(props.row.greaterThanFiveDaysLeadIdList)"
                  >
                    {{ props.row.greaterThanFiveDays }}
                  </q-td>
                </template>
              </q-table>
            </q-card-section>
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
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';

import leadList from '../../components/sat/leadList.vue';

const $q = useQuasar();
const store = useStore();

// Reactive state
const dateSelection = ref('DAYS');
const renderMerchantGraph = ref(true);
const dashboardAgingTrackerLeads = ref(false);
const rowDetails = ref({});

const exceptionCount = reactive({
  banksubventionPendingCount: 0,
  kycPendingCount: 0,
  pricingPendingCount: 0,
  totalExceptionCount: 0
});

const aggregatorCount = reactive({
  totalDevice: 0,
  damagedDeviceCount: 0,
  pendingDeviceCount: 0,
  allocatedDeviceCount: 0
});

const marsDeviceCount = reactive({
  assignedDeviceCount: 0,
  totalMarsDeviceCount: 0,
  unassignedDeviceCount: 0
});

const regionalInventoryCount = reactive({
  allocatedDeviceCount: 0,
  damagedDeviceCount: 0,
  pendingDeviceCount: 0,
  totalDevice: 0
});

const serviceRequestCount = reactive({
  external: { closed: 0, assigned: 0, unassigned: 0, ReOpenAssigned: 0, ReOpenedUnAssigned: 0 },
  internal: { closed: 0, assigned: 0, unassigned: 0, ReOpenAssigned: 0, ReOpenedUnAssigned: 0 },
  total: 0,
  intTotal: 0,
  extTotal: 0
});

const applicationPendingCount = reactive({
  financePendingCount: 0,
  financeRejectCount: 0,
  wipCount: 0,
  withOPSHead: 0
});

const agingTrackerPendingColumns = [
  { name: 'name', label: 'Stage', align: 'left', field: 'name', sortable: false },
  { name: 'greaterThanOneDay', label: '>1', align: 'left', field: 'greaterThanOneDay', sortable: true },
  { name: 'greaterThanTwoDays', label: '>2', align: 'left', field: 'greaterThanTwoDays', sortable: true },
  { name: 'greaterThanFiveDays', label: '>5', align: 'left', field: 'greaterThanFiveDays', sortable: true }
];

const agingTrackerPendingTableData = ref([]);

// Methods
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Computed
const getSatDashboard = computed(() => store.getters['SAT_Dashboard/getSatDashboard']);
const getAggregatorsSatDashboard = computed(() => store.getters['SAT_Dashboard/getAggregatorsSatDashboard']);
const getSatAgingTrackerdata = computed(() => store.getters['SAT_Dashboard/getSatAgingTrackerdata']);
const getserviceRequestCountDatas = computed(() => store.getters['serviceRequestSat/getserviceRequestCountDatas']);
const getserviceRequestPhonepeCountDatas = computed(() => store.getters['serviceRequestPhonepeSat/getserviceRequestPhonepeCountDatas']);

// Cards array for rendering in template
const exceptionCards = computed(() => [
  {
    title: 'Exception',
    count: exceptionCount.totalExceptionCount,
    subItems: [
      { label: 'KYC Exception', count: exceptionCount.kycPendingCount, leadIds: getSatDashboard.value?.exceptionCount?.kycPendingLeadIds || [] },
      { label: 'Bank Exception', count: exceptionCount.banksubventionPendingCount, leadIds: getSatDashboard.value?.exceptionCount?.banksubventionPendingLeadIds || [] },
      { label: 'Pricing Subvention', count: exceptionCount.pricingPendingCount, leadIds: getSatDashboard.value?.exceptionCount?.pricingPendingLeadIds || [] }
    ]
  }
]);

const stockCards = computed(() => [
  {
    title: 'Stock Inventory (Bijlipay)',
    total: regionalInventoryCount.totalDevice,
    subItems: [
      { label: 'Allocated Devices', count: regionalInventoryCount.allocatedDeviceCount },
      { label: 'Pending Devices', count: regionalInventoryCount.pendingDeviceCount },
      { label: 'Damaged Devices', count: regionalInventoryCount.damagedDeviceCount }
    ]
  }
]);

// Methods
function fetchCountInformation() {
  $q.loading.show({ delay: 100, spinnerColor: 'purple-9', message: 'Fetching data ..' });
  store.dispatch('SAT_Dashboard/FETCH_DASHBOARD_COUNT', JSON.parse(localStorage.getItem('u_i')).region.id)
    .then(() => {
      Object.assign(applicationPendingCount, getSatDashboard.value.applicationPendingCount);
      Object.assign(exceptionCount, getSatDashboard.value.exceptionCount);
      Object.assign(marsDeviceCount, getSatDashboard.value.marsDeviceCount);
      Object.assign(regionalInventoryCount, getSatDashboard.value.regionalInventoryCount);
      store.dispatch('SAT_Dashboard/FETCH_SAT_AGING_TRACKER_DATA', JSON.parse(localStorage.getItem('u_i')).region.id)
        .then(() => { agingTrackerPendingTableData.value = getSatAgingTrackerdata.value; });
    })
    .finally(() => { $q.loading.hide(); });
}

function fetchAggregatorsCountInformation() {
  $q.loading.show({ delay: 100, spinnerColor: 'purple-9', message: 'Fetching data ..' });
  const param = { region: JSON.parse(localStorage.getItem('u_i')).region.id };
  store.dispatch('SAT_Dashboard/FETCH_AGGREGATORS_DASHBOARD_COUNT', param)
    .then(() => { Object.assign(aggregatorCount, getAggregatorsSatDashboard.value.regionalInventoryCount); })
    .finally(() => { $q.loading.hide(); });
}

function fetchServiceRequestCounts() {
  $q.loading.show({ delay: 100, spinnerColor: 'purple-9', message: 'Fetching data ..' });
  store.dispatch('serviceRequestSat/FETCH_SERVICE_REQUEST_COUNT_DETAILS')
    .then(() => { Object.assign(serviceRequestCount, getserviceRequestCountDatas.value); })
    .finally(() => { $q.loading.hide(); });

  store.dispatch('serviceRequestPhonepeSat/FETCH_PHONEPE_SERVICE_REQUEST_COUNT_DETAILS')
    .then(() => { Object.assign(serviceRequestCount, getserviceRequestPhonepeCountDatas.value); })
    .finally(() => { $q.loading.hide(); });
}

function changeMerchantTrackerData(value) {
  renderMerchantGraph.value = false;
  $q.loading.show({ delay: 100, spinnerColor: 'purple-9', message: 'Fetching data ..' });
  dateSelection.value = value;
  store.dispatch('SAT_Dashboard/FETCH_DASHBOARD_CHART_DATA', {
    region: JSON.parse(localStorage.getItem('u_i')).region.id,
    action: value
  })
    .then(() => { renderMerchantGraph.value = true; })
    .catch(() => { renderMerchantGraph.value = false; })
    .finally(() => { $q.loading.hide(); });
}

function retrieveLeadsList(leadIds) {
  dashboardAgingTrackerLeads.value = !dashboardAgingTrackerLeads.value;
  if (leadIds && leadIds.length > 0) {
    rowDetails.value = leadIds;
  } else if (leadIds !== undefined) {
    $q.notify({ color: 'amber-9', position: 'bottom', message: 'Oops, no lead available to display', icon: 'info' });
  }
}

// Lifecycle
onMounted(() => {
  fetchCountInformation();
  fetchServiceRequestCounts();
  changeMerchantTrackerData('DAYS');
  fetchAggregatorsCountInformation();
});
</script>

<style scoped>
.border-radius-10 { border-radius: 8px !important; }
.q-item-main.q-item-section.shadow-1.q-pa-md { min-height: 80px; }
.customTabActive { background: #212c3f; color: #fff; }
</style>