<template>
  <q-page>
    <div>
      <q-table
        :rows="getAllPermissionData"
        :columns="columns"
        row-key="id"
        table-class="customSATableClass"
        color="grey-9"
        :filter="filterSearch"
        :filter-method="myCustomSearchFilter"
        v-model:pagination="paginationControl"
      >
        <!-- Permission Column -->
        <template v-slot:body-cell-permission="props">
          <q-td :props="props">
            {{ props.row.label }}
          </q-td>
        </template>

        <!-- Action Column -->
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <div class="row no-wrap no-padding">
              <q-btn
                dense
                flat
                no-caps
                label="Modify"
                icon="far fa-plus-square"
                size="md"
                class="text-light-blue"
                @click="fnShowEditPermission(props.row)"
              />
            </div>
          </q-td>
        </template>

        <!-- Top Slot -->
        <template v-slot:top>
          <div class="col-12 q-title q-my-lg text-weight-regular">
            Permissions
          </div>

          <div class="col-md-6">
            <q-input
              v-model="filterSearch"
              clearable
              placeholder="Type.."
              color="grey-9"
              class="q-mr-lg"
            />
          </div>
        </template>
      </q-table>

      <!-- Create Permission -->
      <showCreatePermission
        v-if="propShowCreatePermission"
        :propShowCreatePermission="propShowCreatePermission"
        :propGetAllPermissionData="getAllPermissionData"
        @emitfnshowAddPermissions="fnshowCreatePermission"
      />

      <!-- Edit Permission -->
      <showEditPermission
        v-if="propShowEditPermission"
        :propShowEditPermission="propShowEditPermission"
        :propGetAllPermissionData="getAllPermissionData"
        :propRowDetails="propRowDetails"
        @emitEditpermissionDetails="fnShowEditPermission"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

import showCreatePermission from '../../components/super_admin/showCreatePermission.vue'
import showEditPermission from '../../components/super_admin/showEditPermission.vue'

/* ---------------- plugins ---------------- */
const store = useStore()

/* ---------------- state ---------------- */
const propShowCreatePermission = ref(false)
const propShowEditPermission = ref(false)
const propRowDetails = ref(null)

const filterSearch = ref('')

const paginationControl = ref({
  rowsPerPage: 10
})

/* ---------------- table columns ---------------- */
const columns = [
  {
    name: 'permission',
    label: 'Permission',
    align: 'left',
    field: 'permission',
    sortable: false
  },
  {
    name: 'action',
    label: '',
    align: 'left',
    field: 'action',
    sortable: false
  }
]

/* ---------------- store getters ---------------- */
const getAllPermissionData = computed(
  () => store.getters['SuperAdminUsers/getAllPermissionData']
)

/* ---------------- actions ---------------- */
const fetchPermissions = () =>
  store.dispatch('SuperAdminUsers/FETCH_ALL_PERMISSIONS_DATA')

/* ---------------- methods ---------------- */
const fnshowCreatePermission = () => {
  propShowCreatePermission.value = !propShowCreatePermission.value
}

const fnShowEditPermission = (row) => {
  propShowEditPermission.value = !propShowEditPermission.value
  propRowDetails.value = row
}



const myCustomSearchFilter = (rows, terms, cols, cellValue) => {
  const lowerTerms = terms ? terms.toLowerCase() : ''
  return rows.filter(row =>
    cols.some(col =>
      String(cellValue(col, row)).toLowerCase().includes(lowerTerms)
    )
  )
}

/* ---------------- lifecycle ---------------- */
onMounted(() => {
  fetchPermissions()
})
</script>

<style>
/* existing styles preserved */
</style>
