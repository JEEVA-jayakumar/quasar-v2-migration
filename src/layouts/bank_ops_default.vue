<template>
  <q-layout view="lHh Lpr lFf">

    <!-- HEADER -->
    <q-header elevated class="shadow-0 z-top" style="margin-left:0px">
      <customHeader />
    </q-header>

    <!-- DRAWER -->
    <q-drawer
      v-model="leftDrawerOpen"
      content-class="no-shadow"
      :content-style="{ background: '#202c3f', width: '250px' }"
      elevated
    >
      <q-list
        no-border
        link
        inset-delimiter
        highlight
        style="padding-top: 65px"
      >
        <q-item
          v-for="menu in menus"
          :key="menu.id"
          :to="menu.to"
          class="menu-main-item-color"
        >
          <q-item-section class="menu-item-color">{{ menu.name }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- PAGE CONTENT -->
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

// Quasar instance
const $q = useQuasar()

// Drawer open state (true on desktop)
const leftDrawerOpen = ref($q.platform.is.desktop)

// Menu items
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

<style scoped>
/* Optional: your custom styles */
</style>
