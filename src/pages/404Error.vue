<template>
  <q-page class="flex flex-center text-center">
    <div>
      <p>
        <img
  src="/src/assets/sad.svg"
  style="width:30vw; max-width:150px;"
  alt="404 not found"
/>
      </p>
      <p class="text-faded">
        Sorry, nothing here... <strong>(404)</strong>
      </p>
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

// Vue 3 Composition API
const router = useRouter()

const goBack = () => {
  router.push({ name: 'login' })
}
</script>

<style scoped>
.text-faded {
  color: #9e9e9e;
}
</style>
