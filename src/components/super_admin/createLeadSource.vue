<template>
  <q-dialog
    v-model="localDialog"
    persistent
    class="customModalOverlay"
    @hide="closeModal"
  >
    <q-card style="min-width: 30vw; padding: 30px">
      <q-form @submit.prevent="submitLeadSourceData">

        <!-- Title -->
        <div class="row q-py-sm items-center">
          <div class="col-12">
            <div class="text-h6 text-weight-regular">
              Add Lead Source
            </div>
          </div>
        </div>

        <!-- Lead Source Name -->
        <div class="q-py-sm">
          <q-input
            v-model="formData.sourceName"
            label="Lead Source"
            placeholder="Lead Source"
            color="grey-9"
            class="text-grey-8"
            :error="v$.formData.sourceName.$error"
            @blur="v$.formData.sourceName.$touch"
          />
        </div>

        <!-- Source Code -->
        <div class="q-py-sm">
          <q-input
            v-model="formData.sourceCode"
            label="Enter Source Code"
            placeholder="Enter Source Code"
            color="grey-9"
            class="text-grey-8"
            :error="v$.formData.sourceCode.$error"
            @blur="v$.formData.sourceCode.$touch"
          />
        </div>

        <!-- Multi TID -->
        <div class="q-py-sm">
          <p class="q-caption">Multi-TID</p>
          <q-option-group
            v-model="formData.multiTidEnabled"
            :options="multiTidFlagOptions"
            type="radio"
            color="grey-9"
            inline
          />
          <div
            v-if="v$.formData.multiTidEnabled.$error"
            class="text-negative q-caption q-mt-xs"
          >
            Required
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
  propShowCreateLeadSource: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['emitfnshowLeadSources'])

/* =====================
   Quasar & Store
===================== */
const $q = useQuasar()
const store = useStore()

/* =====================
   Dialog Sync
===================== */
const localDialog = ref(props.propShowCreateLeadSource)

watch(
  () => props.propShowCreateLeadSource,
  val => {
    localDialog.value = val
  }
)

/* =====================
   Options
===================== */
const multiTidFlagOptions = [
  { label: 'Yes', value: true },
  { label: 'No', value: false }
]

/* =====================
   Form Data
===================== */
const formData = reactive({
  bank_enable: 'False',
  sourceName: '',
  sourceCode: '',
  multiTidEnabled: false
})

/* =====================
   Validation
===================== */
const rules = {
  formData: {
    sourceName: { required },
    sourceCode: { required },
    multiTidEnabled: { required }
  }
}

const v$ = useVuelidate(rules, { formData })

/* =====================
   Methods
===================== */
function closeModal () {
  emit('emitfnshowLeadSources')
}

async function submitLeadSourceData () {
  v$.value.$touch()
  if (v$.value.$error) return

  $q.loading.show({
    delay: 100,
    message: 'Please Wait',
    spinnerColor: 'purple-9'
  })

  try {
    await store.dispatch('leadSource/ADD_NEW_LEAD_SOURCE', formData)

    $q.loading.hide()
    emit('emitfnshowLeadSources', 'refresh')

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Lead Source successfully created!',
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
