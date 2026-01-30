<template>
  <div>
    <q-dialog
      v-model="toggleModal"
      persistent
      no-backdrop-dismiss
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="padding: 10px; max-width: 50vw;">
        <div class="q-pa-md">
          <!-- Header -->
          <div class="row text-center justify-center">
            <div class="col-12 q-py-sm bottom-border">
              <div class="q-title text-grey-9">Aggregator Add New Device - Bulk Upload</div>
            </div>

            <!-- Device Type Select -->
            <div class="col-12 q-py-md">
              <q-select
                v-model="formData.deviceType"
                :options="deviceOption"
                label="Select Device Type"
                color="grey-9"
                filled
                dense
              />
            </div>

            <!-- Template Download -->
            <div class="col-12">
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
              <q-btn outline color="dark" label="Cancel" @click="emitToggleinventoryBulkUpload" />
              <q-btn color="primary" label="Upload" class="q-ml-sm" @click="uploadFileForBulkUpload" />
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

const props = defineProps({
  propOpenBulkUploadModal: Boolean,
  propAllDevicestypes: Array
});

const emit = defineEmits(["closeModel", "emitToggleinventoryBulkUploadOnSuccess"]);

const $q = useQuasar();
const store = useStore();

/* ---------------- State ---------------- */
const toggleModal = ref(props.propOpenBulkUploadModal);
const deviceOption = ref([]);
const uploaderHovered = ref(false);

const formData = reactive({
  deviceType: "",
  fileSelected: []
});

/* ---------------- Watchers ---------------- */
watch(() => props.propOpenBulkUploadModal, val => (toggleModal.value = val));

/* ---------------- Methods ---------------- */
const emitToggleinventoryBulkUpload = () => {
  toggleModal.value = false;
  emit("closeModel");
};

const AggregatorsDevice = async () => {
  try {
    await store.dispatch("superAdminAggregatorsDevice/GET_ACTIVE_CREATED_DEVICE_LIST");
    deviceOption.value = store.getters["superAdminAggregatorsDevice/getCreatedActiveDeviceList"].map(d => ({
      label: d.deviceName,
      value: d.id
    }));
  } catch (err) {
    console.error(err);
  }
};

// Initialize device options on mount
AggregatorsDevice();

const removeBulkUploadFile = () => {
  formData.fileSelected = [];
};

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

const uploadFileForBulkUpload = async () => {
  if (formData.fileSelected.length === 0) {
    $q.notify({
      color: "amber-9",
      position: "bottom",
      message: "Please upload file",
      icon: "warning"
    });
    return;
  }

  const form = new FormData();
  form.append("file", formData.fileSelected[0]);
  form.append("device_type", formData.deviceType);

  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Uploading..."
  });

  try {
    await store.dispatch("InventoryBulkUploadDevice/FEED_PHONEPE_DEVICE_BULK_UPLOAD_DATA", {
      file: form,
      device_type: formData.deviceType
    });

    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Devices Successfully added!",
      icon: "thumb_up"
    });

    emitToggleinventoryBulkUpload();
    emit("emitToggleinventoryBulkUploadOnSuccess");
  } catch (err) {
    $q.notify({
      color: "negative",
      position: "bottom",
      message: err?.body?.message || "Please Try Again Later!",
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
