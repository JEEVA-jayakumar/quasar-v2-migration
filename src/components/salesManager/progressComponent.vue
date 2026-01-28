<template>
  <div class="q-pa-md text-center">
    <p>A Vue 3 component to draw animated circular progress bars!</p>

    <CircleProgress
      :progress="progressValue"
      :size="100"
      :reverse="false"
      line-cap="round"
      :fill="fill"
      empty-fill="rgba(0, 0, 0, 0.1)"
      :animation-start-value="0.0"
      :start-angle="0"
      insert-mode="append"
      :thickness="5"
      :show-percent="true"
      @circle-progress="onProgress"
      @circle-end="onProgressEnd"
    >
      <template #default>
        <p>Slot Content!</p>
      </template>
    </CircleProgress>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CircleProgress from 'vue3-circle-progress'

/* ---------------- PROPS / STATE ---------------- */
const progressValue = ref(50)
const fill = { gradient: ['red', 'green', 'blue'] }

/* ---------------- METHODS ---------------- */
const onProgress = (event, progress, stepValue) => {
  // Called during animation progress
  console.log('Progress:', progress, 'Step value:', stepValue)
}

</script>

<style scoped>
p {
  margin-bottom: 15px;
}
</style>
