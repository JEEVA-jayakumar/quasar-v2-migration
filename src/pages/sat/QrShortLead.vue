<template>
  <q-page>
    <div class="q-ma-md">
      <div class="row q-ma-xs">
        <div class="col-6 col-lg-3">
          <div class="text-h6 q-my-md capitalize">
            {{ formData.qrShortLead.legalName }}
          </div>
          <div
            class="text-light-blue cursor-pointer"
            @click="toggleLeadInformation(formData.shortLead)"
          >
            # {{ formData.qrShortLead.qrLeadNumber }}
          </div>
        </div>
        <div class="col-6 col-lg-3">
          <div class="text-h6 q-my-md">Contact</div>
          <div class="no-margin">{{ formData.qrShortLead.contactNumber }}</div>
        </div>
        <div class="col-12 col-lg-3">
          <div class="text-h6 q-my-md">Address</div>
          <div class="capitalize no-margin">
            {{ formData.qrShortLead.contactAddress }}
          </div>
          <div class="capitalize no-margin">
            {{ formData.qrShortLead.city }}, {{ formData.qrShortLead.state }}
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="d-flex align-items-center text-h6 q-my-md nowrap-text">
              Remarks
            </div>
            <q-btn
              square
              push
              class="remarksbtn"
              color="deep-purple-9"
              size="sm"
              @click="fnReassignData(formData.qrShortLead)"
              >Remarks</q-btn
            >
          </div>
        </div>
        <div class="col-12 col-lg-8">
          <div class="row">
            <div class="col-12">
              <q-card class="q-ma-xs border-1 q-custom-class" flat>
                <q-card-section class="q-pa-sm bottom-border title-bg">
                  <div class="row items-center">
                    <div class="col text-body1 text-weight-medium">
                      MERCHANT DETAILS
                    </div>
                  </div>
                </q-card-section>
                <q-card-section class="q-pa-sm">
                  <q-list separator class="no-padding text-body1">
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Application Number</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          disable
                          type="text"
                          style="width: 220px"
                          v-model="applicationNumber"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div
                          style="display: flex; align-items: center"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.contactName.$error,
                          }"
                        >
                          <span style="flex: 1">Contact Person Name</span>
                          <q-input
                            @blur="v$.formData.qrShortLead.contactName.$touch"
                            :error="v$.formData.qrShortLead.contactName.$error"
                            type="text"
                            style="width: 220px"
                            v-model="formData.qrShortLead.contactName"
                            @keydown="validateName"
                          />
                        </div>
                        <div
                          v-if="v$.formData.qrShortLead.contactName.$error"
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.contactName.$error,
                          }"
                        >
                          <span
                            v-if="!v$.formData.qrShortLead.contactName.$model"
                          >
                            Contact Person Name is required.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div style="display: flex; align-items: center">
                          <span
                            style="flex: 1"
                            :class="{
                              'error-highlight':
                                v$.formData.qrShortLead.legalName.$error,
                            }"
                          >
                            Legal Name
                          </span>
                          <q-input
                            @blur="v$.formData.qrShortLead.legalName.$touch"
                            :error="v$.formData.qrShortLead.legalName.$error"
                            type="text"
                            style="width: 220px"
                            v-model="formData.qrShortLead.legalName"
                            @update:model-value="handlelegalname"
                          />
                        </div>
                        <div
                          v-if="v$.formData.qrShortLead.legalName.$error"
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.legalName.$error,
                          }"
                        >
                          <span
                            v-if="!v$.formData.qrShortLead.legalName.$model"
                          >
                            Legal Name is required.
                          </span>
                          <span
                            v-if="
                              v$.formData.qrShortLead.legalName.$model &&
                              (v$.formData.qrShortLead.legalName.$model < 0 ||
                                v$.formData.qrShortLead.legalName.$model > 60)
                            "
                          >
                            Legal Name must be between 0 and 60.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Marketing Name</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          @blur="v$.formData.qrShortLead.marketingName.$touch"
                          :error="v$.formData.qrShortLead.marketingName.$error"
                          type="text"
                          style="width: 220px"
                          v-model="formData.qrShortLead.marketingName"
                          @update:model-value="handlemarketing"
                        />
                        <div
                          v-if="v$.formData.qrShortLead.marketingName.$error"
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.marketingName.$error,
                          }"
                        >
                          <span
                            v-if="!v$.formData.qrShortLead.marketingName.$model"
                          >
                            Marketing Name is required.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>GST Number</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          type="text"
                          style="width: 220px"
                          label="GST Number"
                          placeholder="GST Number"
                          v-model="formData.qrShortLead.gstNumber"
                          @keydown="nameKeydown"
                        />
                        <div v-if="gstNumberError" class="error-tooltip">
                          GST Number is required.
                        </div>
                        <div
                          v-if="gstNumberValidationError"
                          class="error-tooltip"
                        >
                          GST Number must be exactly 15 digits.
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Contact Email</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          type="text"
                          style="width: 220px"
                          label="Contact Email*"
                          placeholder="Contact Email*"
                          :error="v$.formData.qrShortLead.contactEmail.$error"
                          @blur="v$.formData.qrShortLead.contactEmail.$touch"
                          v-model="formData.qrShortLead.contactEmail"
                        />
                        <span
                          v-if="!v$.formData.qrShortLead.contactEmail.$model"
                          class="error-tooltip"
                        >
                          Contact Email is required.
                        </span>
                        <span
                          v-if="
                            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                              formData.qrShortLead.contactEmail
                            )
                          "
                          class="error-tooltip"
                        >
                          please enter valid email id
                        </span>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Contact Number</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          type="number"
                          style="width: 220px"
                          label="Contact Number*"
                          placeholder="Contact Number*"
                          :error="v$.formData.qrShortLead.contactNumber.$error"
                          @blur="v$.formData.qrShortLead.contactNumber.$touch"
                          v-model="formData.qrShortLead.contactNumber"
                          @keydown="nameKeydown"
                          maxlength="10"
                        />
                        <div
                          v-if="v$.formData.qrShortLead.contactNumber.$error"
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.contactNumber.$error,
                          }"
                        >
                          <span
                            v-if="!v$.formData.qrShortLead.contactNumber.$model"
                          >
                            Contact Number is required.
                          </span>
                          <span
                            v-if="
                              v$.formData.qrShortLead.contactNumber.$model &&
                              v$.formData.qrShortLead.contactNumber.$model
                                .length !== 10
                            "
                          >
                            Contact Number must be exactly 10 digits.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Alternate Number</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          type="number"
                          style="width: 220px"
                          label="Alternate Number"
                          placeholder="Alternate Number"
                          v-model="formData.qrShortLead.alternateContactNumber"
                          @keydown="nameKeydown"
                        />
                        <div v-if="alternativeError" class="error-tooltip">
                          Alternate Number is required.
                        </div>
                        <div
                          v-if="alternativeValidationError"
                          class="error-tooltip"
                        >
                          Alternate Number must be exactly 10 digits.
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div style="display: flex; align-items: center">
                          <span
                            style="flex: 1"
                            :class="{
                              'error-highlight':
                                v$.formData.qrShortLead.contactAddress.$error,
                            }"
                          >
                            Contact Address
                          </span>
                          <q-input
                            @blur="
                              v$.formData.qrShortLead.contactAddress.$touch
                            "
                            :error="v$.formData.qrShortLead.contactAddress.$error"
                            type="text"
                            style="width: 220px"
                            v-model="formData.qrShortLead.contactAddress"
                          />
                        </div>
                        <div
                          v-if="v$.formData.qrShortLead.contactAddress.$error"
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.contactAddress.$error,
                          }"
                        >
                          <span
                            v-if="!v$.formData.qrShortLead.contactAddress.$model"
                          >
                            Contact Address is required.
                          </span>
                          <span
                            v-if="
                              v$.formData.qrShortLead.contactAddress.$model &&
                              (v$.formData.qrShortLead.contactAddress.$model <
                                0 ||
                                v$.formData.qrShortLead.contactAddress.$model >
                                  120)
                            "
                          >
                            Contact Address must be between 0 and 120.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div style="display: flex; align-items: center">
                          <span
                            style="flex: 1"
                            :class="{
                              'error-highlight':
                                v$.formData.qrShortLead.pincode.$error,
                            }"
                          >
                            Pincode
                          </span>
                          <q-input
                            type="number"
                            :error="v$.formData.qrShortLead.pincode.$error"
                            @blur="validatePincode"
                            style="width: 220px"
                            clearable
                            color="grey-9"
                            v-model.trim="formData.qrShortLead.pincode"
                            label="Pincode"
                            placeholder="Pincode"
                          >
                            <template v-slot:append>
                              <q-icon name="search" />
                            </template>
                          </q-input>
                        </div>
                        <div
                          v-if="v$.formData.qrShortLead.pincode.$error"
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.pincode.$error,
                          }"
                        >
                          <span v-if="!v$.formData.qrShortLead.pincode.$model">
                            Pincode is required.
                          </span>
                          <span
                            v-if="
                              v$.formData.qrShortLead.pincode.$model &&
                              v$.formData.qrShortLead.pincode.$model.length !==
                                6
                            "
                          >
                            Pincode must be exactly 6 digits.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div style="display: flex; align-items: center">
                          <span
                            style="flex: 1"
                            :class="{
                              'error-highlight':
                                v$.formData.qrShortLead.state.$error,
                            }"
                          >
                            State
                          </span>
                          <q-input
                            clearable
                            :error="v$.formData.qrShortLead.state.$error"
                            @blur="validateStateInput"
                            style="width: 220px"
                            color="grey-9"
                            v-model="formData.qrShortLead.state"
                            label="State*"
                          />
                        </div>
                        <div
                          v-if="v$.formData.qrShortLead.state.$error"
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.state.$error,
                          }"
                        >
                          <span v-if="!v$.formData.qrShortLead.state.$model">
                            State is required.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div style="display: flex; align-items: center">
                          <span
                            style="flex: 1"
                            :class="{
                              'error-highlight':
                                v$.formData.qrShortLead.city.$error,
                            }"
                          >
                            City
                          </span>
                          <q-input
                            clearable
                            @blur="validateCityInput"
                            :error="v$.formData.qrShortLead.city.$error"
                            style="width: 220px"
                            color="grey-9"
                            v-model="formData.qrShortLead.city"
                            label="City*"
                          />
                        </div>
                        <div
                          v-if="v$.formData.qrShortLead.city.$error"
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.city.$error,
                          }"
                        >
                          <span v-if="!v$.formData.qrShortLead.city.$model">
                            City is required.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Lead Source</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          disable
                          type="text"
                          style="width: 220px"
                          v-model="formData.qrShortLead.leadSource.sourceName"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Merchant Type</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          type="text"
                          disable
                          style="width: 220px"
                          v-model="
                            formData.qrShortLead.qrMerchantType.merchantTypeName
                          "
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Establishment Year</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          v-model="formData.qrShortLead.establishmentYear"
                          label="Establishment Year"
                          mask="##/##/####"
                          filled
                          type="text"
                          style="width: 220px"
                        />
                        <div
                          v-if="!isEstablishmentYearValid"
                          class="error-tooltip"
                        >
                          Establishment Year must a valid date in dd/mm/yyyy
                          format.
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Merchant Industry - MCC</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          clearable
                          @blur="validateMCCInput"
                          :error="
                            v$.formData.qrShortLead.merchantIndustry
                              .industryName.$error
                          "
                          style="width: 220px"
                          color="grey-9"
                          v-model="
                            formData.qrShortLead.merchantIndustry.industryName
                          "
                          label="MCC*"
                        />
                        <div
                          v-if="
                            v$.formData.qrShortLead.merchantIndustry
                              .industryName.$error
                          "
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.merchantIndustry
                                .industryName.$error,
                          }"
                        >
                          <span
                            v-if="
                              !v$.formData.qrShortLead.merchantIndustry
                                .industryName.$model
                            "
                          >
                            Merchant Industry - MCC is required.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Nature of Business</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          type="text"
                          style="width: 220px"
                          v-model="formData.qrShortLead.natureOfBusiness"
                          @update:model-value="handleInput"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Category Type</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          v-if="formData.qrShortLead.isMerchant == 1"
                          disable
                          type="text"
                          style="width: 220px"
                          v-model="isactivemerchant"
                        />
                        <q-input
                          v-if="formData.qrShortLead.isMerchant == 2"
                          disable
                          type="text"
                          style="width: 220px"
                          v-model="isactivemerchant1"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>State</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          disable
                          type="text"
                          style="width: 220px"
                          v-model="formData.qrShortLead.merchantStateName"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>District</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          disable
                          type="text"
                          style="width: 220px"
                          v-model="formData.qrShortLead.merchantDistrictName"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Sub District</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          disable
                          type="text"
                          style="width: 220px"
                          v-model="
                            formData.qrShortLead.merchantSubDistrictName
                          "
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Village</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          disable
                          type="text"
                          style="width: 220px"
                          v-model="formData.qrShortLead.merchantVillageName"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Tier</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          disable
                          type="text"
                          style="width: 220px"
                          v-model="formData.qrShortLead.merchantTier"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Lat Log</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          disable
                          type="text"
                          style="width: 220px"
                          v-model="formData.qrShortLead.merchantLatLng"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Device Type</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          disable
                          type="text"
                          style="width: 220px"
                          v-model="formData.qrShortLead.device.deviceName"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Language</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          v-if="formData.qrShortLead.languageSoundbox != null"
                          type="text"
                          style="width: 220px"
                          v-model="
                            formData.qrShortLead.languageSoundbox.language
                          "
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div style="display: flex; align-items: center">
                          <span
                            style="flex: 1"
                            :class="{
                              'error-highlight':
                                v$.formData.qrShortLead.salesPersonName.$error,
                            }"
                          >
                            Sales Person Name
                          </span>
                          <q-select
                            clearable
                            @blur="
                              v$.formData.qrShortLead.salesPersonName.$touch
                            "
                            :error="
                              v$.formData.qrShortLead.salesPersonName.$error
                            "
                            style="width: 220px"
                            color="grey-9"
                            v-model="formData.qrShortLead.salesPersonName"
                            label="Sales Person*"
                            :options="dropDown.salesPersonOptions"
                            @update:model-value="saveFieldData"
                            use-input
                            input-debounce="0"
                            @filter="filterSalesPerson"
                          />
                        </div>
                        <div
                          v-if="v$.formData.qrShortLead.salesPersonName.$error"
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.salesPersonName.$error,
                          }"
                        >
                          <span
                            v-if="!v$.formData.qrShortLead.salesPersonName.$model"
                          >
                            Sales Person Name is required.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <q-card class="q-ma-xs border-1 q-custom-class" flat>
                <q-card-section class="q-pa-sm bottom-border title-bg">
                  <div class="row items-center">
                    <div class="col text-body1 text-weight-medium">
                      PERSONAL INFO
                    </div>
                  </div>
                </q-card-section>
                <q-card-section class="q-pa-sm">
                  <q-list separator class="no-padding text-body1">
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div style="display: flex; align-items: center">
                          <span
                            style="flex: 1"
                            :class="{
                              'error-highlight':
                                v$.formData.qrShortLead.personalAddress.$error,
                            }"
                          >
                            Address
                          </span>
                          <q-input
                            @blur="
                              v$.formData.qrShortLead.personalAddress.$touch
                            "
                            :error="
                              v$.formData.qrShortLead.personalAddress.$error
                            "
                            type="text"
                            style="width: 220px"
                            label="Address*"
                            placeholder="Address*"
                            v-model="formData.qrShortLead.personalAddress"
                          />
                        </div>
                        <div
                          v-if="v$.formData.qrShortLead.personalAddress.$error"
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.personalAddress.$error,
                          }"
                        >
                          <span
                            v-if="!v$.formData.qrShortLead.personalAddress.$model"
                          >
                            Address is required.
                          </span>
                          <span
                            v-if="
                              v$.formData.qrShortLead.personalAddress.$model &&
                              (v$.formData.qrShortLead.personalAddress.$model <
                                0 ||
                                v$.formData.qrShortLead.personalAddress.$model >
                                  180)
                            "
                          >
                            Address must be between 0 and 180.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div style="display: flex; align-items: center">
                          <span
                            style="flex: 1"
                            :class="{
                              'error-highlight':
                                v$.formData.qrShortLead.personalInfoCity
                                  .$error,
                            }"
                          >
                            City
                          </span>
                          <q-input
                            clearable
                            @blur="validatePersonalCityInput"
                            :error="
                              v$.formData.qrShortLead.personalInfoCity.$error
                            "
                            style="width: 220px"
                            color="grey-9"
                            v-model="formData.qrShortLead.personalInfoCity"
                            label="City*"
                          />
                        </div>
                        <div
                          v-if="
                            v$.formData.qrShortLead.personalInfoCity.$error
                          "
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.personalInfoCity.$error,
                          }"
                        >
                          <span
                            v-if="
                              !v$.formData.qrShortLead.personalInfoCity.$model
                            "
                          >
                            City is required.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div style="display: flex; align-items: center">
                          <span
                            style="flex: 1"
                            :class="{
                              'error-highlight':
                                v$.formData.qrShortLead.personalInfoState
                                  .$error,
                            }"
                          >
                            State
                          </span>
                          <q-input
                            clearable
                            :error="
                              v$.formData.qrShortLead.personalInfoState.$error
                            "
                            @blur="validatePersonalStateInput"
                            style="width: 220px"
                            color="grey-9"
                            v-model="formData.qrShortLead.personalInfoState"
                            label="State*"
                          />
                        </div>
                        <div
                          v-if="
                            v$.formData.qrShortLead.personalInfoState.$error
                          "
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.personalInfoState.$error,
                          }"
                        >
                          <span
                            v-if="
                              !v$.formData.qrShortLead.personalInfoState.$model
                            "
                          >
                            State is required.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>

                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div style="display: flex; align-items: center">
                          <span
                            style="flex: 1"
                            :class="{
                              'error-highlight':
                                v$.formData.qrShortLead.personalInfoPincode
                                  .$error,
                            }"
                          >
                            PIN
                          </span>
                          <q-input
                            type="number"
                            :error="
                              v$.formData.qrShortLead.personalInfoPincode.$error
                            "
                            @blur="validatePin"
                            style="width: 220px"
                            clearable
                            color="grey-9"
                            v-model.trim="
                              formData.qrShortLead.personalInfoPincode
                            "
                            label="Pincode*"
                            placeholder="Pincode*"
                          />
                        </div>
                        <div
                          v-if="
                            v$.formData.qrShortLead.personalInfoPincode.$error
                          "
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.personalInfoPincode
                                .$error,
                          }"
                        >
                          <span
                            v-if="
                              !v$.formData.qrShortLead.personalInfoPincode
                                .$model
                            "
                          >
                            PIN is required.
                          </span>
                          <span
                            v-if="
                              v$.formData.qrShortLead.personalInfoPincode
                                .$model &&
                              v$.formData.qrShortLead.personalInfoPincode.$model
                                .length !== 6
                            "
                          >
                            PIN must be exactly 6 digits.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>

                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div style="display: flex; align-items: center">
                          <span
                            style="flex: 1"
                            :class="{
                              'error-highlight':
                                v$.formData.qrShortLead.personalInfoMobile
                                  .$error,
                            }"
                          >
                            Mobile
                          </span>
                          <q-input
                            type="number"
                            style="width: 220px"
                            label="Mobile*"
                            placeholder="Mobile*"
                            :error="
                              v$.formData.qrShortLead.personalInfoMobile.$error
                            "
                            @blur="
                              v$.formData.qrShortLead.personalInfoMobile.$touch
                            "
                            v-model="formData.qrShortLead.personalInfoMobile"
                            @keydown="nameKeydown"
                            maxlength="10"
                          />
                        </div>
                        <div
                          v-if="
                            v$.formData.qrShortLead.personalInfoMobile.$error
                          "
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.personalInfoMobile.$error,
                          }"
                        >
                          <span
                            v-if="
                              !v$.formData.qrShortLead.personalInfoMobile.$model
                            "
                          >
                            Mobile is required.
                          </span>
                          <span
                            v-if="
                              v$.formData.qrShortLead.personalInfoMobile
                                .$model &&
                              v$.formData.qrShortLead.personalInfoMobile.$model
                                .length !== 10
                            "
                          >
                            Mobile must be exactly 10 digits.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div style="display: flex; align-items: center">
                          <span
                            style="flex: 1"
                            :class="{
                              'error-highlight':
                                v$.formData.qrShortLead.personalInfoEmail
                                  .$error,
                            }"
                          >
                            Email
                          </span>
                          <q-input
                            type="text"
                            style="width: 220px"
                            label="Email ID*"
                            placeholder="Email ID*"
                            :error="
                              v$.formData.qrShortLead.personalInfoEmail.$error
                            "
                            @blur="
                              v$.formData.qrShortLead.personalInfoEmail.$touch
                            "
                            v-model="formData.qrShortLead.personalInfoEmail"
                          />
                          <span
                            v-if="
                              !v$.formData.qrShortLead.personalInfoEmail.$model
                            "
                            class="error-tooltip"
                          >
                            Email is required.
                          </span>
                          <span
                            v-if="
                              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                                formData.qrShortLead.personalInfoEmail
                              )
                            "
                            class="error-tooltip"
                          >
                            please enter valid email id
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div style="display: flex; align-items: center">
                          <span
                            style="flex: 1"
                            :class="{
                              'error-highlight':
                                v$.formData.qrShortLead.panNumber.$error,
                            }"
                          >
                            PAN
                          </span>
                          <q-input
                            @blur="v$.formData.qrShortLead.panNumber.$touch"
                            :error="v$.formData.qrShortLead.panNumber.$error"
                            label="PAN*"
                            placeholder="PAN*"
                            type="text"
                            style="width: 220px"
                            v-model="formData.qrShortLead.panNumber"
                            @keydown="nameKeydown"
                            maxlength="10"
                          />
                        </div>
                        <div
                          v-if="v$.formData.qrShortLead.panNumber.$error"
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.panNumber.$error,
                          }"
                        >
                          <span
                            v-if="!v$.formData.qrShortLead.panNumber.$model"
                          >
                            PAN is required.
                          </span>
                          <span
                            v-if="
                              v$.formData.qrShortLead.panNumber.$model &&
                              v$.formData.qrShortLead.panNumber.$model.length !==
                                10
                            "
                          >
                            PAN must be exactly 10 digits.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div style="display: flex; align-items: center">
                          <span
                            style="flex: 1"
                            :class="{
                              'error-highlight':
                                v$.formData.qrShortLead.dateOfBirth.$error,
                            }"
                          >
                            DOB
                          </span>
                          <q-input
                            :error="v$.formData.qrShortLead.dateOfBirth.$error"
                            @blur="v$.formData.qrShortLead.dateOfBirth.$touch"
                            v-model="formData.qrShortLead.dateOfBirth"
                            label="DOB*"
                            mask="##/##/####"
                            filled
                            type="text"
                            style="width: 220px"
                          />
                        </div>
                        <div
                          v-if="v$.formData.qrShortLead.dateOfBirth.$error"
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.dateOfBirth.$error,
                          }"
                        >
                          <span
                            v-if="!v$.formData.qrShortLead.dateOfBirth.$model"
                          >
                            DOB is required.
                          </span>
                        </div>

                        <div v-if="!isdobformatValid" class="error-tooltip">
                          DOB must a valid date in dd/mm/yyyy format.
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Nationality</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          type="text"
                          style="width: 220px"
                          v-model="formData.qrShortLead.nationality"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Passport Number</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          type="text"
                          style="width: 220px"
                          label="Passport Number"
                          placeholder="Passport Number"
                          v-model="formData.qrShortLead.passportNumber"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Passport Expiry Date</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          type="text"
                          style="width: 220px"
                          label="Passport Expiry Date"
                          placeholder="Passport Expiry Date"
                          v-model="formData.qrShortLead.passportExpiryDate"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Own House</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-select
                          v-model="formData.qrShortLead.ownHouse"
                          label="Own House*"
                          :options="ownHouseOptions"
                          style="width: 220px"
                          @update:model-value="houseSelected"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Owner Age</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          :error="v$.formData.qrShortLead.ownerAge.$error"
                          @blur="v$.formData.qrShortLead.ownerAge.$touch"
                          type="text"
                          style="width: 220px"
                          v-model="formData.qrShortLead.ownerAge"
                        />
                        <div
                          v-if="v$.formData.qrShortLead.ownerAge.$error"
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.ownerAge.$error,
                          }"
                        >
                          <span
                            v-if="!v$.formData.qrShortLead.ownerAge.$model"
                          >
                            Owner Age is required.
                          </span>
                          <span
                            v-if="
                              v$.formData.qrShortLead.ownerAge.$model &&
                              (v$.formData.qrShortLead.ownerAge.$model < 1 ||
                                v$.formData.qrShortLead.ownerAge.$model > 150)
                            "
                          >
                            Owner Age must be between 1 and 150.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <q-card class="q-ma-xs border-1 q-custom-class" flat>
                <q-card-section class="q-pa-sm bottom-border title-bg">
                  <div class="row items-center">
                    <div class="col text-body1 text-weight-medium">RISK</div>
                  </div>
                </q-card-section>
                <q-card-section class="q-pa-sm">
                  <q-list separator class="no-padding text-body1">
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Business Hours WeekDay Start</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          style="width: 220px"
                          v-model="formData.qrShortLead.hoursWeekdayStart"
                          @keydown="nameKeydownhoursWeekdayStart"
                          @update:model-value="handleNumericInputhoursWeekdayStart"
                        />
                        <div
                          v-if="v$.formData.qrShortLead.hoursWeekdayStart.$error"
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.hoursWeekdayStart.$error,
                          }"
                        >
                          <span
                            v-if="
                              !v$.formData.qrShortLead.hoursWeekdayStart.$model
                            "
                          >
                            Business Hours WeekDay Start is required.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Business Hours WeekDay End</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          style="width: 220px"
                          v-model="formData.qrShortLead.hoursWeekdayEnd"
                          @keydown="nameKeydownhoursWeekdayEnd"
                          @update:model-value="handleNumericInputhoursWeekdayEnd"
                        />
                        <div
                          v-if="v$.formData.qrShortLead.hoursWeekdayEnd.$error"
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.hoursWeekdayEnd.$error,
                          }"
                        >
                          <span
                            v-if="
                              !v$.formData.qrShortLead.hoursWeekdayEnd.$model
                            "
                          >
                            Business Hours WeekDay End is required.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Business Hours Weekend Start</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          style="width: 220px"
                          v-model="formData.qrShortLead.hoursWeekendStart"
                          @keydown="nameKeydownhoursWeekendStart"
                          @update:model-value="handleNumericInputhoursWeekendStart"
                        />
                        <div
                          v-if="
                            v$.formData.qrShortLead.hoursWeekendStart.$error
                          "
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.hoursWeekendStart.$error,
                          }"
                        >
                          <span
                            v-if="
                              !v$.formData.qrShortLead.hoursWeekendStart.$model
                            "
                          >
                            Business Hours Weekend Start is required.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Business Hours Weekend End</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          style="width: 220px"
                          v-model="formData.qrShortLead.hoursWeekendEnd"
                          @keydown="nameKeydownhoursWeekendEnd"
                          @update:model-value="handleNumericInputhoursWeekendEnd"
                        />
                        <div
                          v-if="v$.formData.qrShortLead.hoursWeekendEnd.$error"
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.hoursWeekendEnd.$error,
                          }"
                        >
                          <span
                            v-if="
                              !v$.formData.qrShortLead.hoursWeekendEnd.$model
                            "
                          >
                            Business Hours Weekend End is required.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Average Bill Amount</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          type="number"
                          style="width: 220px"
                          v-model="formData.qrShortLead.averageBillAmount"
                        />
                        <div
                          v-if="
                            v$.formData.qrShortLead.averageBillAmount.$error
                          "
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.averageBillAmount.$error,
                          }"
                        >
                          <span
                            v-if="
                              !v$.formData.qrShortLead.averageBillAmount.$model
                            "
                          >
                            Average Bill Amount is required.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Maximum Usage - Daily</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          type="number"
                          style="width: 220px"
                          v-model="formData.qrShortLead.maximumUsageDaily"
                        />
                        <div
                          v-if="
                            v$.formData.qrShortLead.maximumUsageDaily.$error
                          "
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.maximumUsageDaily.$error,
                          }"
                        >
                          <span
                            v-if="
                              !v$.formData.qrShortLead.maximumUsageDaily.$model
                            "
                          >
                            Maximum Usage - Daily is required.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Maximum Usage - Weekly</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          type="number"
                          style="width: 220px"
                          v-model="formData.qrShortLead.maximumUsageWeekly"
                        />
                        <div
                          v-if="
                            v$.formData.qrShortLead.maximumUsageWeekly.$error
                          "
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.maximumUsageWeekly.$error,
                          }"
                        >
                          <span
                            v-if="
                              !v$.formData.qrShortLead.maximumUsageWeekly.$model
                            "
                          >
                            Maximum Usage - Weekly is required.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Maximum Usage - Monthly</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          type="number"
                          style="width: 220px"
                          v-model="formData.qrShortLead.maximumUsageMonthly"
                        />
                        <div
                          v-if="
                            v$.formData.qrShortLead.maximumUsageMonthly.$error
                          "
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.maximumUsageMonthly
                                .$error,
                          }"
                        >
                          <span
                            v-if="
                              !v$.formData.qrShortLead.maximumUsageMonthly
                                .$model
                            "
                          >
                            Maximum Usage - Monthly is required.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-8">
          <div class="row">
            <div class="col-12">
              <q-card class="q-ma-xs border-1 q-custom-class" flat>
                <q-card-section class="q-pa-sm bottom-border title-bg">
                  <div class="row items-center">
                    <div class="col text-body1 text-weight-medium">RENTAL</div>
                  </div>
                </q-card-section>

                <q-card-section class="q-pa-sm">
                  <q-list separator class="no-padding text-body1">
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>SO Rental Plan Name</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          style="width: 220px"
                          disable
                          type="text"
                          v-model="formData.qrShortLead.plan.planName"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div style="display: flex; align-items: center">
                          <span
                            style="flex: 1"
                            :class="{
                              'error-highlight':
                                v$.formData.qrShortLead.marsRentalPlanName
                                  .$error,
                            }"
                            >MARS Rental Plan Name</span
                          >
                          <q-select
                            clearable
                            @blur="
                              v$.formData.qrShortLead.marsRentalPlanName.$touch
                            "
                            :error="
                              v$.formData.qrShortLead.marsRentalPlanName.$error
                            "
                            color="grey-9"
                            style="width: 220px"
                            v-model="formData.qrShortLead.marsRentalPlanName"
                            :options="dropDown.rentalplan"
                            label="Select Plan*"
                            @update:model-value="saveFieldData"
                            use-input
                            input-debounce="0"
                            @filter="filterRentalPlans"
                          />
                        </div>
                        <div
                          v-if="
                            v$.formData.qrShortLead.marsRentalPlanName.$error
                          "
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.marsRentalPlanName.$error,
                          }"
                        >
                          <span
                            v-if="
                              !v$.formData.qrShortLead.marsRentalPlanName
                                .$model
                            "
                          >
                            MARS Rental Plan Name is required.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>

                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div style="display: flex; align-items: center">
                          <span
                            style="flex: 1"
                            :class="{
                              'error-highlight':
                                v$.formData.qrShortLead.rentalMode.$error,
                            }"
                            >Rental Mode</span
                          >
                          <q-select
                            @blur="v$.formData.qrShortLead.rentalMode.$touch"
                            :error="v$.formData.qrShortLead.rentalMode.$error"
                            placeholder="Choose from the below*"
                            color="grey-9"
                            style="width: 220px"
                            v-model="formData.qrShortLead.rentalMode"
                            label="Rental Mode*"
                            :options="rentalModeOptions"
                          />
                        </div>
                        <div
                          v-if="v$.formData.qrShortLead.rentalMode.$error"
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.rentalMode.$error,
                          }"
                        >
                          <span
                            v-if="!v$.formData.qrShortLead.rentalMode.$model"
                          >
                            Rental Mode is required.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>

                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div style="display: flex; align-items: center">
                          <span
                            style="flex: 1"
                            :class="{
                              'error-highlight':
                                v$.formData.qrShortLead.rentalType.$error,
                            }"
                            >Rental Type</span
                          >
                          <div class="group">
                            <q-radio
                              v-for="(item, index) in rentalTypeOptions"
                              :key="index"
                              color="grey-9"
                              style="width: 103px"
                              v-model="formData.qrShortLead.rentalType"
                              :val="item.value"
                              :label="item.label"
                            />
                          </div>
                        </div>
                        <div
                          v-if="v$.formData.qrShortLead.rentalType.$error"
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.rentalType.$error,
                          }"
                        >
                          <span
                            v-if="!v$.formData.qrShortLead.rentalType.$model"
                          >
                            Rental Type is required.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>

                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Setup Fee</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          style="width: 220px"
                          type="number"
                          v-model="formData.qrShortLead.setupFees"
                        />
                        <div
                          v-if="v$.formData.qrShortLead.setupFees.$error"
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.setupFees.$error,
                          }"
                        >
                          <span
                            v-if="!v$.formData.qrShortLead.setupFees.$model"
                          >
                            Setup Fee is required.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Reccuring Fee</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          type="number"
                          style="width: 220px"
                          v-model="formData.qrShortLead.recurringFees"
                        />
                        <div
                          v-if="v$.formData.qrShortLead.recurringFees.$error"
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.recurringFees.$error,
                          }"
                        >
                          <span
                            v-if="!v$.formData.qrShortLead.recurringFees.$model"
                          >
                            Reccuring Fee is required.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <q-card class="q-ma-xs border-1 q-custom-class" flat>
                <q-card-section class="q-pa-sm bottom-border title-bg">
                  <div class="row items-center">
                    <div class="col text-body1 text-weight-medium">MDR</div>
                  </div>
                </q-card-section>

                <q-card-section class="q-pa-sm">
                  <q-list separator class="no-padding text-body1">
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Merchant Category</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          disable
                          type="text"
                          style="width: 220px"
                          v-model="
                            formData.qrShortLead.merchantCategory
                              .merchantCategoryName
                          "
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Select MDR Plan</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          disable
                          style="width: 220px"
                          type="text"
                          v-model="formData.qrShortLead.mdrPlanName"
                        />
                      </q-item-section>
                    </q-item>
                    <div v-if="formData.qrShortLead.isMerchant == 1">
                      <q-item class="q-pa-sm text-body1">
                        <q-item-section>
                          <div>Small Merchant - MDR &lt;2K Debit Card</div>
                        </q-item-section>
                        <q-item-section side>
                          <q-input
                            style="width: 220px"
                            type="number"
                            v-model="
                              formData.qrShortLead.smallMerchantLessThanTwoDebit
                            "
                          />
                          <div
                            v-if="
                              v$.formData.qrShortLead
                                .smallMerchantLessThanTwoDebit.$error
                            "
                            class="error-tooltip"
                            :class="{
                              'error-highlight':
                                v$.formData.qrShortLead
                                  .smallMerchantLessThanTwoDebit.$error,
                            }"
                          >
                            <span
                              v-if="
                                !v$.formData.qrShortLead
                                  .smallMerchantLessThanTwoDebit.$model
                              "
                            >
                              Small Merchant - MDR &lt;2K Debit Card is required.
                            </span>
                          </div>
                        </q-item-section>
                      </q-item>
                      <q-item class="q-pa-sm text-body1">
                        <q-item-section>
                          <div>Small merchant - MDR &gt;2K Debit Card</div>
                        </q-item-section>
                        <q-item-section side>
                          <q-input
                            style="width: 220px"
                            type="number"
                            v-model="
                              formData.qrShortLead
                                .smallMerchantGreaterThanTwoDebit
                            "
                          />
                          <div
                            v-if="
                              v$.formData.qrShortLead
                                .smallMerchantGreaterThanTwoDebit.$error
                            "
                            class="error-tooltip"
                            :class="{
                              'error-highlight':
                                v$.formData.qrShortLead
                                  .smallMerchantGreaterThanTwoDebit.$error,
                            }"
                          >
                            <span
                              v-if="
                                !v$.formData.qrShortLead
                                  .smallMerchantGreaterThanTwoDebit.$model
                              "
                            >
                              Small merchant - MDR &gt;2K Debit Card is required.
                            </span>
                          </div>
                        </q-item-section>
                      </q-item>
                      <q-item class="q-pa-sm text-body1">
                        <q-item-section>
                          <div>Small merchant - MDR &lt;2K Credit Card</div>
                        </q-item-section>
                        <q-item-section side>
                          <q-input
                            style="width: 220px"
                            type="number"
                            v-model="
                              formData.qrShortLead
                                .smallMerchantLessThanTwoCreditAndPrepaid
                            "
                          />
                          <div
                            v-if="
                              v$.formData.qrShortLead
                                .smallMerchantLessThanTwoCreditAndPrepaid.$error
                            "
                            class="error-tooltip"
                            :class="{
                              'error-highlight':
                                v$.formData.qrShortLead
                                  .smallMerchantLessThanTwoCreditAndPrepaid
                                  .$error,
                            }"
                          >
                            <span
                              v-if="
                                !v$.formData.qrShortLead
                                  .smallMerchantLessThanTwoCreditAndPrepaid
                                  .$model
                              "
                            >
                              Small merchant - MDR &lt;2K Credit Card is required.
                            </span>
                          </div>
                        </q-item-section>
                      </q-item>
                      <q-item class="q-pa-sm text-body1">
                        <q-item-section>
                          <div>Small merchant - MDR &gt;2K Credit Card</div>
                        </q-item-section>
                        <q-item-section side>
                          <q-input
                            style="width: 220px"
                            type="number"
                            v-model="
                              formData.qrShortLead
                                .smallMerchantGreaterThanTwoCreditAndPrepaid
                            "
                          />
                          <div
                            v-if="
                              v$.formData.qrShortLead
                                .smallMerchantGreaterThanTwoCreditAndPrepaid
                                .$error
                            "
                            class="error-tooltip"
                            :class="{
                              'error-highlight':
                                v$.formData.qrShortLead
                                  .smallMerchantGreaterThanTwoCreditAndPrepaid
                                  .$error,
                            }"
                          >
                            <span
                              v-if="
                                !v$.formData.qrShortLead
                                  .smallMerchantGreaterThanTwoCreditAndPrepaid
                                  .$model
                              "
                            >
                              Small merchant - MDR &gt;2K Credit Card is required.
                            </span>
                          </div>
                        </q-item-section>
                      </q-item>
                    </div>
                    <div v-else>
                      <q-item class="q-pa-sm text-body1">
                        <q-item-section>
                          <div>Large merchant - MDR &lt;2K Debit Card</div>
                        </q-item-section>
                        <q-item-section side>
                          <q-input
                            style="width: 220px"
                            type="number"
                            v-model="
                              formData.qrShortLead.largeMerchantLessThanTwoDebit
                            "
                          />
                          <div
                            v-if="
                              v$.formData.qrShortLead
                                .largeMerchantLessThanTwoDebit.$error
                            "
                            class="error-tooltip"
                            :class="{
                              'error-highlight':
                                v$.formData.qrShortLead
                                  .largeMerchantLessThanTwoDebit.$error,
                            }"
                          >
                            <span
                              v-if="
                                !v$.formData.qrShortLead
                                  .largeMerchantLessThanTwoDebit.$model
                              "
                            >
                              Large merchant - MDR &lt;2K Debit Card is required.
                            </span>
                          </div>
                        </q-item-section>
                      </q-item>
                      <q-item class="q-pa-sm text-body1">
                        <q-item-section>
                          <div>Large merchant - MDR &gt;2K Debit Card</div>
                        </q-item-section>
                        <q-item-section side>
                          <q-input
                            style="width: 220px"
                            type="number"
                            v-model="
                              formData.qrShortLead
                                .largeMerchantGreaterThanTwoDebit
                            "
                          />
                          <div
                            v-if="
                              v$.formData.qrShortLead
                                .largeMerchantGreaterThanTwoDebit.$error
                            "
                            class="error-tooltip"
                            :class="{
                              'error-highlight':
                                v$.formData.qrShortLead
                                  .largeMerchantGreaterThanTwoDebit.$error,
                            }"
                          >
                            <span
                              v-if="
                                !v$.formData.qrShortLead
                                  .largeMerchantGreaterThanTwoDebit.$model
                              "
                            >
                              Large merchant - MDR &gt;2K Debit Card is required.
                            </span>
                          </div>
                        </q-item-section>
                      </q-item>
                      <q-item class="q-pa-sm text-body1">
                        <q-item-section>
                          <div>Large merchant - MDR &lt;2K Credit Card</div>
                        </q-item-section>
                        <q-item-section side>
                          <q-input
                            style="width: 220px"
                            type="number"
                            v-model="
                              formData.qrShortLead
                                .largeMerchantLessThanTwoCreditandPrepaid
                            "
                          />
                          <div
                            v-if="
                              v$.formData.qrShortLead
                                .largeMerchantLessThanTwoCreditandPrepaid.$error
                            "
                            class="error-tooltip"
                            :class="{
                              'error-highlight':
                                v$.formData.qrShortLead
                                  .largeMerchantLessThanTwoCreditandPrepaid
                                  .$error,
                            }"
                          >
                            <span
                              v-if="
                                !v$.formData.qrShortLead
                                  .largeMerchantLessThanTwoCreditandPrepaid
                                  .$model
                              "
                            >
                              Large merchant - MDR &lt;2K Credit Card is required.
                            </span>
                          </div>
                        </q-item-section>
                      </q-item>
                      <q-item class="q-pa-sm text-body1">
                        <q-item-section>
                          <div>Large merchant - MDR &gt;2K Credit Card</div>
                        </q-item-section>
                        <q-item-section side>
                          <q-input
                            style="width: 220px"
                            type="number"
                            v-model="
                              formData.qrShortLead
                                .largeMerchantGreaterThanTwoCreditandPrepaid
                            "
                          />
                          <div
                            v-if="
                              v$.formData.qrShortLead
                                .largeMerchantGreaterThanTwoCreditandPrepaid
                                .$error
                            "
                            class="error-tooltip"
                            :class="{
                              'error-highlight':
                                v$.formData.qrShortLead
                                  .largeMerchantGreaterThanTwoCreditandPrepaid
                                  .$error,
                            }"
                          >
                            <span
                              v-if="
                                !v$.formData.qrShortLead
                                  .largeMerchantGreaterThanTwoCreditandPrepaid
                                  .$model
                              "
                            >
                              Large merchant - MDR &gt;2K Credit Card is required.
                            </span>
                          </div>
                        </q-item-section>
                      </q-item>
                    </div>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Fixed</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          style="width: 220px"
                          type="number"
                          v-model="formData.qrShortLead.mdrFixed"
                          label="Fixed"
                          placeholder="Fixed"
                        />
                        <div
                          v-if="v$.formData.qrShortLead.mdrFixed.$error"
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.mdrFixed.$error,
                          }"
                        >
                          <span v-if="!v$.formData.qrShortLead.mdrFixed.$model">
                            Fixed is required.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Max MDR per transaction</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          type="number"
                          style="width: 220px"
                          v-model="formData.qrShortLead.maxMdrPerTransaction"
                          label="Max MDR per transaction"
                          placeholder="Max MDR per transaction"
                        />
                        <div
                          v-if="
                            v$.formData.qrShortLead.maxMdrPerTransaction.$error
                          "
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.maxMdrPerTransaction
                                .$error,
                          }"
                        >
                          <span
                            v-if="
                              !v$.formData.qrShortLead.maxMdrPerTransaction
                                .$model
                            "
                          >
                            Max MDR per transaction is required.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-8">
          <div class="row">
            <div class="col-12">
              <q-card class="q-ma-xs border-1 q-custom-class" flat>
                <q-card-section class="q-pa-sm bottom-border title-bg">
                  <div class="row items-center">
                    <div class="col text-body1 text-weight-medium">PAYMENT</div>
                  </div>
                </q-card-section>
                <q-card-section class="q-pa-sm">
                  <q-list separator class="no-padding text-body1">
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>Cheque Number</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          style="width: 220px"
                          type="text"
                          v-model="formData.qrShortLead.chequeNumber"
                          label="Cheque Number"
                          placeholder="Cheque Number"
                          @keydown="nameKeydown"
                        />
                        <div v-if="chequeNumberError" class="error-tooltip">
                          Cheque Number is required when NEFT ID is not
                          provided.
                        </div>
                        <div v-if="chequeNumberandneft" class="error-tooltip">
                          Enter any one Cheque Number or NEFT ID.
                        </div>
                      </q-item-section>
                    </q-item>

                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div>NEFT ID</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          style="width: 220px"
                          type="text"
                          v-model="formData.qrShortLead.neftId"
                          label="NEFT ID"
                          placeholder="NEFT ID"
                          @keydown="nameKeydown"
                        />
                        <div v-if="neftIdError" class="error-tooltip">
                          NEFT ID is required when Cheque Number is not
                          provided.
                        </div>
                        <div v-if="chequeNumberandneft" class="error-tooltip">
                          Enter any one Cheque Number or NEFT ID.
                        </div>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <q-card class="q-ma-xs border-1 q-custom-class" flat>
                <q-card-section class="q-pa-sm bottom-border title-bg">
                  <div class="row items-center">
                    <div class="col text-body1 text-weight-medium">
                      ACCOUNT INFORMATION
                    </div>
                  </div>
                </q-card-section>
                <q-card-section class="q-pa-sm">
                  <q-list separator class="no-padding text-body1">
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div style="display: flex; align-items: center">
                          <span
                            style="flex: 1"
                            :class="{
                              'error-highlight':
                                v$.formData.qrShortLead.accountNumber.$error,
                            }"
                          >
                            Account Number
                          </span>
                          <q-input
                            @blur="v$.formData.qrShortLead.accountNumber.$touch"
                            :error="v$.formData.qrShortLead.accountNumber.$error"
                            style="width: 220px"
                            label="Account Number"
                            placeholder="Account Number"
                            v-model="formData.qrShortLead.accountNumber"
                            @keydown="nameKeydownacc"
                          />
                        </div>
                        <div
                          v-if="v$.formData.qrShortLead.accountNumber.$error"
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.accountNumber.$error,
                          }"
                        >
                          <span
                            v-if="!v$.formData.qrShortLead.accountNumber.$model"
                          >
                            Account Number is required.
                          </span>
                          <span
                            v-if="
                              v$.formData.qrShortLead.accountNumber.$model &&
                              (v$.formData.qrShortLead.accountNumber.$model <
                                8 ||
                                v$.formData.qrShortLead.accountNumber.$model >
                                  19)
                            "
                          >
                            Account Number must be between 8 and 19.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div style="display: flex; align-items: center">
                          <span
                            style="flex: 1"
                            :class="{
                              'error-highlight':
                                v$.formData.qrShortLead.ifscCode.$error,
                            }"
                          >
                            IFSC
                          </span>
                          <q-input
                            @blur="v$.formData.qrShortLead.ifscCode.$touch"
                            :error="v$.formData.qrShortLead.ifscCode.$error"
                            style="width: 220px"
                            type="text"
                            label="IFSC Code"
                            placeholder="IFSC Code"
                            v-model="formData.qrShortLead.ifscCode"
                            @keydown="nameKeydown"
                          />
                        </div>
                        <div
                          v-if="v$.formData.qrShortLead.ifscCode.$error"
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.ifscCode.$error,
                          }"
                        >
                          <span
                            v-if="!v$.formData.qrShortLead.ifscCode.$model"
                          >
                            IFSC is required.
                          </span>
                          <span
                            v-if="
                              v$.formData.qrShortLead.ifscCode.$model &&
                              v$.formData.qrShortLead.ifscCode.$model.length !==
                                11
                            "
                          >
                            IFSC must be exactly 11 digits.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>

                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div style="display: flex; align-items: center">
                          <span
                            style="flex: 1"
                            :class="{
                              'error-highlight':
                                v$.formData.qrShortLead.bankName.$error,
                            }"
                          >
                            Bank Name
                          </span>
                          <q-input
                            @blur="v$.formData.qrShortLead.bankName.$touch"
                            :error="v$.formData.qrShortLead.bankName.$error"
                            style="width: 220px"
                            type="text"
                            label="Bank Name"
                            placeholder="Bank Name"
                            v-model="formData.qrShortLead.bankName"
                          />
                        </div>
                        <div
                          v-if="v$.formData.qrShortLead.bankName.$error"
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.bankName.$error,
                          }"
                        >
                          <span v-if="!v$.formData.qrShortLead.bankName.$model">
                            Bank Name is required.
                          </span>
                          <span
                            v-if="
                              v$.formData.qrShortLead.bankName.$model &&
                              (v$.formData.qrShortLead.bankName.$model < 0 ||
                                v$.formData.qrShortLead.bankName.$model > 100)
                            "
                          >
                            Bank Name must be between 0 and 100.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-card class="q-ma-xs border-1 q-custom-class" flat>
                <q-card-section class="q-pa-sm bottom-border title-bg">
                  <div class="row items-center">
                    <div class="col text-body1 text-weight-medium">
                      REMARKS
                    </div>
                  </div>
                </q-card-section>
                <q-card-section class="q-pa-sm">
                  <q-list separator class="no-padding text-body1">
                    <q-item class="q-pa-sm text-body1">
                      <q-item-section>
                        <div style="display: flex; align-items: center">
                          <span
                            style="flex: 1"
                            :class="{
                              'error-highlight':
                                v$.formData.qrShortLead.satToMarsRemarks.$error,
                            }"
                          >
                            Remarks
                          </span>
                          <q-input
                            @blur="onBlur"
                            :error="
                              v$.formData.qrShortLead.satToMarsRemarks.$error
                            "
                            style="width: 220px"
                            type="text"
                            label="Remarks"
                            placeholder="Remarks"
                            v-model="formData.qrShortLead.satToMarsRemarks"
                          />
                        </div>
                        <div
                          v-if="v$.formData.qrShortLead.satToMarsRemarks.$error"
                          class="error-tooltip"
                          :class="{
                            'error-highlight':
                              v$.formData.qrShortLead.satToMarsRemarks.$error,
                          }"
                        >
                          <span
                            v-if="
                              !v$.formData.qrShortLead.satToMarsRemarks.$model
                            "
                          >
                            Remarks is required.
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>

        <div class="col-12">
          <q-card class="q-ma-xs border-1" flat>
            <q-card-section class="q-pa-sm title-bg bottom-border">
              <span class="text-body1 text-weight-medium">DOCUMENTS </span>
              <span class="text-body1 text-weight-medium"
                >(Merchant Type:
                {{
                  formData.qrShortLead.qrMerchantType.merchantTypeName
                }})</span
              >
            </q-card-section>
            <q-card-section class="no-padding">
              <q-list class="no-padding">
                <viewQrLeadDocument
                  v-if="formData.qrShortLead.qrLeadStatus == 4 || 9"
                  :propLeadDocumentInformation="
                    formData.qrShortLead.qrLeadDocuments
                  "
                  :propGetShortInfo="getAllStaticQrShortLeadDatas"
                  @emitTriggerComponentHotLoad="loadUpdate"
                />
              </q-list>
            </q-card-section>
          </q-card>
        </div>
        <div v-if="formData.qrShortLead.qrLeadCategory">
          <q-banner
            dense
            class="bg-deep-purple-9 text-white"
            icon="notifications_active"
          >
            <template v-slot:avatar>
              <q-icon name="notifications_active" />
            </template>
            No Documents For Existing Merchant
          </q-banner>
        </div>
        <div class="alignbtn">
          <q-stepper-navigation>
            <q-btn
              icon="arrow_back"
              color="dark"
              class="q-ma-xs"
              @click="$router.go(-1)"
              label="Back"
            />
            <q-btn
              icon="clear"
              class="q-ma-xs"
              color="negative"
              label="REJECT"
              @click="fnToggleQrRejectLeadComp()"
            />
            <q-btn
              :disable="formData.qrShortLead.qrLeadStatus == 9"
              color="blue"
              class="q-ma-xs"
              icon="inbox"
              label="Refer Back"
              @click="referBackAndEnableProceed"
            />
            <q-btn
              color="amber-10"
              class="q-ma-xs"
              icon="inbox"
              label="Save Partial"
              @click="savePartialAndEnableProceed"
            />
            <q-btn
              v-if="
                formData.qrShortLead.documentUploadedType == 2 &&
                formData.qrShortLead.qrLeadCategory != true
              "
              :disable="flag || !partialSaved"
              icon="send"
              class="q-ma-xs"
              color="green"
              label="Proceed To mars"
              @click="documentValidation"
            />
            <q-btn
              v-else-if="formData.qrShortLead.qrLeadCategory"
              :disable="flag || !partialSaved"
              icon="send"
              class="q-ma-xs"
              color="green"
              label="Proceed To mars"
              @click="proceedToMars"
            />
            <q-btn
              v-else
              :disable="!partialSaved"
              icon="send"
              class="q-ma-xs"
              color="green"
              label="Proceed To mars"
              @click="documentValidation"
            />
          </q-stepper-navigation>
        </div>
        <showFinalRejectQrLeadRemarksComponent
          v-if="toggleLeadRejectModal"
          :propToggleLeadModal="toggleLeadRejectModal"
          :propLeadDetails="getAllStaticQrShortLeadDatas"
          @toggleLeadModal="fnToggleQrRejectLeadComp"
        />
        <ReferBackRemarks
          v-if="propShowUpdateOpenedExternal"
          :propShowUpdateOpenedExternal="propShowUpdateOpenedExternal"
          :propRowDetails="propRowDetails"
          @emitfnshowUpdateOpenedExternal="fnReassignData"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted, reactive } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import {
  required,
  minLength,
  maxLength,
  email,
  between
} from '@vuelidate/validators'
import _ from 'lodash'

// Components
import viewQrLeadDocument from '../../components/sat/viewQrLeadDocument.vue'
import showFinalRejectQrLeadRemarksComponent from '../../components/sat/showFinalRejectQrLeadRemarksComponent.vue'
import ReferBackRemarks from '../../components/sat/ReferBackRemarks.vue'

// Quasar
const $q = useQuasar()

// Vue Router
const route = useRoute()
const router = useRouter()

// Vuex
const store = useStore()

// Reactive data
const applicationNumber = ref('')
const cityOptions = ref([])
const stateOptions = ref([])
const propShowUpdateOpenedExternal = ref(false)
const formData = reactive({
  qrShortLead: '',
  documentType: []
})
const validPincodes = ref([])
const validPin = ref([])
const partialSaved = ref(false)
const mccSearchSet = ref([])
const isactivemerchant = ref('Small')
const isactivemerchant1 = ref('Large')
const propLeadDeatils = ref([])
const count = ref(0)
const terminalCodeValue = ref('')
const flag = ref(false)
const alternativeError = ref(false)
const gstNumberError = ref(false)

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

const rentalTypeOptions = ref([
  { label: 'Advanced', value: 'A' },
  { label: 'Regular', value: 'R' }
])

const iciciMarsRequest = reactive({
  merchant: {
    device: '',
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
      loanDisbursementDate: '04/03/2023',
      tenureMonth: '',
      tenureDay: '',
      tenureStartDate: '04/03/2023',
      rentPercentage: 2,
      rentFixed: ''
    },
    additionalInfo: {
      installationBranchCode: null,
      iaLocation: null,
      iaDistrict: null,
      branchZone: null,
      raDistrict: null,
      od1District: null,
      od2District: null,
      lorState: null,
      iaSalutation: null,
      iaGender: null,
      od1Salutation: null,
      od1Gender: null,
      od2Salutation: null,
      od2Gender: null,
      state: '',
      city: '',
      fillingType: '',
      category: null,
      subCategory: null,
      ownerDOB: null,
      pin: '',
      states: null,
      fillingTypes: null
    },
    companyInformation: {
      legalName: '',
      dbaName: '',
      smsFlag: 'N',
      registeredAddress: '',
      registeredPin: '',
      registeredCityRefCode: '',
      registeredStateRefCode: '',
      constitution: '',
      constitutionName: '',
      constitutionDescription: '',
      establishYear: '',
      pan: '',
      registerNumber: 'test',
      tin: '',
      tan: '',
      businessNature: '',
      businessType: 'R',
      mcc: '',
      residentialAddress: '',
      residentialPin: '',
      statezone: '90',
      cityzone: '',
      residentialCityRefCode: '',
      residentialStateRefCode: '',
      contactName: '',
      contactMobile: '',
      contactAlternateMobile: '',
      contactPhone: '',
      contactEmail: '',
      statementType: 'E',
      statementFrequency: 'M',
      statementEmail: '',
      registeredCityName: '',
      registeredStateName: '',
      mccname: '',
      residentCityName: '',
      residentStateName: ''
    },
    businessInformation: {
      weekdayStartHour: '',
      weekdayEndHour: '',
      weekendStartHour: '',
      weekendEndHour: '',
      lastTurnoverYear: '2022',
      maximumMonthlyUsage: '',
      merchantTypeCode: 'S',
      lastTurnoverAmount: '100',
      expectedCardBusiness: 12,
      averageBillAmount: '',
      gstId: null,
      currentPosName: '',
      debitCardMdr: '',
      creditCardMdr: '',
      memberSince: '04/03/2023',
      businessIncome: '100'
    },
    partnerInformation: [
      {
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
    ],
    customIncentiveRates: [
      {
        minValue: 200,
        maxValue: 999,
        mechantFixed: 0.5,
        merchantPercent: 0,
        sharingFixed: 0,
        sharingPercent: 0
      },
      {
        minValue: 1000,
        maxValue: 1999,
        mechantFixed: 2,
        merchantPercent: 0,
        sharingFixed: 1,
        sharingPercent: 0
      },
      {
        minValue: 2000,
        maxValue: 2999,
        mechantFixed: 5,
        merchantPercent: 0,
        sharingFixed: 1,
        sharingPercent: 0
      },
      {
        minValue: 3000,
        maxValue: 3499,
        mechantFixed: 9.5,
        merchantPercent: 0,
        sharingFixed: 1,
        sharingPercent: 0
      },
      {
        minValue: 3500,
        maxValue: 10000,
        mechantFixed: 5,
        merchantPercent: 0,
        sharingFixed: 2,
        sharingPercent: 0
      }
    ],
    paymentDetails: {
      deviceOwnedBy: 'S',
      installationFee: 0,
      terminalModeCode: '',
      terminalType: 'POS',
      cardAcceptance: '1',
      numberOfTerminals: 1,
      emiStartDate: null,
      omcEnabled: false,
      intlCardAcceptance: 'N',
      creditCardBlock: 'N',
      tipPercentage: '20',
      rentalPlanCode: '',
      recurringFees: '',
      serviceProvider: '1',
      networkPreferred: '1',
      rentalMode: '',
      rentalType: '',
      advanceRentCollected: 0,
      advanceRentMode: 'NEFT',
      noOfMonthRentPaidInAdvance: '0',
      gracePeriod: 0,
      totalEmiAmount: '',
      emiTenure: '',
      otherCharges: '',
      totalAmountPaid: '',
      cashAtPosEnabled: 'N',
      vpa: []
    },
    bankInformation: {
      bankDetails: {
        ifsc: '',
        micr: '250240302',
        bankName: '',
        branchName: '',
        branchCode: '',
        branchZone: '',
        bankCityRefCode: '',
        bankStateRefCode: '',
        paymentMode: 'D',
        accountType: 'C',
        accountdetails: '90',
        accountNumber: '',
        bankStatementAttached: 'Y',
        cancelChequeAttached: 'Y',
        feeType: 'N',
        settlementOrNeftFee: '0',
        bankCityName: '',
        bankStateName: ''
      },
      collectionDetails: {
        collectedDate: null,
        swipeAmount: '',
        swipeTerminal: '',
        chequeAmount: '',
        chequeDate: null,
        chequeDepositedDate: null,
        chequeNumber: '',
        neftId: '',
        upiLink: '',
        acquirerBank: ''
      }
    },
    kyc: {
      documents: []
    },
    remarks: '',
    mdrPlan: {
      code: 9,
      upiUpto2000: {
        percentage: 0,
        fixed: 0,
        minimum: 0
      },
      upiAbove2000: {
        percentage: 0,
        fixed: 0,
        minimum: 0
      },
      upiCreditUpto2000: {
        percentage: 0,
        fixed: 0,
        minimum: 0,
        minimumTxnValue: 0.0
      },
      upiCreditAbove2000: {
        percentage: 0,
        fixed: 0,
        minimum: 0,
        minimumTxnValue: 0.0
      },
      domesticDebitUpTo2000: {
        fixed: 0,
        percentage: 0.0,
        minimum: 0
      },
      incentive: {
        percentage: null,
        minimum: null,
        minimumTxnValue: null
      },
      domesticDebitAbove2000: {
        fixed: 0,
        percentage: 0.0,
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
      },
      convenientFee: {
        fixed: 0,
        percentage: 0,
        minimum: 0
      },
      diners: {
        fixed: 0,
        percentage: 0,
        minimum: 0
      }
    },
    revParameters: {
      cashAtPosEnabled: 'N',
      tipEnabled: 'N',
      saleFlag: '1',
      notificationRecipient: null,
      preAuth: 'N',
      settlementType: 'A',
      txnEmiAllowed: '0',
      sodexoEnabled: '0',
      amexEnabled: '0',
      bqrEnabled: '0',
      upichargeslipEnabled: '0',
      linkpaymentFlag: '0',
      matmAllowed: 'N',
      upiFlag: '1',
      isMTIDEnabled: '0',
      combinedSettlementFlag: 0,
      ONBOARDING_REQD: 0,
      scheme: 'UPI',
      baseInstitution: 110,
      bTID: '',
      baseMid: ''
    }
  }
})

const ownHouseOptions = ref([
  { label: 'Yes', value: true },
  { label: 'No', value: false }
])

const toggleLeadRejectModal = ref(false)

const dropDown = reactive({
  deviceOptions: [],
  merchantDistrict: [],
  merchantState: [],
  leadSourceOptions: [],
  merchantCategory: [],
  merchantSubDistrict: [],
  merchantTownOrVillageDetails: [],
  merchantTierDetails: [],
  merchantNameType: [],
  rentalplan: [],
  salesPersonOptions: [],
  salesPersonOptionsAll: []
})

// Variables for propRowDetails and ajaxQrLoadShortLeadInfo
const propRowDetails = ref(null)
const ajaxQrLoadShortLeadInfo = () => {
  // This function needs to be defined or imported
  console.log('ajaxQrLoadShortLeadInfo called')
}

// Validation rules
const rules = {
  iciciMarsRequest: {
    merchant: {}
  },
  formData: {
    qrShortLead: {
      merchantIndustry: {
        industryName: { required }
      },
      contactName: { required },
      city: { required },
      state: { required },
      personalInfoCity: { required },
      personalInfoState: { required },
      salesPersonName: { required },
      contactEmail: { required, email },
      marketingName: { required },
      marsRentalPlanName: { required },
      rentalMode: { required },
      rentalType: { required },
      legalName: { maxLength: maxLength(60), required },
      contactAddress: { maxLength: maxLength(120), required },
      personalAddress: { maxLength: maxLength(180), required },
      personalInfoPincode: {
        minLength: minLength(6),
        maxLength: maxLength(6),
        required
      },
      pincode: {
        minLength: minLength(6),
        maxLength: maxLength(6),
        required
      },
      personalInfoMobile: {
        minLength: minLength(10),
        maxLength: maxLength(10),
        required
      },
      natureOfBusiness: { required },
      personalInfoEmail: { email, required },
      dateOfBirth: { required },
      gstNumber: {
        maxLength: value => {
          if (value) {
            return value.length === 15
          }
          return true
        }
      },
      panNumber: {
        minLength: minLength(10),
        maxLength: maxLength(10),
        required
      },
      contactNumber: {
        minLength: minLength(10),
        maxLength: maxLength(10),
        required
      },
      accountNumber: {
        minLength: minLength(8),
        maxLength: maxLength(19),
        required
      },
      ifscCode: {
        minLength: minLength(11),
        maxLength: maxLength(11),
        required
      },
      bankName: { maxLength: maxLength(100), required },
      hoursWeekdayStart: { required },
      hoursWeekdayEnd: { required },
      hoursWeekendStart: { required },
      hoursWeekendEnd: { required },
      averageBillAmount: { required },
      maximumUsageDaily: { required },
      maximumUsageWeekly: { required },
      maximumUsageMonthly: { required },
      setupFees: { required },
      recurringFees: { required },
      smallMerchantLessThanTwoDebit: { required },
      smallMerchantGreaterThanTwoDebit: { required },
      smallMerchantLessThanTwoCreditAndPrepaid: { required },
      smallMerchantGreaterThanTwoCreditAndPrepaid: { required },
      largeMerchantLessThanTwoDebit: { required },
      largeMerchantGreaterThanTwoDebit: { required },
      largeMerchantLessThanTwoCreditandPrepaid: { required },
      largeMerchantGreaterThanTwoCreditandPrepaid: { required },
      mdrFixed: { required },
      maxMdrPerTransaction: { required },
      satToMarsRemarks: { required },
      ownerAge: { required, between: between(1, 150) }
    }
  }
}

const v$ = useVuelidate(rules, { formData, iciciMarsRequest })

// Computed properties
const businessNature = computed(() => {
  return formData.qrShortLead?.natureOfBusiness?.trim()
    ? formData.qrShortLead.natureOfBusiness
    : 'NA'
})

const chequeNumberError = computed(() => {
  return (
    (!formData.qrShortLead?.chequeNumber ||
      formData.qrShortLead.chequeNumber === '') &&
    (!formData.qrShortLead?.neftId || formData.qrShortLead.neftId === '')
  )
})

const neftIdError = computed(() => {
  return (
    (!formData.qrShortLead?.neftId || formData.qrShortLead.neftId === '') &&
    (!formData.qrShortLead?.chequeNumber ||
      formData.qrShortLead.chequeNumber === '')
  )
})

const chequeNumberandneft = computed(() => {
  return (
    formData.qrShortLead?.neftId &&
    formData.qrShortLead.neftId !== '' &&
    formData.qrShortLead?.chequeNumber &&
    formData.qrShortLead.chequeNumber !== ''
  )
})

const alternativeValidationError = computed(() => {
  if (
    !formData.qrShortLead?.alternateContactNumber ||
    formData.qrShortLead.alternateContactNumber === ''
  ) {
    return false
  } else {
    return (
      formData.qrShortLead.alternateContactNumber.toString().length !== 10
    )
  }
})

const gstNumberValidationError = computed(() => {
  if (
    !formData.qrShortLead?.gstNumber ||
    formData.qrShortLead.gstNumber === ''
  ) {
    return false
  } else {
    return formData.qrShortLead.gstNumber.length !== 15
  }
})

const isEstablishmentYearValid = computed(() => {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/
  return regex.test(formData.qrShortLead?.establishmentYear || '')
})

const isdobformatValid = computed(() => {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/
  return regex.test(formData.qrShortLead?.dateOfBirth || '')
})

// Vuex Getters
const GLOBAL_FILE_FETCH_URL = computed(() => store.getters['GlobalVariables/GLOBAL_FILE_FETCH_URL'])
const getAllStaticQrShortLeadDatas = computed(() => store.getters['iciciStaticQr/getAllStaticQrShortLeadDatas'])
const getStaicQrExistingMerchantMarsId = computed(() => store.getters['iciciStaticQr/getStaicQrExistingMerchantMarsId'])
const getActiveMerchantCategory = computed(() => store.getters['merchantCategory/getActiveMerchantCategory'])
const getappMerchantDocumentType = computed(() => store.getters['appMerchantType/getappMerchantDocumentType'])
const getsorentalplan = computed(() => store.getters['appMerchantType/getsorentalplan'])
const cityFromMars = computed(() => store.getters['mars_city/cityFromMars'])
const stateFromMars = computed(() => store.getters['mars_state/stateFromMars'])
const qrsalesPersonFromMars = computed(() => store.getters['mars_salesPerson/qrsalesPersonFromMars'])
const mccFromMarsQr = computed(() => store.getters['mars_mcc/mccFromMarsQr'])
const getMerchantTierMappingStateDetails = computed(() => store.getters['merchantTierMapping/getMerchantTierMappingStateDetails'])

// Watchers
watch(() => formData.qrShortLead?.marketingName, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    partialSaved.value = false
  }
})

watch(() => formData.qrShortLead?.legalName, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    partialSaved.value = false
  }
})

watch(() => formData.qrShortLead?.contactName, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    partialSaved.value = false
  }
})

// Methods
const getCurrentDate = () => {
  const currentDate = new Date()
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const day = String(currentDate.getDate()).padStart(2, '0')
  const year = currentDate.getFullYear()
  return `${day}/${month}/${year}`
}

const handleInput = (value) => {
  if (value?.startsWith(' ')) {
    formData.qrShortLead.natureOfBusiness = value.trimStart()
  }
}

const handlelegalname = (value) => {
  if (value?.startsWith(' ')) {
    formData.qrShortLead.legalName = value.trimStart()
  }
}

const handlemarketing = (value) => {
  if (value?.startsWith(' ')) {
    formData.qrShortLead.marketingName = value.trimStart()
  }
}

const nameKeydown = (e) => {
  if (/^\W$/.test(e.key)) {
    e.preventDefault()
  }
}

const nameKeydownacc = (e) => {
  if (/^[A-Za-z\W]$/.test(e.key)) {
    e.preventDefault()
  }
}

const validateName = (event) => {
  const char = String.fromCharCode(event.keyCode)
  const regex = /^[a-zA-Z\s]*$/
  if (
    !regex.test(char) &&
    !['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key)
  ) {
    event.preventDefault()
  }
}

const loadUpdate = async () => {
  await saveCurrentLeadChangesUpdate(formData)
  ajaxQrLoadShortLeadInfo()
}

const ajaxQrLoadShortLeadInfoInitialLoad = async () => {
  $q.loading.show({
    delay: 0,
    spinnerColor: 'deep-purple-9',
    message: 'Fetching data ..'
  })
  
  try {
    await store.dispatch('iciciStaticQr/FETCH_STATIC_QR_SHORT_LEAD_DATA', route.params.id)
    const response = getAllStaticQrShortLeadDatas.value
    propLeadDeatils.value = response
    formData.qrShortLead = response
    
    applicationNumber.value = response.applicationNumber || new Date().getTime()
    iciciMarsRequest.merchant.salesInformation.applicationNumber = applicationNumber.value
    iciciMarsRequest.merchant.salesInformation.applicationDate = getCurrentDate()
    iciciMarsRequest.merchant.salesInformation.aggreementDate = getCurrentDate()
    iciciMarsRequest.merchant.companyInformation.constitution = response.qrMerchantType?.marsMappingId
    
    count.value++
    
    if (response.salesPersonName == null) {
      formData.qrShortLead.salesPersonName = `${response.createdBy?.name || ''}-${response.createdBy?.employeeID || ''}`
    } else if (response.salesPersonName != null) {
      formData.qrShortLead.salesPersonName = response.salesPersonName
    }
    
    if (response.qrLeadCategory) {
      await existingMerchantTid(response.marsId)
    }
    
    fetchAndCookDocuments()
    category()
    
    $q.loading.hide()
  } catch (error) {

    $q.loading.hide()
    console.error('Error loading lead info:', error)
  }
}

const getstate = async () => {
  await store.dispatch('merchantTierMapping/MERCHANT_TIER_MAPPING_GET_STATE_DETAILS')
  const stateDetails = getMerchantTierMappingStateDetails.value
  dropDown.merchantState = stateDetails.map(item => ({
    value: item.stateName,
    label: item.stateName
  }))
}

const getMerchantType = async () => {
  await store.dispatch('appMerchantType/APP_MERCHANT_DOCUMENT_TYPE')
  const documentTypes = getappMerchantDocumentType.value
  dropDown.merchantNameType = documentTypes.map(item => ({
    value: item,
    label: item.merchantTypeName
  }))
}

const getrentalplan = async () => {
  await store.dispatch('appMerchantType/SO_RENTAL_PLAN', iciciMarsRequest.merchant.paymentDetails.rentalPlanCode)
  const rentalPlans = getsorentalplan.value
  dropDown.rentalplan = rentalPlans.map(item => ({
    value: item.code,
    label: item.name
  }))
}

const getSalesPerson = async () => {
  await store.dispatch('mars_salesPerson/QR_SALES_PERSON_FROM_MARS', iciciMarsRequest.merchant.salesInformation.institutionCode)
  
  const salesPersons = qrsalesPersonFromMars.value
  dropDown.salesPersonOptionsAll = salesPersons.map(item => ({
    label: `${item.name} - ${item.empCode}`,
    value: `${item.name} - ${item.empCode}`
  }))
  
  // Add initial options based on lead data
  const leadData = getAllStaticQrShortLeadDatas.value
  if (leadData.salesPersonName == null) {
    dropDown.salesPersonOptions = [
      {
        label: `${leadData.createdBy?.name || ''}-${leadData.createdBy?.employeeID || ''}`,
        value: `${leadData.createdBy?.name || ''}-${leadData.createdBy?.employeeID || ''}`
      },
      ...dropDown.salesPersonOptionsAll
    ]
  } else {
    dropDown.salesPersonOptions = [
      {
        label: leadData.salesPersonName,
        value: leadData.salesPersonName
      },
      ...dropDown.salesPersonOptionsAll
    ]
  }
}

const filterSalesPerson = (val, update) => {
  update(() => {
    if (val === '') {
      dropDown.salesPersonOptions = dropDown.salesPersonOptionsAll
    } else {
      const needle = val.toLowerCase()
      dropDown.salesPersonOptions = dropDown.salesPersonOptionsAll.filter(
        v => v.label.toLowerCase().indexOf(needle) > -1
      )
    }
  })
}

const filterRentalPlans = (val, update) => {
  update(() => {
    const allPlans = dropDown.rentalplan
    if (val === '') {
      dropDown.rentalplan = allPlans
    } else {
      const needle = val.toLowerCase()
      dropDown.rentalplan = allPlans.filter(
        v => v.label.toLowerCase().indexOf(needle) > -1
      )
    }
  })
}

const getmccNameCode = async () => {
  await store.dispatch('mars_mcc/QR_MCC_FROM_MARS')
  const mccData = mccFromMarsQr.value?.items || []
  mccSearchSet.value = mccData.map(oo => ({
    label: `${oo.code}-${oo.name}`,
    value: oo.code
  }))
}

const getcityNameCode = async () => {
  await store.dispatch('mars_city/CITY_FROM_MARS')
  const cityData = cityFromMars.value?.items || []
  cityOptions.value = cityData.map(oo => ({
    label: oo.name,
    value: oo.code
  }))
}

const getstateNameCode = async () => {
  await store.dispatch('mars_state/STATE_FROM_MARS')
  const stateData = stateFromMars.value?.items || []
  stateOptions.value = stateData.map(oo => ({
    label: oo.name,
    value: oo.code
  }))
}

const getMerchantCategory = async () => {
  await store.dispatch('merchantCategory/MERCHANT_CATEGORY_ACTIVE_LIST')
  const categories = getActiveMerchantCategory.value
  dropDown.merchantCategory = categories.map(item => ({
    value: item,
    label: item.merchantCategoryName
  }))
}

const fnReassignData = (rowDetails) => {
  propShowUpdateOpenedExternal.value = !propShowUpdateOpenedExternal.value
  if (rowDetails != undefined) {
    propRowDetails.value = rowDetails
  }
}

const houseSelected = (item) => {
  formData.qrShortLead.ownHouse = item
}

const saveFieldData = () => {
  saveCurrentLeadChanges(formData)
}

const validateStateInput = () => {
  const validState = stateOptions.value.some(
    option => option.label === formData.qrShortLead.state
  )
  if (!validState) {
    formData.qrShortLead.state = ''
  }
}

const validatePersonalStateInput = () => {
  const validPersonalState = stateOptions.value.some(
    option => option.label === formData.qrShortLead.personalInfoState
  )
  if (!validPersonalState) {
    formData.qrShortLead.personalInfoState = ''
  }
}

const validateCityInput = () => {
  const validCity = cityOptions.value.some(
    option => option.label === formData.qrShortLead.city
  )
  if (!validCity) {
    formData.qrShortLead.city = ''
  }
}

const validatePersonalCityInput = () => {
  const validPersonalCity = cityOptions.value.some(
    option => option.label === formData.qrShortLead.personalInfoCity
  )
  if (!validPersonalCity) {
    formData.qrShortLead.personalInfoCity = ''
  }
}

const validateMCCInput = () => {
  const validMCC = mccSearchSet.value.some(
    option =>
      option.label === formData.qrShortLead.merchantIndustry?.industryName
  )
  if (!validMCC) {
    formData.qrShortLead.merchantIndustry.industryName = ''
  }
}

const validatePincode = () => {
  if (!validPincodes.value.includes(formData.qrShortLead.pincode)) {
    formData.qrShortLead.pincode = ''
  }
}

const validatePin = () => {
  if (!validPin.value.includes(formData.qrShortLead.personalInfoPincode)) {
    formData.qrShortLead.personalInfoPincode = ''
  }
}

const documentValidation = async () => {
  $q.loading.show({
    delay: 0,
    spinnerColor: 'deep-purple-9',
    message: 'Validating ..'
  })
  
  try {
    await store.dispatch('SatLeadValidation/VERIFY_QR_LEAD_DOCUMENTS', {
      id: route.params.id,
      params: []
    })
    $q.loading.hide()
    proceedToMars()
  } catch (error) {

    $q.loading.hide()
    
    if (error.data?.data?.toBeVerifiedDocuments?.length > 0) {
      let arrayMessage = ''
      _.map(error.data.data.toBeVerifiedDocuments, oo => {
        arrayMessage += `${oo}, `
      })
      $q.notify({
        color: 'amber-9',
        position: 'bottom-left',
        message: error.data.message,
        detail: arrayMessage,
        timeout: 8000,
        icon: 'warning',
        actions: [{ icon: 'close', noDismiss: false }]
      })
    } else {
      delete error.data.data?.toBeVerifiedDocuments
      for (const key in error.data.data) {
        let arrayMessage = ''
        _.map(error.data.data[key], oo => {
          arrayMessage += `${oo}, `
        })
        $q.notify({
          color: 'amber-9',
          position: 'bottom-left',
          message: `${error.data.message} for key`,
          detail: arrayMessage,
          timeout: 8000,
          icon: 'warning',
          actions: [{ icon: 'close', noDismiss: false }]
        })
      }
    }
  }
}

const proceedToMars = async () => {
  console.log('Proceed to Mars button clicked')
  v$.value.$touch()
  
  if (v$.value.$error) {
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Please fill all mandatory fields',
      icon: 'info'
    })
  } else {
    $q.loading.show({
      delay: 0,
      spinnerColor: 'deep-purple-9',
      message: 'Sending data to mars'
    })
    
    try {
      const deviceName = propLeadDeatils.value?.device?.deviceName?.toLowerCase() || ''
      iciciMarsRequest.merchant.paymentDetails.terminalModeCode = terminalCodeValue.value
      
      let institutionCode = 110
      if (deviceName.includes('q161')) {
        institutionCode = 106
      }
      
      iciciMarsRequest.merchant.salesInformation.institutionCode = institutionCode
      localStorage.setItem('bb_t', institutionCode.toString())
      
      // Handle VPA for non-q161 devices
      if (!deviceName.includes('q161') && getAllStaticQrShortLeadDatas.value?.qrVpas?.[0]) {
        const vpa = getAllStaticQrShortLeadDatas.value.qrVpas[0].vpa
        iciciMarsRequest.merchant.paymentDetails.vpa = [vpa]
      } else {
        iciciMarsRequest.merchant.paymentDetails.vpa = []
      }
      
      const request = { ...iciciMarsRequest }
      delete request.merchant.paymentDetails.vpa
      
      const response = await store.dispatch('mars_dataSubmit/MARS_STATIC_QR_DATA_SUBMIT', {
        params: request,
        refNumber: propLeadDeatils.value.merchantRefCode,
        qrLeadStatus: propLeadDeatils.value.qrLeadStatus
      })
      
      const feedParameters = response.status === 204 ? {
        applicationNumber: propLeadDeatils.value.applicationNumber,
        merchantRefCode: propLeadDeatils.value.merchantRefCode
      } : response.body
      
      await store.dispatch('iciciStaticQr/PROCEED_TO_MARS', {
        request: feedParameters,
        leadId: route.params.id
      })
      
      router.push('/sat/staticQrLeads')
      $q.notify({
        color: 'positive',
        position: 'bottom',
        message: 'Successfully Submitted To Mars!',
        icon: 'thumb_up'
      })
    } catch (error) {

      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: error.data?.message || 'Submission failed!',
        icon: 'thumb_down'
      })
    } finally {
      $q.loading.hide()
    }
  }
}

const category = () => {
  const mappingId = getAllStaticQrShortLeadDatas.value?.qrMerchantType?.marsMappingId
  const mapping = {
    'PL': '60',
    'IN': '90',
    'SP': '80',
    'PB': '60',
    'SO': '40',
    'TR': '50',
    'PV': '70',
    'GV': '30'
  }
  
  iciciMarsRequest.merchant.companyInformation.constitutionName = mapping[mappingId] || ''
}


const existingMerchantTid = async (request) => {
  try {
    await store.dispatch('iciciStaticQr/FETCH_MARS_ID_DATA', request)
    const marsData = getStaicQrExistingMerchantMarsId.value
    iciciMarsRequest.merchant.revParameters.bTID = marsData?.tid || ''
    iciciMarsRequest.merchant.revParameters.baseMid = marsData?.mid || ''
  } catch (error) {

    console.error('Error fetching merchant TID:', error)
  }
}

const fnToggleQrRejectLeadComp = async () => {
  try {
    await store.dispatch('SatLeadValidation/VERIFY_QR_REJECT_LEAD_DOCUMENTS', route.params.id)
    $q.loading.show({
      delay: 0,
      spinnerColor: 'deep-purple-9',
      message: 'Processing ..'
    })
    toggleLeadRejectModal.value = !toggleLeadRejectModal.value
    $q.loading.hide()
  } catch (error) {

    let arrayMessage = ''
    _.map(error.data?.data || [], oo => {
      arrayMessage += `${oo}, `
    })
    $q.notify({
      color: 'amber-9',
      position: 'bottom-left',
      message: error.data?.message || 'Error',
      detail: arrayMessage,
      timeout: 8000,
      icon: 'warning',
      actions: [{ icon: 'close', noDismiss: false }]
    })
    $q.loading.hide()
  }
}

const savePartialAndEnableProceed = () => {
  saveCurrentLeadChanges(formData)
}

const saveCurrentLeadChanges = async (formData) => {
  partialSaved.value = true
  v$.value.$touch()
  
  if (v$.value.$error) {
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Please fill all mandatory fields',
      icon: 'info'
    })
    partialSaved.value = false
  } else {
    $q.loading.show()
    
    try {
      const param = {
        id: formData.qrShortLead.id,
        request: formData.qrShortLead
      }
      
      await store.dispatch('iciciStaticQr/UPDATE_QR_DETAILS', param)
      setMarsData(formData)
      
      $q.notify({
        color: 'positive',
        position: 'bottom',
        message: 'Successfully Updated!',
        icon: 'thumb_up'
      })
    } catch (error) {

      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: error.body?.message || 'Please Try Again Later !',
        icon: 'thumb_down'
      })
    } finally {
      $q.loading.hide()
    }
  }
}

const saveCurrentLeadChangesUpdate = async (formData) => {
  partialSaved.value = true
  $q.loading.show()
  
  try {
    const param = {
      id: formData.qrShortLead.id,
      request: formData.qrShortLead
    }
    
    await store.dispatch('iciciStaticQr/UPDATE_QR_DETAILS', param)
    setMarsData(formData)
    
    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Successfully Updated!',
      icon: 'thumb_up'
    })
  } catch (error) {

    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: error.body?.message || 'Please Try Again Later !',
      icon: 'thumb_down'
    })
  } finally {
    $q.loading.hide()
  }
}

const onBlur = () => {
  v$.value.formData.qrShortLead.satToMarsRemarks.$touch()
  saveFieldData()
}

const referBackAndEnableProceed = () => {
  referBackCurrentLeadChanges(formData)
}

const referBackCurrentLeadChanges = async (formData) => {
  partialSaved.value = true
  v$.value.$touch()
  
  if (v$.value.$error) {
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Please fill all mandatory fields',
      icon: 'info'
    })
    partialSaved.value = false
  } else {
    $q.loading.show()
    
    try {
      const param = {
        id: formData.qrShortLead.id,
        request: formData.qrShortLead
      }
      
      await store.dispatch('iciciStaticQr/REFERBACK_SAT_TO_SO_QR_DETAILS', param)
      router.push('/sat/staticQrLeads')
      setMarsData(formData)
      
      $q.notify({
        color: 'positive',
        position: 'bottom',
        message: 'Successfully Updated!',
        icon: 'thumb_up'
      })
    } catch (error) {

      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: error.body?.message || 'Please Try Again Later !',
        icon: 'thumb_down'
      })
    } finally {
      $q.loading.hide()
    }
  }
}

const setMarsData = (res) => {
  if (!res?.qrShortLead) return
  
  const lead = res.qrShortLead
  
  // Set MDR plan based on merchant type
  if (lead.isMerchant == 1) {
    iciciMarsRequest.merchant.mdrPlan.upiUpto2000.percentage = lead.smallMerchantLessThanTwoDebit
    iciciMarsRequest.merchant.mdrPlan.upiAbove2000.percentage = lead.smallMerchantGreaterThanTwoDebit
    iciciMarsRequest.merchant.mdrPlan.upiCreditUpto2000.percentage = lead.smallMerchantLessThanTwoCreditAndPrepaid
    iciciMarsRequest.merchant.mdrPlan.upiCreditAbove2000.percentage = lead.smallMerchantGreaterThanTwoCreditAndPrepaid
  } else if (lead.isMerchant == 2) {
    iciciMarsRequest.merchant.mdrPlan.upiUpto2000.percentage = lead.largeMerchantLessThanTwoDebit
    iciciMarsRequest.merchant.mdrPlan.upiAbove2000.percentage = lead.largeMerchantGreaterThanTwoDebit
    iciciMarsRequest.merchant.mdrPlan.upiCreditUpto2000.percentage = lead.largeMerchantLessThanTwoCreditandPrepaid
    iciciMarsRequest.merchant.mdrPlan.upiCreditAbove2000.percentage = lead.largeMerchantGreaterThanTwoCreditandPrepaid
  }
  
  // Set other fields
  iciciMarsRequest.merchant.companyInformation.mccname = lead.merchantIndustry?.industryName || ''
  iciciMarsRequest.merchant.companyInformation.mcc = lead.merchantIndustry?.mccCode || ''
  iciciMarsRequest.merchant.salesInformation.salesPersonName = lead.salesPersonName || ''
  iciciMarsRequest.merchant.paymentDetails.rentalPlanCode = lead.marsRentalPlanName || ''
  iciciMarsRequest.merchant.paymentDetails.rentalMode = lead.rentalMode || ''
  iciciMarsRequest.merchant.paymentDetails.rentalType = lead.rentalType || ''
  iciciMarsRequest.merchant.companyInformation.contactEmail = lead.contactEmail || ''
  iciciMarsRequest.merchant.companyInformation.statementEmail = lead.contactEmail || ''
  iciciMarsRequest.merchant.companyInformation.contactMobile = lead.contactNumber || ''
  iciciMarsRequest.merchant.companyInformation.contactName = lead.contactName || ''
  iciciMarsRequest.merchant.companyInformation.dbaName = lead.marketingName || ''
  iciciMarsRequest.merchant.companyInformation.legalName = lead.legalName || ''
  iciciMarsRequest.merchant.companyInformation.pan = lead.panNumber || ''
  iciciMarsRequest.merchant.companyInformation.registeredAddress = lead.contactAddress || ''
  iciciMarsRequest.merchant.companyInformation.registeredCityName = lead.city || ''
  iciciMarsRequest.merchant.companyInformation.registeredStateName = lead.state || ''
  iciciMarsRequest.merchant.companyInformation.residentCityName = lead.personalInfoCity || ''
  iciciMarsRequest.merchant.companyInformation.residentStateName = lead.personalInfoState || ''
  iciciMarsRequest.merchant.companyInformation.residentialPin = lead.personalInfoPincode || ''
  iciciMarsRequest.merchant.companyInformation.businessNature = businessNature.value
  iciciMarsRequest.merchant.companyInformation.registeredPin = lead.pincode || ''
  iciciMarsRequest.merchant.salesInformation.leadFrom = lead.leadSource?.sourceName || ''
  iciciMarsRequest.merchant.bankInformation.bankDetails.accountNumber = lead.accountNumber || ''
  iciciMarsRequest.merchant.businessInformation.gstId = lead.gstNumber || null
  iciciMarsRequest.merchant.businessInformation.weekdayStartHour = lead.hoursWeekdayStart || ''
  iciciMarsRequest.merchant.businessInformation.weekdayEndHour = lead.hoursWeekdayEnd || ''
  iciciMarsRequest.merchant.businessInformation.weekendStartHour = lead.hoursWeekendStart || ''
  iciciMarsRequest.merchant.businessInformation.weekendEndHour = lead.hoursWeekendEnd || ''
  iciciMarsRequest.merchant.businessInformation.averageBillAmount = lead.averageBillAmount || ''
  iciciMarsRequest.merchant.businessInformation.maximumMonthlyUsage = lead.maximumUsageMonthly || ''
  iciciMarsRequest.merchant.companyInformation.contactAlternateMobile = lead.alternateContactNumber || ''
  iciciMarsRequest.merchant.paymentDetails.recurringFees = lead.recurringFees || ''
  iciciMarsRequest.merchant.companyInformation.establishYear = lead.establishmentYear || ''
  iciciMarsRequest.merchant.partnerInformation[0].address = lead.personalAddress || ''
  iciciMarsRequest.merchant.partnerInformation[0].pan = lead.panNumber || ''
  iciciMarsRequest.merchant.partnerInformation[0].pin = lead.personalInfoPincode || ''
  iciciMarsRequest.merchant.partnerInformation[0].dob = lead.dateOfBirth || ''
  iciciMarsRequest.merchant.partnerInformation[0].contactMobile = lead.personalInfoMobile || ''
  iciciMarsRequest.merchant.partnerInformation[0].contactEmail = lead.personalInfoEmail || ''
  iciciMarsRequest.merchant.partnerInformation[0].name = lead.firstName || ''
  iciciMarsRequest.merchant.bankInformation.bankDetails.ifsc = lead.ifscCode || ''
  iciciMarsRequest.merchant.bankInformation.bankDetails.bankName = lead.bankName || ''
  iciciMarsRequest.merchant.bankInformation.bankDetails.branchName = lead.branchName || ''
  iciciMarsRequest.merchant.bankInformation.bankDetails.branchCode = lead.branchCode || ''
  iciciMarsRequest.merchant.bankInformation.bankDetails.branchZone = lead.branchZone || ''
  iciciMarsRequest.merchant.bankInformation.collectionDetails.chequeNumber = lead.chequeNumber || lead.utrNumber || ''
  iciciMarsRequest.merchant.bankInformation.collectionDetails.neftId = lead.neftId || ''
  iciciMarsRequest.merchant.remarks = lead.satToMarsRemarks || ''
  iciciMarsRequest.merchant.bankInformation.collectionDetails.chequeAmount = lead.amountCollected || ''
  iciciMarsRequest.merchant.bankInformation.collectionDetails.acquirerBank = lead.paymentBankName || ''
}

const fetchAndCookDocuments = () => {
  iciciMarsRequest.merchant.kyc.documents = []
  
  const leadData = propLeadDeatils.value
  
  // Process uploaded documents
  if (leadData?.qrLeadDocuments) {
    leadData.qrLeadDocuments.forEach(oo => {
      if (oo.uploadedDocuments?.length > 0) {
        const assumeArr = oo.uploadedDocuments.map(
          doc => `${GLOBAL_FILE_FETCH_URL.value}/${doc.fileName}`
        )
        iciciMarsRequest.merchant.kyc.documents.push({
          documentName: oo.subDocumentType || '',
          documentType: oo.marsDocumentId || 0,
          documentImage: assumeArr
        })
      }
    })
  }
  
  // Add Agreement document
  if (leadData?.aggrementForm) {
    iciciMarsRequest.merchant.kyc.documents.push({
      documentName: 'Agreement',
      documentType: leadData.qrMerchantType?.marsAgreementId || 0,
      documentImage: [`${GLOBAL_FILE_FETCH_URL.value}/${leadData.aggrementForm}`]
    })
  }
  
  // Add Cheque document based on merchant type
  const merchantTypeName = leadData?.qrMerchantType?.merchantTypeName
  const chequeDocumentTypeMap = {
    'Individuals': 7,
    'Sole Proprietorship': 33,
    'Partnership / LLP': 45,
    'Public & Private': 73,
    'Society': 88,
    'Trust': 104,
    'Private & Public': 138,
    'GOVT': 161
  }
  
  if (leadData?.chequeLeafForm && merchantTypeName) {
    const documentType = chequeDocumentTypeMap[merchantTypeName] || 33
    iciciMarsRequest.merchant.kyc.documents.push({
      documentName: 'Cheque',
      documentType: documentType,
      documentImage: [`${GLOBAL_FILE_FETCH_URL.value}/${leadData.chequeLeafForm}`]
    })
  }
  
  // Check document verification status
  if (leadData?.qrLeadDocuments) {
    leadData.qrLeadDocuments.forEach(val => {
      if (val.documentVerifiedStatus != 1) {
        flag.value = true
      } else {
        flag.value = false
      }
    })
  }
  
  setMarsData(formData)
}

// Numeric input handlers for business hours
const nameKeydownhoursWeekdayStart = (e) => {
  const value = formData.qrShortLead?.hoursWeekdayStart || ''
  handleNumericKeydown(e, value)
}

const handleNumericInputhoursWeekdayStart = (value) => {
  formData.qrShortLead.hoursWeekdayStart = handleNumericInput(value)
}

const nameKeydownhoursWeekdayEnd = (e) => {
  const value = formData.qrShortLead?.hoursWeekdayEnd || ''
  handleNumericKeydown(e, value)
}

const handleNumericInputhoursWeekdayEnd = (value) => {
  formData.qrShortLead.hoursWeekdayEnd = handleNumericInput(value)
}

const nameKeydownhoursWeekendStart = (e) => {
  const value = formData.qrShortLead?.hoursWeekendStart || ''
  handleNumericKeydown(e, value)
}

const handleNumericInputhoursWeekendStart = (value) => {
  formData.qrShortLead.hoursWeekendStart = handleNumericInput(value)
}

const nameKeydownhoursWeekendEnd = (e) => {
  const value = formData.qrShortLead?.hoursWeekendEnd || ''
  handleNumericKeydown(e, value)
}

const handleNumericInputhoursWeekendEnd = (value) => {
  formData.qrShortLead.hoursWeekendEnd = handleNumericInput(value)
}

const handleNumericKeydown = (e, value) => {
  const allowedKeys = [
    'Backspace', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 
    'ArrowRight', 'Home', 'End', 'Delete'
  ]
  
  if (
    allowedKeys.includes(e.key) ||
    (e.key === '.' && !value.includes('.')) ||
    ((e.ctrlKey === true || e.metaKey === true) &&
      ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) ||
    (e.key >= '0' && e.key <= '9') ||
    (e.key >= 'Numpad0' && e.key <= 'Numpad9')
  ) {
    const dotIndex = value.indexOf('.')
    if (dotIndex !== -1 && e.key !== 'Backspace' && e.key !== 'Delete') {
      const decimals = value.substring(dotIndex + 1)
      if (decimals.length >= 2 && value.length - dotIndex <= 3) {
        e.preventDefault()
        return
      }
    }
    return
  }
  
  e.preventDefault()
}

const handleNumericInput = (value) => {
  const formattedValue = value
    .replace(/[^0-9.]/g, '')
    .replace(/(\..*)\./g, '$1')
  
  const parts = formattedValue.split('.')
  let integerPart = parts[0] || ''
  let decimalPart = parts[1] || ''
  
  if (integerPart.length > 2) {
    integerPart = integerPart.slice(0, 2)
  }
  
  if (decimalPart.length > 2) {
    decimalPart = decimalPart.slice(0, 2)
  }
  
  return integerPart + (decimalPart ? '.' + decimalPart : '')
}

// Lifecycle hooks
onMounted(() => {
  console.log('Child mounted')
  ajaxQrLoadShortLeadInfoInitialLoad()
  
  // Initialize dropdowns
  getstate()
  getMerchantType()
  getMerchantCategory()
  getrentalplan()
  getSalesPerson()
  getmccNameCode()
  getcityNameCode()
  getstateNameCode()
})

// Export for template
defineExpose({
  loadUpdate,
  fnReassignData,
  fnToggleQrRejectLeadComp,
  proceedToMars,
  documentValidation,
  savePartialAndEnableProceed,
  referBackAndEnableProceed,
  onBlur,
  validateName,
  nameKeydown,
  nameKeydownacc,
  handleInput,
  handlelegalname,
  handlemarketing,
  validateStateInput,
  validatePersonalStateInput,
  validateCityInput,
  validatePersonalCityInput,
  validateMCCInput,
  validatePincode,
  validatePin,
  houseSelected,
  saveFieldData,
  nameKeydownhoursWeekdayStart,
  handleNumericInputhoursWeekdayStart,
  nameKeydownhoursWeekdayEnd,
  handleNumericInputhoursWeekdayEnd,
  nameKeydownhoursWeekendStart,
  handleNumericInputhoursWeekendStart,
  nameKeydownhoursWeekendEnd,
  handleNumericInputhoursWeekendEnd,
  filterSalesPerson,
  filterRentalPlans
})
</script>

<style scoped>
.error-highlight {
  background-color: #ffffff;
  color: red;
}
.remarksbtn {
  width: 84px;
}
.alignbtn {
  margin-right: 313px;
}
.description-header,
.description-cell {
  font-size: smaller;
  padding-right: 197px;
}
.description-header1,
.description-cell {
  font-size: smaller;
  padding-right: 181px;
}
.description-header2,
.description-cell {
  font-size: smaller;
}
.description-header {
  padding-right: 100px;
}
.mdr-header {
  color: rgb(19, 18, 18);
  white-space: nowrap;
}
.error-tooltip {
  position: absolute;
  top: 10%;
  left: 100%;
  background: #d32f2f;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  margin-top: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
}

.error-tooltip::before {
  content: "";
  position: absolute;
  top: -5px;
  left: 10px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent red transparent;
}
</style>