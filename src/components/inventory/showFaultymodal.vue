<template>
  <div>
    <!-- CHANGE: q-modal to q-dialog -->
    <q-dialog
      v-model="toggleModal"
      persistent
      :maximized="false"
    >
      <q-card style="min-width: 40vw; padding: 30px">
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
              @click="fnSubmitAllocateRegion"
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
  propshowPDOmodal: Boolean,
  propAllScannedItemArr: Object
});

// Emits
const emit = defineEmits(["closeModel"]);

// Quasar and Vuex
const $q = useQuasar();
const store = useStore();

// Modal toggle reactive
const toggleModal = ref(props.propshowPDOmodal);

// Reactive form data
const formData = reactive({
  region: props.propAllScannedItemArr?.region || "",
  podNumber: "",
  scannedDevices: props.propAllScannedItemArr?.scannedItems || []
});

// Watch prop to sync modal state
watch(() => props.propshowPDOmodal, val => {
  toggleModal.value = val;
});

// Emit close modal
const emitToggleCheque = () => {
  emit("closeModel");
};

// Submit function
const fnSubmitAllocateRegion = async () => {
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
    await store.dispatch("InventoryCentral/FEED_ALLOCATE_TO_REGION", formData);

    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Devices have been successfully allocated to region",
      icon: "thumb_up"
    });

    // Navigate to central inventory after success
    emit("closeModel");
    store.commit("commonLoader/TOGGLE_COMMON_LOADER", false);
    // optional navigation if required
    // $router.push("/inventory/central");

  } catch (error) {

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
</style>
