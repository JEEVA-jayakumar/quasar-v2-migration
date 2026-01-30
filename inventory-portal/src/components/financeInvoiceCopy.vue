<template>
  <q-dialog v-model="toggleModal" persistent>
    <q-card style="max-width: 63vw; padding: 13px;">
      <div class="q-pa-md">
        <!-- Header -->
        <div class="row items-center justify-between bottom-border q-py-sm">
          <div><b>PLACEHOLDER INVOICE COPY</b></div>
          <div>
            <q-btn
              round
              size="sm"
              icon="clear"
              color="dark"
              outline
              @click="emitToggleinventoryBulkUpload"
            />
          </div>
        </div>

        <!-- Drag & Drop / File Input -->
        <div class="col-md-8 q-py-md text-center">
          <div
            v-if="formData.fileSelected.length === 0"
            :class="[
              uploaderHovered ? 'toggleBulkUploadDisable' : 'toggleBulkUploadActive'
            ]"
            class="drop display-inline align-center cursor-pointer"
            @dragover.prevent="dragAndDropCustomAnimate(true)"
            @dragleave.prevent="dragAndDropCustomAnimate(false)"
            @drop="onDrop"
          >
            <label class="btn display-inline cursor-pointer">
              Drag & Drop or click here to select files
              <input
                type="file"
                @change="onChange"
                ref="deviceBulkUpload"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                multiple
              />
            </label>
          </div>

          <!-- Uploaded Files List -->
          <div v-else align="left">
            <q-card dense class="q-pa-xs">
              <q-card-title>Uploaded Files</q-card-title>
              <q-card-separator />
              <q-card-main>
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
                        @click="removeBulkUploadFile(index)"
                        flat
                      />
                    </q-item-section>
                  </q-item>
                </div>
              </q-card-main>
            </q-card>
          </div>
        </div>

        <!-- Upload Button -->
        <div class="col-md-12 group q-pt-md text-center">
          <q-btn
            push
            color="primary"
            icon="attach_file"
            label="Upload"
            class="common-btn"
            @click="sendToRepairUpload"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'

/* ---------------- Props & Emits ---------------- */
const props = defineProps({
  propOpenBulkModal: { type: Boolean, required: true }
})
const emit = defineEmits([
  'closeModel',
  'emitToggleinventoryBulkUploadOnSuccess'
])

/* ---------------- Quasar & Vuex ---------------- */
const $q = useQuasar()
const store = useStore()

/* ---------------- Reactive State ---------------- */
const toggleModal = ref(props.propOpenBulkModal)
const formData = ref({
  fileSelected: []
})
const uploaderHovered = ref(false)

/* ---------------- Methods ---------------- */
function emitToggleinventoryBulkUpload() {
  emit('closeModel')
}

function dragAndDropCustomAnimate(action) {
  uploaderHovered.value = action
}

function onDrop(e) {
  e.preventDefault()
  formData.value.fileSelected = Array.from(e.dataTransfer.files)
  fileCheckSum(formData.value.fileSelected)
  uploaderHovered.value = false
}

function onChange(e) {
  formData.value.fileSelected = Array.from(e.target.files)
  fileCheckSum(formData.value.fileSelected)
}

function fileCheckSum(files) {
  const re = /(\.csv|\.xlsx|\.xls)$/i
  for (const file of files) {
    if (!re.exec(file.name)) {
      formData.value.fileSelected = []
      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: 'File format not supported',
        icon: 'clear'
      })
      return false
    }
  }
}

function removeBulkUploadFile(index) {
  formData.value.fileSelected.splice(index, 1)
}

/* ---------------- Upload Function ---------------- */
async function sendToRepairUpload() {
  if (formData.value.fileSelected.length === 0) {
    $q.notify({
      color: 'amber-9',
      position: 'bottom',
      message: 'Please upload file',
      icon: 'warning'
    })
    return
  }

  const formDataToSend = new FormData()
  formData.value.fileSelected.forEach(file => formDataToSend.append('files[]', file))

  $q.loading.show({
    delay: 0,
    spinnerColor: 'purple-9',
    message: 'Validating...'
  })

  try {
    await store.dispatch(
      'InventoryBulkUploadDevice/FEED_SEND_TO_REPAIR_DEVICE_BULK_UPLOAD_DATA',
      { files: formDataToSend }
    )
    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Devices Successfully added!',
      icon: 'thumb_up'
    })
    emit('closeModel')
    emit('emitToggleinventoryBulkUploadOnSuccess')
    formData.value.fileSelected = []
  } catch (error) {

    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: error?.data?.message || 'Please Try Again Later!',
      icon: 'thumb_down'
    })
  } finally {
    $q.loading.hide()
  }
}
</script>

<style scoped>
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
.display-inline {
  display: inline-block;
  vertical-align: middle;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
