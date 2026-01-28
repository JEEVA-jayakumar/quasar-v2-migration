<template>
  <q-dialog
    v-model="dialogModel"
    persistent
    class="customModalOverlay"
    @hide="emitToggleMyAccount"
  >
    <q-card
      class="q-pa-lg"
      style="min-width: 40vw"
    >
      <!-- Header -->
      <div class="row items-center q-pb-md bottom-border text-grey-9">
        <div class="col text-h6 text-weight-regular">
          Add Role / Permissions
        </div>
      </div>

      <!-- Hierarchy -->
      <div class="q-py-sm">
        <q-select
          v-model="formData.hierarchyId"
          label="Hierarchy"
          class="text-grey-8"
          color="grey-9"
          :options="getAllHierarchiesData"
        />
      </div>

      <!-- Role -->
      <div class="q-py-sm">
        <q-input
          v-model="formData.role"
          label="Role"
          @blur="v$.formData.role.$touch"
          :error="v$.formData.role.$error"
          class="text-grey-8"
          color="grey-9"
        />
      </div>

      <!-- Role Color -->
      <div class="q-py-sm">
        <q-color
          v-model="formData.roleColor"
          clearable
          @blur="v$.formData.roleColor.$touch"
          :error="v$.formData.roleColor.$error"
          label="Choose a role color"
          color="grey-9"
        />
      </div>

      <!-- Actions -->
      <div class="row justify-end q-pt-md">
        <q-btn
          flat
          label="Cancel"
          class="text-grey-8 q-mr-sm"
          @click="emitToggleMyAccount"
        />
        <q-btn
          color="purple-9"
          label="Save"
          @click="fnAddRoleSubmit"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

/* =========================
   Props & Emits
========================= */
const props = defineProps({
  propsToggleModal1: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['propsToggleModal1'])

/* =========================
   Plugins
========================= */
const $q = useQuasar()
const router = useRouter()
const store = useStore()

/* =========================
   State
========================= */
const dialogModel = ref(props.propsToggleModal1)

const formData = ref({
  roleColor: '',
  role: '',
  hierarchyId: ''
})

/* =========================
   Validation
========================= */
const rules = {
  formData: {
    roleColor: { required },
    role: { required }
  }
}

const v$ = useVuelidate(rules, { formData })

/* =========================
   Computed (Vuex Getters)
========================= */
const getAllHierarchiesData = computed(
  () => store.getters['SuperAdminUsers/getAllHierarchiesData']
)

/* =========================
   Watchers
========================= */
watch(
  () => props.propsToggleModal1,
  val => {
    dialogModel.value = val
  }
)

/* =========================
   Lifecycle
========================= */
onMounted(() => {
  store.dispatch('SuperAdminUsers/FETCH_ALL_HIERARCHIES_DATA')
})

/* =========================
   Methods
========================= */
const emitToggleMyAccount = () => {
  emit('propsToggleModal1', false)
}

const fnAddRoleSubmit = async () => {
  v$.value.$touch()

  if (v$.value.$error) {
    $q.notify('Please review fields again.')
    return
  }

  $q.loading.show({
    delay: 100,
    message: 'Please Wait',
    spinnerColor: 'purple-9'
  })

  try {
    await store.dispatch('addRole/UPDATE_ROLE_DATA', formData.value)

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Successfully updated!',
      icon: 'thumb_up'
    })

    router.push('/super/admin/roles/permissions/')
    emitToggleMyAccount()
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
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>
