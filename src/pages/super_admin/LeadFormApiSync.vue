<template>
  <q-page padding>
    <div class="row">
      <div class="col-12 q-title q-pa-md text-weight-regular bottom-border"></div>

      <div class="col-md-5 col-sm-4 col-xs-12 q-pa-sm">
        <div class="q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
          <strong>MARS API SYNC - LEAD FORM</strong>
        </div>

        <q-card style="width: 100%;">
          <q-card-section>
            <q-list padding>
              <q-item>
                <q-item-section>
                  <textarea
                    disabled
                    id="textboxid"
                    name="textboxid"
                    rows="5"
                    cols="50"
                    v-model="formData.tokenLeadForm"
                    class="text-weight-regular text-grey-8"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-card-section>
            <div class="q-mt-md flex justify-center">
              <q-btn
                class="common-btn"
                color="purple-9"
                :disable="!formData.tokenLeadForm"
                label="Submit"
                @click="fnFinalSubmit()"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, computed, onBeforeMount } from "vue";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useStore } from "vuex";

export default {
  name: "MarsLeadForm",
  setup() {
    const store = useStore();

    // Form Data
    const formData = ref({
      tokenLeadForm: `Token ${localStorage.getItem("auth_token") || ""}`,
    });

    // Vuelidate
    const rules = computed(() => ({
      formData: {
        tokenLeadForm: { required },
      },
    }));
    const v$ = useVuelidate(rules, { formData });

    // Lifecycle hook
    onBeforeMount(() => {
      console.log("LEAD FORM AUTH_TOKEN DETAILS--------->>>>", formData.value.tokenLeadForm);
    });

    // Submit Function
    const fnFinalSubmit = async () => {
      v$.value.$touch();
      if (v$.value.$error) {
        store.$q.notify({
          color: "negative",
          position: "bottom",
          message: "Please review fields again.",
          icon: "thumb_down",
        });
        return;
      }

      store.$q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Submitting data...",
      });

      try {
        await store.dispatch("MarsApiSync/LEAD_FORM_MARS", formData.value.tokenLeadForm);
        store.$q.notify({
          color: "positive",
          position: "bottom",
          message: "Successfully created!",
          icon: "thumb_up",
        });
      } catch {

        store.$q.notify({
          color: "negative",
          position: "bottom",
          message: "Please try again later!",
          icon: "thumb_down",
        });
      } finally {
        store.$q.loading.hide();
      }
    };

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

label {
  margin-right: 20px;
}

p {
  text-indent: 30px;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  border: 3px solid green;
}
</style>
