<template>
  <q-page>
    <div class="q-pa-md">
      <div class="row text-center justify-center">
        <div class="col-md-12 q-py-md bottom-border">
          <div class="text-h5 q-px-lg q-py-md text-grey-9">
            Upload
          </div>
        </div>

        <div class="col-md-8" align="center">
          <br /><br /><br /><br /><br /><br/>
          <a
            href="statics/files/deviceUploadTemplate.xlsx"
            class="text-decoration-none"
          >
            Click here to download the template
          </a>
        </div>
        
        <div class="col-md-8 q-py-md" align="center">
          <div
            v-if="formData.fileSelected.length === 0"
            :class="[
              uploaderHovered
                ? 'toggleBulkUploadDisable'
                : 'toggleBulkUploadActive'
            ]"
            class="drop display-inline align-center cursor-pointer"
            @dragover.prevent="dragAndDropCustomAnimate(true)"
            @dragleave.prevent="dragAndDropCustomAnimate(false)"
            @drop="onDrop"
          >
            <label class="btn display-inline cursor-pointer">
              Drag & Drop or click here to open a file
              <input
                type="file"
                name="image"
                @change="onChange"
                ref="deviceBulkUpload"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              />
            </label>
          </div>
          
          <div v-else align="left">
            <q-card dense class="q-pa-xs">
              <q-card-section>
                <div class="text-h6">Uploaded File</div>
              </q-card-section>
              
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
              
              <q-card-actions align="right">
                <q-btn
                  outline
                  size="sm"
                  color="negative"
                  @click="removeBulkUploadFile"
                  label="Remove"
                  icon="clear"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>
        
        <div class="col-md-8 group" align="right">
          <q-btn
            class="common-btn"
            label="Upload"
            @click="uploadFileForBulkUpload"
          />
        </div>
      </div>
    </div>
    
    <div class="q-pa-md">
      <div class="row text-center justify-center">
        <div class="col-md-12 q-py-md bottom-border">
          <div class="text-h5 text-grey-9">
            Download
          </div>
        </div>
        
        <div class="col-md-8 group" align="center">
          <br /><br /><br /><br /><br /><br/>
          <q-btn
            class="common-btn"
            label="Download"
            @click="downloadTemplate"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';

const $q = useQuasar();
const store = useStore();

const formData = reactive({
  fileSelected: [],
  deviceType: null
});

const uploaderHovered = ref(false);
const deviceBulkUpload = ref(null);

const removeBulkUploadFile = () => {
  formData.fileSelected = [];
};

const dragAndDropCustomAnimate = (action) => {
  uploaderHovered.value = action;
};

const onDrop = (e) => {
  e.stopPropagation();
  e.preventDefault();
  formData.fileSelected = e.dataTransfer.files;
  fileCheckSum(e.dataTransfer.files);
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

const onChange = (e) => {
  formData.fileSelected = e.target.files;
};

const uploadFileForBulkUpload = async () => {
  if (formData.fileSelected.length === 0) {
    $q.notify({
      color: "amber-9",
      position: "bottom",
      message: "Please upload file",
      icon: "warning"
    });
    return false;
  }
  
  const assumeFormData = new FormData();
  assumeFormData.append("file", formData.fileSelected[0]);
  
  const assumeFormDataValue = {
    file: assumeFormData,
    device_type: formData.deviceType
  };

  try {
    await store.dispatch("InventoryBulkUploadDevice/FEED_DEVICE_BULK_UPLOAD_DATA", assumeFormDataValue);
    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Devices Successfully added!",
      icon: "thumb_up"
    });
    formData.fileSelected = [];
  } catch (error) {

    $q.notify({
      color: "negative",
      position: "bottom",
      message: error.body?.message || "Please Try Again Later !",
      icon: "thumb_down"
    });
  }
};

const downloadTemplate = () => {
  // Implement download functionality here
  $q.notify({
    color: "info",
    position: "bottom",
    message: "Download functionality to be implemented",
    icon: "info"
  });
};
</script>

<style scoped>
* {
  font-family: "Arial";
  font-size: 12px;
}

*,
*:after,
*:before {
  box-sizing: border-box;
  tap-highlight-color: rgba(0, 0, 0, 0);
  touch-callout: none;
}

input[type="file"] {
  position: absolute;
  opacity: 0;
  z-index: -1;
}

.align-center {
  text-align: center;
}

.helper {
  height: 100%;
  display: inline-block;
  vertical-align: middle;
  width: 0;
}

.hidden {
  display: none !important;
}

.hidden.image {
  display: inline-block !important;
}

.display-inline {
  display: inline-block;
  vertical-align: middle;
}

.img {
  border: 1px solid #f6f6f6;
  display: inline-block;
  height: auto;
  max-height: 80%;
  max-width: 80%;
  width: auto;
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

.text-decoration-none {
  text-decoration: none;
}

.bottom-border {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.common-btn {
  background-color: #1976d2;
  color: white;
}
</style>