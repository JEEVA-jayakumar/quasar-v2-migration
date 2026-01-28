<template>
  <q-dialog
    v-model="opened"
    persistent
    @hide="emitToggleViewRemarks"
  >
    <q-card style="min-width: 30vw; padding: 20px">
      
      <!-- Header -->
      <q-card-section class="row items-center q-pb-sm bottom-border">
        <div class="text-h6">Add Remarks</div>
        <q-space />
        <q-btn
          round
          dense
          flat
          icon="close"
          color="dark"
          @click="emitToggleViewRemarks"
        />
      </q-card-section>

      <!-- Body -->
      <q-card-section>
        <q-scroll-area style="width: 300px; height: 150px">
          <q-input
            v-model="request.comment"
            type="textarea"
            label="Add remarks"
            autogrow
            class="q-mb-md"
          />

          <div class="row justify-end">
            <q-btn
              color="purple"
              label="Submit"
            />
          </div>
        </q-scroll-area>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script setup>
/* ============================
   Imports
============================ */
import { ref, reactive, watch } from 'vue'

/* ============================
   Props & Emits
============================ */
const props = defineProps({
  viewRemarksInfo: {
    type: Object,
    required: false
  },
  propToggleViewRemarksPop: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['closeViewRemarksInfo'])

/* ============================
   State
============================ */
const opened = ref(props.propToggleViewRemarksPop)

const request = reactive({
  comment: ''
})

/* ============================
   Watchers
============================ */
watch(
  () => props.propToggleViewRemarksPop,
  value => {
    opened.value = value
  }
)

/* ============================
   Methods
============================ */
const emitToggleViewRemarks = () => {
  emit('closeViewRemarksInfo')
}
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>
