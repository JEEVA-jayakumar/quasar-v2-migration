<template>
  <q-dialog
    v-model="toggleModel"
    persistent
    class="customModalOverlay"
  >
    <q-card style="padding: 30px; max-width: 30vw; width: 100%">
      <div class="row group">
        <!-- Header -->
        <div class="col-12 q-py-sm bottom-border">
          <span class="text-h6">User Mapping Information</span>
        </div>

        <!-- Region -->
        <div class="col-12 q-mt-md">
          <q-select
            v-model="userMapping.regionId"
            :options="propGetAllRegionsData"
            label="Choose a region"
            emit-value
            map-options
            :error="v$.userMapping.regionId.$error"
          />
        </div>

        <!-- Hierarchy -->
        <div class="col-12 q-mt-md">
          <q-select
            v-model="userMapping.hierarchy"
            :options="propGetAllHierarchiesData"
            label="Choose a hierarchy"
            emit-value
            map-options
            :error="v$.userMapping.hierarchy.$error"
            @update:model-value="fnPopulateRolesByHierarchy"
          />
        </div>

        <!-- Role -->
        <div class="col-12 q-mt-md">
          <q-select
            v-model="userMapping.roleId"
            :options="filterRoles"
            label="Choose a role"
            emit-value
            map-options
            :disable="disableRolesSelection"
            :error="v$.userMapping.roleId.$error"
            @update:model-value="fnPopulateUsersByRole"
          />
        </div>

        <!-- Predecessor -->
        <div class="col-12 q-mt-md">
          <q-select
            v-model="userMapping.predecessorId"
            :options="filterUsers"
            label="Choose a predecessor"
            emit-value
            map-options
            :disable="disablePreceederSelection"
            :error="v$.userMapping.predecessorId.$error"
          />
        </div>

        <!-- Actions -->
        <div class="col-12 q-mt-lg text-right">
          <q-btn
            flat
            class="text-grey-8"
            label="Cancel"
            @click="emitfnToggleModelCancel"
          />
          <q-btn
            color="purple-9"
            label="Done"
            class="q-ml-sm"
            @click="emitfnToggleModel"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
/* ----------------------------------------
   Imports
-----------------------------------------*/
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import useVuelidate from '@vuelidate/core'
import { required, requiredIf } from '@vuelidate/validators'

/* ----------------------------------------
   Props & Emits
-----------------------------------------*/
const props = defineProps({
  propDynamicHierarchyRoleRegion: Boolean,
  propFilterRoles: Array,
  propGetAllRegionsData: Array,
  propGetAllHierarchiesData: Array,
  propDetailsForEdit: Object
})

const emit = defineEmits([
  'emitfnToggleModelWithParams',
  'emitfnToggleModelCancelEdit'
])

/* ----------------------------------------
   Core Setup
-----------------------------------------*/
const $q = useQuasar()
const store = useStore()

const toggleModel = ref(props.propDynamicHierarchyRoleRegion)

watch(
  () => props.propDynamicHierarchyRoleRegion,
  val => (toggleModel.value = val)
)

/* ----------------------------------------
   State
-----------------------------------------*/
const filterRoles = ref([])
const filterUsers = ref([])
const disableRolesSelection = ref(true)
const disablePreceederSelection = ref(true)

const userMapping = reactive({
  index: props.propDetailsForEdit?.index ?? null,
  hierarchy: props.propDetailsForEdit?.hierarchy ?? null,
  roleId: props.propDetailsForEdit?.roleId ?? null,
  regionId: props.propDetailsForEdit?.regionId ?? null,
  predecessorId: props.propDetailsForEdit?.predecessorId ?? null
})

/* ----------------------------------------
   Validation
-----------------------------------------*/
const rules = computed(() => ({
  userMapping: {
    hierarchy: { required },
    roleId: { required },
    regionId: { required },
    predecessorId: {
      required: requiredIf(() => filterUsers.value.length > 0)
    }
  }
}))

const v$ = useVuelidate(rules, { userMapping })

/* ----------------------------------------
   Vuex Getters
-----------------------------------------*/
const getAllRoles = computed(() =>
  store.getters['SuperAdminUsers/getAllRoles']
)

const getAllUsers = computed(() =>
  store.getters['SuperAdminUsers/getAllUsers']
)

/* ----------------------------------------
   Methods
-----------------------------------------*/
const emitfnToggleModel = async () => {
  await v$.value.$validate()
  if (v$.value.$error) {
    $q.notify('Please review fields again.')
    return
  }
  emit('emitfnToggleModelWithParams', { ...userMapping })
}

const emitfnToggleModelCancel = () => {
  emit('emitfnToggleModelCancelEdit')
}

const fnPopulateRolesByHierarchy = async () => {
  disableRolesSelection.value = true
  disablePreceederSelection.value = true

  await store.dispatch(
    'SuperAdminUsers/FETCH_ROLES_BASED_ON_HEIRARCHY_ID',
    userMapping.hierarchy
  )

  filterRoles.value = getAllRoles.value
    .filter(r => r.hierarchy.id === userMapping.hierarchy)
    .map(r => ({
      label: r.role,
      value: r.id
    }))

  disableRolesSelection.value = filterRoles.value.length === 0
}

const fnPopulateUsersByRole = async () => {
  disablePreceederSelection.value = true

  await store.dispatch(
    'SuperAdminUsers/FETCH_ALL_USERS_BY_ROLE_DATA',
    userMapping.roleId
  )

  filterUsers.value = getAllUsers.value.map(u => ({
    label: u.name,
    value: u.id
  }))

  if (filterUsers.value.length === 0) {
    userMapping.predecessorId = null
    $q.notify({
      color: 'primary',
      position: 'bottom',
      message: 'You can continue without predecessor selection',
      icon: 'info'
    })
  } else {
    disablePreceederSelection.value = false
  }
}

/* ----------------------------------------
   Lifecycle
-----------------------------------------*/
onMounted(() => {
  if (userMapping.hierarchy) {
    fnPopulateRolesByHierarchy()
  }
  if (userMapping.roleId) {
    fnPopulateUsersByRole()
  }
})
</script>
