<template>
  <div>
    <q-dialog
      v-model="toggleModal"
      persistent
      :max-width="'600px'"
      @hide="emitToggleinventoryBulkUpload"
      @escape-key="emitToggleinventoryBulkUpload"
      class="q-pa-md"
    >
      <div class="column text-center justify-center">
        <!-- Title -->
        <div class="col-md-12 q-py-sm bottom-border">
          <div class="q-title text-grey-9">
            Aggregator Faulty Devices - Bulk Upload
          </div>
        </div>

        <!-- Device Type Select -->
        <div class="col-md-8 q-py-md" align="left">
          <q-select
            v-model="formData.deviceType"
            :options="rawDevicesTypes"
            float-label="Select Device Type"
            radio
            color="grey-9"
            @blur="v$.value.formData.deviceType.$touch()"
            :error="v$.value.formData.deviceType.$error"
          />
        </div>

        <!-- Download Template -->
        <div class="col-md-8" align="left">
          <a href="statics/files/faultDeviceUploadTemplate.xlsx" class="hide-underline">
            Click here to download the template
          </a>
        </div>

        <!-- File Upload -->
        <div class="col-md-8 q-py-md" align="center">
          <div
            v-if="formData.fileSelected.length === 0"
            :class="uploaderHovered ? 'toggleBulkUploadDisable' : 'toggleBulkUploadActive'"
            class="drop display-inline align-center cursor-pointer"
          >
            <label class="btn display-inline cursor-pointer">
              Click here to upload file
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
                <div class="text-weight-bold">Uploaded File</div>
                <div>{{ formData.fileSelected[0].name || '' }}</div>
              </q-card-section>
              <q-card-actions align="end">
                <q-btn
                  outline
                  size="sm"
                  color="negative"
                  icon="clear"
                  label="Remove"
                  @click="removeBulkUploadFile"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>

        <!-- Buttons -->
        <div class="col-md-12 row justify-end q-gutter-sm">
          <q-btn outline color="dark" label="Cancel" @click="emitToggleinventoryBulkUpload" />
          <q-btn color="positive" label="Upload" @click="uploadFileForBulkUpload" />
        </div>
      </div>
    </q-dialog>
  </div>
</template>

<script>
import { reactive, ref, watch } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useStore } from "vuex";

export default {
  name: "AggregatorFaultyBulkUploadModal",
  props: {
    propBulkUpload: { type: Boolean, default: false },
    propAllDevicestypes: { type: Array, default: () => [] },
  },
  emits: ["closeModel"],
  setup(props, { emit }) {
    const store = useStore();

    // Modal toggle
    const toggleModal = ref(props.propBulkUpload);
    watch(() => props.propBulkUpload, (val) => (toggleModal.value = val));

    // File uploader state
    const uploaderHovered = ref(false);

    // Form data
    const formData = reactive({
      deviceType: "",
      fileSelected: []
    });

    // Device types options
    const rawDevicesTypes = ref(props.propAllDevicestypes);

    // Vuelidate setup
    const rules = {
      formData: { deviceType: { required } }
    };
    const v$ = useVuelidate(rules, { formData });

    // Emit cancel
    const emitToggleinventoryBulkUpload = () => emit("closeModel");

    // Remove uploaded file
    const removeBulkUploadFile = () => {
      formData.fileSelected = [];
    };

    // File change
    const onChange = (e) => {
      formData.fileSelected = Array.from(e.target.files);
      fileCheckSum(formData.fileSelected);
    };

    // Validate file type
    const fileCheckSum = (files) => {
      const re = /(\.csv|\.xlsx|\.xls)$/i;
      if (!re.exec(files[0].name)) {
        formData.fileSelected = [];
        window.$q.notify({
          color: "negative",
          position: "bottom",
          message: "File format not supported",
          icon: "clear"
        });
      }
    };

    // Upload function
    const uploadFileForBulkUpload = () => {
      v$.value.$touch();
      if (v$.value.$error) {
        window.$q.notify({
          color: "amber-9",
          position: "bottom",
          message: "Please select a device",
          icon: "warning"
        });
        return;
      }

      if (formData.fileSelected.length === 0) {
        window.$q.notify({
          color: "amber-9",
          position: "bottom",
          message: "Please upload file",
          icon: "warning"
        });
        return;
      }

      const assumeFormData = new FormData();
      assumeFormData.append("file", formData.fileSelected[0]);

      const payload = {
        file: assumeFormData,
        device: formData.deviceType.id || formData.deviceType,
        action: 2
      };

      store.dispatch("AggregatorInventoryCentral/FEED_AGGREGATOR_FAULTY_BULK_UPLOAD_FINAL_SUBMIT", payload)
        .then(() => {
          window.$q.notify({
            color: "positive",
            position: "bottom",
            message: "Devices Successfully added!",
            icon: "thumb_up"
          });
          emitToggleinventoryBulkUpload();
        })
        .catch((error) => {
          window.$q.notify({
            color: "negative",
            position: "bottom",
            message: error.body?.message || "Please Try Again Later !",
            icon: "thumb_down"
          });
        });
    };

    return {
      toggleModal,
      formData,
      rawDevicesTypes,
      uploaderHovered,
      v$,
      emitToggleinventoryBulkUpload,
      removeBulkUploadFile,
      onChange,
      uploadFileForBulkUpload
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
