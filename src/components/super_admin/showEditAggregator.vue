<template>
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
          <div class="text-h6 text-weight-regular">Modify Aggregators</div>
        </div>
        <div class="col-auto">
          <q-btn round flat outline color="dark" size="sm" icon="clear" @click="emitModalClose"/>
        </div>
      </q-card-section>

      <!-- Form -->
      <q-card-section>
        <q-form @submit.prevent="fnFinalSubmitEditedAggregator">
          <!-- Aggregator Name -->
          <q-input
            v-model.trim="formData.name"
            label="Modify Aggregator Name"
            placeholder="Modify Aggregator Name"
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
</template>

<script setup>
import { ref, watch } from "vue"
import { useQuasar } from "quasar"
import { useStore } from "vuex"
import useVuelidate from "@vuelidate/core"
import { required } from "@vuelidate/validators"

// ---------------- Props & Emits ----------------
const props = defineProps({
  propShowEditAggregator: { type: Boolean, default: false },
  propRowDetails: { type: Object, default: () => ({}) }
})
const emit = defineEmits(["emitfnShowEditAggregator"])

// ---------------- State ----------------
const $q = useQuasar()
const store = useStore()

const toggleModal = ref(props.propShowEditAggregator)
watch(() => props.propShowEditAggregator, val => toggleModal.value = val)

const formData = ref({
  name: props.propRowDetails.name || ""
})

// ---------------- Vuelidate ----------------
const rules = {
  formData: {
    name: { required }
  }
}
const $v = useVuelidate(rules, { formData })

// ---------------- Vuex Actions ----------------
const EDIT_CREATED_AGGREGATORS = (payload) => store.dispatch("superAdminAggregators/EDIT_CREATED_AGGREGATORS", payload)

// ---------------- Methods ----------------
const emitModalClose = () => {
  emit("emitfnShowEditAggregator")
}

// Submit Edited Aggregator
const fnFinalSubmitEditedAggregator = async () => {
  $v.value.$touch()
  if ($v.value.$invalid) {
    $q.notify({ message: "Please review fields again.", color: "negative", icon: "thumb_down" })
    return
  }

  $q.loading.show({ message: "Please Wait", spinnerColor: "purple-9" })

  try {
    const payload = {
      name: formData.value.name,
      id: props.propRowDetails.id
    }
    await EDIT_CREATED_AGGREGATORS(payload)
    $q.notify({ message: "Successfully updated!", color: "positive", icon: "thumb_up" })
    emit("emitfnShowEditAggregator", "refresh")
  } catch {
    $q.notify({ message: "Please Try Again Later!", color: "negative", icon: "thumb_down" })
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
