<template>
  <q-page>
    <q-dialog
      v-model="toggleModal"
      persistent
      class="customModalOverlay"
      @hide="emitClose"
      @escape-key="emitClose"
      minimized
    >
      <q-card :style="{ padding: '30px', minWidth: '30vw' }">
        <q-card-section class="q-title text-weight-regular">
          Add Prefix
        </q-card-section>

        <q-card-section>
          <form @submit.prevent="submitCreatePrefix">
            <q-select
              v-model="formData.leadSource"
              :options="dropDown.leadSourceOptions"
              label="Select lead source"
              placeholder="Lead source"
              outlined
              color="grey-9"
            />

            <q-input
              v-model="formData.prefix"
              label="Enter prefix* (3 digits)"
              placeholder="Enter prefix* (3 digits)"
              outlined
              color="grey-9"
              :error="$v.formData.prefix.$error"
              class="q-mt-md"
            >
              <template v-if="$v.formData.prefix.$error" v-slot:after>
                <div class="text-negative q-caption q-mt-xs">
                  <div v-if="$v.formData.prefix.$params.required">
                    <q-icon color="negative" name="warning" /> Required
                  </div>
                  <div v-if="$v.formData.prefix.$params.minLength">
                    <q-icon color="negative" name="warning" />
                    Length must be {{ $v.formData.prefix.$params.minLength.min }}-{{ $v.formData.prefix.$params.maxLength.max }}
                  </div>
                </div>
              </template>
            </q-input>

            <div class="row justify-end q-mt-md">
              <q-btn
                flat
                color="grey-8"
                label="Cancel"
                class="bg-white"
                @click="emitClose"
              />
              <q-btn
                color="purple-9"
                label="Save"
                class="q-ml-sm"
                @click="submitCreatePrefix"
              />
            </div>
          </form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { reactive, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import useVuelidate from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";

export default {
  name: "AddPrefixModal",
  props: {
    propShowAddPrefix: { type: Boolean, required: true }
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const store = useStore();

    const toggleModal = ref(props.propShowAddPrefix);

    const formData = reactive({
      leadSource: "",
      prefix: "",
      baseMidLength: 15,
      baseTidLength: 8
    });

    const dropDown = reactive({
      leadSourceOptions: []
    });

    // Vuelidate rules
    const rules = {
      formData: {
        leadSource: { required },
        prefix: { required, minLength: minLength(3), maxLength: maxLength(3) }
      }
    };
    const $v = useVuelidate(rules, { formData });

    const emitClose = () => {
      emit("emitfnshowaddPrefix");
    };

    // Load Lead Source options
    const loadLeadSourceOptions = async () => {
      try {
        await store.dispatch("leadSource/LEAD_SOURCE_ACTIVE_LIST");
        dropDown.leadSourceOptions = store.getters["leadSource/getActiveLeadSource"].map(item => ({
          value: item,
          label: item.sourceName
        }));
      } catch (error) {

        console.error("Error loading lead source options:", error);
      }
    };

    onMounted(() => {
      loadLeadSourceOptions();
    });

    const submitCreatePrefix = async () => {
      $v.value.$touch();

      if ($v.value.$error) return;

      try {
        $q.loading.show({
          delay: 100,
          message: "Please Wait",
          spinnerColor: "purple-9",
          customClass: "shadow-none"
        });

        await store.dispatch("Prefix/ADD_NEW_PREFIX", formData);

        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Prefix successfully created!",
          icon: "thumb_up"
        });

        emit("emitfnshowaddPrefix", "refresh");

        // Reset form
        formData.leadSource = "";
        formData.prefix = "";
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

    return {
      toggleModal,
      formData,
      dropDown,
      $v,
      emitClose,
      submitCreatePrefix
    };
  }
};
</script>

<style scoped>
.customModalOverlay {
  max-height: 90vh;
}
</style>
