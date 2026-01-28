<template>
  <div>
    <q-dialog
      v-model="toggleModal"
      persistent
      transition-show="scale"
      transition-hide="scale"
      @hide="emitToggleStaticQrFileUpload"
    >
      <q-card class="q-pa-md" style="min-width: 30vw;">
        <div class="column text-center">
          <!-- Title -->
          <div class="q-title text-grey-9 q-pb-sm bottom-border">
            <b>Static QR Excel File Upload</b>
          </div>

          <!-- Drag & Drop or Click -->
          <div class="col-md-8 q-my-md" align="center">
            <div
              v-if="formData.fileSelected.length === 0"
              :class="uploaderHovered ? 'toggleBulkUploadDisable' : 'toggleBulkUploadActive'"
              class="drop display-inline align-center cursor-pointer"
              @dragover.prevent="dragAndDropCustomAnimate(true)"
              @dragleave.prevent="dragAndDropCustomAnimate(false)"
              @drop.prevent="onDrop"
            >
              <label class="btn display-inline cursor-pointer" style="width: auto;">
                Drag & Drop Or Click Here To Open A File
                <input
                  type="file"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  @change="onChange"
                  ref="deviceBulkUpload"
                  style="position:absolute; opacity:0; width:0; height:0;"
                />
              </label>
            </div>

            <!-- Uploaded File Preview -->
            <div v-else align="left">
              <q-card dense class="q-pa-xs">
                <q-card-section>
                  <div class="text-h6">Uploaded File</div>
                  <q-separator spaced />
                  <q-item dense>
                    <q-item-section avatar>
                      <q-icon name="attach_file" />
                    </q-item-section>
                    <q-item-section>{{ formData.fileSelected[0]?.name ?? "" }}</q-item-section>
                    <q-item-section side>
                      <q-btn
                        dense
                        flat
                        round
                        icon="clear"
                        color="negative"
                        size="sm"
                        @click="removeUploadFile"
                      />
                    </q-item-section>
                  </q-item>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Buttons -->
          <div class="col-md-12 group" align="right">
            <q-btn flat color="dark" label="Cancel" @click="emitToggleStaticQrFileUpload" />
            <q-btn
              color="purple-9"
              label="Upload"
              :disable="formData.fileSelected.length === 0"
              @click="uploadFileForUpload"
            />
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { mapActions } from "vuex";
import { useQuasar } from "quasar";

export default {
  name: "StaticQrFileUpload",
  props: {
    propFileUpload: { type: Boolean, default: false }
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const toggleModal = ref(props.propFileUpload);
    const uploaderHovered = ref(false);
    const formData = ref({ fileSelected: [] });
    const deviceBulkUpload = ref(null);

    watch(() => props.propFileUpload, (val) => {
      toggleModal.value = val;
    });

    const emitToggleStaticQrFileUpload = () => {
      emit("closeModel");
    };

    const removeUploadFile = () => {
      formData.value.fileSelected = [];
    };

    const dragAndDropCustomAnimate = (action) => {
      uploaderHovered.value = action;
    };

    const onDrop = (event) => {
      formData.value.fileSelected = event.dataTransfer.files;
      fileCheckSum(event.dataTransfer.files);
    };

    const onChange = (event) => {
      formData.value.fileSelected = event.target.files;
      fileCheckSum(event.target.files);
    };

    const fileCheckSum = (files) => {
      const re = /(\.csv|\.xlsx|\.xls)$/i;
      if (!re.exec(files[0].name)) {
        formData.value.fileSelected = [];
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "File format not supported",
          icon: "clear"
        });
        return false;
      }
    };

    const { FEED_STATIC_QR_LEAD_UPLOAD_DATA } = mapActions("staticQRDownload", [
      "FEED_STATIC_QR_LEAD_UPLOAD_DATA"
    ]);

    const uploadFileForUpload = async () => {
      if (formData.value.fileSelected.length === 0) {
        $q.notify({
          color: "amber-9",
          position: "bottom",
          message: "Please upload file",
          icon: "warning"
        });
        return;
      }

      const fd = new FormData();
      fd.append("file", formData.value.fileSelected[0]);

      $q.loading.show({ spinnerColor: "purple-9", message: "Validating ..." });

      try {
        await FEED_STATIC_QR_LEAD_UPLOAD_DATA({ file: fd });
        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Successfully Uploaded!",
          icon: "thumb_up"
        });
        $q.loading.hide();
        emitToggleStaticQrFileUpload();
      } catch (err) {
        $q.notify({
          color: "negative",
          position: "bottom",
          message: err.body?.message ?? "Please Try Again Later!",
          icon: "thumb_down"
        });
        $q.loading.hide();
      }
    };

    return {
      toggleModal,
      uploaderHovered,
      formData,
      deviceBulkUpload,
      emitToggleStaticQrFileUpload,
      removeUploadFile,
      dragAndDropCustomAnimate,
      onDrop,
      onChange,
      uploadFileForUpload
    };
  }
};
</script>

<style scoped>
* {
  font-family: Arial;
  font-size: 12px;
}
.display-inline {
  display: inline-block;
  vertical-align: middle;
}
.drop {
  padding: 15px;
  background-color: #f6f6f6;
  border-radius: 2px;
  height: 100%;
  max-height: 400px;
  max-width: 600px;
  width: 100%;
}
.toggleBulkUploadActive {
  border: 4px dashed #ccc;
}
.toggleBulkUploadDisable {
  border: 4px dashed #1f2c3fa6;
}
.cursor-pointer {
  cursor: pointer;
}
.bottom-border {
  border-bottom: 1px solid #ddd;
}
</style>
