<template>
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col-12 q-title q-pa-md text-weight-regular bottom-border"></div>

      <div class="col-md-5 col-sm-4 col-xs-12 q-pa-sm">
        <div class="q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
          <strong>MARS API SYNC - STATE</strong>
        </div>

        <q-card style="width:1047px">
          <!-- Token Textarea -->
          <q-card-section>
            <q-list no-border>
              <q-item>
                <q-item-section>
                  <q-input
                    filled
                    readonly
                    type="textarea"
                    v-model="formData.tokenState"
                    rows="5"
                    label="Token State"
                    class="text-weight-regular text-grey-8"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <!-- Submit Button -->
          <q-card-section class="text-center">
            <q-btn
              class="common-btn"
              color="purple-9"
              :disable="!formData.tokenState"
              label="Submit"
              @click="fnFinalSubmit"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive } from "vue";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

/* ---------------------------
   Store & Quasar
--------------------------- */
const store = useStore();
const $q = useQuasar();

/* ---------------------------
   Reactive State
--------------------------- */
const formData = reactive({
  tokenState: "Token " + localStorage.getItem("auth_token")
});

/* ---------------------------
   Vuelidate Validation
--------------------------- */
const rules = {
  tokenState: { required }
};
const v$ = useVuelidate(rules, formData);

/* ---------------------------
   Methods
--------------------------- */
const fnFinalSubmit = async () => {
  v$.value.$touch();

  if (v$.value.$error) {
    $q.notify({ color: "negative", message: "Please review fields again.", icon: "warning" });
    return;
  }

  try {
    $q.loading.show({
      delay: 0,
      spinnerColor: "purple-9",
      message: "Submitting data..."
    });

    await store.dispatch("MarsApiSync/STATE_MARS", formData.tokenState);

    $q.loading.hide();
    $q.notify({ color: "positive", message: "Successfully created!", icon: "thumb_up" });
  } catch {

    $q.loading.hide();
    $q.notify({ color: "negative", message: "Please try again later!", icon: "thumb_down" });
  }
};

/* ---------------------------
   Debugging
--------------------------- */
console.log("STATE AUTH_TOKEN DETAILS--------->>>>", formData.tokenState);
</script>

<style scoped>
#textboxid {
  height: 119px;
  width: 97%;
  font-size: 14pt;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  border: 3px solid green;
}
</style>
