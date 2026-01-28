<template>
  <q-layout view="lHh Lpr lFf">
    <!-- HEADER -->
    <q-header class="shadow-0 z-top">
      <customHeader @fnToggleSideMenu="toggleDrawer" />
    </q-header>

    <!-- DRAWER -->
    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      class="no-shadow"
      :style="{ background: computedColor, width: '250px' }"
    >
      <q-scroll-area
        style="height: 100vh"
        :thumb-style="thumbStyle"
        :delay="1500"
      >
        <q-list inset-delimiter style="padding-top:65px">

          <!-- SAT -->
          <template v-if="canShow($ROLE_HIERARCHY_OPERATION_SAT)">
            <DrawerItems :items="menus.sat" />
          </template>

          <!-- FINANCE -->
          <template v-if="canShowAny([
            $ROLE_HIERARCHY_FINANCE_HEAD,
            $ROLE_HIERARCHY_FINANCE_MANAGER,
            $ROLE_HIERARCHY_FINANCE_EXECUTIVE
          ])">
            <DrawerItems :items="menus.finance" />
          </template>

          <!-- INVENTORY -->
          <template v-if="canShow($ROLE_HIERARCHY_INVENTORY_OFFICER)">
            <DrawerItems :items="menus.inventory" />
          </template>

          <!-- KSN -->
          <template v-if="canShow($ROLE_HIERARCHY_KSN)">
            <DrawerItems :items="menus.ksn" />
          </template>

          <!-- OPS HEAD -->
          <template v-if="canShow($ROLE_HIERARCHY_OPERATIONS_HEAD)">
            <template v-for="menu in menus.opsHead" :key="menu.id">
              <q-item v-if="menu.subItems.length === 0" clickable :to="menu.to">
                <q-item-section class="menu-item-color">{{ menu.name }}</q-item-section>
              </q-item>

              <q-expansion-item
                v-else
                dense
                label="Reports"
                header-class="menu-item-color"
              >
                <q-item
                  v-for="sub in menu.subItems"
                  :key="sub.id"
                  clickable
                  :to="sub.to"
                >
                  <q-item-section class="menu-item-color">{{ sub.name }}</q-item-section>
                </q-item>
              </q-expansion-item>
            </template>
          </template>

          <!-- SALES -->
          <template v-if="canShowAny([
            $ROLE_HIERARCHY_SALES_RSM,
            $ROLE_HIERARCHY_SALES_ASM,
            $ROLE_HIERARCHY_SALES_NATIONAL_HEAD
          ])">
            <DrawerItems :items="menus.salesManager" />
          </template>

          <!-- BANK OPS -->
          <template v-if="canShow($ROLE_HIERARCHY_BANK_OPS)">
            <DrawerItems :items="menus.bankOps" />
          </template>

          <!-- CRM -->
          <template v-if="canShow($HIERARCHY_CRM)">
            <DrawerItems :items="menus.crm" />
          </template>

          <!-- SUPER ADMIN -->
          <template v-if="canShow($ROLE_BIJLIPAY_MANAGER)">
            <DrawerItems :items="menus.superAdmin" admin />
          </template>

        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- BODY -->
    <q-page-container>
      <customBody />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'

import customHeader from '../components/customHeader.vue'
import customBody from '../components/customBody.vue'

/* ------------------ CORE ------------------ */
const $q = useQuasar()
const route = useRoute()

/* ------------------ STATE ------------------ */
const leftDrawerOpen = ref(
  $q.platform.is.desktop && route.name !== 'leadDataEntry'
)

const showMenu = ref([])

/* ------------------ STYLES ------------------ */
const thumbStyle = {
  right: '4px',
  borderRadius: '5px',
  background: '#cecece',
  width: '5px',
  opacity: 0.5
}

const computedColor = computed(() =>
  route.fullPath.includes('super/admin') ? '#773581' : '#202c3f'
)

/* ------------------ MENU AUTH ------------------ */
function loadRoles () {
  const user = $q.localStorage.getItem('u_i')
  if (!user) return
  showMenu.value = user.roles.map(r => r.hierarchyRoleLevel)
}

function canShow (role) {
  return showMenu.value.includes(role)
}

function canShowAny (roles) {
  return roles.some(r => showMenu.value.includes(r))
}

/* ------------------ ACTIONS ------------------ */
function toggleDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

/* ------------------ LIFECYCLE ------------------ */
onMounted(loadRoles)
</script>

<!-- REUSABLE MENU COMPONENT -->
<script>
export default {
  components: {
    DrawerItems: {
      props: {
        items: Array,
        admin: Boolean
      },
      template: `
        <q-item
          v-for="item in items"
          :key="item.id"
          clickable
          :to="item.to"
        >
          <q-item-section :class="admin ? 'menu-item-color-SA' : 'menu-item-color'">
            {{ item.name }}
          </q-item-section>
        </q-item>
      `
    }
  }
}
</script>

<style scoped>
/* unchanged */
</style>
