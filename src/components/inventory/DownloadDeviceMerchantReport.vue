<template>
  <q-dialog v-model="toggleModel" persistent>
    <q-card style="min-width: 40vw; padding: 30px">
      <q-card-section>
        <div class="text-h6 text-center">
          <strong>Download Device Merchant File</strong>
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
          @click="emitfnshowDeviceMerchant"
        />
        <q-btn
          color="purple-9"
          label="Download"
          @click="downloadMerchant"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { date, Loading, Notify } from 'quasar'

const { addToDate, subtractFromDate } = date

export default defineComponent({
  name: 'DownloadDeviceMerchantReport',

  props: {
    propDeviceMerchantReport: {
      type: Boolean,
      required: true
    }
  },

  emits: ['emitfnshowDeviceMerchant'],

  setup(props, { emit }) {
    const store = useStore()

    const toggleModel = ref(props.propDeviceMerchantReport)

    watch(
      () => props.propDeviceMerchantReport,
      val => (toggleModel.value = val)
    )

    const today = new Date()

    const tomorrow = addToDate(today, { days: 0 })
      .toISOString()
      .split('T')[0]

    const yesterday = subtractFromDate(today, { days: 720 })
      .toISOString()
      .split('T')[0]

    const formData = ref({
      from: '',
      to: ''
    })

    const emitfnshowDeviceMerchant = () => {
      emit('emitfnshowDeviceMerchant')
    }

    const toTimestamp = (dateStr) => {
      if (!dateStr) return null

      const selectedDate = dateStr.split('T')[0]
      const todayStr = new Date().toISOString().split('T')[0]

      return selectedDate === todayStr
        ? Date.now()
        : Date.parse(dateStr)
    }

    const downloadMerchant = async () => {
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
          'InventoryCentral/REPORT_MERCHANT_MENU',
          params
        )

        Notify.create({
          type: 'positive',
          message: 'Successfully Downloaded',
          icon: 'thumb_up'
        })

        formData.value.from = ''
        formData.value.to = ''
        emitfnshowDeviceMerchant()
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
      emitfnshowDeviceMerchant,
      downloadMerchant
    }
  }
})
</script>

<style scoped>
/* unchanged */
</style>
