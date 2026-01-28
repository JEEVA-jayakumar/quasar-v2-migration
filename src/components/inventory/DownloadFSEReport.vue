<template>
  <q-dialog
    v-model="toggleModel"
    persistent
  >
    <q-card style="min-width: 40vw; padding: 30px;">
      <q-card-section class="text-center">
        <div class="text-h6 text-weight-regular">
          <strong>Download FSE File</strong>
        </div>
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <!-- From Date -->
        <q-input
          v-model="formData.from"
          label="From Date"
          readonly
          outlined
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
          readonly
          outlined
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

      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancel"
          class="text-grey-8"
          @click="emitfnshowFSEReport"
        />

        <q-btn
          color="purple-9"
          label="Download"
          :disable="submitDisabled"
          @click="downloadDeviceFSE"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar, date } from 'quasar'
import { useStore } from 'vuex'

/* ------------------ PROPS & EMITS ------------------ */
const props = defineProps({
  propFSEReport: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['emitfnshowFSEReport'])

/* ------------------ QUASAR & STORE ------------------ */
const $q = useQuasar()
const store = useStore()

/* ------------------ DATE HELPERS ------------------ */
const today = new Date()
const tomorrow = date.addToDate(today, { days: 0 })
const yesterday = date.subtractFromDate(today, { days: 720 })

/* ------------------ STATE ------------------ */
const toggleModel = ref(props.propFSEReport)

const formData = ref({
  from: '',
  to: ''
})

/* Keep dialog state in sync with parent */
watch(
  () => props.propFSEReport,
  val => {
    toggleModel.value = val
  }
)

/* ------------------ COMPUTED ------------------ */
const submitDisabled = computed(() => {
  return !(formData.value.from && formData.value.to)
})

/* ------------------ METHODS ------------------ */
function emitfnshowFSEReport () {
  emit('emitfnshowFSEReport')
}

function toTimestamp (strDate) {
  const dateOnly = strDate.split('T')[0]
  const now = new Date()
  const todayStr =
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getDate()}`

  return dateOnly === todayStr
    ? Date.now()
    : Date.parse(strDate)
}

async function downloadDeviceFSE () {
  const params = {
    from: toTimestamp(formData.value.from.toString()),
    to: toTimestamp(formData.value.to.toString())
  }

  $q.loading.show({
    delay: 100,
    spinnerColor: 'purple-9',
    message: 'Please wait..'
  })

  try {
    await store.dispatch(
      'DownloadInventoryFSEReports/FETCH_INVENTORY_FSE_REPORTS_DATAS',
      params
    )

    emitfnshowFSEReport()

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
    } else if (error?.status === 403) {
      message = 'Please choose some other date'
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
