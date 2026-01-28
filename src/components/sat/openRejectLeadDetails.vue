<template>
  <div class="row">
    <div class="col-12 q-title q-pa-md text-weight-regular bottom-border">
      Reject Lead Details
    </div>

    <div class="col-12 q-title q-pa-md">
      <div align="center" class="text-light-blue q-title q-mb-md">
        #{{ propShowRejectLeadDetailsComponent.leadName }}
      </div>
      <div align="center" class="text-light-blue q-title q-mb-md">
        #{{ propShowRejectLeadDetailsComponent.leadId }}
      </div>

      <div class="col-md-12">
        <q-input
          filled
          color="grey-9"
          v-model="formData.device"
          label="Device Type"
          disable
        />
      </div>

      <div class="col-md-12 q-my-md">
        <div align="center" class="col-md-10 text-light-blue q-title q-mb-md">
          Reason Type
        </div>

        <q-radio
          v-model="formData.leadVerificationStatus.reasonType"
          val="Wrong Device Type"
          label="Wrong Device Type"
          color="grey-9"
        />
        <q-radio
          v-model="formData.leadVerificationStatus.reasonType"
          val="Others"
          label="Others"
          color="grey-9"
        />

        <!-- Validation Error -->
        <div
          class="text-negative q-py-xs group q-caption"
          v-if="v$.value.formData.leadVerificationStatus.reasonType.$error"
        >
          <div v-if="v$.value.formData.leadVerificationStatus.reasonType.$params.required">
            <q-icon color="negative" name="warning" />&nbsp;Required
          </div>
        </div>

        <q-input
          v-model="formData.leadVerificationStatus.reason"
          type="textarea"
          label="Type Your Reason Here..."
          filled
          color="grey-9"
          class="q-my-md"
        />
      </div>

      <div align="center" class="col-md-10 text-light-blue q-title q-mb-md">
        <q-btn
          color="negative"
          class="q-ma-sm"
          label="Reject"
          @click="leadRejectSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default {
  props: {
    showRejectLeadDetailsModel: Boolean,
    propShowRejectLeadDetailsComponent: Object
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const store = useStore();

    // Reactive Form Data
    const formData = reactive({
      device: props.propShowRejectLeadDetailsComponent.device || "",
      leadId: props.propShowRejectLeadDetailsComponent.leadId || "",
      leadInformation: {
        verifiedFinanceStatus:
          props.propShowRejectLeadDetailsComponent.leadInformation
            ?.verifiedFinanceStatus || ""
      },
      leadVerificationStatus: {
        status: 0,
        fieldName: "Device",
        reasonType: "",
        reason: ""
      }
    });

    // Vuelidate rules
    const rules = {
      formData: {
        leadVerificationStatus: {
          reasonType: { required },
          reason: { required }
        }
      }
    };

    const v$ = useVuelidate(rules, { formData });

    // Computed Getters
    const getAllDevicesInfo = computed(() => store.getters["SA_Devices/getAllDevicesInfo"]);
    const getShortLeadInfo = computed(() => store.getters["SatLeadValidation/getShortLeadInfo"]);

    // Emit Close
    const emitToggleReject = () => {
      emit("closeRejectLeadDetailsModel", "closeReject");
    };

    // Submit Handler
    const leadRejectSubmit = async () => {
      v$.value.$touch();

      if (v$.value.$error) {
        $q.notify({ color: "negative", message: "Please review fields again." });
        return;
      }

      const confirmed = await $q.dialog({
        title: "Confirm",
        message: "Are you sure want to reject the lead?",
        ok: "Continue",
        cancel: "Cancel"
      }).onOk(() => true).onCancel(() => false);

      if (!confirmed) return;

      $q.loading.show({
        spinnerColor: "purple-9",
        message: "Processing..."
      });

      try {
        await store.dispatch("Finance/REJECT_LEAD_EXCEPTION", formData);
        emitToggleReject();
        $q.notify({
          color: "negative",
          message: `Rejected lead #${formData.leadId}`,
          icon: "clear"
        });
      } catch (error) {

        $q.notify({
          color: "negative",
          message: error?.body?.message || "Please Try Again Later!",
          icon: "thumb_down"
        });
      } finally {
        $q.loading.hide();
      }
    };

    onMounted(() => {
      // Additional logic if needed after mount
    });

    return {
      formData,
      v$,
      getAllDevicesInfo,
      getShortLeadInfo,
      leadRejectSubmit,
      emitToggleReject
    };
  }
};
</script>

<style scoped>
/* Existing styling preserved */
</style>
