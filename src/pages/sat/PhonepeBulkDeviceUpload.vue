<template>
  <div>
    <!-- CHANGE: q-modal to q-dialog -->
    <q-dialog
      v-model="toggleModal"
      @hide="emitToggleinventoryBulkUpload"
      persistent
    >
      <q-card style="padding: 10px; max-width: 50vw; min-width: 500px">
        <div class="q-pa-md">
          <div class="row text-center justify-center">
            <!-- Modal Header -->
            <div class="col-md-12 q-py-sm bottom-border">
              <div class="q-title text-grey-9">Aggregator Add New Device - Bulk Upload</div>
            </div>

            <!-- Device Type Select -->
            <div class="col-md-8 q-py-md" align="left">
              <q-select
                v-model="formData.deviceType"
                :options="deviceOption"
                color="grey-9"
                label="Select Device Type"
                dense
                emit-value
                map-options
              />
            </div>

            <!-- Device Status Select -->
            <div class="col-md-8 q-py-md" align="left">
              <q-select
                v-model="action"
                :options="actionOption"
                :disable="!formData.deviceType"
                color="grey-9"
                label="Select Device Status"
                dense
                emit-value
                map-options
              />
            </div>

            <!-- Template Download -->
            <div class="col-md-8" align="left">
              <!-- CHANGE: statics/ to public/ for Quasar v2 -->
              <a href="/files/deviceUploadTemplate.xlsx" class="hide-underline">
                Click here to download the template
              </a>
            </div>

            <!-- File Upload -->
            <div class="col-md-8 q-py-md" align="center">
              <div
                v-if="formData.fileSelected.length === 0"
                :class="[uploaderHovered ? 'toggleBulkUploadDisable' : 'toggleBulkUploadActive']"
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
                    style="display:none;"
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
                      <q-item-section side></q-item-section>
                    </q-item>
                  </q-card-section>
                  <q-card-actions align="end">
                    <q-btn
                      outline
                      size="sm"
                      color="negative"
                      label="Remove"
                      icon="clear"
                      @click="removeBulkUploadFile"
                    />
                  </q-card-actions>
                </q-card>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="col-md-12 group" align="right">
              <q-btn outline color="dark" label="Cancel" @click="emitToggleinventoryBulkUpload" />
              <q-btn class="common-btn" label="Upload" @click="uploadFileForBulkUpload" :loading="isUploading" />
            </div>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

// Props
const props = defineProps({
  propOpenBulkUploadModal: Boolean,
  propAllDevicestypes: Array
});

// Emits
const emit = defineEmits(["closeModel", "emitToggleinventoryBulkUploadOnSuccess"]);

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();

// Reactive state
const toggleModal = ref(props.propOpenBulkUploadModal);
const deviceOption = ref([]);
const action = ref("");
const actionOption = ref([
  { label: "Good", value: 1 },
  { label: "Fault", value: 2 }
]);
const formData = ref({
  deviceType: "",
  fileSelected: []
});
const uploaderHovered = ref(false);
const deviceBulkUpload = ref(null);
const isUploading = ref(false);

// Watch for prop changes
watch(
  () => props.propOpenBulkUploadModal,
  (val) => {
    toggleModal.value = val;
  }
);

// Load device options
const loadDeviceOptions = async () => {
  try {
    await store.dispatch("superAdminAggregatorsDevice/GET_ACTIVE_CREATED_DEVICE_LIST");
    const devices = store.getters["superAdminAggregatorsDevice/getCreatedActiveDeviceList"] || [];
    deviceOption.value = devices.map((item) => ({
      value: item.id,
      label: item.deviceName
    }));
  } catch (error) {
    console.error("Load device options error:", error);
    deviceOption.value = [];
  }
};

onMounted(() => {
  loadDeviceOptions();
});

// Emit close event
const emitToggleinventoryBulkUpload = () => {
  emit("closeModel");
};

// Remove uploaded file
const removeBulkUploadFile = () => {
  formData.value.fileSelected = [];
};

// Drag & drop animations
const dragAndDropCustomAnimate = (actionHover) => {
  uploaderHovered.value = actionHover;
};

// File dropped
const onDrop = (e) => {
  const files = Array.from(e.dataTransfer.files);
  formData.value.fileSelected = files;
  fileCheckSum(files);
};

// File selected via input
const onChange = (e) => {
  const files = Array.from(e.target.files);
  formData.value.fileSelected = files;
  fileCheckSum(files);
};

const fileCheckSum = (files) => {
  if (!files.length) return;
  
  const allowed = /\.(csv|xlsx|xls)$/i;
  if (!allowed.exec(files[0].name)) {
    formData.value.fileSelected = [];
    toggleNotification("negative", "File format not supported");
  }
};

const toggleNotification = (color, message) => {
  $q.notify({ 
    color, 
    position: "bottom", 
    message, 
    icon: color === "negative" ? "clear" : "thumb_up" 
  });
};

// Upload Bulk File
const uploadFileForBulkUpload = async () => {
  if (formData.value.fileSelected.length === 0) {
    toggleNotification("amber-9", "Please upload file");
    return;
  }

  if (!formData.value.deviceType) {
    toggleNotification("amber-9", "Please select device type");
    return;
  }

  if (!action.value) {
    toggleNotification("amber-9", "Please select device status");
    return;
  }

  isUploading.value = true;
  
  const formDataObj = new FormData();
  formDataObj.append("file", formData.value.fileSelected[0]);

  const payload = {
    file: formDataObj,
    device_type: formData.value.deviceType,
    action: action.value
  };

  try {
    await store.dispatch("PhonepeDeviceRecovery/FEED_PHONEPE_RECOVERY_DEVICE_BULK_UPLOAD_DATA", payload);
    
    toggleNotification("positive", "Devices Successfully added!");
    emitToggleinventoryBulkUpload();
    emit("emitToggleinventoryBulkUploadOnSuccess");
  } catch (error) {
    console.error("Upload bulk file error:", error);
    toggleNotification(
      "negative",
      error?.body?.message || 
      error?.response?.data?.message || 
      "Please Try Again Later !"
    );
  } finally {
    isUploading.value = false;
  }
};
</script>

<style scoped>
* {
  font-family: Arial;
  font-size: 12px;
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

.common-btn {
  background-color: #1976d2;
  color: white;
}

.align-center {
  text-align: center;
}

.display-inline {
  display: inline-block;
}

.cursor-pointer {
  cursor: pointer;
}
</style>