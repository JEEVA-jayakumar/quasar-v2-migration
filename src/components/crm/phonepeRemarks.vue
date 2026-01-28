<template>
  <q-dialog v-model="toggleModal" persistent>
    <q-card style="min-width: 30vw; padding: 20px">

      <!-- Header -->
      <q-card-section class="row items-center q-py-sm bottom-border">
        <div class="text-h6">Add Remarks</div>
        <q-space />
        <q-btn round dense flat icon="close" color="dark" @click="emitToggleRemarks" />
      </q-card-section>

      <!-- Form Section -->
      <q-card-section>
        <q-editor
          v-model="formData.crmRemark"
          :error="$v.formData.crmRemark.$error"
          @blur="$v.formData.crmRemark.$touch"
          placeholder="Add remarks"
          float-label="Remarks"
          color="grey-9"
          :toolbar="toolbar"
          :fonts="fonts"
        />

        <div class="row justify-end q-mt-md">
          <q-btn
            color="positive"
            label="Save"
            icon="check"
            @click="fnsubmit()"
          />
        </div>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'

/* ============================
   Props & Emits
============================ */
const props = defineProps({
  remarksInfo: { type: Object, required: true },
  propToggleRemarksPop: { type: Boolean, required: true }
})

const emit = defineEmits([
  'closeRemarksInfo',
  'reloadPhonepePendingDetails'
])

/* ============================
   Quasar & Vuex
============================ */
const $q = useQuasar()
const store = useStore()

/* ============================
   Reactive State
============================ */
const toggleModal = ref(props.propToggleRemarksPop)

const formData = reactive({
  serviceRequest: props.remarksInfo.remarks.serviceReqTicketId,
  crmRemark: props.remarksInfo.remarks.crmRemark,
  action: props.remarksInfo.action
})

/* ============================
   Validation
============================ */
const rules = {
  formData: {
    crmRemark: { required }
  }
}
const $v = useVuelidate(rules, { formData })

/* ============================
   Toolbar & Fonts for Q-Editor
============================ */
const toolbar = [
  ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
  ['token', 'hr', 'link', 'custom_btn'],
  ['print', 'fullscreen'],
  [
    {
      label: $q.i18n.editor.formatting,
      icon: $q.icon.editor.formatting,
      list: 'no-icons',
      options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
    },
    {
      label: $q.i18n.editor.fontSize,
      icon: $q.icon.editor.fontSize,
      fixedLabel: true,
      fixedIcon: true,
      list: 'no-icons',
      options: ['size-1','size-2','size-3','size-4','size-5','size-6','size-7']
    },
    {
      label: $q.i18n.editor.defaultFont,
      icon: $q.icon.editor.font,
      fixedIcon: true,
      list: 'no-icons',
      options: ['default_font','arial','arial_black','comic_sans','courier_new','impact','lucida_grande','times_new_roman','verdana']
    },
    'removeFormat'
  ],
  ['quote','unordered','ordered','outdent','indent'],
  [
    {
      label: $q.i18n.editor.align,
      icon: $q.icon.editor.align,
      fixedLabel: true,
      list: 'only-icons',
      options: ['left','center','right','justify']
    },
    {
      label: $q.i18n.editor.align,
      icon: $q.icon.editor.align,
      fixedLabel: true,
      options: ['left','center','right','justify']
    }
  ],
  ['undo','redo']
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
   Watchers
============================ */
watch(() => props.propToggleRemarksPop, (val) => {
  toggleModal.value = val
})

/* ============================
   Methods
============================ */
const fnsubmit = async () => {
  $v.value.formData.$touch()
  if ($v.value.formData.$invalid) {
    $q.notify({ message: 'Please review fields again.', color: 'negative' })
    return
  }

  try {
    await store.dispatch('phonePeCrm/UPDATE_CRM_REMARKS', formData)
    $q.notify({
      message: 'Remarks updated successfully',
      color: 'positive',
      icon: 'thumb_up'
    })
    emitToggleRemarks()
    emit('reloadPhonepePendingDetails', formData.action)
  } catch (err) {
    $q.notify({
      message: err?.body?.message || 'Please Try Again Later!',
      color: 'negative',
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
