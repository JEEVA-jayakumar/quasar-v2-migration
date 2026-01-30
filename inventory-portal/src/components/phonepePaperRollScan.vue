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
        <div class="col">Scan POD Number</div>
        <div class="col-auto">
          <q-btn round size="sm" outline color="dark" icon="clear" @click="emitToggleRemarks" />
        </div>
      </div>

      <!-- Form -->
      <form>
        <q-input
          v-model="formData.podNumber.podNumber"
          readonly
          float-label="POD Number"
          class="q-mb-md"
        />

        <div class="text-right">
          <q-btn
            icon="check"
            label="Save"
            style="color: white; background-color: #61116a;"
            @click.prevent="fnsubmit"
          />

          <q-btn
            v-if="scannerToggleOption"
            outline
            color="blue"
            class="q-ml-sm q-py-xs"
            label="Start Scan"
            @click.prevent="openScannerComp"
          />
        </div>
      </form>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import VueBarcodeScanner from "vue-barcode-scanner";

// Initialize Barcode Scanner
const $q = useQuasar();
const store = useStore();
const barcodeScanner = VueBarcodeScanner;

// Props & Emits
const props = defineProps({
  scanInfo: Object,
  propToggleScannerPop: Boolean
});
const emit = defineEmits(["closeScannerInfo", "reloadPhonepePendingDetails"]);

// Reactive State
const toggleModal = ref(props.propToggleScannerPop);
const scannerToggleOption = ref(true);
const formData = reactive({
  ticketId: props.scanInfo?.data?.serviceReqTicketId || null,
  podNumber: { podNumber: null },
  action: props.scanInfo?.action || null
});

// Vuelidate
const rules = {
  formData: {
    podNumber: {
      podNumber: { required }
    }
  }
};
const v$ = useVuelidate(rules, { formData });

// Watch for prop changes
watch(() => props.propToggleScannerPop, val => (toggleModal.value = val));

// Clean up Barcode listener on unmount
onBeforeUnmount(() => {
  if (barcodeScanner.hasListener()) barcodeScanner.destroy();
});

/* ---------------- Methods ---------------- */

const emitToggleRemarks = () => {
  if (barcodeScanner.hasListener()) barcodeScanner.destroy();
  emit("closeScannerInfo");
};

const fnsubmit = async () => {
  v$.value.$touch();
  if (v$.value.$error) {
    $q.notify({ color: "negative", position: "bottom", message: "Please review fields again." });
    return;
  }

  try {
    await store.dispatch("phonePeCrm/UPDATE_PHONEPE_PAPERROLL_PODNUMBER", formData);
    $q.notify({
      color: "positive",
      position: "bottom",
      message: "PodNumber updated successfully",
      icon: "thumb_up"
    });
    emitToggleRemarks();
    emit("reloadPhonepePendingDetails", formData.action);
  } catch (err) {
    $q.notify({
      color: "negative",
      position: "bottom",
      message: err?.body?.message || "Please Try Again Later!",
      icon: "thumb_down"
    });
  }
};

const openScannerComp = () => {
  $q.notify({
    color: "positive",
    position: "bottom",
    message: "Start scanning",
    icon: "list"
  });

  formData.podNumber.podNumber = "";
  scannerToggleOption.value = false;

  if (!barcodeScanner.hasListener()) {
    barcodeScanner.init(onBarcodeScanned);
  }
};

const onBarcodeScanned = (barcode) => {
  formData.podNumber.podNumber = barcode;
  scannerToggleOption.value = false;
  barcodeScanner.destroy();
};
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #ddd;
}

.q-mb-md {
  margin-bottom: 1rem;
}
</style>
