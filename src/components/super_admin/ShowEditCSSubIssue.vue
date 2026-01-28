<template>
  <div>
    <!-- Modal -->
    <q-dialog
      v-model="toggleModal"
      persistent
      no-backdrop-dismiss
      transition-show="slide"
      transition-hide="slide"
    >
      <q-card class="customModalOverlay" style="padding:30px; min-width:30vw">

        <!-- Header -->
        <q-card-section class="row items-center q-py-sm">
          <div class="col">
            <div class="text-h6 text-weight-regular">Modify CS Sub Issue</div>
          </div>
          <div class="col-auto">
            <q-btn round flat outline color="dark" size="sm" icon="clear" @click="emitModalClose"/>
          </div>
        </q-card-section>

        <!-- Form -->
        <q-card-section>
          <q-form @submit.prevent="fnFinalSubmitCsSubIssue">

            <!-- CS Sub Issue Name -->
            <q-input
              v-model.trim="formData.name"
              label="Enter CS Sub Issue"
              placeholder="Enter CS Sub Issue"
              outlined
              dense
              :error="!!$v.formData.name.$error"
              @blur="$v.formData.name.$touch()"
            />

            <!-- Action Buttons -->
            <div class="row justify-end q-mt-md">
              <q-btn flat label="Cancel" color="grey-8" class="q-mr-sm" @click="emitModalClose"/>
              <q-btn label="Save" color="purple-9" type="submit"/>
            </div>

          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Nested Sub Task Details -->
    <showServiceSubTaskDetails
      v-if="propShowServiceSubTaskDetails"
      :propShowServiceSubTaskDetails="propShowServiceSubTaskDetails"
      :propRowDetails="propRowDetails"
      @emitfnshowServiceSubTaskDetails="fnShowSubTaskDetails"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue"
import { useStore } from "vuex"
import { useQuasar } from "quasar"
import useVuelidate from "@vuelidate/core"
import { required } from "@vuelidate/validators"
import showServiceSubTaskDetails from "../../components/super_admin/showServiceSubTaskDetails.vue"

// ---------------- Props & Emits ----------------
const props = defineProps({
  propShowEditCsSubIssue: { type: Boolean, default: false },
  propRowDetails1: { type: Object, default: () => ({ id: null, name: "" }) }
})
const emit = defineEmits(["emitfnshowEditCsSubIssue"])

// ---------------- Quasar & Store ----------------
const $q = useQuasar()
const store = useStore()

// ---------------- Reactive State ----------------
const toggleModal = ref(props.propShowEditCsSubIssue)
watch(() => props.propShowEditCsSubIssue, val => toggleModal.value = val)

const propShowServiceSubTaskDetails = ref(false)
const propRowDetails = ref(null)

const formData = ref({
  name: props.propRowDetails1?.name || ""
})

// ---------------- Vuelidate Rules ----------------
const rules = {
  formData: {
    name: { required }
  }
}
const $v = useVuelidate(rules, { formData })

// ---------------- Vuex Actions ----------------
const EDIT_CS_SUB_ISSUE = (payload) =>
  store.dispatch("serviceRequest/EDIT_CS_SUB_ISSUE", payload)

// ---------------- Methods ----------------

// Close modal
const emitModalClose = () => emit("emitfnshowEditCsSubIssue")

// Show/hide nested Sub Task Details
const fnShowSubTaskDetails = (rowDetails) => {
  propShowServiceSubTaskDetails.value = !propShowServiceSubTaskDetails.value
  propRowDetails.value = rowDetails
}

// Submit edited CS Sub Issue
const fnFinalSubmitCsSubIssue = async () => {
  $v.value.$touch()
  if ($v.value.$invalid) {
    $q.notify({ message: "Please review fields again.", color: "negative", icon: "thumb_down" })
    return
  }

  $q.loading.show({ message: "Please Wait", spinnerColor: "purple-9" })

  try {
    const payload = {
      id: props.propRowDetails1.id,
      request: { ...formData.value }
    }
    await EDIT_CS_SUB_ISSUE(payload)
    $q.notify({ message: "Successfully updated!", color: "positive", icon: "thumb_up" })
    emit("emitfnshowEditCsSubIssue")
  } catch (err) {
    $q.notify({
      message: err?.body?.message || "Please Try Again Later!",
      color: "negative",
      icon: "thumb_down"
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
