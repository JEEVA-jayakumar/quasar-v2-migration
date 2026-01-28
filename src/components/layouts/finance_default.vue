<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header class="shadow-0 z-top">
      <customHeader @fnToggleSideMenu="fnMainToggleSideMenu" />
    </q-header>

    <!-- Drawer -->
    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      bordered
      :width="250"
      class="shadow-9"
      content-class="bg-dark"
    >
      <q-list
        separator
        padding
        class="q-pt-xl"
      >
        <q-item
          v-for="menu in menus"
          :key="menu.id"
          :to="menu.to"
          router
          clickable
          class="menu-main-item-color"
        >
          <q-item-section class="menu-item-color">
            {{ menu.name }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Page Container -->
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

const $q = useQuasar()

/**
 * Drawer state
 * Same logic as before:
 * - Open by default on desktop
 */
const leftDrawerOpen = ref($q.platform.is.desktop)

/**
 * Menu items (unchanged)
 */
const menus = ref([
  {
    id: 1,
    to: '/finance/payment/verification/tracker',
    name: 'Payment Verification Tracker'
  },
  {
    id: 2,
    to: '/finance/finance/approved/tracker',
    name: 'Finance Approved Tracker'
  }
])

/**
 * Toggle drawer (unchanged behavior)
 */
function fnMainToggleSideMenu () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped>
.bg-dark {
  background: #202c3f;
}
</style>
