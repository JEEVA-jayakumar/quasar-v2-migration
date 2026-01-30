<template>
  <q-dialog
    v-model="toggleModel"
    persistent
    class="customModalOverlay"
    :max-width="'640px'"
  >
    <q-card class="q-pa-md">

      <div class="text-h6 q-mb-md">
        Edit Pod And Region
      </div>

      <q-form @submit.prevent="submitPodAndRegions">

        <!-- POD NUMBER -->
        <q-input
          v-model="formData.podNumber"
          label="Enter Pod Number"
          disable
          color="grey-9"
          class="q-mb-md"
        />

        <!-- DEVICE -->
        <q-select
          v-model="formData.device"
          :options="deviceOptions"
          label="Enter Device Name"
          color="grey-9"
          class="q-mb-md"
        />

        <!-- REGION -->
        <q-select
          v-model="formData.region"
          :options="regionOptions"
          label="Select Region"
          color="grey-9"
          class="q-mb-md"
        />

        <!-- ACTION BUTTONS -->
        <div class="row justify-end q-gutter-sm">
          <q-btn
            flat
            color="grey-8"
            label="Cancel"
            @click="emitfnshowAggregatorsEditRegion"
          />
          <q-btn
            color="purple-9"
            label="Save"
            type="submit"
          />
        </div>

      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, reactive, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

export default {
  name: "EditPodAndRegion",
  props: {
    propShowEditRegion: { type: Boolean, required: true },
    propRowDetails: { type: Object, required: true }
  },
  emits: ["emitfnshowAggregatorsEditRegion"],

  setup(props, { emit }) {
    const $q = useQuasar();
    const store = useStore();

    /* ------------------------------------
     * Modal state
     * ---------------------------------- */
    const toggleModel = ref(props.propShowEditRegion);

    watch(
      () => props.propShowEditRegion,
      (val) => (toggleModel.value = val)
    );

    /* ------------------------------------
     * Form data (UNCHANGED STRUCTURE)
     * ---------------------------------- */
    const formData = reactive({
      podNumber: props.propRowDetails.podNumber,
      device: JSON.stringify(props.propRowDetails.aggregatorDevice),
      region: JSON.stringify(props.propRowDetails.region)
    });

    /* ------------------------------------
     * Select options
     * ---------------------------------- */
    const deviceOptions = ref([]);
    const regionOptions = ref([]);

    /* ------------------------------------
     * Load devices
     * ---------------------------------- */
    const loadDevices = async () => {
      try {
        await store.dispatch(
          "superAdminAggregatorsDevice/GET_ACTIVE_CREATED_DEVICE_LIST",
          props.propRowDetails.aggregatorDevice.aggregator.id
        );

        deviceOptions.value =
          store.getters["superAdminAggregatorsDevice/getCreatedActiveDeviceList"]
            .map(d => ({
              label: d.deviceName,
              value: JSON.stringify(d)
            }));
      } catch {
        deviceOptions.value = [];
      }
    };

    /* ------------------------------------
     * Load regions
     * ---------------------------------- */
    const loadRegions = async () => {
      try {
        await store.dispatch("InventoryCentral/FETCH_ALL_REGIONS_DATA");

        regionOptions.value =
          store.getters["InventoryCentral/getAllRegionsData"]
            .map(r => ({
              label: r.regionAreaName,
              value: JSON.stringify(r)
            }));
      } catch {
        regionOptions.value = [];
      }
    };

    /* ------------------------------------
     * Submit
     * ---------------------------------- */
    const submitPodAndRegions = async () => {
      try {
        $q.loading.show({
          spinnerColor: "purple-9",
          message: "Updating data..."
        });

        const finalRequest = {
          ...props.propRowDetails,
          podNumber: formData.podNumber,
          device: JSON.parse(formData.device),
          region: JSON.parse(formData.region)
        };

        await store.dispatch(
          "inventoryWithRegion/EDIT_AGGREGATORS_INVENTORY_WITH_REGION_DETAILS",
          { request: finalRequest }
        );

        await store.dispatch(
          "inventoryWithRegion/FETCH_AGGREGATORS_INVENTORY_WITH_REGION_DATAS"
        );

        $q.notify({
          color: "positive",
          position: "bottom",
          icon: "thumb_up",
          message: "Pod & Region updated successfully"
        });

        emitfnshowAggregatorsEditRegion();
      } catch (error) {

        $q.notify({
          color: "negative",
          position: "bottom",
          icon: "thumb_down",
          message: error?.data?.message || "Please try again later"
        });
      } finally {
        $q.loading.hide();
      }
    };

    const emitfnshowAggregatorsEditRegion = () => {
      emit("emitfnshowAggregatorsEditRegion");
    };

    onMounted(() => {
      loadDevices();
      loadRegions();
    });

    return {
      toggleModel,
      formData,
      deviceOptions,
      regionOptions,
      submitPodAndRegions,
      emitfnshowAggregatorsEditRegion
    };
  }
};
</script>

<style scoped>
.customModalOverlay {
  z-index: 2000;
}
</style>
