<template>
  <q-page padding>
    <div class="row">
      <div class="col-12 q-title q-pa-md text-weight-regular bottom-border"></div>

      <div class="col-md-5 col-sm-4 col-xs-12 q-pa-sm">
        <div class="q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
          <strong>MARS API SYNC - CITY</strong>
        </div>

        <q-card style="width: 100%">
          <!-- Token Textarea -->
          <q-card-section>
            <q-input
              v-model="formData.tokenCity"
              outlined
              dense
              type="textarea"
              label="City Token"
              :disabled="true"
              autogrow
              rows="5"
              class="text-weight-regular text-grey-8"
            />
          </q-card-section>

          <!-- Submit Button -->
          <q-card-section class="text-center">
            <q-btn
              class="common-btn"
              color="purple-9"
              :disable="!formData.tokenCity"
              label="Submit"
              @click="fnFinalSubmit"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default {
  name: "MarsApiSyncCity",
  props: {
    info: Object,
  },
  setup() {
    const $q = useQuasar();
    const store = useStore();

    // Form data
    const formData = reactive({
      tokenCity: "Token " + localStorage.getItem("auth_token"),
    });

    // Vuelidate rules
    const rules = {
      formData: {
        tokenCity: { required },
      },
    };
    const v$ = useVuelidate(rules, { formData });

    // Submit function
    const fnFinalSubmit = async () => {
      v$.value.$touch();
      if (v$.value.$invalid) {
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Please review fields again.",
        });
        return;
      }

      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Submitting data...",
      });

      try {
        await store.dispatch("MarsApiSync/CITY_MARS", formData.tokenCity);
        $q.loading.hide();
        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Successfully created!",
          icon: "thumb_up",
        });
      } catch {

        $q.loading.hide();
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Please try again later!",
          icon: "thumb_down",
        });
      }
    };

    onMounted(() => {
      console.log("CITY AUTH_TOKEN DETAILS--------->>>>", formData.tokenCity);
    });

    return {
      formData,
      fnFinalSubmit,
      v$,
    };
  },
};
</script>

<style scoped>
#textboxid {
  height: 119px;
  width: 97%;
  font-size: 14pt;
}

p {
  text-indent: 30px;
}

label {
  margin-right: 20px;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  border: 3px solid green;
}
</style>
