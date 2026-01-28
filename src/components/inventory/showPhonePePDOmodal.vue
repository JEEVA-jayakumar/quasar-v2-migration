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
            <div class="q-title text-weight-regular q-py-sm">Aggregator POD Number</div>
          </div>

          <!-- Inputs -->
          <div class="col-md-8 q-pt-md" align="left">
            <q-input
              color="grey-9"
              v-model="formData.podNumber"
              label="Enter POD Number"
              placeholder="POD Number"
              class="q-mb-md"
            />
            <q-input
              color="grey-9"
              v-model="formData.totalDevices"
              label="Total Allocated Devices"
              placeholder="Total Allocated Devices"
              class="q-mb-md"
            />
            <!-- Optional aggregator select (uncomment if needed)
            <q-select
              color="grey-9"
              v-model="formData.aggregator"
              :options="aggregatorOptions"
              label="Select Aggregator"
              emit-value
              map-options
            /> -->
          </div>

          <!-- Buttons -->
          <div class="col-md-12 col-md-6 q-pt-md text-right">
            <q-btn outline icon="block" label="Cancel" @click="emitToggleCheque" />
            <q-btn class="common-btn q-ml-sm" icon="check" label="Submit" @click="fnSubmitAllocateRegion" />
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
  propshowPDOmodal: Boolean,
  propAllScannedItemArr: Object
});

// Emits
const emit = defineEmits(["closeModel"]);

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();

// Modal reactive
const toggleModal = ref(props.propshowPDOmodal);

// Form reactive
const formData = reactive({
  region: props.propAllScannedItemArr?.region || "",
  so: props.propAllScannedItemArr?.so || "",
  // aggregator: "",
  podNumber: "",
  totalDevices: "",
  scannedDevices: props.propAllScannedItemArr?.scannedItems || []
});

// Watch prop to sync modal state
watch(() => props.propshowPDOmodal, val => {
  toggleModal.value = val;
});

// Close modal
const emitToggleCheque = () => {
  emit("closeModel");
};

// Submit function
const fnSubmitAllocateRegion = async () => {
  if (!formData.region) {
    $q.notify({ color: "amber-9", position: "bottom", message: "Region cannot be empty!", icon: "warning" });
    return;
  }

  if (!formData.podNumber) {
    $q.notify({ color: "amber-9", position: "bottom", message: "POD number cannot be empty!", icon: "warning" });
    return;
  }

  if (!formData.totalDevices) {
    $q.notify({ color: "amber-9", position: "bottom", message: "Total device cannot be empty!", icon: "warning" });
    return;
  }

  if (!formData.scannedDevices?.length) {
    $q.notify({ color: "amber-9", position: "bottom", message: "Scanned devices cannot be empty!", icon: "warning" });
    return;
  }

  // Show loader
  $q.loading.show({
    delay: 100,
    spinnerColor: "purple-9",
    message: "Please wait..."
  });

  try {
    await store.dispatch("InventoryCentral/FEED_PHONE_PE_ALLOCATE_TO_REGION", formData);

    store.commit("commonLoader/TOGGLE_COMMON_LOADER", false);
    $q.loading.hide();
    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Devices have been successfully allocated to region",
      icon: "thumb_up"
    });

    emitToggleCheque();
    // Navigate to PhonepeInventory page
    // Note: Using store.$router is not standard - use Vue Router directly
    // store.$router?.push({ name: "PhonepeInventory" });
  } catch (error) {

    $q.loading.hide();
    store.commit("commonLoader/TOGGLE_COMMON_LOADER", false);
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