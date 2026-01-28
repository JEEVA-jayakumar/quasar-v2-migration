<template>
  <div>
    <q-dialog
      v-model="toggleModel"
      persistent
      no-backdrop-dismiss
      no-esc-dismiss
      :content-style="{ padding: '30px', minWidth: '40vw' }"
    >
      <!-- START >> Lead approval -->
      <form @submit.prevent="sendRemarks">
        <div class="column group">
          <div class="q-title q-py-md">Approval confirmation</div>

          <!-- Expected Submit Date -->
          <q-input
            filled
            v-model="formData.leadInformation.expectedSubmitDate"
            type="date"
            :min="currentDateForDocumentSubmission"
            label="Expected date of Doc Submission"
            color="light-blue"
            :error="!!v$.formData.leadInformation.expectedSubmitDate.$invalid"
            @blur="v$.formData.leadInformation.expectedSubmitDate.$touch()"
          />

          <!-- SO Remarks -->
          <q-input
            filled
            class="no-pointer-events"
            v-model="formData.soReason"
            label="SO Remarks"
            color="light-blue"
            :error="!!v$.formData.soReason.$invalid"
            @blur="v$.formData.soReason.$touch()"
          />

          <!-- SAT Remarks -->
          <q-input
            filled
            v-model="formData.leadInformation.kycSatRemark"
            label="SAT Remarks"
            color="light-blue"
            :error="!!v$.formData.leadInformation.kycSatRemark.$invalid"
            @blur="v$.formData.leadInformation.kycSatRemark.$touch()"
          />

          <!-- Buttons -->
          <div class="group q-mt-md">
            <q-btn
              icon="done"
              color="positive"
              class="q-ma-sm float-right"
              label="Approve"
              @click="sendRemarks"
            />
            <q-btn
              icon="block"
              color="grey-5"
              class="q-ma-sm float-right text-dark"
              label="Cancel"
              @click="emitToggleRemarks"
              v-close-overlay
            />
          </div>
        </div>
      </form>
      <!-- END >> Lead approval -->
    </q-dialog>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default {
  name: "LeadApprovalModal",
  props: {
    propToggleLeadModal: { type: Boolean, required: true },
    propLeadDetails: { type: Object, required: true },
    propDocumentIds: { type: Array, required: true }
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const store = useStore();

    // Reactive state
    const toggleModel = ref(props.propToggleLeadModal);
    const currentDateForDocumentSubmission = new Date();

    const formData = reactive({
      soReason: props.propLeadDetails.reason,
      leadInformation: {
        expectedSubmitDate: props.propLeadDetails.expectedSubmitDate,
        fieldName: "SAT exception queue KYC approve",
        kycSatRemark: "",
        merchantDocumentIds: props.propDocumentIds
      },
      leadId: props.propLeadDetails.id,
      defaultUrlValue: store.$EXCEPTION_QUEUE_KYC_SAT_APPROVE_URL_PARAM
    });

    // Vuelidate validation
    const rules = {
      formData: {
        soReason: { required },
        leadInformation: {
          expectedSubmitDate: { required },
          kycSatRemark: { required }
        }
      }
    };
    const v$ = useVuelidate(rules, { formData });

    // Emit cancel/close
    const emitToggleRemarks = () => emit("toggleLeadModal");

    // Approve and send remarks
    const sendRemarks = async () => {
      v$.value.$touch();

      if (v$.value.$invalid) {
        $q.notify({ type: "warning", message: "Please review fields again." });
        return;
      }

      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Processing .."
      });

      try {
        await store.dispatch("ExceptionQueue/FEED_SAT_EQ_KYC_FEEDBACK", formData);
        $q.loading.hide();
        $q.notify({
          color: "positive",
          position: "bottom",
          message: `Approved Lead : #${formData.leadId}`,
          icon: "thumb_up"
        });
        emitToggleRemarks();
        $q.router.push("/sat/exception/queue");
      } catch (error) {

        $q.loading.hide();
        emitToggleRemarks();

        if (error.status === 422) {
          $q.notify({
            color: "primary",
            position: "bottom",
            message: `${error.data.data.subDocumentType} is pending for approval`,
            icon: "info"
          });
        } else {
          $q.notify({
            color: "negative",
            position: "bottom",
            message: error.body?.message ?? "Please Try Again Later !",
            icon: "thumb_down"
          });
        }
      }
    };

    return {
      toggleModel,
      formData,
      currentDateForDocumentSubmission,
      emitToggleRemarks,
      sendRemarks,
      v$
    };
  }
};
</script>
