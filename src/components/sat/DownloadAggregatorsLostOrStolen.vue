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
            label="From Date"
            type="date"
            :min="yesterday"
            :max="tomorrow"
            class="q-mb-md"
          />
          <q-input
            filled
            v-model="formData.toDate"
            label="To Date"
            type="date"
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
            color="grey-6"
            @click="emitfnshowLostOrStolen"
          />
          <q-btn
            label="Download"
            color="purple-9"
            :disabled="submitDisabled"
            @click="downloadLostDatas"
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
  propLostStolenDatas: Boolean
});
const emit = defineEmits(["emitfnshowLostOrStolen"]);

// Quasar
const $q = useQuasar();

// Vuex
const store = useStore();

// Reactive state
const toggleModal = ref(props.propLostStolenDatas);
const today = new Date();
const { addToDate, subtractFromDate } = date;
const tomorrow = addToDate(today, { days: 0 });
const yesterday = subtractFromDate(today, { days: 7720 });

const formData = reactive({
  fromDate: "",
  toDate: ""
});

// Watch prop to open/close modal
watch(() => props.propLostStolenDatas, (val) => {
  toggleModal.value = val;
});

// Computed: disable submit if dates not selected
const submitDisabled = computed(() => {
  return !formData.fromDate || !formData.toDate;
});

// Methods
function emitfnshowLostOrStolen() {
  emit("emitfnshowLostOrStolen");
}

function downloadLostDatas() {
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

  store
    .dispatch("DownloadLostOrStolenAllDatas/FETCH_AGGREGATORS_LOST_OR_STOLEN_ALL_DATAS", params)
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

      if (error.status === 400) msg = "Output file size is high, select smaller date range";
      else if (error.status === 500) msg = "INTERNAL_SERVER_ERROR";
      else if ([403, 404].includes(error.status)) msg = "Please choose another date";

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

// Convert date string to timestamp
function toTimestamp(strDate) {
  if (!strDate) return null;
  const dateOnly = strDate.split("T")[0];
  const curDate = new Date();
  const mnth = curDate.getMonth() + 1;
  const chDate = `${curDate.getFullYear()}-${mnth < 10 ? "0" + mnth : mnth}-${curDate.getDate()}`;
  return dateOnly === chDate ? Date.now() : Date.parse(strDate);
}
</script>

<style scoped>
.q-card-section {
  display: flex;
  flex-direction: column;
}
</style>
