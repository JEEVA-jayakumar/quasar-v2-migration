<template>
  <q-dialog
    v-model="dialogModel"
    persistent
    full-height
    transition-show="fade"
    transition-hide="fade"
  >
    <q-card class="right-drawer-card">

      <!-- Header -->
      <div class="row items-center border-bottom q-pa-md">
        <div class="col-8">
          <div class="text-h6 q-mb-xs">Bombay Fires</div>
          <div class="text-primary"># 554855</div>
        </div>

        <div class="col-4 text-right">
          <q-btn
            round
            outline
            size="sm"
            color="grey-8"
            icon="close"
            @click="closeDialog"
          />
        </div>
      </div>

      <!-- Merchant Info -->
      <div class="row q-pa-md q-col-gutter-md">
        <div class="col">
          <div class="text-subtitle1 q-py-sm">
            <q-icon color="primary" name="phone" size="20px" /> Contact
          </div>
          <p class="q-mb-none">+91 9874563210</p>
          <p>+91 9856214700</p>
        </div>

        <div class="col">
          <div class="text-subtitle1 q-py-sm">
            <q-icon color="primary" name="location_on" size="20px" /> Address
          </div>
          <p>13A, Haddows Road, Nungambakkam, Chennai, Tamilnadu</p>
        </div>

        <div class="col">
          <div class="text-subtitle1 q-py-sm">
            <q-icon color="primary" name="map" size="20px" /> State
          </div>
          <p>Tamilnadu</p>
        </div>

        <div class="col">
          <div class="text-subtitle1 q-py-sm">
            <q-icon color="primary" name="event" size="20px" /> Date of onboarding
          </div>
          <p>20 Oct, 2017</p>
        </div>
      </div>

      <!-- Table -->
      <q-table
        flat
        dense
        :rows="tableData"
        :columns="columns"
        row-key="tid"
        :filter="filter"
        class="q-pa-md"
      >
        <!-- Top Slot -->
        <template v-slot:top>
          <div class="row full-width items-center q-mb-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="filter"
                dense
                debounce="300"
                clearable
                placeholder="Search"
                outlined
              >
                <template #append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
        </template>
      </q-table>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'

/* ---------------------------------
   Props & Emits (Vue 3 standard)
---------------------------------- */
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'revertRowClick'])

/* ---------------------------------
   Dialog v-model bridge
---------------------------------- */
const dialogModel = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

/* ---------------------------------
   Data
---------------------------------- */
const filter = ref('')

const columns = [
  {
    name: 'tid',
    label: 'TID',
    field: 'tid',
    align: 'left',
    sortable: true
  },
  {
    name: 'deviceAddress',
    label: 'Address',
    field: 'deviceAddress',
    align: 'left',
    sortable: true
  }
]

const tableData = ref([
  {
    tid: 554845,
    deviceAddress:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
  },
  {
    tid: 554846,
    deviceAddress:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
  },
  {
    tid: 554847,
    deviceAddress:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
  },
  {
    tid: 554848,
    deviceAddress:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
  }
])

/* ---------------------------------
   Methods
---------------------------------- */
function closeDialog () {
  emit('update:modelValue', false)
  emit('revertRowClick')
}
</script>

<style scoped>
.right-drawer-card {
  width: 50vw;
  min-width: 400px;
  height: 100vh;
  position: fixed;
  right: 0;
  top: 0;
}

.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}
</style>
