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
            <div class="q-title text-weight-regular q-py-sm">POD Number</div>
          </div>

          <!-- POD Number Input -->
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
              @click="fnSubmitAllocateReseller"
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
  propshowRegionBasedResellar: Boolean,
  propAllScannedItemArr: Object
});

// Emits
const emit = defineEmits(["closeModel"]);

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();

// Modal reactive
const toggleModal = ref(props.propshowRegionBasedResellar);

// Form reactive
const formData = reactive({
  region: props.propAllScannedItemArr?.region || "",
  resellar: props.propAllScannedItemArr?.resellar || "",
  podNumber: "",
  scannedDevices: props.propAllScannedItemArr?.scannedItems || []
});

// Watch prop to sync modal state
watch(() => props.propshowRegionBasedResellar, val => {
  toggleModal.value = val;
});

// Close modal emit
const emitToggleCheque = () => {
  emit("closeModel");
};

// Submit function
const fnSubmitAllocateReseller = async () => {
  if (!formData.region) {
    $q.notify({ color: "amber-9", position: "bottom", message: "Region cannot be empty!", icon: "warning" });
    return;
  }

  if (!formData.podNumber) {
    $q.notify({ color: "amber-9", position: "bottom", message: "POD number cannot be empty!", icon: "warning" });
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
    await store.dispatch("InventoryCentral/FEED_ALLOCATE_TO_REGION_BASED_RESELLAR", formData);

    store.commit("commonLoader/TOGGLE_COMMON_LOADER", false);
    $q.loading.hide();
    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Devices have been successfully allocated to region",
      icon: "thumb_up"
    });

    emit("closeModel");
    // Optional: navigate if needed
    // $router.push("/inventory/central");

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