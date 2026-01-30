<template>
  <div>
    <q-dialog
      v-model="toggleModal"
      persistent
      transition-show="scale"
      transition-hide="scale"
      style="max-width: 50vw; min-width: 300px;"
      @hide="emitToggleCheque"
    >
      <q-card class="q-pa-md">

        <!-- Header -->
        <div class="row items-center bottom-border q-py-sm">
          <div class="col">
            <div class="q-title text-weight-regular">Update Received QR Count</div>
          </div>
        </div>

        <!-- Input -->
        <div class="q-pt-md">
          <q-input
            type="number"
            v-model.number="formData.receivedCount"
            color="grey-9"
            :error="v$.formData.receivedCount.$invalid && v$.formData.receivedCount.$dirty"
            label="Update Count"
            placeholder="Update Count"
            min="1"
            @input="formData.receivedCount = Math.abs(formData.receivedCount)"
          />
          <div v-if="v$.formData.receivedCount.$invalid && v$.formData.receivedCount.$dirty" class="text-negative text-caption q-mt-xs">
            Count must be at least 1
          </div>
        </div>

        <!-- Actions -->
        <div class="row justify-end q-pt-md">
          <q-btn
            outline
            color="dark"
            icon="block"
            label="Cancel"
            class="q-mr-sm"
            @click="emitToggleCheque"
          />
          <q-btn
            color="purple-9"
            label="Update"
            @click="fnSubmitCount"
          />
        </div>

      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { reactive, ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useVuelidate } from "@vuelidate/core";
import { required, minValue } from "@vuelidate/validators";
import { mapActions } from "vuex";

export default {
  name: "UpdateQrCountModal",
  props: {
    propsApproveRegion: { type: Object, required: true },
    propsApproveRegionModal: { type: Boolean, default: false }
  },
  setup(props, { emit }) {
    const $q = useQuasar();

    const toggleModal = ref(props.propsApproveRegionModal);
    const updateCount = reactive({ ...props.propsApproveRegion });

    const formData = reactive({
      receivedCount: ""
    });

    // Vuelidate rules
    const rules = {
      formData: {
        receivedCount: { required, minValue: minValue(1) }
      }
    };
    const v$ = useVuelidate(rules, { formData });

    // Watch prop to update modal
    watch(
      () => props.propsApproveRegionModal,
      (val) => {
        toggleModal.value = val;
      }
    );

    // Emit close
    const emitToggleCheque = () => {
      emit("closeModel");
    };

    // Submit count
    const fnSubmitCount = async () => {
      v$.value.$touch();

      if (v$.value.$invalid) {
        $q.notify({
          message: "Please review fields again.",
          color: "negative",
          position: "bottom"
        });
        return;
      }

      const updatePayload = {
        id: updateCount.id,
        podStatus: updateCount.podStatus,
        requestCount: updateCount.requestCount,
        receivedCount: formData.receivedCount,
        qrBank: updateCount.qrBank,
        createdAt: updateCount.createdAt,
        updatedAt: updateCount.updatedAt,
        updated: updateCount.updated,
        __index: updateCount.__index
      };

      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Data uploading..."
      });

      try {
        await SUBMIT_QR_COUNT(updatePayload);
        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Successfully Updated!",
          icon: "thumb_up"
        });
        emitToggleCheque();
      } catch {
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Pod Count Mismatched",
          icon: "thumb_down"
        });
      } finally {
        $q.loading.hide();
      }
    };

    // Vuex action
    const { SUBMIT_QR_COUNT } = mapActions("generateQR", ["SUBMIT_QR_COUNT"]);

    return {
      toggleModal,
      formData,
      updateCount,
      fnSubmitCount,
      emitToggleCheque,
      v$
    };
  }
};
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #ddd;
}
</style>
