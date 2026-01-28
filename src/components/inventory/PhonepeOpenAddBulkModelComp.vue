<template>
  <div>
    <q-dialog
      v-model="toggleModal"
      persistent
      no-backdrop-dismiss
      transition-show="scale"
      transition-hide="scale"
      :maximized="false"
    >
      <q-card style="padding: 30px; max-width: 40vw;">
        <div class="q-pa-md">
          <!-- Header -->
          <div class="row text-center justify-center">
            <div class="col-12 q-py-sm bottom-border">
              <div class="q-title text-grey-9">Bulk Upload</div>
            </div>

            <!-- Template Download -->
            <div class="col-12" align="left">
              <a href="statics/files/deviceUploadTemplate.xlsx" class="hide-underline">
                Click here to download the template
              </a>
            </div>

            <!-- Drag & Drop Upload -->
            <div class="col-12 q-py-md" align="center">
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
                    @change="onChange"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    hidden
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
                      <q-item-section>{{ formData.fileSelected[0].name }}</q-item-section>
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
            <div class="col-12 q-mt-md text-right">
              <q-btn
                color="primary"
                label="Send To Repair"
                class="q-ml-sm"
                push
                highlight
                @click="sendToRepairUpload"
              />
              <q-btn
                color="primary"
                label="Move To Scrap"
                class="q-ml-sm"
                push
                highlight
                @click="moveToScrapUpload"
              />
            </div>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

// Props & Emits
const props = defineProps({
  propOpenBulkModal: Boolean,
  propAllDevicestypes: Array
});
const emit = defineEmits(["closeModel", "emitToggleinventoryBulkUploadOnSuccess"]);

// Quasar and Vuex
const $q = useQuasar();
const store = useStore();

/* ---------------- State ---------------- */
const toggleModal = ref(props.propOpenBulkModal);
const uploaderHovered = ref(false);
const formData = reactive({
  deviceType: "",
  fileSelected: []
});
const selectOption = ref([]);

/* ---------------- Watchers ---------------- */
watch(() => props.propOpenBulkModal, val => (toggleModal.value = val));

/* ---------------- Methods ---------------- */
const emitToggleinventoryBulkUpload = () => {
  toggleModal.value = false;
  emit("closeModel");
};

// Initialize device type options
const deviceTypeOptions = () => {
  const cookedArr = props.propAllDevicestypes.map(v => ({ label: v.deviceName, value: v.id }));
  formData.deviceType = cookedArr[0]?.value || "";
  selectOption.value = cookedArr;
};
deviceTypeOptions();

// Drag & Drop Handlers
const dragAndDropCustomAnimate = (action) => {
  uploaderHovered.value = action;
};

const onDrop = (e) => {
  formData.fileSelected = Array.from(e.dataTransfer.files);
  fileCheckSum(formData.fileSelected);
};

const onChange = (e) => {
  formData.fileSelected = Array.from(e.target.files);
  fileCheckSum(formData.fileSelected);
};

const fileCheckSum = (files) => {
  const re = /(\.csv|\.xlsx|\.xls)$/i;
  if (!re.exec(files[0].name)) {
    formData.fileSelected = [];
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "File format not supported",
      icon: "clear"
    });
    return false;
  }
};

const removeBulkUploadFile = () => {
  formData.fileSelected = [];
};

/* ---------------- Upload Methods ---------------- */
const sendToRepairUpload = async () => {
  if (formData.fileSelected.length === 0) {
    $q.notify({ color: "amber-9", position: "bottom", message: "Please upload file", icon: "warning" });
    return;
  }

  const form = new FormData();
  form.append("file", formData.fileSelected[0]);
  form.append("device_type", formData.deviceType);

  $q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Uploading..." });

  try {
    await store.dispatch("PhonepeInventoryBulkUploadDevice/FEED_PHONEPE_SEND_TO_REPAIR_DEVICE_BULK_UPLOAD_DATA", {
      file: form,
      device_type: formData.deviceType
    });
    $q.notify({ color: "positive", position: "bottom", message: "Devices Successfully added!", icon: "thumb_up" });
    emitToggleinventoryBulkUpload();
    emit("emitToggleinventoryBulkUploadOnSuccess");
  } catch (err) {
    $q.notify({
      color: "negative",
      position: "bottom",
      message: err?.data?.message || "Please Try Again Later!",
      icon: "thumb_down"
    });
  } finally {
    $q.loading.hide();
  }
};

const moveToScrapUpload = async () => {
  if (formData.fileSelected.length === 0) {
    $q.notify({ color: "amber-9", position: "bottom", message: "Please upload file", icon: "warning" });
    return;
  }

  const form = new FormData();
  form.append("file", formData.fileSelected[0]);
  form.append("device_type", formData.deviceType);

  $q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Uploading..." });

  try {
    await store.dispatch("PhonepeInventoryBulkUploadDevice/FEED_PHONEPE_MOVIE_TO_SCRAP_DEVICE_BULK_UPLOAD_DATA", {
      file: form,
      device_type: formData.deviceType
    });
    $q.notify({ color: "positive", position: "bottom", message: "Devices Successfully added!", icon: "thumb_up" });
    emitToggleinventoryBulkUpload();
    emit("emitToggleinventoryBulkUploadOnSuccess");
  } catch (err) {
    $q.notify({
      color: "negative",
      position: "bottom",
      message: err?.data?.message || "Please Try Again Later!",
      icon: "thumb_down"
    });
  } finally {
    $q.loading.hide();
  }
};
</script>

<style scoped>
.drop {
  padding: 15px;
  background-color: #f6f6f6;
  border-radius: 2px;
  width: 100%;
  max-width: 600px;
  max-height: 400px;
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
</style>
