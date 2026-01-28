<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="min-width: 35vw; padding: 30px">
      <div class="text-h6 q-py-md">Forgot Password</div>

      <q-input
        v-model.trim="formData.email"
        label="Email"
        placeholder="Enter your email"
        color="grey-9"
        class="q-py-md"
        @blur="v$.formData.email.$touch"
        :error="v$.formData.email.$error"
        error-message="Please enter a valid email"
      />

      <div class="row justify-end q-mt-md">
        <q-btn
          flat
          color="grey-9"
          class="q-mr-sm"
          label="Cancel"
          @click="closeModal"
        />

        <q-btn
          color="negative"
          label="Send Email"
          @click="sendForgotPassword"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'

import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

/* ---------------------------------
 * Props & Emits
 * --------------------------------- */
const props = defineProps({
  propShowForgetPassword: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['emitfnShowForgetPasswordModal'])

/* ---------------------------------
 * State
 * --------------------------------- */
const isOpen = computed({
  get: () => props.propShowForgetPassword,
  set: () => emit('emitfnShowForgetPasswordModal')
})

const formData = reactive({
  email: ''
})

/* ---------------------------------
 * Validation
 * --------------------------------- */
const rules = {
  formData: {
    email: { required, email }
  }
}

const v$ = useVuelidate(rules, { formData })

/* ---------------------------------
 * Quasar / Router / Store
 * --------------------------------- */
const $q = useQuasar()
const router = useRouter()
const store = useStore()

/* ---------------------------------
 * Methods
 * --------------------------------- */
function closeModal () {
  emit('emitfnShowForgetPasswordModal')
}

async function sendForgotPassword () {
  v$.value.$touch()

  if (v$.value.$error) {
    $q.notify({
      color: 'negative',
      message: 'Please review fields again.'
    })
    return
  }

  try {
    $q.loading.show({
      spinnerColor: 'purple-9',
      message: 'Please wait...'
    })

    await store.dispatch(
      'Authentication/SEND_FORGOT_PASSWORD_LINK_MAIL',
      { email: formData.email }
    )

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'An email has been sent to you!',
      icon: 'thumb_up'
    })

    closeModal()
    router.push({ name: 'login' })
  } catch (error) {

    $q.notify({
      color: 'negative',
      position: 'bottom',
      message:
        error?.body?.message || 'Please Try Again Later !',
      icon: 'thumb_down'
    })
  } finally {
    $q.loading.hide()
  }
}
</script>
