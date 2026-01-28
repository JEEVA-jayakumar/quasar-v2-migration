<template>
  <div>
    <q-dialog
      v-model="toggleModel"
      persistent
      class="customModalOverlay"
    >
      <q-card class="q-pa-md" style="min-width: 30vw">

        <!-- TITLE -->
        <div class="text-h6 q-mb-md">
          Add New Aggregators
        </div>

        <!-- FORM -->
        <q-form @submit.prevent="fnfinalsubmitAddNewAggregators">

          <!-- AGGREGATOR NAME -->
          <q-input
            v-model="formData.name"
            label="Enter Aggregator *"
            placeholder="Enter Aggregator *"
            dense
            color="grey-9"
            class="q-mb-md"
            :error="nameError"
            error-message="Aggregator name is required"
          />

          <!-- ACTION BUTTONS -->
          <div class="row justify-end q-mt-md">
            <q-btn
              flat
              label="Cancel"
              class="text-grey-8"
              @click="emitfnShowAddNewAggregators"
            />
            <q-btn
              color="purple-9"
              label="Save"
              type="submit"
              class="q-ml-sm"
            />
          </div>

        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

/* PROPS & EMITS */
const props = defineProps({
  propShowAddNewAggregators: Boolean,
  propRowDetails: Object
})

const emit = defineEmits(['emitfnShowAddNewAggregators'])

/* QUASAR */
const $q = useQuasar()

/* STORE */
const store = useStore()

/* STATE */
const toggleModel = ref(props.propShowAddNewAggregators)

const formData = ref({
  name: ''
})

const touched = ref(false)

/* WATCH */
watch(
  () => props.propShowAddNewAggregators,
  val => (toggleModel.value = val)
)

/* VALIDATION */
const nameError = computed(() => {
  return touched.value && !formData.value.name
})

/* METHODS */
const emitfnShowAddNewAggregators = () => {
  emit('emitfnShowAddNewAggregators')
}

const fnfinalsubmitAddNewAggregators = async () => {
  touched.value = true

  if (!formData.value.name) {
    $q.notify('Please review fields again.')
    return
  }

  $q.loading.show()

  try {
    await store.dispatch(
      'superAdminAggregators/CREATE_AGGREGATORS',
      formData.value
    )

    $q.loading.hide()
    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Successfully Created!',
      icon: 'thumb_up'
    })

    emitfnShowAddNewAggregators()

    // Keeping EXACT existing behavior
    location.reload()
  } catch (error) {

    $q.loading.hide()
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message:
        error?.body?.message ?? 'Please Try Again Later !',
      icon: 'thumb_down'
    })
  }
}
</script>

<style scoped>
.customModalOverlay {
  z-index: 6000;
}
</style>
