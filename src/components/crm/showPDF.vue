<template>
  <q-dialog v-model="opened" persistent :maximized="false">
    <q-card style="min-width: 50vw; min-height: 75vh; padding: 10px">

      <!-- Header -->
      <q-card-section class="row items-center q-py-sm bottom-border">
        <div class="text-h6">Document Viewer</div>
        <q-space />
        <q-btn
          round
          dense
          flat
          icon="close"
          color="dark"
          @click="emitClose"
        />
      </q-card-section>

      <!-- PDF Viewer -->
      <q-card-section>
        <vuePdfjs
          :url="`${GLOBAL_FILE_FETCH_URL}/${itemDetail}`"
          :type="0"
          :height="'400px'"
          style="max-width: 100%"
        />
      </q-card-section>

      <!-- Download Button -->
      <q-card-actions align="right">
        <q-btn color="purple-9" label="Download" @click="downloadFile" />
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { Loading, Notify } from 'quasar'
import vuePdfjs from 'vue-pdfjs'

/* ============================
   Props & Emits
============================ */
const props = defineProps({
  propToggleshowPDFModal: { type: Boolean, required: true },
  propPDFDetails: { type: String, required: true }
})
const emit = defineEmits(['togglePDFModal'])

/* ============================
   Store
============================ */
const store = useStore()
const GLOBAL_FILE_FETCH_URL = store.getters['GlobalVariables/GLOBAL_FILE_FETCH_URL']

/* ============================
   Reactive State
============================ */
const opened = ref(props.propToggleshowPDFModal)
const itemDetail = ref(props.propPDFDetails)

/* ============================
   Watch Props
============================ */
watch(() => props.propToggleshowPDFModal, (val) => {
  opened.value = val
})
watch(() => props.propPDFDetails, (val) => {
  itemDetail.value = val
})

/* ============================
   Methods
============================ */
function emitClose() {
  emit('togglePDFModal')
}

async function downloadFile() {
  try {
    Loading.show({ delay: 100, spinnerColor: 'purple-9', message: 'Please wait...' })

    const response = await store.dispatch('globalSearchSerialNumber/DOC_DOWNLOAD', itemDetail.value)

    // Content type detection
    const contentType = response.headers['content-type'] || response.headers.map?.['content-type']?.[0]
    if (!contentType) throw new Error('Content-Type header missing')

    const blob = new Blob([response.data], { type: contentType })

    let extension = ''
    if (contentType.includes('application/pdf')) extension = '.pdf'
    else if (contentType.includes('image/jpeg')) extension = '.jpg'
    else if (contentType.includes('image/png')) extension = '.png'

    const filename = itemDetail.value ? `${itemDetail.value}` : `downloaded_file${extension}`

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
    console.error(error)
    Notify.create({ color: 'negative', position: 'bottom', message: 'Download failed', icon: 'error' })
  }
}
</script>

<style scoped>
/* optional custom styles */
</style>
