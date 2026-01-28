<template>
  <q-page>
    <div class="q-ma-md">
      <!-- START >> Merchant details -->
      <div class="row q-ma-xs">
        <div class="col">
          <div class="q-title q-my-md capitalize">{{ formData.shortLead.leadName }}</div>
          <div
            class="text-light-blue cursor-pointer"
            @click="toggleLeadInformation(formData.shortLead)"
          >
            # {{ formData.shortLead.id }}
          </div>
        </div>
        <div class="col">
          <div class="q-title q-my-md">Contact</div>
          <div class="no-margin">{{ formData.shortLead.contactNumber }}</div>
          <div>{{ formData.shortLead.alternateContactNumber }}</div>
        </div>
        <div class="col">
          <div class="q-title q-my-md">Address</div>
          <div class="capitalize no-margin">{{ formData.shortLead.leadAddress }}</div>
          <div class="capitalize no-margin">
            {{ formData.shortLead.city }}, {{ formData.shortLead.state }}
          </div>
        </div>
      </div>
      <!-- END >> Merchant details -->
      
      <!-- START >> Device, Exception, Payment, MDR and Documents -->
      <div class="row">
        <div class="col-md-6">
          <div class="flex">
            <!-- START >> Device -->
            <div class="col-md-12 col-sm-12 col-xs-12">
              <q-card class="q-ma-xs border-1 q-custom-class" flat>
                <q-card-section class="q-pa-sm bottom-border title-bg">
                  <div class="row items-center">
                    <div class="col q-body-1 text-weight-medium">
                      Device - {{ formData.shortLead.deviceCount }} {{ formData.shortLead.device.deviceName }}
                    </div>
                  </div>
                </q-card-section>
                <q-card-section class="q-pa-sm">
                  <q-list separator class="no-padding q-body-1">
                    <q-item class="q-pa-sm q-body-1">
                      <q-item-section>Plan</q-item-section>
                      <q-item-section side>{{ formData.shortLead.plan.planName }}</q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm q-body-1">
                      <q-item-section>Setup Fees</q-item-section>
                      <q-item-section side>Rs. {{ formData.shortLead.setupFees }}</q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm q-body-1">
                      <q-item-section>Recurring Fees</q-item-section>
                      <q-item-section side>Rs. {{ formData.shortLead.recurringFees }}</q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm q-body-1">
                      <q-item-section>Merchant Category</q-item-section>
                      <q-item-section side>{{ formData.shortLead.merchantCategory.merchantCategoryName }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
            <!-- END >> Device -->
            
            <!-- START >> Payment -->
            <div class="col-md-12 col-sm-12 col-xs-12">
              <q-card class="q-ma-xs border-1 q-custom-class" flat>
                <q-card-section class="q-pa-sm bottom-border-dark bg-grey-4">
                  <div class="col-auto q-body-1 text-weight-medium">Payment</div>
                </q-card-section>
                <q-separator />
                <q-card-section class="q-pa-sm text-grey-9">
                  <q-list separator class="no-padding">
                    <q-item class="q-pa-sm">
                      <q-item-section class="q-body-1">Payment mode:</q-item-section>
                      <q-item-section side class="text-dark q-body-1">
                        <span v-if="formData.shortLead.paymentOption == 1">IMPS/NEFT</span>
                        <span v-else-if="formData.shortLead.paymentOption == 2">Cheque</span>
                        <span v-else-if="formData.shortLead.paymentOption == 3">Swipe</span>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm">
                      <q-item-section class="q-body-1">Reference:</q-item-section>
                      <q-item-section side class="text-dark q-body-1">
                        {{ formData.shortLead.referenceNumber }}
                      </q-item-section>
                    </q-item>
                    <q-item v-if="formData.shortLead.paymentOption == 2">
                      <div v-if="formData.shortLead.paymentDocumentMimeType?.includes('pdf')">
                        <q-btn
                          size="sm"
                          :outline="!showOpenPaymentChequeDocumentInfo"
                          color="dark"
                          label="View Document"
                          icon="attach_file"
                          @click="fnPDFViewModal(formData.shortLead.paymentDocumentFile, 'CHEQUE')"
                        />
                      </div>
                      <div v-else-if="formData.shortLead.paymentDocumentMimeType?.includes('image')">
                        <q-btn
                          :outline="!showOpenPaymentChequeInfo"
                          size="sm"
                          color="dark"
                          label="View Document"
                          icon="attach_file"
                          @click="fnOpenPaymentChequeInfo(formData.shortLead.paymentDocumentFile)"
                        />
                      </div>
                      <div v-else class="text-grey-9">
                        <q-icon name="clear" color="negative" />No document attached
                      </div>
                    </q-item>
                    <q-item v-if="showOpenPaymentChequeInfo">
                      <viewer
                        class="cursor-pointer"
                        :images="[GLOBAL_FILE_FETCH_URL + '/' + formData.shortLead.paymentDocumentFile]"
                      >
                        <img
                          :src="GLOBAL_FILE_FETCH_URL + '/' + formData.shortLead.paymentDocumentFile"
                          style="max-width:100%"
                          alt="Payment Document"
                        />
                      </viewer>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
            <!-- END >> Payment -->
            
            <!-- START >> MDR details-->
            <div class="col-md-12 col-sm-12 col-xs-12">
              <q-card class="q-ma-xs border-1 q-custom-class" flat>
                <q-card-section class="q-pa-sm bottom-border title-bg">
                  <span class="q-body-1 text-weight-medium">MDR</span>
                </q-card-section>
                <q-card-section class="q-pa-sm text-grey-9">
                  <q-list class="no-padding">
                    <q-item class="q-pa-sm">
                      <q-item-section>
                        <q-input
                          color="grey-9"
                          label="Debit < 2000 (%)"
                          readonly
                          v-model="formData.shortLead.debitLessthanAmount"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-input
                          color="grey-9"
                          label="Debit > 2000 (%)"
                          readonly
                          v-model="formData.shortLead.debitGreaterthanAmount"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm">
                      <q-item-section>
                        <q-input
                          color="grey-9"
                          label="Std CC (%)"
                          readonly
                          v-model="formData.shortLead.stdCC"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-input
                          color="grey-9"
                          label="Premium CC (%)"
                          readonly
                          v-model="formData.shortLead.premiumCC"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm">
                      <q-item-section>
                        <q-input
                          color="grey-9"
                          label="Corp Pre CC (%)"
                          readonly
                          v-model="formData.shortLead.corpCC"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-input
                          color="grey-9"
                          label="Intl Pre CC (%)"
                          readonly
                          v-model="formData.shortLead.intlCC"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm">
                      <q-item-section>
                        <q-input
                          color="grey-9"
                          label="Super Pre CC (%)"
                          readonly
                          v-model="formData.shortLead.superPremiumlCC"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="items-start q-pa-sm" v-if="formData.shortLead.posEnable">
                      <q-checkbox
                        v-model="formData.shortLead.posEnable"
                        class="no-pointer-events"
                        color="purple-9"
                      >
                        <small class="q-caption">Enable Cash@POS Cash @POS incentive Rs.5</small>
                      </q-checkbox>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
            <!-- END >> MDR details-->
            
            <!-- START>> SO/SAT remarks -->
            <div class="col-md-12 col-sm-12 col-xs-12">
              <q-card class="q-ma-xs border-1 q-custom-class" flat>
                <q-card-section class="q-pa-sm bottom-border title-bg">
                  <span class="q-body-1 text-weight-medium">Details</span>
                </q-card-section>
                <q-card-section class="q-pa-sm text-grey-9">
                  <q-list separator class="no-padding">
                    <q-item class="q-pa-sm" multiline>
                      <q-item-section>SO name</q-item-section>
                      <q-item-section side class="text-dark capitalize">
                        {{ getKycExceptionInfoById.assignedTo?.name || 'NA' }}
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm" multiline>
                      <q-item-section>SO - Remarks</q-item-section>
                      <q-item-section side class="text-dark capitalize">
                        {{ getKycExceptionInfoById.reason || 'NA' }}
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm" multiline>
                      <q-item-section>SAT - Remarks</q-item-section>
                      <q-item-section side class="text-dark">
                        <span v-if="getKycExceptionInfoById.leadVerificationStatus?.length > 0">
                          {{ sortArraysForReason(getKycExceptionInfoById.leadVerificationStatus) }}
                        </span>
                        <span v-else>NA</span>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm" multiline>
                      <q-item-section>SAT - Approved By</q-item-section>
                      <q-item-section side class="text-dark">
                        <span v-if="getKycExceptionInfoById.leadVerificationStatus?.length > 0">
                          {{ sortArraysForCreatedBy(getKycExceptionInfoById.leadVerificationStatus) }}
                        </span>
                        <span v-else>NA</span>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm" multiline>
                      <q-item-section>SAT - Expected submission date</q-item-section>
                      <q-item-section side class="text-dark">
                        <span v-if="getKycExceptionInfoById.leadVerificationStatus?.length > 0">
                          {{ formatDate(sortArraysForExpectedSubmitDate(getKycExceptionInfoById.leadVerificationStatus)) }}
                        </span>
                        <span v-else>NA</span>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
            <!-- END>> SO/SAT remarks -->
          </div>
        </div>
        
        <div class="col-md-6">
          <div class="flex">
            <!-- START >> Exception => KYC, Bank Subvention, Pricing -->
            <div class="col-md-12 col-sm-12 col-xs-12">
              <div v-if="formData.shortLead.leadCategory == 2">
                <q-card v-if="formData.shortLead.kyc" class="q-ma-xs border-1 q-custom-class" flat>
                  <q-card-section class="q-pa-sm bottom-border title-bg">
                    <div class="row items-center">
                      <div class="col-auto q-body-1 text-weight-medium">Exception KYC</div>
                    </div>
                  </q-card-section>
                  <q-card-section class="no-padding">
                    <div class="row items-center q-pa-sm q-py-md">
                      <div class="col-md-3 col-sm-12 col-xs-12">
                        <span class="q-caption text-faded">Reason</span>
                      </div>
                      <div class="col-md-9 col-sm-12 col-xs-12">
                        <span class="q-caption text-faded">
                          {{ formData.shortLead.reason || 'Reason not specified' }}
                        </span>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
                
                <q-card v-if="formData.shortLead.bankSubvention" class="q-ma-xs border-1 q-custom-class" flat>
                  <q-card-section class="q-pa-sm bottom-border title-bg">
                    <div class="row items-center">
                      <div class="col-auto q-body-1 text-weight-medium">Exception Bank Subvention</div>
                    </div>
                  </q-card-section>
                  <q-card-section class="no-padding">
                    <div class="row items-center q-pa-sm q-py-md">
                      <div class="col-md-3 col-sm-12 col-xs-12">
                        <div class="q-caption text-faded">Reason</div>
                      </div>
                      <div class="col-md-9 col-sm-12 col-xs-12">
                        <div class="q-caption text-faded">
                          {{ formData.shortLead.reason || 'Reason not specified' }}
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
                
                <q-card v-if="formData.shortLead.pricing" class="q-ma-xs border-1 q-custom-class" flat>
                  <q-card-section class="q-pa-sm bottom-border title-bg">
                    <div class="row items-center">
                      <div class="col-auto q-body-1 text-weight-medium">Exception Pricing</div>
                    </div>
                  </q-card-section>
                  <q-card-section class="no-padding">
                    <div class="row items-center q-pa-sm q-py-md">
                      <div class="col-md-3 col-sm-12 col-xs-12">
                        <div class="q-caption text-faded">Reason</div>
                      </div>
                      <div class="col-md-9 col-sm-12 col-xs-12">
                        <div class="q-caption text-faded">{{ formData.shortLead.reason }}</div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
            <!-- END >> Exception -->
            
            <!-- START >> Documents -->
            <div class="col-md-12 col-sm-12 col-xs-12">
              <q-card class="q-ma-xs border-1" flat>
                <q-card-section class="q-pa-sm title-bg bottom-border">
                  <span class="q-body-1 text-weight-medium">Documents</span>
                </q-card-section>
                <q-card-section class="no-padding">
                  <q-list class="no-padding">
                    <!-- START >> Application document view -->
                    <q-item class="q-body-1">
                      <q-item-section class="q-body-1">
                        <q-item-label>Application Form</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-body-1 bg-grey-3">
                      <div class="full-width">
                        <div v-if="formData.shortLead.applicationFileMimeType?.includes('pdf')" class="cursor-pointer">
                          <div @click="fnPDFViewModal(formData.shortLead.applicationFile)" class="ellipsis">
                            <q-icon name="fas fa-file-pdf" color="negative" />
                            &nbsp;{{ formData.shortLead.applicationFile }}
                          </div>
                        </div>
                        <div v-else-if="formData.shortLead.applicationFileMimeType?.includes('image')" class="cursor-pointer">
                          <viewer
                            :images="[GLOBAL_FILE_FETCH_URL + '/' + formData.shortLead.applicationFile]"
                            class="hidden"
                          >
                            <img
                              :src="GLOBAL_FILE_FETCH_URL + '/' + formData.shortLead.applicationFile"
                              ref="handedOverImageViewer"
                              style="max-width:100%"
                              alt="Application Document"
                            />
                          </viewer>
                          <div @click="fnViewHandedOverFileImage()" class="ellipsis">
                            <q-btn round size="sm" icon="fas fa-image" color="amber-9" />
                            &nbsp;{{ formData.shortLead.applicationFile }}
                          </div>
                        </div>
                        <div v-else>Invalid document type/ No document available</div>
                      </div>
                    </q-item>
                    <!-- END >> Application document view -->
                    
                    <!-- START >> Loop through documents -->
                    <q-item class="no-padding" v-if="Object.keys(formData.shortLead.leadDocuments || {}).length > 0">
                      <q-item-section>
                        <div v-for="(documents, index) in formData.shortLead.leadDocuments" :key="index">
                          <!-- START >> Direct documents -->
                          <div v-if="index.toString() == documents[0]?.subDocumentType" class="row items-center full-width">
                            <div class="col-md-12 q-body-1">
                              <q-expansion-item group="documents" :label="documents[0].subDocumentType">
                                <template v-slot:header>
                                  <q-item-section avatar>
                                    <q-icon
                                      :color="documents[0].kycException ? 'amber-9' : ''"
                                      :name="documents[0].kycException ? 'warning' : 'attach_file'"
                                    />
                                  </q-item-section>
                                  <q-item-section>
                                    <div class="q-body-1">{{ documents[0].subDocumentType }}</div>
                                    <div class="q-caption text-grey">{{ documents[0].uploadedDocuments.length }} Document(s)</div>
                                  </q-item-section>
                                  <q-item-section side v-if="documents[0].documentVerifiedStatus == 2">
                                    <q-btn round size="xs" class="q-ma-xs" color="green" icon="fas fa-check" @click.stop="fnDocumentApproveModal(documents[0])" />
                                    <q-btn round size="xs" class="q-ma-xs" color="red" icon="fas fa-times" @click.stop="fnDocumentRejectModal(documents[0])" />
                                  </q-item-section>
                                  <q-item-section side v-else>
                                    <span v-if="documents[0].documentVerifiedStatus == 1" class="q-body-1 text-weight-medium text-positive">
                                      Approved
                                    </span>
                                    <span v-if="documents[0].documentVerifiedStatus == 3" class="q-body-1 text-weight-medium text-negative">
                                      Rejected
                                    </span>
                                  </q-item-section>
                                </template>
                                
                                <div v-if="documents[0].uploadedDocuments.length > 0">
                                  <div v-for="(item, subIndex) in documents[0].uploadedDocuments" :key="subIndex" class="q-py-sm">
                                    <div v-if="item.mimeType.includes('application')">
                                      <div @click="fnPDFViewModal(item.fileName)" class="cursor-pointer no-underline ellipsis">
                                        <q-icon name="fas fa-file-pdf" color="negative" />
                                        &nbsp;{{ item.fileNameOriginal }}
                                      </div>
                                    </div>
                                    <div v-else-if="item.mimeType.includes('image')">
                                      <div class="no-underline cursor-pointer q-pa-md">
                                        <viewer :images="[GLOBAL_FILE_FETCH_URL + '/' + item.fileName]">
                                          <img :src="GLOBAL_FILE_FETCH_URL + '/' + item.fileName" style="max-width:100%" alt="Document Image" />
                                        </viewer>
                                      </div>
                                    </div>
                                    <div v-else>Invalid document type/ No document available</div>
                                  </div>
                                </div>
                                <div v-else>No document attached</div>
                              </q-expansion-item>
                            </div>
                          </div>
                          <!-- END >> Direct documents -->
                          
                          <!-- START >> Category with sub-category -->
                          <div v-else class="row items-center full-width">
                            <div class="col-md-12 q-body-1">
                              <q-expansion-item group="categories" :label="index">
                                <template v-slot:header>
                                  <q-item-section avatar>
                                    <q-icon name="apps" />
                                  </q-item-section>
                                  <q-item-section>
                                    <div class="q-body-1">{{ index }}</div>
                                    <div class="q-caption text-grey">{{ documents.length }} Type(s)</div>
                                  </q-item-section>
                                </template>
                                
                                <div v-for="(subDocument, subIndex) in documents" :key="subIndex" class="row items-center full-width">
                                  <div class="col-md-12 q-body-1">
                                    <q-expansion-item group="subDocuments" :label="subDocument.subDocumentType">
                                      <template v-slot:header>
                                        <q-item-section avatar>
                                          <q-icon
                                            :color="subDocument.kycException ? 'amber-9' : ''"
                                            :name="subDocument.kycException ? 'warning' : 'attach_file'"
                                          />
                                        </q-item-section>
                                        <q-item-section>
                                          <div class="q-body-1">{{ subDocument.subDocumentType }}</div>
                                          <div class="q-caption text-grey">{{ subDocument.uploadedDocuments.length }} Document(s)</div>
                                        </q-item-section>
                                        <q-item-section side v-if="subDocument.documentVerifiedStatus == 2">
                                          <q-btn round size="xs" class="q-ma-xs" color="green" icon="fas fa-check" @click.stop="fnDocumentApproveModal(subDocument)" />
                                          <q-btn round size="xs" class="q-ma-xs" color="red" icon="fas fa-times" @click.stop="fnDocumentRejectModal(subDocument)" />
                                        </q-item-section>
                                        <q-item-section side v-else>
                                          <span v-if="subDocument.documentVerifiedStatus == 1" class="q-body-1 text-weight-medium text-positive">
                                            Approved
                                          </span>
                                          <span v-if="subDocument.documentVerifiedStatus == 3" class="q-body-1 text-weight-medium text-negative">
                                            Rejected
                                          </span>
                                        </q-item-section>
                                      </template>
                                      
                                      <div v-if="subDocument.uploadedDocuments.length > 0">
                                        <div v-for="(item, subIndex) in subDocument.uploadedDocuments" :key="subIndex" class="q-py-sm">
                                          <div v-if="item.mimeType.includes('application')">
                                            <div @click="fnPDFViewModal(item.fileName)" class="cursor-pointer no-underline ellipsis">
                                              <q-icon name="fas fa-file-pdf" color="negative" />
                                              &nbsp;{{ item.fileNameOriginal }}
                                            </div>
                                          </div>
                                          <div v-else-if="item.mimeType.includes('image')">
                                            <div class="no-underline cursor-pointer q-pa-md">
                                              <viewer :images="[GLOBAL_FILE_FETCH_URL + '/' + item.fileName]">
                                                <img :src="GLOBAL_FILE_FETCH_URL + '/' + item.fileName" style="max-width:100%" alt="Sub-document Image" />
                                              </viewer>
                                            </div>
                                          </div>
                                          <div v-else>Invalid document type/ No document available</div>
                                        </div>
                                      </div>
                                      <div v-else>No document attached</div>
                                    </q-expansion-item>
                                  </div>
                                </div>
                              </q-expansion-item>
                            </div>
                          </div>
                          <!-- END >> Category with sub-category -->
                        </div>
                      </q-item-section>
                    </q-item>
                    <!-- END >> Loop through documents -->
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
            <!-- END >> Documents -->
          </div>
        </div>
      </div>
      <!-- END >> Device, Exception, Payment, MDR and Documents -->
      
      <!-- START >> Final actions -->
      <div class="flex">
        <div class="col-md-12" align="right">
          <q-btn
            icon="block"
            color="grey-5"
            class="q-ma-sm text-dark"
            @click="$router.go(-1)"
            label="Cancel"
          />
          <q-btn
            icon="check"
            color="positive"
            class="q-ma-sm"
            @click="fnApproveLeadData(getKycExceptionInfoById)"
            label="Approve"
          />
          <q-btn
            icon="clear"
            class="q-ma-sm"
            color="negative"
            label="Reject"
            @click="fnToggleRejectLeadComp"
          />
        </div>
      </div>
      <!-- END >> Final actions -->
      
      <!-- START >> COMPONENTS -->
      <showApproveRemarksComponent
        v-if="toggleApproveLeadModal"
        :propToggleLeadModal="toggleApproveLeadModal"
        :propLeadDetails="getKycExceptionInfoById"
        @toggleLeadModal="fnApproveLeadData"
      />
      
      <showRejectLeadRejectComponent
        v-if="toggleLeadRejectModal"
        :propToggleLeadModal="toggleLeadRejectModal"
        :propLeadDetails="getKycExceptionInfoById"
        @toggleLeadModal="fnToggleRejectLeadComp"
      />
      
      <showDocumentLeadApproveComponent
        v-if="toggleLeadDocumentApproveModal"
        :propToggleDocumentApproveModal="toggleLeadDocumentApproveModal"
        :propDocumentDetails="documentApproveTempArr"
        @toggleDocumentModal="fnDocumentApproveModal"
        @toggleDocumentModalHotReload="ajaxLoadShortLeadInfo"
      />
      
      <showDocumentLeadRejectComponent
        v-if="toggleLeadDocumentRejectModal"
        :propToggleDocumentRejectModal="toggleLeadDocumentRejectModal"
        :propDocumentDetails="documentRejectTempArr"
        @toggleDocumentModal="fnDocumentRejectModal"
        @toggleDocumentModalHotReload="ajaxLoadShortLeadInfo"
      />
      
      <showPdfModalComponent
        v-if="toggleshowPDFModal"
        :propToggleshowPDFModal="toggleshowPDFModal"
        :propPDFDetails="PDFDetails"
        @togglePDFModal="fnPDFViewModal"
      />
      
      <showReasonModalComponent
        v-if="showDocumentModal"
        :propshowDocumentModal="showDocumentModal"
        :propReason="parseReasonValue"
        @toggleReasonModal="fnOpenReasonModal"
      />
      
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />
      <!-- END >> COMPONENTS -->
      
      <!-- START >> Ajax Spinner -->
      <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
        <q-spinner-bars class="absolute-center" style="color:#61116a" :size="35" />
      </div>
      <!-- END >> Ajax Spinner -->
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import _ from 'lodash';
import { format } from 'date-fns';

// Import components
import showApproveRemarksComponent from "../../components/opsHead/showApproveRemarksComponent.vue";
import showRejectLeadRejectComponent from "../../components/opsHead/showRejectLeadRejectComponent.vue";
import showDocumentLeadApproveComponent from "../../components/opsHead/showDocumentLeadApproveComponent.vue";
import showDocumentLeadRejectComponent from "../../components/opsHead/showDocumentLeadRejectComponent.vue";
import showPdfModalComponent from "../../components/opsHead/showPdfModalComponent.vue";
import showReasonModalComponent from "../../components/showReasonModalComponent.vue";
import generalLeadInformation from "../../components/generalLeadInformation.vue";

const $q = useQuasar();
const router = useRouter();
const store = useStore();

// Reactive state
const propToggleLeadInformation = ref(false);
const addtnLeadInformation = ref(null);
const PDFDetails = ref(null);
const toggleshowPDFModal = ref(false);
const showOpenPaymentChequeInfo = ref(false);
const showOpenPaymentChequeDocumentInfo = ref(false);
const showDocumentModal = ref(false);
const parseReasonValue = ref(null);
const toggleApproveLeadModal = ref(false);
const toggleLeadRejectModal = ref(false);
const toggleLeadDocumentApproveModal = ref(false);
const toggleLeadDocumentRejectModal = ref(false);
const documentApproveTempArr = ref([]);
const documentRejectTempArr = ref([]);
const toggleAjaxLoadFilter = ref(false);

// Added missing ref
const handedOverImageViewer = ref(null); // Added this line

const formData = reactive({
  shortLead: {}
});

// Computed properties
const GLOBAL_FILE_FETCH_URL = computed(() => 
  store.getters["GlobalVariables/GLOBAL_FILE_FETCH_URL"] || ''
);

const getKycExceptionInfoById = computed(() => 
  store.getters["OPSHead/getKycExceptionInfoById"] || {}
);

// Helper functions
const formatDate = (dateString) => {
  if (!dateString || dateString === 'NA') return 'NA';
  try {
    const date = new Date(dateString);
    return format(date, 'MMMM do yyyy');
  } catch (error) {

    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

// Methods
const toggleLeadInformation = (leadDetails) => {
  propToggleLeadInformation.value = !propToggleLeadInformation.value;
  if (leadDetails !== undefined) {
    addtnLeadInformation.value = leadDetails;
  }
};

// Fixed: Now using the correct ref name
const fnViewHandedOverFileImage = () => {
  if (handedOverImageViewer.value) {
    // Since the viewer component might handle the click differently,
    // we need to trigger the viewer's native click event
    const imgElement = handedOverImageViewer.value;
    if (imgElement.click) {
      imgElement.click();
    } else {
      // Alternative: dispatch a click event
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      imgElement.dispatchEvent(clickEvent);
    }
  }
};

const ajaxLoadShortLeadInfo = async () => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Fetching list .."
  });
  
  try {
    await store.dispatch("OPSHead/FETCH_ALL_EXCEPTION_KYC_BY_ID_DATA", router.currentRoute.value.params.id);
    formData.shortLead = { ...getKycExceptionInfoById.value };
    $q.loading.hide();
  } catch (error) {

    console.error('Error loading lead info:', error);
    $q.loading.hide();
  }
};

const fnDocumentApproveModal = (documentDetails) => {
  toggleLeadDocumentApproveModal.value = !toggleLeadDocumentApproveModal.value;
  if (documentDetails) {
    documentApproveTempArr.value = {
      ...documentDetails,
      leadId: router.currentRoute.value.params.id
    };
  }
};

const fnDocumentRejectModal = (documentDetails) => {
  toggleLeadDocumentRejectModal.value = !toggleLeadDocumentRejectModal.value;
  if (documentDetails) {
    documentRejectTempArr.value = {
      ...documentDetails,
      leadId: router.currentRoute.value.params.id
    };
  }
};

const fnApproveLeadData = async () => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Validating .."
  });

  try {
    await store.dispatch("SatLeadValidation/VERIFY_LEAD_DOCUMENTS", {
      id: router.currentRoute.value.params.id,
      params: []
    });
    
    toggleApproveLeadModal.value = !toggleApproveLeadModal.value;
    $q.loading.hide();
  } catch (error) {

    console.error('Error approving lead:', error);
    
    if (error?.data?.data?.toBeVerifiedDocuments?.length > 0) {
      const arrayMessage = error.data.data.toBeVerifiedDocuments.join(', ');
      $q.notify({
        color: "amber-9",
        message: error.data.message,
        caption: arrayMessage,
        timeout: 8000,
        icon: "warning",
        actions: [{ icon: "clear" }]
      });
    } else if (error?.data?.data) {
      for (const key in error.data.data) {
        if (key !== 'toBeVerifiedDocuments') {
          const arrayMessage = error.data.data[key].join(', ');
          $q.notify({
            color: "amber-9",
            message: `${error.data.message} for ${key}`,
            caption: arrayMessage,
            timeout: 8000,
            icon: "warning",
            actions: [{ icon: "clear" }]
          });
        }
      }
    }
    
    $q.loading.hide();
  }
};

const fnToggleRejectLeadComp = async () => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Validating .."
  });

  try {
    await store.dispatch("SatLeadValidation/VERIFY_REJECT_LEAD_DOCUMENTS", {
      id: router.currentRoute.value.params.id
    });
    
    toggleLeadRejectModal.value = !toggleLeadRejectModal.value;
    $q.loading.hide();
  } catch (error) {

    console.error('Error rejecting lead:', error);
    
    if (error?.data?.data) {
      const arrayMessage = error.data.data.join(', ');
      $q.notify({
        color: "amber-9",
        message: error.data.message,
        caption: arrayMessage,
        timeout: 8000,
        icon: "warning",
        actions: [{ icon: "clear" }]
      });
    }
    
    $q.loading.hide();
  }
};

const fnOpenReasonModal = (rejectReason) => {
  showDocumentModal.value = !showDocumentModal.value;
  parseReasonValue.value = rejectReason;
};

const fnOpenPaymentChequeInfo = () => {
  showOpenPaymentChequeInfo.value = !showOpenPaymentChequeInfo.value;
};

const fnPDFViewModal = (documentUrl, viewChequeFlag) => {
  if (viewChequeFlag == "CHEQUE") {
    showOpenPaymentChequeDocumentInfo.value = !showOpenPaymentChequeDocumentInfo.value;
    PDFDetails.value = documentUrl;
  } else {
    PDFDetails.value = documentUrl;
  }
  toggleshowPDFModal.value = !toggleshowPDFModal.value;
};

// Function to fetch latest createdBy
const sortArraysForCreatedBy = (items) => {
  if (!items?.length) return 'NA';
  
  const arrCooked = _.orderBy(items, 'id', 'desc');
  const arrFinal = arrCooked.find(item => 
    item?.verificationType == 3 && item?.status
  );
  
  return arrFinal?.createdBy?.name || 'NA';
};

// Function to fetch latest reason
const sortArraysForReason = (items) => {
  if (!items?.length) return 'NA';
  
  const arrCooked = _.orderBy(items, 'id', 'desc');
  const arrFinal = arrCooked.find(item => 
    item?.verificationType == 3 && item?.status
  );
  
  return arrFinal?.kycSatRemark || 'NA';
};

// Function to fetch latest expected submit date
const sortArraysForExpectedSubmitDate = (items) => {
  if (!items?.length) return 'NA';
  
  const arrCooked = _.orderBy(items, 'id', 'desc');
  const arrFinal = arrCooked.find(item => 
    item?.verificationType == 3 && item?.status
  );
  
  return arrFinal?.expectedSubmitDate || 'NA';
};

// Lifecycle hooks
onMounted(() => {
  ajaxLoadShortLeadInfo();
});

// Return all reactive properties and methods
</script>

<style scoped>
/* Standard border for elements */
.border-1 {
  border: 1px solid #c7c7c7;
}

/* Custom z-index for layering */
.custom-z-index {
  z-index: 2;
}

/* Light gray background for titles */
.title-bg {
  background-color: rgba(187, 187, 187, 0.29); /* #bbbbbb4a equivalent */
}

/* Links with no underline and custom hover color */
.no-underline {
  text-decoration: none;
  color: #222;
  transition: color 0.2s ease-in-out;
}

.no-underline:hover,
.no-underline:focus,
.no-underline:active {
  text-decoration: none;
  color: #027be3;
}
</style>