<template>
  <q-dialog
    v-model="dialogModel"
    persistent
    transition-show="fade"
    transition-hide="fade"
  >
    <q-card class="document-viewer-card">

      <!-- Header -->
      <div class="row items-center q-py-sm bottom-border q-px-md">
        <div class="col text-h6">Document Viewer</div>
        <div class="col text-right">
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

      <!-- Document List -->
      <div class="q-pa-md">
        <q-list bordered separator>
          <q-item
            v-for="(item, index) in itemDetail"
            :key="index"
          >
            <q-item-section>
              {{ item.invoiceName }}
            </q-item-section>

            <q-item-section side>
              <q-btn
                color="primary"
                label="View"
                size="sm"
                @click="viewDocument(item)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <!-- PDF / Image Viewer -->
      <financePdfComponent
        v-if="toggleShowPDFModal"
        :propToggleshowPDFModalFinance="toggleShowPDFModal"
        :propPDFDetailsFinance="pdfDetails"
        @togglePDFModal="fnPDFViewModal"
      />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import financePdfComponent from '../../components/sat/financePdfComponent.vue'

/* --------------------------------------------------
   Props & Emits
-------------------------------------------------- */
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  propPDFDetails: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'togglePDFModal'])

/* --------------------------------------------------
   Store
-------------------------------------------------- */
const store = useStore()

/* --------------------------------------------------
   Dialog v-model bridge
-------------------------------------------------- */
const dialogModel = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

/* --------------------------------------------------
   Reactive State
-------------------------------------------------- */
const itemDetail = ref([])
const selectedDocument = ref(null)
const toggleShowPDFModal = ref(false)
const pdfDetails = ref(null)

/* --------------------------------------------------
   Lifecycle
-------------------------------------------------- */
onMounted(() => {
  financeDocumentList()
})

/* --------------------------------------------------
   Methods
-------------------------------------------------- */
async function financeDocumentList () {
  try {
    const response = await store.dispatch(
      'posInventoryFinance/FETCH_FINANCE_DOCUMENT_LIST',
      props.propPDFDetails.id
    )

    if (Array.isArray(response?.data)) {
      itemDetail.value = response.data

      // preload documents
      for (const item of itemDetail.value) {
        try {
          await store.dispatch(
            'posInventoryFinance/FETCH_DOCUMENT_LIST',
            item
          )
        } catch (err) {
          console.error('Error fetching document:', err)
        }
      }
    } else {
      console.error('Unexpected response format:', response)
    }
  } catch (error) {

    console.error('Error fetching finance document list:', error)
  }
}

function viewDocument (document) {
  selectedDocument.value = document
  fnPDFViewModal(document)
}

function fnPDFViewModal (document) {
  pdfDetails.value = document
  toggleShowPDFModal.value = !toggleShowPDFModal.value
}

function emitToggleRemarks () {
  emit('update:modelValue', false)
  emit('togglePDFModal')
}
</script>

<style scoped>
.document-viewer-card {
  min-width: 50vw;
  min-height: 75vh;
}

.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.q-item {
  justify-content: space-between;
}
</style>
