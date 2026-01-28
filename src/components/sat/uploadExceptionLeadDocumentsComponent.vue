<template>
  <div>
    <!-- START >> (Default) Merchant type  -->
    <q-item class="q-body-1">
      <q-item-section>
        <div class="q-body-1">
          Merchant type:
          <span class="text-weight-medium">{{ merchantTypeSelection }}</span>
        </div>
      </q-item-section>
    </q-item>
    <!-- END >> (Default) Merchant type  -->
    <div class="group">
      <!-- START >> (Mandatory) Application form  -->
      <q-list class="no-padding">
        <q-item class="q-body-1 text-dark bg-grey-4 text-weight-medium">
          <q-item-section>Application Form</q-item-section>
          <q-item-section side>
            <label class="cursor-pointer text-white" style="background-color: #202c3f;">
              <span class="q-caption text-weight-light">Attach</span>
              <input
                type="file"
                name="file"
                @change="fnUploadApplicationForm($event, document)"
                accept=".png, .jpg, .pdf"
              />
            </label>
          </q-item-section>
        </q-item>
        <q-item class="q-body-1">
          <q-item-section>
            <div class="full-width">
              <div
                class="cursor-pointer"
                v-if="getShortLeadInfo.applicationFileMimeType.includes('pdf')"
              >
                <div @click="fnPDFViewModal(getShortLeadInfo.applicationFile)" class="ellipsis">
                  <q-btn round size="sm" icon="fas fa-file-pdf" color="primary" />
                  &nbsp;{{ getShortLeadInfo.applicationFile }}
                </div>
              </div>
              <div
                class="cursor-pointer"
                v-else-if="getShortLeadInfo.applicationFileMimeType.includes('image')"
              >
                <div class="hidden">
                  <img
                    :src="[GLOBAL_FILE_FETCH_URL + '/' + getShortLeadInfo.applicationFile]"
                    ref="handedOverImageViewer"
                    style="max-width: 100%"
                  />
                </div>
                <div @click="fnViewHandedOverFileImage()" class="ellipsis">
                  <q-icon name="fas fa-image" color="amber-9" />
                  &nbsp;{{ getShortLeadInfo.applicationFile }}
                </div>
              </div>
              <div v-else>Invalid document type/ No document available</div>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
      <!-- END >> (Mandatory) Application form  -->
      <!-- START >> (Optional) payment document file == bank subvention  -->
      <q-list v-if="getShortLeadInfo.paymentDocumentFile != ''">
        <q-item-section header class="bg-grey-4">Bank Letter</q-item-section>
        <q-item class="q-body-1">
          <q-item-section>
            <div class="full-width">
              <div
                class="cursor-pointer"
                v-if="getShortLeadInfo.paymentDocumentMimeType.includes('pdf')"
              >
                <div @click="fnPDFViewModal(getShortLeadInfo.paymentDocumentFile)" class="ellipsis">
                  <q-btn round size="sm" icon="fas fa-file-pdf" color="primary" />
                  &nbsp;{{ getShortLeadInfo.paymentDocumentFile }}
                </div>
              </div>
              <div
                class="cursor-pointer"
                v-else-if="getShortLeadInfo.paymentDocumentMimeType.includes('image')"
              >
                <div class="hidden">
                  <img
                    :src="[GLOBAL_FILE_FETCH_URL + '/' + getShortLeadInfo.paymentDocumentFile]"
                    ref="bankUploadedLetter"
                    style="max-width: 100%"
                  />
                </div>
                <div @click="fnViewbankUploadedLetterImage()" class="ellipsis">
                  <q-icon name="fas fa-image" color="amber-9" />
                  &nbsp;{{ getShortLeadInfo.paymentDocumentFile }}
                </div>
              </div>
              <div v-else>Invalid document type/ No document available</div>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
      <!-- END >> (Mandatory) payment document file == bank subvention  -->
      <!-- START >> (Mandatory != kyc) Handover to SAT, document upload -->
      <!-- START >> For viewType => 0 -->
      <template v-if="getShortLeadInfoDocumentTypes">
        <q-list
          v-for="(singleDocument, singleDocumentIndex) in getShortLeadInfoDocumentTypes.uploadedDocuments.forSingleDocument"
          :key="singleDocumentIndex"
          class="no-padding"
        >
          <q-item-section header class="bg-grey-4">{{ singleDocument.documentType }}</q-item-section>
          <div
            v-for="(document, documentIndex) in singleDocument.documents"
            :key="documentIndex"
            class="document-item"
            style="border: 1px solid #afafaf; margin: 5px"
          >
            <q-item
              class="q-body-1 q-pa-sm text-dark text-weight-medium bottom-border"
              :class="[document.isKycChecked ? 'bg-amber-4' : '']"
            >
              <q-item-section side v-if="!document.reprocess && document.verifiedStatus != 1">
                <q-checkbox
                  :disabled="computeAndToggleCheckboxForSingleDocument(document)"
                  :class="[
                    computeAndToggleCheckboxForSingleDocument(document) ? 'no-pointer-events' : '',
                  ]"
                  v-model="document.isKycChecked"
                  color="dark"
                  @update:model-value="fnCookKYCdocumentArr(document)"
                />
              </q-item-section>
              <q-item-section>{{ document.subDocumentType }}</q-item-section>
              <q-item-section side v-if="!document.reprocess && document.verifiedStatus != 1">
                <label
                  class="cursor-pointer text-white"
                  style="background-color: #202c3f;"
                  @click="fnShowDisabledMessageForFileUpload(document, document.isKycChecked)"
                >
                  <span class="q-caption text-weight-light">Attach</span>
                  <input
                    type="file"
                    name="file"
                    :disabled="document.isKycChecked"
                    @change="fnVerificationDocumentUploadSingleUpload($event, document)"
                    accept=".png, .jpg, .pdf"
                  />
                </label>
              </q-item-section>

              <!-- TODO -- START =>> Quick fix remove for proper buttons visibility -->
              <q-item-section side v-if="!document.reprocess && document.verifiedStatus == 1">
                <span class="q-body-1 text-weight-medium text-positive">Approved</span>
              </q-item-section>
              <!-- TODO -- END  =>> Quick fix remove for proper buttons visibility -->
              <q-item-section
                side
                v-if="document.reprocess && !computedGetSingleDocumentAccessForStatus(document)"
              >
                <q-btn
                  round
                  size="xs"
                  class="q-ma-xs"
                  color="green"
                  icon="fas fa-check"
                  @click="fnDocumentApproveModal(document)"
                />
                <q-btn
                  round
                  size="xs"
                  class="q-ma-xs"
                  color="red"
                  icon="fas fa-times"
                  @click="fnDocumentRejectModal(document)"
                />
              </q-item-section>
              <q-item-section
                side
                v-if="document.reprocess && computedGetSingleDocumentAccessForStatus(document)"
              >
                <span
                  v-if="checkSumForDocumentVerificationStatus(document).documentVerifiedStatus == 1"
                  class="q-body-1 text-weight-medium text-positive"
                  >Approved</span
                >
                <span
                  v-if="checkSumForDocumentVerificationStatus(document).documentVerifiedStatus == 3"
                  class="q-body-1 text-weight-medium text-negative"
                  >Rejected</span
                >
              </q-item-section>
            </q-item>
            <div v-if="displayAttachedFileIndex == document.documentType">
              <div
                v-for="attachedSubFile in displayAttachedFile"
                :key="attachedSubFile.id"
              >
                <div v-if="attachedSubFile.subDocumentType == document.subDocumentType">
                  <q-item
                    v-for="(filesAttachedEarlier, filesAttachedEarlierIndex) in attachedSubFile.uploadedDocuments"
                    :key="filesAttachedEarlierIndex"
                    class="q-body-1"
                  >
                    <q-item-section>
                      <div class="cursor-pointer" v-if="filesAttachedEarlier.mimeType.includes('pdf')">
                        <div
                          @click="fnPDFViewModal(filesAttachedEarlier.fileName)"
                          class="wrapWord ellipsis"
                        >
                          <q-icon name="fas fa-file-pdf" color="negative" />
                          &nbsp;{{ filesAttachedEarlier.fileName }}
                        </div>
                      </div>
                      <div
                        class="cursor-pointer"
                        v-else-if="filesAttachedEarlier.mimeType.includes('image')"
                      >
                        <div class="hidden">
                          <img
                            :src="[GLOBAL_FILE_FETCH_URL + '/' + filesAttachedEarlier.fileName]"
                            ref="attachedImageViewer"
                            style="max-width: 100%"
                          />
                        </div>
                        <div
                          class="wrapWord ellipsis"
                          @click="fnViewAttachedFileImage(filesAttachedEarlierIndex)"
                        >
                          <q-icon name="fas fa-image" color="amber-9" />
                          &nbsp;{{ filesAttachedEarlier.fileName }}
                        </div>
                      </div>
                    </q-item-section>
                    <q-item-section side v-if="attachedSubFile.documentVerifiedStatus == 4">
                      <q-btn
                        size="xs"
                        icon="clear"
                        @click="fnDeleteAlreadyAttachedFile(filesAttachedEarlier)"
                        round
                        color="negative"
                        label="Remove"
                      />
                    </q-item-section>
                  </q-item>
                  <q-separator />
                </div>
              </div>
            </div>
          </div>
        </q-list>
      </template>
      <!-- END >> For viewType => 0 -->
      <!-- START >> For viewType => 1 -->
      <template v-if="getShortLeadInfoDocumentTypes">
        <q-list
          v-for="multipleDocument in getShortLeadInfoDocumentTypes.uploadedDocuments.forMutipleDocument"
          :key="multipleDocument.id"
          class="no-padding"
          dense
        >
          <q-item-section
            header
            :class="[multipleDocument.isKycChecked ? 'text-dark bg-amber-4' : 'bg-grey-4']"
          >
            <div class="row items-center">
              <div class="col-auto" v-if="!multipleDocument.reprocess">
                <q-checkbox
                  v-if="multipleDocument.verifiedStatus != 1"
                  :disabled="computeAndToggleCheckbox(multipleDocument)"
                  :class="[computeAndToggleCheckbox(multipleDocument) ? 'no-pointer-events' : '']"
                  v-model="multipleDocument.isKycChecked"
                  color="dark"
                  @update:model-value="fnCookKYCdocumentArr(multipleDocument)"
                  :label="multipleDocument.documentType"
                />
                <span v-else>{{ multipleDocument.documentType }}</span>
              </div>
              <div class="col" v-if="multipleDocument.reprocess">
                <span class="col">{{ multipleDocument.documentType }}</span>
              </div>
              <div
                class="col"
                v-if="!multipleDocument.reprocess && multipleDocument.verifiedStatus == 1"
                style="text-align: right"
              >
                <span class="q-body-1 text-weight-medium text-positive">Approved</span>
              </div>
              <div class="col-auto" v-if="multipleDocument.reprocess">
                <span v-if="computedGetAccess(multipleDocument)">
                  <q-btn
                    round
                    size="xs"
                    class="q-mx-xs"
                    color="green"
                    icon="fas fa-check"
                    @click="
                      fnDocumentApproveModal(
                        getShortLeadInfo.leadDocuments[multipleDocument.documentType][0]
                      )
                    "
                  />
                  <q-btn
                    round
                    size="xs"
                    class="q-mx-xs"
                    color="red"
                    icon="fas fa-times"
                    @click="
                      fnDocumentRejectModal(
                        getShortLeadInfo.leadDocuments[multipleDocument.documentType][0]
                      )
                    "
                  />
                </span>
                <span v-else>
                  <span
                    v-if="
                      getShortLeadInfo.leadDocuments[multipleDocument.documentType][0]
                        .documentVerifiedStatus == 1
                    "
                    class="q-body-1 text-weight-medium text-positive"
                    >Approved</span
                  >
                  <span
                    v-if="
                      getShortLeadInfo.leadDocuments[multipleDocument.documentType][0]
                        .documentVerifiedStatus == 3
                    "
                    class="q-body-1 text-weight-medium text-negative"
                    >Rejected</span
                  >
                </span>
              </div>
            </div>
          </q-item-section>
          <div>
            <q-item class="q-body-1 q-pa-sm group">
              <q-item-section>
                <select
                  :disabled="
                    multipleDocument.isKycChecked ||
                    multipleDocument.reprocess ||
                    multipleDocument.verifiedStatus == 1
                  "
                  class="full-width customQuasarSelect"
                  v-model="multipleDocument.subDocumentTypeSelection"
                  @change="fnGetSubDocuments(multipleDocument.subDocumentTypeSelection)"
                >
                  <option disabled value="0">Choose from below</option>
                  <option v-for="type in multipleDocument.documents" :key="type.id" :value="type">
                    {{ type.subDocumentType }}
                  </option>
                </select>
              </q-item-section>
              <!-- START >> Will be displayed if reprocess key => false -->
              <div v-if="!multipleDocument.reprocess && multipleDocument.verifiedStatus != 1">
                <q-item-section side v-if="multipleDocument.isKycChecked ? false : true">
                  <label
                    class="cursor-pointer text-white"
                    style="background-color: #202c3f;"
                    @click="
                      fnShowDisabledMessageForFileUpload(
                        multipleDocument,
                        multipleDocument.isKycChecked
                      )
                    "
                  >
                    <span class="q-caption text-weight-light">Attach</span>
                    <input
                      type="file"
                      :disabled="multipleDocument.isKycChecked"
                      ref="subDocumentUpload"
                      @change="
                        fnVerificationDocumentUpload(
                          $event,
                          multipleDocument.subDocumentTypeSelection,
                          multipleDocument
                        )
                      "
                      name="file"
                      accept=".png, .jpg, .pdf"
                    />
                  </label>
                </q-item-section>
              </div>
              <!-- END >> Will be displayed if reprocess key => false -->
            </q-item>
          </div>
          <q-separator />
          <div v-if="displayAttachedFileIndex == multipleDocument.documentType">
            <div v-for="attachedSubFile in displayAttachedFile" :key="attachedSubFile.id">
              <q-item
                v-for="(filesAttachedEarlier, filesAttachedEarlierIndex) in attachedSubFile.uploadedDocuments"
                :key="filesAttachedEarlierIndex"
                class="q-body-1"
                multiline
              >
                <q-item-section>
                  <div class="cursor-pointer" v-if="filesAttachedEarlier.mimeType.includes('pdf')">
                    <div
                      @click="fnPDFViewModal(filesAttachedEarlier.fileName)"
                      class="wrapWord ellipsis"
                    >
                      <q-icon name="fas fa-file-pdf" color="negative" />
                      &nbsp;{{ filesAttachedEarlier.fileName }}
                    </div>
                  </div>
                  <div
                    class="cursor-pointer"
                    v-else-if="filesAttachedEarlier.mimeType.includes('image')"
                  >
                    <div class="hidden">
                      <img
                        :src="[GLOBAL_FILE_FETCH_URL + '/' + filesAttachedEarlier.fileName]"
                        ref="multiAttachedImageViewer"
                        style="max-width: 100%"
                      />
                    </div>
                    <div
                      @click="fnViewMultiAttachedFileImage(filesAttachedEarlierIndex)"
                      class="wrapWord ellipsis"
                    >
                      <q-icon name="fas fa-image" color="amber-9" />
                      &nbsp;{{ filesAttachedEarlier.fileName }}
                    </div>
                  </div>
                </q-item-section>
                <q-item-section side v-if="attachedSubFile.documentVerifiedStatus == 4">
                  <q-btn
                    size="xs"
                    icon="clear"
                    @click="fnDeleteAlreadyAttachedFile(filesAttachedEarlier)"
                    round
                    color="negative"
                    label="Remove"
                  />
                </q-item-section>
                <q-separator />
              </q-item>
            </div>
          </div>
        </q-list>
      </template>
      <!-- END >> For viewType => 1 -->
    </div>
    <!-- END >> (Mandatory != kyc) Handover to SAT, document upload -->
    <!-- START >> COMPONENT: Document reject  -->
    <ShowDocumentLeadApproveComponent
      v-if="toggleLeadDocumentApproveModal"
      :propToggleDocumentApproveModal="toggleLeadDocumentApproveModal"
      :propDocumentDetails="documentApproveTempArr"
      @toggleDocumentModal="fnDocumentApproveModalAfterEmit"
    />
    <!-- END >> COMPONENT: Document approve -->
    <!-- START >> COMPONENT: Document reject  -->
    <ShowDocumentLeadRejectComponent
      v-if="toggleLeadDocumentRejectModal"
      :propToggleDocumentRejectModal="toggleLeadDocumentRejectModal"
      :propDocumentDetails="documentRejectTempArr"
      @toggleDocumentModal="fnDocumentRejectModalAfterEmit"
    />
    <!-- END >> COMPONENT: Document reject -->
    <!-- START >> COMPONENT: View PDF  -->
    <ShowPdfModalComponent
      v-if="toggleshowPDFModal"
      :propToggleshowPDFModal="toggleshowPDFModal"
      :propPDFDetails="PDFDetails"
      @togglePDFModal="fnPDFViewModal"
    />
    <!-- END >> COMPONENT: View PDF -->
    <!-- START >> Inner loader for document section, since values are dynamic  -->
    <q-inner-loading :showing="toggleAjaxLoadFilter">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
    <!-- END >> Inner loader for document section, since values are dynamic  -->
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import _ from 'lodash'
import ShowPdfModalComponent from '../../components/sat/showPdfModalComponent.vue'
import ShowDocumentLeadApproveComponent from '../../components/sat/showDocumentLeadApproveComponent.vue'
import ShowDocumentLeadRejectComponent from '../../components/sat/showDocumentLeadRejectComponent.vue'

export default defineComponent({
  name: 'MerchantDocuments',
  
  props: {
    propMerchantTypeFromSO: {
      type: Object,
      required: true
    }
  },

  components: {
    ShowPdfModalComponent,
    ShowDocumentLeadApproveComponent,
    ShowDocumentLeadRejectComponent
  },

  emits: [
    'emitAjaxLoadShortLeadInfo',
    'emitTriggerComponentHotLoad',
    'emitCookUpKYCdocumentsId'
  ],

  setup(props, { emit }) {
    const store = useStore()
    const route = useRoute()
    const $q = useQuasar()

    // Refs
    const toggleLeadDocumentApproveModal = ref(false)
    const toggleLeadDocumentRejectModal = ref(false)
    const merchantDocumentIds = ref([])
    const toggleAjaxLoadFilter = ref(false)
    const PDFDetails = ref(null)
    const toggleshowPDFModal = ref(false)
    const documentApproveTempArr = ref(null)
    const documentRejectTempArr = ref(null)
    const attachedImageViewer = ref([])
    const multiAttachedImageViewer = ref([])
    const handedOverImageViewer = ref(null)
    const bankUploadedLetter = ref(null)
    const subDocumentUpload = ref(null)

    // Computed properties
    const merchantTypeSelection = computed(() => 
      props.propMerchantTypeFromSO.merchantType.merchantTypeName
    )

    const getToggleCommonLoader = computed(() => 
      store.getters['commonLoader/getToggleCommonLoader']
    )
    
    const GLOBAL_FILE_FETCH_URL = computed(() => 
      store.getters['GlobalVariables/GLOBAL_FILE_FETCH_URL']
    )
    
    const getShortLeadInfo = computed(() => 
      store.getters['SatLeadValidation/getShortLeadInfo']
    )
    
    const getDeviceVerificationStatus = computed(() => 
      store.getters['SatLeadValidation/getDeviceVerificationStatus']
    )
    
    const getShortLeadInfoDocumentTypes = computed(() => 
      store.getters['SatLeadValidation/getShortLeadInfoDocumentTypes']
    )

    // Form data
    const formData = ref({
      shortLead: props.propMerchantTypeFromSO,
      documentType: []
    })

    // Computed properties for filtered arrays
    const filteredLeadDocuments = computed(() => {
      return getShortLeadInfo.value?.leadDocuments || {}
    })

    const displayAttachedFilesByDocumentType = computed(() => {
      const result = {}
      const leadDocuments = getShortLeadInfo.value?.leadDocuments
      
      if (leadDocuments) {
        Object.entries(leadDocuments).forEach(([key, value]) => {
          result[key] = value
        })
      }
      
      return result
    })

    const filteredAttachedSubFiles = computed(() => {
      const result = {}
      const leadDocuments = getShortLeadInfo.value?.leadDocuments
      
      if (leadDocuments) {
        Object.entries(leadDocuments).forEach(([docType, files]) => {
          result[docType] = files || []
        })
      }
      
      return result
    })

    const displayAttachedFilesByMultipleDocument = computed(() => {
      const result = {}
      const leadDocuments = getShortLeadInfo.value?.leadDocuments
      
      if (leadDocuments) {
        Object.entries(leadDocuments).forEach(([key, value]) => {
          result[key] = value
        })
      }
      
      return result
    })

    // Methods
    const TOGGLE_COMMON_LOADER = (value) => 
      store.dispatch('commonLoader/TOGGLE_COMMON_LOADER', value)
    
    const FEED_HAND_OVER_TO_SAT_DOCUMENT = (params) => 
      store.dispatch('SatLeadValidation/FEED_HAND_OVER_TO_SAT_DOCUMENT', params)
    
    const DELETE_DOCUMENT_FROM_BY_SAT = (params) => 
      store.dispatch('SatLeadValidation/DELETE_DOCUMENT_FROM_BY_SAT', params)
    
    const FETCH_LEAD_DOCUMENT_TYPE_DATA = () => 
      store.dispatch('SatLeadValidation/FETCH_LEAD_DOCUMENT_TYPE_DATA')
    
    const FETCH_SHORT_LEAD_DATA = (id) => 
      store.dispatch('SatLeadValidation/FETCH_SHORT_LEAD_DATA', id)

    // Function to load all document types
    const ajaxLoadShortLeadInfoForDocumentTypes = async () => {
      try {
        await FETCH_LEAD_DOCUMENT_TYPE_DATA()
        fnGetMerchantTypeValue(props.propMerchantTypeFromSO.merchantType.merchantTypeName)
        formData.value.documentType = getShortLeadInfoDocumentTypes.value

        emit('emitAjaxLoadShortLeadInfo', 'hotReloadForDocumentsUploadValidation', merchantTypeSelection.value)
      } catch (error) {
        console.error('Error loading document types:', error)
      } finally {
        toggleAjaxLoadFilter.value = false
      }
    }

    // Function to approve document with reason
    const fnDocumentApproveModal = (documentDetails) => {
      toggleLeadDocumentApproveModal.value = !toggleLeadDocumentApproveModal.value
      documentDetails.leadId = route.params.id
      documentApproveTempArr.value = documentDetails
    }

    // Function to reject document with reason
    const fnDocumentRejectModal = (documentDetails) => {
      toggleLeadDocumentRejectModal.value = !toggleLeadDocumentRejectModal.value
      documentDetails.leadId = route.params.id
      documentRejectTempArr.value = documentDetails
    }

    // Function to approve document with reason
    const fnDocumentApproveModalAfterEmit = (leadId) => {
      toggleLeadDocumentApproveModal.value = !toggleLeadDocumentApproveModal.value
      emit('emitTriggerComponentHotLoad', leadId)
    }

    // Function to reject document with reason
    const fnDocumentRejectModalAfterEmit = (leadId) => {
      toggleLeadDocumentRejectModal.value = !toggleLeadDocumentRejectModal.value
      emit('emitTriggerComponentHotLoad', leadId)
    }

    // Function to populate single/multiple documents
    const fnGetMerchantTypeValue = (inputValue) => {
      TOGGLE_COMMON_LOADER(true)
      
      const merchantDocumentCategory = _.find(
        getShortLeadInfoDocumentTypes.value,
        o => o.merchantType === inputValue
      )

      const arr = {
        forSingleDocument: [],
        forMutipleDocument: []
      }

      const leadDocuments = getShortLeadInfo.value.leadDocuments

      // Function to get all applicable documents from queue
      merchantDocumentCategory.documentsApplicable.forEach((value) => {
        // Condition for single document type
        if (value.viewType == 1) {
          const assumeArr = []
          
          value.documents.forEach((subValue) => {
            if (subValue.documentType in leadDocuments) {
              const assumeArrForChecksum = _.find(
                leadDocuments[value.documentType],
                (oo) => oo.subDocumentType == subValue.subDocumentType
              )

              if (assumeArrForChecksum) {
                // Get verified status and place to the parent
                subValue.verifiedStatus = assumeArrForChecksum.documentVerifiedStatus

                /* Start >> Setting isKycChecked flag for kyc checkbox */
                if (
                  (assumeArrForChecksum.documentVerifiedStatus == 1 ||
                    assumeArrForChecksum.documentVerifiedStatus == 2) &&
                  assumeArrForChecksum.kycException == true
                ) {
                  merchantDocumentIds.value.push(subValue.id)
                  subValue.isKycChecked = true
                } else {
                  subValue.isKycChecked = false
                }
                /* END >> Setting isKycChecked flag for kyc checkbox */

                /* START >> Setting reprocess flag for kyc checkbox */
                if (assumeArrForChecksum.reprocess == true) {
                  subValue.reprocess = true
                  subValue.currentDocumentId = assumeArrForChecksum.id
                } else {
                  subValue.reprocess = false
                }
                /* END >> Setting reprocess flag for kyc checkbox */
              } else {
                subValue.isKycChecked = false
                subValue.reprocess = false
              }
            } else {
              subValue.isKycChecked = false
              subValue.reprocess = false
            }
            assumeArr.push(subValue)
          })
          
          value.documents = assumeArr
          arr.forSingleDocument.push(value)
        } else {
          // Condition for multiple document type
          if (value.documentType in leadDocuments) {
            const assumeArr = _.find(value.documents, (oo) => {
              if (
                Object.prototype.hasOwnProperty.call(leadDocuments, oo.documentType) &&
                (oo.subDocumentType ==
                  leadDocuments[oo.documentType][0].subDocumentType ||
                  leadDocuments[oo.documentType][0].documentType ==
                    leadDocuments[oo.documentType][0].subDocumentType)
              ) {
                return oo.documentType
              }
              return false
            })

            if (assumeArr) {
              // Get verified status and place to the parent
              value.verifiedStatus = leadDocuments[assumeArr.documentType][0].documentVerifiedStatus

              /* START >> Set reprocess flag dynamically */
              if (leadDocuments[assumeArr.documentType][0].reprocess == true) {
                value.reprocess = true
              } else {
                value.reprocess = false
              }
              /* END >> Set reprocess flag dynamically */

              /* START >> Set isKycChecked flag dynamically */
              if (leadDocuments[assumeArr.documentType][0].kycException == true) {
                merchantDocumentIds.value.push(value.id)
                value.isKycChecked = true
              } else {
                value.isKycChecked = false
              }
              /* END >> Set isKycChecked flag dynamically */

              value.subDocumentTypeSelection = assumeArr
            } else {
              /* START >> Dropdown default value setup */
              value.subDocumentTypeSelection = 0
              value.reprocess = false
              value.isKycChecked = false
              /* END >> Dropdown default value setup */
            }
          } else {
            value.subDocumentTypeSelection = 0
            value.reprocess = false
            value.isKycChecked = false
          }

          arr.forMutipleDocument.push(value)
        }
      })

      // Update the store with uploaded documents
      const updatedDocumentTypes = {
        ...getShortLeadInfoDocumentTypes.value,
        uploadedDocuments: arr
      }
      
      store.commit('SatLeadValidation/SET_SHORT_LEAD_INFO_DOCUMENT_TYPES', updatedDocumentTypes)
      
      emit('emitCookUpKYCdocumentsId', merchantDocumentIds.value)
      TOGGLE_COMMON_LOADER(false)
    }

    // Function to populate sub document types
    const fnGetSubDocuments = (documentDetails) => {
      if (documentDetails && typeof documentDetails === 'object') {
        if (
          Object.prototype.hasOwnProperty.call(documentDetails, 'selectedSubDocumentType') &&
          typeof documentDetails.selectedSubDocumentType !== 'undefined'
        ) {
          documentDetails.selectedSubDocumentType = documentDetails.subDocumentType
        } else {
          documentDetails.selectedSubDocumentType = documentDetails.subDocumentType
        }
      }
    }

    const fnVerificationDocumentUpload = async (event, documentDetails, multipleDocument) => {
      if (documentDetails == 0) {
        $q.notify({
          color: 'primary',
          position: 'bottom',
          message: 'Select a document type to upload documents for ' + multipleDocument.documentType,
          icon: 'info'
        })
        return
      }

      $q.loading.show({
        delay: 0,
        spinnerColor: 'purple-9',
        message: 'Uploading ..'
      })

      const formData = new FormData()
      formData.append('file', event.target.files[0])

      try {
        await FEED_HAND_OVER_TO_SAT_DOCUMENT({
          files: formData,
          leadId: route.params.id,
          documentId: documentDetails.id
        })
        $q.loading.hide()
        emit(
          'emitAjaxLoadShortLeadInfo',
          'hotReloadForDocumentsUploadValidation',
          merchantTypeSelection.value
        )
      } catch (error) {
        console.error('Error uploading document:', error)
        $q.loading.hide()
        $q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'Failed to upload document',
          icon: 'thumb_down'
        })
      }
    }

    const fnUploadApplicationForm = async (event) => {
      $q.loading.show({
        delay: 0,
        spinnerColor: 'purple-9',
        message: 'Uploading file ..'
      })

      const formDataObj = new FormData()
      formDataObj.append('file', event.target.files[0])

      try {
        // Note: FEED_FULL_APPLICATION_FORM is not defined in the original code
        // You'll need to import and use the correct action
        // await store.dispatch('SatLeadValidation/FEED_FULL_APPLICATION_FORM', {
        //   files: formDataObj,
        //   leadId: route.params.id
        // })
        $q.loading.hide()
        emit(
          'emitAjaxLoadShortLeadInfo',
          'hotReloadForDocumentsUploadValidation',
          merchantTypeSelection.value
        )
      } catch (error) {
        console.error('Error uploading application form:', error)
        $q.loading.hide()
        $q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'Failed to upload document',
          icon: 'thumb_down'
        })
      }
    }

    const fnVerificationDocumentUploadSingleUpload = async (event, documentDetails) => {
      $q.loading.show({
        delay: 0,
        spinnerColor: 'purple-9',
        message: 'Uploading file ..'
      })

      const formDataObj = new FormData()
      formDataObj.append('file', event.target.files[0])

      try {
        await FEED_HAND_OVER_TO_SAT_DOCUMENT({
          files: formDataObj,
          leadId: route.params.id,
          documentId: documentDetails.id
        })
        $q.loading.hide()
        emit(
          'emitAjaxLoadShortLeadInfo',
          'hotReloadForDocumentsUploadValidation',
          merchantTypeSelection.value
        )
      } catch (error) {
        console.error('Error uploading single document:', error)
        $q.loading.hide()
        $q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'Failed to upload document',
          icon: 'thumb_down'
        })
      }
    }

    const fnDeleteAlreadyAttachedFile = async (documentDetails) => {
      $q.dialog({
        title: 'Confirm',
        message: 'Are you sure want to delete uploaded document?',
        ok: {
          label: 'Continue',
          color: 'primary'
        },
        cancel: {
          label: 'Cancel',
          color: 'negative'
        }
      }).then(async () => {
        $q.loading.show({
          delay: 0,
          spinnerColor: 'purple-9',
          message: 'Processing ..'
        })

        try {
          await DELETE_DOCUMENT_FROM_BY_SAT(documentDetails)
          await FETCH_SHORT_LEAD_DATA(route.params.id)
          $q.loading.hide()
          emit(
            'emitAjaxLoadShortLeadInfo',
            'hotReloadForDocumentsUploadValidation',
            merchantTypeSelection.value
          )
          $q.notify({
            color: 'positive',
            position: 'bottom',
            message: 'Successfully removed!',
            icon: 'thumb_up'
          })
        } catch (error) {
          console.error('Error deleting document:', error)
          $q.loading.hide()
          $q.notify({
            color: 'negative',
            position: 'bottom',
            message: error.message || 'Please Try Again Later!',
            icon: 'thumb_down'
          })
        }
      }).catch(() => {
        $q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'No changes made!',
          icon: 'thumb_down'
        })
      })
    }

    const computeAndToggleCheckboxForSingleDocument = (currentSelection) => {
      const leadDocuments = getShortLeadInfo.value.leadDocuments
      if (
        Object.prototype.hasOwnProperty.call(leadDocuments, currentSelection.documentType) &&
        leadDocuments[currentSelection.documentType].length > 1
      ) {
        return _.find(
          leadDocuments[currentSelection.documentType],
          (oo) => {
            return oo.uploadedDocuments.length > 0 &&
              oo.subDocumentType == currentSelection.subDocumentType
              ? true
              : false
          }
        )
      } else {
        return Object.prototype.hasOwnProperty.call(leadDocuments, currentSelection.documentType)
          ? leadDocuments[currentSelection.documentType][0].uploadedDocuments.length > 0 &&
            leadDocuments[currentSelection.documentType][0].subDocumentType ==
              currentSelection.subDocumentType
            ? true
            : false
          : false
      }
    }

    const computeAndToggleCheckbox = (currentSelection) => {
      const leadDocuments = getShortLeadInfo.value.leadDocuments
      return Object.prototype.hasOwnProperty.call(leadDocuments, currentSelection.documentType)
        ? leadDocuments[currentSelection.documentType][0].uploadedDocuments.length > 0 &&
          leadDocuments[currentSelection.documentType][0].subDocumentType ==
            currentSelection.subDocumentTypeSelection.subDocumentType
          ? true
          : false
        : false
    }

    const fnCookKYCdocumentArr = (document) => {
      const findIndex = merchantDocumentIds.value.indexOf(document.id)
      if (findIndex == -1) {
        merchantDocumentIds.value.push(document.id)
      } else {
        merchantDocumentIds.value.splice(findIndex, 1)
      }
      emit('emitCookUpKYCdocumentsId', merchantDocumentIds.value)
    }

    const fnViewHandedOverFileImage = () => {
      if (handedOverImageViewer.value) {
        handedOverImageViewer.value.click()
      }
    }

    const fnViewbankUploadedLetterImage = () => {
      if (bankUploadedLetter.value) {
        bankUploadedLetter.value.click()
      }
    }

    const fnViewAttachedFileImage = (attachedImageIndex) => {
      if (attachedImageViewer.value[attachedImageIndex]) {
        attachedImageViewer.value[attachedImageIndex].click()
      }
    }

    const fnViewMultiAttachedFileImage = (attachedImageIndex) => {
      if (multiAttachedImageViewer.value[attachedImageIndex]) {
        multiAttachedImageViewer.value[attachedImageIndex].click()
      }
    }

    const fnPDFViewModal = (documentUrl) => {
      PDFDetails.value = documentUrl
      toggleshowPDFModal.value = !toggleshowPDFModal.value
    }

    const fnShowDisabledMessageForFileUpload = (singleDocument, item) => {
      if (item) {
        if (singleDocument.viewType == 1) {
          $q.notify({
            color: 'primary',
            position: 'bottom',
            message: singleDocument.subDocumentType + ' is marked as KYC.',
            icon: 'info'
          })
        } else {
          $q.notify({
            color: 'primary',
            position: 'bottom',
            message: singleDocument.documentType + ' is marked as KYC.',
            icon: 'info'
          })
        }
      }
    }

    const computedGetSingleDocumentAccessForStatus = (item) => {
      let valueToBeReturned = false
      const selectDocumentByDocumentType = getShortLeadInfo.value.leadDocuments[item.documentType]
      
      if (selectDocumentByDocumentType) {
        const findSubDocument = _.find(selectDocumentByDocumentType, (oo) => {
          return (
            oo.subDocumentType == item.subDocumentType &&
            (oo.documentVerifiedStatus == 1 || oo.documentVerifiedStatus == 3)
          )
        })

        if (findSubDocument && findSubDocument.uploadedDocuments.length > 0) {
          valueToBeReturned = true
        }
      }
      
      return valueToBeReturned
    }

    const computedGetAccess = (item) => {
      const leadDocuments = getShortLeadInfo.value.leadDocuments
      return Object.prototype.hasOwnProperty.call(leadDocuments, item.documentType) &&
        leadDocuments[item.documentType][0].documentVerifiedStatus == 2 &&
        leadDocuments[item.documentType][0].uploadedDocuments.length > 0
    }

    const checkSumForDocumentVerificationStatus = (documentDetails) => {
      return _.find(
        getShortLeadInfo.value.leadDocuments[documentDetails.documentType],
        (oo) => oo.subDocumentType == documentDetails.subDocumentType
      )
    }

    // Lifecycle
    onMounted(() => {
      ajaxLoadShortLeadInfoForDocumentTypes()
    })

    return {
      // Refs
      toggleLeadDocumentApproveModal,
      toggleLeadDocumentRejectModal,
      merchantDocumentIds,
      toggleAjaxLoadFilter,
      PDFDetails,
      toggleshowPDFModal,
      documentApproveTempArr,
      documentRejectTempArr,
      attachedImageViewer,
      multiAttachedImageViewer,
      handedOverImageViewer,
      bankUploadedLetter,
      subDocumentUpload,

      // Computed
      merchantTypeSelection,
      getToggleCommonLoader,
      GLOBAL_FILE_FETCH_URL,
      getShortLeadInfo,
      getDeviceVerificationStatus,
      getShortLeadInfoDocumentTypes,
      filteredLeadDocuments,
      displayAttachedFilesByDocumentType,
      filteredAttachedSubFiles,
      displayAttachedFilesByMultipleDocument,

      // Methods
      fnDocumentApproveModal,
      fnDocumentRejectModal,
      fnDocumentApproveModalAfterEmit,
      fnDocumentRejectModalAfterEmit,
      fnGetMerchantTypeValue,
      fnGetSubDocuments,
      fnVerificationDocumentUpload,
      fnUploadApplicationForm,
      fnVerificationDocumentUploadSingleUpload,
      fnDeleteAlreadyAttachedFile,
      computeAndToggleCheckboxForSingleDocument,
      computeAndToggleCheckbox,
      fnCookKYCdocumentArr,
      fnViewHandedOverFileImage,
      fnViewbankUploadedLetterImage,
      fnViewAttachedFileImage,
      fnViewMultiAttachedFileImage,
      fnPDFViewModal,
      fnShowDisabledMessageForFileUpload,
      computedGetSingleDocumentAccessForStatus,
      computedGetAccess,
      checkSumForDocumentVerificationStatus
    }
  }
})
</script>

<style scoped>
.customQuasarSelect {
  padding: 5px;
  border: 1px solid rgb(140, 140, 140);
}

label {
  padding: 5px 10px;
  display: table;
}

input[type="file"] {
  display: none;
}

.bg-dark-custom {
  background: rgba(0, 0, 0, 0.5);
}

.document-item {
  border: 1px solid #afafaf;
  margin: 5px;
}

.wrapWord {
  word-wrap: break-word;
}

.hidden {
  display: none;
}
</style>