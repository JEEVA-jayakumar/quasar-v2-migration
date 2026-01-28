<template>
  <q-dialog v-model="toggleModal" persistent>
    <q-card style="min-width: 45vw; padding: 10px">

      <!-- Header -->
      <q-card-section class="row items-center q-py-sm bottom-border">
        <div class="text-h6">View Call Logs</div>
        <q-space />
        <q-btn round dense flat icon="close" color="dark" @click="emitToggleRemarks" />
      </q-card-section>

      <!-- Table -->
      <q-card-section>
        <q-table
          :rows="callLogs"
          :columns="columns"
          row-key="id"
          flat
          dense
        >
          <template v-slot:body-cell-inputDate="props">
            {{ formatDate(props.row.inputDate) }}
          </template>
          <template v-slot:body-cell-remarks="props">
            {{ props.row.remarks }}
          </template>
        </q-table>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'

/* ============================
   Props & Emits
============================ */
const props = defineProps({
  propToggleViewCallLogsPop: { type: Boolean, required: true },
  callInfo: { type: Object, required: true }
})

const emit = defineEmits(['closeViewCallLogs'])

/* ============================
   Quasar & Vuex
============================ */
const $q = useQuasar()
const store = useStore()

/* ============================
   Reactive State
============================ */
const toggleModal = ref(props.propToggleViewCallLogsPop)
const callLogs = ref([])

const formData = reactive({
  serviceTicketId: props.callInfo.subTicketsList[0].id
})

const columns = [
  { name: 'inputDate', label: 'Date', field: 'inputDate', align: 'left', required: true },
  { name: 'remarks', label: 'Remarks', field: 'remarks', align: 'left', required: true }
]

/* ============================
   Lifecycle
============================ */
onMounted(() => {
  fetchLogs()
})

/* ============================
   Methods
============================ */
const { PHONE_PE_VIEW_CALL_LOGS } = store._modulesNamespaceMap['phonePeCrm/'].context.actions

async function fetchLogs() {
  try {
    await PHONE_PE_VIEW_CALL_LOGS(formData)
    callLogs.value = store.getters['phonePeCrm/getviewlogs']
  } catch {

    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Please try again later.',
      icon: 'thumb_down'
    })
  }
}

function emitToggleRemarks() {
  emit('closeViewCallLogs')
}

function formatDate(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleDateString()
}
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>
