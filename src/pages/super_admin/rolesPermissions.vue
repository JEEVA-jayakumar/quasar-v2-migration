<template>
  <q-page class="q-pa-md">
    <q-tabs
      v-model="selectedTab"
      class="shadow-1"
      color="grey-1"
      @update:model-value="changeTabs"
    >
      <q-tab name="active" label="Active Roles" />
      <q-tab name="deactive" label="Deactive Roles" />
    </q-tabs>

    <q-tab-panels v-model="selectedTab" animated>
      <!-- ACTIVE ROLES -->
      <q-tab-panel name="active">
        <q-table
          :rows="activeTableData"
          :columns="columns"
          row-key="id"
          color="grey-9"
          :filter="filterSearch"
          v-model:pagination="paginationControl"
          :filter-method="myCustomSearchFilter"
          class="customSATableClass"
        >
          <!-- ACTION COLUMN -->
          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <div class="row no-wrap">
                <q-btn
                  flat
                  dense
                  no-caps
                  icon="far fa-plus-square"
                  label="Modify Role/Permissions"
                  class="text-light-blue"
                  @click="fnShowEditRole(props.row)"
                />
                <q-btn
                  flat
                  dense
                  no-caps
                  icon="far fa-minus-square"
                  label="Disable Role"
                  class="text-negative"
                  @click="fnDisableRole(props.row)"
                />
              </div>
            </q-td>
          </template>

          <!-- TOP SLOT -->
          <template v-slot:top>
            <div class="row full-width items-center">
              <div class="col-6">
                <q-input
                  dense
                  outlined
                  clearable
                  v-model="filterSearch"
                  placeholder="Type.."
                  color="grey-9"
                />
              </div>
              <div class="col-6 text-right">
                <q-btn
                  no-caps
                  color="purple-9"
                  label="Add New Role"
                  @click="fnshowAddRoleModel"
                />
              </div>
            </div>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- DEACTIVE ROLES -->
      <q-tab-panel name="deactive">
        <q-table
          :rows="deactivatedTableData"
          :columns="columns1"
          row-key="id"
          color="grey-9"
          :filter="filterSearch1"
          v-model:pagination="paginationControl1"
          :filter-method="myCustomSearchFilter"
          class="customSATableClass"
        >
          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <q-btn
                flat
                dense
                no-caps
                icon="far fa-minus-square"
                label="Active"
                class="text-positive"
                @click="fnActiveRoles(props.row)"
              />
            </q-td>
          </template>

          <template v-slot:top>
            <div class="col-6">
              <q-input
                dense
                outlined
                clearable
                v-model="filterSearch1"
                placeholder="Type.."
                color="grey-9"
              />
            </div>
          </template>
        </q-table>
      </q-tab-panel>
    </q-tab-panels>

    <!-- CREATE ROLE -->
    <showCreateRole
      v-if="propShowCreateRole"
      :propGetAllHierarchiesData="getAllHierarchiesData"
      @emitCreaterolePermissions="fnshowCreateRole"
    />

    <!-- EDIT ROLE -->
    <showEditRole
      v-if="propShowEditRole"
      :propRowDetails="propRowDetails"
      :propGetAllHierarchiesData="getAllHierarchiesData"
      @emitfnEditrolePermissions="fnShowEditRole"
    />

    <!-- ADD ROLE -->
    <showAddRole
      v-if="showAddRoleModel"
      :propRowDetails="propRowDetails"
      @propsToggleModal1="fnshowAddRoleModel"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'

import showCreateRole from '../../components/super_admin/showCreateRole.vue'
import showEditRole from '../../components/super_admin/ShowEditRole.vue'
import showAddRole from '../../components/super_admin/showAddRole.vue'

const $q = useQuasar()
const store = useStore()

const selectedTab = ref('active')
const filterSearch = ref('')
const filterSearch1 = ref('')
const propShowCreateRole = ref(false)
const propShowEditRole = ref(false)
const showAddRoleModel = ref(false)
const propRowDetails = ref(null)

const paginationControl = ref({ rowsPerPage: 10 })
const paginationControl1 = ref({ rowsPerPage: 10 })

const getAllRolesPermissions = computed(
  () => store.getters['SuperAdminUsers/getAllRolesPermissions']
)
const getAllHierarchiesData = computed(
  () => store.getters['SuperAdminUsers/getAllHierarchiesData']
)

const activeTableData = computed(() =>
  getAllRolesPermissions.value.filter(r => r.active)
)
const deactivatedTableData = computed(() =>
  getAllRolesPermissions.value.filter(r => !r.active)
)

const columns = [
  {
    name: 'hierarchy',
    label: 'Hierarchy',
    field: row => row.hierarchy?.hierarchy || 'NA'
  },
  { name: 'role', label: 'Role', field: 'role' },
  { name: 'action', label: '', field: 'action' }
]

const columns1 = [...columns]

const changeTabs = () => ajaxLoadDataForRolesPermissions()

const fnshowCreateRole = () => (propShowCreateRole.value = !propShowCreateRole.value)
const fnshowAddRoleModel = row => {
  propRowDetails.value = row
  showAddRoleModel.value = !showAddRoleModel.value
}
const fnShowEditRole = row => {
  propRowDetails.value = row
  propShowEditRole.value = !propShowEditRole.value
}

const fnDisableRole = async row => {
  await store.dispatch('SuperAdminUsers/DELETE_ROLE_BY_ROLE_ID_DATA', row)
  ajaxLoadDataForRolesPermissions()
}

const fnActiveRoles = async row => {
  await store.dispatch('SuperAdminUsers/ACTIVATE_ROLE_BY_ROLE_ID_DATA', {
    id: row.id,
    role: row.role,
    roleColor: row.roleColor,
    hierarchyId: row.hierarchy.id
  })
  ajaxLoadDataForRolesPermissions()
}

const ajaxLoadDataForRolesPermissions = async () => {
  $q.loading.show({ spinnerColor: 'purple-9', message: 'Please Wait' })
  await store.dispatch('SuperAdminUsers/FETCH_ALL_ROLES_PERMISSIONS_DATA')
  $q.loading.hide()
}

const myCustomSearchFilter = (rows, terms, cols, cellValue) => {
  const lower = (terms || '').toLowerCase()
  return rows.filter(row =>
    cols.some(col =>
      String(cellValue(col, row)).toLowerCase().includes(lower)
    )
  )
}

onMounted(() => {
  ajaxLoadDataForRolesPermissions()
  store.dispatch('SuperAdminUsers/FETCH_ALL_HIERARCHIES_DATA')
})
</script>

<style scoped>
.customSATableClass {
  border-radius: 8px;
}
</style>
