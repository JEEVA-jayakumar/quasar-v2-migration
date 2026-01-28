<template>
  <div>
    <!-- Dialog for Editing Region -->
    <q-dialog
      v-model="toggleModel"
      persistent
      @hide="emitEditRegions"
      transition-show="slide"
      transition-hide="slide"
      class="customModalOverlay"
    >
      <q-card style="min-width: 30vw; padding: 30px;">
        <!-- Header -->
        <q-card-section class="row gutter-sm q-py-sm">
          <div class="col">
            <div class="q-title text-weight-regular">Modify Region Info</div>
          </div>
        </q-card-section>

        <!-- Form -->
        <q-card-section>
          <q-form @submit.prevent="submitRegionForm">
            <!-- Region Group Select -->
            <div class="q-mb-md">
              <q-select
                v-model="formData.regionGroup"
                :options="regionGroupOptions"
                float-label="Region Group"
                placeholder="Region Group"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                :error="!!v$.regionGroup.$error"
                @blur="v$.regionGroup.$touch()"
              />
            </div>

            <!-- Region Name Input -->
            <div class="q-mb-md">
              <q-input
                v-model="formData.regionAreaName"
                float-label="Region"
                placeholder="Region"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                :error="!!v$.regionAreaName.$error"
                @blur="v$.regionAreaName.$touch()"
              />
            </div>

            <!-- Buttons -->
            <div class="row justify-end q-mt-md">
              <q-btn
                flat
                label="Cancel"
                color="grey-8"
                class="bg-white text-weight-regular"
                @click="emitEditRegions"
              />
              <q-btn
                label="Save"
                color="purple-9"
                class="q-ml-sm"
                @click="submitRegionForm"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import _ from "lodash";

// Props
const props = defineProps({
  propShowEditRegions: Boolean,
  propRowDetails: Object
});

// Emits
const emit = defineEmits(["emitfnshowRegions"]);

// Quasar and Vuex
const $q = useQuasar();
const store = useStore();

// Reactive state
const toggleModel = ref(props.propShowEditRegions);
const regionGroupOptions = ref([]);

const formData = reactive({
  regionGroup: props.propRowDetails?.regionGroup?.regionName || "",
  regionAreaName: props.propRowDetails?.regionAreaName || "",
  id: props.propRowDetails?.id || null
});

// Vuelidate rules
const rules = {
  regionGroup: { required },
  regionAreaName: { required }
};

const v$ = useVuelidate(rules, formData);

// Watch prop changes
watch(() => props.propShowEditRegions, val => toggleModel.value = val);

// Emit close
const emitEditRegions = () => emit("emitfnshowRegions");

// Fetch Region Group Options
const fetchRegionGroups = async () => {
  try {
    await store.dispatch("regionGroupDatas/FETCH_REGION_GROUP_DATAS");
    regionGroupOptions.value = _.map(store.getters["regionGroupDatas/getAllRegionGroupData"], item => ({
      label: item.regionName,
      value: item.regionName
    }));
  } catch (err) {
    console.error("Failed to fetch region groups", err);
  }
};

// Form submit
const submitRegionForm = async () => {
  v$.$touch();
  if (v$.$error) {
    $q.notify({ color: "negative", position: "bottom", message: "Please review fields again." });
    return;
  }

  $q.loading.show({ message: "Please Wait", spinnerColor: "purple-9", delay: 100 });

  try {
    await store.dispatch("SuperAdminUsers/FEED_EXISTING_REGION_DATA", formData);
    await store.dispatch("SuperAdminUsers/FETCH_ALL_REGIONS_DATA");

    $q.notify({ color: "positive", position: "bottom", message: "Successfully updated!", icon: "thumb_up" });
    emitEditRegions();
  } catch (error) {

    $q.notify({
      color: "negative",
      position: "bottom",
      message: error?.body?.message || "Please Try Again Later !",
      icon: "thumb_down"
    });
  } finally {
    $q.loading.hide();
  }
};

// On mounted, fetch region group options
onMounted(fetchRegionGroups);
</script>

<style scoped>
.customModalOverlay {
  max-width: 100%;
}
</style>
