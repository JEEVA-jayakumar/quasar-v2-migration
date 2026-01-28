<template>
  <q-dialog v-model="toggleModel" persistent>
    <q-card style="min-width: 40vw; padding: 30px;">
      <!-- Title -->
      <q-card-section class="text-center">
        <div class="text-h6 text-weight-regular">
          <strong>POS INVENTORY REPORT</strong>
        </div>
      </q-card-section>

      <!-- Date Input -->
      <q-card-section class="q-gutter-md">
        <q-input
          v-model="formData.selectedFromYear"
          label="Choose Date Range"
          outlined
          readonly
        >
          <template #append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date
                  v-model="formData.selectedFromYear"
                  :min="yesterday"
                  :max="tomorrow"
                  mask="YYYY-MM-DD"
                  display-format="YYYY-MM-DD"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-card-section>

      <!-- Actions -->
      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancel"
          class="text-grey-8"
          @click="emitfnshowDeviceHistory"
        />
        <q-btn
          color="purple-9"
          label="Download"
          :disable="submitDisabled"
          @click="downloadHistory"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar, date } from 'quasar'
import { useStore } from 'vuex'

/* ---------------- PROPS & EMITS ---------------- */
const props = defineProps({
  propDeviceHistoryReport: { type: Boolean, required: true }
})
const emit = defineEmits(['emitfnshowDeviceHistory'])

/* ---------------- QUASAR & STORE ---------------- */
const $q = useQuasar()
const store = useStore()

/* ---------------- DATE LIMITS ---------------- */
const today = new Date()
const tomorrow = date.addToDate(today, { days: 0 })
const yesterday = date.subtractFromDate(today, { days: 1440 })

/* ---------------- STATE ---------------- */
const toggleModel = ref(props.propDeviceHistoryReport)
const formData = ref({
  selectedFromYear: ''
})

/* Sync dialog visibility with parent prop */
watch(
  () => props.propDeviceHistoryReport,
  val => { toggleModel.value = val }
)

/* ---------------- COMPUTED ---------------- */
const submitDisabled = computed(() => !formData.value.selectedFromYear)

/* ---------------- METHODS ---------------- */
function emitfnshowDeviceHistory() {
  emit('emitfnshowDeviceHistory')
}

function formatToYYYYMMDD(dateString) {
  if (!dateString) return ''
  const dateObj = new Date(dateString)
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

async function downloadHistory() {
  const formattedFromYear = formatToYYYYMMDD(formData.value.selectedFromYear)

  const params = {
    from: formattedFromYear
    // To date is commented in original code
    // to: formattedToYear
  }

  $q.loading.show({
    delay: 100,
    spinnerColor: 'purple-9',
    message: 'Please wait..'
  })

  try {
    await store.dispatch('DownloadPosInventoryReport/FETCH_POS_INVENTORY_REPORTS', params)

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Successfully Downloaded',
      icon: 'thumb_up'
    })

    emitfnshowDeviceHistory()
    formData.value.selectedFromYear = ''
  } catch (error) {

    let errorMessage = 'Please select the field'
    if (error?.status === 400) {
      errorMessage = 'Output file size is high, select a smaller date range'
    } else if (error?.status === 500) {
      errorMessage = 'INTERNAL_SERVER_ERROR'
    } else if (error?.status === 403) {
      errorMessage = 'Please choose another date'
    }

    $q.notify({
      color: 'amber',
      position: 'bottom',
      message: errorMessage,
      icon: 'thumb_down'
    })

    formData.value.selectedFromYear = ''
  } finally {
    $q.loading.hide()
  }
}
</script>

<style scoped>
.error {
  color: red;
  font-size: 12px;
  position: absolute;
  text-transform: lowercase;
}
</style>
