<template>
  <q-page class="flex flex-center text-center">
    <div>
      <p>
        <img
  :src="require('../../assets/sad.svg')"
  style="width:30vw; max-width:150px;"
  alt="Server error"
/>
      </p>
      <p class="text-faded">Sorry, something went wrong...</p>
      <q-btn
        color="secondary"
        style="width:200px;"
        @click="goBack"
      >
        Go back
      </q-btn>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'

// Vue 3 Composition API for routing
const router = useRouter()

const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
.text-faded {
  color: #9e9e9e;
}
</style>
