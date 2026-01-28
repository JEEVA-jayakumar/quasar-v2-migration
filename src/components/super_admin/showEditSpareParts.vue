<template>
  <div>
    <!-- Modal -->
    <q-dialog
      v-model="toggleModel"
      persistent
      @hide="emitShowEditSpareParts"
      transition-show="slide"
      transition-hide="slide"
      class="customModalOverlay"
    >
      <q-card style="min-width: 30vw; padding: 30px">

        <!-- Header -->
        <q-card-section class="row gutter-sm q-py-sm items-center">
          <div class="col-md-12">
            <div class="q-title text-weight-regular">
              Modify Spare Parts Info
            </div>
          </div>
        </q-card-section>

        <!-- Form -->
        <q-card-section>
          <q-form @submit.prevent="submitEditedSpareParts">
            <div class="row gutter-sm q-py-sm items-center">

              <!-- Spare Parts ID (disabled) -->
              <div class="col-md-12">
                <q-input
                  v-model="formData.id"
                  float-label="Spare Parts Id"
                  placeholder="Spare Parts Id"
                  color="grey-9"
                  class="text-weight-regular text-grey-8"
                  disable
                  :error="!!$v.id.$error"
                  @blur="$v.id.$touch()"
                />
              </div>

              <!-- Spare Parts Type -->
              <div class="col-md-12">
                <q-input
                  v-model="formData.spare_parts_types"
                  float-label="Spare Parts Type"
                  placeholder="Spare Parts Type"
                  color="grey-9"
                  class="text-weight-regular text-grey-8"
                  :error="!!$v.spare_parts_types.$error"
                  @blur="$v.spare_parts_types.$touch()"
                />
              </div>

            </div>

            <!-- Buttons -->
            <div class="row gutter-sm q-py-sm items-center">
              <div class="col-md-12 text-right">
                <q-btn
                  flat
                  label="Cancel"
                  color="grey-8"
                  class="bg-white text-weight-regular"
                  @click="emitShowEditSpareParts"
                />
                <q-btn
                  label="Save"
                  color="purple-9"
                  @click="submitEditedSpareParts"
                />
              </div>
            </div>

          </q-form>
        </q-card-section>

      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useQuasar } from "quasar";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useStore } from "vuex";

// Props
const props = defineProps({
  propShowEditSpareParts: Boolean,
  propRowDetails: Object
});

// Emits
const emit = defineEmits(["emitfnshowEditSpareParts"]);

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();

// Reactive state
const toggleModel = ref(props.propShowEditSpareParts);
const formData = reactive({
  id: props.propRowDetails?.id || "",
  spare_parts_types: props.propRowDetails?.spare_parts_types || ""
});

// Vuelidate rules
const rules = {
  id: { required },
  spare_parts_types: { required }
};
const $v = useVuelidate(rules, formData);

// Watch prop to sync modal open/close
watch(() => props.propShowEditSpareParts, val => toggleModel.value = val);

// Emit modal close
const emitShowEditSpareParts = () => emit("emitfnshowEditSpareParts");

// Submit edited Spare Parts
const submitEditedSpareParts = async () => {
  $v.value.$touch();
  if ($v.value.$error) {
    $q.notify({ message: "Please review fields again.", color: "negative", position: "bottom" });
    return;
  }

  $q.loading.show({ message: "Please Wait", spinnerColor: "purple-9", customClass: "shadow-none" });

  try {
    const payload = {
      id: formData.id,
      spare_parts_types: formData.spare_parts_types
    };
    await store.dispatch("sparePartsGetTypes/EDIT_SPARE_PARTS_TYPES", payload);

    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Successfully updated!",
      icon: "thumb_up"
    });

    emitShowEditSpareParts();
  } catch (error) {

    $q.notify({
      color: "negative",
      position: "bottom",
      message: error.body?.message || "Please Try Again Later !",
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
