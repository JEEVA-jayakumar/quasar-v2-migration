<template>
  <div>
    <q-dialog
      :model-value="propToggleUploadDocumentAndSubmit"
      persistent
      :maximized="false"
      class="customModalOverlay"
      @update:model-value="$emit('update:propToggleUploadDocumentAndSubmit', $event)"
    >
      <q-card :style="{ minWidth: '50%', maxHeight: '50vh', margin: '20px', padding: '20px' }">

        <!-- Header -->
        <q-card-section class="q-py-sm bottom-border">
          <div class="q-title">Bank Subvention Letter</div>
        </q-card-section>

        <!-- File Upload Section -->
        <q-card-section class="q-py-sm">
          <div v-if="!uploadFileBoolean" class="group">
            
            <!-- Attach / Modify button -->
            <label
              class="cursor-pointer text-white q-pa-xs"
              :class="attachedFileName ? 'bg-light-blue' : 'bg-grey-7'"
            >
              <span>
                <q-icon name="attach_file" /> {{ attachedFileName ? 'Modify' : 'Attach' }}
              </span>
              <input
                type="file"
                ref="bankExceptionFileUpload"
                accept=".jpg, .png, .pdf"
                @change="fnGetUploadFileDetails"
              />
            </label>

            <!-- Display attached file name -->
            <div v-if="attachedFileName" class="q-py-md">
              <span class="text-faded">Attached File:</span> {{ attachedFileName }}
            </div>
          </div>

          <!-- Uploaded file display when upload is done -->
          <div v-else>
            <q-btn
              dense
              outline
              color="grey-7"
              size="sm"
              class="file-return text-faded no-pointer-events"
            >
              {{ uploadFileName }}
            </q-btn>
          </div>
        </q-card-section>

        <!-- Action Buttons -->
        <q-card-actions align="right" class="q-py-sm">

          <!-- Submit Button -->
          <q-btn
            icon="done"
            color="positive"
            class="q-ma-sm"
            label="Submit"
            :disable="!sendForDataEntry"
            @click="finalFileUploadAndSubmit(itemDetails)"
          />

          <!-- Cancel / Close Button -->
          <q-btn
            icon="block"
            :color="cancelConfirmation ? 'negative' : 'grey-5'"
            class="q-ma-sm"
            label="Cancel"
            v-close-popup
            @click="emitToggleRemarks()"
          />

        </q-card-actions>

      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";

export default {
  name: "BankSubventionUploadModal",
  props: {
    propLeadDetails: { 
      type: Object, 
      required: true 
    },
    propToggleUploadDocumentAndSubmit: { 
      type: Boolean, 
      required: true 
    },
  },
  emits: ['update:propToggleUploadDocumentAndSubmit', 'toggleDocumentUploadAndFinalSubmit'],
  setup(props, { emit }) {
    const $q = useQuasar();
    const store = useStore();

    // Refs
    const bankExceptionFileUpload = ref(null);

    // Reactive State
    const state = reactive({
      cancelConfirmation: false,
      uploadFileName: "",
      uploadFileBoolean: false,
      attachedFileName: "",
      sendForDataEntry: false,
      itemDetails: props.propLeadDetails,
    });

    // Emit Close
    const emitToggleRemarks = () => {
      emit("toggleDocumentUploadAndFinalSubmit");
      emit('update:propToggleUploadDocumentAndSubmit', false);
    };

    // Get Uploaded File Details
    const fnGetUploadFileDetails = () => {
      const files = bankExceptionFileUpload.value.files;
      if (files.length > 0) {
        state.attachedFileName = files[0].name;
        state.sendForDataEntry = true;
      } else {
        state.attachedFileName = "";
        state.sendForDataEntry = false;
      }
    };

    // Upload file and submit
    const finalFileUploadAndSubmit = async (itemDetails) => {
      if (!bankExceptionFileUpload.value.files.length) return;

      const formData = new FormData();
      formData.append("file", bankExceptionFileUpload.value.files[0]);
      formData.append("fileNameOriginal", `${itemDetails.id}_bankSubventionDocument`);

      try {
        $q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Processing .." });

        const uploadResponse = await store.dispatch("ExceptionQueue/UPLOAD_EXCEPTION_FILE", formData);

        const cookedBankArr = {
          leadInformation: {
            verifiedBanksubventionStatus: 1,
            id: itemDetails.id,
          },
          leadVerificationStatus: {
            fieldName: "Bank Subvention",
            reason: "",
            bankAttachedFile: uploadResponse.fileUri,
            mimeType: uploadResponse.mimeType,
          },
        };

        await store.dispatch("ExceptionQueue/FEED_SAT_EQ_BANK_FEEDBACK", cookedBankArr);

        $q.loading.hide();
        $q.notify({
          color: "positive",
          position: "bottom",
          message: `Lead: #${itemDetails.id} is sent for data entry!`,
          icon: "thumb_up",
        });

        // Redirect after successful submission
        emit('update:propToggleUploadDocumentAndSubmit', false);
        emit("toggleDocumentUploadAndFinalSubmit");
        
        // Navigate to queue
        $q.router.push("/sat/exception/queue");

      } catch (err) {
        $q.loading.hide();
        const message = err?.body?.message || "Please Try Again Later!";
        $q.notify({
          color: "negative",
          position: "bottom",
          message,
          icon: "thumb_down",
        });
      }
    };

    return {
      ...state,
      bankExceptionFileUpload,
      emitToggleRemarks,
      fnGetUploadFileDetails,
      finalFileUploadAndSubmit,
    };
  },
};
</script>

<style scoped>
label {
  padding: 10px;
  display: inline-block;
}

input[type="file"] {
  display: none;
}
</style>