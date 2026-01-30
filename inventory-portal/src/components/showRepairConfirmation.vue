<template>
  <div>
    <!-- CHANGE: q-modal to q-dialog -->
    <q-dialog
      v-model="toggleModal"
      persistent
    >
      <q-card style="padding: 10px; max-width: 50vw; min-width: 400px">
        <div class="q-pa-md column">
          <!-- Header -->
          <div class="col-md-12 bottom-border">
            <div class="q-title text-weight-regular q-py-sm">Send to repair</div>
          </div>

          <!-- Device List -->
          <div class="col-md-8 q-pt-md" align="left">
            <q-list dense separator>
              <q-item v-for="(item, index) in formData.scannedItems" :key="index">
                <q-item-section>{{ item.device.deviceName }}</q-item-section>
                <q-item-section side>{{ item.deviceSerialNumbers.length }} nos</q-item-section>
              </q-item>
            </q-list>
          </div>

          <!-- Buttons -->
          <div class="col-md-12 col-md-6 q-pt-md text-right">
            <q-btn outline icon="block" label="Cancel" @click="emitToggleCheque" />
            <q-btn
              class="common-btn q-ml-sm"
              icon="check"
              label="Submit"
              :disable="!formData.scannedItems[0]?.deviceSerialNumbers?.length"
              @click="fnFinalFaultySubmit(1)"
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
  showRepairModal: Boolean,
  propAllScannedItemArr: Object
});

// Emits
const emit = defineEmits(["closeModel"]);

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();

// Modal reactive
const toggleModal = ref(props.showRepairModal);

// Form reactive
const formData = reactive({
  region: props.propAllScannedItemArr?.region || "",
  podNumber: "",
  scannedItems: props.propAllScannedItemArr?.scannedItems || []
});

// Watch prop to sync modal
watch(() => props.showRepairModal, val => {
  toggleModal.value = val;
});

// Close modal
const emitToggleCheque = () => {
  emit("closeModel");
};

// Submit function
const fnFinalFaultySubmit = async (action) => {
  $q.loading.show({
    delay: 100,
    message: "Please Wait",
    spinnerColor: "purple-9",
    customClass: "shadow-none"
  });

  const payload = {
    data: formData.scannedItems,
    action
  };

  try {
    await store.dispatch("InventoryCentral/FEED_FAULTY_FINAL_SUBMIT", payload);

    // Reset data
    formData.scannedItems = [];
    formData.podNumber = "";

    emitToggleCheque();

    $q.loading.hide();
    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Devices have been updated successfully",
      icon: "thumb_up"
    });
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      color: "negative",
      position: "bottom",
      message: error?.message || "Please try again",
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