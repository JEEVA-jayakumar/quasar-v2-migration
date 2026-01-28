<template>
  <q-dialog
    v-model="dialogModel"
    persistent
    :maximized="false"
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="min-width: 400px; padding: 25px;">
      <div align="center" class="q-subheading q-mb-md capitalize">
        {{ propShowRejectLeadComponent.merchantName }}
      </div>
      <div align="center" class="text-light-blue q-title q-mb-md">
        #{{ propShowRejectLeadComponent.leadNumber }}
      </div>

      <div class="q-mb-md">
        <q-input
          v-model="formData.device"
          label="Selected Device"
          filled
          disable
        />
      </div>

      <div class="row justify-end">
        <q-btn
          color="negative"
          class="q-ma-sm"
          label="Reject"
          @click="leadRejectSubmit"
        />
        <q-btn
          color="grey-9"
          class="q-ma-sm"
          label="Cancel"
          @click="emitToggleReject"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { reactive, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

export default {
  props: {
    showRejectLeadModel: Boolean,
    propShowRejectLeadComponent: Object
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const store = useStore();

    // Reactive form data
    const formData = reactive({
      device: "",
      leadId: props.propShowRejectLeadComponent.leadId,
      leadInformation: {
        verifiedFinanceStatus:
          props.propShowRejectLeadComponent.verifiedFinanceStatus || ""
      }
    });

    // Computed: short lead info
    const getShortLeadInfo = computed(() => store.getters["SatLeadValidation/getShortLeadInfo"]);

    // Computed for dialog model (to fix prop mutation)
    const dialogModel = computed({
      get: () => props.showRejectLeadModel,
      set: (value) => {
        if (!value) {
          emit("closeRejectLeadModel");
        }
      }
    });

    // Load device info
    const ajaxLoadShortLeadInfo = async () => {
      try {
        await store.dispatch(
          "SatLeadValidation/FETCH_SHORT_LEAD_DATA",
          props.propShowRejectLeadComponent.leadId
        );
        formData.device = getShortLeadInfo.value.device.deviceName;
      } catch (error) {
        console.error("Error loading short lead info:", error);
      }
    };

    onMounted(() => {
      ajaxLoadShortLeadInfo();
    });

    // Close modal
    const emitToggleReject = () => {
      emit("closeRejectLeadModel");
    };

    // Reject lead handler
    const leadRejectSubmit = async () => {
      $q.dialog({
        title: "Confirm",
        message: "Are you sure want to reject the lead?",
        ok: "Continue",
        cancel: "Cancel"
      })
      .onOk(async () => {
        $q.loading.show({
          spinnerColor: "purple-9",
          message: "Processing..."
        });
        try {
          await store.dispatch("Finance/REJECT_LEAD_EXCEPTION", formData);
          emitToggleReject();
          $q.loading.hide();
          $q.notify({
            color: "negative",
            position: "bottom",
            message: `Rejected lead #${formData.leadId}`,
            icon: "clear"
          });
          // Redirect after rejection
          window.location.href = "/sat/lead/validation"; // or use router.push if available
        } catch (error) {
          $q.loading.hide();
          emitToggleReject();
          $q.notify({
            color: "negative",
            position: "bottom",
            message: error?.body?.message || "Please Try Again Later!",
            icon: "thumb_down"
          });
        }
      });
    };

    return {
      formData,
      dialogModel,
      emitToggleReject,
      leadRejectSubmit
    };
  }
};
</script>

<style scoped>
/* preserve existing styles if needed */
</style>