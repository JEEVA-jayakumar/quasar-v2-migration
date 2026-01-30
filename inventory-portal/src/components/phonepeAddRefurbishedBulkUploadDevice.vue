<template>
  <div>
    <!-- CHANGE: q-modal to q-dialog -->
    <q-dialog
      v-model="toggleModal"
      @hide="emitToggleInventoryBulkUpload"
      persistent
    >
      <q-card style="padding: 10px; max-width: 50vw; min-width: 500px">
        <div class="q-pa-md">
          <div class="row text-center justify-center">
            <!-- Header -->
            <div class="col-md-12 q-py-sm bottom-border">
              <div class="q-title text-grey-9">
                Aggregator Add Refurbished Device - Bulk Upload
              </div>
            </div>

            <!-- Download Template -->
            <div class="col-md-8" align="center">
              <br />
              <a
                href="statics/files/Device_Refurbishment.xlsx"
                class="hide-underline"
              >
                Click here to download the template
              </a>
            </div>

            <!-- File Upload -->
            <div class="col-md-8 q-py-md" align="center">
              <div
                v-if="formData.fileSelected.length === 0"
                :class="uploaderHovered ? 'toggleBulkUploadDisable' : 'toggleBulkUploadActive'"
                class="drop display-inline align-center cursor-pointer"
                @dragover.prevent="dragAndDropCustomAnimate(true)"
                @dragleave.prevent="dragAndDropCustomAnimate(false)"
                @drop="onDrop"
              >
                <label style="width:auto;" class="btn display-inline cursor-pointer">
                  Drag & Drop or click here to open a file
                  <input
                    type="file"
                    ref="deviceBulkUpload"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    @change="onChange"
                  />
                </label>
              </div>

              <div v-else align="left">
                <q-card dense class="q-pa-xs">
                  <q-card-section>
                    <div class="text-subtitle2">Uploaded File</div>
                    <q-item dense>
                      <q-item-section avatar>
                        <q-icon name="attach_file" />
                      </q-item-section>
                      <q-item-section>{{ formData.fileSelected[0].name }}</q-item-section>
                      <q-item-section side>
                        <q-btn dense flat round color="negative" icon="clear" @click="removeBulkUploadFile" />
                      </q-item-section>
                    </q-item>
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="col-md-12 row justify-end q-mt-md">
              <q-btn
                outline
                color="dark"
                label="Cancel"
                @click="emitToggleInventoryBulkUpload"
                class="q-mr-sm"
              />
              <q-btn
                color="primary"
                label="Upload"
                @click="uploadFileForBulkUpload"
              />
            </div>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

/* ---------------- Props & Emits ---------------- */
const props = defineProps({
  propOpenRefurbishedBulkUploadModal: Boolean
});
const emit = defineEmits([
  "closeModel",
  "emitToggleinventoryBulkUploadOnSuccess"
]);

/* ---------------- Quasar, Vuex & Router ---------------- */
const $q = useQuasar();
const store = useStore();
const router = useRouter();

/* ---------------- Reactive State ---------------- */
const toggleModal = ref(props.propOpenRefurbishedBulkUploadModal);
const uploaderHovered = ref(false);
const formData = ref({
  fileSelected: []
});

/* ---------------- Watcher for Prop ---------------- */
watch(() => props.propOpenRefurbishedBulkUploadModal, val => toggleModal.value = val);

/* ---------------- Methods ---------------- */
const emitToggleInventoryBulkUpload = () => {
  toggleModal.value = false;
  emit("closeModel");
};

const removeBulkUploadFile = () => {
  formData.value.fileSelected = [];
};

const dragAndDropCustomAnimate = action => {
  uploaderHovered.value = action;
};

const onDrop = event => {
  event.preventDefault();
  event.stopPropagation();
  formData.value.fileSelected = Array.from(event.dataTransfer.files);
  fileCheckSum(formData.value.fileSelected);
};

const onChange = event => {
  formData.value.fileSelected = Array.from(event.target.files);
  fileCheckSum(formData.value.fileSelected);
};

const fileCheckSum = files => {
  const allowed = /\.(csv|xlsx|xls)$/i;
  if (!allowed.exec(files[0].name)) {
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

const uploadFileForBulkUpload = async () => {
  if (!formData.value.fileSelected.length) {
    $q.notify({
      color: "amber-9",
      position: "bottom",
      message: "Please upload file",
      icon: "warning"
    });
    return;
  }

  const payload = new FormData();
  payload.append("file", formData.value.fileSelected[0]);

  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Uploading file..."
  });

  try {
    await store.dispatch("InventoryBulkUploadDevice/AGGREGATOR_REFURBISH_DEVICE_BULK_UPLOAD_DATA", {
      file: payload
    });

    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Devices Successfully added!",
      icon: "thumb_up"
    });

    emitToggleInventoryBulkUpload();
    emit("emitToggleinventoryBulkUploadOnSuccess");
    router.push("/inventory/PhonepeInventory");

  } catch (error) {

    $q.notify({
      color: "negative",
      position: "bottom",
      message:
        error.status === 400
          ? "Invalid file name. Please name the file as Device_Refurbishment"
          : error.status === 409
          ? "Given uploaded file is empty!"
          : error.status === 404
          ? "File is empty"
          : error.status === 500
          ? "Server error. Please try again."
          : "Please try again.",
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

input[type="file"] {
  position: absolute;
  opacity: 0;
  z-index: -1;
}

.display-inline {
  display: inline-block;
  vertical-align: middle;
}

.align-center {
  text-align: center;
}

.drop {
  padding: 15px;
  background-color: #f6f6f6;
  border-radius: 2px;
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

.hide-underline {
  text-decoration: none;
}

.bottom-border {
  border-bottom: 1px solid #ddd;
}

.q-title {
  font-size: 1.25rem;
  font-weight: 500;
}
</style>