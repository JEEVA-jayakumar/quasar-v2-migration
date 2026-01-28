<template>
  <div>
    <!-- Documents -->
    <div id="mainContainer" class="row">
      <!-- Documents proof -->
      <div id="leftSidePane" class="col-md-5 q-pa-xs largeCont" v-if="showDocumentPreview">
        <viewLeadDocumentsDataEntryComponent :propLeadDocumentInformation="propLeadDeatils.leadDocuments"
          :propGetShortInfo="propLeadDeatils" />
      </div>
      <!-- Document related form -->
      <div id="rightSidePane" class="col-md-7 q-pa-xs block relative merchant">
        <q-stepper color="purple-9" ref="stepper" contractable text alternative-labels>
          <q-step :error="error.tab.salesInformation" name="first" title="Sales" subtitle="Info">
            <!-- {{merchant.paymentDetails.amountCollected}} -->
            <div class="row gutter-sm">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" disable v-model="leadSourceApp.sourceName" label="Lead Source*" />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" disable v-model="deviceTypeApp.deviceName" label="Device Type*" />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select :class="{
    'readonly-select': propLeadDeatils.leadSource.sourceName === 'LS_TOHANDS'
  }" :disable="propLeadDeatils.leadStatus == 102 || propLeadDeatils.leadSource.sourceName === 'LS_TOHANDS'"
                  :error="v$.merchant.salesInformation.institutionCode.$error" placeholder="Choose from the below"
                  color="grey-9" v-model="merchant.salesInformation.institutionCode"
                  label="Institution Code*" :options="getinstitutionCode"
                  @update:model-value="fetchAllDropdownValuesFromMARSapi" />
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.institutionCode.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.salesInformation.institutionCode
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.salesInformation.institutionCode.$error">
                  <div v-if="v$.merchant.salesInformation.institutionCode.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div v-if="merchant.salesInformation.institutionCode == 104" class="row gutter-sm q-my-xs">
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model="merchant.additionalInfo.branchZone" label="ZONE*" :options="getAllZone"
                    @clear="fnClearZone" @update:model-value="fnFetchZone()" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model="merchant.additionalInfo.iaDistrict" label="IA_District*"
                    :options="getAllDistrict" @update:model-value="fnFetchBranchName()" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select disable placeholder="Choose from the below*" color="grey-9"
                    v-model="merchant.additionalInfo.raDistrict" label="RA_District*"
                    :options="getAllDistrict" @clear="fnClearZone" @update:model-value="fnFetchZone()" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select disable placeholder="Choose from the below*" color="grey-9"
                    v-model="merchant.additionalInfo.od1District" label="OD1_District*"
                    :options="getAllDistrict" @clear="fnClearZone" @update:model-value="fnFetchZone()" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select disable placeholder="Choose from the below*" color="grey-9"
                    v-model="merchant.additionalInfo.od2District" label="OD2_District*"
                    :options="getAllDistrict" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9" v-model="
                      merchant.additionalInfo.installationBranchCode
                    " label="InstallationBranchName*" :options="getAllBranchName" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-input color="grey-9" v-model="merchant.additionalInfo.lorState"
                    label="IOR_STATE(type min 3 characters)*" placeholder="Start typing ..*">
                    <template #append>
                      <q-autocomplete @search="searchIorState" :debounce="10" :min-characters="3" />
                    </template>
                  </q-input>
                </div>

                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-input color="grey-9" v-model="merchant.additionalInfo.pin" label="Pincode"
                    placeholder="Start typing ..*" @update:model-value="pincodeBasedDistrict">
                    <template #append>
                      <q-autocomplete @search="searchAxisBankPincode" :min-characters="3" />
                    </template>
                  </q-input>
                </div>

                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model="merchant.additionalInfo.state" label="State*"
                    @update:model-value="pincodeandDistrictBasedCity" :options="getPincodeBasedDistrict" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model="merchant.additionalInfo.city" label="City*" :options="getPincodeDistrict"
                    @update:model-value="citybasedlocation" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model="merchant.additionalInfo.iaLocation" label="IA_LOCATION*"
                    :options="getCityBasedLocation" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model="merchant.additionalInfo.iaSalutation" label="IA_Salution*"
                    :options="iaSalutationOptions" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model="merchant.additionalInfo.iaGender" label="IA_Gender*"
                    :options="iaGenderOptions" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model="merchant.additionalInfo.od1Salutation" label="OD1_Salutation*"
                    :options="od1SalutationOptions" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model="merchant.additionalInfo.od1Gender" label="OD1_Gender*"
                    :options="od1GenderOptions" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model="merchant.additionalInfo.od2Salutation" label="OD2_Salutation*"
                    :options="od2SalutationOptions" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model="merchant.additionalInfo.od2Gender" label="OD2_Gender*"
                    :options="od2GenderOptions" />
                </div>
              </div>

              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select @blur="v$.merchant.salesInformation.applicationType.$touch"
                  :error="v$.merchant.salesInformation.applicationType.$error" placeholder="Choose from the below*"
                  color="grey-9" v-model="merchant.salesInformation.applicationType"
                  label="Application Type*" :options="applicationTypeOptions" />
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.applicationType.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.salesInformation.applicationType
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.salesInformation.applicationType.$error">
                  <div v-if="v$.merchant.salesInformation.applicationType.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input readonly @blur="v$.merchant.salesInformation.applicationNumber.$touch"
                  :error="v$.merchant.salesInformation.applicationNumber.$error" color="grey-9"
                  v-model="merchant.salesInformation.applicationNumber" label="Application Number*"
                  placeholder="Application Number*" />
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.applicationNumber
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.salesInformation.applicationNumber
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.salesInformation.applicationNumber.$error">
                  <div v-if="v$.merchant.salesInformation.applicationNumber.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="v$.merchant.salesInformation.applicationDate.$touch"
                  :error="v$.merchant.salesInformation.applicationDate.$error" color="grey-9"
                  v-model="merchant.salesInformation.applicationDate"
                  label="Application Date*" placeholder="Application Date*">
                  <template #append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="merchant.salesInformation.applicationDate" mask="DD/MM/YYYY">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.applicationDate.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.salesInformation.applicationDate
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.salesInformation.applicationDate.$error">
                  <div v-if="v$.merchant.salesInformation.applicationDate.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="v$.merchant.salesInformation.aggreementDate.$touch"
                  :error="v$.merchant.salesInformation.aggreementDate.$error" color="grey-9"
                  v-model="merchant.salesInformation.aggreementDate" label="Agreement Date*"
                  placeholder="Agreement Date*">
                  <template #append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="merchant.salesInformation.aggreementDate" mask="DD/MM/YYYY">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.aggreementDate.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.salesInformation.aggreementDate
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.salesInformation.aggreementDate.$error">
                  <div v-if="v$.merchant.salesInformation.aggreementDate.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select @blur="v$.merchant.salesInformation.merchantType.$touch"
                  :error="v$.merchant.salesInformation.merchantType.$error" placeholder="Choose from the below*"
                  color="grey-9" v-model="merchant.salesInformation.merchantType" label="Merchant Type*"
                  :options="merchantTypeOptions" />
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.merchantType.alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.salesInformation.merchantType" />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.salesInformation.merchantType.$error">
                  <div v-if="v$.merchant.salesInformation.merchantType.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select @blur="v$.merchant.salesInformation.categoryType.$touch"
                  :error="v$.merchant.salesInformation.categoryType.$error" placeholder="Choose from the below*"
                  color="grey-9" v-model="merchant.salesInformation.categoryType" label="Category Type*"
                  :options="categoryTypeOptions" />
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.categoryType.alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.salesInformation.categoryType" />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.salesInformation.categoryType.$error">
                  <div v-if="v$.merchant.salesInformation.categoryType.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select placeholder="Choose from the below*" color="grey-9"
                  @blur="v$.merchant.salesInformation.region.$touch" :error="v$.merchant.salesInformation.region.$error"
                  v-model="merchant.salesInformation.region" label="Region*" :options="regionOptions" />
                <div class="text-negative" v-if="error.field.merchant.salesInformation.region.alert">
                  <MarsErrorResponse :error="error.field.merchant.salesInformation.region" />
                </div>

                <div class="text-negative q-py-xs group q-caption" v-if="v$.merchant.salesInformation.region.$error">
                  <div v-if="v$.merchant.salesInformation.region.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select placeholder="Choose from the below*" color="grey-9" clearable
                  @blur="v$.merchant.salesInformation.salesPersonName.$touch"
                  :error="v$.merchant.salesInformation.salesPersonName.$error"
                  v-model="merchant.salesInformation.salesPersonName" label="Sales Person*"
                  :options="salesPersonOptions" />

                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.salesPersonName.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.salesInformation.salesPersonName
                    " />
                </div>

                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.salesInformation.salesPersonName.$error">
                  <div v-if="v$.merchant.salesInformation.salesPersonName.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select placeholder="Choose from the below*" color="grey-9"
                  @blur="v$.merchant.salesInformation.leadFrom.$touch"
                  :error="v$.merchant.salesInformation.leadFrom.$error"
                  v-model="merchant.salesInformation.leadFrom" label="Lead From*" :options="leadFromOptions"
                  :disable="propLeadDeatils.leadSource.sourceName === 'LS_TOHANDS'" :class="{
    'readonly-select': propLeadDeatils.leadSource.sourceName === 'LS_TOHANDS'
  }" />
                <div class="text-negative" v-if="error.field.merchant.salesInformation.leadFrom.alert">
                  <MarsErrorResponse :error="error.field.merchant.salesInformation.leadFrom" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="v$.merchant.salesInformation.leadFrom.$error">
                  <div v-if="v$.merchant.salesInformation.leadFrom.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>

              <div class="fillingTypesOptions">
                <p class="q-caption">Sharing Model</p>
                <div v-for="(item, index) in viewBinding.sharingModelCode" :key="index">
                  <q-radio color="grey-9" v-model="merchant.salesInformation.sharingModelCode" :val="item.value"
                    :label="item.label" @update:model-value="sharemodebasedonSharingMode()" />
                </div>
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.sharingModelCode.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.salesInformation.sharingModelCode
                    " />
                </div>
              </div>
            </div>
            <!-- T => Transaction value model -->
            <div v-if="merchant.salesInformation.sharingModelCode == 'T'" class="row gutter-sm q-my-xs">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select @blur="v$.merchant.salesInformation.sharingPartnerCode.$touch" :error="
                    v$.merchant.salesInformation.sharingPartnerCode.$error
                  " placeholder="Choose from the below*" color="grey-9"
                  v-model="merchant.salesInformation.sharingPartnerCode" label="Sharing partner*"
                  :options="sharingPartnerCode" />
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.sharingPartnerCode.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.salesInformation.sharingPartnerCode
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.salesInformation.sharingPartnerCode.$error">
                  <div v-if="v$.merchant.salesInformation.sharingPartnerCode.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="v$.merchant.salesInformation.dailyFixedAmount.$touch"
                  :error="v$.merchant.salesInformation.dailyFixedAmount.$error" color="grey-9"
                  v-model="merchant.salesInformation.dailyFixedAmount" label="Daily fixed amount*"
                  type="number" placeholder="Daily fixed amount*" />
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.dailyFixedAmount.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.salesInformation.dailyFixedAmount
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.salesInformation.dailyFixedAmount.$error">
                  <div v-if="v$.merchant.salesInformation.dailyFixedAmount.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div v-if="
                      v$.merchant.salesInformation.dailyFixedAmount.minValue.$invalid ||
                      v$.merchant.salesInformation.dailyFixedAmount.maxValue.$invalid
                    ">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    v$.merchant.salesInformation.dailyFixedAmount.minValue.$params.min
                    }}
                    and
                    {{
                    v$.merchant.salesInformation.dailyFixedAmount.maxValue.$params.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="
                    v$.merchant.salesInformation.loanDisbursementPercentage
                      .$touch;
                  " :error="
                    v$.merchant.salesInformation.loanDisbursementPercentage
                      .$error
                  " color="grey-9" v-model="
                    merchant.salesInformation.loanDisbursementPercentage
                  " label="Percentage*" type="number" placeholder="Percentage*" />
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation
                      .loanDisbursementPercentage.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.salesInformation
                        .loanDisbursementPercentage
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    v$.merchant.salesInformation.loanDisbursementPercentage
                      .$error
                  ">
                  <div v-if="v$.merchant.salesInformation.loanDisbursementPercentage.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div v-if="
                      v$.merchant.salesInformation.loanDisbursementPercentage
                        .minValue.$invalid ||
                      v$.merchant.salesInformation.loanDisbursementPercentage
                        .maxValue.$invalid
                    ">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    v$.merchant.salesInformation.loanDisbursementPercentage
                    .minValue.$params.min
                    }}
                    and
                    {{
                    v$.merchant.salesInformation.loanDisbursementPercentage
                    .maxValue.$params.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="
                    v$.merchant.salesInformation.loanDisbursementAmount.$touch
                  " :error="
                    v$.merchant.salesInformation.loanDisbursementAmount.$error
                  " color="grey-9" v-model="
                    merchant.salesInformation.loanDisbursementAmount
                  " label="Loan disbursement value*" type="number" placeholder="Loan disbursement value*" />
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.loanDisbursementAmount
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.salesInformation
                        .loanDisbursementAmount
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    v$.merchant.salesInformation.loanDisbursementAmount.$error
                  ">
                  <div v-if="v$.merchant.salesInformation.loanDisbursementAmount.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div v-if="
                      v$.merchant.salesInformation.loanDisbursementAmount
                        .minValue.$invalid ||
                      v$.merchant.salesInformation.loanDisbursementAmount
                        .maxValue.$invalid
                    ">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    v$.merchant.salesInformation.loanDisbursementAmount
                    .minValue.$params.min
                    }}
                    and
                    {{
                    v$.merchant.salesInformation.loanDisbursementAmount
                    .maxValue.$params.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="
                    v$.merchant.salesInformation.loanDisbursementDate.$touch
                  " :error="
                    v$.merchant.salesInformation.loanDisbursementDate.$error
                  " color="grey-9" v-model="merchant.salesInformation.loanDisbursementDate"
                  label="Disbursement Date*" placeholder="Disbursement Date*">
                  <template #append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="merchant.salesInformation.loanDisbursementDate" mask="DD/MM/YYYY">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.loanDisbursementDate
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.salesInformation.loanDisbursementDate
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    v$.merchant.salesInformation.loanDisbursementDate.$error
                  ">
                  <div v-if="v$.merchant.salesInformation.loanDisbursementDate.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="v$.merchant.salesInformation.tenureMonth.$touch"
                  :error="v$.merchant.salesInformation.tenureMonth.$error" color="grey-9"
                  v-model="merchant.salesInformation.tenureMonth" label="Tenure (in months)*" type="number"
                  placeholder="Tenure (in months)*" />
                <div class="text-negative" v-if="error.field.merchant.salesInformation.tenureMonth.alert">
                  <MarsErrorResponse :error="error.field.merchant.salesInformation.tenureMonth" />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.salesInformation.tenureMonth.$error">
                  <div v-if="v$.merchant.salesInformation.tenureMonth.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="v$.merchant.salesInformation.tenureDay.$touch"
                  :error="v$.merchant.salesInformation.tenureDay.$error" color="grey-9"
                  v-model="merchant.salesInformation.tenureDay" label="Tenure (in days)*" type="number"
                  placeholder="Tenure (in days)*" />
                <div class="text-negative" v-if="error.field.merchant.salesInformation.tenureDay.alert">
                  <MarsErrorResponse :error="error.field.merchant.salesInformation.tenureDay" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="v$.merchant.salesInformation.tenureDay.$error">
                  <div v-if="v$.merchant.salesInformation.tenureDay.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="v$.merchant.salesInformation.tenureStartDate.$touch"
                  :error="v$.merchant.salesInformation.tenureStartDate.$error" color="grey-9"
                  v-model="merchant.salesInformation.tenureStartDate" label="Start Date*"
                  placeholder="Tenure Start Date*">
                  <template #append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="merchant.salesInformation.tenureStartDate" mask="DD/MM/YYYY">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.tenureStartDate.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.salesInformation.tenureStartDate
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.salesInformation.tenureStartDate.$error">
                  <div v-if="v$.merchant.salesInformation.tenureStartDate.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
            </div>
            <!-- M => MDR/cash@pos/rent -->
            <div v-if="merchant.salesInformation.sharingModelCode == 'M'" class="row gutter-sm q-my-xs">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select @blur="v$.merchant.salesInformation.sharingPartnerCode.$touch" :error="
                    v$.merchant.salesInformation.sharingPartnerCode.$error
                  " placeholder="Choose from the below*" color="grey-9"
                  v-model="merchant.salesInformation.sharingPartnerCode" label="Sharing partner*"
                  :options="sharingPartnerCode" />
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.sharingPartnerCode
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.salesInformation.sharingPartnerCode
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.salesInformation.sharingPartnerCode.$error">
                  <div v-if="v$.merchant.salesInformation.sharingPartnerCode.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="v$.merchant.salesInformation.rentPercentage.$touch"
                  :error="v$.merchant.salesInformation.rentPercentage.$error" color="grey-9"
                  v-model="merchant.salesInformation.rentPercentage" label="Rent %*" type="number"
                  placeholder="Rent %*" />
                <div class="text-negative" v-if="
                    error.field.merchant.salesInformation.rentPercentage.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.salesInformation.rentPercentage
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.salesInformation.rentPercentage.$error">
                  <div v-if="v$.merchant.salesInformation.rentPercentage.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div v-if="
                      v$.merchant.salesInformation.rentPercentage.minValue.$invalid ||
                      v$.merchant.salesInformation.rentPercentage.maxValue.$invalid
                    ">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    v$.merchant.salesInformation.rentPercentage.minValue.$params.min
                    }}
                    and
                    {{
                    v$.merchant.salesInformation.rentPercentage.maxValue.$params.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="v$.merchant.salesInformation.rentFixed.$touch"
                  :error="v$.merchant.salesInformation.rentFixed.$error" color="grey-9"
                  v-model="merchant.salesInformation.rentFixed" label="Rent fixed*" type="number"
                  placeholder="Rent fixed*" />
                <div class="text-negative" v-if="error.field.merchant.salesInformation.rentFixed.alert">
                  <MarsErrorResponse :error="error.field.merchant.salesInformation.rentFixed" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="v$.merchant.salesInformation.rentFixed.$error">
                  <div v-if="v$.merchant.salesInformation.rentFixed.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div v-if="
                      v$.merchant.salesInformation.rentFixed.minValue.$invalid ||
                      v$.merchant.salesInformation.rentFixed.maxValue.$invalid
                    ">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    v$.merchant.salesInformation.rentFixed.minValue.$params.min
                    }}
                    and
                    {{
                    v$.merchant.salesInformation.rentFixed.maxValue.$params.max
                    }}
                  </div>
                </div>
              </div>
            </div>
            <!-- Navigation for this step at the end of QStep-->
            <q-stepper-navigation>
              <q-btn color="primary" class="q-ma-xs" icon="check" @click="validatebeforeNavigate('salesInformation')"
                label="Continue" />
              <q-btn color="amber-10" class="q-ma-xs" icon="inbox" label="Save Partial" @click="saveCurrentChanges()" />
              <q-btn color="negative" class="q-ma-xs" icon="backspace" label="Back to Document Validation"
                @click="goBackToDocumentVerificationStage()" />
            </q-stepper-navigation>
          </q-step>
          <q-step :error="error.tab.companyInformation" name="second" title="Details">
            <div class="row gutter-sm">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input type="text" @blur="v$.merchant.companyInformation.legalName.$touch"
                  :error="v$.merchant.companyInformation.legalName.$error" color="grey-9"
                  v-model="merchant.companyInformation.legalName" label="Legal Name*"
                  placeholder="Legal Name*" />
                <div class="text-negative" v-if="error.field.merchant.companyInformation.legalName.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.legalName" />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.companyInformation.legalName.$error">
                  <div v-if="
                      !/^[a-zA-Z0-9\s]*$/.test(
                        merchant.companyInformation.legalName
                      )
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Only
                    AlphaNumeric and spaces are allowed.
                  </div>
                  <div v-if="
                      v$.merchant.companyInformation.legalName.minLength.$invalid ||
                      v$.merchant.companyInformation.legalName.maxLength.$invalid
                    ">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Length should be between
                    {{
                    v$.merchant.companyInformation.legalName.minLength.$params.min
                    }}
                    and
                    {{
                    v$.merchant.companyInformation.legalName.maxLength.$params.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="v$.merchant.companyInformation.dbaName.$touch"
                  :error="v$.merchant.companyInformation.dbaName.$error" color="grey-9"
                  v-model="merchant.companyInformation.dbaName" label="DBA Name*" placeholder="DBA Name*" />
                <div class="text-negative" v-if="error.field.merchant.companyInformation.dbaName.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.dbaName" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="v$.merchant.companyInformation.dbaName.$error">
                  <div v-if="v$.merchant.companyInformation.dbaName.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Only digits and alphabets are allowed
                  </div>
                  <div v-if="
                      v$.merchant.companyInformation.dbaName.minLength.$invalid ||
                      v$.merchant.companyInformation.dbaName.maxLength.$invalid
                    ">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Length should be between
                    {{
                    v$.merchant.companyInformation.dbaName.minLength.$params.min
                    }}
                    and
                    {{
                    v$.merchant.companyInformation.dbaName.maxLength.$params.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <p class="q-caption">SMS Enable or Disable?</p>
                <div class="group">
                  <q-radio @blur="v$.merchant.companyInformation.smsFlag.$touch"
                    :error="v$.merchant.companyInformation.smsFlag.$error" v-for="(item, index) in smsFlagOptions"
                    :key="index" color="grey-9" v-model="merchant.companyInformation.smsFlag" :val="item.value"
                    :label="item.label" />
                  <div class="text-negative" v-if="error.field.merchant.companyInformation.smsFlag.alert">
                    <MarsErrorResponse :error="error.field.merchant.companyInformation.smsFlag" />
                  </div>
                  <div class="text-negative q-py-xs group q-caption"
                    v-if="v$.merchant.companyInformation.smsFlag.$error">
                    <div>
                      <q-icon color="negative" name="warning" />&nbsp;Required
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" label="Registered Address* (max 120 characters)"
                  placeholder="Registered Address*" v-model="merchant.companyInformation.registeredAddress" @blur="
                    v$.merchant.companyInformation.registeredAddress.$touch
                  " :error="
                    v$.merchant.companyInformation.registeredAddress.$error
                  " />
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.registeredAddress
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation.registeredAddress
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.companyInformation.registeredAddress.$error">
                  <div v-if="v$.merchant.companyInformation.registeredAddress.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Only digits and alphabets are allowed
                  </div>
                  <div v-if="
                      v$.merchant.companyInformation.registeredAddress.minLength.$invalid ||
                      v$.merchant.companyInformation.registeredAddress.maxLength.$invalid
                    ">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Length should be between
                    {{
                    v$.merchant.companyInformation.registeredAddress.minLength.$params.min
                    }}
                    and
                    {{
                    v$.merchant.companyInformation.registeredAddress.maxLength.$params.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" type="text" @blur="v$.merchant.companyInformation.cityzone.$touch"
                  :error="v$.merchant.companyInformation.cityzone.$error"
                  v-model="merchant.companyInformation.cityzone" label="Merchant City Zone"
                  placeholder="Merchant City Zone" />
                <div class="text-negative" v-if="error.field.merchant.companyInformation.cityzone.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.cityzone" />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.companyInformation.cityzone.$error">
                  <div v-if="
                      !/^[a-zA-Z\s]*$/.test(
                        merchant.companyInformation.cityzone
                      )
                    ">
                    <q-icon color="negative" name="warning" />&nbsp;Only
                    Alphabets and spaces are allowed.
                  </div>
                  <div v-if="v$.merchant.companyInformation.cityzone.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="fnClrRegisteredCity" :error="
                    autoCompleteError(
                      v$.merchant.companyInformation.registeredCityRefCode,
                      v$.merchant.companyInformation.registeredCityName
                    )
                  " color="grey-9" v-model="merchant.companyInformation.registeredCityName"
                  @update:model-value="fninputTyping($event, 1)" label="Registered city (type min 3 characters)*"
                  placeholder="Start typing ..*">
                  <template #append>
                    <q-autocomplete @search="residentCitySearch" :debounce="10" :min-characters="3"
                      @selected="registeredCitySelected" />
                  </template>
                </q-input>
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation
                      .registeredCityRefCode.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation
                        .registeredCityRefCode
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    v$.merchant.companyInformation.registeredCityRefCode
                      .$error ||
                    v$.merchant.companyInformation.registeredCityName.$error
                  ">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Type and choose from the suggestions
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select @blur="v$.merchant.companyInformation.statezone.$touch"
                  :error="v$.merchant.companyInformation.statezone.$error" placeholder="Choose from the below*"
                  color="grey-9" v-model="merchant.companyInformation.statezone"
                  label=" Merchant State Zone*" :options="statezoneOptions" />

                <div class="text-negative" v-if="error.field.merchant.companyInformation.statezone.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.statezone" />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.companyInformation.statezone.$error">
                  <div v-if="v$.merchant.companyInformation.statezone.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="fnClrRegisteredState" :error="
                    autoCompleteError(
                      v$.merchant.companyInformation.registeredStateRefCode,
                      v$.merchant.companyInformation.registeredStateName
                    )
                  " color="grey-9" v-model="merchant.companyInformation.registeredStateName"
                  @update:model-value="fninputTyping($event, 2)" label="Registered state (type min 3 characters)*"
                  placeholder="Start typing ..*">
                  <template #append>
                    <q-autocomplete @search="residentStateSearch" :debounce="10" :min-characters="1"
                      @selected="registeredStateSelected" />
                  </template>
                </q-input>
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation
                      .registeredStateRefCode.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation
                        .registeredStateRefCode
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    v$.merchant.companyInformation.registeredStateRefCode
                      .$error ||
                    v$.merchant.companyInformation.registeredStateName.$error
                  ">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Type and choose from the suggestions
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="v$.merchant.companyInformation.registeredPin.$touch"
                  :error="v$.merchant.companyInformation.registeredPin.$error" color="grey-9" type="number"
                  v-model="merchant.companyInformation.registeredPin" label="PIN*" placeholder="PIN*" />
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.registeredPin.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation.registeredPin
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.companyInformation.registeredPin.$error">
                  <div v-if="v$.merchant.companyInformation.registeredPin.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div v-if="v$.merchant.companyInformation.registeredPin.minLength.$invalid">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Length should be between
                    {{
                    v$.merchant.companyInformation.registeredPin.minLength.$params.min
                    }}
                    and
                    {{
                    v$.merchant.companyInformation.registeredPin.maxLength.$params.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select @blur="v$.merchant.companyInformation.constitutionName.$touch" :error="
                    v$.merchant.companyInformation.constitutionName.$error
                  " placeholder="Choose from the below*" color="grey-9"
                  v-model="merchant.companyInformation.constitutionName" label="Type of Business Entity*"
                  :options="merchantOptions" />

                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.constitutionName
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation.constitutionName
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.companyInformation.constitutionName.$error">
                  <div v-if="v$.merchant.companyInformation.constitutionName.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="v$.merchant.companyInformation.establishYear.$touch"
                  :error="v$.merchant.companyInformation.establishYear.$error" color="grey-9"
                  v-model="merchant.companyInformation.establishYear" label="Year of Establishment*"
                  placeholder="Year of Establishment*">
                  <template #append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="merchant.companyInformation.establishYear" mask="DD/MM/YYYY">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.establishYear.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation.establishYear
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.companyInformation.establishYear.$error">
                  <div v-if="v$.merchant.companyInformation.establishYear.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" @blur="v$.merchant.companyInformation.registerNumber.$touch"
                  :error="v$.merchant.companyInformation.registerNumber.$error"
                  v-model="merchant.companyInformation.registerNumber" label="Establish Number*"
                  placeholder="Establish Number*" />
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.registerNumber.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation.registerNumber
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.companyInformation.registerNumber.$error">
                  <div v-if="v$.merchant.companyInformation.registerNumber.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Accepts alphanumeric values
                  </div>
                  <div v-if="v$.merchant.companyInformation.registerNumber.minLength.$invalid">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Length should be between
                    {{
                    v$.merchant.companyInformation.registerNumber.minLength.$params.min
                    }}
                    and
                    {{
                    v$.merchant.companyInformation.registerNumber.maxLength.$params.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="v$.merchant.companyInformation.tin.$touch"
                  :error="v$.merchant.companyInformation.tin.$error" color="grey-9"
                  v-model="merchant.companyInformation.tin" label="TIN" placeholder="TIN" />
                <div class="text-negative" v-if="error.field.merchant.companyInformation.tin.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.tin" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="v$.merchant.companyInformation.tin.$error">
                  <div v-if="v$.merchant.companyInformation.tin.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    provide valid TIN
                  </div>
                  <div v-if="v$.merchant.companyInformation.tin.minLength.$invalid">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Length should be between
                    {{
                    v$.merchant.companyInformation.tin.minLength.$params.min
                    }}
                    and
                    {{
                    v$.merchant.companyInformation.tin.maxLength.$params.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="v$.merchant.companyInformation.pan.$touch"
                  :error="v$.merchant.companyInformation.pan.$error" color="grey-9"
                  v-model="merchant.companyInformation.pan" label="Company PAN*"
                  placeholder="Company PAN*" />
                <div class="text-negative" v-if="error.field.merchant.companyInformation.pan.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.pan" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="v$.merchant.companyInformation.pan.$error">
                  <div v-if="v$.merchant.companyInformation.pan.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    provide valid PAN
                  </div>
                  <div v-if="v$.merchant.companyInformation.pan.minLength.$invalid">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Length should be between
                    {{
                    v$.merchant.companyInformation.pan.minLength.$params.min
                    }}
                    and
                    {{
                    v$.merchant.companyInformation.pan.maxLength.$params.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="v$.merchant.companyInformation.tan.$touch"
                  :error="v$.merchant.companyInformation.tan.$error" color="grey-9"
                  v-model="merchant.companyInformation.tan" label="TAN" placeholder="TAN" />
                <div class="text-negative" v-if="error.field.merchant.companyInformation.tan.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.tan" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="v$.merchant.companyInformation.tan.$error">
                  <div v-if="v$.merchant.companyInformation.tan.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    provide valid TAN
                  </div>
                  <div v-if="v$.merchant.companyInformation.tan.minLength.$invalid">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Length should be between
                    {{
                    v$.merchant.companyInformation.tan.minLength.$params.min
                    }}
                    and
                    {{
                    v$.merchant.companyInformation.tan.maxLength.$params.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" v-model="merchant.companyInformation.businessNature"
                  label="Nature of Business" placeholder="Nature of Business" />
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.businessNature.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation.businessNature
                    " />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select placeholder="Choose from the below*" color="grey-9"
                  v-model="merchant.companyInformation.businessType" label="Type of Business"
                  :options="businessTypeOptions" />
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.businessType.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation.businessType
                    " />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="v$.merchant.companyInformation.mcc.$touch" :error="
                    autoCompleteError(
                      v$.merchant.companyInformation.mcc,
                      v$.merchant.companyInformation.mccname
                    )
                  " color="grey-9" v-model="merchant.companyInformation.mccname"
                  label="MCC (type min 3 characters)" placeholder="Start typing ..*">
                  <template #append>
                    <q-autocomplete @search="mccSearch" :debounce="10" :min-characters="3"
                      @selected="mccSelected" />
                  </template>
                </q-input>
                <div class="text-negative" v-if="error.field.merchant.companyInformation.mcc.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.mcc" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    v$.merchant.companyInformation.mcc.$error ||
                    v$.merchant.companyInformation.mccname.$error
                  ">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Type and choose from the suggestions
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="
                    v$.merchant.companyInformation.residentialAddress.$touch
                  " :error="
                    v$.merchant.companyInformation.residentialAddress.$error
                  " color="grey-9" v-model="merchant.companyInformation.residentialAddress"
                  label="Residential Address* (max 120 characters)" placeholder="Residential Address*" />
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.residentialAddress
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation.residentialAddress
                    " />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="v$.merchant.companyInformation.residentialPin.$touch"
                  :error="v$.merchant.companyInformation.residentialPin.$error" color="grey-9" type="number"
                  v-model="merchant.companyInformation.residentialPin" label="Pincode*"
                  placeholder="Pincode*" />
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.residentialPin.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation.residentialPin
                    " />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="
                    v$.merchant.companyInformation.residentialCityRefCode.$touch
                  " :error="
                    autoCompleteError(
                      v$.merchant.companyInformation.residentialCityRefCode,
                      v$.merchant.companyInformation.residentCityName
                    )
                  " color="grey-9" v-model="merchant.companyInformation.residentCityName"
                  label="City (type min 3 characters)*" placeholder="Start typing ..*">
                  <template #append>
                    <q-autocomplete @search="residentCitySearch" :debounce="10" :min-characters="3"
                      @selected="residentCitySelected" />
                  </template>
                </q-input>
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation
                      .residentialCityRefCode.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation
                        .residentialCityRefCode
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    v$.merchant.companyInformation.residentialCityRefCode
                      .$error ||
                    v$.merchant.companyInformation.residentCityName.$error
                  ">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Type and choose from the suggestions
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="
                    v$.merchant.companyInformation.residentialStateRefCode
                      .$touch;
                  " :error="
                    autoCompleteError(
                      v$.merchant.companyInformation.residentialStateRefCode,
                      v$.merchant.companyInformation.residentStateName
                    )
                  " color="grey-9" v-model="merchant.companyInformation.residentStateName"
                  label="State (type min 3 characters)*" placeholder="Start typing ..*">
                  <template #append>
                    <q-autocomplete @search="residentStateSearch" :debounce="10" :min-characters="1"
                      @selected="residentStateSelected" />
                  </template>
                </q-input>
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation
                      .residentialStateRefCode.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation
                        .residentialStateRefCode
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    v$.merchant.companyInformation.residentialStateRefCode
                      .$error ||
                    v$.merchant.companyInformation.residentStateName.$error
                  ">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Type and choose from the suggestions
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="v$.merchant.companyInformation.contactName.$touch"
                  :error="v$.merchant.companyInformation.contactName.$error"
                  onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123)"
                  color="grey-9" v-model="merchant.companyInformation.contactName" label="Contact Name*"
                  placeholder="Contact Name*" />
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.contactName.alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.contactName" />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.companyInformation.contactName.$error">
                  <div v-if="v$.merchant.companyInformation.contactName.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div v-if="v$.merchant.companyInformation.contactName.minLength.$invalid">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Length should be between
                    {{
                    v$.merchant.companyInformation.contactName.minLength.$params.min
                    }}
                    and
                    {{
                    v$.merchant.companyInformation.contactName.maxLength.$params.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="v$.merchant.companyInformation.contactMobile.$touch"
                  :error="v$.merchant.companyInformation.contactMobile.$error" color="grey-9"
                  v-model="merchant.companyInformation.contactMobile" label="Contact mobile*"
                  placeholder="Contact Mobile*" />
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.contactMobile.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation.contactMobile
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.companyInformation.contactMobile.$error">
                  <div v-if="v$.merchant.companyInformation.contactMobile.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div v-if="v$.merchant.companyInformation.contactMobile.minLength.$invalid">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Length should be between
                    {{
                    v$.merchant.companyInformation.contactMobile.minLength.$params.min
                    }}
                    and
                    {{
                    v$.merchant.companyInformation.contactMobile.maxLength.$params.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" type="tel" @blur="
                    v$.merchant.companyInformation.contactAlternateMobile.$touch
                  " :error="
                    v$.merchant.companyInformation.contactAlternateMobile.$error
                  " v-model="
                    merchant.companyInformation.contactAlternateMobile
                  " label="Contact Alt Mobile" placeholder="Contact Alt Mobile" />
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation
                      .contactAlternateMobile.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation
                        .contactAlternateMobile
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    v$.merchant.companyInformation.contactAlternateMobile.$error
                  ">
                  <div v-if="v$.merchant.companyInformation.contactAlternateMobile.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div v-if="v$.merchant.companyInformation.contactAlternateMobile.minLength.$invalid">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Length should be between
                    {{
                    v$.merchant.companyInformation.contactAlternateMobile.minLength.$params.min
                    }}
                    and
                    {{
                    v$.merchant.companyInformation.contactAlternateMobile.maxLength.$params.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" type="tel" @blur="v$.merchant.companyInformation.contactPhone.$touch"
                  :error="v$.merchant.companyInformation.contactPhone.$error"
                  v-model="merchant.companyInformation.contactPhone" label="Contact Phone* (12 digits)"
                  placeholder="Contact Phone* (12 digits)" />
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.contactPhone.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation.contactPhone
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.companyInformation.contactPhone.$error">
                  <div v-if="v$.merchant.companyInformation.contactPhone.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div v-if="v$.merchant.companyInformation.contactPhone.minLength.$invalid">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Length should be between
                    {{
                    v$.merchant.companyInformation.contactPhone.minLength.$params.min
                    }}
                    and
                    {{
                    v$.merchant.companyInformation.contactPhone.maxLength.$params.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="v$.merchant.companyInformation.contactEmail.$touch"
                  :error="v$.merchant.companyInformation.contactEmail.$error" color="grey-9" type="email"
                  v-model="merchant.companyInformation.contactEmail" label="Contact Email*"
                  placeholder="Contact Email*" />
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.contactEmail.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation.contactEmail
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.companyInformation.contactEmail.$error">
                  <div v-if="v$.merchant.companyInformation.contactEmail.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div v-if="v$.merchant.companyInformation.contactEmail.email.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp; Invalid
                    email address format
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <div class="q-caption">Statement type</div>
                <div class="group">
                  <q-radio @blur="v$.merchant.companyInformation.statementType.$touch"
                    :error="v$.merchant.companyInformation.statementType.$error"
                    v-for="(item, index) in viewBinding.statementType" :key="index" color="grey-9"
                    v-model="merchant.companyInformation.statementType" :val="item.value" :label="item.label" />
                </div>
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.statementType.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation.statementType
                    " />
                </div>
              </div>
              <div class="col-md-12 col-sm-12 col-xs-12">
                <p class="q-caption">Statement frequency</p>
                <div class="group">
                  <q-radio @blur="
                      v$.merchant.companyInformation.statementFrequency.$touch
                    " :error="
                      v$.merchant.companyInformation.statementFrequency.$error
                    " v-for="(item, index) in viewBinding.statementFrequency" :key="index" color="grey-9" v-model="
                      merchant.companyInformation.statementFrequency
                    " :val="item.value" :label="item.label" />
                </div>
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.statementFrequency
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation.statementFrequency
                    " />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" label="Statement Email" placeholder="Statement Email"
                  @blur="v$.merchant.companyInformation.statementEmail.$touch"
                  :error="v$.merchant.companyInformation.statementEmail.$error"
                  v-model="merchant.companyInformation.statementEmail" />
                <div class="text-negative" v-if="
                    error.field.merchant.companyInformation.statementEmail.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.companyInformation.statementEmail
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.companyInformation.statementEmail.$error">
                  <div v-if="v$.merchant.companyInformation.statementEmail.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div v-if="v$.merchant.companyInformation.statementEmail.email.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp; Invalid
                    email address format
                  </div>
                </div>
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn color="primary" class="q-ma-xs" icon="check" @click="validatebeforeNavigate('companyInformation')"
                label="Continue" />
              <q-btn color="grey-7" class="q-ma-xs" icon="block" @click="previousClicked()" label="Previous" />
              <q-btn color="amber-10" class="q-ma-xs" icon="inbox" label="Save Partial" @click="saveCurrentChanges()" />
              <q-btn color="negative" class="q-ma-xs" icon="backspace" label="Back to document validation"
                @click="goBackToDocumentVerificationStage()" />
            </q-stepper-navigation>
          </q-step>
          <q-step :error="error.tab.partnerInformation" name="third" title="Partners">
            <div v-for="(v, index) in v$.viewBinding.partnersArr.$each.$iter" :key="index" class="row q-my-xs gutter-sm"
              ref="parentElement">
              <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="row group items-center">
                  <div class="col">
                    <span class="q-pa-sm bg-light text-dark">
                      <q-icon name="people" />
                      Partner 0{{ parseInt(index) + 1 }}
                    </span>
                  </div>
                  <div class="col-auto" v-if="
                      Object.keys(v$.viewBinding.partnersArr.$each.$iter)
                        .length > 1
                    ">
                    <q-btn round icon="delete" @click="removePartnerFromArr(v, index)" color="negative" />
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input :error="v.name.$anyError" @blur="v.name.$touch()" color="grey-9" v-model="v.$model.name"
                  label="Name*" placeholder="Name*" />
                <div class="text-negative" v-if="
                    error.field.merchant.partnerInformation[index].name.alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.partnerInformation[index]" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="v.name.$anyError">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input :min="past" :max="future" v-model="v.$model.dob"
                  label="PAN DOB *" placeholder="PAN DOB *">
                  <template #append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="v.$model.dob" mask="DD/MM/YYYY">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input :error="v.pan.$anyError" @blur="v.pan.$touch()" color="grey-9"
                  v-model="v.$model.pan" label="Pan*" placeholder="Pan*" />
                <div class="textf-negative" v-if="
                    error.field.merchant.partnerInformation[index].pan.alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.partnerInformation[index]" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="v.pan.$anyError">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    provide valid PAN
                  </div>
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp; Should be
                    10 digits
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input :error="v.address.$anyError" @blur="v.address.$touch()" color="grey-9"
                  v-model="v.$model.address" label="Address* (max 120 characters)" placeholder="Address*" />
                <div class="text-negative" v-if="
                    error.field.merchant.partnerInformation[index].address.alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.partnerInformation[index]" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="v.address.$anyError">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input :error="v.pin.$anyError" @blur="v.pin.$touch()" color="grey-9" type="number"
                  v-model="v.$model.pin" label="Pincode*" placeholder="Pincode*" />
                <div class="text-negative" v-if="
                    error.field.merchant.partnerInformation[index].pin.alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.partnerInformation[index]" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="v.pin.$anyError">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    provide valid pincode
                  </div>
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp; Should be
                    between 6 and 7 digits
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input :error="autoCompleteError(v.cityRefLabel, v.cityRefCode)" color="grey-9"
                  v-model="v.$model.cityRefLabel" label="City (type min 3 characters)*"
                  placeholder="Start typing ..*">
                  <template #append>
                    <q-autocomplete @search="partnerCitySearch" :debounce="10" :min-characters="3"
                      @selected="(obj) => partnerCitySelected(obj, index)" />
                  </template>
                </q-input>
                <div class="text-negative" v-if="
                    error.field.merchant.partnerInformation[index].cityRefCode
                      .alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.partnerInformation[index]" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="v.cityRefLabel.$error || v.cityRefCode.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Type and choose from the suggestions
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input :error="autoCompleteError(v.stateRefLabel, v.stateRefCode)" @blur="v.stateRefLabel.$touch()"
                  color="grey-9" v-model="v.$model.stateRefLabel" label="State (type min 3 characters)*"
                  placeholder="Start typing ..*">
                  <template #append>
                    <q-autocomplete @search="partnerStateSearch" :debounce="10" :min-characters="1"
                      @selected="(obj) => partnerStateSelected(obj, index)" />
                  </template>
                </q-input>
                <div class="text-negative" v-if="
                    error.field.merchant.partnerInformation[index].stateRefCode
                      .alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.partnerInformation[index]" />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v.stateRefCode.$anyError || v.stateRefLabel.$anyError">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Type and choose from the suggestions
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input :error="v.contactMobile.$anyError" @blur="v.contactMobile.$touch()" color="grey-9" type="tel"
                  v-model="v.$model.contactMobile" label="Mobile*" placeholder="Mobile*" />
                <div class="text-negative" v-if="
                    error.field.merchant.partnerInformation[index].contactMobile
                      .alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.partnerInformation[index]" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="v.contactMobile.$anyError">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Accepts only digits
                  </div>
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp; Should be
                    10 digits
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input :error="v.contactEmail.$anyError" @blur="v.contactEmail.$touch()" color="grey-9" type="email"
                  v-model="v.$model.contactEmail" label="Email*" placeholder="Email*" />
                <div class="text-negative" v-if="
                    error.field.merchant.partnerInformation[index].contactEmail
                      .alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.partnerInformation[index]" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="v.contactEmail.$anyError">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Provide valid email address
                  </div>
                </div>
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn color="primary" class="q-ma-xs" icon="check" @click="validatebeforeNavigate('partners')"
                label="Continue" />
              <q-btn color="grey-7" class="q-ma-xs" icon="block" @click="previousClicked()" label="Previous" />
              <q-btn color="amber-10" class="q-ma-xs" icon="inbox" label="Save Partial" @click="saveCurrentChanges()" />
              <q-btn color="positive float-right" @click="addMorePartnersSet()" class="q-ma-xs" icon="add"
                label="Add More" />
              <q-btn color="negative" class="q-ma-xs" icon="backspace" label="Back to document validation"
                @click="goBackToDocumentVerificationStage()" />
            </q-stepper-navigation>
          </q-step>
          <q-step :error="error.tab.businessInformation" name="fourth" title="Business"
            subtitle="Info">
            <div class="row gutter-sm">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select color="grey-9" @blur="
                    v$.merchant.businessInformation.weekdayStartHour.$touch
                  " :error="
                    v$.merchant.businessInformation.weekdayStartHour.$error
                  " v-model="merchant.businessInformation.weekdayStartHour"
                  label="Weekday start hour (00.00)*" :options="BusinessHourFromOptions"
                  placeholder="Weekday start hour" />
                <div class="text-negative" v-if="
                    error.field.merchant.businessInformation.weekdayStartHour
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.businessInformation.weekdayStartHour
                    " />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select color="grey-9" @blur="v$.merchant.businessInformation.weekdayEndHour.$touch"
                  :error="v$.merchant.businessInformation.weekdayEndHour.$error"
                  v-model="merchant.businessInformation.weekdayEndHour" label="Weekday end hour (00.00)*"
                  :options="BusinessHourToOptions" placeholder="Weekday end hour" />
                <div class="text-negative" v-if="
                    error.field.merchant.businessInformation.weekdayEndHour
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.businessInformation.weekdayEndHour
                    " />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select color="grey-9" @blur="
                    v$.merchant.businessInformation.weekendStartHour.$touch
                  " :error="
                    v$.merchant.businessInformation.weekendStartHour.$error
                  " v-model="merchant.businessInformation.weekendStartHour"
                  label="Weekend start hour (00.00)*" :options="BusinessHourFromOptions"
                  placeholder="Weekend start hour" />
                <div class="text-negative" v-if="
                    error.field.merchant.businessInformation.weekendStartHour
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.businessInformation.weekendStartHour
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.businessInformation.weekendStartHour.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Provide valid start hour
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select color="grey-9" @blur="v$.merchant.businessInformation.weekendEndHour.$touch"
                  :error="v$.merchant.businessInformation.weekendEndHour.$error"
                  v-model="merchant.businessInformation.weekendEndHour" label="Weekend end hour (00.00)*"
                  :options="BusinessHourToOptions" placeholder="Weekend end hour" />
                <div class="text-negative" v-if="
                    error.field.merchant.businessInformation.weekendEndHour
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.businessInformation.weekendEndHour
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.businessInformation.weekendEndHour.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Provide valid end hour
                  </div>
                </div>
              </div>
              <!--<div class="col-md-6 col-sm-12 col-xs-12">
                  <q-input color="grey-9" type="number" v-model="merchant.businessInformation.weekdayStartHour" label="Business Income" placeholder="Business Income" />
              </div>-->

              <div class="col-md-6 col-sm-12 col-xs-12 col-xs-12">
                <q-input color="grey-9" @blur="
                    v$.merchant.businessInformation.lastTurnoverYear.$touch
                  " :error="
                    v$.merchant.businessInformation.lastTurnoverYear.$error
                  " v-model="merchant.businessInformation.lastTurnoverYear" label="Last turnover year"
                  placeholder="Last turnover year" />
                <div class="text-negative" v-if="
                    error.field.merchant.businessInformation.lastTurnoverYear
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.businessInformation.lastTurnoverYear
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.businessInformation.lastTurnoverYear.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Provide valid year
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" type="number" @blur="
                    v$.merchant.businessInformation.maximumMonthlyUsage.$touch
                  " :error="
                    v$.merchant.businessInformation.maximumMonthlyUsage.$error
                  " v-model="
                    merchant.businessInformation.maximumMonthlyUsage
                  " label="Maximum Monthly Usage*" placeholder="Maximum Monthly Usage*" />

                <div class="text-negative" v-if="
                    error.field.merchant.businessInformation.maximumMonthlyUsage
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.businessInformation
                        .maximumMonthlyUsage
                    " />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select @blur="
                    v$.merchant.businessInformation.merchantTypeCode.$touch
                  " :error="
                    v$.merchant.businessInformation.merchantTypeCode.$error
                  " placeholder="Choose from the below*" color="grey-9"
                  v-model="merchant.businessInformation.merchantTypeCode" label="merchant Category*"
                  :options="merchantTypeCodeOptions" />
                <div class="text-negative" v-if="
                    error.field.merchant.businessInformation.merchantTypeCode
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.businessInformation.merchantTypeCode
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.businessInformation.merchantTypeCode.$error">
                  <div v-if="v$.merchant.businessInformation.merchantTypeCode.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" type="number" @blur="
                    v$.merchant.businessInformation.lastTurnoverAmount.$touch
                  " :error="
                    v$.merchant.businessInformation.lastTurnoverAmount.$error
                  " v-model="merchant.businessInformation.lastTurnoverAmount"
                  label="Turnover during last year" placeholder="Turnover during last year" />
                <div class="text-negative" v-if="
                    error.field.merchant.businessInformation.lastTurnoverAmount
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.businessInformation
                        .lastTurnoverAmount
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    v$.merchant.businessInformation.lastTurnoverAmount.$error
                  ">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div>
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    v$.merchant.businessInformation.lastTurnoverAmount.minValue.$params.min
                    }}
                    and
                    {{
                    v$.merchant.businessInformation.lastTurnoverAmount.maxValue.$params.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" type="number" @blur="
                    v$.merchant.businessInformation.expectedCardBusiness.$touch
                  " :error="
                    v$.merchant.businessInformation.expectedCardBusiness.$error
                  " v-model="
                    merchant.businessInformation.expectedCardBusiness
                  " label="Expected Card Business*" placeholder="Expected Card Business*" />
                <div class="text-negative" v-if="
                    error.field.merchant.businessInformation
                      .expectedCardBusiness.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.businessInformation
                        .expectedCardBusiness
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    v$.merchant.businessInformation.expectedCardBusiness.$error
                  ">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div>
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    v$.merchant.businessInformation.expectedCardBusiness
                    .minValue.$params.min
                    }}
                    and
                    {{
                    v$.merchant.businessInformation.expectedCardBusiness
                    .maxValue.$params.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" type="number" @blur="
                    v$.merchant.businessInformation.averageBillAmount.$touch
                  " :error="
                    v$.merchant.businessInformation.averageBillAmount.$error
                  " v-model="merchant.businessInformation.averageBillAmount" label="Average Bill Amount"
                  placeholder="Average Bill Amount" />
                <div class="text-negative" v-if="
                    error.field.merchant.businessInformation.averageBillAmount
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.businessInformation.averageBillAmount
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    v$.merchant.businessInformation.averageBillAmount.$error
                  ">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div>
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    v$.merchant.businessInformation.averageBillAmount.minValue.$params.min
                    }}
                    and
                    {{
                    v$.merchant.businessInformation.averageBillAmount.maxValue.$params.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" @blur="v$.merchant.businessInformation.gstId.$touch"
                  :error="v$.merchant.businessInformation.gstId.$error"
                  v-model="merchant.businessInformation.gstId" @change="marsRequiredFormattingofGST"
                  label="GST ID" placeholder="GST ID" />
                <div class="text-negative" v-if="error.field.merchant.businessInformation.gstId.alert">
                  <MarsErrorResponse :error="error.field.merchant.businessInformation.gstId" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="v$.merchant.businessInformation.gstId.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Provide valid GST Number
                  </div>
                  <div v-if="v$.merchant.businessInformation.gstId.minLength.$invalid">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Length should be between
                    {{
                    v$.merchant.businessInformation.gstId.minLength.$params.min
                    }}
                    and
                    {{
                    v$.merchant.businessInformation.gstId.maxLength.$params.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select placeholder="Choose from the below*" color="grey-9"
                  v-model="merchant.businessInformation.currentPosName" label="Already having a mPOS/POS*"
                  :options="currentPosOptions" />
              </div>

              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" @blur="v$.merchant.businessInformation.debitCardMdr.$touch"
                  :error="v$.merchant.businessInformation.debitCardMdr.$error"
                  v-model="merchant.businessInformation.debitCardMdr" label="Debit Card MDR"
                  placeholder="Debit Card MDR" />
                <div class="text-negative" v-if="
                    error.field.merchant.businessInformation.debitCardMdr.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.businessInformation.debitCardMdr
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.businessInformation.debitCardMdr.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div>
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    v$.merchant.businessInformation.debitCardMdr.minValue.$params.min
                    }}
                    and
                    {{
                    v$.merchant.businessInformation.debitCardMdr.maxValue.$params.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" @blur="v$.merchant.businessInformation.creditCardMdr.$touch"
                  :error="v$.merchant.businessInformation.creditCardMdr.$error"
                  v-model="merchant.businessInformation.creditCardMdr" label="Credit Card MDR"
                  placeholder="Credit Card MDR" />
                <div class="text-negative" v-if="
                    error.field.merchant.businessInformation.creditCardMdr.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.businessInformation.creditCardMdr
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.businessInformation.creditCardMdr.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div>
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    v$.merchant.businessInformation.creditCardMdr.minValue.$params.min
                    }}
                    and
                    {{
                    v$.merchant.businessInformation.creditCardMdr.maxValue.$params.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="v$.merchant.businessInformation.memberSince.$touch"
                  :error="v$.merchant.businessInformation.memberSince.$error" color="grey-9"
                  v-model="merchant.businessInformation.memberSince" label="Member since*"
                  placeholder="Member since*">
                  <template #append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="merchant.businessInformation.memberSince" mask="DD/MM/YYYY">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <div class="text-negative" v-if="
                    error.field.merchant.businessInformation.memberSince.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.businessInformation.memberSince
                    " />
                </div>
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn color="primary" class="q-ma-xs" icon="check" @click="validatebeforeNavigate('businessInformation')"
                label="Continue" />
              <q-btn color="grey-7" class="q-ma-xs" icon="block" @click="previousClicked()" label="Previous" />
              <q-btn color="amber-10" class="q-ma-xs" icon="inbox" label="Save Partial" @click="saveCurrentChanges()" />
              <q-btn color="negative" class="q-ma-xs" icon="backspace" label="Back to document validation"
                @click="goBackToDocumentVerificationStage()" />
            </q-stepper-navigation>
          </q-step>
          <q-step :error="error.tab.paymentDetails" name="fifth" title="Payment"
            subtitle="Details">
            <div class="row gutter-sm">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <p class="q-caption">Device Owned By</p>
                <div class="group">
                  <q-radio @blur="v$.merchant.paymentDetails.deviceOwnedBy.$touch"
                    :error="v$.merchant.paymentDetails.deviceOwnedBy.$error"
                    v-for="(item, index) in deviceOwnedByOptions" :key="index" color="grey-9"
                    v-model="merchant.paymentDetails.deviceOwnedBy" :val="item.value" :label="item.label" />
                  <div class="text-negative" v-if="
                      error.field.merchant.paymentDetails.deviceOwnedBy.alert
                    ">
                    <MarsErrorResponse :error="error.field.merchant.paymentDetails.deviceOwnedBy" />
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select @blur="VasSelected" placeholder="Choose from the below" color="grey-9"
                  :error="v$.merchant.paymentDetails.terminalModeCode.$error"
                  v-model="merchant.paymentDetails.terminalModeCode" :options="terminalModelSet"
                  label="Terminal Model*" />
                <!-- @update:model-value="mccbasedSelect" -->
                <div class="text-negative" v-if="
                    error.field.merchant.paymentDetails.terminalModeCode.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.paymentDetails.terminalModeCode
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.paymentDetails.terminalModeCode.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div v-if="
                  merchant.salesInformation.institutionCode == 109 ||
                  merchant.salesInformation.institutionCode == 104
                " class="col-md-6 col-sm-12 col-xs-12">
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model="merchant.paymentDetails.cardAcceptance" label="Card Acceptance"
                    :options="cardAcceptanceOptions" />
                </div>
              </div>

              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select @blur="v$.merchant.paymentDetails.terminalType.$touch"
                  :error="v$.merchant.paymentDetails.terminalType.$error" placeholder="Choose from the below*"
                  color="grey-9" v-model="merchant.paymentDetails.terminalType" label="Terminal Type*"
                  :options="terminalTypeOptions" />
                <!-- @update:model-value="terminalBased" -->
                <div class="text-negative" v-if="error.field.merchant.paymentDetails.terminalType.alert">
                  <MarsErrorResponse :error="error.field.merchant.paymentDetails.terminalType" />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.paymentDetails.terminalType.$error">
                  <div v-if="v$.merchant.paymentDetails.terminalType.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div v-if="merchant.paymentDetails.terminalType == 'MPOS'" class="row gutter-sm q-my-xs">
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model="merchant.additionalInfo.state" label="STATE*" :options="getMposState"
                    @update:model-value="fnMposStatebasedCity()" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model="merchant.additionalInfo.city" label="CITY*" :options="getMposCity" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model="merchant.additionalInfo.fillingType" label="FillingTypes*"
                    :options="getAllFillingTypes" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model="merchant.additionalInfo.category" label="Category*" :options="getMposCategory"
                    @update:model-value="categoryBasedSubCategory" />
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-select placeholder="Choose from the below*" color="grey-9"
                    v-model="merchant.additionalInfo.subCategory" label="SubCategory*"
                    :options="getMposSubCategory" />
                </div>

                <div class="col-md-6 col-sm-12 col-xs-12">
                  <q-input color="grey-9" v-model="merchant.additionalInfo.ownerDOB" label="Date Of Birth*"
                    placeholder="Date Of Birth*">
                    <template #append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="merchant.additionalInfo.ownerDOB" mask="DD/MM/YYYY">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>

                <div class="col-md-12">
                  <div class="row items-center">
                    <div class="col-3">
                      <div class="q-caption text-weight-medium">200 to 999</div>
                    </div>
                    <div class="col">
                      <div class="q-caption text-weight-medium q-py-sm" align="center">
                        customIncentiveRates
                      </div>
                      <div class="row group">
                        <div class="col">
                          <q-input color="grey-9" type="number" v-model="
                              merchant.customIncentiveRates[0].mechantFixed
                            " placeholder="Merchant - A" @update:model-value="populateCustom" />
                        </div>

                        <div class="col">
                          <q-input color="grey-9" type="number" v-model="
                              merchant.customIncentiveRates[0].sharingFixed
                            " placeholder="Distributor - B" @update:model-value="populateCustom" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="row items-center">
                    <div class="col-3">
                      <div class="q-caption text-weight-medium">
                        1000 to 1999
                      </div>
                    </div>
                    <div class="col">
                      <div class="row group">
                        <div class="col">
                          <q-input color="grey-9" type="number" v-model="
                              merchant.customIncentiveRates[1].mechantFixed
                            " placeholder="Merchant - A" @update:model-value="populateCustom1" />
                        </div>
                        <div class="col">
                          <q-input color="grey-9" type="number" v-model="
                              merchant.customIncentiveRates[1].sharingFixed
                            " placeholder="Distributor - B" @update:model-value="populateCustom1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="row items-center">
                    <div class="col-3">
                      <div class="q-caption text-weight-medium">
                        2000 to 2999
                      </div>
                    </div>
                    <div class="col">
                      <div class="row group">
                        <div class="col">
                          <q-input color="grey-9" type="number" v-model="
                              merchant.customIncentiveRates[2].mechantFixed
                            " placeholder="Merchant - A" @update:model-value="populateCustom2" />
                        </div>
                        <div class="col">
                          <q-input color="grey-9" type="number" v-model="
                              merchant.customIncentiveRates[2].sharingFixed
                            " placeholder="Distributor - B" @update:model-value="populateCustom2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="row items-center">
                    <div class="col-3">
                      <div class="q-caption text-weight-medium">
                        3000 to 3499
                      </div>
                    </div>
                    <div class="col">
                      <div class="row group">
                        <div class="col">
                          <q-input color="grey-9" type="number" v-model="
                              merchant.customIncentiveRates[3].mechantFixed
                            " placeholder="Merchant - A" @update:model-value="populateCustom3" />
                        </div>
                        <div class="col">
                          <q-input color="grey-9" type="number" v-model="
                              merchant.customIncentiveRates[3].sharingFixed
                            " placeholder="Distributor - B" @update:model-value="populateCustom3" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="row items-center">
                    <div class="col-3">
                      <div class="q-caption text-weight-medium">
                        3500 to 10000
                      </div>
                    </div>
                    <div class="col">
                      <div class="row group">
                        <div class="col">
                          <q-input color="grey-9" type="number" v-model="
                              merchant.customIncentiveRates[4].mechantFixed
                            " placeholder="Merchant - A" @update:model-value="populateCustom4" />
                        </div>

                        <div class="col">
                          <q-input color="grey-9" type="number" v-model="
                              merchant.customIncentiveRates[4].sharingFixed
                            " placeholder="Distributor - B" @update:model-value="populateCustom4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-sm-12">
                <q-input color="grey-9" type="number" disable
                  @blur="v$.merchant.paymentDetails.numberOfTerminals.$touch"
                  :error="v$.merchant.paymentDetails.numberOfTerminals.$error"
                  v-model="merchant.paymentDetails.numberOfTerminals" label="No of Terminals*"
                  placeholder="No of Terminals*" />
                <div class="text-negative" v-if="
                    error.field.merchant.paymentDetails.numberOfTerminals.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.paymentDetails.numberOfTerminals
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.paymentDetails.numberOfTerminals.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div>
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    v$.merchant.paymentDetails.numberOfTerminals.minValue.$params.min
                    }}
                    and
                    {{
                    v$.merchant.paymentDetails.numberOfTerminals.maxValue.$params.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <div class="group">
                  <q-checkbox @blur="v$.merchant.paymentDetails.omcEnabled.$touch"
                    :error="v$.merchant.paymentDetails.omcEnabled.$error"
                    v-model="merchant.paymentDetails.omcEnabled" color="black" label="1% OMC Convenience fee :"
                    left-label />
                  <div class="text-negative" v-if="error.field.merchant.paymentDetails.omcEnabled.alert">
                    <MarsErrorResponse :error="error.field.merchant.paymentDetails.omcEnabled" />
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12" v-if="merchant.paymentDetails.omcEnabled == true"></div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <p class="q-caption">International Card Acceptance Enabled?</p>
                <div class="group">
                  <q-radio @blur="v$.merchant.paymentDetails.intlCardAcceptance.$touch" :error="
                      v$.merchant.paymentDetails.intlCardAcceptance.$error
                    " v-for="(item, index) in internationalCardAcceptanceOptions" :key="index" color="grey-9"
                    v-model="merchant.paymentDetails.intlCardAcceptance" :val="item.value" :label="item.label" />
                  <div class="text-negative" v-if="
                      error.field.merchant.paymentDetails.intlCardAcceptance
                        .alert
                    ">
                    <MarsErrorResponse :error="
                        error.field.merchant.paymentDetails.intlCardAcceptance
                      " />
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <p class="q-caption">Credit card block Enabled?</p>
                <div class="group">
                  <q-radio @blur="v$.merchant.paymentDetails.creditCardBlock.$touch"
                    :error="v$.merchant.paymentDetails.creditCardBlock.$error"
                    v-for="(item, index) in creditCardBlockOptions" :key="index" color="grey-9"
                    v-model="merchant.paymentDetails.creditCardBlock" :val="item.value" :label="item.label" />
                  <div class="text-negative" v-if="
                      error.field.merchant.paymentDetails.creditCardBlock.alert
                    ">
                    <MarsErrorResponse :error="
                        error.field.merchant.paymentDetails.creditCardBlock
                      " />
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" v-model="merchant.paymentDetails.tipPercentage"
                  label="Tip Percentage" placeholder="Tip Percentage" />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input color="grey-9" type="number" @blur="v$.merchant.paymentDetails.installationFee.$touch"
                  :error="v$.merchant.paymentDetails.installationFee.$error"
                  v-model="merchant.paymentDetails.installationFee" label="Installation Fee*"
                  placeholder="Installation Fee*" />
                <div class="text-negative" v-if="
                    error.field.merchant.paymentDetails.installationFee.alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.paymentDetails.installationFee" />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.paymentDetails.installationFee.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div>
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    v$.merchant.paymentDetails.installationFee.minValue.$params.min
                    }}
                    and
                    {{
                    v$.merchant.paymentDetails.installationFee.maxValue.$params.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select clearable placeholder="Choose from the below*" color="grey-9"
                  v-model="merchant.paymentDetails.rentalPlanCode"
                  :error="v$.merchant.paymentDetails.rentalPlanCode.$error" label="Rental Plan*"
                  :options="rentalPlanSet" />
                <div class="text-negative" v-if="
                    error.field.merchant.paymentDetails.rentalPlanCode.alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.paymentDetails.rentalPlanCode" />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.paymentDetails.rentalPlanCode.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input readonly color="grey-9" v-model="merchant.paymentDetails.recurringFees"
                  label="Recurring Fees*" />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select placeholder="Choose from the below*" color="grey-9"
                  v-model="merchant.paymentDetails.rentalMode" label="Rental Mode*"
                  :options="rentalModeOptions" @update:model-value="handleInputrentalMode" />
                <div class="text-negative" v-if="error.field.merchant.paymentDetails.rentalMode.alert">
                  <MarsErrorResponse :error="error.field.merchant.paymentDetails.rentalMode" />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12" v-if="merchant.paymentDetails.rentalMode == 'IB'">
                <q-input readonly color="grey-9" v-model="bankFee" type="number"
                  label="Bank rental (Without GST)*" />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12" v-if="merchant.paymentDetails.rentalMode == 'SB'">
                <q-input readonly color="grey-9" v-model="bankFee" label="Rental Amount (Without GST)*" />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12" v-if="merchant.paymentDetails.rentalMode == 'SB'">
                <q-input color="grey-9" v-model="subventionBankFeeData" label="Bank rental (Without GST)*"
                  type="text" @update:model-value="handleInput" />

                <div class="text-negative" v-if="
                    subventionBankFeeData > propLeadDeatils.recurringFees / 1.18
                  ">
                  {{ "Bank Rental should be lesser than rental amount" }}
                </div>
                <div class="text-negative" v-if="
                    subventionBankFeeData == '' ||
                    this.subventionBankFeeData == undefined ||
                    this.subventionBankFeeData == null
                  ">
                  {{ " Bank rental shouldn't be empty" }}
                </div>
                <div class="text-negative" v-if="/[^0-9]/.test(subventionBankFeeData)">
                  {{ " only numbers are allowed" }}
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <p class="q-caption">Rental Type</p>
                <div class="group">
                  <q-radio @blur="v$.merchant.paymentDetails.rentalType.$touch"
                    :error="v$.merchant.paymentDetails.rentalType.$error" v-for="(item, index) in rentalTypeOptions"
                    :key="index" color="grey-9" v-model="merchant.paymentDetails.rentalType" :val="item.value"
                    :label="item.label" @update:model-value="selectCurrentType()" />
                  <div class="text-negative" v-if="error.field.merchant.paymentDetails.rentalType.alert">
                    <MarsErrorResponse :error="error.field.merchant.paymentDetails.rentalType" />
                  </div>
                </div>
              </div>
              <div v-if="merchant.paymentDetails.rentalType == 'E'" class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="v$.merchant.paymentDetails.totalEmiAmount.$touch"
                  :error="v$.merchant.paymentDetails.totalEmiAmount.$error" color="grey-9" type="number"
                  v-model="merchant.paymentDetails.totalEmiAmount" label="Total Emi Amount*"
                  placeholder="Total Emi Amount*" />
                <div class="text-negative" v-if="
                    error.field.merchant.paymentDetails.totalEmiAmount.alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.paymentDetails.totalEmiAmount" />
                </div>
              </div>
              <div v-if="merchant.paymentDetails.rentalType == 'E'" class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="v$.merchant.paymentDetails.emiTenure.$touch"
                  :error="v$.merchant.paymentDetails.emiTenure.$error" color="grey-9" type="number"
                  v-model="merchant.paymentDetails.emiTenure" label="Emi Tenure*"
                  placeholder="Emi Tenure*" />
                <div class="text-negative" v-if="error.field.merchant.paymentDetails.emiTenure.alert">
                  <MarsErrorResponse :error="error.field.merchant.paymentDetails.emiTenure" />
                </div>
              </div>
              <div v-if="merchant.paymentDetails.rentalType == 'E'" class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="v$.merchant.paymentDetails.emiStartDate.$touch"
                  :error="v$.merchant.paymentDetails.emiStartDate.$error" color="grey-9"
                  v-model="merchant.paymentDetails.emiStartDate" label="Emi Start Date*"
                  placeholder="Emi Start Date*">
                  <template #append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="merchant.paymentDetails.emiStartDate" mask="DD/MM/YYYY">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <div class="text-negative" v-if="error.field.merchant.paymentDetails.emiStartDate.alert">
                  <MarsErrorResponse :error="error.field.merchant.paymentDetails.emiStartDate" />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.paymentDetails.emiStartDate.$error">
                  <div v-if="v$.merchant.paymentDetails.emiStartDate.required.$invalid">
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>
              <div v-if="merchant.paymentDetails.rentalType == 'R'" class="col-md-6 col-sm-12 col-xs-12">
                <q-input @blur="v$.merchant.paymentDetails.gracePeriod.$touch"
                  :error="v$.merchant.paymentDetails.gracePeriod.$error" color="grey-9" type="number"
                  v-model="merchant.paymentDetails.gracePeriod" label="Grace period*"
                  placeholder="Grace period*" />
                <div class="text-negative" v-if="error.field.merchant.paymentDetails.gracePeriod.alert">
                  <MarsErrorResponse :error="error.field.merchant.paymentDetails.gracePeriod" />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="v$.merchant.paymentDetails.gracePeriod.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div>
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    v$.merchant.paymentDetails.gracePeriod.minValue.$params.min
                    }}
                    and
                    {{
                    v$.merchant.paymentDetails.gracePeriod.maxValue.$params.max
                    }}
                  </div>
                </div>
              </div>
              <div v-if="merchant.paymentDetails.rentalType == 'A'" class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" type="number" @blur="v$.merchant.paymentDetails.advanceRentCollected.$touch"
                  :error="
                    v$.merchant.paymentDetails.advanceRentCollected.$error
                  " v-model="merchant.paymentDetails.advanceRentCollected" label="Advance Rent Collected*"
                  placeholder="Advance Rent Collected*" />
                <div class="text-negative" v-if="
                    error.field.merchant.paymentDetails.advanceRentCollected
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.paymentDetails.advanceRentCollected
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.paymentDetails.advanceRentCollected.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div>
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    v$.merchant.paymentDetails.advanceRentCollected.minValue.$params.min
                    }}
                    and
                    {{
                    v$.merchant.paymentDetails.advanceRentCollected.maxValue.$params.max
                    }}
                  </div>
                </div>
              </div>
              <div v-if="merchant.paymentDetails.rentalType == 'A'" class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" type="number" @blur="
                    v$.merchant.paymentDetails.noOfMonthRentPaidInAdvance.$touch
                  " :error="
                    v$.merchant.paymentDetails.noOfMonthRentPaidInAdvance.$error
                  " v-model="
                    merchant.paymentDetails.noOfMonthRentPaidInAdvance
                  " label="No. Of Month Rent Paid In Advance*"
                  placeholder="No. Of Month Rent Paid In Advance*" />
                <div class="text-negative" v-if="
                    error.field.merchant.paymentDetails
                      .noOfMonthRentPaidInAdvance.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.paymentDetails
                        .noOfMonthRentPaidInAdvance
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    v$.merchant.paymentDetails.noOfMonthRentPaidInAdvance.$error
                  ">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div>
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    v$.merchant.paymentDetails.noOfMonthRentPaidInAdvance
                    .minValue.$params.min
                    }}
                    and
                    {{
                    v$.merchant.paymentDetails.noOfMonthRentPaidInAdvance
                    .maxValue.$params.max
                    }}
                  </div>
                </div>
              </div>
              <div v-if="merchant.paymentDetails.rentalType == 'A'" class="col-md-6 col-sm-12 col-xs-12">
                <p class="q-caption">Advanced Rent Mode</p>
                <div class="group">
                  <q-radio @blur="v$.merchant.paymentDetails.advanceRentMode.$touch"
                    :error="v$.merchant.paymentDetails.advanceRentMode.$error"
                    v-for="(item, index) in advanceRentModeOptions" :key="index" color="grey-9"
                    v-model="merchant.paymentDetails.advanceRentMode" :val="item.value" :label="item.label" />
                  <div class="text-negative" v-if="
                      error.field.merchant.paymentDetails.advanceRentMode.alert
                    ">
                    <MarsErrorResponse :error="
                        error.field.merchant.paymentDetails.advanceRentMode
                      " />
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" v-model="devicePrice" label="Device Price*"
                  placeholder="Device Price*" />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input color="grey-9" type="number" @blur="v$.merchant.paymentDetails.otherCharges.$touch"
                  :error="v$.merchant.paymentDetails.otherCharges.$error"
                  v-model="merchant.paymentDetails.otherCharges" label="Other Charges"
                  placeholder="Other Charges" />
                <div class="text-negative" v-if="error.field.merchant.paymentDetails.otherCharges.alert">
                  <MarsErrorResponse :error="error.field.merchant.paymentDetails.otherCharges" />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.paymentDetails.otherCharges.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div>
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    v$.merchant.paymentDetails.otherCharges.minValue.$params.min
                    }}
                    and
                    {{
                    v$.merchant.paymentDetails.otherCharges.maxValue.$params.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input color="grey-9" type="number" @blur="v$.merchant.paymentDetails.totalAmountPaid.$touch"
                  :error="v$.merchant.paymentDetails.totalAmountPaid.$error"
                  v-model="merchant.paymentDetails.totalAmountPaid" label="Total Amount Paid"
                  placeholder="Total Amount Paid" />
                <div class="text-negative" v-if="
                    error.field.merchant.paymentDetails.totalAmountPaid.alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.paymentDetails.totalAmountPaid" />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.paymentDetails.totalAmountPaid.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                  <div>
                    <q-icon color="negative" name="warning" />
                    &nbsp;Value should be between
                    {{
                    v$.merchant.paymentDetails.totalAmountPaid.minValue.$params.min
                    }}
                    and
                    {{
                    v$.merchant.paymentDetails.totalAmountPaid.maxValue.$params.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select placeholder="Choose from the below*" color="grey-9"
                  @blur="v$.merchant.paymentDetails.serviceProvider.$touch"
                  :error="v$.merchant.paymentDetails.serviceProvider.$error"
                  v-model="merchant.paymentDetails.serviceProvider" label="Service provider*"
                  :options="serviceProviderListSet" />
                <div class="text-negative" v-if="
                    error.field.merchant.paymentDetails.serviceProvider.alert
                  ">
                  <MarsErrorResponse :error="error.field.merchant.paymentDetails.serviceProvider" />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select placeholder="Choose from the below*" color="grey-9"
                  @blur="v$.merchant.paymentDetails.networkPreferred.$touch"
                  :error="v$.merchant.paymentDetails.networkPreferred.$error"
                  v-model="merchant.paymentDetails.networkPreferred" label="Network provider*"
                  :options="networkProviderListSet" />
                <div class="text-negative" v-if="
                    error.field.merchant.paymentDetails.networkPreferred.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.paymentDetails.networkPreferred
                    " />
                </div>
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn color="primary" class="q-ma-xs" icon="check" @click="validatebeforeNavigate('paymentDetails')"
                label="Continue" />
              <q-btn color="grey-7" class="q-ma-xs" icon="block" @click="previousClicked()" label="Previous" />
              <q-btn color="amber-10" class="q-ma-xs" icon="inbox" label="Save Partial" @click="saveCurrentChanges()" />
              <q-btn color="negative" class="q-ma-xs" icon="backspace" label="Back to document validation"
                @click="goBackToDocumentVerificationStage()" />
            </q-stepper-navigation>
          </q-step>
          <q-step :error="error.tab.mdrPlan || error.SharingDiscountFee" name="sixth"
            title="Discount" subtitle="Rate">
            <div class="row group items-center">
              <div v-if="v$.merchant.mdrPlan.$anyError" class="col-md-12 text-negative">
                <q-icon color="negative" name="warning" />&nbsp; Error in MDR
                plan fields, kindly check it.
              </div>
              <div v-if="v$.merchant.SharingDiscountFee.$anyError" class="col-md-12 text-negative">
                <q-icon color="negative" name="warning" />&nbsp; Error in
                Sharing discount fee fields, kindly check it.
              </div>
              <div class="col-md-12">
                <div class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      Domestic Debit Card below 2000
                    </div>
                  </div>
                  <div class="col">
                    <div class="q-caption text-weight-medium q-py-sm" align="center">
                      Merchant Disc Fee
                    </div>
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.domesticDebitUpTo2000.fixed
                              .$touch;
                          " :error="
                            v$.merchant.mdrPlan.domesticDebitUpTo2000.fixed
                              .$error
                          " v-model="
                            merchant.mdrPlan.domesticDebitUpTo2000.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.domesticDebitUpTo2000
                              .fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.domesticDebitUpTo2000
                                .fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.domesticDebitUpTo2000.percentage
                              .$touch;
                          " :error="
                            v$.merchant.mdrPlan.domesticDebitUpTo2000.percentage
                              .$error
                          " v-model="
                            merchant.mdrPlan.domesticDebitUpTo2000.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.domesticDebitUpTo2000
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.domesticDebitUpTo2000
                                .percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.domesticDebitUpTo2000.minimum
                              .$touch;
                          " :error="
                            v$.merchant.mdrPlan.domesticDebitUpTo2000.minimum
                              .$error
                          " v-model="
                            merchant.mdrPlan.domesticDebitUpTo2000.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.domesticDebitUpTo2000
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.domesticDebitUpTo2000
                                .minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="q-caption text-weight-medium q-py-sm" align="center">
                      Sharing Disc Fee
                    </div>
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.domesticDebitUpTo2000
                              .fixed.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.domesticDebitUpTo2000
                              .fixed.$error
                          " v-model="
                            merchant.SharingDiscountFee.domesticDebitUpTo2000
                              .fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .domesticDebitUpTo2000.fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .domesticDebitUpTo2000.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.domesticDebitUpTo2000
                              .percentage.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.domesticDebitUpTo2000
                              .percentage.$error
                          " v-model="
                            merchant.SharingDiscountFee.domesticDebitUpTo2000
                              .percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .domesticDebitUpTo2000.percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .domesticDebitUpTo2000.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.domesticDebitUpTo2000
                              .minimum.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.domesticDebitUpTo2000
                              .minimum.$error
                          " v-model="
                            merchant.SharingDiscountFee.domesticDebitUpTo2000
                              .minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .domesticDebitUpTo2000.minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .domesticDebitUpTo2000.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      Domestic Debit Card above 2000
                    </div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.domesticDebitAbove2000.fixed
                              .$touch;
                          " :error="
                            v$.merchant.mdrPlan.domesticDebitAbove2000.fixed
                              .$error
                          " v-model="
                            merchant.mdrPlan.domesticDebitAbove2000.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.domesticDebitAbove2000
                              .fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan
                                .domesticDebitAbove2000.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.domesticDebitAbove2000
                              .percentage.$touch;
                          " :error="
                            v$.merchant.mdrPlan.domesticDebitAbove2000
                              .percentage.$error
                          " v-model="
                            merchant.mdrPlan.domesticDebitAbove2000.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.domesticDebitAbove2000
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan
                                .domesticDebitAbove2000.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.domesticDebitAbove2000.minimum
                              .$touch;
                          " :error="
                            v$.merchant.mdrPlan.domesticDebitAbove2000.minimum
                              .$error
                          " v-model="
                            merchant.mdrPlan.domesticDebitAbove2000.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.domesticDebitAbove2000
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan
                                .domesticDebitAbove2000.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee
                              .domesticDebitAbove2000.fixed.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee
                              .domesticDebitAbove2000.fixed.$error
                          " v-model="
                            merchant.SharingDiscountFee.domesticDebitAbove2000
                              .fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .domesticDebitAbove2000.fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .domesticDebitAbove2000.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee
                              .domesticDebitAbove2000.percentage.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee
                              .domesticDebitAbove2000.percentage.$error
                          " v-model="
                            merchant.SharingDiscountFee.domesticDebitAbove2000
                              .percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .domesticDebitAbove2000.percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .domesticDebitAbove2000.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee
                              .domesticDebitAbove2000.minimum.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee
                              .domesticDebitAbove2000.minimum.$error
                          " v-model="
                            merchant.SharingDiscountFee.domesticDebitAbove2000
                              .minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .domesticDebitAbove2000.minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .domesticDebitAbove2000.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      Standard/Classic (1st Stab)
                    </div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.standardOrClassic.fixed.$touch
                          " :error="
                            v$.merchant.mdrPlan.standardOrClassic.fixed.$error
                          " v-model="
                            merchant.mdrPlan.standardOrClassic.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.standardOrClassic.fixed
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.standardOrClassic
                                .fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.standardOrClassic.percentage
                              .$touch;
                          " :error="
                            v$.merchant.mdrPlan.standardOrClassic.percentage
                              .$error
                          " v-model="
                            merchant.mdrPlan.standardOrClassic.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.standardOrClassic
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.standardOrClassic
                                .percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.standardOrClassic.minimum.$touch
                          " :error="
                            v$.merchant.mdrPlan.standardOrClassic.minimum.$error
                          " v-model="
                            merchant.mdrPlan.standardOrClassic.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.standardOrClassic
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.standardOrClassic
                                .minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.standardOrClassic
                              .fixed.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.standardOrClassic
                              .fixed.$error
                          " v-model="
                            merchant.SharingDiscountFee.standardOrClassic.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .standardOrClassic.fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .standardOrClassic.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.standardOrClassic
                              .percentage.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.standardOrClassic
                              .percentage.$error
                          " v-model="
                            merchant.SharingDiscountFee.standardOrClassic
                              .percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .standardOrClassic.percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .standardOrClassic.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.standardOrClassic
                              .minimum.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.standardOrClassic
                              .minimum.$error
                          " v-model="
                            merchant.SharingDiscountFee.standardOrClassic
                              .minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .standardOrClassic.minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .standardOrClassic.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      Premium/Platinum (2nd Stab)
                    </div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.premiumOrPlatinum.fixed.$touch
                          " :error="
                            v$.merchant.mdrPlan.premiumOrPlatinum.fixed.$error
                          " v-model="
                            merchant.mdrPlan.premiumOrPlatinum.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.premiumOrPlatinum.fixed
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.premiumOrPlatinum
                                .fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.premiumOrPlatinum.percentage
                              .$touch;
                          " :error="
                            v$.merchant.mdrPlan.premiumOrPlatinum.percentage
                              .$error
                          " v-model="
                            merchant.mdrPlan.premiumOrPlatinum.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.premiumOrPlatinum
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.premiumOrPlatinum
                                .percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.premiumOrPlatinum.minimum.$touch
                          " :error="
                            v$.merchant.mdrPlan.premiumOrPlatinum.minimum.$error
                          " v-model="
                            merchant.mdrPlan.premiumOrPlatinum.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.premiumOrPlatinum
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.premiumOrPlatinum
                                .minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.premiumOrPlatinum
                              .fixed.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.premiumOrPlatinum
                              .fixed.$error
                          " v-model="
                            merchant.SharingDiscountFee.premiumOrPlatinum.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .premiumOrPlatinum.minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .premiumOrPlatinum.minimum
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.premiumOrPlatinum
                              .percentage.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.premiumOrPlatinum
                              .percentage.$error
                          " v-model="
                            merchant.SharingDiscountFee.premiumOrPlatinum
                              .percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .premiumOrPlatinum.minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .premiumOrPlatinum.minimum
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.premiumOrPlatinum
                              .minimum.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.premiumOrPlatinum
                              .minimum.$error
                          " v-model="
                            merchant.SharingDiscountFee.premiumOrPlatinum
                              .minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .premiumOrPlatinum.minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .premiumOrPlatinum.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      Super Premium/Signature (3rd Stab)
                    </div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.superPremiumOrSignature.fixed
                              .$touch;
                          " :error="
                            v$.merchant.mdrPlan.superPremiumOrSignature.fixed
                              .$error
                          " v-model="
                            merchant.mdrPlan.superPremiumOrSignature.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.superPremiumOrSignature
                              .fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan
                                .superPremiumOrSignature.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.superPremiumOrSignature
                              .percentage.$touch;
                          " :error="
                            v$.merchant.mdrPlan.superPremiumOrSignature
                              .percentage.$error
                          " v-model="
                            merchant.mdrPlan.superPremiumOrSignature.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.superPremiumOrSignature
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan
                                .superPremiumOrSignature.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.superPremiumOrSignature.minimum
                              .$touch;
                          " :error="
                            v$.merchant.mdrPlan.superPremiumOrSignature.minimum
                              .$error
                          " v-model="
                            merchant.mdrPlan.superPremiumOrSignature.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.superPremiumOrSignature
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan
                                .superPremiumOrSignature.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee
                              .superPremiumOrSignature.fixed.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee
                              .superPremiumOrSignature.fixed.$error
                          " v-model="
                            merchant.SharingDiscountFee.superPremiumOrSignature
                              .fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .superPremiumOrSignature.fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .superPremiumOrSignature.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee
                              .superPremiumOrSignature.percentage.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee
                              .superPremiumOrSignature.percentage.$error
                          " v-model="
                            merchant.SharingDiscountFee.superPremiumOrSignature
                              .percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .superPremiumOrSignature.percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .superPremiumOrSignature.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee
                              .superPremiumOrSignature.minimum.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee
                              .superPremiumOrSignature.minimum.$error
                          " v-model="
                            merchant.SharingDiscountFee.superPremiumOrSignature
                              .minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .superPremiumOrSignature.minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .superPremiumOrSignature.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      Commercial/Coporate 4th Stab
                    </div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.commercialOrCorporate.fixed
                              .$touch;
                          " :error="
                            v$.merchant.mdrPlan.commercialOrCorporate.fixed
                              .$error
                          " v-model="
                            merchant.mdrPlan.commercialOrCorporate.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.commercialOrCorporate
                              .fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.commercialOrCorporate
                                .fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.commercialOrCorporate.percentage
                              .$touch;
                          " :error="
                            v$.merchant.mdrPlan.commercialOrCorporate.percentage
                              .$error
                          " v-model="
                            merchant.mdrPlan.commercialOrCorporate.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.commercialOrCorporate
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.commercialOrCorporate
                                .percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.commercialOrCorporate.minimum
                              .$touch;
                          " :error="
                            v$.merchant.mdrPlan.commercialOrCorporate.minimum
                              .$error
                          " v-model="
                            merchant.mdrPlan.commercialOrCorporate.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.commercialOrCorporate
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.commercialOrCorporate
                                .minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.commercialOrCorporate
                              .fixed.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.commercialOrCorporate
                              .fixed.$error
                          " v-model="
                            merchant.SharingDiscountFee.commercialOrCorporate
                              .fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .commercialOrCorporate.fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .commercialOrCorporate.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.commercialOrCorporate
                              .percentage.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.commercialOrCorporate
                              .percentage.$error
                          " v-model="
                            merchant.SharingDiscountFee.commercialOrCorporate
                              .percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .commercialOrCorporate.percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .commercialOrCorporate.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.commercialOrCorporate
                              .minimum.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.commercialOrCorporate
                              .minimum.$error
                          " v-model="
                            merchant.SharingDiscountFee.commercialOrCorporate
                              .minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .commercialOrCorporate.minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .commercialOrCorporate.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      International Debit Card
                    </div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.internationalDebitCard.fixed
                              .$touch;
                          " :error="
                            v$.merchant.mdrPlan.internationalDebitCard.fixed
                              .$error
                          " v-model="
                            merchant.mdrPlan.internationalDebitCard.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.internationalDebitCard
                              .fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan
                                .internationalDebitCard.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.internationalDebitCard
                              .percentage.$touch;
                          " :error="
                            v$.merchant.mdrPlan.internationalDebitCard
                              .percentage.$error
                          " v-model="
                            merchant.mdrPlan.internationalDebitCard.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.internationalDebitCard
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan
                                .internationalDebitCard.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.internationalDebitCard.minimum
                              .$touch;
                          " :error="
                            v$.merchant.mdrPlan.internationalDebitCard.minimum
                              .$error
                          " v-model="
                            merchant.mdrPlan.internationalDebitCard.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.internationalDebitCard
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan
                                .internationalDebitCard.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee
                              .internationalDebitCard.fixed.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee
                              .internationalDebitCard.fixed.$error
                          " v-model="
                            merchant.SharingDiscountFee.internationalDebitCard
                              .fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .internationalDebitCard.fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .internationalDebitCard.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee
                              .internationalDebitCard.percentage.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee
                              .internationalDebitCard.percentage.$error
                          " v-model="
                            merchant.SharingDiscountFee.internationalDebitCard
                              .percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .internationalDebitCard.percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .internationalDebitCard.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee
                              .internationalDebitCard.minimum.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee
                              .internationalDebitCard.minimum.$error
                          " v-model="
                            merchant.SharingDiscountFee.internationalDebitCard
                              .minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .internationalDebitCard.minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .internationalDebitCard.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      International Credit Card
                    </div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.internationalCreditCard.fixed
                              .$touch;
                          " :error="
                            v$.merchant.mdrPlan.internationalCreditCard.fixed
                              .$error
                          " v-model="
                            merchant.mdrPlan.internationalCreditCard.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.internationalDebitCard
                              .fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan
                                .internationalDebitCard.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.internationalCreditCard
                              .percentage.$touch;
                          " :error="
                            v$.merchant.mdrPlan.internationalCreditCard
                              .percentage.$error
                          " v-model="
                            merchant.mdrPlan.internationalCreditCard.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.internationalDebitCard
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan
                                .internationalDebitCard.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.internationalCreditCard.minimum
                              .$touch;
                          " :error="
                            v$.merchant.mdrPlan.internationalCreditCard.minimum
                              .$error
                          " v-model="
                            merchant.mdrPlan.internationalCreditCard.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.internationalDebitCard
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan
                                .internationalDebitCard.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee
                              .internationalCreditCard.fixed.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee
                              .internationalCreditCard.fixed.$error
                          " v-model="
                            merchant.SharingDiscountFee.internationalCreditCard
                              .fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .internationalCreditCard.fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .internationalCreditCard.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee
                              .internationalCreditCard.percentage.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee
                              .internationalCreditCard.percentage.$error
                          " v-model="
                            merchant.SharingDiscountFee.internationalCreditCard
                              .percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .internationalCreditCard.percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .internationalCreditCard.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee
                              .internationalCreditCard.minimum.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee
                              .internationalCreditCard.minimum.$error
                          " v-model="
                            merchant.SharingDiscountFee.internationalCreditCard
                              .minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .internationalCreditCard.minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .internationalCreditCard.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">Onus</div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="v$.merchant.mdrPlan.onus.fixed.$touch"
                          :error="v$.merchant.mdrPlan.onus.fixed.$error" v-model="merchant.mdrPlan.onus.fixed"
                          placeholder="Fixed" />
                        <div class="text-negative" v-if="error.field.merchant.mdrPlan.onus.fixed.alert">
                          <MarsErrorResponse :error="error.field.merchant.mdrPlan.onus.fixed" />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="v$.merchant.mdrPlan.onus.percentage.$touch"
                          :error="v$.merchant.mdrPlan.onus.percentage.$error"
                          v-model="merchant.mdrPlan.onus.percentage" placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.onus.percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.onus.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="v$.merchant.mdrPlan.onus.minimum.$touch"
                          :error="v$.merchant.mdrPlan.onus.minimum.$error" v-model="merchant.mdrPlan.onus.minimum"
                          placeholder="Max" />
                        <div class="text-negative" v-if="error.field.merchant.mdrPlan.onus.minimum.alert">
                          <MarsErrorResponse :error="error.field.merchant.mdrPlan.onus.minimum" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.onus.fixed.$touch
                          " :error="
                            v$.merchant.SharingDiscountFee.onus.fixed.$error
                          " v-model="merchant.SharingDiscountFee.onus.fixed" placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.onus.fixed
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee.onus.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.onus.percentage
                              .$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.onus.percentage
                              .$error
                          " v-model="
                            merchant.SharingDiscountFee.onus.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.onus
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee.onus
                                .percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.onus.minimum.$touch
                          " :error="
                            v$.merchant.SharingDiscountFee.onus.minimum.$error
                          " v-model="
                            merchant.SharingDiscountFee.onus.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.onus.minimum
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee.onus
                                .minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">Diners</div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="v$.merchant.mdrPlan.diners.fixed.$touch"
                          :error="v$.merchant.mdrPlan.diners.fixed.$error" v-model="merchant.mdrPlan.diners.fixed"
                          placeholder="Fixed" />
                        <div class="text-negative" v-if="error.field.merchant.mdrPlan.diners.fixed.alert">
                          <MarsErrorResponse :error="error.field.merchant.mdrPlan.diners.fixed" />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="v$.merchant.mdrPlan.diners.percentage.$touch"
                          :error="v$.merchant.mdrPlan.diners.percentage.$error"
                          v-model="merchant.mdrPlan.diners.percentage" placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.diners.percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.diners.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="v$.merchant.mdrPlan.diners.minimum.$touch"
                          :error="v$.merchant.mdrPlan.diners.minimum.$error"
                          v-model="merchant.mdrPlan.diners.minimum" placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.diners.minimum.alert
                          ">
                          <MarsErrorResponse :error="error.field.merchant.mdrPlan.diners.minimum" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.diners.fixed.$touch
                          " :error="
                            v$.merchant.SharingDiscountFee.diners.fixed.$error
                          " v-model="
                            merchant.SharingDiscountFee.diners.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.diners.fixed
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee.diners
                                .fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.diners.percentage
                              .$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.diners.percentage
                              .$error
                          " v-model="
                            merchant.SharingDiscountFee.diners.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.diners
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee.diners
                                .percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.diners.minimum.$touch
                          " :error="
                            v$.merchant.SharingDiscountFee.diners.minimum.$error
                          " v-model="
                            merchant.SharingDiscountFee.diners.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.diners
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee.diners
                                .minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      Amex Domestic
                    </div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="v$.merchant.mdrPlan.amexDomestic.fixed.$touch"
                          :error="v$.merchant.mdrPlan.amexDomestic.fixed.$error"
                          v-model="merchant.mdrPlan.amexDomestic.fixed" placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.amexDomestic.fixed
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.amexDomestic.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.amexDomestic.percentage.$touch
                          " :error="
                            v$.merchant.mdrPlan.amexDomestic.percentage.$error
                          " v-model="
                            merchant.mdrPlan.amexDomestic.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.amexDomestic.percentage
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.amexDomestic
                                .percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.amexDomestic.minimum.$touch
                          " :error="
                            v$.merchant.mdrPlan.amexDomestic.minimum.$error
                          " v-model="merchant.mdrPlan.amexDomestic.minimum" placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.amexDomestic.minimum
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.amexDomestic.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.amexDomestic.fixed
                              .$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.amexDomestic.fixed
                              .$error
                          " v-model="
                            merchant.SharingDiscountFee.amexDomestic.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.amexDomestic
                              .fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .amexDomestic.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.amexDomestic
                              .percentage.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.amexDomestic
                              .percentage.$error
                          " v-model="
                            merchant.SharingDiscountFee.amexDomestic.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.amexDomestic
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .amexDomestic.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.amexDomestic.minimum
                              .$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.amexDomestic.minimum
                              .$error
                          " v-model="
                            merchant.SharingDiscountFee.amexDomestic.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.amexDomestic
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .amexDomestic.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      Amex International
                    </div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.amexInternational.fixed.$touch
                          " :error="
                            v$.merchant.mdrPlan.amexInternational.fixed.$error
                          " v-model="
                            merchant.mdrPlan.amexInternational.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.amexInternational.fixed
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.amexInternational
                                .fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.amexInternational.percentage
                              .$touch;
                          " :error="
                            v$.merchant.mdrPlan.amexInternational.percentage
                              .$error
                          " v-model="
                            merchant.mdrPlan.amexInternational.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.amexInternational
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.amexInternational
                                .percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.amexInternational.minimum.$touch
                          " :error="
                            v$.merchant.mdrPlan.amexInternational.minimum.$error
                          " v-model="
                            merchant.mdrPlan.amexInternational.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.amexInternational
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.amexInternational
                                .minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.amexInternational
                              .fixed.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.amexInternational
                              .fixed.$error
                          " v-model="
                            merchant.SharingDiscountFee.amexInternational.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .amexInternational.fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .amexInternational.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.amexInternational
                              .percentage.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.amexInternational
                              .percentage.$error
                          " v-model="
                            merchant.SharingDiscountFee.amexInternational
                              .percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .amexInternational.percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .amexInternational.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.amexInternational
                              .minimum.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.amexInternational
                              .minimum.$error
                          " v-model="
                            merchant.SharingDiscountFee.amexInternational
                              .minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .amexInternational.minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .amexInternational.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="merchant.mdrPlan.hasOwnProperty('upiUpto2000')" class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      UPI Debit Card UpTo 2000
                    </div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="v$.merchant.mdrPlan.upiUpto2000.fixed.$touch"
                          :error="v$.merchant.mdrPlan.upiUpto2000.fixed.$error"
                          v-model="merchant.mdrPlan.upiUpto2000.fixed" placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.upiUpto2000.fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.upiUpto2000.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.upiUpto2000.percentage.$touch;
                          " :error="
                            v$.merchant.mdrPlan.upiUpto2000.percentage.$error
                          " v-model="merchant.mdrPlan.upiUpto2000.percentage" placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.upiUpto2000.percentage
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.upiUpto2000
                                .percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="v$.merchant.mdrPlan.upiUpto2000.minimum.$touch"
                          :error="
                            v$.merchant.mdrPlan.upiUpto2000.minimum.$error
                          " v-model="merchant.mdrPlan.upiUpto2000.minimum" placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.upiUpto2000.minimum
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.upiUpto2000.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.upiUpto2000.fixed
                              .$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.upiUpto2000.fixed
                              .$error
                          " v-model="
                            merchant.SharingDiscountFee.upiUpto2000.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.upiUpto2000
                              .fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .upiUpto2000.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.upiUpto2000
                              .percentage.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.upiUpto2000
                              .percentage.$error
                          " v-model="
                            merchant.SharingDiscountFee.upiUpto2000.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.upiUpto2000
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .upiUpto2000.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.upiUpto2000.minimum
                              .$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.upiUpto2000.minimum
                              .$error
                          " v-model="
                            merchant.SharingDiscountFee.upiUpto2000.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.upiUpto2000
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .upiUpto2000.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="merchant.mdrPlan.hasOwnProperty('upiAbove2000')" class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      UPI Debit Card Above 2000
                    </div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="v$.merchant.mdrPlan.upiAbove2000.fixed.$touch"
                          :error="v$.merchant.mdrPlan.upiAbove2000.fixed.$error"
                          v-model="merchant.mdrPlan.upiAbove2000.fixed" placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.upiAbove2000.fixed
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.upiAbove2000.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.upiAbove2000.percentage.$touch;
                          " :error="
                            v$.merchant.mdrPlan.upiAbove2000.percentage.$error
                          " v-model="
                            merchant.mdrPlan.upiAbove2000.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.upiAbove2000.percentage
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.upiAbove2000
                                .percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.upiAbove2000.minimum.$touch
                          " :error="
                            v$.merchant.mdrPlan.upiAbove2000.minimum.$error
                          " v-model="merchant.mdrPlan.upiAbove2000.minimum" placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.upiAbove2000.minimum
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.upiAbove2000.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.upiAbove2000.fixed
                              .$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.upiAbove2000.fixed
                              .$error
                          " v-model="
                            merchant.SharingDiscountFee.upiAbove2000.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.upiAbove2000
                              .fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .upiAbove2000.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.upiAbove2000
                              .percentage.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.upiAbove2000
                              .percentage.$error
                          " v-model="
                            merchant.SharingDiscountFee.upiAbove2000.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.upiAbove2000
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .upiAbove2000.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.upiAbove2000.minimum
                              .$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.upiAbove2000.minimum
                              .$error
                          " v-model="
                            merchant.SharingDiscountFee.upiAbove2000.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.upiAbove2000
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .upiAbove2000.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="merchant.mdrPlan.hasOwnProperty('upiCreditUpto2000')" class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      UPI Prepaid Credit Cards UpTo 2000
                    </div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.upiCreditUpto2000.fixed.$touch
                          " :error="
                            v$.merchant.mdrPlan.upiCreditUpto2000.fixed.$error
                          " v-model="
                            merchant.mdrPlan.upiCreditUpto2000.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.upiCreditUpto2000.fixed
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.upiCreditUpto2000
                                .fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.upiCreditUpto2000.percentage
                              .$touch;
                          " :error="
                            v$.merchant.mdrPlan.upiCreditUpto2000.percentage
                              .$error
                          " v-model="
                            merchant.mdrPlan.upiCreditUpto2000.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.upiCreditUpto2000
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.upiCreditUpto2000
                                .percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.upiCreditUpto2000.minimum.$touch
                          " :error="
                            v$.merchant.mdrPlan.upiCreditUpto2000.minimum.$error
                          " v-model="
                            merchant.mdrPlan.upiCreditUpto2000.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.upiCreditUpto2000
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.upiCreditUpto2000
                                .minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.upiCreditUpto2000
                              .fixed.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.upiCreditUpto2000
                              .fixed.$error
                          " v-model="
                            merchant.SharingDiscountFee.upiCreditUpto2000.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .upiCreditUpto2000.fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .upiCreditUpto2000.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.upiCreditUpto2000
                              .percentage.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.upiCreditUpto2000
                              .percentage.$error
                          " v-model="
                            merchant.SharingDiscountFee.upiCreditUpto2000
                              .percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .upiCreditUpto2000.percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .upiCreditUpto2000.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.upiCreditUpto2000
                              .minimum.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.upiCreditUpto2000
                              .minimum.$error
                          " v-model="
                            merchant.SharingDiscountFee.upiCreditUpto2000
                              .minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .upiCreditUpto2000.minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .upiCreditUpto2000.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="merchant.mdrPlan.hasOwnProperty('upiCreditAbove2000')" class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      UPI Prepaid Credit Cards Above 2000
                    </div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.upiCreditAbove2000.fixed.$touch
                          " :error="
                            v$.merchant.mdrPlan.upiCreditAbove2000.fixed.$error
                          " v-model="
                            merchant.mdrPlan.upiCreditAbove2000.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.upiCreditAbove2000
                              .fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.upiCreditAbove2000
                                .fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.upiCreditAbove2000.percentage
                              .$touch;
                          " :error="
                            v$.merchant.mdrPlan.upiCreditAbove2000.percentage
                              .$error
                          " v-model="
                            merchant.mdrPlan.upiCreditAbove2000.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.upiCreditAbove2000
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.upiCreditAbove2000
                                .percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.upiCreditAbove2000.minimum
                              .$touch;
                          " :error="
                            v$.merchant.mdrPlan.upiCreditAbove2000.minimum
                              .$error
                          " v-model="
                            merchant.mdrPlan.upiCreditAbove2000.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.upiCreditAbove2000
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.upiCreditAbove2000
                                .minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.upiCreditAbove2000
                              .fixed.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.upiCreditAbove2000
                              .fixed.$error
                          " v-model="
                            merchant.SharingDiscountFee.upiCreditAbove2000.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .upiCreditAbove2000.fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .upiCreditAbove2000.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.upiCreditAbove2000
                              .percentage.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.upiCreditAbove2000
                              .percentage.$error
                          " v-model="
                            merchant.SharingDiscountFee.upiCreditAbove2000
                              .percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .upiCreditAbove2000.percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .upiCreditAbove2000.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.upiCreditAbove2000
                              .minimum.$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.upiCreditAbove2000
                              .minimum.$error
                          " v-model="
                            merchant.SharingDiscountFee.upiCreditAbove2000
                              .minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee
                              .upiCreditAbove2000.minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee
                                .upiCreditAbove2000.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">Master Pass</div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="v$.merchant.mdrPlan.masterPass.fixed.$touch"
                          :error="v$.merchant.mdrPlan.masterPass.fixed.$error"
                          v-model="merchant.mdrPlan.masterPass.fixed" placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.masterPass.fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.masterPass.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.masterPass.percentage.$touch
                          " :error="
                            v$.merchant.mdrPlan.masterPass.percentage.$error
                          " v-model="merchant.mdrPlan.masterPass.percentage" placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.masterPass.percentage
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.masterPass.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="v$.merchant.mdrPlan.masterPass.minimum.$touch"
                          :error="v$.merchant.mdrPlan.masterPass.minimum.$error"
                          v-model="merchant.mdrPlan.masterPass.minimum" placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.masterPass.minimum
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.masterPass.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.masterPass.fixed
                              .$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.masterPass.fixed
                              .$error
                          " v-model="
                            merchant.SharingDiscountFee.masterPass.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.masterPass
                              .fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee.masterPass
                                .fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.masterPass.percentage
                              .$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.masterPass.percentage
                              .$error
                          " v-model="
                            merchant.SharingDiscountFee.masterPass.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.masterPass
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee.masterPass
                                .percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.masterPass.minimum
                              .$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.masterPass.minimum
                              .$error
                          " v-model="
                            merchant.SharingDiscountFee.masterPass.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.masterPass
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee.masterPass
                                .minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">Cash at POS</div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="v$.merchant.mdrPlan.cashAtPos.fixed.$touch"
                          :error="v$.merchant.mdrPlan.cashAtPos.fixed.$error"
                          v-model="merchant.mdrPlan.cashAtPos.fixed" placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.cashAtPos.fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.cashAtPos.fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.mdrPlan.cashAtPos.percentage.$touch
                          " :error="
                            v$.merchant.mdrPlan.cashAtPos.percentage.$error
                          " v-model="merchant.mdrPlan.cashAtPos.percentage" placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.cashAtPos.percentage
                              .alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.cashAtPos.percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="v$.merchant.mdrPlan.cashAtPos.minimum.$touch"
                          :error="v$.merchant.mdrPlan.cashAtPos.minimum.$error"
                          v-model="merchant.mdrPlan.cashAtPos.minimum" placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.mdrPlan.cashAtPos.minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.mdrPlan.cashAtPos.minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.cashAtPos.fixed
                              .$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.cashAtPos.fixed
                              .$error
                          " v-model="
                            merchant.SharingDiscountFee.cashAtPos.fixed
                          " placeholder="Fixed" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.cashAtPos
                              .fixed.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee.cashAtPos
                                .fixed
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.cashAtPos.percentage
                              .$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.cashAtPos.percentage
                              .$error
                          " v-model="
                            merchant.SharingDiscountFee.cashAtPos.percentage
                          " placeholder="%" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.cashAtPos
                              .percentage.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee.cashAtPos
                                .percentage
                            " />
                        </div>
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" @blur="
                            v$.merchant.SharingDiscountFee.cashAtPos.minimum
                              .$touch;
                          " :error="
                            v$.merchant.SharingDiscountFee.cashAtPos.minimum
                              .$error
                          " v-model="
                            merchant.SharingDiscountFee.cashAtPos.minimum
                          " placeholder="Max" />
                        <div class="text-negative" v-if="
                            error.field.merchant.SharingDiscountFee.cashAtPos
                              .minimum.alert
                          ">
                          <MarsErrorResponse :error="
                              error.field.merchant.SharingDiscountFee.cashAtPos
                                .minimum
                            " />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center" v-if="this.plan == 'mATM'">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      Plan for MATM
                    </div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" v-model="merchant.mdrPlan.incentive.percentage"
                          placeholder="%" />
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" v-model="merchant.mdrPlan.incentive.minimum"
                          placeholder="Min" />
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" v-model="
                            merchant.mdrPlan.incentive.minimumTxnValue
                          " placeholder="Max" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center" v-if="
                    merchant.companyInformation.mcc == '5541' ||
                    merchant.companyInformation.mcc == '5542'
                  ">
                  <div class="col-3">
                    <div class="q-caption text-weight-medium">
                      Convenience fees
                    </div>
                  </div>
                  <div class="col">
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" v-model="merchant.mdrPlan.convenientFee.fixed"
                          placeholder="Fixed" />
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" v-model="
                            merchant.mdrPlan.convenientFee.percentage
                          " placeholder="%" />
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" v-model="merchant.mdrPlan.convenientFee.minimum"
                          placeholder="Max" />
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input color="grey-9" type="number" v-model="
                            merchant.SharingDiscountFee.convenientFee.fixed
                          " placeholder="Fixed" />
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" v-model="
                            merchant.SharingDiscountFee.convenientFee.percentage
                          " placeholder="%" />
                      </div>
                      <div class="col">
                        <q-input color="grey-9" type="number" v-model="
                            merchant.SharingDiscountFee.convenientFee.minimum
                          " placeholder="Max" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn color="primary" class="q-ma-xs" icon="check" @click="validatebeforeNavigate('mdr')"
                label="Continue" />
              <q-btn color="grey-7" class="q-ma-xs" icon="block" @click="previousClicked()" label="Previous" />
              <q-btn color="amber-10" class="q-ma-xs" icon="inbox" label="Save Partial" @click="saveCurrentChanges()" />
              <q-btn color="negative" class="q-ma-xs" icon="backspace" label="Back to document validation"
                @click="goBackToDocumentVerificationStage()" />
            </q-stepper-navigation>
          </q-step>

          <q-step :error="error.tab.bankInformation" name="seventh" title="Bank & Collection"
            subtitle="Details">
            <div class="row q-mb-md gutter-sm items-center">
              <div class="col-md-12">
                <div class="q-title">Merchant Bank Details</div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" :error="v$.merchant.bankInformation.bankDetails.ifsc.$error"
                  @blur="populateBankDetails" v-model="merchant.bankInformation.bankDetails.ifsc"
                  label="IFSC Code*" placeholder="Enter IFSC*" />
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails.ifsc.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails.ifsc
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.bankInformation.bankDetails.ifsc.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Once entered and moved to the next field, bank details will
                    be populated automatically.
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" disable @blur="
                    v$.merchant.bankInformation.bankDetails.branchName.$touch
                  " :error="
                    v$.merchant.bankInformation.bankDetails.branchName.$error
                  " v-model="merchant.bankInformation.bankDetails.branchName" label="Branch Name*"
                  placeholder="Branch Name* " />
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails.branchName
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails
                        .branchName
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    v$.merchant.bankInformation.bankDetails.branchName.$error
                  ">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    will get automatically populated based on IFSC code.
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" v-model="merchant.bankInformation.bankDetails.branchCode"
                  label="Branch Code" placeholder="Branch Code" />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" v-model="merchant.bankInformation.bankDetails.branchZone"
                  label="Branch Zone" placeholder="Branch Zone" />
              </div>

              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select placeholder="Choose from the below" color="grey-9"
                  v-model="merchant.bankInformation.bankDetails.feeType" label="Fee Type"
                  :options="feeTypeOptions" @update:model-value="
                    merchant.bankInformation.bankDetails.settlementOrNeftFee =
                      ''
                  " />
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails.feeType
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails.feeType
                    " />
                </div>
              </div>
              <div v-if="
                  merchant.bankInformation.bankDetails.feeType == 'N' ||
                  merchant.bankInformation.bankDetails.feeType == 'S'
                " class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" @blur="
                    v$.merchant.bankInformation.bankDetails.settlementOrNeftFee
                      .$touch;
                  " :error="
                    v$.merchant.bankInformation.bankDetails.settlementOrNeftFee
                      .$error
                  " v-model="
                    merchant.bankInformation.bankDetails.settlementOrNeftFee
                  " label="NEFT/Settlement Fee Inclusive of Tax*"
                  placeholder="NEFT/Settlement Fee Inclusive of Tax*" />
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails
                      .settlementOrNeftFee.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails
                        .settlementOrNeftFee
                    " />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" @blur="v$.merchant.bankInformation.bankDetails.micr.$touch"
                  :error="v$.merchant.bankInformation.bankDetails.micr.$error"
                  v-model="merchant.bankInformation.bankDetails.micr" label="MICR*" placeholder="MICR*" />
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails.micr.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails.micr
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.bankInformation.bankDetails.micr.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    will get automatically populated based on IFSC code.
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" disable @blur="
                    v$.merchant.bankInformation.bankDetails.bankName.$touch
                  " :error="
                    v$.merchant.bankInformation.bankDetails.bankName.$error
                  " v-model="merchant.bankInformation.bankDetails.bankName" label="Bank Name*"
                  placeholder="Bank Name*" />
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails.bankName
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails.bankName
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption"
                  v-if="v$.merchant.bankInformation.bankDetails.bankName.$error">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    will get automatically populated based on IFSC code.
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select placeholder="Choose from the below" color="grey-9" v-model="
                    merchant.bankInformation.bankDetails.paymentMode
                  " label="Payment mode" :options="paymnentModeOptions" />
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails.paymentMode
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails
                        .paymentMode
                    " />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" @blur="
                    v$.merchant.bankInformation.bankDetails.bankCityRefCode
                      .$touch;
                  " :error="
                    autoCompleteError(
                      v$.merchant.bankInformation.bankDetails.bankCityName,
                      v$.merchant.bankInformation.bankDetails.bankCityRefCode
                    )
                  " v-model="
                    merchant.bankInformation.bankDetails.bankCityName
                  " label="City (type min 3 characters)*" placeholder="Start typing ..*">
                  <template #append>
                    <q-autocomplete @search="residentCitySearch" :debounce="10" :min-characters="3"
                      @selected="bankCitySelected" />
                  </template>
                </q-input>
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails
                      .bankCityRefCode.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails
                        .bankCityRefCode
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    v$.merchant.bankInformation.bankDetails.bankCityRefCode
                      .$error ||
                    v$.merchant.bankInformation.bankDetails.bankCityName.$error
                  ">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Type and choose from the suggestions
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" @blur="
                    v$.merchant.bankInformation.bankDetails.bankStateRefCode
                      .$touch
                  " :error="
                    autoCompleteError(
                      v$.merchant.bankInformation.bankDetails.bankStateName,
                      v$.merchant.bankInformation.bankDetails.bankStateRefCode
                    )
                  " v-model="
                    merchant.bankInformation.bankDetails.bankStateName
                  " label="State (type min 3 characters)*" placeholder="Start typing ..*">
                  <template #append>
                    <q-autocomplete @search="residentStateSearch" :debounce="10" :min-characters="1"
                      @selected="bankStateSelected" />
                  </template>
                </q-input>
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails
                      .bankStateRefCode.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails
                        .bankStateRefCode
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    v$.merchant.bankInformation.bankDetails.bankStateRefCode
                      .$error ||
                    v$.merchant.bankInformation.bankDetails.bankStateName.$error
                  ">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    Type and choose from the suggestions
                  </div>
                </div>
              </div>
              <div class="col-md-12 col-sm-12 col-xs-12">
                <p class="q-caption">Current Account details Available ?*</p>
                <div class="group">
                  <q-radio @blur="
                      v$.merchant.bankInformation.bankDetails.accountdetails
                        .$touch
                    " :error="
                      v$.merchant.bankInformation.bankDetails.accountdetails
                        .$error
                    " v-for="(item, index) in viewBinding.accountdetails" :key="index" color="grey-9" v-model="
                      merchant.bankInformation.bankDetails.accountdetails
                    " :val="item.value" :label="item.label" />
                </div>
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails
                      .accountdetails.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails
                        .accountdetails
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    v$.merchant.bankInformation.bankDetails.accountdetails
                      .$error
                  ">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select placeholder="Choose from the below"
                  color="grey-9" v-model="
                    merchant.bankInformation.bankDetails.accountType
                  " label="Account Type" :options="accountTypeOptions" />
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails.accountType
                      .alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails
                        .accountType
                    " />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input color="grey-9" @blur="
                    v$.merchant.bankInformation.bankDetails.accountNumber.$touch
                  " :error="
                    v$.merchant.bankInformation.bankDetails.accountNumber.$error
                  " v-model="
                    merchant.bankInformation.bankDetails.accountNumber
                  " label="Bank A/c Number*" placeholder="Bank A/c Number*" />
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails
                      .accountNumber.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails
                        .accountNumber
                    " />
                </div>
                <div class="text-negative q-py-xs group q-caption" v-if="
                    v$.merchant.bankInformation.bankDetails.accountNumber
                      .$anyError
                  ">
                  <div>
                    <q-icon color="negative" name="warning" />&nbsp;Required -
                    provide valid account number
                  </div>
                  <div v-if="
                      v$.merchant.bankInformation.bankDetails.accountNumber
                        .minLength.$invalid
                    ">
                    <q-icon color="negative" name="warning" />
                    &nbsp;Length should be between
                    {{
                    v$.merchant.bankInformation.bankDetails.accountNumber
                    .minLength.$params.min
                    }}
                    and
                    {{
                    v$.merchant.bankInformation.bankDetails.accountNumber
                    .maxLength.$params.max
                    }}
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-checkbox color="grey-9" true-value="Y" false-value="N" v-model="
                    merchant.bankInformation.bankDetails.bankStatementAttached
                  " label="Bank Statement Attached" />
                <q-checkbox color="grey-9" true-value="Y" false-value="N" v-model="
                    merchant.bankInformation.bankDetails.cancelChequeAttached
                  " label="Cancelled Cheque Lead Attached" />
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.bankDetails
                      .accountNumber.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.bankDetails
                        .accountNumber
                    " />
                </div>
              </div>
            </div>
            <div class="row gutter-sm items-center">
              <div class="col-md-12">
                <div class="q-title">Payment Collection Details</div>
              </div>
              <div v-show="propLeadDeatils.paymentOption == 1" class="col-md-12">
                <div class="row">
                  <div class="col-md-6 col-sm-12 col-xs-12">
                    <q-input color="grey-9" @blur="
                        v$.merchant.bankInformation.collectionDetails
                          .chequeNumber.$touch;
                      " :error="
                        v$.merchant.bankInformation.collectionDetails
                          .chequeNumber.$error
                      " v-model="
                        merchant.bankInformation.collectionDetails.chequeNumber
                      " label="Cheque/UTR No*" placeholder="Cheque/UTR No*" />
                    <div class="text-negative" v-if="
                        error.field.merchant.bankInformation.collectionDetails
                          .chequeNumber.alert
                      ">
                      <MarsErrorResponse :error="
                          error.field.merchant.bankInformation.collectionDetails
                            .chequeNumber
                        " />
                    </div>
                    <div class="text-negative q-py-xs group q-caption" v-if="
                        v$.merchant.bankInformation.collectionDetails
                          .chequeNumber.$anyError
                      ">
                      <div>
                        <q-icon color="negative" name="warning" />&nbsp;Required
                        - provide valid account number
                      </div>
                      <div v-if="
                          v$.merchant.bankInformation.collectionDetails
                            .chequeNumber.minLength.$invalid
                        ">
                        <q-icon color="negative" name="warning" />
                        &nbsp;Length should be between
                        {{
                        v$.merchant.bankInformation.collectionDetails
                        .chequeNumber.minLength.$params.min
                        }}
                        and
                        {{
                        v$.merchant.bankInformation.collectionDetails
                        .chequeNumber.maxLength.$params.max
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-show="propLeadDeatils.paymentOption == 4" class="col-md-12">
                <div class="row">
                  <div class="col-md-6 col-sm-12 col-xs-12">
                    <q-input color="grey-9" @blur="
                        v$.merchant.bankInformation.collectionDetails.upiLink
                          .$touch;
                      " :error="
                        v$.merchant.bankInformation.collectionDetails.upiLink
                          .$error
                      " v-model="
                        merchant.bankInformation.collectionDetails.upiLink
                      " label="UPI Link*" placeholder="UPI Link*" />
                    <div class="text-negative" v-if="
                        error.field.merchant.bankInformation.collectionDetails
                          .upiLink.alert
                      ">
                      <MarsErrorResponse :error="
                          error.field.merchant.bankInformation.collectionDetails
                            .upiLink
                        " />
                    </div>
                    <div class="text-negative q-py-xs group q-caption" v-if="
                        v$.merchant.bankInformation.collectionDetails.upiLink
                          .$anyError
                      ">
                      <div>
                        <q-icon color="negative" name="warning" />&nbsp;Required
                        - provide valid account number
                      </div>
                      <div v-if="
                          v$.merchant.bankInformation.collectionDetails.upiLink
                            .minLength.$invalid
                        ">
                        <q-icon color="negative" name="warning" />
                        &nbsp;Length should be between
                        {{
                        v$.merchant.bankInformation.collectionDetails.upiLink
                        .minLength.$params.min
                        }}
                        and
                        {{
                        v$.merchant.bankInformation.collectionDetails.upiLink
                        .maxLength.$params.max
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-show="propLeadDeatils.paymentOption == 3" class="col-md-12">
                <div class="row">
                  <div class="col-md-4 col-sm-12 col-xs-12">
                    <q-input color="grey-9" @blur="
                        v$.merchant.bankInformation.collectionDetails
                          .swipeAmount.$touch;
                      " :error="
                        v$.merchant.bankInformation.collectionDetails
                          .swipeAmount.$error
                      " v-model="
                        merchant.bankInformation.collectionDetails.swipeAmount
                      " label="Swipe Amount*" placeholder="Swipe Amount*" />
                    <div class="text-negative" v-if="
                        error.field.merchant.bankInformation.collectionDetails
                          .swipeAmount.alert
                      ">
                      <MarsErrorResponse :error="
                          error.field.merchant.bankInformation.collectionDetails
                            .swipeAmount
                        " />
                    </div>
                    <div class="text-negative q-py-xs group q-caption" v-if="
                        v$.merchant.bankInformation.collectionDetails
                          .swipeAmount.$anyError
                      ">
                      <div>
                        <q-icon color="negative" name="warning" />&nbsp;Required
                        - provide valid account number
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4 col-sm-12">
                    <q-input @blur="
                        v$.merchant.bankInformation.collectionDetails
                          .collectedDate.$touch;
                      " :error="
                        v$.merchant.bankInformation.collectionDetails
                          .collectedDate.$error
                      " v-model="
                        merchant.bankInformation.collectionDetails.collectedDate
                      " label="Swipe Date*" placeholder="Swipe Date*">
                      <template #append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="merchant.bankInformation.collectionDetails.collectedDate" mask="DD/MM/YYYY">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <div class="text-negative" v-if="
                        error.field.merchant.bankInformation.collectionDetails
                          .collectedDate.alert
                      ">
                      <MarsErrorResponse :error="
                          error.field.merchant.bankInformation.collectionDetails
                            .collectedDate
                        " />
                    </div>
                    <div class="text-negative q-py-xs group q-caption" v-if="
                        v$.merchant.bankInformation.collectionDetails
                          .collectedDate.$anyError
                      ">
                      <div>
                        <q-icon color="negative" name="warning" />&nbsp;Required
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4 col-sm-12 col-xs-12">
                    <q-input color="grey-9" @blur="
                        v$.merchant.bankInformation.collectionDetails
                          .swipeTerminal.$touch;
                      " :error="
                        v$.merchant.bankInformation.collectionDetails
                          .swipeTerminal.$error
                      " v-model="
                        merchant.bankInformation.collectionDetails.swipeTerminal
                      " label="Swiped on the terminal of*" placeholder="Swiped on the terminal of*" />
                    <div class="text-negative" v-if="
                        error.field.merchant.bankInformation.collectionDetails
                          .swipeTerminal.alert
                      ">
                      <MarsErrorResponse :error="
                          error.field.merchant.bankInformation.collectionDetails
                            .swipeTerminal
                        " />
                    </div>
                    <div class="text-negative q-py-xs group q-caption" v-if="
                        v$.merchant.bankInformation.collectionDetails
                          .swipeTerminal.$anyError
                      ">
                      <div>
                        <q-icon color="negative" name="warning" />&nbsp;Required
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-show="propLeadDeatils.paymentOption == 2" class="col-md-12">
                <div class="row">
                  <div class="col-md-3 col-sm-12 col-xs-12">
                    <q-input color="grey-9" @blur="
                        v$.merchant.bankInformation.collectionDetails
                          .chequeAmount.$touch;
                      " :error="
                        v$.merchant.bankInformation.collectionDetails
                          .chequeAmount.$error
                      " v-model="
                        merchant.bankInformation.collectionDetails.chequeAmount
                      " label="Cheque Amount*" placeholder="Cheque Amount*" />
                    <div class="text-negative" v-if="
                        error.field.merchant.bankInformation.collectionDetails
                          .chequeAmount.alert
                      ">
                      <MarsErrorResponse :error="
                          error.field.merchant.bankInformation.collectionDetails
                            .chequeAmount
                        " />
                    </div>
                    <div class="text-negative q-py-xs group q-caption" v-if="
                        v$.merchant.bankInformation.collectionDetails
                          .chequeAmount.$anyError
                      ">
                      <div>
                        <q-icon color="negative" name="warning" />&nbsp;Required
                      </div>
                    </div>
                  </div>
                  <div class="col-md-3 col-sm-12">
                    <q-input @blur="
                        v$.merchant.bankInformation.collectionDetails.chequeDate
                          .$touch;
                      " :error="
                        v$.merchant.bankInformation.collectionDetails.chequeDate
                          .$error
                      " v-model="
                        merchant.bankInformation.collectionDetails.chequeDate
                      " label="Cheque Date*" placeholder="Cheque Date*">
                      <template #append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="merchant.bankInformation.collectionDetails.chequeDate" mask="DD/MM/YYYY">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <div class="text-negative" v-if="
                        error.field.merchant.bankInformation.collectionDetails
                          .chequeDate.alert
                      ">
                      <MarsErrorResponse :error="
                          error.field.merchant.bankInformation.collectionDetails
                            .chequeDate
                        " />
                    </div>
                    <div class="text-negative q-py-xs group q-caption" v-if="
                        v$.merchant.bankInformation.collectionDetails.chequeDate
                          .$anyError
                      ">
                      <div>
                        <q-icon color="negative" name="warning" />&nbsp;Required
                      </div>
                    </div>
                  </div>
                  <div class="col-md-3 col-sm-12 col-xs-12">
                    <q-input @blur="
                        v$.merchant.bankInformation.collectionDetails
                          .chequeDepositedDate.$touch;
                      " :error="
                        v$.merchant.bankInformation.collectionDetails
                          .chequeDepositedDate.$error
                      " v-model="
                        merchant.bankInformation.collectionDetails
                          .chequeDepositedDate
                      " label="Cheque Deposited Date*" placeholder="Cheque Deposited Date*">
                      <template #append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="merchant.bankInformation.collectionDetails.chequeDepositedDate"
                              mask="DD/MM/YYYY">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <div class="text-negative" v-if="
                        error.field.merchant.bankInformation.collectionDetails
                          .chequeDepositedDate.alert
                      ">
                      <MarsErrorResponse :error="
                          error.field.merchant.bankInformation.collectionDetails
                            .chequeDepositedDate
                        " />
                    </div>
                    <div class="text-negative q-py-xs group q-caption" v-if="
                        v$.merchant.bankInformation.collectionDetails
                          .chequeDepositedDate.$anyError
                      ">
                      <div>
                        <q-icon color="negative" name="warning" />&nbsp;Required
                      </div>
                    </div>
                  </div>
                  <div class="col-md-3 col-sm-12 col-xs-12">
                    <q-input color="grey-9" @blur="
                        v$.merchant.bankInformation.collectionDetails
                          .chequeNumber.$touch;
                      " :error="
                        v$.merchant.bankInformation.collectionDetails
                          .chequeNumber.$error
                      " v-model="
                        merchant.bankInformation.collectionDetails.chequeNumber
                      " label="Cheque/UTR No*" placeholder="Cheque/UTR No*" />
                    <div class="text-negative" v-if="
                        error.field.merchant.bankInformation.collectionDetails
                          .chequeNumber.alert
                      ">
                      <MarsErrorResponse :error="
                          error.field.merchant.bankInformation.collectionDetails
                            .chequeNumber
                        " />
                    </div>
                    <div class="text-negative q-py-xs group q-caption" v-if="
                        v$.merchant.bankInformation.collectionDetails
                          .chequeNumber.$anyError
                      ">
                      <div>
                        <q-icon color="negative" name="warning" />&nbsp;Required
                        - provide valid account number
                      </div>
                      <div v-if="
                          v$.merchant.bankInformation.collectionDetails
                            .chequeNumber.minLength.$invalid
                        ">
                        <q-icon color="negative" name="warning" />
                        &nbsp;Length should be between
                        {{
                        v$.merchant.bankInformation.collectionDetails
                        .chequeNumber.minLength.$params.min
                        }}
                        and
                        {{
                        v$.merchant.bankInformation.collectionDetails
                        .chequeNumber.maxLength.$params.max
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                <q-select clearable placeholder="Choose from the below" color="grey-9" v-model="
                    merchant.bankInformation.collectionDetails.acquirerBank
                  " label="Bank Name" :options="bankListSet" />
                <div class="text-negative" v-if="
                    error.field.merchant.bankInformation.collectionDetails
                      .acquirerBank.alert
                  ">
                  <MarsErrorResponse :error="
                      error.field.merchant.bankInformation.collectionDetails
                        .acquirerBank
                    " />
                </div>
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn color="primary" class="q-ma-xs" icon="check" @click="validatebeforeNavigate('bank')"
                label="Continue" />
              <q-btn color="grey-7" class="q-ma-xs" icon="block" @click="previousClicked()" label="Previous" />
              <q-btn color="amber-10" class="q-ma-xs" icon="inbox" label="Save Partial" @click="saveCurrentChanges()" />
              <q-btn color="negative" class="q-ma-xs" icon="backspace" label="Back to document validation"
                @click="goBackToDocumentVerificationStage()" />
            </q-stepper-navigation>
          </q-step>
          <q-step :error="error.tab.revParameters" name="ten" title="Rev Param & Lead"
            subtitle="Info">
            <div class="row gutter-sm">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <p class="caption">Merchant Requested Vas</p>
                <li v-for="sVas in soSelectedVas.split(',')" :key="sVas">
                  {{ sVas }}
                </li>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <p class="caption">Vas Based Instance*</p>
                <q-option-group inline type="checkbox" @update:model-value="handleVasChange" :model-value="tmpVasMapping"
                  class="text-weight-regular text-grey-8" color="grey-9" :disable="vasDisableFlag"
                  :options="vasBasedOnInstance" />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <p class="q-caption">Notification Recipient Enabled?</p>
                <div class="group">
                  <q-radio @blur="
                      v$.merchant.revParameters.notificationRecipient.$touch
                    " :error="
                      v$.merchant.revParameters.notificationRecipient.$error
                    " v-for="(item, index) in edcOptions" :key="index" color="grey-9"
                    v-model="merchant.revParameters.notificationRecipient" :val="item.value" :label="item.label" />
                  <div class="text-negative" v-if="
                      error.field.merchant.revParameters.notificationRecipient
                        .alert
                    ">
                    <MarsErrorResponse :error="
                        error.field.merchant.revParameters.notificationRecipient
                      " />
                  </div>
                  <div class="text-negative q-py-xs group q-caption" v-if="
                      v$.merchant.revParameters.notificationRecipient.$error
                    ">
                    <div>
                      <q-icon color="negative" name="warning" />&nbsp;Required
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <p class="q-caption">Bijlipay Switch</p>
                <div class="group">
                  <q-radio @blur="v$.revParamAndLeadInfo.bijlipaySwitch.$touch"
                    :error="v$.revParamAndLeadInfo.bijlipaySwitch.$error" v-for="(item, index) in bijlipaySwitchOptions"
                    :key="index" color="grey-9" v-model="revParamAndLeadInfo.bijlipaySwitch" :val="item.value"
                    :label="item.label" />
                  <div class="text-negative" v-if="error.field.revParamAndLeadInfo.bijlipaySwitch.alert">
                    <MarsErrorResponse :error="error.field.revParamAndLeadInfo.bijlipaySwitch" />
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <p class="q-caption">Sale Enabled?</p>
                <div class="group">
                  <q-radio @blur="v$.merchant.revParameters.saleFlag.$touch"
                    :error="v$.merchant.revParameters.saleFlag.$error" v-for="(item, index) in saleFlagOptions"
                    :key="index" color="grey-9" v-model="merchant.revParameters.saleFlag" :val="item.value"
                    :label="item.label" />
                  <div class="text-negative" v-if="error.field.merchant.revParameters.saleFlag.alert">
                    <MarsErrorResponse :error="error.field.merchant.revParameters.saleFlag" />
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <p class="q-caption">Tip FacilityAcceptance Enabled?</p>
                <div class="group">
                  <q-radio @blur="v$.merchant.revParameters.tipEnabled.$touch"
                    :error="v$.merchant.revParameters.tipEnabled.$error" v-for="(item, index) in tipFaclityOptions"
                    :key="index" color="grey-9" v-model="merchant.revParameters.tipEnabled" :val="item.value"
                    :label="item.label" />
                  <div class="text-negative" v-if="error.field.merchant.revParameters.tipEnabled.alert">
                    <MarsErrorResponse :error="error.field.merchant.revParameters.tipEnabled" />
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <p class="q-caption">Auto or Manual Settlement?</p>
                <div class="group">
                  <q-radio @blur="v$.merchant.revParameters.settlementType.$touch"
                    :error="v$.merchant.revParameters.settlementType.$error"
                    v-for="(item, index) in autoormanualOptions" :key="index" color="grey-9"
                    v-model="merchant.revParameters.settlementType" :val="item.value" :label="item.label" />
                  <div class="text-negative" v-if="
                      error.field.merchant.revParameters.settlementType.alert
                    ">
                    <MarsErrorResponse :error="error.field.merchant.revParameters.settlementType" />
                  </div>
                </div>
              </div>
            </div>

            <q-stepper-navigation>
              <q-btn color="primary" class="q-ma-xs" icon="check" @click="validatebeforeNavigate('revParameters')"
                label="Continue" />
              <q-btn color="grey-7" class="q-ma-xs" icon="block" @click="previousClicked()" label="Previous" />
              <q-btn color="amber-10" class="q-ma-xs" icon="inbox" label="Save Partial" @click="saveCurrentChanges()" />
              <q-btn color="negative" class="q-ma-xs" icon="backspace" label="Back to document validation"
                @click="goBackToDocumentVerificationStage()" />
            </q-stepper-navigation>
          </q-step>

          <q-step name="eight" title="KYC" subtitle="Details">
            <div class="row items-center">
              <div class="col-12 bottom-border q-py-md" v-for="(key, index) in Object.keys(
                  propLeadDeatils.leadDocuments
                )" :key="index">
                <div class="row group items-center">
                  <div class="col-auto">
                    <span>{{ propLeadDeatils.revParameters }}</span>
                  </div>
                  <div class="col-auto">
                    <span class="text-purple-9 text-weight-bold border-1 q-pa-sm">{{ index + 1 }}</span>
                  </div>
                  <div class="col-10" v-for="(item, subIndex) in propLeadDeatils.leadDocuments[
                      key
                    ]" :key="subIndex">
                    <div class="row">
                      <div class="col-4 q-body-1">Document</div>
                      <div class="col-8 q-body-1 text-weight-bold text-negative" v-if="item.documentType == ''">
                        NA
                      </div>
                      <div class="col-8 q-body-1" v-else>
                        {{ item.documentType }}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-4 q-body-1">Sub document</div>
                      <div class="col-8 q-body-1 text-weight-bold text-negative" v-if="item.subDocumentType == ''">
                        NA
                      </div>
                      <div class="col-8 q-body-1 text-weight-bold text-positive" v-else>
                        {{ item.subDocumentType }}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-12" v-show="item.uploadedDocuments.length > 0">
                        <div class="q-caption" v-for="(
                            document, documentIndex
                          ) in item.uploadedDocuments" :key="documentIndex">
                          {{ document.fileName }}
                        </div>
                      </div>
                      <div class="q-caption" v-show="item.uploadedDocuments.length == 0">
                        <div class="text-weight-bold text-negative">
                          No document available
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row group q-py-md items-center">
              <div class="col-6">
                <q-input color="grey-9" v-model="merchant.remarks" label="Remarks" placeholder="Remarks" />
              </div>
              <div class="col-6">
                <p class="q-ma-0">Hold payment?</p>
                <q-radio color="grey-9" v-model="holdPayment" :val="1" label="Yes" />
                <q-radio color="grey-9" v-model="holdPayment" :val="0" label="No" />
              </div>
            </div>
            <q-stepper-navigation>
              <!-- <q-btn  /> -->
              <q-btn v-if="this.leadSourceApp.multiTidEnabled != true" color="primary" class="q-ma-xs" icon="check"
                @click="finalFormSubmit()" label="Submit" />
              <q-btn v-if="this.leadSourceApp.multiTidEnabled == true" color="primary" class="q-ma-xs" icon="check"
                @click="OpenMultiTidToggle()" label="Create Base TID" />
              <q-btn color="grey-7" class="q-ma-xs" icon="block" @click="previousClicked()" label="Previous" />
              <q-btn color="amber-10" class="q-ma-xs" icon="inbox" label="Save Partial" @click="saveCurrentChanges()" />
              <q-btn color="negative" class="q-ma-xs" icon="backspace" label="Back to document validation"
                @click="goBackToDocumentVerificationStage()" />
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
        <multiTidComponents v-if="propTogglemultiTidComponentDetails"
          :multiTidComponentDetails="addtnmultiTidComponentDetails" :propTogglemultiTidComponentDetails="
            propTogglemultiTidComponentDetails
          " />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeMount } from 'vue'
import { useQuasar, date } from 'quasar'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, requiredIf, alphaNum, integer, numeric, minLength, maxLength, email, maxValue, minValue, decimal, helpers } from '@vuelidate/validators'
import _ from 'lodash'
import { useRouter } from 'vue-router'

// Components
import MarsErrorResponse from './MarsErrorResponseHandler.vue'
import ViewLeadDocumentsDataEntryComponent from './viewLeadDocumentsDataEntryComponent.vue'
import MultiTidComponents from './multiTidComponents.vue'

const $q = useQuasar()
const store = useStore()
const router = useRouter()

// Props
const props = defineProps({
  propLeadDeatils: {
    type: Object,
    required: true
  }
})

// Emits
defineEmits([])

// Reactive state
const propTogglemultiTidComponentDetails = ref(false)
const today = new Date()
const past = date.subtractFromDate(today, { days: 76500 })
const future = date.addToDate(today, { days: 0 })
const vasDisableFlag = ref(false)
const ptCitySelected = ref(false)
const companyRegisteredCitySelected = ref(false)
const companyRegisteredStateSelected = ref(false)
const subventionBankFeeData = ref('')
const originalBankFeeData = ref(0)
const viewBinding = reactive({
  sharingModelCode: [
    { label: 'No sharing', value: 'N' },
    { label: 'Transaction value model', value: 'T' },
    { label: 'MDR/cash@pos/rent', value: 'M' }
  ],
  accountdetails: [
    { label: 'YES', value: '60' },
    { label: 'NO', value: '90' }
  ],
  member: [
    { label: '1-3 years', value: '90' },
    { label: '3-5 years', value: '70' },
    { label: '> 5 years', value: '50' }
  ],
  od1_gender: [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Transgender', value: 'T' }
  ],
  od2_gender: [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Transgender', value: 'T' }
  ],
  statementType: [
    { label: 'E-Statement', value: 'E' }
  ],
  statementFrequency: [
    { label: 'Daily', value: 'D' },
    { label: 'Monthly', value: 'M' },
    { label: 'Quaterly', value: 'Q' },
    { label: 'Half yearly', value: 'H' },
    { label: 'Yearly', value: 'Y' },
    { label: 'None', value: 'N' }
  ],
  partnersArr: [
    {
      name: '',
      address: '',
      pan: '',
      pin: null,
      cityRefCode: '',
      cityRefLabel: '',
      stateRefCode: '',
      stateRefLabel: '',
      contactMobile: '',
      contactEmail: '',
      dob: ''
    }
  ]
})

const plan = ref([])

const addtnmultiTidComponentDetails = reactive({
  merchant: {},
  propLeadDeatils: {},
  leadId: '',
  diners: {},
  holdPayment: ''
})


const bijlipaySwitchOptions = ref([
  { label: 'Yes', value: true },
  { label: 'No', value: false }
])

const smsFlagOptions = ref([
  { label: 'Yes', value: 'Y' },
  { label: 'No', value: 'N' }
])

const applicationTypeOptions = ref([
  { label: 'Digital', value: 'D' },
  { label: 'Non Digital', value: 'N' }
])

const categoryTypeOptions = ref([
  { label: 'Small', value: 'S' },
  { label: 'Other', value: 'O' }
])

const cardAcceptanceOptions = ref([
  { label: 'International + Domestic Credit/Debit Card', value: '0' },
  { label: 'Domestic Credit/Debit Cards', value: '1' },
  { label: 'Domestic Debit Cards', value: '3' }
])

const terminalTypeOptions = ref([
  { label: 'POS', value: 'POS' },
  { label: 'MPOS', value: 'MPOS' },
  { label: 'PG', value: 'PG' }
])

const merchantOptions = ref([
  { label: 'Individual', value: '90' },
  { label: 'Proprietor', value: '80' },
  { label: 'Pvt Ltd', value: '70' },
  { label: 'Public Ltd', value: '60' },
  { label: 'Partnership', value: '61' },
  { label: 'Trust', value: '50' },
  { label: 'Government', value: '30' },
  { label: 'Society', value: '40' }
])

const merchantTypeOptions = ref([
  { label: 'POS Merchant', value: 'P' },
  { label: 'HERMES Merchant', value: 'H' }
])

const BusinessHourToOptions = ref([
  { label: '00.00', value: '00.00' },
  { label: '00.30', value: '00.30' },
  { label: '01.00', value: '01.00' },
  { label: '01.30', value: '01.30' },
  { label: '02.00', value: '02.00' },
  { label: '02.30', value: '02.30' },
  { label: '03.00', value: '03.00' },
  { label: '03.30', value: '03.30' },
  { label: '04.00', value: '04.00' },
  { label: '04.30', value: '04.30' },
  { label: '05.00', value: '05.00' },
  { label: '05.30', value: '05.30' },
  { label: '06.00', value: '06.00' },
  { label: '06.30', value: '06.30' },
  { label: '07.00', value: '07.00' },
  { label: '07.30', value: '07.30' },
  { label: '08.00', value: '08.00' },
  { label: '08.30', value: '08.30' },
  { label: '09.00', value: '09.00' },
  { label: '09.30', value: '09.30' },
  { label: '10.00', value: '10.00' },
  { label: '10.30', value: '10.30' },
  { label: '11.00', value: '11.00' },
  { label: '11.30', value: '11.30' },
  { label: '12.00', value: '12.00' },
  { label: '12.30', value: '12.30' },
  { label: '13.00', value: '13.00' },
  { label: '13.30', value: '13.30' },
  { label: '14.00', value: '14.00' },
  { label: '14.30', value: '14.30' },
  { label: '15.00', value: '15.00' },
  { label: '15.30', value: '15.30' },
  { label: '16.00', value: '16.00' },
  { label: '16.30', value: '16.30' },
  { label: '17.00', value: '17.00' },
  { label: '17.30', value: '17.30' },
  { label: '18.00', value: '18.00' },
  { label: '18.30', value: '18.30' },
  { label: '19.00', value: '19.00' },
  { label: '19.30', value: '19.30' },
  { label: '20.00', value: '20.00' },
  { label: '20.30', value: '20.30' },
  { label: '21.00', value: '21.00' },
  { label: '21.30', value: '21.30' },
  { label: '22.00', value: '22.00' },
  { label: '22.30', value: '22.30' },
  { label: '23.00', value: '23.00' },
  { label: '23.30', value: '23.30' }
])

const BusinessHourFromOptions = ref([
  { label: '00.00', value: '00.00' },
  { label: '00.30', value: '00.30' },
  { label: '01.00', value: '01.00' },
  { label: '01.30', value: '01.30' },
  { label: '02.00', value: '02.00' },
  { label: '02.30', value: '02.30' },
  { label: '03.00', value: '03.00' },
  { label: '03.30', value: '03.30' },
  { label: '04.00', value: '04.00' },
  { label: '04.30', value: '04.30' },
  { label: '05.00', value: '05.00' },
  { label: '05.30', value: '05.30' },
  { label: '06.00', value: '06.00' },
  { label: '06.30', value: '06.30' },
  { label: '07.00', value: '07.00' },
  { label: '07.30', value: '07.30' },
  { label: '08.00', value: '08.00' },
  { label: '08.30', value: '08.30' },
  { label: '09.00', value: '09.00' },
  { label: '09.30', value: '09.30' },
  { label: '10.00', value: '10.00' },
  { label: '10.30', value: '10.30' },
  { label: '11.00', value: '11.00' },
  { label: '11.30', value: '11.30' },
  { label: '12.00', value: '12.00' },
  { label: '12.30', value: '12.30' },
  { label: '13.00', value: '13.00' },
  { label: '13.30', value: '13.30' },
  { label: '14.00', value: '14.00' },
  { label: '14.30', value: '14.30' },
  { label: '15.00', value: '15.00' },
  { label: '15.30', value: '15.30' },
  { label: '16.00', value: '16.00' },
  { label: '16.30', value: '16.30' },
  { label: '17.00', value: '17.00' },
  { label: '17.30', value: '17.30' },
  { label: '18.00', value: '18.00' },
  { label: '18.30', value: '18.30' },
  { label: '19.00', value: '19.00' },
  { label: '19.30', value: '19.30' },
  { label: '20.00', value: '20.00' },
  { label: '20.30', value: '20.30' },
  { label: '21.00', value: '21.00' },
  { label: '21.30', value: '21.30' },
  { label: '22.00', value: '22.00' },
  { label: '22.30', value: '22.30' },
  { label: '23.00', value: '23.00' },
  { label: '23.30', value: '23.30' }
])

const merchantTypeCodeOptions = ref([
  { label: 'Stand Alone', value: 'S' },
  { label: 'Integrated', value: 'I' }
])

const currentPosOptions = ref([
  { label: 'YES', value: 'Y' },
  { label: 'NO', value: 'N' }
])

const businessTypeOptions = ref([
  { label: 'Rented', value: 'R' },
  { label: 'Owned', value: 'O' },
  { label: 'Leased', value: 'L' }
])

const autoormanualOptions = ref([
  { label: 'Auto Settlement', value: 'A' },
  { label: 'Manual Settlement', value: 'M' }
])

const statezoneOptions = ref([
  { label: 'East Zone', value: '90' },
  { label: 'West Zone', value: '80' },
  { label: 'North Zone', value: '70' },
  { label: 'South Zone', value: '60' }
])

const tipFaclityOptions = ref([
  { label: 'Yes', value: 'Y' },
  { label: 'No', value: 'N' }
])

const saleFlagOptions = ref([
  { label: 'Yes', value: '1' },
  { label: 'No', value: '0' }
])

const edcOptions = ref([
  { label: 'Yes', value: 'EDC01' },
  { label: 'No', value: 'N' }
])

const internationalCardAcceptanceOptions = ref([
  { label: 'Yes', value: 'Y' },
  { label: 'No', value: 'N' }
])

const creditCardBlockOptions = ref([
  { label: 'Yes', value: 'Y' },
  { label: 'No', value: 'N' }
])



const deviceOwnedByOptions = ref([
  { label: 'Service Provide(Bijlipay)', value: 'S' },
  { label: 'BANK', value: 'B' },
  { label: 'Merchant', value: 'M' }
])



const rentalTypeOptions = ref([
  { label: 'Advanced', value: 'A' },
  { label: 'Regular', value: 'R' },
  { label: 'EMI', value: 'E' }
])

const iaSalutationOptions = ref([
  { label: 'MR', value: 'Mr' },
  { label: 'MRS', value: 'Mrs' },
  { label: 'Ms', value: 'Ms' }
])

const iaGenderOptions = ref([
  { label: 'Male', value: 'M' },
  { label: 'FeMale', value: 'F' },
  { label: 'Transgender', value: 'T' }
])

const od1SalutationOptions = ref([
  { label: 'MR', value: 'Mr' },
  { label: 'MRS', value: 'Mrs' },
  { label: 'MS', value: 'Ms' }
])

const od1GenderOptions = ref([
  { label: 'Male', value: 'M' },
  { label: 'FeMale', value: 'F' },
  { label: 'Transgender', value: 'T' }
])

const od2SalutationOptions = ref([
  { label: 'MR', value: 'Mr' },
  { label: 'MRS', value: 'Mrs' },
  { label: 'MS', value: 'Ms' }
])

const od2GenderOptions = ref([
  { label: 'Male', value: 'M' },
  { label: 'FeMale', value: 'F' },
  { label: 'Transgender', value: 'T' }
])


const rentalModeOptions = ref([
  { label: 'Standing instructions', value: 'S' },
  { label: 'Normal', value: 'N' },
  { label: 'Nabad', value: 'B' },
  { label: 'Invoice for EPRS', value: 'I' },
  { label: 'Equitas Rental', value: 'E' },
  { label: 'Big merchant', value: 'M' },
  { label: 'Invoice to Trade', value: 'IT' },
  { label: 'Rental Fee Waiver', value: 'RW' },
  { label: 'Advance Rental', value: 'AR' },
  { label: 'Settlement', value: 'SE' },
  { label: 'Exibition', value: 'EX' },
  { label: 'Clix', value: 'CX' },
  { label: 'Subvention', value: 'SB' },
  { label: 'EMI Rental', value: 'EM' },
  { label: 'BPCL', value: 'BP' },
  { label: 'Demo Device', value: 'DD' },
  { label: 'Invoice to Bank', value: 'IB' },
  { label: 'Finetree Finance LTD', value: 'FF' },
  { label: 'Deactivated', value: 'DT' },
  { label: 'APAC FINANCIAL SERVICES PVT LTD', value: 'AP' },
  { label: 'NEO GROWTH', value: 'NG' },
  { label: 'Capital Float', value: 'CF' },
  { label: 'KBL Rent Settlement', value: 'KS' },
  { label: 'KBL Rent Invoice to Bank', value: 'KI' }
])

const advanceRentModeOptions = ref([
  { label: 'Card', value: 'Card' },
  { label: 'Cheque', value: 'Cheque' },
  { label: 'NEFT', value: 'NEFT' },
  { label: 'IMPS', value: 'IMPS' },
  { label: 'Cash', value: 'Cash' }
])

const accountTypeOptions = ref([
  { label: 'Saving account', value: 'S' },
  { label: 'Current account', value: 'C' },
  { label: 'Overdraft account', value: 'O' },
  { label: 'Cash credit account', value: 'R' }
])

const feeTypeOptions = ref([
  { label: 'NEFT', value: 'N' },
  { label: 'Settlement', value: 'S' },
  { label: 'None', value: 'X' }
])

const paymnentModeOptions = ref([
  { label: 'Direct credit', value: 'D' },
  { label: 'NEFT', value: 'N' }
])

const regionOptions = ref([])
const leadFromOptions = ref([])
const salesPersonOptions = ref([])
const cityOptions = ref([])
const stateOptions = ref([])
const mccSearchSet = ref([])
const terminalModelSet = ref([])
const rentalPlanSet = ref([])
const bankListSet = ref([])
const networkProviderListSet = ref([])
const serviceProviderListSet = ref([])
const holdPayment = ref(0)
const formdata = reactive({
  fixed: 0.0,
  percentage: 0.0,
  minimum: 0.0
})

const soSelectedVas = ref('')
const vasBasedOnInstance = ref([])
const tmpVasMapping = ref([])
const leadSourceApp = ref({})
const deviceTypeApp = ref({})
const salesCode = ref('')
const salesPerson = ref('')
const salesPersonName = ref('')
const devicePrice = ref('')

const revParamAndLeadInfo = reactive({
  bijlipaySwitch: true,
  vasInstanceMapping: ''
})

// Add bankFee reactive variable that was missing
const bankFee = ref(0)

const merchant = reactive({
  device: '',
  revParameters: {
    cashAtPosEnabled: 'N',
    tipEnabled: 'N',
    saleFlag: '1',
    notificationRecipient: 'N',
    preAuth: 'N',
    settlementType: 'A',
    txnEmiAllowed: '0',
    sodexoEnabled: '0',
    amexEnabled: '0',
    bqrEnabled: '0',
    upichargeslipEnabled: '0',
    linkpaymentFlag: '0',
    matmAllowed: 'N',
    upiFlag: '0'
  },
  salesInformation: {
    institutionCode: 101,
    applicationType: 'D',
    applicationNumber: '',
    applicationDate: '',
    aggreementDate: '',
    merchantType: 'P',
    categoryType: 'O',
    region: '',
    salesPersonName: '',
    leadFrom: '',
    sharingModelCode: 'N',
    sharingPartnerCode: '',
    dailyFixedAmount: '',
    loanDisbursementPercentage: '',
    loanDisbursementAmount: '',
    loanDisbursementDate: '',
    tenureMonth: '',
    tenureDay: '',
    tenureStartDate: '',
    rentPercentage: 2,
    rentFixed: ''
  },
  additionalInfo: {
    installationBranchCode: '',
    iaLocation: '',
    iaDistrict: '',
    branchZone: '',
    raDistrict: '',
    od1District: '',
    od2District: '',
    lorState: '',
    iaSalutation: '',
    iaGender: '',
    od1Salutation: '',
    od1Gender: '',
    od2Salutation: '',
    od2Gender: '',
    state: '',
    city: '',
    fillingType: '',
    category: '',
    subCategory: '',
    ownerDOB: '',
    pin: ''
  },
  companyInformation: {
    legalName: '',
    dbaName: '',
    smsFlag: '',
    registeredAddress: '',
    registeredPin: '',
    registeredCityRefCode: '',
    registeredStateRefCode: '',
    constitution: '',
    constitutionName: '',
    constitutionDescription: '',
    establishYear: '',
    registerNumber: '',
    pan: '',
    tin: '',
    tan: '',
    businessNature: '',
    businessType: 'R',
    mcc: '',
    residentialAddress: '',
    residentialPin: '',
    statezone: '',
    cityzone: '',
    residentialCityRefCode: '',
    residentialStateRefCode: '',
    contactName: '',
    contactMobile: '',
    contactAlternateMobile: '',
    contactPhone: '',
    contactEmail: '',
    statementType: 'E',
    statementFrequency: 'D',
    statementEmail: ''
  },
  businessInformation: {
    weekdayStartHour: '',
    weekdayEndHour: '',
    weekendStartHour: '',
    weekendEndHour: '',
    lastTurnoverYear: null,
    maximumMonthlyUsage: '',
    merchantTypeCode: '',
    lastTurnoverAmount: '',
    expectedCardBusiness: '',
    averageBillAmount: '',
    gstId: null,
    currentPosName: '',
    debitCardMdr: '',
    creditCardMdr: '',
    memberSince: '',
    businessIncome: ''
  },
  partnerInformation: [
    {
      name: '',
      address: '',
      pan: '',
      pin: '',
      stateRefCode: '',
      cityRefCode: '',
      contactMobile: '',
      contactEmail: '',
      dob: ''
    }
  ],
  customIncentiveRates: [
    {
      minValue: 200,
      maxValue: 999,
      mechantFixed: 0.5,
      merchantPercent: 0,
      sharingFixed: 0,
      sharingPercent: 0,
      add: 0
    },
    {
      minValue: 1000,
      maxValue: 1999,
      mechantFixed: 2,
      merchantPercent: 0,
      sharingFixed: 1,
      sharingPercent: 0,
      add: 0
    },
    {
      minValue: 2000,
      maxValue: 2999,
      mechantFixed: 5,
      merchantPercent: 0,
      sharingFixed: 1,
      sharingPercent: 0,
      add: 0
    },
    {
      minValue: 3000,
      maxValue: 3499,
      mechantFixed: 9.5,
      merchantPercent: 0,
      sharingFixed: 1,
      sharingPercent: 0,
      add: 0
    },
    {
      minValue: 3500,
      maxValue: 10000,
      mechantFixed: 5,
      merchantPercent: 0,
      sharingFixed: 2,
      sharingPercent: 0,
      add: 0
    }
  ],
  paymentDetails: {
    deviceOwnedBy: 'S',
    installationFee: '',
    terminalModeCode: '',
    terminalType: 'POS',
    cardAcceptance: '1',
    numberOfTerminals: 1,
    emiStartDate: '',
    omcEnabled: false,
    intlCardAcceptance: 'N',
    creditCardBlock: 'N',
    tipPercentage: '20',
    rentalPlanCode: 1,
    recurringFees: '',
    bankFee: '',
    serviceProvider: 1,
    networkPreferred: 1,
    rentalMode: 'S',
    rentalType: 'A',
    advanceRentCollected: '',
    advanceRentMode: 'NEFT',
    noOfMonthRentPaidInAdvance: '',
    gracePeriod: 0,
    totalEmiAmount: '',
    emiTenure: '',
    otherCharges: '',
    totalAmountPaid: ''
  },
  bankInformation: {
    bankDetails: {
      ifsc: '',
      micr: '',
      bankName: '',
      branchName: '',
      branchCode: '',
      branchZone: '',
      bankCityRefCode: '',
      bankStateRefCode: '',
      paymentMode: 'D',
      accountType: '',
      accountdetails: '',
      accountNumber: '',
      bankStatementAttached: 'Y',
      cancelChequeAttached: 'Y',
      feeType: 'N',
      settlementOrNeftFee: ''
    },
    collectionDetails: {
      collectedDate: '',
      swipeAmount: '',
      swipeTerminal: '',
      chequeAmount: '',
      chequeDate: '',
      chequeDepositedDate: '',
      chequeNumber: '',
      upiLink: '',
      acquirerBank: ''
    }
  },
  kyc: {
    documents: []
  },
  remarks: '',
  mdrPlan: {
    code: 1,
    domesticDebitUpTo2000: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 99999
    },
    incentive: {
      percentage: 0.0,
      minimum: 0.0,
      minimumTxnValue: 0
    },
    domesticDebitAbove2000: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 99999
    },
    standardOrClassic: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 0.0
    },
    premiumOrPlatinum: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 0.0
    },
    superPremiumOrSignature: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 0.0
    },
    commercialOrCorporate: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 0.0
    },
    internationalDebitCard: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 0.0
    },
    internationalCreditCard: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 0.0
    },
    onus: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 0.0
    },
    mVisa: {
      fixed: 0.0,
      percentage: 3,
      minimum: 0.0
    },
    upiUpto2000: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 0.0
    },
    diners: {
      fixed: 0.0,
      percentage: 0,
      minimum: 0.0
    },
    amexDomestic: {
      fixed: 0.0,
      percentage: 0,
      minimum: 0.0
    },
    amexInternational: {
      fixed: 0.0,
      percentage: 0,
      minimum: 0.0
    },
    upiAbove2000: {
      fixed: 0.0,
      percentage: 0,
      minimum: 0.0
    },
    upiCreditUpto2000: {
      fixed: 0.0,
      percentage: 0,
      minimum: 0.0
    },
    upiCreditAbove2000: {
      fixed: 0.0,
      percentage: 0,
      minimum: 0.0
    },
    masterPass: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 0.0
    },
    cashAtPos: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 0.0
    },
    convenientFee: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 0.0
    }
  },
  SharingDiscountFee: {
    domesticDebitUpTo2000: {
      fixed: 0,
      percentage: 0,
      minimum: 0
    },
    domesticDebitAbove2000: {
      fixed: 0,
      percentage: 0,
      minimum: 0
    },
    upiUpto2000: {
      fixed: 0,
      percentage: 0,
      minimum: 0
    },
    standardOrClassic: {
      fixed: 0,
      percentage: 0,
      minimum: 0
    },
    premiumOrPlatinum: {
      fixed: 0,
      percentage: 0,
      minimum: 0
    },
    superPremiumOrSignature: {
      fixed: 0,
      percentage: 0,
      minimum: 0
    },
    commercialOrCorporate: {
      fixed: 0,
      percentage: 0,
      minimum: 0
    },
    internationalDebitCard: {
      fixed: 0,
      percentage: 0,
      minimum: 0
    },
    internationalCreditCard: {
      fixed: 0,
      percentage: 0,
      minimum: 0
    },
    onus: {
      fixed: 0,
      percentage: 0,
      minimum: 0
    },
    mVisa: {
      fixed: 0,
      percentage: 0,
      minimum: 0
    },
    diners: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 0.0
    },
    amexDomestic: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 0.0
    },
    amexInternational: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 0.0
    },
    upiAbove2000: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 0.0
    },
    upiCreditUpto2000: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 0.0
    },
    upiCreditAbove2000: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 0.0
    },
    masterPass: {
      fixed: 0,
      percentage: 0,
      minimum: 0
    },
    cashAtPos: {
      fixed: 0,
      percentage: 0,
      minimum: 0
    },
    convenientFee: {
      fixed: 0,
      percentage: 0,
      minimum: 0
    }
  }
})

const error = reactive({
  tab: {
    salesInformation: false,
    companyInformation: false,
    partnerInformation: false,
    businessInformation: false,
    paymentDetails: false,
    revParameters: false,
    mdrPlan: false,
    SharingDiscountFee: false,
    bankInformation: false
  },
  field: {
    revParamAndLeadInfo: {
      bijlipaySwitch: {
        alert: false,
        issue: '',
        value: ''
      }
    },
    merchant: {
      salesInformation: {
        institutionCode: { alert: false, issue: '', value: '' },
        applicationType: { alert: false, issue: '', value: '' },
        applicationNumber: { alert: false, issue: '', value: '' },
        applicationDate: { alert: false, issue: '', value: '' },
        aggreementDate: { alert: false, issue: '', value: '' },
        merchantType: { alert: false, issue: '', value: '' },
        categoryType: { alert: false, issue: '', value: '' },
        region: { alert: false, issue: '', value: '' },
        salesPersonName: { alert: false, issue: '', value: '' },
        leadFrom: { alert: false, issue: '', value: '' },
        sharingModelCode: { alert: false, issue: '', value: '' },
        sharingPartnerCode: { alert: false, issue: '', value: '' },
        dailyFixedAmount: { alert: false, issue: '', value: '' },
        loanDisbursementPercentage: { alert: false, issue: '', value: '' },
        loanDisbursementAmount: { alert: false, issue: '', value: '' },
        loanDisbursementDate: { alert: false, issue: '', value: '' },
        tenureMonth: { alert: false, issue: '', value: '' },
        tenureDay: { alert: false, issue: '', value: '' },
        tenureStartDate: { alert: false, issue: '', value: '' },
        rentPercentage: { alert: false, issue: '', value: '' },
        rentFixed: { alert: false, issue: '', value: '' }
      },
      companyInformation: {
        legalName: { alert: false, issue: '', value: '' },
        smsFlag: { alert: false, issue: '', value: '' },
        dbaName: { alert: false, issue: '', value: '' },
        statezone: { alert: false, issue: '', value: '' },
        cityzone: { alert: false, issue: '', value: '' },
        registeredAddress: { alert: false, issue: '', value: '' },
        registeredPin: { alert: false, issue: '', value: '' },
        registeredCityRefCode: { alert: false, issue: '', value: '' },
        registeredStateRefCode: { alert: false, issue: '', value: '' },
        constitution: { alert: false, issue: '', value: '' },
        constitutionName: { alert: false, issue: '', value: '' },
        constitutionDescription: { alert: false, issue: '', value: '' },
        establishYear: { alert: false, issue: '', value: '' },
        registerNumber: { alert: false, issue: '', value: '' },
        pan: { alert: false, issue: '', value: '' },
        tin: { alert: false, issue: '', value: '' },
        tan: { alert: false, issue: '', value: '' },
        businessNature: { alert: false, issue: '', value: '' },
        businessType: { alert: false, issue: '', value: '' },
        mcc: { alert: false, issue: '', value: '' },
        residentialAddress: { alert: false, issue: '', value: '' },
        residentialPin: { alert: false, issue: '', value: '' },
        residentialCityRefCode: { alert: false, issue: '', value: '' },
        residentialStateRefCode: { alert: false, issue: '', value: '' },
        contactName: { alert: false, issue: '', value: '' },
        contactMobile: { alert: false, issue: '', value: '' },
        contactAlternateMobile: { alert: false, issue: '', value: '' },
        contactPhone: { alert: false, issue: '', value: '' },
        contactEmail: { alert: false, issue: '', value: '' },
        statementType: { alert: false, issue: '', value: '' },
        statementFrequency: { alert: false, issue: '', value: '' },
        statementEmail: { alert: false, issue: '', value: '' }
      },
      revParameters: {
        bijlipaySwitch: { alert: false, issue: '', value: '' },
        cashAtPosEnabled: { alert: false, issue: '', value: '' },
        preAuth: { alert: false, issue: '', value: '' },
        settlementType: { alert: false, issue: '', value: '' },
        tipEnabled: { alert: false, issue: '', value: '' },
        notificationRecipient: { alert: false, issue: '', value: '' },
        saleFlag: { alert: false, issue: '', value: '' }
      },
      businessInformation: {
        weekdayStartHour: { alert: false, issue: '', value: '' },
        weekdayEndHour: { alert: false, issue: '', value: '' },
        weekendStartHour: { alert: false, issue: '', value: '' },
        weekendEndHour: { alert: false, issue: '', value: '' },
        lastTurnoverYear: { alert: false, issue: '', value: '' },
        maximumMonthlyUsage: { alert: false, issue: '', value: '' },
        merchantTypeCode: { alert: false, issue: '', value: '' },
        lastTurnoverAmount: { alert: false, issue: '', value: '' },
        expectedCardBusiness: { alert: false, issue: '', value: '' },
        averageBillAmount: { alert: false, issue: '', value: '' },
        gstId: { alert: false, issue: '', value: '' },
        currentPosName: { alert: false, issue: '', value: '' },
        debitCardMdr: { alert: false, issue: '', value: '' },
        creditCardMdr: { alert: false, issue: '', value: '' },
        memberSince: { alert: false, issue: '', value: '' },
        businessIncome: { alert: false, issue: '', value: '' }
      },
      partnerInformation: [
        {
          name: { alert: false, issue: '', value: '' },
          dob: { alert: false, issue: '', value: '' },
          address: { alert: false, issue: '', value: '' },
          pan: { alert: false, issue: '', value: '' },
          pin: { alert: false, issue: '', value: '' },
          stateRefCode: { alert: false, issue: '', value: '' },
          cityRefCode: { alert: false, issue: '', value: '' },
          contactMobile: { alert: false, issue: '', value: '' },
          contactEmail: { alert: false, issue: '', value: '' }
        }
      ],
      paymentDetails: {
        deviceOwnedBy: { alert: false, issue: '', value: '' },
        emiStartDate: { alert: false, issue: '', value: '' },
        installationFee: { alert: false, issue: '', value: '' },
        terminalModeCode: { alert: false, issue: '', value: '' },
        terminalType: { alert: false, issue: '', value: '' },
        numberOfTerminals: { alert: false, issue: '', value: '' },
        omcEnabled: { alert: false, issue: '', value: '' },
        intlCardAcceptance: { alert: false, issue: '', value: '' },
        creditCardBlock: { alert: false, issue: '', value: '' },
        rentalPlanCode: { alert: false, issue: '', value: '' },
        serviceProvider: { alert: false, issue: '', value: '' },
        networkPreferred: { alert: false, issue: '', value: '' },
        rentalMode: { alert: false, issue: '', value: '' },
        rentalType: { alert: false, issue: '', value: '' },
        advanceRentCollected: { alert: false, issue: '', value: '' },
        advanceRentMode: { alert: false, issue: '', value: '' },
        noOfMonthRentPaidInAdvance: { alert: false, issue: '', value: '' },
        gracePeriod: { alert: false, issue: '', value: '' },
        totalEmiAmount: { alert: false, issue: '', value: '' },
        emiTenure: { alert: false, issue: '', value: '' },
        otherCharges: { alert: false, issue: '', value: '' },
        totalAmountPaid: { alert: false, issue: '', value: '' }
      },
      bankInformation: {
        bankDetails: {
          ifsc: { alert: false, issue: '', value: '' },
          micr: { alert: false, issue: '', value: '' },
          bankName: { alert: false, issue: '', value: '' },
          branchName: { alert: false, issue: '', value: '' },
          bankCityRefCode: { alert: false, issue: '', value: '' },
          bankStateRefCode: { alert: false, issue: '', value: '' },
          paymentMode: { alert: false, issue: '', value: '' },
          accountType: { alert: false, issue: '', value: '' },
          accountdetails: { alert: false, issue: '', value: '' },
          accountNumber: { alert: false, issue: '', value: '' },
          bankStatementAttached: { alert: false, issue: '', value: '' },
          cancelChequeAttached: { alert: false, issue: '', value: '' },
          feeType: { alert: false, issue: '', value: '' },
          settlementOrNeftFee: { alert: false, issue: '', value: '' }
        },
        collectionDetails: {
          collectedDate: { alert: false, issue: '', value: '' },
          swipeAmount: { alert: false, issue: '', value: '' },
          swipeTerminal: { alert: false, issue: '', value: '' },
          chequeAmount: { alert: false, issue: '', value: '' },
          chequeDate: { alert: false, issue: '', value: '' },
          chequeDepositedDate: { alert: false, issue: '', value: '' },
          chequeNumber: { alert: false, issue: '', value: '' },
          upiLink: { alert: false, issue: '', value: '' },
          acquirerBank: { alert: false, issue: '', value: '' }
        }
      },
      mdrPlan: {
        domesticDebitUpTo2000: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        domesticDebitAbove2000: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        upiUpto2000: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        standardOrClassic: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        premiumOrPlatinum: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        superPremiumOrSignature: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        commercialOrCorporate: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        internationalDebitCard: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        internationalCreditCard: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        onus: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        mVisa: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        diners: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        amexDomestic: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        amexInternational: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        upiAbove2000: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        upiCreditUpto2000: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        upiCreditAbove2000: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        masterPass: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        cashAtPos: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        convenientFee: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        }
      },
      SharingDiscountFee: {
        domesticDebitUpTo2000: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        domesticDebitAbove2000: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        upiUpto2000: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        standardOrClassic: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        premiumOrPlatinum: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        superPremiumOrSignature: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        commercialOrCorporate: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        internationalDebitCard: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        internationalCreditCard: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        onus: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        mVisa: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        diners: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        amexDomestic: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        amexInternational: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        upiAbove2000: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        upiCreditUpto2000: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        upiCreditAbove2000: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        masterPass: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        },
        cashAtPos: {
          fixed: { alert: false, issue: '', value: '' },
          percentage: { alert: false, issue: '', value: '' },
          minimum: { alert: false, issue: '', value: '' }
        }
      }
    }
  }
})

const showDocumentPreview = ref(true)
const vasKey = ref(0)

// Computed properties
const GLOBAL_FILE_FETCH_URL = computed(() => store.getters['GlobalVariables/GLOBAL_FILE_FETCH_URL'])
const getShortLeadInfo = computed(() => store.getters['SatLeadValidation/getShortLeadInfo'])
const getInstance = computed(() => store.getters['VasCheck/getInstance'])
const getLsDeviceBasedVasDetails = computed(() => store.getters['leadSourceVasDeviceConfig/getLsDeviceBasedVasDetails'])
const getAllZone = computed(() => store.getters['AllZone/getAllZone'])
const getAllDistrict = computed(() => store.getters['District/getAllDistrict'])
const getAllBranchName = computed(() => store.getters['BranchName/getAllBranchName'])
const getiorState = computed(() => store.getters['StateName/getiorState'])
const regionsFromMars = computed(() => store.getters['mars_regions/regionsFromMars'])
const leadFromInfoFromMars = computed(() => store.getters['mars_leadFrom/leadFromInfoFromMars'])
const ifscFromMars = computed(() => store.getters['mars_ifsc/ifscFromMars'])
const getAllFillingTypes = computed(() => store.getters['MPOST_FILLINGTYPES/getAllFillingTypes'])
const getMposState = computed(() => store.getters['MPOS_STATE/getMposState'])
const getMposCity = computed(() => store.getters['MPOS_CITY/getMposCity'])
const getMposCategory = computed(() => store.getters['MPOS_CATEGORY/getMposCategory'])
const getMposSubCategory = computed(() => store.getters['MPOS_SUBCATEGORY/getMposSubCategory'])
const getinstitutionCode = computed(() => store.getters['InstitutionCode/getinstitutionCode'])
const getAxisBankPincode = computed(() => store.getters['AxisBankPincode/getAxisBankPincode'])
const getPincodeBasedDistrict = computed(() => store.getters['PincodeBasedDistrict/getPincodeBasedDistrict'])
const getPincodeDistrict = computed(() => store.getters['StateBasedDistrict/getPincodeDistrict'])
const getCityBasedLocation = computed(() => store.getters['CityBasedLocation/getCityBasedLocation'])
const getApplicationNumber = computed(() => store.getters['applicationNumberFromAPI/getApplicationNumber'])

// Validation regex patterns
const panCard = helpers.regex('panCard', /^([A-Z]{3}[ABCFEGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1})?$/)
const gstn = helpers.regex('gstn', /^([0-9]){2}([A-Z]{3}[ABCFEGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}[0-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/)
const tanValidate = helpers.regex('tanValidate', /[A-Za-z]{4}\d{5}[A-Za-z]{1}/)
const alphaNumericValidate = helpers.regex('alphaNumericValidate', /^(?:[A-Za-z0-9]+)(?:[A-Za-z0-9 ]*)$/)
const alphaNumericSpecialValidate = helpers.regex('alphaNumericSpecialValidate', /^[ A-Za-z0-9_@.*#/!%^()&+-,"]*$/)
const alpha = helpers.regex('alphaNumericSpecialValidate', /^[A-Za-z0-9\s]*$/)

// Validation rules
const rules = {
  revParamAndLeadInfo: {
    bijlipaySwitch: { required }
  },
  merchant: {
    salesInformation: {
      institutionCode: {
        required: requiredIf(() => getAxisBank.value === true)
      },
      applicationType: { required },
      applicationNumber: { required, alphaNum },
      applicationDate: { required },
      aggreementDate: { required },
      salesPersonName: { required },
      region: { required },
      merchantType: { required },
      categoryType: { required },
      leadFrom: {
        required: requiredIf(() => getAxisBank.value === true)
      },
      sharingPartnerCode: {
        required: requiredIf(() => getTransctionValueModel.value === true || getCashAtPos.value === true)
      },
      dailyFixedAmount: {
        required: requiredIf(() => getTransctionValueModel.value === true),
        decimal,
        minValue: minValue(0),
        maxValue: maxValue(99999.99),
        minLength: minLength(1),
        maxLength: maxLength(7)
      },
      loanDisbursementPercentage: {
        required: requiredIf(() => getTransctionValueModel.value === true),
        decimal,
        minValue: minValue(0),
        maxValue: maxValue(100)
      },
      loanDisbursementAmount: {
        required: requiredIf(() => getTransctionValueModel.value === true),
        decimal,
        minValue: minValue(0),
        maxValue: maxValue(99999999.99),
        maxLength: maxLength(10),
        minLength: minLength(2)
      },
      loanDisbursementDate: {
        required: requiredIf(() => getTransctionValueModel.value === true)
      },
      tenureMonth: {
        required: requiredIf(() => getTransctionValueModel.value === true),
        integer,
        minValue: minValue(0)
      },
      tenureDay: {
        required: requiredIf(() => getTransctionValueModel.value === true),
        integer,
        minValue: minValue(0)
      },
      tenureStartDate: {
        required: requiredIf(() => getTransctionValueModel.value === true)
      },
      rentPercentage: {
        required: requiredIf(() => getCashAtPos.value === true),
        maxValue: maxValue(100),
        decimal,
        minValue: minValue(0)
      },
      rentFixed: {
        required: requiredIf(() => getCashAtPos.value === true),
        decimal,
        minValue: minValue(0)
      }
    },
    companyInformation: {
      legalName: {
        required,
        minLength: minLength(0),
        maxLength: maxLength(60),
        alpha
      },
      dbaName: {
        required,
        minLength: minLength(0),
        maxLength: maxLength(60),
        alphaNumericSpecialValidate
      },
      smsFlag: { required },
      registeredAddress: {
        required,
        minLength: minLength(1),
        maxLength: maxLength(120)
      },
      registeredPin: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(6)
      },
      registeredCityRefCode: {
        required,
        integer
      },
      registeredCityName: { required },
      registeredStateRefCode: {
        required,
        integer
      },
      registeredStateName: { required },
      statezone: { required },
      cityzone: { alpha },
      constitution: { required },
      establishYear: { required },
      constitutionName: { required },
      registerNumber: {
        required,
        alphaNum,
        minLength: minLength(1),
        maxLength: maxLength(20)
      },
      mccname: { required },
      mcc: { required },
      residentialAddress: {
        required,
        minLength: minLength(1),
        maxLength: maxLength(120)
      },
      residentialPin: {
        required,
        integer,
        minLength: minLength(6),
        maxLength: maxLength(6)
      },
      residentCityName: { required },
      residentialCityRefCode: {
        required,
        integer
      },
      residentStateName: { required },
      residentialStateRefCode: {
        required,
        integer
      },
      pan: {
        required,
        panCard,
        maxLength: maxLength(10),
        minLength: minLength(10)
      },
      tin: {
        integer,
        minLength: minLength(9),
        maxLength: maxLength(12)
      },
      tan: {
        maxLength: maxLength(10),
        minLength: minLength(10),
        tanValidate
      },
      contactName: {
        required,
        minLength: minLength(0),
        maxLength: maxLength(30),
        alphaNumericValidate
      },
      contactMobile: {
        numeric,
        required,
        minLength: minLength(10),
        maxLength: maxLength(10)
      },
      contactAlternateMobile: {
        numeric,
        minLength: minLength(10),
        maxLength: maxLength(10)
      },
      contactPhone: {
        numeric,
        required,
        minLength: minLength(12),
        maxLength: maxLength(12)
      },
      contactEmail: {
        required,
        email
      },
      statementEmail: {
        required,
        email
      },
      statementType: { required },
      statementFrequency: { required }
    },
    businessInformation: {
      gstId: {
        gstn,
        minLength: minLength(15),
        maxLength: maxLength(15)
      },
      weekendEndHour: { required },
      weekendStartHour: { required },
      weekdayEndHour: { required },
      weekdayStartHour: { required },
      memberSince: { required },
      currentPosName: { required },
      debitCardMdr: {
        required: requiredIf(() => getmpose.value === true),
        minValue: minValue(0),
        maxValue: maxValue(99.99)
      },
      creditCardMdr: {
        required: requiredIf(() => getmpose.value === true),
        minValue: minValue(0),
        maxValue: maxValue(99.99)
      },
      expectedCardBusiness: {
        decimal,
        required,
        minValue: minValue(0),
        maxValue: maxValue(9999999999.99)
      },
      averageBillAmount: {
        decimal,
        minValue: minValue(0),
        maxValue: maxValue(9999999999.99)
      },
      lastTurnoverAmount: {
        decimal,
        minValue: minValue(0),
        maxValue: maxValue(9999999999.99)
      },
      maximumMonthlyUsage: {
        decimal,
        required,
        minValue: minValue(0),
        maxValue: maxValue(9999999999.99)
      },
      merchantTypeCode: { required }
    },
    paymentDetails: {
      installationFee: {
        required: requiredIf(() => getRentalTypeVisibilityForRental.value === true),
        decimal,
        minValue: minValue(0),
        maxValue: maxValue(999999.99),
        minLength: minLength(1),
        maxLength: maxLength(12)
      },
      rentalPlanCode: { required },
      emiStartDate: {
        required: requiredIf(() => getRentalTypeVisibilityForEmi.value === true)
      },
      serviceProvider: { required: true },
      networkPreferred: { required: true },
      terminalModeCode: { required },
      terminalType: {
        required: requiredIf(() => getMpos.value === true)
      },
      otherCharges: {
        decimal,
        minValue: minValue(0),
        maxValue: maxValue(999999),
        minLength: minLength(1),
        maxLength: maxLength(8)
      },
      totalAmountPaid: {
        decimal,
        minValue: minValue(0),
        maxValue: maxValue(999999),
        minLength: minLength(1),
        maxLength: maxLength(12)
      },
      numberOfTerminals: {
        numeric,
        minValue: minValue(1),
        maxValue: maxValue(100)
      },
      deviceOwnedBy: { required },
      omcEnabled: { required },
      intlCardAcceptance: { required },
      creditCardBlock: { required },
      rentalType: { required },
      advanceRentCollected: {
        required: requiredIf(() => getRentalTypeVisibilityForAdvanced.value === true),
        decimal,
        minValue: minValue(0),
        maxValue: maxValue(999999),
        minLength: minLength(1),
        maxLength: maxLength(8)
      },
      advanceRentMode: {
        required: requiredIf(() => getRentalTypeVisibilityForAdvanced.value === true)
      },
      noOfMonthRentPaidInAdvance: {
        required: requiredIf(() => getRentalTypeVisibilityForAdvanced.value === true),
        minValue: minValue(0),
        maxValue: maxValue(999999),
        minLength: minLength(1),
        maxLength: maxLength(8)
      },
      gracePeriod: {
        required: requiredIf(() => getRentalTypeVisibilityForRental.value === true),
        minValue: minValue(0),
        maxValue: maxValue(999999),
        minLength: minLength(1),
        maxLength: maxLength(8)
      },
      totalEmiAmount: {
        required: requiredIf(() => getRentalTypeVisibilityForEmi.value === true)
      },
      emiTenure: {
        required: requiredIf(() => getRentalTypeVisibilityForEmi.value === true)
      }
    },
    revParameters: {
      cashAtPosEnabled: { required },
      settlementType: { required },
      preAuth: { required },
      tipEnabled: { required },
      notificationRecipient: { required },
      saleFlag: { required }
    },
    bankInformation: {
      bankDetails: {
        ifsc: {
          required,
          alphaNum,
          maxLength: maxLength(11)
        },
        micr: {
          required,
          numeric,
          minLength: minLength(9),
          maxLength: maxLength(9)
        },
        branchName: { required },
        bankName: { required },
        bankCityName: { required },
        bankCityRefCode: {
          required,
          numeric
        },
        accountNumber: {
          required,
          alphaNum,
          minLength: minLength(6),
          maxLength: maxLength(19)
        },
        bankStateName: { required },
        bankStateRefCode: {
          required,
          numeric
        },
        paymentMode: { required },
        accountType: { required },
        accountdetails: { required },
        settlementOrNeftFee: {
          required: requiredIf(() => getfeeTypeForSettlementVisibility.value === true),
          integer,
          maxValue: maxValue(999),
          minValue: minValue(0)
        }
      },
      collectionDetails: {
        collectedDate: {
          required: requiredIf(() => bankInfoSwipePayment.value === true)
        },
        swipeAmount: {
          decimal,
          required: requiredIf(() => bankInfoSwipePayment.value === true),
          minValue: minValue(0)
        },
        swipeTerminal: {
          required: requiredIf(() => bankInfoSwipePayment.value === true)
        },
        chequeAmount: {
          decimal,
          required: requiredIf(() => bankInfoChequePayment.value === true),
          minValue: minValue(0)
        },
        chequeNumber: {
          alphaNum,
          required: requiredIf(() => bankInfoChequePayment.value === true),
          minLength: minLength(6),
          maxLength: maxLength(25)
        },
        upiLink: {
          required: requiredIf(() => bankInfoUpiLink.value === true)
        },
        chequeDate: {
          required: requiredIf(() => bankInfoChequePayment.value === true)
        },
        chequeDepositedDate: {
          required: requiredIf(() => bankInfoChequePayment.value === true)
        }
      }
    },
    mdrPlan: {
      domesticDebitUpTo2000: {
        fixed: { minValue: minValue(0), decimal },
        percentage: { minValue: minValue(0), maxValue: maxValue(100) },
        minimum: { minValue: minValue(0), decimal }
      },
      domesticDebitAbove2000: {
        fixed: { minValue: minValue(0), decimal },
        percentage: { minValue: minValue(0), maxValue: maxValue(100), decimal },
        minimum: { minValue: minValue(0), decimal }
      },
      upiUpto2000: {
        fixed: { minValue: minValue(0), decimal },
        percentage: { minValue: minValue(0), maxValue: maxValue(100), decimal },
        minimum: { minValue: minValue(0), decimal }
      },
      standardOrClassic: {
        fixed: { minValue: minValue(0), decimal, required },
        percentage: { minValue: minValue(0), maxValue: maxValue(100), decimal, required },
        minimum: { minValue: minValue(0), decimal, required }
      },
      premiumOrPlatinum: {
        fixed: { minValue: minValue(0), decimal, required },
        percentage: { minValue: minValue(0), maxValue: maxValue(100), decimal, required },
        minimum: { minValue: minValue(0), decimal, required }
      },
      superPremiumOrSignature: {
        fixed: { minValue: minValue(0), decimal, required },
        percentage: { minValue: minValue(0), maxValue: maxValue(100), decimal, required },
        minimum: { minValue: minValue(0), decimal, required }
      },
      commercialOrCorporate: {
        fixed: { minValue: minValue(0), decimal, required },
        percentage: { minValue: minValue(0), maxValue: maxValue(100), decimal, required },
        minimum: { minValue: minValue(0), decimal, required }
      },
      internationalDebitCard: {
        fixed: { minValue: minValue(0), decimal, required },
        percentage: { minValue: minValue(0), maxValue: maxValue(100), decimal, required },
        minimum: { minValue: minValue(0), decimal, required }
      },
      internationalCreditCard: {
        fixed: { minValue: minValue(0), decimal, required },
        percentage: { minValue: minValue(0), maxValue: maxValue(100), decimal, required },
        minimum: { minValue: minValue(0), decimal, required }
      },
      onus: {
        fixed: { minValue: minValue(0), decimal, required },
        percentage: { minValue: minValue(0), maxValue: maxValue(100), decimal, required },
        minimum: { minValue: minValue(0), decimal, required }
      },
      mVisa: {
        fixed: { minValue: minValue(0), decimal, required },
        percentage: { minValue: minValue(0), maxValue: maxValue(100), decimal, required },
        minimum: { minValue: minValue(0), decimal, required }
      },
      diners: {
        fixed: { minValue: minValue(0), decimal, required },
        percentage: { minValue: minValue(0), maxValue: maxValue(100), decimal, required },
        minimum: { minValue: minValue(0), decimal, required }
      },
      amexDomestic: {
        fixed: { minValue: minValue(0), decimal, required },
        percentage: { minValue: minValue(0), maxValue: maxValue(100), decimal, required },
        minimum: { minValue: minValue(0), decimal, required }
      },
      amexInternational: {
        fixed: { minValue: minValue(0), decimal, required },
        percentage: { minValue: minValue(0), maxValue: maxValue(100), decimal, required },
        minimum: { minValue: minValue(0), decimal, required }
      },
      upiAbove2000: {
        fixed: { minValue: minValue(0), decimal },
        percentage: { minValue: minValue(0), maxValue: maxValue(100) },
        minimum: { minValue: minValue(0), decimal }
      },
      upiCreditUpto2000: {
        fixed: { minValue: minValue(0), decimal },
        percentage: { minValue: minValue(0), maxValue: maxValue(100) },
        minimum: { minValue: minValue(0), decimal }
      },
      upiCreditAbove2000: {
        fixed: { minValue: minValue(0), decimal },
        percentage: { minValue: minValue(0), maxValue: maxValue(100) },
        minimum: { minValue: minValue(0), decimal }
      },
      masterPass: {
        fixed: { minValue: minValue(0), decimal, required },
        percentage: { minValue: minValue(0), maxValue: maxValue(100), decimal, required },
        minimum: { minValue: minValue(0), decimal, required }
      },
      cashAtPos: {
        fixed: { minValue: minValue(0), decimal, required },
        percentage: { minValue: minValue(0), maxValue: maxValue(100), decimal, required },
        minimum: { minValue: minValue(0), decimal, required }
      },
      convenientFee: {
        fixed: { minValue: minValue(0), decimal, required },
        percentage: { minValue: minValue(0), maxValue: maxValue(100), decimal, required },
        minimum: { minValue: minValue(0), decimal, required }
      }
    },
    SharingDiscountFee: {
      domesticDebitUpTo2000: {
        fixed: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        percentage: {
          minValue: minValue(0),
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true),
          maxValue: maxValue(100)
        },
        minimum: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        }
      },
      domesticDebitAbove2000: {
        fixed: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        percentage: {
          minValue: minValue(0),
          maxValue: maxValue(100),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        minimum: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        }
      },
      upiUpto2000: {
        fixed: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        percentage: {
          minValue: minValue(0),
          maxValue: maxValue(100),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        minimum: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        }
      },
      standardOrClassic: {
        fixed: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        percentage: {
          minValue: minValue(0),
          maxValue: maxValue(100),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        minimum: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        }
      },
      premiumOrPlatinum: {
        fixed: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        percentage: {
          minValue: minValue(0),
          maxValue: maxValue(100),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        minimum: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        }
      },
      superPremiumOrSignature: {
        fixed: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        percentage: {
          minValue: minValue(0),
          maxValue: maxValue(100),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        minimum: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        }
      },
      commercialOrCorporate: {
        fixed: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        percentage: {
          minValue: minValue(0),
          maxValue: maxValue(100),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        minimum: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        }
      },
      internationalDebitCard: {
        fixed: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        percentage: {
          minValue: minValue(0),
          maxValue: maxValue(100),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        minimum: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        }
      },
      internationalCreditCard: {
        fixed: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        percentage: {
          minValue: minValue(0),
          maxValue: maxValue(100),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        minimum: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        }
      },
      onus: {
        fixed: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        percentage: {
          minValue: minValue(0),
          maxValue: maxValue(100),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        minimum: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        }
      },
      mVisa: {
        fixed: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        percentage: {
          minValue: minValue(0),
          maxValue: maxValue(100),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        minimum: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        }
      },
      diners: {
        fixed: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        percentage: {
          minValue: minValue(0),
          maxValue: maxValue(100),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        minimum: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        }
      },
      amexDomestic: {
        fixed: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        percentage: {
          minValue: minValue(0),
          maxValue: maxValue(100),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        minimum: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        }
      },
      amexInternational: {
        fixed: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        percentage: {
          minValue: minValue(0),
          maxValue: maxValue(100),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        minimum: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        }
      },
      upiAbove2000: {
        fixed: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        percentage: {
          minValue: minValue(0),
          maxValue: maxValue(100),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        minimum: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        }
      },
      upiCreditUpto2000: {
        fixed: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        percentage: {
          minValue: minValue(0),
          maxValue: maxValue(100),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        minimum: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        }
      },
      upiCreditAbove2000: {
        fixed: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        percentage: {
          minValue: minValue(0),
          maxValue: maxValue(100),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        minimum: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        }
      },
      masterPass: {
        fixed: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        percentage: {
          minValue: minValue(0),
          maxValue: maxValue(100),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        minimum: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        }
      },
      cashAtPos: {
        fixed: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        percentage: {
          minValue: minValue(0),
          maxValue: maxValue(100),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        },
        minimum: {
          minValue: minValue(0),
          decimal,
          required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value === true)
        }
      }
    }
  },
  viewBinding: {
    partnersArr: {
      required: requiredIf(() => getPartnersVisiblity.value),
      $each: {
        name: {
          required,
          minLength: minLength(1),
          maxLength: maxLength(120),
          alphaNumericValidate
        },
        dob: { required },
        address: {
          minLength: minLength(1),
          maxLength: maxLength(120),
          required
        },
        pan: {
          required,
          panCard,
          maxLength: maxLength(10),
          minLength: minLength(10)
        },
        pin: {
          required,
          integer,
          minLength: minLength(6),
          maxLength: maxLength(7)
        },
        stateRefCode: { required, integer },
        stateRefLabel: { required },
        cityRefCode: { required, integer },
        cityRefLabel: { required },
        contactMobile: {
          required,
          integer,
          minLength: minLength(10),
          maxLength: maxLength(10)
        },
        contactEmail: { required, email }
      }
    }
  }
}

const $v = useVuelidate(rules, { revParamAndLeadInfo, merchant, viewBinding })

// Computed getters
const getAxisBank = computed(() => {
  return merchant.salesInformation.leadFrom == 'OPEN MARKET' ? true : false
})

const getMpos = computed(() => {
  return merchant.paymentDetails.terminalType == 'MPOS' ? true : false
})

const getTransctionValueModel = computed(() => {
  return merchant.salesInformation.sharingModelCode == 'T' ? true : false
})

const getCashAtPos = computed(() => {
  return merchant.salesInformation.sharingModelCode == 'M' ? true : false
})

const getRentalTypeVisibilityForRental = computed(() => {
  return merchant.paymentDetails.rentalType == 'R' ? true : false
})

const getRentalTypeVisibilityForAdvanced = computed(() => {
  return merchant.paymentDetails.rentalType == 'A' ? true : false
})

const getRentalTypeVisibilityForEmi = computed(() => {
  return merchant.paymentDetails.rentalType == 'E' ? true : false
})

const getfeeTypeForSettlementVisibility = computed(() => {
  return merchant.bankInformation.bankDetails.feeType == 'N' || merchant.bankInformation.bankDetails.feeType == 'S' ? true : false
})

const showOnlyIfSharingModelIsEnabled = computed(() => {
  return merchant.salesInformation.sharingModelCode != 'N' ? true : false
})

const bankInfoSwipePayment = computed(() => {
  return props.propLeadDeatils.paymentOption == 3 ? true : false
})

const bankInfoChequePayment = computed(() => {
  return props.propLeadDeatils.paymentOption == 2 ? true : false
})

const bankInfoUpiLink = computed(() => {
  return props.propLeadDeatils.paymentOption == 4 ? true : false
})

const getmpose = computed(() => {
  return merchant.businessInformation.currentPosName == 'Y' ? true : false
})

const getPartnersVisiblity = computed(() => {
  // Define your partners tab enabled items logic here
  const PARTNERS_TAB_ENABLED_ITEMS = ['IN', 'PL', 'SP', 'PB', 'TR', 'SO', 'OT']
  return PARTNERS_TAB_ENABLED_ITEMS.includes(merchant.companyInformation.constitution) ? true : false
})

// Methods
const handleInput = () => {
  const value = subventionBankFeeData.value
  if (!value || isNaN(value)) {
    bankFee.value = originalBankFeeData.value
  } else {
    bankFee.value = originalBankFeeData.value - parseFloat(value)
  }
}

const handleInputrentalMode = () => {
  if (merchant.paymentDetails.rentalMode == 'IB') {
    bankFee.value = props.propLeadDeatils.recurringFees / 1.18
  } else if (merchant.paymentDetails.rentalMode == 'SB') {
    if (subventionBankFeeData.value > 0) {
      const inputValue = subventionBankFeeData.value
      bankFee.value = originalBankFeeData.value - inputValue
    }
  }
}



const OpenMultiTidToggle = () => {
  propTogglemultiTidComponentDetails.value = !propTogglemultiTidComponentDetails.value
  if (merchant != undefined && props.propLeadDeatils != undefined) {
    addtnmultiTidComponentDetails.merchant = merchant
    addtnmultiTidComponentDetails.propLeadDeatils = props.propLeadDeatils
    addtnmultiTidComponentDetails.holdPayment = holdPayment.value
    addtnmultiTidComponentDetails.leadId = router.currentRoute.value.params.id
    addtnmultiTidComponentDetails.diners = formdata
  }
}



const populateCustom = () => {
  let param = merchant.customIncentiveRates[0].mechantFixed + merchant.customIncentiveRates[0].sharingFixed
  merchant.customIncentiveRates[0].add = param
}

const populateCustom1 = () => {
  let param1 = merchant.customIncentiveRates[1].mechantFixed + merchant.customIncentiveRates[1].sharingFixed
  merchant.customIncentiveRates[1].add = param1
}

const populateCustom2 = () => {
  let param2 = merchant.customIncentiveRates[2].mechantFixed + merchant.customIncentiveRates[2].sharingFixed
  merchant.customIncentiveRates[2].add = param2
}

const populateCustom3 = () => {
  let param3 = merchant.customIncentiveRates[3].mechantFixed + merchant.customIncentiveRates[3].sharingFixed
  merchant.customIncentiveRates[3].add = param3
}

const populateCustom4 = () => {
  let param4 = merchant.customIncentiveRates[4].mechantFixed + merchant.customIncentiveRates[4].sharingFixed
  merchant.customIncentiveRates[4].add = param4
}

const populateBankDetails = async () => {
  await store.dispatch('mars_ifsc/IFSC_FROM_MARS', merchant.bankInformation.bankDetails.ifsc)
    .then(response => {
      if (response.status == 200) {
        merchant.bankInformation.bankDetails.bankName = ifscFromMars.value.bankName
        merchant.bankInformation.bankDetails.branchName = ifscFromMars.value.branchName
        merchant.bankInformation.bankDetails.micr = ifscFromMars.value.MICR
      } else {
        $q.notify({
          color: 'negative',
          position: 'bottom-left',
          message: 'Invalid IFSC code',
          icon: 'clear'
        })
        merchant.bankInformation.bankDetails.ifsc = ''
        merchant.bankInformation.bankDetails.bankName = ''
        merchant.bankInformation.bankDetails.branchName = ''
        merchant.bankInformation.bankDetails.micr = ''
      }
    })
}

const partnerCitySearch = (terms, done) => {
  done(COMMON_FILTER_FUNCTION(cityOptions.value, terms))
}

const partnerCitySelected = (item, index) => {
  ptCitySelected.value = true
  viewBinding.partnersArr[index].cityRefCode = item.value
  viewBinding.partnersArr[index].cityRefLabel = item.label
}

const partnerStateSearch = (terms, done) => {
  done(COMMON_FILTER_FUNCTION(stateOptions.value, terms))
}

const partnerStateSelected = (item, index) => {
  viewBinding.partnersArr[index].stateRefCode = item.value
  viewBinding.partnersArr[index].stateRefLabel = item.label
}

const mccSearch = (terms, done) => {
  done(COMMON_FILTER_FUNCTION(mccSearchSet.value, terms))
}

const mccSelected = (item) => {
  merchant.companyInformation.mccname = item.label
  merchant.companyInformation.mcc = item.value
  if (
    merchant.companyInformation.mcc == '5812' ||
    merchant.companyInformation.mcc == '5813' ||
    merchant.companyInformation.mcc == '5814' ||
    merchant.companyInformation.mcc == '7011'
  ) {
    merchant.revParameters.settlementType = 'M'
    merchant.revParameters.tipEnabled = 'Y'
    if (merchant.companyInformation.mcc == '5541') {
      merchant.paymentDetails.omcEnabled = true
    } else {
      merchant.paymentDetails.omcEnabled = false
    }
    revParamAndLeadInfo.bijlipaySwitch = true
  } else {
    merchant.revParameters.settlementType = 'A'
    merchant.revParameters.tipEnabled = 'N'
    merchant.paymentDetails.omcEnabled = false
    revParamAndLeadInfo.bijlipaySwitch = true
  }
}

const sharemodebasedonSharingMode = () => {
  store.dispatch('sharingModeBasedOnSharingPartnerCode/FETCH_SHARING_MODEL_BASED_SHARING_PARTNER_CODE', merchant.salesInformation.sharingModelCode)
}

const residentCitySearch = (terms, done) => {
  done(COMMON_FILTER_FUNCTION(cityOptions.value, terms))
}

const residentCitySelected = (item) => {
  merchant.companyInformation.residentCityName = item.label
  merchant.companyInformation.residentialCityRefCode = item.value
}

const residentStateSearch = (terms, done) => {
  done(COMMON_FILTER_FUNCTION(stateOptions.value, terms))
}

const residentStateSelected = (item) => {
  merchant.companyInformation.residentStateName = item.label
  merchant.companyInformation.residentialStateRefCode = item.value
}

const registeredCitySelected = (item) => {
  companyRegisteredCitySelected.value = true
  merchant.companyInformation.registeredCityName = item.label
  merchant.companyInformation.registeredCityRefCode = item.value
}

const fnClrRegisteredCity = () => {
  if (!companyRegisteredCitySelected.value) {
    merchant.companyInformation.registeredCityName = ''
  }
}

const registeredStateSelected = (item) => {
  companyRegisteredStateSelected.value = true
  merchant.companyInformation.registeredStateName = item.label
  merchant.companyInformation.registeredStateRefCode = item.value
}

const fnClrRegisteredState = () => {
  if (!companyRegisteredStateSelected.value) {
    merchant.companyInformation.registeredStateName = ''
  }
}

const bankCitySelected = (item) => {
  merchant.bankInformation.bankDetails.bankCityName = item.label
  merchant.bankInformation.bankDetails.bankCityRefCode = item.value
}

const bankStateSelected = (item) => {
  merchant.bankInformation.bankDetails.bankStateName = item.label
  merchant.bankInformation.bankDetails.bankStateRefCode = item.value
}

const COMMON_FILTER_FUNCTION = (arraySet, terms) => {
  return _.filter(arraySet, function(oo) {
    return (
      oo.label.toLowerCase().includes(terms.toLowerCase()) ||
      oo.value.toString().includes(terms.toString())
    )
  })
}

const selectCurrentType = () => {
  merchant.paymentDetails.gracePeriod = ''
  merchant.paymentDetails.advanceRentCollected = ''
  merchant.paymentDetails.noOfMonthRentPaidInAdvance = ''
}

const addMorePartnersSet = () => {
  let partnerObj = {
    name: '',
    address: '',
    pan: '',
    pin: '',
    cityRefCode: '',
    cityRefLabel: '',
    stateRefCode: '',
    stateRefLabel: '',
    contactMobile: '',
    contactEmail: '',
    dob: ''
  }
  let errorObj = {
    name: { alert: false, issue: '', value: '' },
    address: { alert: false, issue: '', value: '' },
    pan: { alert: false, issue: '', value: '' },
    pin: { alert: false, issue: '', value: '' },
    stateRefCode: { alert: false, issue: '', value: '' },
    cityRefCode: { alert: false, issue: '', value: '' },
    contactMobile: { alert: false, issue: '', value: '' },
    contactEmail: { alert: false, issue: '', value: '' },
    dob: { alert: false, issue: '', value: '' }
  }
  error.field.merchant.partnerInformation.push(errorObj)
  viewBinding.partnersArr.push(partnerObj)
}

const removePartnerFromArr = (item, index) => {
  viewBinding.partnersArr.splice(index, 1)
  error.field.merchant.partnerInformation.splice(index, 1)
}

const handleVasChange = (newVal) => {
  let updated = [...newVal]
  const has = val => updated.includes(val)
  const had = val => tmpVasMapping.value.includes(val)

  if (had('EMI') && !has('EMI')) {
    updated = updated.filter(v => v !== 'Bank EMI' && v !== 'Brand EMI')
  }

  if (has('EMI') && !has('Bank EMI')) {
    updated.push('Bank EMI')
  }

  if (has('Bank EMI') && !has('EMI')) {
    updated.push('EMI')
  }

  if (has('Brand EMI') && !has('EMI')) {
    updated.push('EMI')
  }

  tmpVasMapping.value = [...new Set(updated)]
}

const VasSelected = async () => {
  let params = {
    device: merchant.paymentDetails.terminalModeCode,
    code: merchant.salesInformation.institutionCode
  }
  let vasArr = []
  
  if (props.propLeadDeatils.leadSource.multiTidEnabled == true) {
    let params1 = {
      leadSource: props.propLeadDeatils.leadSource.id,
      device: props.propLeadDeatils.device.id
    }
    await store.dispatch('leadSourceVasDeviceConfig/GET_LS_AND_DEVICE_BASED_VAS_DETAILS', params1)
    getLsDeviceBasedVasDetails.value.vasList.map(function(value) {
      vasArr.push({
        label: value.name,
        value: JSON.stringify(value)
      })
    })
    vasBasedOnInstance.value = vasArr
  } else {
    await store.dispatch('VasCheck/FETCH_INSTANCE', params)
    getInstance.value.map(function(value) {
      vasArr.push({
        label: value.vas.name,
        value: value.vas.name
      })
    })
    
    if (props.propLeadDeatils.leadSource.sourceName === 'LS_TOHANDS') {
      vasBasedOnInstance.value = vasArr
      vasBasedOnInstance.value = vasArr.map(opt => ({
        ...opt,
        disable: props.propLeadDeatils.leadSource.sourceName === 'LS_TOHANDS' && opt.value !== 'UPI QR'
      }))
      const upiExists = vasBasedOnInstance.value.some(opt => opt.value === 'UPI QR')
      if (upiExists) {
        tmpVasMapping.value = ['UPI QR']
        vasKey.value++
      }
    } else {
      vasBasedOnInstance.value = vasArr
    }
  }
}

const goBackToDocumentVerificationStage = () => {
  // Note: router needs to be imported
  // let formData = {
  //   leadId: router.currentRoute.value.params.id,
  //   defaultUrlValue: getShortLeadInfo.value.leadStatus == $LEAD_STATUS_MARS_REFERRAL_BACK_DATA_ENTRY_PENDING
  //     ? $SAT_LEAD_VALIDATION_PROCEED_TO_DATA_ENTRY_WITH_REFERBACK
  //     : $SAT_LEAD_VALIDATION_APPROVE
  // }
  // Implementation needs router and constants
}

const fetchAllDropdownValuesFromMARSapi = async (institutionCode) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: 'purple-9',
    message: 'Setting data ..'
  })
  
  try {
    // Fetch regions
    await store.dispatch('mars_regions/REGION_FROM_MARS', institutionCode)
    regionOptions.value = []
    regionsFromMars.value.items.map(oo => {
      regionOptions.value.push({ label: oo.name, value: oo.code })
    })
    
    // Fetch lead from
    await store.dispatch('mars_leadFrom/LEAD_FROM_FROM_MARS', institutionCode)
    leadFromOptions.value = []
    // Note: Need to handle VARANEEK logic
    leadFromInfoFromMars.value.items.map(oo => {
      leadFromOptions.value.push({ label: oo.name, value: oo.name })
    })
    
    // Continue with other API calls...
    // Note: This is a simplified version - you need to implement all the chained calls
    
    $q.loading.hide()
  } catch {

    $q.loading.hide()
  }
}

const varaneekInstance = () => {
  if (props.propLeadDeatils.leadSource.id == 81 && props.propLeadDeatils.device.id == 6) {
    merchant.salesInformation.institutionCode = 106
  }
  if (props.propLeadDeatils.leadSource.id == 81 && props.propLeadDeatils.device.id == 6 && props.propLeadDeatils.merchantCategory.merchantCategoryName == 'Retail') {
    merchant.salesInformation.institutionCode = 104
  }
}

const fetchAndCookDocuments = () => {
  merchant.kyc.documents.push({
    documentName: 'Agreement',
    documentType: props.propLeadDeatils.merchantType.marsAgreementId,
    documentImage: [
      GLOBAL_FILE_FETCH_URL.value + '/' + props.propLeadDeatils.applicationFile
    ]
  })

  Object.keys(props.propLeadDeatils.leadDocuments).forEach(function(key) {
    _.map(props.propLeadDeatils.leadDocuments[key], function(oo) {
      if (oo.uploadedDocuments.length > 0) {
        let assumeArr = []
        _.map(oo.uploadedDocuments, function(doc) {
          assumeArr.push(GLOBAL_FILE_FETCH_URL.value + '/' + doc.fileName)
        })
        merchant.kyc.documents.push({
          documentName: oo.subDocumentType,
          documentType: oo.marsDocumentId,
          documentImage: assumeArr
        })
      }
    })
  })
}



const saveCurrentChanges = async () => {
  $q.loading.show({
    delay: 0,
    spinnerColor: 'purple-9',
    message: 'Saving data ..'
  })
  
  let a = { ...merchant.mdrPlan }
  merchant.mdrPlan = { ...a, diners: formdata }

  let revParams = { ...merchant.revParameters }
  delete merchant.revParameters

  if (tmpVasMapping.value.length > 0) {
    revParamAndLeadInfo.vasInstanceMapping = JSON.stringify(tmpVasMapping.value)

    revParams.cashAtPosEnabled = tmpVasMapping.value.includes('CASH@POS') == true ? 'Y' : 'N'
    revParams.preAuth = tmpVasMapping.value.includes('PREAUTH') == true ? 'Y' : 'N'
    revParams.txnEmiAllowed = tmpVasMapping.value.includes('EMI') == true ? '1' : '0'
    revParams.sodexoEnabled = tmpVasMapping.value.includes('SODEXO') == true ? '1' : '0'
    revParams.amexEnabled = tmpVasMapping.value.includes('AMEX') == true ? '1' : '0'
    revParams.bqrEnabled = tmpVasMapping.value.includes('QR') == true ? '1' : '0'
    revParams.upichargeslipEnabled = tmpVasMapping.value.includes('UPI_CHARGESLIP') == true ? '1' : '0'
    revParams.linkpaymentFlag = tmpVasMapping.value.includes('Link based Payment') == true ? '1' : '0'
    revParams.matmAllowed = tmpVasMapping.value.includes('mATM') == true ? 'Y' : 'N'
    revParams.upiFlag = tmpVasMapping.value.includes('UPI QR') == true ? '1' : '0'
  }

  merchant.leadId = router.currentRoute.value.params.id
  merchant.partnerInformation = viewBinding.partnersArr
  merchant.revParamAndLeadInfo = revParamAndLeadInfo
  
  try {
    await store.dispatch('mars_dataSubmit/MARS_DATA_SUBMIT_INTERNAL', { merchant: merchant, action: 1 })
    $q.loading.hide()
    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Saved successfully',
      icon: 'thumb_up'
    })
  } catch {

    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Please try again',
      icon: 'thumb_down'
    })
    $q.loading.hide()
  }
  
  merchant.revParameters = revParams
}

const marsRequiredFormattingofGST = (val) => {
  if (val == '') {
    merchant.businessInformation.gstId = null
  } else {
    merchant.businessInformation.gstId = val
  }
}

const autoCompleteError = (val1, val2) => {
  val1.$touch()
  val2.$touch()
  if (val1.$anyError || val2.$anyError) {
    return true
  } else {
    return false
  }
}

const fnClearZone = () => {
  merchant.additionalInfo.branchZone = ''
}

const fnMposStatebasedCity = () => {
  store.dispatch('MPOS_CITY/FETCH_ALL_MPOS_CITY', merchant.additionalInfo.state)
}

const categoryBasedSubCategory = () => {
  store.dispatch('MPOS_SUBCATEGORY/FETCH_ALL_MPOS_SUBCATEGORY', merchant.additionalInfo.category)
}

const fnFetchZone = () => {
  store.dispatch('District/FETCH_ALL_DISTRICT', merchant.additionalInfo.branchZone)
}

const fnFetchBranchName = () => {
  store.dispatch('BranchName/FECTCH_ALL_BRANCH', merchant.additionalInfo.iaDistrict)
  merchant.additionalInfo.raDistrict = merchant.additionalInfo.iaDistrict
  merchant.additionalInfo.od1District = merchant.additionalInfo.iaDistrict
  merchant.additionalInfo.od2District = merchant.additionalInfo.iaDistrict
}



const searchIorState = async (request, done) => {
  await store.dispatch('StateName/FETCH_IOR_STATE', request)
  done(getiorState.value)
}

const searchAxisBankPincode = async (request, done) => {
  await store.dispatch('AxisBankPincode/FETCH_AXIS_BANK_PINCODE_LOCATION', request)
  done(getAxisBankPincode.value)
}

const pincodeBasedDistrict = () => {
  store.dispatch('PincodeBasedDistrict/FETCH_AXIS_BANK_PINCODE_BASED_DISTRICT', merchant.additionalInfo.pin)
}

const pincodeandDistrictBasedCity = () => {
  store.dispatch('StateBasedDistrict/FETCH_AXIS_BANK_PINCODE_DISTRICT', merchant.additionalInfo.pin + '/' + merchant.additionalInfo.state)
}

const citybasedlocation = () => {
  store.dispatch('CityBasedLocation/FETCH_AXIS_BANK_CITY_LOCATION', merchant.additionalInfo.city)
}

const applicationNumberFromToHands = async (leadid) => {
  try {
    await store.dispatch('applicationNumberFromAPI/FETCH_APPLICATION_NUMBER', leadid)
    merchant.salesInformation.applicationNumber = getApplicationNumber.value.applicationNumber
  } catch (error) {

    console.error('Error fetching application number:', error)
  }
}

// Lifecycle hooks
onBeforeMount(() => {
  // View binding is already set up in reactive state
  
  fetchAllDropdownValuesFromMARSapi(merchant.salesInformation.institutionCode)
  varaneekInstance()
  
  if (props.propLeadDeatils.leadSource.sourceName === 'LS_TOHANDS') {
    let leadid = props.propLeadDeatils.id
    applicationNumberFromToHands(leadid)
  } else {
    merchant.salesInformation.applicationNumber = new Date().getTime()
  }
  
  // Populate data from props
  subventionBankFeeData.value = props.propLeadDeatils.bankFee
  merchant.companyInformation.constitution = props.propLeadDeatils.merchantType.marsMappingId
  merchant.companyInformation.dbaName = props.propLeadDeatils.leadName
  soSelectedVas.value = getShortLeadInfo.value.vasInstanceMapping
    .replaceAll('"', '')
    .replace('[', '')
    .replace(']', '')
  revParamAndLeadInfo.bijlipaySwitch = props.propLeadDeatils.bijlipaySwitch
  merchant.companyInformation.contactMobile = props.propLeadDeatils.contactNumber
  merchant.companyInformation.contactName = props.propLeadDeatils.contactName
  merchant.companyInformation.registeredAddress = props.propLeadDeatils.leadAddress
  merchant.companyInformation.registeredPin = props.propLeadDeatils.pincode
  merchant.paymentDetails.numberOfTerminals = props.propLeadDeatils.deviceCount
  merchant.salesInformation.categoryType = soSelectedVas.value.includes('Small merchant') ? 'S' : 'O'
  merchant.paymentDetails.recurringFees = props.propLeadDeatils.recurringFees
  const bankFeeTemp = props.propLeadDeatils.recurringFees / 1.18
  originalBankFeeData.value = bankFeeTemp
  bankFee.value = originalBankFeeData.value
  
  if (props.propLeadDeatils.device.deviceName == 'Q161_PRO_DQR' || props.propLeadDeatils.device.deviceName == 'Q161_PRO_SQR') {
    merchant.salesInformation.institutionCode = 104
  }
  
  if (props.propLeadDeatils.leadSource.sourceName == 'LS_TOHANDS') {
    merchant.salesInformation.institutionCode = 104
    merchant.bankInformation.bankDetails.accountType = 'C'
  } else {
    merchant.bankInformation.bankDetails.accountType = 'S'
  }
  
  devicePrice.value = props.propLeadDeatils.setupFees
  leadSourceApp.value = props.propLeadDeatils.leadSource
  deviceTypeApp.value = props.propLeadDeatils.device
  salesPerson.value = props.propLeadDeatils.createdBy.name
  salesCode.value = props.propLeadDeatils.createdBy.employeeID
  merchant.salesInformation.salesPersonName = salesPerson.value + '-' + salesCode.value
  salesPersonName.value = salesPerson.value + '-' + salesCode.value
  
  merchant.mdrPlan.domesticDebitUpTo2000.percentage = getShortLeadInfo.value.debitLessthanAmount
  merchant.mdrPlan.domesticDebitAbove2000.percentage = getShortLeadInfo.value.debitGreaterthanAmount
  merchant.mdrPlan.upiUpto2000.percentage = getShortLeadInfo.value.upiDebitCardUpTo2000
  merchant.mdrPlan.upiAbove2000.percentage = getShortLeadInfo.value.upiDebitCardAbove2000
  merchant.mdrPlan.upiCreditUpto2000.percentage = getShortLeadInfo.value.upiPrepaidCreditCardsUpTo2000
  merchant.mdrPlan.upiCreditAbove2000.percentage = getShortLeadInfo.value.upiPrepaidCreditCardsAbove2000
  
  plan.value = getShortLeadInfo.value.vasInstanceMapping
    .replaceAll('"', '')
    .replace('[', '')
    .replace(']', '')
    
  const incentive1 = getShortLeadInfo.value.mAtmOnboardingPlan
  merchant.mdrPlan.incentive.percentage = incentive1.incentivePercentage
  merchant.mdrPlan.incentive.minimum = incentive1.maxIncPerTxn
  merchant.mdrPlan.incentive.minimumTxnValue = incentive1.minTxnVal
  
  merchant.mdrPlan.amexDomestic.percentage = getShortLeadInfo.value.amexDomestic
  merchant.mdrPlan.amexInternational.percentage = getShortLeadInfo.value.amexInternational
  
  merchant.bankInformation.collectionDetails.upiLink = props.propLeadDeatils.paymentOption == 4
    ? props.propLeadDeatils.referenceNumber
    : merchant.bankInformation.collectionDetails.upiLink == ''
    
  merchant.mdrPlan.standardOrClassic.percentage = getShortLeadInfo.value.stdCC
  merchant.mdrPlan.premiumOrPlatinum.percentage = getShortLeadInfo.value.premiumCC
  merchant.mdrPlan.superPremiumOrSignature.percentage = getShortLeadInfo.value.superPremiumlCC
  merchant.mdrPlan.commercialOrCorporate.percentage = getShortLeadInfo.value.corpCC
  merchant.mdrPlan.internationalCreditCard.percentage = getShortLeadInfo.value.intlCC
  
  fetchAndCookDocuments()
})

onMounted(() => {
  merchant.leadId = router.currentRoute.value.params.id
})

// Watchers
watch(() => merchant.businessInformation.currentPosName, () => {
  $v.value.$touch()
})

watch(() => tmpVasMapping.value, (val) => {
  if (props.propLeadDeatils.leadSource.sourceName === 'LS_TOHANDS' && !val.includes('UPI QR')) {
    tmpVasMapping.value = ['UPI QR']
  }
})

// Expose to template
defineExpose({
  // Expose any methods or properties needed by template
})
</script>

<style scoped>
.payment_verification_table i {
  transition: none !important;
}

.customTableClass .q-table tbody tr td {
  word-break: break-all;
  transition: none !important;
}

.border-1 {
  border: 1px solid #e5e5e5;
}

.q-custom-class {
  min-height: 270px;
}

.custom-z-index {
  z-index: 2;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  text-align: left;
  padding: 16px;
}

.readonly-select {
  pointer-events: none;
  opacity: 1 !important;
  cursor: not-allowed !important;
}
</style>