<template>
  <q-dialog v-model="toggleModel" persistent>
    <q-card style="min-width: 40vw; padding: 30px;">
      
      <!-- Title -->
      <q-card-section class="text-center">
        <div class="text-h6 text-weight-regular">
          <strong>Download Lost Or Stolen File</strong>
        </div>
      </q-card-section>

      <!-- Date Inputs -->
      <q-card-section class="q-gutter-md">
        <q-input
          v-model="formData.from"
          label="From Date"
          outlined
          readonly
        >
          <template #append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date
                  v-model="formData.from"
                  :min="yesterday"
                  :max="tomorrow"
                  mask="YYYY-MM-DD"
                  display-format="YYYY-MM-DD"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input
          v-model="formData.to"
          label="To Date"
          outlined
          readonly
        >
          <template #append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date
                  v-model="formData.to"
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
        <q-btn flat label="Cancel" class="text-grey-8" @click="emitfnshowSendToRepair" />
        <q-btn
          color="purple-9"
          label="Download"
          :disable="submitDisabled"
          @click="downloadSendToRepair"
        />
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar, date } from 'quasar'
import { useStore } from 'vuex'

/* ---------------- Props & Emits ---------------- */
const props = defineProps({
  propSendToRepair: { type: Boolean, required: true }
})
const emit = defineEmits(['emitfnshowSendToRepair'])

/* ---------------- Quasar & Vuex ---------------- */
const $q = useQuasar()
const store = useStore()

/* ---------------- Date Limits ---------------- */
const today = new Date()
const tomorrow = date.addToDate(today, { days: 0 })
const yesterday = date.subtractFromDate(today, { days: 7720 }) // original logic

/* ---------------- State ---------------- */
const toggleModel = ref(props.propSendToRepair)
const formData = ref({
  from: '',
  to: ''
})

/* ---------------- Watch Props ---------------- */
watch(() => props.propSendToRepair, val => { toggleModel.value = val })

/* ---------------- Computed ---------------- */
const submitDisabled = computed(() => !formData.value.from || !formData.value.to)

/* ---------------- Methods ---------------- */
function emitfnshowSendToRepair() {
  emit('emitfnshowSendToRepair')
}

function toTimestamp(strDate) {
  if (!strDate) return null
  const datePart = strDate.split('T')[0]
  const todayObj = new Date()
  const month = todayObj.getMonth() + 1
  const currentDateStr = `${todayObj.getFullYear()}-${month < 10 ? '0'+month : month}-${todayObj.getDate()}`
  return currentDateStr === datePart ? Date.now() : Date.parse(strDate)
}

async function downloadSendToRepair() {
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
      'DownloadInventorySendToRepair/FETCH_SEND_TO_REPAIR_INVENTORY_ALL_DATAS',
      params
    )

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Successfully Downloaded',
      icon: 'thumb_up'
    })

    emitfnshowSendToRepair()
    formData.value.from = ''
    formData.value.to = ''

  } catch (error) {

    let errorMessage = 'Please select the field'
    if (error?.status === 400) errorMessage = 'Output file size is high, select smaller date range'
    else if (error?.status === 500) errorMessage = 'INTERNAL_SERVER_ERROR'
    else if (error?.status === 403) errorMessage = 'Please choose another date'
    else if (error?.status === 404) errorMessage = 'Please choose another date'

    $q.notify({
      color: 'amber',
      position: 'bottom',
      message: errorMessage,
      icon: 'thumb_down'
    })

    formData.value.from = ''
    formData.value.to = ''
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
