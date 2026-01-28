<template>
  <q-page>
    <q-dialog
      v-model="toggleModel"
      persistent
      class="customModalOverlay"
    >
      <q-card style="min-width: 30vw; padding: 20px">
        <!-- Header -->
        <q-card-section class="text-h6 text-weight-regular bottom-border">
          RE-Assign
        </q-card-section>

        <!-- Body -->
        <q-card-section>
          <q-select
            v-model="formData.so"
            :options="assignToOptions"
            label="Select SO *"
            use-input
            clearable
            color="grey-9"
            class="q-mb-md"
          />

          <q-select
            v-model="formData.Reassign"
            :options="ReasonListOptions"
            label="Select Reason List *"
            color="grey-9"
            class="q-mb-md"
          />

          <q-input
            v-if="formData.Reassign === 'Other reason'"
            v-model="formData.reason"
            type="textarea"
            label="Reason Type"
            color="grey-9"
          />
        </q-card-section>

        <!-- Actions -->
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            class="text-grey-8"
            @click="emitfnshowUpdateOpenedExternal"
          />
          <q-btn
            label="Submit"
            color="purple-9"
            @click="fnEDITREOPEN"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onBeforeMount, watch } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

/* ------------------ Props & Emits ------------------ */
const props = defineProps({
  propShowReassign: {
    type: Boolean,
    required: true
  },
  propRowDetails: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['emitfnshowUpdateOpenedExternal'])

/* ------------------ Quasar & Store ------------------ */
const $q = useQuasar()
const store = useStore()

/* ------------------ State ------------------ */
const toggleModel = ref(props.propShowReassign)

const assignToOptions = ref([])
const ReasonListOptions = ref([])

const formData = ref({
  so: '',
  Reassign: '',
  reason: ''
})

/* ------------------ Watchers ------------------ */
watch(
  () => props.propShowReassign,
  val => {
    toggleModel.value = val
  }
)

/* ------------------ Lifecycle ------------------ */
onBeforeMount(() => {
  implementationExecutiveList()
  ReassignReasonList()
})

/* ------------------ Methods ------------------ */
const emitfnshowUpdateOpenedExternal = () => {
  emit('emitfnshowUpdateOpenedExternal')
}

/* -------- Reassign Submit -------- */
const fnEDITREOPEN = () => {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure want to reAssign the lead?',
    ok: 'Continue',
    cancel: 'Cancel'
  }).onOk(async () => {
    $q.loading.show({
      message: 'Processing ..',
      spinnerColor: 'purple-9'
    })

    const marsDeviceIds = [props.propRowDetails.id]

    const param = {
      userId: formData.value.so,
      marsDeviceIds: {
        marsDeviceIds,
        remarks: formData.value.reason,
        reason: formData.value.Reassign
      }
    }

    try {
      await store.dispatch(
        'DeviceReplacement/EQUITAS_SOUNDBOX_REASSIGNED_REASON_TYPE_DETAILS',
        param
      )

      emitfnshowUpdateOpenedExternal()

      $q.notify({
        type: 'positive',
        message: 'Updated Successfully',
        position: 'bottom'
      })
    } catch (error) {

      $q.notify({
        type: 'negative',
        message:
          error?.body?.message ?? 'Please Try Again Later !',
        position: 'bottom'
      })
    } finally {
      $q.loading.hide()
    }
  }).onCancel(() => {
    $q.notify({
      type: 'negative',
      message: 'No changes made!',
      position: 'bottom'
    })
  })
}

/* -------- Fetch SO List -------- */
const implementationExecutiveList = async () => {
  await store.dispatch('ImplementationExecutive/IMPLEMENTATION_EXECUTIVE_LIST')

  const list =
    store.getters[
      'ImplementationExecutive/getImplementationExecutiveList'
    ] || []

  assignToOptions.value = list.map(item => ({
    label: `${item.name} | ${item.employeeID} | ${item.email}`,
    value: item.id
  }))
}

/* -------- Fetch Reason List -------- */
const ReassignReasonList = async () => {
  await store.dispatch('reassignReasonList/REASSIGN_REASON_LIST')

  const list =
    store.getters['reassignReasonList/getreassignReasonList'] || []

  ReasonListOptions.value = list.map(item => ({
    label: item.name,
    value: item.name
  }))
}
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>
