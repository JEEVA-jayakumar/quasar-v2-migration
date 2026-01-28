<template>
  <div>
    <q-dialog
      v-model="toggleModal.value"
      persistent
      :content-style="{ padding: '33px', minWidth: '33vw' }"
    >
      <q-card>
        <!-- Header -->
        <q-card-section class="q-title text-weight-regular text-center">
          <strong>Download Implementation Report File</strong>
        </q-card-section>

        <!-- Form -->
        <q-card-section>
          <q-input
            filled
            v-model="formData.from"
            type="date"
            label="From Date"
            :min="yesterday"
            :max="tomorrow"
            class="q-mb-md"
          />
          <q-input
            filled
            v-model="formData.to"
            type="date"
            label="To Date"
            :min="yesterday"
            :max="tomorrow"
            class="q-mb-md"
          />
        </q-card-section>

        <!-- Actions -->
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            color="negative"
            @click="emitfnHitachiIndianBank"
          />
          <q-btn
            label="Download"
            color="positive"
            :disable="submitDisabled"
            @click="downloadIndianBankReport"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { useQuasar, date } from "quasar";
import { useStore } from "vuex";

// Props & Emit
const props = defineProps({
  propHitachiReport: Boolean
});
const emit = defineEmits(["emitfnHitachiIndianBank"]);

// Quasar
const $q = useQuasar();

// Vuex
const store = useStore();

// Dates
const today = new Date();
const { addToDate, subtractFromDate } = date;
const tomorrow = addToDate(today, { days: 0 });
const yesterday = subtractFromDate(today, { days: 720 });

// Reactive modal & form data
const toggleModal = ref(props.propHitachiReport);
const formData = reactive({
  from: "",
  to: ""
});

// Watch for prop changes
watch(() => props.propHitachiReport, (val) => {
  toggleModal.value = val;
});

// Disable download button if dates not selected
const submitDisabled = computed(() => {
  return !formData.from || !formData.to;
});

// Cancel
function emitfnHitachiIndianBank() {
  emit("emitfnHitachiIndianBank");
}

// Download report
function downloadIndianBankReport() {
  if (submitDisabled.value) return;

  const params = {
    from: toTimestamp(formData.from),
    to: toTimestamp(formData.to)
  };

  $q.loading.show({
    delay: 100,
    spinnerColor: "purple-9",
    message: "Please wait..."
  });

  store.dispatch(
    "DownloadImplementationIndianBankReport/FETCH_IMPLEMENTATION_REPORT_FILE",
    params
  )
    .then(() => {
      $q.loading.hide();
      $q.notify({
        color: "positive",
        position: "bottom",
        message: "Successfully Downloaded",
        icon: "thumb_up"
      });
      emitfnHitachiIndianBank();
      formData.from = "";
      formData.to = "";
    })
    .catch((error) => {
      $q.loading.hide();
      let msg = "Please select the field";

      if (error.status === 400)
        msg = "Output file size is high, select smaller date range";
      else if (error.status === 500) msg = "INTERNAL_SERVER_ERROR";
      else if (error.status === 403) msg = "Please choose another date";

      $q.notify({
        color: "amber",
        position: "bottom",
        message: msg,
        icon: "thumb_down"
      });

      formData.from = "";
      formData.to = "";
    });
}

// Convert date to timestamp
function toTimestamp(strDate) {
  return strDate ? Date.parse(strDate) : null;
}
</script>

<style scoped>
.q-card-section {
  display: flex;
  flex-direction: column;
}
</style>
