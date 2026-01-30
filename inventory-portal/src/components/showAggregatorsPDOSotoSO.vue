<template>
  <!-- CHANGE: q-modal to q-dialog -->
  <q-dialog
    v-model="toggleModal"
    persistent
  >
    <q-card style="padding: 10px; max-width: 50vw; min-width: 400px">
      <div class="q-pa-md column">

        <!-- Header -->
        <div class="col-md-12 bottom-border">
          <div class="q-title text-weight-regular q-py-sm">
            Aggregator POD Number
          </div>
        </div>

        <!-- POD Number Input -->
        <div class="col-md-8 q-pt-md" align="left">
          <q-input
            v-model="formData.podNumber"
            label="Enter POD Number"
            placeholder="POD Number"
            color="grey-9"
          />
        </div>

        <!-- Remarks Textarea -->
        <div class="col-md-8 q-pt-md" align="left">
          <q-input
            v-model="formData.remarks"
            filled
            clearable
            type="textarea"
            color="red-12"
            label="Enter Remarks"
            placeholder="Enter Remarks"
          />
        </div>

        <!-- Buttons -->
        <div class="col-md-12 col-md-6 q-pt-md text-right">
          <q-btn
            outline
            icon="block"
            label="Cancel"
            @click="emitToggleCheque"
          />
          <q-btn
            class="common-btn q-ml-sm"
            icon="check"
            label="Submit"
            :disable="!formData.podNumber || !formData.remarks"
            @click="fnSubmitAllocateRegion"
          />
        </div>

      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch, onBeforeMount } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";

// Props
const props = defineProps({
  propshowRegionBasedSo: Boolean,
  propAllScannedItemArr: Object
});

// Emits
const emit = defineEmits(["closeModel"]);

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();

// Reactive state
const toggleModal = ref(props.propshowRegionBasedSo);

const formData = reactive({
  deviceSno: props.propAllScannedItemArr.scannedItems?.[0]?.deviceSerialNumbers?.[0] || "",
  assignedUser: props.propAllScannedItemArr.assignedUserId || "",
  reAssignedUser: props.propAllScannedItemArr.so || "",
  podNumber: "",
  remarks: ""
});

// Sync modal with prop
watch(() => props.propshowRegionBasedSo, (val) => {
  toggleModal.value = val;
});

// Debugging before mount
onBeforeMount(() => {
  console.log("Aggregator Data:", JSON.stringify(props.propAllScannedItemArr));
});

// Emit close
const emitToggleCheque = () => {
  emit("closeModel", "refresh");
};

// Submit allocation function
const fnSubmitAllocateRegion = async () => {
  if (!formData.podNumber) {
    $q.notify({
      color: "amber-9",
      position: "bottom",
      message: "POD number cannot be empty!",
      icon: "warning"
    });
    return;
  }

  if (!formData.remarks) {
    $q.notify({
      color: "amber-9",
      position: "bottom",
      message: "Please Update Remarks",
      icon: "warning"
    });
    return;
  }

  $q.loading.show({
    delay: 100,
    spinnerColor: "purple-9",
    message: "Please wait..."
  });

  try {
    await store.dispatch("InventoryCentral/FEED_AGGREGATORS_ALLOCATE_SO_TO_SO", formData);

    // Reset form
    formData.podNumber = "";
    formData.remarks = "";
    $q.loading.hide();

    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Devices have been successfully allocated to region",
      icon: "thumb_up"
    });

    emitToggleCheque();

  } catch (error) {

    $q.loading.hide();
    $q.notify({
      color: "negative",
      position: "bottom",
      message: error?.body?.message || "Please Try Again Later!",
      icon: "thumb_down"
    });
  }
};
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #ddd;
}
.common-btn {
  background-color: #1976d2;
  color: white;
}
.q-title {
  font-size: 1.25rem;
  font-weight: 500;
}
</style>