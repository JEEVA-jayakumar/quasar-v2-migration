<template>
  <div>
    <q-dialog
      :model-value="props.showLostModel"
      persistent
      @update:model-value="handleDialogUpdate"
      :maximized="false"
      :max-width="'50vw'"
    >
      <q-card style="padding: 25px; min-width: 400px">
        <!-- Header -->
        <div align="center" class="text-weight-light text-grey-8 q-mb-md">
          <h5><b>Remarks</b></h5>
        </div>

        <div align="left" class="text-weight-light text-grey-8 q-mb-md">
          Add your remarks and then submit....
        </div>

        <!-- Remarks Input -->
        <div class="gutter-xs">
          <q-input
            type="textarea"
            placeholder="Type..."
            v-model="remarks"
            @input="fnMapRemarks"
            class="q-my-md"
            color="grey-9"
            align="left"
            outlined
          />
        </div>

        <!-- Action Buttons -->
        <div class="row justify-end q-mt-md">
          <q-btn
            color="positive"
            label="Submit"
            class="q-ma-sm"
            @click="aggregatorsLostStolenDevice(formData.data)"
          />
          <q-btn
            color="grey-9"
            label="Cancel"
            class="q-ma-sm"
            @click="emitToggleLost"
          />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
// import { useStore } from 'stores/store'
import { useQuasar } from 'quasar'; // Added useQuasar

export default {
  name: "AggregatorLostStolenModal",
  props: {
    showLostModel: { type: Boolean, required: true },
    propShowLostComponent: { type: Object, required: true },
  },
  setup(props, { emit }) {
    const store = useStore();
    const $q = useQuasar(); // Get Quasar instance

    // Reactive state - REMOVED duplicate showLostModel ref
    const remarks = ref("");

    const formData = reactive({
      data: props.propShowLostComponent?.aggregatorRegionalInventory || {}
    });

    // Map remarks to formData
    const fnMapRemarks = (val) => {
      formData.data.lostOrStolenRemarks = val;
    };

    // Handle dialog update
    const handleDialogUpdate = (value) => {
      if (!value) {
        emit("closeLostModel");
      }
    };

    // Emit close event
    const emitToggleLost = () => {
      emit("closeLostModel");
    };

    // Submit lost/stolen device
    const aggregatorsLostStolenDevice = (reqData) => {
      $q.dialog({
        title: "Confirm",
        message: "Are you sure want to Move Lost/Stolen Inventory?",
        ok: "Continue",
        cancel: "Cancel",
      }).onOk(() => {
        $q.loading.show({
          delay: 0,
          spinnerColor: "purple-9",
          message: "Processing ..",
        });

        store.dispatch("MasterTracker/APPROVE_PHONEPE_LOST_STOLEN_DEVICE", reqData)
          .then(() => {
            $q.loading.hide();
            $q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully Approved!",
              icon: "thumb_up",
            });
            emit("closeLostModel");
          })
          .catch((error) => {
            $q.loading.hide();
            $q.notify({
              color: "negative",
              position: "bottom",
              message: error?.body?.message || "Please Try Again Later !",
              icon: "thumb_down",
            });
          });
      });
    };

    return {
      remarks,
      formData,
      fnMapRemarks,
      emitToggleLost,
      aggregatorsLostStolenDevice,
      handleDialogUpdate
    };
  }
};
</script>

<style scoped>
/* Optional custom styles */
</style>
