<template>
  <q-toolbar class="bg-custom-light-grey bottom-border" flat>
    <!-- Side Menu Button -->
    <q-btn
      v-if="userRole !== 'KSN'"
      flat
      dense
      round
      aria-label="Menu"
      @click="triggerSideMenu"
    >
      <q-icon name="menu" />
    </q-btn>

    <!-- Title / Logo -->
    <q-toolbar-title>
      <div class="row items-center">
        <div class="col-auto">
          <img
            v-if="leftDrawerOpen"
            src="~assets/images/logo.png"
            class="cursor-pointer"
            style="height: 38px"
          />
        </div>

        <div class="col text-right">
          <!-- Notification -->
          <q-btn flat icon="notifications" color="grey-9" />

          <!-- User Menu -->
          <q-btn flat>
            <span class="mobile-hide text-weight-regular q-mr-sm">
              {{ userName }}
            </span>

            <img
              src="~assets/images/user.png"
              class="vertical-middle"
              style="height: 30px; width: 30px; padding: 5px"
            />

            <!-- Dropdown -->
            <q-menu anchor="bottom middle" self="top middle" class="shadow-8">
              <q-list separator style="min-width: 250px">
                <q-item clickable v-close-popup @click="openMyAccount">
                  <q-item-section avatar>
                    <q-icon name="person" />
                  </q-item-section>
                  <q-item-section>
                    Change Password
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="logout">
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

    <!-- My Account Modal -->
    <toggleMyAccount
      v-if="showMyAccount"
      :propsToggleModal="showMyAccount"
      @propsToggleModal="openMyAccount"
    />
  </q-toolbar>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import toggleMyAccount from './toggleMyAccount.vue'

/* ----------------------------------
 * Emits
 * ---------------------------------- */
const emit = defineEmits(['fnToggleSideMenu'])

/* ----------------------------------
 * Quasar / Router
 * ---------------------------------- */
const $q = useQuasar()
const router = useRouter()

/* ----------------------------------
 * State
 * ---------------------------------- */
const showMyAccount = ref(false)
const leftDrawerOpen = ref(false)

/* ----------------------------------
 * User Data (safe access)
 * ---------------------------------- */
const userInfo = computed(() => {
  try {
    return JSON.parse(localStorage.getItem('u_i')) || {}
  } catch {
    return {}
  }
})

const userName = computed(() => userInfo.value?.user?.name || '')
const userRole = computed(() => userInfo.value?.roles?.[0]?.role || '')

/* ----------------------------------
 * Lifecycle
 * ---------------------------------- */
onMounted(() => {
  leftDrawerOpen.value = $q.platform.is.desktop

  if (userRole.value === 'KSN') {
    emit('fnToggleSideMenu')
  }
})

/* ----------------------------------
 * Methods
 * ---------------------------------- */
function triggerSideMenu () {
  emit('fnToggleSideMenu')
}

function openMyAccount () {
  showMyAccount.value = !showMyAccount.value
}

function logout () {
  localStorage.removeItem('u_i')
  localStorage.removeItem('auth_token')

  $q.notify({
    color: 'positive',
    position: 'bottom',
    message: 'Successfully Logged Out',
    icon: 'thumb_up'
  })

  router.push({ name: 'login' })
}
</script>
