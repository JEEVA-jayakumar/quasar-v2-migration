<template>
  <q-dialog
    v-model="showCreateHierarchyToggle"
    persistent
    @hide="emitfnCreateHierarchyDetails"
  >
    <q-card class="customModalOverlay" style="padding:30px; min-width:30vw">
      
      <!-- Header -->
      <q-card-section class="row items-center q-pa-md bottom-border">
        <div class="text-h6 text-weight-regular">Create Hierarchy</div>
      </q-card-section>

      <!-- Form -->
      <q-card-section class="q-pa-md column">
        <!-- Hierarchy Name -->
        <q-input
          v-model="formData.HierarchyDetails.hierarchy"
          label="Hierarchy"
          placeholder="Hierarchy"
          color="grey-9"
          class="text-grey-8 q-my-sm"
          :error="v$.value.formData.HierarchyDetails.hierarchy.$error"
          error-message="Hierarchy is required"
          @blur="v$.value.formData.HierarchyDetails.hierarchy.$touch()"
        />

        <!-- Hierarchy Code -->
        <q-input
          v-model="formData.HierarchyDetails.hierarchyCode"
          label="Hierarchy Code"
          placeholder="Hierarchy Code"
          color="grey-9"
          class="text-grey-8 q-my-sm"
          :error="v$.value.formData.HierarchyDetails.hierarchyCode.$error"
          error-message="Hierarchy Code is required"
          @blur="v$.value.formData.HierarchyDetails.hierarchyCode.$touch()"
        />
      </q-card-section>

      <!-- Actions -->
      <q-card-section class="row justify-end q-pa-md">
        <q-btn
          flat
          size="md"
          label="Cancel"
          color="grey-8"
          class="bg-white q-mr-sm"
          @click="emitfnCreateHierarchyDetails"
        />
        <q-btn
          size="md"
          label="Save"
          color="purple-9"
          @click="fnCreateHierarchySubmit"
        />
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

/* ---------------- Props & Emits ---------------- */
const props = defineProps({
  propShowCreateHierarchy: { type: Boolean, required: true }
})
const emit = defineEmits(['emitCreateHierarchyDetails'])

/* ---------------- State ---------------- */
const $q = useQuasar()
const store = useStore()

const showCreateHierarchyToggle = ref(props.propShowCreateHierarchy)
watch(() => props.propShowCreateHierarchy, val => (showCreateHierarchyToggle.value = val))

const formData = reactive({
  HierarchyDetails: {
    hierarchy: '',
    hierarchyCode: ''
  }
})

/* ---------------- Validation ---------------- */
const rules = {
  formData: {
    HierarchyDetails: {
      hierarchy: { required },
      hierarchyCode: { required }
    }
  }
}
const v$ = useVuelidate(rules, { formData })

/* ---------------- Vuex Actions ---------------- */
const FEED_NEW_HIERARCHY_DATA = payload => store.dispatch('SuperAdminUsers/FEED_NEW_HIERARCHY_DATA', payload)
const FETCH_ALL_HIERARCHIES_DATA = () => store.dispatch('SuperAdminUsers/FETCH_ALL_HIERARCHIES_DATA')

/* ---------------- Methods ---------------- */
const emitfnCreateHierarchyDetails = () => {
  emit('emitCreateHierarchyDetails', showCreateHierarchyToggle.value)
}

const fnCreateHierarchySubmit = async () => {
  v$.value.$touch()
  if (v$.value.$error) {
    $q.notify('Please review fields again.')
    return
  }

  $q.loading.show({ message: 'Please Wait', spinnerColor: 'purple-9' })

  try {
    await FEED_NEW_HIERARCHY_DATA(formData.HierarchyDetails)
    await FETCH_ALL_HIERARCHIES_DATA()
    emitfnCreateHierarchyDetails()
    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Successfully created!',
      icon: 'thumb_up'
    })
  } catch (error) {

    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: error?.body?.message ?? 'Please Try Again Later!',
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
