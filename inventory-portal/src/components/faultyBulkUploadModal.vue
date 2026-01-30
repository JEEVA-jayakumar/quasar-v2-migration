<template>
  <q-dialog v-model="toggleModal" persistent>
    <q-card style="min-width: 40vw; padding: 30px;">
      <!-- Title -->
      <q-card-section class="q-pb-md text-center">
        <div class="text-h6 text-grey-9">Bijlipay Faulty Devices - Bulk Upload</div>
      </q-card-section>

      <!-- Device Type Select -->
      <q-card-section class="column q-pt-none">
        <q-select
          v-model="formData.deviceType"
          :options="rawDevicesTypes"
          outlined
          label="Select Device Type"
          :error="v$.formData.deviceType.$invalid && v$.formData.deviceType.$dirty"
          @blur="v$.formData.deviceType.$touch()"
          class="q-mb-md"
        />

        <!-- Template Download Link -->
        <div class="q-mb-md">
          <a href="statics/files/faultDeviceUploadTemplate.xlsx" class="hide-underline">
            Click here to download the template
          </a>
        </div>

        <!-- File Upload Drop Zone -->
        <div
          v-if="!formData.fileSelected.length"
          :class="uploaderHovered ? 'toggleBulkUploadDisable' : 'toggleBulkUploadActive'"
          class="drop display-inline align-center cursor-pointer"
          @dragover.prevent="uploaderHovered = true"
          @dragleave.prevent="uploaderHovered = false"
          @drop.prevent="onDrop"
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

        <!-- Uploaded File Preview -->
        <div v-else>
          <q-card dense class="q-pa-xs q-mt-md">
            <q-card-section>
              <div class="text-subtitle2">Uploaded File</div>
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
                icon="clear"
                label="Remove"
                @click="removeBulkUploadFile"
              />
            </q-card-actions>
          </q-card>
        </div>
      </q-card-section>

      <!-- Actions -->
      <q-card-actions align="right">
        <q-btn outline color="dark" label="Cancel" @click="emitToggleinventoryBulkUpload" />
        <q-btn color="positive" label="Upload" @click="uploadFileForBulkUpload" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'

/* ---------------- Props & Emits ---------------- */
const props = defineProps({
  propBulkUpload: { type: Boolean, required: true },
  propAllDevicestypes: { type: Array, required: true }
})
const emit = defineEmits(['closeModel'])

/* ---------------- Quasar & Vuex ---------------- */
const $q = useQuasar()
const store = useStore()

/* ---------------- State ---------------- */
const toggleModal = ref(props.propBulkUpload)
const rawDevicesTypes = ref(props.propAllDevicestypes)
const uploaderHovered = ref(false)
const formData = ref({
  deviceType: '',
  fileSelected: []
})

/* ---------------- Watch Props ---------------- */
watch(() => props.propBulkUpload, val => toggleModal.value = val)

/* ---------------- Vuelidate ---------------- */
const rules = {
  formData: {
    deviceType: { required }
  }
}
const v$ = useVuelidate(rules, { formData })

/* ---------------- Methods ---------------- */
function emitToggleinventoryBulkUpload() {
  emit('closeModel')
}

function removeBulkUploadFile() {
  formData.value.fileSelected = []
}

function onChange(event) {
  formData.value.fileSelected = event.target.files
  fileCheckSum(event.target.files)
}

function onDrop(event) {
  formData.value.fileSelected = event.dataTransfer.files
  uploaderHovered.value = false
  fileCheckSum(event.dataTransfer.files)
}

function fileCheckSum(files) {
  const re = /(\.csv|\.xlsx|\.xls)$/i
  if (!re.exec(files[0].name)) {
    formData.value.fileSelected = []
    $q.notify({ color: 'negative', position: 'bottom', message: 'File format not supported', icon: 'clear' })
    return false
  }
}

async function uploadFileForBulkUpload() {
  v$.value.$touch()
  if (v$.value.$invalid) {
    $q.notify({ color: 'amber-9', position: 'bottom', message: 'Please select a device', icon: 'warning' })
    return
  }

  if (!formData.value.fileSelected.length) {
    $q.notify({ color: 'amber-9', position: 'bottom', message: 'Please upload file', icon: 'warning' })
    return
  }

  const fileFormData = new FormData()
  fileFormData.append('file', formData.value.fileSelected[0])

  const payload = {
    file: fileFormData,
    device: formData.value.deviceType.id || formData.value.deviceType,
    action: 2
  }

  try {
    await store.dispatch('InventoryCentral/FEED_FAULTY_BULK_UPLOAD_FINAL_SUBMIT', payload)
    $q.notify({ color: 'positive', position: 'bottom', message: 'Devices Successfully added!', icon: 'thumb_up' })
    emit('closeModel')
  } catch (error) {

    $q.notify({ color: 'negative', position: 'bottom', message: error?.body?.message || 'Please Try Again Later!', icon: 'thumb_down' })
  }
}
</script>

<style scoped>
* {
  font-family: Arial;
  font-size: 12px;
}

input[type='file'] {
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
  width: 100%;
  max-width: 600px;
  max-height: 400px;
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
</style>
