<template>
  <q-page>
    <q-dialog
      v-model="toggleModel"
      persistent
      minimized
      no-backdrop-dismiss
      class="customModalOverlay"
      :maximized="false"
    >
      <q-card :style="{ padding: '10px', minWidth: '63vw' }">

        <q-card-section>
          <q-card style="width:250%">
            <q-card-section>
              <q-list no-border>

                <!-- Device Purchase Cost -->
                <div class="col-md-12">
                  <q-input
                    type="textarea"
                    v-model="formData.devicePurchaseCost"
                    label="Device Purchase Cost"
                    placeholder="Device Purchase Cost"
                    outlined
                    color="grey-9"
                    @blur="$v.formData.devicePurchaseCost.$touch"
                    :error="$v.formData.devicePurchaseCost.$error"
                    class="q-my-md"
                  />
                </div>

                <!-- Device Life -->
                <div class="col-md-12">
                  <q-input
                    type="textarea"
                    v-model="formData.deviceLife"
                    label="Total Life of Device in Days"
                    placeholder="Total Life of Device in Days"
                    outlined
                    color="grey-9"
                    @blur="$v.formData.deviceLife.$touch"
                    :error="$v.formData.deviceLife.$error"
                    class="q-my-md"
                  />
                </div>

                <!-- Invoice Numbers -->
                <div class="col-md-12">
                  <q-input
                    type="textarea"
                    v-model="formData.invoiceNumbers"
                    label="Invoice Number"
                    placeholder="Invoice Number"
                    outlined
                    color="grey-9"
                    @blur="$v.formData.invoiceNumbers.$touch"
                    :error="$v.formData.invoiceNumbers.$error"
                    class="q-my-md"
                  />
                </div>

                <!-- Placeholder Invoice Copy -->
                <div class="col">
                  <b>Placeholder Invoice Copy</b>
                </div>

                <!-- File Upload -->
                <div class="col-md-3 q-py-md" align="center">
                  <div
                    v-if="formData.fileSelected.length === 0"
                    :class="uploaderHovered ? 'toggleBulkUploadDisable' : 'toggleBulkUploadActive'"
                    class="drop display-inline align-center cursor-pointer"
                    @dragover.prevent="dragAndDropCustomAnimate(true)"
                    @dragleave.prevent="dragAndDropCustomAnimate(false)"
                    @drop.prevent="onDrop"
                  >
                    <q-card class="q-pa-xs bg-green-3">
                      <label class="btn display-inline cursor-pointer">
                        Drag & Drop or click here to select files
                        <input
                          type="file"
                          ref="deviceBulkUpload"
                          multiple
                          accept=".csv, .xlsx, .xls, .pdf, .png, .jpg, .jpeg"
                          @change="onChange"
                        />
                      </label>
                    </q-card>
                  </div>

                  <!-- Uploaded Files List -->
                  <div v-else align="left">
                    <q-card dense class="q-pa-xs">
                      <q-card-section class="q-pa-xs bg-green-3">
                        Uploaded Files
                      </q-card-section>
                      <q-separator />
                      <q-card-section>
                        <div v-for="(file, index) in formData.fileSelected" :key="index">
                          <q-item dense>
                            <q-item-section avatar>
                              <q-icon name="attach_file" />
                            </q-item-section>
                            <q-item-section>{{ file.name }}</q-item-section>
                            <q-item-section side>
                              <q-btn
                                size="sm"
                                color="negative"
                                icon="clear"
                                label="Remove"
                                @click="removeUploadedFiles(index)"
                              />
                            </q-item-section>
                          </q-item>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>

              </q-list>
            </q-card-section>

            <!-- Action Buttons -->
            <q-card-actions align="end">
              <q-btn
                flat
                label="Cancel"
                color="negative"
                @click="emitfnshowPosInventory"
              />
              <q-btn
                label="Submit"
                color="purple-9"
                @click="PosFinanceSubmit"
              />
            </q-card-actions>

          </q-card>
        </q-card-section>

      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

export default {
  name: "PosFinanceModal",
  props: {
    propShowPosInventory: { type: Boolean, required: true },
    propRowDetails: { type: Object, required: true },
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const store = useStore();

    const toggleModel = ref(props.propShowPosInventory);

    const formData = reactive({
      id: props.propRowDetails.id,
      devicePurchaseCost: "",
      deviceLife: "1460",
      invoiceNumbers: "",
      fileSelected: []
    });

    const uploaderHovered = ref(false);

    // Vuelidate rules
    const rules = {
      formData: {
        devicePurchaseCost: { required },
        deviceLife: { required },
        invoiceNumbers: { required }
      }
    };
    const $v = useVuelidate(rules, { formData });

    // Load Invoice Number from API
    const getInvoiceNumber = async () => {
      try {
        const response = await store.dispatch("VerifyDevice/GET_INVOICE_NUMBER_FROM_INVENTORY", props.propRowDetails.id);
        formData.invoiceNumbers = response.body?.InvoiceNumber || "";
      } catch {
        $q.notify({
          color: "primary",
          position: "bottom",
          message: "Invoice not found",
          icon: "info"
        });
      }
    };

    onMounted(() => {
      getInvoiceNumber();
    });

    // Drag hover effect
    const dragAndDropCustomAnimate = (action) => {
      uploaderHovered.value = action;
    };

    // Drop file
    const onDrop = (event) => {
      formData.fileSelected = Array.from(event.dataTransfer.files);
      fileCheckSum(formData.fileSelected);
    };

    // File validation
    const fileCheckSum = (files) => {
      const re = /(\.csv|\.xlsx|\.xls|\.pdf|\.png|\.jpg|\.jpeg)$/i;
      if (!re.exec(files[0].name)) {
        formData.fileSelected = [];
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "File format not supported",
          icon: "clear"
        });
      }
    };

    // File select via input
    const onChange = (event) => {
      formData.fileSelected = Array.from(event.target.files);
    };

    const removeUploadedFiles = (index) => {
      formData.fileSelected.splice(index, 1);
    };

    // Submit form
    const PosFinanceSubmit = async () => {
      $v.value.$touch();
      if ($v.value.$error || formData.fileSelected.length === 0) {
        $q.notify({
          color: "amber-9",
          position: "bottom",
          message: "Please fill all mandatory fields",
          icon: "warning"
        });
        return;
      }

      const formPayload = new FormData();
      formData.fileSelected.forEach(file => formPayload.append("file", file));

      const payload = {
        file: formPayload,
        id: formData.id,
        devicePurchaseCost: formData.devicePurchaseCost,
        deviceLife: formData.deviceLife,
        invoiceNumbers: formData.invoiceNumbers
      };

      try {
        $q.loading.show({ spinnerColor: "purple-9", message: "Validating ..." });
        await store.dispatch("posInventoryFinance/FETCH_POS_FINANCE_SUBMIT", payload);
        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Devices Successfully added!",
          icon: "thumb_up"
        });
        emit("emitfnshowPosInventory");
        formData.fileSelected = [];
      } catch (error) {

        $q.notify({
          color: "negative",
          position: "bottom",
          message: error.data?.message || "Something went wrong",
          icon: "thumb_down"
        });
      } finally {
        $q.loading.hide();
      }
    };

    const emitfnshowPosInventory = () => emit("emitfnshowPosInventory");

    return {
      toggleModel,
      formData,
      uploaderHovered,
      dragAndDropCustomAnimate,
      onDrop,
      onChange,
      removeUploadedFiles,
      PosFinanceSubmit,
      emitfnshowPosInventory,
      $v
    };
  }
};
</script>

<style scoped>
.drop {
  padding: 10px;
}
.toggleBulkUploadActive {
  border: 2px dashed #00c853;
}
.toggleBulkUploadDisable {
  border: 2px dashed #ccc;
}
</style>
