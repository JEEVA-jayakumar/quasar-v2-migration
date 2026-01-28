<template>
  <q-page class="q-pa-md">
    <!-- START: Dashboard wrapper -->
    <div class="row gutter-x-xs">
      <!-- LEFT DASHBOARD CARDS -->
      <div class="col-lg-8">
        <div class="row gutter-x-xs">
          <DashboardCard
            title="Exception"
            total="100"
            :chips="[
              { label: 'KYC Exception', value: 1 },
              { label: 'Pricing Exception', value: 1 },
              { label: 'Bank Subvention', value: 1 }
            ]"
          />
          <DashboardCard
            title="Inventory Allocation"
            total="100"
            :chips="[
              { label: 'KYC Exception', value: 1 },
              { label: 'Pricing Exception', value: 1 },
              { label: 'Bank Subvention', value: 1 }
            ]"
          />
          <DashboardCard
            title="Implementation"
            total="100"
            :chips="[
              { label: 'Allocated/80', value: null },
              { label: 'Unallocated/70', value: null, color: 'red' }
            ]"
          />
        </div>

        <!-- GRAPHS -->
        <div class="row gutter-x-xs">
          <div class="col-lg-12">
            <q-card class="q-my-md q-px-md q-py-sm bg-grey-12 round-borders">
              <q-card-title>
                <div class="q-subheading text-bold">Daily volume graphs</div>
                <div class="q-caption">01/01/18 to 01/12/18</div>
              </q-card-title>
              <chartDailyVolume
                :options="{responsive: false, maintainAspectRatio: false}"
                :height="150"
                class="bg-white q-pa-md round-borders"
              />
            </q-card>

            <q-card class="q-my-md q-px-md q-py-sm bg-grey-12 round-borders">
              <q-card-title>
                <div class="q-subheading text-bold">Merchant Tracker</div>
                <div class="q-caption">01/01/18 to 01/12/18</div>
              </q-card-title>
              <chartMerchantTracker
                :borderWidth="1"
                :height="150"
                class="bg-white q-pa-md round-borders"
              />
            </q-card>
          </div>
        </div>
      </div>

      <!-- RIGHT DASHBOARD CARDS -->
      <div class="col-lg-4">
        <div class="row gutter-sm">
          <div class="col-lg-5">
            <q-card class="q-pa-sm bg-orange border-radius-10 text-center">
              <q-card-title>
                <div class="q-title text-white">150</div>
                <div class="q-caption text-white">Total</div>
              </q-card-title>
              <q-separator style="width:75px" class="bg-white" />
              <q-card-main class="q-py-md q-px-none">
                <p class="md-q-subheading sm-q-caption text-faded text-white">
                  Application Pending
                </p>
              </q-card-main>
            </q-card>
          </div>

          <div class="col-lg-7">
            <div class="row lg-inline gutter-sm">
              <StatusCard title="NEW" value="150" color="green" />
              <StatusCard title="WIP" value="150" color="blue-6" />
            </div>
          </div>
        </div>

        <!-- AGING TRACKER -->
        <AgingTracker :trackerData="agingTrackerPending" status-label="Pending" />
        <AgingTracker :trackerData="agingTrackerPending" status-label="Rejected" />
      </div>
    </div>
    <!-- END: Dashboard wrapper -->
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import chartDailyVolume from "../../components/sat/chartDailyVolume.js";
import chartMerchantTracker from "../../components/sat/chartMerchantTracker.js";

// Reusable components
import DashboardCard from "../../components/DashboardCard.vue";
import StatusCard from "../../components/StatusCard.vue";
import AgingTracker from "../../components/AgingTracker.vue";

// DATA: Aging Tracker Tabs
const agingTrackerPending = ref({
  tabsModel: "tab1",
  tabs: [
    { name: "tab1", tabTitle: "Finance Approval" },
    { name: "tab2", tabTitle: "Finance Rejection" },
    { name: "tab3", tabTitle: "Finance Pending" },
    { name: "tab4", tabTitle: "Finance Implemented" },
  ],
  tabItems: [
    {
      name: "tab1",
      tabItemDetails: [
        { alert: false, title: "Dominos", created_date: "20 Apr, 2018", so_name: "Ashokan", tid: 554845, status: 1 },
        { alert: false, title: "Bombay fries", created_date: "20 Apr, 2018", so_name: "Arun Kumar", tid: 554845, status: 1 },
        { alert: true, title: "Dominos", created_date: "20 Apr, 2018", so_name: "Ashokan", tid: 554845, status: 1 },
      ]
    },
    {
      name: "tab2",
      tabItemDetails: [
        { alert: true, title: "Bombay fries", created_date: "20 Apr, 2018", so_name: "Ashokan", tid: 554845, status: "Implementation Pending" },
        { alert: false, title: "Bombay fries", created_date: "20 Apr, 2018", so_name: "Arun Kumar", tid: 554845, status: "Approved" },
        { alert: false, title: "Dominos", created_date: "20 Apr, 2018", so_name: "Ashokan", tid: 554845, status: "Rejected" },
      ]
    },
    {
      name: "tab3",
      tabItemDetails: [
        { alert: true, title: "Bombay fries", created_date: "20 Apr, 2018", so_name: "Ashokan", tid: 554845, status: "Implementation Pending" },
        { alert: false, title: "Bombay fries", created_date: "20 Apr, 2018", so_name: "Arun Kumar", tid: 554845, status: "Approved" },
        { alert: false, title: "Dominos", created_date: "20 Apr, 2018", so_name: "Ashokan", tid: 554845, status: "Rejected" },
      ]
    },
    {
      name: "tab4",
      tabItemDetails: [
        { alert: true, title: "Bombay fries", created_date: "20 Apr, 2018", so_name: "Ashokan", tid: 554845, status: "Implementation Pending" },
        { alert: false, title: "Bombay fries", created_date: "20 Apr, 2018", so_name: "Arun Kumar", tid: 554845, status: "Approved" },
        { alert: false, title: "Dominos", created_date: "20 Apr, 2018", so_name: "Ashokan", tid: 554845, status: "Rejected" },
      ]
    }
  ]
});
</script>

<style scoped>
.border-radius-10 {
  border-radius: 8px !important;
}
.q-chip.custom_chip_progress {
  height: 35px;
  width: 35px;
  border-radius: 30px;
  text-align: center;
  border: 3px solid #691b9a;
  color: #333 !important;
  background: #fff !important;
}
.customTabActive {
  background: #212c3f;
  color: #fff;
}
</style>
