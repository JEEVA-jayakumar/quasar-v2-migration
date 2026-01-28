<template>
  <div>
    <q-dialog
      v-model="toggleModal"
      persistent
      :content-css="{
        padding: '30px',
        minWidth: '50vw',
        maxHeight: '90vh',
        overflowY: 'auto'
      }"
    >
      <!-- Header -->
      <div class="row items-center bottom-border q-py-sm">
        <div class="col">
          <strong>REFERBACK REMARKS</strong>
        </div>
        <div class="col-auto">
          <q-btn
            round
            size="sm"
            @click="emitfnReferBackRemarks"
            color="red"
            icon="clear"
          />
        </div>
      </div>

      <br />

      <!-- SAT TO MARS / MARS Remarks -->
      <div v-if="propRowDetails.qrLeadStatus === 9" class="row d-flex align-items-center q-mb-md">
        <div class="col-sm-4"><strong>SAT TO MARS Remark</strong></div>
        <div class="col-sm-8">
          <q-input
            v-model="satToSoRemarks"
            type="textarea"
            readonly
            color="red-12"
            label="Textarea with shadow text"
            hint="Press TAB to autocomplete suggested value or ESC to cancel suggestion"
            @keydown="processTextareaFill"
            @focus="processTextareaFill"
          />
        </div>
      </div>

      <div v-if="propRowDetails.qrLeadStatus === 9" class="row d-flex align-items-center q-mb-md">
        <div class="col-sm-4"><strong>MARS Remark</strong></div>
        <div class="col-sm-8">
          <q-input
            v-model="marsRemarks"
            type="textarea"
            readonly
            color="red-12"
            label="Textarea with shadow text"
            hint="Press TAB to autocomplete suggested value or ESC to cancel suggestion"
            @keydown="processTextareaFill"
            @focus="processTextareaFill"
          />
        </div>
      </div>

      <!-- SAT TO SO Remark -->
      <div
        v-if="propRowDetails.qrLeadStatus === 4 && propRowDetails.referbackStatus"
        class="row d-flex align-items-center q-mb-md"
      >
        <div class="col-sm-4"><strong>SAT TO SO Remark</strong></div>
        <div class="col-sm-8">
          <q-input
            v-model="satToSoRemarks"
            type="textarea"
            readonly
            color="red-12"
            label="Textarea with shadow text"
            hint="Press TAB to autocomplete suggested value or ESC to cancel suggestion"
            @keydown="processTextareaFill"
            @focus="processTextareaFill"
          />
        </div>
      </div>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, watch } from "vue";

// Props
const props = defineProps({
  propShowUpdateOpenedExternal: Boolean,
  propRowDetails: Object
});

// Emits
const emit = defineEmits(["emitfnshowUpdateOpenedExternal"]);

// Reactive state
const toggleModal = ref(props.propShowUpdateOpenedExternal);
const satToSoRemarks = ref("");
const marsRemarks = ref("");

// Lifecycle
onBeforeMount(() => {
  satToSoRemarks.value = props.propRowDetails.satToMarsRemarks || "";
  marsRemarks.value = props.propRowDetails.marsReason || "NA";
});

// Watch props toggle to keep in sync
watch(
  () => props.propShowUpdateOpenedExternal,
  (newVal) => {
    toggleModal.value = newVal;
  }
);

// Methods
function emitfnReferBackRemarks() {
  emit("emitfnshowUpdateOpenedExternal");
}

// Placeholder method for processTextareaFill (implement as needed)
function processTextareaFill() {
  // Example: autocomplete or custom behavior
  // Remove event parameter since it's not used
}
</script>

<style scoped>
.q-dialog__inner {
  overflow-y: auto;
}
.custom-textarea {
  resize: none;
}
</style>