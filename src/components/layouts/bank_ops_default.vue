<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header class="shadow-0 z-top">
      <customHeader />
    </q-header>

    <!-- Drawer -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="shadow-9"
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
 * Reactive State
 * ---------------------------*/
const leftDrawerOpen = ref($q.platform.is.desktop)

const menus = ref([
  {
    id: 1,
    to: '/bank/ops/assign/short/lead',
    name: 'Assign Short Lead'
  },
  {
    id: 2,
    to: '/bank/ops/bank/merchant/tracker',
    name: 'Merchant Tracker'
  }
])
</script>

<style>
/* No changes required */
</style>
