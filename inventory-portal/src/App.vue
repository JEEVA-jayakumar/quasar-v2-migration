<template>
  <div id="q-app" class="q-body-1">
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <router-view />
    </transition>
  </div>
</template>

<script setup>
// Vue 3 Composition API
// No need for export default in Vue 3 with <script setup>
</script>

<style>
</style>
