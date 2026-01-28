<template>
  <q-dialog
    v-model="toggleModel"
    persistent
    class="customModalOverlay"
  >
    <q-card style="min-width: 30vw">
      <q-card-section class="bottom-border">
        <div class="text-h6">User Mapping Information</div>
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <!-- Region -->
        <q-select
          v-model="userMapping.region.id"
          :options="propGetAllRegionsData"
          label="Choose a region"
          color="grey-9"
          :error="v$.userMapping.region.id.$error"
          @blur="v$.userMapping.region.id.$touch()"
        />

        <!-- Hierarchy -->
        <q-select
          v-model="userMapping.hierarchy.id"
          :options="propGetAllHierarchiesData"
          label="Choose a hierarchy"
          color="grey-9"
          :error="v$.userMapping.hierarchy.id.$error"
          @blur="v$.userMapping.hierarchy.id.$touch()"
          @update:model-value="fnPopulateRolesByHierarchy"
        />

        <!-- Role -->
        <q-select
          v-model="userMapping.role.id"
          :options="filterRoles"
          label="Choose a role"
          color="grey-9"
          :disable="disableRolesSelection"
          :error="v$.userMapping.role.id.$error"
          @blur="v$.userMapping.role.id.$touch()"
          @update:model-value="fnPopulateUsersByRole"
        />

        <!-- Predecessor -->
        <q-select
          v-model="userMapping.predecessor.id"
          :options="filterUsers"
          label="Choose a predecessor"
          color="grey-9"
          :disable="disablePredecessorSelection"
          :error="v$.userMapping.predecessor.id.$error"
          @blur="v$.userMapping.predecessor.id.$touch()"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancel"
          color="grey-8"
          @click="emitfnToggleModelCancel"
        />
        <q-btn
          label="Done"
          color="purple-9"
          @click="emitfnToggleModel"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

/* ---------------- Props & Emits ---------------- */
const props = defineProps({
  propDynamicHierarchyRoleRegion: Boolean,
  propGetAllRegionsData: Array,
  propGetAllHierarchiesData: Array
})

const emit = defineEmits([
  'emitfnToggleModelWithParams',
  'emitfnToggleModelCancel'
])

/* ---------------- Quasar / Store ---------------- */
const $q = useQuasar()
const store = useStore()

/* ---------------- State ---------------- */
const toggleModel = ref(props.propDynamicHierarchyRoleRegion)

watch(
  () => props.propDynamicHierarchyRoleRegion,
  val => (toggleModel.value = val)
)

const filterRoles = ref([])
const filterUsers = ref([])
const disableRolesSelection = ref(true)
const disablePredecessorSelection = ref(true)

const userMapping = ref({
  hierarchy: { id: '' },
  role: { id: '' },
  region: { id: '' },
  predecessor: { id: '' }
})

/* ---------------- Validation ---------------- */
const rules = {
  userMapping: {
    hierarchy: { id: { required } },
    role: { id: { required } },
    region: { id: { required } },
    predecessor: { id: { required } }
  }
}

const v$ = useVuelidate(rules, { userMapping })

/* ---------------- Vuex Getters ---------------- */
const rolesFromStore = computed(
  () => store.getters['SuperAdminUsers/getAllRolesForUserCreation']
)

const usersFromStore = computed(
  () => store.getters['SuperAdminUsers/getAllUsersForUserCreation']
)

/* ---------------- Methods ---------------- */
const emitfnToggleModel = () => {
  v$.value.$touch()
  if (v$.value.$error) {
    $q.notify({ message: 'Please review fields again.', color: 'negative' })
    return
  }
  emit('emitfnToggleModelWithParams', userMapping.value)
}

const emitfnToggleModelCancel = () => {
  emit('emitfnToggleModelCancel')
}

const fnPopulateRolesByHierarchy = async (hierarchyId) => {
  disableRolesSelection.value = true
  disablePredecessorSelection.value = true

  await store.dispatch(
    'SuperAdminUsers/FETCH_ROLES_BASED_ON_HEIRARCHY_ID_FOR_USER_CREATION',
    hierarchyId
  )

  filterRoles.value = rolesFromStore.value
    .filter(r => r.hierarchy.id === hierarchyId)
    .map(r => ({ label: r.role, value: r.id }))

  disableRolesSelection.value = filterRoles.value.length === 0
}

const fnPopulateUsersByRole = async () => {
  disablePredecessorSelection.value = true

  await store.dispatch(
    'SuperAdminUsers/FETCH_ALL_USERS_BY_ROLE_FOR_USER_CREATION_DATA',
    userMapping.value
  )

  filterUsers.value = usersFromStore.value.map(u => ({
    label: u.user.name,
    value: u.user.id
  }))

  if (filterUsers.value.length === 0) {
    $q.notify({
      color: 'primary',
      message: 'Invalid selection! Predecessor is mandatory',
      icon: 'info'
    })
  } else {
    disablePredecessorSelection.value = false
  }
}
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>
