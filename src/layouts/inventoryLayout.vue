<template>
  <q-layout view="lHh Lpr lFf">

    <!-- HEADER -->
    <q-header elevated class="shadow-0 z-top" style="margin-left:0px">
      <customHeader @fnToggleSideMenu="fnMainToggleSideMenu" />
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
        style="padding-top:65px"
      >
        <q-item
          v-for="menu in menus"
          :key="menu.id"
          :to="menu.to"
          class="menu-main-item-color"
        >
          <q-item-section class="menu-item-color">
            {{ menu.name }}
          </q-item-section>
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

// Drawer state: open by default on desktop
const leftDrawerOpen = ref($q.platform.is.desktop)

// Menu items
const menus = ref([
  { id: 1, to: '/inventory/home', name: 'Inventory Table' },
  { id: 2, to: '/inventory/central', name: 'Central Inventory' },
  // { id: 3, to: '/inventory/regional', name: 'Regional Inventory' },
  // { id: 4, to: '/inventory/transit', name: 'Inventory in Transit' },
  // { id: 5, to: '/inventory/merchant', name: 'Inventory with Merchant' },
  { id: 6, to: '/inventory/faulty', name: 'Faulty Inventory' },
  { id: 7, to: '/inventory/master/inventory', name: 'Master Inventory' }, // corrected duplicate id
])

// Toggle drawer
function fnMainToggleSideMenu() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped>
/* Add custom styles if needed */
</style>
