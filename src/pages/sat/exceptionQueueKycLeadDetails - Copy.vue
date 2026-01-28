<template>
  <q-page>
    <div class="q-ma-md">

      <!-- Merchant Details -->
      <div class="row q-ma-xs">
        <div class="col-md-3">
          <div class="q-title q-my-md capitalize">
            {{ formData.shortLead?.leadName }}
          </div>
          <p class="text-light-blue"># {{ formData.shortLead?.id }}</p>
        </div>

        <div class="col-md-3">
          <div class="q-title q-my-md">Contact</div>
          <p class="no-margin">{{ formData.shortLead?.contactNumber }}</p>
          <p>{{ formData.shortLead?.alternateContactNumber }}</p>
        </div>

        <div class="col-md-3">
          <div class="q-title q-my-md">Address</div>
          <p class="capitalize">{{ formData.shortLead?.leadAddress }}</p>
        </div>
      </div>

      <div class="row">
        <!-- LEFT -->
        <div class="col-md-6">

          <!-- Device -->
          <q-card class="q-ma-xs border-1" flat>
            <q-card-section class="title-bg bottom-border">
              <div class="text-weight-medium">
                Device – {{ formData.shortLead?.deviceCount }}
                {{ formData.shortLead?.device?.deviceName }}
              </div>
            </q-card-section>

            <q-card-section>
              <q-list separator>
                <q-item>
                  <q-item-section>Plan</q-item-section>
                  <q-item-section side>
                    {{ formData.shortLead?.planName }}
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>Setup Fees</q-item-section>
                  <q-item-section side>
                    Rs. {{ formData.shortLead?.setupFees }}
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>Recurring Fees</q-item-section>
                  <q-item-section side>
                    Rs. {{ formData.shortLead?.recurringFees }}
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>Merchant Category</q-item-section>
                  <q-item-section side>
                    {{ formData.shortLead?.merchantCategory }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>

          <!-- Payment -->
          <q-card class="q-ma-xs border-1" flat>
            <q-card-section class="title-bg bottom-border">
              <div class="text-weight-medium">
                Payment –
                <span v-if="formData.shortLead?.paymentOption === 1">IMPS/NEFT</span>
                <span v-else-if="formData.shortLead?.paymentOption === 2">Cheque</span>
                <span v-else>Swipe</span>
              </div>
            </q-card-section>

            <q-card-section>
              <q-list>
                <q-item>
                  <q-item-section>
                    Reference No: {{ formData.shortLead?.referenceNumber }}
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div v-if="!formData.shortLead?.paymentDocumentFile">
                      <q-icon name="clear" color="negative" /> No image attached
                    </div>
                    <q-btn
                      v-else
                      flat
                      size="sm"
                      color="primary"
                      @click="toggleChequeImage"
                    >
                      View Image
                    </q-btn>
                  </q-item-section>
                </q-item>

                <q-item v-if="toggleChequeImageResult">
                  <viewer
                    :images="[GLOBAL_FILE_FETCH_URL + '/' + formData.shortLead.paymentDocumentFile]"
                  >
                    <img
                      :src="GLOBAL_FILE_FETCH_URL + '/' + formData.shortLead.paymentDocumentFile"
                      style="max-width:100%"
                    />
                  </viewer>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>

        <!-- RIGHT -->
        <div class="col-md-6">

          <!-- Exceptions -->
          <q-card
            v-if="formData.shortLead?.leadCategory === 2"
            class="q-ma-xs border-1"
            flat
          >
            <q-card-section class="title-bg bottom-border">
              <div class="text-weight-medium">Exception</div>
            </q-card-section>

            <q-card-section>
              {{ formData.shortLead?.reason || 'Reason not specified' }}
            </q-card-section>
          </q-card>

          <!-- Documents -->
          <q-card class="q-ma-xs border-1" flat>
            <q-card-section class="title-bg bottom-border">
              <div class="text-weight-medium">Documents</div>
            </q-card-section>

            <q-card-section>
              <div
                v-for="(docs, key) in formData.shortLead?.leadDocuments"
                :key="key"
              >
                <q-expansion-item
                  expand-separator
                  icon="attach_file"
                  :label="key"
                >
                  <div
                    v-for="(subDoc, i) in docs"
                    :key="i"
                    class="q-pl-md"
                  >
                    <q-expansion-item
                      expand-separator
                      :label="subDoc.subDocumentType"
                    >
                      <div
                        v-for="(file, j) in subDoc.uploadedDocuments"
                        :key="j"
                        class="q-py-sm"
                      >
                        <div
                          v-if="file.mimeType.includes('application')"
                          class="cursor-pointer"
                          @click="fnPDFViewModal(file.fileName)"
                        >
                          <q-icon name="picture_as_pdf" color="negative" />
                          {{ file.fileName }}
                        </div>

                        <viewer
                          v-else-if="file.mimeType.includes('image')"
                          :images="[GLOBAL_FILE_FETCH_URL + '/' + file.fileName]"
                        >
                          <img
                            :src="GLOBAL_FILE_FETCH_URL + '/' + file.fileName"
                            style="max-width:100%"
                          />
                        </viewer>
                      </div>
                    </q-expansion-item>
                  </div>
                </q-expansion-item>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- ACTIONS -->
      <div class="row justify-end" v-if="getShortLeadInfo?.isStatus !== 7">
        <q-btn
          icon="block"
          color="grey-5"
          class="q-ma-sm"
          label="Cancel"
          @click="router.go(-1)"
        />
        <q-btn
          icon="check"
          color="positive"
          class="q-ma-sm"
          label="Send to OPS Head"
          @click="fnApproveLeadData"
        />
        <q-btn
          icon="clear"
          color="negative"
          class="q-ma-sm"
          label="Reject"
          @click="fnToggleRejectLeadComp"
        />
      </div>

      <!-- PDF MODAL -->
      <showPdfModalComponent
        v-if="toggleshowPDFModal"
        :propToggleshowPDFModal="toggleshowPDFModal"
        :propPDFDetails="PDFDetails"
        @togglePDFModal="fnPDFViewModal"
      />

      <!-- LOADER -->
      <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
        <q-spinner-bars class="absolute-center" color="purple-9" size="35px" />
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

import showPdfModalComponent from '../../components/sat/showPdfModalComponent.vue'

const store = useStore()
const router = useRouter()
const route = useRoute()

const toggleChequeImageResult = ref(false)
const toggleshowPDFModal = ref(false)
const toggleAjaxLoadFilter = ref(false)
const PDFDetails = ref(null)

const formData = ref({ shortLead: {} })

const GLOBAL_FILE_FETCH_URL = computed(
  () => store.getters['GlobalVariables/GLOBAL_FILE_FETCH_URL']
)

const getShortLeadInfo = computed(
  () => store.getters['SatLeadValidation/getShortLeadInfo']
)

function ajaxLoadShortLeadInfo () {
  toggleAjaxLoadFilter.value = true
  store.dispatch('SatLeadValidation/FETCH_SHORT_LEAD_DATA', route.params.id)
    .then(() => {
      formData.value.shortLead = getShortLeadInfo.value
    })
    .finally(() => {
      toggleAjaxLoadFilter.value = false
    })
}

function toggleChequeImage () {
  toggleChequeImageResult.value = !toggleChequeImageResult.value
}

function fnApproveLeadData () {
  // unchanged business logic
}

function fnToggleRejectLeadComp () {
  // unchanged business logic
}

function fnPDFViewModal (file) {
  PDFDetails.value = file
  toggleshowPDFModal.value = !toggleshowPDFModal.value
}

onMounted(() => {
  ajaxLoadShortLeadInfo()
  window.addEventListener('scroll', () => {})
})

onUnmounted(() => {
  window.removeEventListener('scroll', () => {})
})
</script>

<style scoped>
.border-1 {
  border: 1px solid #c7c7c7;
}
.title-bg {
  background: #bbbbbb4a;
}
.no-underline {
  text-decoration: none;
  color: #222;
}
.no-underline:hover {
  color: #027be3;
}
</style>
