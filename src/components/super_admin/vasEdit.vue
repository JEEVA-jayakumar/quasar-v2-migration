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
            <div class="text-h6 text-weight-regular">Edit VAS</div>
          </div>
          <div class="col-auto">
            <q-btn round flat outline color="dark" size="sm" icon="clear" @click="emitModalClose"/>
          </div>
        </q-card-section>

        <!-- Form -->
        <q-card-section>
          <q-form @submit.prevent="submitUpdatedVas">

            <!-- VAS Name -->
            <q-input
              v-model.trim="formData.name"
              label="Enter VAS"
              placeholder="Enter VAS"
              outlined
              dense
              :error="!!$v.formData.name.$error"
              @blur="$v.formData.name.$touch()"
            />

            <!-- VAS Code -->
            <q-input
              v-model.trim="formData.vasCode"
              label="VAS Code"
              placeholder="VAS Code"
              outlined
              dense
              class="q-mt-sm"
              :error="!!$v.formData.vasCode.$error"
              @blur="$v.formData.vasCode.$touch()"
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
  </div>
</template>

<script setup>
import { ref, watch } from "vue"
import { useStore } from "vuex"
import { useQuasar } from "quasar"
import useVuelidate from "@vuelidate/core"
import { required } from "@vuelidate/validators"

// ---------------- Props & Emits ----------------
const props = defineProps({
  propShowEditVas: { type: Boolean, default: false },
  propRowDetails: { type: Object, default: () => ({ id: null, name: "", vasCode: "" }) }
})
const emit = defineEmits(["emitfnshowVas"])

// ---------------- Quasar & Store ----------------
const $q = useQuasar()
const store = useStore()

// ---------------- Reactive State ----------------
const toggleModal = ref(props.propShowEditVas)
watch(() => props.propShowEditVas, val => toggleModal.value = val)

const formData = ref({
  id: props.propRowDetails.id,
  name: props.propRowDetails.name || "",
  vasCode: props.propRowDetails.vasCode || "",
  active: 1
})

// ---------------- Vuelidate Rules ----------------
const rules = {
  formData: {
    name: { required },
    vasCode: { required }
  }
}
const $v = useVuelidate(rules, { formData })

// ---------------- Vuex Actions ----------------
const UPDATE_ALL_VAS_DETAILS = (payload) =>
  store.dispatch("vasCreation/UPDATE_ALL_VAS_DETAILS", payload)

// ---------------- Methods ----------------
const emitModalClose = () => emit("emitfnshowVas")

const submitUpdatedVas = async () => {
  $v.value.$touch()
  if ($v.value.$invalid) {
    $q.notify({ message: "Please review fields again.", color: "negative", icon: "thumb_down" })
    return
  }

  $q.loading.show({ delay: 100, message: "Please Wait", spinnerColor: "purple-9" })

  try {
    await UPDATE_ALL_VAS_DETAILS({ ...formData.value })
    $q.notify({ message: "VAS successfully updated!", color: "positive", icon: "thumb_up" })
    emit("emitfnshowVas", "refresh")
  } catch (error) {

    $q.notify({
      message: error?.body?.message || "Please Try Again Later!",
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
