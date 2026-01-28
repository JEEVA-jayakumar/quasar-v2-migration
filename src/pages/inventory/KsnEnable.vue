<template>
  <div class="q-pa-md">
    <div class="col-12 q-title q-my-lg text-weight-regular text-center">
      KSN Enable
    </div>

    <form @submit.prevent="submitKsn">
      <div class="row justify-center q-py-sm">
        <div class="col-md-4">
          <q-input
            v-model.trim="tid"
            clearable
            class="text-weight-regular text-grey-8"
            color="grey-9"
            float-label="*Enter TID"
            placeholder="Enter TID"
            maxlength="8"
            :error="tidError"
            @blur="validateTid"
            @keypress="onlyAlphaNumeric"
          />
        </div>
      </div>

      <div class="row justify-center q-my-md">
        <q-btn
          :disable="tid.length !== 8"
          size="md"
          type="submit"
          color="purple-9"
          label="Submit"
        />
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

const $q = useQuasar();
const store = useStore();

// Reactive state
const tid = ref("");
const tidError = ref(false);

// Vuelidate rules
const rules = {
  tid: { required }
};
const v$ = useVuelidate(rules, { tid });

// Validate TID field
function validateTid() {
  v$.value.$touch();
  tidError.value = v$.value.tid.$invalid;
}

// Only allow alphanumeric characters
function onlyAlphaNumeric(evt) {
  const char = String.fromCharCode(evt.charCode);
  if (!/[0-9a-zA-Z]/.test(char)) evt.preventDefault();
}

// Submit KSN
async function submitKsn() {
  validateTid();

  if (v$.value.$invalid) {
    $q.notify({
      type: "warning",
      color: "amber-9",
      position: "bottom",
      message: "Please enter a valid 8-character TID."
    });
    return;
  }

  $q.loading.show({ delay: 100, spinnerColor: "purple-9", message: "Please wait..." });

  try {
    await store.dispatch("appDevice/VERIFY_KSN", tid.value);
    const ksnData = store.getters["appDevice/getKsnData"];

    if (ksnData.status === 200) {
      $q.loading.hide();
      $q.notify({
        color: "positive",
        position: "bottom",
        message: ksnData.body.message,
        icon: "thumb_up"
      });
      // Navigate if required (update route name if needed)
      $q.router.push({ name: "KsnEnable" });
    } else {
      $q.loading.hide();
      $q.notify({
        type: "warning",
        color: "amber-9",
        position: "bottom",
        message: ksnData.body.message
      });
    }
  } catch (error) {

    $q.loading.hide();
    $q.notify({
      type: "warning",
      color: "amber-9",
      position: "bottom",
      message: error?.data?.message || "Something went wrong"
    });
  }
}
</script>

<style scoped>
/* Optional styling */
</style>
