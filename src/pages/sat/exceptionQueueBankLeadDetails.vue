<template>
  <q-page class="q-ma-md">
    <div class="row">
      <div class="col">
        <q-banner
          v-if="formData.shortLead.kyc && formData.shortLead.bankSubvention 
                        && IsKYCVerifiedBySAT == undefined"
          class="bg-primary text-white q-mb-md"
          rounded
        >
          <template #avatar>
            <q-icon name="info" />
          </template>
          KYC & Bank subvention
          <template #subtitle>
            Status: SAT verification pending
          </template>
        </q-banner>
        
        <q-banner
          v-if="formData.shortLead.kyc && formData.shortLead.bankSubvention 
                        && formData.shortLead.verifiedKycStatus == $VERIFIED_KYC_STATUS_OP_PENDING && IsKYCVerifiedBySAT != undefined"
          class="bg-primary text-white q-mb-md"
          rounded
        >
          <template #avatar>
            <q-icon name="info" />
          </template>
          KYC & Bank subvention
          <template #subtitle>
            Status: Approved by {{ IsKYCVerifiedBySAT.createdBy.name }} (SAT) / OPS head verification pending
          </template>
        </q-banner>
        
        <q-banner
          v-if="formData.shortLead.kyc && formData.shortLead.bankSubvention 
                        && IsKYCVerifiedBySAT != undefined && formData.shortLead.verifiedKycStatus != $VERIFIED_KYC_STATUS_OP_PENDING"
          class="bg-primary text-white q-mb-md"
          rounded
        >
          <template #avatar>
            <q-icon name="info" />
          </template>
          KYC & Bank subvention
          <template #subtitle>
            Status: Approved by {{ IsKYCVerifiedBySAT.createdBy.name }} (OPS head)
          </template>
        </q-banner>
      </div>
    </div>
    
    <div class="row items-stretch q-ma-xs">
      <div class="col-md-3">
        <div class="text-h6 q-my-md text-capitalize">{{ formData.shortLead.leadName }}</div>
        <p
          class="text-light-blue cursor-pointer"
          @click="toggleLeadInformation(formData.shortLead)"
        >
          # {{ formData.shortLead.id }}
        </p>
      </div>
      <div class="col-md-3">
        <div class="text-h6 q-my-md">Contact</div>
        <p class="no-margin">{{ formData.shortLead.contactNumber }}</p>
        <p>{{ formData.shortLead.alternateContactNumber }}</p>
      </div>
      <div class="col-md-3">
        <div class="text-h6 q-my-md">Address</div>
        <p
          v-if="formData.shortLead.leadAddress != null"
          class="capitalize no-margin"
        >
          {{ formData.shortLead.leadAddress }}
        </p>
        <p class="capitalize no-margin">{{ formData.shortLead.city }}, {{ formData.shortLead.state }}</p>
      </div>
    </div>

    <!-- Device, Exception, Payment, MDR and Documents -->
    <div class="row">
      <div class="col-md-6">
        <div class="flex column">
          <!-- Device -->
          <div class="full-width">
            <q-card class="q-ma-xs border-1 q-custom-class" flat>
              <q-card-section class="q-pa-sm bottom-border title-bg">
                <div class="row items-center">
                  <div class="col text-body1 text-weight-medium">
                    Device -
                    {{ formData.shortLead.deviceCount }}
                    {{ formData.shortLead.device.deviceName }}
                  </div>
                </div>
              </q-card-section>
              <q-card-section class="q-pa-sm">
                <q-list separator class="no-padding text-body1">
                  <q-item class="q-pa-sm text-body1">
                    <q-item-section>
                      <q-item-label>Plan</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      {{ formData.shortLead.plan.planName }}
                    </q-item-section>
                  </q-item>
                  <q-item class="q-pa-sm text-body1">
                    <q-item-section>
                      <q-item-label>Setup Fees</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <template v-if="getShortLeadInfo.leadSource.id === 114">
                        Rs. {{ formData.shortLead.setUpFeeAppliedAmount }}
                      </template>
                      <template v-else>
                        Rs. {{ formData.shortLead.setupFees }}
                      </template>
                    </q-item-section>
                  </q-item>
                  <q-item class="q-pa-sm text-body1">
                    <q-item-section>
                      <q-item-label>Recurring Fees</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <template v-if="getShortLeadInfo.leadSource.id === 114">
                        Rs. {{ formData.shortLead.recurringFeeAppliedAmount }}
                      </template>
                      <template v-else>
                        Rs. {{ formData.shortLead.recurringFees }}
                      </template>
                    </q-item-section>
                  </q-item>
                  <q-item class="q-pa-sm text-body1">
                    <q-item-section>
                      <q-item-label>Merchant Category</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      {{ formData.shortLead.merchantCategory.merchantCategoryName }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>

          <!-- Payment -->
          <div class="full-width">
            <q-card class="q-ma-xs border-1 q-custom-class" flat>
              <q-card-section class="q-pa-sm bottom-border title-bg">
                <div class="row items-center">
                  <div class="col-auto text-body1 text-weight-medium">Payment</div>
                </div>
              </q-card-section>
              <q-card-section class="q-pa-sm">
                <q-list separator class="no-padding">
                  <q-item class="q-pa-sm">
                    <q-item-section>
                      <q-item-label class="text-body1">Mode of payment</q-item-label>
                    </q-item-section>
                    <q-item-section side class="text-body1">
                      <span
                        class="text-body1"
                        v-if="formData.shortLead.paymentOption == 1"
                      >
                        IMPS/NEFT
                      </span>
                      <span
                        class="text-body1"
                        v-else-if="formData.shortLead.paymentOption == 2"
                      >
                        Cheque
                      </span>
                      <span
                        class="text-body1"
                        v-else-if="formData.shortLead.paymentOption == 3"
                      >
                        Swipe
                      </span>
                      <span
                        class="text-body1"
                        v-else-if="formData.shortLead.paymentOption == 4"
                      >
                        UPI Link
                      </span>
                    </q-item-section>
                  </q-item>
                  <q-item class="q-pa-sm">
                    <q-item-section>
                      <q-item-label class="text-body1">Reference No</q-item-label>
                    </q-item-section>
                    <q-item-section side class="text-body1">
                      {{ formData.shortLead.referenceNumber == '' ? 'NA' : formData.shortLead.referenceNumber }}
                    </q-item-section>
                  </q-item>
                  <q-item v-if="formData.shortLead.paymentOption == 2">
                    <q-item-section>
                      <div
                        v-if="formData.shortLead.paymentDocumentMimeType != null && formData.shortLead.paymentDocumentMimeType.includes('pdf')"
                      >
                        <q-btn
                          size="sm"
                          :outline="!showOpenPaymentChequeDocumentInfo"
                          color="dark"
                          label="View Document"
                          icon="attach_file"
                          @click="fnPDFViewModal(formData.shortLead.paymentDocumentFile,'CHEQUE')"
                        />
                      </div>
                      <div
                        v-else-if="formData.shortLead.paymentDocumentMimeType != null && formData.shortLead.paymentDocumentMimeType.includes('image')"
                      >
                        <q-btn
                          :outline="!showOpenPaymentChequeInfo"
                          size="sm"
                          color="dark"
                          label="View Document"
                          icon="attach_file"
                          @click="fnOpenPaymentChequeInfo"
                        />
                      </div>
                      <div v-else class="text-grey-9">
                        <q-icon name="clear" color="negative" /> No document attached
                      </div>
                    </q-item-section>
                  </q-item>
                  <q-item v-if="showOpenPaymentChequeInfo">
                    <q-item-section>
                      <div class="cursor-pointer">
                        <img
                          :src="GLOBAL_FILE_FETCH_URL + '/' + formData.shortLead.paymentDocumentFile"
                          style="max-width:100%"
                          @click="fnOpenPaymentChequeInfo"
                        />
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
          
          <!-- MDR -->
          <div class="full-width">
            <q-card class="q-ma-xs border-1 q-custom-class" flat>
              <q-card-section class="q-pa-sm bottom-border title-bg">
                <span class="text-body1 text-weight-medium">MDR</span>
              </q-card-section>
              <q-card-section class="q-pa-sm">
                <q-list class="no-padding">
                  <q-item class="q-pa-sm">
                    <q-item-section>
                      <q-input
                        color="grey-9"
                        label="Debit < 2000 (%)"
                        readonly
                        class="no-pointer-events"
                        v-model="debitModelLesserThan"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-input
                        color="grey-9"
                        label="Debit > 2000 (%)"
                        readonly
                        class="no-pointer-events"
                        v-model="debitModelGreaterThan"
                      />
                    </q-item-section>
                  </q-item>
                  <q-item class="q-pa-sm">
                    <q-item-section>
                      <q-input
                        color="grey-9"
                        label="Std CC (%)"
                        readonly
                        class="no-pointer-events"
                        v-model="debitModelStdCC"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-input
                        color="grey-9"
                        label="Premium CC (%)"
                        readonly
                        class="no-pointer-events"
                        v-model="debitModelPremiumCC"
                      />
                    </q-item-section>
                  </q-item>
                  <q-item class="q-pa-sm">
                    <q-item-section>
                      <q-input
                        color="grey-9"
                        label="Corp Pre CC (%)"
                        readonly
                        class="no-pointer-events"
                        v-model="debitModelCorpCC"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-input
                        color="grey-9"
                        label="Intl Pre CC (%)"
                        readonly
                        class="no-pointer-events"
                        v-model="debitModelIntlCC"
                      />
                    </q-item-section>
                  </q-item>
                  <q-item class="q-pa-sm">
                    <q-item-section>
                      <q-input
                        color="grey-9"
                        label="Super Pre CC (%)"
                        readonly
                        class="no-pointer-events"
                        v-model="debitModelSuperPremiumCC"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-input
                        color="grey-9"
                        label="Upi Debit Card UpTo 2000 (%)"
                        readonly
                        class="no-pointer-events"
                        v-model="upiDebitCardUpTo2000"
                      />
                    </q-item-section>
                  </q-item>
                  <q-item class="q-pa-sm">
                    <q-item-section>
                      <q-input
                        color="grey-9"
                        label="Upi Debit Card Above 2000 (%)"
                        readonly
                        class="no-pointer-events"
                        v-model="upiDebitCardAbove2000"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-input
                        color="grey-9"
                        label="Upi Prepaid Credit Cards UpTo 2000 (%)"
                        readonly
                        class="no-pointer-events"
                        v-model="upiPrepaidCreditCardsUpTo2000"
                      />
                    </q-item-section>
                  </q-item>
                  <q-item class="q-pa-sm">
                    <q-item-section>
                      <q-input
                        color="grey-9"
                        label="Upi Prepaid Credit Cards Above 2000 (%)"
                        readonly
                        class="no-pointer-events"
                        v-model="upiPrepaidCreditCardsAbove2000"
                      />
                    </q-item-section>
                  </q-item>
                  <q-item class="items-start q-pa-sm" v-if="formData.shortLead.posEnable">
                    <q-item-section>
                      <q-checkbox
                        v-model="formData.shortLead.posEnable"
                        class="no-pointer-events"
                        color="purple-9"
                        label="Enable Cash@POS Cash @POS incentive Rs.5"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
          
          <!-- Remarks -->
          <div class="full-width">
            <q-card class="q-ma-xs border-1 q-custom-class" flat>
              <q-card-section class="q-pa-sm bottom-border title-bg">
                <span class="text-body1 text-weight-medium">Remarks</span>
              </q-card-section>
              <q-card-section class="q-pa-sm text-grey-9">
                <q-list separator class="no-padding">
                  <q-item
                    class="q-pa-sm align-middle"
                    v-for="(item,index) in getShortLeadInfo.bankSubventionTracker"
                    :key="index"
                    v-show="getShortLeadInfo.bankSubventionTracker.length > 0"
                  >
                    <q-item-section class="text-dark text-capitalize">
                      {{ item.remarks }}
                    </q-item-section>
                    <q-item-section side>
                      {{ formatDate(item.createdAt) }}
                    </q-item-section>
                  </q-item>
                  <q-item v-show="getShortLeadInfo.bankSubventionTracker.length == 0">
                    <q-item-section>No data to display</q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
      
      <div class="col-md-6">
        <div class="flex column">
          <!-- Exception -->
          <div class="full-width">
            <div v-if="formData.shortLead.leadCategory == 2">
              <q-card v-if="formData.shortLead.kyc" class="q-ma-xs border-1 q-custom-class" flat>
                <q-card-section class="q-pa-sm bottom-border title-bg">
                  <div class="row items-center">
                    <div class="col-auto text-body1 text-weight-medium">Exception KYC</div>
                  </div>
                </q-card-section>
                <q-card-section class="q-pa-sm q-py-md">
                  <div class="row items-center">
                    <div class="col-md-3 col-sm-12 col-xs-12">
                      <span class="text-caption text-faded">Reason</span>
                    </div>
                    <div class="col-md-9 col-sm-12 col-xs-12">
                      <span
                        class="text-caption text-faded"
                        v-if="formData.shortLead.reason == null"
                      >
                        Reason not specified
                      </span>
                      <span class="text-caption text-faded" v-else>
                        {{ formData.shortLead.reason }}
                      </span>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
              
              <q-card
                v-if="formData.shortLead.bankSubvention"
                class="q-ma-xs border-1 q-custom-class"
                flat
              >
                <q-card-section class="q-pa-sm bottom-border title-bg">
                  <div class="row items-center">
                    <div class="col-auto text-body1 text-weight-medium">Exception Bank Subvention</div>
                  </div>
                </q-card-section>
                <q-card-section class="q-pa-sm q-py-md">
                  <div class="row items-center">
                    <div class="col-md-3 col-sm-12 col-xs-12">
                      <div class="text-caption text-faded">Reason</div>
                    </div>
                    <div class="col-md-9 col-sm-12 col-xs-12">
                      <div
                        class="text-caption text-faded"
                        v-if="formData.shortLead.reason == null"
                      >
                        Reason no specified
                      </div>
                      <div class="text-caption text-faded" v-else>
                        {{ formData.shortLead.reason }}
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
              
              <q-card
                v-if="formData.shortLead.pricing"
                class="q-ma-xs border-1 q-custom-class"
                flat
              >
                <q-card-section class="q-pa-sm bottom-border title-bg">
                  <div class="row items-center">
                    <div class="col-auto text-body1 text-weight-medium">Exception Pricing</div>
                  </div>
                </q-card-section>
                <q-card-section class="q-pa-sm q-py-md">
                  <div class="row items-center">
                    <div class="col-md-3 col-sm-12 col-xs-12">
                      <div class="text-caption text-faded">Reason</div>
                    </div>
                    <div class="col-md-9 col-sm-12 col-xs-12">
                      <div class="text-caption text-faded">
                        {{ formData.shortLead.reason }}
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <q-card class="cardsize1 q-ma-xs">
            <q-card-section class="q-pa-sm bottom-border title-bg">
              <div class="row items-center">
                <div class="col-auto text-body1 text-weight-medium">Application Form</div>
              </div>
            </q-card-section>
            <q-item class="text-body1">
              <q-item-section>
                <div class="full-width">
                  <div class="cursor-pointer" v-if="formData.shortLead.applicationFileMimeType.includes('pdf')">
                    <div @click="fnPDFViewModal(formData.shortLead.applicationFile)">
                      <q-btn
                        round
                        size="sm"
                        icon="fas fa-file-pdf"
                        color="primary"
                      />
                      &nbsp;{{ formData.shortLead.applicationFile }}
                    </div>
                  </div>
                  <div class="cursor-pointer" v-else-if="formData.shortLead.applicationFileMimeType.includes('image')">
                    <div
                      @click="fnViewHandedOverFileImageApplication()"
                      class="ellipsis"
                    >
                      <q-icon name="fas fa-image" color="amber-9" />
                      &nbsp;{{ formData.shortLead.applicationFile }}
                    </div>
                  </div>
                  <div v-else>
                    Invalid document type/ No document available
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </q-card>
          
          <!-- Documents proof -->
          <div class="full-width" v-if="Object.keys(formData.shortLead.leadDocuments).length > 0">
            <q-card class="q-ma-xs border-1" flat>
              <q-card-section class="q-pa-sm title-bg bottom-border">
                <span class="text-body1 text-weight-medium">Documents</span>
              </q-card-section>
              <q-card-section class="q-pa-xs">
                <q-list class="no-padding">
                  <q-item class="no-padding">
                    <q-item-section>
                      <div
                        v-for="(documents,index) in formData.shortLead.leadDocuments"
                        :key="index"
                      >
                        <div
                          class="row items-center full-width"
                          v-if="index.toString() == documents[0].subDocumentType"
                        >
                          <div class="col-md-12 text-body1">
                            <q-expansion-item
                              expand-separator
                              icon="attach_file"
                              :label="index"
                              :caption="documents[0].uploadedDocuments.length + ' Document(s)'"
                              default-opened
                            >
                              <div
                                v-for="(item,subIndex) in documents[0].uploadedDocuments"
                                :key="subIndex"
                                class="q-py-sm"
                              >
                                <div v-if="item.mimeType.includes('application')">
                                  <div
                                    @click="fnPDFViewModal(item.fileName)"
                                    class="cursor-pointer no-underline"
                                  >
                                    <q-btn
                                      round
                                      size="sm"
                                      icon="fas fa-file-pdf"
                                      color="primary"
                                    />
                                    &nbsp;{{ item.fileNameOriginal }}
                                  </div>
                                </div>
                                <div v-else-if="item.mimeType.includes('image')">
                                  <div class="no-underline cursor-pointer">
                                    <img
                                      :src="GLOBAL_FILE_FETCH_URL + '/' + item.fileName"
                                      style="max-width:100%"
                                      class="cursor-pointer"
                                      @click="fnViewImage(item.fileName)"
                                    />
                                  </div>
                                </div>
                                <div v-else>No documents attached</div>
                              </div>
                            </q-expansion-item>
                          </div>
                        </div>

                        <div class="row items-center full-width" v-else>
                          <div class="col-md-12 text-body1">
                            <q-expansion-item
                              expand-separator
                              icon="apps"
                              :label="index"
                              :caption="documents.length + ' Type(s)'"
                              default-opened
                            >
                              <div
                                class="row items-center full-width"
                                v-for="(subDocument,subIndex) in documents"
                                :key="subIndex"
                              >
                                <div class="col-md-12 text-body1">
                                  <q-expansion-item
                                    expand-separator
                                    icon="attach_file"
                                    :label="subDocument.subDocumentType"
                                    :caption="subDocument.uploadedDocuments.length + ' Document(s)'"
                                    class="full-width"
                                  >
                                    <div
                                      v-for="(item,subIndex) in subDocument.uploadedDocuments"
                                      :key="subIndex"
                                      class="q-py-sm"
                                    >
                                      <div v-if="item.mimeType.includes('application')">
                                        <div
                                          @click="fnPDFViewModal(item.fileName)"
                                          class="cursor-pointer no-underline"
                                        >
                                          <q-btn
                                            round
                                            size="sm"
                                            icon="fas fa-file-pdf"
                                            color="primary"
                                          />
                                          &nbsp;{{ item.fileNameOriginal }}
                                        </div>
                                      </div>
                                      <div v-else-if="item.mimeType.includes('image')">
                                        <div class="no-underline cursor-pointer">
                                          <img
                                            :src="GLOBAL_FILE_FETCH_URL + '/' + item.fileName"
                                            style="max-width:100%"
                                            class="cursor-pointer"
                                            @click="fnViewImage(item.fileName)"
                                          />
                                        </div>
                                      </div>
                                      <div v-else>No document attached</div>
                                    </div>
                                  </q-expansion-item>
                                </div>
                              </div>
                            </q-expansion-item>
                          </div>
                        </div>
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
    
    <div class="flex q-mt-md">
      <!-- Final actions -->
      <div class="col-md-12" align="right">
        <q-btn
          icon="block"
          color="grey-5"
          class="q-ma-sm text-dark"
          @click="$router.go(-1)"
          label="Cancel"
        />
        <q-btn icon="save" class="q-ma-sm" color="amber-9" label="Save" @click="saveRemarks" />
        <q-btn
          icon="clear"
          class="q-ma-sm"
          color="negative"
          label="Reject"
          @click="fnUploadDocumentAndSubmitRejection"
        />
        <q-btn
          v-if="formData.shortLead.leadSource.id != 114 && formData.shortLead.leadSource.id != 115"
          icon="cloud_upload"
          class="q-ma-sm"
          color="positive"
          label="Upload bank subvention letter"
          @click="fnUploadDocumentAndSubmit"
        />
      </div>
    </div>

    <!--START >>  COMPONENT toggleUploadDocumentAndSubmit -->
    <toggleUploadDocumentAndSubmit
      v-if="toggleUploadDocumentAndSubmit"
      :propLeadDetails="formData.shortLead"
      :propToggleUploadDocumentAndSubmit="toggleUploadDocumentAndSubmit"
      @toggleDocumentUploadAndFinalSubmit="fnUploadDocumentAndSubmit"
    />
    <!--END >>  COMPONENT toggleUploadDocumentAndSubmit -->
    
    <!-- START >> COMPONENT: Final reject -->
    <showRejectLeadRejectComponent
      v-if="toggleLeadRejectModal"
      :propToggleLeadModal="toggleLeadRejectModal"
      :propLeadDetails="getShortLeadInfo"
      @toggleLeadModal="fnUploadDocumentAndSubmitRejection"
    />
    <!-- END >> COMPONENT: Final reject -->
    
    <!-- START >> COMPONENT: View PDF  -->
    <showPdfModalComponent
      v-if="toggleshowPDFModal"
      :propToggleshowPDFModal="toggleshowPDFModal"
      :propPDFDetails="PDFDetails"
      @togglePDFModal="fnPDFViewModal"
    />
    <!-- END >> COMPONENT: View PDF -->
    
    <!-- START >> COMPONENT: View remarks  -->
    <remarks
      v-if="remarks"
      :propToggleLeadModal="remarks"
      :propLeadDetails="getShortLeadInfo"
      @toggleLeadModal="saveRemarks"
      @refreshContentOnSavingRemarks="ajaxLoadShortLeadInfo"
    />
    <!-- END >> COMPONENT: View remarks -->
    
    <!-- //Common lead information in popup -->
    <generalLeadInformation
      v-if="propToggleLeadInformation"
      :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation"
      @closeLeadInformation="toggleLeadInformation"
    />

    <!--START >>  Show Ajax Spinner -->
    <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
      <q-spinner-bars class="absolute-center" style="color:#61116a" :size="35" />
    </div>
    <!--END >>  Show Ajax Spinner -->
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { format } from 'date-fns';
import { orderBy, find } from 'lodash';

import toggleUploadDocumentAndSubmit from "../../components/sat/toggleUploadDocumentAndSubmit.vue";
import showPdfModalComponent from "../../components/sat/showPdfModalComponent.vue";
import remarks from "../../components/sat/remarks.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
// import showRejectLeadRejectComponent from "../../components/sat/BankSubventionRejectComponent.vue";

export default defineComponent({
  name: "exceptionQueueBankLeadDetails",
  
  components: {
    showPdfModalComponent,
    toggleUploadDocumentAndSubmit,
    generalLeadInformation,
    remarks,
    // showRejectLeadRejectComponent
  },
  
  setup() {
    const $q = useQuasar();
    const store = useStore();
    const router = useRouter();

    // Refs
    const remarks = ref(false);
    const propToggleLeadInformation = ref(false);
    const addtnLeadInformation = ref(null);
    const PDFDetails = ref(null);
    const toggleshowPDFModal = ref(false);
    const toggleLeadRejectModal = ref(false);
    const toggleAjaxLoadFilter = ref(false);
    const toggleUploadDocumentAndSubmit = ref(false);
    const showOpenPaymentChequeDocumentInfo = ref(false);
    const showOpenPaymentChequeInfo = ref(false);
    const leadRejectReason = ref("");

    const formData = ref({
      shortLead: ""
    });

    // Computed properties
    const GLOBAL_FILE_FETCH_URL = computed(() => store.getters['GlobalVariables/GLOBAL_FILE_FETCH_URL']);
    
    const getShortLeadInfo = computed(() => store.getters['SatLeadValidation/getShortLeadInfo']);
    
    const getDeviceVerificationStatus = computed(() => store.getters['SatLeadValidation/getDeviceVerificationStatus']);

    // MDR computed properties
    const debitModelLesserThan = computed(() => {
      if (getShortLeadInfo.value?.leadSource?.id === 114) {
        return formData.value.shortLead?.appliedDebitLessthanAmount;
      } else {
        return formData.value.shortLead?.debitLessthanAmount;
      }
    });

    const debitModelGreaterThan = computed(() => {
      if (getShortLeadInfo.value?.leadSource?.id === 114) {
        return formData.value.shortLead?.appliedDebitGreaterthanAmount;
      } else {
        return formData.value.shortLead?.debitGreaterthanAmount;
      }
    });

    const debitModelStdCC = computed(() => {
      if (getShortLeadInfo.value?.leadSource?.id === 114) {
        return formData.value.shortLead?.appliedStdCC;
      } else {
        return formData.value.shortLead?.stdCC;
      }
    });

    const debitModelPremiumCC = computed(() => {
      if (getShortLeadInfo.value?.leadSource?.id === 114) {
        return formData.value.shortLead?.appliedPremiumCC;
      } else {
        return formData.value.shortLead?.premiumCC;
      }
    });

    const debitModelCorpCC = computed(() => {
      if (getShortLeadInfo.value?.leadSource?.id === 114) {
        return formData.value.shortLead?.appliedCorpCC;
      } else {
        return formData.value.shortLead?.corpCC;
      }
    });

    const debitModelIntlCC = computed(() => {
      if (getShortLeadInfo.value?.leadSource?.id === 114) {
        return formData.value.shortLead?.appliedIntlCC;
      } else {
        return formData.value.shortLead?.intlCC;
      }
    });

    const debitModelSuperPremiumCC = computed(() => {
      if (getShortLeadInfo.value?.leadSource?.id === 114) {
        return formData.value.shortLead?.appliedSuperPremiumCC;
      } else {
        return formData.value.shortLead?.superPremiumlCC;
      }
    });

    const upiDebitCardUpTo2000 = computed(() => {
      if (getShortLeadInfo.value?.leadSource?.id === 114) {
        return formData.value.shortLead?.appliedUpiDebitCardUpTo2000;
      } else {
        return formData.value.shortLead?.upiDebitCardUpTo2000;
      }
    });

    const upiDebitCardAbove2000 = computed(() => {
      if (getShortLeadInfo.value?.leadSource?.id === 114) {
        return formData.value.shortLead?.appliedUpiDebitCardAbove2000;
      } else {
        return formData.value.shortLead?.upiDebitCardAbove2000;
      }
    });

    const upiPrepaidCreditCardsUpTo2000 = computed(() => {
      if (getShortLeadInfo.value?.leadSource?.id === 114) {
        return formData.value.shortLead?.appliedUpiPrepaidCreditCardUpTo2000;
      } else {
        return formData.value.shortLead?.upiPrepaidCreditCardsUpTo2000;
      }
    });

    const upiPrepaidCreditCardsAbove2000 = computed(() => {
      if (getShortLeadInfo.value?.leadSource?.id === 114) {
        return formData.value.shortLead?.appliedUpiPrepaidCreditCardAbove2000;
      } else {
        return formData.value.shortLead?.upiPrepaidCreditCardsAbove2000;
      }
    });

    const IsKYCVerifiedBySAT = computed(() => {
      if (!getShortLeadInfo.value?.leadVerificationStatus) return undefined;
      
      const sortedStatus = orderBy(
        getShortLeadInfo.value.leadVerificationStatus,
        ["id"],
        ["desc"]
      );
      
      return find(
        sortedStatus,
        (oo) => oo.status && oo.verificationType == 3
      );
    });

    // Methods
    const formatDate = (dateString) => {
      if (!dateString || dateString === 'NA') return 'NA';
      try {
        const date = new Date(dateString);
        return format(date, 'do MMM y');
      } catch {
        return dateString;
      }
    };

    const toggleLeadInformation = (leadDetails) => {
      propToggleLeadInformation.value = !propToggleLeadInformation.value;
      if (leadDetails !== undefined) {
        addtnLeadInformation.value = leadDetails;
      }
    };

    const fnViewHandedOverFileImageApplication = () => {
      // Implementation for viewing image
      console.log('View image application');
    };

    const fnViewImage = (fileName) => {
      // Open image in new tab or modal
      window.open(`${GLOBAL_FILE_FETCH_URL.value}/${fileName}`, '_blank');
    };

    const ajaxLoadShortLeadInfo = async () => {
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data .."
      });
      
      try {
        await store.dispatch('SatLeadValidation/FETCH_SHORT_LEAD_DATA', router.currentRoute.value.params.id);
        formData.value.shortLead = getShortLeadInfo.value;
      } catch (error) {

        console.error('Error loading lead info:', error);
        $q.notify({
          color: 'negative',
          message: 'Failed to load lead information'
        });
      } finally {
        $q.loading.hide();
      }
    };

    const fnOpenPaymentChequeInfo = () => {
      showOpenPaymentChequeInfo.value = !showOpenPaymentChequeInfo.value;
    };

    const fnUploadDocumentAndSubmit = () => {
      toggleUploadDocumentAndSubmit.value = !toggleUploadDocumentAndSubmit.value;
    };

    const fnUploadDocumentAndSubmitRejection = () => {
      toggleLeadRejectModal.value = !toggleLeadRejectModal.value;
    };

    const saveRemarks = () => {
      remarks.value = !remarks.value;
    };

    const fnPDFViewModal = (documentUrl, viewChequeFlag) => {
      if (viewChequeFlag == "CHEQUE") {
        showOpenPaymentChequeDocumentInfo.value = !showOpenPaymentChequeDocumentInfo.value;
      }
      PDFDetails.value = documentUrl;
      toggleshowPDFModal.value = !toggleshowPDFModal.value;
    };

    // Lifecycle
    onMounted(() => {
      ajaxLoadShortLeadInfo();
    });

    return {
      // Refs
      remarks,
      propToggleLeadInformation,
      addtnLeadInformation,
      PDFDetails,
      toggleshowPDFModal,
      toggleLeadRejectModal,
      toggleAjaxLoadFilter,
      toggleUploadDocumentAndSubmit,
      showOpenPaymentChequeDocumentInfo,
      showOpenPaymentChequeInfo,
      leadRejectReason,
      formData,
      
      // Computed
      GLOBAL_FILE_FETCH_URL,
      getShortLeadInfo,
      getDeviceVerificationStatus,
      debitModelLesserThan,
      debitModelGreaterThan,
      debitModelStdCC,
      debitModelPremiumCC,
      debitModelCorpCC,
      debitModelIntlCC,
      debitModelSuperPremiumCC,
      upiDebitCardUpTo2000,
      upiDebitCardAbove2000,
      upiPrepaidCreditCardsUpTo2000,
      upiPrepaidCreditCardsAbove2000,
      IsKYCVerifiedBySAT,
      
      // Methods
      formatDate,
      toggleLeadInformation,
      fnViewHandedOverFileImageApplication,
      fnViewImage,
      ajaxLoadShortLeadInfo,
      fnOpenPaymentChequeInfo,
      fnUploadDocumentAndSubmit,
      fnUploadDocumentAndSubmitRejection,
      saveRemarks,
      fnPDFViewModal
    };
  }
});
</script>

<style scoped>
.border-1 {
  border: 1px solid #c7c7c7;
}

.custom-z-index {
  z-index: 2;
}

.title-bg {
  background: #bbbbbb4a;
}

.no-underline {
  text-decoration: none;
  color: #222;
}

.no-underline:hover,
.no-underline:active,
.no-underline:focus {
  text-decoration: none;
  color: #027be3;
}

.cardsize1 {
  margin-left: 6px;
  width: 98%;
}

.spinner-overlay {
  background: rgba(255, 255, 255, 0.7);
  z-index: 9999;
}

.text-caption {
  font-size: 0.75rem;
}

.text-body1 {
  font-size: 1rem;
}

.text-h6 {
  font-size: 1.25rem;
  font-weight: 500;
}
</style>