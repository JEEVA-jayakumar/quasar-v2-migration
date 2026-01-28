<template>
  <q-dialog :model-value="props.propToggleRegionInfoPop" persistent @update:model-value="handleDialogUpdate">
    <q-card class="q-mt-lg capitalize" style="min-width: 30vw; padding: 20px;">
      
      <!-- Header -->
      <q-card-section class="row items-center q-py-sm border-b">
        <div class="col text-h6">Change Region</div>
        <div class="col-auto">
          <q-btn round size="sm" outline color="dark" icon="close" @click="closeModal" />
        </div>
      </q-card-section>

      <q-card-section>
        <!-- Current Region -->
        <div class="row q-mb-md">
          <div class="col-4">
            <strong>Current Region</strong>
          </div>
          <div class="col-6">
            <div class="current">{{ currentRegion }}</div>
          </div>
        </div>

        <!-- Select Region -->
        <div class="row q-mb-md items-center">
          <div class="col-4 region">
            <strong>Select Region</strong>
          </div>
          <div class="col-6">
            <q-select
              v-model="formData.region"
              :options="regionOptions"
              label="Select Region"
              placeholder="Select Region"
              color="grey-9"
              dense
              outlined
            />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="row q-mt-md justify-end">
          <q-btn
            label="Submit"
            color="purple-9"
            rounded
            class="glossy"
            :disable="!formData.region"
            @click="changeRegion"
          />
        </div>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

// Props - store them in a variable
const props = defineProps({
  regionInformation: Object,
  propToggleRegionInfoPop: Boolean
});

// Emits - store them in a variable
const emit = defineEmits(["closeRegionInformation"]);

// Quasar instance
const $q = useQuasar();

// Vuex store
const store = useStore();

// Reactive state
const currentRegion = ref("");
const formData = ref({ region: "" });
const regionOptions = ref([]);

// Computed getter from Vuex
const getAllRegionsData = computed(() => store.getters["InventoryCentral/getAllRegionsData"]);

// Handle dialog update
const handleDialogUpdate = (value) => {
  if (!value) {
    emit("closeRegionInformation");
  }
};

// On mount
onMounted(() => {
  const storedRegion = JSON.parse(localStorage.getItem("u_i"));
  currentRegion.value = storedRegion?.region?.regionAreaName || "";
  fetchAllRegions();
});

// Methods
function closeModal() {
  emit("closeRegionInformation");
}

function fetchAllRegions() {
  store.dispatch("InventoryCentral/FETCH_ALL_REGIONS_DATA")
    .then(() => {
      regionOptions.value = getAllRegionsData.value.map(region => ({
        label: region.regionAreaName,
        value: region
      }));
    })
    .catch(() => {
      regionOptions.value = [];
    });
}

function changeRegion() {
  const payload = {
    marsDetails: props.regionInformation, // Fixed: Use props.regionInformation
    region: formData.value.region
  };

  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Processing..."
  });

  store.dispatch("HitachiIndianBankOnboarding/CHANGE_HITACHI_REGION", payload)
    .then(() => {
      $q.loading.hide();
      $q.notify({
        color: "positive",
        position: "bottom",
        message: "Region Changed successfully",
        icon: "thumb_up"
      });
      closeModal();
    })
    .catch(error => {
      $q.loading.hide();
      $q.notify({
        color: "negative",
        position: "bottom",
        message: error?.body?.message || "Please Try Again Later!",
        icon: "thumb_down"
      });
    });
}
</script>

<style scoped>
.region {
  margin-top: 15px;
  margin-left: 10px;
}
.current {
  background-color: darksalmon;
  padding: 5px 10px;
  border-radius: 4px;
}
.glossy {
  background-color: rgb(151, 47, 151);
}
.border-b {
  border-bottom: 1px solid #ccc;
}
</style>