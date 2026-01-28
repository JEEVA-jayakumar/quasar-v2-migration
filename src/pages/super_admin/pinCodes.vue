<template>
  <q-page>
    <div>
      <q-table
        :rows="getAllPincodes"
        :columns="columns"
        row-key="pincode"
        table-class="customSATableClass"
        color="grey-9"
        :loading="loading"
        :filter="filter"
        v-model:pagination="serverPagination"
        @request="searchRequest"
      >
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
                @click="fnShowEditPincode(props.row)"
              />
            </div>
          </q-td>
        </template>

        <!-- Top Slot -->
        <template v-slot:top>
          <div class="col-md-6 q-title q-mt-lg text-weight-regular">
            Pincodes
          </div>

          <div class="col-md-6 q-my-md" align="right">
            <q-btn
              no-caps
              no-wrap
              label="Add New Pincode"
              class="q-mt-lg text-weight-regular"
              color="purple-9"
              icon="far fa-plus-square"
              size="md"
              @click="fnshowCreatePincodes"
            />
          </div>

          <div class="col-md-5">
            <q-input
              v-model="filter"
              clearable
              color="grey-9"
              placeholder="Type.."
              class="q-mr-lg"
            />
          </div>
        </template>
      </q-table>

      <!-- Create Pincode -->
      <addPincode
        v-if="propShowCreatePincodes"
        :propShowCreatePincodes="propShowCreatePincodes"
        @emitfnshowAddPincodes="fnshowCreatePincodes"
      />

      <!-- Edit Pincode -->
      <editPincode
        v-if="propShowEditPincodes"
        :propShowEditPincodes="propShowEditPincodes"
        :propRowDetails="propRowDetails"
        @emitfnshowEditPincodes="fnShowEditPincode"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

import addPincode from '../../components/super_admin/addPincode.vue'
import editPincode from '../../components/super_admin/editPincode.vue'

/* ---------------- plugins ---------------- */
const store = useStore()
const $q = useQuasar()

/* ---------------- state ---------------- */
const propShowCreatePincodes = ref(false)
const propShowEditPincodes = ref(false)
const propRowDetails = ref(null)

const filter = ref('')
const loading = ref(false)

const serverPagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10
})

/* ---------------- columns ---------------- */
const columns = [
  {
    name: 'pincode',
    label: 'Pincode',
    align: 'left',
    field: 'pincode',
    sortable: false
  },
  {
    name: 'stateName',
    label: 'State',
    align: 'left',
    field: 'stateName',
    sortable: false
  },
  {
    name: 'cityName',
    label: 'City',
    align: 'left',
    field: 'cityName',
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
const getAllPincodes = computed(
  () => store.getters['pincodes/getAllPincodes']
)

/* ---------------- actions ---------------- */
const fetchAllPincodes = (payload) =>
  store.dispatch('pincodes/FETCH_ALL_PINCODES', payload)

/* ---------------- methods ---------------- */
const fnshowCreatePincodes = () => {
  propShowCreatePincodes.value = !propShowCreatePincodes.value
}

const fnShowEditPincode = (row) => {
  propShowEditPincodes.value = !propShowEditPincodes.value
  if (row) propRowDetails.value = row
}

const searchRequest = async ({ pagination, filter }) => {
  loading.value = true
  try {
    await fetchAllPincodes(filter)
    serverPagination.value = pagination
  } finally {
    loading.value = false
  }
}

const loadInitialData = async () => {
  $q.loading.show({
    delay: 100,
    message: 'Please Wait',
    spinnerColor: 'purple-9'
  })

  try {
    await fetchAllPincodes()
  } catch (error) {

    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: error?.body?.message || 'Please Try Again Later!',
      icon: 'thumb_down'
    })
  } finally {
    $q.loading.hide()
  }
}

/* ---------------- lifecycle ---------------- */
onMounted(() => {
  loadInitialData()
})
</script>

<style>
/* existing styles preserved */
</style>
