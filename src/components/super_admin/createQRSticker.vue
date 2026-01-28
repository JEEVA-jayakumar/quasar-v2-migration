<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <!-- Batch Header -->
        <div class="row">
          <div class="col-md-6">
            <q-chip color="primary">
              Batch number : BatchNo_000{{ getAllQRList1.batchCount }}
            </q-chip>
          </div>
        </div>

        <q-separator class="q-my-md" />

        <!-- Select QR -->
        <div class="row q-mb-md">
          <div class="col-md-3">
            <strong>Select QR</strong><br />
            <strong>Bank</strong>
          </div>

          <div class="col-md-6">
            <q-select
              v-model="formdata.leadSource"
              :options="dropDown.leadSourceOptions"
              label="Select QR API"
              color="grey-9"
              clearable
              :error="v$.formdata.leadSource.$error"
              @blur="v$.formdata.leadSource.$touch()"
            />
          </div>
        </div>

        <!-- QR Count -->
        <div class="row q-mb-md">
          <div class="col-md-3">
            <strong>Enter numbers of QR</strong><br />
            <strong>Ref numbers to be created</strong>
          </div>

          <div class="col-md-6">
            <q-input
              v-model="formdata.count"
              type="number"
              label="Enter numbers of QR count"
              color="grey-9"
              :error="v$.formdata.count.$error"
              @blur="v$.formdata.count.$touch()"
            />
          </div>
        </div>

        <!-- Action -->
        <div class="row">
          <div class="col text-right">
            <q-btn
              :disabled="submitDisabled"
              color="light-blue"
              label="Create QR"
              @click="fnsubmit"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

/* ----------------------------------
   Quasar & Store
---------------------------------- */
const $q = useQuasar()
const store = useStore()

/* ----------------------------------
   State
---------------------------------- */
const formdata = reactive({
  leadSource: '',
  count: ''
})

const dropDown = reactive({
  leadSourceOptions: []
})

/* ----------------------------------
   Vuelidate
---------------------------------- */
const rules = {
  formdata: {
    leadSource: { required },
    count: { required }
  }
}

const v$ = useVuelidate(rules, { formdata })

/* ----------------------------------
   Vuex Getters
---------------------------------- */
const getAllQRList1 = computed(
  () => store.getters['QRList/getAllQRList1']
)

const getActiveandDeactiveLeadSource = computed(
  () => store.getters['ACTIVE_DEACTIVE_LEAD_SOURCE/getActiveandDeactiveLeadSource']
)

/* ----------------------------------
   Computed
---------------------------------- */
const submitDisabled = computed(() => {
  return !(formdata.leadSource && formdata.count)
})

/* ----------------------------------
   Lifecycle
---------------------------------- */
onMounted(() => {
  loadLeadSourceDropdown()
  store.dispatch('QRList/FETCH_QR_LIST1')
})

/* ----------------------------------
   Methods
---------------------------------- */
async function loadLeadSourceDropdown () {
  await store.dispatch('ACTIVE_DEACTIVE_LEAD_SOURCE/LEAD_SOURCE_ACTIVE_DEACTIVE_LIST')

  dropDown.leadSourceOptions = getActiveandDeactiveLeadSource.value.map(item => ({
    value: item.instance_id,
    label: item.apiInstanceName
  }))
}

async function fnsubmit () {
  v$.value.$touch()
  if (v$.value.$error) return

  $q.loading.show({
    delay: 100,
    message: 'Please Wait',
    spinnerColor: 'purple-9',
    customClass: 'shadow-none'
  })

  const requestParams = {
    url: {
      leadSource: formdata.leadSource,
      count: formdata.count
    }
  }

  try {
    const response = await store.dispatch('createQRCode/CREATE_QR_CODE', requestParams)

    await store.dispatch('QRList/FETCH_QR_LIST1')

    $q.notify({
      color: 'positive',
      position: 'bottom',
      icon: 'thumb_up',
      message: response.data.message
    })

    formdata.leadSource = ''
    formdata.count = ''
  } catch (error) {

    $q.notify({
      color: 'negative',
      position: 'bottom',
      icon: 'warning',
      message: error?.data?.message || 'Something went wrong'
    })
  } finally {
    $q.loading.hide()
  }
}
</script>
