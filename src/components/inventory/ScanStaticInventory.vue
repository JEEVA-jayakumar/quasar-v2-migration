<template>
  <div>
    <q-dialog
      v-model="toggleModal"
      persistent
      no-backdrop-dismiss
      :content-css="{ minWidth: '30vw', padding: '20px' }"
    >
      <!-- Header -->
      <div class="row items-center bottom-border q-py-sm">
        <div class="col"><strong>Scan QR</strong></div>
        <div class="col-auto">
          <q-btn
            round
            size="sm"
            @click="emitToggleRemarks"
            outline
            color="dark"
            icon="clear"
          />
        </div>
      </div>

      <!-- Form -->
      <form>
        <div class="column group q-mt-md">
          <q-input
            readonly
            v-model="formData.scanQRNumber"
            float-label="Scan QR Number"
          />
        </div>

        <div class="group q-mt-md text-right">
          <q-btn
            @click="fnsubmit"
            :disable="!isScanStarted"
            icon="check"
            label="Save"
            color="purple"
            class="q-mr-sm"
          />
          <q-btn
            v-if="scannerToggleOption"
            @click="startScan"
            color="blue"
            outline
            label="Start scan"
          />
        </div>
      </form>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import VueBarcodeScanner from "vue-barcode-scanner";

// Props & Emits
const props = defineProps({
  scanInfo: Object,
  propToggleScannerPop: Boolean
});
const emit = defineEmits(["closeScannerInfo"]);

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();

// Reactive State
const toggleModal = ref(props.propToggleScannerPop);
const scannerToggleOption = ref(true);
const isScanStarted = ref(false);
const formData = ref({
  scanQRNumber: ""
});
const scanData = ref(props.scanInfo.data);

// Initialize on mount
onMounted(() => {
  console.log("Scan Info ID:", scanData.value.id);
  // Initialize barcode scanner plugin if needed
  if (!VueBarcodeScanner.installed) {
    VueBarcodeScanner.install();
  }
});

// Cleanup scanner listener on unmount
onBeforeUnmount(() => {
  if (window.$barcodeScanner) {
    window.$barcodeScanner.destroy();
  }
});

// Methods
const emitToggleRemarks = () => {
  toggleModal.value = false;
  if (window.$barcodeScanner) window.$barcodeScanner.destroy();
  emit("closeScannerInfo");
};

const startScan = () => {
  isScanStarted.value = true;
  openScannerComp();
};

const openScannerComp = () => {
  $q.notify({
    color: "positive",
    position: "bottom",
    message: "Start scanning",
    icon: "list"
  });
  formData.value.scanQRNumber = "";
  scannerToggleOption.value = false;

  if (!window.$barcodeScanner?.hasListener()) {
    window.$barcodeScanner?.init(onBarcodeScanned);
  }
};

const onBarcodeScanned = (barcode) => {
  console.log("Scanned Barcode:", barcode);
  formData.value.scanQRNumber = barcode;
  scannerToggleOption.value = false;
  if (window.$barcodeScanner) window.$barcodeScanner.destroy();
};

const fnsubmit = async () => {
  if (!formData.value.scanQRNumber) {
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "Please scan QR before saving",
      icon: "warning"
    });
    return;
  }

  try {
    $q.loading.show();

    const param = {
      data1: { id: scanData.value.id },
      formsList: { vpa: formData.value.scanQRNumber }
    };

    await store.dispatch("phonePeCrm/UPDATE_SCAN_QR_NUMBER", param);

    $q.loading.hide();
    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Scan QR Updated Successfully",
      icon: "thumb_up"
    });

    emitToggleRemarks();
  } catch (error) {

    $q.loading.hide();
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
.group {
  margin-top: 12px;
}
</style>
