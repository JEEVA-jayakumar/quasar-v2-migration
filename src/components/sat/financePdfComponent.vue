<template>
  <q-dialog
    v-model="toggleModal"
    persistent
    @hide="emitToggleRemarks"
  >
    <q-card style="min-width: 50vw; min-height: 75vh;">
      <!-- Header -->
      <q-card-section class="row items-center bottom-border">
        <div class="col text-weight-medium">
          Document Viewer
        </div>
        <div class="col-auto">
          <q-btn
            round
            dense
            outline
            icon="close"
            color="dark"
            @click="emitToggleRemarks"
          />
        </div>
      </q-card-section>

      <!-- Content -->
      <q-card-section class="q-pa-sm">
        <!-- Image Viewer -->
        <div v-if="isImage" class="image-container">
          <img
            :src="pictureOfImageSource"
            alt="Invoice Image"
            style="max-width: 100%; height: 400px;"
            @click="showZoom = true"
          />

          <!-- Zoom Dialog -->
          <q-dialog v-model="showZoom" persistent>
            <q-card class="q-pa-md" style="max-width: 90vw; max-height: 90vh;">
              <q-img
                :src="pictureOfImageSource"
                style="max-width: 100%; max-height: 100%;"
              />
            </q-card>
          </q-dialog>
        </div>

        <!-- PDF Viewer -->
        <div v-else class="full-width">
          <vue-pdfjs
            :url="`${GLOBAL_FILE_FETCH_URL}/${itemDetail.invoiceName}`"
            :type="0"
            height="400px"
            style="max-width: 100%;"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
// import { VuePdfEmbed } from 'vue-pdf-embed' // TODO: Uncomment when needed

/* ---------------- PROPS ---------------- */
const props = defineProps({
  propToggleshowPDFModalFinance: {
    type: Boolean,
    required: true
  },
  propPDFDetailsFinance: {
    type: Object,
    required: true
  }
})

/* ---------------- EMITS ---------------- */
const emit = defineEmits(['togglePDFModal'])

/* ---------------- STORE ---------------- */
const store = useStore()

const GLOBAL_FILE_FETCH_URL = computed(
  () => store.getters['GlobalVariables/GLOBAL_FILE_FETCH_URL']
)

/* ---------------- STATE ---------------- */
const toggleModal = ref(props.propToggleshowPDFModalFinance)
const itemDetail = ref(props.propPDFDetailsFinance)
const showZoom = ref(false)

/* ---------------- WATCHERS ---------------- */
watch(
  () => props.propToggleshowPDFModalFinance,
  val => (toggleModal.value = val)
)

watch(
  () => props.propPDFDetailsFinance,
  val => (itemDetail.value = val)
)

/* ---------------- COMPUTED ---------------- */
const isImage = computed(() => {
  return (
    itemDetail.value?.invoiceMimeType &&
    itemDetail.value.invoiceMimeType.includes('image')
  )
})

const pictureOfImageSource = computed(() => {
  return `${GLOBAL_FILE_FETCH_URL.value}/${itemDetail.value.invoiceName}`
})

/* ---------------- METHODS ---------------- */
function emitToggleRemarks () {
  emit('togglePDFModal')
}
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.image-container img {
  cursor: zoom-in;
  transition: transform 0.3s ease;
}

.image-container img:active {
  transform: scale(1.5);
  cursor: zoom-out;
}
</style>


