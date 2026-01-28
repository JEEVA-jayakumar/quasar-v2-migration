<template>
  <q-dialog
    v-model="internalDialog"
    persistent
    @hide="emitToggleRemarks"
  >
    <q-card style="min-width: 50vw; min-height: 75vh; padding: 10px">
      
      <!-- Header -->
      <q-card-section class="row items-center q-py-sm border-b">
        <div class="col text-h6">Document Viewer</div>
        <div class="col text-right">
          <q-btn outline round size="sm" color="dark" icon="clear" @click="emitToggleRemarks" />
        </div>
      </q-card-section>

      <!-- PDF Viewer -->
      <q-card-section>
        <vue-pdfjs
          :url="fileUrl"
          :type="0"
          :height="'400px'"
          style="max-width: 100%"
        />
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useStore } from 'vuex'
// import { VuePdfEmbed } from 'vue-pdf-embed' // TODO: Uncomment when needed

/* ---------------- PROPS & EMITS ---------------- */
const props = defineProps({
  propToggleshowPDFModal: { type: Boolean, required: true },
  propPDFDetails: { type: String, required: true }
})

const emit = defineEmits(['togglePDFModal'])

/* ---------------- STORE ---------------- */
const store = useStore()
const GLOBAL_FILE_FETCH_URL = computed(() => store.getters['GlobalVariables/GLOBAL_FILE_FETCH_URL'])

/* ---------------- LOCAL STATE ---------------- */
const internalDialog = ref(props.propToggleshowPDFModal)
const itemDetails = ref(props.propPDFDetails)

/* Sync props changes */
watch(() => props.propToggleshowPDFModal, val => internalDialog.value = val)
watch(() => props.propPDFDetails, val => itemDetails.value = val)

/* PDF File URL */
const fileUrl = computed(() => `${GLOBAL_FILE_FETCH_URL.value}/${itemDetails.value}`)

/* ---------------- METHODS ---------------- */
const emitToggleRemarks = () => {
  emit('togglePDFModal')
}
</script>

<style scoped>
.border-b {
  border-bottom: 1px solid #e0e0e0;
}
.no-underline {
  text-decoration: none;
}
</style>


