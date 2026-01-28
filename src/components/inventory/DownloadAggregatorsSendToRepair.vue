<template>
  <q-dialog
    v-model="toggleModel"
    persistent
  >
    <q-card style="min-width: 40vw; padding: 30px">
      <q-card-section>
        <div class="text-h6 text-center">
          <strong>Download Aggregator Lost Or Stolen Files</strong>
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
          @click="emitfnshowSendToRepair"
        />
        <q-btn
          color="purple-9"
          label="Download"
          :disable="submitDisabled"
          @click="downloadAggregatorsSendToRepair"
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
  name: 'DownloadAggregatorLostStolen',

  props: {
    propSendToRepair: {
      type: Boolean,
      required: true
    }
  },

  emits: ['emitfnshowSendToRepair'],

  setup(props, { emit }) {
    const store = useStore()

    const toggleModel = ref(props.propSendToRepair)

    watch(
      () => props.propSendToRepair,
      val => (toggleModel.value = val)
    )

    const today = new Date()

    const tomorrow = addToDate(today, { days: 0 })
      .toISOString()
      .split('T')[0]

    const yesterday = subtractFromDate(today, { days: 7720 })
      .toISOString()
      .split('T')[0]

    const formData = ref({
      from: '',
      to: ''
    })

    const submitDisabled = computed(() => {
      return !(formData.value.from || formData.value.to)
    })

    const emitfnshowSendToRepair = () => {
      emit('emitfnshowSendToRepair')
    }

    const toTimestamp = (dateStr) => {
      if (!dateStr) return null

      const selected = new Date(dateStr)
      const todayStr = new Date().toISOString().split('T')[0]

      if (dateStr === todayStr) {
        return Date.now()
      }

      return selected.getTime()
    }

    const downloadAggregatorsSendToRepair = async () => {
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
          'DownloadInventorySendToRepair/FETCH_AGGREGATORS_SEND_TO_REPAIR_INVENTORY_ALL_DATAS',
          params
        )

        Notify.create({
          type: 'positive',
          message: 'Successfully Downloaded',
          icon: 'thumb_up'
        })

        formData.value.from = ''
        formData.value.to = ''
        emitfnshowSendToRepair()
      } catch (error) {

        const status = error?.status

        let message = 'Please select the field'

        if (status === 400)
          message = 'Output file size is high, Select smaller date range'
        else if (status === 403)
          message = 'Please choose some other date'
        else if (status === 404)
          message = 'No Data Found. Please choose another date'
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
      emitfnshowSendToRepair,
      downloadAggregatorsSendToRepair
    }
  }
})
</script>

<style scoped>
/* No functional changes – kept minimal */
</style>
