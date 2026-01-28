<template>
  <div>
    <q-dialog
      v-model="toggleModal"
      persistent
      :content-css="{ padding: '10px', maxWidth: '50vw' }"
    >
      <q-card class="q-pa-md">
        <div class="column">
          <!-- Modal Title -->
          <div class="col-12 bottom-border">
            <div class="q-title text-weight-regular q-py-sm">POD Number</div>
          </div>

          <!-- Inputs -->
          <div class="col-md-8 q-pt-md" align="left">
            <q-input
              v-model="formData.podNumber"
              float-label="Enter POD Number"
              placeholder="POD Number"
              color="grey-9"
            />
            <br />
            <q-input
              v-model="formData.remarks"
              filled
              clearable
              type="textarea"
              color="red-12"
              float-label="Enter Remarks"
              placeholder="Enter Remarks"
            />
          </div>

          <!-- Action Buttons -->
          <div class="col-12 q-pt-md" align="right">
            <q-btn
              icon="block"
              outline
              label="Cancel"
              class="q-mr-sm"
              @click="emitToggleCheque"
            />
            <q-btn
              icon="check"
              label="Submit"
              class="common-btn"
              :disable="!formData.remarks || !formData.podNumber"
              @click="fnSubmitAllocateRegion"
            />
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { Notify, Loading } from "quasar";

// Props
const props = defineProps({
  propshowRegionBasedSo: Boolean,
  propAllScannedItemArr: Object
});

// Emits
const emit = defineEmits(["closeModel"]);

// Vuex
const store = useStore();
const { TOGGLE_COMMON_LOADER } = store.dispatch;

// Reactive state
const toggleModal = ref(props.propshowRegionBasedSo);
const formData = ref({
  deviceSno: props.propAllScannedItemArr.scannedItems[0].deviceSerialNumbers[0],
  assignedUser: props.propAllScannedItemArr.assignedUserId,
  reAssignedUser: props.propAllScannedItemArr.so,
  podNumber: "",
  remarks: ""
});

// Lifecycle
onBeforeMount(() => {
  console.log("DATAT", JSON.stringify(props.propAllScannedItemArr));
});

// Methods
function emitToggleCheque() {
  emit("closeModel");
}

async function fnSubmitAllocateRegion() {
  if (!formData.value.assignedUser) {
    Notify.create({
      color: "amber-9",
      position: "bottom",
      message: "assignedUser cannot be empty!",
      icon: "warning"
    });
    return;
  }

  if (!formData.value.podNumber) {
    Notify.create({
      color: "amber-9",
      position: "bottom",
      message: "POD number cannot be empty!",
      icon: "warning"
    });
    return;
  }

  if (!formData.value.deviceSno?.length) {
    Notify.create({
      color: "amber-9",
      position: "bottom",
      message: "Scanned devices cannot be empty!",
      icon: "warning"
    });
    return;
  }

  Loading.show({
    delay: 100,
    spinnerColor: "purple-9",
    message: "Please wait..."
  });

  try {
    await store.dispatch("InventoryCentral/FEED_ALLOCATE_SO_TO_SO", formData.value);
    TOGGLE_COMMON_LOADER(false);

    Notify.create({
      color: "positive",
      position: "bottom",
      message: "Devices have been successfully allocated to region",
      icon: "thumb_up"
    });

    emitToggleCheque();
  } catch (error) {

    TOGGLE_COMMON_LOADER(false);
    Notify.create({
      color: "negative",
      position: "bottom",
      message: error?.body?.message || "Please Try Again Later!",
      icon: "thumb_down"
    });
  } finally {
    Loading.hide();
  }
}
</script>

<style scoped>
.common-btn {
  min-width: 90px;
}
</style>
