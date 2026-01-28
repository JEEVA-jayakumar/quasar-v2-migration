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
              <q-item-label caption>SO Name</q-item-label>
              <q-item-label>
                {{ propLeadInformation.createdBy?.name || 'NA' }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>Merchant Name</q-item-label>
              <q-item-label>{{ propLeadInformation.merchantName }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-if="propLeadInformation.leadSource">
            <q-item-section>
              <q-item-label caption>Source</q-item-label>
              <q-item-label>{{ propLeadInformation.leadSource.sourceName }}</q-item-label>
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
              <q-item-label caption>Contact Email</q-item-label>
              <q-item-label>{{ propLeadInformation.contactEmail || 'NA' }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>Address</q-item-label>
              <q-item-label>
                {{ propLeadInformation.contactAddress }},
                {{ propLeadInformation.city }},
                {{ propLeadInformation.state }},
                {{ propLeadInformation.pincode }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-if="propLeadInformation.device">
            <q-item-section>
              <q-item-label caption>Device Type</q-item-label>
              <q-item-label>{{ propLeadInformation.device.deviceName }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>Plan</q-item-label>
              <q-item-label>{{ propLeadInformation.plan?.planName || 'NA' }}</q-item-label>
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

          <q-item v-if="propLeadInformation.qrMerchantType">
            <q-item-section>
              <q-item-label caption>Merchant Type</q-item-label>
              <q-item-label>
                {{ propLeadInformation.qrMerchantType.qrMerchantType }}
              </q-item-label>
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
  QrleadInformation: { type: Object, required: true },
  propToggleQrLeadInformationPop: { type: Boolean, required: true }
})

const emit = defineEmits(['closeLeadInformation'])

const $q = useQuasar()
const store = useStore()

const opened = ref(props.propToggleQrLeadInformationPop)
const propLeadInformation = ref({})

watch(
  () => props.propToggleQrLeadInformationPop,
  val => (opened.value = val)
)

onMounted(fetchLeadInfo)

function fetchLeadInfo () {
  $q.loading.show({
    spinnerColor: 'purple-9',
    message: 'Fetching data ..'
  })

  store.dispatch(
    'iciciStaticQr/FETCH_STATIC_QR_SHORT_LEAD_DATA',
    props.QrleadInformation.leadId || props.QrleadInformation.id
  )
    .then(() => {
      propLeadInformation.value =
        store.getters['iciciStaticQr/getAllStaticQrShortLeadDatas']
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
