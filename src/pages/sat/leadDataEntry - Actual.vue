<template>
  <q-page>
    <div class="q-ma-md">

      <!-- Header -->
      <div class="row q-mb-md">
        <div class="col-md-3">
          <div class="text-h6 capitalize">{{ formData.shortLead.leadName }}</div>
          <div class="text-primary"># {{ formData.shortLead.leadNumber }}</div>
        </div>

        <div class="col-md-3">
          <div class="text-h6">Contact</div>
          <div>{{ formData.shortLead.contactNumber }}</div>
          <div>{{ formData.shortLead.alternateContactNumber }}</div>
        </div>

        <div class="col-md-6">
          <div class="text-h6">Address</div>
          <div v-if="formData.shortLead.leadAddress">
            {{ formData.shortLead.leadAddress }}
          </div>
          <div>
            {{ formData.shortLead.city }}, {{ formData.shortLead.state }}
          </div>
        </div>
      </div>

      <q-list bordered>

        <!-- Merchant Details -->
        <q-expansion-item
          icon="info"
          label="Merchant details"
          caption="Device, Exceptions, Payment, MDR"
          default-opened
        >
          <div class="row q-col-gutter-md">

            <!-- Device -->
            <div class="col-md-3">
              <q-card flat bordered>
                <q-card-section class="bg-grey-4 text-weight-medium">
                  Device – {{ formData.shortLead.deviceCount }}
                  {{ formData.shortLead.device?.deviceName }}
                </q-card-section>

                <q-card-section>
                  <q-list dense>
                    <q-item>
                      <q-item-section>Plan</q-item-section>
                      <q-item-section side>
                        {{ formData.shortLead.plan?.planName }}
                      </q-item-section>
                    </q-item>

                    <q-item>
                      <q-item-section>Setup Fees</q-item-section>
                      <q-item-section side>
                        ₹ {{ formData.shortLead.setupFees }}
                      </q-item-section>
                    </q-item>

                    <q-item>
                      <q-item-section>Recurring Fees</q-item-section>
                      <q-item-section side>
                        ₹ {{ formData.shortLead.recurringFees }}
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>

            <!-- Payment -->
            <div class="col-md-3">
              <q-card flat bordered>
                <q-card-section class="bg-grey-4 text-weight-medium">
                  Payment
                </q-card-section>

                <q-card-section>
                  <q-list dense>
                    <q-item>
                      <q-item-section>Payment Mode</q-item-section>
                      <q-item-section side>
                        {{ paymentMode }}
                      </q-item-section>
                    </q-item>

                    <q-item>
                      <q-item-section>Reference</q-item-section>
                      <q-item-section side>
                        {{ formData.shortLead.referenceNumber || 'NA' }}
                      </q-item-section>
                    </q-item>
                  </q-list>

                  <q-btn
                    v-if="formData.shortLead.paymentDocumentFile"
                    label="View Document"
                    icon="attach_file"
                    size="sm"
                    flat
                    @click="fnPDFViewModal(formData.shortLead.paymentDocumentFile)"
                  />
                </q-card-section>
              </q-card>
            </div>

            <!-- MDR -->
            <div class="col-md-6">
              <q-card flat bordered>
                <q-card-section class="bg-grey-4 text-weight-medium">
                  MDR
                </q-card-section>

                <q-card-section>
                  <q-list dense>
                    <q-item>
                      <q-item-section>Debit ≤ 2000</q-item-section>
                      <q-item-section side>
                        {{ formData.shortLead.debitLessthanAmount }}%
                      </q-item-section>
                    </q-item>

                    <q-item>
                      <q-item-section>Debit > 2000</q-item-section>
                      <q-item-section side>
                        {{ formData.shortLead.debitGreaterthanAmount }}%
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>

          </div>
        </q-expansion-item>

        <!-- Documents -->
        <q-expansion-item
          icon="file_copy"
          label="Documents"
          caption="Related documents"
        >
          <showMarsForm :propLeadDeatils="formData.shortLead" />
        </q-expansion-item>

      </q-list>

      <!-- PDF Modal -->
      <showPdfModalComponent
        v-if="toggleshowPDFModal"
        :propPDFDetails="PDFDetails"
        @togglePDFModal="fnPDFViewModal"
      />

    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'

import showPdfModalComponent from '../../components/sat/showPdfModalComponent.vue'
import showMarsForm from '../../components/sat/showMarsFormComponent.vue'

const store = useStore()
const { proxy } = getCurrentInstance()

const formData = ref({ shortLead: {} })
const toggleshowPDFModal = ref(false)
const PDFDetails = ref(null)


const paymentMode = computed(() => {
  const opt = formData.value.shortLead.paymentOption
  return opt === 1 ? 'IMPS / NEFT' : opt === 2 ? 'Cheque' : 'Swipe'
})

const ajaxLoadLeadDataEntryInfo = async () => {
  await store.dispatch(
    'SatLeadValidation/FETCH_SHORT_LEAD_DATA',
    proxy.$route.params.id
  )
  formData.value.shortLead =
    store.getters['SatLeadValidation/getShortLeadInfo']
}

const fnPDFViewModal = (file) => {
  PDFDetails.value = file
  toggleshowPDFModal.value = !toggleshowPDFModal.value
}

onMounted(ajaxLoadLeadDataEntryInfo)
</script>

<style scoped>
.border-1 {
  border: 1px solid #afafaf;
}
</style>
