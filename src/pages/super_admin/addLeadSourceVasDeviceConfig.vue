<template>
  <q-page padding>
    <div class="row">
      <div class="col-12 q-title q-pa-md text-weight-regular bottom-border">
        LeadSource And VAS, Device Config
      </div>

      <!-- Setup MDR Details -->
      <div class="col-md-5 col-sm-6 col-xs-12 q-pa-sm">
        <q-card style="width:100%">
          <q-card-section>
            <q-list no-border>
              <!-- Lead Source -->
              <q-item>
                <q-item-section>
                  <q-select
                    v-model="formData.leadSourceDeviceVasMapping.leadSource"
                    :options="dropDown.leadSourceOptions"
                    label="Select Lead Source"
                    placeholder="Lead Source"
                    color="grey-9"
                    dense
                    clearable
                    outlined
                  />
                </q-item-section>
              </q-item>

              <!-- Device -->
              <q-item>
                <q-item-section>
                  <q-select
                    v-model="formData.leadSourceDeviceVasMapping.device"
                    :options="dropDown.deviceOptions"
                    label="Select Device"
                    placeholder="Select Device"
                    color="grey-9"
                    dense
                    clearable
                    outlined
                  />
                </q-item-section>
              </q-item>

              <!-- VAS Multiple -->
              <q-item>
                <q-item-section>
                  <q-select
                    v-model="formData.vasList"
                    :options="dropDown.vasOptions"
                    label="Select VAS"
                    placeholder="Select VAS"
                    multiple
                    color="grey-9"
                    dense
                    clearable
                    outlined
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-card-actions align="end" vertical>
            <q-btn
              label="Submit"
              color="purple-9"
              @click="fnsubmit"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default {
  name: "MDRdetails",
  setup() {
    const $q = useQuasar();
    const store = useStore();

    // Reactive form data
    const formData = reactive({
      leadSourceDeviceVasMapping: {
        leadSource: "",
        device: "",
      },
      vasList: [],
    });

    // Dropdown options
    const dropDown = reactive({
      leadSourceOptions: [],
      deviceOptions: [],
      vasOptions: [],
    });

    // Vuelidate rules
    const rules = {
      leadSourceDeviceVasMapping: {
        leadSource: { required },
        device: { required },
      },
      vasList: { required },
    };

    const v$ = useVuelidate(rules, formData);

    // Load dropdowns
    const loadDropdowns = async () => {
      try {
        // Lead Source
        await store.dispatch("leadSource/LEAD_SOURCE_ACTIVE_LIST");
        dropDown.leadSourceOptions = store.getters["leadSource/getActiveLeadSource"].map(item => ({
          label: item.sourceName,
          value: item,
        }));

        // Devices
        await store.dispatch("SA_Devices/FETCH_DEVICES_DATA");
        dropDown.deviceOptions = store.getters["SA_Devices/getAllDevicesInfo"].map(item => ({
          label: item.deviceName,
          value: item,
        }));

        // VAS
        await store.dispatch("vasCreation/GET_ALL_VAS_DETAILS");
        dropDown.vasOptions = store.getters["vasCreation/getAllVasDetails"].map(item => ({
          label: item.name,
          value: item,
        }));
      } catch (error) {

        console.error("Error loading dropdowns", error);
        $q.notify({
          type: "negative",
          message: "Failed to load dropdown data",
        });
      }
    };

    onMounted(() => {
      loadDropdowns();
    });

    // Submit function
    const fnsubmit = async () => {
      v$.value.$touch();
      if (v$.value.$error) {
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Please fill all mandatory fields",
          icon: "info",
        });
        return;
      }

      try {
        $q.loading.show({
          spinnerColor: "purple-9",
          message: "Validating...",
        });

        $q.loading.hide();

        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Successfully Created",
          icon: "thumb_up",
        });

        // Reset form
        formData.leadSourceDeviceVasMapping.leadSource = "";
        formData.leadSourceDeviceVasMapping.device = "";
        formData.vasList = [];
        v$.value.$reset();
      } catch (error) {

        $q.loading.hide();
        const msg =
          error?.body?.message ?? "Please try again later!";
        $q.notify({
          color: "warning",
          position: "bottom",
          message: msg,
          icon: "thumb_down",
        });

        // Reset form
        formData.leadSourceDeviceVasMapping.leadSource = "";
        formData.leadSourceDeviceVasMapping.device = "";
        formData.vasList = [];
        v$.value.$reset();
      }
    };

    return {
      formData,
      dropDown,
      fnsubmit,
      v$,
    };
  },
};
</script>

<style scoped>
/* Optional custom styles */
</style>
