<template>
  <div>
    <!-- CHANGE: q-modal to q-dialog -->
    <q-dialog
      v-model="toggleModal"
      class="q-mt-lg capitalize"
      @hide="emitToggleRemarks"
      persistent
    >
      <q-card style="min-width: 30vw; padding: 20px">
        <!-- Header -->
        <div class="row items-center bottom-border q-py-sm">
          <div class="col">Scan Sound Box</div>
          <div class="col-auto">
            <q-btn
              round
              size="sm"
              outline
              color="dark"
              icon="clear"
              @click="emitToggleRemarks"
            />
          </div>
        </div>

        <!-- Form -->
        <form class="q-gutter-md q-pt-md">
          <q-input
            v-model="formData.soundBoxNumber"
            readonly
            label="Scan Soundbox Number"
          />

          <div class="row justify-end q-gutter-sm">
            <q-btn
              color="primary"
              label="Save"
              icon="check"
              :disable="!isScanStarted"
              @click.prevent="fnSubmit"
            />
            <q-btn
              v-if="scannerToggleOption"
              color="blue"
              outline
              label="Start Scan"
              class="q-py-xs"
              @click.prevent="startScan"
            />
          </div>
        </form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

// Props & emits
const props = defineProps({
  scanInfo: Object,
  propToggleScannerSoundPop: Boolean,
  propToggleSoundbox: Boolean
});
const emit = defineEmits(["closeScannerSoundInfo"]);

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();

// Reactive modal & form
const toggleModal = ref(props.propToggleScannerSoundPop);
const scannerToggleOption = ref(true);
const isScanStarted = ref(false);
const formData = ref({
  soundBoxNumber: ""
});

// Watch prop to sync modal
watch(() => props.propToggleScannerSoundPop, val => {
  toggleModal.value = val;
});

// Clean up barcode scanner on unmount
onBeforeUnmount(() => {
  if (window.BarcodeScanner?.destroy) {
    window.BarcodeScanner.destroy();
  }
});

// Submit scanned soundbox
const fnSubmit = async () => {
  if (!formData.value.soundBoxNumber) {
    $q.notify({ color: "negative", position: "bottom", message: "Please scan a SoundBox number first", icon: "warning" });
    return;
  }

  $q.loading.show({
    delay: 100,
    message: "Please Wait",
    spinnerColor: "purple-9",
    customClass: "shadow-none"
  });

  const payload = {
    data1: { id: props.scanInfo?.data?.id },
    formsList: { serialNumber: formData.value.soundBoxNumber }
  };

  try {
    await store.dispatch("phonePeCrm/UPDATE_SCAN_SOUNDBOX_NUMBER", payload);
    $q.notify({
      color: "positive",
      position: "bottom",
      message: "SoundBox Updated Successfully",
      icon: "thumb_up"
    });
    emitToggleRemarks();
  } catch (error) {

    $q.notify({
      color: "negative",
      position: "bottom",
      message: error?.body?.message || "Please Try Again Later !",
      icon: "thumb_down"
    });
  } finally {
    $q.loading.hide();
  }
};

// Start scanning
const startScan = () => {
  isScanStarted.value = true;
  formData.value.soundBoxNumber = "";
  scannerToggleOption.value = false;

  $q.notify({
    color: "positive",
    position: "bottom",
    message: "Start scanning",
    icon: "list"
  });

  if (window.BarcodeScanner && !window.BarcodeScanner.hasListener()) {
    window.BarcodeScanner.init(onBarcodeScanned);
  }
};

// Barcode scanned callback
const onBarcodeScanned = (barcode) => {
  formData.value.soundBoxNumber = barcode;
  scannerToggleOption.value = false;
  if (window.BarcodeScanner?.destroy) {
    window.BarcodeScanner.destroy();
  }
};

// Close modal
const emitToggleRemarks = () => {
  if (window.BarcodeScanner?.destroy) {
    window.BarcodeScanner.destroy();
  }
  emit("closeScannerSoundInfo");
};
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #ddd;
}
</style>