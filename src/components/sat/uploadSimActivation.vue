<template>
  <div>
    <q-dialog v-model="toggleModel" persistent :maximized="false">
      <q-card style="min-width: 50vw; padding: 10px;">
        <q-card-section class="text-center bottom-border q-py-sm">
          <div class="q-title text-grey-9">
            Sim Activation - Bulk Upload
          </div>
        </q-card-section>

        <q-card-section class="col-md-8 q-mx-auto text-center">
          <!-- Network Selection -->
          <q-select
            v-model="formData.sim"
            label="Select Network"
            placeholder="Select Network"
            :options="networkOptions"
            color="grey-9"
            outlined
            dense
          />

          <div class="q-mt-sm">
            <a href="statics/files/Upload_Sim_data.xlsx" class="hide-underline">
              Click here to download the template
            </a>
          </div>
        </q-card-section>

        <q-card-section class="col-md-8 q-mx-auto q-py-md text-center">
          <!-- Drag & Drop / File Input -->
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
              />
            </label>
          </div>

          <div v-else align="left">
            <q-card dense class="q-pa-xs">
              <q-card-section>
                <div class="text-weight-medium">Uploaded File</div>
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
                  label="Remove"
                  icon="clear"
                  @click="removeBulkUploadFile"
                />
              </q-card-actions>
            </q-card>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="col-md-12">
          <q-btn outline color="dark" label="Cancel" @click="emitfnshowSimActivationList" />
          <q-btn
            class="common-btn"
            :disable="!formData.sim"
            label="Upload"
            @click="uploadSimActivation"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, reactive, watch } from "vue";
import { useQuasar } from "quasar";
import { mapActions } from "vuex";

export default {
  props: {
    propSimActivationList: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { emit }) {
    const $q = useQuasar();

    // Reactive Data
    const toggleModel = ref(props.propSimActivationList);
    const uploaderHovered = ref(false);
    const formData = reactive({
      sim: null,
      fileSelected: []
    });

    // Options
    const networkOptions = [
      { value: 1, label: "Airtel" },
      { value: 2, label: "Vodafone" },
      { value: 3, label: "Jio" }
    ];

    // Vuex Actions
    const { SIM_ACTIVE_UPLOAD_REGIONAL_INVENTORY } = mapActions("SatRegionalInventory", [
      "SIM_ACTIVE_UPLOAD_REGIONAL_INVENTORY"
    ]);

    // Watch toggle prop
    watch(
      () => props.propSimActivationList,
      val => {
        toggleModel.value = val;
      }
    );

    // Cancel / Close
    const emitfnshowSimActivationList = () => {
      formData.sim = null;
      formData.fileSelected = [];
      emit("emitpropSimActivationList");
    };

    // Remove uploaded file
    const removeBulkUploadFile = () => {
      formData.fileSelected = [];
    };

    // Drag & Drop hover
    const dragAndDropCustomAnimate = action => {
      uploaderHovered.value = action;
    };

    // Handle Drop
    const onDrop = e => {
      formData.fileSelected = e.dataTransfer.files;
      fileCheckSum(e.dataTransfer.files);
    };

    // Handle File Selection
    const onChange = e => {
      formData.fileSelected = e.target.files;
    };

    // File Validation
    const fileCheckSum = file => {
      const re = /(\.csv|\.xlsx|\.xls)$/i;
      if (!re.exec(file[0].name)) {
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

    // Upload Function
    const uploadSimActivation = async () => {
      if (formData.fileSelected.length === 0) {
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
        const assumeFormData = new FormData();
        assumeFormData.append("file", formData.fileSelected[0]);

        const response = await SIM_ACTIVE_UPLOAD_REGIONAL_INVENTORY({
          file: assumeFormData,
          simData: formData.sim
        });

        // Download returned file
        const contentType = response.headers["content-type"];
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

        emitfnshowSimActivationList();
      } catch (error) {

        console.error(error);
        $q.notify({
          color: "negative",
          position: "bottom",
          message: error?.body?.message || "Please Try Again Later!",
          icon: "thumb_down"
        });
      } finally {
        $q.loading.hide();
      }
    };

    return {
      toggleModel,
      formData,
      uploaderHovered,
      networkOptions,
      emitfnshowSimActivationList,
      removeBulkUploadFile,
      dragAndDropCustomAnimate,
      onDrop,
      onChange,
      uploadSimActivation
    };
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

.hide-underline {
  text-decoration: none;
}
</style>
