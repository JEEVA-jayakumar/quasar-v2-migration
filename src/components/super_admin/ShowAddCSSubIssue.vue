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
          Add CS Sub Issue
        </div>

        <!-- FORM -->
        <q-form @submit.prevent="fnfinalsubmitAddCsSubIssue">

          <q-input
            v-model="formData.name"
            label="Enter CS Sub Issue"
            placeholder="Enter CS Sub Issue"
            dense
            color="grey-9"
            class="q-mb-md"
            :error="nameError"
            error-message="CS Sub Issue is required"
          />

          <!-- ACTION BUTTONS -->
          <div class="row justify-end q-mt-md">
            <q-btn
              flat
              label="Cancel"
              class="text-grey-8"
              @click="emitfnShowAddNewCsSubIssue"
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
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

/* PROPS & EMITS */
const props = defineProps({
  propShowAddCsSubIssue: Boolean,
  propRowDetails: Object
})

const emit = defineEmits(['emitfnShowAddNewCsSubIssue'])

/* QUASAR */
const $q = useQuasar()

/* STORE */
const store = useStore()

/* STATE */
const toggleModel = ref(props.propShowAddCsSubIssue)

const formData = ref({
  name: ''
})

const touched = ref(false)

/* WATCH */
watch(
  () => props.propShowAddCsSubIssue,
  val => (toggleModel.value = val)
)

/* COMPUTED */
const nameError = computed(() => {
  return touched.value && !formData.value.name
})

/* LIFECYCLE */
onMounted(() => {
  fnAddCsSubIssueDetails()
})

/* METHODS */
const emitfnShowAddNewCsSubIssue = (val) => {
  emit('emitfnShowAddNewCsSubIssue', val)
}

const fnAddCsSubIssueDetails = async () => {
  try {
    await store.dispatch('serviceRequest/FETCH_CS_SUB_ISSUE_DATAS')
  } catch {
    // silent fail (same as old behavior)
  }
}

const fnfinalsubmitAddCsSubIssue = async () => {
  touched.value = true

  if (!formData.value.name) {
    $q.notify('Please review fields again.')
    return
  }

  $q.loading.show({
    delay: 100,
    message: 'Please Wait',
    spinnerColor: 'purple-9',
    customClass: 'shadow-none'
  })

  try {
    await store.dispatch(
      'serviceRequest/POST_CS_SUB_ISSUE',
      formData.value
    )

    $q.loading.hide()
    emitfnShowAddNewCsSubIssue('refresh')

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Sub Task Added Successfully',
      icon: 'thumb_up'
    })
  } catch (error) {

    $q.loading.hide()
    $q.notify({
      type: 'warning',
      color: 'amber-9',
      position: 'bottom',
      message: error?.data?.message || 'Something went wrong'
    })
  }
}
</script>

<style scoped>
.customModalOverlay {
  z-index: 6000;
}
</style>
