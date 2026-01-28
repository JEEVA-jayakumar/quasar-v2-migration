<template>
  <div>
    <!-- Documents -->
    <div class="row">
      <!-- Documents proof -->
      <div class="col-md-4 q-pa-xs" v-if="showDocumentPreview">
        <ViewLeadDocumentsDataEntryComponent 
          :prop-lead-document-information="propLeadDeatils.leadDocuments" 
          :prop-get-short-info="propLeadDeatils" 
        />
      </div>
      <!-- Document related form -->
      <div class="col-md-8 q-pa-xs">
        <q-stepper
          color="purple-9"
          ref="stepperRef"
          contracted
          alternative-labels
          header-nav
          :model-value="step"
          @update:model-value="val => step = val"
        >
          <q-step
            :name="1"
            title="Sales"
            subtitle="Info"
            :done="step > 1"
          >
            <div class="row gutter-sm">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  @blur="v$.merchant.salesInformation.institutionCode.$touch()"
                  :error="v$.merchant.salesInformation.institutionCode.$error"
                  placeholder="Choose from the below"
                  color="grey-9"
                  v-model="merchant.salesInformation.institutionCode"
                  label="Institution Code"
                  :options="institutionCodeOptions"
                  @update:model-value="fetchAllDropdownValuesFromMARSapi"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  @blur="v$.merchant.salesInformation.applicationType.$touch()"
                  :error="v$.merchant.salesInformation.applicationType.$error"
                  placeholder="Choose from the below"
                  color="grey-9"
                  v-model="merchant.salesInformation.applicationType"
                  label="Application Type"
                  :options="applicationTypeOptions"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.salesInformation.applicationNumber.$touch()"
                  :error="v$.merchant.salesInformation.applicationNumber.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.applicationNumber"
                  label="Application Number"
                  placeholder="Application Number"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.salesInformation.applicationDate.$touch()"
                  :error="v$.merchant.salesInformation.applicationDate.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.applicationDate"
                  type="date"
                  label="Application Date"
                  placeholder="Application Date"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  v-model="merchant.salesInformation.aggreementDate"
                  type="date"
                  label="Agreement Date"
                  placeholder="Agreement Date"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  @blur="v$.merchant.salesInformation.merchantType.$touch()"
                  :error="v$.merchant.salesInformation.merchantType.$error"
                  placeholder="Choose from the below"
                  color="grey-9"
                  v-model="merchant.salesInformation.merchantType"
                  label="Merchant Type"
                  :options="merchantTypeOptions"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  placeholder="Choose from the below"
                  color="grey-9"
                  v-model="merchant.salesInformation.salesPersonCode"
                  label="Sales Person"
                  :options="salesPersonOptions"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  placeholder="Choose from the below"
                  color="grey-9"
                  v-model="merchant.salesInformation.region"
                  label="Region"
                  :options="regionOptions"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  placeholder="Choose from the below"
                  color="grey-9"
                  v-model="merchant.salesInformation.leadFrom"
                  label="Lead From"
                  :options="leadFromOptions"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <p class="q-caption">Subvention Type</p>
                <div v-for="(item,index) in viewBinding.subventionType" :key="index">
                  <q-checkbox
                    color="grey-9"
                    v-model="merchant.salesInformation.subventionType"
                    :label="item.label"
                    :val="item.value"
                  />
                </div>
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
            <div
              v-if="merchant.salesInformation.sharingModelCode == 'T'"
              class="row gutter-sm q-my-xs"
            >
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  @blur="v$.merchant.salesInformation.sharingPartnerCode.$touch()"
                  :error="v$.merchant.salesInformation.sharingPartnerCode.$error"
                  placeholder="Choose from the below"
                  color="grey-9"
                  v-model="merchant.salesInformation.sharingPartnerCode"
                  label="Sharing partner"
                  :options="sharingPartnerOptions"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.salesInformation.dailyFixedAmount.$touch()"
                  :error="v$.merchant.salesInformation.dailyFixedAmount.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.dailyFixedAmount"
                  label="Daily fixed amount"
                  type="number"
                  placeholder="Daily fixed amount"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.salesInformation.loanDisbursementPercentage.$touch()"
                  :error="v$.merchant.salesInformation.loanDisbursementPercentage.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.loanDisbursementPercentage"
                  label="Percentage"
                  type="number"
                  placeholder="Percentage"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.salesInformation.loanDisbursementAmount.$touch()"
                  :error="v$.merchant.salesInformation.loanDisbursementAmount.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.loanDisbursementAmount"
                  label="Loan disbursement value"
                  type="number"
                  placeholder="Loan disbursement value"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.salesInformation.loanDisbursementDate.$touch()"
                  :error="v$.merchant.salesInformation.loanDisbursementDate.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.loanDisbursementDate"
                  type="date"
                  label="Disbursement Date"
                  placeholder="Disbursement Date"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.salesInformation.tenureMonth.$touch()"
                  :error="v$.merchant.salesInformation.tenureMonth.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.tenureMonth"
                  label="Tenure (in months)"
                  type="number"
                  placeholder="Tenure (in months)"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.salesInformation.tenureDay.$touch()"
                  :error="v$.merchant.salesInformation.tenureDay.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.tenureDay"
                  label="Tenure (in days)"
                  type="number"
                  placeholder="Tenure (in days)"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.salesInformation.tenureStartDate.$touch()"
                  :error="v$.merchant.salesInformation.tenureStartDate.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.tenureStartDate"
                  type="date"
                  label="Start Date"
                  placeholder="Tenure Start Date"
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
                  @blur="v$.merchant.salesInformation.sharingPartnerCode.$touch()"
                  :error="v$.merchant.salesInformation.sharingPartnerCode.$error"
                  placeholder="Choose from the below"
                  color="grey-9"
                  v-model="merchant.salesInformation.sharingPartnerCode"
                  label="Sharing partner"
                  :options="sharingPartnerOptions"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.salesInformation.rentPercentage.$touch()"
                  :error="v$.merchant.salesInformation.rentPercentage.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.rentPercentage"
                  label="Rent %"
                  type="number"
                  placeholder="Rent %"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.salesInformation.rentFixed.$touch()"
                  :error="v$.merchant.salesInformation.rentFixed.$error"
                  color="grey-9"
                  v-model="merchant.salesInformation.rentFixed"
                  label="Rent fixed"
                  type="number"
                  placeholder="Rent fixed"
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
              />
            </q-stepper-navigation>
          </q-step>

          <q-step
            :name="2"
            title="Details"
            :done="step > 2"
          >
            <div class="row gutter-sm">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.legalName.$touch()"
                  :error="v$.merchant.companyInformation.legalName.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.legalName"
                  label="Legal Name"
                  placeholder="Legal Name"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.dbaName.$touch()"
                  :error="v$.merchant.companyInformation.dbaName.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.dbaName"
                  label="DBA Name"
                  placeholder="DBA Name"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.registeredAddress.$touch()"
                  :error="v$.merchant.companyInformation.registeredAddress.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.registeredAddress"
                  label="Registered Address"
                  placeholder="Registered Address"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.registeredCityName.$touch()"
                  :error="v$.merchant.companyInformation.registeredCityName.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.registeredCityName"
                  label="Registered city"
                  placeholder="Registered city"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.registeredStateName.$touch()"
                  :error="v$.merchant.companyInformation.registeredStateName.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.registeredStateName"
                  label="Registered state"
                  placeholder="Registered state"
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
                  label="PIN"
                  placeholder="PIN"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  @blur="v$.merchant.companyInformation.constitution.$touch()"
                  :error="v$.merchant.companyInformation.constitution.$error"
                  placeholder="Choose from the below"
                  color="grey-9"
                  v-model="merchant.companyInformation.constitution"
                  label="Type of business entity"
                  :options="constitutionOptions"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  v-model="merchant.companyInformation.establishYear"
                  type="date"
                  label="Year of Establishment"
                  placeholder="Year of Establishment"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  v-model="merchant.companyInformation.registerNumber"
                  label="Establish Number"
                  placeholder="Establish Number"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  v-model="merchant.companyInformation.tin"
                  label="TIN"
                  placeholder="TIN"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  v-model="merchant.companyInformation.pan"
                  label="Company PAN"
                  placeholder="Company PAN"
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
                  label="Nature of Business"
                  placeholder="Nature of Business"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  placeholder="Choose from the below"
                  color="grey-9"
                  v-model="merchant.companyInformation.businessType"
                  label="Type of Business"
                  :options="businessTypeOptions"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.mccname.$touch()"
                  :error="v$.merchant.companyInformation.mccname.$error"
                  color="amber"
                  v-model="merchant.companyInformation.mccname"
                  label="MCC"
                  placeholder="MCC"
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
                  label="Residential Address"
                  placeholder="Residential Address"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.residentialPin.$touch()"
                  :error="v$.merchant.companyInformation.residentialPin.$error"
                  color="grey-9"
                  type="number"
                  v-model="merchant.companyInformation.residentialPin"
                  label="PIN"
                  placeholder="PIN"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.residentCityName.$touch()"
                  :error="v$.merchant.companyInformation.residentCityName.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.residentCityName"
                  label="City"
                  placeholder="City"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.residentStateName.$touch()"
                  :error="v$.merchant.companyInformation.residentStateName.$error"
                  color="grey-9"
                  v-model="merchant.companyInformation.residentStateName"
                  label="State"
                  placeholder="State"
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
                  label="Contact Name"
                  placeholder="Contact Name"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.contactMobile.$touch()"
                  :error="v$.merchant.companyInformation.contactMobile.$error"
                  color="grey-9"
                  type="number"
                  v-model="merchant.companyInformation.contactMobile"
                  label="Contact mobile"
                  placeholder="Contact Mobile"
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
                  color="grey-9"
                  type="tel"
                  v-model="merchant.companyInformation.contactPhone"
                  label="Contact Phone"
                  placeholder="Contact Phone"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  @blur="v$.merchant.companyInformation.contactEmail.$touch()"
                  :error="v$.merchant.companyInformation.contactEmail.$error"
                  color="grey-9"
                  type="email"
                  v-model="merchant.companyInformation.contactEmail"
                  label="Contact Email"
                  placeholder="Contact Email"
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
            :name="3"
            title="Partners"
            :done="step > 3"
            v-if="merchant.companyInformation.constitution == 'PL'"
          >
            <div v-for="(v,index) in viewBinding.partnersArr" :key="index" class="row q-my-xs gutter-sm">
              <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="row group items-center">
                  <div class="col">
                    <span class="q-pa-sm bg-light text-dark">
                      <q-icon name="people" /> Partner 0{{ index + 1 }}
                    </span>
                  </div>
                  <div class="col-auto">
                    <q-btn
                      round
                      icon="delete"
                      @click="removePartnerFromArr(v, index)"
                      color="negative"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  :error="v$.viewBinding.partnersArr.$each.$response.$data[index]?.name.$error"
                  color="grey-9"
                  v-model="v.name"
                  label="Name"
                  placeholder="Name"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  :error="v$.viewBinding.partnersArr.$each.$response.$data[index]?.pan.$error"
                  color="grey-9"
                  v-model="v.pan"
                  label="Pan"
                  placeholder="Pan"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  :error="v$.viewBinding.partnersArr.$each.$response.$data[index]?.address.$error"
                  color="grey-9"
                  v-model="v.address"
                  label="Address"
                  placeholder="Address"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  :error="v$.viewBinding.partnersArr.$each.$response.$data[index]?.pin.$error"
                  color="grey-9"
                  type="number"
                  v-model="v.pin"
                  label="Pincode"
                  placeholder="Pincode"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  :error="v$.viewBinding.partnersArr.$each.$response.$data[index]?.cityRefCode.$error"
                  color="grey-9"
                  v-model="v.cityRefCode"
                  label="City"
                  placeholder="City"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  :error="v$.viewBinding.partnersArr.$each.$response.$data[index]?.stateRefCode.$error"
                  color="grey-9"
                  v-model="v.stateRefCode"
                  label="State"
                  placeholder="State"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  :error="v$.viewBinding.partnersArr.$each.$response.$data[index]?.contactMobile.$error"
                  color="grey-9"
                  type="tel"
                  v-model="v.contactMobile"
                  label="Mobile"
                  placeholder="Mobile"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  :error="v$.viewBinding.partnersArr.$each.$response.$data[index]?.contactEmail.$error"
                  color="grey-9"
                  type="email"
                  v-model="v.contactEmail"
                  label="Email"
                  placeholder="Email"
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

          <q-step
            :name="4"
            title="Business"
            subtitle="Info"
            :done="step > 4"
          >
            <div class="row gutter-sm">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  type="number"
                  v-model="merchant.businessInformation.weekdayStartHour"
                  label="Weekday start hour"
                  placeholder="Weekday start hour"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  type="number"
                  v-model="merchant.businessInformation.weekdayEndHour"
                  label="Weekday end hour"
                  placeholder="Weekday end hour"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  type="number"
                  v-model="merchant.businessInformation.weekendStartHour"
                  label="Weekend start hour"
                  placeholder="Weekend start hour"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  type="number"
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
                  color="grey-9"
                  v-model="merchant.businessInformation.gstId"
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
                  color="grey-9"
                  type="number"
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
            :name="5"
            title="Payment"
            subtitle="Details"
            :done="step > 5"
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
                  color="grey-9"
                  type="number"
                  v-model="merchant.paymentDetails.installationFee"
                  label="Installation Fee"
                  placeholder="Installation Fee"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  placeholder="Choose from the below"
                  color="grey-9"
                  v-model="merchant.paymentDetails.terminalModeCode"
                  label="Terminal Model"
                  :options="terminalModelSet"
                />
              </div>
              <div class="col-md-6 col-sm-12">
                <q-input
                  color="grey-9"
                  type="number"
                  v-model="merchant.paymentDetails.numberOfTerminals"
                  label="No of Terminals"
                  placeholder="No of Terminals"
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
                  placeholder="Choose from the below"
                  color="grey-9"
                  v-model="merchant.paymentDetails.rentalPlanCode"
                  label="Rental Plan"
                  :options="rentalPlanSet"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  placeholder="Choose from the below"
                  color="grey-9"
                  v-model="merchant.paymentDetails.rentalModeCode"
                  label="Rental Mode"
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
                  color="grey-9"
                  type="number"
                  v-model="merchant.paymentDetails.gracePeriod"
                  label="Grace period"
                  placeholder="Grace period"
                />
              </div>
              <div v-if="merchant.paymentDetails.rentalType == 'A'" class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  type="number"
                  v-model="merchant.paymentDetails.advanceRentCollected"
                  label="Advance Rent Collected"
                  placeholder="Advance Rent Collected"
                />
              </div>
              <div v-if="merchant.paymentDetails.rentalType == 'A'" class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  type="number"
                  v-model="merchant.paymentDetails.noOfMonthRentPaidInAdvance"
                  label="No. Of Month Rent Paid In Advance"
                  placeholder="No. Of Month Rent Paid In Advance"
                />
              </div>
              <div v-if="merchant.paymentDetails.rentalType == 'A'" class="col-md-6 col-sm-12 col-xs-12">
                <p class="q-caption">Advanced Rent Mode</p>
                <div class="group">
                  <q-radio
                    @blur="v$.merchant.paymentDetails.advancedRentMode.$touch()"
                    :error="v$.merchant.paymentDetails.advancedRentMode.$error"
                    v-for="(item,index) in advancedRentModeOptions"
                    :key="index"
                    color="grey-9"
                    v-model="merchant.paymentDetails.advancedRentMode"
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
            :name="6"
            title="Discount"
            subtitle="Rate"
            :done="step > 6"
          >
            <!-- Discount Rate content here (truncated for brevity) -->
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
            :name="7"
            title="Bank & Collection"
            subtitle="Details"
            :done="step > 7"
          >
            <div class="row q-mb-md gutter-sm items-center">
              <div class="col-md-12">
                <div class="q-title">Merchant Bank Details</div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  v-model="merchant.bankInformation.bankDetails.ifsc"
                  label="IFSC Code"
                  placeholder="IFSC Code"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  v-model="merchant.bankInformation.bankDetails.branchName"
                  label="Branch Name"
                  placeholder="Branch Name"
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
              <div
                v-if="merchant.bankInformation.bankDetails.feeType == 'N' || merchant.bankInformation.bankDetails.feeType == 'S'"
                class="col-md-6 col-sm-12 col-xs-12"
              >
                <q-input
                  color="grey-9"
                  type="number"
                  v-model="merchant.bankInformation.bankDetails.settlementOrNeftFee"
                  label="NEFT/Settlement Fee Inclusive of Tax"
                  placeholder="NEFT/Settlement Fee Inclusive of Tax"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  v-model="merchant.bankInformation.bankDetails.chequeDepositedDate"
                  label="Cheque Deposited Date"
                  placeholder="Cheque Deposited Date"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  type="number"
                  v-model="merchant.bankInformation.bankDetails.micr"
                  label="MICR"
                  placeholder="MICR"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  v-model="merchant.bankInformation.bankDetails.bankName"
                  label="Bank Name"
                  placeholder="Bank Name"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  placeholder="Choose from the below"
                  color="grey-9"
                  v-model="merchant.bankInformation.bankDetails.payment_mode"
                  label="Payment mode"
                  :options="paymnentModeOptions"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  v-model="merchant.bankInformation.bankDetails.bankCityName"
                  label="City"
                  placeholder="City"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  v-model="merchant.bankInformation.bankDetails.bankStateName"
                  label="State"
                  placeholder="State"
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
                  color="grey-9"
                  type="number"
                  v-model="merchant.bankInformation.bankDetails.accountNumber"
                  label="Bank A/c Number"
                  placeholder="Bank A/c Number"
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
              <div class="col-md-4 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  v-model="merchant.bankInformation.collectionDetails.swipeAmount"
                  label="Swipe Amount"
                  placeholder="Swipe Amount"
                />
              </div>
              <div class="col-md-4 col-sm-12">
                <q-input
                  color="grey-9"
                  v-model="merchant.bankInformation.collectionDetails.collectedDate"
                  type="date"
                  label="Swipe Date"
                />
              </div>
              <div class="col-md-4 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  v-model="merchant.bankInformation.collectionDetails.swipeTerminal"
                  label="Swiped on the terminal of"
                  placeholder="Swiped on the terminal of"
                />
              </div>
              <div class="col-md-4 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  v-model="merchant.bankInformation.collectionDetails.chequeAmount"
                  label="Cheque Amount"
                  placeholder="Cheque Amount"
                />
              </div>
              <div class="col-md-4 col-sm-12">
                <q-input
                  color="grey-9"
                  v-model="merchant.bankInformation.collectionDetails.chequeDate"
                  type="date"
                  label="Cheque Date"
                />
              </div>
              <div class="col-md-4 col-sm-12 col-xs-12">
                <q-input
                  color="grey-9"
                  v-model="merchant.bankInformation.collectionDetails.chequeNumber"
                  label="Cheque/UTR No"
                  placeholder="Cheque/UTR No"
                />
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-select
                  placeholder="Choose from the below"
                  color="grey-9"
                  v-model="merchant.bankInformation.collectionDetails.acquirerBank"
                  label="Bank Name"
                  :options="selectOptions"
                />
              </div>
            </div>
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
import { defineComponent, ref, computed, reactive } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';
import { useVuelidate } from '@vuelidate/core';
import { required, requiredIf } from '@vuelidate/validators';
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
    const stepperRef = ref(null);
    const step = ref(1);

    const viewBinding = reactive({
      subventionType: [
        {
          label: 'Bank MDR',
          value: 1
        },
        {
          label: 'Bijlipay MDR',
          value: 2
        }
      ],
      sharingModelCode: [
        {
          label: 'No sharing',
          value: 'N'
        },
        {
          label: 'Transaction value model',
          value: 'T'
        },
        {
          label: 'MDR/cash@pos/rent',
          value: 'M'
        }
      ],
      statementType: [
        {
          label: 'E-Statement',
          value: 'E'
        },
        {
          label: 'Paper statement',
          value: 'P'
        }
      ],
      statementFrequency: [
        {
          label: 'Daily',
          value: 'D'
        },
        {
          label: 'Monthly',
          value: 'M'
        },
        {
          label: 'Quarterly',
          value: 'Q'
        },
        {
          label: 'Half yearly',
          value: 'H'
        },
        {
          label: 'Yearly',
          value: 'Y'
        },
        {
          label: 'None',
          value: 'N'
        }
      ],
      partnerObj: {
        name: '',
        address: '',
        pan: '',
        pin: '',
        cityRefCode: '',
        stateRefCode: '',
        contactMobile: '',
        contactEmail: ''
      },
      partnersArr: [
        {
          name: '',
          address: '',
          pan: '',
          pin: '',
          cityRefCode: 0,
          stateRefCode: 0,
          contactMobile: '',
          contactEmail: ''
        }
      ]
    });

    const merchant = reactive({
      salesInformation: {
        institutionCode: 1,
        applicationType: 'D',
        applicationNumber: 'QWERTY12333',
        applicationDate: new Date().toISOString().split('T')[0],
        aggreementDate: new Date().toISOString().split('T')[0],
        merchantType: 'M',
        subventionType: [],
        region: 1,
        salesPersonCode: 1,
        leadFrom: '',
        sharingModelCode: 'N',
        sharingPartnerCode: 1,
        dailyFixedAmount: 0,
        loanDisbursementPercentage: 2,
        loanDisbursementAmount: 0,
        loanDisbursementDate: new Date().toISOString().split('T')[0],
        tenureMonth: 12,
        tenureDay: 356,
        tenureStartDate: new Date().toISOString().split('T')[0],
        rentPercentage: 2,
        rentFixed: 0
      },
      companyInformation: {
        legalName: 'test',
        dbaName: 'test',
        registeredAddress: 'address',
        registeredPin: '123456',
        registeredCityRefCode: 1,
        registeredCityName: '',
        registeredStateRefCode: 1,
        registeredStateName: '',
        constitution: 'PL',
        constitutionDescription: 'test',
        establishYear: new Date().toISOString().split('T')[0],
        registerNumber: 'A12456',
        pan: 'ABGPD265P',
        tin: 'XXXXXX',
        tan: 'XXXXXX',
        businessNature: 'test',
        businessType: 'R',
        mcc: '5733',
        mccname: '',
        residentialAddress: 'address',
        residentialPin: '123456',
        residentCityName: '',
        residentialCityRefCode: 1,
        residentStateName: '',
        residentialStateRefCode: 1,
        contactName: 'Dinesh',
        contactMobile: '1234567790',
        contactAlternateMobile: '0123456789',
        contactPhone: '1234567890',
        contactEmail: 'test@gmail.com',
        statementType: 'E',
        statementFrequency: 'D',
        statementEmail: []
      },
      businessInformation: {
        weekdayStartHour: '9',
        weekdayEndHour: '6',
        weekendStartHour: '9',
        weekendEndHour: '2',
        lastTurnoverYear: 2010,
        lastTurnoverAmount: 500000,
        expectedCardBusiness: 500000,
        averageBillAmount: 5000,
        gstId: 'ABC45678',
        currentPosName: 'INGINICO',
        debitCardMdr: 2,
        creditCardMdr: 2,
        memberSince: new Date().toISOString().split('T')[0],
        businessIncome: 1121212
      },
      paymentDetails: {
        deviceOwnedBy: 'B',
        installationFee: 1000,
        terminalModeCode: 1,
        numberOfTerminals: 1,
        cashAtPosEnabled: 'Y',
        rentalPlanCode: 1,
        rentalModeCode: 'N',
        rentalType: 'A',
        devicePrice: 2500,
        otherCharges: 500,
        totalAmountPaid: 3000,
        advanceRentCollected: 111111.99,
        advancedRentMode: 'NEFT',
        noOfMonthRentPaidInAdvance: 12,
        gracePeriod: 12
      },
      bankInformation: {
        bankDetails: {
          ifsc: 'XYZ00000123',
          micr: 123456,
          bankName: 'XXX Bank',
          bankCityName: '',
          bankCityRefCode: 1,
          bankStateName: '',
          bankStateRefCode: 1,
          branchName: '',
          feeType: 'N',
          settlementOrNeftFee: 100,
          chequeDepositedDate: new Date().toISOString().split('T')[0],
          payment_mode: 'D',
          accountType: 'S',
          accountNumber: '123456789',
          bankStatementAttached: 'Y',
          cancelChequeAttached: 'Y'
        },
        collectionDetails: {
          collectedDate: new Date().toISOString().split('T')[0],
          swipeAmount: 10000,
          swipeTerminal: 'INGINICO',
          chequeAmount: 10000,
          chequeDate: new Date().toISOString().split('T')[0],
          chequeNumber: '123456',
          acquirerBank: 'testBank'
        }
      }
    });

    const getTransctionValueModel = computed(() => {
      return merchant.salesInformation.sharingModelCode == 'T';
    });

    const getCashAtPos = computed(() => {
      return merchant.salesInformation.sharingModelCode == 'M';
    });

    const getPartnersVisiblity = computed(() => {
      return merchant.companyInformation.constitution == 'PL';
    });

    const getRentalTypeVisibilityForRental = computed(() => {
      return merchant.paymentDetails.rentalType == 'R';
    });

    const getRentalTypeVisibilityForAdvanced = computed(() => {
      return merchant.paymentDetails.rentalType == 'A';
    });

    const getfeeTypeForSettlementVisibility = computed(() => {
      return merchant.bankInformation.bankDetails.feeType == 'N' ||
        merchant.bankInformation.bankDetails.feeType == 'S';
    });

    const rules = {
      merchant: {
        salesInformation: {
          institutionCode: { required },
          applicationType: { required },
          applicationNumber: { required },
          applicationDate: { required },
          merchantType: { required },
          sharingPartnerCode: {
            required: requiredIf(() => !getTransctionValueModel.value)
          },
          dailyFixedAmount: {
            required: requiredIf(() => !getTransctionValueModel.value)
          },
          loanDisbursementPercentage: {
            required: requiredIf(() => !getTransctionValueModel.value)
          },
          loanDisbursementAmount: {
            required: requiredIf(() => !getTransctionValueModel.value)
          },
          loanDisbursementDate: {
            required: requiredIf(() => !getTransctionValueModel.value)
          },
          tenureMonth: {
            required: requiredIf(() => !getTransctionValueModel.value)
          },
          tenureDay: {
            required: requiredIf(() => !getTransctionValueModel.value)
          },
          tenureStartDate: {
            required: requiredIf(() => !getTransctionValueModel.value)
          },
          rentPercentage: {
            required: requiredIf(() => getCashAtPos.value)
          },
          rentFixed: {
            required: requiredIf(() => getCashAtPos.value)
          }
        },
        companyInformation: {
          legalName: { required },
          dbaName: { required },
          registeredAddress: { required },
          registeredPin: { required },
          registeredCityRefCode: { required },
          registeredCityName: { required },
          registeredStateRefCode: { required },
          registeredStateName: { required },
          constitution: { required },
          mccname: { required },
          mcc: { required },
          residentialAddress: { required },
          residentialPin: { required },
          residentCityName: { required },
          residentialCityRefCode: { required },
          residentStateName: { required },
          residentialStateRefCode: { required },
          contactName: { required },
          contactMobile: { required },
          contactEmail: { required },
          statementType: { required },
          statementFrequency: { required }
        },
        paymentDetails: {
          deviceOwnedBy: { required },
          cashAtPosEnabled: { required },
          rentalType: { required },
          advanceRentCollected: {
            required: requiredIf(() => getRentalTypeVisibilityForAdvanced.value)
          },
          advancedRentMode: {
            required: requiredIf(() => getRentalTypeVisibilityForAdvanced.value)
          },
          noOfMonthRentPaidInAdvance: {
            required: requiredIf(() => getRentalTypeVisibilityForAdvanced.value)
          },
          gracePeriod: {
            required: requiredIf(() => getRentalTypeVisibilityForRental.value)
          }
        },
        bankInformation: {
          bankDetails: {
            ifsc: { required },
            micr: { required },
            bankCityName: { required },
            bankCityRefCode: { required },
            bankStateName: { required },
            bankStateRefCode: { required },
            payment_mode: { required },
            accountType: { required },
            settlementOrNeftFee: {
              required: requiredIf(() => getfeeTypeForSettlementVisibility.value)
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
            pan: { required },
            pin: { required },
            stateRefCode: { required },
            cityRefCode: { required },
            contactMobile: { required },
            contactEmail: { required }
          }
        }
      }
    };

    const v$ = useVuelidate(rules, { merchant, viewBinding });

    const institutionCodeOptions = ref([
      {
        label: 'AB',
        value: 1
      },
      {
        label: 'IOB',
        value: 2
      }
    ]);

    const applicationTypeOptions = ref([
      {
        label: 'Digital',
        value: 'D'
      },
      {
        label: 'Non Digital',
        value: 'ND'
      }
    ]);

    const merchantTypeOptions = ref([
      {
        label: 'Group Merchant',
        value: 'GM'
      },
      {
        label: 'Merchant Outlet',
        value: 'MO'
      },
      {
        label: 'Merchant',
        value: 'M'
      }
    ]);

    const businessTypeOptions = ref([
      {
        label: 'Rented',
        value: 'R'
      },
      {
        label: 'Owned',
        value: 'O'
      },
      {
        label: 'Leased',
        value: 'L'
      }
    ]);

    const constitutionOptions = ref([
      {
        label: 'Individuals',
        value: 'IN'
      },
      {
        label: 'Partnership/LLP',
        value: 'PL'
      },
      {
        label: 'Sole Proprietorship',
        value: 'SP'
      },
      {
        label: 'Public/Pvt.Ltd',
        value: 'PB'
      },
      {
        label: 'Trust',
        value: 'TR'
      },
      {
        label: 'Society',
        value: 'SO'
      },
      {
        label: 'Other',
        value: 'OT'
      }
    ]);

    const deviceOwnedByOptions = ref([
      {
        label: 'Bijlipay',
        value: 'B'
      },
      {
        label: 'Merchant',
        value: 'M'
      }
    ]);

    const cashAtPosEnabledOptions = ref([
      {
        label: 'Yes',
        value: 'Y'
      },
      {
        label: 'No',
        value: 'N'
      }
    ]);

    const rentalTypeOptions = ref([
      {
        label: 'Advanced',
        value: 'A'
      },
      {
        label: 'Regular',
        value: 'R'
      }
    ]);

    const rentalModeOptions = ref([
      {
        label: 'Standing instructions',
        value: 'S'
      },
      {
        label: 'Normal',
        value: 'N'
      }
    ]);

    const advancedRentModeOptions = ref([
      {
        label: 'Card',
        value: 'Card'
      },
      {
        label: 'Cheque',
        value: 'Cheque'
      },
      {
        label: 'NEFT',
        value: 'NEFT'
      },
      {
        label: 'IMPS',
        value: 'IMPS'
      },
      {
        label: 'Cash',
        value: 'Cash'
      }
    ]);

    const accountTypeOptions = ref([
      {
        label: 'Saving account',
        value: 'S'
      },
      {
        label: 'Current account',
        value: 'C'
      },
      {
        label: 'Overdraft account',
        value: 'OD'
      },
      {
        label: 'Cash credit account',
        value: 'CC'
      },
      {
        label: 'Loan account',
        value: 'LA'
      }
    ]);

    const feeTypeOptions = ref([
      {
        label: 'NEFT',
        value: 'N'
      },
      {
        label: 'Settlement',
        value: 'S'
      },
      {
        label: 'None',
        value: 'X'
      }
    ]);

    const paymnentModeOptions = ref([
      {
        label: 'Direct credit',
        value: 'D'
      },
      {
        label: 'NEFT',
        value: 'N'
      },
      {
        label: 'IMPS',
        value: 'I'
      }
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
    const selectOptions = ref([
      {
        label: 'label',
        value: '1'
      },
      {
        label: 'label',
        value: '2'
      },
      {
        label: 'label',
        value: '3'
      }
    ]);

    const showDocumentPreview = ref(true);

    const addMorePartnersSet = () => {
      viewBinding.partnersArr.push({ ...viewBinding.partnerObj });
    };

    const removePartnerFromArr = (item, index) => {
      viewBinding.partnersArr.splice(index, 1);
    };

    const validatebeforeNavigate = (stepName) => {
      if (stepName === 'salesInformation') {
        v$.value.merchant.salesInformation.$touch();
        if (v$.value.merchant.salesInformation.$error) {
          $q.notify('Please review fields again.');
        } else {
          stepperRef.value.next();
        }
      } else if (stepName === 'companyInformation') {
        v$.value.merchant.companyInformation.$touch();
        if (v$.value.merchant.companyInformation.$error) {
          $q.notify('Please review fields again.');
        } else {
          stepperRef.value.next();
        }
      } else if (stepName === 'partners') {
        v$.value.viewBinding.partnersArr.$touch();
        if (v$.value.viewBinding.partnersArr.$error) {
          $q.notify('Please review fields again.');
        } else {
          stepperRef.value.next();
        }
      } else if (stepName === 'businessInformation') {
        stepperRef.value.next();
      } else if (stepName === 'paymentDetails') {
        v$.value.merchant.paymentDetails.$touch();
        if (v$.value.merchant.paymentDetails.$error) {
          $q.notify('Please review fields again.');
        } else {
          stepperRef.value.next();
        }
      }
    };

    const fetchAllDropdownValuesFromMARSapi = (institutionCode) => {
      $q.loading.show({
        delay: 400,
        message: 'Loading...',
        spinnerColor: 'purple-9'
      });

      // Fetch regions
      store.dispatch('mars_regions/REGION_FROM_MARS', institutionCode)
        .then(() => {
          const regions = store.getters['mars_regions/regionsFromMars']?.items?.map(oo => ({
            label: oo.name,
            value: oo.code
          })) || [];
          regionOptions.value = regions;
        })
        .then(() => store.dispatch('mars_sharingPartner/SHARING_PARTNER_FROM_MARS', institutionCode))
        .then(() => {
          const sharingPartner = store.getters['mars_sharingPartner/sharingPartnerFromMars']?.items?.map(oo => ({
            label: oo.name,
            value: oo.code
          })) || [];
          sharingPartnerOptions.value = sharingPartner;
        })
        .then(() => store.dispatch('mars_leadFrom/LEAD_FROM_FROM_MARS', institutionCode))
        .then(() => {
          const leadFrom = store.getters['mars_leadFrom/leadFromInfoFromMars']?.items?.map(oo => ({
            label: oo.name,
            value: oo.name
          })) || [];
          leadFromOptions.value = leadFrom;
        })
        .then(() => store.dispatch('mars_salesPerson/SALES_PERSON_FROM_MARS', institutionCode))
        .then(() => {
          const salesPerson = store.getters['mars_salesPerson/salesPersonFromMars']?.items?.map(oo => ({
            label: oo.name,
            value: oo.code
          })) || [];
          salesPersonOptions.value = salesPerson;
        })
        .then(() => store.dispatch('mars_city/CITY_FROM_MARS'))
        .then(() => {
          const city = store.getters['mars_city/cityFromMars']?.items?.map(oo => ({
            label: oo.name,
            value: oo.code
          })) || [];
          cityOptions.value = city;
        })
        .then(() => store.dispatch('mars_state/STATE_FROM_MARS'))
        .then(() => {
          const stateArr = store.getters['mars_state/stateFromMars']?.items?.map(oo => ({
            label: oo.name,
            value: oo.code
          })) || [];
          stateOptions.value = stateArr;
        })
        .then(() => store.dispatch('mars_mcc/MCC_FROM_MARS'))
        .then(() => {
          const mccSubArr = store.getters['mars_mcc/mccFromMars']?.items?.map(oo => ({
            label: oo.code + '-' + oo.name,
            value: oo.code
          })) || [];
          mccSearchSet.value = mccSubArr;
        })
        .then(() => store.dispatch('mars_deviceModel/DEVICE_MODEL_FROM_MARS', institutionCode))
        .then(() => {
          const terminalModelArr = store.getters['mars_deviceModel/deviceModelFromMars']?.items?.map(oo => ({
            label: oo.name,
            value: oo.code
          })) || [];
          terminalModelSet.value = terminalModelArr;
        })
        .then(() => store.dispatch('mars_rentalPlans/RENTAL_PLAN_FROM_MARS', institutionCode))
        .then(() => {
          const rentalPlan = store.getters['mars_rentalPlans/rentalPlanFromMars']?.items?.map(oo => ({
            label: oo.name,
            value: oo.code
          })) || [];
          rentalPlanSet.value = rentalPlan;
        })
        .then(() => {
          $q.loading.hide();
        })
        .catch((error) => {
          console.error('Error fetching dropdown values:', error);
          $q.loading.hide();
        });
    };

    const finalMarsFormSubmit = () => {
      $q.loading.show({
        delay: 400,
        message: 'Validating...',
        spinnerColor: 'purple-9'
      });

      const submitData = {
        ...merchant,
        leadId: props.propLeadDeatils.id,
        partnerInformation: viewBinding.partnersArr
      };

      store.dispatch('mars_dataSubmit/MARS_DATA_SUBMIT_INTERNAL', submitData)
        .then(() => {
          $q.loading.show({
            delay: 400,
            message: 'Saved. Sending data to MARS...',
            spinnerColor: 'purple-9'
          });

          const externalData = { merchant: submitData };
          return store.dispatch('mars_dataSubmit/MARS_DATA_SUBMIT_EXTERNAL', externalData);
        })
        .then(() => {
          $q.loading.show({
            delay: 400,
            message: 'Great! All set to go.',
            spinnerColor: 'purple-9'
          });

          return store.dispatch('mars_dataSubmit/MARS_DATA_EXTERNAL_SUBMIT_RESPONSE', { merchant });
        })
        .then(() => {
          $q.loading.hide();
          $q.notify({
            type: 'positive',
            message: 'Form submitted successfully!'
          });
        })
        .catch((error) => {
          console.error('Error submitting form:', error);
          $q.loading.hide();
          $q.notify({
            type: 'negative',
            message: 'Error submitting form. Please try again.'
          });
        });
    };

    // Fetch dropdown values on component creation
    fetchAllDropdownValuesFromMARSapi(merchant.salesInformation.institutionCode);

    return {
      stepperRef,
      step,
      viewBinding,
      merchant,
      v$,
      institutionCodeOptions,
      applicationTypeOptions,
      merchantTypeOptions,
      businessTypeOptions,
      constitutionOptions,
      deviceOwnedByOptions,
      cashAtPosEnabledOptions,
      rentalTypeOptions,
      rentalModeOptions,
      advancedRentModeOptions,
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
      selectOptions,
      showDocumentPreview,
      addMorePartnersSet,
      removePartnerFromArr,
      validatebeforeNavigate,
      fetchAllDropdownValuesFromMARSapi,
      finalMarsFormSubmit,
      getTransctionValueModel,
      getCashAtPos,
      getPartnersVisiblity,
      getRentalTypeVisibilityForRental,
      getRentalTypeVisibilityForAdvanced,
      getfeeTypeForSettlementVisibility
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
</style>