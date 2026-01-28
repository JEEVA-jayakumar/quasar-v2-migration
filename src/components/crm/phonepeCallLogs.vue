<template>
  <q-dialog
    v-model="toggleModal"
    persistent
  >
    <q-card style="min-width: 40vw; padding: 10px">

      <!-- Header -->
      <q-card-section class="row items-center q-py-sm bottom-border">
        <div class="text-h6">Call Logs</div>
        <q-space />
        <q-btn
          round
          dense
          flat
          icon="close"
          color="dark"
          @click="emitToggleRemarks"
        />
      </q-card-section>

      <!-- Body -->
      <q-card-section>
        <div class="row q-gutter-md">
          
          <!-- Date Picker -->
          <div class="col-sm-4 col-xs-12">
            <q-datetime
              v-model="selectedDate"
              label="From Date"
              color="purple-9"
              :max="maxDate"
              type="datetime"
              format24h
              @input="onDateChange"
            />
          </div>

          <!-- Remarks Textarea -->
          <div class="col-sm-7 col-xs-12">
            <q-input
              filled
              v-model="callRemarks"
              label="Enter your text"
              type="textarea"
              rows="5"
              maxlength="500"
              counter
              class="textarea-box"
            />
          </div>

        </div>

        <div class="row items-center bottom-border q-py-sm"></div>

        <!-- Action Buttons -->
        <div class="row justify-end q-gutter-sm">
          <q-btn
            color="purple-9"
            icon="refresh"
            label="Reset"
            @click="reset"
          />
          <q-btn
            color="purple-9"
            icon="save"
            label="Save"
            @click="fnSubmit"
          />
        </div>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'

/* ============================
   Props & Emits
============================ */
const props = defineProps({
  callInfo: { type: Object, required: true },
  propToggleCallLogsPop: { type: Boolean, required: true },
  ActionBarInfo: { type: Object, required: false }
})

const emit = defineEmits(['closeCallLogs'])

/* ============================
   Quasar & Vuex
============================ */
const $q = useQuasar()
const store = useStore()

/* ============================
   Reactive State
============================ */
const toggleModal = ref(props.propToggleCallLogsPop)
const selectedDate = ref(null)
const callRemarks = ref('')
const maxDate = new Date().toISOString()

const formData = reactive({
  serviceTicketId: props.callInfo.subTicketsList[0].id,
  inputDate: selectedDate.value,
  remarks: callRemarks.value
})

/* ============================
   Watchers to keep formData updated
============================ */
watch(selectedDate, (newDate) => {
  formData.inputDate = newDate ? new Date(newDate).getTime() : null
})

watch(callRemarks, (newRemarks) => {
  formData.remarks = newRemarks
})

watch(() => props.propToggleCallLogsPop, (val) => {
  toggleModal.value = val
})

/* ============================
   Methods
============================ */
const fnSubmit = async () => {
  $q.loading.show({
    delay: 0,
    spinnerColor: 'purple-9',
    message: 'Data submitting..'
  })

  try {
    await store.dispatch('phonePeCrm/UPDATE_CALL_LOG_CRM_REMARKS', formData)

    $q.notify({
      type: 'positive',
      message: 'Remarks updated successfully',
      icon: 'thumb_up'
    })

    emitToggleRemarks()
  } catch (error) {

    $q.notify({
      type: 'negative',
      message: error?.body?.message || 'Please try again later.',
      icon: 'thumb_down'
    })
  } finally {
    $q.loading.hide()
  }
}

const emitToggleRemarks = () => {
  emit('closeCallLogs')
}

const reset = () => {
  selectedDate.value = null
  callRemarks.value = ''
  formData.inputDate = null
  formData.remarks = ''
}

const onDateChange = (date) => {
  selectedDate.value = date ? new Date(date).getTime() : null
}
</script>

<style scoped>
.textarea-box {
  border: 1px solid #c0c0c0;
  border-radius: 4px;
  padding: 8px;
  background-color: #f9f9f9;
}

.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>
