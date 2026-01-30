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
            <div class="q-title text-weight-regular q-py-sm">
              Aggregator Send to Repair
            </div>
          </div>

          <!-- List of scanned devices -->
          <div class="col-md-8 q-pt-md" align="left">
            <q-list dense separator>
              <q-item
                v-for="(item, index) in formData.scannedItems"
                :key="index"
              >
                <q-item-section>{{ item.device.deviceName }}</q-item-section>
                <q-item-section side>{{ item.deviceSerialNumbers.length }} nos</q-item-section>
              </q-item>
            </q-list>
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
import { useQuasar } from "quasar";
import { useStore } from "vuex";

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

// Reactive modal state
const toggleModal = ref(props.showRepairModal);

// Reactive form data
const formData = reactive({
  region: props.propAllScannedItemArr?.region || "",
  podNumber: "",
  scannedItems: props.propAllScannedItemArr?.scannedItems || []
});

// Watch prop to update modal
watch(() => props.showRepairModal, val => {
  toggleModal.value = val;
});

// Emit close modal
const emitToggleCheque = () => {
  emit("closeModel");
};

// Submit function
const fnFinalFaultySubmit = async (action) => {
  if (!formData.scannedItems[0]?.deviceSerialNumbers?.length) {
    $q.notify({
      color: "amber-9",
      position: "bottom",
      message: "No devices selected for repair!",
      icon: "warning"
    });
    return;
  }

  $q.loading.show({
    delay: 100,
    spinnerColor: "purple-9",
    message: "Please wait...",
    customClass: "shadow-none"
  });

  const payload = {
    data: [{
      aggregatorDevice: formData.scannedItems[0].device,
      deviceSerialNumbers: formData.scannedItems[0].deviceSerialNumbers
    }],
    action
  };

  try {
    await store.dispatch("InventoryCentral/FEED_AGGREGATORS_FAULTY_FINAL_SUBMIT", payload);

    // Reset state after success
    formData.scannedItems = [];
    toggleModal.value = false;

    $q.loading.hide();
    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Devices have been updated successfully",
      icon: "thumb_up"
    });

    // Navigate to inventory page
    // Replace with router push if router is set up
    // Using window.location is not ideal for SPA, consider using Vue Router
    window.location.href = "/inventory/PhonepeInventory";

  } catch {

    $q.loading.hide();
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "Please try again",
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