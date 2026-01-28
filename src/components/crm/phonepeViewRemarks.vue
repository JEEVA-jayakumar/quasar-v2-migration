<template>
  <q-dialog v-model="opened" persistent>
    <q-card style="min-width: 30vw; padding: 20px">

      <!-- Header -->
      <q-card-section class="row items-center q-py-sm bottom-border">
        <div class="text-h6">Add Remarks</div>
        <q-space />
        <q-btn round dense flat icon="close" color="dark" @click="emitToggleViewRemarks" />
      </q-card-section>

      <!-- Scrollable Remarks Area -->
      <q-card-section>
        <q-scroll-area style="height: 150px">
          <q-input
            type="textarea"
            v-model="area"
            float-label="Add remarks"
            autogrow
            outlined
            dense
          />
        </q-scroll-area>
      </q-card-section>

      <!-- Submit Button -->
      <q-card-actions align="right">
        <q-btn color="purple" label="Submit" @click="submitRemarks" />
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

/* ============================
   Props & Emits
============================ */
const props = defineProps({
  propToggleViewRemarksPop: { type: Boolean, required: true },
  viewRemarksInfo: { type: Object, required: false }
})

const emit = defineEmits(['closeViewRemarksInfo'])


/* ============================
   Reactive State
============================ */
const opened = ref(props.propToggleViewRemarksPop)
const area = ref('')

/* ============================
   Watch for prop changes
============================ */
watch(() => props.propToggleViewRemarksPop, (newVal) => {
  opened.value = newVal
})

/* ============================
   Methods
============================ */
function emitToggleViewRemarks() {
  emit('closeViewRemarksInfo')
}

function submitRemarks() {
  // You can handle API call here using area.value
  console.log('Submitted remark:', area.value)
  emitToggleViewRemarks()
}
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>
