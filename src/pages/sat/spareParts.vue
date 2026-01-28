<template>
  <div class="q-pa-md group">
    <div class="row items-center">
      <!-- POD Number Input -->
      <div class="col">
        <q-input
          v-model="podNumber"
          label="Select POD Number"
          outlined
          color="grey-9"
          dense
          clearable
        />
      </div>

      <!-- Submit Button -->
      <div class="col-auto">
        <q-btn
          icon="check"
          label="Submit"
          outline
          class="q-py-xs"
          color="primary"
          @click="submitPodNumber"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "PodNumberSelector",
  setup() {
    // --- Reactive State ---
    const podNumber = ref("");

    // --- Methods ---
    const submitPodNumber = () => {
      if (!podNumber.value) {
        // Notify user if empty
        console.warn("Please select a POD Number");
        return;
      }
      // Replace this with your actual submit logic
      console.log("Submitted POD Number:", podNumber.value);
    };

    return {
      podNumber,
      submitPodNumber
    };
  }
};
</script>

<style scoped>
/* Optional styling */
</style>
