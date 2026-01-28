<template>
  <div>
    <div class="col-md-6 q-my-md text-right">
      <div class="group">
        <!-- Reserved for future buttons -->
      </div>
    </div>

    <div class="col-12 q-title q-my-lg text-weight-regular">
      TID Based SerialNumber
    </div>

    <q-form @submit.prevent="fnSubmitBankDetails">
      <div class="q-px-md q-pa-md">
        <div class="row q-col-gutter-md q-py-sm">
          <!-- Select TID -->
          <div class="col-md-6 col-12">
            <q-select
              v-model="formData.bank"
              :options="dropDown.leadSourceOptions"
              label="*Select TID"
              emit-value
              map-options
              dense
              :error="v$.formData.bank.$error"
              @blur="v$.formData.bank.$touch"
            />
          </div>

          <!-- Serial Number -->
          <div class="col-md-6 col-12">
            <q-input
              v-model="formData.emp_id"
              label="*Enter Serial Number"
              dense
              :error="v$.formData.emp_id.$error"
              @blur="v$.formData.emp_id.$touch"
            />
          </div>
        </div>
      </div>

      <div class="full-width text-center q-mt-md">
        <q-btn
          label="Submit"
          color="purple-9"
          type="submit"
          size="md"
        />
      </div>
    </q-form>

    <uploadFile
      v-if="propShowCreateUploadFile"
      :propShowUploadFile="propShowCreateUploadFile"
      @emitfnshowUploadFile="propShowCreateUploadFile = false"
    />
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import uploadFile from '../../components/super_admin/uploadFile.vue'

/* ----------------------------------
   Quasar & Store
---------------------------------- */
const $q = useQuasar()
const store = useStore()

/* ----------------------------------
   State
---------------------------------- */
const propShowCreateUploadFile = ref(false)

const dropDown = reactive({
  leadSourceOptions: []
})

const formData = reactive({
  location: '',
  bank: '',
  branch_code: '',
  so_name: '',
  mail_id: '',
  emp_id: '',
  bank_enable: ''
})

/* ----------------------------------
   Vuelidate Rules
---------------------------------- */
const rules = {
  formData: {
    location: { required },
    bank: { required },
    branch_code: { required },
    so_name: { required },
    mail_id: { required },
    emp_id: { required },
    bank_enable: { required }
  }
}

const v$ = useVuelidate(rules, { formData })

/* ----------------------------------
   Vuex Getters
---------------------------------- */
const getActiveLeadSource = computed(
  () => store.getters['leadSource/getActiveLeadSource']
)

/* ----------------------------------
   Lifecycle
---------------------------------- */
onMounted(() => {
  ajaxLoadLeadSource()
})

/* ----------------------------------
   Methods
---------------------------------- */
const ajaxLoadLeadSource = async () => {
  await store.dispatch('leadSource/LEAD_SOURCE_ACTIVE_LIST')

  dropDown.leadSourceOptions = getActiveLeadSource.value.map(item => ({
    label: item.sourceName,
    value: item.sourceName
  }))
}

const fnSubmitBankDetails = async () => {
  v$.value.$touch()

  if (v$.value.$error) {
    $q.notify({
      type: 'warning',
      message: 'Please review fields again.'
    })
    return
  }

  try {
    const response = await store.dispatch(
      'Bank_SO/SAVE_BANK_SO',
      formData
    )

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: response.data.message,
      icon: 'thumb_up'
    })

    Object.keys(formData).forEach(key => {
      formData[key] = ''
    })

    v$.value.$reset()
  } catch (error) {

    $q.notify({
      type: 'warning',
      color: 'amber-9',
      position: 'bottom',
      message: error?.data?.message || 'Something went wrong'
    })
  }
}
</script>

<style scoped>
.text-right {
  text-align: right;
}
</style>
