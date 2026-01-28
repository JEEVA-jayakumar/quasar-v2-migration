<template>
  <q-dialog
    v-model="toggleModal"
    @hide="emitToggleRemarks"
  >
    <q-card style="min-width: 35vw; padding: 20px" class="customModalOverlay">
      <div class="row">
        <!-- Title -->
        <div class="col-12 q-title q-py-md">
          Remarks
        </div>

        <!-- Content -->
        <div class="col-12 q-py-md">
          <q-alert
            v-if="!itemDetails"
            color="primary"
            icon="info"
            class="q-mb-sm"
          >
            No remarks given
          </q-alert>

          <span v-else>
            {{ itemDetails }}
          </span>
        </div>

        <!-- Footer -->
        <div class="col-12 q-title q-py-md text-right">
          <q-btn
            icon="clear"
            color="grey-5"
            class="text-dark"
            label="Close"
            @click="emitToggleRemarks"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from "vue";

/* Props & Emits */
const props = defineProps({
  propshowDocumentModal: Boolean,
  propReason: {
    type: String,
    default: null
  }
});

const emit = defineEmits(["toggleReasonModal"]);



/* State */
const toggleModal = ref(props.propshowDocumentModal);
const itemDetails = ref(props.propReason);

/* Sync props */
watch(() => props.propshowDocumentModal, val => {
  toggleModal.value = val;
});

watch(() => props.propReason, val => {
  itemDetails.value = val;
});

/* Emit close */
const emitToggleRemarks = () => {
  emit("toggleReasonModal");
};
</script>
