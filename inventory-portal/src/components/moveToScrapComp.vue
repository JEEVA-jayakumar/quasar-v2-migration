<template>
  <div>
    <!-- CHANGE: q-modal to q-dialog -->
    <q-dialog
      v-model="showScrapModal"
      @hide="emitToggleScrap"
      persistent
    >
      <q-card style="padding: 25px; min-width: 400px">
        <!-- Header -->
        <div class="text-center text-weight-light text-grey-8 q-mb-md">
          <h5><b>Remarks</b></h5>
        </div>

        <!-- Description -->
        <div class="text-left text-weight-light text-grey-8 q-mb-md">
          Add your remarks and then submit....
        </div>

        <!-- Remarks Input -->
        <q-input
          v-model="remarks"
          type="textarea"
          placeholder="Type..."
          color="grey-9"
          class="q-my-md"
          autogrow
        />

        <!-- Buttons -->
        <div class="row justify-end q-mt-md">
          <q-btn
            color="grey-9"
            flat
            label="Cancel"
            class="q-mr-sm"
            @click="emitToggleScrap"
          />
          <q-btn
            color="positive"
            label="Submit"
            @click="moveToScrap"
          />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";

/* ---------------- Props ---------------- */
const props = defineProps({
  showScrapModel: Boolean,
  propShowScrapComponent: Object
});

/* ---------------- Emits ---------------- */
const emit = defineEmits(["closeScrapModel"]);

/* ---------------- Quasar & Vuex ---------------- */
const $q = useQuasar();
const store = useStore();

/* ---------------- Reactive State ---------------- */
const showScrapModal = ref(props.showScrapModel);
const remarks = ref("");
const formData = ref({
  data: props.propShowScrapComponent
});

/* ---------------- Watchers ---------------- */
watch(
  () => props.showScrapModel,
  (val) => {
    showScrapModal.value = val;
  }
);

watch(showScrapModal, (val) => {
  emit("closeScrapModel", val);
});

/* ---------------- Methods ---------------- */
const emitToggleScrap = () => {
  showScrapModal.value = false;
};

const moveToScrap = () => {
  if (!remarks.value) {
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "Please enter remarks",
      icon: "warning"
    });
    return;
  }

  // Map remarks to formData
  formData.value.data.lostOrStolenRemarks = remarks.value;

  $q.dialog({
    title: "Confirm",
    message: "Are you sure Move to Scrap?",
    ok: {
      label: "Continue",
      color: "positive"
    },
    cancel: {
      label: "Cancel",
      color: "grey-9",
      flat: true
    },
    persistent: true
  }).onOk(() => {
    $q.loading.show({
      delay: 0,
      spinnerColor: "purple-9",
      message: "Processing .."
    });

    store.dispatch("SendToRepair/MOVED_TO_SCRAP_DATAS", formData.value.data)
      .then(() => {
        $q.loading.hide();
        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Successfully Moved!",
          icon: "thumb_up"
        });
        emitToggleScrap();
      })
      .catch(() => {
        $q.loading.hide();
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Please try again later!",
          icon: "thumb_down"
        });
      });
  });
};
</script>

<style scoped>
/* Optional: Add your custom styles if needed */
</style>