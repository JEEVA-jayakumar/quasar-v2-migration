<template>
  <div>
    <q-dialog
      v-model="toggleModel"
      persistent
      class="customModalOverlay"
    >
      <q-card class="q-pa-md" style="min-width: 50vw">

        <!-- TITLE -->
        <div class="text-h6 q-mb-md">
          Add Issue Mapping
        </div>

        <!-- FORM -->
        <q-form @submit.prevent="fnfinalsubmitIssueMapping">

          <!-- ISSUE NAME -->
          <q-input
            v-model="formData.name"
            label="Enter Issue Mapping Name"
            placeholder="Enter Issue Mapping Name"
            dense
            color="grey-9"
            class="q-mb-md"
            :error="nameError"
            error-message="Issue Mapping Name is required"
          />

          <!-- CS SUB ISSUE LIST -->
          <div class="q-mb-md">
            <p class="text-weight-medium">CS Sub Issue *</p>

            <div
              v-for="menu in csSubIssueType"
              :key="menu.id"
              class="row items-center q-mb-sm"
            >
              <q-checkbox
                v-model="selectedItem"
                :val="menu"
                @update:model-value="getSelectedDetails(menu)"
              />
              <span class="q-ml-sm">{{ menu.name }}</span>
            </div>
          </div>

          <!-- ACTION BUTTONS -->
          <div class="row justify-end q-mt-md">
            <q-btn
              flat
              label="Cancel"
              class="text-grey-8"
              @click="emitfnShowAddNewIssueMapping"
            />
            <q-btn
              color="purple-9"
              label="Save"
              type="submit"
              class="q-ml-sm"
              :disable="selectedItem.length === 0"
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
  propShowAddIssueMapping: Boolean,
  propRowDetails: Object
})

const emit = defineEmits(['emitfnShowAddNewIssueMapping'])

/* QUASAR */
const $q = useQuasar()

/* STORE */
const store = useStore()

/* STATE */
const toggleModel = ref(props.propShowAddIssueMapping)

const csSubIssueType = ref([])
const selectedItem = ref([])
const reqData = ref([])

const formData = ref({
  name: ''
})

const touched = ref(false)

/* WATCH */
watch(
  () => props.propShowAddIssueMapping,
  val => (toggleModel.value = val)
)

/* COMPUTED */
const nameError = computed(() => {
  return touched.value && !formData.value.name
})

/* LIFECYCLE */
onMounted(() => {
  getcsSubIssueTypes()
})

/* METHODS */
const emitfnShowAddNewIssueMapping = (val) => {
  emit('emitfnShowAddNewIssueMapping', val)
}

const getSelectedDetails = (menu) => {
  reqData.value.push({ serviceReqIssueType: menu })
  formData.value.csSubIssueTypeSets = reqData.value
}

const getcsSubIssueTypes = async () => {
  try {
    await store.dispatch('serviceRequest/FETCH_ACTIVE_CS_SUB_ISSUE_DATAS')
    csSubIssueType.value = store.getters['serviceRequest/getcsActiveSubIssueDetails']
  } catch {
    csSubIssueType.value = []
  }
}

const fnfinalsubmitIssueMapping = async () => {
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

  const list = selectedItem.value.map(item => ({ id: item.id }))

  const param = {
    name: formData.value.name,
    csSubIssue: list
  }

  try {
    await store.dispatch('serviceRequest/UPDATE_ISSUE_MAPPING', param)

    $q.loading.hide()
    emitfnShowAddNewIssueMapping('refresh')

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Added Successfully',
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
