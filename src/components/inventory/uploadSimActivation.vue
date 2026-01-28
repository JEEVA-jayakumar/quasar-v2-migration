<template>
  <div>
    <q-dialog
      v-model="toggleModal"
      persistent
      :maximized="false"
      :max-width="'50vw'"
    >
      <q-card style="padding: 10px; min-width: 50vw">
        <div class="q-pa-md">
          <div class="row text-center justify-center">
            <!-- Header -->
            <div class="col-md-12 q-py-sm bottom-border">
              <div class="q-title text-grey-9">Sim Activation - Bulk Upload</div>
            </div>

            <!-- Download Template -->
            <div class="col-md-8" align="center">
              <a href="statics/files/Upload_Sim_data.xlsx" class="hide-underline">
                Click here to download the template
              </a>
            </div>

            <!-- Drag & Drop / File Upload -->
            <div class="col-md-8 q-py-md" align="center">
              <div
                v-if="formData.fileSelected.length === 0"
                :class="uploaderHovered ? 'toggleBulkUploadDisable' : 'toggleBulkUploadActive'"
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
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    class="hidden"
                    @change="onChange"
                  />
                </label>
              </div>

              <!-- Uploaded File Preview -->
              <div v-else align="left">
                <q-card dense class="q-pa-xs">
                  <q-card-section>
                    <q-item dense>
                      <q-item-section avatar>
                        <q-icon name="attach_file" />
                      </q-item-section>
                      <q-item-section>
                        {{ formData.fileSelected[0].name }}
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          outline
                          size="sm"
                          color="negative"
                          icon="clear"
                          label="Remove"
                          @click="removeBulkUploadFile"
                        />
                      </q-item-section>
                    </q-item>
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="col-md-12 group" align="right">
              <q-btn
                outline
                color="dark"
                label="Cancel"
                @click="emitSimActivationList"
              />
              <q-btn
                class="common-btn"
                label="Upload"
                @click="uploadSimActivation"
              />
            </div>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref , watch } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";

// Props & emits
const props = defineProps({
  propSimActivationList: Boolean
});
const emit = defineEmits(["emitpropSimActivationList"]);

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();

// Reactive state
const toggleModal = ref(props.propSimActivationList);
const uploaderHovered = ref(false);
const formData = ref({
  fileSelected: [],
  deviceType: "",
  sim: null
});

// Watch prop to sync modal
watch(() => props.propSimActivationList, val => {
  toggleModal.value = val;
});

// Remove selected file
const removeBulkUploadFile = () => {
  formData.value.fileSelected = [];
};

// Drag & drop hover effect
const dragAndDropCustomAnimate = (hovered) => {
  uploaderHovered.value = hovered;
};

// Handle file drop
const onDrop = (event) => {
  formData.value.fileSelected = Array.from(event.dataTransfer.files);
  fileCheckSum(formData.value.fileSelected);
};

// Handle file selection via input
const onChange = (event) => {
  formData.value.fileSelected = Array.from(event.target.files);
  fileCheckSum(formData.value.fileSelected);
};

// Validate file type
const fileCheckSum = (files) => {
  const allowedExtensions = /\.(csv|xlsx|xls)$/i;
  if (!allowedExtensions.exec(files[0].name)) {
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

// Emit modal close
const emitSimActivationList = () => {
  formData.value.sim = null;
  emit("emitpropSimActivationList");
};

// Upload SIM activation file
const uploadSimActivation = async () => {
  if (formData.value.fileSelected.length === 0) {
    $q.notify({
      color: "amber-9",
      position: "bottom",
      message: "Please upload file",
      icon: "warning"
    });
    return;
  }

  $q.loading.show({
    delay: 100,
    spinnerColor: "purple-9",
    message: "Please wait..."
  });

  const uploadData = new FormData();
  uploadData.append("file", formData.value.fileSelected[0]);

  try {
    const response = await store.dispatch(
      "SatRegionalInventory/SIM_ACTIVE_UPLOAD_CENTRAL_INVENTORY",
      { file: uploadData }
    );

    // Trigger parent update
    emit("emitpropSimActivationList");

    // Download response file
    const contentType = response.headers["content-type"] || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const blob = new Blob([response.data], { type: contentType });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "Sim_upload_Remarks.xlsx";
    link.click();

    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Successfully Added!",
      icon: "thumb_up"
    });

    formData.value.fileSelected = [];
  } catch (error) {

    $q.notify({
      color: "negative",
      position: "bottom",
      message: error?.body?.message || "Please Try Again Later !",
      icon: "thumb_down"
    });
  } finally {
    $q.loading.hide();
  }
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
  width: 100%;
  max-width: 600px;
  max-height: 400px;
  cursor: pointer;
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

.bottom-border {
  border-bottom: 1px solid #ddd;
}
</style>
