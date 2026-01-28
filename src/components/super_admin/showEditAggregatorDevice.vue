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
          <div class="text-h6 text-weight-regular">Modify Aggregators Device</div>
        </div>
        <div class="col-auto">
          <q-btn round flat outline color="dark" size="sm" icon="clear" @click="emitModalClose"/>
        </div>
      </q-card-section>

      <!-- Form -->
      <q-card-section>
        <q-form @submit.prevent="fnFinalSubmitEditedDevice">

          <!-- Device Name -->
          <q-input
            v-model.trim="formData.device"
            label="Modify Device Name"
            placeholder="Modify Device Name"
            outlined
            dense
            :error="!!$v.formData.device.$error"
            @blur="$v.formData.device.$touch()"
          />

          <!-- Aggregator Name (Disabled) -->
          <q-input
            v-model="formData.name"
            label="Modify Aggregator Name"
            placeholder="Modify Aggregator Name"
            outlined
            dense
            disable
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
import { useStore } from "vuex"
import { useQuasar } from "quasar"
import useVuelidate from "@vuelidate/core"
import { required } from "@vuelidate/validators"

// ---------------- Props & Emits ----------------
const props = defineProps({
  propShowEditAggregatorDevice: { type: Boolean, default: false },
  propRowDetails: { type: Object, default: () => ({ aggregator: {}, deviceName: "" }) }
})
const emit = defineEmits(["emitfnShowEditAggregatorDevice"])

// ---------------- Quasar & Store ----------------
const $q = useQuasar()
const store = useStore()

// ---------------- Reactive State ----------------
const toggleModal = ref(props.propShowEditAggregatorDevice)
watch(() => props.propShowEditAggregatorDevice, val => toggleModal.value = val)

const formData = ref({
  name: props.propRowDetails.aggregator?.name || "",
  device: props.propRowDetails.deviceName || ""
})

// ---------------- Vuelidate Rules ----------------
const rules = {
  formData: {
    name: { required },
    device: { required }
  }
}
const $v = useVuelidate(rules, { formData })

// ---------------- Vuex Actions ----------------
const EDIT_CREATED_AGGREGATORS_DEVICE_LIST = (payload) => 
  store.dispatch("superAdminAggregatorsDevice/EDIT_CREATED_AGGREGATORS_DEVICE_LIST", payload)

// ---------------- Methods ----------------
const emitModalClose = () => {
  emit("emitfnShowEditAggregatorDevice")
}

// Submit Edited Device
const fnFinalSubmitEditedDevice = async () => {
  $v.value.$touch()
  if ($v.value.$invalid) {
    $q.notify({ message: "Please review fields again.", color: "negative", icon: "thumb_down" })
    return
  }

  $q.loading.show({ message: "Please Wait", spinnerColor: "purple-9" })

  try {
    const payload = {
      id: props.propRowDetails.id,
      deviceName: formData.value.device
    }
    await EDIT_CREATED_AGGREGATORS_DEVICE_LIST(payload)
    $q.notify({ message: "Successfully updated!", color: "positive", icon: "thumb_up" })
    emit("emitfnShowEditAggregatorDevice", "refresh")
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
