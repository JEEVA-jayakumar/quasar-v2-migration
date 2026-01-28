<template>
  <div>
    <!-- CHANGE: q-modal to q-dialog -->
    <q-dialog
      v-model="toggleModal"
      @hide="emitToggleInventoryBulkUpload"
      persistent
    >
      <q-card style="padding: 30px; max-width: 40vw; min-width: 500px">
        <div class="q-pa-md">
          <div class="row text-center justify-center">
            <!-- Header -->
            <div class="col-md-12 q-py-sm bottom-border">
              <div class="q-title text-grey-9">Aggregator Bulk Upload</div>
            </div>

            <!-- Template Download -->
            <div class="col-md-8 text-left q-pt-md">
              <a href="statics/files/deviceUploadTemplate.xlsx" class="hide-underline">
                Click here to download the template
              </a>
            </div>

            <!-- File Drop / Upload -->
            <div class="col-md-8 q-py-md text-center">
              <div
                v-if="formData.fileSelected.length === 0"
                :class="uploaderHovered ? 'toggleBulkUploadDisable' : 'toggleBulkUploadActive'"
                class="drop display-inline align-center cursor-pointer"
                @dragover.prevent="dragAndDropCustomAnimate(true)"
                @dragleave.prevent="dragAndDropCustomAnimate(false)"
                @drop="onDrop"
              >
                <label class="btn display-inline cursor-pointer">
                  Drag & Drop or click here to open a file
                  <input
                    type="file"
                    ref="deviceBulkUpload"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    @change="onChange"
                  />
                </label>
              </div>

              <div v-else class="text-left">
                <q-card dense class="q-pa-xs">
                  <q-card-section>
                    <div class="text-subtitle2">Uploaded File</div>
                    <q-item dense>
                      <q-item-section avatar>
                        <q-icon name="attach_file" />
                      </q-item-section>
                      <q-item-section>{{ formData.fileSelected[0].name }}</q-item-section>
                      <q-item-section side>
                        <q-btn
                          dense
                          flat
                          round
                          color="negative"
                          icon="clear"
                          @click="removeBulkUploadFile"
                        />
                      </q-item-section>
                    </q-item>
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="col-md-12 row justify-end q-mt-md">
              <q-btn
                color="positive"
                label="Send To Repair"
                class="q-mr-sm"
                @click="sendToRepairUpload"
              />
              <q-btn
                color="negative"
                label="Move To Scrap"
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
import { ref, watch } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

/* ---------------- Props ---------------- */
const props = defineProps({
  propOpenBulkModal: Boolean,
  propAllDevicestypes: Array
});

/* ---------------- Emits ---------------- */
const emit = defineEmits([
  "closeModel",
  "emitToggleInventoryBulkUploadOnSuccess"
]);

/* ---------------- Quasar & Vuex ---------------- */
const $q = useQuasar();
const store = useStore();

/* ---------------- Reactive State ---------------- */
const toggleModal = ref(props.propOpenBulkModal);
const uploaderHovered = ref(false);
const formData = ref({
  deviceType: props.propAllDevicestypes[0]?.id || "",
  fileSelected: []
});

/* ---------------- Watchers ---------------- */
watch(
  () => props.propOpenBulkModal,
  (val) => {
    toggleModal.value = val;
  }
);

watch(toggleModal, (val) => {
  emit("closeModel", val);
});

/* ---------------- Methods ---------------- */
const emitToggleInventoryBulkUpload = () => {
  toggleModal.value = false;
};

const removeBulkUploadFile = () => {
  formData.value.fileSelected = [];
};

const dragAndDropCustomAnimate = (action) => {
  uploaderHovered.value = action;
};

const onDrop = (event) => {
  event.preventDefault();
  event.stopPropagation();
  formData.value.fileSelected = Array.from(event.dataTransfer.files);
  fileCheckSum(formData.value.fileSelected);
};

const onChange = (event) => {
  formData.value.fileSelected = Array.from(event.target.files);
  fileCheckSum(formData.value.fileSelected);
};

const fileCheckSum = (files) => {
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

const sendToRepairUpload = () => {
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

  store.dispatch(
    "InventoryBulkUploadDevice/FEED_AGGREGATORS_SEND_TO_REPAIR_DEVICE_BULK_UPLOAD_DATA",
    { file: payload, device_type: formData.value.deviceType }
  )
    .then(() => {
      $q.notify({
        color: "positive",
        position: "bottom",
        message: "Devices Successfully added!",
        icon: "thumb_up"
      });
      emitToggleInventoryBulkUpload();
      emit("emitToggleInventoryBulkUploadOnSuccess");
    })
    .catch((error) => {
      $q.notify({
        color: "negative",
        position: "bottom",
        message: error?.data?.message || "Something went wrong",
        icon: "thumb_down"
      });
    });
};

const moveToScrapUpload = () => {
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

  store.dispatch(
    "InventoryBulkUploadDevice/FEED_AGGREGATORS_MOVIE_TO_SCRAP_DEVICE_BULK_UPLOAD_DATA",
    { file: payload, device_type: formData.value.deviceType }
  )
    .then(() => {
      $q.notify({
        color: "positive",
        position: "bottom",
        message: "Devices Successfully added!",
        icon: "thumb_up"
      });
      emitToggleInventoryBulkUpload();
      emit("emitToggleInventoryBulkUploadOnSuccess");
    })
    .catch((error) => {
      $q.notify({
        color: "negative",
        position: "bottom",
        message: error?.data?.message || "Something went wrong",
        icon: "thumb_down"
      });
    });
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

.align-center {
  text-align: center;
}

.display-inline {
  display: inline-block;
  vertical-align: middle;
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