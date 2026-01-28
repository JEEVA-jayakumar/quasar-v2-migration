<template>
  <q-page>
    <div>
      <!-- Header -->
      <div class="row q-px-md q-py-md items-center">
        <div class="col-12 q-title text-weight-regular text-grey-9"></div>
      </div>

      <!-- Spare Parts Selection -->
      <div class="row bottom-border q-px-md q-py-md text-grey-9">
        <div class="col-md-7">
          <p class="caption">Aggregator Spare Parts Types*</p>

          <div
            v-for="item in sparePartsTypes"
            :key="item.value.id"
            class="row items-center q-gutter-sm"
          >
            <q-checkbox
              v-model="selectedSpareId"
              :val="item.value.id"
              @update:model-value="onSpareSelect(item.value.id)"
            />
            <span>{{ item.value.spare_parts_types }}</span>
          </div>

          <!-- Input Section -->
          <div
            v-if="selectedSpareId"
            class="q-mt-md row items-center q-gutter-sm"
          >
            <q-input
              type="number"
              min="1"
              max="5000"
              v-model.number="formData.count"
              label="Enter Count"
              dense
              outlined
              style="width: 150px"
            />

            <q-btn
              color="purple"
              size="sm"
              label="Submit"
              :disable="!isSubmitEnabled"
              @click="fnSubmit"
            />
          </div>
        </div>
      </div>

      <!-- Stock Table -->
      <div class="q-px-lg q-py-md">
        <div class="q-title text-grey-9 q-mb-md">
          Aggregator Stock List
        </div>

        <q-table
          class="customSATableClass"
          :rows="tableData"
          :columns="columns"
          row-key="id"
          v-model:pagination="pagination"
          color="grey-9"
        >
          <template #body-cell-created_date="props">
            <q-td>
              {{ formatDate(props.row.created_date) }}
            </q-td>
          </template>

          <template #body-cell-updated_date="props">
            <q-td>
              {{ formatDate(props.row.updated_date) }}
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import moment from 'moment'

const $q = useQuasar()
const store = useStore()

/* ---------------- STATE ---------------- */
const sparePartsTypes = ref([])
const tableData = ref([])

const selectedSpareId = ref(null)

const formData = ref({
  count: null,
  spare_inventory_data: {
    id: '',
    is_active: true
  }
})

const pagination = ref({
  rowsPerPage: 10
})

/* ---------------- TABLE ---------------- */
const columns = [
  {
    name: 'spare_parts_types',
    label: 'Spare Parts Types',
    field: row => row.spare_inventory_data.spare_parts_types,
    align: 'left'
  },
  {
    name: 'count',
    label: 'Count',
    field: 'count',
    align: 'left'
  },
  {
    name: 'created_by',
    label: 'Spare Created',
    field: row => row.created_by.name,
    align: 'left'
  },
  {
    name: 'created_date',
    label: 'Created Date',
    field: 'created_date',
    align: 'left'
  },
  {
    name: 'updated_date',
    label: 'Updated Date',
    field: 'updated_date',
    align: 'left'
  }
]

/* ---------------- COMPUTED ---------------- */
const isSubmitEnabled = computed(() => {
  return (
    selectedSpareId.value &&
    formData.value.count &&
    formData.value.count > 0
  )
})

/* ---------------- METHODS ---------------- */
const formatDate = date =>
  date ? moment(date).format('Do MMM YYYY') : 'NA'

const onSpareSelect = id => {
  formData.value.spare_inventory_data.id = id
  formData.value.count = null
}

const fnSparePartsTypes = async () => {
  await store.dispatch('sparePartsGetTypes/FETCH_SPARE_PARTS_GET_TYPES')
  sparePartsTypes.value =
    store.getters['sparePartsGetTypes/getsparePartsGetTypes'].map(item => ({
      value: item,
      label: item.spare_parts_types
    }))
}

const fngetAllInventoryDatas = async () => {
  await store.dispatch(
    'sparePartsGetTypes/FETCH_ALL_PHONEPE_SPARE_PARTS_INVENTORY_DATAS'
  )
  tableData.value =
    store.getters[
      'sparePartsGetTypes/getallPhonepeInventorySparePartsGetTypes'
    ]
}

const fnSubmit = async () => {
  $q.loading.show({ message: 'Validating...' })
  try {
    await store.dispatch(
      'sparePartsGetTypes/PHONEPE_SPARE_PARTS_ADD_STOCKS',
      formData.value
    )
    $q.notify({
      type: 'positive',
      message: 'Stocks Added Successfully'
    })
    selectedSpareId.value = null
    formData.value = {
      count: null,
      spare_inventory_data: { id: '', is_active: true }
    }
    fngetAllInventoryDatas()
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Please try again'
    })
  } finally {
    $q.loading.hide()
  }
}

/* ---------------- LIFECYCLE ---------------- */
onMounted(() => {
  fnSparePartsTypes()
  fngetAllInventoryDatas()
})
</script>

<style scoped>
.caption {
  font-weight: 500;
}
</style>
