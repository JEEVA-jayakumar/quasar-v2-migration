<template>
  <div>
    <q-dialog
      v-model="toggleModal"
      persistent
      no-backdrop-dismiss
      transition-show="slide"
      transition-hide="slide"
    >
      <q-card class="customModalOverlay" style="min-width:50%; max-height:50vh; margin:20px; padding:20px">

        <!-- Header -->
        <q-card-section class="q-title q-py-sm bottom-border">
          Upload Bank List
        </q-card-section>

        <!-- File Upload Section -->
        <q-card-section>
          <div v-if="!uploadFileBoolean" class="group">
            <label
              class="cursor-pointer"
              :class="attachedFileName ? 'bg-light-blue text-white' : 'bg-grey-7 text-white'"
            >
              <q-icon name="attach_file" /> {{ attachedFileName ? 'Modify' : 'Attach' }}
              <input
                type="file"
                ref="file"
                accept=".xlsx"
                @change="fnGetUploadFileDetails"
              />
            </label>

            <div v-if="attachedFileName" class="q-mt-md">
              <span class="text-faded">Attached File:</span> {{ attachedFileName }}
            </div>
          </div>

          <div v-else>
            <q-btn
              dense
              outline
              color="grey-7"
              size="sm"
              class="file-return text-faded no-pointer-events"
              :label="uploadFileName"
            />
          </div>
        </q-card-section>

        <!-- Action Buttons -->
        <q-card-section class="row justify-end q-py-sm">
          <q-btn
            v-if="sendForDataEntry"
            label="Submit"
            color="positive"
            icon="done"
            @click="finalFileUploadAndSubmit"
          />
          <q-btn
            v-if="sendForDataEntry"
            label="Cancel"
            color="negative"
            icon="close"
            @click="emitModalClose"
            class="q-ml-sm"
          />
        </q-card-section>

      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from "vue"
import { useStore } from "vuex"
import { useQuasar } from "quasar"

// ---------------- Props & Emits ----------------
const props = defineProps({
  propShowUploadFile: { type: Boolean, default: false }
})
const emit = defineEmits(["emitfnshowUploadFile"])

// ---------------- Quasar & Store ----------------
const $q = useQuasar()
const store = useStore()
const UPLOAD_BANKLIST_FILE = (payload) => store.dispatch("BankListUploadFile/UPLOAD_BANKLIST_FILE", payload)

// ---------------- Reactive State ----------------
const toggleModal = ref(props.propShowUploadFile)
watch(() => props.propShowUploadFile, val => toggleModal.value = val)

const attachedFileName = ref("")
const uploadFileBoolean = ref(false)
const sendForDataEntry = ref(false)
const uploadFileName = ref("")

const fileRef = ref(null)

// ---------------- Methods ----------------
const emitModalClose = () => emit("emitfnshowUploadFile")

const fnGetUploadFileDetails = () => {
  const files = fileRef.value?.files
  if (files?.length > 0) {
    attachedFileName.value = files[0].name
    sendForDataEntry.value = true
  } else {
    attachedFileName.value = ""
    sendForDataEntry.value = false
  }
}

const finalFileUploadAndSubmit = async () => {
  const files = fileRef.value?.files
  if (!files || files.length === 0) return

  const formData = new FormData()
  formData.append("file", files[0])

  $q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Processing ..." })

  try {
    await UPLOAD_BANKLIST_FILE(formData)
    $q.notify({ color: "positive", position: "bottom", message: "Successfully uploaded", icon: "thumb_up" })
    emitModalClose()
    // Clear file input
    fileRef.value.value = ""
    attachedFileName.value = ""
    sendForDataEntry.value = false
  } catch (error) {

    $q.notify({
      color: "negative",
      position: "bottom",
      message: error?.data?.message || "Upload failed. Please try again!",
      icon: "thumb_down"
    })
    fileRef.value.value = ""
  } finally {
    $q.loading.hide()
  }
}
</script>

<style scoped>
.customModalOverlay {
  border-radius: 8px;
}

label {
  padding: 10px;
  display: inline-block;
}

input[type="file"] {
  display: none;
}
</style>
