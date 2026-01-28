<template>
  <div>
    <!-- Documents -->
    <div id="mainContainer" class="row">
      <!-- Documents proof -->
      <div id="leftSidePane" class="col-md-5 q-pa-xs largeCont" v-if="showDocumentPreview">
        <viewLeadDocumentsDataEntryComponent
          :prop-lead-document-information="propLeadDeatils.leadDocuments"
          :prop-get-short-info="propLeadDeatils"
        />
      </div>
      <!-- Document related form -->
      <div id="rightSidePane" class="col-md-7 q-pa-xs block relative merchant">
        <q-stepper
          color="purple-9"
          ref="stepper"
          contractable
          alternative-labels
          v-model="currentStep"
        >
          <q-step
            class="salesInformation"
            error-icon="warning"
            :error="error.tab.salesInformation"
            name="first"
            title="Sales"
            subtitle="Info"
          >
            <div class="row gutter-sm">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  class="institutionCode"
                  @blur="v$.merchant.salesInformation.institutionCode.$touch"
                  :error="v$.merchant.salesInformation.institutionCode.$error"
                  placeholder="Choose from the below"
                  color="grey-9"
                  v-model="merchant.salesInformation.institutionCode"
                  label="Institution Code*"
                  :options="institutionCodeOptions"
                  @update:model-value="fetchAllDropdownValuesFromMARSapi"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  class="applicationType"
                  @blur="v$.merchant.salesInformation.applicationType.$touch"
                  :error="v$.merchant.salesInformation.applicationType.$error"
                  placeholder="Choose from the below*"
                  color="grey-9"
                  v-model="merchant.salesInformation.applicationType"
                  label="Application Type*"
                  :options="applicationTypeOptions"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  class="applicationNumber"
                  @blur="v$.merchant.salesInformation.applicationNumber.$touch"
                  :error="v$.merchant.salesInformation.applicationNumber.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.applicationNumber"
                  label="Application Number*"
                  placeholder="Application Number*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-date
                  class="applicationDate"
                  @blur="v$.merchant.salesInformation.applicationDate.$touch"
                  :error="v$.merchant.salesInformation.applicationDate.$error"
                  color="grey-9"
                  mask="DD/MM/YYYY"
                  v-model="merchant.salesInformation.applicationDate"
                  label="Application Date*"
                  placeholder="Application Date*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-date
                  class="aggreementDate"
                  mask="DD/MM/YYYY"
                  @blur="v$.merchant.salesInformation.aggreementDate.$touch"
                  :error="v$.merchant.salesInformation.aggreementDate.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.aggreementDate"
                  label="Agreement Date*"
                  placeholder="Agreement Date*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  class="merchantType"
                  @blur="v$.merchant.salesInformation.merchantType.$touch"
                  :error="v$.merchant.salesInformation.merchantType.$error"
                  placeholder="Choose from the below*"
                  color="grey-9"
                  v-model="merchant.salesInformation.merchantType"
                  label="Merchant Type*"
                  :options="merchantTypeOptions"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  class="categoryType"
                  @blur="v$.merchant.salesInformation.categoryType.$touch"
                  :error="v$.merchant.salesInformation.categoryType.$error"
                  placeholder="Choose from the below*"
                  color="grey-9"
                  v-model="merchant.salesInformation.categoryType"
                  label="Category Type*"
                  :options="categoryTypeOptions"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  class="salesPersonCode"
                  placeholder="Choose from the below*"
                  color="grey-9"
                  @blur="v$.merchant.salesInformation.salesPersonCode.$touch"
                  :error="v$.merchant.salesInformation.salesPersonCode.$error"
                  v-model="merchant.salesInformation.salesPersonCode"
                  label="Sales Person*"
                  :options="salesPersonOptions"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  class="region"
                  placeholder="Choose from the below*"
                  color="grey-9"
                  @blur="v$.merchant.salesInformation.region.$touch"
                  :error="v$.merchant.salesInformation.region.$error"
                  v-model="merchant.salesInformation.region"
                  label="Region*"
                  :options="regionOptions"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  class="leadFrom"
                  placeholder="Choose from the below*"
                  color="grey-9"
                  @blur="v$.merchant.salesInformation.leadFrom.$touch"
                  :error="v$.merchant.salesInformation.leadFrom.$error"
                  v-model="merchant.salesInformation.leadFrom"
                  label="Lead From*"
                  :options="leadFromOptions"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <p class="text-caption">Sharing Model</p>
                <div
                  v-for="(item,index) in viewBinding.sharingModelCode"
                  :key="index"
                  class="sharingModelCode"
                >
                  <q-radio
                    color="grey-9"
                    v-model="merchant.salesInformation.sharingModelCode"
                    :val="item.value"
                    :label="item.label"
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
                  class="sharingPartnerCode"
                  @blur="v$.merchant.salesInformation.sharingPartnerCode.$touch"
                  :error="v$.merchant.salesInformation.sharingPartnerCode.$error"
                  placeholder="Choose from the below*"
                  color="grey-9"
                  v-model="merchant.salesInformation.sharingPartnerCode"
                  label="Sharing partner*"
                  :options="sharingPartnerOptions"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  class="dailyFixedAmount"
                  @blur="v$.merchant.salesInformation.dailyFixedAmount.$touch"
                  :error="v$.merchant.salesInformation.dailyFixedAmount.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.dailyFixedAmount"
                  label="Daily fixed amount*"
                  type="number"
                  placeholder="Daily fixed amount*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  class="loanDisbursementPercentage"
                  @blur="v$.merchant.salesInformation.loanDisbursementPercentage.$touch"
                  :error="v$.merchant.salesInformation.loanDisbursementPercentage.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.loanDisbursementPercentage"
                  label="Percentage*"
                  type="number"
                  placeholder="Percentage*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  class="loanDisbursementAmount"
                  @blur="v$.merchant.salesInformation.loanDisbursementAmount.$touch"
                  :error="v$.merchant.salesInformation.loanDisbursementAmount.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.loanDisbursementAmount"
                  label="Loan disbursement value*"
                  type="number"
                  placeholder="Loan disbursement value*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-date
                  mask="DD/MM/YYYY"
                  class="loanDisbursementDate"
                  @blur="v$.merchant.salesInformation.loanDisbursementDate.$touch"
                  :error="v$.merchant.salesInformation.loanDisbursementDate.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.loanDisbursementDate"
                  label="Disbursement Date*"
                  placeholder="Disbursement Date*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.salesInformation.tenureMonth.$touch"
                  :error="v$.merchant.salesInformation.tenureMonth.$error"
                  color="grey-9"
                  class="tenureMonth"
                  v-model="merchant.salesInformation.tenureMonth"
                  label="Tenure (in months)*"
                  type="number"
                  placeholder="Tenure (in months)*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  class="tenureDay"
                  @blur="v$.merchant.salesInformation.tenureDay.$touch"
                  :error="v$.merchant.salesInformation.tenureDay.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.tenureDay"
                  label="Tenure (in days)*"
                  type="number"
                  placeholder="Tenure (in days)*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-date
                  class="tenureStartDate"
                  mask="DD/MM/YYYY"
                  @blur="v$.merchant.salesInformation.tenureStartDate.$touch"
                  :error="v$.merchant.salesInformation.tenureStartDate.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.tenureStartDate"
                  label="Start Date*"
                  placeholder="Tenure Start Date*"
                />
              </div>
            </div>
            <!-- M => MDR/cash@pos/rent -->
            <div
              v-if="merchant.salesInformation.sharingModelCode == 'M'"
              class="row gutter-sm q-my-xs"
            >
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  class="sharingPartnerCode"
                  @blur="v$.merchant.salesInformation.sharingPartnerCode.$touch"
                  :error="v$.merchant.salesInformation.sharingPartnerCode.$error"
                  placeholder="Choose from the below*"
                  color="grey-9"
                  v-model="merchant.salesInformation.sharingPartnerCode"
                  label="Sharing partner*"
                  :options="sharingPartnerOptions"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  class="rentPercentage"
                  @blur="v$.merchant.salesInformation.rentPercentage.$touch"
                  :error="v$.merchant.salesInformation.rentPercentage.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.rentPercentage"
                  label="Rent %*"
                  type="number"
                  placeholder="Rent %*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  class="rentFixed"
                  @blur="v$.merchant.salesInformation.rentFixed.$touch"
                  :error="v$.merchant.salesInformation.rentFixed.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.rentFixed"
                  label="Rent fixed*"
                  type="number"
                  placeholder="Rent fixed*"
                />
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
            class="companyInformation"
            name="second"
            :error="error.tab.companyInformation"
            title="Details"
          >
            <div class="row gutter-sm">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  class="legalName"
                  @blur="v$.merchant.companyInformation.legalName.$touch"
                  :error="v$.merchant.companyInformation.legalName.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.legalName"
                  label="Legal Name*"
                  placeholder="Legal Name*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  class="dbaName"
                  @blur="v$.merchant.companyInformation.dbaName.$touch"
                  :error="v$.merchant.companyInformation.dbaName.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.dbaName"
                  label="DBA Name*"
                  placeholder="DBA Name*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  class="registeredAddress"
                  color="grey-9"
                  label="Registered Address* (max 120 characters)"
                  placeholder="Registered Address*"
                  v-model="merchant.companyInformation.registeredAddress"
                  @blur="v$.merchant.companyInformation.registeredAddress.$touch"
                  :error="v$.merchant.companyInformation.registeredAddress.$error"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  class="registeredCityRefCode"
                  @blur="v$.merchant.companyInformation.registeredCityRefCode.$touch"
                  :error="autoCompleteError(v$.merchant.companyInformation.registeredCityRefCode, v$.merchant.companyInformation.registeredCityName)"
                  color="grey-9"
                  v-model="merchant.companyInformation.registeredCityName"
                  label="Registered city (type min 3 characters)*"
                  placeholder="Start typing ..*"
                >
                  <template v-slot:append>
                    <q-autocomplete
                      @search="residentCitySearch"
                      :debounce="10"
                      :min-characters="3"
                      @selected="registeredCitySelected"
                    />
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  class="registeredStateRefCode"
                  @blur="v$.merchant.companyInformation.registeredStateRefCode.$touch"
                  :error="autoCompleteError(v$.merchant.companyInformation.registeredStateRefCode, v$.merchant.companyInformation.registeredStateName)"
                  color="grey-9"
                  v-model="merchant.companyInformation.registeredStateName"
                  label="Registered state (type min 3 characters)*"
                  placeholder="Start typing ..*"
                >
                  <template v-slot:append>
                    <q-autocomplete
                      @search="residentStateSearch"
                      :debounce="10"
                      :min-characters="1"
                      @selected="registeredStateSelected"
                    />
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  class="registeredPin"
                  @blur="v$.merchant.companyInformation.registeredPin.$touch"
                  :error="v$.merchant.companyInformation.registeredPin.$error"
                  color="grey-9"
                  type="number"
                  v-model="merchant.companyInformation.registeredPin"
                  label="PIN*"
                  placeholder="PIN*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  disable
                  class="constitutionName"
                  color="grey-9"
                  v-model="merchant.companyInformation.constitutionName"
                  label="Type of Business Entity"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-date
                  mask="DD/MM/YYYY"
                  color="grey-9"
                  class="establishYear"
                  @blur="v$.merchant.companyInformation.establishYear.$touch"
                  :error="v$.merchant.companyInformation.establishYear.$error"
                  v-model="merchant.companyInformation.establishYear"
                  label="Year of Establishment*"
                  placeholder="Year of Establishment*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  class="registerNumber"
                  @blur="v$.merchant.companyInformation.registerNumber.$touch"
                  :error="v$.merchant.companyInformation.registerNumber.$error"
                  v-model="merchant.companyInformation.registerNumber"
                  label="Establish Number"
                  placeholder="Establish Number"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.tin.$touch"
                  :error="v$.merchant.companyInformation.tin.$error"
                  color="grey-9"
                  class="tin"
                  v-model="merchant.companyInformation.tin"
                  label="TIN"
                  placeholder="TIN"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  uppercase
                  class="pan"
                  @blur="v$.merchant.companyInformation.pan.$touch"
                  :error="v$.merchant.companyInformation.pan.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.pan"
                  label="Company PAN*"
                  placeholder="Company PAN*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  uppercase
                  class="tan"
                  @blur="v$.merchant.companyInformation.tan.$touch"
                  :error="v$.merchant.companyInformation.tan.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.tan"
                  label="TAN"
                  placeholder="TAN"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  class="businessNature"
                  v-model="merchant.companyInformation.businessNature"
                  label="Nature of Business"
                  placeholder="Nature of Business"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  placeholder="Choose from the below*"
                  class="businessType"
                  color="grey-9"
                  v-model="merchant.companyInformation.businessType"
                  label="Type of Business"
                  :options="businessTypeOptions"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.mcc.$touch"
                  :error="autoCompleteError(v$.merchant.companyInformation.mcc, v$.merchant.companyInformation.mccname)"
                  color="grey-9"
                  class="mcc"
                  v-model="merchant.companyInformation.mccname"
                  label="MCC (type min 3 characters)"
                  placeholder="Start typing ..*"
                >
                  <template v-slot:append>
                    <q-autocomplete
                      @search="mccSearch"
                      :debounce="10"
                      :min-characters="3"
                      @selected="mccSelected"
                    />
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  class="residentialAddress"
                  @blur="v$.merchant.companyInformation.residentialAddress.$touch"
                  :error="v$.merchant.companyInformation.residentialAddress.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.residentialAddress"
                  label="Residential Address* (max 120 characters)"
                  placeholder="Residential Address*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  class="residentialPin"
                  @blur="v$.merchant.companyInformation.residentialPin.$touch"
                  :error="v$.merchant.companyInformation.residentialPin.$error"
                  color="grey-9"
                  type="number"
                  v-model="merchant.companyInformation.residentialPin"
                  label="PIN*"
                  placeholder="PIN*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  class="residentialCityRefCode"
                  @blur="v$.merchant.companyInformation.residentialCityRefCode.$touch"
                  :error="autoCompleteError(v$.merchant.companyInformation.residentialCityRefCode, v$.merchant.companyInformation.residentCityName)"
                  color="grey-9"
                  v-model="merchant.companyInformation.residentCityName"
                  label="City (type min 3 characters)*"
                  placeholder="Start typing ..*"
                >
                  <template v-slot:append>
                    <q-autocomplete
                      @search="residentCitySearch"
                      :debounce="10"
                      :min-characters="3"
                      @selected="residentCitySelected"
                    />
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  class="residentialStateRefCode"
                  @blur="v$.merchant.companyInformation.residentialStateRefCode.$touch"
                  :error="autoCompleteError(v$.merchant.companyInformation.residentialStateRefCode, v$.merchant.companyInformation.residentStateName)"
                  color="grey-9"
                  v-model="merchant.companyInformation.residentStateName"
                  label="State (type min 3 characters)*"
                  placeholder="Start typing ..*"
                >
                  <template v-slot:append>
                    <q-autocomplete
                      @search="residentStateSearch"
                      :debounce="10"
                      :min-characters="1"
                      @selected="residentStateSelected"
                    />
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  class="contactName"
                  @blur="v$.merchant.companyInformation.contactName.$touch"
                  :error="v$.merchant.companyInformation.contactName.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.contactName"
                  label="Contact Name*"
                  placeholder="Contact Name*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  class="contactMobile"
                  @blur="v$.merchant.companyInformation.contactMobile.$touch"
                  :error="v$.merchant.companyInformation.contactMobile.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.contactMobile"
                  label="Contact mobile*"
                  placeholder="Contact Mobile*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  type="tel"
                  class="contactAlternateMobile"
                  @blur="v$.merchant.companyInformation.contactAlternateMobile.$touch"
                  :error="v$.merchant.companyInformation.contactAlternateMobile.$error"
                  v-model="merchant.companyInformation.contactAlternateMobile"
                  label="Contact Alt Mobile"
                  placeholder="Contact Alt Mobile"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  type="tel"
                  class="contactPhone"
                  @blur="v$.merchant.companyInformation.contactPhone.$touch"
                  :error="v$.merchant.companyInformation.contactPhone.$error"
                  v-model="merchant.companyInformation.contactPhone"
                  label="Contact Phone*"
                  placeholder="Contact Phone*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  class="contactEmail"
                  @blur="v$.merchant.companyInformation.contactEmail.$touch"
                  :error="v$.merchant.companyInformation.contactEmail.$error"
                  color="grey-9"
                  type="email"
                  v-model="merchant.companyInformation.contactEmail"
                  label="Contact Email*"
                  placeholder="Contact Email*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <div class="text-caption">Statement type</div>
                <div class="group statementType">
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
              </div>
              <div class="col-md-12 col-sm-12 col-xs-12">
                <p class="text-caption">Statement frequency</p>
                <div class="group statementFrequency">
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
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  class="statementEmail"
                  label="Statement Email"
                  placeholder="Statement Email"
                  @blur="v$.merchant.companyInformation.statementEmail.$touch"
                  :error="v$.merchant.companyInformation.statementEmail.$error"
                  v-model="merchant.companyInformation.statementEmail"
                />
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
                @click="stepper?.previous()"
                label="Back"
              />
            </q-stepper-navigation>
          </q-step>
          <q-step
            error-icon="warning"
            class="partnerInformation"
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
                  class="name"
                  :error="v.name.$anyError"
                  @blur="() => v.name.$anyError"
                  color="grey-9"
                  v-model="v.$model.name"
                  label="Name*"
                  placeholder="Name*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  uppercase
                  class="pan"
                  :error="v.pan.$anyError"
                  @blur="() => v.pan.$anyError"
                  color="grey-9"
                  v-model="v.$model.pan"
                  label="Pan*"
                  placeholder="Pan*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  class="address"
                  :error="v.address.$anyError"
                  @blur="() => v.address.$anyError"
                  color="grey-9"
                  v-model="v.$model.address"
                  label="Address* (max 120 characters)"
                  placeholder="Address*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  class="pin"
                  :error="v.pin.$anyError"
                  @blur="() => v.pin.$anyError"
                  color="grey-9"
                  type="number"
                  v-model="v.$model.pin"
                  label="Pincode*"
                  placeholder="Pincode*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  class="cityRefCode"
                  :error="autoCompleteError(v.cityRefLabel, v.cityRefCode)"
                  @blur="v.cityRefLabel.$touch()"
                  color="grey-9"
                  v-model="v.$model.cityRefLabel"
                  label="City (type min 3 characters)*"
                  placeholder="Start typing ..*"
                >
                  <template v-slot:append>
                    <q-autocomplete
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
                  class="stateRefCode"
                  :error="autoCompleteError(v.stateRefLabel, v.stateRefCode)"
                  @blur="v.stateRefLabel.$touch()"
                  color="grey-9"
                  v-model="v.$model.stateRefLabel"
                  label="State (type min 3 characters)*"
                  placeholder="Start typing ..*"
                >
                  <template v-slot:append>
                    <q-autocomplete
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
                  class="contactMobile"
                  :error="v.contactMobile.$anyError"
                  @blur="() => v.contactMobile.$anyError"
                  color="grey-9"
                  type="tel"
                  v-model="v.$model.contactMobile"
                  label="Mobile*"
                  placeholder="Mobile*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  class="contactEmail"
                  :error="v.contactEmail.$anyError"
                  @blur="() => v.contactEmail.$anyError"
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
                @click="stepper?.previous()"
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
            class="businessInformation"
            :error="error.tab.businessInformation"
            title="Business"
            subtitle="Info"
          >
            <div class="row gutter-sm">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  class="weekdayStartHour"
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
                  class="weekdayEndHour"
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
                  class="weekendStartHour"
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
                  class="weekendEndHour"
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
                  class="lastTurnoverYear"
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
                  class="lastTurnoverAmount"
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
                  class="expectedCardBusiness"
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
                  class="averageBillAmount"
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
                  class="gstId"
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
                  class="currentPosName"
                  v-model="merchant.businessInformation.currentPosName"
                  label="Name of the other POS Currently Used"
                  placeholder="Name of the other POS Currently Used"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  class="debitCardMdr"
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
                  class="creditCardMdr"
                  @blur="v$.merchant.businessInformation.creditCardMdr.$touch"
                  :error="v$.merchant.businessInformation.creditCardMdr.$error"
                  v-model="merchant.businessInformation.creditCardMdr"
                  label="Credit Card MDR"
                  placeholder="Credit Card MDR"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-date
                  mask="DD/MM/YYYY"
                  class="memberSince"
                  @blur="v$.merchant.businessInformation.memberSince.$touch"
                  :error="v$.merchant.businessInformation.memberSince.$error"
                  color="grey-9"
                  v-model="merchant.businessInformation.memberSince"
                  label="Member since"
                  placeholder="Member since"
                />
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
                @click="stepper?.previous()"
                label="Back"
              />
            </q-stepper-navigation>
          </q-step>
          <q-step
            error-icon="warning"
            name="fifth"
            class="paymentDetails"
            :error="error.tab.paymentDetails"
            title="Payment"
            subtitle="Details"
          >
            <div class="row gutter-sm">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <p class="text-caption">Device Owned By</p>
                <div class="group deviceOwnedBy">
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
                  class="installationFee"
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
                  class="terminalModeCode"
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
                  class="numberOfTerminals"
                  @blur="v$.merchant.paymentDetails.numberOfTerminals.$touch"
                  :error="v$.merchant.paymentDetails.numberOfTerminals.$error"
                  v-model="merchant.paymentDetails.numberOfTerminals"
                  label="No of Terminals*"
                  placeholder="No of Terminals*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <p class="text-caption">Cash @POS Enabled?</p>
                <div class="group cashAtPosEnabled">
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
                  class="rentalPlanCode"
                  v-model="merchant.paymentDetails.rentalPlanCode"
                  label="Rental Plan*"
                  :options="rentalPlanSet"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  placeholder="Choose from the below*"
                  color="grey-9"
                  class="rentalMode"
                  v-model="merchant.paymentDetails.rentalMode"
                  label="Rental Mode*"
                  :options="rentalModeOptions"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  placeholder="Choose from the below*"
                  color="grey-9"
                  class="serviceProvider"
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
                  class="networkPreferred"
                  @blur="v$.merchant.paymentDetails.networkPreferred.$touch"
                  :error="v$.merchant.paymentDetails.networkPreferred.$error"
                  v-model="merchant.paymentDetails.networkPreferred"
                  label="Network provider*"
                  :options="networkProviderListSet"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <p class="text-caption">Rental Type</p>
                <div class="group rentalType">
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
                  class="gracePeriod"
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
                  class="advanceRentCollected"
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
                  class="noOfMonthRentPaidInAdvance"
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
                <p class="text-caption">Advanced Rent Mode</p>
                <div class="group advanceRentMode">
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
                  class="devicePrice"
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
                  class="otherCharges"
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
                  class="totalAmountPaid"
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
                @click="stepper?.previous()"
                label="Back"
              />
            </q-stepper-navigation>
          </q-step>
          <q-step
            error-icon="warning"
            :error="error.tab.mdrPlan || error.SharingDiscountFee"
            name="sixth"
            class
            title="Discount"
            subtitle="Rate"
          >
            <div class="row group items-center">
              <div class="col-md-12">
                <div class="row items-center">
                  <div class="col-3">
                    <div class="text-caption text-weight-medium">Domestic Debit Card below 2000</div>
                  </div>
                  <div class="col">
                    <div
                      class="text-caption text-weight-medium q-py-sm mdrPlan"
                      align="center"
                    >Merchant Disc Fee</div>
                    <div class="row group bg-green-2 domesticDebitUpTo2000">
                      <div class="col">
                        <q-input
                          color="grey-9"
                          class="fixed"
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
                          class="percentage"
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
                          class="minimum"
                          @blur="v$.merchant.mdrPlan.domesticDebitUpTo2000.minimum.$touch"
                          :error="v$.merchant.mdrPlan.domesticDebitUpTo2000.minimum.$error"
                          v-model="merchant.mdrPlan.domesticDebitUpTo2000.minimum"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col SharingDiscountFee" v-if="showOnlyIfSharingModelIsEnabled">
                    <div
                      class="text-caption text-weight-medium q-py-sm"
                      align="center"
                    >Sharing Disc Fee</div>
                    <div class="row group bg-yellow-2 domesticDebitUpTo2000">
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="fixed"
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
                          class="percentage"
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
                          class="minimum"
                          @blur="v$.merchant.SharingDiscountFee.domesticDebitUpTo2000.minimum.$touch"
                          :error="v$.merchant.SharingDiscountFee.domesticDebitUpTo2000.minimum.$error"
                          v-model="merchant.SharingDiscountFee.domesticDebitUpTo2000.minimum"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="text-caption text-weight-medium">Domestic Debit Card above 2000</div>
                  </div>
                  <div class="col mdrPlan">
                    <div class="row group bg-green-2 domesticDebitAbove2000">
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="fixed"
                          @blur="v$.merchant.mdrPlan.domesticDebitAbove2000.fixed.$touch"
                          :error="v$.merchant.mdrPlan.domesticDebitAbove2000.fixed.$error"
                          v-model="merchant.mdrPlan.domesticDebitAbove2000.fixed"
                          placeholder="Fixed"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="percentage"
                          @blur="v$.merchant.mdrPlan.domesticDebitAbove2000.percentage.$touch"
                          :error="v$.merchant.mdrPlan.domesticDebitAbove2000.percentage.$error"
                          v-model="merchant.mdrPlan.domesticDebitAbove2000.percentage"
                          placeholder="%"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="minimum"
                          @blur="v$.merchant.mdrPlan.domesticDebitAbove2000.minimum.$touch"
                          :error="v$.merchant.mdrPlan.domesticDebitAbove2000.minimum.$error"
                          v-model="merchant.mdrPlan.domesticDebitAbove2000.minimum"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col SharingDiscountFee" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2 domesticDebitAbove2000">
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="fixed"
                          @blur="v$.merchant.SharingDiscountFee.domesticDebitAbove2000.fixed.$touch"
                          :error="v$.merchant.SharingDiscountFee.domesticDebitAbove2000.fixed.$error"
                          v-model="merchant.SharingDiscountFee.domesticDebitAbove2000.fixed"
                          placeholder="Fixed"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          @blur="v$.merchant.SharingDiscountFee.domesticDebitAbove2000.percentage.$touch"
                          :error="v$.merchant.SharingDiscountFee.domesticDebitAbove2000.percentage.$error"
                          v-model="merchant.SharingDiscountFee.domesticDebitAbove2000.percentage"
                          placeholder="%"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          @blur="v$.merchant.SharingDiscountFee.domesticDebitAbove2000.minimum.$touch"
                          :error="v$.merchant.SharingDiscountFee.domesticDebitAbove2000.minimum.$error"
                          v-model="merchant.SharingDiscountFee.domesticDebitAbove2000.minimum"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row items-center">
                  <div class="col-3">
                    <div class="text-caption text-weight-medium">Standard/Classic (1st Stab)</div>
                  </div>
                  <div class="col mdrPlan">
                    <div class="row group bg-green-2 standardOrClassic">
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="fixed"
                          @blur="v$.merchant.mdrPlan.standardOrClassic.fixed.$touch"
                          :error="v$.merchant.mdrPlan.standardOrClassic.fixed.$error"
                          v-model="merchant.mdrPlan.standardOrClassic.fixed"
                          placeholder="Fixed"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="percentage"
                          @blur="v$.merchant.mdrPlan.standardOrClassic.percentage.$touch"
                          :error="v$.merchant.mdrPlan.standardOrClassic.percentage.$error"
                          v-model="merchant.mdrPlan.standardOrClassic.percentage"
                          placeholder="%"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="minimum"
                          @blur="v$.merchant.mdrPlan.standardOrClassic.minimum.$touch"
                          :error="v$.merchant.mdrPlan.standardOrClassic.minimum.$error"
                          v-model="merchant.mdrPlan.standardOrClassic.minimum"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col SharingDiscountFee" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2 standardOrClassic">
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="fixed"
                          @blur="v$.merchant.SharingDiscountFee.standardOrClassic.fixed.$touch"
                          :error="v$.merchant.SharingDiscountFee.standardOrClassic.fixed.$error"
                          v-model="merchant.SharingDiscountFee.standardOrClassic.fixed"
                          placeholder="Fixed"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="percentage"
                          @blur="v$.merchant.SharingDiscountFee.standardOrClassic.percentage.$touch"
                          :error="v$.merchant.SharingDiscountFee.standardOrClassic.percentage.$error"
                          v-model="merchant.SharingDiscountFee.standardOrClassic.percentage"
                          placeholder="%"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="minimum"
                          @blur="v$.merchant.SharingDiscountFee.standardOrClassic.minimum.$touch"
                          :error="v$.merchant.SharingDiscountFee.standardOrClassic.minimum.$error"
                          v-model="merchant.SharingDiscountFee.standardOrClassic.minimum"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="text-caption text-weight-medium">Premium/Platinum (2nd Stab)</div>
                  </div>
                  <div class="col mdrPlan">
                    <div class="row group bg-green-2 premiumOrPlatinum">
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="fixed"
                          @blur="v$.merchant.mdrPlan.premiumOrPlatinum.fixed.$touch"
                          :error="v$.merchant.mdrPlan.premiumOrPlatinum.fixed.$error"
                          v-model="merchant.mdrPlan.premiumOrPlatinum.fixed"
                          placeholder="Fixed"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="percentage"
                          @blur="v$.merchant.mdrPlan.premiumOrPlatinum.percentage.$touch"
                          :error="v$.merchant.mdrPlan.premiumOrPlatinum.percentage.$error"
                          v-model="merchant.mdrPlan.premiumOrPlatinum.percentage"
                          placeholder="%"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="minimum"
                          @blur="v$.merchant.mdrPlan.premiumOrPlatinum.minimum.$touch"
                          :error="v$.merchant.mdrPlan.premiumOrPlatinum.minimum.$error"
                          v-model="merchant.mdrPlan.premiumOrPlatinum.minimum"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col SharingDiscountFee" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2 premiumOrPlatinum">
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="fixed"
                          @blur="v$.merchant.SharingDiscountFee.premiumOrPlatinum.fixed.$touch"
                          :error="v$.merchant.SharingDiscountFee.premiumOrPlatinum.fixed.$error"
                          v-model="merchant.SharingDiscountFee.premiumOrPlatinum.fixed"
                          placeholder="Fixed"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="percentage"
                          @blur="v$.merchant.SharingDiscountFee.premiumOrPlatinum.percentage.$touch"
                          :error="v$.merchant.SharingDiscountFee.premiumOrPlatinum.percentage.$error"
                          v-model="merchant.SharingDiscountFee.premiumOrPlatinum.percentage"
                          placeholder="%"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="minimum"
                          @blur="v$.merchant.SharingDiscountFee.premiumOrPlatinum.minimum.$touch"
                          :error="v$.merchant.SharingDiscountFee.premiumOrPlatinum.minimum.$error"
                          v-model="merchant.SharingDiscountFee.premiumOrPlatinum.minimum"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="text-caption text-weight-medium">Super Premium/Signature (3rd Stab)</div>
                  </div>
                  <div class="col mdrPlan">
                    <div class="row group bg-green-2 superPremiumOrSignature">
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="fixed"
                          @blur="v$.merchant.mdrPlan.superPremiumOrSignature.fixed.$touch"
                          :error="v$.merchant.mdrPlan.superPremiumOrSignature.fixed.$error"
                          v-model="merchant.mdrPlan.superPremiumOrSignature.fixed"
                          placeholder="Fixed"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="percentage"
                          @blur="v$.merchant.mdrPlan.superPremiumOrSignature.percentage.$touch"
                          :error="v$.merchant.mdrPlan.superPremiumOrSignature.percentage.$error"
                          v-model="merchant.mdrPlan.superPremiumOrSignature.percentage"
                          placeholder="%"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="minimum"
                          @blur="v$.merchant.mdrPlan.superPremiumOrSignature.minimum.$touch"
                          :error="v$.merchant.mdrPlan.superPremiumOrSignature.minimum.$error"
                          v-model="merchant.mdrPlan.superPremiumOrSignature.minimum"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col SharingDiscountFee" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2 superPremiumOrSignature">
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="fixed"
                          @blur="v$.merchant.SharingDiscountFee.superPremiumOrSignature.fixed.$touch"
                          :error="v$.merchant.SharingDiscountFee.superPremiumOrSignature.fixed.$error"
                          v-model="merchant.SharingDiscountFee.superPremiumOrSignature.fixed"
                          placeholder="Fixed"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="percentage"
                          @blur="v$.merchant.SharingDiscountFee.superPremiumOrSignature.percentage.$touch"
                          :error="v$.merchant.SharingDiscountFee.superPremiumOrSignature.percentage.$error"
                          v-model="merchant.SharingDiscountFee.superPremiumOrSignature.percentage"
                          placeholder="%"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="minimum"
                          @blur="v$.merchant.SharingDiscountFee.superPremiumOrSignature.minimum.$touch"
                          :error="v$.merchant.SharingDiscountFee.superPremiumOrSignature.minimum.$error"
                          v-model="merchant.SharingDiscountFee.superPremiumOrSignature.minimum"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="text-caption text-weight-medium">Commercial/Coporate 4th Stab</div>
                  </div>
                  <div class="col mdrPlan">
                    <div class="row group bg-green-2 commercialOrCorporate">
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="fixed"
                          @blur="v$.merchant.mdrPlan.commercialOrCorporate.fixed.$touch"
                          :error="v$.merchant.mdrPlan.commercialOrCorporate.fixed.$error"
                          v-model="merchant.mdrPlan.commercialOrCorporate.fixed"
                          placeholder="Fixed"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="percentage"
                          @blur="v$.merchant.mdrPlan.commercialOrCorporate.percentage.$touch"
                          :error="v$.merchant.mdrPlan.commercialOrCorporate.percentage.$error"
                          v-model="merchant.mdrPlan.commercialOrCorporate.percentage"
                          placeholder="%"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="minimum"
                          @blur="v$.merchant.mdrPlan.commercialOrCorporate.minimum.$touch"
                          :error="v$.merchant.mdrPlan.commercialOrCorporate.minimum.$error"
                          v-model="merchant.mdrPlan.commercialOrCorporate.minimum"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col SharingDiscountFee" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2 commercialOrCorporate">
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="fixed"
                          @blur="v$.merchant.SharingDiscountFee.commercialOrCorporate.fixed.$touch"
                          :error="v$.merchant.SharingDiscountFee.commercialOrCorporate.fixed.$error"
                          v-model="merchant.SharingDiscountFee.commercialOrCorporate.fixed"
                          placeholder="Fixed"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="percentage"
                          @blur="v$.merchant.SharingDiscountFee.commercialOrCorporate.percentage.$touch"
                          :error="v$.merchant.SharingDiscountFee.commercialOrCorporate.percentage.$error"
                          v-model="merchant.SharingDiscountFee.commercialOrCorporate.percentage"
                          placeholder="%"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="minimum"
                          @blur="v$.merchant.SharingDiscountFee.commercialOrCorporate.minimum.$touch"
                          :error="v$.merchant.SharingDiscountFee.commercialOrCorporate.minimum.$error"
                          v-model="merchant.SharingDiscountFee.commercialOrCorporate.minimum"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="text-caption text-weight-medium">International Debit Card</div>
                  </div>
                  <div class="col mdrPlan">
                    <div class="row group bg-green-2 internationalDebitCard">
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="fixed"
                          @blur="v$.merchant.mdrPlan.internationalDebitCard.fixed.$touch"
                          :error="v$.merchant.mdrPlan.internationalDebitCard.fixed.$error"
                          v-model="merchant.mdrPlan.internationalDebitCard.fixed"
                          placeholder="Fixed"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="percentage"
                          @blur="v$.merchant.mdrPlan.internationalDebitCard.percentage.$touch"
                          :error="v$.merchant.mdrPlan.internationalDebitCard.percentage.$error"
                          v-model="merchant.mdrPlan.internationalDebitCard.percentage"
                          placeholder="%"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="minimum"
                          @blur="v$.merchant.mdrPlan.internationalDebitCard.minimum.$touch"
                          :error="v$.merchant.mdrPlan.internationalDebitCard.minimum.$error"
                          v-model="merchant.mdrPlan.internationalDebitCard.minimum"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col SharingDiscountFee" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2">
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="fixed"
                          @blur="v$.merchant.SharingDiscountFee.internationalDebitCard.fixed.$touch"
                          :error="v$.merchant.SharingDiscountFee.internationalDebitCard.fixed.$error"
                          v-model="merchant.SharingDiscountFee.internationalDebitCard.fixed"
                          placeholder="Fixed"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="percentage"
                          @blur="v$.merchant.SharingDiscountFee.internationalDebitCard.percentage.$touch"
                          :error="v$.merchant.SharingDiscountFee.internationalDebitCard.percentage.$error"
                          v-model="merchant.SharingDiscountFee.internationalDebitCard.percentage"
                          placeholder="%"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="minimum"
                          @blur="v$.merchant.SharingDiscountFee.internationalDebitCard.minimum.$touch"
                          :error="v$.merchant.SharingDiscountFee.internationalDebitCard.minimum.$error"
                          v-model="merchant.SharingDiscountFee.internationalDebitCard.minimum"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="text-caption text-weight-medium">International Credit Card</div>
                  </div>
                  <div class="col mdrPlan">
                    <div class="row group bg-green-2 internationalCreditCard">
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="fixed"
                          @blur="v$.merchant.mdrPlan.internationalCreditCard.fixed.$touch"
                          :error="v$.merchant.mdrPlan.internationalCreditCard.fixed.$error"
                          v-model="merchant.mdrPlan.internationalCreditCard.fixed"
                          placeholder="Fixed"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="percentage"
                          @blur="v$.merchant.mdrPlan.internationalCreditCard.percentage.$touch"
                          :error="v$.merchant.mdrPlan.internationalCreditCard.percentage.$error"
                          v-model="merchant.mdrPlan.internationalCreditCard.percentage"
                          placeholder="%"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="minimum"
                          @blur="v$.merchant.mdrPlan.internationalCreditCard.minimum.$touch"
                          :error="v$.merchant.mdrPlan.internationalCreditCard.minimum.$error"
                          v-model="merchant.mdrPlan.internationalCreditCard.minimum"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col SharingDiscountFee" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2 internationalCreditCard">
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="fixed"
                          @blur="v$.merchant.SharingDiscountFee.internationalCreditCard.fixed.$touch"
                          :error="v$.merchant.SharingDiscountFee.internationalCreditCard.fixed.$error"
                          v-model="merchant.SharingDiscountFee.internationalCreditCard.fixed"
                          placeholder="Fixed"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="percentage"
                          @blur="v$.merchant.SharingDiscountFee.internationalCreditCard.percentage.$touch"
                          :error="v$.merchant.SharingDiscountFee.internationalCreditCard.percentage.$error"
                          v-model="merchant.SharingDiscountFee.internationalCreditCard.percentage"
                          placeholder="%"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="minimum"
                          @blur="v$.merchant.SharingDiscountFee.internationalCreditCard.minimum.$touch"
                          :error="v$.merchant.SharingDiscountFee.internationalCreditCard.minimum.$error"
                          v-model="merchant.SharingDiscountFee.internationalCreditCard.minimum"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="text-caption text-weight-medium">Onus</div>
                  </div>
                  <div class="col mdrPlan">
                    <div class="row group bg-green-2 onus">
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="fixed"
                          @blur="v$.merchant.mdrPlan.onus.fixed.$touch"
                          :error="v$.merchant.mdrPlan.onus.fixed.$error"
                          v-model="merchant.mdrPlan.onus.fixed"
                          placeholder="Fixed"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="percentage"
                          @blur="v$.merchant.mdrPlan.onus.percentage.$touch"
                          :error="v$.merchant.mdrPlan.onus.percentage.$error"
                          v-model="merchant.mdrPlan.onus.percentage"
                          placeholder="%"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="minimum"
                          @blur="v$.merchant.mdrPlan.onus.minimum.$touch"
                          :error="v$.merchant.mdrPlan.onus.minimum.$error"
                          v-model="merchant.mdrPlan.onus.minimum"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col SharingDiscountFee" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2 onus">
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="fixed"
                          @blur="v$.merchant.SharingDiscountFee.onus.fixed.$touch"
                          :error="v$.merchant.SharingDiscountFee.onus.fixed.$error"
                          v-model="merchant.SharingDiscountFee.onus.fixed"
                          placeholder="Fixed"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="percentage"
                          @blur="v$.merchant.SharingDiscountFee.onus.percentage.$touch"
                          :error="v$.merchant.SharingDiscountFee.onus.percentage.$error"
                          v-model="merchant.SharingDiscountFee.onus.percentage"
                          placeholder="%"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="minimum"
                          @blur="v$.merchant.SharingDiscountFee.onus.minimum.$touch"
                          :error="v$.merchant.SharingDiscountFee.onus.minimum.$error"
                          v-model="merchant.SharingDiscountFee.onus.minimum"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="text-caption text-weight-medium">mVISA</div>
                  </div>
                  <div class="col mdrPlan">
                    <div class="row group bg-green-2 mVisa">
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="fixed"
                          @blur="v$.merchant.mdrPlan.mVisa.fixed.$touch"
                          :error="v$.merchant.mdrPlan.mVisa.fixed.$error"
                          v-model="merchant.mdrPlan.mVisa.fixed"
                          placeholder="Fixed"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="percentage"
                          @blur="v$.merchant.mdrPlan.mVisa.percentage.$touch"
                          :error="v$.merchant.mdrPlan.mVisa.percentage.$error"
                          v-model="merchant.mdrPlan.mVisa.percentage"
                          placeholder="%"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="minimum"
                          @blur="v$.merchant.mdrPlan.mVisa.minimum.$touch"
                          :error="v$.merchant.mdrPlan.mVisa.minimum.$error"
                          v-model="merchant.mdrPlan.mVisa.minimum"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col SharingDiscountFee" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2 mVisa">
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="fixed"
                          @blur="v$.merchant.SharingDiscountFee.mVisa.fixed.$touch"
                          :error="v$.merchant.SharingDiscountFee.mVisa.fixed.$error"
                          v-model="merchant.SharingDiscountFee.mVisa.fixed"
                          placeholder="Fixed"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="percentage"
                          @blur="v$.merchant.SharingDiscountFee.mVisa.percentage.$touch"
                          :error="v$.merchant.SharingDiscountFee.mVisa.percentage.$error"
                          v-model="merchant.SharingDiscountFee.mVisa.percentage"
                          placeholder="%"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="minimum"
                          @blur="v$.merchant.SharingDiscountFee.mVisa.minimum.$touch"
                          :error="v$.merchant.SharingDiscountFee.mVisa.minimum.$error"
                          v-model="merchant.SharingDiscountFee.mVisa.minimum"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="text-caption text-weight-medium">Master Pass</div>
                  </div>
                  <div class="col mdrPlan">
                    <div class="row group bg-green-2 masterPass">
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="fixed"
                          @blur="v$.merchant.mdrPlan.masterPass.fixed.$touch"
                          :error="v$.merchant.mdrPlan.masterPass.fixed.$error"
                          v-model="merchant.mdrPlan.masterPass.fixed"
                          placeholder="Fixed"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="percentage"
                          @blur="v$.merchant.mdrPlan.masterPass.percentage.$touch"
                          :error="v$.merchant.mdrPlan.masterPass.percentage.$error"
                          v-model="merchant.mdrPlan.masterPass.percentage"
                          placeholder="%"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="minimum"
                          @blur="v$.merchant.mdrPlan.masterPass.minimum.$touch"
                          :error="v$.merchant.mdrPlan.masterPass.minimum.$error"
                          v-model="merchant.mdrPlan.masterPass.minimum"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col SharingDiscountFee" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2 masterPass">
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="fixed"
                          @blur="v$.merchant.SharingDiscountFee.masterPass.fixed.$touch"
                          :error="v$.merchant.SharingDiscountFee.masterPass.fixed.$error"
                          v-model="merchant.SharingDiscountFee.masterPass.fixed"
                          placeholder="Fixed"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="percentage"
                          @blur="v$.merchant.SharingDiscountFee.masterPass.percentage.$touch"
                          :error="v$.merchant.SharingDiscountFee.masterPass.percentage.$error"
                          v-model="merchant.SharingDiscountFee.masterPass.percentage"
                          placeholder="%"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="minimum"
                          @blur="v$.merchant.SharingDiscountFee.masterPass.minimum.$touch"
                          :error="v$.merchant.SharingDiscountFee.masterPass.minimum.$error"
                          v-model="merchant.SharingDiscountFee.masterPass.minimum"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row items-center">
                  <div class="col-3">
                    <div class="text-caption text-weight-medium">Cash at POS</div>
                  </div>
                  <div class="col mdrPlan">
                    <div class="row group bg-green-2 cashAtPos">
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="fixed"
                          @blur="v$.merchant.mdrPlan.cashAtPos.fixed.$touch"
                          :error="v$.merchant.mdrPlan.cashAtPos.fixed.$error"
                          v-model="merchant.mdrPlan.cashAtPos.fixed"
                          placeholder="Fixed"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="percentage"
                          @blur="v$.merchant.mdrPlan.cashAtPos.percentage.$touch"
                          :error="v$.merchant.mdrPlan.cashAtPos.percentage.$error"
                          v-model="merchant.mdrPlan.cashAtPos.percentage"
                          placeholder="%"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="minimum"
                          @blur="v$.merchant.mdrPlan.cashAtPos.minimum.$touch"
                          :error="v$.merchant.mdrPlan.cashAtPos.minimum.$error"
                          v-model="merchant.mdrPlan.cashAtPos.minimum"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col SharingDiscountFee" v-if="showOnlyIfSharingModelIsEnabled">
                    <div class="row group bg-yellow-2 cashAtPos">
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="fixed"
                          @blur="v$.merchant.SharingDiscountFee.cashAtPos.fixed.$touch"
                          :error="v$.merchant.SharingDiscountFee.cashAtPos.fixed.$error"
                          v-model="merchant.SharingDiscountFee.cashAtPos.fixed"
                          placeholder="Fixed"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="percentage"
                          @blur="v$.merchant.SharingDiscountFee.cashAtPos.percentage.$touch"
                          :error="v$.merchant.SharingDiscountFee.cashAtPos.percentage.$error"
                          v-model="merchant.SharingDiscountFee.cashAtPos.percentage"
                          placeholder="%"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          color="grey-9"
                          type="number"
                          class="minimum"
                          @blur="v$.merchant.SharingDiscountFee.cashAtPos.minimum.$touch"
                          :error="v$.merchant.SharingDiscountFee.cashAtPos.minimum.$error"
                          v-model="merchant.SharingDiscountFee.cashAtPos.minimum"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                </div>
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
                @click="stepper?.previous()"
                label="Back"
              />
            </q-stepper-navigation>
          </q-step>

          <q-step
            error-icon="warning"
            name="seventh"
            class="bankInformation"
            :error="error.tab.bankInformation"
            title="Bank & Collection"
            subtitle="Details"
          >
            <div class="row q-mb-md gutter-sm items-center bankDetails">
              <div class="col-md-12">
                <div class="q-title">Merchant Bank Details</div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  uppercase
                  color="grey-9"
                  class="ifsc"
                  :error="v$.merchant.bankInformation.bankDetails.ifsc.$error"
                  @blur="populateBankDetails"
                  v-model="merchant.bankInformation.bankDetails.ifsc"
                  label="IFSC Code*"
                  placeholder="Enter IFSC*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  class="branchName"
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
                  class="feeType"
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
                  class="settlementOrNeftFee"
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
                  class="micr"
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
                  class="bankName"
                  @blur="v$.merchant.bankInformation.bankDetails.bankName.$touch"
                  :error="v$.merchant.bankInformation.bankDetails.bankName.$error"
                  v-model="merchant.bankInformation.bankDetails.bankName"
                  label="Bank Name*"
                  placeholder="Bank Name*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  class="paymentMode"
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
                  class="bankCityRefCode"
                  @blur="v$.merchant.bankInformation.bankDetails.bankCityRefCode.$touch"
                  :error="autoCompleteError(v$.merchant.bankInformation.bankDetails.bankCityName, v$.merchant.bankInformation.bankDetails.bankCityRefCode)"
                  v-model="merchant.bankInformation.bankDetails.bankCityName"
                  label="City (type min 3 characters)*"
                  placeholder="Start typing ..*"
                >
                  <template v-slot:append>
                    <q-autocomplete
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
                  class="bankStateRefCode"
                  @blur="v$.merchant.bankInformation.bankDetails.bankStateRefCode.$touch"
                  :error="autoCompleteError(v$.merchant.bankInformation.bankDetails.bankStateName, v$.merchant.bankInformation.bankDetails.bankStateRefCode)"
                  v-model="merchant.bankInformation.bankDetails.bankStateName"
                  label="State (type min 3 characters)*"
                  placeholder="Start typing ..*"
                >
                  <template v-slot:append>
                    <q-autocomplete
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
                  class="accountType"
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
                  class="accountNumber"
                  @blur="v$.merchant.bankInformation.bankDetails.accountNumber.$touch"
                  :error="v$.merchant.bankInformation.bankDetails.accountNumber.$error"
                  v-model="merchant.bankInformation.bankDetails.accountNumber"
                  label="Bank A/c Number*"
                  placeholder="Bank A/c Number*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <div class="bankStatementAttached">
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
            </div>
            <div class="row gutter-sm items-center collectionDetails">
              <div class="col-md-12">
                <div class="q-title">Payment Collection Details</div>
              </div>
              <div v-show="propLeadDeatils.paymentOption == 1" class="col-md-12">
                <div class="row">
                  <div class="col-md-6 col-sm-12 col-xs-12">
                    <q-input
                      class="chequeNumber"
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
                      class="swipeAmount"
                      @blur="v$.merchant.bankInformation.collectionDetails.swipeAmount.$touch"
                      :error="v$.merchant.bankInformation.collectionDetails.swipeAmount.$error"
                      v-model="merchant.bankInformation.collectionDetails.swipeAmount"
                      label="Swipe Amount*"
                      placeholder="Swipe Amount*"
                    />
                  </div>
                  <div class="col-md-4 col-sm-12">
                    <q-date
                      mask="DD/MM/YYYY"
                      color="grey-9"
                      class="collectedDate"
                      @blur="v$.merchant.bankInformation.collectionDetails.collectedDate.$touch"
                      :error="v$.merchant.bankInformation.collectionDetails.collectedDate.$error"
                      v-model="merchant.bankInformation.collectionDetails.collectedDate"
                      label="Swipe Date*"
                      placeholder="Swipe Date*"
                    />
                  </div>
                  <div class="col-md-4 col-sm-12 col-xs-12">
                    <q-input
                      color="grey-9"
                      class="swipeTerminal"
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
                      class="chequeAmount"
                      @blur="v$.merchant.bankInformation.collectionDetails.chequeAmount.$touch"
                      :error="v$.merchant.bankInformation.collectionDetails.chequeAmount.$error"
                      v-model="merchant.bankInformation.collectionDetails.chequeAmount"
                      label="Cheque Amount*"
                      placeholder="Cheque Amount*"
                    />
                  </div>
                  <div class="col-md-3 col-sm-12">
                    <q-date
                      mask="DD/MM/YYYY"
                      color="grey-9"
                      class="chequeDate"
                      @blur="v$.merchant.bankInformation.collectionDetails.chequeDate.$touch"
                      :error="v$.merchant.bankInformation.collectionDetails.chequeDate.$error"
                      v-model="merchant.bankInformation.collectionDetails.chequeDate"
                      label="Cheque Date*"
                      placeholder="Cheque Date*"
                    />
                  </div>
                  <div class="col-md-3 col-sm-12 col-xs-12">
                    <q-date
                      mask="DD/MM/YYYY"
                      color="grey-9"
                      class="chequeDepositedDate"
                      @blur="v$.merchant.bankInformation.collectionDetails.chequeDepositedDate.$touch"
                      :error="v$.merchant.bankInformation.collectionDetails.chequeDepositedDate.$error"
                      v-model="merchant.bankInformation.collectionDetails.chequeDepositedDate"
                      label="Cheque Deposited Date*"
                      placeholder="Cheque Deposited Date*"
                    />
                  </div>
                  <div class="col-md-3 col-sm-12 col-xs-12">
                    <q-input
                      color="grey-9"
                      class="chequeNumber"
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
                  class="acquirerBank"
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
                @click="stepper?.previous()"
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
                @click="stepper?.previous()"
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
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { helpers, required, requiredIf, alphaNum, integer, numeric, 
  minLength, maxLength, email, maxValue, minValue, decimal } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import moment from 'moment';
import _ from 'lodash';

// Remove jQuery dependency
// global.jQuery = require("jquery");
// var $ = global.jQuery;
// window.$ = $;

import viewLeadDocumentsDataEntryComponent from "./viewLeadDocumentsDataEntryComponent.vue";

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

export default defineComponent({
  name: "leadDataEntry",
  components: {
    viewLeadDocumentsDataEntryComponent
  },
  props: ["propLeadDeatils"],
  setup(props) {
    const $q = useQuasar();
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    
    const stepper = ref(null);
    const currentStep = ref('first');
    const showPartnerstab = ref(false);
    
    // Reactive data
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
        registeredStateRefCode: "",
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
        residentialAddress: "",
        residentialPin: "",
        residentialCityRefCode: "",
        residentialStateRefCode: "",
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
      partnerInformation: [],
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
          bankStateRefCode: "",
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

    // Options
    const institutionCodeOptions = [{ label: "GPRS", value: 3 }];
    const applicationTypeOptions = [{ label: "Digital", value: "D" }, { label: "Non Digital", value: "N" }];
    const categoryTypeOptions = [{ label: "Small", value: "S" }, { label: "Other", value: "O" }];
    const merchantTypeOptions = [
      { label: "Group Merchant", value: "G" },
      { label: "Merchant Outlet", value: "O" },
      { label: "Merchant", value: "M" }
    ];
    const businessTypeOptions = [
      { label: "Rented", value: "R" },
      { label: "Owned", value: "O" },
      { label: "Leased", value: "L" }
    ];
    const constitutionOptions = [
      { label: "Individuals", value: "IN" },
      { label: " Partnership/LLP", value: "PL" },
      { label: "Sole Proprietorship", value: "SP" },
      { label: "Public/Pvt.Ltd", value: "PB" },
      { label: "Trust", value: "TR" },
      { label: "Society", value: "SO" },
      { label: "Other", value: "OT" }
    ];
    const deviceOwnedByOptions = [
      { label: "Bijlipay", value: "B" },
      { label: "Merchant", value: "M" }
    ];
    const cashAtPosEnabledOptions = [
      { label: "Yes", value: "Y" },
      { label: "No", value: "N" }
    ];
    const rentalTypeOptions = [
      { label: "Advanced", value: "A" },
      { label: "Regular", value: "R" }
    ];
    const rentalModeOptions = [
      { label: "Standing instructions", value: "S" },
      { label: "Normal", value: "N" },
      { label: "Nabad", value: "B" },
      { label: "Invoice for EPRS", value: "I" },
      { label: "Equitas Rental", value: "E" },
      { label: "Big merchant", value: "M" },
      { label: "Invoice to Trade", value: "IT" },
      { label: "Rental Fee Waiver", value: "RW" },
      { label: "Advance Rental", value: "AR" },
      { label: "Settlement", value: "SE" },
      { label: "Exibition", value: "EX" },
      { label: "Clix", value: "CX" },
      { label: "Subvention", value: "SB" },
      { label: "EMI Rental", value: "EM" },
      { label: "BPCL", value: "BP" },
      { label: "Demo Device", value: "DD" },
      { label: "Invoice to Bank", value: "IB" },
      { label: "Finetree Finance LTD", value: "FF" },
      { label: "Deactivated", value: "DT" }
    ];
    const advanceRentModeOptions = [
      { label: "Card", value: "Card" },
      { label: "Cheque", value: "Cheque" },
      { label: "NEFT", value: "NEFT" },
      { label: "IMPS", value: "IMPS" },
      { label: "Cash", value: "Cash" }
    ];
    const accountTypeOptions = [
      { label: "Saving account", value: "S" },
      { label: "Current account", value: "C" },
      { label: "Overdraft account", value: "O" },
      { label: "Cash credit account", value: "R" }
    ];
    const feeTypeOptions = [
      { label: "NEFT", value: "N" },
      { label: "Settlement", value: "S" },
      { label: "None", value: "X" }
    ];
    const paymnentModeOptions = [
      { label: "Direct credit", value: "D" },
      { label: "NEFT", value: "N" },
      { label: "IMPS", value: "I" }
    ];

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
      const partnersTabEnabledItems = ['IN', 'PL', 'SP', 'PB']; // Assuming these are the values
      return partnersTabEnabledItems.includes(merchant.value.companyInformation.constitution);
    });

    const getRentalTypeVisibilityForRental = computed(() => {
      return merchant.value.paymentDetails.rentalType == "R";
    });

    const getRentalTypeVisibilityForAdvanced = computed(() => {
      return merchant.value.paymentDetails.rentalType == "A";
    });

    const getfeeTypeForSettlementVisibility = computed(() => {
      return merchant.value.bankInformation.bankDetails.feeType == "N" ||
        merchant.value.bankInformation.bankDetails.feeType == "S";
    });

    const showOnlyIfSharingModelIsEnabled = computed(() => {
      return merchant.value.salesInformation.sharingModelCode != "N";
    });

    const chequeNumberValidation = computed(() => {
      return props.propLeadDeatils.paymentOption == 2 ? 6 : 25;
    });

    const bankInfoSwipePayment = computed(() => {
      return props.propLeadDeatils.paymentOption == 3;
    });

    const bankInfoChequePayment = computed(() => {
      return props.propLeadDeatils.paymentOption == 2;
    });

    const getStatementType = computed(() => {
      return merchant.value.companyInformation.statementType == "E";
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
            fixed: {
              minValue: minValue(0),
              decimal,
              required
            },
            percentage: {
              minValue: minValue(0),
              required,
              maxValue: maxValue(100)
            },
            minimum: {
              minValue: minValue(0),
              decimal,
              required
            }
          },
          domesticDebitAbove2000: {
            fixed: {
              minValue: minValue(0),
              decimal,
              required
            },
            percentage: {
              minValue: minValue(0),
              maxValue: maxValue(100),
              decimal,
              required
            },
            minimum: {
              minValue: minValue(0),
              decimal,
              required
            }
          },
          standardOrClassic: {
            fixed: {
              minValue: minValue(0),
              decimal,
              required
            },
            percentage: {
              minValue: minValue(0),
              maxValue: maxValue(100),
              decimal,
              required
            },
            minimum: {
              minValue: minValue(0),
              decimal,
              required
            }
          },
          premiumOrPlatinum: {
            fixed: {
              minValue: minValue(0),
              decimal,
              required
            },
            percentage: {
              minValue: minValue(0),
              maxValue: maxValue(100),
              decimal,
              required
            },
            minimum: {
              minValue: minValue(0),
              decimal,
              required
            }
          },
          superPremiumOrSignature: {
            fixed: {
              minValue: minValue(0),
              decimal,
              required
            },
            percentage: {
              minValue: minValue(0),
              maxValue: maxValue(100),
              decimal,
              required
            },
            minimum: {
              minValue: minValue(0),
              decimal,
              required
            }
          },
          commercialOrCorporate: {
            fixed: {
              minValue: minValue(0),
              decimal,
              required
            },
            percentage: {
              minValue: minValue(0),
              maxValue: maxValue(100),
              decimal,
              required
            },
            minimum: {
              minValue: minValue(0),
              decimal,
              required
            }
          },
          internationalDebitCard: {
            fixed: {
              minValue: minValue(0),
              decimal,
              required
            },
            percentage: {
              minValue: minValue(0),
              maxValue: maxValue(100),
              decimal,
              required
            },
            minimum: {
              minValue: minValue(0),
              decimal,
              required
            }
          },
          internationalCreditCard: {
            fixed: {
              minValue: minValue(0),
              decimal,
              required
            },
            percentage: {
              minValue: minValue(0),
              maxValue: maxValue(100),
              decimal,
              required
            },
            minimum: {
              minValue: minValue(0),
              decimal,
              required
            }
          },
          onus: {
            fixed: {
              minValue: minValue(0),
              decimal,
              required
            },
            percentage: {
              minValue: minValue(0),
              maxValue: maxValue(100),
              decimal,
              required
            },
            minimum: {
              minValue: minValue(0),
              decimal,
              required
            }
          },
          mVisa: {
            fixed: {
              minValue: minValue(0),
              decimal,
              required
            },
            percentage: {
              minValue: minValue(0),
              maxValue: maxValue(100),
              decimal,
              required
            },
            minimum: {
              minValue: minValue(0),
              decimal,
              required
            }
          },
          masterPass: {
            fixed: {
              minValue: minValue(0),
              decimal,
              required
            },
            percentage: {
              minValue: minValue(0),
              maxValue: maxValue(100),
              decimal,
              required
            },
            minimum: {
              minValue: minValue(0),
              decimal,
              required
            }
          },
          cashAtPos: {
            fixed: {
              minValue: minValue(0),
              decimal,
              required
            },
            percentage: {
              minValue: minValue(0),
              maxValue: maxValue(100),
              decimal,
              required
            },
            minimum: {
              minValue: minValue(0),
              decimal,
              required
            }
          }
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
          domesticDebitAbove2000: {
            fixed: {
              minValue: minValue(0),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            percentage: {
              minValue: minValue(0),
              maxValue: maxValue(100),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            minimum: {
              minValue: minValue(0),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            }
          },
          standardOrClassic: {
            fixed: {
              minValue: minValue(0),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            percentage: {
              minValue: minValue(0),
              maxValue: maxValue(100),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            minimum: {
              minValue: minValue(0),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            }
          },
          premiumOrPlatinum: {
            fixed: {
              minValue: minValue(0),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            percentage: {
              minValue: minValue(0),
              maxValue: maxValue(100),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            minimum: {
              minValue: minValue(0),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            }
          },
          superPremiumOrSignature: {
            fixed: {
              minValue: minValue(0),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            percentage: {
              minValue: minValue(0),
              maxValue: maxValue(100),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            minimum: {
              minValue: minValue(0),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            }
          },
          commercialOrCorporate: {
            fixed: {
              minValue: minValue(0),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            percentage: {
              minValue: minValue(0),
              maxValue: maxValue(100),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            minimum: {
              minValue: minValue(0),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            }
          },
          internationalDebitCard: {
            fixed: {
              minValue: minValue(0),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            percentage: {
              minValue: minValue(0),
              maxValue: maxValue(100),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            minimum: {
              minValue: minValue(0),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            }
          },
          internationalCreditCard: {
            fixed: {
              minValue: minValue(0),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            percentage: {
              minValue: minValue(0),
              maxValue: maxValue(100),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            minimum: {
              minValue: minValue(0),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            }
          },
          onus: {
            fixed: {
              minValue: minValue(0),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            percentage: {
              minValue: minValue(0),
              maxValue: maxValue(100),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            minimum: {
              minValue: minValue(0),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            }
          },
          mVisa: {
            fixed: {
              minValue: minValue(0),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            percentage: {
              minValue: minValue(0),
              maxValue: maxValue(100),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            minimum: {
              minValue: minValue(0),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            }
          },
          masterPass: {
            fixed: {
              minValue: minValue(0),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            percentage: {
              minValue: minValue(0),
              maxValue: maxValue(100),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            minimum: {
              minValue: minValue(0),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            }
          },
          cashAtPos: {
            fixed: {
              minValue: minValue(0),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            percentage: {
              minValue: minValue(0),
              maxValue: maxValue(100),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            minimum: {
              minValue: minValue(0),
              decimal,
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
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

    // Store getters
    const GLOBAL_FILE_FETCH_URL = computed(() => store.getters["GlobalVariables/GLOBAL_FILE_FETCH_URL"]);
    const getShortLeadInfo = computed(() => store.getters["SatLeadValidation/getShortLeadInfo"]);

    // Store actions
    const marsActions = {
      REGION_FROM_MARS: (code) => store.dispatch("mars_regions/REGION_FROM_MARS", code),
      LEAD_FROM_FROM_MARS: (code) => store.dispatch("mars_leadFrom/LEAD_FROM_FROM_MARS", code),
      SALES_PERSON_FROM_MARS: (code) => store.dispatch("mars_salesPerson/SALES_PERSON_FROM_MARS", code),
      SHARING_PARTNER_FROM_MARS: (code) => store.dispatch("mars_sharingPartner/SHARING_PARTNER_FROM_MARS", code),
      CITY_FROM_MARS: () => store.dispatch("mars_city/CITY_FROM_MARS"),
      STATE_FROM_MARS: () => store.dispatch("mars_state/STATE_FROM_MARS"),
      MCC_FROM_MARS: () => store.dispatch("mars_mcc/MCC_FROM_MARS"),
      DEVICE_MODEL_FROM_MARS: (code) => store.dispatch("mars_deviceModel/DEVICE_MODEL_FROM_MARS", code),
      RENTAL_PLAN_FROM_MARS: (code) => store.dispatch("mars_rentalPlans/RENTAL_PLAN_FROM_MARS", code),
      IFSC_FROM_MARS: (ifsc) => store.dispatch("mars_ifsc/IFSC_FROM_MARS", ifsc),
      BANK_LIST_FROM_MARS: (code) => store.dispatch("mars_bankList/BANK_LIST_FROM_MARS", code),
      NETWORK_PROVIDER: (code) => store.dispatch("mars_networkProvider/NETWORK_PROVIDER", code),
      SERVICE_PROVIDER: (code) => store.dispatch("mars_serviceProvider/SERVICE_PROVIDER", code),
      MARS_DATA_SUBMIT_INTERNAL: (data) => store.dispatch("mars_dataSubmit/MARS_DATA_SUBMIT_INTERNAL", data),
      MARS_DATA_SUBMIT_EXTERNAL: (data) => store.dispatch("mars_dataSubmit/MARS_DATA_SUBMIT_EXTERNAL", data),
      MARS_DATA_EXTERNAL_SUBMIT_RESPONSE: (data) => store.dispatch("mars_dataSubmit/MARS_DATA_EXTERNAL_SUBMIT_RESPONSE", data),
      FETCH_SAVED_DATA_FROM_OWN_DB: (data) => store.dispatch("mars_dataSubmit/FETCH_SAVED_DATA_FROM_OWN_DB", data)
    };

    // Methods
    const toggleChequeImage = () => {
      // Implementation if needed
    };

  

    const populateBankDetails = async () => {
      try {
        await marsActions.IFSC_FROM_MARS(merchant.value.bankInformation.bankDetails.ifsc);
        const ifscData = store.getters["mars_ifsc/ifscFromMars"];
        
        if (ifscData && ifscData.bankName) {
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
      } catch (error) {

        console.error("Error fetching IFSC details:", error);
      }
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

    const COMMON_FILTER_FUNCTION = (arraySet, terms) => {
      return _.filter(arraySet, (oo) => {
        return (
          oo.label.toLowerCase().includes(terms.toLowerCase()) ||
          oo.value.toString().includes(terms.toString())
        );
      });
    };

    const selectCurrentType = () => {
      merchant.value.paymentDetails.gracePeriod = "";
      merchant.value.paymentDetails.advanceRentCollected = "";
      merchant.value.paymentDetails.noOfMonthRentPaidInAdvance = "";
    };

    const addMorePartnersSet = () => {
      const partnerObj = {
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

    const validatebeforeNavigate = async (step) => {
      if (step === "salesInformation") {
        v$.value.merchant.salesInformation.$touch();
        if (v$.value.merchant.salesInformation.$error) {
          $q.notify("Please review sales information fields again.");
        } else {
          if (merchant.value.salesInformation.categoryType == "S") {
            merchant.value.mdrPlan.code = 45;
          } else {
            merchant.value.mdrPlan.code = 44;
          }
          error.value.salesInformation = false;
          await saveCurrentChanges();
          stepper.value?.next();
        }
      } else if (step === "companyInformation") {
        v$.value.merchant.companyInformation.$touch();
        if (v$.value.merchant.companyInformation.$error) {
          $q.notify("Please review company information fields again.");
        } else {
          error.value.companyInformation = false;
          const partnersTabEnabledItems = ['IN', 'PL', 'SP', 'PB'];
          if (partnersTabEnabledItems.includes(merchant.value.companyInformation.constitution)) {
            await saveCurrentChanges();
            stepper.value?.next();
          } else {
            await saveCurrentChanges();
            stepper.value?.goTo("fourth");
          }
        }
      } else if (step === "partners") {
        v$.value.viewBinding.partnersArr.$touch();
        if (v$.value.viewBinding.partnersArr.$error) {
          $q.notify("Please review partners fields again.");
        } else {
          error.value.partnerInformation = false;
          await saveCurrentChanges();
          stepper.value?.next();
        }
      } else if (step === "businessInformation") {
        v$.value.merchant.businessInformation.$touch();
        if (v$.value.merchant.businessInformation.$error) {
          $q.notify("Please review business information fields again.");
        } else {
          error.value.businessInformation = false;
          await saveCurrentChanges();
          stepper.value?.next();
        }
      } else if (step === "mdr") {
        v$.value.merchant.mdrPlan.$touch();
        if (v$.value.merchant.mdrPlan.$error) {
          $q.notify("Please review MDR plan fields fields again.");
          error.value.mdrPlan = false;
        } else if (v$.value.merchant.SharingDiscountFee.$error) {
          $q.notify("Please review sharing discount fee fields again.");
          error.value.sharingDiscountFee = false;
        } else {
          await saveCurrentChanges();
          stepper.value?.next();
        }
      } else if (step === "paymentDetails") {
        v$.value.merchant.paymentDetails.$touch();
        if (v$.value.merchant.paymentDetails.$error) {
          $q.notify("Please review payment details fields again.");
        } else {
          error.value.paymentDetails = false;
          await saveCurrentChanges();
          stepper.value?.next();
        }
      } else if (step === "bank") {
        v$.value.merchant.bankInformation.$touch();
        if (v$.value.merchant.bankInformation.$error) {
          $q.notify("Please review bank information fields again.");
        } else {
          error.value.bankInformation = false;
          await saveCurrentChanges();
          stepper.value?.next();
        }
      }
    };

    const fetchAllDropdownValuesFromMARSapi = async (institutionCode) => {
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Setting data .."
      });

      try {
        // Fetch regions
        await marsActions.REGION_FROM_MARS(institutionCode);
        const regions = store.getters["mars_regions/regionsFromMars"];
        regionOptions.value = regions?.items?.map(oo => ({ label: oo.name, value: oo.code })) || [];

        // Fetch sharing partner
        await marsActions.SHARING_PARTNER_FROM_MARS(institutionCode);
        const sharingPartners = store.getters["mars_sharingPartner/sharingPartnerFromMars"];
        sharingPartnerOptions.value = sharingPartners?.items?.map(oo => ({ label: oo.name, value: oo.code })) || [];

        // Fetch lead from
        await marsActions.LEAD_FROM_FROM_MARS(institutionCode);
        const leadFrom = store.getters["mars_leadFrom/leadFromInfoFromMars"];
        leadFromOptions.value = leadFrom?.items?.map(oo => ({ label: oo.name, value: oo.name })) || [];

        // Fetch sales person
        await marsActions.SALES_PERSON_FROM_MARS(institutionCode);
        const salesPerson = store.getters["mars_salesPerson/salesPersonFromMars"];
        salesPersonOptions.value = salesPerson?.items?.map(oo => ({ label: oo.name, value: oo.code })) || [];

        // Fetch city
        await marsActions.CITY_FROM_MARS();
        const city = store.getters["mars_city/cityFromMars"];
        cityOptions.value = city?.items?.map(oo => ({ label: oo.name, value: oo.code })) || [];

        // Fetch state
        await marsActions.STATE_FROM_MARS();
        const state = store.getters["mars_state/stateFromMars"];
        stateOptions.value = state?.items?.map(oo => ({ label: oo.name, value: oo.code })) || [];

        // Fetch MCC
        await marsActions.MCC_FROM_MARS();
        const mcc = store.getters["mars_mcc/mccFromMars"];
        mccSearchSet.value = mcc?.items?.map(oo => ({ label: oo.code + "-" + oo.name, value: oo.code })) || [];

        // Fetch device model
        await marsActions.DEVICE_MODEL_FROM_MARS(institutionCode);
        const deviceModel = store.getters["mars_deviceModel/deviceModelFromMars"];
        terminalModelSet.value = deviceModel?.items?.map(oo => ({ label: oo.name, value: oo.code })) || [];

        // Fetch rental plan
        await marsActions.RENTAL_PLAN_FROM_MARS(institutionCode);
        const rentalPlan = store.getters["mars_rentalPlans/rentalPlanFromMars"];
        rentalPlanSet.value = rentalPlan?.items?.map(oo => ({ label: oo.name, value: oo.code })) || [];

        // Fetch bank list
        await marsActions.BANK_LIST_FROM_MARS(institutionCode);
        const bankList = store.getters["mars_bankList/bankListFromMars"];
        bankListSet.value = bankList?.bankNames?.map(oo => ({ label: oo, value: oo })) || [];

        // Fetch network provider
        await marsActions.NETWORK_PROVIDER(institutionCode);
        const networkProvider = store.getters["mars_networkProvider/networkProviderFromMars"];
        networkProviderListSet.value = networkProvider?.items?.map(oo => ({ label: oo.name, value: oo.code })) || [];

        // Fetch service provider
        await marsActions.SERVICE_PROVIDER(institutionCode);
        const serviceProvider = store.getters["mars_serviceProvider/serviceProviderFromMars"];
        serviceProviderListSet.value = serviceProvider?.items?.map(oo => ({ label: oo.name, value: oo.code })) || [];

        // Load saved data if exists
        if (props.propLeadDeatils.marsFormSubmitAction == 1 || props.propLeadDeatils.marsFormSubmitAction == 2) {
          await marsActions.FETCH_SAVED_DATA_FROM_OWN_DB({ leadId: route.params.id });
          const savedData = store.getters["mars_dataSubmit/marsSavedDataFromInternal"];
          
          if (savedData) {
            // Format dates and update merchant data
            if (savedData.salesInformation) {
              savedData.salesInformation.applicationDate = commonDateFormat(savedData.salesInformation.applicationDate);
              savedData.salesInformation.aggreementDate = commonDateFormat(savedData.salesInformation.aggreementDate);
              savedData.salesInformation.loanDisbursementDate = commonDateFormat(savedData.salesInformation.loanDisbursementDate);
              savedData.salesInformation.tenureStartDate = commonDateFormat(savedData.salesInformation.tenureStartDate);
            }
            
            if (savedData.companyInformation) {
              savedData.companyInformation.establishYear = commonDateFormat(savedData.companyInformation.establishYear);
            }
            
            if (savedData.bankInformation?.collectionDetails) {
              savedData.bankInformation.collectionDetails.chequeDepositedDate = commonDateFormat(savedData.bankInformation.collectionDetails.chequeDepositedDate);
              savedData.bankInformation.collectionDetails.collectedDate = commonDateFormat(savedData.bankInformation.collectionDetails.collectedDate);
              savedData.bankInformation.collectionDetails.chequeDate = commonDateFormat(savedData.bankInformation.collectionDetails.chequeDate);
            }
            
            if (savedData.businessInformation) {
              savedData.businessInformation.memberSince = commonDateFormat(savedData.businessInformation.memberSince);
            }
            
            holdPayment.value = savedData.holdPayment || "";
            leadDataEntryRemarks.value = savedData.leadDataEntryRemarks || "";
            merchant.value.salesInformation = { ...merchant.value.salesInformation, ...savedData.salesInformation };
            merchant.value.companyInformation = { ...merchant.value.companyInformation, ...savedData.companyInformation };
            merchant.value.businessInformation = { ...merchant.value.businessInformation, ...savedData.businessInformation };
            viewBinding.value.partnersArr = savedData.partnerInformation || viewBinding.value.partnersArr;
            merchant.value.paymentDetails = { ...merchant.value.paymentDetails, ...savedData.paymentDetails };
            merchant.value.bankInformation = { ...merchant.value.bankInformation, ...savedData.bankInformation };
            merchant.value.mdrPlan = { ...merchant.value.mdrPlan, ...savedData.mdrPlan };
            
            if (savedData.SharingDiscountFee) {
              merchant.value.SharingDiscountFee = { ...merchant.value.SharingDiscountFee, ...savedData.SharingDiscountFee };
            }
            
            // Update constitution based on prop
            merchant.value.companyInformation.constitution = props.propLeadDeatils.merchantType.marsMappingId;
            merchant.value.companyInformation.constitutionName = props.propLeadDeatils.merchantType.merchantTypeName;
            
            const partnersTabEnabledItems = ['IN', 'PL', 'SP', 'PB'];
            showPartnerstab.value = partnersTabEnabledItems.includes(merchant.value.companyInformation.constitution);
          }
        }
        
        // Set cash at POS enabled
        merchant.value.paymentDetails.cashAtPosEnabled = props.propLeadDeatils.posEnable ? "Y" : "N";
        
        $q.loading.hide();
      } catch (error) {

        console.error("Error fetching dropdown values:", error);
        $q.loading.hide();
      }
    };

    const fetchAndCookDocuments = () => {
      merchant.value.kyc.documents.push({
        documentName: "Agreement",
        documentType: props.propLeadDeatils.merchantType.marsAgreementId,
        documentImage: [
          GLOBAL_FILE_FETCH_URL.value + "/" + props.propLeadDeatils.applicationFile
        ]
      });

      Object.keys(props.propLeadDeatils.leadDocuments).forEach((key) => {
        _.map(props.propLeadDeatils.leadDocuments[key], (oo) => {
          if (oo.uploadedDocuments.length > 0) {
            const assumeArr = [];
            _.map(oo.uploadedDocuments, (doc) => {
              assumeArr.push(GLOBAL_FILE_FETCH_URL.value + "/" + doc.fileName);
            });
            merchant.value.kyc.documents.push({
              documentName: oo.subDocumentType,
              documentType: oo.marsDocumentId,
              documentImage: assumeArr
            });
          }
        });
      });
    };

    const saveCurrentChanges = async () => {
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Saving data .."
      });

      try {
        const merchantData = {
          ...merchant.value,
          leadId: route.params.id,
          partnerInformation: viewBinding.value.partnersArr
        };

        await marsActions.MARS_DATA_SUBMIT_INTERNAL({ merchant: merchantData, action: 1 });
        
        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Saved successfully",
          icon: "thumb_up"
        });
        
        $q.loading.hide();
      } catch (error) {

        console.error("Error saving data:", error);
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
      await v$.value.$validate();
      
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
        spinnerColor: "purple-9",
        message: "Validating .."
      });

      try {
        const finalRequest = {
          action: 2,
          merchant: {
            ...merchant.value,
            leadId: route.params.id,
            leadDataEntryRemarks: leadDataEntryRemarks.value,
            holdPayment: holdPayment.value,
            partnerInformation: getPartnersVisiblity.value ? viewBinding.value.partnersArr : []
          }
        };

        // First save internally
        await marsActions.MARS_DATA_SUBMIT_INTERNAL(finalRequest);
        
        $q.loading.show({
          delay: 0,
          spinnerColor: "purple-9",
          message: "Saved.. Sending data to mars"
        });

        // Prepare data for external submission
        const externalData = {
          params: {
            merchant: {
              ...merchant.value,
              partnerInformation: getPartnersVisiblity.value ? viewBinding.value.partnersArr : []
            }
          },
          leadStatus: props.propLeadDeatils.leadStatus,
          refNumber: props.propLeadDeatils.merchantRefCode
        };

        // Remove internal fields
        delete externalData.params.merchant.leadId;
        delete externalData.params.merchant.leadDataEntryRemarks;
        delete externalData.params.merchant.holdPayment;
        delete externalData.params.merchant.companyInformation.constitutionName;

        // Submit to external API
        const response = await marsActions.MARS_DATA_SUBMIT_EXTERNAL(externalData);
        
        $q.loading.show({
          delay: 0,
          spinnerColor: "purple-9",
          message: "Great.. All set to go"
        });

        let feed_parameters;
        if (response.status == 204) {
          feed_parameters = {
            applicationNumber: props.propLeadDeatils.applicationNumber,
            merchantRefCode: props.propLeadDeatils.merchantRefCode
          };
        } else {
          feed_parameters = response.body;
        }

        // Update response in internal system
        await marsActions.MARS_DATA_EXTERNAL_SUBMIT_RESPONSE({
          request: feed_parameters,
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

        console.error("Error submitting form:", error);
        
        // Handle validation errors from MARS
        if (error.data?.errorDetails) {
          _.map(error.data.errorDetails, (actual) => {
            const splitted = actual.field.split("/");
            
            if (splitted[1]?.slice(0, 18) == "partnerInformation") {
              const findPartnersErrorIndex = actual.field.split("partnerInformation")[1]?.slice(1, 2);
              const computeSplitted = splitted[splitted.length - 1];
              
              if (findPartnersErrorIndex !== undefined && viewBinding.value.partnersArr[findPartnersErrorIndex]) {
                viewBinding.value.partnersArr[findPartnersErrorIndex][computeSplitted] = "";
              }
              error.value.partnerInformation = true;
            } else {
              const fieldPath = splitted[1];
              if (fieldPath && error.value.tab[fieldPath] !== undefined) {
                error.value.tab[fieldPath] = true;
              }
            }
          });
          
          $q.notify({
            color: "negative",
            position: "bottom",
            message: `${error.data.message}`,
            icon: "thumb_down"
          });
        } else {
          $q.notify({
            color: "negative",
            position: "bottom",
            message: `${error.data?.message || "Error submitting form"}`,
            icon: "thumb_down"
          });
        }
        
        $q.loading.hide();
      }
    };

    const commonDateFormat = (selectedDate) => {
      if (!selectedDate || selectedDate === "Invalid date") {
        return null;
      }
      return moment(selectedDate).format("YYYY-MM-DD");
    };

    const marsRequiredFormattingofGST = (val) => {
      merchant.value.businessInformation.gstId = val || null;
    };

    const autoCompleteError = (val1, val2) => {
      val1.$touch();
      val2.$touch();
      return val1.$anyError || val2.$anyError;
    };

    // Initialize component
    onMounted(() => {
      fetchAllDropdownValuesFromMARSapi(merchant.value.salesInformation.institutionCode);
      
      // Populate values from FOS
      merchant.value.salesInformation.applicationNumber = Math.floor(Date.now() / 1000 + 22 * 10);
      merchant.value.companyInformation.constitution = props.propLeadDeatils.merchantType.marsMappingId;
      merchant.value.companyInformation.constitutionName = props.propLeadDeatils.merchantType.merchantTypeName;
      
      const partnersTabEnabledItems = ['IN', 'PL', 'SP', 'PB'];
      showPartnerstab.value = partnersTabEnabledItems.includes(merchant.value.companyInformation.constitution);
      
      merchant.value.companyInformation.dbaName = props.propLeadDeatils.leadName;
      merchant.value.companyInformation.contactMobile = props.propLeadDeatils.contactNumber;
      merchant.value.companyInformation.contactName = props.propLeadDeatils.contactName;
      merchant.value.companyInformation.registeredAddress = props.propLeadDeatils.leadAddress;
      merchant.value.companyInformation.registeredPin = props.propLeadDeatils.pincode;
      merchant.value.paymentDetails.numberOfTerminals = props.propLeadDeatils.deviceCount;
      
      // Set MDR values
      if (getShortLeadInfo.value) {
        merchant.value.mdrPlan.domesticDebitUpTo2000.percentage = getShortLeadInfo.value.debitLessthanAmount;
        merchant.value.mdrPlan.domesticDebitAbove2000.percentage = getShortLeadInfo.value.debitGreaterthanAmount;
        merchant.value.mdrPlan.standardOrClassic.percentage = getShortLeadInfo.value.stdCC;
        merchant.value.mdrPlan.premiumOrPlatinum.percentage = getShortLeadInfo.value.premiumCC;
        merchant.value.mdrPlan.superPremiumOrSignature.percentage = getShortLeadInfo.value.superPremiumlCC;
        merchant.value.mdrPlan.commercialOrCorporate.percentage = getShortLeadInfo.value.corpCC;
        merchant.value.mdrPlan.internationalCreditCard.percentage = getShortLeadInfo.value.intlCC;
      }
      
      fetchAndCookDocuments();
    });

    return {
      // Refs
      stepper,
      currentStep,
      showPartnerstab,
      viewBinding,
      merchant,
      error,
      holdPayment,
      leadDataEntryRemarks,
      showDocumentPreview,
      
      // Options
      institutionCodeOptions,
      applicationTypeOptions,
      categoryTypeOptions,
      merchantTypeOptions,
      businessTypeOptions,
      constitutionOptions,
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
      chequeNumberValidation,
      bankInfoSwipePayment,
      bankInfoChequePayment,
      getStatementType,
      
      // Validation
      v$,
      
      // Methods
      toggleChequeImage,
      
      populateBankDetails,
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
      validatebeforeNavigate,
      fetchAllDropdownValuesFromMARSapi,
      saveCurrentChanges,
      finalFormSubmit,
      marsRequiredFormattingofGST,
      autoCompleteError
    };
  }
});
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