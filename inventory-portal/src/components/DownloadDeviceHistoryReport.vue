<template>
  <q-dialog v-model="toggleModel" persistent>
    <q-card style="min-width: 40vw; padding: 30px">
      <q-card-section>
        <div class="text-h6 text-center">
          <strong>Download Device History File</strong>
        </div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="formData.from"
          type="date"
          label="From Date"
          :min="yesterday"
          :max="tomorrow"
          class="q-mb-md"
        />

        <q-input
          v-model="formData.to"
          type="date"
          label="To Date"
          :min="yesterday"
          :max="tomorrow"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          color="grey-8"
          label="Cancel"
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

<script>
import { defineComponent, ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { date, Loading, Notify } from 'quasar'

const { addToDate, subtractFromDate } = date

export default defineComponent({
  name: 'DownloadDeviceHistoryReport',

  props: {
    propDeviceHistoryReport: {
      type: Boolean,
      required: true
    }
  },

  emits: ['emitfnshowDeviceHistory'],

  setup(props, { emit }) {
    const store = useStore()

    const toggleModel = ref(props.propDeviceHistoryReport)

    watch(
      () => props.propDeviceHistoryReport,
      val => (toggleModel.value = val)
    )

    const today = new Date()

    const tomorrow = addToDate(today, { days: 0 })
      .toISOString()
      .split('T')[0]

    const yesterday = subtractFromDate(today, { days: 1440 })
      .toISOString()
      .split('T')[0]

    const formData = ref({
      from: '',
      to: ''
    })

    const submitDisabled = computed(() => {
      return !(formData.value.from || formData.value.to)
    })

    const emitfnshowDeviceHistory = () => {
      emit('emitfnshowDeviceHistory')
    }

    const toTimestamp = (dateStr) => {
      if (!dateStr) return null

      const selectedDate = dateStr.split('T')[0]
      const todayStr = new Date().toISOString().split('T')[0]

      return selectedDate === todayStr
        ? Date.now()
        : Date.parse(dateStr)
    }

    const downloadHistory = async () => {
      const params = {
        from: toTimestamp(formData.value.from),
        to: toTimestamp(formData.value.to)
      }

      Loading.show({
        message: 'Please wait...',
        spinnerColor: 'purple-9'
      })

      try {
        await store.dispatch(
          'DownloadInventoryDeviceHistoryReports/FETCH_INVENTORY_DEVICE_HISTORY_DATAS',
          params
        )

        Notify.create({
          type: 'positive',
          message: 'Successfully Downloaded',
          icon: 'thumb_up'
        })

        formData.value.from = ''
        formData.value.to = ''
        emitfnshowDeviceHistory()
      } catch (error) {

        const status = error?.status
        let message = 'Please select the field'

        if (status === 400)
          message = 'Output file size is high, Select smaller date range'
        else if (status === 403)
          message = 'Please choose some another date'
        else if (status === 500)
          message = 'INTERNAL_SERVER_ERROR'

        Notify.create({
          type: 'warning',
          message,
          icon: 'thumb_down'
        })

        formData.value.from = ''
        formData.value.to = ''
      } finally {
        Loading.hide()
      }
    }

    return {
      toggleModel,
      formData,
      tomorrow,
      yesterday,
      submitDisabled,
      emitfnshowDeviceHistory,
      downloadHistory
    }
  }
})
</script>

<style scoped>
/* styling unchanged */
</style>
