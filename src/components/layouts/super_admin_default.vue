<template>
  <q-layout view="lHh Lpr lFf">
    <!-- HEADER -->
    <q-header class="shadow-0 z-top">
      <q-toolbar class="bg-custom-light-grey bottom-border">

        <q-btn
          flat
          dense
          round
          aria-label="Menu"
          @click="triggerSideMenu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          <div class="row items-center">
            <div class="col-auto">
              <img
                v-if="leftDrawerOpen"
                src="~assets/images/logo.png"
                class="cursor-pointer"
                style="height:38px"
              />
            </div>

            <div class="col text-right">
              <q-btn flat color="grey-9" icon="notifications" />

              <q-btn flat color="grey-9">
                <span class="mobile-hide q-mr-sm">
                  {{ getUserName }}
                </span>
                <img
                  src="https://pdc.techinasia.com/wp-content/uploads/2018/03/user60.png"
                  style="height:30px;width:30px"
                />

                <!-- USER MENU -->
                <q-menu
                  anchor="bottom middle"
                  self="top middle"
                  class="shadow-8"
                  style="min-width:350px"
                >
                  <q-list separator>

                    <q-item clickable @click="showNotification">
                      <q-item-section avatar>
                        <q-icon name="person" />
                      </q-item-section>
                      <q-item-section>
                        My Account
                      </q-item-section>
                    </q-item>

                    <q-item clickable @click="logout">
                      <q-item-section avatar>
                        <q-icon name="logout" />
                      </q-item-section>
                      <q-item-section>
                        Logout
                      </q-item-section>
                    </q-item>

                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- DRAWER -->
    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      bordered
      :width="250"
      class="shadow-9 bg-drawer"
    >
      <q-list class="q-pt-xl" separator>
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

    <!-- PAGE -->
    <q-page-container>
      <transition
        appear
        :duration="{ enter: 300, leave: 300 }"
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        @before-enter="beforeEnter"
        @after-enter="afterEnter"
      >
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const $q = useQuasar()
const router = useRouter()
const store = useStore()

/* Drawer */
const leftDrawerOpen = ref($q.platform.is.desktop)

/* Menu */
const menus = ref([
  { id: 1, to: '/super/admin/dashboard/', name: 'Dashboard' },
  { id: 2, to: '/super/admin/users/', name: 'Users' },
  { id: 3, to: '/super/admin/hierarchy/', name: 'Hierarchy' },
  { id: 4, to: '/super/admin/roles/permissions/', name: 'Roles & Permissions' },
  { id: 5, to: '/super/admin/permissions/', name: 'Permissions' },
  { id: 6, to: '/super/admin/regions/', name: 'Regions' },
  { id: 7, to: '/super/admin/manage/rental/charges', name: 'Manage Rental Charges' },
  { id: 8, to: '/super/admin/manage/mdr/charges', name: 'Manage MDR Charges' }
])

/* User */
const getUserName = computed(() => {
  const user = localStorage.getItem('u_i')
  return user ? JSON.parse(user).user.name : ''
})

/* Actions */
function triggerSideMenu () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function beforeEnter () {
  store.dispatch('commonLoader/TOGGLE_COMMON_LOADER', true)
}

function afterEnter () {
  store.dispatch('commonLoader/TOGGLE_COMMON_LOADER', false)
}

function logout () {
  router.push('/login')
}

function showNotification () {
  // keep existing logic
}
</script>

<style scoped>
.bg-drawer {
  background: #531b64;
}

.menu-item-color {
  color: #e3e4e5;
  font-size: 14px;
}

.menu-main-item-color:hover,
.menu-main-item-color:focus,
.q-item.router-link-active {
  background: #531a65 !important;
  color: #e3e4e5;
}
</style>
