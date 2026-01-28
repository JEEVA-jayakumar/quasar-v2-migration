<template>
  <div>
    <q-list bordered class="no-padding">
      <!-- START >> (Mandatory) Application form  -->
      <q-item class="text-body1 text-dark bg-grey-4 text-weight-medium q-py-sm">
        <q-item-section>
          <q-item-label>Application Form</q-item-label>
        </q-item-section>
      </q-item>
      <q-item class="text-body1">
        <q-item-section>
          <div class="full-width">
            <!-- START >>If document type is PDF format -->
            <div
              class="cursor-pointer"
              v-if="propGetShortInfo.applicationFileMimeType.includes('pdf')"
            >
              <div @click="fnPDFViewModal(propGetShortInfo.applicationFile)">
                <q-btn round size="sm" icon="picture_as_pdf" color="primary"/>
                &nbsp;{{ propGetShortInfo.applicationFile }}
              </div>
            </div>
            <!-- END >>If document type is PDF format -->
            <!-- START >>If document type is image format -->
            <div
              class="cursor-pointer"
              v-else-if="propGetShortInfo.applicationFileMimeType.includes('image')"
            >
              <img
                :src="GLOBAL_FILE_FETCH_URL + '/' + propGetShortInfo.applicationFile"
                ref="handedOverImageViewer"
                style="max-width:100%; display: none;"
                @click="$refs.imageViewer?.show()"
              >
              <q-btn
                flat
                dense
                @click="$refs.imageViewer?.show()"
                class="ellipsis"
              >
                <q-icon name="image" color="amber-9" class="q-mr-sm"/>
                {{ propGetShortInfo.applicationFile }}
              </q-btn>
              
              <!-- Quasar Image Viewer Dialog -->
              <q-dialog ref="imageViewer">
                <q-card style="max-width: 90vw; max-height: 90vh">
                  <q-card-section class="row items-center q-pb-none">
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                  </q-card-section>
                  <q-card-section class="flex flex-center">
                    <img
                      :src="GLOBAL_FILE_FETCH_URL + '/' + propGetShortInfo.applicationFile"
                      style="max-width: 100%; max-height: 80vh"
                    >
                  </q-card-section>
                </q-card>
              </q-dialog>
            </div>
            <!-- END >>If document type is image format -->
            <!-- START >>If document type is not image/pdf format -->
            <div v-else>Invalid document type/ No document available</div>
            <!-- END >>If document type is not image/pdf format -->
          </div>
        </q-item-section>
      </q-item>
      <!-- END >> (Mandatory) Application form  -->
      <!-- START >>Loop through cooked(in store) array for documents -->
      <!-- START >> (Not Mandatory) Other attached documents  -->
      <q-item class="no-padding" v-if="Object.keys(propLeadDocumentInformation).length > 0">
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
                  :label="index"
                  :caption="documents[0].uploadedDocuments.length + ' Document(s)'"
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
                    
                    <q-item-section side v-if="[2, 4].includes(documents[0].documentVerifiedStatus)">
                      <div class="row no-wrap q-gutter-xs">
                        <q-btn
                          round
                          size="xs"
                          color="green"
                          icon="check"
                          @click.stop="fnDocumentApproveModal(documents[0])"
                        />
                        <q-btn
                          round
                          size="xs"
                          color="red"
                          icon="close"
                          @click.stop="fnDocumentRejectModal(documents[0])"
                        />
                        <q-btn
                          round
                          size="xs"
                          color="primary"
                          icon="add"
                          @click.stop="fileUploadForUsingMerchantId(documents[0].merchantDocumentType)"
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
                      
                      <div v-if="propGetShortInfo.leadStatus == 101 && !documents[0].kycException" class="row no-wrap q-gutter-xs">
                        <q-btn
                          round
                          size="xs"
                          color="green"
                          icon="check"
                          @click.stop="fnDocumentApproveModal(documents[0])"
                        />
                        <q-btn
                          round
                          size="xs"
                          color="red"
                          icon="close"
                          @click.stop="fnDocumentRejectModal(documents[0])"
                        />
                        <q-btn
                          round
                          size="xs"
                          color="primary"
                          icon="add"
                          @click.stop="fileUploadForUsingMerchantId(documents[0].merchantDocumentType)"
                        />
                      </div>
                    </q-item-section>
                  </template>
                  
                  <div v-if="documents[0].uploadedDocuments.length > 0">
                    <div
                      v-for="(item, subIndex) in documents[0].uploadedDocuments"
                      :key="subIndex"
                      class="q-py-sm cursor-pointer"
                    >
                      <div v-if="item.mimeType.includes('application')">
                        <div @click="fnPDFViewModal(item.fileName)" class="ellipsis">
                          <q-btn round size="sm" icon="picture_as_pdf" color="primary"/>
                          &nbsp;{{ item.fileName }}
                        </div>
                      </div>
                      <div v-else-if="item.mimeType.includes('image')" class="q-pa-md">
                        <img
                          :src="GLOBAL_FILE_FETCH_URL + '/' + item.fileName"
                          style="max-width: 100%"
                          class="cursor-pointer"
                          @click="openImageDialog(GLOBAL_FILE_FETCH_URL + '/' + item.fileName)"
                        >
                      </div>
                      <div v-else>Invalid document type/ No document available</div>
                    </div>
                  </div>
                  <div v-else class="full-width">No document available</div>
                </q-expansion-item>
              </div>
            </div>
            <!-- END >> View type is 0, direct documents will be visible -->
            
            <!-- START >> View type is 1, Category has sub category -->
            <div class="row items-center full-width" v-else>
              <div class="col-12 text-body1">
                <q-expansion-item
                  expand-separator
                  default-opened
                  indent
                  group="documents"
                  :label="index"
                  :caption="documents.length + ' Type(s)'"
                  class="full-width"
                >
                  <template v-slot:header>
                    <q-item-section avatar>
                      <q-icon name="apps"/>
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
                          @click.stop="fnDocumentApproveModal(documents[0])"
                        />
                        <q-btn
                          round
                          size="xs"
                          color="red"
                          icon="close"
                          @click.stop="fnDocumentRejectModal(documents[0])"
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
                      <q-expansion-item
                        expand-separator
                        group="subDocuments"
                        :label="subDocument.subDocumentType"
                        :caption="subDocument.uploadedDocuments.length + ' Document(s)'"
                        class="full-width"
                      >
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
                          
                          <q-item-section side v-if="[2, 4].includes(subDocument.documentVerifiedStatus)">
                            <div class="row no-wrap q-gutter-xs">
                              <q-btn
                                round
                                size="xs"
                                color="green"
                                icon="check"
                                @click.stop="fnDocumentApproveModal(subDocument)"
                              />
                              <q-btn
                                round
                                size="xs"
                                color="red"
                                icon="close"
                                @click.stop="fnDocumentRejectModal(subDocument)"
                              />
                              <q-btn
                                round
                                size="xs"
                                color="primary"
                                icon="add"
                                @click.stop="fileUploadForUsingMerchantId(subDocument.merchantDocumentType)"
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
                            
                            <div v-if="propGetShortInfo.leadStatus == 101 && !subDocument.kycException" class="row no-wrap q-gutter-xs">
                              <q-btn
                                round
                                size="xs"
                                color="green"
                                icon="check"
                                @click.stop="fnDocumentApproveModal(subDocument)"
                              />
                              <q-btn
                                round
                                size="xs"
                                color="red"
                                icon="close"
                                @click.stop="fnDocumentRejectModal(subDocument)"
                              />
                              <q-btn
                                round
                                size="xs"
                                color="primary"
                                icon="add"
                                @click.stop="fileUploadForUsingMerchantId(subDocument.merchantDocumentType)"
                              />
                            </div>
                          </q-item-section>
                        </template>
                        
                        <div v-if="subDocument.uploadedDocuments.length > 0">
                          <div
                            v-for="(item, subIndex) in subDocument.uploadedDocuments"
                            :key="subIndex"
                            class="q-py-sm cursor-pointer"
                          >
                            <div v-if="item.mimeType.includes('application')">
                              <div @click="fnPDFViewModal(item.fileName)" class="ellipsis">
                                <q-btn round size="sm" icon="picture_as_pdf" color="primary"/>
                                &nbsp;{{ item.fileName }}
                              </div>
                            </div>
                            <div v-else-if="item.mimeType.includes('image')" class="q-pa-md">
                              <img
                                :src="GLOBAL_FILE_FETCH_URL + '/' + item.fileName"
                                style="max-width: 100%"
                                class="cursor-pointer"
                                @click="openImageDialog(GLOBAL_FILE_FETCH_URL + '/' + item.fileName)"
                              >
                            </div>
                            <div v-else class="full-width">Invalid document type/ No document available</div>
                          </div>
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
          
          <input
            type="file"
            ref="fileUpload"
            class="hidden"
            accept=".jpg,.jpeg,.png,.pdf,.PDF"
            @change="uploadFile($event, subDocumentTypeId)"
          >
        </q-item-section>
      </q-item>
      <!-- END >>Loop through cooked(in store) array for documents -->
      <!-- END >> (Not Mandatory) Other attached documents  -->
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
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { filter } from 'lodash-es'
import ShowDocumentLeadApproveComponent from '../../components/sat/ShowDocumentLeadApproveComponent.vue'
import ShowDocumentLeadRejectComponent from '../../components/sat/ShowDocumentLeadRejectComponent.vue'
import ShowPdfModalComponent from '../../components/sat/ShowPdfModalComponent.vue'

const $q = useQuasar()
const store = useStore()
const route = useRoute()

const emit = defineEmits(['emitTriggerComponentHotLoad'])

// Refs
const subDocumentTypeId = ref('')
const fileUpload = ref(null)
const handedOverImageViewer = ref(null)
const showImageDialog = ref(false)
const currentImageUrl = ref('')

// Modal states
const toggleLeadDocumentApproveModal = ref(false)
const toggleLeadDocumentRejectModal = ref(false)
const toggleshowPDFModal = ref(false)
const pdfDetails = ref(null)
const documentApproveTempArr = ref([])
const documentRejectTempArr = ref([])

// Computed
const GLOBAL_FILE_FETCH_URL = computed(() => 
  store.getters['GlobalVariables/GLOBAL_FILE_FETCH_URL']
)

// Methods
const fileUploadForUsingMerchantId = (details) => {
  subDocumentTypeId.value = details
  fileUpload.value?.click()
}

const uploadFile = async (evt, details) => {
  if (!evt.target.files.length) return
  
  $q.loading.show({
    delay: 0,
    spinnerColor: 'purple-9',
    message: 'Uploading file ..'
  })

  try {
    const formData = new FormData()
    formData.append('file', evt.target.files[0])
    
    const requestParams = {
      files: formData,
      leadId: route.params.id,
      documentId: details
    }

    await store.dispatch('SatLeadValidation/FEED_HAND_OVER_TO_SAT_DOCUMENT', requestParams)
    
    emit('emitTriggerComponentHotLoad')
    evt.target.value = ''
    $q.loading.hide()
  } catch (error) {

    evt.target.value = ''
    $q.loading.hide()
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: error.message || 'Failed to upload document',
      icon: 'thumb_down'
    })
  }
}


const fnDocumentApproveModal = (documentDetails) => {
  toggleLeadDocumentApproveModal.value = !toggleLeadDocumentApproveModal.value
  documentDetails.leadId = route.params.id
  documentApproveTempArr.value = documentDetails
}

const fnDocumentRejectModal = (documentDetails) => {
  toggleLeadDocumentRejectModal.value = !toggleLeadDocumentRejectModal.value
  documentDetails.leadId = route.params.id
  documentRejectTempArr.value = documentDetails
}

const fnDocumentApproveModalAfterEmit = (leadId) => {
  toggleLeadDocumentApproveModal.value = false
  emit('emitTriggerComponentHotLoad', leadId)
}

const fnDocumentRejectModalAfterEmit = (leadId) => {
  toggleLeadDocumentRejectModal.value = false
  emit('emitTriggerComponentHotLoad', leadId)
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

const openImageDialog = (imageUrl) => {
  currentImageUrl.value = imageUrl
  showImageDialog.value = true
}
</script>

<style scoped>
.hidden {
  display: none;
}

.cursor-pointer {
  cursor: pointer;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

label {
  background-color: rgb(32, 44, 63);
  border-radius: 65%;
  padding: 3px;
  height: 25px;
  width: 25px;
  text-align: center;
}
</style>