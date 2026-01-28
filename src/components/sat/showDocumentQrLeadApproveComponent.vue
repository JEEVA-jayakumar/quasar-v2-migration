<template>
  <div>
    <!-- Approve Document Modal -->
    <q-dialog
      v-model="toggleModel"
      persistent
      no-backdrop-dismiss
      no-esc-dismiss
      :content-style="{ minWidth: '30%', maxHeight: '50vh', padding: '20px' }"
    >
      <!-- START >> Give reason to approve (optional) document -->
      <div class="q-title q-mb-sm">{{ document }}</div>

      <q-input
        filled
        type="textarea"
        placeholder="Type..."
        :max-height="100"
        rows="3"
        float-label="Reason"
        color="grey-9"
        v-model="formData.leadDetails.reason"
      />

      <div class="q-mt-md">
        <q-btn
          icon="done"
          color="positive"
          class="q-ma-sm float-right"
          label="Approve"
          @click="fnApproveLeadDocumentFinal"
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
      <!-- END >> Give reason to approve (optional) document -->
    </q-dialog>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";

export default {
  name: "DocumentApproveModal",
  props: {
    propDocumentDetails: { type: Object, required: true },
    propToggleDocumentApproveModal: { type: Boolean, required: true }
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const store = useStore();

    // Modal visibility
    const toggleModel = ref(props.propToggleDocumentApproveModal);
    const document = ref(props.propDocumentDetails.documentType);

    // Reactive form data
    const formData = reactive({
      lead: {
        id: props.propDocumentDetails.leadId,
        documentId: Object.prototype.hasOwnProperty.call(props.propDocumentDetails, "currentDocumentId")
          ? props.propDocumentDetails.currentDocumentId
          : props.propDocumentDetails.id
      },
      leadDetails: {
        fieldName: "Document",
        reason: "",
        status: 1
      }
    });

    // Close modal
    const emitToggleRemarks = () => emit("toggleDocumentModal");

    // Approve document function
    const fnApproveLeadDocumentFinal = async () => {
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Processing .."
      });

      try {
        await store.dispatch("SatLeadValidation/APPROVE_QR_DOCUMENT", formData);

        $q.loading.hide();
        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Successfully approved",
          icon: "thumb_up"
        });

        emit("toggleDocumentModal");
      } catch {

        $q.loading.hide();
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Error in approving document!",
          icon: "thumb_down"
        });
      }
    };

    return {
      toggleModel,
      document,
      formData,
      emitToggleRemarks,
      fnApproveLeadDocumentFinal
    };
  }
};
</script>