<template>
  <q-page class="q-pa-md">
    <q-tabs
      v-model="activeTab"
      class="shadow-1"
      color="grey-1"
      @update:model-value="goToCompleteTab"
      dense
      stretch
    >
      <q-tab name="tab-1" label="Create Bulk Ticket" />
      <q-tab name="tab-2" label="Close Bulk Ticket" />
    </q-tabs>

    <!-- Tab 1: Create Bulk Ticket -->
    <q-tab-panels v-model="activeTab" animated>
      <q-tab-panel name="tab-1">
        <div class="q-pa-md">
          <div class="row text-center justify-center">
            <div class="col-md-12 q-py-sm bottom-border custom-background">
              <div class="q-title text-grey-9">Ticket Creation - Bulk Upload</div>
            </div>

            <div class="col-md-8 q-py-md">
              <a href="statics/files/Create_Ticket.xlsx" class="hide-underline">
                Click here to download the template
              </a>
            </div>

            <!-- File Upload -->
            <div class="col-md-8 q-py-md" align="center">
              <div
                v-if="formData.fileSelected.length === 0"
                :class="uploaderHovered0 ? 'toggleBulkUploadDisable' : 'toggleBulkUploadActive'"
                class="drop display-inline align-center cursor-pointer"
                @dragover.prevent="dragAndDropCustomAnimate(true, 0)"
                @dragleave.prevent="dragAndDropCustomAnimate(false, 0)"
                @drop.prevent="onDrop($event, 0)"
              >
                <label class="btn display-inline cursor-pointer">
                  Drag & Drop or click here to open a file
                  <input
                    type="file"
                    @change="onChange($event, 0)"
                    ref="deviceBulkUpload0"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  />
                </label>
              </div>

              <div v-else align="left">
                <q-card dense class="q-pa-xs">
                  <q-card-section>
                    <div class="text-bold">Uploaded File</div>
                  </q-card-section>
                  <q-separator />
                  <q-card-section>
                    <q-item dense>
                      <q-item-section avatar>
                        <q-icon name="attach_file" />
                      </q-item-section>
                      <q-item-section>{{ formData.fileSelected[0].name }}</q-item-section>
                      <q-item-section side></q-item-section>
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
                      @click="removeBulkUploadFile(formData)"
                    />
                  </q-card-actions>
                </q-card>
              </div>
            </div>

            <div class="col-md-12 group" align="center">
              <q-btn
                color="purple-9"
                :disabled="formData.fileSelected.length === 0"
                label="Upload"
                @click="uploadlist"
              />
            </div>
          </div>
        </div>
      </q-tab-panel>

      <!-- Tab 2: Close Bulk Ticket -->
      <q-tab-panel name="tab-2">
        <div class="q-pa-md">
          <div class="row text-center justify-center">
            <div class="col-md-12 q-py-sm bottom-border custom-background">
              <div class="q-title text-grey-9">Ticket Closing - Bulk Upload</div>
            </div>

            <div class="col-md-8 q-py-md">
              <a href="statics/files/close_Ticket.xlsx" class="hide-underline">
                Click here to download the template
              </a>
            </div>

            <!-- File Upload -->
            <div class="col-md-8 q-py-md" align="center">
              <div
                v-if="formData1.fileSelected.length === 0"
                :class="uploaderHovered1 ? 'toggleBulkUploadDisable' : 'toggleBulkUploadActive'"
                class="drop display-inline align-center cursor-pointer"
                @dragover.prevent="dragAndDropCustomAnimate(true, 1)"
                @dragleave.prevent="dragAndDropCustomAnimate(false, 1)"
                @drop.prevent="onDrop($event, 1)"
              >
                <label class="btn display-inline cursor-pointer">
                  Drag & Drop or click here to open a file
                  <input
                    type="file"
                    @change="onChange($event, 1)"
                    ref="deviceBulkUpload1"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  />
                </label>
              </div>

              <div v-else align="left">
                <q-card dense class="q-pa-xs">
                  <q-card-section>
                    <div class="text-bold">Uploaded File</div>
                  </q-card-section>
                  <q-separator />
                  <q-card-section>
                    <q-item dense>
                      <q-item-section avatar>
                        <q-icon name="attach_file" />
                      </q-item-section>
                      <q-item-section>{{ formData1.fileSelected[0].name }}</q-item-section>
                      <q-item-section side></q-item-section>
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
                      @click="removeBulkUploadFile(formData1)"
                    />
                  </q-card-actions>
                </q-card>
              </div>
            </div>

            <div class="col-md-12 group" align="center">
              <q-btn
                color="purple-9"
                :disabled="formData1.fileSelected.length === 0"
                label="Upload"
                @click="uploadlist1"
              />
            </div>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Loading Overlay -->
    <q-dialog v-model="showLoadingDialog" persistent>
      <q-spinner-bars color="#61116a" size="35" />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

const $q = useQuasar();
const store = useStore();

const activeTab = ref("tab-1");

const formData = ref({ fileSelected: [] });
const formData1 = ref({ fileSelected: [] });

const toggleAjaxLoadFilter = ref(false);
const toggleAjaxLoadFilter1 = ref(false);

const uploaderHovered0 = ref(false);
const uploaderHovered1 = ref(false);

// Computed property for loading dialog
const showLoadingDialog = computed({
  get: () => toggleAjaxLoadFilter.value || toggleAjaxLoadFilter1.value,
  set: (value) => {
    // When dialog tries to close (e.g., user clicks outside), only close if both are false
    if (!value) {
      toggleAjaxLoadFilter.value = false;
      toggleAjaxLoadFilter1.value = false;
    }
  }
});

// Vuex actions
const TICKET_CREATION_BULK_UPLOAD = (payload) =>
  store.dispatch("SatRegionalInventory/TICKET_CREATION_BULK_UPLOAD", payload);
const TICKET_CLOSE_BULK_UPLOAD = (payload) =>
  store.dispatch("SatRegionalInventory/TICKET_CLOSE_BULK_UPLOAD", payload);

// Remove selected file
const removeBulkUploadFile = (form) => {
  form.fileSelected = [];
};

// Drag hover animation
const dragAndDropCustomAnimate = (action, target) => {
  target === 0 ? (uploaderHovered0.value = action) : (uploaderHovered1.value = action);
};

// Handle file drop
const onDrop = (event, target) => {
  const files = event.dataTransfer.files;
  if (target === 0) formData.value.fileSelected = Array.from(files);
  else formData1.value.fileSelected = Array.from(files);
};

// Handle input change
const onChange = (event, target) => {
  const files = event.target.files;
  if (target === 0) formData.value.fileSelected = Array.from(files);
  else formData1.value.fileSelected = Array.from(files);
};

// Switch tabs and clear files
const goToCompleteTab = (tab) => {
  activeTab.value = tab;
  if (activeTab.value === "tab-1") formData1.value.fileSelected = [];
  else formData.value.fileSelected = [];
};

// Upload Create Tickets
const uploadlist = async () => {
  if (!formData.value.fileSelected.length) return;
  toggleAjaxLoadFilter.value = true;

  const fd = new FormData();
  fd.append("file", formData.value.fileSelected[0]);

  try {
    const response = await TICKET_CREATION_BULK_UPLOAD({ file: fd });
    const contentType = response.headers["content-type"];
    const blob = new Blob([response.data], { type: contentType });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "Updated_Tickets.xlsx";
    link.click();
    $q.notify({ color: "positive", position: "bottom", message: "Successfully Created!", icon: "thumb_up" });
    formData.value.fileSelected = [];
  } catch (error) {

    handleErrorNotify(error);
  } finally {
    toggleAjaxLoadFilter.value = false;
  }
};

// Upload Close Tickets
const uploadlist1 = async () => {
  if (!formData1.value.fileSelected.length) return;
  toggleAjaxLoadFilter1.value = true;

  const fd = new FormData();
  fd.append("file", formData1.value.fileSelected[0]);

  try {
    const response = await TICKET_CLOSE_BULK_UPLOAD({ file: fd });
    const contentType = response.headers["content-type"];
    const blob = new Blob([response.data], { type: contentType });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "Updated_Closing_Tickets.xlsx";
    link.click();
    $q.notify({ color: "positive", position: "bottom", message: "Successfully Closed!", icon: "thumb_up" });
    formData1.value.fileSelected = [];
  } catch (error) {

    handleErrorNotify(error);
  } finally {
    toggleAjaxLoadFilter1.value = false;
  }
};

// Centralized error notifications
const handleErrorNotify = (error) => {
  const msg = error?.body?.message || "Please Try Again Later!";
  $q.notify({ color: "negative", position: "bottom", message: msg, icon: "thumb_down" });
};
</script>

<style scoped>
* {
  font-family: Arial;
  font-size: 12px;
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
  max-width: 600px;
  max-height: 400px;
  width: 100%;
  height: 100%;
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

.custom-background {
  background-color: purple;
  color: white;
}

.bottom-border {
  border-bottom: 1px solid #ccc;
}
</style>