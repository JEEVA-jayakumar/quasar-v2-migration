<template>
  <div>
    <!-- Documents -->
    <div class="row">
      <!-- Documents proof -->
      <div class="col-md-5 q-pa-xs" v-if="showDocumentPreview">
        <q-list>
          <q-item v-if="formData.shortLead.applicationFileMimeType != null" class="q-body-1">
            <q-item-section>
              <div class="full-width">
                <div class="cursor-pointer" v-if="formData.shortLead.applicationFileMimeType.includes('pdf')">
                  <div @click="fnPDFViewModal(formData.shortLead.applicationFile)">
                    <q-btn round size="sm" icon="fas fa-file-pdf" color="primary" />
                    &nbsp;{{ formData.shortLead.applicationFile }}
                  </div>
                </div>
                <div class="cursor-pointer" v-else-if="formData.shortLead.applicationFileMimeType.includes('image')">
                  <viewer :images="[GLOBAL_FILE_FETCH_URL + '/' + formData.shortLead.applicationFile]" class="hidden">
                    <img 
                      :src="[GLOBAL_FILE_FETCH_URL + '/' + formData.shortLead.applicationFile]" 
                      ref="handedOverImageViewer" 
                      style="max-width:100%"
                    >
                  </viewer>
                  <div @click="fnViewHandedOverFileImage()">
                    <q-btn round size="sm" icon="fas fa-image" color="amber-9" />
                    &nbsp;{{ formData.shortLead.applicationFile }}
                  </div>
                </div>
                <div v-else>
                  No default document attached
                </div>
              </div>
            </q-item-section>
          </q-item>
          
          <q-item class="q-pa-none">
            <q-item-section class="text-caption">
              <div v-for="(documents, index) in formData.shortLead.leadDocuments" :key="index">
                <div class="row items-center full-width" v-if="index.toString() == documents[0].subDocumentType">
                  <div class="col-md-12 q-body-1">
                    <q-expansion-item 
                      :label="index" 
                      icon="attach_file"
                      default-opened
                      group="closeOnOpen"
                      header-class="text-body1"
                    >
                      <div v-for="(item, subIndex) in documents[0].uploadedDocuments" :key="subIndex" class="q-py-sm">
                        <div v-if="item.mimeType.includes('application')">
                          <div @click="fnDocumentUrl(item.fileName)" class="cursor-pointer no-underline">
                            <q-btn round size="sm" icon="fas fa-file-pdf" color="primary" />
                            &nbsp;{{ item.fileNameOriginal }}
                          </div>
                        </div>
                        <div v-else-if="item.mimeType.includes('image')">
                          <div class="no-underline cursor-pointer">
                            <v-zoom :img="GLOBAL_FILE_FETCH_URL + '/' + item.fileName" :width="'100%'" :magnify="1.25"></v-zoom>
                          </div>
                        </div>
                        <div v-else>No documents attached</div>
                      </div>
                    </q-expansion-item>
                  </div>
                </div>
                
                <div class="row items-center full-width" v-else>
                  <div class="col-md-12 q-body-1">
                    <q-expansion-item 
                      :label="index" 
                      icon="apps"
                      default-opened
                      group="closeOnOpen"
                      header-class="text-body1"
                    >
                      <div class="row items-center full-width" v-for="(subDocument, subIndex) in documents" :key="subIndex">
                        <div class="col-md-12 q-body-1">
                          <q-expansion-item 
                            :label="subDocument.subDocumentType"
                            icon="attach_file"
                            default-opened
                            group="closeOnOpenSubDocument"
                            header-class="text-body1"
                          >
                            <div v-for="(item, subIndex) in subDocument.uploadedDocuments" :key="subIndex" class="q-py-sm">
                              <div v-if="item.mimeType.includes('application')">
                                <div @click="fnDocumentUrl(item.fileName)" class="cursor-pointer no-underline">
                                  <q-btn round size="sm" icon="fas fa-file-pdf" color="primary" />
                                  &nbsp;{{ item.fileNameOriginal }}
                                </div>
                              </div>
                              <div v-else-if="item.mimeType.includes('image')">
                                <div class="no-underline cursor-pointer">
                                  <v-zoom :img="GLOBAL_FILE_FETCH_URL + '/' + item.fileName" :width="'100%'" :magnify="1.25"></v-zoom>
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
      </div>

      <div class="col-md-5 q-pa-xs group" v-if="!showDocumentPreview">
        <div>
          <vuePdfjs :url="GLOBAL_FILE_FETCH_URL + '/' + populatedDocumentUrl" :type="0" :height="'500px'"></vuePdfjs>
        </div>
        <div>
          <q-btn
            label="Close Preview"
            icon="clear"
            class="common-dark-blue"
            @click="fnCloseDocumentPreview"
          />
        </div>
      </div>

      <!-- Document related form -->
      <div class="col-md-7 q-pa-xs">
        <q-stepper v-model="step" ref="stepper" color="light-blue" contracted alternative-labels animated>
          <q-step :name="1" title="Sales" subtitle="Info" icon="settings" :done="step > 1">
            <div class="row q-col-gutter-sm">
              <div class="col-md-6 col-sm-12">
                <q-select
                  v-model="onBoardDetails.merchant.salesInfo.institutionCode"
                  :options="institutionCodeOptions"
                  label="Institution Code"
                  outlined
                  emit-value
                  map-options
                />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-select
                  v-model="onBoardDetails.merchant.salesInfo.applicationType"
                  :options="applicationTypeOptions"
                  label="Application Type"
                  outlined
                  emit-value
                  map-options
                />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input v-model="onBoardDetails.merchant.salesInfo.applicationNumber" type="number" label="Application Number" outlined />
              </div>
              <div class="col-md-6">
                <q-input v-model="onBoardDetails.merchant.salesInfo.applicationDate" label="Application Date" outlined>
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="onBoardDetails.merchant.salesInfo.applicationDate" mask="DD/MM/YYYY">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-md-6">
                <q-select
                  v-model="merchantType"
                  :options="selectOptions"
                  label="Merchant Type"
                  outlined
                />
              </div>
              <div class="col-md-6">
                <q-select
                  v-model="salesPerson"
                  :options="selectOptions"
                  label="Sales Person"
                  outlined
                />
              </div>
              <div class="col-md-6">
                <q-select
                  v-model="region"
                  :options="selectOptions"
                  label="Region"
                  outlined
                />
              </div>
              <div class="col-md-6">
                <q-select
                  v-model="leadFrom"
                  :options="selectOptions"
                  label="Lead From"
                  outlined
                />
              </div>
              <div class="col-md-6">
                <p class="text-caption q-mb-sm">Subvention Type</p>
                <q-checkbox v-model="bankMDR" label="Bank MDR" />
                <q-checkbox v-model="bijlipayMDR" label="Bijlipay MDR" />
              </div>
              <div class="col-md-6">
                <p class="text-caption q-mb-sm">Sharing Model</p>
                <q-radio v-model="sharingModel" val="no_sharing" label="No Sharing" />
                <q-radio v-model="sharingModel" val="transaction" label="Transaction Value Model" />
                <q-radio v-model="sharingModel" val="mdr_rent" label="MDR and/or Rent" />
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn color="primary" class="q-ma-xs" @click="step = 2" label="Continue" />
              <q-btn color="warning" class="q-ma-xs" label="Save Partial" />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="2" title="Company" subtitle="Info" icon="business" :done="step > 2">
            <div class="row q-col-gutter-sm">
              <div class="col-md-6 col-sm-12">
                <q-input v-model="onBoardDetails.companyInfo.legalName" label="Legal name" outlined />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input v-model="onBoardDetails.companyInfo.dbaName" label="DBA name" outlined />
              </div>
              <div class="col-md-12">
                <q-input
                  v-model="onBoardDetails.companyInfo.registeredAddress"
                  type="textarea"
                  label="Registered Address"
                  outlined
                  autogrow
                />
              </div>
              <div class="col-md-6">
                <q-input type="number" v-model="onBoardDetails.companyInfo.registeredPin" label="PIN" outlined />
              </div>
              <div class="col-md-6">
                <q-select
                  v-model="onBoardDetails.companyInfo.registeredCityRefCode"
                  label="City"
                  :options="selectCityOptions"
                  outlined
                  emit-value
                  map-options
                />
              </div>
              <div class="col-md-6">
                <q-select
                  v-model="onBoardDetails.companyInfo.registeredStateRefCode"
                  label="State"
                  :options="selectStateOptions"
                  outlined
                  emit-value
                  map-options
                />
              </div>
              <div class="col-md-6">
                <q-select
                  v-model="businessEntityType"
                  label="Type of Business Entity"
                  :options="selectOptions"
                  outlined
                />
              </div>
              <div class="col-md-6">
                <q-select
                  v-model="yearEstablishment"
                  label="Year of Establishment"
                  :options="selectOptions"
                  outlined
                />
              </div>
              <div class="col-md-6">
                <q-input type="number" v-model="onBoardDetails.companyInfo.registerNumber" label="Establish Number" outlined />
              </div>
              <div class="col-md-6">
                <q-input type="number" v-model="onBoardDetails.companyInfo.tin" label="TIN" outlined />
              </div>
              <div class="col-md-6">
                <q-input type="number" v-model="onBoardDetails.companyInfo.pan" label="Company PAN" outlined />
              </div>
              <div class="col-md-6">
                <q-input type="number" v-model="onBoardDetails.companyInfo.tan" label="TAN" outlined />
              </div>
              <div class="col-md-12">
                <q-input type="text" v-model="onBoardDetails.companyInfo.businessNature" label="Name of Business" outlined />
              </div>
              <div class="col-md-6">
                <p class="text-caption q-mb-sm">Type of Business</p>
                <q-radio v-model="onBoardDetails.companyInfo.businessType" val="R" label="Rented" />
                <q-radio v-model="onBoardDetails.companyInfo.businessType" val="O" label="Owned" />
                <q-radio v-model="onBoardDetails.companyInfo.businessType" val="L" label="Leased" />
              </div>
              <div class="col-md-6">
                <q-input type="number" v-model="mcc" label="MCC" outlined />
              </div>
              <div class="col-md-6">
                <q-input type="number" v-model="tcc" label="TCC" outlined />
              </div>
              <div class="col-md-12">
                <q-input
                  v-model="residentialAddress"
                  type="textarea"
                  label="Residential Address"
                  outlined
                  autogrow
                />
              </div>
              <div class="col-md-6">
                <q-input type="number" v-model="residentialPin" label="PIN" outlined />
              </div>
              <div class="col-md-6">
                <q-select
                  v-model="residentialCity"
                  label="City"
                  :options="selectOptions"
                  outlined
                />
              </div>
              <div class="col-md-6">
                <q-select
                  v-model="residentialState"
                  label="State"
                  :options="selectOptions"
                  outlined
                />
              </div>
              <div class="col-md-6">
                <q-input v-model="contactName" label="Contact Name" outlined />
              </div>
              <div class="col-md-6">
                <q-input type="tel" v-model="mobile" label="Mobile" outlined />
              </div>
              <div class="col-md-6">
                <q-input type="tel" v-model="altMobile1" label="Alt Mobile" outlined />
              </div>
              <div class="col-md-6">
                <q-input type="tel" v-model="altMobile2" label="Alt Mobile" outlined />
              </div>
              <div class="col-md-6">
                <q-input type="tel" v-model="telephone" label="Telephone" outlined />
              </div>
              <div class="col-md-6">
                <q-input type="email" v-model="email" label="Email" outlined />
              </div>
              <div class="col-md-6">
                <p class="text-caption q-mb-sm">Statement Type</p>
                <q-radio v-model="statementType" val="E" label="E-Statement" />
                <q-radio v-model="statementType" val="P" label="Paper Statement" />
              </div>
              <div class="col-md-6">
                <p class="text-caption q-mb-sm">Paper Statement</p>
                <q-radio v-model="paperStatement" val="daily" label="Daily" />
                <q-radio v-model="paperStatement" val="monthly" label="Monthly" />
                <q-radio v-model="paperStatement" val="quarterly" label="Quarterly" />
                <q-radio v-model="paperStatement" val="half_yearly" label="Half Yearly" />
                <q-radio v-model="paperStatement" val="none" label="None" />
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn color="primary" class="q-ma-xs" @click="step = 3" label="Continue" />
              <q-btn color="warning" class="q-ma-xs" label="Save Partial" />
              <q-btn color="secondary" class="q-ma-xs" flat @click="step = 1" label="Back" />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="3" title="Partners" icon="group" :done="step > 3">
            <div class="row q-col-gutter-sm">
              <div class="col-md-6 col-sm-12">
                <q-input v-model="partnerName" label="Name" outlined />
              </div>
              <div class="col-md-12">
                <q-input type="textarea" v-model="partnerAddress" label="Address" outlined autogrow />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input v-model="partnerPAN" label="PAN" outlined />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input type="number" v-model="partnerPIN" label="PIN" outlined />
              </div>
              <div class="col-md-6">
                <q-select
                  v-model="partnerCity"
                  label="City"
                  :options="selectOptions"
                  outlined
                />
              </div>
              <div class="col-md-6">
                <q-select
                  v-model="partnerState"
                  label="State"
                  :options="selectOptions"
                  outlined
                />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input type="tel" v-model="partnerMobile" label="Mobile" outlined />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input type="email" v-model="partnerEmail" label="Email" outlined />
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn color="primary" class="q-ma-xs" @click="step = 4" label="Continue" />
              <q-btn color="warning" class="q-ma-xs" label="Save Partial" />
              <q-btn color="secondary" class="q-ma-xs" flat @click="step = 2" label="Back" />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="4" title="Business" subtitle="Info" icon="store" :done="step > 4">
            <div class="row q-col-gutter-sm">
              <div class="col-md-6 col-sm-12">
                <p class="text-caption q-mb-sm">Business Hours (Week Days)</p>
                <q-input v-model="weekdayFrom" label="From" outlined>
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="weekdayFrom" format24h>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-sm-12">
                <p class="text-caption q-mb-sm">Business Hours (Week Days)</p>
                <q-input v-model="weekdayTo" label="To" outlined>
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="weekdayTo" format24h>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-sm-12">
                <p class="text-caption q-mb-sm">Business Hours (Weekends)</p>
                <q-input v-model="weekendFrom" label="From" outlined>
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="weekendFrom" format24h>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-sm-12">
                <p class="text-caption q-mb-sm">Business Hours (Weekends)</p>
                <q-input v-model="weekendTo" label="To" outlined>
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="weekendTo" format24h>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input type="number" v-model="businessIncome" label="Business Income" outlined />
              </div>
              <div class="col-md-6">
                <q-input v-model="turnoverYear" label="Turnover During Last Year" outlined>
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="turnoverYear" mask="DD/MM/YYYY">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input type="number" v-model="turnoverAmount" label="Amount" outlined />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input type="number" v-model="expectedCardBusiness" label="Expected Card Business" outlined />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input type="number" v-model="averageBillAmount" label="Average Bill Amount" outlined />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input v-model="gstId" label="GST ID" outlined />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input v-model="currentPOS" label="Name of the other POS Currently Used" outlined />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input type="number" v-model="debitCard" label="Debit Card" outlined />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input type="number" v-model="creditCard" label="Credit Card" outlined />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input v-model="memberSince" label="Member Since" outlined>
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="memberSince" mask="DD/MM/YYYY">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn color="primary" class="q-ma-xs" @click="step = 5" label="Continue" />
              <q-btn color="warning" class="q-ma-xs" label="Save Partial" />
              <q-btn color="secondary" class="q-ma-xs" flat @click="step = 3" label="Back" />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="5" title="Payment" subtitle="Details" icon="payment" :done="step > 5">
            <div class="row q-col-gutter-sm">
              <div class="col-md-6">
                <p class="text-caption q-mb-sm">Device Owned By</p>
                <q-radio v-model="deviceOwnedBy" val="B" label="Bijlipay" />
                <q-radio v-model="deviceOwnedBy" val="M" label="Merchant" />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input type="number" v-model="installationFee" label="Installation Fee" outlined />
              </div>
              <div class="col-md-6">
                <q-select
                  v-model="terminalModel"
                  label="Terminal Model"
                  :options="selectOptions"
                  outlined
                />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input type="number" v-model="noOfTerminals" label="No of Terminals" outlined />
              </div>
              <div class="col-md-6">
                <p class="text-caption q-mb-sm">Cash @POS Enabled?</p>
                <q-radio v-model="cashAtPOS" val="Y" label="Yes" />
                <q-radio v-model="cashAtPOS" val="N" label="No" />
              </div>
              <div class="col-md-6">
                <q-select
                  v-model="rentalPlan"
                  label="Rental Plan"
                  :options="selectOptions"
                  outlined
                />
              </div>
              <div class="col-md-6">
                <q-select
                  v-model="rentalMode"
                  label="Rental Mode"
                  :options="selectOptions"
                  outlined
                />
              </div>
              <div class="col-md-6">
                <p class="text-caption q-mb-sm">Rental Type</p>
                <q-radio v-model="rentalType" val="A" label="Advanced" />
                <q-radio v-model="rentalType" val="R" label="Regular" />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input type="number" v-model="devicePrice" label="Device Price" outlined />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input type="number" v-model="otherCharges" label="Other Charges" outlined />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input type="number" v-model="totalAmountPaid" label="Total Amount Paid" outlined />
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn color="primary" class="q-ma-xs" @click="step = 6" label="Continue" />
              <q-btn color="warning" class="q-ma-xs" label="Save Partial" />
              <q-btn color="secondary" class="q-ma-xs" flat @click="step = 4" label="Back" />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="6" title="Bank & Collection" subtitle="Details" icon="account_balance" :done="step > 6">
            <div class="row q-col-gutter-sm items-center">
              <div class="col-md-12">
                <p class="text-caption">Merchant Bank Details</p>
              </div>
              <div class="col-md-6">
                <q-input v-model="ifscCode" label="IFSC Code" outlined />
              </div>
              <div class="col-md-6">
                <q-input type="number" v-model="micr" label="MICR" outlined />
              </div>
              <div class="col-md-6">
                <q-input v-model="bankName" label="Bank Name" outlined />
              </div>
              <div class="col-md-6">
                <q-input v-model="branchName" label="Branch Name" outlined />
              </div>
              <div class="col-md-6">
                <q-select
                  v-model="bankCity"
                  label="City"
                  :options="selectOptions"
                  outlined
                />
              </div>
              <div class="col-md-6">
                <q-select
                  v-model="bankState"
                  label="State"
                  :options="selectOptions"
                  outlined
                />
              </div>
              <div class="col-md-6">
                <q-select
                  v-model="accountType"
                  label="Account Type"
                  :options="selectOptions"
                  outlined
                />
              </div>
              <div class="col-md-6">
                <q-input v-model="accountNumber" type="number" label="Bank A/c Number" outlined />
              </div>
              <div class="col-md-6">
                <q-checkbox v-model="bankStatementAttached" label="Bank Statement Attached" />
                <q-checkbox v-model="cancelledChequeAttached" label="Cancelled Cheque Lead Attached" />
              </div>
              <div class="col-md-12">
                <p class="text-caption">Payment Collection Details</p>
              </div>
              <div class="col-md-6">
                <q-input v-model="swipeAmount" label="Swipe Amount" outlined />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input v-model="swipeDate" label="Swipe Date" outlined>
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="swipeDate" format24h>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-md-6">
                <q-input v-model="swipedTerminal" label="Swiped on the terminal of" outlined />
              </div>
              <div class="col-md-6">
                <q-input v-model="chequeAmount" label="Cheque Amount" outlined />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input v-model="chequeDate" label="Cheque Date" outlined>
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="chequeDate" format24h>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-md-6">
                <q-input v-model="chequeDepositedDate" label="Cheque Deposited Date" outlined>
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="chequeDepositedDate" format24h>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-md-6">
                <q-input v-model="chequeUTR" label="Cheque/UTR No" outlined />
              </div>
              <div class="col-md-6">
                <q-select
                  v-model="collectionBankName"
                  label="Bank Name"
                  :options="selectOptions"
                  outlined
                />
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn color="primary" class="q-ma-xs" @click="step = 7" label="Continue" />
              <q-btn color="warning" class="q-ma-xs" label="Save Partial" />
              <q-btn color="secondary" class="q-ma-xs" flat @click="step = 5" label="Back" />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="7" title="KYC" icon="verified_user">
            <div>Please verify all the above information provided before submitting. Thanks.</div>
            <q-stepper-navigation>
              <q-btn color="positive" label="Submit" />
              <q-btn color="secondary" flat @click="step = 6" label="Back" />
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import vuePdfjs from 'vue-pdfjs';
import vZoom from 'vue-zoom';

export default {
  name: 'OnboardingComponent',
  components: {
    vuePdfjs,
    vZoom
  },
  props: {
    propLeadDeatils: {
      type: Object,
      required: true
    }
  },
  emits: ['togglePDFModal'],
  setup(props, { emit }) {
    const store = useStore();
    
    // Refs
    const step = ref(1);
    const stepper = ref(null);
    const handedOverImageViewer = ref(null);
    
    // State management
    const PDFDetails = ref(null);
    const toggleshowPDFModal = ref(false);
    const showImage = ref(true);
    const showDocumentPreview = ref(true);
    const populatedDocumentUrl = ref('');
    
    const formData = reactive({
      shortLead: props.propLeadDeatils
    });

    // Options for select boxes
    const institutionCodeOptions = [
      { label: 'IOB', value: '1' },
      { label: 'Andhra Bank', value: '2' }
    ];

    const applicationTypeOptions = [
      { label: 'Digital', value: 'D' },
      { label: 'Non Digital', value: 'N' }
    ];

    const selectCityOptions = [
      { label: 'Chennai', value: 1 }
    ];

    const selectStateOptions = [
      { label: 'Tamil Nadu', value: 1 }
    ];

    const selectOptions = [
      { label: 'Option 1', value: 1 },
      { label: 'Option 2', value: 2 }
    ];

    // OnBoard Details reactive object
    const onBoardDetails = reactive({
      merchant: {
        salesInfo: {
          institutionCode: '1',
          applicationType: 'D',
          applicationNumber: '',
          applicationDate: '20/04/2018',
          aggreementDate: '20/04/2018',
          merchantType: 'M',
          region: 1,
          salesPersonCode: 1,
          leadFrom: 'test',
          sharingModelCode: 'N',
          sharingPartnerCode: 1,
          dailyFixedAmount: '500',
          loanDisbursementPercentage: '2',
          loanDisbursementAmount: '100000',
          loanDisbursementDate: '20/04/2018',
          tenureMonth: 12,
          tenureDay: 356,
          tenureStartDate: '20/04/2018',
          rentPercentage: '2',
          rentFixed: '500'
        },
        companyInfo: {
          legalName: '',
          dbaName: '',
          registeredAddress: '',
          registeredPin: '',
          registeredCityRefCode: 1,
          registeredStateRefCode: 1,
          constitution: 'PL',
          constitutionDescription: 'test',
          establishYear: '20/04/2018',
          registerNumber: '',
          pan: '',
          tin: '',
          tan: '',
          businessNature: '',
          businessType: 'R',
          mcc: '5733',
          residentialAddress: '',
          residentialPin: '',
          residentialCityRefCode: 1,
          residentialStateRefCode: 1,
          contactMobile: '',
          contactAlternateMobile: '',
          contactPhone: '',
          contactEmail: '',
          statementType: 'P',
          statementFrequency: 'D',
          statementEmail: ''
        },
        businessInfo: {
          weekdayStartHour: '9',
          weekdayEndHour: '6',
          weekendStartHour: '9',
          weekendEndHour: '2',
          lastTurnoverYear: '2010',
          lastTurnoverAmount: '500000',
          expectedCardBusiness: '500000',
          averageBillAmount: '5000',
          gstId: '',
          currentPosName: '',
          debitCardMdr: '2',
          creditCardMdr: '2',
          memberSince: '2010'
        },
        partners: [
          {
            name: '',
            address: '',
            pan: '',
            pin: '',
            stateRefCode: '1',
            cityRefCode: '1',
            contactMobile: '',
            contactEmail: ''
          }
        ],
        paymentdetails: {
          deviceOwnedBy: 'B',
          installationFee: '',
          terminalModeCode: 1,
          numberOfTerminals: 1,
          cashAtPosEnabled: 'Y',
          rentalPlanCode: 1,
          rentalModeCode: 1,
          rentalType: 'A',
          devicePrice: '',
          otherCharges: '',
          totalAmountPaid: ''
        },
        bankInfo: {
          bankDetails: {
            ifsc: '',
            micr: '',
            bankName: '',
            bankCityRefCode: 1,
            bankStateRefCode: 1,
            payment_mode: 'D',
            accountType: 'SB',
            accountNumber: '',
            bankStatementAttached: 'Y',
            cancelChequeAttached: 'Y'
          },
          collectionDetails: {
            collectedDate: '20/04/2018',
            swipeAmount: '',
            swipeTerminal: '',
            chequeAmount: '',
            chequeDate: '20/04/2018',
            chequeNumber: '',
            acquirerBank: ''
          }
        }
      }
    });

    // Additional form fields
    const merchantType = ref(null);
    const salesPerson = ref(null);
    const region = ref(null);
    const leadFrom = ref(null);
    const bankMDR = ref(false);
    const bijlipayMDR = ref(false);
    const sharingModel = ref('no_sharing');
    const businessEntityType = ref(null);
    const yearEstablishment = ref(null);
    const mcc = ref('');
    const tcc = ref('');
    const residentialAddress = ref('');
    const residentialPin = ref('');
    const residentialCity = ref(null);
    const residentialState = ref(null);
    const contactName = ref('');
    const mobile = ref('');
    const altMobile1 = ref('');
    const altMobile2 = ref('');
    const telephone = ref('');
    const email = ref('');
    const statementType = ref('E');
    const paperStatement = ref('none');
    const partnerName = ref('');
    const partnerAddress = ref('');
    const partnerPAN = ref('');
    const partnerPIN = ref('');
    const partnerCity = ref(null);
    const partnerState = ref(null);
    const partnerMobile = ref('');
    const partnerEmail = ref('');
    const weekdayFrom = ref('09:00');
    const weekdayTo = ref('18:00');
    const weekendFrom = ref('09:00');
    const weekendTo = ref('14:00');
    const businessIncome = ref('');
    const turnoverYear = ref('');
    const turnoverAmount = ref('');
    const expectedCardBusiness = ref('');
    const averageBillAmount = ref('');
    const gstId = ref('');
    const currentPOS = ref('');
    const debitCard = ref('');
    const creditCard = ref('');
    const memberSince = ref('');
    const deviceOwnedBy = ref('B');
    const installationFee = ref('');
    const terminalModel = ref(null);
    const noOfTerminals = ref('');
    const cashAtPOS = ref('Y');
    const rentalPlan = ref(null);
    const rentalMode = ref(null);
    const rentalType = ref('A');
    const devicePrice = ref('');
    const otherCharges = ref('');
    const totalAmountPaid = ref('');
    const ifscCode = ref('');
    const micr = ref('');
    const bankName = ref('');
    const branchName = ref('');
    const bankCity = ref(null);
    const bankState = ref(null);
    const accountType = ref(null);
    const accountNumber = ref('');
    const bankStatementAttached = ref(false);
    const cancelledChequeAttached = ref(false);
    const swipeAmount = ref('');
    const swipeDate = ref('');
    const swipedTerminal = ref('');
    const chequeAmount = ref('');
    const chequeDate = ref('');
    const chequeDepositedDate = ref('');
    const chequeUTR = ref('');
    const collectionBankName = ref(null);

    // Computed property for global file fetch URL
    const GLOBAL_FILE_FETCH_URL = computed(() => {
      return store.getters['GlobalVariables/GLOBAL_FILE_FETCH_URL'];
    });

    // Methods
    const emitToggleRemarks = () => {
      emit('togglePDFModal');
    };

    const fnDocumentUrl = (documentUrl) => {
      populatedDocumentUrl.value = documentUrl;
      showDocumentPreview.value = !showDocumentPreview.value;
    };

    const fnCloseDocumentPreview = () => {
      showDocumentPreview.value = !showDocumentPreview.value;
    };

    const fnPDFViewModal = (documentUrl, viewChequeFlag) => {
      if (viewChequeFlag === 'CHEQUE') {
        PDFDetails.value = documentUrl;
        toggleshowPDFModal.value = !toggleshowPDFModal.value;
      } else {
        PDFDetails.value = documentUrl;
        toggleshowPDFModal.value = !toggleshowPDFModal.value;
      }
    };

    const fnViewHandedOverFileImage = () => {
      if (handedOverImageViewer.value) {
        handedOverImageViewer.value.click();
      }
    };

    return {
      // Refs
      step,
      stepper,
      handedOverImageViewer,
      PDFDetails,
      toggleshowPDFModal,
      showImage,
      showDocumentPreview,
      populatedDocumentUrl,
      formData,
      
      // Options
      institutionCodeOptions,
      applicationTypeOptions,
      selectCityOptions,
      selectStateOptions,
      selectOptions,
      
      // OnBoard Details
      onBoardDetails,
      
      // Form fields
      merchantType,
      salesPerson,
      region,
      leadFrom,
      bankMDR,
      bijlipayMDR,
      sharingModel,
      businessEntityType,
      yearEstablishment,
      mcc,
      tcc,
      residentialAddress,
      residentialPin,
      residentialCity,
      residentialState,
      contactName,
      mobile,
      altMobile1,
      altMobile2,
      telephone,
      email,
      statementType,
      paperStatement,
      partnerName,
      partnerAddress,
      partnerPAN,
      partnerPIN,
      partnerCity,
      partnerState,
      partnerMobile,
      partnerEmail,
      weekdayFrom,
      weekdayTo,
      weekendFrom,
      weekendTo,
      businessIncome,
      turnoverYear,
      turnoverAmount,
      expectedCardBusiness,
      averageBillAmount,
      gstId,
      currentPOS,
      debitCard,
      creditCard,
      memberSince,
      deviceOwnedBy,
      installationFee,
      terminalModel,
      noOfTerminals,
      cashAtPOS,
      rentalPlan,
      rentalMode,
      rentalType,
      devicePrice,
      otherCharges,
      totalAmountPaid,
      ifscCode,
      micr,
      bankName,
      branchName,
      bankCity,
      bankState,
      accountType,
      accountNumber,
      bankStatementAttached,
      cancelledChequeAttached,
      swipeAmount,
      swipeDate,
      swipedTerminal,
      chequeAmount,
      chequeDate,
      chequeDepositedDate,
      chequeUTR,
      collectionBankName,
      
      // Computed
      GLOBAL_FILE_FETCH_URL,
      
      // Methods
      emitToggleRemarks,
      fnDocumentUrl,
      fnCloseDocumentPreview,
      fnPDFViewModal,
      fnViewHandedOverFileImage
    };
  }
};
</script>

<style scoped>
.no-underline {
  text-decoration: none;
}

.cursor-pointer {
  cursor: pointer;
}

.common-dark-blue {
  background-color: #1976d2;
  color: white;
}

.hidden {
  display: none;
}
</style>