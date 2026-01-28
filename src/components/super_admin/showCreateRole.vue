<template>
  <q-dialog
    v-model="showCreateRoleToggle"
    persistent
    @hide="emitfnCreaterolePermissions"
  >
    <q-card class="customModalOverlay" style="padding:30px; min-width:40vw">

      <!-- Header -->
      <q-card-section class="row items-center q-pa-md bottom-border">
        <div class="col">
          <div class="text-h6 text-weight-regular">Create Role/Permissions</div>
        </div>
        <div class="col-auto">
          <q-btn flat size="md" label="Cancel" color="grey-8" class="bg-white"
            @click="emitfnCreaterolePermissions" />
        </div>
        <div class="col-auto">
          <q-btn size="md" label="Save" color="purple-9"
            @click="fnCreateRoleSubmit" />
        </div>
      </q-card-section>

      <!-- Form -->
      <q-card-section class="column q-px-md q-py-sm">

        <!-- Hierarchy Select -->
        <q-select
          v-model="formData.rolePermissions.hierarchyId"
          :options="propGetAllHierarchiesData"
          label="Hierarchy"
          placeholder="Select Hierarchy"
          color="grey-9"
          class="text-grey-8 q-my-sm"
          @blur="v$.value.formData.rolePermissions.hierarchyId.$touch()"
          :error="v$.value.formData.rolePermissions.hierarchyId.$error"
          error-message="Hierarchy is required"
          use-input
          fill-input
          dense
          clearable
        />

        <!-- Role Name -->
        <q-input
          v-model.trim="formData.rolePermissions.name"
          label="Role"
          placeholder="Role"
          color="grey-9"
          class="text-grey-8 q-my-sm"
          @blur="v$.value.formData.rolePermissions.name.$touch()"
          :error="v$.value.formData.rolePermissions.name.$error"
          error-message="Role name is required (min 2 letters, letters only)"
        />

        <!-- Role Color -->
        <q-color
          v-model="formData.rolePermissions.roleColor"
          label="Choose a role color"
          popover
          color="grey-9"
          clearable
          @blur="v$.value.formData.rolePermissions.roleColor.$touch()"
          :error="v$.value.formData.rolePermissions.roleColor.$error"
          error-message="Role color is required"
          class="q-my-sm"
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
import { required, minLength, helpers } from '@vuelidate/validators'

// ---------------- Props & Emits ----------------
const props = defineProps({
  propGetAllHierarchiesData: { type: Array, default: () => [] },
  proprolePermissions: { type: Boolean, default: false }
})
const emit = defineEmits(['emitCreaterolePermissions'])

// ---------------- State ----------------
const $q = useQuasar()
const store = useStore()
const showCreateRoleToggle = ref(props.proprolePermissions)
watch(() => props.proprolePermissions, val => showCreateRoleToggle.value = val)

const formData = reactive({
  rolePermissions: {
    name: '',
    hierarchyId: '',
    roleColor: ''
  }
})

// ---------------- Validation ----------------
const alphaSpace = helpers.regex('alphaSpace', /^[A-Za-z\s]+$/)
const rules = {
  formData: {
    rolePermissions: {
      name: { required, alphaSpace, minLength: minLength(2) },
      hierarchyId: { required },
      roleColor: { required }
    }
  }
}
const v$ = useVuelidate(rules, { formData })

// ---------------- Vuex Actions ----------------
const FEED_NEW_ROLE_WITH_PERMISSIONS = payload =>
  store.dispatch('SuperAdminUsers/FEED_NEW_ROLE_WITH_PERMISSIONS', payload)
const FETCH_ALL_ROLES_PERMISSIONS_DATA = () =>
  store.dispatch('SuperAdminUsers/FETCH_ALL_ROLES_PERMISSIONS_DATA')

// ---------------- Methods ----------------
const emitfnCreaterolePermissions = () => {
  emit('emitCreaterolePermissions', showCreateRoleToggle.value)
}

const fnCreateRoleSubmit = async () => {
  v$.value.$touch()
  if (v$.value.$error) {
    $q.notify('Please review fields again.')
    return
  }

  const cookedRole = formData.rolePermissions.name.toUpperCase().replace(/\s+/g, '_')
  formData.rolePermissions.role = cookedRole

  $q.loading.show({ message: 'Please Wait', spinnerColor: 'purple-9' })
  try {
    await FEED_NEW_ROLE_WITH_PERMISSIONS(formData.rolePermissions)
    await FETCH_ALL_ROLES_PERMISSIONS_DATA()
    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Successfully created!',
      icon: 'thumb_up'
    })
    emitfnCreaterolePermissions()
  } catch {

    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Something went wrong',
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
