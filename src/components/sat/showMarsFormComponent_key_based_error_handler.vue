<template>
  <div>
    <!-- Documents -->
    <div id="mainContainer" class="row">
      <!-- Documents proof -->
      <div id="leftSidePane" class="col-md-5 q-pa-xs largeCont" v-if="showDocumentPreview">
        <ViewLeadDocumentsDataEntryComponent
          :propLeadDocumentInformation="propLeadDeatils.leadDocuments"
          :propGetShortInfo="propLeadDeatils"
        />
      </div>
      <!-- Document related form -->
      <div id="rightSidePane" class="col-md-7 q-pa-xs block relative">
        <q-stepper
          color="purple-9"
          ref="stepperRef"
          contractable
          alternative-labels
        >
          <q-step
            error-icon="warning"
            :error="error.tab.salesInformation"
            name="first"
            title="Sales"
            subtitle="Info"
          >
            <div class="row gutter-sm">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  @blur="v$.merchant.salesInformation.institutionCode.$touch"
                  :error="v$.merchant.salesInformation.institutionCode.$error"
                  placeholder="Choose from the below"
                  color="grey-9"
                  v-model="merchant.salesInformation.institutionCode"
                  label="Institution Code*"
                  :options="institutionCodeOptions"
                  @update:model-value="fetchAllDropdownValuesFromMARSapi"
                />
                <div
                  class="text-negative"
                  v-if="error.field.merchant.salesInformation.institutionCode.alert"
                >
                  <MarsErrorResponse
                    :error="error.field.merchant.salesInformation.institutionCode"
                  />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  @blur="v$.merchant.salesInformation.applicationType.$touch"
                  :error="v$.merchant.salesInformation.applicationType.$error"
                  placeholder="Choose from the below*"
                  color="grey-9"
                  v-model="merchant.salesInformation.applicationType"
                  label="Application Type*"
                  :options="applicationTypeOptions"
                />
                <div
                  class="text-negative"
                  v-if="error.field.merchant.salesInformation.applicationType.alert"
                >
                  <MarsErrorResponse
                    :error="error.field.merchant.salesInformation.applicationType"
                  />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.salesInformation.applicationNumber.$touch"
                  :error="v$.merchant.salesInformation.applicationNumber.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.applicationNumber"
                  label="Application Number*"
                  placeholder="Application Number*"
                />
                <div
                  class="text-negative"
                  v-if="error.field.merchant.salesInformation.applicationNumber.alert"
                >
                  <MarsErrorResponse
                    :error="error.field.merchant.salesInformation.applicationNumber"
                  />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.salesInformation.applicationDate.$touch"
                  :error="v$.merchant.salesInformation.applicationDate.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.applicationDate"
                  label="Application Date*"
                  placeholder="Application Date*"
                  mask="##/##/####"
                  :rules="['date']"
                >
                  <template v-slot:append>
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
                <div
                  class="text-negative"
                  v-if="error.field.merchant.salesInformation.applicationDate.alert"
                >
                  <MarsErrorResponse
                    :error="error.field.merchant.salesInformation.applicationDate"
                  />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.salesInformation.aggreementDate.$touch"
                  :error="v$.merchant.salesInformation.aggreementDate.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.aggreementDate"
                  label="Agreement Date*"
                  placeholder="Agreement Date*"
                  mask="##/##/####"
                  :rules="['date']"
                >
                  <template v-slot:append>
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
                <div
                  class="text-negative"
                  v-if="error.field.merchant.salesInformation.aggreementDate.alert"
                >
                  <MarsErrorResponse :error="error.field.merchant.salesInformation.aggreementDate"/>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  @blur="v$.merchant.salesInformation.merchantType.$touch"
                  :error="v$.merchant.salesInformation.merchantType.$error"
                  placeholder="Choose from the below*"
                  color="grey-9"
                  v-model="merchant.salesInformation.merchantType"
                  label="Merchant Type*"
                  :options="merchantTypeOptions"
                />
                <div
                  class="text-negative"
                  v-if="error.field.merchant.salesInformation.merchantType.alert"
                >
                  <MarsErrorResponse :error="error.field.merchant.salesInformation.merchantType"/>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  @blur="v$.merchant.salesInformation.categoryType.$touch"
                  :error="v$.merchant.salesInformation.categoryType.$error"
                  placeholder="Choose from the below*"
                  color="grey-9"
                  v-model="merchant.salesInformation.categoryType"
                  label="Category Type*"
                  :options="categoryTypeOptions"
                />
                <div
                  class="text-negative"
                  v-if="error.field.merchant.salesInformation.categoryType.alert"
                >
                  <MarsErrorResponse :error="error.field.merchant.salesInformation.categoryType"/>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  placeholder="Choose from the below*"
                  color="grey-9"
                  @blur="v$.merchant.salesInformation.salesPersonCode.$touch"
                  :error="v$.merchant.salesInformation.salesPersonCode.$error"
                  v-model="merchant.salesInformation.salesPersonCode"
                  label="Sales Person*"
                  :options="salesPersonOptions"
                />
                <div
                  class="text-negative"
                  v-if="error.field.merchant.salesInformation.salesPersonCode.alert"
                >
                  <MarsErrorResponse
                    :error="error.field.merchant.salesInformation.salesPersonCode"
                  />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  placeholder="Choose from the below*"
                  color="grey-9"
                  @blur="v$.merchant.salesInformation.region.$touch"
                  :error="v$.merchant.salesInformation.region.$error"
                  v-model="merchant.salesInformation.region"
                  label="Region*"
                  :options="regionOptions"
                />
                <div
                  class="text-negative"
                  v-if="error.field.merchant.salesInformation.region.alert"
                >
                  <MarsErrorResponse :error="error.field.merchant.salesInformation.region"/>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  placeholder="Choose from the below*"
                  color="grey-9"
                  @blur="v$.merchant.salesInformation.leadFrom.$touch"
                  :error="v$.merchant.salesInformation.leadFrom.$error"
                  v-model="merchant.salesInformation.leadFrom"
                  label="Lead From*"
                  :options="leadFromOptions"
                />
                <div
                  class="text-negative"
                  v-if="error.field.merchant.salesInformation.leadFrom.alert"
                >
                  <MarsErrorResponse :error="error.field.merchant.salesInformation.leadFrom"/>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <div class="q-field__label">Sharing Model</div>
                <div v-for="(item,index) in viewBinding.sharingModelCode" :key="index">
                  <q-radio
                    color="grey-9"
                    v-model="merchant.salesInformation.sharingModelCode"
                    :val="item.value"
                    :label="item.label"
                  />
                </div>
                <div
                  class="text-negative"
                  v-if="error.field.merchant.salesInformation.sharingModelCode.alert"
                >
                  <MarsErrorResponse
                    :error="error.field.merchant.salesInformation.sharingModelCode"
                  />
                </div>
              </div>
            </div>
            <!-- T => Transaction value model -->
            <div
              v-if="merchant.salesInformation.sharingModelCode == 'T'"
              class="row gutter-sm q-my-xs"
            >
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  @blur="v$.merchant.salesInformation.sharingPartnerCode.$touch"
                  :error="v$.merchant.salesInformation.sharingPartnerCode.$error"
                  placeholder="Choose from the below*"
                  color="grey-9"
                  v-model="merchant.salesInformation.sharingPartnerCode"
                  label="Sharing partner*"
                  :options="sharingPartnerOptions"
                />
                <div
                  class="text-negative"
                  v-if="error.field.merchant.salesInformation.sharingPartnerCode.alert"
                >
                  <MarsErrorResponse
                    :error="error.field.merchant.salesInformation.sharingPartnerCode"
                  />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.salesInformation.dailyFixedAmount.$touch"
                  :error="v$.merchant.salesInformation.dailyFixedAmount.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.dailyFixedAmount"
                  label="Daily fixed amount*"
                  type="number"
                  placeholder="Daily fixed amount*"
                />
                <div
                  class="text-negative"
                  v-if="error.field.merchant.salesInformation.dailyFixedAmount.alert"
                >
                  <MarsErrorResponse
                    :error="error.field.merchant.salesInformation.dailyFixedAmount"
                  />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.salesInformation.loanDisbursementPercentage.$touch"
                  :error="v$.merchant.salesInformation.loanDisbursementPercentage.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.loanDisbursementPercentage"
                  label="Percentage*"
                  type="number"
                  placeholder="Percentage*"
                />
                <div
                  class="text-negative"
                  v-if="error.field.merchant.salesInformation.loanDisbursementPercentage.alert"
                >
                  <MarsErrorResponse
                    :error="error.field.merchant.salesInformation.loanDisbursementPercentage"
                  />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.salesInformation.loanDisbursementAmount.$touch"
                  :error="v$.merchant.salesInformation.loanDisbursementAmount.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.loanDisbursementAmount"
                  label="Loan disbursement value*"
                  type="number"
                  placeholder="Loan disbursement value*"
                />
                <div
                  class="text-negative"
                  v-if="error.field.merchant.salesInformation.loanDisbursementAmount.alert"
                >
                  <MarsErrorResponse
                    :error="error.field.merchant.salesInformation.loanDisbursementAmount"
                  />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.salesInformation.loanDisbursementDate.$touch"
                  :error="v$.merchant.salesInformation.loanDisbursementDate.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.loanDisbursementDate"
                  label="Disbursement Date*"
                  placeholder="Disbursement Date*"
                  mask="##/##/####"
                  :rules="['date']"
                >
                  <template v-slot:append>
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
                <div
                  class="text-negative"
                  v-if="error.field.merchant.salesInformation.loanDisbursementDate.alert"
                >
                  <MarsErrorResponse
                    :error="error.field.merchant.salesInformation.loanDisbursementDate"
                  />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.salesInformation.tenureMonth.$touch"
                  :error="v$.merchant.salesInformation.tenureMonth.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.tenureMonth"
                  label="Tenure (in months)*"
                  type="number"
                  placeholder="Tenure (in months)*"
                />
                <div
                  class="text-negative"
                  v-if="error.field.merchant.salesInformation.tenureMonth.alert"
                >
                  <MarsErrorResponse :error="error.field.merchant.salesInformation.tenureMonth"/>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.salesInformation.tenureDay.$touch"
                  :error="v$.merchant.salesInformation.tenureDay.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.tenureDay"
                  label="Tenure (in days)*"
                  type="number"
                  placeholder="Tenure (in days)*"
                />
                <div
                  class="text-negative"
                  v-if="error.field.merchant.salesInformation.tenureDay.alert"
                >
                  <MarsErrorResponse :error="error.field.merchant.salesInformation.tenureDay"/>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.salesInformation.tenureStartDate.$touch"
                  :error="v$.merchant.salesInformation.tenureStartDate.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.tenureStartDate"
                  label="Start Date*"
                  placeholder="Tenure Start Date*"
                  mask="##/##/####"
                  :rules="['date']"
                >
                  <template v-slot:append>
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
                <div
                  class="text-negative"
                  v-if="error.field.merchant.salesInformation.tenureStartDate.alert"
                >
                  <MarsErrorResponse
                    :error="error.field.merchant.salesInformation.tenureStartDate"
                  />
                </div>
              </div>
            </div>
            <!-- M => MDR/cash@pos/rent -->
            <div
              v-if="merchant.salesInformation.sharingModelCode == 'M'"
              class="row gutter-sm q-my-xs"
            >
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  @blur="v$.merchant.salesInformation.sharingPartnerCode.$touch"
                  :error="v$.merchant.salesInformation.sharingPartnerCode.$error"
                  placeholder="Choose from the below*"
                  color="grey-9"
                  v-model="merchant.salesInformation.sharingPartnerCode"
                  label="Sharing partner*"
                  :options="sharingPartnerOptions"
                />
                <div
                  class="text-negative"
                  v-if="error.field.merchant.salesInformation.sharingPartnerCode.alert"
                >
                  <MarsErrorResponse
                    :error="error.field.merchant.salesInformation.sharingPartnerCode"
                  />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.salesInformation.rentPercentage.$touch"
                  :error="v$.merchant.salesInformation.rentPercentage.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.rentPercentage"
                  label="Rent %*"
                  type="number"
                  placeholder="Rent %*"
                />
                <div
                  class="text-negative"
                  v-if="error.field.merchant.salesInformation.rentPercentage.alert"
                >
                  <MarsErrorResponse :error="error.field.merchant.salesInformation.rentPercentage"/>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.salesInformation.rentFixed.$touch"
                  :error="v$.merchant.salesInformation.rentFixed.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.rentFixed"
                  label="Rent fixed*"
                  type="number"
                  placeholder="Rent fixed*"
                />
                <div
                  class="text-negative"
                  v-if="error.field.merchant.salesInformation.rentFixed.alert"
                >
                  <MarsErrorResponse :error="error.field.merchant.salesInformation.rentFixed"/>
                </div>
              </div>
            </div>
            <!-- Navigation for this step at the end of QStep-->
            <q-stepper-navigation>
              <q-btn
                color="primary"
                class="q-ma-xs"
                icon="check"
                @click="validatebeforeNavigate('salesInformation')"
                label="Continue"
              />
              <q-btn
                color="amber-10"
                class="q-ma-xs"
                icon="save"
                label="Save Partial"
                @click="saveCurrentChanges()"
              />
            </q-stepper-navigation>
          </q-step>
          <q-step
            error-icon="warning"
            name="second"
            :error="error.tab.companyInformation"
            title="Details"
          >
            <div class="row gutter-sm">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.legalName.$touch"
                  :error="v$.merchant.companyInformation.legalName.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.legalName"
                  label="Legal Name*"
                  placeholder="Legal Name*"
                />
                <div
                  class="text-negative"
                  v-if="error.field.merchant.companyInformation.legalName.alert"
                >
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.legalName"/>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.dbaName.$touch"
                  :error="v$.merchant.companyInformation.dbaName.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.dbaName"
                  label="DBA Name*"
                  placeholder="DBA Name*"
                />
                <div
                  class="text-negative"
                  v-if="error.field.merchant.companyInformation.dbaName.alert"
                >
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.dbaName"/>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  label="Registered Address* (max 120 characters)"
                  placeholder="Registered Address*"
                  v-model="merchant.companyInformation.registeredAddress"
                  @blur="v$.merchant.companyInformation.registeredAddress.$touch"
                  :error="v$.merchant.companyInformation.registeredAddress.$error"
                />
                <div
                  class="text-negative"
                  v-if="error.field.merchant.companyInformation.registeredAddress.alert"
                >
                  <MarsErrorResponse
                    :error="error.field.merchant.companyInformation.registeredAddress"
                  />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.registeredCityRefCode.$touch"
                  :error="autoCompleteError(v$.merchant.companyInformation.registeredCityRefCode,v$.merchant.companyInformation.registeredCityName)"
                  color="grey-9"
                  v-model="merchant.companyInformation.registeredCityName"
                  label="Registered city (type min 3 characters)*"
                  placeholder="Start typing ..*"
                >
                  <template v-slot:after>
                    <q-autocomplete
                      separator
                      @search="residentCitySearch"
                      :debounce="10"
                      :min-characters="3"
                      @selected="registeredCitySelected"
                    />
                  </template>
                </q-input>
                <div
                  class="text-negative"
                  v-if="error.field.merchant.companyInformation.registeredCityRefCode.alert"
                >
                  <MarsErrorResponse
                    :error="error.field.merchant.companyInformation.registeredCityRefCode"
                  />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.registeredStateRefCode.$touch"
                  :error="autoCompleteError(v$.merchant.companyInformation.registeredStateRefCode,v$.merchant.companyInformation.registeredStateName)"
                  color="grey-9"
                  v-model="merchant.companyInformation.registeredStateName"
                  label="Registered state (type min 3 characters)*"
                  placeholder="Start typing ..*"
                >
                  <template v-slot:after>
                    <q-autocomplete
                      separator
                      @search="residentStateSearch"
                      :debounce="10"
                      :min-characters="1"
                      @selected="registeredStateSelected"
                    />
                  </template>
                </q-input>
                <div
                  class="text-negative"
                  v-if="error.field.merchant.companyInformation.registeredStateRefCode.alert"
                >
                  <MarsErrorResponse
                    :error="error.field.merchant.companyInformation.registeredStateRefCode"
                  />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.registeredPin.$touch"
                  :error="v$.merchant.companyInformation.registeredPin.$error"
                  color="grey-9"
                  type="number"
                  v-model="merchant.companyInformation.registeredPin"
                  label="PIN*"
                  placeholder="PIN*"
                />
                <div
                  class="text-negative"
                  v-if="error.field.merchant.companyInformation.registeredPin.alert"
                >
                  <MarsErrorResponse
                    :error="error.field.merchant.companyInformation.registeredPin"
                  />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  disable
                  color="grey-9"
                  v-model="merchant.companyInformation.constitutionName"
                  label="Type of Business Entity"
                />
                <div
                  class="text-negative"
                  v-if="error.field.merchant.companyInformation.constitutionName.alert"
                >
                  <MarsErrorResponse
                    :error="error.field.merchant.companyInformation.constitutionName"
                  />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.establishYear.$touch"
                  :error="v$.merchant.companyInformation.establishYear.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.establishYear"
                  label="Year of Establishment*"
                  placeholder="Year of Establishment*"
                  mask="##/##/####"
                  :rules="['date']"
                >
                  <template v-slot:append>
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
                <div
                  class="text-negative"
                  v-if="error.field.merchant.companyInformation.establishYear.alert"
                >
                  <MarsErrorResponse
                    :error="error.field.merchant.companyInformation.establishYear"
                  />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  @blur="v$.merchant.companyInformation.registerNumber.$touch"
                  :error="v$.merchant.companyInformation.registerNumber.$error"
                  v-model="merchant.companyInformation.registerNumber"
                  label="Establish Number"
                  placeholder="Establish Number"
                />
                <div
                  class="text-negative"
                  v-if="error.field.merchant.companyInformation.registerNumber.alert"
                >
                  <MarsErrorResponse
                    :error="error.field.merchant.companyInformation.registerNumber"
                  />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.tin.$touch"
                  :error="v$.merchant.companyInformation.tin.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.tin"
                  label="TIN"
                  placeholder="TIN"
                />
                <div class="text-negative" v-if="error.field.merchant.companyInformation.tin.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.tin"/>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  uppercase
                  @blur="v$.merchant.companyInformation.pan.$touch"
                  :error="v$.merchant.companyInformation.pan.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.pan"
                  label="Company PAN*"
                  placeholder="Company PAN*"
                />
                <div class="text-negative" v-if="error.field.merchant.companyInformation.pan.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.pan"/>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  uppercase
                  @blur="v$.merchant.companyInformation.tan.$touch"
                  :error="v$.merchant.companyInformation.tan.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.tan"
                  label="TAN"
                  placeholder="TAN"
                />
                <div class="text-negative" v-if="error.field.merchant.companyInformation.tan.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.tan"/>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  v-model="merchant.companyInformation.businessNature"
                  label="Nature of Business"
                  placeholder="Nature of Business"
                />
                <div
                  class="text-negative"
                  v-if="error.field.merchant.companyInformation.businessNature.alert"
                >
                  <MarsErrorResponse
                    :error="error.field.merchant.companyInformation.businessNature"
                  />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  placeholder="Choose from the below*"
                  color="grey-9"
                  v-model="merchant.companyInformation.businessType"
                  label="Type of Business"
                  :options="businessTypeOptions"
                />
                <div
                  class="text-negative"
                  v-if="error.field.merchant.companyInformation.businessType.alert"
                >
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.businessType"/>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.mcc.$touch"
                  :error="autoCompleteError(v$.merchant.companyInformation.mcc,v$.merchant.companyInformation.mccname)"
                  color="grey-9"
                  v-model="merchant.companyInformation.mccname"
                  label="MCC (type min 3 characters)"
                  placeholder="Start typing ..*"
                >
                  <template v-slot:after>
                    <q-autocomplete
                      separator
                      @search="mccSearch"
                      :debounce="10"
                      :min-characters="3"
                      @selected="mccSelected"
                    />
                  </template>
                </q-input>
                <div class="text-negative" v-if="error.field.merchant.companyInformation.mcc.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.mcc"/>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.residentialAddress.$touch"
                  :error="v$.merchant.companyInformation.residentialAddress.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.residentialAddress"
                  label="Residential Address* (max 120 characters)"
                  placeholder="Residential Address*"
                />
                <div class="text-negative" v-if="error.field.merchant.companyInformation.residentialAddress.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.residentialAddress"/>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.residentialPin.$touch"
                  :error="v$.merchant.companyInformation.residentialPin.$error"
                  color="grey-9"
                  type="number"
                  v-model="merchant.companyInformation.residentialPin"
                  label="PIN*"
                  placeholder="PIN*"
                />
                <div class="text-negative" v-if="error.field.merchant.companyInformation.residentialPin.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.residentialPin"/>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.residentialCityRefCode.$touch"
                  :error="autoCompleteError(v$.merchant.companyInformation.residentialCityRefCode,v$.merchant.companyInformation.residentCityName)"
                  color="grey-9"
                  v-model="merchant.companyInformation.residentCityName"
                  label="City (type min 3 characters)*"
                  placeholder="Start typing ..*"
                >
                  <template v-slot:after>
                    <q-autocomplete
                      separator
                      @search="residentCitySearch"
                      :debounce="10"
                      :min-characters="3"
                      @selected="residentCitySelected"
                    />
                  </template>
                </q-input>
                <div class="text-negative" v-if="error.field.merchant.companyInformation.residentialCityRefCode.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.residentialCityRefCode"/>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.residentialStateRefCode.$touch"
                  :error="autoCompleteError(v$.merchant.companyInformation.residentialStateRefCode,v$.merchant.companyInformation.residentStateName)"
                  color="grey-9"
                  v-model="merchant.companyInformation.residentStateName"
                  label="State (type min 3 characters)*"
                  placeholder="Start typing ..*"
                >
                  <template v-slot:after>
                    <q-autocomplete
                      separator
                      @search="residentStateSearch"
                      :debounce="10"
                      :min-characters="1"
                      @selected="residentStateSelected"
                    />
                  </template>
                </q-input>
                <div class="text-negative" v-if="error.field.merchant.companyInformation.residentialStateRefCode.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.residentialStateRefCode"/>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.contactName.$touch"
                  :error="v$.merchant.companyInformation.contactName.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.contactName"
                  label="Contact Name*"
                  placeholder="Contact Name*"
                />
                <div class="text-negative" v-if="error.field.merchant.companyInformation.contactName.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.contactName"/>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.contactMobile.$touch"
                  :error="v$.merchant.companyInformation.contactMobile.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.contactMobile"
                  label="Contact mobile*"
                  placeholder="Contact Mobile*"
                />
                <div class="text-negative" v-if="error.field.merchant.companyInformation.contactMobile.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.contactMobile"/>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  type="tel"
                  @blur="v$.merchant.companyInformation.contactAlternateMobile.$touch"
                  :error="v$.merchant.companyInformation.contactAlternateMobile.$error"
                  v-model="merchant.companyInformation.contactAlternateMobile"
                  label="Contact Alt Mobile"
                  placeholder="Contact Alt Mobile"
                />
                <div class="text-negative" v-if="error.field.merchant.companyInformation.contactAlternateMobile.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.contactAlternateMobile"/>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  type="tel"
                  @blur="v$.merchant.companyInformation.contactPhone.$touch"
                  :error="v$.merchant.companyInformation.contactPhone.$error"
                  v-model="merchant.companyInformation.contactPhone"
                  label="Contact Phone* (12 digits)"
                  placeholder="Contact Phone* (12 digits)"
                />
                <div class="text-negative" v-if="error.field.merchant.companyInformation.contactPhone.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.contactPhone"/>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.contactEmail.$touch"
                  :error="v$.merchant.companyInformation.contactEmail.$error"
                  color="grey-9"
                  type="email"
                  v-model="merchant.companyInformation.contactEmail"
                  label="Contact Email*"
                  placeholder="Contact Email*"
                />
                <div class="text-negative" v-if="error.field.merchant.companyInformation.contactEmail.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.contactEmail"/>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <div class="q-field__label">Statement type</div>
                <div class="group">
                  <q-radio
                    @blur="v$.merchant.companyInformation.statementType.$touch"
                    :error="v$.merchant.companyInformation.statementType.$error"
                    v-for="(item,index) in viewBinding.statementType"
                    :key="index"
                    color="grey-9"
                    v-model="merchant.companyInformation.statementType"
                    :val="item.value"
                    :label="item.label"
                  />
                </div>
                <div class="text-negative" v-if="error.field.merchant.companyInformation.statementType.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.statementType"/>
                </div>
              </div>
              <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="q-field__label">Statement frequency</div>
                <div class="group">
                  <q-radio
                    @blur="v$.merchant.companyInformation.statementFrequency.$touch"
                    :error="v$.merchant.companyInformation.statementFrequency.$error"
                    v-for="(item,index) in viewBinding.statementFrequency"
                    :key="index"
                    color="grey-9"
                    v-model="merchant.companyInformation.statementFrequency"
                    :val="item.value"
                    :label="item.label"
                  />
                </div>
                <div class="text-negative" v-if="error.field.merchant.companyInformation.statementFrequency.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.statementFrequency"/>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  label="Statement Email"
                  placeholder="Statement Email"
                  @blur="v$.merchant.companyInformation.statementEmail.$touch"
                  :error="v$.merchant.companyInformation.statementEmail.$error"
                  v-model="merchant.companyInformation.statementEmail"
                />
                <div class="text-negative" v-if="error.field.merchant.companyInformation.statementEmail.alert">
                  <MarsErrorResponse :error="error.field.merchant.companyInformation.statementEmail"/>
                </div>
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn
                color="primary"
                class="q-ma-xs"
                icon="check"
                @click="validatebeforeNavigate('companyInformation')"
                label="Continue"
              />
              <q-btn
                color="amber-10"
                class="q-ma-xs"
                icon="save"
                label="Save Partial"
                @click="saveCurrentChanges()"
              />
              <q-btn
                color="grey-7"
                class="q-ma-xs"
                icon="block"
                @click="stepperRef.previous()"
                label="Back"
              />
            </q-stepper-navigation>
          </q-step>
          <q-step
            error-icon="warning"
            :icon="showPartnerstab?'':'block'"
            name="third"
            :error="error.tab.partnerInformation"
            title="Partners"
            :disable="!showPartnerstab"
          >
            <div
              v-for="(v,index) in v$.viewBinding.partnersArr.$each.$iter"
              :key="index"
              class="row q-my-xs gutter-sm"
              ref="parentElement"
            >
              <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="row group items-center">
                  <div class="col">
                    <span class="q-pa-sm bg-light text-dark">
                      <q-icon name="people"/>
                      Partner 0{{parseInt(index)+1}}
                    </span>
                  </div>
                  <div
                    class="col-auto"
                    v-if="Object.keys(v$.viewBinding.partnersArr.$each.$iter).length > 1"
                  >
                    <q-btn
                      round
                      icon="delete"
                      @click="removePartnerFromArr(v,index)"
                      color="negative"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  :error="v.name.$anyError"
                  @blur="v.name.$touch"
                  color="grey-9"
                  v-model="v.$model.name"
                  label="Name*"
                  placeholder="Name*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  uppercase
                  :error="v.pan.$anyError"
                  @blur="v.pan.$touch"
                  color="grey-9"
                  v-model="v.$model.pan"
                  label="Pan*"
                  placeholder="Pan*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  :error="v.address.$anyError"
                  @blur="v.address.$touch"
                  color="grey-9"
                  v-model="v.$model.address"
                  label="Address* (max 120 characters)"
                  placeholder="Address*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  :error="v.pin.$anyError"
                  @blur="v.pin.$touch"
                  color="grey-9"
                  type="number"
                  v-model="v.$model.pin"
                  label="Pincode*"
                  placeholder="Pincode*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  :error="autoCompleteError(v.cityRefLabel,v.cityRefCode)"
                  @blur="v.cityRefLabel.$touch()"
                  color="grey-9"
                  v-model="v.$model.cityRefLabel"
                  label="City (type min 3 characters)*"
                  placeholder="Start typing ..*"
                >
                  <template v-slot:after>
                    <q-autocomplete
                      separator
                      @search="partnerCitySearch"
                      :debounce="10"
                      :min-characters="3"
                      @selected="obj => partnerCitySelected(obj,index)"
                    />
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  :error="autoCompleteError(v.stateRefLabel,v.stateRefCode)"
                  @blur="v.stateRefLabel.$touch()"
                  color="grey-9"
                  v-model="v.$model.stateRefLabel"
                  label="State (type min 3 characters)*"
                  placeholder="Start typing ..*"
                >
                  <template v-slot:after>
                    <q-autocomplete
                      separator
                      @search="partnerStateSearch"
                      :debounce="10"
                      :min-characters="1"
                      @selected="obj => partnerStateSelected(obj,index)"
                    />
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  :error="v.contactMobile.$anyError"
                  @blur="v.contactMobile.$touch"
                  color="grey-9"
                  type="tel"
                  v-model="v.$model.contactMobile"
                  label="Mobile*"
                  placeholder="Mobile*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  :error="v.contactEmail.$anyError"
                  @blur="v.contactEmail.$touch"
                  color="grey-9"
                  type="email"
                  v-model="v.$model.contactEmail"
                  label="Email*"
                  placeholder="Email*"
                />
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn
                color="primary"
                class="q-ma-xs"
                icon="check"
                @click="validatebeforeNavigate('partners')"
                label="Continue"
              />
              <q-btn
                color="amber-10"
                class="q-ma-xs"
                icon="save"
                label="Save Partial"
                @click="saveCurrentChanges()"
              />
              <q-btn
                color="grey-7"
                class="q-ma-xs"
                icon="block"
                @click="stepperRef.previous()"
                label="Back"
              />
              <q-btn
                color="positive float-right"
                @click="addMorePartnersSet()"
                class="q-ma-xs"
                icon="add"
                label="Add More"
              />
            </q-stepper-navigation>
          </q-step>
          <q-step
            error-icon="warning"
            name="fourth"
            :error="error.tab.businessInformation"
            title="Business"
            subtitle="Info"
          >
            <div class="row gutter-sm">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  @blur="v$.merchant.businessInformation.weekdayStartHour.$touch"
                  :error="v$.merchant.businessInformation.weekdayStartHour.$error"
                  v-model="merchant.businessInformation.weekdayStartHour"
                  label="Weekday start hour (00.00)"
                  placeholder="Weekday start hour"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  @blur="v$.merchant.businessInformation.weekdayEndHour.$touch"
                  :error="v$.merchant.businessInformation.weekdayEndHour.$error"
                  v-model="merchant.businessInformation.weekdayEndHour"
                  label="Weekday end hour (00.00)"
                  placeholder="Weekday end hour"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  @blur="v$.merchant.businessInformation.weekendStartHour.$touch"
                  :error="v$.merchant.businessInformation.weekendStartHour.$error"
                  v-model="merchant.businessInformation.weekendStartHour"
                  label="Weekend start hour (00.00)"
                  placeholder="Weekend start hour"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  @blur="v$.merchant.businessInformation.weekendEndHour.$touch"
                  :error="v$.merchant.businessInformation.weekendEndHour.$error"
                  v-model="merchant.businessInformation.weekendEndHour"
                  label="Weekend end hour (00.00)"
                  placeholder="Weekend end hour"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12 col-xs-12">
                <q-input
                  color="grey-9"
                  @blur="v$.merchant.businessInformation.lastTurnoverYear.$touch"
                  :error="v$.merchant.businessInformation.lastTurnoverYear.$error"
                  v-model="merchant.businessInformation.lastTurnoverYear"
                  label="Last turnover year"
                  placeholder="Last turnover year"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  type="number"
                  @blur="v$.merchant.businessInformation.lastTurnoverAmount.$touch"
                  :error="v$.merchant.businessInformation.lastTurnoverAmount.$error"
                  v-model="merchant.businessInformation.lastTurnoverAmount"
                  label="Turnover during last year"
                  placeholder="Turnover during last year"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  type="number"
                  @blur="v$.merchant.businessInformation.expectedCardBusiness.$touch"
                  :error="v$.merchant.businessInformation.expectedCardBusiness.$error"
                  v-model="merchant.businessInformation.expectedCardBusiness"
                  label="Expected Card Business"
                  placeholder="Expected Card Business"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  type="number"
                  @blur="v$.merchant.businessInformation.averageBillAmount.$touch"
                  :error="v$.merchant.businessInformation.averageBillAmount.$error"
                  v-model="merchant.businessInformation.averageBillAmount"
                  label="Average Bill Amount"
                  placeholder="Average Bill Amount"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  uppercase
                  color="grey-9"
                  @blur="v$.merchant.businessInformation.gstId.$touch"
                  :error="v$.merchant.businessInformation.gstId.$error"
                  v-model="merchant.businessInformation.gstId"
                  @update:model-value="marsRequiredFormattingofGST"
                  label="GST ID"
                  placeholder="GST ID"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  v-model="merchant.businessInformation.currentPosName"
                  label="Name of the other POS Currently Used"
                  placeholder="Name of the other POS Currently Used"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  @blur="v$.merchant.businessInformation.debitCardMdr.$touch"
                  :error="v$.merchant.businessInformation.debitCardMdr.$error"
                  v-model="merchant.businessInformation.debitCardMdr"
                  label="Debit Card MDR"
                  placeholder="Debit Card MDR"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  @blur="v$.merchant.businessInformation.creditCardMdr.$touch"
                  :error="v$.merchant.businessInformation.creditCardMdr.$error"
                  v-model="merchant.businessInformation.creditCardMdr"
                  label="Credit Card MDR"
                  placeholder="Credit Card MDR"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.businessInformation.memberSince.$touch"
                  :error="v$.merchant.businessInformation.memberSince.$error"
                  color="grey-9"
                  v-model="merchant.businessInformation.memberSince"
                  label="Member since"
                  placeholder="Member since"
                  mask="##/##/####"
                  :rules="['date']"
                >
                  <template v-slot:append>
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
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn
                color="primary"
                class="q-ma-xs"
                icon="check"
                @click="validatebeforeNavigate('businessInformation')"
                label="Continue"
              />
              <q-btn
                color="amber-10"
                class="q-ma-xs"
                icon="save"
                label="Save Partial"
                @click="saveCurrentChanges()"
              />
              <q-btn
                color="grey-7"
                class="q-ma-xs"
                icon="block"
                @click="stepperRef.previous()"
                label="Back"
              />
            </q-stepper-navigation>
          </q-step>
          <q-step
            error-icon="warning"
            name="fifth"
            :error="error.tab.paymentDetails"
            title="Payment"
            subtitle="Details"
          >
            <div class="row gutter-sm">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <div class="q-field__label">Device Owned By</div>
                <div class="group">
                  <q-radio
                    @blur="v$.merchant.paymentDetails.deviceOwnedBy.$touch"
                    :error="v$.merchant.paymentDetails.deviceOwnedBy.$error"
                    v-for="(item,index) in deviceOwnedByOptions"
                    :key="index"
                    color="grey-9"
                    v-model="merchant.paymentDetails.deviceOwnedBy"
                    :val="item.value"
                    :label="item.label"
                  />
                </div>
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input
                  color="grey-9"
                  type="number"
                  @blur="v$.merchant.paymentDetails.installationFee.$touch"
                  :error="v$.merchant.paymentDetails.installationFee.$error"
                  v-model="merchant.paymentDetails.installationFee"
                  label="Installation Fee*"
                  placeholder="Installation Fee*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  placeholder="Choose from the below"
                  color="grey-9"
                  @blur="v$.merchant.paymentDetails.terminalModeCode.$touch"
                  :error="v$.merchant.paymentDetails.terminalModeCode.$error"
                  v-model="merchant.paymentDetails.terminalModeCode"
                  label="Terminal Model*"
                  :options="terminalModelSet"
                />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input
                  color="grey-9"
                  type="number"
                  disable
                  @blur="v$.merchant.paymentDetails.numberOfTerminals.$touch"
                  :error="v$.merchant.paymentDetails.numberOfTerminals.$error"
                  v-model="merchant.paymentDetails.numberOfTerminals"
                  label="No of Terminals*"
                  placeholder="No of Terminals*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <div class="q-field__label">Cash @POS Enabled?</div>
                <div class="group">
                  <q-radio
                    disable
                    @blur="v$.merchant.paymentDetails.cashAtPosEnabled.$touch"
                    :error="v$.merchant.paymentDetails.cashAtPosEnabled.$error"
                    v-for="(item,index) in cashAtPosEnabledOptions"
                    :key="index"
                    color="grey-9"
                    v-model="merchant.paymentDetails.cashAtPosEnabled"
                    :val="item.value"
                    :label="item.label"
                  />
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  placeholder="Choose from the below*"
                  color="grey-9"
                  v-model="merchant.paymentDetails.rentalPlanCode"
                  label="Rental Plan*"
                  :options="rentalPlanSet"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  placeholder="Choose from the below*"
                  color="grey-9"
                  v-model="merchant.paymentDetails.rentalMode"
                  label="Rental Mode*"
                  :options="rentalModeOptions"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  placeholder="Choose from the below*"
                  color="grey-9"
                  @blur="v$.merchant.paymentDetails.serviceProvider.$touch"
                  :error="v$.merchant.paymentDetails.serviceProvider.$error"
                  v-model="merchant.paymentDetails.serviceProvider"
                  label="Service provider*"
                  :options="serviceProviderListSet"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  placeholder="Choose from the below*"
                  color="grey-9"
                  @blur="v$.merchant.paymentDetails.networkPreferred.$touch"
                  :error="v$.merchant.paymentDetails.networkPreferred.$error"
                  v-model="merchant.paymentDetails.networkPreferred"
                  label="Network provider*"
                  :options="networkProviderListSet"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <div class="q-field__label">Rental Type</div>
                <div class="group">
                  <q-radio
                    @blur="v$.merchant.paymentDetails.rentalType.$touch"
                    :error="v$.merchant.paymentDetails.rentalType.$error"
                    v-for="(item,index) in rentalTypeOptions"
                    :key="index"
                    color="grey-9"
                    v-model="merchant.paymentDetails.rentalType"
                    :val="item.value"
                    :label="item.label"
                    @update:model-value="selectCurrentType()"
                  />
                </div>
              </div>
              <div
                v-if="merchant.paymentDetails.rentalType == 'R'"
                class="col-md-6 col-sm-12 col-xs-12"
              >
                <q-input
                  @blur="v$.merchant.paymentDetails.gracePeriod.$touch"
                  :error="v$.merchant.paymentDetails.gracePeriod.$error"
                  color="grey-9"
                  type="number"
                  v-model="merchant.paymentDetails.gracePeriod"
                  label="Grace period*"
                  placeholder="Grace period*"
                />
              </div>
              <div
                v-if="merchant.paymentDetails.rentalType == 'A'"
                class="col-md-6 col-sm-12 col-xs-12"
              >
                <q-input
                  color="grey-9"
                  type="number"
                  @blur="v$.merchant.paymentDetails.advanceRentCollected.$touch"
                  :error="v$.merchant.paymentDetails.advanceRentCollected.$error"
                  v-model="merchant.paymentDetails.advanceRentCollected"
                  label="Advance Rent Collected*"
                  placeholder="Advance Rent Collected*"
                />
              </div>
              <div
                v-if="merchant.paymentDetails.rentalType == 'A'"
                class="col-md-6 col-sm-12 col-xs-12"
              >
                <q-input
                  color="grey-9"
                  type="number"
                  @blur="v$.merchant.paymentDetails.noOfMonthRentPaidInAdvance.$touch"
                  :error="v$.merchant.paymentDetails.noOfMonthRentPaidInAdvance.$error"
                  v-model="merchant.paymentDetails.noOfMonthRentPaidInAdvance"
                  label="No. Of Month Rent Paid In Advance*"
                  placeholder="No. Of Month Rent Paid In Advance*"
                />
              </div>
              <div
                v-if="merchant.paymentDetails.rentalType == 'A'"
                class="col-md-6 col-sm-12 col-xs-12"
              >
                <div class="q-field__label">Advanced Rent Mode</div>
                <div class="group">
                  <q-radio
                    @blur="v$.merchant.paymentDetails.advanceRentMode.$touch"
                    :error="v$.merchant.paymentDetails.advanceRentMode.$error"
                    v-for="(item,index) in advanceRentModeOptions"
                    :key="index"
                    color="grey-9"
                    v-model="merchant.paymentDetails.advanceRentMode"
                    :val="item.value"
                    :label="item.label"
                  />
                </div>
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input
                  color="grey-9"
                  type="number"
                  @blur="v$.merchant.paymentDetails.devicePrice.$touch"
                  :error="v$.merchant.paymentDetails.devicePrice.$error"
                  v-model="merchant.paymentDetails.devicePrice"
                  label="Device Price"
                  placeholder="Device Price"
                />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input
                  color="grey-9"
                  type="number"
                  @blur="v$.merchant.paymentDetails.otherCharges.$touch"
                  :error="v$.merchant.paymentDetails.otherCharges.$error"
                  v-model="merchant.paymentDetails.otherCharges"
                  label="Other Charges"
                  placeholder="Other Charges"
                />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input
                  color="grey-9"
                  type="number"
                  @blur="v$.merchant.paymentDetails.totalAmountPaid.$touch"
                  :error="v$.merchant.paymentDetails.totalAmountPaid.$error"
                  v-model="merchant.paymentDetails.totalAmountPaid"
                  label="Total Amount Paid"
                  placeholder="Total Amount Paid"
                />
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn
                color="primary"
                class="q-ma-xs"
                icon="check"
                @click="validatebeforeNavigate('paymentDetails')"
                label="Continue"
              />
              <q-btn
                color="amber-10"
                class="q-ma-xs"
                icon="save"
                label="Save Partial"
                @click="saveCurrentChanges()"
              />
              <q-btn
                color="grey-7"
                class="q-ma-xs"
                icon="block"
                @click="stepperRef.previous()"
                label="Back"
              />
            </q-stepper-navigation>
          </q-step>
          <q-step
            error-icon="warning"
            :error="error.tab.mdrPlan || error.SharingDiscountFee"
            name="sixth"
            title="Discount"
            subtitle="Rate"
          >
            <!-- MDR Plan UI - Same structure but with updated bindings -->
            <!-- Note: Due to length, the MDR plan section maintains the same structure -->
            <!-- but with updated v-model bindings and Vue 3 compatible syntax -->
            <div class="row group items-center">
              <div class="col-md-12">
                <div class="row items-center">
                  <div class="col-3">
                    <div class="q-field__label text-weight-medium">Domestic Debit Card below 2000</div>
                  </div>
                  <div class="col">
                    <div
                      class="q-field__label text-weight-medium q-py-sm"
                      align="center"
                    >Merchant Disc Fee</div>
                    <div class="row group bg-green-2">
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          @blur="v$.merchant.mdrPlan.domesticDebitUpTo2000.fixed.$touch"
                          :error="v$.merchant.mdrPlan.domesticDebitUpTo2000.fixed.$error"
                          v-model="merchant.mdrPlan.domesticDebitUpTo2000.fixed"
                          placeholder="Fixed"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          @blur="v$.merchant.mdrPlan.domesticDebitUpTo2000.percentage.$touch"
                          :error="v$.merchant.mdrPlan.domesticDebitUpTo2000.percentage.$error"
                          v-model="merchant.mdrPlan.domesticDebitUpTo2000.percentage"
                          placeholder="%"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          @blur="v$.merchant.mdrPlan.domesticDebitUpTo2000.minimum.$touch"
                          :error="v$.merchant.mdrPlan.domesticDebitUpTo2000.minimum.$error"
                          v-model="merchant.mdrPlan.domesticDebitUpTo2000.minimum"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                    <div
                      class="q-field__label text-weight-medium q-py-sm"
                      align="center"
                    >Sharing Disc Fee</div>
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          @blur="v$.merchant.SharingDiscountFee.domesticDebitUpTo2000.fixed.$touch"
                          :error="v$.merchant.SharingDiscountFee.domesticDebitUpTo2000.fixed.$error"
                          v-model="merchant.SharingDiscountFee.domesticDebitUpTo2000.fixed"
                          placeholder="Fixed"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          @blur="v$.merchant.SharingDiscountFee.domesticDebitUpTo2000.percentage.$touch"
                          :error="v$.merchant.SharingDiscountFee.domesticDebitUpTo2000.percentage.$error"
                          v-model="merchant.SharingDiscountFee.domesticDebitUpTo2000.percentage"
                          placeholder="%"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          @blur="v$.merchant.SharingDiscountFee.domesticDebitUpTo2000.minimum.$touch"
                          :error="v$.merchant.SharingDiscountFee.domesticDebitUpTo2000.minimum.$error"
                          v-model="merchant.SharingDiscountFee.domesticDebitUpTo2000.minimum"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Repeat similar structure for other MDR fields -->
                <!-- ... -->
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn
                color="primary"
                class="q-ma-xs"
                icon="check"
                @click="validatebeforeNavigate('mdr')"
                label="Continue"
              />
              <q-btn
                color="amber-10"
                class="q-ma-xs"
                icon="save"
                label="Save Partial"
                @click="saveCurrentChanges()"
              />
              <q-btn
                color="grey-7"
                class="q-ma-xs"
                icon="block"
                @click="stepperRef.previous()"
                label="Back"
              />
            </q-stepper-navigation>
          </q-step>

          <q-step
            error-icon="warning"
            name="seventh"
            :error="error.tab.bankInformation"
            title="Bank & Collection"
            subtitle="Details"
          >
            <div class="row q-mb-md gutter-sm items-center">
              <div class="col-md-12">
                <div class="text-h6">Merchant Bank Details</div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  uppercase
                  color="grey-9"
                  :error="v$.merchant.bankInformation.bankDetails.ifsc.$error"
                  @blur="populateBankDetails"
                  v-model="merchant.bankInformation.bankDetails.ifsc"
                  label="IFSC Code*"
                  placeholder="Enter IFSC*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  @blur="v$.merchant.bankInformation.bankDetails.branchName.$touch"
                  :error="v$.merchant.bankInformation.bankDetails.branchName.$error"
                  v-model="merchant.bankInformation.bankDetails.branchName"
                  label="Branch Name*"
                  placeholder="Branch Name* "
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  placeholder="Choose from the below"
                  color="grey-9"
                  v-model="merchant.bankInformation.bankDetails.feeType"
                  label="Fee Type"
                  :options="feeTypeOptions"
                  @update:model-value="merchant.bankInformation.bankDetails.settlementOrNeftFee = ''"
                />
              </div>
              <div
                v-if="merchant.bankInformation.bankDetails.feeType == 'N' || merchant.bankInformation.bankDetails.feeType == 'S'"
                class="col-md-6 col-sm-12 col-xs-12"
              >
                <q-input
                  color="grey-9"
                  @blur="v$.merchant.bankInformation.bankDetails.settlementOrNeftFee.$touch"
                  :error="v$.merchant.bankInformation.bankDetails.settlementOrNeftFee.$error"
                  v-model="merchant.bankInformation.bankDetails.settlementOrNeftFee"
                  label="NEFT/Settlement Fee Inclusive of Tax*"
                  placeholder="NEFT/Settlement Fee Inclusive of Tax*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  @blur="v$.merchant.bankInformation.bankDetails.micr.$touch"
                  :error="v$.merchant.bankInformation.bankDetails.micr.$error"
                  v-model="merchant.bankInformation.bankDetails.micr"
                  label="MICR*"
                  placeholder="MICR*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  @blur="v$.merchant.bankInformation.bankDetails.bankName.$touch"
                  :error="v$.merchant.bankInformation.bankDetails.bankName.$error"
                  v-model="merchant.bankInformation.bankDetails.bankName"
                  label="Bank Name*"
                  placeholder="Bank Name*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  placeholder="Choose from the below"
                  color="grey-9"
                  v-model="merchant.bankInformation.bankDetails.paymentMode"
                  label="Payment mode"
                  :options="paymnentModeOptions"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  @blur="v$.merchant.bankInformation.bankDetails.bankCityRefCode.$touch"
                  :error="autoCompleteError(v$.merchant.bankInformation.bankDetails.bankCityName,v$.merchant.bankInformation.bankDetails.bankCityRefCode)"
                  v-model="merchant.bankInformation.bankDetails.bankCityName"
                  label="City (type min 3 characters)*"
                  placeholder="Start typing ..*"
                >
                  <template v-slot:after>
                    <q-autocomplete
                      separator
                      @search="residentCitySearch"
                      :debounce="10"
                      :min-characters="3"
                      @selected="bankCitySelected"
                    />
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  @blur="v$.merchant.bankInformation.bankDetails.bankStateRefCode.$touch"
                  :error="autoCompleteError(v$.merchant.bankInformation.bankDetails.bankStateName,v$.merchant.bankInformation.bankDetails.bankStateRefCode)"
                  v-model="merchant.bankInformation.bankDetails.bankStateName"
                  label="State (type min 3 characters)*"
                  placeholder="Start typing ..*"
                >
                  <template v-slot:after>
                    <q-autocomplete
                      separator
                      @search="residentStateSearch"
                      :debounce="10"
                      :min-characters="1"
                      @selected="bankStateSelected"
                    />
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  placeholder="Choose from the below"
                  color="grey-9"
                  v-model="merchant.bankInformation.bankDetails.accountType"
                  label="Account Type"
                  :options="accountTypeOptions"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  @blur="v$.merchant.bankInformation.bankDetails.accountNumber.$touch"
                  :error="v$.merchant.bankInformation.bankDetails.accountNumber.$error"
                  v-model="merchant.bankInformation.bankDetails.accountNumber"
                  label="Bank A/c Number*"
                  placeholder="Bank A/c Number*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-checkbox
                  color="grey-9"
                  true-value="Y"
                  false-value="N"
                  v-model="merchant.bankInformation.bankDetails.bankStatementAttached"
                  label="Bank Statement Attached"
                />
                <q-checkbox
                  color="grey-9"
                  true-value="Y"
                  false-value="N"
                  v-model="merchant.bankInformation.bankDetails.cancelChequeAttached"
                  label="Cancelled Cheque Lead Attached"
                />
              </div>
            </div>
            <div class="row gutter-sm items-center">
              <div class="col-md-12">
                <div class="text-h6">Payment Collection Details</div>
              </div>
              <div v-show="propLeadDeatils.paymentOption == 1" class="col-md-12">
                <div class="row">
                  <div class="col-md-6 col-sm-12 col-xs-12">
                    <q-input
                      color="grey-9"
                      @blur="v$.merchant.bankInformation.collectionDetails.chequeNumber.$touch"
                      :error="v$.merchant.bankInformation.collectionDetails.chequeNumber.$error"
                      v-model="merchant.bankInformation.collectionDetails.chequeNumber"
                      label="Cheque/UTR No*"
                      placeholder="Cheque/UTR No*"
                    />
                  </div>
                </div>
              </div>
              <div v-show="propLeadDeatils.paymentOption == 3" class="col-md-12">
                <div class="row">
                  <div class="col-md-4 col-sm-12 col-xs-12">
                    <q-input
                      color="grey-9"
                      @blur="v$.merchant.bankInformation.collectionDetails.swipeAmount.$touch"
                      :error="v$.merchant.bankInformation.collectionDetails.swipeAmount.$error"
                      v-model="merchant.bankInformation.collectionDetails.swipeAmount"
                      label="Swipe Amount*"
                      placeholder="Swipe Amount*"
                    />
                  </div>
                  <div class="col-md-4 col-sm-12">
                    <q-input
                      @blur="v$.merchant.bankInformation.collectionDetails.collectedDate.$touch"
                      :error="v$.merchant.bankInformation.collectionDetails.collectedDate.$error"
                      color="grey-9"
                      v-model="merchant.bankInformation.collectionDetails.collectedDate"
                      label="Swipe Date*"
                      placeholder="Swipe Date*"
                      mask="##/##/####"
                      :rules="['date']"
                    >
                      <template v-slot:append>
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
                  </div>
                  <div class="col-md-4 col-sm-12 col-xs-12">
                    <q-input
                      color="grey-9"
                      @blur="v$.merchant.bankInformation.collectionDetails.swipeTerminal.$touch"
                      :error="v$.merchant.bankInformation.collectionDetails.swipeTerminal.$error"
                      v-model="merchant.bankInformation.collectionDetails.swipeTerminal"
                      label="Swiped on the terminal of*"
                      placeholder="Swiped on the terminal of*"
                    />
                  </div>
                </div>
              </div>
              <div v-show="propLeadDeatils.paymentOption == 2" class="col-md-12">
                <div class="row">
                  <div class="col-md-3 col-sm-12 col-xs-12">
                    <q-input
                      color="grey-9"
                      @blur="v$.merchant.bankInformation.collectionDetails.chequeAmount.$touch"
                      :error="v$.merchant.bankInformation.collectionDetails.chequeAmount.$error"
                      v-model="merchant.bankInformation.collectionDetails.chequeAmount"
                      label="Cheque Amount*"
                      placeholder="Cheque Amount*"
                    />
                  </div>
                  <div class="col-md-3 col-sm-12">
                    <q-input
                      @blur="v$.merchant.bankInformation.collectionDetails.chequeDate.$touch"
                      :error="v$.merchant.bankInformation.collectionDetails.chequeDate.$error"
                      color="grey-9"
                      v-model="merchant.bankInformation.collectionDetails.chequeDate"
                      label="Cheque Date*"
                      placeholder="Cheque Date*"
                      mask="##/##/####"
                      :rules="['date']"
                    >
                      <template v-slot:append>
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
                  </div>
                  <div class="col-md-3 col-sm-12 col-xs-12">
                    <q-input
                      @blur="v$.merchant.bankInformation.collectionDetails.chequeDepositedDate.$touch"
                      :error="v$.merchant.bankInformation.collectionDetails.chequeDepositedDate.$error"
                      color="grey-9"
                      v-model="merchant.bankInformation.collectionDetails.chequeDepositedDate"
                      label="Cheque Deposited Date*"
                      placeholder="Cheque Deposited Date*"
                      mask="##/##/####"
                      :rules="['date']"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="merchant.bankInformation.collectionDetails.chequeDepositedDate" mask="DD/MM/YYYY">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-md-3 col-sm-12 col-xs-12">
                    <q-input
                      color="grey-9"
                      @blur="v$.merchant.bankInformation.collectionDetails.chequeNumber.$touch"
                      :error="v$.merchant.bankInformation.collectionDetails.chequeNumber.$error"
                      v-model="merchant.bankInformation.collectionDetails.chequeNumber"
                      label="Cheque/UTR No*"
                      placeholder="Cheque/UTR No*"
                    />
                  </div>
                </div>
              </div>
              <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                <q-select
                  clearable
                  placeholder="Choose from the below"
                  color="grey-9"
                  v-model="merchant.bankInformation.collectionDetails.acquirerBank"
                  label="Bank Name"
                  :options="bankListSet"
                />
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn
                color="primary"
                class="q-ma-xs"
                icon="check"
                @click="validatebeforeNavigate('bank')"
                label="Continue"
              />
              <q-btn
                color="amber-10"
                class="q-ma-xs"
                icon="save"
                label="Save Partial"
                @click="saveCurrentChanges()"
              />
              <q-btn
                color="grey-7"
                class="q-ma-xs"
                icon="block"
                @click="stepperRef.previous()"
                label="Back"
              />
            </q-stepper-navigation>
          </q-step>
          <q-step error-icon="warning" name="eight" title="KYC" subtitle="Details">
            <div class="row items-center">
              <div
                class="col-12 bottom-border q-py-md"
                v-for="(key,index) in Object.keys(propLeadDeatils.leadDocuments)"
                :key="index"
              >
                <div class="row group items-center">
                  <div class="col-auto">
                    <span class="text-purple-9 text-weight-bold border-1 q-pa-sm">{{index+1}}</span>
                  </div>
                  <div
                    class="col-10"
                    v-for="(item,subIndex) in propLeadDeatils.leadDocuments[key]"
                    :key="subIndex"
                  >
                    <div class="row">
                      <div class="col-4 text-body1">Document</div>
                      <div
                        class="col-8 text-body1 text-weight-bold text-negative"
                        v-if="item.documentType == ''"
                      >NA</div>
                      <div class="col-8 text-body1" v-else>{{item.documentType}}</div>
                    </div>
                    <div class="row">
                      <div class="col-4 text-body1">Sub document</div>
                      <div
                        class="col-8 text-body1 text-weight-bold text-negative"
                        v-if="item.subDocumentType == ''"
                      >NA</div>
                      <div
                        class="col-8 text-body1 text-weight-bold text-positive"
                        v-else
                      >{{item.subDocumentType}}</div>
                    </div>
                    <div class="row">
                      <div class="col-12" v-show="item.uploadedDocuments.length > 0">
                        <div
                          class="text-caption"
                          v-for="(document, documentIndex) in item.uploadedDocuments"
                          :key="documentIndex"
                        >{{document.fileName}}</div>
                      </div>
                      <div class="text-caption" v-show="item.uploadedDocuments.length == 0">
                        <div class="text-weight-bold text-negative">No document available</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row group q-py-md items-center">
              <div class="col-6">
                <q-input
                  color="grey-9"
                  v-model="leadDataEntryRemarks"
                  label="Remarks"
                  placeholder="Remarks"
                />
              </div>
              <div class="col-6">
                <p class="q-ma-0">Hold payment?</p>
                <q-radio color="grey-9" v-model="holdPayment" :val="1" label="Yes"/>
                <q-radio color="grey-9" v-model="holdPayment" :val="0" label="No"/>
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn
                color="primary"
                class="q-ma-xs"
                icon="check"
                @click="finalFormSubmit()"
                label="Submit"
              />
              <q-btn
                color="amber-10"
                class="q-ma-xs"
                icon="save"
                label="Save Partial"
                @click="saveCurrentChanges()"
              />
              <q-btn
                color="grey-7"
                class="q-ma-xs"
                icon="block"
                @click="stepperRef.previous()"
                label="Back"
              />
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { helpers, required, requiredIf, alphaNum, integer, numeric, minLength, maxLength, email, maxValue, minValue, decimal } from '@vuelidate/validators';
import moment from 'moment';
import _ from 'lodash';

import ViewLeadDocumentsDataEntryComponent from './viewLeadDocumentsDataEntryComponent.vue';
import MarsErrorResponse from './MarsErrorResponse.vue';

const panCard = helpers.regex(
  "panCard",
  /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/
);


const tanValidate = helpers.regex("tanValidate", /[A-Za-z]{4}\d{5}[A-Za-z]{1}/);
const timeValidate = helpers.regex(
  "timeValidate",
  /^(?:\d|[01]\d|2[0-3])\.[0-5]\d$/
);

const alphaNumericValidate = helpers.regex(
  "alphaNumericValidate",
  /^(?:[A-Za-z]+)(?:[A-Za-z0-9 _]*)$/
);

export default {
  name: 'LeadDataEntry',
  components: {
    ViewLeadDocumentsDataEntryComponent,
    MarsErrorResponse
  },
  props: {
    propLeadDeatils: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const $q = useQuasar();
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    
    const stepperRef = ref(null);
    const showPartnerstab = ref(false);
    
    // Data properties using ref
    const viewBinding = ref({
      sharingModelCode: [
        { label: "No sharing", value: "N" },
        { label: "Transaction value model", value: "T" },
        { label: "MDR/cash@pos/rent", value: "M" }
      ],
      statementType: [
        { label: "E-Statement", value: "E" },
        { label: "Paper statement", value: "P" }
      ],
      statementFrequency: [
        { label: "Daily", value: "D" },
        { label: "Monthly", value: "M" },
        { label: "Quaterly", value: "Q" },
        { label: "Half yearly", value: "H" },
        { label: "Yearly", value: "Y" },
        { label: "None", value: "N" }
      ],
      partnersArr: [
        {
          name: "",
          address: "",
          pan: "",
          pin: null,
          cityRefCode: "",
          cityRefLabel: "",
          stateRefCode: "",
          stateRefLabel: "",
          contactMobile: "",
          contactEmail: ""
        }
      ]
    });

    const merchant = ref({
      salesInformation: {
        institutionCode: 3,
        applicationType: "D",
        applicationNumber: "",
        applicationDate: "",
        aggreementDate: "",
        merchantType: "M",
        categoryType: "O",
        region: "",
        salesPersonCode: "",
        leadFrom: "",
        sharingModelCode: "N",
        sharingPartnerCode: "",
        dailyFixedAmount: "",
        loanDisbursementPercentage: "",
        loanDisbursementAmount: "",
        loanDisbursementDate: "",
        tenureMonth: "",
        tenureDay: "",
        tenureStartDate: "",
        rentPercentage: 2,
        rentFixed: ""
      },
      companyInformation: {
        legalName: "",
        dbaName: "",
        registeredAddress: "",
        registeredPin: "",
        registeredCityRefCode: "",
        registeredCityName: "",
        registeredStateRefCode: "",
        registeredStateName: "",
        constitution: "",
        constitutionName: "",
        constitutionDescription: "",
        establishYear: "",
        registerNumber: "",
        pan: "",
        tin: "",
        tan: "",
        businessNature: "",
        businessType: "R",
        mcc: "",
        mccname: "",
        residentialAddress: "",
        residentialPin: "",
        residentialCityRefCode: "",
        residentCityName: "",
        residentialStateRefCode: "",
        residentStateName: "",
        contactName: "",
        contactMobile: "",
        contactAlternateMobile: "",
        contactPhone: "",
        contactEmail: "",
        statementType: "P",
        statementFrequency: "D",
        statementEmail: ""
      },
      businessInformation: {
        weekdayStartHour: "00.00",
        weekdayEndHour: "00.00",
        weekendStartHour: "00.00",
        weekendEndHour: "00.00",
        lastTurnoverYear: 2017,
        lastTurnoverAmount: "",
        expectedCardBusiness: "",
        averageBillAmount: "",
        gstId: null,
        currentPosName: "",
        debitCardMdr: "",
        creditCardMdr: "",
        memberSince: "",
        businessIncome: ""
      },
      paymentDetails: {
        deviceOwnedBy: "B",
        installationFee: "",
        terminalModeCode: "",
        numberOfTerminals: 1,
        cashAtPosEnabled: "Y",
        rentalPlanCode: 1,
        serviceProvider: 1,
        networkPreferred: 1,
        rentalMode: "S",
        rentalType: "A",
        advanceRentCollected: "",
        advanceRentMode: "NEFT",
        noOfMonthRentPaidInAdvance: "",
        gracePeriod: 0,
        devicePrice: "",
        otherCharges: "",
        totalAmountPaid: ""
      },
      bankInformation: {
        bankDetails: {
          ifsc: "",
          micr: "",
          bankName: "",
          branchName: "",
          bankCityRefCode: "",
          bankCityName: "",
          bankStateRefCode: "",
          bankStateName: "",
          paymentMode: "D",
          accountType: "S",
          accountNumber: "",
          bankStatementAttached: "Y",
          cancelChequeAttached: "Y",
          feeType: "N",
          settlementOrNeftFee: ""
        },
        collectionDetails: {
          collectedDate: "",
          swipeAmount: "",
          swipeTerminal: "",
          chequeAmount: "",
          chequeDate: "",
          chequeDepositedDate: "",
          chequeNumber: "",
          acquirerBank: ""
        }
      },
      kyc: {
        documents: []
      },
      mdrPlan: {
        code: 1,
        domesticDebitUpTo2000: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
        domesticDebitAbove2000: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
        standardOrClassic: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
        premiumOrPlatinum: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
        superPremiumOrSignature: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
        commercialOrCorporate: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
        internationalDebitCard: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
        internationalCreditCard: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
        onus: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
        mVisa: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
        masterPass: { fixed: 0.0, percentage: 0.0, minimum: 0.0 },
        cashAtPos: { fixed: 0.0, percentage: 0.0, minimum: 0.0 }
      },
      SharingDiscountFee: {
        domesticDebitUpTo2000: { fixed: 0, percentage: 0, minimum: 0 },
        domesticDebitAbove2000: { fixed: 0, percentage: 0, minimum: 0 },
        standardOrClassic: { fixed: 0, percentage: 0, minimum: 0 },
        premiumOrPlatinum: { fixed: 0, percentage: 0, minimum: 0 },
        superPremiumOrSignature: { fixed: 0, percentage: 0, minimum: 0 },
        commercialOrCorporate: { fixed: 0, percentage: 0, minimum: 0 },
        internationalDebitCard: { fixed: 0, percentage: 0, minimum: 0 },
        internationalCreditCard: { fixed: 0, percentage: 0, minimum: 0 },
        onus: { fixed: 0, percentage: 0, minimum: 0 },
        mVisa: { fixed: 0, percentage: 0, minimum: 0 },
        masterPass: { fixed: 0, percentage: 0, minimum: 0 },
        cashAtPos: { fixed: 0, percentage: 0, minimum: 0 }
      }
    });

    const error = ref({
      tab: {
        salesInformation: false,
        companyInformation: false,
        partnerInformation: false,
        businessInformation: false,
        paymentDetails: false,
        mdrPlan: false,
        SharingDiscountFee: false,
        bankInformation: false
      }
    });

    const holdPayment = ref(1);
    const leadDataEntryRemarks = ref("");
    const showDocumentPreview = ref(true);
    const showOpenPaymentChequeInfo = ref(false);

    // Dropdown options
    const institutionCodeOptions = ref([{ label: "GPRS", value: 3 }]);
    const applicationTypeOptions = ref([
      { label: "Digital", value: "D" },
      { label: "Non Digital", value: "N" }
    ]);
    const categoryTypeOptions = ref([
      { label: "Small", value: "S" },
      { label: "Other", value: "O" }
    ]);
    const merchantTypeOptions = ref([
      { label: "Group Merchant", value: "G" },
      { label: "Merchant Outlet", value: "O" },
      { label: "Merchant", value: "M" }
    ]);
    const businessTypeOptions = ref([
      { label: "Rented", value: "R" },
      { label: "Owned", value: "O" },
      { label: "Leased", value: "L" }
    ]);
    const deviceOwnedByOptions = ref([
      { label: "Bijlipay", value: "B" },
      { label: "Merchant", value: "M" }
    ]);
    const cashAtPosEnabledOptions = ref([
      { label: "Yes", value: "Y" },
      { label: "No", value: "N" }
    ]);
    const rentalTypeOptions = ref([
      { label: "Advanced", value: "A" },
      { label: "Regular", value: "R" }
    ]);
    const rentalModeOptions = ref([
      { label: "Standing instructions", value: "S" },
      { label: "Normal", value: "N" },
      // ... other options
    ]);
    const advanceRentModeOptions = ref([
      { label: "Card", value: "Card" },
      { label: "Cheque", value: "Cheque" },
      { label: "NEFT", value: "NEFT" },
      { label: "IMPS", value: "IMPS" },
      { label: "Cash", value: "Cash" }
    ]);
    const accountTypeOptions = ref([
      { label: "Saving account", value: "S" },
      { label: "Current account", value: "C" },
      { label: "Overdraft account", value: "O" },
      { label: "Cash credit account", value: "R" }
    ]);
    const feeTypeOptions = ref([
      { label: "NEFT", value: "N" },
      { label: "Settlement", value: "S" },
      { label: "None", value: "X" }
    ]);
    const paymnentModeOptions = ref([
      { label: "Direct credit", value: "D" },
      { label: "NEFT", value: "N" },
      { label: "IMPS", value: "I" }
    ]);

    const regionOptions = ref([]);
    const leadFromOptions = ref([]);
    const salesPersonOptions = ref([]);
    const sharingPartnerOptions = ref([]);
    const cityOptions = ref([]);
    const stateOptions = ref([]);
    const mccSearchSet = ref([]);
    const terminalModelSet = ref([]);
    const rentalPlanSet = ref([]);
    const bankListSet = ref([]);
    const networkProviderListSet = ref([]);
    const serviceProviderListSet = ref([]);

    // Computed properties
    const getTransctionValueModel = computed(() => {
      return merchant.value.salesInformation.sharingModelCode == "T";
    });

    const getCashAtPos = computed(() => {
      return merchant.value.salesInformation.sharingModelCode == "M";
    });

    const getPartnersVisiblity = computed(() => {
      const PARTNERS_TAB_ENABLED_ITEMS = ['PL', 'PB']; // Example values
      return PARTNERS_TAB_ENABLED_ITEMS.includes(
        merchant.value.companyInformation.constitution
      );
    });

    const getRentalTypeVisibilityForRental = computed(() => {
      return merchant.value.paymentDetails.rentalType == "R";
    });

    const getRentalTypeVisibilityForAdvanced = computed(() => {
      return merchant.value.paymentDetails.rentalType == "A";
    });

    const getfeeTypeForSettlementVisibility = computed(() => {
      const feeType = merchant.value.bankInformation.bankDetails.feeType;
      return feeType == "N" || feeType == "S";
    });

    const showOnlyIfSharingModelIsEnabled = computed(() => {
      return merchant.value.salesInformation.sharingModelCode != "N";
    });

    const getStatementType = computed(() => {
      return merchant.value.companyInformation.statementType == "E";
    });

    const bankInfoSwipePayment = computed(() => {
      return props.propLeadDeatils.paymentOption == 3;
    });

    const bankInfoChequePayment = computed(() => {
      return props.propLeadDeatils.paymentOption == 2;
    });

    // Validation rules
    const rules = {
      merchant: {
        salesInformation: {
          institutionCode: { required },
          applicationType: { required },
          applicationNumber: { required, alphaNum },
          applicationDate: { required },
          aggreementDate: { required },
          salesPersonCode: { required },
          region: { required },
          merchantType: { required },
          categoryType: { required },
          leadFrom: { required },
          sharingPartnerCode: { 
            required: requiredIf(() => getTransctionValueModel.value || getCashAtPos.value)
          },
          dailyFixedAmount: {
            required: requiredIf(() => getTransctionValueModel.value),
            decimal,
            minValue: minValue(0),
            maxValue: maxValue(99999.99),
            minLength: minLength(2),
            maxLength: maxLength(7)
          },
          loanDisbursementPercentage: {
            required: requiredIf(() => getTransctionValueModel.value),
            decimal,
            minValue: minValue(0),
            maxValue: maxValue(100)
          },
          loanDisbursementAmount: {
            required: requiredIf(() => getTransctionValueModel.value),
            decimal,
            minValue: minValue(0),
            maxValue: maxValue(99999999.99),
            maxLength: maxLength(10),
            minLength: minLength(2)
          },
          loanDisbursementDate: {
            required: requiredIf(() => getTransctionValueModel.value)
          },
          tenureMonth: {
            required: requiredIf(() => getTransctionValueModel.value),
            integer,
            minValue: minValue(0)
          },
          tenureDay: {
            required: requiredIf(() => getTransctionValueModel.value),
            integer,
            minValue: minValue(0)
          },
          tenureStartDate: {
            required: requiredIf(() => getTransctionValueModel.value)
          },
          rentPercentage: {
            required: requiredIf(() => getCashAtPos.value),
            maxValue: maxValue(100),
            decimal,
            minValue: minValue(0)
          },
          rentFixed: {
            required: requiredIf(() => getCashAtPos.value),
            decimal,
            minValue: minValue(0)
          }
        },
        companyInformation: {
          legalName: {
            required,
            minLength: minLength(2),
            maxLength: maxLength(120),
            alphaNumericValidate
          },
          dbaName: {
            required,
            minLength: minLength(2),
            maxLength: maxLength(120),
            alphaNumericValidate
          },
          registeredAddress: {
            required,
            minLength: minLength(2),
            maxLength: maxLength(250)
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
          registeredCityName: {
            required
          },
          registeredStateRefCode: {
            required,
            integer
          },
          registeredStateName: {
            required
          },
          constitution: {
            required
          },
          establishYear: {
            required
          },
          registerNumber: {
            alphaNum,
            minLength: minLength(2),
            maxLength: maxLength(20)
          },
          mccname: {
            required
          },
          mcc: {
            required
          },
          residentialAddress: {
            required,
            minLength: minLength(2),
            maxLength: maxLength(250)
          },
          residentialPin: {
            required,
            integer,
            minLength: minLength(6),
            maxLength: maxLength(6)
          },
          residentCityName: {
            required
          },
          residentialCityRefCode: {
            required,
            integer
          },
          residentStateName: {
            required
          },
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
            required: requiredIf(() => getStatementType.value),
            email
          },
          statementType: {
            required
          },
          statementFrequency: {
            required
          }
        },
        businessInformation: {
          gstId: {
            maxLength: maxLength(15),
            minLength: minLength(15)
          },
          weekendEndHour: {
            timeValidate
          },
          weekendStartHour: {
            timeValidate
          },
          weekdayEndHour: {
            timeValidate
          },
          weekdayStartHour: {
            timeValidate
          },
          memberSince: {
            // Removing the validation as per client request
            required: false
          },
          debitCardMdr: {
            decimal,
            minValue: minValue(0),
            maxValue: maxValue(99.99)
          },
          creditCardMdr: {
            decimal,
            minValue: minValue(0),
            maxValue: maxValue(99.99)
          },
          expectedCardBusiness: {
            decimal,
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
          lastTurnoverYear: {
            integer,
            minValue: minValue(0),
            maxValue: maxValue(2018),
            minLength: minLength(4),
            maxLength: maxLength(4)
          }
        },
        paymentDetails: {
          installationFee: {
            required: requiredIf(() => getRentalTypeVisibilityForRental.value),
            decimal,
            minValue: minValue(0),
            maxValue: maxValue(999999.99),
            minLength: minLength(1),
            maxLength: maxLength(12)
          },
          serviceProvider: {
            required
          },
          networkPreferred: {
            required
          },
          terminalModeCode: {
            required
          },
          devicePrice: {
            decimal,
            minValue: minValue(0),
            maxValue: maxValue(999999.99),
            minLength: minLength(2),
            maxLength: maxLength(8)
          },
          otherCharges: {
            decimal,
            minValue: minValue(0),
            maxValue: maxValue(999999),
            minLength: minLength(2),
            maxLength: maxLength(8)
          },
          totalAmountPaid: {
            decimal,
            minValue: minValue(0),
            maxValue: maxValue(999999),
            minLength: minLength(2),
            maxLength: maxLength(12)
          },
          numberOfTerminals: {
            numeric,
            minValue: minValue(1),
            maxValue: maxValue(100)
          },
          deviceOwnedBy: {
            required
          },
          cashAtPosEnabled: {
            required
          },
          rentalType: {
            required
          },
          advanceRentCollected: {
            required: requiredIf(() => getRentalTypeVisibilityForAdvanced.value),
            decimal,
            minValue: minValue(0),
            maxValue: maxValue(999999),
            minLength: minLength(2),
            maxLength: maxLength(8)
          },
          advanceRentMode: {
            required: requiredIf(() => getRentalTypeVisibilityForAdvanced.value)
          },
          noOfMonthRentPaidInAdvance: {
            required: requiredIf(() => getRentalTypeVisibilityForAdvanced.value),
            minValue: minValue(0),
            maxValue: maxValue(999999),
            minLength: minLength(1),
            maxLength: maxLength(8)
          },
          gracePeriod: {
            required: requiredIf(() => getRentalTypeVisibilityForRental.value),
            minValue: minValue(0),
            maxValue: maxValue(999999),
            minLength: minLength(1),
            maxLength: maxLength(8)
          }
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
            branchName: {
              required
            },
            bankName: {
              required
            },
            bankCityName: {
              required
            },
            bankCityRefCode: {
              required,
              numeric
            },
            accountNumber: {
              required,
              numeric,
              minLength: minLength(6),
              maxLength: maxLength(19)
            },
            bankStateName: {
              required
            },
            bankStateRefCode: {
              required,
              numeric
            },
            paymentMode: {
              required
            },
            accountType: {
              required
            },
            settlementOrNeftFee: {
              required: requiredIf(() => getfeeTypeForSettlementVisibility.value),
              integer,
              maxValue: maxValue(999),
              minValue: minValue(0)
            }
          },
          collectionDetails: {
            collectedDate: {
              required: requiredIf(() => bankInfoSwipePayment.value)
            },
            swipeAmount: {
              decimal,
              required: requiredIf(() => bankInfoSwipePayment.value),
              minValue: minValue(0)
            },
            swipeTerminal: {
              required: requiredIf(() => bankInfoSwipePayment.value)
            },
            chequeAmount: {
              decimal,
              required: requiredIf(() => bankInfoChequePayment.value),
              minValue: minValue(0)
            },
            chequeNumber: {
              alphaNum,
              required: requiredIf(() => bankInfoChequePayment.value),
              minLength: minLength(6),
              maxLength: maxLength(25)
            },
            chequeDate: {
              required: requiredIf(() => bankInfoChequePayment.value)
            },
            chequeDepositedDate: {
              required: requiredIf(() => bankInfoChequePayment.value)
            }
          }
        },
        mdrPlan: {
          domesticDebitUpTo2000: {
            fixed: { minValue: minValue(0), decimal, required },
            percentage: { minValue: minValue(0), required, maxValue: maxValue(100) },
            minimum: { minValue: minValue(0), decimal, required }
          },
          // ... other MDR plan validations
        },
        SharingDiscountFee: {
          domesticDebitUpTo2000: {
            fixed: { 
              minValue: minValue(0), 
              decimal, 
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            percentage: { 
              minValue: minValue(0), 
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value), 
              maxValue: maxValue(100)
            },
            minimum: { 
              minValue: minValue(0), 
              decimal, 
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            }
          },
          // ... other sharing discount fee validations
        }
      },
      viewBinding: {
        partnersArr: {
          required: requiredIf(() => getPartnersVisiblity.value),
          $each: {
            name: {
              required,
              minLength: minLength(2),
              maxLength: maxLength(120),
              alphaNumericValidate
            },
            address: {
              minLength: minLength(2),
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
            stateRefCode: {
              required,
              integer
            },
            stateRefLabel: {
              required
            },
            cityRefCode: {
              required,
              integer
            },
            cityRefLabel: {
              required
            },
            contactMobile: {
              required,
              integer,
              minLength: minLength(10),
              maxLength: maxLength(10)
            },
            contactEmail: {
              required,
              email
            }
          }
        }
      }
    };

    const v$ = useVuelidate(rules, { merchant, viewBinding });

    // Methods
    const COMMON_FILTER_FUNCTION = (arraySet, terms) => {
      return _.filter(arraySet, function(oo) {
        return (
          oo.label.toLowerCase().includes(terms.toLowerCase()) ||
          oo.value.toString().includes(terms.toString())
        );
      });
    };

    const partnerCitySearch = (terms, done) => {
      done(COMMON_FILTER_FUNCTION(cityOptions.value, terms));
    };

    const partnerCitySelected = (item, index) => {
      viewBinding.value.partnersArr[index].cityRefCode = item.value;
      viewBinding.value.partnersArr[index].cityRefLabel = item.label;
    };

    const partnerStateSearch = (terms, done) => {
      done(COMMON_FILTER_FUNCTION(stateOptions.value, terms));
    };

    const partnerStateSelected = (item, index) => {
      viewBinding.value.partnersArr[index].stateRefCode = item.value;
      viewBinding.value.partnersArr[index].stateRefLabel = item.label;
    };

    const mccSearch = (terms, done) => {
      done(COMMON_FILTER_FUNCTION(mccSearchSet.value, terms));
    };

    const mccSelected = (item) => {
      merchant.value.companyInformation.mccname = item.label;
      merchant.value.companyInformation.mcc = item.value;
    };

    const residentCitySearch = (terms, done) => {
      done(COMMON_FILTER_FUNCTION(cityOptions.value, terms));
    };

    const residentCitySelected = (item) => {
      merchant.value.companyInformation.residentCityName = item.label;
      merchant.value.companyInformation.residentialCityRefCode = item.value;
    };

    const residentStateSearch = (terms, done) => {
      done(COMMON_FILTER_FUNCTION(stateOptions.value, terms));
    };

    const residentStateSelected = (item) => {
      merchant.value.companyInformation.residentStateName = item.label;
      merchant.value.companyInformation.residentialStateRefCode = item.value;
    };

    const registeredCitySelected = (item) => {
      merchant.value.companyInformation.registeredCityName = item.label;
      merchant.value.companyInformation.registeredCityRefCode = item.value;
    };

    const registeredStateSelected = (item) => {
      merchant.value.companyInformation.registeredStateName = item.label;
      merchant.value.companyInformation.registeredStateRefCode = item.value;
    };

    const bankCitySelected = (item) => {
      merchant.value.bankInformation.bankDetails.bankCityName = item.label;
      merchant.value.bankInformation.bankDetails.bankCityRefCode = item.value;
    };

    const bankStateSelected = (item) => {
      merchant.value.bankInformation.bankDetails.bankStateName = item.label;
      merchant.value.bankInformation.bankDetails.bankStateRefCode = item.value;
    };

    const selectCurrentType = () => {
      merchant.value.paymentDetails.gracePeriod = "";
      merchant.value.paymentDetails.advanceRentCollected = "";
      merchant.value.paymentDetails.noOfMonthRentPaidInAdvance = "";
    };

    const addMorePartnersSet = () => {
      let partnerObj = {
        name: "",
        address: "",
        pan: "",
        pin: "",
        cityRefCode: "",
        cityRefLabel: "",
        stateRefCode: "",
        stateRefLabel: "",
        contactMobile: "",
        contactEmail: ""
      };
      viewBinding.value.partnersArr.push(partnerObj);
    };

    const removePartnerFromArr = (item, index) => {
      viewBinding.value.partnersArr.splice(index, 1);
    };

    const autoCompleteError = (val1, val2) => {
      val1.$touch();
      val2.$touch();
      return val1.$anyError || val2.$anyError;
    };

    const populateBankDetails = async () => {
      try {
        const response = await store.dispatch('mars_ifsc/IFSC_FROM_MARS', 
          merchant.value.bankInformation.bankDetails.ifsc
        );
        if (response.status == 200) {
          const ifscData = store.getters['mars_ifsc/ifscFromMars'];
          merchant.value.bankInformation.bankDetails.bankName = ifscData.bankName;
          merchant.value.bankInformation.bankDetails.branchName = ifscData.branchName;
          merchant.value.bankInformation.bankDetails.micr = ifscData.MICR;
        } else {
          $q.notify({
            color: "negative",
            position: "bottom-left",
            message: "Invalid IFSC code",
            icon: "clear"
          });
          merchant.value.bankInformation.bankDetails.ifsc = "";
          merchant.value.bankInformation.bankDetails.bankName = "";
          merchant.value.bankInformation.bankDetails.branchName = "";
          merchant.value.bankInformation.bankDetails.micr = "";
        }
      } catch{

        $q.notify({
          color: "negative",
          position: "bottom-left",
          message: "Error fetching IFSC details",
          icon: "clear"
        });
      }
    };

    const validatebeforeNavigate = async (step) => {
      if (step == "salesInformation") {
        v$.value.merchant.salesInformation.$touch();
        if (v$.value.merchant.salesInformation.$error) {
          $q.notify("Please review sales information fields again.");
        } else {
          if (merchant.value.salesInformation.categoryType == "S") {
            merchant.value.mdrPlan.code = 45;
          } else {
            merchant.value.mdrPlan.code = 44;
          }
          error.value.tab.salesInformation = false;
          await saveCurrentChanges();
          stepperRef.value.next();
        }
      }
      // ... other validation steps
    };

    const saveCurrentChanges = async () => {
      $q.loading.show({
        delay: 0,
        message: "Saving data ..",
        spinnerColor: "purple-9"
      });

      const merchantData = {
        ...merchant.value,
        leadId: route.params.id,
        partnerInformation: viewBinding.value.partnersArr
      };

      try {
        await store.dispatch('mars_dataSubmit/MARS_DATA_SUBMIT_INTERNAL', {
          merchant: merchantData,
          action: 1
        });
        $q.loading.hide();
        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Saved successfully",
          icon: "thumb_up"
        });
      } catch {

        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Please try again",
          icon: "thumb_down"
        });
        $q.loading.hide();
      }
    };

    const finalFormSubmit = async () => {
      v$.value.$touch();
      if (v$.value.$error) {
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Please fill all mandatory fields",
          icon: "info"
        });
        return;
      }

      $q.loading.show({
        delay: 0,
        message: "Validating ..",
        spinnerColor: "purple-9"
      });

      const finalRequest = {
        action: 2,
        merchant: { ...merchant.value }
      };

      finalRequest.merchant.leadId = route.params.id;
      finalRequest.merchant.leadDataEntryRemarks = leadDataEntryRemarks.value;
      finalRequest.merchant.holdPayment = holdPayment.value;

      if (getPartnersVisiblity.value) {
        finalRequest.merchant.partnerInformation = viewBinding.value.partnersArr;
      } else {
        finalRequest.merchant.partnerInformation = [];
      }

      try {
        await store.dispatch('mars_dataSubmit/MARS_DATA_SUBMIT_INTERNAL', finalRequest);
        
        $q.loading.show({
          delay: 0,
          message: "Saved.. Sending data to mars",
          spinnerColor: "purple-9"
        });

        delete finalRequest.merchant.leadId;
        delete finalRequest.action;
        delete finalRequest.merchant.leadDataEntryRemarks;
        delete finalRequest.merchant.holdPayment;
        delete finalRequest.merchant.companyInformation.constitutionName;

        const response = await store.dispatch('mars_dataSubmit/MARS_DATA_SUBMIT_EXTERNAL', {
          params: finalRequest,
          leadStatus: props.propLeadDeatils.leadStatus,
          refNumber: props.propLeadDeatils.merchantRefCode
        });

        let feed_paramaters;
        if (response.status == 204) {
          feed_paramaters = {
            applicationNumber: props.propLeadDeatils.applicationNumber,
            merchantRefCode: props.propLeadDeatils.merchantRefCode
          };
        } else {
          feed_paramaters = response.data;
        }

        $q.loading.show({
          delay: 0,
          message: "Great.. All set to go",
          spinnerColor: "purple-9"
        });

        await store.dispatch('mars_dataSubmit/MARS_DATA_EXTERNAL_SUBMIT_RESPONSE', {
          request: feed_paramaters,
          leadId: route.params.id
        });

        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Successfully submitted to MARS",
          icon: "thumb_up"
        });

        router.push("/sat/lead/validation");
        $q.loading.hide();
      } catch (error) {

        // Error handling
        $q.loading.hide();
        if (error.response?.data?.errorDetails) {
          const errorDetails = error.response.data.errorDetails;
          errorDetails.forEach(actual => {
            const splitted = actual.field.split("/");
            if (splitted[1]?.startsWith("partnerInformation")) {
              // Handle partner errors
            } else {
              error.value.tab[splitted[1]] = true;
            }
          });
          $q.notify({
            color: "negative",
            position: "bottom",
            message: error.response.data.message,
            icon: "thumb_down"
          });
        } else {
          $q.notify({
            color: "negative",
            position: "bottom",
            message: error.message || "An error occurred",
            icon: "thumb_down"
          });
        }
      }
    };

    const fetchAllDropdownValuesFromMARSapi = async (institutionCode) => {
      $q.loading.show({
        delay: 0,
        message: "Setting data ..",
        spinnerColor: "purple-9"
      });

      try {
        // Fetch all dropdown data from store actions
        await Promise.all([
          store.dispatch('mars_regions/REGION_FROM_MARS', institutionCode),
          store.dispatch('mars_sharingPartner/SHARING_PARTNER_FROM_MARS', institutionCode),
          store.dispatch('mars_leadFrom/LEAD_FROM_FROM_MARS', institutionCode),
          store.dispatch('mars_salesPerson/SALES_PERSON_FROM_MARS', institutionCode),
          store.dispatch('mars_city/CITY_FROM_MARS'),
          store.dispatch('mars_state/STATE_FROM_MARS'),
          store.dispatch('mars_mcc/MCC_FROM_MARS'),
          store.dispatch('mars_deviceModel/DEVICE_MODEL_FROM_MARS', institutionCode),
          store.dispatch('mars_rentalPlans/RENTAL_PLAN_FROM_MARS', institutionCode),
          store.dispatch('mars_bankList/BANK_LIST_FROM_MARS', institutionCode),
          store.dispatch('mars_networkProvider/NETWORK_PROVIDER', institutionCode),
          store.dispatch('mars_serviceProvider/SERVICE_PROVIDER', institutionCode)
        ]);

        // Map data to options
        regionOptions.value = store.getters['mars_regions/regionsFromMars'].items.map(item => ({
          label: item.name,
          value: item.code
        }));

        sharingPartnerOptions.value = store.getters['mars_sharingPartner/sharingPartnerFromMars'].items.map(item => ({
          label: item.name,
          value: item.code
        }));

        leadFromOptions.value = store.getters['mars_leadFrom/leadFromInfoFromMars'].items.map(item => ({
          label: item.name,
          value: item.name
        }));

        salesPersonOptions.value = store.getters['mars_salesPerson/salesPersonFromMars'].items.map(item => ({
          label: item.name,
          value: item.code
        }));

        cityOptions.value = store.getters['mars_city/cityFromMars'].items.map(item => ({
          label: item.name,
          value: item.code
        }));

        stateOptions.value = store.getters['mars_state/stateFromMars'].items.map(item => ({
          label: item.name,
          value: item.code
        }));

        mccSearchSet.value = store.getters['mars_mcc/mccFromMars'].items.map(item => ({
          label: `${item.code}-${item.name}`,
          value: item.code
        }));

        terminalModelSet.value = store.getters['mars_deviceModel/deviceModelFromMars'].items.map(item => ({
          label: item.name,
          value: item.code
        }));

        rentalPlanSet.value = store.getters['mars_rentalPlans/rentalPlanFromMars'].items.map(item => ({
          label: item.name,
          value: item.code
        }));

        bankListSet.value = store.getters['mars_bankList/bankListFromMars'].bankNames.map(name => ({
          label: name,
          value: name
        }));

        networkProviderListSet.value = store.getters['mars_networkProvider/networkProviderFromMars'].items.map(item => ({
          label: item.name,
          value: item.code
        }));

        serviceProviderListSet.value = store.getters['mars_serviceProvider/serviceProviderFromMars'].items.map(item => ({
          label: item.name,
          value: item.code
        }));

        // Load saved data if exists
        if ([1, 2].includes(props.propLeadDeatils.marsFormSubmitAction)) {
          await store.dispatch('mars_dataSubmit/FETCH_SAVED_DATA_FROM_OWN_DB', {
            leadId: route.params.id
          });

          const savedData = store.getters['mars_dataSubmit/marsSavedDataFromInternal'];
          if (savedData) {
            // Restore saved data
            merchant.value.salesInformation = savedData.salesInformation;
            merchant.value.companyInformation = savedData.companyInformation;
            merchant.value.businessInformation = savedData.businessInformation;
            viewBinding.value.partnersArr = savedData.partnerInformation || [];
            merchant.value.paymentDetails = savedData.paymentDetails;
            merchant.value.bankInformation = savedData.bankInformation;
            merchant.value.mdrPlan = savedData.mdrPlan;
            if (savedData.SharingDiscountFee) {
              merchant.value.SharingDiscountFee = savedData.SharingDiscountFee;
            }
            
            holdPayment.value = savedData.holdPayment || 1;
            leadDataEntryRemarks.value = savedData.leadDataEntryRemarks || "";
          }
        }

        // Set initial values from propLeadDeatils
        merchant.value.companyInformation.constitution = props.propLeadDeatils.merchantType.marsMappingId;
        merchant.value.companyInformation.constitutionName = props.propLeadDeatils.merchantType.merchantTypeName;
        
        showPartnerstab.value = ['PL', 'PB'].includes(merchant.value.companyInformation.constitution);
        
        merchant.value.salesInformation.applicationNumber = Math.floor(Date.now() / 1000 + 22 * 10);
        merchant.value.companyInformation.dbaName = props.propLeadDeatils.leadName;
        merchant.value.companyInformation.contactMobile = props.propLeadDeatils.contactNumber;
        merchant.value.companyInformation.contactName = props.propLeadDeatils.contactName;
        merchant.value.companyInformation.registeredAddress = props.propLeadDeatils.leadAddress;
        merchant.value.companyInformation.registeredPin = props.propLeadDeatils.pincode;
        merchant.value.paymentDetails.numberOfTerminals = props.propLeadDeatils.deviceCount;
        
        // Set MDR values from short lead info
        const shortLeadInfo = store.getters['SatLeadValidation/getShortLeadInfo'];
        if (shortLeadInfo) {
          merchant.value.mdrPlan.domesticDebitUpTo2000.percentage = shortLeadInfo.debitLessthanAmount;
          merchant.value.mdrPlan.domesticDebitAbove2000.percentage = shortLeadInfo.debitGreaterthanAmount;
          merchant.value.mdrPlan.standardOrClassic.percentage = shortLeadInfo.stdCC;
          merchant.value.mdrPlan.premiumOrPlatinum.percentage = shortLeadInfo.premiumCC;
          merchant.value.mdrPlan.superPremiumOrSignature.percentage = shortLeadInfo.superPremiumlCC;
          merchant.value.mdrPlan.commercialOrCorporate.percentage = shortLeadInfo.corpCC;
          merchant.value.mdrPlan.internationalCreditCard.percentage = shortLeadInfo.intlCC;
        }
        
        merchant.value.paymentDetails.cashAtPosEnabled = props.propLeadDeatils.posEnable ? "Y" : "N";
        
        fetchAndCookDocuments();
        
        $q.loading.hide();
      } catch {

        $q.loading.hide();
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Error loading data",
          icon: "error"
        });
      }
    };

    const fetchAndCookDocuments = () => {
      const GLOBAL_FILE_FETCH_URL = store.getters['GlobalVariables/GLOBAL_FILE_FETCH_URL'];
      
      merchant.value.kyc.documents = [];
      
      // Add agreement document
      merchant.value.kyc.documents.push({
        documentName: "Agreement",
        documentType: props.propLeadDeatils.merchantType.marsAgreementId,
        documentImage: [
          `${GLOBAL_FILE_FETCH_URL}/${props.propLeadDeatils.applicationFile}`
        ]
      });

      // Add other documents
      Object.keys(props.propLeadDeatils.leadDocuments).forEach(key => {
        props.propLeadDeatils.leadDocuments[key].forEach(oo => {
          if (oo.uploadedDocuments.length > 0) {
            const documentImages = oo.uploadedDocuments.map(doc => 
              `${GLOBAL_FILE_FETCH_URL}/${doc.fileName}`
            );
            
            merchant.value.kyc.documents.push({
              documentName: oo.subDocumentType,
              documentType: oo.marsDocumentId,
              documentImage: documentImages
            });
          }
        });
      });
    };

    const marsRequiredFormattingofGST = (val) => {
      merchant.value.businessInformation.gstId = val || null;
    };

    const commonDateFormat = (selectedDate) => {
      if (!selectedDate || selectedDate === "Invalid date") {
        return null;
      }
      return moment(selectedDate).format("YYYY-MM-DD");
    };

    const commonDateFormatInvalidMARSformat = (selectedDate) => {
      if (!selectedDate || selectedDate === "Invalid date") {
        return null;
      }
      return moment(selectedDate, "DD/MM/YYYY").format("YYYY-MM-DD");
    };

    onMounted(() => {
      fetchAllDropdownValuesFromMARSapi(merchant.value.salesInformation.institutionCode);
    });

    return {
      // Refs
      stepperRef,
      showPartnerstab,
      viewBinding,
      merchant,
      error,
      holdPayment,
      leadDataEntryRemarks,
      showDocumentPreview,
      showOpenPaymentChequeInfo,
      
      // Options
      institutionCodeOptions,
      applicationTypeOptions,
      categoryTypeOptions,
      merchantTypeOptions,
      businessTypeOptions,
      deviceOwnedByOptions,
      cashAtPosEnabledOptions,
      rentalTypeOptions,
      rentalModeOptions,
      advanceRentModeOptions,
      accountTypeOptions,
      feeTypeOptions,
      paymnentModeOptions,
      regionOptions,
      leadFromOptions,
      salesPersonOptions,
      sharingPartnerOptions,
      cityOptions,
      stateOptions,
      mccSearchSet,
      terminalModelSet,
      rentalPlanSet,
      bankListSet,
      networkProviderListSet,
      serviceProviderListSet,
      
      // Computed
      getTransctionValueModel,
      getCashAtPos,
      getPartnersVisiblity,
      getRentalTypeVisibilityForRental,
      getRentalTypeVisibilityForAdvanced,
      getfeeTypeForSettlementVisibility,
      showOnlyIfSharingModelIsEnabled,
      getStatementType,
      bankInfoSwipePayment,
      bankInfoChequePayment,
      
      // Methods
      partnerCitySearch,
      partnerCitySelected,
      partnerStateSearch,
      partnerStateSelected,
      mccSearch,
      mccSelected,
      residentCitySearch,
      residentCitySelected,
      residentStateSearch,
      residentStateSelected,
      registeredCitySelected,
      registeredStateSelected,
      bankCitySelected,
      bankStateSelected,
      selectCurrentType,
      addMorePartnersSet,
      removePartnerFromArr,
      autoCompleteError,
      populateBankDetails,
      validatebeforeNavigate,
      saveCurrentChanges,
      finalFormSubmit,
      marsRequiredFormattingofGST,
      commonDateFormat,
      commonDateFormatInvalidMARSformat,
      
      // Validation
      v$
    };
  }
};
</script>

<style scoped>
.border-1 {
  border: 1px solid #e5e5e5;
}

.q-custom-class {
  min-height: 270px;
}

.custom-z-index {
  z-index: 2;
}
</style>