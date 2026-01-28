<template>
  <q-dialog
    v-model="localToggleModal"
    persistent
    maximized
  >
    <q-card class="q-pa-md">

      <!-- HEADER -->
      <div class="row items-center q-px-lg q-py-md text-grey-9 bottom-border">
        <div class="col text-h6">References Details</div>
        <div class="col-auto">
          <q-btn
            icon="close"
            round
            dense
            outline
            color="dark"
            @click="confirmClose"
          />
        </div>
      </div>

      <!-- BODY -->
      <div class="row">

        <!-- LEFT PANEL -->
        <div class="col-3">
          <q-list bordered>
            <q-item-label header>Hierarchy List</q-item-label>

            <q-item
              v-for="(item, index) in propRowDetails.hierarchyList"
              :key="index"
              clickable
              @click="populateReferencesList(item, index)"
              :active="activeIndex === index"
              active-class="bg-purple-9 text-white"
            >
              <q-item-section>
                {{ item.hierarchy.hierarchy }}
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- RIGHT PANEL -->
        <div class="col-9">

          <q-table
            class="q-mt-md"
            :rows="tableData"
            :columns="columns"
            row-key="id"
            selection="multiple"
            v-model:selected="formData.selectedReferencesToReAssign"
            :filter="filter"
            v-model:pagination="pagination"
          >

            <!-- TOP SLOT -->
            <template v-slot:top>
              <div class="row q-col-gutter-sm full-width">

                <div class="col-md-5">
                  <q-input
                    v-model="filter"
                    dense
                    debounce="300"
                    clearable
                    label="Search"
                    placeholder="SO name / Merchant / Lead ID"
                  />
                </div>

                <div class="col-md-4">
                  <q-select
                    v-model="formData.userId"
                    label="Choose a user"
                    :options="[]"
                    dense
                  />
                </div>

                <div class="col-md-3 flex flex-center">
                  <q-btn
                    color="positive"
                    icon="check"
                    label="Assign"
                  />
                </div>

              </div>
            </template>

          </q-table>
        </div>
      </div>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'

/* PROPS */
const props = defineProps({
  propRowDetails: {
    type: Object,
    required: true
  },
  propToggleModal: {
    type: Boolean,
    required: true
  }
})

/* EMITS */
const emit = defineEmits(['closeReferencesList'])

/* QUASAR */
const $q = useQuasar()

/* STATE */
const localToggleModal = ref(props.propToggleModal)
const filter = ref('')
const activeIndex = ref(null)

const pagination = ref({
  page: 1,
  rowsPerPage: 6
})

const formData = ref({
  selectedReferencesToReAssign: [],
  userId: null
})

const tableData = ref([])

/* WATCH PROP → LOCAL */
watch(
  () => props.propToggleModal,
  val => (localToggleModal.value = val)
)

/* METHODS */
function populateReferencesList(details, index) {
  activeIndex.value = index
  tableData.value = details.references || []
}

function confirmClose () {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure want to leave this page?',
    ok: { label: 'Continue', color: 'primary' },
    cancel: { label: 'Cancel', color: 'grey' }
  }).onOk(() => {
    emit('closeReferencesList')
  })
}

/* TABLE COLUMNS */
const columns = [
  { name: 'employeeID', label: 'Employee ID', field: 'employeeID', sortable: true },
  { name: 'name', label: 'Name', field: 'name', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'center', sortable: true },
  { name: 'contactNumber', label: 'Contact Number', field: 'contactNumber', sortable: true },
  { name: 'userAddress', label: 'Address', field: 'userAddress', sortable: true },
  { name: 'city', label: 'City', field: 'city', sortable: true },
  { name: 'state', label: 'State', field: 'state', sortable: true },
  { name: 'pincode', label: 'Pincode', field: 'pincode', sortable: true }
]
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>
