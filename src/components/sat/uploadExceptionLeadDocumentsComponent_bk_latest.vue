<template>
  <div>
    <!-- START >> (Default) Merchant type  -->
    <q-item class="q-body-1" separator>
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
        <q-item class="q-body-1 text-dark bg-grey-4 text-weight-medium" separator>
          <q-item-section>Application Form</q-item-section>
          <q-item-section side>
            <label class="cursor-pointer text-white" style="background-color: #202c3f;">
              <span class="q-caption text-weight-light">Attach</span>
              <input
                type="file"
                name="file"
                @change="fnUploadApplicationForm($event)"
                accept=".png, .jpg, .pdf"
              />
            </label>
          </q-item-section>
        </q-item>
        <q-item class="q-body-1" separator>
          <q-item-section>
            <div class="full-width">
              <div
                class="cursor-pointer"
                v-if="getShortLeadInfo.applicationFileMimeType.includes('pdf')"
              >
                <div @click="fnPDFViewModal(getShortLeadInfo.applicationFile)">
                  <q-btn round size="sm" icon="fas fa-file-pdf" color="primary" />
                  &nbsp;{{ getShortLeadInfo.applicationFile }}
                </div>
              </div>
              <div
                class="cursor-pointer"
                v-else-if="getShortLeadInfo.applicationFileMimeType.includes('image')"
              >
                <viewer
                  :images="[GLOBAL_FILE_FETCH_URL + '/' + getShortLeadInfo.applicationFile]"
                  class="hidden"
                >
                  <img
                    :src="GLOBAL_FILE_FETCH_URL + '/' + getShortLeadInfo.applicationFile"
                    ref="handedOverImageViewer"
                    style="max-width:100%"
                  />
                </viewer>
                <div @click="fnViewHandedOverFileImage()">
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
        <q-list-header class="bg-grey-4">Bank Letter</q-list-header>
        <q-item class="q-body-1" separator>
          <q-item-section>
            <div class="full-width">
              <div
                class="cursor-pointer"
                v-if="getShortLeadInfo.paymentDocumentMimeType.includes('pdf')"
              >
                <div @click="fnPDFViewModal(getShortLeadInfo.paymentDocumentFile)">
                  <q-btn round size="sm" icon="fas fa-file-pdf" color="primary" />
                  &nbsp;{{ getShortLeadInfo.paymentDocumentFile }}
                </div>
              </div>
              <div
                class="cursor-pointer"
                v-else-if="getShortLeadInfo.paymentDocumentMimeType.includes('image')"
              >
                <viewer
                  :images="[GLOBAL_FILE_FETCH_URL + '/' + getShortLeadInfo.paymentDocumentFile]"
                  class="hidden"
                >
                  <img
                    :src="GLOBAL_FILE_FETCH_URL + '/' + getShortLeadInfo.paymentDocumentFile"
                    ref="bankUploadedLetter"
                    style="max-width:100%"
                  />
                </viewer>
                <div @click="fnViewBankUploadedLetterImage()">
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
      <template v-if="getShortLeadInfoDocumentTypes?.uploadedDocuments?.forSingleDocument">
        <q-list
          v-for="(singleDocument, singleDocumentIndex) in getShortLeadInfoDocumentTypes.uploadedDocuments.forSingleDocument"
          :key="singleDocumentIndex"
          class="no-padding"
          separator
        >
          <q-list-header class="bg-grey-4">{{ singleDocument.documentType }}</q-list-header>
          <div
            v-for="(document, documentIndex) in singleDocument.documents"
            :key="documentIndex"
            class="single-document-container"
            style="border:1px solid #afafaf;margin:5px"
          >
            <q-item
              class="q-body-1 q-pa-sm text-dark text-weight-medium bottom-border"
              :class="[document.isKycChecked ? 'bg-amber-4' : '']"
              separator
            >
              <q-item-section avatar v-if="!document.reprocess && document.verifiedStatus != 1">
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
                  v-if="checkSumForDocumentVerificationStatus(document)?.documentVerifiedStatus == 1"
                  class="q-body-1 text-weight-medium text-positive"
                  >Approved</span
                >
                <span
                  v-if="checkSumForDocumentVerificationStatus(document)?.documentVerifiedStatus == 3"
                  class="q-body-1 text-weight-medium text-negative"
                  >Rejected</span
                >
              </q-item-section>
            </q-item>
            <div v-if="displayAttachedFilesByDocumentType[document.documentType]">
              <div
                v-for="attachedSubFile in displayAttachedFilesByDocumentType[document.documentType]"
                :key="attachedSubFile.id"
              >
                <div v-if="attachedSubFile.subDocumentType == document.subDocumentType">
                  <q-item
                    v-for="(filesAttachedEarlier, filesAttachedEarlierIndex) in attachedSubFile.uploadedDocuments"
                    :key="filesAttachedEarlierIndex"
                    class="q-body-1"
                    separator
                  >
                    <q-item-section>
                      <div class="q-body-1">
                        <div
                          class="cursor-pointer wrapWord"
                          v-if="filesAttachedEarlier.mimeType.includes('pdf')"
                        >
                          <div @click="fnPDFViewModal(filesAttachedEarlier.fileName)">
                            <q-icon name="fas fa-file-pdf" color="negative" />
                            &nbsp;{{ filesAttachedEarlier.fileName }}
                          </div>
                        </div>
                        <div
                          class="cursor-pointer wrapWord"
                          v-else-if="filesAttachedEarlier.mimeType.includes('image')"
                        >
                          <viewer
                            :images="[GLOBAL_FILE_FETCH_URL + '/' + filesAttachedEarlier.fileName]"
                            class="hidden"
                          >
                            <img
                              :src="GLOBAL_FILE_FETCH_URL + '/' + filesAttachedEarlier.fileName"
                              :ref="
                                (el) => {
                                  if (el) attachedImageViewerRefs[filesAttachedEarlierIndex] = el;
                                }
                              "
                              style="max-width:100%"
                            />
                          </viewer>
                          <div @click="fnViewAttachedFileImage(filesAttachedEarlierIndex)">
                            <q-icon name="fas fa-image" color="amber-9" />
                            &nbsp;{{ filesAttachedEarlier.fileName }}
                          </div>
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
      <template v-if="getShortLeadInfoDocumentTypes?.uploadedDocuments?.forMutipleDocument">
        <q-list
          v-for="multipleDocument in getShortLeadInfoDocumentTypes.uploadedDocuments.forMutipleDocument"
          :key="multipleDocument.id"
          class="no-padding"
          dense
        >
          <q-list-header
            class="multiple-document-header"
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
                <span v-if="computedGetAccess(multipleDocument)" style="text-align: right">
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
                <span v-else style="text-align: right">
                  <span
                    v-if="
                      getShortLeadInfo.leadDocuments[multipleDocument.documentType]?.[0]
                        ?.documentVerifiedStatus == 1
                    "
                    class="q-body-1 text-weight-medium text-positive"
                    >Approved</span
                  >
                  <span
                    v-if="
                      getShortLeadInfo.leadDocuments[multipleDocument.documentType]?.[0]
                        ?.documentVerifiedStatus == 3
                    "
                    class="q-body-1 text-weight-medium text-negative"
                    >Rejected</span
                  >
                </span>
              </div>
            </div>
          </q-list-header>
          <div>
            <q-item class="q-body-1 q-pa-sm group" separator>
              <q-item-section>
                <q-select
                  :disable="
                    multipleDocument.isKycChecked ||
                    multipleDocument.reprocess ||
                    multipleDocument.verifiedStatus == 1
                  "
                  class="full-width"
                  v-model="multipleDocument.subDocumentTypeSelection"
                  :options="multipleDocument.documents"
                  option-label="subDocumentType"
                  option-value="id"
                  emit-value
                  map-options
                  label="Choose from below"
                  @update:model-value="fnGetSubDocuments(multipleDocument.subDocumentTypeSelection)"
                />
              </q-item-section>
              <!-- START >> Will be displayed if reprocess key => false -->
              <div v-if="!multipleDocument.reprocess && multipleDocument.verifiedStatus != 1">
                <q-item-section side v-if="!multipleDocument.isKycChecked">
                  <label
                    class="cursor-pointer text-white"
                    style="background-color: #202c3f;"
                    @click="
                      fnShowDisabledMessageForFileUpload(multipleDocument, multipleDocument.isKycChecked)
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
          <div v-if="displayAttachedFilesByMultipleDocument[multipleDocument.documentType]">
            <div 
              v-for="attachedSubFile in displayAttachedFilesByMultipleDocument[multipleDocument.documentType]" 
              :key="attachedSubFile.id"
            >
              <q-item
                v-for="(filesAttachedEarlier, filesAttachedEarlierIndex) in attachedSubFile.uploadedDocuments"
                :key="filesAttachedEarlierIndex"
                class="q-body-1"
                separator
              >
                <q-item-section>
                  <div class="q-body-1">
                    <div
                      class="cursor-pointer wrapWord"
                      v-if="filesAttachedEarlier.mimeType.includes('pdf')"
                    >
                      <div @click="fnPDFViewModal(filesAttachedEarlier.fileName)">
                        <q-icon name="fas fa-file-pdf" color="negative" />
                        &nbsp;{{ filesAttachedEarlier.fileName }}
                      </div>
                    </div>
                    <div
                      class="cursor-pointer wrapWord"
                      v-else-if="filesAttachedEarlier.mimeType.includes('image')"
                    >
                      <viewer
                        :images="[GLOBAL_FILE_FETCH_URL + '/' + filesAttachedEarlier.fileName]"
                        class="hidden"
                      >
                        <img
                          :src="GLOBAL_FILE_FETCH_URL + '/' + filesAttachedEarlier.fileName"
                          :ref="
                            (el) => {
                              if (el) multiAttachedImageViewerRefs[filesAttachedEarlierIndex] = el;
                            }
                          "
                          style="max-width:100%"
                        />
                      </viewer>
                      <div @click="fnViewMultiAttachedFileImage(filesAttachedEarlierIndex)">
                        <q-icon name="fas fa-image" color="amber-9" />
                        &nbsp;{{ filesAttachedEarlier.fileName }}
                      </div>
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
    <show-document-lead-approve-component
      v-if="toggleLeadDocumentApproveModal"
      :prop-toggle-document-approve-modal="toggleLeadDocumentApproveModal"
      :prop-document-details="documentApproveTempArr"
      @toggle-document-modal="fnDocumentApproveModalAfterEmit"
    />
    <!-- END >> COMPONENT: Document approve -->
    <!-- START >> COMPONENT: Document reject  -->
    <show-document-lead-reject-component
      v-if="toggleLeadDocumentRejectModal"
      :prop-toggle-document-reject-modal="toggleLeadDocumentRejectModal"
      :prop-document-details="documentRejectTempArr"
      @toggle-document-modal="fnDocumentRejectModalAfterEmit"
    />
    <!-- END >> COMPONENT: Document reject -->
    <!-- START >> COMPONENT: View PDF  -->
    <show-pdf-modal-component
      v-if="toggleshowPDFModal"
      :prop-toggleshow-p-d-f-modal="toggleshowPDFModal"
      :prop-p-d-f-details="PDFDetails"
      @toggle-p-d-f-modal="fnPDFViewModal"
    />
    <!-- END >> COMPONENT: View PDF -->
    <!-- START >> Inner loader for document section, since values are dynamic  -->
    <q-inner-loading :showing="toggleAjaxLoadFilter">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
    <!-- END >> Inner loader for document section, since values are dynamic  -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import {  useCommonLoaderStore  } from '../../stores/commonLoader';
import {  useGlobalVariablesStore  } from '../../stores/GlobalVariables';
import {  useSatLeadValidationStore  } from '../../stores/SatLeadValidation';
import { find } from 'lodash-es';
import ShowPdfModalComponent from '../../components/sat/ShowPdfModalComponent.vue';
import ShowDocumentLeadApproveComponent from '../../components/sat/ShowDocumentLeadApproveComponent.vue';
import ShowDocumentLeadRejectComponent from '../../components/sat/ShowDocumentLeadRejectComponent.vue';

// Props
const props = defineProps({
  propMerchantTypeFromSO: {
    type: Object,
    required: true,
  },
});

// Emits
const emit = defineEmits([
  'emitAjaxLoadShortLeadInfo',
  'emitCookUpKYCdocumentsId',
  'emitTriggerComponentHotLoad',
]);

// Quasar
const $q = useQuasar();
const route = useRoute();

// Stores
const commonLoaderStore = useCommonLoaderStore();
const globalVariablesStore = useGlobalVariablesStore();
const satLeadValidationStore = useSatLeadValidationStore();

// Store refs
const { GLOBAL_FILE_FETCH_URL } = storeToRefs(globalVariablesStore);
const {
  getShortLeadInfo,
  getShortLeadInfoDocumentTypes,
} = storeToRefs(satLeadValidationStore);

// Store actions
const { TOGGLE_COMMON_LOADER } = commonLoaderStore;
const {
  FEED_HAND_OVER_TO_SAT_DOCUMENT,
  DELETE_DOCUMENT_FROM_BY_SAT,
  FETCH_LEAD_DOCUMENT_TYPE_DATA,
  FETCH_SHORT_LEAD_DATA,
} = satLeadValidationStore;

// Refs
const toggleLeadDocumentApproveModal = ref(false);
const toggleLeadDocumentRejectModal = ref(false);
const merchantDocumentIds = ref([]);
const toggleAjaxLoadFilter = ref(false);
const PDFDetails = ref(null);
const toggleshowPDFModal = ref(false);
const attachedImageViewerRefs = ref([]);
const multiAttachedImageViewerRefs = ref([]);
const handedOverImageViewer = ref(null);
const bankUploadedLetter = ref(null);
const documentApproveTempArr = ref(null);
const documentRejectTempArr = ref(null);
const subDocumentUpload = ref(null);

// Form data
const formData = ref({
  shortLead: props.propMerchantTypeFromSO,
  documentType: [],
});

const merchantTypeSelection = computed(
  () => props.propMerchantTypeFromSO.merchantType.merchantTypeName
);

// Computed properties for filtered arrays
const displayAttachedFilesByDocumentType = computed(() => {
  const result = {};
  const leadDocuments = getShortLeadInfo.value?.leadDocuments;
  
  if (leadDocuments) {
    Object.entries(leadDocuments).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        result[key] = value;
      }
    });
  }
  
  return result;
});

const displayAttachedFilesByMultipleDocument = computed(() => {
  const result = {};
  const leadDocuments = getShortLeadInfo.value?.leadDocuments;
  
  if (leadDocuments) {
    Object.entries(leadDocuments).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        result[key] = value;
      }
    });
  }
  
  return result;
});


// Methods
const computedGetSingleDocumentAccessForStatus = (item) => {
  const selectDocumentByDocumentType = getShortLeadInfo.value?.leadDocuments?.[item.documentType];
  if (!selectDocumentByDocumentType) return false;

  const findSubDocument = find(selectDocumentByDocumentType, (oo) => {
    return (
      oo.subDocumentType == item.subDocumentType &&
      (oo.documentVerifiedStatus == 1 || oo.documentVerifiedStatus == 3)
    );
  });

  return findSubDocument != undefined && findSubDocument.uploadedDocuments.length > 0;
};

const computedGetAccess = (item) => {
  const leadDocuments = getShortLeadInfo.value?.leadDocuments;
  if (!leadDocuments) return false;

  return Object.prototype.hasOwnProperty.call(leadDocuments, item.documentType) &&
    leadDocuments[item.documentType]?.[0]?.documentVerifiedStatus == 2 &&
    leadDocuments[item.documentType]?.[0]?.uploadedDocuments.length > 0;
};

const ajaxLoadShortLeadInfoForDocumentTypes = async () => {
  try {
    await FETCH_LEAD_DOCUMENT_TYPE_DATA();
    fnGetMerchantTypeValue(props.propMerchantTypeFromSO.merchantType.merchantTypeName);
    formData.value.documentType = getShortLeadInfoDocumentTypes.value;
    emit('emitAjaxLoadShortLeadInfo', 'hotReloadForDocumentsUploadValidation', merchantTypeSelection.value);
    toggleAjaxLoadFilter.value = false;
  } catch (error) {
    console.error('Error loading document types:', error);
    toggleAjaxLoadFilter.value = false;
  }
};

const fnDocumentApproveModal = (documentDetails) => {
  toggleLeadDocumentApproveModal.value = !toggleLeadDocumentApproveModal.value;
  documentDetails.leadId = route.params.id;
  documentApproveTempArr.value = documentDetails;
};

const fnDocumentRejectModal = (documentDetails) => {
  toggleLeadDocumentRejectModal.value = !toggleLeadDocumentRejectModal.value;
  documentDetails.leadId = route.params.id;
  documentRejectTempArr.value = documentDetails;
};

const fnDocumentApproveModalAfterEmit = (leadId) => {
  toggleLeadDocumentApproveModal.value = !toggleLeadDocumentApproveModal.value;
  emit('emitTriggerComponentHotLoad', leadId);
};

const fnDocumentRejectModalAfterEmit = (leadId) => {
  toggleLeadDocumentRejectModal.value = !toggleLeadDocumentRejectModal.value;
  emit('emitTriggerComponentHotLoad', leadId);
};

const fnGetMerchantTypeValue = (inputValue) => {
  TOGGLE_COMMON_LOADER(true);
  
  const merchantDocumentCategory = find(
    getShortLeadInfoDocumentTypes.value,
    (o) => o.merchantType === inputValue
  );

  if (!merchantDocumentCategory) {
    TOGGLE_COMMON_LOADER(false);
    return;
  }

  const arr = {
    forSingleDocument: [],
    forMutipleDocument: [],
  };

  const leadDocuments = getShortLeadInfo.value?.leadDocuments || {};

  merchantDocumentCategory.documentsApplicable.forEach((value) => {
    if (value.viewType == 1) {
      const assumeArr = [];
      value.documents.forEach((subValue) => {
        if (leadDocuments && Object.prototype.hasOwnProperty.call(leadDocuments, subValue.documentType)) {
          const assumeArrForChecksum = find(leadDocuments[value.documentType], (oo) => {
            return oo.subDocumentType == subValue.subDocumentType;
          });

          if (assumeArrForChecksum != undefined) {
            subValue.verifiedStatus = assumeArrForChecksum.documentVerifiedStatus;
          }

          if (
            assumeArrForChecksum != undefined &&
            (assumeArrForChecksum.documentVerifiedStatus == 1 ||
              assumeArrForChecksum.documentVerifiedStatus == 2) &&
            assumeArrForChecksum.kycException == true
          ) {
            merchantDocumentIds.value.push(subValue.id);
            subValue.isKycChecked = true;
          } else {
            subValue.isKycChecked = false;
          }

          if (assumeArrForChecksum != undefined && assumeArrForChecksum.reprocess == true) {
            subValue.reprocess = true;
            subValue.currentDocumentId = assumeArrForChecksum.id;
          } else {
            subValue.reprocess = false;
          }
        } else {
          subValue.isKycChecked = false;
          subValue.reprocess = false;
        }
        assumeArr.push(subValue);
      });
      value.documents = assumeArr;
      arr.forSingleDocument.push(value);
    } else {
      if (leadDocuments && Object.prototype.hasOwnProperty.call(leadDocuments, value.documentType)) {
        const assumeArr = find(value.documents, (oo) => {
          if (
            Object.prototype.hasOwnProperty.call(leadDocuments, oo.documentType) &&
            leadDocuments[oo.documentType]?.[0] &&
            (oo.subDocumentType == leadDocuments[oo.documentType][0].subDocumentType ||
              leadDocuments[oo.documentType][0].documentType ==
                leadDocuments[oo.documentType][0].subDocumentType)
          ) {
            return oo.documentType;
          }
          return false;
        });

        if (assumeArr != undefined) {
          value.verifiedStatus =
            leadDocuments[assumeArr.documentType][0].documentVerifiedStatus;

          if (leadDocuments[assumeArr.documentType][0].reprocess == true) {
            value.reprocess = true;
          } else {
            value.reprocess = false;
          }

          if (leadDocuments[assumeArr.documentType][0].kycException == true) {
            merchantDocumentIds.value.push(value.id);
            value.isKycChecked = true;
          } else {
            value.isKycChecked = false;
          }
          value.subDocumentTypeSelection = assumeArr;
        } else {
          value.subDocumentTypeSelection = 0;
          value.reprocess = false;
          value.isKycChecked = false;
        }
      } else {
        value.subDocumentTypeSelection = 0;
        value.reprocess = false;
        value.isKycChecked = false;
      }

      arr.forMutipleDocument.push(value);
    }
  });

  getShortLeadInfoDocumentTypes.value.uploadedDocuments = arr;
  emit('emitCookUpKYCdocumentsId', merchantDocumentIds.value);
  TOGGLE_COMMON_LOADER(false);
};

const fnGetSubDocuments = (documentDetails) => {
  if (documentDetails && typeof documentDetails === 'object') {
    if (
      Object.prototype.hasOwnProperty.call(documentDetails, 'selectedSubDocumentType') &&
      typeof documentDetails.selectedSubDocumentType !== 'undefined'
    ) {
      documentDetails.selectedSubDocumentType = documentDetails.subDocumentType;
    } else {
      documentDetails.selectedSubDocumentType = documentDetails.subDocumentType;
    }
  }
};

const fnVerificationDocumentUpload = async (event, documentDetails, multipleDocument) => {
  if (documentDetails == 0) {
    $q.notify({
      color: 'primary',
      position: 'bottom',
      message:
        'Select a document type to upload documents for ' + multipleDocument.documentType,
      icon: 'info',
    });
    return;
  }

  TOGGLE_COMMON_LOADER(true);
  const formData = new FormData();
  formData.append('file', event.target.files[0]);

  try {
    await FEED_HAND_OVER_TO_SAT_DOCUMENT({
      files: formData,
      leadId: route.params.id,
      documentId: documentDetails.id,
    });
    emit(
      'emitAjaxLoadShortLeadInfo',
      'hotReloadForDocumentsUploadValidation',
      merchantTypeSelection.value
    );
  } catch (error) {
    console.error('Error uploading document:', error);
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Failed to upload document',
      icon: 'thumb_down',
    });
  } finally {
    TOGGLE_COMMON_LOADER(false);
  }
};

const fnUploadApplicationForm = async (event) => {
  TOGGLE_COMMON_LOADER(true);
  const formDataObj = new FormData();
  formDataObj.append('file', event.target.files[0]);

  try {
    // Note: FEED_FULL_APPLICATION_FORM needs to be defined in your store
    // await store.dispatch('SatLeadValidation/FEED_FULL_APPLICATION_FORM', {
    //   files: formDataObj,
    //   leadId: route.params.id
    // });
    emit(
      'emitAjaxLoadShortLeadInfo',
      'hotReloadForDocumentsUploadValidation',
      merchantTypeSelection.value
    );
  } catch (error) {
    console.error('Error uploading application form:', error);
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Failed to upload document',
      icon: 'thumb_down',
    });
  } finally {
    TOGGLE_COMMON_LOADER(false);
  }
};

const fnVerificationDocumentUploadSingleUpload = async (event, documentDetails) => {
  TOGGLE_COMMON_LOADER(true);
  const formDataObj = new FormData();
  formDataObj.append('file', event.target.files[0]);

  try {
    await FEED_HAND_OVER_TO_SAT_DOCUMENT({
      files: formDataObj,
      leadId: route.params.id,
      documentId: documentDetails.id,
    });
    emit(
      'emitAjaxLoadShortLeadInfo',
      'hotReloadForDocumentsUploadValidation',
      merchantTypeSelection.value
    );
  } catch (error) {
    console.error('Error uploading single document:', error);
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Failed to upload document',
      icon: 'thumb_down',
    });
  } finally {
    TOGGLE_COMMON_LOADER(false);
  }
};

const fnDeleteAlreadyAttachedFile = async (documentDetails) => {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure want to delete uploaded document?',
    ok: {
      label: 'Continue',
      color: 'primary',
    },
    cancel: {
      label: 'Cancel',
      color: 'negative',
      flat: true,
    },
    persistent: true,
  })
    .then(async () => {
      try {
        await DELETE_DOCUMENT_FROM_BY_SAT(documentDetails);
        await FETCH_SHORT_LEAD_DATA(route.params.id);
        emit(
          'emitAjaxLoadShortLeadInfo',
          'hotReloadForDocumentsUploadValidation',
          merchantTypeSelection.value
        );
        $q.notify({
          color: 'positive',
          position: 'bottom',
          message: 'Successfully removed!',
          icon: 'thumb_up',
        });
      } catch (error) {
        console.error('Error deleting document:', error);
        $q.notify({
          color: 'negative',
          position: 'bottom',
          message: error.body?.message || 'Please Try Again Later!',
          icon: 'thumb_down',
        });
      }
    })
    .catch(() => {
      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: 'No changes made!',
        icon: 'thumb_down',
      });
    });
};

const computeAndToggleCheckboxForSingleDocument = (currentSelection) => {
  const leadDocuments = getShortLeadInfo.value?.leadDocuments;
  if (
    leadDocuments &&
    Object.prototype.hasOwnProperty.call(leadDocuments, currentSelection.documentType) &&
    leadDocuments[currentSelection.documentType].length > 1
  ) {
    return find(
      leadDocuments[currentSelection.documentType],
      (oo) => {
        return oo.uploadedDocuments.length > 0 &&
          oo.subDocumentType == currentSelection.subDocumentType
          ? true
          : false;
      }
    );
  } else {
    return leadDocuments &&
      Object.prototype.hasOwnProperty.call(leadDocuments, currentSelection.documentType) &&
      leadDocuments[currentSelection.documentType]?.[0]?.uploadedDocuments.length > 0 &&
      leadDocuments[currentSelection.documentType]?.[0]?.subDocumentType ==
        currentSelection.subDocumentType;
  }
};

const computeAndToggleCheckbox = (currentSelection) => {
  const leadDocuments = getShortLeadInfo.value?.leadDocuments;
  return leadDocuments &&
    Object.prototype.hasOwnProperty.call(leadDocuments, currentSelection.documentType) &&
    leadDocuments[currentSelection.documentType]?.[0]?.uploadedDocuments.length > 0 &&
    leadDocuments[currentSelection.documentType]?.[0]?.subDocumentType ==
      currentSelection.subDocumentTypeSelection?.subDocumentType;
};

const fnCookKYCdocumentArr = (document) => {
  const findIndex = merchantDocumentIds.value.indexOf(document.id);
  if (findIndex == -1) {
    merchantDocumentIds.value.push(document.id);
  } else {
    merchantDocumentIds.value.splice(findIndex, 1);
  }
  emit('emitCookUpKYCdocumentsId', merchantDocumentIds.value);
};

const fnViewHandedOverFileImage = () => {
  if (handedOverImageViewer.value) {
    handedOverImageViewer.value.click();
  }
};

const fnViewBankUploadedLetterImage = () => {
  if (bankUploadedLetter.value) {
    bankUploadedLetter.value.click();
  }
};

const fnViewAttachedFileImage = (attachedImageIndex) => {
  if (attachedImageViewerRefs.value[attachedImageIndex]) {
    attachedImageViewerRefs.value[attachedImageIndex].click();
  }
};

const fnViewMultiAttachedFileImage = (attachedImageIndex) => {
  if (multiAttachedImageViewerRefs.value[attachedImageIndex]) {
    multiAttachedImageViewerRefs.value[attachedImageIndex].click();
  }
};

const fnPDFViewModal = (documentUrl) => {
  PDFDetails.value = documentUrl;
  toggleshowPDFModal.value = !toggleshowPDFModal.value;
};

const fnShowDisabledMessageForFileUpload = (singleDocument, item) => {
  if (item) {
    if (singleDocument.viewType == 1) {
      $q.notify({
        color: 'primary',
        position: 'bottom',
        message: singleDocument.subDocumentType + ' is marked as KYC.',
        icon: 'info',
      });
    } else {
      $q.notify({
        color: 'primary',
        position: 'bottom',
        message: singleDocument.documentType + ' is marked as KYC.',
        icon: 'info',
      });
    }
  }
};

const checkSumForDocumentVerificationStatus = (documentDetails) => {
  const documents = getShortLeadInfo.value?.leadDocuments?.[documentDetails.documentType];
  if (!documents) return null;
  
  return find(documents, (oo) => {
    return oo.subDocumentType == documentDetails.subDocumentType;
  });
};

// Lifecycle
onMounted(() => {
  ajaxLoadShortLeadInfoForDocumentTypes();
});
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

input[type='file'] {
  display: none;
}

.bg-dark-custom {
  background: rgba(0, 0, 0, 0.5);
}

.wrapWord {
  word-wrap: break-word;
  word-break: break-all;
}

.single-document-container {
  border-radius: 4px;
}

.multiple-document-header {
  border-radius: 4px 4px 0 0;
}
</style>