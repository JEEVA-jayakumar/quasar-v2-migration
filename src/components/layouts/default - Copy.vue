<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header class="shadow-0 z-top">
      <customHeader @fnToggleSideMenu="fnMainToggleSideMenu" />
    </q-header>

    <!-- Drawer -->
    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      class="no-shadow"
      :style="{ background: '#202c3f', width: '250px' }"
    >
      <q-list inset-delimiter style="padding-top: 65px">
        <q-item
          v-for="menu in menus"
          :key="menu.id"
          clickable
          :to="menu.to"
          class="menu-main-item-color"
        >
          <q-item-section class="menu-item-color">
            {{ menu.name }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Page Content -->
    <q-page-container>
      <customBody />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

import customHeader from '../components/customHeader.vue'
import customBody from '../components/customBody.vue'

/* -----------------------------
 * Quasar instance
 * ---------------------------*/
const $q = useQuasar()

/* -----------------------------
 * Drawer State
 * ---------------------------*/
const leftDrawerOpen = ref($q.platform.is.desktop)

/* -----------------------------
 * Menu Configuration
 * ---------------------------*/
const menus = ref([
  {
    id: 1,
    to: '/sat/lead/validation',
    name: 'Lead Validation'
  },
  {
    id: 2,
    to: '/sat/exception/queue',
    name: 'Exception Queue'
  },
  {
    id: 5,
    to: '/sat/merchant/transaction/level',
    name: 'Merchant Tracker - Transaction Level'
  },
  {
    id: 7,
    to: '/sat/inventory/allocation',
    name: 'Inventory Allocation'
  },
  {
    id: 8,
    to: '/sat/implementation/queue',
    name: 'Implementation Queue'
  },
  {
    id: 9,
    to: '/sat/master/tracker',
    name: 'Master Tracker'
  },
  {
    id: 10,
    to: '/sat/device/recovery/tracker',
    name: 'Device Recovery Tracker'
  }
])

/* -----------------------------
 * Methods
 * ---------------------------*/
function fnMainToggleSideMenu () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style>
/* No changes required */
</style>
