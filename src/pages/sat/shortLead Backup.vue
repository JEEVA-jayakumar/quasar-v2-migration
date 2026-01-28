<template>
  <q-page class="q-pa-md">
    <div class="q-ma-md">
      <!-- Merchant details -->
      <div class="row q-ma-xs">
        <div class="col">
          <div class="text-h5 q-my-md capitalize">{{ formData.shortLead.leadName }}</div>
          <p class="text-light-blue"># {{ formData.shortLead.id }}</p>
        </div>
        <div class="col">
          <div class="text-h5 q-my-md">Contact</div>
          <p class="no-margin">{{ formData.shortLead.contactNumber }}</p>
          <p>{{ formData.shortLead.alternateContactNumber }}</p>
        </div>
        <div class="col">
          <div class="text-h5 q-my-md">Address</div>
          <p class="capitalize">{{ formData.shortLead.leadAddress }}</p>
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
                    <div class="col-auto text-body1 text-weight-medium">
                      Device - 
                      {{ formData.shortLead.deviceCount }} 
                      {{ formData.shortLead.device.deviceName }}
                    </div>
                    <div class="col" v-if="formData.shortLead.verifiedDeviceStatus == 1" align="right">
                      <span class="text-positive text-weight-medium text-body1">
                        <q-btn
                          size="xs"
                          outline
                          color="positive"
                          round
                          icon="check" 
                        />
                        Approved
                      </span>
                    </div>
                  </div>
                </q-card-section>
                <q-card-section>
                  <q-list no-border class="no-padding">
                    <q-item>
                      <q-item-section>
                        <q-input 
                          color="grey-9"
                          label="Debit < 2000 (%)" 
                          readonly
                          class="no-pointer-events" 
                          v-model="formData.shortLead.debitLessthanAmount"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-input 
                          color="grey-9"
                          label="Debit > 2000 (%)"
                          readonly
                          class="no-pointer-events" 
                          v-model="formData.shortLead.debitGreaterthanAmount" 
                        />
                      </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item>
                      <q-item-section>
                        <q-input 
                          color="grey-9"
                          label="Std CC (%)" 
                          readonly
                          class="no-pointer-events" 
                          v-model="formData.shortLead.stdCC" 
                        /> 
                      </q-item-section>
                      <q-item-section>
                        <q-input 
                          color="grey-9"
                          label="Premium CC (%)" 
                          readonly
                          class="no-pointer-events" 
                          v-model="formData.shortLead.premiumCC" 
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-input 
                          color="grey-9"
                          label="Corp (%)" 
                          readonly
                          class="no-pointer-events" 
                          v-model="formData.shortLead.corpIntlCC" 
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-input 
                          color="grey-9"
                          label="Intl (%)" 
                          readonly
                          class="no-pointer-events" 
                          v-model="formData.shortLead.corpIntlCC" 
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-input 
                          color="grey-9"
                          label="Super Pre CC (%)" 
                          readonly
                          class="no-pointer-events" 
                          v-model="formData.shortLead.corpIntlCC" 
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="items-start q-pa-sm" v-if="formData.shortLead.posEnable">
                      <q-checkbox v-model="formData.shortLead.posEnable" class="no-pointer-events" color="purple-9">
                        <small class="text-caption">Enable Cash@POS Cash @POS incentive Rs.5</small>
                      </q-checkbox>
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
                    <div class="col-auto text-body1 text-weight-medium">
                      Payment - 
                      <span v-if="formData.shortLead.paymentOption == 1">IMPS/NEFT</span>
                      <span v-if="formData.shortLead.paymentOption == 2">Cheque</span>
                      <span v-if="formData.shortLead.paymentOption == 3">Swipe</span>
                    </div>
                    <div class="col text-body1 text-weight-medium" align="right">
                      <span v-if="formData.shortLead.verifiedPricingStatus == 1" class="text-positive text-body1">
                        <q-btn
                          size="xs"
                          outline
                          color="positive"
                          round
                          icon="check" 
                        />
                        Approved
                      </span>
                      <span v-if="formData.shortLead.verifiedPricingStatus == 2" class="text-amber-9 text-body1">
                        <q-btn
                          size="xs"
                          outline
                          color="amber-9"
                          round
                          icon="warning" 
                        />
                        OP Pending
                      </span>
                      <span v-if="formData.shortLead.verifiedPricingStatus == 3" class="text-negative text-body1">
                        <q-btn
                          size="xs"
                          outline
                          color="negative"
                          round
                          icon="clear" 
                        />
                        OP Rejected
                      </span>
                      <span v-if="formData.shortLead.verifiedPricingStatus == 4" class="text-amber-9 text-body1">
                        <q-btn
                          size="xs"
                          outline
                          color="amber-9"
                          round
                          icon="warning" 
                        />
                        Finance Pending
                      </span>
                      <span v-if="formData.shortLead.verifiedPricingStatus == 5" class="text-negative text-body1">
                        <q-btn
                          size="xs"
                          outline
                          color="negative"
                          round
                          icon="clear" 
                        />
                        Finance Reject
                      </span>
                    </div>
                  </div>
                </q-card-section>
                <q-card-section class="q-pa-sm">
                  <q-list no-border class="no-padding">
                    <q-item class="items-start q-pa-sm">
                      <q-item-section class="col-md-6 text-caption">
                        Payment mode:
                        <span class="text-caption" v-if="formData.shortLead.paymentOption == 1">IMPS/NEFT</span>
                        <span class="text-caption" v-else-if="formData.shortLead.paymentOption == 2">Cheque</span>
                        <span class="text-caption" v-else-if="formData.shortLead.paymentOption == 3">Swipe</span>
                      </q-item-section>
                      <q-item-section class="col-md-6 text-caption">
                        {{ formData.shortLead.referenceNumber }}
                      </q-item-section>
                    </q-item>
                    <q-item class="items-start">
                      <q-item-section class="col-md-12 text-caption">
                        <div v-if="!formData.shortLead.paymentDocumentFile">
                          <q-icon name="clear" color="negative" /> No image attached
                        </div>
                        <div v-else>
                          <q-btn 
                            flat
                            underline
                            size="sm"
                            class="bg-white"
                            @click="toggleChequeImage()" 
                            color="light-blue"
                          >
                            View Image &nbsp;
                            <q-icon :name="toggleChequeImageResult ? 'expand_less' : 'expand_more'" />
                          </q-btn>
                          <div v-if="toggleChequeImageResult" class="q-mt-sm">
                            <img 
                              :src="formData.shortLead.paymentDocumentFile" 
                              style="max-width: 100%; max-height: 200px"
                              @error="handleImageError"
                            />
                          </div>
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
                <q-card-section>
                  <q-list no-border class="no-padding">
                    <q-item class="no-padding">
                      <q-item-section>
                        <div class="row group">
                          <div class="col-md-5">
                            <q-input 
                              color="grey-9"
                              label="Debit < 2000 (%)" 
                              readonly
                              class="no-pointer-events" 
                              v-model="formData.shortLead.debitLessthanAmount"
                            />
                          </div>
                          <div class="col-md-5">
                            <q-input 
                              color="grey-9"
                              label="Debit > 2000 (%)"
                              readonly
                              class="no-pointer-events" 
                              v-model="formData.shortLead.debitGreaterthanAmount" 
                            />
                          </div>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item class="no-padding">
                      <q-item-section>
                        <div class="row group">
                          <div class="col-md-3">
                            <q-input 
                              color="grey-9"
                              label="Std CC (%)" 
                              readonly
                              class="no-pointer-events" 
                              v-model="formData.shortLead.stdCC" 
                            /> 
                          </div>
                          <div class="col-md-3">
                            <q-input 
                              color="grey-9"
                              label="Premium CC (%)" 
                              readonly
                              class="no-pointer-events" 
                              v-model="formData.shortLead.premiumCC" 
                            />
                          </div>
                          <div class="col-md-5">
                            <q-input 
                              color="grey-9"
                              label="Corp/Intl/Super Pre CC (%)" 
                              readonly
                              class="no-pointer-events" 
                              v-model="formData.shortLead.corpIntlCC" 
                            />
                          </div>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="items-start q-pa-sm" v-if="formData.shortLead.posEnable">
                      <q-checkbox v-model="formData.shortLead.posEnable" class="no-pointer-events" color="purple-9">
                        <small class="text-caption">Enable Cash@POS Cash @POS incentive Rs.5</small>
                      </q-checkbox>
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
                      <div class="col-auto text-body1 text-weight-medium">
                        Exception KYC
                      </div>
                      <div class="col text-body1 text-weight-medium" align="right">
                        <span v-if="formData.shortLead.verifiedKycStatus == 1" class="text-positive">
                          <q-btn
                            size="xs"
                            outline
                            color="positive"
                            round
                            icon="check" 
                          />
                          Approved
                        </span>
                        <span v-if="formData.shortLead.verifiedKycStatus == 2" class="text-amber-9">
                          <q-btn
                            size="xs"
                            outline
                            color="amber-9"
                            round
                            icon="warning" 
                          />
                          OP Pending
                        </span>
                        <span v-if="formData.shortLead.verifiedKycStatus == 3" class="text-negative">
                          <q-btn
                            size="xs"
                            outline
                            color="negative"
                            round
                            icon="clear" 
                          />
                          OP Rejected
                        </span>
                        <span v-if="formData.shortLead.verifiedKycStatus == 4" class="text-amber-9">
                          <q-btn
                            size="xs"
                            outline
                            color="amber-9"
                            round
                            icon="warning" 
                          />
                          Finance Pending
                        </span>
                        <span v-if="formData.shortLead.verifiedKycStatus == 5" class="text-negative">
                          <q-btn
                            size="xs"
                            outline
                            color="negative"
                            round
                            icon="clear" 
                          />
                          Finance Reject
                        </span>
                      </div>
                    </div>
                  </q-card-section>
                  <q-card-section class="no-padding">
                    <div class="row items-center q-pa-sm q-py-md">
                      <div class="col-md-3 col-sm-12 col-xs-12">
                        <span class="text-caption text-faded">Reason</span>
                      </div>
                      <div class="col-md-9 col-sm-12 col-xs-12">
                        <span class="text-caption text-faded" v-if="!formData.shortLead.reason">
                          Reason not specified
                        </span>
                        <span class="text-caption text-faded" v-else>
                          {{ formData.shortLead.reason }}
                        </span>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
                <q-card v-if="formData.shortLead.bankSubvention" class="q-ma-xs border-1 q-custom-class" flat>
                  <q-card-section class="q-pa-sm bottom-border title-bg">
                    <div class="row items-center">
                      <div class="col-auto text-body1 text-weight-medium">
                        Exception Bank Subvention
                      </div>
                      <div class="col text-body1 text-weight-medium" align="right">
                        <span v-if="formData.shortLead.verifiedBanksubventionStatus == 1" class="text-positive text-body1">
                          <q-btn
                            size="xs"
                            outline
                            color="positive"
                            round
                            icon="check" 
                          />
                          Approved
                        </span>
                        <span v-if="formData.shortLead.verifiedBanksubventionStatus == 2" class="text-amber-9 text-body1">
                          <q-btn
                            size="xs"
                            outline
                            color="amber-9"
                            round
                            icon="warning" 
                          />
                          OP Pending
                        </span>
                        <span v-if="formData.shortLead.verifiedBanksubventionStatus == 3" class="text-negative text-body1">
                          <q-btn
                            size="xs"
                            outline
                            color="negative"
                            round
                            icon="clear" 
                          />
                          OP Rejected
                        </span>
                        <span v-if="formData.shortLead.verifiedBanksubventionStatus == 4" class="text-amber-9 text-body1">
                          <q-btn
                            size="xs"
                            outline
                            color="amber-9"
                            round
                            icon="warning" 
                          />
                          Finance Pending
                        </span>
                        <span v-if="formData.shortLead.verifiedBanksubventionStatus == 5" class="text-negative text-body1">
                          <q-btn
                            size="xs"
                            outline
                            color="negative"
                            round
                            icon="clear" 
                          />
                          Finance Reject
                        </span>
                      </div>
                    </div>
                  </q-card-section>
                  <q-card-section class="no-padding">
                    <div class="row items-center q-pa-sm q-py-md">
                      <div class="col-md-3 col-sm-12 col-xs-12">
                        <div class="text-caption text-faded">Reason</div>
                      </div>
                      <div class="col-md-9 col-sm-12 col-xs-12">
                        <div class="text-caption text-faded" v-if="!formData.shortLead.reason">
                          Reason not specified
                        </div>
                        <div class="text-caption text-faded" v-else>
                          {{ formData.shortLead.reason }}
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card> 
                <q-card v-if="formData.shortLead.pricing" class="q-ma-xs border-1 q-custom-class" flat>
                  <q-card-section class="q-pa-sm bottom-border title-bg">
                    <div class="row items-center">
                      <div class="col-auto text-body1 text-weight-medium">
                        Exception Pricing
                      </div>
                      <div class="col text-body1 text-weight-medium" align="right">
                        <span v-if="formData.shortLead.verifiedPricingStatus == 1" class="text-positive text-body1">
                          <q-btn
                            size="xs"
                            outline
                            color="positive"
                            round
                            icon="check" 
                          />
                          Approved
                        </span>
                        <span v-if="formData.shortLead.verifiedPricingStatus == 2" class="text-amber-9 text-body1">
                          <q-btn
                            size="xs"
                            outline
                            color="amber-9"
                            round
                            icon="warning" 
                          />
                          OP Pending
                        </span>
                        <span v-if="formData.shortLead.verifiedPricingStatus == 3" class="text-negative text-body1">
                          <q-btn
                            size="xs"
                            outline
                            color="negative"
                            round
                            icon="clear" 
                          />
                          OP Rejected
                        </span>
                        <span v-if="formData.shortLead.verifiedPricingStatus == 4" class="text-amber-9 text-body1">
                          <q-btn
                            size="xs"
                            outline
                            color="amber-9"
                            round
                            icon="warning" 
                          />
                          Finance Pending
                        </span>
                        <span v-if="formData.shortLead.verifiedPricingStatus == 5" class="text-negative text-body1">
                          <q-btn
                            size="xs"
                            outline
                            color="negative"
                            round
                            icon="clear" 
                          />
                          Finance Reject
                        </span>
                      </div>
                    </div>
                  </q-card-section>
                  <q-card-section class="no-padding">
                    <div class="row items-center q-pa-sm q-py-md">
                      <div class="col-md-3 col-sm-12 col-xs-12">
                        <div class="text-caption text-faded">Reason</div>
                      </div>
                      <div class="col-md-9 col-sm-12 col-xs-12">
                        <div class="text-caption text-faded">{{ formData.shortLead.reason }}</div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <!-- Documents proof -->
            <div class="full-width">
              <q-card class="q-ma-xs border-1" flat>
                <q-card-section class="q-pa-sm title-bg bottom-border">
                  <span class="text-body1 text-weight-medium">Document</span>
                </q-card-section>
                <q-card-section class="q-pa-xs">
                  <q-list no-border class="no-padding">
                    <q-item class="no-padding">
                      <q-item-section>
                        <div v-if="formData.shortLead.documentUploadedType == 1">
                          <div class="row items-center q-pa-sm full-width text-body1">
                            <div class="col-md-12">
                              <p>Select Merchant Type</p>
                              <q-select
                                class="full-width"
                                placeholder="Merchant Type"
                                v-model="merchantTypeSelection"
                                :options="merchantTypeOptions"
                                @update:model-value="fnGetMerchantTypeValue"
                                emit-value
                                map-options
                              />
                            </div>
                          </div>
                          <div v-if="merchantTypeSelection !== null">
                            <div class="row items-center q-pa-sm full-width text-body1" 
                                 v-for="(primaryItem, primaryIndex) in getShortLeadInfoDocumentTypes[merchantTypeSelection]?.documentsApplicable || []" 
                                 :key="primaryIndex">
                              <div class="col-md-12" v-if="primaryItem.showSingleDocumentUpload">
                                <q-list dense>
                                  <q-item dense>
                                    <q-item-section avatar>
                                      <q-icon name="blur_on"/>
                                    </q-item-section>
                                    <q-item-section class="text-body1 text-weight-medium">
                                      {{ primaryItem.documentType }}
                                    </q-item-section>
                                  </q-item>
                                  <q-separator />
                                  <q-item dense v-for="(secondaryItem, subIndex) in primaryItem.documents" :key="subIndex">
                                    <q-item-section avatar>
                                      <q-icon name="attach_file"/>
                                    </q-item-section>
                                    <q-item-section class="text-caption">
                                      {{ secondaryItem.subDocumentType }}
                                    </q-item-section> 
                                    <q-item-section side>
                                      <label class="cursor-pointer"> 
                                        <span class="text-caption">Attach Document</span>
                                        <input type="file" name="file" accept="image/*,application/pdf" @change="handleFileUpload($event, secondaryItem)">
                                      </label>
                                    </q-item-section>
                                  </q-item>
                                </q-list>
                              </div>

                              <div class="col-md-12" v-else>
                                <q-select
                                  class="full-width"
                                  :placeholder="primaryItem.documentType"
                                  v-model="primaryItem.subDocumentTypeSelection"
                                  :options="getSubDocumentOptions(primaryItem)"
                                  @update:model-value="(val) => fnGetSubDocumentTypeSelection(val, primaryIndex, primaryItem)"
                                  emit-value
                                  map-options
                                />

                                <div v-if="primaryItem.documentTypeSelection" class="full-width q-py-md">
                                  <q-list dense>
                                    <q-item dense>
                                      <q-item-section avatar>
                                        <q-icon name="blur_on"/>
                                      </q-item-section>
                                      <q-item-section class="text-body1 text-weight-medium">
                                        {{ primaryItem.documentType }}
                                      </q-item-section>
                                    </q-item>
                                    <q-separator />
                                    <q-item dense>
                                      <q-item-section avatar>
                                        <q-icon name="attach_file"/>
                                      </q-item-section>
                                      <q-item-section class="text-caption">
                                        {{ primaryItem.documentTypeSelection.subDocumentType }}
                                      </q-item-section> 
                                      <q-item-section side>
                                        <label class="cursor-pointer"> 
                                          <span class="text-caption">Attach Document</span>
                                          <input type="file" name="file" accept="image/*,application/pdf" @change="handleFileUpload($event, primaryItem.documentTypeSelection)">
                                        </label>
                                      </q-item-section>
                                    </q-item>
                                  </q-list>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div v-else>
                          <div class="row items-center full-width text-body1" 
                               v-for="(documents, index) in formData.shortLead.leadDocuments || []" 
                               :key="index">
                            <div class="full-width" v-if="documents[0] && index.toString() === documents[0].subDocumentType">
                              <q-expansion-item
                                expand-separator
                                icon="attach_file"
                                :label="index"
                                :caption="`${documents[0].uploadedDocuments.length} Document(s)`"
                              >
                                <template v-if="documents[0].documentVerifiedStatus == 2" #header>
                                  <q-item-section avatar>
                                    <q-icon name="attach_file" />
                                  </q-item-section>
                                  <q-item-section>
                                    <div class="text-body1">{{ index }}</div>
                                    <div class="text-caption">{{ documents[0].uploadedDocuments.length }} Document(s)</div>
                                  </q-item-section>
                                  <q-item-section side>
                                    <q-btn
                                      round 
                                      size="xs"
                                      class="q-ma-xs"
                                      color="green" 
                                      icon="check" 
                                      @click.stop="fnDocumentApproveModal(documents[0])"
                                    />
                                    <q-btn 
                                      round 
                                      size="xs"
                                      class="q-ma-xs"
                                      color="red" 
                                      icon="close"
                                      @click.stop="fnDocumentRejectModal(documents[0])"
                                    />
                                  </q-item-section>
                                </template>
                                <div v-for="(item, subIndex) in documents[0].uploadedDocuments" :key="subIndex" class="q-py-sm">
                                  <div v-if="item.mimeType.includes('application')">
                                    <div @click="fnPDFViewModal(item.fileName)" class="cursor-pointer no-underline">
                                      <q-icon name="picture_as_pdf" color="negative" />
                                      &nbsp;{{ item.fileName }}
                                    </div>
                                  </div>
                                  <div v-else-if="item.mimeType.includes('image')">
                                    <div class="no-underline cursor-pointer">
                                      <img 
                                        :src="GLOBAL_FILE_FETCH_URL + '/' + item.fileName" 
                                        style="max-width: 100%; max-height: 200px" 
                                        @click="openImageModal(GLOBAL_FILE_FETCH_URL + '/' + item.fileName)"
                                      />
                                    </div>
                                  </div>
                                  <div v-else>No documents attached</div>
                                </div>
                              </q-expansion-item>
                            </div>   

                            <div class="full-width" v-else>
                              <q-expansion-item
                                expand-separator
                                icon="apps"
                                :label="index"
                                :caption="`${documents.length} Type(s)`"
                              >
                                <div class="row items-center full-width" v-for="(subDocument, subIndex) in documents" :key="subIndex">
                                  <div class="col-md-12 text-body1">
                                    <q-expansion-item
                                      expand-separator
                                      icon="attach_file"
                                      :label="subDocument.subDocumentType"
                                      :caption="`${subDocument.uploadedDocuments.length} Document(s)`"
                                    >
                                      <template v-if="subDocument.documentVerifiedStatus == 2" #header>
                                        <q-item-section avatar>
                                          <q-icon name="attach_file" />
                                        </q-item-section>
                                        <q-item-section>
                                          <div class="text-body1">{{ subDocument.subDocumentType }}</div>
                                          <div class="text-caption">{{ subDocument.uploadedDocuments.length }} Document(s)</div>
                                        </q-item-section>
                                        <q-item-section side>
                                          <q-btn
                                            round 
                                            size="xs"
                                            class="q-ma-xs"
                                            color="green" 
                                            icon="check" 
                                            @click.stop="fnDocumentApproveModal(subDocument)"
                                          />
                                          <q-btn 
                                            round 
                                            size="xs"
                                            class="q-ma-xs"
                                            color="red" 
                                            icon="close"
                                            @click.stop="fnDocumentRejectModal(subDocument)"
                                          />
                                        </q-item-section>
                                      </template>
                                      <div v-for="(item, subIndex) in subDocument.uploadedDocuments" :key="subIndex" class="q-py-sm">
                                        <div v-if="item.mimeType.includes('pdf')">
                                          <div @click="fnPDFViewModal(item.fileName)" class="cursor-pointer no-underline">
                                            <q-icon name="picture_as_pdf" color="negative" />
                                            &nbsp;{{ item.fileName }}
                                          </div>
                                        </div>
                                        <div v-else-if="item.mimeType.includes('image')">
                                          <div class="no-underline cursor-pointer">
                                            <img 
                                              :src="GLOBAL_FILE_FETCH_URL + '/' + item.fileName" 
                                              style="max-width: 100%; max-height: 200px" 
                                              @click="openImageModal(GLOBAL_FILE_FETCH_URL + '/' + item.fileName)"
                                            />
                                          </div>
                                        </div>
                                        <div v-else>
                                          No document attached
                                        </div>
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

      <div class="flex" v-if="getShortLeadInfo.isStatus != 7">
        <!-- Final actions -->
        <div class="col-md-12" align="right">
          <q-btn
            icon="block"
            color="grey-5"
            class="q-ma-sm text-dark"
            @click="$router.go(-1)"
            label="Cancel"
          />
          <q-btn
            :disable="showProceedToDataEntryButton"
            icon="check"
            :class="['q-ma-sm', showProceedToDataEntryButton ? '' : 'disabled no-pointer-events']"
            :color="showProceedToDataEntryButton ? 'primary' : 'grey-5'"
            @click="!showProceedToDataEntryButton && fnApproveLeadData(getShortLeadInfo)"
            label="PROCEED TO DATA ENTRY"
          />
          <q-btn
            icon="close"
            class="q-ma-sm"
            color="negative"
            label="REJECT"
            @click="fnToggleRejectLeadComp"
          />
        </div>
      </div>
      
      <!-- Image Modal Dialog -->
      <q-dialog v-model="imageModal.show">
        <q-card>
          <q-card-section>
            <div class="text-h6">Image Preview</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <img :src="imageModal.src" style="max-width: 100%; max-height: 70vh" />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Close" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      
      <!-- START >> COMPONENT: Final reject -->
      <ShowFinalRejectLeadRemarksComponent
        v-if="toggleLeadRejectModal"
        :prop-toggle-lead-modal="toggleLeadRejectModal"
        :prop-lead-details="getShortLeadInfo"
        @toggle-lead-modal="fnToggleRejectLeadComp"
      />
      <!-- END >> COMPONENT: Final reject -->

      <!-- START >> COMPONENT: Document reject  -->
      <ShowDocumentLeadApproveComponent
        v-if="toggleLeadDocumentApproveModal"
        :prop-toggle-document-approve-modal="toggleLeadDocumentApproveModal"
        :prop-document-details="documentApproveTempArr"
        @toggle-document-modal="fnDocumentApproveModal"
      />
      <!-- END >> COMPONENT: Document reject -->

      <!-- START >> COMPONENT: Document reject  -->
      <ShowDocumentLeadRejectComponent
        v-if="toggleLeadDocumentRejectModal"
        :prop-toggle-document-reject-modal="toggleLeadDocumentRejectModal"
        :prop-document-details="documentRejectTempArr"
        @toggle-document-modal="fnDocumentRejectModal"
      />

      <!-- START >> COMPONENT: View PDF  -->
      <ShowPdfModalComponent
        v-if="toggleshowPDFModal"
        :prop-toggleshow-pdf-modal="toggleshowPDFModal"
        :prop-pdf-details="PDFDetails"
        @toggle-pdf-modal="fnPDFViewModal"
      />
      <!-- END >> COMPONENT: View PDF -->

      <!-- START >> Show Ajax Spinner -->
      <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
        <q-spinner-bars class="absolute-center" style="color:#61116a" :size="35" />
      </div>
      <!-- END >> Show Ajax Spinner -->
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import ShowPdfModalComponent from '../../components/sat/ShowPdfModalComponent.vue'
import ShowFinalRejectLeadRemarksComponent from '../../components/sat/ShowFinalRejectLeadRemarksComponent.vue'
import ShowDocumentLeadApproveComponent from '../../components/sat/ShowDocumentLeadApproveComponent.vue'
import ShowDocumentLeadRejectComponent from '../../components/sat/ShowDocumentLeadRejectComponent.vue'

const $q = useQuasar()
const store = useStore()
const router = useRouter()
const route = useRoute()

// Reactive state
const merchantTypeSelection = ref(null)
const PDFDetails = ref(null)
const toggleshowPDFModal = ref(false)

// Component properties
const toggleLeadRejectModal = ref(false)
const toggleLeadDocumentApproveModal = ref(false)
const toggleLeadDocumentRejectModal = ref(false)
const documentApproveTempArr = ref([])
const documentRejectTempArr = ref([])

// Template properties
const showProceedToDataEntryButton = ref(false)
const toggleAjaxLoadFilter = ref(false)
const toggleChequeImageResult = ref(false)
const imageModal = ref({
  show: false,
  src: ''
})

// Form data
const formData = ref({
  shortLead: {},
  documentType: []
})



// Computed properties
const GLOBAL_FILE_FETCH_URL = computed(() => 
  store.getters["GlobalVariables/GLOBAL_FILE_FETCH_URL"]
)

const getShortLeadInfo = computed(() => 
  store.getters["SatLeadValidation/getShortLeadInfo"]
)



const getShortLeadInfoDocumentTypes = computed(() => 
  store.getters["SatLeadValidation/getShortLeadInfoDocumentTypes"]
)

const merchantTypeOptions = computed(() => {
  if (!getShortLeadInfoDocumentTypes.value) return []
  return getShortLeadInfoDocumentTypes.value.map((doc, index) => ({
    label: doc.merchantType,
    value: index
  }))
})

// Lifecycle
onMounted(() => {
  ajaxLoadShortLeadInfo()
  ajaxLoadShortLeadInfoForDocumentTypes()
})

// Methods
const ajaxLoadShortLeadInfo = async () => {
  try {
    toggleAjaxLoadFilter.value = true
    await store.dispatch("SatLeadValidation/FETCH_SHORT_LEAD_DATA", route.params.id)
    formData.value.shortLead = { ...getShortLeadInfo.value }
  } catch (error) {

    console.error("FAILED >> ajaxLoadShortLeadInfo >>", error)
    $q.notify({
      color: "negative",
      message: "Failed to load lead information"
    })
  } finally {
    toggleAjaxLoadFilter.value = false
  }
}

const ajaxLoadShortLeadInfoForDocumentTypes = async () => {
  try {
    await store.dispatch("SatLeadValidation/FETCH_LEAD_DOCUMENT_TYPE_DATA")
    formData.value.documentType = [...getShortLeadInfoDocumentTypes.value]
  } catch (error) {

    console.error("FAILED >> ajaxLoadShortLeadInfoForDocumentTypes >>", error)
  }
}

const fnGetMerchantTypeValue = (inputValue) => {
  const docs = getShortLeadInfoDocumentTypes.value[inputValue]?.documentsApplicable
  if (docs) {
    docs.forEach(item => {
      item.showSingleDocumentUpload = item.viewType == 1
    })
  }
}

const getSubDocumentOptions = (primaryItem) => {
  if (!primaryItem.documents) return []
  return primaryItem.documents.map(doc => ({
    label: doc.subDocumentType,
    value: doc.id
  }))
}

const fnGetSubDocumentTypeSelection = (value, index, primaryItem) => {
  const doc = primaryItem.documents.find(d => d.id === value)
  if (doc) {
    primaryItem.documentTypeSelection = { ...doc }
  }
}

const handleFileUpload = (event, documentItem) => {
  const file = event.target.files[0]
  if (file) {
    console.log("File uploaded:", file.name, "for document:", documentItem)
    // Handle file upload logic here
  }
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
  event.target.parentElement.innerHTML = '<div class="text-negative">Failed to load image</div>'
}

const toggleChequeImage = () => {
  toggleChequeImageResult.value = !toggleChequeImageResult.value
}

const openImageModal = (src) => {
  imageModal.value.src = src
  imageModal.value.show = true
}

const fnDocumentApproveModal = (documentDetails) => {
  toggleLeadDocumentApproveModal.value = !toggleLeadDocumentApproveModal.value
  if (documentDetails) {
    documentApproveTempArr.value = {
      ...documentDetails,
      leadId: route.params.id
    }
  }
}

const fnDocumentRejectModal = (documentDetails) => {
  toggleLeadDocumentRejectModal.value = !toggleLeadDocumentRejectModal.value
  if (documentDetails) {
    documentRejectTempArr.value = {
      ...documentDetails,
      leadId: route.params.id
    }
  }
}

const fnApproveLeadData = async (leadInfo) => {
  const dialog = $q.dialog({
    title: "Confirm",
    message: "Are you sure want to proceed to data entry?",
    ok: {
      label: "Continue",
      color: "primary"
    },
    cancel: {
      label: "Cancel",
      color: "negative",
      flat: true
    }
  })

  try {
    await dialog
    toggleAjaxLoadFilter.value = true
    
    const formData = {
      leadInformation: {
        isStatus: 7,
        verifiedStatus: 1
      },
      leadVerificationStatus: {
        fieldName: "Full Lead Information",
        reason: "",
        leadInformation: {
          id: leadInfo.id
        },
        status: 1
      }
    }
    
    await store.dispatch("SatLeadValidation/VERIFY_LEAD_DATA", formData)
    
    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Successfully approved",
      icon: "thumb_up"
    })
    
    router.push(`/sat/lead/validation/${route.params.id}/data/entry`)
  } catch (error) {

    if (error !== undefined) {
      console.error("Error in approving lead:", error)
      $q.notify({
        color: "negative",
        position: "bottom",
        message: "Error in approving lead!",
        icon: "thumb_down"
      })
    }
  } finally {
    toggleAjaxLoadFilter.value = false
  }
}

const fnToggleRejectLeadComp = () => {
  toggleLeadRejectModal.value = !toggleLeadRejectModal.value
}

const fnPDFViewModal = (documentUrl) => {
  PDFDetails.value = documentUrl
  toggleshowPDFModal.value = !toggleshowPDFModal.value
}
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

.customQuasarSelect {
  padding: 5px;
}

label {
  padding: 3px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: inline-block;
  color: #555;
  cursor: pointer;
  transition: background-color 0.3s;
}

label:hover {
  background-color: #e0e0e0;
}

input[type="file"] {
  display: none;
}

.spinner-overlay {
  background: rgba(255, 255, 255, 0.7);
  z-index: 9999;
}

.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.capitalize {
  text-transform: capitalize;
}
</style>