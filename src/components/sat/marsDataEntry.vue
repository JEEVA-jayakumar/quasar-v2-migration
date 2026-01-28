<template>
  <div>My component</div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "MyComponent",
  setup() {
    // Reactive state example (currently empty)
    const state = ref({});

    // Methods can be added here in future
    const exampleMethod = () => {
      console.log("Example method");
    };

    return {
      state,
      exampleMethod
    };
  }
};
</script>

<style scoped>
/* Add your component-specific styles here */
</style>
