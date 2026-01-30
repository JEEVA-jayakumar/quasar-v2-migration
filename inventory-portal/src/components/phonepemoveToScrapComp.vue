<template>
  <div>
    <q-dialog
      v-model="showScrapModel"
      persistent
      no-backdrop-dismiss
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="padding: 25px; min-width: 400px;">
        <!-- Header -->
        <div class="text-center text-weight-light text-grey-8 q-mb-md">
          <h5><b>Remarks</b></h5>
        </div>
        <div class="text-left text-weight-light text-grey-8 q-mb-md">
          Add your remarks and then submit....
        </div>

        <!-- Remarks Input -->
        <q-input
          type="textarea"
          filled
          v-model="remarks"
          placeholder="Type..."
          class="q-my-md"
          color="grey-9"
          @input="fnMapRemarks"
        />

        <!-- Action Buttons -->
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
            @click="MovedToScrap(formData.data)"
          />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";

const props = defineProps({
  showScrapModel: Boolean,
  propShowScrapComponent: Object
});

const emit = defineEmits(["closeScrapModel"]);

const $q = useQuasar();
const store = useStore();

/* ---------------- State ---------------- */
const showScrapModel = ref(props.showScrapModel);
const remarks = ref("");
const formData = reactive({
  data: props.propShowScrapComponent
});

/* ---------------- Watch ---------------- */
watch(() => props.showScrapModel, val => showScrapModel.value = val);

/* ---------------- Methods ---------------- */
const emitToggleScrap = () => {
  showScrapModel.value = false;
  emit("closeScrapModel");
};

const fnMapRemarks = (val) => {
  if (formData.data) {
    formData.data.lostOrStolenRemarks = val;
  }
};

const MovedToScrap = (reqData) => {
  if (!reqData) return;

  $q.dialog({
    title: "Confirm",
    message: "Are you sure Move to Scrap?",
    ok: "Continue",
    cancel: "Cancel"
  }).onOk(async () => {
    $q.loading.show({
      delay: 0,
      spinnerColor: "purple-9",
      message: "Processing .."
    });

    try {
      await store.dispatch("AggregatorSendToRepair/PHONEPE_MOVED_TO_SCRAP_DATAS", reqData);

      emitToggleScrap();
      $q.notify({
        color: "positive",
        position: "bottom",
        message: "Successfully Moved!",
        icon: "thumb_up"
      });
    } catch {

      $q.notify({
        color: "negative",
        position: "bottom",
        message: "Please try again later!",
        icon: "thumb_down"
      });
    } finally {
      $q.loading.hide();
    }
  });
};
</script>

<style scoped>
.q-card {
  min-width: 400px;
}

textarea {
  resize: none;
}
</style>
