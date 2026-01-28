<template>
  <div>
    <q-dialog
      v-model="toggleModal"
      persistent
      no-backdrop-dismiss
      :maximized="false"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="min-width: 40vw; padding: 30px;">
        <form @submit.prevent="downloadSendToRepair">
          <!-- Header -->
          <div class="q-mb-md text-center">
            <div class="text-h6 text-weight-bold">
              Download Lost Or Stolen File
            </div>
          </div>

          <!-- From Date -->
          <q-input
            filled
            v-model="formData.from"
            label="From Date"
            mask="####-##-##"
            placeholder="YYYY-MM-DD"
            :rules="[val => !!val || 'From date is required']"
            class="q-mb-sm"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer" @click="showFromDate = !showFromDate" />
            </template>
          </q-input>
          <q-popup-proxy v-model="showFromDate" transition-show="scale" transition-hide="scale">
            <q-date
              v-model="formData.from"
              :min="yesterday"
              :max="tomorrow"
              mask="YYYY-MM-DD"
              default-year-month
            />
          </q-popup-proxy>

          <!-- To Date -->
          <q-input
            filled
            v-model="formData.to"
            label="To Date"
            mask="####-##-##"
            placeholder="YYYY-MM-DD"
            :rules="[val => !!val || 'To date is required']"
            class="q-mb-sm"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer" @click="showToDate = !showToDate" />
            </template>
          </q-input>
          <q-popup-proxy v-model="showToDate" transition-show="scale" transition-hide="scale">
            <q-date
              v-model="formData.to"
              :min="yesterday"
              :max="tomorrow"
              mask="YYYY-MM-DD"
              default-year-month
            />
          </q-popup-proxy>

          <!-- Action Buttons -->
          <div class="row justify-end q-mt-md">
            <q-btn
              flat
              label="Cancel"
              color="grey-8"
              text-color="black"
              class="q-mr-sm"
              @click="emitFnShowSendToRepair"
            />
            <q-btn
              label="Download"
              color="purple-9"
              :disable="submitDisabled"
              @click.prevent="downloadSendToRepair"
            />
          </div>
        </form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { date } from "quasar";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

const props = defineProps({
  propSendToRepair: Boolean
});
const emit = defineEmits(["emitfnshowSendToRepair"]);

const $q = useQuasar();
const store = useStore();

/* ---------------- State ---------------- */
const toggleModal = ref(props.propSendToRepair);
const showFromDate = ref(false);
const showToDate = ref(false);
const formData = ref({
  from: "",
  to: ""
});

const today = new Date();
const { addToDate, subtractFromDate } = date;
const tomorrow = addToDate(today, { days: 0 }).toISOString().split("T")[0];
const yesterday = subtractFromDate(today, { days: 7720 }).toISOString().split("T")[0];

/* ---------------- Watch ---------------- */
watch(() => props.propSendToRepair, val => toggleModal.value = val);

/* ---------------- Computed ---------------- */
const submitDisabled = computed(() => {
  return !(formData.value.from && formData.value.to);
});

/* ---------------- Methods ---------------- */
const emitFnShowSendToRepair = () => {
  toggleModal.value = false;
  emit("emitfnshowSendToRepair");
};

const downloadSendToRepair = async () => {
  if (!formData.value.from || !formData.value.to) return;

  const params = {
    from: new Date(formData.value.from).getTime(),
    to: new Date(formData.value.to).getTime()
  };

  $q.loading.show({
    delay: 100,
    spinnerColor: "purple-9",
    message: "Please wait..."
  });

  try {
    await store.dispatch("DownloadInventorySendToRepair/FETCH_PHONEPE_SEND_TO_REPAIR_INVENTORY_ALL_DATAS", params);

    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Successfully Downloaded",
      icon: "thumb_up"
    });

    formData.value.from = "";
    formData.value.to = "";

    emitFnShowSendToRepair();

  } catch (error) {

    let message = "Please select the field";
    if (error.status === 400) message = "Output file size is high, select smaller date range";
    else if (error.status === 500) message = "INTERNAL_SERVER_ERROR";
    else if (error.status === 403 || error.status === 404) message = "Please choose another date";

    $q.notify({
      color: "amber",
      position: "bottom",
      message,
      icon: "thumb_down"
    });

    formData.value.from = "";
    formData.value.to = "";
  } finally {
    $q.loading.hide();
  }
};
</script>

<style scoped>
.q-date__calendar {
  max-height: 300px;
}

.error {
  color: red;
  font-size: 12px;
  position: absolute;
  text-transform: lowercase;
}
</style>
