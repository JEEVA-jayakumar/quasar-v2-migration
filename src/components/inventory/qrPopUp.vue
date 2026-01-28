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
        <div class="col"><strong>Generate QR</strong></div>
        <div class="col-auto"></div>
      </div>

      <!-- Body -->
      <div class="q-ma-sm"></div>
      <p>
        <b>{{ count }}</b> QR from <b>{{ bank }}</b> Bank generated successfully
      </p>
      <p><strong>Batch ID: {{ batchId }}</strong></p>

      <!-- Actions -->
      <div class="group alignsize text-right">
        <q-btn
          color="negative"
          icon="close"
          label="Dismiss"
          @click="emitToggleRemarks"
          class="q-mr-sm"
        />
        <q-btn
          color="positive"
          icon="check"
          label="Download"
          @click="fnsubmit"
        />
      </div>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

// Props & Emits
const props = defineProps({
  QrInfo: Object,
  propToggleDataPop: Boolean
});
const emit = defineEmits(["closeRemarksInfo"]);

// Quasar & Store
const $q = useQuasar();
const store = useStore();

// Reactive State
const toggleModal = ref(props.propToggleDataPop);
const count = ref("");
const bank = ref("");
const batchId = ref("");

// Initialize data on mount
onMounted(() => {
  if (props.QrInfo?.data?.data) {
    count.value = props.QrInfo.data.data.count;
    bank.value = props.QrInfo.data.data.staticQrBank.name;
    batchId.value = props.QrInfo.data.data.batchId;
  }
});

// Methods
const emitToggleRemarks = () => {
  toggleModal.value = false;
  emit("closeRemarksInfo");
};

const fnsubmit = async () => {
  try {
    $q.loading.show({
      delay: 100,
      spinnerColor: "purple-9",
      message: "Please wait.."
    });

    const qrId = batchId.value;

    await store.dispatch("staticQrDownloads/DOWNLOAD_STATIC_QR_DATA", qrId);

    $q.loading.hide();
    emitToggleRemarks();

    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Successfully Downloaded",
      icon: "thumb_up"
    });
  } catch (error) {

    $q.loading.hide();
    $q.notify({
      color: "negative",
      position: "bottom",
      message: error?.message || "Download failed",
      icon: "thumb_down"
    });
  }
};
</script>

<style scoped>
.alignsize {
  margin-top: 18px;
}

.bottom-border {
  border-bottom: 1px solid #ddd;
}
</style>
