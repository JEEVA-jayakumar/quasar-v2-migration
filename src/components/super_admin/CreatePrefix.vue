<template>
  <q-dialog
    v-model="dialogModel"
    persistent
    class="customModalOverlay"
  >
    <q-card style="min-width: 30vw; padding: 30px;">
      <q-form @submit.prevent="submitHostData">
        <!-- Title -->
        <div class="row q-py-sm items-center">
          <div class="col">
            <div class="text-h6 text-weight-regular">
              Add Prefix
            </div>
          </div>
        </div>

        <!-- Prefix Name -->
        <div class="q-py-sm">
          <q-input
            v-model="formData.name"
            label="Enter Prefix"
            placeholder="Enter Prefix"
            color="grey-9"
            class="text-grey-8"
            :error="v$.formData.name.$error"
            @blur="v$.formData.name.$touch()"
            @keyup.enter="submitHostData"
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
import { required } from '@vuelidate/validators'

/* ----------------------------------
   Props & Emits
---------------------------------- */
const props = defineProps({
  propShowCreatePrefix: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits([
  'emitfnshowPrefix',
  'emitfnshowHost'
])

/* ----------------------------------
   Quasar & Store
---------------------------------- */
const $q = useQuasar()
const store = useStore()

/* ----------------------------------
   Dialog v-model sync
---------------------------------- */
const dialogModel = computed({
  get: () => props.propShowCreatePrefix,
  set: () => closeDialog()
})

/* ----------------------------------
   Form State
---------------------------------- */
const formData = reactive({
  name: '',
  hostCode: ''
})

/* ----------------------------------
   Validation Rules
---------------------------------- */
const rules = {
  formData: {
    name: { required },
    hostCode: { required }
  }
}

const v$ = useVuelidate(rules, { formData })

/* ----------------------------------
   Methods
---------------------------------- */
function closeDialog () {
  emit('emitfnshowPrefix')
}

async function submitHostData () {
  v$.value.$touch()
  if (v$.value.$error) return

  $q.loading.show({
    delay: 100,
    message: 'Please Wait',
    spinnerColor: 'purple-9',
    customClass: 'shadow-none'
  })

  try {
    await store.dispatch('Host/ADD_NEW_HOST', formData)

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Host successfully created!',
      icon: 'thumb_up'
    })

    emit('emitfnshowHost', 'refresh')
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
