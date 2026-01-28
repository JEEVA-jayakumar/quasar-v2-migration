<template>
  <q-page padding>
    <div class="row items-center justify-center window-height">
      <div class="col-md-6 q-px-xl">
        <div class="row justify-center gutter-md">
          <div class="col-md-8 text-center">
            <div class="q-display-1 text-grey-9 text-weight-medium q-py-lg">
              Password Setup
            </div>
          </div>

          <!-- New Password -->
          <div class="col-md-8">
            <q-input
              v-model="formData.requestParam.password"
              type="password"
              float-label="Enter new password"
              color="grey-9"
              @blur="v$.formData.requestParam.password.$touch()"
              :error="v$.formData.requestParam.password.$error"
            />
            <p class="error" v-if="!v$.formData.requestParam.password.required">
              This field is required
            </p>
            <p
              class="error"
              v-if="!v$.formData.requestParam.password.strongPassword"
            >
              Strong passwords need a letter, number, special character, and ≥ 8 characters.
            </p>
          </div>

          <!-- Re-enter Password -->
          <div class="col-md-8">
            <q-input
              v-model="formData.passwordRe"
              type="password"
              float-label="Re-enter new password"
              color="grey-9"
              @blur="v$.formData.passwordRe.$touch()"
              :error="v$.formData.passwordRe.$error"
            />
            <p class="error" v-if="!v$.formData.passwordRe.required">
              This field is required
            </p>
            <p
              class="error"
              v-if="!v$.formData.passwordRe.strongPassword"
            >
              Strong passwords need a letter, number, special character, and ≥ 8 characters.
            </p>
          </div>

          <!-- Submit -->
          <div class="col-md-8 text-center">
            <q-btn
              class="full-width text-weight-regular q-pa-md"
              no-caps
              color="purple-9"
              @click="fnSubmitForgetPassword"
              style="max-width: 300px"
            >
              Submit
            </q-btn>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

export default {
  name: "PasswordRecovery",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    // Form data
    const formData = reactive({
      requestParam: { password: "" },
      passwordRe: "",
      token: route.params.id
    });

    // Strong password validator
    const strongPassword = helpers.withMessage(
      "Strong passwords need a letter, number, special char, ≥ 8 chars.",
      (value) =>
        /[a-z]/.test(value) && /[0-9]/.test(value) && /\W|_/.test(value) && value.length >= 8
    );

    // Vuelidate rules
    const rules = {
      formData: {
        requestParam: {
          password: { required, strongPassword }
        },
        passwordRe: { required, strongPassword }
      }
    };

    const v$ = useVuelidate(rules, { formData });

    // Submit function
    const fnSubmitForgetPassword = () => {
      v$.value.$touch();

      if (v$.value.$error) {
        // Validation failed
        window.$q.notify({ message: "Please review fields again.", color: "negative" });
        return;
      }

      if (formData.requestParam.password !== formData.passwordRe) {
        window.$q.notify({
          color: "negative",
          position: "bottom",
          message: "Oops! Password mismatch",
          icon: "thumb_down"
        });
        return;
      }

      // Call Vuex action
      store
        .dispatch("Authentication/FEED_AFTER_RESET_PASSWORD_INFO", formData)
        .then(() => {
          window.$q.notify({
            color: "positive",
            position: "bottom",
            message: "Password successfully updated",
            icon: "thumb_up"
          });
          router.push({ name: "login" });
        })
        .catch(() => {
          window.$q.notify({
            color: "negative",
            position: "bottom",
            message: "Error .. Please try again!",
            icon: "thumb_down"
          });
        });
    };

    return { formData, v$, fnSubmitForgetPassword };
  }
};
</script>

<style scoped>
.error {
  color: red;
  font-size: 12px;
  position: absolute;
  text-transform: lowercase;
}
</style>
