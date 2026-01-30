<template>
  <div class="q-pa-md">
    <div class="col-12 q-title q-my-lg text-weight-regular text-center">
      OTP Verification
    </div>

    <form @submit.prevent="submitOtp">
      <div class="row justify-center q-py-sm">
        <div class="col-md-4">
          <q-input
            v-model.trim="otp"
            clearable
            class="text-weight-regular text-grey-8"
            color="grey-9"
            float-label="*Enter OTP"
            placeholder="Enter OTP"
            maxlength="6"
            :error="otpError"
            @blur="validateOtp"
            @keypress="onlyNumbers"
          />
        </div>
      </div>

      <div class="row justify-center q-my-md">
        <q-btn
          :disable="otp.length !== 6"
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
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

const $q = useQuasar();
const store = useStore();

// Reactive state
const otp = ref("");
const otpError = ref(false);

// Vuelidate
const rules = {
  otp: { required }
};

const v$ = useVuelidate(rules, { otp });

// Helper to validate OTP field
function validateOtp() {
  v$.value.$touch();
  otpError.value = v$.value.otp.$invalid;
}

// Allow only numbers
function onlyNumbers(evt) {
  const char = String.fromCharCode(evt.charCode);
  if (!/[0-9]/.test(char)) evt.preventDefault();
}

// OTP submit
async function submitOtp() {
  validateOtp();

  if (v$.value.$invalid) {
    $q.notify({
      type: "warning",
      color: "amber-9",
      position: "bottom",
      message: "Please enter a valid 6-digit OTP."
    });
    return;
  }

  $q.loading.show({ delay: 100, spinnerColor: "purple-9", message: "Please wait..." });

  try {
    const otpData = store.getters["appDevice/getOtpData"];

    if (otpData.status === 200) {
      $q.loading.hide();
      $q.notify({
        color: "positive",
        position: "bottom",
        message: otpData.body.message,
        icon: "thumb_up"
      });
      // Navigate to next page
      $q.router.push({ name: "KsnEnable" });
    } else {
      $q.loading.hide();
      $q.notify({
        type: "warning",
        color: "amber-9",
        position: "bottom",
        message: otpData.body.message
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

// Load OTP on mount
onMounted(async () => {
  $q.loading.show({ delay: 100, spinnerColor: "purple-9", message: "Please wait..." });

  try {


    const mobileData = store.getters["appDevice/getMobileNum"];

    if (mobileData.status === 200 || mobileData.body.message === "Value already present") {
      const otpValue = store.getters["appDevice/getOtpValue"];

      if (otpValue.status === 200) {
        $q.notify({
          color: "positive",
          position: "bottom",
          message: otpValue.body.message,
          icon: "thumb_up"
        });
      } else {
        $q.notify({
          type: "warning",
          color: "amber-9",
          position: "bottom",
          message: otpValue.body.message
        });
      }
    } else {
      $q.notify({
        type: "warning",
        color: "amber-9",
        position: "bottom",
        message: mobileData.body.message
      });
    }
  } catch (error) {

    $q.notify({
      type: "warning",
      color: "amber-9",
      position: "bottom",
      message: error?.data?.message || "Something went wrong"
    });
  } finally {
    $q.loading.hide();
  }
});
</script>

<style scoped>
/* Optional styling */
</style>
