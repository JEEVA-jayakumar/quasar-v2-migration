<template>
  <q-dialog
    v-model="dialogModel"
    persistent
    class="customModalOverlay"
  >
    <q-card style="min-width: 30vw; padding: 30px;">
      <q-form @submit.prevent="submitMerchantTypeData">
        <!-- Title -->
        <div class="row q-py-sm items-center">
          <div class="col">
            <div class="text-h6 text-weight-regular">
              Add Merchant Type
            </div>
          </div>
        </div>

        <!-- Merchant Type -->
        <div class="q-py-sm">
          <q-input
            v-model="formData.merchantTypeName"
            label="Merchant Type"
            placeholder="Merchant Type"
            color="grey-9"
            class="text-grey-8"
            :error="v$.formData.merchantTypeName.$error"
            @blur="v$.formData.merchantTypeName.$touch()"
            @keyup.enter="submitMerchantTypeData"
          />
        </div>

        <!-- Mars Agreement ID -->
        <div class="q-py-sm">
          <q-input
            v-model.number="formData.marsAgreementId"
            label="Mars Agreement Id"
            placeholder="Mars Agreement Id"
            color="grey-9"
            class="text-grey-8"
            type="number"
            :error="v$.formData.marsAgreementId.$error"
            @blur="v$.formData.marsAgreementId.$touch()"
            @keyup.enter="submitMerchantTypeData"
          />
        </div>

        <!-- Actions -->
        <div class="row q-pt-md">
          <div class="col text-right">
            <q-btn
              flat
              class="text-grey-8"
              label="Cancel"
              @click="closeDialog"
            />
            <q-btn
              color="purple-9"
              label="Save"
              type="submit"
              class="q-ml-sm"
            />
          </div>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import useVuelidate from '@vuelidate/core'
import { required, integer } from '@vuelidate/validators'

/* ----------------------------------
   Props & Emits
---------------------------------- */
const props = defineProps({
  propShowCreateMerchantTypes: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['emitfnshowMerchantTypes'])

/* ----------------------------------
   Quasar & Store
---------------------------------- */
const $q = useQuasar()
const store = useStore()

/* ----------------------------------
   Dialog v-model sync
---------------------------------- */
const dialogModel = computed({
  get: () => props.propShowCreateMerchantTypes,
  set: () => closeDialog()
})

/* ----------------------------------
   Form State
---------------------------------- */
const formData = reactive({
  marsAgreementId: 0,
  merchantTypeName: ''
})

/* ----------------------------------
   Validation Rules
---------------------------------- */
const rules = {
  formData: {
    marsAgreementId: { required, integer },
    merchantTypeName: { required }
  }
}

const v$ = useVuelidate(rules, { formData })

/* ----------------------------------
   Methods
---------------------------------- */
function closeDialog () {
  emit('emitfnshowMerchantTypes')
}

async function submitMerchantTypeData () {
  v$.value.$touch()
  if (v$.value.$error) return

  $q.loading.show({
    delay: 100,
    message: 'Please Wait',
    spinnerColor: 'purple-9',
    customClass: 'shadow-none'
  })

  try {
    await store.dispatch('merchantTypes/ADD_NEW_MERCHANT_TYPE', formData)

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Merchant type successfully created!',
      icon: 'thumb_up'
    })

    emit('emitfnshowMerchantTypes', 'refresh')
  } catch (error) {

    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: error?.body?.message ?? 'Please Try Again Later !',
      icon: 'thumb_down'
    })
  } finally {
    $q.loading.hide()
  }
}
</script>

<style scoped>
.customModalOverlay {
  max-width: 100%;
}
</style>
