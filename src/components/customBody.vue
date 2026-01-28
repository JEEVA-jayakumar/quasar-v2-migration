<template>
  <transition
    appear
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    :duration="{ enter: 200, leave: 100 }"
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <router-view />
  </transition>
</template>

<script setup>
// import { computed } from 'vue'
import { useStore } from 'vuex'

/* ----------------------------------
 * Store
 * ---------------------------------- */
const store = useStore()

/* ----------------------------------
 * Computed (same as mapGetters)
 * ---------------------------------- */
// const getToggleCommonLoader = computed(
//   () => store.getters['commonLoader/getToggleCommonLoader']
// )

/* ----------------------------------
 * Actions (same as mapActions)
 * ---------------------------------- */
function toggleCommonLoader (value) {
  store.dispatch('commonLoader/TOGGLE_COMMON_LOADER', value)
}

/* ----------------------------------
 * Transition Hooks
 * ---------------------------------- */
function beforeEnter () {
  toggleCommonLoader(true)
}

function enter (_, done) {
  done()
}

function afterEnter () {
  toggleCommonLoader(false)
}
</script>
