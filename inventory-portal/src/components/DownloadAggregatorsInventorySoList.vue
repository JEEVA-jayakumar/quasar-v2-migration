<template>
  <q-dialog
    v-model="toggleModel"
    persistent
  >
    <q-card style="min-width: 40vw; padding: 30px">
      <q-card-section>
        <div class="text-h6 text-center">
          <strong>Download Aggregator Inventory With SO File</strong>
        </div>
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <q-input
          v-model="formData.fromDate"
          type="date"
          label="From Date"
          :min="yesterday"
          :max="tomorrow"
          outlined
        />

        <q-input
          v-model="formData.toDate"
          type="date"
          label="To Date"
          :min="yesterday"
          :max="tomorrow"
          outlined
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          class="text-grey-8"
          label="Cancel"
          @click="emitfnshowInventoryWithSo"
        />

        <q-btn
          color="purple-9"
          label="Download"
          :disabled="submitDisabled"
          @click="downloadInventoryWithSoList"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar, date as qDate } from 'quasar'
import { useStore } from 'vuex'

/* ------------------ PROPS & EMITS ------------------ */
const props = defineProps({
  propInventoryWithSo: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['emitfnshowInventoryWithSo'])

/* ------------------ QUASAR & STORE ------------------ */
const $q = useQuasar()
const store = useStore()

/* ------------------ DATE HANDLING ------------------ */
const today = new Date()
const tomorrow = qDate.formatDate(today, 'YYYY-MM-DD')
const yesterday = qDate.formatDate(
  qDate.subtractFromDate(today, { days: 720 }),
  'YYYY-MM-DD'
)

/* ------------------ STATE ------------------ */
const toggleModel = ref(props.propInventoryWithSo)

const formData = ref({
  fromDate: '',
  toDate: ''
})

/* ------------------ WATCH PROP ------------------ */
watch(
  () => props.propInventoryWithSo,
  val => {
    toggleModel.value = val
  }
)

/* ------------------ COMPUTED ------------------ */
const submitDisabled = computed(() => {
  return !(formData.value.fromDate || formData.value.toDate)
})

/* ------------------ METHODS ------------------ */
function emitfnshowInventoryWithSo () {
  emit('emitfnshowInventoryWithSo')
}

function toTimestamp (dateStr) {
  if (!dateStr) return null

  const todayStr = qDate.formatDate(new Date(), 'YYYY-MM-DD')
  return dateStr === todayStr
    ? Date.now()
    : Date.parse(dateStr)
}

async function downloadInventoryWithSoList () {
  const params = {
    fromDate: toTimestamp(formData.value.fromDate),
    toDate: toTimestamp(formData.value.toDate)
  }

  $q.loading.show({
    spinnerColor: 'purple-9',
    message: 'Please wait...'
  })

  try {
    await store.dispatch(
      'DownloadInventoryWithSoData/AGGREGATOR_INVENTORY_WITH_SO_ALL_DATAS',
      params
    )

    emitfnshowInventoryWithSo()

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Successfully Downloaded',
      icon: 'thumb_up'
    })
  } catch (error) {

    const status = error?.status

    let message = 'Please select the field'

    if (status === 400) {
      message = 'Output file size is high, select smaller date range'
    } else if (status === 500) {
      message = 'INTERNAL_SERVER_ERROR'
    } else if (status === 403 || status === 404) {
      message = 'Please choose some other date'
    }

    $q.notify({
      color: 'amber',
      position: 'bottom',
      message,
      icon: 'thumb_down'
    })
  } finally {
    $q.loading.hide()
    formData.value.fromDate = ''
    formData.value.toDate = ''
  }
}
</script>

<style scoped>
.text-h6 {
  font-weight: 500;
}
</style>
