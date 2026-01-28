<template>
  <div>
    <div class="row items-center">
      <div
        class="col-12 bottom-border q-py-md"
        v-for="(key, index) in Object.keys(propLeadDeatils.leadDocuments)"
        :key="index"
      >
        <div class="row group items-center">
          <div class="col-auto">
            <span class="text-purple-9 text-weight-bold border-1 q-pa-sm">
              {{ index + 1 }}
            </span>
          </div>

          <div
            class="col-10"
            v-for="(item, subIndex) in propLeadDeatils.leadDocuments[key]"
            :key="subIndex"
          >
            <div class="row">
              <div class="col-4 q-body-1">Document</div>
              <div
                class="col-8 q-body-1 text-weight-bold text-negative"
                v-if="!item.documentType"
              >
                NA
              </div>
              <div class="col-8 q-body-1" v-else>
                {{ item.documentType }}
              </div>
            </div>

            <div class="row">
              <div class="col-4 q-body-1">Sub document</div>
              <div
                class="col-8 q-body-1 text-weight-bold text-negative"
                v-if="!item.subDocumentType"
              >
                NA
              </div>
              <div
                class="col-8 q-body-1 text-weight-bold text-positive"
                v-else
              >
                {{ item.subDocumentType }}
              </div>
            </div>

            <div class="row">
              <div class="col-12" v-if="item.uploadedDocuments.length > 0">
                <div
                  class="q-caption"
                  v-for="(document, documentIndex) in item.uploadedDocuments"
                  :key="documentIndex"
                >
                  {{ document.fileName }}
                </div>
              </div>

              <div class="q-caption" v-else>
                <div class="text-weight-bold text-negative">
                  No document available
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row group q-py-md items-center">
      <div class="col-6">
        <q-input
          color="grey-9"
          v-model="leadDataEntryRemarks"
          label="Remarks"
          placeholder="Remarks"
        />
      </div>

      <div class="col-6">
        <p class="q-ma-0">Hold payment?</p>
        <q-radio color="grey-9" v-model="holdPayment" :val="1" label="Yes" />
        <q-radio color="grey-9" v-model="holdPayment" :val="0" label="No" />
      </div>
    </div>

    <q-stepper-navigation>
      <q-btn
        color="primary"
        class="q-ma-xs"
        icon="check"
        label="Submit"
        @click="validate"
      />
      <q-btn
        color="amber-10"
        class="q-ma-xs"
        icon="save"
        label="Save Partial"
        @click="$emit('saveData', 'kyc', merchant)"
      />
      <q-btn
        color="grey-7"
        class="q-ma-xs"
        icon="block"
        label="Back"
        @click="$emit('goBack')"
      />
    </q-stepper-navigation>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useStore } from 'vuex'

/* PROPS */
const props = defineProps({
  propLeadDeatils: {
    type: Object,
    required: true
  },
  kyc: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['submit', 'saveData', 'goBack'])

const store = useStore()

/* STATE */
const holdPayment = ref('')
const leadDataEntryRemarks = ref('')

/* DEEP COPY – SAME AS OLD BEHAVIOR */
const merchant = reactive({
  kyc: JSON.parse(JSON.stringify(props.kyc))
})

/* GETTERS (Vuex 4 compatible) */
const GLOBAL_FILE_FETCH_URL =
  store.getters['GlobalVariables/GLOBAL_FILE_FETCH_URL']

/* METHODS */
const structureDocumentsInArray = () => {
  merchant.kyc.documents = []

  // Agreement document
  merchant.kyc.documents.push({
    documentName: 'Agreement',
    documentType: props.propLeadDeatils.merchantType.marsAgreementId,
    documentImage: [
      `${GLOBAL_FILE_FETCH_URL}/${props.propLeadDeatils.applicationFile}`
    ]
  })

  // Uploaded documents
  Object.keys(props.propLeadDeatils.leadDocuments).forEach(key => {
    props.propLeadDeatils.leadDocuments[key].forEach(item => {
      if (item.uploadedDocuments?.length > 0) {
        const images = item.uploadedDocuments.map(
          doc => `${GLOBAL_FILE_FETCH_URL}/${doc.fileName}`
        )

        merchant.kyc.documents.push({
          documentName: item.subDocumentType,
          documentType: item.marsDocumentId,
          documentImage: images
        })
      }
    })
  })
}

const validate = () => {
  emit('submit', 'kyc', merchant)
}

/* LIFECYCLE */
onMounted(() => {
  structureDocumentsInArray()
})
</script>
<style scoped>
</style>
