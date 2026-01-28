<template>
  <q-dialog
    v-model="toggleModal"
    maximized
    persistent
  >
    <q-card class="column full-height">

      <!-- Header -->
      <div class="row items-center q-px-lg q-py-md text-grey-9 bottom-border">
        <div class="col text-h6">Action Sheet</div>
        <div class="col-auto">
          <q-btn
            round
            size="sm"
            outline
            color="dark"
            icon="close"
            @click="emitToggleRemarks"
          />
        </div>
      </div>

      <!-- Table -->
      <q-table
        title="Lead Validation"
        class="q-pa-md"
        table-class="customTableClass"
        :rows="tableData"
        :columns="columns"
        :filter="filter"
        row-key="id"
        v-model:pagination="paginationControl"
      >
        <!-- Top Slot -->
        <template v-slot:top>
          <div class="row full-width">
            <div class="col-md-5">
              <q-input
                v-model="filter"
                dense
                clearable
                outlined
                color="grey-9"
                placeholder="Search by user name, email, phone"
              />
            </div>
          </div>
        </template>

        <!-- Action Column -->
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <q-btn
              v-if="props.row.leadsCount === 0 && props.row.referencesCount === 0"
              no-caps
              color="negative"
              icon="close"
              label="Disable"
            />

            <q-btn
              v-if="props.row.referencesCount > 0"
              no-caps
              color="positive"
              icon="refresh"
              label="Re-assign refs"
              @click="toggleReAssignReferencesModal(props.row)"
              class="q-ml-sm"
            />

            <q-btn
              v-if="props.row.leadsCount > 0"
              no-caps
              color="positive"
              icon="refresh"
              label="Re-assign leads"
              @click="toggleReAssignLeadsModal(props.row)"
              class="q-ml-sm"
            />
          </q-td>
        </template>
      </q-table>

      <!-- Child Dialogs -->
      <reAssignLeads
        v-if="reAssignLeadsModal"
        :propRowDetails="rowLeadsDetails"
        :propToggleModal="reAssignLeadsModal"
        @closeLeadsList="toggleReAssignLeadsModal()"
      />

      <reAssignReferences
        v-if="reAssignReferencesModal"
        :propRowDetails="rowReferencesDetails"
        :propToggleModal="reAssignReferencesModal"
        @closeReferencesList="toggleReAssignReferencesModal()"
      />

    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import reAssignLeads from './reAssignLeads.vue'
import reAssignReferences from './reAssignReferences.vue'

/* ---------------- Props ---------------- */
const props = defineProps({
  propDeteledUsers: {
    type: Array,
    required: true
  },
  propToggleModal: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['emitToggleDeleteUsersModal'])

/* ---------------- State ---------------- */
const toggleModal = ref(props.propToggleModal)
const tableData = ref(props.propDeteledUsers)
const filter = ref('')

const reAssignLeadsModal = ref(false)
const reAssignReferencesModal = ref(false)

const rowLeadsDetails = ref(null)
const rowReferencesDetails = ref(null)

const paginationControl = ref({
  rowsPerPage: 6,
  page: 1
})

/* ---------------- Watchers ---------------- */
watch(() => props.propToggleModal, val => {
  toggleModal.value = val
})

watch(() => props.propDeteledUsers, val => {
  tableData.value = val
})

/* ---------------- Methods ---------------- */
const toggleReAssignLeadsModal = (details) => {
  reAssignLeadsModal.value = !reAssignLeadsModal.value
  if (details) rowLeadsDetails.value = details
}

const toggleReAssignReferencesModal = (details) => {
  reAssignReferencesModal.value = !reAssignReferencesModal.value
  if (details) rowReferencesDetails.value = details
}

const emitToggleRemarks = () => {
  emit('emitToggleDeleteUsersModal')
}

/* ---------------- Columns ---------------- */
const columns = [
  {
    name: 'name',
    label: 'Name',
    field: row => row.user.name,
    align: 'left'
  },
  {
    name: 'employeeID',
    label: 'Employee ID',
    field: row => row.user.employeeID,
    align: 'left'
  },
  {
    name: 'email',
    label: 'Email',
    field: row => row.user.email,
    align: 'center',
    sortable: true
  },
  {
    name: 'contactNumber',
    label: 'Phone',
    field: row => row.user.contactNumber,
    align: 'left'
  },
  {
    name: 'userAddress',
    label: 'Address',
    field: row => row.user.userAddress,
    align: 'left'
  },
  {
    name: 'city',
    label: 'City',
    field: row => row.user.city,
    align: 'left'
  },
  {
    name: 'state',
    label: 'State',
    field: row => row.user.state,
    align: 'left'
  },
  {
    name: 'action',
    label: '',
    field: 'action',
    align: 'left'
  }
]
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>
