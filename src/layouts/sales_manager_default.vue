<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-layout-header class="shadow-0 z-top" flat style="margin-left:0px">
      <customHeader @fnToggleSideMenu="fnMainToggleSideMenu" />
    </q-layout-header>

    <!-- Side Drawer -->
    <q-layout-drawer
      v-model="leftDrawerOpen"
      class="shadow-9"
      content-class="no-shadow"
      :content-style="{ background: '#202c3f', width: '250px' }"
    >
      <q-list
        no-border
        link
        inset-delimiter
        highlight
        style="padding-top:65px"
      >
        <q-item
          v-for="menu in menus"
          :key="menu.id"
          :to="menu.to"
          class="menu-main-item-color"
        >
          <q-item-main class="menu-item-color">{{ menu.name }}</q-item-main>
        </q-item>
      </q-list>
    </q-layout-drawer>

    <!-- Page Container -->
    <q-page-container>
      <customBody />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import customHeader from "../components/customHeader.vue";
import customBody from "../components/customBody.vue";

// Quasar instance
const $q = useQuasar();

// Drawer open state
const leftDrawerOpen = ref($q.platform.is.desktop);

// Menu items for Sales Manager
const menus = [
  { id: 1, to: "/sales/manager/lead/allocation/tracker", name: "Lead Allocation Tracker" },
  { id: 2, to: "/sales/manager/leads/status", name: "Leads Status" },
  { id: 3, to: "/sales/manager/revenue/trackers", name: "Revenue Trackers" },
  { id: 4, to: "/sales/manager/revenue/approval", name: "Exception Approval" },
  { id: 5, to: "/sales/manager/leads/pending/assignment", name: "Leads Pending Assignment" },
  { id: 6, to: "/sales/manager/aging/tracker/pending/leads", name: "Aging Tracker for Pending Leads" },
];

// Toggle drawer function
function fnMainToggleSideMenu() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style scoped>
/* Optional: add layout-specific styles here */
</style>