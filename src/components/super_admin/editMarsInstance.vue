<template>
  <q-dialog
    v-model="dialogModel"
    persistent
    @hide="toggleModal"
  >
    <q-card class="customModalOverlay" style="min-width: 30vw">
      <q-card-section class="q-pa-lg">

        <!-- Title -->
        <div class="row q-pb-md">
          <div class="col text-h6 text-weight-regular">
            Edit Mars Instance
          </div>
        </div>

        <!-- Form -->
        <q-form @submit.prevent="submitMarsInstanceData">

          <q-input
            v-model="formData.institutionName"
            label="Institution Name"
            placeholder="Institution Name"
            color="grey-9"
            class="q-mb-md"
            :error="v$.institutionName.$error"
            @blur="v$.institutionName.$touch"
          />

          <q-input
            v-model="formData.institutionRRCode"
            label="Institution RR Code"
            placeholder="Institution RR Code"
            color="grey-9"
            class="q-mb-md"
            :error="v$.institutionRRCode.$error"
            @blur="v$.institutionRRCode.$touch"
          />

          <q-input
            v-model="formData.institutionCode"
            label="Institution Code"
            placeholder="Institution Code"
            disable
            color="grey-9"
            class="q-mb-md"
            :error="v$.institutionCode.$error"
          />

          <!-- Actions -->
          <div class="row justify-end q-pt-md">
            <q-btn
              flat
              label="Cancel"
              class="text-grey-8 q-mr-sm"
              @click="toggleModal"
            />
            <q-btn
              color="purple-9"
              label="Save"
              type="submit"
            />
          </div>

        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
/* =======================
   Imports
======================= */
import { reactive, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

/* =======================
   Props & Emits
======================= */
const props = defineProps({
  propShowEditMarsInstance: {
    type: Boolean,
    required: true
  },
  propRowDetails: {
    type: Object,
    required: true
  }
})

const emit = defineEmits([
  'emitfnshowMarsInstance',
  'emitfnForLeadSourceTableRefresh'
])

/* =======================
   Quasar & Store
======================= */
const $q = useQuasar()
const store = useStore()

/* =======================
   Dialog State
======================= */
const dialogModel = ref(props.propShowEditMarsInstance)

watch(
  () => props.propShowEditMarsInstance,
  val => (dialogModel.value = val)
)

/* =======================
   Form Data
======================= */
const formData = reactive({
  institutionName: props.propRowDetails.institutionName,
  institutionRRCode: props.propRowDetails.institutionRRCode,
  institutionCode: props.propRowDetails.institutionCode,
  id: props.propRowDetails.id,
  institutionActive: 1
})

/* =======================
   Validation Rules
======================= */
const rules = {
  institutionName: { required },
  institutionRRCode: { required },
  institutionCode: { required }
}

const v$ = useVuelidate(rules, formData)

/* =======================
   Methods
======================= */
const toggleModal = () => {
  emit('emitfnshowMarsInstance')
}

const submitMarsInstanceData = async () => {
  v$.value.$touch()

  if (v$.value.$invalid) return

  $q.loading.show({
    delay: 100,
    message: 'Please Wait',
    spinnerColor: 'purple-9'
  })

  try {
    await store.dispatch('MarsInstance/UPDATE_INSTANCE', formData)

    $q.notify({
      type: 'positive',
      position: 'bottom',
      message: 'Instance successfully updated!',
      icon: 'thumb_up'
    })

    emit('emitfnshowMarsInstance', 'refresh')
  } catch (error) {

    $q.notify({
      type: 'negative',
      position: 'bottom',
      message: error?.body?.message || 'Please Try Again Later !',
      icon: 'thumb_down'
    })
  } finally {
    $q.loading.hide()
  }
}
</script>

<style scoped>
.customModalOverlay {
  border-radius: 8px;
}
</style>
