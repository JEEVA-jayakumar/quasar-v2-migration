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

// Drawer state
const leftDrawerOpen = ref($q.platform.is.desktop);

// Menu items
const menus = [
  // { id: 1, to: "/ops/head/dashboard", name: "Dashboard" },
  { id: 2, to: "/ops/head/exceptions", name: "Exceptions" },
];

// Toggle drawer function
function fnMainToggleSideMenu() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style scoped>
/* Add any layout-specific styles here if needed */
</style>