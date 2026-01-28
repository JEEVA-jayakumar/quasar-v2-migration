<template>
  <q-dialog v-model="opened" persistent>
    <q-card style="min-width: 30vw; padding: 25px">

      <!-- Header -->
      <q-card-section class="row items-center q-py-sm">
        <div class="text-h6">DOC Viewer</div>
        <q-space />
        <q-btn round dense flat icon="close" color="dark" @click="emitClose" />
      </q-card-section>

      <!-- Image Display -->
      <q-card-section>
        <img
          :src="`${GLOBAL_FILE_FETCH_URL}/${propRowDetails}`"
          style="max-width: 100%;"
          height="400"
        />
      </q-card-section>

      <!-- Download Button -->
      <q-card-actions align="right">
        <q-btn color="purple-9" label="Download" @click="downloadDoc" />
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { Notify, Loading } from 'quasar'

/* ============================
   Props & Emits
============================ */
const props = defineProps({
  propShowPopup: { type: Boolean, required: true },
  propRowDetails: { type: String, required: true }
})

const emit = defineEmits(['emitfnshowservice'])

/* ============================
   Store
============================ */
const store = useStore()
const GLOBAL_FILE_FETCH_URL = store.getters['GlobalVariables/GLOBAL_FILE_FETCH_URL']

/* ============================
   Reactive State
============================ */
const opened = ref(props.propShowPopup)

/* ============================
   Watch Props
============================ */
watch(() => props.propShowPopup, (newVal) => {
  opened.value = newVal
})

/* ============================
   Methods
============================ */
function emitClose() {
  emit('emitfnshowservice')
}

async function downloadDoc() {
  try {
    Loading.show({ delay: 100, spinnerColor: 'purple-9', message: 'Please wait...' })

    // Dispatch Vuex action
    const response = await store.dispatch('globalSearchSerialNumber/DOC_DOWNLOAD', props.propRowDetails)

    // Extract content-type
    const contentType = response.headers.get('content-type')
    if (!contentType) throw new Error('Content-Type header is missing')

    // Create Blob
    const blob = new Blob([response.body], { type: contentType })

    // Determine extension
    let extension = ''
    switch (contentType) {
      case 'image/jpeg':
        extension = '.jpeg'
        break
      case 'image/png':
        extension = '.png'
        break
      default:
        extension = ''
    }

    const filename = props.propRowDetails ? `${props.propRowDetails}${extension}` : `downloaded_image${extension}`
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    Loading.hide()
    Notify.create({ color: 'positive', position: 'bottom', message: 'Successfully Downloaded', icon: 'thumb_up' })

  } catch (error) {

    Loading.hide()
    Notify.create({ color: 'negative', position: 'bottom', message: 'Download failed', icon: 'error' })
    console.error(error)
  }
}
</script>

<style scoped>
/* Optional: custom styling */
</style>
