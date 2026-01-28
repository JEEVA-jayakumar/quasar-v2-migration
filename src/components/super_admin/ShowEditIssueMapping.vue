<template>
  <div>
    <!-- Edit Issue Mapping Dialog -->
    <q-dialog
      v-model="toggleModel"
      persistent
      @hide="emitEditIssueMapping"
      transition-show="slide"
      transition-hide="slide"
      class="customModalOverlay"
    >
      <q-card style="min-width: 50vw; padding: 30px;">
        <!-- Header -->
        <q-card-section class="q-pb-md bottom-border">
          <div class="q-title text-weight-regular">Modify Issue Mapping Info</div>
        </q-card-section>

        <!-- Form -->
        <q-card-section>
          <q-form @submit.prevent="submitIssueMappingForm">
            <!-- Issue Mapping Name -->
            <q-input
              v-model="formData.name"
              float-label="Issue Mapping"
              placeholder="Issue Mapping"
              class="text-weight-regular text-grey-8 q-mb-md"
              color="grey-9"
              :error="!!v$.name.$error"
              @blur="v$.name.$touch()"
            />

            <!-- CS Sub Issue Multi-Select -->
            <div class="q-mb-md">
              <p>CS Sub Issue*</p>
              <div class="q-gutter-sm">
                <div
                  class="row items-center q-mb-xs"
                  v-for="menu in csSubIssueType"
                  :key="menu.id"
                >
                  <q-checkbox
                    v-model="selectedItem"
                    :val="menu"
                    @update:model-value="onCheckboxUpdate(menu)"
                    color="purple-9"
                  />
                  <label>{{ menu.name }}</label>
                </div>
              </div>
            </div>

            <!-- Buttons -->
            <div class="row justify-end q-mt-md">
              <q-btn
                flat
                label="Cancel"
                color="grey-8"
                class="bg-white text-weight-regular q-mr-sm"
                @click="emitEditIssueMapping"
              />
              <q-btn
                label="Save"
                color="purple-9"
                :disable="selectedItem.length === 0"
                @click="submitIssueMappingForm"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Show Sub Task Details -->
    <showServiceSubTaskDetails
      v-if="propShowServiceSubTaskDetails"
      :propShowServiceSubTaskDetails="propShowServiceSubTaskDetails"
      :propRowDetails2="propRowDetails2"
      @emitfnshowServiceSubTaskDetails="toggleSubTaskDetails"
    />
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import showServiceSubTaskDetails from "../../components/super_admin/showServiceSubTaskDetails.vue";

// Props
const props = defineProps({
  propShowEditIssueMapping: Boolean,
  propRowDetails2: Object
});

// Emits
const emit = defineEmits(["emitfnshowEditIssueMapping"]);

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();

// Reactive states
const toggleModel = ref(props.propShowEditIssueMapping);
const csSubIssueType = ref([]);
const selectedItem = ref([]);
const propShowServiceSubTaskDetails = ref(false);

const formData = reactive({
  name: props.propRowDetails2?.name || "",
  csSubIssueTypeSets: []
});

// Vuelidate
const rules = {
  name: { required }
};
const v$ = useVuelidate(rules, formData);

// Watch prop changes
watch(() => props.propShowEditIssueMapping, val => toggleModel.value = val);

// Emit close
const emitEditIssueMapping = () => emit("emitfnshowEditIssueMapping");

// Load CS Sub Issue types on mount
onMounted(async () => {
  await fetchCsSubIssueTypes();
});

// Fetch CS Sub Issue Types from Vuex
const fetchCsSubIssueTypes = async () => {
  await store.dispatch("serviceRequest/FETCH_ACTIVE_CS_SUB_ISSUE_DATAS");
  csSubIssueType.value = store.getters["serviceRequest/getcsActiveSubIssueDetails"];
};



// Toggle Sub Task Details
const toggleSubTaskDetails = () => {
  propShowServiceSubTaskDetails.value = !propShowServiceSubTaskDetails.value;
};

// Submit Issue Mapping
const submitIssueMappingForm = async () => {
  v$.$touch();
  if (v$.$error) {
    $q.notify({ color: "negative", position: "bottom", message: "Please review fields again." });
    return;
  }

  const csSubIssueList = selectedItem.value.map(item => ({ id: item.id }));

  const param = {
    id: props.propRowDetails2.id,
    request: {
      name: formData.name,
      csSubIssue: csSubIssueList
    }
  };

  $q.loading.show();

  try {
    await store.dispatch("serviceRequest/EDIT_ISSUE_MAPPING", param);
    $q.notify({ color: "positive", position: "bottom", message: "Successfully updated!", icon: "thumb_up" });
    emitEditIssueMapping();
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
