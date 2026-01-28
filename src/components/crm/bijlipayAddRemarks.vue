<template>
  <q-dialog
    v-model="toggleModal"
    persistent
    @hide="emitToggleRemarks"
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
          @click="emitToggleRemarks"
        />
      </q-card-section>

      <!-- Body -->
      <q-card-section>
        <q-editor
          v-model="formData.crmRemark"
          label="Remarks"
          placeholder="Add remarks"
          color="grey-9"
          :error="v$.formData.crmRemark.$error"
          @blur="v$.formData.crmRemark.$touch"
          :toolbar="toolbar"
          :fonts="fonts"
        />
      </q-card-section>

      <!-- Footer -->
      <q-card-actions align="right">
        <q-btn
          color="positive"
          icon="check"
          label="Save"
          @click="fnSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
/* ============================
   Imports
============================ */
import { ref, reactive, watch } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

/* ============================
   Props & Emits
============================ */
const props = defineProps({
  remarksInfo: {
    type: Object,
    required: true
  },
  propToggleRemarksPop: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits([
  'closeRemarksInfo',
  'reloadBijlipayPendingDetails'
])

/* ============================
   State
============================ */
const $q = useQuasar()
const store = useStore()

const toggleModal = ref(props.propToggleRemarksPop)

const formData = reactive({
  serviceRequest: props.remarksInfo.remarks.serviceReqTicketId,
  crmRemark: props.remarksInfo.remarks.crmRemark,
  action: props.remarksInfo.action
})

/* ============================
   Watchers
============================ */
watch(
  () => props.propToggleRemarksPop,
  val => {
    toggleModal.value = val
  }
)

/* ============================
   Validation
============================ */
const rules = {
  formData: {
    crmRemark: { required }
  }
}

const v$ = useVuelidate(rules, { formData })

/* ============================
   Editor Config
============================ */
const toolbar = [
  ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
  ['hr', 'link'],
  ['print', 'fullscreen'],
  [
    {
      label: 'Formatting',
      list: 'no-icons',
      options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
    },
    {
      label: 'Font Size',
      list: 'no-icons',
      options: [
        'size-1',
        'size-2',
        'size-3',
        'size-4',
        'size-5',
        'size-6',
        'size-7'
      ]
    },
    {
      label: 'Font',
      list: 'no-icons',
      options: [
        'default_font',
        'arial',
        'arial_black',
        'comic_sans',
        'courier_new',
        'impact',
        'lucida_grande',
        'times_new_roman',
        'verdana'
      ]
    },
    'removeFormat'
  ],
  ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
  [
    {
      label: 'Align',
      list: 'only-icons',
      options: ['left', 'center', 'right', 'justify']
    }
  ],
  ['undo', 'redo']
]

const fonts = {
  arial: 'Arial',
  arial_black: 'Arial Black',
  comic_sans: 'Comic Sans MS',
  courier_new: 'Courier New',
  impact: 'Impact',
  lucida_grande: 'Lucida Grande',
  times_new_roman: 'Times New Roman',
  verdana: 'Verdana'
}

/* ============================
   Methods
============================ */
const fnSubmit = async () => {
  v$.value.$touch()

  if (v$.value.$error) {
    $q.notify({
      type: 'negative',
      message: 'Please review fields again.'
    })
    return
  }

  try {
    await store.dispatch('bijlipayCrm/UPDATE_CRM_REMARKS', formData)

    $q.notify({
      type: 'positive',
      message: 'Remarks updated successfully',
      icon: 'thumb_up'
    })

    emitToggleRemarks()
    emit('reloadBijlipayPendingDetails', formData.action)
  } catch (error) {

    $q.notify({
      type: 'negative',
      message:
        error?.body?.message ?? 'Please Try Again Later !',
      icon: 'thumb_down'
    })
  }
}

const emitToggleRemarks = () => {
  emit('closeRemarksInfo')
}
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>
