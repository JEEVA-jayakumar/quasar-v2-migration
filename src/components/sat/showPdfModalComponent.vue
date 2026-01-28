<template>
  <q-dialog
    v-model="toggleModal"
    persistent
    @hide="emitToggleRemarks"
  >
    <q-card
      style="min-width: 50vw; min-height: 75vh; padding: 10px"
      class="column"
    >
      <!-- Header -->
      <div class="row items-center q-py-sm bottom-border">
        <div class="col text-weight-medium">
          Document Viewer
        </div>
        <div class="col-auto">
          <q-btn
            outline
            round
            size="sm"
            color="dark"
            icon="close"
            @click="emitToggleRemarks"
          />
        </div>
      </div>

      <!-- PDF Viewer -->
      <div class="q-pt-md col">
        <vue-pdf
          v-if="pdfUrl"
          :src="pdfUrl"
          style="width: 100%; height: 100%;"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
// import { VuePdfEmbed } from 'vue-pdf-embed' // TODO: Uncomment when needed

/* -------------------------
 * Props
 * ------------------------- */
const props = defineProps({
  propToggleshowPDFModal: {
    type: Boolean,
    required: true
  },
  propPDFDetails: {
    type: String,
    required: true
  }
})

/* -------------------------
 * Emits
 * ------------------------- */
const emit = defineEmits(['togglePDFModal'])

/* -------------------------
 * Vuex
 * ------------------------- */
const store = useStore()

const GLOBAL_FILE_FETCH_URL = computed(() =>
  store.getters['GlobalVariables/GLOBAL_FILE_FETCH_URL']
)

/* -------------------------
 * Local State
 * ------------------------- */
const toggleModal = ref(props.propToggleshowPDFModal)
const itemDetail = ref(props.propPDFDetails)

/* -------------------------
 * Watchers (sync props)
 * ------------------------- */
watch(
  () => props.propToggleshowPDFModal,
  val => {
    toggleModal.value = val
  }
)

watch(
  () => props.propPDFDetails,
  val => {
    itemDetail.value = val
  }
)

/* -------------------------
 * Computed PDF URL
 * ------------------------- */
const pdfUrl = computed(() => {
  if (!itemDetail.value) return null
  return `${GLOBAL_FILE_FETCH_URL.value}/${itemDetail.value}`
})

/* -------------------------
 * Methods
 * ------------------------- */
const emitToggleRemarks = () => {
  emit('togglePDFModal')
}
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>


