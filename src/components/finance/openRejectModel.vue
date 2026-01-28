<template>
  <div>
    <q-dialog
      v-model="showRejectModelRef"
      persistent
      :maximized="false"
      :content-class="'q-pa-lg'"
      :max-width="'500px'"
      @hide="emitToggleReject"
      @escape-key="emitToggleReject"
    >
      <div class="q-pa-md">
        <!-- Remarks Textarea -->
        <q-input
          type="textarea"
          placeholder="Remarks"
          class="q-my-md"
          color="grey-9"
          v-model="formData.regionalInventory.lostOrStolenRemarks"
          @blur="touchField('lostOrStolenRemarks')"
          :error="v$.formData.regionalInventory.lostOrStolenRemarks.$error"
        />

        <!-- Buttons -->
        <div class="row justify-end q-gutter-sm">
          <q-btn
            color="negative"
            label="Reject"
            @click="financeRejectSubmit"
          />
          <q-btn
            color="grey-9"
            label="Cancel"
            flat
            @click="emitToggleReject"
          />
        </div>
      </div>
    </q-dialog>
  </div>
</template>

<script>
import { reactive, ref, watch } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { mapActions } from "vuex";

export default {
  name: "LostInventoryRejectModal",
  props: {
    showRejectModel: {
      type: Boolean,
      default: false
    },
    propShowRejectComponent: {
      type: Object,
      required: true
    }
  },
  emits: ["closeRejectModel", "reloadPaymentTrackerData"],
  setup(props, { emit }) {
    const showRejectModelRef = ref(props.showRejectModel);

    // Sync prop to local ref
    watch(
      () => props.showRejectModel,
      (val) => (showRejectModelRef.value = val)
    );

    // Reactive form data
    const formData = reactive({
      regionalInventory: {
        id: props.propShowRejectComponent.regionalInventory.id,
        serialNumber: props.propShowRejectComponent.regionalInventory.serialNumber,
        lostOrStolenRemarks: ""
      }
    });

    // Vuelidate rules
    const rules = {
      formData: {
        regionalInventory: {
          lostOrStolenRemarks: { required }
        }
      }
    };
    const v$ = useVuelidate(rules, { formData });

    // Vuex actions
    const { REJECT_LOST_STOLEN_EXCEPTION } = mapActions("LostFinance", [
      "REJECT_LOST_STOLEN_EXCEPTION"
    ]);

    // Touch a field for validation
    const touchField = (field) => {
      v$.value.formData.regionalInventory[field].$touch();
    };

    // Emit close
    const emitToggleReject = () => {
      emit("closeRejectModel", "reloadPaymentTrackerData");
    };

    // Submit reject
    const financeRejectSubmit = () => {
      v$.value.$touch();
      if (v$.value.$error) {
        window.$q.notify("Please review fields again.");
      } else {
        window.$q
          .dialog({
            title: "Confirm",
            message: "Are you sure want to reject the lead?",
            ok: "Continue",
            cancel: "Cancel"
          })
          .onOk(() => {
            window.$q.loading.show({
              delay: 0,
              spinnerColor: "purple-9",
              message: "Processing .."
            });

            REJECT_LOST_STOLEN_EXCEPTION(formData.regionalInventory)
              .then(() => {
                emit("closeRejectModel");
                emit("reloadPaymentTrackerData");
                window.$q.loading.hide();
                window.$q.notify({
                  color: "negative",
                  position: "bottom",
                  message: `Rejected lead #${formData.regionalInventory.id}`,
                  icon: "clear"
                });
              })
              .catch((error) => {
                window.$q.loading.hide();
                window.$q.notify({
                  color: "negative",
                  position: "bottom",
                  message: error?.body?.message ?? "Please Try Again Later !",
                  icon: "thumb_down"
                });
              });
          })
          .onCancel(() => {
            window.$q.notify({
              color: "negative",
              position: "bottom",
              message: "No changes made!",
              icon: "thumb_down"
            });
          });
      }
    };

    return {
      showRejectModelRef,
      formData,
      v$,
      touchField,
      emitToggleReject,
      financeRejectSubmit
    };
  }
};
</script>

<style scoped>
</style>
