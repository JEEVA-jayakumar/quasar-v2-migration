<template>
  <q-dialog
    v-model="toggleModel"
    persistent
    @hide="emitfnShowAddNewSpares"
  >
    <q-card class="q-pa-lg" style="min-width: 30vw">
      <form @submit.prevent="fnfinalsubmitAddNewSpares">
        <!-- Title -->
        <div class="row q-py-sm">
          <div class="col-12 text-h6 text-weight-regular">
            Add New Spares
          </div>
        </div>

        <!-- Spare Name -->
        <div class="row q-py-sm">
          <div class="col-12">
            <q-input
              v-model="formData.spareName"
              label="Enter Spare Parts Name *"
              color="grey-9"
              :error="v$.formData.spareName.$error"
              error-message="Spare name is required"
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="row q-py-sm justify-end">
          <q-btn
            flat
            label="Cancel"
            class="text-grey-8"
            @click="emitfnShowAddNewSpares"
          />
          <q-btn
            color="purple-9"
            label="Save"
            type="submit"
            class="q-ml-sm"
          />
        </div>
      </form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

/* =========================
   Props & Emits
========================= */
const props = defineProps({
  propShowAddNewSpares: {
    type: Boolean,
    required: true
  },
  propRowDetails: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['emitfnShowAddNewSpares'])

/* =========================
   Quasar & Store
========================= */
const $q = useQuasar()
const store = useStore()

/* =========================
   State
========================= */
const toggleModel = ref(props.propShowAddNewSpares)

const formData = ref({
  spareName: ''
})

/* =========================
   Validation
========================= */
const rules = {
  formData: {
    spareName: { required }
  }
}

const v$ = useVuelidate(rules, { formData })

/* =========================
   Watch dialog prop
========================= */
watch(
  () => props.propShowAddNewSpares,
  val => {
    toggleModel.value = val
  }
)

/* =========================
   Methods
========================= */
const emitfnShowAddNewSpares = () => {
  emit('emitfnShowAddNewSpares')
}

const fnfinalsubmitAddNewSpares = async () => {
  v$.value.$touch()

  if (v$.value.$invalid) {
    $q.notify({
      type: 'negative',
      message: 'Please review fields again.'
    })
    return
  }

  try {
    $q.loading.show()

    await store.dispatch(
      'SuperAdminUsers/FEED_EXISTING_REGION_DATA',
      formData.value
    )

    await store.dispatch('SuperAdminUsers/FETCH_ALL_REGIONS_DATA')

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Successfully updated!',
      icon: 'thumb_up'
    })

    emitfnShowAddNewSpares()
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
/* existing styles can remain */
</style>
