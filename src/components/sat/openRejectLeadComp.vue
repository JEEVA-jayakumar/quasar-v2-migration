<template>
  <div>
    <q-dialog 
      v-model="dialogModel" 
      @hide="emitToggleReject" 
      persistent
      :maximized="false"
    >
      <q-card :style="{ padding: '50px', minWidth: '400px' }">
        <q-card-section class="text-center">
          <div class="q-subheading q-mb-md capitalize">
            {{ propShowRejectLeadComponent.merchantName }}
          </div>
          <div class="text-light-blue q-title q-mb-md">
            #{{ propShowRejectLeadComponent.leadNumber }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-input
            filled
            color="grey-9"
            v-model="formData.device"
            label="Selected Device"
            disable
          />

          <div class="text-center q-my-md text-light-blue q-title">
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

          <q-input
            v-model="formData.leadVerificationStatus.reason"
            type="textarea"
            label="Type Your Reason Here..."
            filled
            color="grey-9"
            class="q-my-md"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            color="negative"
            label="Reject"
            class="q-ma-sm"
            @click="leadRejectSubmit"
          />
          <q-btn
            color="grey-9"
            label="Cancel"
            class="q-ma-sm"
            @click="emitToggleReject"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { reactive, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default {
  props: {
    showRejectLeadModel: Boolean,
    propShowRejectLeadComponent: Object
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const store = useStore();

    // Form Data
    const formData = reactive({
      device: "",
      leadId: props.propShowRejectLeadComponent.leadId,
      leadInformation: {
        verifiedFinanceStatus:
          props.propShowRejectLeadComponent.verifiedFinanceStatus
      },
      leadVerificationStatus: {
        status: 0,
        fieldName: "Device",
        reasonType: "",
        reason: ""
      }
    });

    // Validation
    const rules = {
      leadVerificationStatus: {
        reasonType: { required },
        reason: { required }
      }
    };
    const v$ = useVuelidate(rules, formData);

    // Computed Getters
    const getShortLeadInfo = computed(
      () => store.getters["SatLeadValidation/getShortLeadInfo"]
    );

    // Computed for dialog model
    const dialogModel = computed({
      get: () => props.showRejectLeadModel,
      set: (value) => {
        if (!value) {
          emit("closeRejectLeadModel");
        }
      }
    });

    // Methods
    const emitToggleReject = () => emit("closeRejectLeadModel");

    const ajaxLoadShortLeadInfo = async () => {
      $q.loading.show({ message: "Loading..." });
      try {
        await store.dispatch(
          "SatLeadValidation/FETCH_SHORT_LEAD_DATA",
          props.propShowRejectLeadComponent.leadId
        );
        formData.device = getShortLeadInfo.value.device?.deviceName || "";
      } catch {
        $q.notify({
          color: "negative",
          message: "Failed to load device info",
          icon: "error"
        });
      } finally {
        $q.loading.hide();
      }
    };

    const leadRejectSubmit = async () => {
      v$.value.$touch();
      if (v$.value.$error) {
        $q.notify({ message: "Please review fields again.", color: "negative" });
        return;
      }

      const confirm = await $q.dialog({
        title: "Confirm",
        message: "Are you sure want to reject the lead?",
        ok: "Continue",
        cancel: "Cancel"
      }).onOk(() => true).onCancel(() => false);

      if (!confirm) return;

      $q.loading.show({ spinnerColor: "purple-9", message: "Processing..." });
      try {
        await store.dispatch("Finance/REJECT_LEAD_EXCEPTION", formData);
        emitToggleReject();
        $q.notify({
          color: "negative",
          message: `Rejected lead #${formData.leadId}`,
          icon: "clear"
        });
        // Navigate after success
        store.$router?.push("/sat/lead/validation");
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
      ajaxLoadShortLeadInfo();
    });

    return {
      dialogModel,
      formData,
      v$,
      emitToggleReject,
      ajaxLoadShortLeadInfo,
      leadRejectSubmit,
      getShortLeadInfo
    };
  }
};
</script>

<style scoped>
/* Keep your existing styles, adjust if needed */
</style>