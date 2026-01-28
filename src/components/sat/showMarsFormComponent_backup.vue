<template>
  <div>
    <!-- Documents -->
    <div id="mainContainer" class="row">
      <!-- Documents proof -->
      <div id="leftSidePane" class="col-md-5 q-pa-xs largeCont" v-if="showDocumentPreview">
        <ViewLeadDocumentsDataEntryComponent 
          :prop-lead-document-information="propLeadDeatils.leadDocuments" 
          :prop-get-short-info="propLeadDeatils" 
        />
      </div>
      <!-- Document related form -->
      <div id="rightSidePane" class="col-md-7 q-pa-xs block relative">
        <q-stepper
          color="purple-9"
          ref="stepperRef"
          contracted
          alternative-labels
          header-nav
          :model-value="currentStep"
          @update:model-value="val => currentStep = val"
        >
          <!-- Step 1: Sales Information -->
          <q-step
            :name="1"
            title="Sales"
            subtitle="Info"
            :done="currentStep > 1"
            :error="salesInformationError"
            error-icon="warning"
          >
            <div class="row gutter-sm">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  @blur="v$.merchant.salesInformation.institutionCode.$touch()"
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
                  @blur="v$.merchant.salesInformation.applicationType.$touch()"
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
                  @blur="v$.merchant.salesInformation.applicationNumber.$touch()"
                  :error="v$.merchant.salesInformation.applicationNumber.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.applicationNumber"
                  label="Application Number*"
                  placeholder="Application Number*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.salesInformation.applicationDate.$touch()"
                  :error="v$.merchant.salesInformation.applicationDate.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.applicationDate"
                  type="date"
                  label="Application Date*"
                  placeholder="Application Date*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.salesInformation.aggreementDate.$touch()"
                  :error="v$.merchant.salesInformation.aggreementDate.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.aggreementDate"
                  type="date"
                  label="Agreement Date*"
                  placeholder="Agreement Date*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  @blur="v$.merchant.salesInformation.merchantType.$touch()"
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
                  @blur="v$.merchant.salesInformation.categoryType.$touch()"
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
                  @blur="v$.merchant.salesInformation.salesPersonCode.$touch()"
                  :error="v$.merchant.salesInformation.salesPersonCode.$error"
                  placeholder="Choose from the below*"
                  color="grey-9"
                  v-model="merchant.salesInformation.salesPersonCode"
                  label="Sales Person*"
                  :options="salesPersonOptions"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  @blur="v$.merchant.salesInformation.region.$touch()"
                  :error="v$.merchant.salesInformation.region.$error"
                  placeholder="Choose from the below*"
                  color="grey-9"
                  v-model="merchant.salesInformation.region"
                  label="Region*"
                  :options="regionOptions"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  @blur="v$.merchant.salesInformation.leadFrom.$touch()"
                  :error="v$.merchant.salesInformation.leadFrom.$error"
                  placeholder="Choose from the below*"
                  color="grey-9"
                  v-model="merchant.salesInformation.leadFrom"
                  label="Lead From*"
                  :options="leadFromOptions"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <p class="q-caption">Sharing Model</p>
                <div v-for="(item,index) in viewBinding.sharingModelCode" :key="index">
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
            <div v-if="merchant.salesInformation.sharingModelCode == 'T'" class="row gutter-sm q-my-xs">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  @blur="v$.merchant.salesInformation.sharingPartnerCode.$touch()"
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
                  @blur="v$.merchant.salesInformation.dailyFixedAmount.$touch()"
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
                  @blur="v$.merchant.salesInformation.loanDisbursementPercentage.$touch()"
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
                  @blur="v$.merchant.salesInformation.loanDisbursementAmount.$touch()"
                  :error="v$.merchant.salesInformation.loanDisbursementAmount.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.loanDisbursementAmount"
                  label="Loan disbursement value*"
                  type="number"
                  placeholder="Loan disbursement value*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.salesInformation.loanDisbursementDate.$touch()"
                  :error="v$.merchant.salesInformation.loanDisbursementDate.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.loanDisbursementDate"
                  type="date"
                  label="Disbursement Date*"
                  placeholder="Disbursement Date*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.salesInformation.tenureMonth.$touch()"
                  :error="v$.merchant.salesInformation.tenureMonth.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.tenureMonth"
                  label="Tenure (in months)*"
                  type="number"
                  placeholder="Tenure (in months)*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.salesInformation.tenureDay.$touch()"
                  :error="v$.merchant.salesInformation.tenureDay.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.tenureDay"
                  label="Tenure (in days)*"
                  type="number"
                  placeholder="Tenure (in days)*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.salesInformation.tenureStartDate.$touch()"
                  :error="v$.merchant.salesInformation.tenureStartDate.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.tenureStartDate"
                  type="date"
                  label="Start Date*"
                  placeholder="Tenure Start Date*"
                />
              </div>
            </div>

            <!-- M => MDR/cash@pos/rent -->
            <div v-if="merchant.salesInformation.sharingModelCode == 'M'" class="row gutter-sm q-my-xs">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  @blur="v$.merchant.salesInformation.sharingPartnerCode.$touch()"
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
                  @blur="v$.merchant.salesInformation.rentPercentage.$touch()"
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
                  @blur="v$.merchant.salesInformation.rentFixed.$touch()"
                  :error="v$.merchant.salesInformation.rentFixed.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.rentFixed"
                  label="Rent fixed*"
                  type="number"
                  placeholder="Rent fixed*"
                />
              </div>
            </div>

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
                @click="saveCurrentChanges"
              />
            </q-stepper-navigation>
          </q-step>

          <!-- Step 2: Company Details -->
          <q-step
            :name="2"
            title="Details"
            :done="currentStep > 2"
            :error="companyInformationError"
            error-icon="warning"
          >
            <div class="row gutter-sm">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.legalName.$touch()"
                  :error="v$.merchant.companyInformation.legalName.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.legalName"
                  label="Legal Name*"
                  placeholder="Legal Name*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.dbaName.$touch()"
                  :error="v$.merchant.companyInformation.dbaName.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.dbaName"
                  label="DBA Name*"
                  placeholder="DBA Name*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.registeredAddress.$touch()"
                  :error="v$.merchant.companyInformation.registeredAddress.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.registeredAddress"
                  label="Registered Address*"
                  placeholder="Registered Address*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.registeredCityRefCode.$touch()"
                  :error="v$.merchant.companyInformation.registeredCityRefCode.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.registeredCityName"
                  label="Registered city*"
                  placeholder="Start typing ..*"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.registeredStateRefCode.$touch()"
                  :error="v$.merchant.companyInformation.registeredStateRefCode.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.registeredStateName"
                  label="Registered state*"
                  placeholder="Start typing ..*"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.registeredPin.$touch()"
                  :error="v$.merchant.companyInformation.registeredPin.$error"
                  color="grey-9"
                  type="number"
                  v-model="merchant.companyInformation.registeredPin"
                  label="PIN*"
                  placeholder="PIN*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  @update:model-value="togglePartnersTab"
                  @blur="v$.merchant.companyInformation.constitution.$touch()"
                  :error="v$.merchant.companyInformation.constitution.$error"
                  placeholder="Choose from the below*"
                  color="grey-9"
                  v-model="merchant.companyInformation.constitution"
                  label="Type of business entity*"
                  :options="constitutionOptions"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.establishYear.$touch()"
                  :error="v$.merchant.companyInformation.establishYear.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.establishYear"
                  type="date"
                  label="Year of Establishment*"
                  placeholder="Year of Establishment*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  v-model="merchant.companyInformation.registerNumber"
                  label="Establish Number*"
                  placeholder="Establish Number*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  v-model="merchant.companyInformation.tin"
                  label="TIN*"
                  placeholder="TIN*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  v-model="merchant.companyInformation.pan"
                  label="Company PAN*"
                  placeholder="Company PAN*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  v-model="merchant.companyInformation.tan"
                  label="TAN"
                  placeholder="TAN"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  v-model="merchant.companyInformation.businessNature"
                  label="Nature of Business*"
                  placeholder="Nature of Business*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  placeholder="Choose from the below*"
                  color="grey-9"
                  v-model="merchant.companyInformation.businessType"
                  label="Type of Business*"
                  :options="businessTypeOptions"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.mcc.$touch()"
                  :error="v$.merchant.companyInformation.mcc.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.mccname"
                  label="MCC*"
                  placeholder="Start typing ..*"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.residentialAddress.$touch()"
                  :error="v$.merchant.companyInformation.residentialAddress.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.residentialAddress"
                  label="Residential Address*"
                  placeholder="Residential Address*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.residentialPin.$touch()"
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
                  @blur="v$.merchant.companyInformation.residentialCityRefCode.$touch()"
                  :error="v$.merchant.companyInformation.residentialCityRefCode.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.residentCityName"
                  label="City (type min 3 characters)*"
                  placeholder="Start typing ..*"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.residentialStateRefCode.$touch()"
                  :error="v$.merchant.companyInformation.residentialStateRefCode.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.residentStateName"
                  label="State (type min 3 characters)*"
                  placeholder="Start typing ..*"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.contactName.$touch()"
                  :error="v$.merchant.companyInformation.contactName.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.contactName"
                  label="Contact Name*"
                  placeholder="Contact Name*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.contactMobile.$touch()"
                  :error="v$.merchant.companyInformation.contactMobile.$error"
                  color="grey-9"
                  type="number"
                  v-model="merchant.companyInformation.contactMobile"
                  label="Contact mobile*"
                  placeholder="Contact Mobile*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  type="tel"
                  v-model="merchant.companyInformation.contactAlternateMobile"
                  label="Contact Alt Mobile"
                  placeholder="Contact Alt Mobile"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.contactPhone.$touch()"
                  :error="v$.merchant.companyInformation.contactPhone.$error"
                  color="grey-9"
                  type="tel"
                  v-model="merchant.companyInformation.contactPhone"
                  label="Contact Phone*"
                  placeholder="Contact Phone*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.contactEmail.$touch()"
                  :error="v$.merchant.companyInformation.contactEmail.$error"
                  color="grey-9"
                  type="email"
                  v-model="merchant.companyInformation.contactEmail"
                  label="Contact Email*"
                  placeholder="Contact Email*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <div class="q-caption">Statement type</div>
                <div class="group">
                  <q-radio
                    @blur="v$.merchant.companyInformation.statementType.$touch()"
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
                <p class="q-caption">Statement frequency</p>
                <div class="group">
                  <q-radio
                    @blur="v$.merchant.companyInformation.statementFrequency.$touch()"
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
                  v-model="merchant.companyInformation.statementEmail"
                  label="Statement Email"
                  placeholder="Statement Email"
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
                @click="saveCurrentChanges"
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

          <!-- Step 3: Partners -->
          <q-step
            v-if="showPartnerstab"
            :name="3"
            title="Partners"
            :done="currentStep > 3"
            :error="partnerInformationError"
            error-icon="warning"
          >
            <div v-for="(partner, index) in viewBinding.partnersArr" :key="index" class="row q-my-xs gutter-sm">
              <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="row group items-center">
                  <div class="col">
                    <span class="q-pa-sm bg-light text-dark">
                      <q-icon name="people" /> Partner 0{{ index + 1 }}
                    </span>
                  </div>
                  <div class="col-auto" v-if="viewBinding.partnersArr.length > 1">
                    <q-btn
                      round
                      icon="delete"
                      @click="removePartnerFromArr(index)"
                      color="negative"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.viewBinding.partnersArr.$each.$response.$data[index]?.name.$touch()"
                  :error="v$.viewBinding.partnersArr.$each.$response.$data[index]?.name.$error"
                  color="grey-9"
                  v-model="partner.name"
                  label="Name*"
                  placeholder="Name*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.viewBinding.partnersArr.$each.$response.$data[index]?.pan.$touch()"
                  :error="v$.viewBinding.partnersArr.$each.$response.$data[index]?.pan.$error"
                  color="grey-9"
                  v-model="partner.pan"
                  label="Pan*"
                  placeholder="Pan*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.viewBinding.partnersArr.$each.$response.$data[index]?.address.$touch()"
                  :error="v$.viewBinding.partnersArr.$each.$response.$data[index]?.address.$error"
                  color="grey-9"
                  v-model="partner.address"
                  label="Address*"
                  placeholder="Address*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.viewBinding.partnersArr.$each.$response.$data[index]?.pin.$touch()"
                  :error="v$.viewBinding.partnersArr.$each.$response.$data[index]?.pin.$error"
                  color="grey-9"
                  type="number"
                  v-model="partner.pin"
                  label="Pincode*"
                  placeholder="Pincode*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.viewBinding.partnersArr.$each.$response.$data[index]?.cityRefLabel.$touch()"
                  :error="v$.viewBinding.partnersArr.$each.$response.$data[index]?.cityRefLabel.$error"
                  color="grey-9"
                  v-model="partner.cityRefLabel"
                  label="City (type min 3 characters)*"
                  placeholder="Start typing ..*"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.viewBinding.partnersArr.$each.$response.$data[index]?.stateRefLabel.$touch()"
                  :error="v$.viewBinding.partnersArr.$each.$response.$data[index]?.stateRefLabel.$error"
                  color="grey-9"
                  v-model="partner.stateRefLabel"
                  label="State (type min 3 characters)*"
                  placeholder="Start typing ..*"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.viewBinding.partnersArr.$each.$response.$data[index]?.contactMobile.$touch()"
                  :error="v$.viewBinding.partnersArr.$each.$response.$data[index]?.contactMobile.$error"
                  color="grey-9"
                  type="tel"
                  v-model="partner.contactMobile"
                  label="Mobile*"
                  placeholder="Mobile*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.viewBinding.partnersArr.$each.$response.$data[index]?.contactEmail.$touch()"
                  :error="v$.viewBinding.partnersArr.$each.$response.$data[index]?.contactEmail.$error"
                  color="grey-9"
                  type="email"
                  v-model="partner.contactEmail"
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
                @click="saveCurrentChanges"
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
                @click="addMorePartnersSet"
                class="q-ma-xs"
                icon="add"
                label="Add More"
              />
            </q-stepper-navigation>
          </q-step>

          <!-- Step 4: Business Information -->
          <q-step
            :name="showPartnerstab ? 4 : 3"
            title="Business"
            subtitle="Info"
            :done="currentStep > (showPartnerstab ? 4 : 3)"
            :error="businessInformationError"
            error-icon="warning"
          >
            <div class="row gutter-sm">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  v-model="merchant.businessInformation.weekdayStartHour"
                  label="Weekday start hour"
                  placeholder="Weekday start hour"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  v-model="merchant.businessInformation.weekdayEndHour"
                  label="Weekday end hour"
                  placeholder="Weekday end hour"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  v-model="merchant.businessInformation.weekendStartHour"
                  label="Weekend start hour"
                  placeholder="Weekend start hour"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  v-model="merchant.businessInformation.weekendEndHour"
                  label="Weekend end hour"
                  placeholder="Weekend end hour"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  type="number"
                  v-model="merchant.businessInformation.lastTurnoverYear"
                  label="Last turnover year"
                  placeholder="Last turnover year"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  type="number"
                  v-model="merchant.businessInformation.lastTurnoverAmount"
                  label="Turnover during last year"
                  placeholder="Turnover during last year"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  type="number"
                  v-model="merchant.businessInformation.expectedCardBusiness"
                  label="Expected Card Business"
                  placeholder="Expected Card Business"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  type="number"
                  v-model="merchant.businessInformation.averageBillAmount"
                  label="Average Bill Amount"
                  placeholder="Average Bill Amount"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.businessInformation.gstId.$touch()"
                  :error="v$.merchant.businessInformation.gstId.$error"
                  color="grey-9"
                  v-model="merchant.businessInformation.gstId"
                  label="GST ID*"
                  placeholder="GST ID*"
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
                  type="number"
                  v-model="merchant.businessInformation.debitCardMdr"
                  label="Debit Card"
                  placeholder="Debit Card"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  type="number"
                  v-model="merchant.businessInformation.creditCardMdr"
                  label="Credit Card"
                  placeholder="Credit Card"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.businessInformation.memberSince.$touch()"
                  :error="v$.merchant.businessInformation.memberSince.$error"
                  color="grey-9"
                  v-model="merchant.businessInformation.memberSince"
                  type="date"
                  label="Member since*"
                  placeholder="Member since*"
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
                @click="saveCurrentChanges"
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

          <!-- Step 5: Payment Details -->
          <q-step
            :name="showPartnerstab ? 5 : 4"
            title="Payment"
            subtitle="Details"
            :done="currentStep > (showPartnerstab ? 5 : 4)"
            :error="paymentDetailsError"
            error-icon="warning"
          >
            <div class="row gutter-sm">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <p class="q-caption">Device Owned By</p>
                <div class="group">
                  <q-radio
                    @blur="v$.merchant.paymentDetails.deviceOwnedBy.$touch()"
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
                  @blur="v$.merchant.paymentDetails.installationFee.$touch()"
                  :error="v$.merchant.paymentDetails.installationFee.$error"
                  color="grey-9"
                  type="number"
                  v-model="merchant.paymentDetails.installationFee"
                  label="Installation Fee*"
                  placeholder="Installation Fee*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  @blur="v$.merchant.paymentDetails.terminalModeCode.$touch()"
                  :error="v$.merchant.paymentDetails.terminalModeCode.$error"
                  placeholder="Choose from the below"
                  color="grey-9"
                  v-model="merchant.paymentDetails.terminalModeCode"
                  label="Terminal Model*"
                  :options="terminalModelSet"
                />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input
                  color="grey-9"
                  type="number"
                  v-model="merchant.paymentDetails.numberOfTerminals"
                  label="No of Terminals*"
                  placeholder="No of Terminals*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <p class="q-caption">Cash @POS Enabled?</p>
                <div class="group">
                  <q-radio
                    @blur="v$.merchant.paymentDetails.cashAtPosEnabled.$touch()"
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
                  v-model="merchant.paymentDetails.rentalModeCode"
                  label="Rental Mode*"
                  :options="rentalModeOptions"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <p class="q-caption">Rental Type</p>
                <div class="group">
                  <q-radio
                    @blur="v$.merchant.paymentDetails.rentalType.$touch()"
                    :error="v$.merchant.paymentDetails.rentalType.$error"
                    v-for="(item,index) in rentalTypeOptions"
                    :key="index"
                    color="grey-9"
                    v-model="merchant.paymentDetails.rentalType"
                    :val="item.value"
                    :label="item.label"
                  />
                </div>
              </div>

              <div v-if="merchant.paymentDetails.rentalType == 'R'" class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.paymentDetails.gracePeriod.$touch()"
                  :error="v$.merchant.paymentDetails.gracePeriod.$error"
                  color="grey-9"
                  type="number"
                  v-model="merchant.paymentDetails.gracePeriod"
                  label="Grace period*"
                  placeholder="Grace period*"
                />
              </div>
              <div v-if="merchant.paymentDetails.rentalType == 'A'" class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.paymentDetails.advanceRentCollected.$touch()"
                  :error="v$.merchant.paymentDetails.advanceRentCollected.$error"
                  color="grey-9"
                  type="number"
                  v-model="merchant.paymentDetails.advanceRentCollected"
                  label="Advance Rent Collected*"
                  placeholder="Advance Rent Collected*"
                />
              </div>
              <div v-if="merchant.paymentDetails.rentalType == 'A'" class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.paymentDetails.noOfMonthRentPaidInAdvance.$touch()"
                  :error="v$.merchant.paymentDetails.noOfMonthRentPaidInAdvance.$error"
                  color="grey-9"
                  type="number"
                  v-model="merchant.paymentDetails.noOfMonthRentPaidInAdvance"
                  label="No. Of Month Rent Paid In Advance*"
                  placeholder="No. Of Month Rent Paid In Advance*"
                />
              </div>
              <div v-if="merchant.paymentDetails.rentalType == 'A'" class="col-md-6 col-sm-12 col-xs-12">
                <p class="q-caption">Advanced Rent Mode</p>
                <div class="group">
                  <q-radio
                    @blur="v$.merchant.paymentDetails.advanceRentMode.$touch()"
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
                  v-model="merchant.paymentDetails.devicePrice"
                  label="Device Price"
                  placeholder="Device Price"
                />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input
                  color="grey-9"
                  type="number"
                  v-model="merchant.paymentDetails.otherCharges"
                  label="Other Charges"
                  placeholder="Other Charges"
                />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input
                  color="grey-9"
                  type="number"
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
                @click="saveCurrentChanges"
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

          <!-- Step 6: Discount Rate -->
          <q-step
            :name="showPartnerstab ? 6 : 5"
            title="Discount"
            subtitle="Rate"
            :done="currentStep > (showPartnerstab ? 6 : 5)"
          >
            <!-- Discount Rate Content (truncated for brevity) -->
            <div class="row items-center">
              <div class="col-3">
                <div class="q-caption text-weight-medium">Domestic Debit Card below 2000</div>
              </div>
              <div class="col">
                <div class="q-caption text-weight-medium q-py-sm" align="center">Merchant Disc Fee</div>
                <div class="row group bg-green-2">
                  <div class="col">
                    <q-input color="grey-9" type="number" v-model="merchant.mdrPlan.domesticDebitUpTo2000.fixed" placeholder="Fixed" />
                  </div>
                  <div class="col">
                    <q-input
                      @blur="v$.merchant.mdrPlan.domesticDebitUpTo2000.percentage.$touch()"
                      :error="v$.merchant.mdrPlan.domesticDebitUpTo2000.percentage.$error"
                      color="grey-9"
                      type="number"
                      v-model="merchant.mdrPlan.domesticDebitUpTo2000.percentage"
                      placeholder="%"
                    />
                  </div>
                  <div class="col">
                    <q-input color="grey-9" type="number" v-model="merchant.mdrPlan.domesticDebitUpTo2000.minimum" placeholder="Max" />
                  </div>
                </div>
              </div>
              <div class="col" v-if="showOnlyIfSharingModelIsEnabled">
                <div class="q-caption text-weight-medium q-py-sm" align="center">Sharing Disc Fee</div>
                <div class="row group bg-yellow-2">
                  <div class="col">
                    <q-input color="grey-9" type="number" v-model="merchant.SharingDiscountFee.domesticDebitUpTo2000.fixed" placeholder="Fixed" />
                  </div>
                  <div class="col">
                    <q-input color="grey-9" type="number" v-model="merchant.SharingDiscountFee.domesticDebitUpTo2000.percentage" placeholder="%" />
                  </div>
                  <div class="col">
                    <q-input color="grey-9" type="number" v-model="merchant.SharingDiscountFee.domesticDebitUpTo2000.minimum" placeholder="Max" />
                  </div>
                </div>
              </div>
            </div>
            <!-- ... More discount rate rows ... -->
            
            <q-stepper-navigation>
              <q-btn
                color="primary"
                class="q-ma-xs"
                icon="check"
                @click="stepperRef.next()"
                label="Continue"
              />
              <q-btn
                color="amber-10"
                class="q-ma-xs"
                icon="save"
                label="Save Partial"
                @click="saveCurrentChanges"
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

          <!-- Step 7: Bank & Collection Details -->
          <q-step
            :name="showPartnerstab ? 7 : 6"
            title="Bank & Collection"
            subtitle="Details"
            :done="currentStep > (showPartnerstab ? 7 : 6)"
            :error="bankInformationError"
            error-icon="warning"
          >
            <div class="row q-mb-md gutter-sm items-center">
              <div class="col-md-12">
                <div class="q-title">Merchant Bank Details</div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
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
                  @blur="v$.merchant.bankInformation.bankDetails.branchName.$touch()"
                  :error="v$.merchant.bankInformation.bankDetails.branchName.$error"
                  color="grey-9"
                  v-model="merchant.bankInformation.bankDetails.branchName"
                  label="Branch Name*"
                  placeholder="Branch Name*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  placeholder="Choose from the below"
                  color="grey-9"
                  v-model="merchant.bankInformation.bankDetails.feeType"
                  label="Fee Type"
                  :options="feeTypeOptions"
                />
              </div>
              <div v-if="merchant.bankInformation.bankDetails.feeType == 'N' || merchant.bankInformation.bankDetails.feeType == 'S'" class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.bankInformation.bankDetails.settlementOrNeftFee.$touch()"
                  :error="v$.merchant.bankInformation.bankDetails.settlementOrNeftFee.$error"
                  color="grey-9"
                  type="number"
                  v-model="merchant.bankInformation.bankDetails.settlementOrNeftFee"
                  label="NEFT/Settlement Fee Inclusive of Tax*"
                  placeholder="NEFT/Settlement Fee Inclusive of Tax*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.bankInformation.bankDetails.micr.$touch()"
                  :error="v$.merchant.bankInformation.bankDetails.micr.$error"
                  color="grey-9"
                  type="number"
                  v-model="merchant.bankInformation.bankDetails.micr"
                  label="MICR*"
                  placeholder="MICR*"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.bankInformation.bankDetails.bankName.$touch()"
                  :error="v$.merchant.bankInformation.bankDetails.bankName.$error"
                  color="grey-9"
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
                  @blur="v$.merchant.bankInformation.bankDetails.bankCityName.$touch()"
                  :error="v$.merchant.bankInformation.bankDetails.bankCityName.$error"
                  color="grey-9"
                  v-model="merchant.bankInformation.bankDetails.bankCityName"
                  label="City (type min 3 characters)*"
                  placeholder="Start typing ..*"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.bankInformation.bankDetails.bankStateName.$touch()"
                  :error="v$.merchant.bankInformation.bankDetails.bankStateName.$error"
                  color="grey-9"
                  v-model="merchant.bankInformation.bankDetails.bankStateName"
                  label="State (type min 3 characters)*"
                  placeholder="Start typing ..*"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
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
                  @blur="v$.merchant.bankInformation.bankDetails.accountNumber.$touch()"
                  :error="v$.merchant.bankInformation.bankDetails.accountNumber.$error"
                  color="grey-9"
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
                <div class="q-title">Payment Collection Details</div>
              </div>
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-4 col-sm-12 col-xs-12">
                    <q-input
                      color="grey-9"
                      v-model="merchant.bankInformation.collectionDetails.swipeAmount"
                      label="Swipe Amount*"
                      placeholder="Swipe Amount*"
                    />
                  </div>
                  <div class="col-md-4 col-sm-12">
                    <q-input
                      color="grey-9"
                      v-model="merchant.bankInformation.collectionDetails.collectedDate"
                      type="date"
                      label="Swipe Date*"
                      placeholder="Swipe Date*"
                    />
                  </div>
                  <div class="col-md-4 col-sm-12 col-xs-12">
                    <q-input
                      color="grey-9"
                      v-model="merchant.bankInformation.collectionDetails.swipeTerminal"
                      label="Swiped on the terminal of*"
                      placeholder="Swiped on the terminal of*"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div>OR</div>
              </div>
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-3 col-sm-12 col-xs-12">
                    <q-input
                      color="grey-9"
                      v-model="merchant.bankInformation.collectionDetails.chequeAmount"
                      label="Cheque Amount*"
                      placeholder="Cheque Amount*"
                    />
                  </div>
                  <div class="col-md-3 col-sm-12">
                    <q-input
                      color="grey-9"
                      v-model="merchant.bankInformation.collectionDetails.chequeDate"
                      type="date"
                      label="Cheque Date*"
                      placeholder="Cheque Date*"
                    />
                  </div>
                  <div class="col-md-3 col-sm-12 col-xs-12">
                    <q-input
                      color="grey-9"
                      v-model="merchant.bankInformation.collectionDetails.chequeDepositedDate"
                      type="date"
                      label="Cheque Deposited Date*"
                      placeholder="Cheque Deposited Date*"
                    />
                  </div>
                  <div class="col-md-3 col-sm-12 col-xs-12">
                    <q-input
                      color="grey-9"
                      v-model="merchant.bankInformation.collectionDetails.chequeNumber"
                      label="Cheque/UTR No*"
                      placeholder="Cheque/UTR No*"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
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
                @click="finalFormSubmit"
                label="Submit"
              />
              <q-btn
                color="amber-10"
                class="q-ma-xs"
                icon="save"
                label="Save Partial"
                @click="saveCurrentChanges"
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
import { defineComponent, ref, reactive, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, requiredIf, alphaNum, integer, minLength, maxLength, email, maxValue, minValue } from '@vuelidate/validators';
import { date } from 'quasar';
import _ from 'lodash';
import ViewLeadDocumentsDataEntryComponent from './viewLeadDocumentsDataEntryComponent.vue';

export default defineComponent({
  name: 'LeadDataEntry',
  components: {
    ViewLeadDocumentsDataEntryComponent
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
    const stepperRef = ref(null);
    const currentStep = ref(1);

    // Reactive state
    const showPartnerstab = ref(false);
    const salesInformationError = ref(false);
    const companyInformationError = ref(false);
    const businessInformationError = ref(false);
    const partnerInformationError = ref(false);
    const paymentDetailsError = ref(false);
    const bankInformationError = ref(false);
    const showDocumentPreview = ref(true);

    // View binding data
    const viewBinding = reactive({
      sharingModelCode: [
        {
          label: "No sharing",
          value: "N"
        },
        {
          label: "Transaction value model",
          value: "T"
        },
        {
          label: "MDR/cash@pos/rent",
          value: "M"
        }
      ],
      statementType: [
        {
          label: "E-Statement",
          value: "E"
        },
        {
          label: "Paper statement",
          value: "P"
        }
      ],
      statementFrequency: [
        {
          label: "Daily",
          value: "D"
        },
        {
          label: "Monthly",
          value: "M"
        },
        {
          label: "Quarterly",
          value: "Q"
        },
        {
          label: "Half yearly",
          value: "H"
        },
        {
          label: "Yearly",
          value: "Y"
        },
        {
          label: "None",
          value: "N"
        }
      ],
      partnersArr: [
        {
          name: "",
          address: "",
          pan: "",
          pin: 600072,
          cityRefCode: 1,
          cityRefLabel: "",
          stateRefCode: 1,
          stateRefLabel: "",
          contactMobile: "",
          contactEmail: ""
        }
      ]
    });

    // Main merchant data structure
    const merchant = reactive({
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
        leadFrom: "IOB",
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
        gstId: "",
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
        rentalModeCode: "S",
        rentalType: "A",
        advanceRentCollected: "",
        advanceRentMode: "NEFT",
        noOfMonthRentPaidInAdvance: "",
        gracePeriod: "",
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
      mdrPlan: {
        code: 1,
        domesticDebitUpTo2000: {
          fixed: 0.0,
          percentage: 0.0,
          minimum: 0.0
        },
        domesticDebitAbove2000: {
          fixed: 0.0,
          percentage: 0.0,
          minimum: 0.0
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
          percentage: 0.0,
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
        masterPass: {
          fixed: 0,
          percentage: 0,
          minimum: 0
        },
        cashAtPos: {
          fixed: 0,
          percentage: 0,
          minimum: 0
        }
      }
    });

    // Computed properties
    const getTransctionValueModel = computed(() => {
      return merchant.salesInformation.sharingModelCode == "T";
    });

    const getCashAtPos = computed(() => {
      return merchant.salesInformation.sharingModelCode == "M";
    });

    const getPartnersVisiblity = computed(() => {
      return merchant.companyInformation.constitution == "PL";
    });

    const getRentalTypeVisibilityForRental = computed(() => {
      return merchant.paymentDetails.rentalType == "R";
    });

    const getRentalTypeVisibilityForAdvanced = computed(() => {
      return merchant.paymentDetails.rentalType == "A";
    });

    const getfeeTypeForSettlementVisibility = computed(() => {
      return merchant.bankInformation.bankDetails.feeType == "N" ||
        merchant.bankInformation.bankDetails.feeType == "S";
    });

    const showOnlyIfSharingModelIsEnabled = computed(() => {
      return merchant.salesInformation.sharingModelCode != "N";
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
            minValue: minValue(0)
          },
          loanDisbursementPercentage: {
            required: requiredIf(() => getTransctionValueModel.value),
            maxValue: maxValue(100)
          },
          loanDisbursementAmount: {
            required: requiredIf(() => getTransctionValueModel.value),
            minValue: minValue(0)
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
            integer,
            minValue: minValue(0)
          },
          rentFixed: {
            required: requiredIf(() => getCashAtPos.value),
            integer,
            minValue: minValue(0)
          }
        },
        companyInformation: {
          legalName: { required },
          dbaName: { required },
          registeredAddress: { required },
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
          constitution: { required },
          establishYear: { required },
          mccname: { required },
          mcc: { required },
          residentialAddress: { required },
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
          contactName: { required },
          contactMobile: {
            required,
            minLength: minLength(10),
            maxLength: maxLength(10)
          },
          contactPhone: {
            required,
            minLength: minLength(12),
            maxLength: maxLength(12)
          },
          contactEmail: {
            required,
            email
          },
          statementType: { required },
          statementFrequency: { required }
        },
        businessInformation: {
          gstId: {
            required,
            alphaNum
          },
          memberSince: { required }
        },
        paymentDetails: {
          installationFee: {
            required,
            minValue: minValue(1)
          },
          terminalModeCode: { required },
          deviceOwnedBy: { required },
          cashAtPosEnabled: { required },
          rentalType: { required },
          advanceRentCollected: {
            required: requiredIf(() => getRentalTypeVisibilityForAdvanced.value),
            minValue: minValue(0)
          },
          advanceRentMode: {
            required: requiredIf(() => getRentalTypeVisibilityForAdvanced.value)
          },
          noOfMonthRentPaidInAdvance: {
            required: requiredIf(() => getRentalTypeVisibilityForAdvanced.value),
            minValue: minValue(0)
          },
          gracePeriod: {
            required: requiredIf(() => getRentalTypeVisibilityForRental.value),
            minValue: minValue(0)
          }
        },
        bankInformation: {
          bankDetails: {
            ifsc: {
              required,
              alphaNum
            },
            micr: {
              required,
              alphaNum
            },
            branchName: { required },
            bankName: { required },
            bankCityName: { required },
            bankCityRefCode: {
              required,
              integer
            },
            accountNumber: {
              required,
              integer
            },
            bankStateName: { required },
            bankStateRefCode: {
              required,
              integer
            },
            paymentMode: { required },
            accountType: { required },
            settlementOrNeftFee: {
              required: requiredIf(() => getfeeTypeForSettlementVisibility.value),
              integer,
              maxValue: maxValue(999),
              minValue: minValue(0)
            }
          }
        },
        mdrPlan: {
          domesticDebitUpTo2000: {
            fixed: {
              minValue: minValue(0),
              required
            },
            percentage: {
              required,
              maxValue: maxValue(100)
            },
            minimum: {
              minValue: minValue(0),
              required
            }
          },
          domesticDebitAbove2000: {
            fixed: {
              minValue: minValue(0),
              required
            },
            percentage: {
              maxValue: maxValue(100),
              required
            },
            minimum: {
              minValue: minValue(0),
              required
            }
          },
          standardOrClassic: {
            fixed: {
              minValue: minValue(0),
              required
            },
            percentage: {
              maxValue: maxValue(100),
              required
            },
            minimum: {
              minValue: minValue(0),
              required
            }
          },
          premiumOrPlatinum: {
            fixed: {
              minValue: minValue(0),
              required
            },
            percentage: {
              maxValue: maxValue(100),
              required
            },
            minimum: {
              minValue: minValue(0),
              required
            }
          },
          superPremiumOrSignature: {
            fixed: {
              minValue: minValue(0),
              required
            },
            percentage: {
              maxValue: maxValue(100),
              required
            },
            minimum: {
              minValue: minValue(0),
              required
            }
          },
          commercialOrCorporate: {
            fixed: {
              minValue: minValue(0),
              required
            },
            percentage: {
              maxValue: maxValue(100),
              required
            },
            minimum: {
              minValue: minValue(0),
              required
            }
          },
          internationalDebitCard: {
            fixed: {
              minValue: minValue(0),
              required
            },
            percentage: {
              maxValue: maxValue(100),
              required
            },
            minimum: {
              minValue: minValue(0),
              required
            }
          },
          internationalCreditCard: {
            fixed: {
              minValue: minValue(0),
              required
            },
            percentage: {
              maxValue: maxValue(100),
              required
            },
            minimum: {
              minValue: minValue(0),
              required
            }
          },
          onus: {
            fixed: {
              minValue: minValue(0),
              required
            },
            percentage: {
              maxValue: maxValue(100),
              required
            },
            minimum: {
              minValue: minValue(0),
              required
            }
          },
          mVisa: {
            fixed: {
              minValue: minValue(0),
              required
            },
            percentage: {
              maxValue: maxValue(100),
              required
            },
            minimum: {
              minValue: minValue(0),
              required
            }
          },
          masterPass: {
            fixed: {
              minValue: minValue(0),
              required
            },
            percentage: {
              maxValue: maxValue(100),
              required
            },
            minimum: {
              minValue: minValue(0),
              required
            }
          },
          cashAtPos: {
            fixed: {
              minValue: minValue(0),
              required
            },
            percentage: {
              maxValue: maxValue(100),
              required
            },
            minimum: {
              minValue: minValue(0),
              required
            }
          }
        },
        SharingDiscountFee: {
          domesticDebitUpTo2000: {
            fixed: {
              minValue: minValue(0),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            percentage: {
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value),
              maxValue: maxValue(100)
            },
            minimum: {
              minValue: minValue(0),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            }
          },
          domesticDebitAbove2000: {
            fixed: {
              minValue: minValue(0),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            percentage: {
              maxValue: maxValue(100),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            minimum: {
              minValue: minValue(0),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            }
          },
          standardOrClassic: {
            fixed: {
              minValue: minValue(0),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            percentage: {
              maxValue: maxValue(100),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            minimum: {
              minValue: minValue(0),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            }
          },
          premiumOrPlatinum: {
            fixed: {
              minValue: minValue(0),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            percentage: {
              maxValue: maxValue(100),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            minimum: {
              minValue: minValue(0),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            }
          },
          superPremiumOrSignature: {
            fixed: {
              minValue: minValue(0),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            percentage: {
              maxValue: maxValue(100),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            minimum: {
              minValue: minValue(0),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            }
          },
          commercialOrCorporate: {
            fixed: {
              minValue: minValue(0),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            percentage: {
              maxValue: maxValue(100),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            minimum: {
              minValue: minValue(0),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            }
          },
          internationalDebitCard: {
            fixed: {
              minValue: minValue(0),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            percentage: {
              maxValue: maxValue(100),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            minimum: {
              minValue: minValue(0),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            }
          },
          internationalCreditCard: {
            fixed: {
              minValue: minValue(0),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            percentage: {
              maxValue: maxValue(100),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            minimum: {
              minValue: minValue(0),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            }
          },
          onus: {
            fixed: {
              minValue: minValue(0),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            percentage: {
              maxValue: maxValue(100),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            minimum: {
              minValue: minValue(0),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            }
          },
          mVisa: {
            fixed: {
              minValue: minValue(0),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            percentage: {
              maxValue: maxValue(100),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            minimum: {
              minValue: minValue(0),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            }
          },
          masterPass: {
            fixed: {
              minValue: minValue(0),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            percentage: {
              maxValue: maxValue(100),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            minimum: {
              minValue: minValue(0),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            }
          },
          cashAtPos: {
            fixed: {
              minValue: minValue(0),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            percentage: {
              maxValue: maxValue(100),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            },
            minimum: {
              minValue: minValue(0),
              required: requiredIf(() => showOnlyIfSharingModelIsEnabled.value)
            }
          }
        }
      },
      viewBinding: {
        partnersArr: {
          required: requiredIf(() => getPartnersVisiblity.value),
          $each: {
            name: { required },
            address: { required },
            pan: { required: true },
            pin: {
              required,
              minLength: minLength(6),
              maxLength: maxLength(7)
            },
            stateRefCode: {
              required,
              integer
            },
            stateRefLabel: { required },
            cityRefCode: {
              required,
              integer
            },
            cityRefLabel: { required },
            contactMobile: {
              required,
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

    // Dropdown options
    const institutionCodeOptions = ref([
      {
        label: "GPRS",
        value: 3
      }
    ]);

    const applicationTypeOptions = ref([
      {
        label: "Digital",
        value: "D"
      },
      {
        label: "Non Digital",
        value: "ND"
      }
    ]);

    const categoryTypeOptions = ref([
      {
        label: "Small",
        value: "S"
      },
      {
        label: "Other",
        value: "O"
      }
    ]);

    const merchantTypeOptions = ref([
      {
        label: "Group Merchant",
        value: "GM"
      },
      {
        label: "Merchant Outlet",
        value: "MO"
      },
      {
        label: "Merchant",
        value: "M"
      }
    ]);

    const businessTypeOptions = ref([
      {
        label: "Rented",
        value: "R"
      },
      {
        label: "Owned",
        value: "O"
      },
      {
        label: "Leased",
        value: "L"
      }
    ]);

    const constitutionOptions = ref([
      {
        label: "Individuals",
        value: "IN"
      },
      {
        label: "Partnership/LLP",
        value: "PL"
      },
      {
        label: "Sole Proprietorship",
        value: "SP"
      },
      {
        label: "Public/Pvt.Ltd",
        value: "PB"
      },
      {
        label: "Trust",
        value: "TR"
      },
      {
        label: "Society",
        value: "SO"
      },
      {
        label: "Other",
        value: "OT"
      }
    ]);

    const deviceOwnedByOptions = ref([
      {
        label: "Bijlipay",
        value: "B"
      },
      {
        label: "Merchant",
        value: "M"
      }
    ]);

    const cashAtPosEnabledOptions = ref([
      {
        label: "Yes",
        value: "Y"
      },
      {
        label: "No",
        value: "N"
      }
    ]);

    const rentalTypeOptions = ref([
      {
        label: "Advanced",
        value: "A"
      },
      {
        label: "Regular",
        value: "R"
      }
    ]);

    const rentalModeOptions = ref([
      {
        label: "Standing instructions",
        value: "S"
      },
      {
        label: "Normal",
        value: "N"
      }
    ]);

    const advanceRentModeOptions = ref([
      {
        label: "Card",
        value: "Card"
      },
      {
        label: "Cheque",
        value: "Cheque"
      },
      {
        label: "NEFT",
        value: "NEFT"
      },
      {
        label: "IMPS",
        value: "IMPS"
      },
      {
        label: "Cash",
        value: "Cash"
      }
    ]);

    const accountTypeOptions = ref([
      {
        label: "Saving account",
        value: "S"
      },
      {
        label: "Current account",
        value: "C"
      },
      {
        label: "Overdraft account",
        value: "O"
      },
      {
        label: "Cash credit account",
        value: "R"
      }
    ]);

    const feeTypeOptions = ref([
      {
        label: "NEFT",
        value: "N"
      },
      {
        label: "Settlement",
        value: "S"
      },
      {
        label: "None",
        value: "X"
      }
    ]);

    const paymnentModeOptions = ref([
      {
        label: "Direct credit",
        value: "D"
      },
      {
        label: "NEFT",
        value: "N"
      },
      {
        label: "IMPS",
        value: "I"
      }
    ]);

    // Dynamic dropdowns
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

    // Methods
    const togglePartnersTab = (value) => {
      showPartnerstab.value = value === "PL";
    };

    const addMorePartnersSet = () => {
      viewBinding.partnersArr.push({
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
      });
    };

    const removePartnerFromArr = (index) => {
      viewBinding.partnersArr.splice(index, 1);
    };

    const validatebeforeNavigate = (stepName) => {
      if (stepName === 'salesInformation') {
        v$.value.merchant.salesInformation.$touch();
        if (v$.value.merchant.salesInformation.$error) {
          $q.notify('Please review fields again.');
        } else {
          if (merchant.salesInformation.categoryType == "S") {
            merchant.mdrPlan.code = 44;
          } else {
            merchant.mdrPlan.code = 45;
          }
          salesInformationError.value = false;
          stepperRef.value.next();
        }
      } else if (stepName === 'companyInformation') {
        v$.value.merchant.companyInformation.$touch();
        if (v$.value.merchant.companyInformation.$error) {
          $q.notify('Please review fields again.');
        } else {
          companyInformationError.value = false;
          stepperRef.value.next();
        }
      } else if (stepName === 'partners') {
        v$.value.viewBinding.partnersArr.$touch();
        if (v$.value.viewBinding.partnersArr.$error) {
          $q.notify('Please review fields again.');
        } else {
          partnerInformationError.value = false;
          stepperRef.value.next();
        }
      } else if (stepName === 'businessInformation') {
        v$.value.merchant.businessInformation.$touch();
        if (v$.value.merchant.businessInformation.$error) {
          $q.notify('Please review fields again.');
        } else {
          businessInformationError.value = false;
          stepperRef.value.next();
        }
      } else if (stepName === 'paymentDetails') {
        v$.value.merchant.paymentDetails.$touch();
        if (v$.value.merchant.paymentDetails.$error) {
          $q.notify('Please review fields again.');
        } else {
          paymentDetailsError.value = false;
          stepperRef.value.next();
        }
      }
    };

    const COMMON_FILTER_FUNCTION = (arraySet, terms) => {
      return _.filter(arraySet, function(oo) {
        return (
          oo.label.toLowerCase().includes(terms.toLowerCase()) ||
          oo.value.toString().includes(terms.toString())
        );
      });
    };

    const populateBankDetails = async () => {
      try {
        const response = await store.dispatch('mars_ifsc/IFSC_FROM_MARS', merchant.bankInformation.bankDetails.ifsc);
        if (response?.status == 200) {
          merchant.bankInformation.bankDetails.bankName = response.data?.bankName || '';
          merchant.bankInformation.bankDetails.branchName = response.data?.branchName || '';
          merchant.bankInformation.bankDetails.micr = response.data?.MICR || '';
        } else {
          $q.notify({
            color: 'negative',
            position: 'bottom-left',
            message: 'Invalid IFSC code',
            icon: 'clear'
          });
          merchant.bankInformation.bankDetails.bankName = '';
          merchant.bankInformation.bankDetails.branchName = '';
          merchant.bankInformation.bankDetails.micr = '';
        }
      } catch (error) {

        console.error('Error fetching IFSC details:', error);
        $q.notify({
          color: 'negative',
          position: 'bottom-left',
          message: 'Error fetching bank details',
          icon: 'clear'
        });
      }
    };

    const fetchAllDropdownValuesFromMARSapi = async (institutionCode) => {
      $q.loading.show({
        delay: 0,
        spinnerColor: 'purple-9'
      });

      try {
        // Fetch regions
        await store.dispatch('mars_regions/REGION_FROM_MARS', institutionCode);
        const regions = store.getters['mars_regions/regionsFromMars']?.items?.map(oo => ({
          label: oo.name,
          value: oo.code
        })) || [];
        regionOptions.value = regions;

        // Fetch sharing partners
        await store.dispatch('mars_sharingPartner/SHARING_PARTNER_FROM_MARS', institutionCode);
        const sharingPartner = store.getters['mars_sharingPartner/sharingPartnerFromMars']?.items?.map(oo => ({
          label: oo.name,
          value: oo.code
        })) || [];
        sharingPartnerOptions.value = sharingPartner;

        // Fetch lead from options
        await store.dispatch('mars_leadFrom/LEAD_FROM_FROM_MARS', institutionCode);
        const leadFrom = store.getters['mars_leadFrom/leadFromInfoFromMars']?.items?.map(oo => ({
          label: oo.name,
          value: oo.name
        })) || [];
        leadFromOptions.value = leadFrom;

        // Fetch sales persons
        await store.dispatch('mars_salesPerson/SALES_PERSON_FROM_MARS', institutionCode);
        const salesPerson = store.getters['mars_salesPerson/salesPersonFromMars']?.items?.map(oo => ({
          label: oo.name,
          value: oo.code
        })) || [];
        salesPersonOptions.value = salesPerson;

        // Fetch cities
        await store.dispatch('mars_city/CITY_FROM_MARS');
        const city = store.getters['mars_city/cityFromMars']?.items?.map(oo => ({
          label: oo.name,
          value: oo.code
        })) || [];
        cityOptions.value = city;

        // Fetch states
        await store.dispatch('mars_state/STATE_FROM_MARS');
        const stateArr = store.getters['mars_state/stateFromMars']?.items?.map(oo => ({
          label: oo.name,
          value: oo.code
        })) || [];
        stateOptions.value = stateArr;

        // Fetch MCC
        await store.dispatch('mars_mcc/MCC_FROM_MARS');
        const mccSubArr = store.getters['mars_mcc/mccFromMars']?.items?.map(oo => ({
          label: oo.code + '-' + oo.name,
          value: oo.code
        })) || [];
        mccSearchSet.value = mccSubArr;

        // Fetch device models
        await store.dispatch('mars_deviceModel/DEVICE_MODEL_FROM_MARS', institutionCode);
        const terminalModelArr = store.getters['mars_deviceModel/deviceModelFromMars']?.items?.map(oo => ({
          label: oo.name,
          value: oo.code
        })) || [];
        terminalModelSet.value = terminalModelArr;

        // Fetch rental plans
        await store.dispatch('mars_rentalPlans/RENTAL_PLAN_FROM_MARS', institutionCode);
        const rentalPlan = store.getters['mars_rentalPlans/rentalPlanFromMars']?.items?.map(oo => ({
          label: oo.name,
          value: oo.code
        })) || [];
        rentalPlanSet.value = rentalPlan;

        // Fetch bank list
        await store.dispatch('mars_bankList/BANK_LIST_FROM_MARS', institutionCode);
        const bankList = store.getters['mars_bankList/bankListFromMars']?.bankNames?.map(oo => ({
          label: oo,
          value: oo
        })) || [];
        bankListSet.value = bankList;

        // Load saved data if applicable
        if (props.propLeadDeatils.marsFormSubmitAction == 1 || props.propLeadDeatils.marsFormSubmitAction == 2) {
          await store.dispatch('mars_dataSubmit/FETCH_SAVED_DATA_FROM_OWN_DB', {
            leadId: router.currentRoute.value.params.id
          });
          
          const savedData = store.getters['mars_dataSubmit/marsSavedDataFromInternal'];
          if (savedData) {
            Object.assign(merchant.salesInformation, savedData.salesInformation || {});
            Object.assign(merchant.companyInformation, savedData.companyInformation || {});
            Object.assign(merchant.businessInformation, savedData.businessInformation || {});
            Object.assign(merchant.paymentDetails, savedData.paymentDetails || {});
            Object.assign(merchant.bankInformation, savedData.bankInformation || {});
            Object.assign(merchant.mdrPlan, savedData.mdrPlan || {});
            
            if (savedData.partnerInformation) {
              viewBinding.partnersArr = savedData.partnerInformation;
            }
            
            if (savedData.SharingDiscountFee) {
              Object.assign(merchant.SharingDiscountFee, savedData.SharingDiscountFee);
            }
            
            showPartnerstab.value = merchant.companyInformation.constitution == "PL";
          }
        }

        // Populate values from FOS
        merchant.salesInformation.applicationNumber = props.propLeadDeatils.id || '';
        merchant.companyInformation.dbaName = props.propLeadDeatils.leadName || '';
        merchant.companyInformation.contactName = props.propLeadDeatils.leadName || '';

        // Set MDR percentages from lead info
        const leadInfo = store.getters['SatLeadValidation/getShortLeadInfo'];
        if (leadInfo) {
          merchant.mdrPlan.domesticDebitUpTo2000.percentage = leadInfo.debitLessthanAmount || 0;
          merchant.mdrPlan.domesticDebitAbove2000.percentage = leadInfo.debitGreaterthanAmount || 0;
          merchant.mdrPlan.standardOrClassic.percentage = leadInfo.stdCC || 0;
          merchant.mdrPlan.premiumOrPlatinum.percentage = leadInfo.premiumCC || 0;
          merchant.mdrPlan.superPremiumOrSignature.percentage = leadInfo.superPremiumlCC || 0;
          merchant.mdrPlan.commercialOrCorporate.percentage = leadInfo.corpCC || 0;
          merchant.mdrPlan.internationalCreditCard.percentage = leadInfo.intlCC || 0;
        }

        $q.loading.hide();
      } catch (error) {

        console.error('Error fetching dropdown values:', error);
        $q.loading.hide();
        $q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'Error loading form data',
          icon: 'error'
        });
      }
    };

    const saveCurrentChanges = async () => {
      $q.loading.show({
        delay: 0,
        spinnerColor: 'purple-9',
        message: 'Saving data ..'
      });

      try {
        const submitData = {
          merchant: { ...merchant },
          leadId: router.currentRoute.value.params.id,
          partnerInformation: viewBinding.partnersArr,
          action: 1
        };

        await store.dispatch('mars_dataSubmit/MARS_DATA_SUBMIT_INTERNAL', submitData);
        
        $q.loading.hide();
        $q.notify({
          color: 'positive',
          position: 'bottom',
          message: 'Saved successfully',
          icon: 'thumb_up'
        });
      } catch (error) {

        console.error('Error saving data:', error);
        $q.loading.hide();
        $q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'Error saving data. Please try again.',
          icon: 'thumb_down'
        });
      }
    };

    const finalFormSubmit = async () => {
      v$.value.$touch();
      if (v$.value.$error) {
        $q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'Please fill all mandatory fields',
          icon: 'info'
        });
        return;
      }

      $q.loading.show({
        delay: 0,
        spinnerColor: 'purple-9',
        message: 'Validating ..'
      });

      try {
        const finalRequest = {
          merchant: { ...merchant },
          leadId: router.currentRoute.value.params.id,
          action: 2
        };

        if (merchant.companyInformation.constitution == "PL") {
          finalRequest.merchant.partnerInformation = viewBinding.partnersArr;
        } else {
          finalRequest.merchant.partnerInformation = [];
        }

        // Format dates
        const formatDate = (dateString) => {
          if (!dateString) return "00/00/0000";
          try {
            return date.formatDate(new Date(dateString), 'DD/MM/YYYY');
          } catch {
            return "00/00/0000";
          }
        };

        finalRequest.merchant.salesInformation.applicationDate = formatDate(finalRequest.merchant.salesInformation.applicationDate);
        finalRequest.merchant.salesInformation.aggreementDate = formatDate(finalRequest.merchant.salesInformation.aggreementDate);
        finalRequest.merchant.salesInformation.loanDisbursementDate = formatDate(finalRequest.merchant.salesInformation.loanDisbursementDate);
        finalRequest.merchant.salesInformation.tenureStartDate = formatDate(finalRequest.merchant.salesInformation.tenureStartDate);
        finalRequest.merchant.companyInformation.establishYear = formatDate(finalRequest.merchant.companyInformation.establishYear);
        finalRequest.merchant.bankInformation.collectionDetails.chequeDepositedDate = formatDate(finalRequest.merchant.bankInformation.collectionDetails.chequeDepositedDate);
        finalRequest.merchant.bankInformation.collectionDetails.collectedDate = formatDate(finalRequest.merchant.bankInformation.collectionDetails.collectedDate);
        finalRequest.merchant.bankInformation.collectionDetails.chequeDate = formatDate(finalRequest.merchant.bankInformation.collectionDetails.chequeDate);
        finalRequest.merchant.businessInformation.memberSince = formatDate(finalRequest.merchant.businessInformation.memberSince);

        // Save internally first
        await store.dispatch('mars_dataSubmit/MARS_DATA_SUBMIT_INTERNAL', finalRequest);

        $q.loading.show({
          delay: 0,
          spinnerColor: 'purple-9',
          message: 'Saved.. Sending data to MARS'
        });

        // Send to external MARS
        const externalRequest = { merchant: finalRequest.merchant };
        const externalResponse = await store.dispatch('mars_dataSubmit/MARS_DATA_SUBMIT_EXTERNAL', externalRequest);

        $q.loading.show({
          delay: 0,
          spinnerColor: 'purple-9',
          message: 'Great.. All set to go'
        });

        // Save external response
        await store.dispatch('mars_dataSubmit/MARS_DATA_EXTERNAL_SUBMIT_RESPONSE', {
          request: externalResponse,
          leadId: router.currentRoute.value.params.id
        });

        $q.notify({
          color: 'positive',
          position: 'bottom',
          message: 'Successfully submitted to MARS',
          icon: 'thumb_up'
        });

        router.push('/sat/lead/validation');
        $q.loading.hide();
      } catch (error) {

        console.error('Error submitting form:', error);
        
        // Handle validation errors from MARS
        if (error.data?.errorDetails) {
          const errorFields = error.data.errorDetails.map(err => err.field.split('/')[1]);
          salesInformationError.value = errorFields.includes('salesInformation');
          companyInformationError.value = errorFields.includes('companyInformation');
          businessInformationError.value = errorFields.includes('businessInformation');
          partnerInformationError.value = errorFields.includes('partnerInformation');
          paymentDetailsError.value = errorFields.includes('paymentDetails');
          bankInformationError.value = errorFields.includes('bankInformation');
          
          $q.notify({
            color: 'negative',
            position: 'bottom-left',
            message: 'Some mandatory fields are empty or invalid',
            icon: 'info'
          });
        } else {
          $q.notify({
            color: 'negative',
            position: 'bottom',
            message: 'Error submitting form. Please try again.',
            icon: 'thumb_down'
          });
        }
        
        $q.loading.hide();
      }
    };

    // Initialize on component mount
    onMounted(() => {
      fetchAllDropdownValuesFromMARSapi(merchant.salesInformation.institutionCode);
    });

    return {
      // Refs
      stepperRef,
      currentStep,
      showPartnerstab,
      showDocumentPreview,
      
      // Errors
      salesInformationError,
      companyInformationError,
      businessInformationError,
      partnerInformationError,
      paymentDetailsError,
      bankInformationError,
      
      // Data
      viewBinding,
      merchant,
      v$,
      
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
      
      // Computed
      getTransctionValueModel,
      getCashAtPos,
      getPartnersVisiblity,
      getRentalTypeVisibilityForRental,
      getRentalTypeVisibilityForAdvanced,
      getfeeTypeForSettlementVisibility,
      showOnlyIfSharingModelIsEnabled,
      
      // Methods
      togglePartnersTab,
      addMorePartnersSet,
      removePartnerFromArr,
      validatebeforeNavigate,
      COMMON_FILTER_FUNCTION,
      populateBankDetails,
      fetchAllDropdownValuesFromMARSapi,
      saveCurrentChanges,
      finalFormSubmit
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

.group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.largeCont {
  min-height: 100vh;
}

#rightSidePane {
  max-height: 100vh;
  overflow-y: auto;
}
</style>