<template>
  <q-dialog
    v-model="toggleModel"
    persistent
  >
    <q-card style="min-width: 40vw; padding: 30px;">
      <!-- Title -->
      <q-card-section class="text-center">
        <div class="text-h6 text-weight-regular">
          <strong>Download Inventory With SO File</strong>
        </div>
      </q-card-section>

      <!-- Date Inputs -->
      <q-card-section class="q-gutter-md">
        <!-- From Date -->
        <q-input
          v-model="formData.fromDate"
          label="From Date"
          outlined
          readonly
        >
          <template #append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date
                  v-model="formData.fromDate"
                  :min="yesterday"
                  :max="tomorrow"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <!-- To Date -->
        <q-input
          v-model="formData.toDate"
          label="To Date"
          outlined
          readonly
        >
          <template #append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date
                  v-model="formData.toDate"
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
          @click="emitfnshowInventoryWithSo"
        />

        <q-btn
          color="purple-9"
          label="Download"
          :disable="submitDisabled"
          @click="downloadInventoryWithSoList"
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
  propInventoryWithSo: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['emitfnshowInventoryWithSo'])

/* ---------------- QUASAR & STORE ---------------- */
const $q = useQuasar()
const store = useStore()

/* ---------------- DATE LIMITS ---------------- */
const today = new Date()
const tomorrow = date.addToDate(today, { days: 0 })
const yesterday = date.subtractFromDate(today, { days: 720 })

/* ---------------- STATE ---------------- */
const toggleModel = ref(props.propInventoryWithSo)

const formData = ref({
  fromDate: '',
  toDate: ''
})

/* Sync dialog visibility */
watch(
  () => props.propInventoryWithSo,
  val => {
    toggleModel.value = val
  }
)

/* ---------------- COMPUTED ---------------- */
/* Original submitDisabled logic preserved */
const submitDisabled = computed(() => {
  return (
    formData.value.fromDate !== 0 ||
    formData.value.toDate !== 0 ||
    (formData.value.fromDate === 0 && formData.value.toDate === 0)
  )
    ? false
    : true
})

/* ---------------- METHODS ---------------- */
function emitfnshowInventoryWithSo () {
  emit('emitfnshowInventoryWithSo')
}

function toTimestamp (strDate) {
  const onlyDate = strDate.split('T')[0]
  const curDate = new Date()
  const month = String(curDate.getMonth() + 1).padStart(2, '0')
  const todayStr = `${curDate.getFullYear()}-${month}-${curDate.getDate()}`

  return onlyDate === todayStr
    ? Date.now()
    : Date.parse(strDate)
}

async function downloadInventoryWithSoList () {
  const params = {
    fromDate: toTimestamp(formData.value.fromDate),
    toDate: toTimestamp(formData.value.toDate)
  }

  $q.loading.show({
    delay: 100,
    spinnerColor: 'purple-9',
    message: 'Please wait..'
  })

  try {
    await store.dispatch(
      'DownloadInventoryWithSoData/INVENTORY_WITH_SO_ALL_DATAS',
      params
    )

    emitfnshowInventoryWithSo()

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Successfully Downloaded',
      icon: 'thumb_up'
    })

    formData.value.fromDate = ''
    formData.value.toDate = ''
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

    formData.value.fromDate = ''
    formData.value.toDate = ''
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
