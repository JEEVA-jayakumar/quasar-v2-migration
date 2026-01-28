<template>
  <div>
    <q-item class="q-body-1">
      <q-item-section>
        <q-item-label>
          <div class="q-body-1">
            Merchant Type:
            <span class="text-weight-medium">{{ merchantTypeSelection }}</span>
          </div>
        </q-item-label>
      </q-item-section>
    </q-item>

    <!-- START >> (Mandatory) General application form -->
    <q-item class="q-body-1 text-dark bg-grey-4 text-weight-medium">
      <q-item-section>
        Application Form
      </q-item-section>
      <q-item-section side>
        <label id="attach" class="cursor-pointer text-white" style="background-color: #202c3f;">
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
    <q-item class="q-body-1">
      <q-item-section>
        <div class="full-width">
          <div
            class="cursor-pointer"
            v-if="getShortLeadInfo.applicationFileMimeType?.includes('pdf')"
          >
            <div @click="fnPDFViewModal(getShortLeadInfo.applicationFile)" class="ellipsis">
              <q-btn round size="sm" icon="fas fa-file-pdf" color="primary" />
              &nbsp;{{ getShortLeadInfo.applicationFile }}
            </div>
          </div>
          <div
            class="cursor-pointer"
            v-else-if="getShortLeadInfo.applicationFileMimeType?.includes('image')"
          >
            <div @click="fnViewHandedOverFileImage()" class="ellipsis">
              <q-icon name="fas fa-image" color="amber-9" />
              &nbsp;{{ getShortLeadInfo.applicationFile }}
            </div>
          </div>
          <div v-else>Invalid document type/ No document available</div>
        </div>
      </q-item-section>
    </q-item>
    <!-- END >> (Mandatory) Application form  -->
    
    <!-- START >> (Optional) payment document file == bank subvention  -->
    <q-item
      v-if="getShortLeadInfo.paymentDocumentFile != ''"
      class="q-body-1 text-dark bg-grey-4 text-weight-medium"
    >
      <q-item-section>
        Bank Letter
      </q-item-section>
    </q-item>
    <q-item v-if="getShortLeadInfo.paymentDocumentFile != ''" class="q-body-1">
      <q-item-section>
        <div class="full-width">
          <div
            class="cursor-pointer"
            v-if="getShortLeadInfo.paymentDocumentMimeType?.includes('pdf')"
          >
            <div @click="fnPDFViewModal(getShortLeadInfo.paymentDocumentFile)" class="ellipsis">
              <q-btn round size="sm" icon="fas fa-file-pdf" color="primary" />
              &nbsp;{{ getShortLeadInfo.paymentDocumentFile }}
            </div>
          </div>
          <div
            class="cursor-pointer"
            v-else-if="getShortLeadInfo.paymentDocumentMimeType?.includes('image')"
          >
            <div @click="fnViewbankUploadedLetterImage()" class="ellipsis">
              <q-icon name="fas fa-image" color="amber-9" />
              &nbsp;{{ getShortLeadInfo.paymentDocumentFile }}
            </div>
          </div>
          <div v-else>Invalid document type/ No document available</div>
        </div>
      </q-item-section>
    </q-item>
    <!-- END >> (Mandatory) payment document file == bank subvention  -->
    
    <div v-if="merchantTypeSelection == 0" class="full-width q-body-1 q-pa-sm">
      <p>No documents available to display</p>
    </div>

    <!-- START >> Handover to SAT, document upload -->
    <div v-else class="group">
      <template v-if="filteredSingleDocuments?.length">
        <div
          v-for="singleDocument in filteredSingleDocuments"
          :key="singleDocument.id"
          class="border-bottom"
        >
          <template v-if="singleDocument.documents?.filter(doc => doc.isQr != 1)?.length">
            <div
              v-for="document in singleDocument.documents.filter(doc => doc.isQr != 1)"
              :key="document.id"
            >
              <q-item dense class="q-body-1 bg-grey-4 q-pa-sm">
                <q-item-section>
                  {{ document.subDocumentType }}
                </q-item-section>
                <q-item-section side>
                  <label id="attach" class="cursor-pointer text-white" style="background-color: #202c3f;">
                    <span class="q-caption text-weight-light">Attach</span>
                    <input
                      type="file"
                      name="file"
                      @change="fnVerificationDocumentUploadSingleUpload($event, document)"
                      accept=".png, .jpg, .pdf"
                    />
                  </label>
                </q-item-section>
              </q-item>

              <div v-if="displayAttachedFilesByDocument[document.documentType]">
                <div
                  v-for="displayAttachedFile in displayAttachedFilesByDocument[document.documentType]"
                  :key="displayAttachedFile.id"
                >
                  <div v-if="attachedSubFile.subDocumentType == document.subDocumentType">
                    <q-item
                      dense
                      v-for="filesAttachedEarlier in attachedSubFile.uploadedDocuments"
                      :key="filesAttachedEarlier.id"
                      class="q-body-1"
                    >
                      <q-item-section>
                        <div
                          class="cursor-pointer"
                          v-if="filesAttachedEarlier.mimeType?.includes('pdf')"
                        >
                          <div
                            @click="fnPDFViewModal(filesAttachedEarlier.fileName)"
                            class="ellipsis"
                          >
                            <q-icon name="fas fa-file-pdf" color="negative" />
                            &nbsp;{{ filesAttachedEarlier.fileName }}
                          </div>
                        </div>
                        <div
                          class="cursor-pointer"
                          v-else-if="filesAttachedEarlier.mimeType?.includes('image')"
                        >
                          <div
                            @click="fnViewImage(GLOBAL_FILE_FETCH_URL + '/' + filesAttachedEarlier.fileName)"
                            class="ellipsis"
                          >
                            <q-icon name="fas fa-image" color="amber-9" />
                            &nbsp;{{ filesAttachedEarlier.fileName }}
                          </div>
                        </div>
                      </q-item-section>
                      <q-item-section side>
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
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
      
      <template v-if="filteredMultipleDocuments?.length">
        <div
          v-for="multipleDocument in filteredMultipleDocuments"
          :key="multipleDocument.id"
        >
          <q-item-label header class="q-mb-sm bg-grey-4">
            {{ multipleDocument.documentType }}
          </q-item-label>
         
          <div>
            <q-item dense class="q-body-1 q-pa-sm">
              <q-item-section>
                <q-select
                  class="full-width"
                  v-model="multipleDocument.subDocumentTypeSelection"
                  :options="multipleDocument.documents?.filter(doc => doc.isQr != 1) || []"
                  option-label="subDocumentType"
                  option-value="id"
                  emit-value
                  map-options
                  label="Choose from below"
                  @update:model-value="fnGetSubDocuments(multipleDocument.subDocumentTypeSelection)"
                  dense
                  outlined
                />
              </q-item-section>
              
              <q-item-section
                side
                v-if="fnGetEntryPermissionToUploadSubDocuments(multipleDocument)"
              >
                <label id="attach" class="cursor-pointer text-white" style="background-color: #202c3f;">
                  <span class="q-caption text-weight-light">Attach</span>
                  <input
                    type="file"
                    @change="fnVerificationDocumentUpload($event, multipleDocument.subDocumentTypeSelection)"
                    name="file"
                    accept=".png, .jpg, .pdf"
                  />
                </label>
              </q-item-section>
            </q-item>
          </div>
        
          <div v-if="displayAttachedFilesByMultipleDocument[multipleDocument.documentType]">
            <div
              v-for="displayAttachedFile in displayAttachedFilesByMultipleDocument[multipleDocument.documentType]"
              :key="displayAttachedFile.id"
            >
              <div
                v-for="attachedSubFile in displayAttachedFile"
                :key="attachedSubFile.id"
              >
                <q-item
                  v-for="filesAttachedEarlier in attachedSubFile.uploadedDocuments"
                  :key="filesAttachedEarlier.id"
                  class="q-body-1"
                  dense
                >
                  <q-item-section>
                    <div class="cursor-pointer" v-if="filesAttachedEarlier.mimeType?.includes('pdf')">
                      <div
                        @click="fnPDFViewModal(filesAttachedEarlier.fileName)"
                        class="ellipsis"
                      >
                        <q-icon name="fas fa-file-pdf" color="negative" />
                        &nbsp;{{ filesAttachedEarlier.fileName }}
                      </div>
                    </div>
                    <div
                      class="cursor-pointer"
                      v-else-if="filesAttachedEarlier.mimeType?.includes('image')"
                    >
                      <div
                        @click="fnViewImage(GLOBAL_FILE_FETCH_URL + '/' + filesAttachedEarlier.fileName)"
                        class="ellipsis"
                      >
                        <q-icon name="fas fa-image" color="amber-9" />
                        &nbsp;{{ filesAttachedEarlier.fileName }}
                      </div>
                    </div>
                  </q-item-section>
                  <q-item-section side>
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
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <!-- END >> Handover to SAT, document upload -->
    
    <!-- START >> COMPONENT: View PDF  -->
    <showPdfModalComponent
      v-if="toggleshowPDFModal"
      :prop-toggleshow-pdf-modal="toggleshowPDFModal"
      :prop-pdf-details="PDFDetails"
      @togglePDFModal="fnPDFViewModal"
    />
    <!-- END >> COMPONENT: View PDF -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import _ from 'lodash';
import showPdfModalComponent from "../../components/sat/showPdfModalComponent.vue";

const props = defineProps({
  propMerchantTypeFromSO: Object
});

const emit = defineEmits(['emitAjaxLoadShortLeadInfo']);

const $q = useQuasar();
const store = useStore();
const route = useRoute();

const PDFDetails = ref(null);
const toggleshowPDFModal = ref(false);
const merchantTypeSelection = ref(props.propMerchantTypeFromSO.merchantType.merchantTypeName);
const formData = ref({
  shortLead: props.propMerchantTypeFromSO,
  documentType: []
});

// Computed properties
const GLOBAL_FILE_FETCH_URL = computed(() => store.getters['GlobalVariables/GLOBAL_FILE_FETCH_URL']);
const getShortLeadInfo = computed(() => store.getters['SatLeadValidation/getShortLeadInfo']);
const getShortLeadInfoDocumentTypes = computed(() => store.getters['SatLeadValidation/getShortLeadInfoDocumentTypes']);

// Filtered computed properties
const filteredSingleDocuments = computed(() => {
  const docs = getShortLeadInfoDocumentTypes.value?.uploadedDocuments?.forSingleDocument;
  if (!docs) return [];
  
  return docs.filter(singleDoc => 
    singleDoc && singleDoc.isQr != 1 && singleDoc.documents?.some(doc => doc.isQr != 1)
  );
});

const filteredMultipleDocuments = computed(() => {
  const docs = getShortLeadInfoDocumentTypes.value?.uploadedDocuments?.forMutipleDocument;
  if (!docs) return [];
  
  return docs.filter(multiDoc => 
    multiDoc && multiDoc.documentType?.isQr != 1
  );
});

const displayAttachedFilesByDocument = computed(() => {
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



onMounted(() => {
  ajaxLoadShortLeadInfoForDocumentTypes();
});

// Methods
const ajaxLoadShortLeadInfoForDocumentTypes = async () => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Fetching files .."
  });
  
  try {
    await store.dispatch('SatLeadValidation/FETCH_LEAD_DOCUMENT_TYPE_DATA');
    await fnGetMerchantTypeValue(props.propMerchantTypeFromSO.merchantType.merchantTypeName);
    formData.value.documentType = getShortLeadInfoDocumentTypes.value;
    
    emit('emitAjaxLoadShortLeadInfo', 'hotReloadForDocumentsUploadValidation', merchantTypeSelection.value);
    $q.loading.hide();
  } catch (error) {
    console.error('Error loading document types:', error);
    $q.loading.hide();
  }
};

const fnGetMerchantTypeValue = (inputValue) => {
  if (!getShortLeadInfoDocumentTypes.value) return;
  
  let merchantDocumentCategory = _.find(
    getShortLeadInfoDocumentTypes.value,
    o => o.merchantType === inputValue
  );
  
  if (!merchantDocumentCategory) return;
  
  const arr = {
    forSingleDocument: [],
    forMutipleDocument: []
  };
  
  const leadDocuments = getShortLeadInfo.value?.leadDocuments || {};
  
  merchantDocumentCategory.documentsApplicable.forEach((value) => {
    if (value.viewType == 1) {
      arr.forSingleDocument.push(value);
    } else {
      if (value.documentType in leadDocuments) {
        let assumeArr = _.find(value.documents, (oo) => {
          if (
            Object.prototype.hasOwnProperty.call(leadDocuments, oo.documentType) &&
            leadDocuments[oo.documentType]?.[0] &&
            (oo.subDocumentType == leadDocuments[oo.documentType][0]?.subDocumentType ||
              leadDocuments[oo.documentType][0]?.documentType == leadDocuments[oo.documentType][0]?.subDocumentType)
          ) {
            return oo.documentType;
          }
        });
        
        if (assumeArr == undefined) {
          value.subDocumentTypeSelection = 0;
        } else {
          value.subDocumentTypeSelection = assumeArr;
        }
      } else {
        value.subDocumentTypeSelection = 0;
      }
      arr.forMutipleDocument.push(value);
    }
  });
  
  getShortLeadInfoDocumentTypes.value.uploadedDocuments = arr;
};

const fnGetSubDocuments = (documentDetails) => {
  if (documentDetails && typeof documentDetails !== 'undefined') {
    if (Object.prototype.hasOwnProperty.call(documentDetails, 'selectedSubDocumentType') &&
        typeof documentDetails.selectedSubDocumentType !== 'undefined') {
      documentDetails.selectedSubDocumentType = documentDetails.subDocumentType;
    } else {
      documentDetails.selectedSubDocumentType = documentDetails.subDocumentType;
    }
  }
};

const fnVerificationDocumentUpload = async (event, documentDetails) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Uploading file .."
  });
  
  try {
    const formDataObj = new FormData();
    formDataObj.append("file", event.target.files[0]);
    
    const requestParams = {
      files: formDataObj,
      leadId: route.params.id,
      documentId: documentDetails.id
    };
    
    await store.dispatch('SatLeadValidation/FEED_HAND_OVER_TO_SAT_DOCUMENT', requestParams);
    
    $q.loading.hide();
    emit('emitAjaxLoadShortLeadInfo', 'hotReloadForDocumentsUploadValidation', merchantTypeSelection.value);
    
    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Document uploaded successfully",
      icon: "thumb_up"
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    $q.loading.hide();
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "Failed to upload document",
      icon: "thumb_down"
    });
  }
};

const fnUploadApplicationForm = async (event) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Uploading file .."
  });
  
  try {
    const formDataObj = new FormData();
    formDataObj.append("file", event.target.files[0]);
    
    const requestParams = {
      files: formDataObj,
      leadId: route.params.id
    };
    
    await store.dispatch('SatLeadValidation/FEED_FULL_APPLICATION_FORM', requestParams);
    
    $q.loading.hide();
    emit('emitAjaxLoadShortLeadInfo', 'hotReloadForDocumentsUploadValidation', merchantTypeSelection.value);
    
    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Application form uploaded successfully",
      icon: "thumb_up"
    });
  } catch (error) {
    console.error('Error uploading application form:', error);
    $q.loading.hide();
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "Failed to upload document",
      icon: "thumb_down"
    });
  }
};

const fnVerificationDocumentUploadSingleUpload = async (event, documentDetails) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Uploading file .."
  });
  
  try {
    const formDataObj = new FormData();
    formDataObj.append("file", event.target.files[0]);
    
    const requestParams = {
      files: formDataObj,
      leadId: route.params.id,
      documentId: documentDetails.id
    };
    
    await store.dispatch('SatLeadValidation/FEED_HAND_OVER_TO_SAT_DOCUMENT', requestParams);
    
    emit('emitAjaxLoadShortLeadInfo', 'hotReloadForDocumentsUploadValidation', merchantTypeSelection.value);
    $q.loading.hide();
    
    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Document uploaded successfully",
      icon: "thumb_up"
    });
  } catch (error) {
    console.error('Error uploading single document:', error);
    $q.loading.hide();
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "Failed to upload document",
      icon: "thumb_down"
    });
  }
};

const fnDeleteAlreadyAttachedFile = async (documentDetails) => {
  const confirm = await $q.dialog({
    title: "Confirm",
    message: "Are you sure want to delete uploaded document?",
    ok: "Continue",
    cancel: "Cancel"
  });
  
  if (confirm) {
    $q.loading.show({
      delay: 0,
      spinnerColor: "purple-9",
      message: "Processing .."
    });
    
    try {
      await store.dispatch('SatLeadValidation/DELETE_DOCUMENT_FROM_BY_SAT', documentDetails);
      
      $q.notify({
        color: "positive",
        position: "bottom",
        message: "Successfully removed!",
        icon: "thumb_up"
      });
      
      emit('emitAjaxLoadShortLeadInfo', 'hotReloadForDocumentsUploadValidation', merchantTypeSelection.value);
      $q.loading.hide();
    } catch (error) {
      console.error('Error deleting document:', error);
      $q.loading.hide();
      $q.notify({
        color: "negative",
        position: "bottom",
        message: error.body?.message || "Please Try Again Later!",
        icon: "thumb_down"
      });
    }
  } else {
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "No changes made!",
      icon: "thumb_down"
    });
  }
};

const fnGetEntryPermissionToUploadSubDocuments = (multipleDocument) => {
  return multipleDocument?.subDocumentTypeSelection &&
         typeof multipleDocument.subDocumentTypeSelection !== 'undefined' &&
         multipleDocument.subDocumentTypeSelection?.selectedSubDocumentType &&
         typeof multipleDocument.subDocumentTypeSelection.selectedSubDocumentType !== 'undefined';
};

const fnViewHandedOverFileImage = () => {
  const imageUrl = GLOBAL_FILE_FETCH_URL.value + '/' + getShortLeadInfo.value.applicationFile;
  fnViewImage(imageUrl);
};

const fnViewbankUploadedLetterImage = () => {
  const imageUrl = GLOBAL_FILE_FETCH_URL.value + '/' + getShortLeadInfo.value.paymentDocumentFile;
  fnViewImage(imageUrl);
};

const fnViewImage = (imageUrl) => {
  window.open(imageUrl, '_blank');
};

// Function to show PDF
const fnPDFViewModal = (documentUrl) => {
  PDFDetails.value = documentUrl;
  toggleshowPDFModal.value = !toggleshowPDFModal.value;
};
</script>

<style scoped>
.customQuasarSelect {
  padding: 5px;
  height: 33px;
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

#attach {
  height: 33px;
}

.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}
</style>