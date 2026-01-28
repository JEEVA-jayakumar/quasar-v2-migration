<template>
  <q-dialog
    v-model="localDialog"
    persistent
    class="customModalOverlay"
    @hide="closeModal"
  >
    <q-card style="min-width: 30vw; padding: 30px">
      <q-form @submit.prevent="submitHostData">
        <!-- Title -->
        <div class="row q-py-sm items-center">
          <div class="col-12">
            <div class="text-h6 text-weight-regular">
              Add New Host
            </div>
          </div>
        </div>

        <!-- Host Name -->
        <div class="row q-py-sm">
          <div class="col-12">
            <q-input
              v-model="formData.name"
              label="Enter Host"
              placeholder="Enter Host"
              color="grey-9"
              class="text-grey-8"
              :error="v$.formData.name.$error"
              @blur="v$.formData.name.$touch"
              @keyup.enter="submitHostData"
            />
          </div>
        </div>

        <!-- Host Code -->
        <div class="row q-py-sm">
          <div class="col-12">
            <q-input
              v-model="formData.hostRRCode"
              label="Enter Host Code"
              placeholder="Enter Host Code"
              color="grey-9"
              class="text-grey-8"
              :error="v$.formData.hostRRCode.$error"
              @blur="v$.formData.hostRRCode.$touch"
              @keyup.enter="submitHostData"
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="row q-pt-md">
          <div class="col-12 text-right">
            <q-btn
              flat
              class="text-grey-8"
              label="Cancel"
              @click="closeModal"
            />
            <q-btn
              color="purple-9"
              label="Save"
              class="q-ml-sm"
              type="submit"
            />
          </div>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

/* =====================
   Props & Emits
===================== */
const props = defineProps({
  propShowCreateHost: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['emitfnshowHost'])

/* =====================
   Quasar & Store
===================== */
const $q = useQuasar()
const store = useStore()

/* =====================
   Dialog Sync
===================== */
const localDialog = ref(props.propShowCreateHost)

watch(
  () => props.propShowCreateHost,
  val => {
    localDialog.value = val
  }
)

/* =====================
   Form Data
===================== */
const formData = reactive({
  name: '',
  hostRRCode: '',
  active: 1
})

/* =====================
   Validation
===================== */
const rules = {
  formData: {
    name: { required },
    hostRRCode: { required }
  }
}

const v$ = useVuelidate(rules, { formData })

/* =====================
   Methods
===================== */
function closeModal () {
  emit('emitfnshowHost')
}

async function submitHostData () {
  v$.value.$touch()
  if (v$.value.$error) return

  $q.loading.show({
    delay: 100,
    message: 'Please Wait',
    spinnerColor: 'purple-9'
  })

  try {
    await store.dispatch('Host/ADD_NEW_HOST', formData)

    $q.loading.hide()
    emit('emitfnshowHost', 'refresh')

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Host successfully created!',
      icon: 'thumb_up'
    })
  } catch (error) {

    $q.loading.hide()
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: error?.body?.message ?? 'Please Try Again Later !',
      icon: 'thumb_down'
    })
  }
}
</script>

<style scoped>
.customModalOverlay {
  z-index: 2000;
}
</style>
