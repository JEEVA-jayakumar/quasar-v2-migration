<template>
  <q-dialog v-model="opened">
    <q-card class="q-pa-md" style="min-width: 300px">
      <q-card-section>
        <div class="text-h6">Basic Modal</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          color="primary"
          label="Close"
          @click="opened = false"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue';

const opened = ref(true);
</script>

<style scoped>
</style>
