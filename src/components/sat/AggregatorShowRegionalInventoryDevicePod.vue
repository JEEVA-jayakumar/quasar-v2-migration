<template>
  <div>
    <!-- CHANGE: q-modal to q-dialog -->
    <q-dialog
      v-model="toggleModal"
      persistent
    >
      <q-card style="padding: 30px; min-width: 40vw">
        <div class="q-pa-md column">
          <!-- POD Number Header -->
          <div class="col-md-12 bottom-border">
            <div class="q-title text-weight-regular q-py-sm">POD Number</div>
          </div>

          <!-- Scanned Devices List -->
          <div class="col-md-8 q-pt-md">
            <q-list dense separator>
              <q-item
                v-for="(item) in formData.scannedDevices"
                :key="item.device.id"
              >
                <q-item-section>{{ item.device.deviceName }}</q-item-section>
                <q-item-section side>{{ item.deviceSerialNumbers.length }} nos</q-item-section>
              </q-item>
            </q-list>
          </div>

          <!-- POD Number Input -->
          <div class="col-md-8 q-pt-md">
            <q-input
              v-model="formData.podNumber"
              label="Enter POD Number"
              placeholder="POD Number"
              color="grey-9"
            />
          </div>

          <!-- Action Buttons -->
          <div class="col-md-12 col-md-6 q-pt-md row justify-end">
            <q-btn
              icon="block"
              outline
              label="Cancel"
              class="q-mr-sm"
              @click="emitToggleCheque"
            />
            <q-btn
              icon="check"
              label="Submit"
              class="common-btn"
              @click="submitDamagedDevices"
            />
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

// Props
const props = defineProps({
  propShowPDOmodal: { type: Boolean, required: true },
  propAllScannedItemArr: { type: Object, required: true }
});

// Emits
const emit = defineEmits(["closeModel", "emittedAfterPODsubmission"]);

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();

// Reactive state
const toggleModal = ref(props.propShowPDOmodal);
const formData = reactive({
  region: props.propAllScannedItemArr.region,
  podNumber: "",
  scannedDevices: props.propAllScannedItemArr.scannedItems || []
});

// Watch for prop changes to sync modal
watch(() => props.propShowPDOmodal, (newVal) => {
  toggleModal.value = newVal;
});

// Methods
const emitToggleCheque = () => {
  emit("closeModel");
};

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
  if (!formData.scannedDevices.length) {
    $q.notify({
      color: "amber-9",
      position: "bottom",
      message: "Scanned devices cannot be empty!",
      icon: "warning"
    });
    return;
  }

  const param = {
    region: formData.region,
    podNumber: formData.podNumber,
    scannedDevices: formData.scannedDevices.map((d) => ({
      aggregatorDevice: {
        deviceName: d.device.deviceName,
        id: d.device.id
      },
      deviceSerialNumbers: d.deviceSerialNumbers
    }))
  };

  try {
    await store.dispatch("SAT_RegionalInventoryAllocation/PHONEPE_FEED_REGIONAL_INVENTORY_DAMAGED_DEVICE_SERIAL_NUMBER", param);
    store.dispatch("commonLoader/TOGGLE_COMMON_LOADER", false);

    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Devices successfully added to damaged inventory",
      icon: "thumb_up"
    });

    emit("emittedAfterPODsubmission", "closeModal");
    emit("closeModel");
  } catch (error) {

    store.dispatch("commonLoader/TOGGLE_COMMON_LOADER", false);
    $q.notify({
      color: "negative",
      position: "bottom",
      message: error?.body?.message || "Please Try Again Later!",
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