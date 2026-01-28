<template>
  <q-page>
    <div class="q-ma-md">
      <!-- Lead Header -->
      <div class="row q-ma-xs">
        <div class="col-md-3">
          <div class="q-title q-my-md capitalize">
            {{ formData.shortLead?.leadName }}
          </div>
          <p class="text-light-blue">
            # {{ formData.shortLead?.id }}
          </p>
        </div>

        <div class="col-md-3">
          <div class="q-title q-my-md">Contact</div>
          <p class="no-margin">{{ formData.shortLead?.contactNumber }}</p>
          <p>{{ formData.shortLead?.alternateContactNumber }}</p>
        </div>

        <div class="col-md-3">
          <div class="q-title q-my-md">Address</div>
          <p class="capitalize">
            {{ formData.shortLead?.leadAddress }}
          </p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="row">
        <!-- LEFT SIDE -->
        <div class="col-md-6">
          <!-- Device -->
          <q-card class="q-ma-xs border-1" flat>
            <q-card-section class="title-bg bottom-border">
              <div class="text-weight-medium">
                Device –
                {{ formData.shortLead?.deviceCount }}
                {{ formData.shortLead?.device?.deviceName }}
              </div>
            </q-card-section>

            <q-card-section>
              <q-list separator>
                <q-item>
                  <q-item-section>Plan</q-item-section>
                  <q-item-section side>
                    {{ formData.shortLead?.plan?.planName }}
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
                    {{ formData.shortLead?.merchantCategory?.merchantCategoryName }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>

          <!-- Payment -->
          <q-card class="q-ma-xs border-1" flat>
            <q-card-section class="title-bg bottom-border">
              <div class="text-weight-medium">Payment</div>
            </q-card-section>

            <q-card-section>
              <q-list separator>
                <q-item>
                  <q-item-section>Mode of payment</q-item-section>
                  <q-item-section side>
                    <span v-if="formData.shortLead?.paymentOption === 1">IMPS/NEFT</span>
                    <span v-else-if="formData.shortLead?.paymentOption === 2">Cheque</span>
                    <span v-else-if="formData.shortLead?.paymentOption === 3">Swipe</span>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>Reference No</q-item-section>
                  <q-item-section side>
                    {{ formData.shortLead?.referenceNumber || 'NA' }}
                  </q-item-section>
                </q-item>

                <q-item v-if="formData.shortLead?.paymentOption === 2">
                  <q-btn
                    size="sm"
                    color="dark"
                    icon="attach_file"
                    label="View Document"
                    @click="fnPDFViewModal(formData.shortLead.paymentDocumentFile, 'CHEQUE')"
                  />
                </q-item>

                <q-item v-if="showOpenPaymentChequeInfo">
                  <img
                    :src="GLOBAL_FILE_FETCH_URL + '/' + formData.shortLead.paymentDocumentFile"
                    style="max-width:100%"
                  />
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>

        <!-- RIGHT SIDE -->
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
              <div class="q-caption">
                {{ formData.shortLead?.reason || 'Reason not specified' }}
              </div>
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
                  :caption="docs.length + ' Type(s)'"
                >
                  <div
                    v-for="(subDoc, i) in docs"
                    :key="i"
                    class="q-pl-md"
                  >
                    <q-expansion-item
                      expand-separator
                      icon="description"
                      :label="subDoc.subDocumentType"
                      :caption="subDoc.uploadedDocuments.length + ' Document(s)'"
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
                          {{ file.fileNameOriginal }}
                        </div>

                        <img
                          v-else-if="file.mimeType.includes('image')"
                          :src="GLOBAL_FILE_FETCH_URL + '/' + file.fileName"
                          style="max-width:100%"
                        />
                      </div>
                    </q-expansion-item>
                  </div>
                </q-expansion-item>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Actions -->
      <div class="row justify-end">
        <q-btn
          icon="block"
          color="grey-5"
          class="q-ma-sm"
          label="Cancel"
          @click="router.go(-1)"
        />
        <q-btn
          icon="cloud_upload"
          color="positive"
          class="q-ma-sm"
          label="Upload Document"
          @click="toggleUploadDocument"
        />
      </div>

      <!-- Upload Modal -->
      <ToggleUploadDocumentAndSubmit
        v-if="showUploadDocumentModal"
        :propLeadDetails="formData.shortLead"
        :propToggleUploadDocumentAndSubmit="showUploadDocumentModal"
        @toggleDocumentUploadAndFinalSubmit="toggleUploadDocument"
      />

      <!-- PDF Viewer -->
      <ShowPdfModalComponent
        v-if="toggleshowPDFModal"
        :propToggleshowPDFModal="toggleshowPDFModal"
        :propPDFDetails="PDFDetails"
        @togglePDFModal="fnPDFViewModal"
      />

      <!-- Loader -->
      <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
        <q-spinner-bars class="absolute-center" color="purple-9" size="35px" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

import ToggleUploadDocumentAndSubmit from '../../components/sat/toggleUploadDocumentAndSubmit.vue'
import ShowPdfModalComponent from '../../components/sat/showPdfModalComponent.vue'

const store = useStore()
const router = useRouter()
const route = useRoute()

const PDFDetails = ref(null)
const toggleshowPDFModal = ref(false)
const showUploadDocumentModal = ref(false) // Renamed to avoid conflict
const toggleAjaxLoadFilter = ref(false)
const showOpenPaymentChequeInfo = ref(false)

const formData = ref({ shortLead: {} })

const GLOBAL_FILE_FETCH_URL = computed(
  () => store.getters['GlobalVariables/GLOBAL_FILE_FETCH_URL']
)

function ajaxLoadShortLeadInfo () {
  toggleAjaxLoadFilter.value = true
  store.dispatch('SatLeadValidation/FETCH_SHORT_LEAD_DATA', route.params.id)
    .then(() => {
      formData.value.shortLead =
        store.getters['SatLeadValidation/getShortLeadInfo']
    })
    .finally(() => {
      toggleAjaxLoadFilter.value = false
    })
}

function fnPDFViewModal (file) {
  PDFDetails.value = file
  toggleshowPDFModal.value = !toggleshowPDFModal.value
}

function toggleUploadDocument () {
  showUploadDocumentModal.value = !showUploadDocumentModal.value
}

onMounted(() => {
  ajaxLoadShortLeadInfo()
})
</script>

<style scoped>
.border-1 {
  border: 1px solid #c7c7c7;
}
.title-bg {
  background: #bbbbbb4a;
}
</style>