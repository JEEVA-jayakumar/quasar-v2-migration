<template>
  <q-page class="q-pa-md">

    <div class="row text-center justify-center">

      <!-- Header -->
      <div class="col-md-12 q-py-sm bottom-border custom-background">
        <div class="q-title text-grey-9">Ticket Assign/Reassign - Bulk Upload</div>
      </div>

      <!-- Template Download -->
      <div class="col-md-8 q-py-md" align="center">
        <a href="statics/files/Assign_Ticket.xlsx" class="hide-underline">
          Click here to download the template
        </a>
      </div>

      <!-- File Upload Dropzone -->
      <div class="col-md-8 q-py-md" align="center">
        <div
          v-if="formData.fileSelected.length === 0"
          :class="uploaderHovered ? 'toggleBulkUploadActive' : 'toggleBulkUploadDisable'"
          class="drop display-inline align-center cursor-pointer"
          @dragover.prevent="dragAndDropCustomAnimate(true)"
          @dragleave.prevent="dragAndDropCustomAnimate(false)"
          @drop.prevent="onDrop"
        >
          <label class="btn display-inline cursor-pointer">
            Drag & Drop or click here to open a file
            <input
              type="file"
              ref="deviceBulkUpload"
              @change="onChange"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
          </label>
        </div>

        <!-- Uploaded File Preview -->
        <div v-else align="left">
          <q-card dense class="q-pa-xs">
            <q-card-title>Uploaded File</q-card-title>
            <q-separator />
            <q-card-section>
              <q-item dense>
                <q-item-section avatar>
                  <q-icon name="attach_file" />
                </q-item-section>
                <q-item-section>{{ formData.fileSelected[0].name }}</q-item-section>
              </q-item>
            </q-card-section>
            <q-separator />
            <q-card-actions align="end">
              <q-btn
                outline
                size="sm"
                color="negative"
                icon="clear"
                label="Remove"
                @click="removeFile"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>

      <!-- Upload Button -->
      <div class="col-md-12 group" align="center">
        <q-btn
          color="purple-9"
          label="Upload"
          :disabled="formData.fileSelected.length === 0"
          @click="uploadFile"
        />
      </div>

    </div>

    <!-- Loading Spinner Overlay -->
    <div v-if="loading" class="fullscreen spinner-overlay">
      <q-spinner-bars class="absolute-center" :size="35" color="#61116a" />
    </div>

  </q-page>
</template>

<script>
import { ref, reactive } from "vue";
import { useQuasar } from "quasar";
import { mapActions } from "vuex";

export default {
  name: "ServiceTicketBulkUpload",
  setup() {
    const $q = useQuasar();

    // State
    const formData = reactive({ fileSelected: [] });
    const uploaderHovered = ref(false);
    const loading = ref(false);
    const deviceBulkUpload = ref(null);

    // Vuex Action
    const { TICKET_ASSIGN_BULK_UPLOAD } = mapActions("SatRegionalInventory", [
      "TICKET_ASSIGN_BULK_UPLOAD",
    ]);

    // Drag & Drop animation
    const dragAndDropCustomAnimate = (hover) => {
      uploaderHovered.value = hover;
    };

    // File drop
    const onDrop = (event) => {
      const files = event.dataTransfer.files;
      formData.fileSelected = Array.from(files);
    };

    // File input change
    const onChange = (event) => {
      formData.fileSelected = Array.from(event.target.files);
    };

    // Remove file
    const removeFile = () => {
      formData.fileSelected = [];
    };

    // Upload file
    const uploadFile = async () => {
      if (formData.fileSelected.length === 0) return;

      loading.value = true;

      const fd = new FormData();
      fd.append("file", formData.fileSelected[0]);

      try {
        const response = await TICKET_ASSIGN_BULK_UPLOAD({ file: fd });

        // Download returned file
        const contentType = response.headers["content-type"] || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        const blob = new Blob([response.data], { type: contentType });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "Assign_Status.xlsx";
        link.click();

        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Successfully Assigned!",
          icon: "thumb_up",
        });

        formData.fileSelected = [];
      } catch (err) {
        const message =
          err?.body?.message || "Please Try Again Later!";
        $q.notify({
          color: "negative",
          position: "bottom",
          message,
          icon: "thumb_down",
        });
      } finally {
        loading.value = false;
      }
    };

    return {
      formData,
      uploaderHovered,
      loading,
      deviceBulkUpload,
      dragAndDropCustomAnimate,
      onDrop,
      onChange,
      removeFile,
      uploadFile,
    };
  },
};
</script>

<style scoped>
* {
  font-family: "Arial";
  font-size: 12px;
}

.drop {
  padding: 15px;
  background-color: #f6f6f6;
  border-radius: 2px;
  max-width: 600px;
  width: 100%;
  max-height: 400px;
  height: 100%;
}

.toggleBulkUploadActive {
  border: 4px dashed #ccc;
}

.toggleBulkUploadDisable {
  border: 4px dashed #1f2c3fa6;
}

.hide-underline {
  text-decoration: none;
}

.custom-background {
  background-color: #f5f5f5;
}
</style>
