<template>
  <div>
    <div class="col-12 q-title q-my-lg text-weight-regular">
      <strong>Notifications</strong>
    </div>

    <form @submit.prevent="fnSaveMerchant">
      <div class="q-px-md">
        <div class="q-pa-md">
          <div class="row q-col-gutter-sm q-py-sm">

            <!-- Notification Category -->
            <div class="col-md-6">
              <q-select
                v-model="formData.categoryType"
                :options="leadSourceOptions"
                label="*Notification Category"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                clearable
                @blur="v$.formData.categoryType.$touch"
                :error="v$.formData.categoryType.$error"
                error-message="Notification Category is required"
              />
            </div>

            <!-- TID Chips + Search -->
            <div class="col-md-6">
              <q-select
                v-model="formData.tids"
                label="TID"
                multiple
                use-chips
                use-input
                clearable
                input-debounce="500"
                :options="tidOptions"
                @filter="tidSearch"
                @blur="v$.formData.tids.$touch"
                :error="v$.formData.tids.$error"
                error-message="At least one TID is required"
              />
            </div>

            <!-- Notification Text -->
            <div class="col-md-7">
              <q-input
                v-model="formData.notificationText"
                label="*Notification Text"
                color="grey-9"
                @blur="v$.formData.notificationText.$touch"
                :error="v$.formData.notificationText.$error"
                error-message="Notification Text is required"
              />
            </div>

            <!-- Submit -->
            <div class="col-md-5 flex items-center">
              <q-btn
                color="purple-9"
                label="Submit"
                type="submit"
              />
            </div>

          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

/* ---------------- plugins ---------------- */
const $q = useQuasar()
const store = useStore()

/* ---------------- static options ---------------- */
const leadSourceOptions = [
  { label: 'Offers', value: 3 },
  { label: 'Risk Hold', value: 1 },
  { label: 'Paper Roll', value: 2 }
]

/* ---------------- state ---------------- */
const formData = ref({
  categoryType: '',
  tids: [],
  notificationText: ''
})

const tidOptions = ref([])

/* ---------------- validations ---------------- */
const rules = computed(() => ({
  formData: {
    categoryType: { required },
    tids: { required },
    notificationText: { required }
  }
}))

const v$ = useVuelidate(rules, { formData })

/* ---------------- store getters ---------------- */
const getMerchantTid = computed(
  () => store.getters['Merchant/getMerchantTid'] || []
)

/* ---------------- methods ---------------- */
const fnSaveMerchant = async () => {
  v$.value.$touch()
  if (v$.value.$error) {
    $q.notify({
      color: 'negative',
      message: 'Please review fields again.',
      position: 'bottom'
    })
    return
  }

  try {
    const response = await store.dispatch(
      'Merchant/SAVE_MERCHANT',
      formData.value
    )

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: response?.data?.message || 'Saved successfully',
      icon: 'thumb_up'
    })

    formData.value = {
      categoryType: '',
      tids: [],
      notificationText: ''
    }
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

/* ---------------- TID search ---------------- */
const tidSearch = async (val, update) => {
  if (!val) {
    update(() => (tidOptions.value = []))
    return
  }

  try {
    await store.dispatch('Merchant/FETCH_ALL_MERCHANTTID', val)
    update(() => {
      tidOptions.value = getMerchantTid.value
    })
  } catch {
    update(() => (tidOptions.value = []))
  }
}
</script>
