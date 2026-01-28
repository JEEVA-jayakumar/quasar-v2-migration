<template>
  <div>
    <q-dialog
      v-model="toggleModal.value"
      persistent
      :content-style="{ padding: '30px', minWidth: '40vw' }"
    >
      <q-card>
        <!-- Header -->
        <q-card-section class="q-title text-weight-regular text-center">
          <strong>Download Lost Or Stolen File</strong>
        </q-card-section>

        <!-- Form -->
        <q-card-section>
          <q-input
            filled
            v-model="formData.fromDate"
            type="date"
            label="From Date"
            :min="yesterday"
            :max="tomorrow"
            class="q-mb-md"
          />
          <q-input
            filled
            v-model="formData.toDate"
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
            @click="emitfnshowLostOrStolen"
          />
          <q-btn
            label="Download"
            color="purple-9"
            :disable="submitDisabled"
            @click="downloadLostData"
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
  propLostOrStolenReport: Boolean
});
const emit = defineEmits(["emitfnshowLostOrStolen"]);

// Quasar
const $q = useQuasar();

// Vuex store
const store = useStore();

// Dates
const today = new Date();
const { addToDate, subtractFromDate } = date;
const tomorrow = addToDate(today, { days: 0 });
const yesterday = subtractFromDate(today, { days: 180 });

// Reactive modal & form
const toggleModal = ref(props.propLostOrStolenReport);
const formData = reactive({
  fromDate: "",
  toDate: ""
});

// Watch for prop changes
watch(() => props.propLostOrStolenReport, (val) => {
  toggleModal.value = val;
});

// Disable download if dates not selected
const submitDisabled = computed(() => {
  return !formData.fromDate || !formData.toDate;
});

// Emit cancel
function emitfnshowLostOrStolen() {
  emit("emitfnshowLostOrStolen");
}

// Download Lost or Stolen Data
function downloadLostData() {
  if (submitDisabled.value) return;

  const params = {
    fromDate: toTimestamp(formData.fromDate),
    toDate: toTimestamp(formData.toDate)
  };

  $q.loading.show({
    delay: 100,
    spinnerColor: "purple-9",
    message: "Please wait..."
  });

  store.dispatch("InventoryCentral/DOWNLOAD_lOST_OR_STOLEN_DATAS", params)
    .then(() => {
      $q.loading.hide();
      $q.notify({
        color: "positive",
        position: "bottom",
        message: "Successfully Downloaded",
        icon: "thumb_up"
      });
      emitfnshowLostOrStolen();
      formData.fromDate = "";
      formData.toDate = "";
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

      formData.fromDate = "";
      formData.toDate = "";
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
