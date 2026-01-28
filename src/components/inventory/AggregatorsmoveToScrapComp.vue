<template>
  <q-dialog
    v-model="localShow"
    persistent
  >
    <q-card class="q-pa-md" style="min-width: 400px">

      <div class="text-center text-grey-8 q-mb-md">
        <h5><b>Remarks</b></h5>
      </div>

      <div class="text-grey-8 q-mb-md">
        Add your remarks and then submit....
      </div>

      <!-- REMARKS INPUT -->
      <q-input
        v-model="remarks"
        type="textarea"
        placeholder="Type.."
        color="grey-9"
        class="q-mb-md"
        @update:model-value="fnMapRemarks"
      />

      <!-- ACTION BUTTONS -->
      <div class="row justify-end q-gutter-sm">
        <q-btn
          color="grey-9"
          flat
          label="Cancel"
          @click="emitToggleScrap"
        />
        <q-btn
          color="positive"
          label="Submit"
          @click="AggregatorsMovedToScrap"
        />
      </div>

    </q-card>
  </q-dialog>
</template>

<script>
import { ref, reactive, watch } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

export default {
  name: "MoveToScrapRemarks",

  props: {
    showScrapModel: {
      type: Boolean,
      required: true
    },
    propShowScrapComponent: {
      type: Object,
      required: true
    }
  },

  emits: ["closeScrapModel"],

  setup(props, { emit }) {
    const $q = useQuasar();
    const store = useStore();

    /* ------------------------------------
     * Dialog visibility (sync with parent)
     * ---------------------------------- */
    const localShow = ref(props.showScrapModel);

    watch(
      () => props.showScrapModel,
      val => (localShow.value = val)
    );

    /* ------------------------------------
     * Form data (UNCHANGED STRUCTURE)
     * ---------------------------------- */
    const remarks = ref("");

    const formData = reactive({
      data: props.propShowScrapComponent
    });

    /* ------------------------------------
     * Map remarks into payload
     * ---------------------------------- */
    const fnMapRemarks = (val) => {
      formData.data.lostOrStolenRemarks = val;
    };

    /* ------------------------------------
     * Close dialog
     * ---------------------------------- */
    const emitToggleScrap = () => {
      emit("closeScrapModel");
    };

    /* ------------------------------------
     * Submit → Confirm → API
     * ---------------------------------- */
    const AggregatorsMovedToScrap = () => {
      $q.dialog({
        title: "Confirm",
        message: "Are you sure Move to Scrap ?",
        ok: { label: "Continue", color: "positive" },
        cancel: { label: "Cancel", color: "grey" }
      }).onOk(async () => {
        try {
          $q.loading.show({
            spinnerColor: "purple-9",
            message: "Processing .."
          });

          await store.dispatch(
            "SendToRepair/AGGREGATORS_MOVED_TO_SCRAP_DATAS",
            formData.data
          );

          emitToggleScrap();

          $q.notify({
            color: "positive",
            position: "bottom",
            message: "Successfully Moved!",
            icon: "thumb_up"
          });
        } catch{

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

    return {
      localShow,
      remarks,
      fnMapRemarks,
      AggregatorsMovedToScrap,
      emitToggleScrap
    };
  }
};
</script>

<style scoped>
/* optional styling */
</style>
