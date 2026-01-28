<template>
  <div>
    <q-dialog
      v-model="showQrRejectModelRef"
      persistent
      :maximized="false"
      :content-class="'q-pa-lg'"
      :max-width="'500px'"
      @hide="emitToggleReject"
      @escape-key="emitToggleReject"
    >
      <div class="q-pa-md">
        <!-- Merchant & Lead Info -->
        <div class="q-subheading text-center q-mb-md capitalize">
          {{ propShowQrRejectComponent.merchantName }}
        </div>
        <div class="text-light-blue q-title text-center q-mb-md">
          #{{ propShowQrRejectComponent.qrLeadNumber }}
        </div>

        <!-- Reason Radio Buttons -->
        <div class="text-weight-light text-grey-8 q-mb-md">Reason</div>
        <div class="gutter-xs">
          <q-radio
            v-for="option in reasonOptions"
            :key="option"
            v-model="formData.qrLeadVerificationStatus.reasonType"
            :val="option"
            :label="option"
            color="grey-9"
            @blur="touchField('reasonType')"
            :error="v$.formData.qrLeadVerificationStatus.reasonType.$error"
          />
        </div>

        <!-- Reason Textarea -->
        <q-input
          type="textarea"
          placeholder="Type.."
          class="q-my-md"
          color="grey-9"
          v-model="formData.qrLeadVerificationStatus.reason"
          @blur="touchField('reason')"
          :error="v$.formData.qrLeadVerificationStatus.reason.$error"
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
  name: "QrRejectModal",
  props: {
    showQrRejectModel: {
      type: Boolean,
      default: false
    },
    propShowQrRejectComponent: {
      type: Object,
      required: true
    }
  },
  emits: ["closeQrRejectModel", "reloadQrPaymentTrackerData"],
  setup(props, { emit }) {
    const showQrRejectModelRef = ref(props.showQrRejectModel);

    // Sync prop to local ref
    watch(
      () => props.showQrRejectModel,
      (val) => (showQrRejectModelRef.value = val)
    );

    // Reason Options
    const reasonOptions = [
      "Short Fund",
      "Excess Fund",
      "Cheque Bounce",
      "No Fund",
      "Others"
    ];

    // Form data reactive object
    const formData = reactive({
      qrLeadInformation: {
        verifiedFinanceStatus: 3
      },
      qrLeadVerificationStatus: {
        status: 0,
        fieldName: "Finance",
        reasonType: "",
        reason: ""
      },
      leadId: props.propShowQrRejectComponent.id
    });

    // Vuelidate rules
    const rules = {
      formData: {
        qrLeadVerificationStatus: {
          reasonType: { required },
          reason: {
            required: requiredIf(() => formData.qrLeadVerificationStatus.reasonType === "Others")
          }
        }
      }
    };

    const v$ = useVuelidate(rules, { formData });

    // Vuex actions
    const { QR_REJECT_FINANCE_EXCEPTION } = mapActions("qrFinance", ["QR_REJECT_FINANCE_EXCEPTION"]);

    // Touch a field for validation
    const touchField = (field) => {
      v$.value.formData.qrLeadVerificationStatus[field].$touch();
    };

    // Emit close
    const emitToggleReject = () => {
      emit("closeQrRejectModel", "reloadQrPaymentTrackerData");
    };

    // Submit reject
    const financeRejectSubmit = () => {
      v$.value.$touch();
      if (v$.value.$error) {
        // Validation error
        window.$q.notify("Please review fields again.");
      } else {
        window.$q.dialog({
          title: "Confirm",
          message: "Are you sure want to reject the lead?",
          ok: "Continue",
          cancel: "Cancel"
        }).onOk(() => {
          window.$q.loading.show({
            delay: 0,
            spinnerColor: "purple-9",
            message: "Processing .."
          });

          QR_REJECT_FINANCE_EXCEPTION(formData)
            .then(() => {
              emit("closeQrRejectModel");
              emit("reloadQrPaymentTrackerData");
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
        }).onCancel(() => {
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
      showQrRejectModelRef,
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

<style scoped>
</style>
