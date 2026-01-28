<template>
  <q-page>
    <div class="q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
      Bijlipay Serial Number Update
    </div>

    <q-form class="q-px-md q-pt-md" @submit.prevent="fnSubmitBankDetails">
      <div class="row q-col-gutter-md">

        <!-- TID -->
        <div class="col-md-6 col-sm-12">
          <q-select
            v-model="formData.tid"
            label="TID"
            outlined
            use-input
            input-debounce="500"
            :options="tidOptions"
            @filter="tidSearch"
            @update:model-value="tidSelected"
            :error="v$.formData.tid.$error"
            error-message="TID is required"
            clearable
          />
        </div>

        <!-- Serial Number -->
        <div class="col-md-6 col-sm-12">
          <q-input
            v-model="formData.serialNumber"
            label="Serial Number"
            outlined
            disable
            :error="v$.formData.serialNumber.$error"
            error-message="Serial Number is required"
          />
        </div>

        <!-- New Serial Number -->
        <div class="col-md-6 col-sm-12">
          <q-input
            v-model.trim="formData.newSerialNumber"
            label="New Serial Number"
            outlined
            :error="v$.formData.newSerialNumber.$error"
            error-message="New Serial Number is required"
            clearable
          />
        </div>
      </div>

      <!-- Submit -->
      <div class="q-mt-lg text-center">
        <q-btn
          label="Submit"
          color="purple-9"
          type="submit"
          size="md"
        />
      </div>
    </q-form>

    <!-- Upload Component -->
    <uploadFile
      v-if="propShowCreateUploadFile"
      :propShowUploadFile="propShowCreateUploadFile"
      @emitfnshowUploadFile="propShowCreateUploadFile = false"
    />
  </q-page>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default defineComponent({
  name: 'SerialNumberUpdate',

  setup () {
    const store = useStore()

    const formData = ref({
      tid: '',
      serialNumber: '',
      newSerialNumber: ''
    })

    const rules = {
      formData: {
        tid: { required },
        serialNumber: { required },
        newSerialNumber: { required }
      }
    }

    const v$ = useVuelidate(rules, { formData })

    const tidOptions = ref([])

    const getAllTids = computed(() => store.getters['TID/getAllTids'])

    /* ---------------- Methods ---------------- */

    const tidSearch = (val, update) => {
      if (val.length < 3) {
        update(() => (tidOptions.value = []))
        return
      }

      store.dispatch('TID/FETCH_TID', val)
        .then(() => {
          update(() => {
            tidOptions.value = getAllTids.value
          })
        })
    }

    const tidSelected = () => {
      if (!formData.value.tid) return

      store.dispatch('TID/FETCH_TID_SERIAL_NUMBER', {
        url: { tid: formData.value.tid }
      }).then(res => {
        formData.value.serialNumber = res.data.data.serial_no
      })
    }

    const fnSubmitBankDetails = async () => {
      v$.value.$touch()

      if (v$.value.$error) {
        store._vm.$q.notify('Please review fields again.')
        return
      }

      const payload = {
        url: {
          tid: formData.value.tid,
          newSerialNumber: formData.value.newSerialNumber
        }
      }

      store.dispatch('TID/UPDATE_SERIAL_NUMBER', payload)
        .then(res => {
          store._vm.$q.notify({
            color: 'positive',
            position: 'bottom',
            message: res.data.message,
            icon: 'thumb_up'
          })
        })
        .catch(err => {
          store._vm.$q.notify({
            color: 'negative',
            position: 'bottom',
            message: err?.data?.message || 'Error occurred'
          })
        })
    }

    return {
      formData,
      tidOptions,
      tidSearch,
      tidSelected,
      fnSubmitBankDetails,
      v$
    }
  }
})
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>
