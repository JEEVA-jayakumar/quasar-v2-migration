<template>
  <q-dialog
    v-model="toggleModel"
    persistent
  >
    <q-card style="min-width: 40vw; padding: 30px">
      <!-- TITLE -->
      <q-card-section>
        <div class="text-h6 text-center text-weight-regular">
          <strong>Download Aggregator Lost Or Stolen File</strong>
        </div>
      </q-card-section>

      <!-- FORM -->
      <q-card-section class="q-gutter-md">
        <q-input
          v-model="formData.from"
          type="date"
          label="From Date"
          :min="yesterday"
          :max="tomorrow"
          outlined
        />

        <q-input
          v-model="formData.to"
          type="date"
          label="To Date"
          :min="yesterday"
          :max="tomorrow"
          outlined
        />
      </q-card-section>

      <!-- ACTIONS -->
      <q-card-actions align="right">
        <q-btn
          flat
          class="text-grey-8"
          label="Cancel"
          @click="emitfnshowLostOrStolenList"
        />

        <q-btn
          color="purple-9"
          label="Download"
          :disabled="submitDisabled"
          @click="downloadLostOrStolenList"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar, date as qDate } from 'quasar'
import { useStore } from 'vuex'

/* ---------------- PROPS & EMITS ---------------- */
const props = defineProps({
  propLostOrStolenList: {
    type: Boolean,
    required: true
  },
  propData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['emitfnshowLostOrStolenList'])

/* ---------------- QUASAR & STORE ---------------- */
const $q = useQuasar()
const store = useStore()

/* ---------------- DATE SETUP ---------------- */
const today = new Date()

const tomorrow = qDate.formatDate(today, 'YYYY-MM-DD')
const yesterday = qDate.formatDate(
  qDate.subtractFromDate(today, { days: 7720 }),
  'YYYY-MM-DD'
)

/* ---------------- STATE ---------------- */
const toggleModel = ref(props.propLostOrStolenList)

const formData = ref({
  from: '',
  to: ''
})

/* ---------------- WATCH PROP ---------------- */
watch(
  () => props.propLostOrStolenList,
  val => {
    toggleModel.value = val
  }
)

/* ---------------- COMPUTED ---------------- */
const submitDisabled = computed(() => {
  return !(formData.value.from || formData.value.to)
})

/* ---------------- METHODS ---------------- */
function emitfnshowLostOrStolenList () {
  emit('emitfnshowLostOrStolenList')
}

function toTimestamp (dateStr) {
  if (!dateStr) return null

  const todayStr = qDate.formatDate(new Date(), 'YYYY-MM-DD')

  return dateStr === todayStr
    ? Date.now()
    : Date.parse(dateStr)
}

async function downloadLostOrStolenList () {
  const params = {
    from: toTimestamp(formData.value.from),
    to: toTimestamp(formData.value.to)
  }

  $q.loading.show({
    delay: 100,
    spinnerColor: 'purple-9',
    message: 'Please wait..'
  })

  try {
    await store.dispatch(
      'DownloadInventoryLostOrStolenData/FETCH_AGGREGATORS_LOST_OR_STOLEN_INVENTORY_ALL_DATAS',
      params
    )

    emitfnshowLostOrStolenList()

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Successfully Downloaded',
      icon: 'thumb_up'
    })
  } catch (error) {

    let message = 'Please select the field'

    if (error?.status === 400) {
      message = 'Output file size is high, Select smaller date range'
    } else if (error?.status === 500) {
      message = 'INTERNAL_SERVER_ERROR'
    } else if (error?.status === 403 || error?.status === 404) {
      message = 'Please choose some another date'
    }

    $q.notify({
      color: 'amber',
      position: 'bottom',
      message,
      icon: 'thumb_down'
    })
  } finally {
    $q.loading.hide()
    formData.value.from = ''
    formData.value.to = ''
  }
}
</script>

<style scoped>
.text-h6 {
  font-weight: 500;
}
</style>
