<template>
  <q-page>
    <q-dialog
      :model-value="toggleModal"
      persistent
      @update:model-value="handleDialogUpdate"
      :maximized="false"
      :max-width="'50vw'"
    >
      <q-card style="padding: 25px; min-width: 30vw">
        <div class="row q-pa-md">
          <div
            class="col-12 q-title text-center text-weight-regular bottom-border text-custom-color"
          >
            <b>CONTACT DETAILS</b>
          </div>

          <q-card class="q-pa-md" style="width: 100%">
            <q-card-section>
              <div class="row q-gutter-md q-justify-between">
                <div class="col">
                  <div class="q-mb-md row justify-start items-center">
                    <q-item-label><b>Address:</b></q-item-label>
                    <div class="q-ml-sm">{{ props.propRowDetails.address }}</div>
                  </div>
                  <div class="q-mb-md row justify-start items-center">
                    <q-item-label><b>City:</b></q-item-label>
                    <div class="q-ml-sm">{{ props.propRowDetails.city }}</div>
                  </div>
                  <div class="q-mb-md row justify-start items-center">
                    <q-item-label><b>Pincode:</b></q-item-label>
                    <div class="q-ml-sm">{{ props.propRowDetails.pincode }}</div>
                  </div>
                  <div class="q-mb-md row justify-start items-center">
                    <q-item-label><b>Mobile Number:</b></q-item-label>
                    <div class="q-ml-sm">{{ props.propRowDetails.contactNumber }}</div>
                  </div>
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="center">
              <q-btn
                push
                highlight
                label="Close"
                color="negative"
                style="width: 90px"
                class="q-mx-sm"
                @click="closeModal"
              />
            </q-card-actions>
          </q-card>
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  propShowUpdateContactDetails: { type: Boolean, required: true },
  propRowDetails: { type: Object, required: true },
});

const emit = defineEmits(["emitfnshowUpdateOpenedExternal"]);

const toggleModal = ref(props.propShowUpdateContactDetails);

// Watch prop to reactively update local toggle
watch(
  () => props.propShowUpdateContactDetails,
  (val) => {
    toggleModal.value = val;
  }
);

// Handle dialog update
const handleDialogUpdate = (value) => {
  if (!value) {
    emit("emitfnshowUpdateOpenedExternal");
  }
};

// Emit close event
const closeModal = () => {
  emit("emitfnshowUpdateOpenedExternal");
};
</script>

<style scoped>
.text-custom-color {
  color: #530750; /* Replace with your desired color */
}
</style>