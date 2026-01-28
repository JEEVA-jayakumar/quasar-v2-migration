<template>
  <q-dialog
    v-model="toggleModel"
    persistent
  >
    <q-card style="min-width: 40vw; padding: 30px;">
      <!-- Title -->
      <q-card-section class="text-center">
        <div class="text-h6 text-weight-regular">
          <strong>Download Lost Or Stolen File</strong>
        </div>
      </q-card-section>

      <!-- Date Inputs -->
      <q-card-section class="q-gutter-md">
        <!-- From Date -->
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
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <!-- To Date -->
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
          @click="emitfnshowLostOrStolenList"
        />
        <q-btn
          color="purple-9"
          label="Download"
          :disable="submitDisabled"
          @click="downloadLostOrStolenList"
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
  propLostOrStolenList: { type: Boolean, required: true }
})
const emit = defineEmits(['emitfnshowLostOrStolenList'])

/* ---------------- QUASAR & STORE ---------------- */
const $q = useQuasar()
const store = useStore()

/* ---------------- DATE LIMITS ---------------- */
const today = new Date()
const tomorrow = date.addToDate(today, { days: 0 })
const yesterday = date.subtractFromDate(today, { days: 7720 })

/* ---------------- STATE ---------------- */
const toggleModel = ref(props.propLostOrStolenList)
const formData = ref({ from: '', to: '' })

/* Sync dialog visibility with parent prop */
watch(
  () => props.propLostOrStolenList,
  val => { toggleModel.value = val }
)

/* ---------------- COMPUTED ---------------- */
const submitDisabled = computed(() => {
  return (
    formData.value.from !== 0 ||
    formData.value.to !== 0 ||
    (formData.value.from === 0 && formData.value.to === 0)
  )
    ? false
    : true
})

/* ---------------- METHODS ---------------- */
function emitfnshowLostOrStolenList() {
  emit('emitfnshowLostOrStolenList')
}

function toTimestamp(strDate) {
  const onlyDate = strDate.split('T')[0]
  const curDate = new Date()
  const month = String(curDate.getMonth() + 1).padStart(2, '0')
  const todayStr = `${curDate.getFullYear()}-${month}-${curDate.getDate()}`

  return onlyDate === todayStr ? Date.now() : Date.parse(strDate)
}

async function downloadLostOrStolenList() {
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
      'DownloadInventoryLostOrStolenData/FETCH_LOST_OR_STOLEN_INVENTORY_ALL_DATAS',
      params
    )

    emitfnshowLostOrStolenList()

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Successfully Downloaded',
      icon: 'thumb_up'
    })

    formData.value.from = ''
    formData.value.to = ''
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
