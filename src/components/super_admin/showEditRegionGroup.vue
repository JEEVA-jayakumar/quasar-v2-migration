<template>
  <div>
    <!-- Dialog for Editing Region Group -->
    <q-dialog
      v-model="toggleModel"
      persistent
      @hide="emitEditRegionsGroup"
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
          <q-form @submit.prevent="submitRegionGroupForm">
            <!-- Region Name Input -->
            <div class="q-mb-md">
              <q-input
                v-model="formData.regionArea"
                float-label="Region"
                placeholder="Region"
                class="text-weight-regular text-grey-8"
                color="grey-9"
                :error="!!v$.regionArea.$error"
                @blur="v$.regionArea.$touch()"
              />
            </div>

            <!-- Buttons -->
            <div class="row justify-end q-mt-md">
              <q-btn
                flat
                label="Cancel"
                color="grey-8"
                class="bg-white text-weight-regular"
                @click="emitEditRegionsGroup"
              />
              <q-btn
                label="Save"
                color="purple-9"
                class="q-ml-sm"
                @click="submitRegionGroupForm"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

// Props
const props = defineProps({
  propShowEditRegionsGroup: Boolean,
  propRowDetails: Object
});

// Emits
const emit = defineEmits(["emitfnshowRegionsGroup"]);

// Quasar and Vuex
const $q = useQuasar();
const store = useStore();

// Reactive state
const toggleModel = ref(props.propShowEditRegionsGroup);

const formData = reactive({
  regionArea: props.propRowDetails?.regionName || ""
});

// Vuelidate rules
const rules = {
  regionArea: { required }
};

const v$ = useVuelidate(rules, formData);

// Watch prop changes
watch(() => props.propShowEditRegionsGroup, val => toggleModel.value = val);

// Emit close
const emitEditRegionsGroup = () => emit("emitfnshowRegionsGroup");

// Submit function
const submitRegionGroupForm = async () => {
  v$.$touch();
  if (v$.$error) {
    $q.notify({ color: "negative", position: "bottom", message: "Please review fields again." });
    return;
  }

  $q.loading.show({ message: "Please Wait", spinnerColor: "purple-9", delay: 100 });

  try {
    const param = { request: props.propRowDetails };
    await store.dispatch("regionGroupDatas/UPDATE_REGION_GROUP_DATAS", param);
    await store.dispatch("SuperAdminUsers/FETCH_ALL_REGIONS_DATA");

    $q.notify({ color: "positive", position: "bottom", message: "Successfully updated!", icon: "thumb_up" });
    emitEditRegionsGroup();
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
</script>

<style scoped>
.customModalOverlay {
  max-width: 100%;
}
</style>
