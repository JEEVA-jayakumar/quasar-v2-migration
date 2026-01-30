<template>
  <q-dialog
    v-model="toggleModal"
    persistent
    no-backdrop-dismiss
    no-esc-dismiss
  >
    <q-card style="min-width: 40vw; padding: 20px">
      <!-- Header -->
      <q-card-section class="q-title q-py-md row items-center">
        <q-icon name="security" class="q-mr-sm" />
        Change Password
      </q-card-section>

      <!-- Form -->
      <q-card-section v-show="!currentPasswordMatched">
        <q-form @submit.prevent="submitPasswordChangeRequest">
          <!-- Current Password -->
          <q-input
            type="password"
            color="grey-9"
            v-model="formData.currentPassword"
            label="Current Password *"
            :error="v$.currentPassword.$error"
            @blur="v$.currentPassword.$touch()"
          />

          <!-- New Password -->
          <q-input
            type="password"
            color="grey-9"
            v-model="formData.newpassword"
            label="New Password *"
            :error="v$.newpassword.$error"
            @blur="v$.newpassword.$touch()"
            class="q-mt-md"
          />
          <p
            class="error1"
            v-if="v$.newpassword.$dirty && !v$.newpassword.strongPassword"
          >
            Strong passwords need a letter, number, special character, and at least 8 characters.
          </p>

          <!-- Confirm Password -->
          <q-input
            type="password"
            color="grey-9"
            v-model="formData.retypepassword"
            label="Confirm New Password *"
            :error="v$.retypepassword.$error"
            @blur="v$.retypepassword.$touch()"
            class="q-mt-md"
          />
          <p
            class="error1"
            v-if="v$.retypepassword.$dirty && !v$.retypepassword.strongPassword"
          >
            Strong passwords need a letter, number, special character, and at least 8 characters.
          </p>

          <!-- Buttons -->
          <div class="row justify-end q-mt-lg">
            <q-btn
              outline
              color="dark"
              class="q-mr-sm"
              label="Cancel"
              @click="emitToggleMyAccount"
            />
            <q-btn
              color="primary"
              label="Submit"
              type="submit"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import useVuelidate from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";

/* Props & Emits */
const props = defineProps({
  propsToggleModal: Boolean
});

const emit = defineEmits(["propsToggleModal"]);

/* Quasar / Router / Store */
const $q = useQuasar();
const router = useRouter();
const store = useStore();

/* State */
const toggleModal = ref(props.propsToggleModal);
const currentPasswordMatched = ref(false);

const formData = reactive({
  currentPassword: "",
  newpassword: "",
  retypepassword: ""
});

/* Watch modal toggle */
watch(() => props.propsToggleModal, val => {
  toggleModal.value = val;
});

/* Strong password validator */
const strongPassword = value =>
  /[a-z]/i.test(value) &&
  /[0-9]/.test(value) &&
  /\W|_/.test(value) &&
  value.length >= 8;

/* Vuelidate rules */
const rules = {
  currentPassword: {
    required,
    minLength: minLength(8),
    maxLength: maxLength(15)
  },
  newpassword: {
    required,
    strongPassword
  },
  retypepassword: {
    required,
    strongPassword
  }
};

const v$ = useVuelidate(rules, formData);

/* Emit close */
const emitToggleMyAccount = () => {
  emit("propsToggleModal");
};

/* Submit handler */
const submitPasswordChangeRequest = async () => {
  v$.$touch();

  if (v$.$error) {
    $q.notify("Please review fields again.");
    return;
  }

  if (formData.newpassword !== formData.retypepassword) {
    $q.notify("Old and new password must be same.");
    return;
  }

  try {
    await store.dispatch("Authentication/CHANGE_PASSWORD", {
      password: formData.newpassword.toString()
    });

    emitToggleMyAccount();

    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Password changed successfully",
      icon: "thumb_up"
    });

    router.push({ name: "login" });
  } catch (error) {

    $q.notify({
      color: "negative",
      position: "bottom",
      message: error?.body?.message || "Please Try Again Later !",
      icon: "thumb_down"
    });
  }
};
</script>

<style scoped>
.error1 {
  color: grey;
  font-size: 13px;
}
</style>
