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
        <!-- Lead Info -->
        <div align="center" class="q-subheading q-mb-md capitalize">
          {{ propShowRejectComponent.leadName }}
        </div>
        <div align="center" class="text-light-blue q-title q-mb-md">
          #{{ propShowRejectComponent.leadNumber }}
        </div>

        <!-- Reason Radios -->
        <div class="text-weight-light text-grey-8 q-mb-md">Reason</div>
        <div class="gutter-xs">
          <q-radio
            v-for="option in reasonOptions"
            :key="option"
            v-model="formData.leadVerificationStatus.reasonType"
            :val="option"
            :label="option"
            color="grey-9"
            @blur="touchField('reasonType')"
            :error="v$.formData.leadVerificationStatus.reasonType.$error"
          />
        </div>

        <!-- Remarks Textarea -->
        <q-input
          type="textarea"
          placeholder="Type.."
          v-model="formData.leadVerificationStatus.reason"
          class="q-my-md"
          color="grey-9"
          align="left"
          @blur="touchField('reason')"
          :error="v$.formData.leadVerificationStatus.reason.$error"
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
import { required, requiredIf } from "@vuelidate/validators";
import { mapActions } from "vuex";

export default {
  name: "FinanceRejectModal",
  props: {
    showRejectModel: { type: Boolean, default: false },
    propShowRejectComponent: { type: Object, required: true }
  },
  emits: ["closeRejectModel", "reloadPaymentTrackerData"],
  setup(props, { emit }) {
    const showRejectModelRef = ref(props.showRejectModel);

    // Sync prop to local ref
    watch(
      () => props.showRejectModel,
      (val) => (showRejectModelRef.value = val)
    );

    const reasonOptions = [
      "Short Fund",
      "Excess Fund",
      "Cheque Bounce",
      "No Fund",
      "Others"
    ];

    // Reactive form data
    const formData = reactive({
      leadInformation: { verifiedFinanceStatus: 3 },
      leadVerificationStatus: {
        status: 0,
        fieldName: "Finance",
        reasonType: "",
        reason: ""
      },
      leadId: props.propShowRejectComponent.leadId
    });

    // Vuelidate rules
    const rules = {
      formData: {
        leadVerificationStatus: {
          reasonType: { required },
          reason: {
            required: requiredIf(() =>
              formData.leadVerificationStatus.reasonType === "Others"
            )
          }
        }
      }
    };
    const v$ = useVuelidate(rules, { formData });

    // Vuex actions
    const { REJECT_FINANCE_EXCEPTION } = mapActions("Finance", [
      "REJECT_FINANCE_EXCEPTION"
    ]);

    // Touch a field for validation
    const touchField = (field) => {
      v$.value.formData.leadVerificationStatus[field].$touch();
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

            REJECT_FINANCE_EXCEPTION(formData)
              .then(() => {
                emit("closeRejectModel");
                emit("reloadPaymentTrackerData");
                window.$q.loading.hide();
                window.$q.notify({
                  color: "negative",
                  position: "bottom",
                  message: `Rejected lead #${formData.leadId}`,
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
      reasonOptions,
      v$,
      touchField,
      emitToggleReject,
      financeRejectSubmit
    };
  }
};
</script>

<style scoped></style>
