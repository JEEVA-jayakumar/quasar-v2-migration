<template>
  <q-dialog
    v-model="dialog"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="min-width: 30vw" class="q-pa-md">

      <q-card-section>
        <div class="text-h6">
          Edit LeadSource And Vas, Device Config
        </div>
      </q-card-section>

      <q-card-section class="q-gutter-md">

        <!-- Lead Source -->
        <q-select
          v-model="formData.leadSourceDeviceVasMapping.leadSource"
          :options="dropDown.leadSourceOptions"
          label="Select Lead Source"
          outlined
          emit-value
          map-options
          :error="v$.formData.leadSourceDeviceVasMapping.leadSource.$error"
          @blur="v$.formData.leadSourceDeviceVasMapping.leadSource.$touch()"
        />

        <!-- Device -->
        <q-select
          v-model="formData.leadSourceDeviceVasMapping.device"
          :options="dropDown.deviceOptions"
          label="Select Device"
          outlined
          emit-value
          map-options
          :error="v$.formData.leadSourceDeviceVasMapping.device.$error"
          @blur="v$.formData.leadSourceDeviceVasMapping.device.$touch()"
        />

        <!-- VAS -->
        <q-select
          v-model="formData.vasList"
          :options="dropDown.vasOptions"
          label="Select VAS"
          outlined
          multiple
          emit-value
          map-options
          :error="v$.formData.vasList.$error"
          @blur="v$.formData.vasList.$touch()"
        />

      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancel"
          color="grey-7"
          @click="closeDialog"
        />
        <q-btn
          label="Save"
          color="purple-9"
          @click="submitModifiedData"
        />
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

/* PROPS & EMITS */
const props = defineProps({
  propShowEditLsVasDevice: Boolean,
  propRowDetails: Object
});

const emit = defineEmits(["emitfnshowLsVasDevice"]);

/* PLUGINS */
const $q = useQuasar();
const store = useStore();

/* STATE */
const dialog = ref(props.propShowEditLsVasDevice);

const formData = reactive({
  leadSourceDeviceVasMapping: {
    leadSource: props.propRowDetails.leadSourceDeviceVasMapping.leadSource,
    device: props.propRowDetails.leadSourceDeviceVasMapping.device
  },
  vasList: props.propRowDetails.vasList.map(v => v)
});

const dropDown = reactive({
  leadSourceOptions: [],
  deviceOptions: [],
  vasOptions: []
});

/* VALIDATION */
const rules = {
  formData: {
    leadSourceDeviceVasMapping: {
      leadSource: { required },
      device: { required }
    },
    vasList: { required }
  }
};

const v$ = useVuelidate(rules, { formData });

/* METHODS */
const closeDialog = () => {
  emit("emitfnshowLsVasDevice");
};

const loadDropdowns = async () => {
  await store.dispatch("leadSource/LEAD_SOURCE_ACTIVE_LIST");
  dropDown.leadSourceOptions = store.getters["leadSource/getActiveLeadSource"]
    .map(item => ({
      label: item.sourceName,
      value: item
    }));

  await store.dispatch("SA_Devices/FETCH_DEVICES_DATA");
  dropDown.deviceOptions = store.getters["SA_Devices/getAllDevicesInfo"]
    .map(item => ({
      label: item.deviceName,
      value: item
    }));

  await store.dispatch("vasCreation/GET_ALL_VAS_DETAILS");
  dropDown.vasOptions = store.getters["vasCreation/getAllVasDetails"]
    .map(item => ({
      label: item.name,
      value: item
    }));
};

const submitModifiedData = async () => {
  v$.value.$touch();
  if (v$.value.$error) return;

  $q.loading.show({
    message: "Please Wait...",
    spinnerColor: "purple-9"
  });

  const payload = {
    leadSourceDeviceVasMapping: {
      leadSource: formData.leadSourceDeviceVasMapping.leadSource,
      device: formData.leadSourceDeviceVasMapping.device
    },
    vasList: formData.vasList
  };

  try {
    await store.dispatch(
      "leadSourceVasDeviceConfig/UPDATE_LS_VAS_DEVICE_CONFIG_DETAILS",
      payload
    );

    $q.notify({
      type: "positive",
      message: "Configuration successfully updated!"
    });

    closeDialog();
  } catch {
    $q.notify({
      type: "negative",
      message: "Please Try Again Later!"
    });
  } finally {
    $q.loading.hide();
  }
};

/* LIFECYCLE */
onMounted(loadDropdowns);
</script>

<style scoped>
</style>
