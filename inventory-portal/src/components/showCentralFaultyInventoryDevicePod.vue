<template>
  <div>
    <!-- CHANGE: q-modal to q-dialog -->
    <q-dialog
      v-model="toggleModal"
      persistent
    >
      <q-card style="padding: 30px; min-width: 40vw; max-width: 600px">
        <div class="q-pa-md column">

          <!-- Header -->
          <div class="col-md-12 bottom-border">
            <div class="q-title text-weight-regular q-py-sm">POD Number</div>
          </div>

          <!-- POD Input -->
          <div class="col-md-8 q-pt-md" align="left">
            <q-input
              color="grey-9"
              v-model="formData.podNumber"
              label="Enter POD Number"
              placeholder="POD Number"
            />
          </div>

          <!-- Buttons -->
          <div class="col-md-12 col-md-6 q-pt-md text-right">
            <q-btn
              outline
              icon="block"
              label="Cancel"
              @click="emitToggleCheque"
            />
            <q-btn
              class="common-btn q-ml-sm"
              icon="check"
              label="Submit"
              @click="submitDamagedDevices"
            />
          </div>

        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

// Props
const props = defineProps({
  propShowPDOmodal: Boolean,
  propAllScannedItemArr: Object
});

// Emits
const emit = defineEmits(["closeModel", "emittedAfterPODsubmission"]);

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();

// Reactive state
const toggleModal = ref(props.propShowPDOmodal);
const formData = reactive({
  region: props.propAllScannedItemArr?.region || "",
  podNumber: "",
  scannedDevices: props.propAllScannedItemArr?.scannedItems || []
});

// Watch prop to update modal
watch(() => props.propShowPDOmodal, val => {
  toggleModal.value = val;
});

// Emit close modal
const emitToggleCheque = () => {
  emit("closeModel");
};

// Submit damaged devices
const submitDamagedDevices = async () => {
  if (!formData.region) {
    $q.notify({
      color: "amber-9",
      position: "bottom",
      message: "Region cannot be empty!",
      icon: "warning"
    });
    return;
  }

  if (!formData.podNumber) {
    $q.notify({
      color: "amber-9",
      position: "bottom",
      message: "POD number cannot be empty!",
      icon: "warning"
    });
    return;
  }

  if (!formData.scannedDevices?.length) {
    $q.notify({
      color: "amber-9",
      position: "bottom",
      message: "Scanned devices cannot be empty!",
      icon: "warning"
    });
    return;
  }

  try {
    await store.dispatch("InventoryCentral/FEED_CENTRAL_INVENTORY_DAMAGED_DEVICE_SERIAL_NUMBER", formData);

    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Devices successfully added to damaged inventory",
      icon: "thumb_up"
    });

    emit("emittedAfterPODsubmission", "closeModal");
    emit("closeModel");

  } catch (error) {

    $q.notify({
      color: "negative",
      position: "bottom",
      message: error?.body?.message ?? "Please Try Again Later!",
      icon: "thumb_down"
    });
  }
};
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #ddd;
}
.common-btn {
  background-color: #1976d2;
  color: white;
}
.q-title {
  font-size: 1.25rem;
  font-weight: 500;
}
</style>