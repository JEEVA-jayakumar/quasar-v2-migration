<template>
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col-12 q-title q-pa-md text-weight-regular bottom-border"></div>
      <div class="col-md-5 col-sm-4 col-xs-12 q-pa-sm">
        <div
          class="q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
        >
          <strong>MARS API SYNC - DEVICE MODEL</strong>
        </div>

        <q-card style="width: 100%;">
          <q-card-section>
            <q-list no-border>
              <q-item>
                <q-item-section>
                  <textarea
                    disabled
                    rows="5"
                    cols="50"
                    v-model="formData.tokenDeviceModel"
                    class="text-weight-regular text-grey-8"
                  ></textarea>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-card-section class="text-center">
            <q-btn
              class="common-btn"
              color="purple-9"
              :disable="!formData.tokenDeviceModel"
              label="Submit"
              size="md"
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
import { useStore } from "vuex";
import { useQuasar } from "quasar";

export default {
  name: "MarsApiSyncDeviceModel",
  setup() {
    const store = useStore();
    const $q = useQuasar();

    const formData = reactive({
      tokenDeviceModel: "Token " + localStorage.getItem("auth_token"),
    });

    const fnFinalSubmit = async () => {
      if (!formData.tokenDeviceModel) {
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
        const response = await store.dispatch(
          "MarsApiSync/DEVICE_MODEL_MARS",
          formData.tokenDeviceModel
        );
        console.log("DEVICE MODEL RESPONSE:", response);

        $q.loading.hide();
        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Successfully created!",
          icon: "thumb_up",
        });
      } catch (error) {

        console.error(error);
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
      console.log(
        "DEVICE MODEL AUTH_TOKEN DETAILS--------->>>>",
        formData.tokenDeviceModel
      );
    });

    return {
      formData,
      fnFinalSubmit,
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

.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  border: 3px solid green;
}
</style>
