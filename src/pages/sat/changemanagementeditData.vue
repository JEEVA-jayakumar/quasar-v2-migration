<template>
  <q-page padding>
    <q-stepper flat ref="stepper" v-model="step" color="primary">
      <q-step :name="'campaign'" :title="'Edit Rental Details'" :default="true">
        {{ info.datainfo1 }}

        <b>Edit Rental Details</b>
        <br />
        <br />
        <b>Device Count : {{ formdata.deviceCount }}</b>

        <!-- {{midBasedList.tids}} -->
        <!-- {{formdata.mid}} -->
        <br />
        <br />
        <div>
          <div class="row gutter-sm q-my-xs" v-if="!check">
            <!-- <div class="col-xs-12 col-sm-6">
              <q-input disable
                v-model="formdata.deviceCount"
                class="no-margin"
                label="Device Count"
              />
            </div>-->
            <!-- data: {{getRsmReason.reason}} -->
            <div class="col-xs-12 col-sm-6">
              <q-select
                v-model="formdata.plan"
                class="no-margin"
                label="Select Rental Plan"
                :options="dropDown.planOptions"
                :disable="
                  implementedQueue.value?.leadInformation?.cmsLeadStatus == 15
                    ? true
                    : false
                "
                @update:model-value="fnPlan1"
              />
              <!-- @update:model-value="planSelected" -->
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-select
                clearable
                :disable="
                  formdata.plan !=
                    implementedQueue.value?.leadInformation?.plan?.id ||
                  implementedQueue.value?.leadInformation?.cmsLeadStatus ==
                    15 ||
                  implementedQueue.value?.leadInformation?.cmsLeadStatus == 21
                    ? false
                    : true
                "
                @blur="v$.formdata.paymentOption.$touch"
                :error="v$.formdata.paymentOption.$error"
                v-model.trim="formdata.paymentOption"
                class="no-margin"
                label="select Payment"
                :options="payment"
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                disable
                v-model="formdata.setupFees"
                class="no-margin"
                label="Setup Fees"
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                disable
                v-model="formdata.recurringFees"
                class="no-margin"
                label="Recurring fees"
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-select
                @blur="v$.formdata.cmsCategoryType.$touch"
                :error="v$.formdata.cmsCategoryType.$error"
                placeholder="Choose from the below*"
                color="grey-9"
                v-model.trim="formdata.cmsCategoryType"
                label="Category Type*"
                v-if="
                  allMarsData.value?.mdrPlan?.code != 8 ||
                  allMarsData.value?.mdrPlan?.code != 9
                    ? { cmsCategoryTypeOptions }
                    : false
                "
                :disable="
                  allMarsData.value?.mdrPlan?.code == 8 ||
                  allMarsData.value?.mdrPlan?.code == 9
                    ? true
                    : false
                "
                :options="cmsCategoryTypeOptions"
              />
              <div
                class="text-negative"
                v-if="error.formdata.cmsCategoryType.alert"
              ></div>
            </div>
            <!-- <div class="col-xs-12 col-sm-6">
              <q-input v-model="model" class="no-margin" label="Payment Ref Number!(allMarsData.value?.mdrPlan?.code) ||" />
            </div>-->
            <!-- <div class="col-xs-12 col-sm-6">
              <q-input v-model="model" class="no-margin" label="Amount" />
            </div>-->
            <div class="col-xs-12 col-sm-6">
              <!-- <p class="caption">Pricing Exception</p> -->
              <q-checkbox
                v-model="check"
                :disable="
                  implementedQueue.value?.leadInformation?.cmsLeadStatus == 15
                    ? true
                    : false
                "
                color="positive"
                label="Pricing Exception"
                left-label
              />
            </div>
          </div>

          <div class="row gutter-sm q-my-xs" v-else>
            <!-- <div class="col-xs-12 col-sm-6">
              <q-input disable
                v-model="formdata1.deviceCount"
                class="no-margin"
                label="Device Count"
              />
            </div>-->

            <div class="col-xs-12 col-sm-6">
              <q-select
                v-model="formdata1.plan"
                class="no-margin"
                label="Select Rental Plan"
                :options="dropDown.planOptions"
                @update:model-value="fnPlan"
              />
            </div>
            <!-- <div class="col-xs-12 col-sm-6">
              <q-select clearable
               @blur="v$.formdata.paymentOption.$touch"
              :error="v$.formdata.paymentOption.$error"
              v-model="formdata.paymentOption"
                class="no-margin"
                label="select Payment"
                :options="payment"
              />
            </div>-->
            <div class="col-xs-12 col-sm-6">
              <q-input
                v-model="formdata1.setupFees"
                class="no-margin"
                label="Setup Fees"
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                v-model="formdata1.recurringFees"
                class="no-margin"
                label="Recurring fees"
              />
            </div>
            <!-- <div class="col-xs-12 col-sm-6">
              <q-input v-model="model" class="no-margin" label="Payment Ref Number" />
            </div>-->
            <!-- <div class="col-xs-12 col-sm-6">
              <q-input v-model="model" class="no-margin" label="Amount" />
            </div>-->
            <div class="col-xs-12 col-sm-6">
              <!-- <p class="caption">Pricing Exception</p> -->
              <q-checkbox
                v-model="check"
                :disable="
                  implementedQueue.value?.leadInformation?.cmsLeadStatus == 15
                    ? false
                    : true
                "
                color="positive"
                label="Pricing Exception"
                left-label
              />
            </div>
          </div>
        </div>
        <div v-if="formdata.paymentOption == 2" class="row gutter-sm q-my-xs">
          <div class="col-xs-12 col-sm-6">
            <p></p>
            <q-item>
              <q-item-section>Upload the Cheque File :</q-item-section>
              <label
                class="cursor-pointer text-white"
                style="background-color: #202c3f"
              >
                <span>Attach</span>
                <input
                  type="file"
                  name="file"
                  @change="fnUploadApplicationForm($event, document)"
                  accept=".png, .jpg, .pdf"
                />
              </label>
              &nbsp;{{ formdata.paymentDocumentFile }}
            </q-item>
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              @blur="v$.formdata.paymentMadeon.$touch"
              :error="v$.formdata.paymentMadeon.$error"
              v-model.trim="formdata.paymentMadeon"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="*Transaction Made ON"
              placeholder="Transaction Made ON"
              type="date"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              @blur="v$.formdata.referenceNumber.$touch"
              :error="v$.formdata.referenceNumber.$error"
              v-model.trim="formdata.referenceNumber"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="Cheque Reference Number"
            />
          </div>
        </div>
        <div
          v-else-if="formdata.paymentOption == 1"
          class="row gutter-sm q-my-xs"
        >
          <div class="col-xs-12 col-sm-6">
            <q-input
              @blur="v$.formdata.referenceNumber.$touch"
              :error="v$.formdata.referenceNumber.$error"
              v-model.trim="formdata.referenceNumber"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="*NEFT Reference Number"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              @blur="v$.formdata.paymentMadeon.$touch"
              :error="v$.formdata.paymentMadeon.$error"
              v-model.trim="formdata.paymentMadeon"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="*Transaction Made ON"
              type="date"
            />
          </div>
        </div>
        <div
          v-else-if="formdata.paymentOption == 3"
          class="row gutter-sm q-my-xs"
        >
          <div class="col-xs-12 col-sm-6">
            <q-input
              @blur="v$.formdata.referenceNumber.$touch"
              :error="v$.formdata.referenceNumber.$error"
              v-model.trim="formdata.referenceNumber"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="*Swipe Reference Number"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              @blur="v$.formdata.paymentMadeon.$touch"
              :error="v$.formdata.paymentMadeon.$error"
              v-model.trim="formdata.paymentMadeon"
              class="text-weight-regular text-grey-8"
              color="grey-9"
              label="*Transaction Made ON"
              type="date"
            />
          </div>
        </div>
        <br />

        <q-stepper-navigation>
          <!-- <q-btn color="primary" @click="$refs.stepper.goToStep('create_ad')">Create ad now</q-btn> -->
          <div
            v-if="
              formdata.plan ==
                implementedQueue.value?.leadInformation?.plan?.id &&
              !check &&
              implementedQueue.value?.leadInformation?.cmsLeadStatus == 15
            "
          >
            <!-- <q-btn class="q-ml-sm" color="primary" @click="sendtoNH(formdata)"
            >Send to mars</q-btn>-->
            <q-btn
              class="q-ml-sm"
              color="primary"
              @click="sendtoFinance(formdata)"
              >Send to Finance</q-btn
            >
            <!-- <q-btn
                color="negative"
                class="q-ma-xs"
                icon="backspace"
                label="Back to document validation"
                @click="goBackToDocumentVerificationStage()"
            />-->

            <!-- <q-btn class="q-ml-sm" color="primary" @click="$refs.stepper.next()">Continue</q-btn> -->
          </div>
          <div
            v-else-if="
              formdata.plan ==
                implementedQueue.value?.leadInformation?.plan?.id &&
              !check &&
              implementedQueue.value?.leadInformation?.cmsLeadStatus == 21
            "
          >
            <!-- <q-btn class="q-ml-sm" color="primary" @click="sendtoNH(formdata)"
            >Send to mars</q-btn>-->
            <q-btn
              class="q-ml-sm"
              color="primary"
              @click="sendtoFinance(formdata)"
              >Send to Finance</q-btn
            >
            <!-- <q-btn
                color="negative"
                class="q-ma-xs"
                icon="backspace"
                label="Back to document validation"
                @click="goBackToDocumentVerificationStage()"
            />-->

            <!-- <q-btn class="q-ml-sm" color="primary" @click="$refs.stepper.next()">Continue</q-btn> -->
          </div>
          <div
            v-else-if="
              (formdata.plan ==
                implementedQueue.value?.leadInformation?.plan?.id &&
                !check &&
                implementedQueue.value?.leadInformation?.cmsLeadStatus == 19) ||
              implementedQueue.value?.leadInformation?.cmsLeadStatus == 17
            "
          >
            <!-- <q-btn class="q-ml-sm" color="primary" @click="sendtoNH(formdata)"
            >Send to mars</q-btn>-->
            <q-btn class="q-ml-sm" color="primary" @click="sendtoNH(formdata1)"
              >Send to RSM</q-btn
            >
            <!-- <q-btn
                color="negative"
                class="q-ma-xs"
                icon="backspace"
                label="Back to document validation"
                @click="goBackToDocumentVerificationStage()"
            />-->

            <!-- <q-btn class="q-ml-sm" color="primary" @click="$refs.stepper.next()">Continue</q-btn> -->
          </div>
          <div
            v-else-if="
              formdata.plan !=
                implementedQueue.value?.leadInformation?.plan?.id &&
              !check
            "
          >
            <!-- &&(formdata.paymentOption == 1 || formdata.paymentOption == 2 || formdata.paymentOption == 3) -->
            <q-btn
              class="q-ml-sm"
              color="primary"
              @click="sendtoFinance(formdata)"
              >Send to Finance</q-btn
            >
            <!-- <q-btn
                color="negative"
                class="q-ma-xs"
                icon="backspace"
                label="Back to document validation"
                @click="goBackToDocumentVerificationStage()"
            />-->
            <!-- <q-btn class="q-ml-sm" color="primary" @click="$refs.stepper.next()">Continue</q-btn> -->
          </div>
          <div
            v-else-if="
              (formdata.plan !=
                implementedQueue.value?.leadInformation?.plan?.id ||
                formdata.plan ==
                  implementedQueue.value?.leadInformation?.plan?.id) &&
              check
            "
          >
            <q-btn class="q-ml-sm" color="primary" @click="sendtoNH(formdata1)"
              >Send to RSM</q-btn
            >
            <!-- <q-btn
                color="negative"
                class="q-ma-xs"
                icon="backspace"
                label="Back to document validation"
                @click="goBackToDocumentVerificationStage()"
            />-->
            <!-- <q-btn class="q-ml-sm" color="primary" @click="$refs.stepper.next()">Continue</q-btn> -->
          </div>
          <div v-else>
            <q-btn class="q-ml-sm" color="primary" @click="stepper.next()"
              >Continue</q-btn
            >
          </div>
        </q-stepper-navigation>
      </q-step>

      <q-step :name="'ad_group'" :title="'Edit KYC Fields'">
        <p class="caption">
          <strong>Edit KYC Details</strong>
        </p>
        <div class="row gutter-sm">
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="merchant.companyinformation.legalName"
              class="no-margin"
              label="Legal Name"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="merchant.companyinformation.dbaName"
              class="no-margin"
              label="DBA Name"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="merchant.companyinformation.contactName"
              class="no-margin"
              label="Contact Name"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="merchant.companyinformation.registeredAddress"
              class="no-margin"
              label="Address"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              color="grey-9"
              v-model.trim="merchant.companyinformation.registeredCityName"
              label="City (type min 3 characters)*"
              placeholder="Start typing ..*"
            >
              <!-- q-autocomplete is not available in Quasar v2, using q-select with filter instead -->
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
            <!-- {{merchant.companyinformation.registeredCityName}} -->
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              color="grey-9"
              v-model.trim="merchant.companyinformation.registeredStateName"
              label="state (type min 3 characters)*"
              placeholder="Start typing ..*"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="merchant.companyinformation.registeredPin"
              class="no-margin"
              label="Pincode"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="merchant.companyinformation.contactMobile"
              class="no-margin"
              label="Mobile Number"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="merchant.companyinformation.contactEmail"
              class="no-margin"
              label="Email Id"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="merchant.companyinformation.statementEmail"
              class="no-margin"
              label="Statement Email ID"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="merchant.companyinformation.businessNature"
              class="no-margin"
              label="Nature of Business Change"
            />
          </div>
          <!-- <div class="col-xs-12 col-sm-6">
              <q-input v-model="merchant.companyinformation.contactMobile" class="no-margin" label="Contact Number" />
          </div>-->

          <div class="col-xs-12 col-sm-6">
            <q-input
              uppercase
              color="grey-9"
              @blur="v$.merchant.companyinformation.pan.$touch"
              :error="v$.merchant.companyinformation.pan.$error"
              v-model="merchant.companyinformation.pan"
              class="no-margin"
              label="Pan Number"
            />
            <div
              class="text-negative"
              v-if="error.field.merchant.companyinformation.pan.alert"
            >
              <MarsErrorResponse
                :error="error.field.merchant.companyinformation.pan"
              />
            </div>
            <div
              class="text-negative q-py-xs group q-caption"
              v-if="v$.merchant.companyinformation.pan.$error"
            >
              <div>
                <q-icon color="negative" name="warning" />&nbsp;Required -
                Provide valid PAN Number
              </div>
              <div v-if="v$.merchant.companyinformation.pan.minLength">
                <q-icon color="negative" name="warning" />
                &nbsp;Length should be between
                {{ v$.merchant.companyinformation.pan.minLength.$params.min }}
                and
                {{ v$.merchant.companyinformation.pan.maxLength.$params.max }}
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              uppercase
              color="grey-9"
              @blur="v$.merchant.businessInformation.gstId.$touch"
              :error="v$.merchant.businessInformation.gstId.$error"
              v-model="merchant.businessInformation.gstId"
              class="no-margin"
              label="Gst Number"
            />
            <div
              class="text-negative"
              v-if="error.field.merchant.businessInformation.gstId.alert"
            >
              <MarsErrorResponse
                :error="error.field.merchant.businessInformation.gstId"
              />
            </div>

            <div
              class="text-negative q-py-xs group q-caption"
              v-if="v$.merchant.businessInformation.gstId.$error"
            >
              <div>
                <q-icon color="negative" name="warning" />&nbsp;Required -
                Provide valid GST Number
              </div>
              <div v-if="v$.merchant.businessInformation.gstId.minLength">
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
          <!-- <div class="col-xs-12 col-sm-6">
              <q-input v-model="model" class="no-margin" label="Details 4" />
          </div>-->
          <div class="col-xs-12 col-sm-6">
            <q-input
              uppercase
              color="grey-9"
              @blur="populateBankDetails"
              v-model.trim="merchant.bankInformation.bankDetails.ifsc"
              label="IFSC Code*"
              placeholder="Enter IFSC*"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              uppercase
              color="grey-9"
              v-model.trim="merchant.bankInformation.bankDetails.bankName"
              label="Bank Name*"
              placeholder="Enter IFSC*"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-select
              placeholder="Choose from the below"
              color="grey-9"
              v-model.trim="merchant.bankInformation.bankDetails.paymentMode"
              label="Payment mode"
              :options="paymnentModeOptions"
            />
          </div>
          <!-- <div class="col-xs-12 col-sm-6">
              <q-select
                  placeholder="Choose from the below*"
                  color="grey-9"
                  v-model.trim="merchant.paymentDetails.rentalPlanCode"
                  label="Rental Plan*"
                  :options="rentalPlanSet"
                />
          </div> -->
          <div class="col-xs-12 col-sm-6">
            <q-select
              placeholder="Choose from the below"
              color="grey-9"
              v-model.trim="merchant.bankInformation.bankDetails.accountType"
              label="Account Type"
              :options="accountTypeOptions"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="merchant.bankInformation.bankDetails.accountNumber"
              class="no-margin"
              label="Account Numbers"
            />
          </div>
          <!-- <div class="col-xs-12 col-sm-6">
              <p><b>Auto or Manual Settlement?</b></P>
              <q-radio
                v-for="(item,index) in autoormanualOptions"
                :key="index"
                color="grey-9"
                v-model.trim="merchant.paymentDetails.settlementType"
                :val="item.value"
                :label="item.label"
              />
          </div> -->
          <!-- <div class="col-xs-12 col-sm-6">
              <q-input v-model="model" class="no-margin" label="MDR Change" />
          </div>-->
          <!-- <div class="col-xs-12 col-sm-6">
              <p>
                <b>Pre Auth Enable?</b>
              </p>
              <q-radio
                v-for="(item,index) in preauthOptions"
                :key="index"
                color="grey-9"
                v-model.trim="merchant.paymentDetails.preAuth"
                :val="item.value"
                :label="item.label"
              />
          </div> -->
          <!-- <div class="col-xs-12 col-sm-6">
              <p>
                <b>Cash/POS Activation?</b>
              </p>
              <q-radio
                v-for="(item,index) in cashandposOptions"
                :key="index"
                color="grey-9"
                v-model.trim="merchant.paymentDetails.cashAtPosEnabled"
                :val="item.value"
                :label="item.label"
              />
          </div> -->
          <!-- <div class="col-xs-12 col-sm-6">
              <p>
                <b>Internation Card Acceptance?</b>
              </p>
              <q-radio
                v-for="(item,index) in internationalcardOptions"
                :key="index"
                color="grey-9"
                v-model.trim="merchant.paymentDetails.intlCardAcceptance"
                :val="item.value"
                :label="item.label"
              />
          </div> -->
          <!-- <div class="col-xs-12 col-sm-6">
              <p>
                <b>Tip Enable?</b>
              </p>
              <q-radio
                v-for="(item,index) in tipOptions"
                :key="index"
                color="grey-9"
                v-model.trim="merchant.paymentDetails.tipEnabled"
                :val="item.value"
                :label="item.label"
              />
          </div> -->
        </div>
        <!-- <div class="row gutter-sm">
          <div class="col-xs-12">
            Cheque
            <label class="cursor-pointer text-white" style="background-color: #202c3f;">
              <span class="q-caption text-weight-light">Attach</span>
              <input
                type="file"
                name="file"
                id="file"
                v-on:change="fnVerificationDocumentUploadSingleUpload()"
                accept=".png, .jpg, .pdf"
              />
            </label>
          </div>
        </div>Pan Card:
        <div>
          <label class="cursor-pointer text-white" style="background-color: #202c3f;">
            <span class="q-caption text-weight-light">Attach</span>
            <input
              type="file"
              name="file"
              id="file"
              v-on:change="fnVerificationDocumentUploadSingleUpload()"
              accept=".png, .jpg, .pdf"
            />
          </label>
        </div>
        <div>
          Cheque :
          <label class="cursor-pointer text-white" style="background-color: #202c3f;">
            <span class="q-caption text-weight-light">Attach</span>
            <input
              type="file"
              name="file"
              id="file"
              v-on:change="fnVerificationDocumentUploadSingleUpload()"
              accept=".png, .jpg, .pdf"
            />
          </label>
        </div>-->

        <q-stepper-navigation>
          <!-- <q-btn color="primary" @click="$refs.stepper.next()">Submit</q-btn> -->
          <!-- <q-btn class="q-ml-sm" color="secondary"  @click="finalMerchant(merchant)">Submit to Mars Merchant Details</q-btn> -->
          <q-btn class="q-ml-sm" color="primary" @click="next"
            >Continue</q-btn
          >

          <q-btn
            class="q-ml-sm"
            color="primary"
            flat
            @click="stepper.previous()"
            >Back</q-btn
          >
        </q-stepper-navigation>
      </q-step>
      <q-step :name="'mdrdetails'" :title="'MDR Changes'">
        <div class="row group items-center">
          <div class="col-md-12">
            <div class="row items-center">
              <div class="col-3">
                <div class="q-caption text-weight-medium">
                  <strong>Domestic Debit Card below 2000</strong>
                </div>
              </div>
              <div class="col">
                <div
                  class="q-caption text-weight-medium q-py-sm"
                  align="center"
                >
                  <b>Merchant Disc Fee</b>
                </div>
                <div class="row group bg-green-2">
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="
                        merchant.mdrPlan.domesticDebitUpTo2000.fixed
                      "
                      placeholder="Fixed"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="
                        merchant.mdrPlan.domesticDebitUpTo2000.percentage
                      "
                      placeholder="%"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="
                        merchant.mdrPlan.domesticDebitUpTo2000.minimum
                      "
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row items-center">
              <div class="col-3">
                <div class="q-caption text-weight-medium">
                  <strong>Domestic Debit Card above 2000</strong>
                </div>
              </div>
              <div class="col">
                <div class="row group bg-green-2">
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="
                        merchant.mdrPlan.domesticDebitAbove2000.fixed
                      "
                      placeholder="Fixed"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="
                        merchant.mdrPlan.domesticDebitAbove2000.percentage
                      "
                      placeholder="%"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="
                        merchant.mdrPlan.domesticDebitAbove2000.minimum
                      "
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row items-center">
              <div class="col-3">
                <div class="q-caption text-weight-medium">
                  <strong>Standard/Classic (1st Stab)</strong>
                </div>
              </div>
              <div class="col">
                <div class="row group bg-green-2">
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="merchant.mdrPlan.standardOrClassic.fixed"
                      placeholder="Fixed"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="
                        merchant.mdrPlan.standardOrClassic.percentage
                      "
                      placeholder="%"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="merchant.mdrPlan.standardOrClassic.minimum"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row items-center">
              <div class="col-3">
                <div class="q-caption text-weight-medium">
                  <strong>Premium/Platinum (2nd Stab)</strong>
                </div>
              </div>
              <div class="col">
                <div class="row group bg-green-2">
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="merchant.mdrPlan.premiumOrPlatinum.fixed"
                      placeholder="Fixed"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="
                        merchant.mdrPlan.premiumOrPlatinum.percentage
                      "
                      placeholder="%"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="merchant.mdrPlan.premiumOrPlatinum.minimum"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row items-center">
              <div class="col-3">
                <div class="q-caption text-weight-medium">
                  <strong>Super Premium/Signature (3rd Stab)</strong>
                </div>
              </div>
              <div class="col">
                <div class="row group bg-green-2">
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="
                        merchant.mdrPlan.superPremiumOrSignature.fixed
                      "
                      placeholder="Fixed"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="
                        merchant.mdrPlan.superPremiumOrSignature.percentage
                      "
                      placeholder="%"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="
                        merchant.mdrPlan.superPremiumOrSignature.minimum
                      "
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row items-center">
              <div class="col-3">
                <div class="q-caption text-weight-medium">
                  <strong>Commercial/Coporate 4th Stab</strong>
                </div>
              </div>
              <div class="col">
                <div class="row group bg-green-2">
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="
                        merchant.mdrPlan.commercialOrCorporate.fixed
                      "
                      placeholder="Fixed"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="
                        merchant.mdrPlan.commercialOrCorporate.percentage
                      "
                      placeholder="%"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="
                        merchant.mdrPlan.commercialOrCorporate.minimum
                      "
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row items-center">
              <div class="col-3">
                <div class="q-caption text-weight-medium">
                  <strong>International Debit Card</strong>
                </div>
              </div>
              <div class="col">
                <div class="row group bg-green-2">
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="
                        merchant.mdrPlan.internationalDebitCard.fixed
                      "
                      placeholder="Fixed"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="
                        merchant.mdrPlan.internationalDebitCard.percentage
                      "
                      placeholder="%"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="
                        merchant.mdrPlan.internationalDebitCard.minimum
                      "
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row items-center">
              <div class="col-3">
                <div class="q-caption text-weight-medium">
                  <strong>International Credit Card</strong>
                </div>
              </div>
              <div class="col">
                <div class="row group bg-green-2">
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="
                        merchant.mdrPlan.internationalCreditCard.fixed
                      "
                      placeholder="Fixed"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="
                        merchant.mdrPlan.internationalCreditCard.percentage
                      "
                      placeholder="%"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="
                        merchant.mdrPlan.internationalCreditCard.minimum
                      "
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row items-center">
              <div class="col-3">
                <div class="q-caption text-weight-medium">
                  <strong>Onus</strong>
                </div>
              </div>
              <div class="col">
                <div class="row group bg-green-2">
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="merchant.mdrPlan.onus.fixed"
                      placeholder="Fixed"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="merchant.mdrPlan.onus.percentage"
                      placeholder="%"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="merchant.mdrPlan.onus.minimum"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row items-center">
              <div class="col-3">
                <div class="q-caption text-weight-medium">
                  <strong>Diners</strong>
                </div>
              </div>
              <div class="col">
                <div class="row group bg-green-2">
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="merchant.mdrPlan.diners.fixed"
                      placeholder="Fixed"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="merchant.mdrPlan.diners.percentage"
                      placeholder="%"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="merchant.mdrPlan.diners.minimum"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row items-center">
              <div class="col-3">
                <div class="q-caption text-weight-medium">
                  <strong>Master Pass</strong>
                </div>
              </div>
              <div class="col">
                <div class="row group bg-green-2">
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="merchant.mdrPlan.masterPass.fixed"
                      placeholder="Fixed"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="merchant.mdrPlan.masterPass.percentage"
                      placeholder="%"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="merchant.mdrPlan.masterPass.minimum"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row items-center">
              <div class="col-3">
                <div class="q-caption text-weight-medium">
                  <strong>Cash at POS</strong>
                </div>
              </div>
              <div class="col">
                <div class="row group bg-green-2">
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="merchant.mdrPlan.cashAtPos.fixed"
                      placeholder="Fixed"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="merchant.mdrPlan.cashAtPos.percentage"
                      placeholder="%"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="merchant.mdrPlan.cashAtPos.minimum"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row items-center">
              <div class="col-3">
                <div class="q-caption text-weight-medium">
                  <strong>Convenience fees</strong>
                </div>
              </div>
              <div class="col">
                <div class="row group bg-green-2">
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="merchant.mdrPlan.convenientFee.fixed"
                      placeholder="Fixed"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="merchant.mdrPlan.convenientFee.percentage"
                      placeholder="%"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      color="grey-9"
                      type="number"
                      v-model.trim="merchant.mdrPlan.convenientFee.minimum"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!-- <div class="row group">
                    <div class="col-md-4">
                      <q-input
                          color="grey-9"
                          type="number"
                          v-model.trim="merchant.mdrPlan.remarks"
                          placeholder="Mdr Remarks"
                        />

                    </div>
                   
            </div>-->
          </div>
        </div>

        <q-stepper-navigation>
          <!-- <q-btn class="q-ml-sm" color="secondary"  @click="finalFormSubmit(merchant)">Submit to Mars MDR</q-btn> -->
          <!-- <q-btn class="q-ml-sm" color="primary" @click="next()">Continue</q-btn> -->
          <q-btn class="q-ml-sm" color="primary" @click="stepper.next()"
            >Continue</q-btn
          >
          <q-btn
            class="q-ml-sm"
            color="primary"
            flat
            @click="stepper.previous()"
            >Back</q-btn
          >
        </q-stepper-navigation>
      </q-step>
      <q-step :name="'zata'" :title="'Attach Documents'">
        <div>
          <q-item class="q-body-1">
            <q-item-section>
              <div class="q-body-1">
                Merchant type:
                <span class="text-weight-medium">{{ merchantTypeSelection }}</span>
              </div>
            </q-item-section>
          </q-item>
          <q-item
            class="q-body-1 text-dark bg-grey-4 text-weight-medium"
          >
            <q-item-section>Application Form</q-item-section>
            <q-item-section side>
              <label
                class="cursor-pointer text-white"
                style="background-color: #202c3f"
              >
                <span class="q-caption text-weight-light">Attach</span>
                <input
                  type="file"
                  name="file"
                  @change="fnUploadApplicationForm1($event, document)"
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
                  v-if="shortLeadInfo.value?.applicationFileMimeType == null"
                >
                  <!-- <div @click="fnPDFViewModal(shortLeadInfo.value?.applicationFile)" class="ellipsis">
                    <q-btn round size="sm" icon="fas fa-file-pdf" color="primary" />
                    &nbsp;{{shortLeadInfo.value?.applicationFile}}
                  </div> -->
                </div>
                <div
                  class="cursor-pointer"
                  v-else-if="
                    shortLeadInfo.value?.applicationFileMimeType?.includes('pdf')
                  "
                >
                  <div
                    @click="fnPDFViewModal(shortLeadInfo.value?.applicationFile)"
                    class="ellipsis"
                  >
                    <q-btn
                      round
                      size="sm"
                      icon="fas fa-file-pdf"
                      color="primary"
                    />
                    &nbsp;{{ shortLeadInfo.value?.applicationFile }}
                  </div>
                </div>
                <div
                  class="cursor-pointer"
                  v-else-if="
                    shortLeadInfo.value?.applicationFileMimeType?.includes('image')
                  "
                >
                  <img
                    :src="
                      GLOBAL_FILE_FETCH_URL +
                        '/' +
                        shortLeadInfo.value?.applicationFile
                    "
                    ref="handedOverImageViewer"
                    style="max-width: 100%; display: none"
                  />
                  <div @click="fnViewHandedOverFileImage()" class="ellipsis">
                    <q-icon name="fas fa-image" color="amber-9" />
                    &nbsp;{{ shortLeadInfo.value?.applicationFile }}
                  </div>
                </div>
                <div v-else>Invalid document type/ No document available</div>
              </div>
            </q-item-section>
          </q-item>
          <!-- START >> (Optional) payment document file == bank subvention  -->
          <!-- <q-item
            v-if="shortLeadInfo.value?.paymentDocumentFile != ''"
            class="q-body-1 text-dark bg-grey-4 text-weight-medium"
          >
            <q-item-section>Bank Letter</q-item-section>
          </q-item>
          <q-item v-if="shortLeadInfo.value?.paymentDocumentFile != ''" class="q-body-1">
            <q-item-section>
              <div class="full-width">
                <div
                  class="cursor-pointer"
                  v-if="shortLeadInfo.value?.paymentDocumentMimeType.includes('pdf')"
                >
                  <div
                    @click="fnPDFViewModal(shortLeadInfo.value?.paymentDocumentFile)"
                    class="ellipsis"
                  >
                    <q-btn round size="sm" icon="fas fa-file-pdf" color="primary" />
                    &nbsp;{{shortLeadInfo.value?.paymentDocumentFile}}
                  </div>
                </div>
                <div
                  class="cursor-pointer"
                  v-else-if="shortLeadInfo.value?.paymentDocumentMimeType.includes('image')"
                >
                  <img
                    :src="[GLOBAL_FILE_FETCH_URL+ '/'+shortLeadInfo.value?.paymentDocumentFile]"
                    ref="bankUploadedLetter"
                    style="max-width:100%; display: none"
                  />
                  <div @click="fnViewbankUploadedLetterImage()" class="ellipsis">
                    <q-icon name="fas fa-image" color="amber-9" />
                    &nbsp;{{shortLeadInfo.value?.paymentDocumentFile}}
                  </div>
                </div>
              </div>
            </q-item-section>
          </q-item> -->
          <div
            v-if="merchantTypeSelection == 0"
            class="full-width q-body-1 q-pa-sm"
          >
            <p>No documents available to display</p>
          </div>
          <div v-else class="group">
            <!-- Fixed v-if with v-for issue: Moved v-if to a computed property -->
            <template v-for="singleDocument in filteredSingleDocuments" :key="singleDocument.id">
              <div class="no-padding">
                <div
                  v-for="(document, documentIndex) in singleDocument.documents"
                  :key="documentIndex"
                  class="border-bottom"
                >
                  <q-item class="q-body-1 bg-grey-4 q-pa-sm">
                    <q-item-section>{{ document.subDocumentType }}</q-item-section>
                    <q-item-section side>
                      <label
                        class="cursor-pointer text-white"
                        style="background-color: #202c3f"
                      >
                        <span class="q-caption text-weight-light">Attach</span>
                        <input
                          type="file"
                          name="file"
                          @change="
                            fnVerificationDocumentUploadSingleUpload(
                              $event,
                              document
                            )
                          "
                          accept=".png, .jpg, .pdf"
                        />
                      </label>
                    </q-item-section>
                  </q-item>
                  <!-- {{shortLeadInfo.value?.leadDocuments}} -->
                  <!-- Fixed v-if with v-for issue: Filter displayAttachedFile in computed property -->
                  <template v-for="displayAttachedFile in getFilteredAttachedFiles(document)" :key="displayAttachedFile.index">
                    <!-- Fixed v-if with v-for issue: Filter attachedSubFile in computed property -->
                    <template v-for="attachedSubFile in getFilteredSubFiles(displayAttachedFile, document)" :key="attachedSubFile.id">
                      <q-item
                        v-for="(
                          filesAttachedEarlier, filesAttachedEarlierIndex
                        ) in attachedSubFile.uploadedDocuments"
                        :key="filesAttachedEarlierIndex"
                        class="q-body-1"
                      >
                        <q-item-section>
                          <div class="q-body-1">
                            <div
                              class="cursor-pointer"
                              v-if="filesAttachedEarlier.mimeType.includes('pdf')"
                            >
                              <div
                                ref="attachedImageViewer"
                                @click="
                                  fnPDFViewModal(filesAttachedEarlier.fileName)
                                "
                                class="ellipsis"
                              >
                                <q-icon name="fas fa-file-pdf" color="negative" />
                                &nbsp;{{ filesAttachedEarlier.fileName }}
                              </div>
                            </div>
                            <div
                              class="cursor-pointer"
                              v-else-if="
                                filesAttachedEarlier.mimeType.includes('image')
                              "
                            >
                              <img
                                :src="
                                  GLOBAL_FILE_FETCH_URL +
                                    '/' +
                                    filesAttachedEarlier.fileName
                                "
                                :ref="el => attachedImageViewer[filesAttachedEarlierIndex] = el"
                                style="max-width: 100%; display: none"
                              />
                              <div
                                @click="
                                  fnViewAttachedFileImage(
                                    filesAttachedEarlierIndex
                                  )
                                "
                                class="ellipsis"
                              >
                                <q-icon name="fas fa-image" color="amber-9" />
                                &nbsp;{{ filesAttachedEarlier.fileName }}
                              </div>
                            </div>
                          </div>
                        </q-item-section>

                        <q-item-section side>
                          <q-btn
                            size="xs"
                            icon="clear"
                            @click="
                              fnDeleteAlreadyAttachedFile(filesAttachedEarlier)
                            "
                            round
                            color="negative"
                            label="Remove"
                          />
                        </q-item-section>
                      </q-item>
                    </template>
                  </template>
                </div>
              </div>
            </template>
            <!-- Fixed v-if with v-for issue: Moved v-if to a computed property -->
            <template v-for="multipleDocument in filteredMultipleDocuments" :key="multipleDocument.id">
              <div class="no-padding">
                <q-list-header class="q-mb-sm bg-grey-4">{{
                  multipleDocument.documentType
                }}</q-list-header>
                <div>
                  <q-item class="q-body-1 q-pa-sm">
                    <q-item-section>
                      <!-- <pre>{{multipleDocument.subDocumentTypeSelection}}</pre> -->
                      <select
                        class="full-width customQuasarSelect"
                        v-model="multipleDocument.subDocumentTypeSelection"
                        @change="
                          fnGetSubDocuments(
                            multipleDocument.subDocumentTypeSelection
                          )
                        "
                      >
                        <option disabled :value="0">Choose from below</option>
                        <option
                          v-for="type in multipleDocument.documents"
                          :key="type.id"
                          :value="type"
                        >
                          {{ type.subDocumentType }}
                        </option>
                      </select>
                    </q-item-section>
                    <q-item-section
                      side
                      v-if="
                        fn_________GetEntryPermissionToUploadSubDocuments(
                          multipleDocument
                        )
                      "
                      ref="subDocumentUploadParent"
                    >
                      <label
                        class="cursor-pointer text-white"
                        style="background-color: #202c3f"
                      >
                        <span class="q-caption text-weight-light">Attach</span>
                        <input
                          type="file"
                          ref="subDocumentUpload"
                          @change="
                            fnVerificationDocumentUpload(
                              $event,
                              multipleDocument.subDocumentTypeSelection
                            )
                          "
                          name="file"
                          accept=".png, .jpg, .pdf"
                        />
                      </label>
                    </q-item-section>
                  </q-item>
                </div>
                <!-- Fixed v-if with v-for issue: Filter displayAttachedFile in computed property -->
                <template v-for="displayAttachedFile in getFilteredMultipleAttachedFiles(multipleDocument)" :key="displayAttachedFile.index">
                  <div
                    v-for="attachedSubFile in displayAttachedFile"
                    :key="attachedSubFile.id"
                  >
                    <q-item
                      v-for="(
                        filesAttachedEarlier, filesAttachedEarlierIndex
                      ) in attachedSubFile.uploadedDocuments"
                      :key="filesAttachedEarlierIndex"
                      class="q-body-1"
                    >
                      <q-item-section>
                        <div class="q-body-1">
                          <div
                            class="cursor-pointer"
                            v-if="filesAttachedEarlier.mimeType.includes('pdf')"
                          >
                            <div
                              ref="multiAttachedImageViewer"
                              @click="
                                fnPDFViewModal(filesAttachedEarlier.fileName)
                              "
                              class="ellipsis"
                            >
                              <q-icon name="fas fa-file-pdf" color="negative" />
                              &nbsp;{{ filesAttachedEarlier.fileName }}
                            </div>
                          </div>
                          <div
                            class="cursor-pointer"
                            v-else-if="
                              filesAttachedEarlier.mimeType.includes('image')
                            "
                          >
                            <img
                              :src="
                                GLOBAL_FILE_FETCH_URL +
                                  '/' +
                                  filesAttachedEarlier.fileName
                              "
                              :ref="el => multiAttachedImageViewer[filesAttachedEarlierIndex] = el"
                              style="max-width: 100%; display: none"
                            />
                            <div
                              @click="
                                fnViewMultiAttachedFileImage(
                                  filesAttachedEarlierIndex
                                )
                              "
                              class="ellipsis"
                            >
                              <q-icon name="fas fa-image" color="amber-9" />
                              &nbsp;{{ filesAttachedEarlier.fileName }}
                            </div>
                          </div>
                        </div>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          size="xs"
                          icon="clear"
                          @click="
                            fnDeleteAlreadyAttachedFile(filesAttachedEarlier)
                          "
                          round
                          color="negative"
                          label="Remove"
                        />
                      </q-item-section>
                    </q-item>
                  </div>
                </template>
              </div>
            </template>
            <br />
            <br />
            <div class="row group">
              <div class="col-md-4">
                <q-input
                  color="grey-9"
                  v-model.trim="merchant.kyc.remarks"
                  placeholder="KYC Document Remarks"
                />
              </div>
            </div>
          </div>

          <!-- END >> (Mandatory) payment document file == bank subvention  -->
          <!-- END >> (Mandatory) Application form  -->

          <!-- START >> Handover to SAT, document upload -->
        </div>

        <q-stepper-navigation>
          <!-- <q-btn
            class="q-ml-sm"
            color="secondary"
            @click="finalFormSubmitKyc(merchant)"
          >Submit to Mars</q-btn> -->
          <q-btn class="q-ml-sm" color="primary" @click="next1"
            >Continue</q-btn
          >
          <!-- <q-btn class="q-ml-sm" color="primary" @click="fnsubmitTOmars()">Submit to Mars</q-btn> -->

          <q-btn
            class="q-ml-sm"
            color="primary"
            flat
            @click="stepper.previous()"
            >Back</q-btn
          >
        </q-stepper-navigation>
      </q-step>
      <q-step :name="'campaign1'" :title="'TID Level Details'" :default="false">
        <div class="row gutter-sm q-my-xs items-center">
          <div class="col-xs-12" align="center">
            <q-card
              ><strong>Choose the TID List</strong>
              <q-card-section>
                <q-checkbox
                  v-for="(item, index) in formdata.mid"
                  :key="index"
                  color="grey-9"
                  v-model.trim="formdata.tid"
                  :val="item"
                  :label="item"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
        <br /><br />

        <div class="row">
          <!--START: table title -->
          <div class="col-md-3">
            <strong>
              <span>Amount Collected </span>
            </strong>
            <br />
          </div>

          <div class="col-md-6">
            <q-input
              disable
              v-model="formdata.amountCollected"
              class="no-margin"
              label="Amount Collected"
            />
            <!--   :error="v$.formdata.leadSource.$error" -->
          </div>
        </div>
        <br />
        <div class="row">
          <!--START: table title -->
          <div class="col-md-3">
            <strong>
              <span>Recurring Fees</span>
            </strong>
            <br />
          </div>

          <div class="col-md-6">
            <q-input
              disable
              v-model="formdata.recurringFees"
              class="no-margin"
              label="Recurring Fees"
            />
            <!--   :error="v$.formdata.leadSource.$error" -->
          </div>
        </div>
        <br />
        <div class="row">
          <div class="col-md-3">
            <strong>
              <span>Select the Rental Plan</span>
            </strong>
            <br />
          </div>
          <div class="col-md-6">
            <q-select
              :disable="
                implementedQueue.value?.leadInformation?.cmsLeadStatus == 22
                  ? false
                  : true
              "
              placeholder="Choose from the below*"
              color="grey-9"
              v-model.trim="merchant.paymentDetails.rentalPlanCode"
              label="Rental Plan*"
              :options="rentalPlanSet"
            />
            <!-- :error="v$.formdata.count.$error" -->
          </div>
        </div>
        <div class="row">
          <!--START: table title -->
          <div class="col-md-3">
            <strong>
              <span>Auto or Manual Settlement?</span>
            </strong>
            <br />
          </div>

          <div class="col-md-6">
            <q-radio
              v-for="(item, index) in autoormanualOptions"
              :key="index"
              color="grey-9"
              v-model.trim="merchant.paymentDetails.settlementType"
              :val="item.value"
              :label="item.label"
            />
            <!--   :error="v$.formdata.leadSource.$error" -->
          </div>
        </div>
        <br />
        <div class="row">
          <!--START: table title -->
          <div class="col-md-3">
            <strong>
              <span>Pre Auth Enable?</span>
            </strong>
            <br />
          </div>

          <div class="col-md-6">
            <q-radio
              v-for="(item, index) in preauthOptions"
              :key="index"
              color="grey-9"
              v-model.trim="merchant.paymentDetails.preAuth"
              :val="item.value"
              :label="item.label"
            />
            <!--   :error="v$.formdata.leadSource.$error" -->
          </div>
        </div>
        <br />
        <div class="row">
          <!--START: table title -->
          <div class="col-md-3">
            <strong>
              <span>Cash/POS Activation?</span>
            </strong>
            <br />
          </div>

          <div class="col-md-6">
            <q-radio
              v-for="(item, index) in cashandposOptions"
              :key="index"
              color="grey-9"
              v-model.trim="merchant.paymentDetails.cashAtPosEnabled"
              :val="item.value"
              :label="item.label"
            />
            <!--   :error="v$.formdata.leadSource.$error" -->
          </div>
        </div>
        <br />
        <div class="row">
          <!--START: table title -->
          <div class="col-md-3">
            <strong>
              <span>Internation Card Acceptance?</span>
            </strong>
            <br />
          </div>

          <div class="col-md-6">
            <q-radio
              v-for="(item, index) in internationalcardOptions"
              :key="index"
              color="grey-9"
              v-model.trim="merchant.paymentDetails.intlCardAcceptance"
              :val="item.value"
              :label="item.label"
            />
            <!--   :error="v$.formdata.leadSource.$error" -->
          </div>
        </div>
        <br />
        <div class="row">
          <!--START: table title -->
          <div class="col-md-3">
            <strong>
              <span>Tip Enable?</span>
            </strong>
            <br />
          </div>

          <div class="col-md-6">
            <q-radio
              v-for="(item, index) in tipOptions"
              :key="index"
              color="grey-9"
              v-model.trim="merchant.paymentDetails.tipEnabled"
              :val="item.value"
              :label="item.label"
            />
            <!--   :error="v$.formdata.leadSource.$error" -->
          </div>
        </div>
        <br />

        <q-stepper-navigation>
          <q-btn
            class="q-ml-sm"
            color="secondary"
            @click="finalFormSubmitKyc(merchant)"
            >Submit to Mars</q-btn
          >

          <!-- <q-btn class="q-ml-sm" color="primary" @click="fnsubmitTOmars()">Submit to Mars</q-btn> -->

          <q-btn
            class="q-ml-sm"
            color="primary"
            flat
            @click="stepper.previous()"
            >Back</q-btn
          >
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
    <showPdfModalComponent
      v-if="toggleshowPDFModal"
      :propToggleshowPDFModal="toggleshowPDFModal"
      :propPDFDetails="PDFDetails"
      @togglePDFModal="fnPDFViewModal"
    ></showPdfModalComponent>
  </q-page>
</template>
<style>
.customQuasarSelect {
  padding: 5px;
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
</style>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required,  minLength, maxLength,helpers } from '@vuelidate/validators';
import _ from 'lodash';
import MarsErrorResponse from '../../components/MarsErrorResponseHandler.vue';
import showPdfModalComponent from '../../components/sat/showPdfModalComponent.vue';

const $q = useQuasar();
const store = useStore();
const router = useRouter();
const route = useRoute();

// Refs
const stepper = ref(null);
const step = ref('campaign');
const check = ref(false);
const merchantTypeSelection = ref('');
const stateOptions = ref([]);
const cityOptions = ref([]);
const rentalPlanSet = ref([]);
const dataCopy = ref([]);
const PDFDetails = ref(null);
const toggleshowPDFModal = ref(false);
const attachedImageViewer = ref([]);
const multiAttachedImageViewer = ref([]);

// Dropdown data
const dropDown = ref({
  deviceOptions: [],
  planOptions: [],
  leadSourceOptions: [],
  merchantTypesOptions: [],
});

// Form data
const info = ref({
  datainfo1: "",
});

const formdata = ref({
  mid: [],
  tid: [],
  sample: "",
  paymentOption: "",
  cmsCategoryType: "",
  referenceNumber: "",
  paymentMadeon: "",
  setupFees: "",
  deviceId: "",
  leadSourceId: "",
  recurringFees: "",
  verifiedCmsPricingStatus: 1,
  plan: "",
  planCode: "",
  contactName: "",
  contactNumber: "",
  alternateContactNumber: "",
  city: "",
  device: "",
  deviceCount: "",
  leadAddress: "",
  latitude: "",
  longitude: "",
  state: "",
  leadCategory: 2,
  kyc: false,
  verifiedBanksubventionStatus: "",
  reason: "",
  amountCollected: "",
  merchantCategory: "",
  corpCC: "",
  debitGreaterthanAmount: "",
  debitLessthanAmount: "",
  premiumCC: "",
  pricing: 1,
  leadStatus: "",
  submittoRSMDate: "",
  posIncentive: "",
  posEnable: "",
  leadName: "",
  paymentDocumentFile: "",
  paymentDocumentMimeType: "",
});

const forminfo = ref({
  applicationNumber: "",
});

const formdata1 = ref({
  paymentOption: "",
  referenceNumber: "",
  paymentMadeon: "",
  setupFees: "",
  deviceId: "",
  leadSourceId: "",
  recurringFees: "",
  verifiedCmsPricingStatus: 1,
  plan: "",
  planCode: "",
  contactName: "",
  contactNumber: "",
  alternateContactNumber: "",
  city: "",
  device: "",
  deviceCount: "",
  leadAddress: "",
  latitude: "",
  longitude: "",
  state: "",
  leadCategory: 2,
  kyc: false,
  verifiedBanksubventionStatus: "",
  reason: "",
  merchantCategory: "",
  corpCC: "",
  debitGreaterthanAmount: "",
  debitLessthanAmount: "",
  premiumCC: "",
  pricing: 1,
  leadStatus: "",
  submittoRSMDate: "",
  posIncentive: "",
  posEnable: "",
  leadName: "",
  paymentDocumentFile: "",
  paymentDocumentMimeType: "",
});

const merchant = ref({
  salesInformation: {
    institutionCode: "",
  },
  companyinformation: {
    pan: "",
    contactPhone: "",
    legalName: "",
    dbaName: "",
    registeredAddress: "",
    registeredPin: "",
    registeredCityRefCode: "",
    registeredStateRefCode: "",
    registeredCityName: "",
    registeredStateName: "",
    businessNature: "",
    contactMobile: "",
    contactName: "",
    statementEmail: "",
    contactEmail: "",
    applicationNumber: "",
    remarks: "Company Details Updated",
  },
  bankInformation: {
    bankDetails: {
      accountNumber: "",
      ifsc: "",
      bankName: "",
      paymentMode: "",
      accountType: "",
    },
    remarks: "Bank Details Updated",
  },
  businessInformation: {
    gstId: null,
    remarks: "",
  },
  kyc: {
    remarks: "",
    documents: [],
  },
  paymentDetails: {
    settlementType: "",
    tipEnabled: "",
    cashAtPosEnabled: "",
    intlCardAcceptance: "",
    preAuth: "",
    rentalPlanCode: 1,
    remarks: "Payment Details Updated",
  },
  mdrPlan: {
    remarks: "MDR Value Updated",
    code: 1,
    domesticDebitUpTo2000: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 0.0,
    },
    domesticDebitAbove2000: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 0.0,
    },
    standardOrClassic: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 0.0,
    },
    premiumOrPlatinum: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 0.0,
    },
    superPremiumOrSignature: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 0.0,
    },
    commercialOrCorporate: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 0.0,
    },
    internationalDebitCard: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 0.0,
    },
    internationalCreditCard: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 0.0,
    },
    onus: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 0.0,
    },
    diners: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 0.0,
    },
    masterPass: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 0.0,
    },
    cashAtPos: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 0.0,
    },
    convenientFee: {
      fixed: 0.0,
      percentage: 0.0,
      minimum: 0.0,
    },
  },
});

const error = ref({
  formdata: {
    cmsCategoryType: {
      alert: false,
      issue: "",
      value: "",
    },
  },
  field: {
    merchant: {
      businessInformation: {
        gstId: {
          alert: false,
          issue: "",
          value: "",
        },
      },
      companyinformation: {
        pan: {
          alert: false,
          issue: "",
          value: "",
        },
      },
    },
  },
});

// Options arrays
const payment = [
  { label: "Cheque", value: 2 },
  { label: "Swipe", value: 3 },
  { label: "Neft", value: 1 },
];

const cmsCategoryTypeOptions = [
  { label: "Small", value: "S" },
  { label: "Other", value: "O" },
];

const autoormanualOptions = [
  { label: "Auto Settlement", value: "A" },
  { label: "Manual Settlement", value: "M" },
];

const preauthOptions = [
  { label: "Enable", value: "Y" },
  { label: "Disable", value: "N" },
];

const cashandposOptions = [
  { label: "Enable", value: "Y" },
  { label: "Disable", value: "N" },
];

const internationalcardOptions = [
  { label: "Enable", value: "Y" },
  { label: "Disable", value: "N" },
];

const tipOptions = [
  { label: "Enable", value: "Y" },
  { label: "Disable", value: "N" },
];

const paymnentModeOptions = [
  { label: "Direct credit", value: "D" },
  { label: "NEFT", value: "N" },
];

const accountTypeOptions = [
  { label: "Saving account", value: "S" },
  { label: "Current account", value: "C" },
  { label: "Overdraft account", value: "O" },
  { label: "Cash credit account", value: "R" },
];

// Validation rules
const panCard = helpers.regex('panCard', /^([A-Z]{3}[ABCFEGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1})?$/);
const gstn = helpers.regex('gstn', /^([0-9]){2}([A-Z]{3}[ABCFEGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}[0-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/);

const rules = {
  formdata: {
    referenceNumber: { required },
    paymentOption: { required },
    cmsCategoryType: { required },
    paymentMadeon: { required },
  },
  merchant: {
    companyinformation: {
      pan: { 
        required, 
        panCard,
        maxLength: maxLength(10),
        minLength: minLength(10)
      },
    },
    businessInformation: {
      gstId: {
        gstn,
        maxLength: maxLength(15),
        minLength: minLength(15)
      },
    },
  },
};

const v$ = useVuelidate(rules, { formdata, merchant });

// Computed properties
const shortLeadInfo = computed(() => store.getters['SatLeadValidation/getShortLeadInfo']);
const shortLeadInfoDocumentTypes = computed(() => store.getters['SatLeadValidation/getShortLeadInfoDocumentTypes']);
const categoryBasedRental = computed(() => store.getters['categoryBasedRental/categoryBasedRental']);
const GLOBAL_FILE_FETCH_URL = computed(() => store.getters['GlobalVariables/GLOBAL_FILE_FETCH_URL']);
const allMarsData = computed(() => store.getters['GetMarsData/getAllMarsData']);
const implementedQueue = computed(() => store.getters['GetMarsData/getImplementedQueue']);
const midBasedList = computed(() => store.getters['GetMarsData/getMidBasedList']);

// Fixed v-if with v-for: Computed properties to filter data
const filteredSingleDocuments = computed(() => {
  if (!shortLeadInfoDocumentTypes.value?.uploadedDocuments?.forSingleDocument) {
    return [];
  }
  return shortLeadInfoDocumentTypes.value.uploadedDocuments.forSingleDocument;
});

const filteredMultipleDocuments = computed(() => {
  if (!shortLeadInfoDocumentTypes.value?.uploadedDocuments?.forMutipleDocument) {
    return [];
  }
  return shortLeadInfoDocumentTypes.value.uploadedDocuments.forMutipleDocument;
});

const getFilteredAttachedFiles = (document) => {
  const leadDocuments = shortLeadInfo.value?.leadDocuments;
  if (!leadDocuments) return [];
  
  return Object.entries(leadDocuments)
    .filter(([key]) => key == document.documentType)
    .map(([key, value], index) => ({
      index,
      key,
      value
    }));
};

const getFilteredSubFiles = (displayAttachedFile, document) => {
  return displayAttachedFile.value.filter(attachedSubFile => 
    attachedSubFile.subDocumentType === document.subDocumentType
  );
};

const getFilteredMultipleAttachedFiles = (multipleDocument) => {
  const leadDocuments = shortLeadInfo.value?.leadDocuments;
  if (!leadDocuments) return [];
  
  return Object.entries(leadDocuments)
    .filter(([key]) => key == multipleDocument.documentType)
    .map(([key, value], index) => ({
      index,
      key,
      value
    }));
};

// Methods
const ajaxLoadDataForDeviceTypeTable1 = async () => {
  try {
    await store.dispatch('SA_Devices/FETCH_DEVICES_DATA');
    const devicesInfo = store.getters['SA_Devices/getAllDevicesInfo'];
    dropDown.value.deviceOptions = _.map(devicesInfo, (item) => ({
      value: item.id,
      label: item.deviceName,
    }));

    await store.dispatch('leadSource/LEAD_SOURCE_ACTIVE_LIST');
    const leadSource = store.getters['leadSource/getActiveLeadSource'];
    dropDown.value.leadSourceOptions = _.map(leadSource, (item) => ({
      value: item.id,
      label: item.sourceName,
    }));

    await store.dispatch('plan/PLAN_ACTIVE_LIST');
    const plans = store.getters['plan/getActivePlan'];
    dropDown.value.planOptions = _.map(plans, (item) => ({
      value: item.id,
      label: item.planName,
    }));
  } catch (error) {
    console.error('Error loading dropdown data:', error);
  }
};

const ajaxLoadMarsData = async () => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Fetching data ..",
  });

  try {
    await store.dispatch('GetMarsData/IMPLEMENTED_QUEUE', route.params.id);
    if (implementedQueue.value?.leadInformation?.id) {
      await store.dispatch('SatLeadValidation/FETCH_SHORT_LEAD_DATA', implementedQueue.value.leadInformation.id);
      marsInfo();
      
      // Populate formdata from implementedQueue
      if (implementedQueue.value.leadInformation) {
        const leadInfo = implementedQueue.value.leadInformation;
        formdata.value.plan = leadInfo.plan?.id || '';
        formdata.value.planCode = leadInfo.plan?.planName || '';
        formdata.value.deviceId = leadInfo.device?.id || '';
        formdata.value.leadSourceId = leadInfo.leadSource?.id || '';
        formdata.value.contactName = leadInfo.contactName || '';
        formdata.value.contactNumber = leadInfo.contactNumber || '';
        formdata.value.alternateContactNumber = leadInfo.alternateContactNumber || '';
        formdata.value.city = leadInfo.city || '';
        formdata.value.device = leadInfo.device || '';
        formdata.value.deviceCount = leadInfo.deviceCount || '';
        formdata.value.leadAddress = leadInfo.leadAddress || '';
        formdata.value.latitude = leadInfo.latitude || '';
        formdata.value.longitude = leadInfo.longitude || '';
        formdata.value.state = leadInfo.state || '';
        formdata.value.kyc = leadInfo.kyc || false;
        formdata.value.verifiedBanksubventionStatus = leadInfo.verifiedBanksubventionStatus || '';
        formdata.value.reason = leadInfo.reason || '';
        formdata.value.merchantCategory = leadInfo.merchantCategory || '';
        formdata.value.pricing = leadInfo.pricing || 1;
        formdata.value.leadStatus = leadInfo.leadStatus || '';
        formdata.value.submittoRSMDate = leadInfo.submittoRSMDate || '';
        formdata.value.posIncentive = leadInfo.posIncentive || '';
        formdata.value.posEnable = leadInfo.posEnable || '';
        formdata.value.leadName = leadInfo.leadName || '';
        formdata.value.setupFees = leadInfo.setupFees || '';
        formdata.value.recurringFees = leadInfo.recurringFees || '';
        formdata.value.amountCollected = leadInfo.amountCollected || '';

        // Copy to formdata1
        formdata1.value.plan = leadInfo.plan?.id || '';
        formdata1.value.planCode = leadInfo.plan?.planName || '';
        formdata1.value.setupFees = leadInfo.setupFees || '';
        formdata1.value.recurringFees = leadInfo.recurringFees || '';
        formdata1.value.contactName = leadInfo.contactName || '';
        formdata1.value.contactNumber = leadInfo.contactNumber || '';
        formdata1.value.alternateContactNumber = leadInfo.alternateContactNumber || '';
        formdata1.value.city = leadInfo.city || '';
        formdata1.value.device = leadInfo.device || '';
        formdata1.value.deviceId = leadInfo.device?.id || '';
        formdata1.value.leadSourceId = leadInfo.leadSource?.id || '';
        formdata1.value.deviceCount = leadInfo.deviceCount || '';
        formdata1.value.leadAddress = leadInfo.leadAddress || '';
        formdata1.value.latitude = leadInfo.latitude || '';
        formdata1.value.longitude = leadInfo.longitude || '';
        formdata1.value.state = leadInfo.state || '';
        formdata1.value.kyc = leadInfo.kyc || false;
        formdata1.value.verifiedBanksubventionStatus = leadInfo.verifiedBanksubventionStatus || '';
        formdata1.value.reason = leadInfo.reason || '';
        formdata1.value.merchantCategory = leadInfo.merchantCategory || '';
        formdata1.value.pricing = leadInfo.pricing || 1;
        formdata1.value.leadStatus = leadInfo.leadStatus || '';
        formdata1.value.submittoRSMDate = leadInfo.submittoRSMDate || '';
        formdata1.value.posIncentive = leadInfo.posIncentive || '';
        formdata1.value.posEnable = leadInfo.posEnable || '';
        formdata1.value.leadName = leadInfo.leadName || '';

        // Populate mdrPlan
        merchant.value.mdrPlan.domesticDebitUpTo2000.percentage = leadInfo.debitLessthanAmount || 0;
        merchant.value.mdrPlan.domesticDebitAbove2000.percentage = leadInfo.debitGreaterthanAmount || 0;
        merchant.value.mdrPlan.standardOrClassic.percentage = leadInfo.stdCC || 0;
        merchant.value.mdrPlan.premiumOrPlatinum.percentage = leadInfo.premiumCC || 0;
        merchant.value.mdrPlan.superPremiumOrSignature.percentage = leadInfo.superPremiumlCC || 0;
        merchant.value.mdrPlan.commercialOrCorporate.percentage = leadInfo.corpCC || 0;
        merchant.value.mdrPlan.internationalCreditCard.percentage = leadInfo.intlCC || 0;
        
        merchantTypeSelection.value = leadInfo.merchantType?.merchantTypeName || '';
      }
    }
    $q.loading.hide();
  } catch (error) {
    console.error('Error loading mars data:', error);
    $q.loading.hide();
  }
};

const marsInfo = async () => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Fetching data ..",
  });

  try {
    if (implementedQueue.value?.leadInformation?.id) {
      await store.dispatch('GetMarsData/FETCH_MARS_DATA', implementedQueue.value.leadInformation.id);
      fetchShortLeadInfo();
      
      if (allMarsData.value) {
        merchant.value.companyinformation.pan = allMarsData.value.companyInformation?.pan || '';
        merchant.value.companyinformation.contactPhone = allMarsData.value.companyInformation?.contactPhone || '';
        merchant.value.companyinformation.legalName = allMarsData.value.companyInformation?.legalName || '';
        merchant.value.companyinformation.dbaName = allMarsData.value.companyInformation?.dbaName || '';
        merchant.value.companyinformation.registeredAddress = allMarsData.value.companyInformation?.registeredAddress || '';
        merchant.value.companyinformation.registeredPin = allMarsData.value.companyInformation?.registeredPin || '';
        merchant.value.companyinformation.registeredCityRefCode = allMarsData.value.companyInformation?.registeredCityRefCode || '';
        merchant.value.companyinformation.registeredCityName = allMarsData.value.companyInformation?.registeredCityName || '';
        merchant.value.companyinformation.registeredStateRefCode = allMarsData.value.companyInformation?.registeredStateRefCode || '';
        merchant.value.companyinformation.registeredStateName = allMarsData.value.companyInformation?.registeredStateName || '';
        merchant.value.companyinformation.contactName = allMarsData.value.companyInformation?.contactName || '';
        merchant.value.companyinformation.statementEmail = allMarsData.value.companyInformation?.statementEmail || '';
        merchant.value.companyinformation.applicationNumber = allMarsData.value.salesInformation?.applicationNumber || '';
        forminfo.value.applicationNumber = allMarsData.value.salesInformation?.applicationNumber || '';
        merchant.value.companyinformation.contactEmail = allMarsData.value.companyInformation?.contactEmail || '';
        merchant.value.companyinformation.contactMobile = allMarsData.value.leadInformation?.contactNumber || '';
        merchant.value.companyinformation.businessNature = allMarsData.value.companyInformation?.businessNature || '';
        merchant.value.bankInformation.bankDetails.accountNumber = allMarsData.value.bankInformation?.bankDetails?.accountNumber || '';
        merchant.value.bankInformation.bankDetails.ifsc = allMarsData.value.bankInformation?.bankDetails?.ifsc || '';
        merchant.value.bankInformation.bankDetails.bankName = allMarsData.value.bankInformation?.bankDetails?.bankName || '';
        merchant.value.bankInformation.bankDetails.paymentMode = allMarsData.value.bankInformation?.bankDetails?.paymentMode || '';
        merchant.value.bankInformation.bankDetails.accountType = allMarsData.value.bankInformation?.bankDetails?.accountType || '';
        merchant.value.paymentDetails.settlementType = allMarsData.value.paymentDetails?.settlementType || '';
        merchant.value.paymentDetails.tipEnabled = allMarsData.value.paymentDetails?.tipEnabled || '';
        merchant.value.paymentDetails.cashAtPosEnabled = allMarsData.value.paymentDetails?.cashAtPosEnabled || '';
        merchant.value.paymentDetails.intlCardAcceptance = allMarsData.value.paymentDetails?.intlCardAcceptance || '';
        merchant.value.paymentDetails.preAuth = allMarsData.value.paymentDetails?.preAuth || '';
        merchant.value.paymentDetails.rentalPlanCode = allMarsData.value.paymentDetails?.rentalPlanCode || 1;
        merchant.value.salesInformation.institutionCode = allMarsData.value.salesInformation?.institutionCode || '';
      }
    }
    $q.loading.hide();
  } catch (error) {
    console.error('Error in marsInfo:', error);
    $q.loading.hide();
  }
};

const fetchShortLeadInfo = async () => {
  if (implementedQueue.value?.leadInformation?.id) {
    await store.dispatch('SatLeadValidation/FETCH_SHORT_LEAD_DATA', implementedQueue.value.leadInformation.id);
    fetchMidBasedList();
  }
};

const fetchMidBasedList = async () => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Fetching data ..",
  });

  try {
    if (implementedQueue.value?.mid) {
      await store.dispatch('GetMarsData/MIDBASEDLIST', implementedQueue.value.mid);
      if (midBasedList.value?.tids) {
        formdata.value.mid = midBasedList.value.tids;
      }
    }
    $q.loading.hide();
  } catch (error) {
    console.error('Error in fetchMidBasedList:', error);
    $q.loading.hide();
  }
};

const fetchAllDropdownValuesFromMARSapi = async () => {
  try {
    await store.dispatch('mars_city/CITY_FROM_MARS');
    const cityData = store.getters['mars_city/cityFromMars'];
    if (cityData?.items) {
      cityOptions.value = cityData.items.map(oo => ({ label: oo.name, value: oo.code }));
    }

    await store.dispatch('mars_rentalPlans/RENTAL_PLAN_FROM_MARS');
    const rentalData = store.getters['mars_rentalPlans/rentalPlanFromMars'];
    if (rentalData?.items) {
      rentalPlanSet.value = rentalData.items.map(oo => ({ label: oo.name, value: oo.code }));
    }

    await store.dispatch('mars_state/STATE_FROM_MARS');
    const stateData = store.getters['mars_state/stateFromMars'];
    if (stateData?.items) {
      stateOptions.value = stateData.items.map(oo => ({ label: oo.name, value: oo.code }));
    }
  } catch (error) {
    console.error('Error fetching dropdown values:', error);
  }
};

const ajaxLoadShortLeadInfoForDocumentTypes = async () => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Fetching files ..",
  });

  try {
    await store.dispatch('SatLeadValidation/FETCH_LEAD_DOCUMENT_TYPE_DATA');
    if (implementedQueue.value?.leadInformation?.merchantType?.merchantTypeName) {
      fnGetMerchantTypeValue(implementedQueue.value.leadInformation.merchantType.merchantTypeName);
    }
    $q.loading.hide();
  } catch (error) {
    console.error('Error loading document types:', error);
    $q.loading.hide();
  }
};

const fnPlan = async () => {
  const formData = {
    leadSource: formdata1.value.leadSourceId,
    device: formdata1.value.deviceId,
    plan: formdata1.value.plan,
  };
  
  try {
    await store.dispatch('categoryBasedRental/CATEGORY_BASED_RENTAL_PLAN1', formData);
    if (categoryBasedRental.value) {
      formdata1.value.setupFees = implementedQueue.value?.leadInformation?.deviceCount * categoryBasedRental.value.setupFees || 0;
      formdata1.value.recurringFees = implementedQueue.value?.leadInformation?.deviceCount * categoryBasedRental.value.monthlyFees || 0;
    } else {
      formdata1.value.setupFees = 0;
      formdata1.value.recurringFees = 0;
    }
  } catch (error) {
    console.error('Error in fnPlan:', error);
  }
};

const fnPlan1 = async () => {
  const formData = {
    leadSource: formdata.value.leadSourceId,
    device: formdata.value.deviceId,
    plan: formdata.value.plan,
  };
  
  try {
    await store.dispatch('categoryBasedRental/CATEGORY_BASED_RENTAL_PLAN1', formData);
    if (categoryBasedRental.value) {
      formdata.value.setupFees = implementedQueue.value?.leadInformation?.deviceCount * categoryBasedRental.value.setupFees || 0;
      formdata.value.recurringFees = implementedQueue.value?.leadInformation?.deviceCount * categoryBasedRental.value.monthlyFees || 0;
    } else {
      formdata.value.setupFees = 0;
      formdata.value.recurringFees = 0;
    }
  } catch (error) {
    console.error('Error in fnPlan1:', error);
  }
};

const sendtoFinance = async (request) => {
  v$.value.formdata.$touch();
  if (v$.value.formdata.$error) {
    $q.notify("Please review fields again.");
    return;
  }

  if (request.paymentOption == 2 && !request.paymentDocumentFile) {
    $q.notify({
      color: "amber",
      position: "bottom",
      message: "Please attach the Cheque File",
      icon: "attachment",
    });
    return;
  }

  const requestparams = {
    url: {
      id: shortLeadInfo.value?.id,
    },
    params: {
      setupFees: request.setupFees,
      amountCollected: request.setupFees,
      recurringFees: request.recurringFees,
      planCode: request.planCode,
      verifiedCmsPricingStatus: request.verifiedCmsPricingStatus,
      contactName: request.contactName,
      contactNumber: request.contactNumber,
      alternateContactNumber: request.alternateContactNumber,
      city: request.city,
      device: request.device,
      deviceCount: request.deviceCount,
      leadAddress: request.leadAddress,
      latitude: request.latitude,
      longitude: request.longitude,
      state: request.state,
      leadCategory: check.value ? 2 : 1,
      kyc: request.kyc,
      verifiedBanksubventionStatus: request.verifiedBanksubventionStatus,
      reason: request.reason,
      merchantCategory: request.merchantCategory,
      pricing: check.value ? 1 : 0,
      leadStatus: request.leadStatus,
      submittoRSMDate: request.submittoRSMDate,
      posEnable: request.posEnable,
      posIncentive: request.posIncentive,
      plan1: request.plan,
      leadName: request.leadName,
      paymentMadeon: request.paymentMadeon,
      referenceNumber: request.referenceNumber,
      paymentOption: request.paymentOption,
      cmsCategoryType: request.cmsCategoryType,
      paymentDocumentFile: request.paymentDocumentFile,
      paymentDocumentMimeType: request.paymentDocumentMimeType,
    },
  };

  try {
    await store.dispatch('SendTORSMCMS/SEND_TO_RSM_CMS', requestparams);
    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Successfully sent to Finance",
      icon: "thumb_up",
    });
    router.push("/sat/change/management");
  } catch (error) {
    console.error('Error sending to finance:', error);
    $q.notify({
      color: "negative",
      position: "bottom",
      icon: "thumb_down",
      message: error.response?.data?.message || "Failed to send",
    });
  }
};

const sendtoNH = async (request) => {
  const requestparams = {
    url: {
      id: shortLeadInfo.value?.id,
    },
    params: {
      setupFees: request.setupFees,
      amountCollected: request.setupFees,
      recurringFees: request.recurringFees,
      planCode: request.planCode,
      verifiedCmsPricingStatus: request.verifiedCmsPricingStatus,
      contactName: request.contactName,
      contactNumber: request.contactNumber,
      alternateContactNumber: request.alternateContactNumber,
      city: request.city,
      device: request.device,
      deviceCount: request.deviceCount,
      leadAddress: request.leadAddress,
      latitude: request.latitude,
      longitude: request.longitude,
      state: request.state,
      leadCategory: check.value ? 2 : 1,
      kyc: request.kyc,
      verifiedBanksubventionStatus: request.verifiedBanksubventionStatus,
      reason: request.reason,
      merchantCategory: request.merchantCategory,
      pricing: check.value ? 1 : 0,
      leadStatus: request.leadStatus,
      submittoRSMDate: request.submittoRSMDate,
      posEnable: request.posEnable,
      posIncentive: request.posIncentive,
      plan1: request.plan,
      leadName: request.leadName,
      paymentMadeon: request.paymentMadeon,
      referenceNumber: request.referenceNumber,
      paymentOption: request.paymentOption,
      cmsCategoryType: request.cmsCategoryType,
      paymentDocumentFile: request.paymentDocumentFile,
      paymentDocumentMimeType: request.paymentDocumentMimeType,
    },
  };

  try {
    await store.dispatch('SendTORSMCMS/SEND_TO_RSM_CMS', requestparams);
    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Successfully sent to RSM",
      icon: "thumb_up",
    });
    router.push("/sat/change/management");
  } catch (error) {
    console.error('Error sending to RSM:', error);
    $q.notify({
      color: "negative",
      position: "bottom",
      icon: "thumb_down",
      message: error.response?.data?.message || "Failed to send",
    });
  }
};

const fnUploadApplicationForm = async (event) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Uploading file ..",
  });

  const formData = new FormData();
  formData.append("file", event.target.files[0]);
  formData.append("fileNameOriginal", "Cheque");

  const requestParams = {
    files: formData,
    fileNameOriginal: "Cheque",
  };

  try {
    const response = await store.dispatch('SatLeadValidation/FEED_CHEQUE_FORM', requestParams);
    $q.loading.hide();
    $q.notify({
      color: "positive",
      position: "bottom",
      message: "File Successfully Uploaded" + "-" + response.fileName,
      icon: "thumb_up",
    });
    formdata.value.paymentDocumentFile = response.fileName;
    formdata.value.paymentDocumentMimeType = response.mimeType;
  } catch {
    $q.loading.hide();
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "Failed to upload document",
      icon: "thumb_down",
    });
  }
};

const fnUploadApplicationForm1 = async (event) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Uploading file ..",
  });

  const formData = new FormData();
  formData.append("file", event.target.files[0]);
  merchant.value.kyc.documents = [];

  const requestParams = {
    files: formData,
    leadId: shortLeadInfo.value?.id,
  };

  try {
    await store.dispatch('SatLeadValidation/FEED_FULL_APPLICATION_FORM', requestParams);
    fetchShortLeadInfo();
    $q.loading.hide();
  } catch {
    $q.loading.hide();
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "Failed to upload document",
      icon: "thumb_down",
    });
  }
};

const fnVerificationDocumentUpload = async (event, documentDetails) => {
  merchant.value.kyc.documents = [];
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Uploading file ..",
  });

  const formData = new FormData();
  formData.append("file", event.target.files[0]);

  const requestParams = {
    files: formData,
    leadId: shortLeadInfo.value?.id,
    documentId: documentDetails.id,
  };

  try {
    await store.dispatch('SatLeadValidation/FEED_HAND_OVER_TO_SAT_DOCUMENT', requestParams);
    fetchShortLeadInfo();
    $q.loading.hide();
  } catch {
    $q.loading.hide();
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "Failed to upload document",
      icon: "thumb_down",
    });
  }
};

const fnVerificationDocumentUploadSingleUpload = async (event, documentDetails) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Uploading file ..",
  });

  const formData = new FormData();
  formData.append("file", event.target.files[0]);
  merchant.value.kyc.documents = [];

  const requestParams = {
    files: formData,
    leadId: shortLeadInfo.value?.id,
    documentId: documentDetails.id,
  };

  try {
    await store.dispatch('SatLeadValidation/FEED_HAND_OVER_TO_SAT_DOCUMENT', requestParams);
    fetchShortLeadInfo();
    $q.loading.hide();
  } catch {
    $q.loading.hide();
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "Failed to upload document",
      icon: "thumb_down",
    });
  }
};

const fnDeleteAlreadyAttachedFile = async (documentDetails) => {
  merchant.value.kyc.documents = [];
  
  const result = await $q.dialog({
    title: "Confirm",
    message: "Are you sure want to delete uploaded document?",
    ok: "Continue",
    cancel: "Cancel",
  });

  if (!result) return;

  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Processing ..",
  });

  try {
    await store.dispatch('SatLeadValidation/DELETE_DOCUMENT_FROM_BY_SAT', documentDetails);
    fetchShortLeadInfo();
    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Successfully removed!",
      icon: "thumb_up",
    });
    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      color: "negative",
      position: "bottom",
      message: error.response?.data?.message || "Please Try Again Later!",
      icon: "thumb_down",
    });
  }
};

const populateBankDetails = async () => {
  try {
    await store.dispatch('mars_ifsc/IFSC_FROM_MARS', merchant.value.bankInformation.bankDetails.ifsc);
    const ifscData = store.getters['mars_ifsc/ifscFromMars'];
    if (ifscData?.bankName) {
      merchant.value.bankInformation.bankDetails.bankName = ifscData.bankName;
    } else {
      $q.notify({
        color: "negative",
        position: "bottom-left",
        message: "Invalid IFSC code",
        icon: "clear",
      });
      merchant.value.bankInformation.bankDetails.ifsc = "";
      merchant.value.bankInformation.bankDetails.bankName = "";
    }
  } catch (error) {
    console.error('Error fetching IFSC details:', error);
  }
};

const fnGetMerchantTypeValue = (inputValue) => {
  if (!shortLeadInfoDocumentTypes.value) return;

  const merchantDocumentCategory = _.find(
    shortLeadInfoDocumentTypes.value,
    (o) => o.merchantType === inputValue
  );

  if (!merchantDocumentCategory) return;

  const arr = {
    forSingleDocument: [],
    forMutipleDocument: [],
  };

  const leadDocuments = shortLeadInfo.value?.leadDocuments || {};

  merchantDocumentCategory.documentsApplicable?.map((value) => {
    if (value.viewType == 1) {
      arr.forSingleDocument.push(value);
    } else {
      // FIXED: Replaced hasOwnProperty with Object.prototype.hasOwnProperty.call
      if (Object.prototype.hasOwnProperty.call(leadDocuments, value.documentType)) {
        const assumeArr = _.find(value.documents, (oo) => {
          if (
            Object.prototype.hasOwnProperty.call(leadDocuments, oo.documentType) &&
            (oo.subDocumentType ==
              leadDocuments[oo.documentType][0].subDocumentType ||
              leadDocuments[oo.documentType][0].documentType ==
                leadDocuments[oo.documentType][0].subDocumentType)
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

  if (shortLeadInfoDocumentTypes.value) {
    shortLeadInfoDocumentTypes.value.uploadedDocuments = arr;
  }
};

const fnGetSubDocuments = (documentDetails) => {
  if (documentDetails && typeof documentDetails !== "undefined") {
    // FIXED: Replaced hasOwnProperty with Object.prototype.hasOwnProperty.call
    if (
      Object.prototype.hasOwnProperty.call(documentDetails, "selectedSubDocumentType") &&
      typeof documentDetails.selectedSubDocumentType !== "undefined"
    ) {
      documentDetails.selectedSubDocumentType =
        documentDetails.subDocumentType;
    } else {
      documentDetails.selectedSubDocumentType =
        documentDetails.subDocumentType;
    }
  }
};

const fn_________GetEntryPermissionToUploadSubDocuments = (multipleDocument) => {
  // FIXED: Replaced hasOwnProperty calls with Object.prototype.hasOwnProperty.call
  if (
    Object.prototype.hasOwnProperty.call(multipleDocument, "subDocumentTypeSelection") &&
    typeof multipleDocument.subDocumentTypeSelection !== "undefined" &&
    Object.prototype.hasOwnProperty.call(multipleDocument.subDocumentTypeSelection, "selectedSubDocumentType") &&
    typeof multipleDocument.subDocumentTypeSelection.selectedSubDocumentType !== "undefined"
  ) {
    return true;
  } else {
    return true;
  }
};

const fnPDFViewModal = (documentUrl) => {
  PDFDetails.value = documentUrl;
  toggleshowPDFModal.value = !toggleshowPDFModal.value;
};

const fnViewHandedOverFileImage = () => {
  const img = document.querySelector('img[ref="handedOverImageViewer"]');
  if (img) {
    const newWindow = window.open();
    newWindow.document.write(`<img src="${img.src}" style="max-width: 100%;" />`);
  }
};

const fnViewAttachedFileImage = (index) => {
  const img = attachedImageViewer.value[index];
  if (img) {
    const newWindow = window.open();
    newWindow.document.write(`<img src="${img.src}" style="max-width: 100%;" />`);
  }
};

const fnViewMultiAttachedFileImage = (index) => {
  const img = multiAttachedImageViewer.value[index];
  if (img) {
    const newWindow = window.open();
    newWindow.document.write(`<img src="${img.src}" style="max-width: 100%;" />`);
  }
};

const next = () => {
  v$.value.merchant.$touch();
  if (v$.value.merchant.$error) {
    $q.notify("Please review the KYC information fields again.");
    return;
  }

  // Set remarks based on changes (simplified version of original logic)
  const companyInfo = merchant.value.companyinformation;
  const allMarsDataInfo = allMarsData.value?.companyInformation;
  
  let remarks = [];
  if (companyInfo.legalName != allMarsDataInfo?.legalName) remarks.push("Legal Name");
  if (companyInfo.dbaName != allMarsDataInfo?.dbaName) remarks.push("DBA Name");
  if (companyInfo.pan != allMarsDataInfo?.pan) remarks.push("Pan Number");
  
  if (remarks.length > 0) {
    companyInfo.remarks = remarks.join(", ");
  }

  // Set MDR plan code based on category type
  if (formdata.value.cmsCategoryType == "O") {
    merchant.value.mdrPlan.code = 9;
  } else if (!formdata.value.cmsCategoryType) {
    merchant.value.mdrPlan.code = allMarsData.value?.mdrPlan?.code || 1;
  } else {
    merchant.value.mdrPlan.code = 8;
  }

  stepper.value.next();
};

const next1 = () => {
  // Prepare KYC documents
  const kycDocs = [];
  
  if (shortLeadInfo.value?.applicationFile) {
    kycDocs.push({
      documentName: "Agreement",
      documentType: shortLeadInfo.value.merchantType?.marsAgreementId,
      documentImage: [
        GLOBAL_FILE_FETCH_URL.value + '/' + shortLeadInfo.value.applicationFile,
      ],
    });
  }

  // Add other documents
  const leadDocuments = shortLeadInfo.value?.leadDocuments || {};
  Object.keys(leadDocuments).forEach((key) => {
    _.map(leadDocuments[key], (oo) => {
      if (oo.uploadedDocuments.length > 0) {
        const assumeArr = [];
        _.map(oo.uploadedDocuments, (doc) => {
          assumeArr.push(GLOBAL_FILE_FETCH_URL.value + '/' + doc.fileName);
        });
        kycDocs.push({
          documentName: oo.subDocumentType,
          documentType: oo.marsDocumentId,
          documentImage: assumeArr,
        });
      }
    });
  });

  merchant.value.kyc.documents = kycDocs;
  stepper.value.next();
};

const finalFormSubmitKyc = async (request) => {
  // Create dataCopy with updated values
  dataCopy.value = { ...allMarsData.value };
  
  if (!dataCopy.value) {
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "No Mars data available",
      icon: "thumb_down",
    });
    return;
  }

  // Update dataCopy with form values (simplified version)
  dataCopy.value.businessInformation.gstId = request.businessInformation.gstId;
  dataCopy.value.companyInformation.legalName = request.companyinformation.legalName;
  dataCopy.value.companyInformation.dbaName = request.companyinformation.dbaName;
  dataCopy.value.companyInformation.contactName = request.companyinformation.contactName;
  dataCopy.value.companyInformation.registeredAddress = request.companyinformation.registeredAddress;
  dataCopy.value.companyInformation.registeredCityName = request.companyinformation.registeredCityName;
  dataCopy.value.companyInformation.registeredStateName = request.companyinformation.registeredStateName;
  dataCopy.value.companyInformation.registeredPin = request.companyinformation.registeredPin;
  dataCopy.value.companyInformation.contactMobile = request.companyinformation.contactMobile;
  dataCopy.value.companyInformation.contactEmail = request.companyinformation.contactEmail;
  dataCopy.value.companyInformation.statementEmail = request.companyinformation.statementEmail;
  dataCopy.value.companyInformation.businessNature = request.companyinformation.businessNature;
  dataCopy.value.companyInformation.pan = request.companyinformation.pan;
  dataCopy.value.bankInformation.bankDetails.ifsc = request.bankInformation.bankDetails.ifsc;
  dataCopy.value.bankInformation.bankDetails.bankName = request.bankInformation.bankDetails.bankName;
  dataCopy.value.bankInformation.bankDetails.paymentMode = request.bankInformation.bankDetails.paymentMode;
  dataCopy.value.bankInformation.bankDetails.accountType = request.bankInformation.bankDetails.accountType;
  dataCopy.value.bankInformation.bankDetails.accountNumber = request.bankInformation.bankDetails.accountNumber;
  
  // Update MDR plan
  dataCopy.value.mdrPlan = { ...request.mdrPlan };
  
  // Update payment details
  dataCopy.value.paymentDetails.rentalPlanCode = request.paymentDetails.rentalPlanCode;
  dataCopy.value.paymentDetails.settlementType = request.paymentDetails.settlementType;
  dataCopy.value.paymentDetails.preAuth = request.paymentDetails.preAuth;
  dataCopy.value.paymentDetails.cashAtPosEnabled = request.paymentDetails.cashAtPosEnabled;
  dataCopy.value.paymentDetails.intlCardAcceptance = request.paymentDetails.intlCardAcceptance;
  dataCopy.value.paymentDetails.tipEnabled = request.paymentDetails.tipEnabled;
  
  // Update lead information
  if (dataCopy.value.leadInformation) {
    dataCopy.value.leadInformation.leadName = request.companyinformation.legalName;
    dataCopy.value.leadInformation.contactName = request.companyinformation.contactName;
    dataCopy.value.leadInformation.leadAddress = request.companyinformation.registeredAddress;
    dataCopy.value.leadInformation.city = request.companyinformation.registeredCityName;
    dataCopy.value.leadInformation.state = request.companyinformation.registeredStateName;
    dataCopy.value.leadInformation.pincode = request.companyinformation.registeredPin;
    dataCopy.value.leadInformation.contactNumber = request.companyinformation.contactMobile;
  }

  try {
    // Submit to Mars
    await store.dispatch('mars_final_submit_internal/MARS_FINAL_SUBMIT_INTERNAL', {
      merchant: dataCopy.value,
      action: 1,
    });
    
    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Saved successfully",
      icon: "thumb_up",
    });
    
    // Terminal updates would go here
    // ...
    
    router.push("/sat/change/management");
  } catch (error) {
    console.error('Error in finalFormSubmitKyc:', error);
    $q.notify({
      color: "negative",
      position: "bottom",
      icon: "thumb_down",
      message: error.response?.data?.message || "Failed to submit",
    });
  }
};

// Lifecycle
onMounted(() => {
  ajaxLoadDataForDeviceTypeTable1();
  ajaxLoadMarsData();
  ajaxLoadShortLeadInfoForDocumentTypes();
  fetchAllDropdownValuesFromMARSapi();
});
</script>
<style scoped>
/* Custom Quasar select padding */
.customQuasarSelect {
  padding: 0.3125rem; /* 5px converted to rem for modern responsive design */
}

/* Labels with proper spacing, using inline-block instead of table */
label {
  padding: 0.3125rem 0.625rem; /* 5px 10px */
  display: inline-block;
  font-weight: 500;
  cursor: pointer;
}

/* Hide default file input for custom upload buttons */
input[type="file"] {
  display: none;
}

/* Custom dark background overlay */
.bg-dark-custom {
  background-color: rgba(0, 0, 0, 0.5);
}

/* Optional: add hover effect to file upload label */
label:hover {
  opacity: 0.85;
  transition: 0.2s ease-in-out;
}

/* Optional: responsive adjustments for small screens */
@media (max-width: 600px) {
  .customQuasarSelect {
    padding: 0.25rem;
  }

  label {
    padding: 0.25rem 0.5rem;
  }
}
</style>