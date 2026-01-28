<template>
  <div>
    <q-dialog
      v-model="toggleModal"
      persistent
    >
      <q-card style="min-width: 50vw">
        <q-card-section class="text-center bottom-border">
          <div class="text-h6 text-grey-9">
            Sim De-Activation - Bulk Upload
          </div>
        </q-card-section>

        <q-card-section class="row justify-center">
          <a
            href="statics/files/Upload_Sim_data.xlsx"
            class="hide-underline"
          >
            Click here to download the template
          </a>
        </q-card-section>

        <!-- Upload Area -->
        <q-card-section class="row justify-center">
          <div
            v-if="formData.fileSelected.length === 0"
            :class="uploaderHovered ? 'toggleBulkUploadDisable' : 'toggleBulkUploadActive'"
            class="drop align-center cursor-pointer"
            @dragover.prevent="setHover(true)"
            @dragleave.prevent="setHover(false)"
            @drop.prevent="onDrop"
          >
            <label class="cursor-pointer">
              Drag & Drop or click here to open a file
              <input
                type="file"
                class="hidden"
                accept=".csv,.xlsx,.xls"
                @change="onChange"
              />
            </label>
          </div>

          <!-- Uploaded file preview -->
          <q-card
            v-else
            flat
            bordered
            class="q-mt-md"
            style="width: 100%"
          >
            <q-item>
              <q-item-section avatar>
                <q-icon name="attach_file" />
              </q-item-section>
              <q-item-section>
                {{ formData.fileSelected[0].name }}
              </q-item-section>
              <q-item-section side>
                <q-btn
                  dense
                  flat
                  color="negative"
                  icon="clear"
                  @click="removeBulkUploadFile"
                />
              </q-item-section>
            </q-item>
          </q-card>
        </q-card-section>

        <!-- Actions -->
        <q-card-actions align="right">
          <q-btn
            outline
            color="dark"
            label="Cancel"
            @click="emitClose"
          />
          <q-btn
            class="common-btn"
            label="Upload"
            @click="uploadSimDeactivation"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";

/* Props & Emits */
const props = defineProps({
  propSimDeactivation: Boolean
});
const emit = defineEmits(["emitpropSimDeactivation"]);

/* Quasar & Store */
const $q = useQuasar();
const store = useStore();

/* Reactive State */
const toggleModal = ref(props.propSimDeactivation);
const uploaderHovered = ref(false);

const formData = ref({
  fileSelected: [],
  sim: null
});

/* Sync modal with parent */
watch(
  () => props.propSimDeactivation,
  val => (toggleModal.value = val)
);

/* Hover UI */
const setHover = (val) => {
  uploaderHovered.value = val;
};

/* File validation */
const validateFile = (file) => {
  const regex = /\.(csv|xlsx|xls)$/i;
  if (!regex.test(file.name)) {
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "File format not supported",
      icon: "clear"
    });
    return false;
  }
  return true;
};

/* Drag & Drop */
const onDrop = (e) => {
  const files = Array.from(e.dataTransfer.files);
  if (validateFile(files[0])) {
    formData.value.fileSelected = files;
  }
};

/* File input */
const onChange = (e) => {
  const files = Array.from(e.target.files);
  if (validateFile(files[0])) {
    formData.value.fileSelected = files;
  }
};

/* Remove file */
const removeBulkUploadFile = () => {
  formData.value.fileSelected = [];
};

/* Close modal */
const emitClose = () => {
  formData.value.sim = null;
  emit("emitpropSimDeactivation");
};

/* Upload logic */
const uploadSimDeactivation = async () => {
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

  try {
    const fd = new FormData();
    fd.append("file", formData.value.fileSelected[0]);

    const response = await store.dispatch(
      "SatRegionalInventory/SIM_DEACTIVE_UPLOAD_CENTRAL_INVENTORY",
      { file: fd }
    );

    /* Download response file */
    const contentType =
      response.headers["content-type"] ||
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    const blob = new Blob([response.data], { type: contentType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Sim_upload_Remarks.xlsx";
    link.click();

    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Successfully Added!",
      icon: "thumb_up"
    });

    formData.value.fileSelected = [];
    emitClose();
  } catch (err) {
    $q.notify({
      color: "negative",
      position: "bottom",
      message: err?.body?.message || "Please Try Again Later !",
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
</style>
