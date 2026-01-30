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
      :content-style="{ background: '#004d40', width: '250px' }"
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
  { id: 1, to: '/home', name: 'Inventory Table' },
  { id: 2, to: '/central', name: 'Central Inventory' },
  { id: 6, to: '/faulty', name: 'Faulty Inventory' },
  { id: 7, to: '/master/inventory', name: 'Master Inventory' },
  { id: 8, to: '/master/reports', name: 'Reports' },
  { id: 9, to: '/master/global-search', name: 'Global Search' },
])

// Toggle drawer
function fnMainToggleSideMenu() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped>
/* Add custom styles if needed */
</style>
