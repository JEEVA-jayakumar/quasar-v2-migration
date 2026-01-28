<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header class="shadow-0 z-top">
      <customHeader @fnToggleSideMenu="fnMainToggleSideMenu" />
    </q-header>

    <!-- Left Drawer -->
    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      bordered
      :width="250"
      class="shadow-9 bg-drawer"
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

const $q = useQuasar()

/**
 * Drawer state
 * Opens by default on desktop (same as before)
 */
const leftDrawerOpen = ref($q.platform.is.desktop)

/**
 * Menu configuration (unchanged behavior)
 */
const menus = ref([
  {
    id: 2,
    to: '/ops/head/exceptions',
    name: 'Exceptions'
  }
])

/**
 * Toggle drawer (same logic)
 */
function fnMainToggleSideMenu () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped>
.bg-drawer {
  background: #202c3f;
}
</style>
