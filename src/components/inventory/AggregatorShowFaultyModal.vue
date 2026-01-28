<template>
  <div>
    <q-dialog
      v-model="toggleModal"
      persistent
      :max-width="'500px'"
      class="q-pa-md"
    >
      <div class="column">
        <!-- Title -->
        <div class="col-md-12 bottom-border">
          <div class="q-title text-weight-regular q-py-sm">POD Number</div>
        </div>

        <!-- POD Number Input -->
        <div class="col-md-8 q-pt-md" align="left">
          <q-input
            v-model="formData.podNumber"
            color="grey-9"
            float-label="Enter POD Number"
            placeholder="POD Number"
          />
        </div>

        <!-- Buttons -->
        <div class="col-md-12 col-md-6 q-pt-md row justify-end q-gutter-sm">
          <q-btn
            outline
            icon="block"
            label="Cancel"
            @click="emitToggleCheque"
          />
          <q-btn
            icon="check"
            class="common-btn"
            label="Submit"
            color="positive"
            @click="fnSubmitAllocateRegion"
          />
        </div>
      </div>
    </q-dialog>
  </div>
</template>

<script>
import { ref, reactive, watch } from "vue";
import { useStore } from "vuex";

export default {
  name: "AllocatePodModal",
  props: {
    propshowPDOmodal: { type: Boolean, default: false },
    propAllScannedItemArr: { type: Object, default: () => ({ region: "", scannedItems: [] }) },
  },
  emits: ["closeModel"],
  setup(props, { emit, root }) {
    const store = useStore();

    // Modal toggle
    const toggleModal = ref(props.propshowPDOmodal);
    watch(() => props.propshowPDOmodal, (val) => (toggleModal.value = val));

    // Form data
    const formData = reactive({
      region: props.propAllScannedItemArr.region,
      podNumber: "",
      scannedDevices: props.propAllScannedItemArr.scannedItems
    });

    // Cancel / close modal
    const emitToggleCheque = () => emit("closeModel");

    // Submit allocation
    const fnSubmitAllocateRegion = async () => {
      if (!formData.region) {
        window.$q.notify({
          color: "amber-9",
          position: "bottom",
          message: "Region cannot be empty!",
          icon: "warning"
        });
        return;
      }

      if (!formData.podNumber) {
        window.$q.notify({
          color: "amber-9",
          position: "bottom",
          message: "POD number cannot be empty!",
          icon: "warning"
        });
        return;
      }

      if (!formData.scannedDevices || formData.scannedDevices.length === 0) {
        window.$q.notify({
          color: "amber-9",
          position: "bottom",
          message: "Scanned devices cannot be empty!",
          icon: "warning"
        });
        return;
      }

      try {
        // Show loader
        store.dispatch("commonLoader/TOGGLE_COMMON_LOADER", true);

        await store.dispatch("AggregatorInventoryCentral/FEED_AGGREGATOR_ALLOCATE_TO_REGION", formData);

        // Hide loader
        store.dispatch("commonLoader/TOGGLE_COMMON_LOADER", false);

        window.$q.notify({
          color: "positive",
          position: "bottom",
          message: "Devices have been successfully allocated to region",
          icon: "thumb_up"
        });

        // Navigate back to inventory
        emitToggleCheque();
        root.$router.push("/inventory/central");
      } catch (error) {

        store.dispatch("commonLoader/TOGGLE_COMMON_LOADER", false);
        window.$q.notify({
          color: "negative",
          position: "bottom",
          message: error.body?.message || "Please Try Again Later!",
          icon: "thumb_down"
        });
      }
    };

    return {
      toggleModal,
      formData,
      emitToggleCheque,
      fnSubmitAllocateRegion
    };
  }
};
</script>

<style scoped>
.common-btn {
  min-width: 100px;
}
</style>
