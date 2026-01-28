<template>
  <div>
    <q-dialog v-model="toggleModel" @hide="emitfnshowConvertToSat()">
      <q-card style="min-width: 40vw; padding: 50px">
        <form>
          <div class="column group">
            <div class="col-md-12">
              <div class="text-h6 text-weight-regular">Approve the Lead</div>
            </div>

            <div class="col-md-12 q-mt-md">
              <q-input 
                disable 
                @keyup.enter="submitShortLead(merchant)"
                v-model="data.data"
                class="text-weight-regular text-grey-8" 
                color="grey-9" 
                label="leadId"
                placeholder="leadId" 
              />
            </div>
            
            <div class="col-md-12 q-mt-md">
              <q-input 
                disable 
                v-model="merchant.paymentDetails.deviceSerialNumber" 
                class="no-margin"
                label="Serial Number" 
              />
            </div>
            
            <div class="col-md-12 group q-mt-md" align="right">
              <q-btn 
                flat 
                align="right" 
                class="bg-white text-weight-regular text-grey-8"
                @click="emitfnshowConvertToSat()"
              >
                Cancel
              </q-btn>
              <q-btn 
                align="right" 
                @click="submitShortLead(merchant)" 
                color="purple-9"
              >
                Submit
              </q-btn>
            </div>
          </div>
        </form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const store = useStore()

const props = defineProps({
  propShowConvertToSat: Boolean,
  propRowDetails: Object
})

const emit = defineEmits(['emitfnshowConvertToSat'])

const toggleModel = ref(props.propShowConvertToSat)
const tid = ref('')


const merchant = ref({
  salesInformation: {
    institutionCode: "",
  },
  kyc: {
    documents: [],
  },
  paymentDetails: {
    settlementType: "",
    tipEnabled: "",
    cashAtPosEnabled: "",
    intlCardAcceptance: "",
    preAuth: "",
    rentalPlanCode: "",
    deviceSerialNumber: getDeviceSerialNumber(),
    installationDate: "",
    deinstallationDate: "",
  },
})

const data = ref({
  data: props.propRowDetails.leadInformation.id,
})

function getDeviceSerialNumber() {
  if (
    props.propRowDetails &&
    props.propRowDetails.leadInformation &&
    props.propRowDetails.leadInformation.leadSource &&
    props.propRowDetails.leadInformation.leadSource.sourceName === "LS_TOHANDS"
  ) {
    return props.propRowDetails.toHandsSerialNumber
      ? props.propRowDetails.toHandsSerialNumber
      : "NA"
  } else if (
    props.propRowDetails &&
    props.propRowDetails.regionalInventory &&
    props.propRowDetails.regionalInventory.serialNumber
  ) {
    return props.propRowDetails.regionalInventory.serialNumber
  } else if (
    props.propRowDetails &&
    props.propRowDetails.aggregatorRegionalInventory &&
    props.propRowDetails.aggregatorRegionalInventory.serialNumber
  ) {
    return props.propRowDetails.aggregatorRegionalInventory.serialNumber
  }
  return "NA"
}

// Computed properties
const GLOBAL_FILE_FETCH_URL = computed(() => 
  store.getters['GlobalVariables/GLOBAL_FILE_FETCH_URL']
)
const getAllMarsData = computed(() => 
  store.getters['GetMarsData/getAllMarsData']
)

onMounted(() => {
  console.log("Hello world")
  $q.loading.show({
    delay: 100,
    spinnerColor: "purple-9",
    message: "Fetching Data..",
  })

  store.dispatch('GetMarsData/FETCH_MARS_DATA', props.propRowDetails.leadInformation.id)
    .then(() => {
      $q.loading.hide()
    })
    .catch(() => {
      $q.loading.hide()
    })

  // Add documents
  merchant.value.kyc.documents.push({
    documentName: "CPF form",
    documentType: 148,
    documentImage: [
      GLOBAL_FILE_FETCH_URL.value + "/" + props.propRowDetails.cpvForm,
    ],
  })
  
  merchant.value.kyc.documents.push({
    documentName: "Implementation form",
    documentType: 147,
    documentImage: [
      GLOBAL_FILE_FETCH_URL.value + "/" + props.propRowDetails.implementationForm,
    ],
  })
  
  merchant.value.kyc.documents.push({
    documentName: "Photo of the shop",
    documentType: 146,
    documentImage: [
      GLOBAL_FILE_FETCH_URL.value + "/" + props.propRowDetails.pictureOfShop,
    ],
  })
})

watch(() => props.propShowConvertToSat, (newVal) => {
  toggleModel.value = newVal
})

// Methods
function emitfnshowConvertToSat() {
  emit('emitfnshowConvertToSat')
}

async function submitShortLead(request) {
  $q.loading.show({
    delay: 100,
    spinnerColor: "purple-9",
    message: "Please wait..",
  })

  try {
    if (
      props.propRowDetails &&
      props.propRowDetails.leadInformation &&
      props.propRowDetails.leadInformation.leadSource &&
      props.propRowDetails.leadInformation.leadSource.sourceName === 'LS_Wowpe'
    ) {
      await store.dispatch('DocumentApprove/DOCUMENT_APPROVE', props.propRowDetails.id)
      $q.loading.hide()
      emitfnshowConvertToSat()
      $q.notify({
        color: "positive",
        position: "bottom",
        message: "Terminal Details Successfully Updated",
        icon: "thumb_up",
      })
    } else {
      const key = getAllMarsData.value.salesInformation.institutionCode
      $q.localStorage.set("a_t", key)

      tid.value = props.propRowDetails.leadInformation.leadSource.multiTidEnabled 
        ? props.propRowDetails.subTidOfDbs
        : props.propRowDetails.tid

      const terminalparams = {
        terminal: {
          id: tid.value,
        },
        terminalparams: {
          merchant: {
            companyInformation: {
              applicationNumber: getAllMarsData.value.salesInformation.applicationNumber,
            },
            paymentDetails: {
              deviceSerialNumber: request.paymentDetails.deviceSerialNumber,
              installationDate: request.paymentDetails.installationDate,
              deinstallationDate: request.paymentDetails.deinstallationDate,
            },
            kyc: request.kyc,
          },
        },
        data: props.propRowDetails
      }

      await store.dispatch('CMS_EDIT_MDR/CMS_EDIT_TERMINAL_DEVICE', terminalparams)
      await store.dispatch('DocumentApprove/DOCUMENT_APPROVE', props.propRowDetails.id)
      
      $q.loading.hide()
      emitfnshowConvertToSat()
      $q.notify({
        color: "positive",
        position: "bottom",
        message: "Terminal Details Successfully Updated",
        icon: "thumb_up",
      })
    }
  } catch (error) {
    $q.loading.hide()
    console.error(error)
    $q.notify({
      color: "negative",
      position: "bottom",
      icon: "thumb_down",
      message: error.data?.message || "An error occurred",
    })
  }
}
</script>

<style scoped>
.customModalOverlay {
  /* Keep existing styles if needed */
}
</style>