<template>
  <div>
    <q-dialog
      :model-value="props.showChequeImage"
      persistent
      :maximized="false"
      :max-width="'75vw'"
      :content-class="'q-pa-xs'"
      @update:model-value="emit('closeChequeImage')"
      @hide="emit('closeChequeImage')"
      @escape-key="emit('closeChequeImage')"
    >
      <q-card flat bordered class="bg-transparent">
        <q-card-section class="q-pa-none">
          <img :src="props.chequeImageValue" class="full-width" alt="Cheque Image" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  showChequeImage: {
    type: Boolean,
    default: false,
  },
  chequeImageValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["closeChequeImage"]);
</script>

<style scoped>
.full-width {
  width: 100%;
  height: auto;
  display: block;
}
</style>