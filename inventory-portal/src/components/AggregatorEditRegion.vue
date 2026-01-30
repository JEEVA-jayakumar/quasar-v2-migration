<template>
  <div>
    <q-dialog
      v-model="toggleModel"
      persistent
      :max-width="'500px'"
      :content-class="'q-pa-lg customModalOverlay'"
      @hide="emitfnshowEditRegion"
      @escape-key="emitfnshowEditRegion"
    >
      <form class="column q-gutter-md">
        <!-- Title -->
        <div class="q-title text-weight-regular">Edit POD</div>

        <!-- POD Number Input -->
        <q-input
          v-model="formData.pod"
          float-label="Pod Number"
          placeholder="Pod Number"
          :error="v$.formData.pod.$error"
          class="text-weight-regular text-grey-8"
          color="grey-9"
        />

        <!-- Region Select -->
        <q-select
          v-model="formData.region"
          float-label="Region"
          placeholder="Region"
          :options="inventoryData.regionFilterOptions"
          color="grey-9"
        />

        <!-- Buttons -->
        <div class="row justify-end q-gutter-sm">
          <q-btn
            flat
            color="grey-8"
            label="Cancel"
            @click.prevent="emitfnshowEditRegion"
          />
          <q-btn
            color="purple-9"
            label="Save"
            @click.prevent="submitRegion"
          />
        </div>
      </form>
    </q-dialog>
  </div>
</template>

<script>
import { reactive, ref, computed, watch, onMounted } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useStore } from "vuex";

export default {
  name: "EditPodModal",
  props: {
    propShowEditRegion: { type: Boolean, default: false },
    propRowDetails: { type: Object, default: () => ({}) },
  },
  emits: ["emitfnshowEditRegion"],
  setup(props, { emit }) {
    const store = useStore();

    // Modal toggle
    const toggleModel = ref(props.propShowEditRegion);
    watch(() => props.propShowEditRegion, (val) => (toggleModel.value = val));

    // Form data
    const formData = reactive({
      pod: props.propRowDetails.podNumber || "",
      region: props.propRowDetails.region?.regionAreaName || "",
      Aggregator: props.propRowDetails.AggregatorDevice?.aggregator?.id || ""
    });

    // Inventory data
    const inventoryData = reactive({
      regionFilterOptions: []
    });

    // Vuelidate setup
    const rules = {
      formData: {
        pod: { required },
        region: { required },
        Aggregator: { required }
      }
    };
    const v$ = useVuelidate(rules, { formData });

    // Vuex getters
    const getAllRegionsData = computed(() => store.getters["SuperAdminUsers/getAllRegionsData"]);

    // Vuex actions
    const { FETCH_ALL_REGIONS_DATA, EDIT_AGGREGATOR_POD_REGION } = store._actions
      ? {
          FETCH_ALL_REGIONS_DATA: (...args) => store.dispatch("SuperAdminUsers/FETCH_ALL_REGIONS_DATA", ...args),
          EDIT_AGGREGATOR_POD_REGION: (...args) => store.dispatch("SuperAdminUsers/EDIT_AGGREGATOR_POD_REGION", ...args),
        }
      : {};

    const FETCH_AGGREGATOR_POD_LIST = (...args) =>
      store.dispatch("AggregatorPodLists/FETCH_AGGREGATOR_POD_LIST", ...args);

    // Emit cancel
    const emitfnshowEditRegion = () => emit("emitfnshowEditRegion");

    // Submit function
    const submitRegion = async () => {
      v$.value.$touch();
      if (v$.value.$error) {
        window.$q.notify("Please review fields again.");
        return;
      }

      const params = {
        pod: formData.pod,
        region: formData.region
      };

      window.$q.loading.show({
        delay: 100,
        message: "Please Wait",
        spinnerColor: "purple-9",
        customClass: "shadow-none"
      });

      try {
        const response = await EDIT_AGGREGATOR_POD_REGION(params);
        await FETCH_AGGREGATOR_POD_LIST();
        emitfnshowEditRegion();
        window.$q.loading.hide();
        window.$q.notify({
          color: "positive",
          position: "bottom",
          message: response.data.message,
          icon: "thumb_up"
        });
      } catch (error) {

        window.$q.loading.hide();
        window.$q.notify({
          color: "amber",
          position: "bottom",
          message: error.body?.message || "Please Try Again Later !",
          icon: "thumb_down"
        });
      }
    };

    // Load regions on mount
    const getAllRegion = async () => {
      try {
        await FETCH_ALL_REGIONS_DATA();
        inventoryData.regionFilterOptions = getAllRegionsData.value;
        window.$q.loading.hide();
      } catch {
        window.$q.loading.hide();
      }
    };

    onMounted(() => getAllRegion());

    return {
      toggleModel,
      formData,
      inventoryData,
      v$,
      submitRegion,
      emitfnshowEditRegion
    };
  }
};
</script>

<style scoped>
.customModalOverlay {
  min-width: 40vw;
}
</style>
