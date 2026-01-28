<template>
  <div>
    <!-- Reject QR Lead Modal -->
    <q-dialog
      v-model="toggleModal"
      persistent
      no-backdrop-dismiss
      no-esc-dismiss
      class="customModalOverlay"
      :content-style="{ padding: '30px', minWidth: '40vw' }"
    >
      <form>
        <div class="column group">
          <div class="col-12 q-title q-py-md">Reject with remarks</div>
          <div class="col-12">
            <q-input
              filled
              type="textarea"
              placeholder="Type..."
              float-label="Remarks"
              color="grey-9"
              v-model="formData.leadInformation.reason"
            />
          </div>

          <div class="col-12 group q-mt-md">
            <q-btn
              icon="clear"
              color="negative"
              class="q-ma-sm float-right"
              label="Reject"
              @click.prevent="sendRemarks"
            />
            <q-btn
              icon="block"
              color="grey-5"
              class="q-ma-sm float-right text-dark"
              label="Cancel"
              v-close-overlay
              @click="emitToggleRemarks"
            />
          </div>
        </div>
      </form>
    </q-dialog>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";

export default {
  name: "RejectQrLeadModal",
  props: {
    propToggleLeadModal: { type: Boolean, required: true },
    propLeadDetails: { type: Object, required: true }
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const store = useStore();

    // Modal visibility
    const toggleModal = ref(props.propToggleLeadModal);

    // Reactive form data
    const formData = reactive({
      leadInformation: {
        fieldName: "QR Lead Information",
        reason: ""
      },
      leadId: props.propLeadDetails.id
    });

    // Close modal
    const emitToggleRemarks = () => emit("toggleLeadModal");

    // Send rejection remarks
    const sendRemarks = async () => {
      if (!formData.leadInformation.reason) {
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Please provide remarks before rejecting.",
          icon: "warning"
        });
        return;
      }

      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Processing .."
      });

      try {
        await store.dispatch("SatLeadValidation/VERIFY_QR_LEAD_DATA", formData);

        $q.loading.hide();
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Rejected Lead : #" + formData.leadId,
          icon: "clear"
        });

        // Navigate to QR leads page
        emitToggleRemarks();
        store.$router.push("/sat/staticQrLeads");
      } catch (error) {

        $q.loading.hide();
        $q.notify({
          color: "negative",
          position: "bottom",
          message:
            error?.body?.message ?? "Please Try Again Later !",
          icon: "thumb_down"
        });
      }
    };

    return {
      toggleModal,
      formData,
      emitToggleRemarks,
      sendRemarks
    };
  }
};
</script>
