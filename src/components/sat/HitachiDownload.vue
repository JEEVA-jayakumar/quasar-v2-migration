<template>
  <q-dialog
    v-model="toggleModel"
    persistent
  >
    <q-card style="min-width: 40vw; padding: 30px;">
      <q-card-section>
        <div class="text-h6 text-center">
          <strong>Download File</strong>
        </div>
      </q-card-section>

      <q-card-section class="column q-gutter-md">
        <!-- From Date -->
        <q-input
          filled
          v-model="formData.from"
          label="From Date"
          readonly
        >
          <template #append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date
                  v-model="formData.from"
                  :min="yesterday"
                  :max="tomorrow"
                  mask="YYYY-MM-DD"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <!-- To Date -->
        <q-input
          filled
          v-model="formData.to"
          label="To Date"
          readonly
        >
          <template #append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date
                  v-model="formData.to"
                  :min="yesterday"
                  :max="tomorrow"
                  mask="YYYY-MM-DD"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          class="text-grey-8"
          label="Cancel"
          @click="emitfnshowHitachiDownload"
        />
        <q-btn
          color="purple-9"
          label="Download"
          :disabled="submitDisabled"
          @click="downloadEMI"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar, date } from 'quasar'
import { useStore } from 'vuex'

/* ---------------- PROPS ---------------- */
const props = defineProps({
  propHitachiDownload: {
    type: Boolean,
    required: true
  }
})

/* ---------------- EMITS ---------------- */
const emit = defineEmits(['emitfnshowHitachiDownload'])

/* ---------------- QUASAR ---------------- */
const $q = useQuasar()

/* ---------------- STORE ---------------- */
const store = useStore()

/* ---------------- DATES ---------------- */
const today = new Date()
const tomorrow = date.formatDate(today, 'YYYY-MM-DD')
const yesterday = date.formatDate(
  date.subtractFromDate(today, { days: 1440 }),
  'YYYY-MM-DD'
)

/* ---------------- STATE ---------------- */
const toggleModel = ref(props.propHitachiDownload)

const formData = ref({
  from: '',
  to: ''
})

/* ---------------- WATCH ---------------- */
watch(
  () => props.propHitachiDownload,
  val => (toggleModel.value = val)
)

/* ---------------- COMPUTED ---------------- */
const submitDisabled = computed(() => {
  return !(formData.value.from && formData.value.to)
})

/* ---------------- METHODS ---------------- */
const emitfnshowHitachiDownload = () => {
  emit('emitfnshowHitachiDownload')
}

const toTimestamp = (dateStr) => {
  const todayStr = date.formatDate(new Date(), 'YYYY-MM-DD')
  if (dateStr === todayStr) {
    return Date.now()
  }
  return Date.parse(dateStr)
}

const downloadEMI = async () => {
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
      'DownloadInventoryReplacementRecoveryReports/FETCH_HITACHI_DOWNLOAD_DATA',
      params
    )

    emitfnshowHitachiDownload()

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Successfully Downloaded',
      icon: 'thumb_up'
    })
  } catch (error) {

    emitfnshowHitachiDownload()

    if (error?.status === 400) {
      $q.notify({
        color: 'amber',
        message: 'Output file size is high, Select smaller date range'
      })
    } else if (error?.status === 500) {
      $q.notify({
        color: 'amber',
        message: 'INTERNAL_SERVER_ERROR'
      })
    } else if (error?.status === 403) {
      $q.notify({
        color: 'amber',
        message: 'Please choose some other date'
      })
    } else {
      $q.notify({
        color: 'amber',
        message: 'Please select the field'
      })
    }
  } finally {
    $q.loading.hide()
    formData.value.from = ''
    formData.value.to = ''
  }
}
</script>

<style scoped>
.error {
  color: red;
  font-size: 12px;
}
</style>
