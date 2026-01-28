<template>
  <q-dialog
    v-model="showCreatePermissionToggle"
    persistent
    @hide="emitfnshowAddPermissions"
  >
    <q-card class="customModalOverlay" style="padding:30px; min-width:30vw">
      
      <!-- Header -->
      <q-card-section class="row items-center q-pa-md bottom-border">
        <div class="text-h6 text-weight-regular">Add Permission</div>
      </q-card-section>

      <!-- Form -->
      <q-card-section class="q-pa-md column">
        <q-input
          v-model="formData.permissionDetails.permission"
          label="Permission"
          placeholder="Permission"
          color="grey-9"
          class="text-grey-8 q-my-sm"
          :error="v$.value.formData.permissionDetails.permission.$error"
          error-message="Permission is required"
          @blur="v$.value.formData.permissionDetails.permission.$touch()"
          @keyup.enter="fnEditPermissionSubmit"
        />
      </q-card-section>

      <!-- Actions -->
      <q-card-section class="row justify-end q-pa-md">
        <q-btn
          flat
          size="md"
          label="Cancel"
          color="grey-8"
          class="bg-white q-mr-sm"
          @click="emitfnshowAddPermissions"
        />
        <q-btn
          size="md"
          label="Save"
          color="purple-9"
          @click="fnEditPermissionSubmit"
        />
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

/* ---------------- Props & Emits ---------------- */
const props = defineProps({
  propShowCreatePermission: { type: Boolean, required: true }
})
const emit = defineEmits(['emitfnshowAddPermissions'])

/* ---------------- State ---------------- */
const $q = useQuasar()
const store = useStore()

const showCreatePermissionToggle = ref(props.propShowCreatePermission)
watch(() => props.propShowCreatePermission, val => (showCreatePermissionToggle.value = val))

const formData = reactive({
  permissionDetails: {
    permission: ''
  }
})

/* ---------------- Validation ---------------- */
const rules = {
  formData: {
    permissionDetails: {
      permission: { required }
    }
  }
}
const v$ = useVuelidate(rules, { formData })

/* ---------------- Vuex Actions ---------------- */
const FEED_PERMISSION_DATA = payload => store.dispatch('SuperAdminUsers/FEED_PERMISSION_DATA', payload)
const FETCH_ALL_PERMISSIONS_DATA = () => store.dispatch('SuperAdminUsers/FETCH_ALL_PERMISSIONS_DATA')

/* ---------------- Methods ---------------- */
const emitfnshowAddPermissions = () => {
  emit('emitfnshowAddPermissions', showCreatePermissionToggle.value)
}

const fnEditPermissionSubmit = async () => {
  v$.value.$touch()
  if (v$.value.$error) {
    $q.notify('Please review fields again.')
    return
  }

  $q.loading.show({ message: 'Please Wait', spinnerColor: 'purple-9' })

  try {
    await FEED_PERMISSION_DATA(formData.permissionDetails)
    await FETCH_ALL_PERMISSIONS_DATA()
    emitfnshowAddPermissions()
    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Successfully Updated!',
      icon: 'thumb_up'
    })
  } catch (error) {

    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: error?.body?.message ?? 'Please Try Again Later!',
      icon: 'thumb_down'
    })
  } finally {
    $q.loading.hide()
  }
}
</script>

<style scoped>
.customModalOverlay {
  border-radius: 8px;
}
</style>
