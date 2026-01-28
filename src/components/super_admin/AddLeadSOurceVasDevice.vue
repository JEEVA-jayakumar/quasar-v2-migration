<template>
  <q-page>
    <q-dialog
      v-model="toggleModel"
      persistent
      class="customModalOverlay"
      :maximized="false"
      minimized
    >
      <q-card :style="{ padding: '30px', minWidth: '30vw' }">
        <q-card-section class="q-title q-py-sm bottom-border">
          Lead Source And VAS, Device Config
        </q-card-section>

        <q-card-section>
          <q-card style="width:100%">
            <q-card-section>
              <!-- Lead Source -->
              <q-item>
                <q-item-section>
                  <q-select
                    v-model="formData.leadSourceDeviceVasMapping.leadSource"
                    :options="dropDown.leadSourceOptions"
                    label="Select Lead Source"
                    placeholder="Lead source"
                    outlined
                    color="grey-9"
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
                    outlined
                    color="grey-9"
                  />
                </q-item-section>
              </q-item>

              <!-- VAS Multi-Select -->
              <q-item>
                <q-item-section>
                  <q-select
                    multiple
                    v-model="formData.vasList"
                    :options="dropDown.vasOptions"
                    label="Select VAS"
                    placeholder="Select VAS"
                    outlined
                    color="grey-9"
                  />
                </q-item-section>
              </q-item>
            </q-card-section>

            <!-- Submit Button -->
            <q-card-actions align="end">
              <q-btn label="Submit" color="purple-9" @click="fnsubmit" />
            </q-card-actions>
          </q-card>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default {
  name: "LeadSourceVasDeviceModal",
  props: {
    propShowAddLeadSourceVasDevice: { type: Boolean, required: true }
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const store = useStore();

    const toggleModel = ref(props.propShowAddLeadSourceVasDevice);

    // Reactive form
    const formData = reactive({
      leadSourceDeviceVasMapping: {
        leadSource: "",
        device: ""
      },
      vasList: []
    });

    // Dropdown options
    const dropDown = reactive({
      leadSourceOptions: [],
      deviceOptions: [],
      vasOptions: []
    });

    // Vuelidate rules
    const rules = {
      formData: {
        leadSourceDeviceVasMapping: {
          leadSource: { required },
          device: { required }
        },
        vasList: { required }
      }
    };
    const $v = useVuelidate(rules, { formData });

    // Load all dropdowns
    const loadDropdowns = async () => {
      try {
        // Lead Source
        await store.dispatch("leadSource/LEAD_SOURCE_ACTIVE_LIST");
        dropDown.leadSourceOptions = store.getters["leadSource/getActiveLeadSource"].map(
          (item) => ({ label: item.sourceName, value: item })
        );

        // Device
        await store.dispatch("SA_Devices/FETCH_DEVICES_DATA");
        dropDown.deviceOptions = store.getters["SA_Devices/getAllDevicesInfo"].map(
          (item) => ({ label: item.deviceName, value: item })
        );

        // VAS
        await store.dispatch("vasCreation/GET_ALL_VAS_DETAILS");
        dropDown.vasOptions = store.getters["vasCreation/getAllVasDetails"].map(
          (item) => ({ label: item.name, value: item })
        );
      } catch (error) {

        console.error("Error loading dropdowns:", error);
      }
    };

    onMounted(() => {
      loadDropdowns();
    });

    // Submit
    const fnsubmit = async () => {
      $v.value.$touch();
      if ($v.value.$error) {
        $q.notify({
          color: "negative",
          position: "bottom",
          message: "Please fill all mandatory fields",
          icon: "info"
        });
        return;
      }

      try {
        $q.loading.show({ spinnerColor: "purple-9", message: "Validating..." });
        await store.dispatch(
          "leadSourceVasDeviceConfig/CREATE_LS_VAS_DEVICE_CONFIG",
          formData
        );

        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Successfully Created",
          icon: "thumb_up"
        });

        // Reset form
        formData.leadSourceDeviceVasMapping.leadSource = "";
        formData.leadSourceDeviceVasMapping.device = "";
        formData.vasList = [];

        emit("update:propShowAddLeadSourceVasDevice", false);
      } catch (error) {

        $q.notify({
          color: "negative",
          position: "bottom",
          message: error.body?.message || "Something went wrong",
          icon: "thumb_down"
        });
      } finally {
        $q.loading.hide();
      }
    };

    return { toggleModel, formData, dropDown, fnsubmit, $v };
  }
};
</script>

<style scoped>
label {
  padding: 10px;
  display: table;
}
</style>
