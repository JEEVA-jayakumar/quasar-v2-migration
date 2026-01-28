<template>
  <div>
    <q-list bordered class="no-padding">
      <!-- START >> (Mandatory) Application form -->
      <q-expansion-item
        expand-separator
        default-opened
        group="documents"
        icon="attachment"
        label="Application form"
        class="full-width"
        @hide="functionToggleCollapsible"
      >
        <q-item v-if="showDocumentPreview" class="text-body1">
          <q-item-section v-if="propGetShortInfo.applicationFileMimeType.includes('pdf')">
            <div @click="fnDocumentUrl(propGetShortInfo.applicationFile)" class="ellipsis cursor-pointer">
              <q-btn round size="sm" icon="picture_as_pdf" color="primary" />
              &nbsp;{{ propGetShortInfo.applicationFile }}
            </div>
          </q-item-section>
          <q-item-section v-if="propGetShortInfo.applicationFileMimeType.includes('image')">
            <img
              :src="GLOBAL_FILE_FETCH_URL + '/' + propGetShortInfo.applicationFile"
              alt="Picture"
              style="max-width: 100%"
              class="cursor-pointer"
              @click="openImageDialog(GLOBAL_FILE_FETCH_URL + '/' + propGetShortInfo.applicationFile)"
            />
          </q-item-section>
        </q-item>
      </q-expansion-item>
      <!-- END >> (Mandatory) Application form -->
      
      <!-- START >>Loop through cooked(in store) array for documents -->
      <!-- START >> (Not Mandatory) Other attached documents -->
      <q-item
        class="no-padding"
        v-if="Object.keys(propLeadDocumentInformation).length > 0 && showDocumentPreview"
      >
        <q-item-section>
          <div v-for="(documents, index) in propLeadDocumentInformation" :key="index">
            <!-- START >> View type is 0, direct documents will be visible -->
            <div
              class="row items-center full-width"
              v-if="index.toString() == documents[0].subDocumentType"
            >
              <div class="col-12 text-body1">
                <q-expansion-item
                  expand-separator
                  default-opened
                  group="documents"
                  :ref="el => setSingleImageRef(el, index)"
                  class="full-width"
                >
                  <template v-slot:header>
                    <q-item-section avatar>
                      <q-icon
                        :color="documents[0].kycException ? 'amber-9' : 'primary'"
                        :name="documents[0].kycException ? 'warning' : 'attachment'"
                      />
                    </q-item-section>
                    
                    <q-item-section>
                      <q-item-label>{{ index }}</q-item-label>
                      <q-item-label caption>{{ documents[0].uploadedDocuments.length + ' Document(s)' }}</q-item-label>
                    </q-item-section>
                    
                    <q-item-section side v-if="documents[0].documentVerifiedStatus == 2">
                      <div class="row no-wrap q-gutter-xs">
                        <q-btn
                          round
                          size="xs"
                          color="green"
                          icon="check"
                          @click="fnDocumentApproveModal(documents[0])"
                        />
                        <q-btn
                          round
                          size="xs"
                          color="red"
                          icon="close"
                          @click="fnDocumentRejectModal(documents[0])"
                        />
                      </div>
                    </q-item-section>
                    
                    <q-item-section side v-else>
                      <span
                        v-if="documents[0].documentVerifiedStatus == 1"
                        class="text-body1 text-weight-medium text-positive"
                      >Approved</span>
                      <span
                        v-if="documents[0].documentVerifiedStatus == 3"
                        class="text-body1 text-weight-medium text-negative"
                      >Rejected</span>
                    </q-item-section>
                  </template>
                  
                  <div v-if="documents[0].uploadedDocuments.length > 0">
                    <q-item
                      v-for="(item, subIndex) in documents[0].uploadedDocuments"
                      :key="subIndex"
                      class="text-body1"
                    >
                      <q-item-section
                        @click="fnDocumentUrl(item.fileName)"
                        v-if="item.mimeType.includes('application')"
                        class="ellipsis cursor-pointer"
                      >
                        <q-btn round size="sm" icon="picture_as_pdf" color="primary" />
                        &nbsp;{{ item.fileName }}
                      </q-item-section>
                      
                      <q-item-section v-else-if="item.mimeType.includes('image')">
                        <img
                          :src="GLOBAL_FILE_FETCH_URL + '/' + item.fileName"
                          alt="Picture"
                          style="max-width: 100%"
                          class="cursor-pointer"
                          @click="openImageDialog(GLOBAL_FILE_FETCH_URL + '/' + item.fileName)"
                        />
                      </q-item-section>
                      
                      <q-item-section v-else>Invalid document type/ No document available</q-item-section>
                    </q-item>
                  </div>
                  <div v-else>No document available</div>
                </q-expansion-item>
              </div>
            </div>
            <!-- END >> View type is 0, direct documents will be visible -->
            
            <!-- START >> View type is 1, Category has sub category -->
            <div class="row items-center full-width" v-else>
              <div class="col-12 text-body1">
                <q-expansion-item expand-separator default-opened group="documents" class="full-width">
                  <template v-slot:header>
                    <q-item-section avatar>
                      <q-icon name="apps" />
                    </q-item-section>
                    
                    <q-item-section>
                      <q-item-label>{{ index }}</q-item-label>
                      <q-item-label caption>{{ documents.length + ' Type(s)' }}</q-item-label>
                    </q-item-section>
                    
                    <q-item-section side v-if="fnToggleVerificationButtonStatus(documents)">
                      <div class="row no-wrap q-gutter-xs">
                        <q-btn
                          round
                          size="xs"
                          color="green"
                          icon="check"
                          @click="fnDocumentApproveModal(documents[0])"
                        />
                        <q-btn
                          round
                          size="xs"
                          color="red"
                          icon="close"
                          @click="fnDocumentRejectModal(documents[0])"
                        />
                      </div>
                    </q-item-section>
                    
                    <q-item-section side v-else>
                      <span
                        v-if="fnToggleVerificationButtonStatusAfterAction(documents)"
                        class="text-body1 text-weight-medium text-positive"
                      >Approved</span>
                      <span
                        v-else-if="fnToggleVerificationButtonStatusAfterActionRejection(documents)"
                        class="text-body1 text-weight-medium text-negative"
                      >Rejected</span>
                    </q-item-section>
                  </template>
                  
                  <div
                    class="row items-center full-width"
                    v-for="(subDocument, subIndex) in documents"
                    :key="subIndex"
                  >
                    <div class="col-12 text-body1">
                      <q-expansion-item expand-separator default-opened group="subDocuments" class="full-width">
                        <template v-slot:header>
                          <q-item-section avatar>
                            <q-icon
                              :color="subDocument.kycException ? 'amber-9' : 'primary'"
                              :name="subDocument.kycException ? 'warning' : 'attachment'"
                            />
                          </q-item-section>
                          
                          <q-item-section>
                            <q-item-label>{{ subDocument.subDocumentType }}</q-item-label>
                            <q-item-label caption>{{ subDocument.uploadedDocuments.length + ' Document(s)' }}</q-item-label>
                          </q-item-section>
                          
                          <q-item-section side v-if="subDocument.documentVerifiedStatus == 2">
                            <div class="row no-wrap q-gutter-xs">
                              <q-btn
                                round
                                size="xs"
                                color="green"
                                icon="check"
                                @click="fnDocumentApproveModal(subDocument)"
                              />
                              <q-btn
                                round
                                size="xs"
                                color="red"
                                icon="close"
                                @click="fnDocumentRejectModal(subDocument)"
                              />
                            </div>
                          </q-item-section>
                          
                          <q-item-section side v-else>
                            <span
                              v-if="subDocument.documentVerifiedStatus == 1"
                              class="text-body1 text-weight-medium text-positive"
                            >Approved</span>
                            <span
                              v-if="subDocument.documentVerifiedStatus == 3"
                              class="text-body1 text-weight-medium text-negative"
                            >Rejected</span>
                          </q-item-section>
                        </template>
                        
                        <div v-if="subDocument.uploadedDocuments.length > 0">
                          <q-item
                            v-for="(item, subIndex) in subDocument.uploadedDocuments"
                            :key="subIndex"
                            class="text-body1"
                          >
                            <q-item-section
                              @click="fnDocumentUrl(item.fileName)"
                              v-if="item.mimeType.includes('application')"
                              class="ellipsis cursor-pointer"
                            >
                              <q-btn round size="sm" icon="picture_as_pdf" color="primary" />
                              &nbsp;{{ item.fileName }}
                            </q-item-section>
                            
                            <q-item-section v-else-if="item.mimeType.includes('image')">
                              <img
                                :src="GLOBAL_FILE_FETCH_URL + '/' + item.fileName"
                                alt="Picture"
                                style="max-width: 100%"
                                class="cursor-pointer"
                                @click="openImageDialog(GLOBAL_FILE_FETCH_URL + '/' + item.fileName)"
                              />
                            </q-item-section>
                            
                            <q-item-section v-else>Invalid document type/ No document available</q-item-section>
                          </q-item>
                        </div>
                        <div v-else>No document available</div>
                      </q-expansion-item>
                    </div>
                  </div>
                </q-expansion-item>
              </div>
            </div>
            <!-- END >> View type is 1, Category has sub category -->
          </div>
        </q-item-section>
      </q-item>
      <!-- END >>Loop through cooked(in store) array for documents -->
      <!-- END >> (Not Mandatory) Other attached documents -->
      
      <div class="col-5 q-pa-xs group" v-if="!showDocumentPreview">
        <div>
          <!-- Using Quasar's PDF viewer or alternative -->
          <div v-if="isPdfFile(populatedDocumentUrl)" class="pdf-viewer-container">
            <iframe
              :src="GLOBAL_FILE_FETCH_URL + '/' + populatedDocumentUrl"
              width="100%"
              height="500"
              style="border: none;"
              title="PDF Viewer"
            ></iframe>
          </div>
          <div v-else>
            <img
              :src="GLOBAL_FILE_FETCH_URL + '/' + populatedDocumentUrl"
              alt="Document"
              style="max-width: 100%; max-height: 500px;"
            />
          </div>
        </div>
        <div class="q-mt-md">
          <q-btn
            label="Close Preview"
            icon="close"
            color="primary"
            @click="fnCloseDocumentPreview"
          />
        </div>
      </div>
    </q-list>

    <!-- START >> COMPONENT: Document approve -->
    <show-document-lead-approve-component
      v-if="toggleLeadDocumentApproveModal"
      :prop-toggle-document-approve-modal="toggleLeadDocumentApproveModal"
      :prop-document-details="documentApproveTempArr"
      @toggle-document-modal="fnDocumentApproveModalAfterEmit"
    />
    <!-- END >> COMPONENT: Document approve -->
    
    <!-- START >> COMPONENT: Document reject -->
    <show-document-lead-reject-component
      v-if="toggleLeadDocumentRejectModal"
      :prop-toggle-document-reject-modal="toggleLeadDocumentRejectModal"
      :prop-document-details="documentRejectTempArr"
      @toggle-document-modal="fnDocumentRejectModalAfterEmit"
    />
    <!-- END >> COMPONENT: Document reject -->
    
    <!-- START >> COMPONENT: View PDF -->
    <show-pdf-modal-component
      v-if="toggleshowPDFModal"
      :prop-toggleshow-pdf-modal="toggleshowPDFModal"
      :prop-pdf-details="pdfDetails"
      @toggle-pdf-modal="fnPDFViewModal"
    />
    <!-- END >> COMPONENT: View PDF -->
    
    <!-- Image Dialog -->
    <q-dialog v-model="showImageDialog" full-width full-height>
      <q-card style="max-width: 90vw; max-height: 90vh">
        <q-card-section class="row items-center q-pb-none">
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="flex flex-center">
          <img :src="currentImageUrl" style="max-width: 100%; max-height: 80vh" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed} from 'vue'
import { useStore } from 'vuex'
import { filter } from 'lodash-es'
import ShowDocumentLeadApproveComponent from '../../components/sat/ShowDocumentLeadApproveComponent.vue'
import ShowDocumentLeadRejectComponent from '../../components/sat/ShowDocumentLeadRejectComponent.vue'
import ShowPdfModalComponent from '../../components/sat/ShowPdfModalComponent.vue'

const store = useStore()

const props = defineProps({
  propLeadDocumentInformation: {
    type: Object,
    required: true
  },
  propGetShortInfo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggleDocumentModal'])

// Refs
const toggleCollapsible = ref('')
const showDocumentPreview = ref(true)
const populatedDocumentUrl = ref('')
const singleImageRefs = ref({})

// Modal states
const toggleLeadDocumentApproveModal = ref(false)
const toggleLeadDocumentRejectModal = ref(false)
const toggleshowPDFModal = ref(false)
const pdfDetails = ref(null)

// Image dialog
const showImageDialog = ref(false)
const currentImageUrl = ref('')

// Document arrays
const documentApproveTempArr = ref([])
const documentRejectTempArr = ref([])

// Computed
const GLOBAL_FILE_FETCH_URL = computed(() => 
  store.getters['GlobalVariables/GLOBAL_FILE_FETCH_URL']
)

// Methods
const functionToggleCollapsible = () => {
  toggleCollapsible.value = 'toggleCollapsible'
}

const setSingleImageRef = (el, index) => {
  if (el) {
    singleImageRefs.value[index] = el
  }
}

const fnToggleVerificationButtonStatus = (document) => {
  const assumeArr = filter(document, (value) => {
    return value.kycException === true && value.documentVerifiedStatus == 2
  })
  return assumeArr.length > 0
}

const fnToggleVerificationButtonStatusAfterAction = (document) => {
  const assumeArr = filter(document, (value) => {
    return value.kycException === true && value.documentVerifiedStatus == 1
  })
  return assumeArr.length > 0
}

const fnToggleVerificationButtonStatusAfterActionRejection = (document) => {
  const assumeArr = filter(document, (value) => {
    return value.kycException === true && value.documentVerifiedStatus == 3
  })
  return assumeArr.length > 0
}

const fnPDFViewModal = (documentUrl) => {
  pdfDetails.value = documentUrl
  toggleshowPDFModal.value = !toggleshowPDFModal.value
}

const fnDocumentUrl = (documentUrl) => {
  populatedDocumentUrl.value = documentUrl
  showDocumentPreview.value = false
}

const fnCloseDocumentPreview = () => {
  showDocumentPreview.value = true
}

const fnDocumentApproveModal = (documentDetails) => {
  toggleLeadDocumentApproveModal.value = !toggleLeadDocumentApproveModal.value
  documentDetails.leadId = props.propGetShortInfo.id
  documentApproveTempArr.value = documentDetails
}

const fnDocumentRejectModal = (documentDetails) => {
  toggleLeadDocumentRejectModal.value = !toggleLeadDocumentRejectModal.value
  documentDetails.leadId = props.propGetShortInfo.id
  documentRejectTempArr.value = documentDetails
}

const fnDocumentApproveModalAfterEmit = (leadId) => {
  toggleLeadDocumentApproveModal.value = false
  emit('toggleDocumentModal', leadId)
}

const fnDocumentRejectModalAfterEmit = (leadId) => {
  toggleLeadDocumentRejectModal.value = false
  emit('toggleDocumentModal', leadId)
}

const openImageDialog = (imageUrl) => {
  currentImageUrl.value = imageUrl
  showImageDialog.value = true
}

const isPdfFile = (fileName) => {
  return fileName?.toLowerCase().endsWith('.pdf') || 
         props.propGetShortInfo.applicationFileMimeType.includes('pdf')
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pdf-viewer-container {
  width: 100%;
  height: 500px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}
</style>