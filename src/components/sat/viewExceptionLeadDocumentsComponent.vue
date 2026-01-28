<template>
  <div>
    <q-list class="no-padding">
      <!-- Application Form -->
      <q-item class="bg-grey-4 text-weight-medium">
        <q-item-section>Application Form</q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <!-- PDF -->
          <div
            v-if="propGetShortInfo.applicationFileMimeType?.includes('pdf')"
            class="cursor-pointer ellipsis"
            @click="fnPDFViewModal(propGetShortInfo.applicationFile)"
          >
            <q-btn round size="sm" icon="fa-solid fa-file-pdf" color="primary" />
            {{ propGetShortInfo.applicationFile }}
          </div>

          <!-- IMAGE -->
          <div
            v-else-if="propGetShortInfo.applicationFileMimeType?.includes('image')"
            class="cursor-pointer ellipsis"
            @click="openMainImage"
          >
            <div
              v-viewer
              class="hidden"
            >
              <img
                :src="GLOBAL_FILE_FETCH_URL + '/' + propGetShortInfo.applicationFile"
                ref="handedOverImageViewer"
              />
            </div>
            <q-icon name="fa-solid fa-image" color="amber-9" />
            {{ propGetShortInfo.applicationFile }}
          </div>

          <div v-else>No document available</div>
        </q-item-section>
      </q-item>

      <!-- Other Documents -->
      <q-item v-if="Object.keys(propLeadDocumentInformation).length">
        <q-item-section>
          <div
            v-for="(documents, index) in propLeadDocumentInformation"
            :key="index"
          >
            <!-- TYPE 0 -->
            <q-expansion-item
              v-if="index.toString() === documents[0].subDocumentType"
              expand-separator
              default-opened
              icon="attach_file"
              :label="index"
              :caption="documents[0].uploadedDocuments.length + ' Document(s)'"
            >
              <template #header-extra>
                <div v-if="documents[0].documentVerifiedStatus === 2">
                  <q-btn
                    round size="xs" color="green" icon="fa-solid fa-check"
                    @click="fnDocumentApproveModal(documents[0])"
                  />
                  <q-btn
                    round size="xs" color="red" icon="fa-solid fa-xmark"
                    @click="fnDocumentRejectModal(documents[0])"
                  />
                </div>
                <span
                  v-else-if="documents[0].documentVerifiedStatus === 1"
                  class="text-positive"
                >Approved</span>
                <span
                  v-else-if="documents[0].documentVerifiedStatus === 3"
                  class="text-negative"
                >Rejected</span>
              </template>

              <div v-for="item in documents[0].uploadedDocuments" :key="item.fileName">
                <div
                  v-if="item.mimeType.includes('application')"
                  class="ellipsis cursor-pointer"
                  @click="fnPDFViewModal(item.fileName)"
                >
                  <q-btn round size="sm" icon="fa-solid fa-file-pdf" color="primary" />
                  {{ item.fileName }}
                </div>

                <div v-else-if="item.mimeType.includes('image')" class="q-pa-md">
                  <div v-viewer>
                    <img
                      :src="GLOBAL_FILE_FETCH_URL + '/' + item.fileName"
                      style="max-width:100%"
                    />
                  </div>
                </div>
              </div>
            </q-expansion-item>

            <!-- TYPE 1 -->
            <q-expansion-item
              v-else
              expand-separator
              default-opened
              icon="apps"
              :label="index"
              :caption="documents.length + ' Type(s)'"
            >
              <q-expansion-item
                v-for="sub in documents"
                :key="sub.subDocumentType"
                expand-separator
                icon="attach_file"
                :label="sub.subDocumentType"
                :caption="sub.uploadedDocuments.length + ' Document(s)'"
              >
                <template #header-extra>
                  <div v-if="sub.documentVerifiedStatus === 2">
                    <q-btn
                      round size="xs" color="green" icon="fa-solid fa-check"
                      @click="fnDocumentApproveModal(sub)"
                    />
                    <q-btn
                      round size="xs" color="red" icon="fa-solid fa-xmark"
                      @click="fnDocumentRejectModal(sub)"
                    />
                  </div>
                  <span
                    v-else-if="sub.documentVerifiedStatus === 1"
                    class="text-positive"
                  >Approved</span>
                  <span
                    v-else-if="sub.documentVerifiedStatus === 3"
                    class="text-negative"
                  >Rejected</span>
                </template>

                <div v-for="item in sub.uploadedDocuments" :key="item.fileName">
                  <div
                    v-if="item.mimeType.includes('application')"
                    class="ellipsis cursor-pointer"
                    @click="fnPDFViewModal(item.fileName)"
                  >
                    <q-btn round size="sm" icon="fa-solid fa-file-pdf" color="primary" />
                    {{ item.fileName }}
                  </div>

                  <div v-else-if="item.mimeType.includes('image')" class="q-pa-md">
                    <div v-viewer>
                      <img
                        :src="GLOBAL_FILE_FETCH_URL + '/' + item.fileName"
                        style="max-width:100%"
                      />
                    </div>
                  </div>
                </div>
              </q-expansion-item>
            </q-expansion-item>
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <!-- MODALS -->
    <showDocumentLeadApproveComponent
      v-if="toggleLeadDocumentApproveModal"
      :propToggleDocumentApproveModal="toggleLeadDocumentApproveModal"
      :propDocumentDetails="documentApproveTempArr"
      @toggleDocumentModal="afterApprove"
    />

    <showDocumentLeadRejectComponent
      v-if="toggleLeadDocumentRejectModal"
      :propToggleDocumentRejectModal="toggleLeadDocumentRejectModal"
      :propDocumentDetails="documentRejectTempArr"
      @toggleDocumentModal="afterReject"
    />

    <showPdfModalComponent
      v-if="toggleshowPDFModal"
      :propToggleshowPDFModal="toggleshowPDFModal"
      :propPDFDetails="PDFDetails"
      @togglePDFModal="fnPDFViewModal"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

import showDocumentLeadApproveComponent from '../../components/sat/showDocumentLeadApproveComponent.vue'
import showDocumentLeadRejectComponent from '../../components/sat/showDocumentLeadRejectComponent.vue'
import showPdfModalComponent from '../../components/sat/showPdfModalComponent.vue'

defineProps({
  propLeadDocumentInformation: Object,
  propGetShortInfo: Object
})

// Define emits to use the emit function
const emit = defineEmits(['emitTriggerComponentHotLoad'])

const store = useStore()
const route = useRoute()

const GLOBAL_FILE_FETCH_URL = computed(
  () => store.getters['GlobalVariables/GLOBAL_FILE_FETCH_URL']
)

const toggleLeadDocumentApproveModal = ref(false)
const toggleLeadDocumentRejectModal = ref(false)
const toggleshowPDFModal = ref(false)

const PDFDetails = ref(null)
const documentApproveTempArr = ref({})
const documentRejectTempArr = ref({})

const handedOverImageViewer = ref(null)

const openMainImage = () => {
  handedOverImageViewer.value?.click()
}

const fnDocumentApproveModal = (doc) => {
  doc.leadId = route.params.id
  documentApproveTempArr.value = doc
  toggleLeadDocumentApproveModal.value = true
}

const fnDocumentRejectModal = (doc) => {
  doc.leadId = route.params.id
  documentRejectTempArr.value = doc
  toggleLeadDocumentRejectModal.value = true
}

const afterApprove = (leadId) => {
  toggleLeadDocumentApproveModal.value = false
  emit('emitTriggerComponentHotLoad', leadId)
}

const afterReject = (leadId) => {
  toggleLeadDocumentRejectModal.value = false
  emit('emitTriggerComponentHotLoad', leadId)
}

const fnPDFViewModal = (file) => {
  PDFDetails.value = file
  toggleshowPDFModal.value = !toggleshowPDFModal.value
}
</script>