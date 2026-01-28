<template>
  <q-dialog v-model="opened" persistent>
    <q-card class="q-pa-md" style="min-width: 30vw">

      <!-- Header -->
      <div class="row items-center bottom-border q-py-sm">
        <div class="col text-weight-medium">Lead Information</div>
        <div class="col-auto">
          <q-btn
            round
            size="sm"
            outline
            color="dark"
            icon="close"
            @click="emitToggleRemarks"
          />
        </div>
      </div>

      <!-- Content -->
      <q-scroll-area style="width: 400px; height: 375px;">
        <q-list bordered separator class="q-mt-sm">

          <q-item>
            <q-item-section>
              <q-item-label caption>Category</q-item-label>
              <q-item-label>
                {{
                  propLeadInformation.leadCategory === 1
                    ? 'Normal'
                    : propLeadInformation.leadCategory === 2
                    ? 'Exception'
                    : 'NA'
                }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-if="propLeadInformation.leadCategory === 2">
            <q-item-section side v-if="propLeadInformation.kyc">
              <q-chip icon="warning" color="primary">KYC</q-chip>
            </q-item-section>
            <q-item-section side v-if="propLeadInformation.bankSubvention">
              <q-chip icon="warning" color="primary">Bank Subvention</q-chip>
            </q-item-section>
            <q-item-section side v-if="propLeadInformation.pricing">
              <q-chip icon="warning" color="primary">Pricing</q-chip>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>Document upload type</q-item-label>
              <q-item-label>
                {{ propLeadInformation.documentUploadedType === 1
                  ? 'Handover to SAT'
                  : 'Full document upload' }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>SO Name</q-item-label>
              <q-item-label>
                {{ propLeadInformation.assignedTo?.name || 'NA' }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>Merchant Name</q-item-label>
              <q-item-label>{{ propLeadInformation.leadName }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>Source</q-item-label>
              <q-item-label>
                {{ propLeadInformation.leadSource?.sourceName }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>Contact Name</q-item-label>
              <q-item-label>{{ propLeadInformation.contactName }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>Contact Number</q-item-label>
              <q-item-label>{{ propLeadInformation.contactNumber }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>Alternate Contact</q-item-label>
              <q-item-label>
                {{ propLeadInformation.alternateContactNumber || 'NA' }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>Email</q-item-label>
              <q-item-label>{{ propLeadInformation.email || 'NA' }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>Address</q-item-label>
              <q-item-label>
                {{ propLeadInformation.leadAddress }},
                {{ propLeadInformation.city }},
                {{ propLeadInformation.state }},
                {{ propLeadInformation.pincode }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>Device Count</q-item-label>
              <q-item-label>
                {{ propLeadInformation.device?.deviceName }} -
                {{ propLeadInformation.deviceCount }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>Plan</q-item-label>
              <q-item-label>
                {{ propLeadInformation.plan?.planName || 'NA' }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>Setup Fees</q-item-label>
              <q-item-label>Rs. {{ propLeadInformation.setupFees }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>Recurring Fees</q-item-label>
              <q-item-label>Rs. {{ propLeadInformation.recurringFees }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>Amount Collected</q-item-label>
              <q-item-label>Rs. {{ propLeadInformation.amountCollected }}</q-item-label>
            </q-item-section>
          </q-item>

        </q-list>
      </q-scroll-area>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'

const props = defineProps({
  leadInfo: { type: Object, required: true },
  propToggleLeadInformationPop: { type: Boolean, required: true }
})

const emit = defineEmits(['closeLeadInformation'])

const $q = useQuasar()
const store = useStore()

const opened = ref(props.propToggleLeadInformationPop)
const propLeadInformation = ref({})

watch(
  () => props.propToggleLeadInformationPop,
  val => (opened.value = val)
)

onMounted(fetchLeadInfo)

function fetchLeadInfo () {
  $q.loading.show({
    spinnerColor: 'purple-9',
    message: 'Fetching data ..'
  })

  store.dispatch(
    'SatLeadValidation/FETCH_SHORT_LEAD_DATA',
    props.leadInfo.leadId
  )
    .then(() => {
      propLeadInformation.value =
        store.getters['SatLeadValidation/getShortLeadInfo']
    })
    .finally(() => $q.loading.hide())
}

function emitToggleRemarks () {
  emit('closeLeadInformation')
}
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>
