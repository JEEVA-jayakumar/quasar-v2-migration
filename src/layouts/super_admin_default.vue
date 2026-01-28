<template>
  <q-layout view="lHh Lpr lFf">

    <!-- Header -->
    <q-layout-header flat class="shadow-0 z-top" style="margin-left:0px">
      <q-toolbar class="bg-custom-light-grey bottom-border" color="grey-9" flat inverted>
        <!-- Side menu button -->
        <q-btn flat dense round @click="triggerSideMenu" aria-label="Menu">
          <q-icon name="menu" />
        </q-btn>

        <!-- Toolbar Title -->
        <q-toolbar-title>
          <div class="row items-center vertical-middle">
            <div class="col-auto">
              <img v-if="leftDrawerOpen" src="~assets/images/logo.png" style="height:38px;" class="cursor-pointer"/>
            </div>
            <div class="col" align="right">
              <q-btn flat color="grey-9" icon="far fa-bell" />
              <q-btn flat color="grey-9" class="vertical-middle">
                <span class="mobile-hide capitalize text-weight-regular">{{ userName }}</span>
                <img src="https://pdc.techinasia.com/wp-content/uploads/2018/03/user60.png"
                     style="height:30px;width:30px" class="vertical-middle"/>

                <q-popover class="shadow-8" anchor="bottom middle" self="top middle" style="min-width:350px">
                  <q-list separator link class="no-padding">
                    <q-item clickable v-close-popup @click="goToAccount">
                      <q-item-side icon="fas fa-user" inverted color="dark" />
                      <q-item-main>
                        <q-item-section>My Account</q-item-section>
                      </q-item-main>
                    </q-item>
                    <q-item clickable v-close-popup @click="logout">
                      <q-item-side icon="fas fa-sign-out-alt" inverted color="dark" />
                      <q-item-main>
                        <q-item-section>Logout</q-item-section>
                      </q-item-main>
                    </q-item>
                  </q-list>
                </q-popover>
              </q-btn>
            </div>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <!-- Drawer -->
    <q-layout-drawer
      v-model="leftDrawerOpen"
      class="shadow-9"
      content-class="no-shadow"
      :content-style="{background: '#531b64', width:'250px'}"
    >
      <q-list no-border link inset-delimiter highlight style="padding-top:65px">
        <q-item
          v-for="menu in menus"
          :key="menu.id"
          :to="menu.to"
          class="menu-main-item-color"
        >
          <q-item-section class="menu-item-color">{{ menu.name }}</q-item-section>
        </q-item>
      </q-list>
    </q-layout-drawer>

    <!-- Page Container with Transition -->
    <q-page-container>
      <transition
        appear
        :duration="{ enter: 300, leave: 300 }"
        @before-enter="beforeEnter"
        @enter="enter"
        @after-enter="afterEnter"
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <router-view />
      </transition>
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

// Quasar instance
const $q = useQuasar();

// Vuex store
const router = useRouter();

// Reactive drawer
const leftDrawerOpen = ref($q.platform.is.desktop);

// Menu items
const menus = [
  { id: 1, to: "/super/admin/dashboard/", name: "Dashboard" },
  { id: 2, to: "/super/admin/users/", name: "Users" },
  { id: 3, to: "/super/admin/hierarchy/", name: "Hierarchy" },
  { id: 4, to: "/super/admin/roles/permissions/", name: "Roles & Permissions" },
  { id: 5, to: "/super/admin/permissions/", name: "Permissions" },
  { id: 6, to: "/super/admin/regions/", name: "Regions" },
  { id: 7, to: "/super/admin/manage/rental/charges", name: "Manage Rental Charges" },
  { id: 8, to: "/super/admin/manage/mdr/charges", name: "Manage MDR Charges" },
];

// Computed: username
const userName = computed(() => {
  const userInfo = JSON.parse(localStorage.getItem("u_i"));
  return userInfo?.user?.name || "";
});

// Methods
function triggerSideMenu() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}


function enter(el, done) {
  done();
}


function goToAccount() {
  // Navigate to account page
  router.push("/super/admin/account");
}

function logout() {
  router.push("/login");
}
</script>

<style scoped>
.menu-item-color {
  color: #e3e4e5;
  font-size: 14px;
}
.menu-main-item-color:hover,
.menu-main-item-color:active,
.menu-main-item-color:focus {
  color: #e3e4e5;
  font-size: 14px;
  background: #531a65 !important;
}
.q-item.active,
.q-item.router-link-active,
.q-item:focus {
  background: #3b084b !important;
  color: #e3e4e5;
}
</style>