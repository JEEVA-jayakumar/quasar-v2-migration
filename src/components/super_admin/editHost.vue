<template>
  <q-dialog
    v-model="localToggle"
    persistent
    class="customModalOverlay"
  >
    <q-card style="padding: 30px; min-width: 30vw">
      <form @submit.prevent="submitUpdatedHost">
        <!-- Header -->
        <div class="row q-py-sm items-center">
          <div class="col-12">
            <div class="text-h6 text-weight-regular">Edit Host</div>
          </div>
        </div>

        <!-- Host Name -->
        <div class="row q-py-sm">
          <div class="col-12">
            <q-input
              v-model="formData.name"
              label="Host Name"
              placeholder="Host Name"
              color="grey-9"
              :error="v$.formData.name.$error"
              @blur="v$.formData.name.$touch"
              @keyup.enter="submitUpdatedHost"
            />
          </div>
        </div>

        <!-- Host Code -->
        <div class="row q-py-sm">
          <div class="col-12">
            <q-input
              v-model="formData.hostRRCode"
              label="Host Code"
              placeholder="Host Code"
              color="grey-9"
              :error="v$.formData.hostRRCode.$error"
              @blur="v$.formData.hostRRCode.$touch"
              @keyup.enter="submitUpdatedHost"
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="row q-py-sm">
          <div class="col-12 text-right">
            <q-btn
              flat
              class="text-grey-8"
              label="Cancel"
              @click="toggleModal"
            />
            <q-btn
              class="q-ml-sm"
              color="purple-9"
              label="Save"
              type="submit"
            />
          </div>
        </div>
      </form>
    </q-card>
  </q-dialog>
</template>

<script setup>
/* ------------------------------------------------
   Imports
-------------------------------------------------*/
import { reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

/* ------------------------------------------------
   Props & Emits
-------------------------------------------------*/
const props = defineProps({
  propShowEditHost: Boolean,
  propRowDetails: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['emitfnshowHost'])

/* ------------------------------------------------
   Core Setup
-------------------------------------------------*/
const $q = useQuasar()
const store = useStore()

/* ------------------------------------------------
   Dialog State Sync
-------------------------------------------------*/
const localToggle = ref(props.propShowEditHost)

watch(
  () => props.propShowEditHost,
  val => (localToggle.value = val)
)

/* ------------------------------------------------
   Form Data
-------------------------------------------------*/
const formData = reactive({
  name: props.propRowDetails.name,
  hostRRCode: props.propRowDetails.hostRRCode,
  id: props.propRowDetails.id,
  active: 1
})

/* ------------------------------------------------
   Validation
-------------------------------------------------*/
const rules = {
  formData: {
    name: { required },
    hostRRCode: { required }
  }
}

const v$ = useVuelidate(rules, { formData })

/* ------------------------------------------------
   Methods
-------------------------------------------------*/
const toggleModal = () => {
  emit('emitfnshowHost')
}

const submitUpdatedHost = async () => {
  await v$.value.$validate()

  if (v$.value.$error) return

  $q.loading.show({
    delay: 100,
    message: 'Please Wait',
    spinnerColor: 'purple-9'
  })

  try {
    await store.dispatch('Host/UPDATE_HOST', formData)

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Host successfully updated!',
      icon: 'thumb_up'
    })

    emit('emitfnshowHost', 'refresh')
  } catch (error) {

    $q.notify({
      color: 'negative',
      position: 'bottom',
      message:
        error?.body?.message ?? 'Please Try Again Later !',
      icon: 'thumb_down'
    })
  } finally {
    $q.loading.hide()
  }
}
</script>

<style scoped>
/* no changes needed */
</style>
