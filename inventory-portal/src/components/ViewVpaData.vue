<template>
  <q-dialog
    v-model="VpaDataToggle"
    persistent
    class="customModalOverlay"
    @hide="emitVpaModalList"
    @escape-key="emitVpaModalList"
  >
    <q-card style="min-width: 30vw; padding: 30px">
      <!-- Close Button -->
      <div class="row justify-end">
        <q-btn
          flat
          size="md"
          icon="close"
          @click="emitVpaModalList"
        />
      </div>

      <!-- Header -->
      <div
        class="row items-center q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
      >
        <div class="col q-title">VPA LIST</div>
      </div>

      <!-- Table -->
      <q-table
        class="q-py-none customTableClass"
        :rows="tableData"
        :columns="columns"
        row-key="id"
        flat
        bordered
      >
        <!-- Serial No -->
        <template v-slot:body-cell-Sno="props">
          <q-td :props="props">
            {{ props.row.id ?? 'NA' }}
          </q-td>
        </template>

        <!-- VPA -->
        <template v-slot:body-cell-Vpa="props">
          <q-td :props="props">
            {{ props.row.vpa ?? 'NA' }}
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, onBeforeMount, watch } from 'vue'

/* -------------------- PROPS & EMITS -------------------- */
const props = defineProps({
  propRowDetails: {
    type: Object,
    required: true
  },
  VpaDataModal: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['toggleModal'])

/* -------------------- STATE -------------------- */
const VpaDataToggle = ref(props.VpaDataModal)

const tableData = computed(() => {
  return props.propRowDetails?.vpaList || []
})

const columns = [
  {
    name: 'Sno',
    label: 'SerialNo',
    align: 'left',
    field: 'id',
    sortable: false
  },
  {
    name: 'Vpa',
    label: 'VPA',
    align: 'left',
    field: 'vpa',
    sortable: false
  }
]

/* -------------------- WATCHERS -------------------- */
watch(
  () => props.VpaDataModal,
  (val) => {
    VpaDataToggle.value = val
  }
)

/* -------------------- LIFECYCLE -------------------- */
onBeforeMount(() => {
  console.log('CHECK', JSON.stringify(props.VpaDataModal))
})

/* -------------------- METHODS -------------------- */
function emitVpaModalList () {
  emit('toggleModal', VpaDataToggle.value)
}
</script>

<style scoped>
.customModalOverlay {
  z-index: 6000;
}
</style>
