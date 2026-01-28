<template>
  <div>
    <!-- CHANGE: q-modal to q-dialog -->
    <q-dialog
      v-model="toggleModel"
      class="customModalOverlay"
    >
      <q-card style="padding: 30px; min-width: 30vw">
        <div class="column">
          <!-- Modal Title -->
          <div class="q-py-sm q-title bottom-border">Add New Configurations</div>

          <div class="q-py-sm">
            <div class="col-md-5 col-sm-4 col-xs-12 q-pa-sm">
              <q-card style="width: 100%">
                <q-card-section>
                  <!-- Lead Source -->
                  <q-item>
                    <q-item-section>
                      <q-select
                        v-model="formData.leadSource"
                        :options="dropDown.leadSourceOptions"
                        label="Select Lead Source"
                        placeholder="Lead Source"
                        color="grey-9"
                        dense
                        clearable
                        outlined
                        emit-value
                        map-options
                      />
                    </q-item-section>
                    <q-item-section side right>
                      <q-btn
                        round
                        dense
                        no-caps
                        size="md"
                        color="purple-9"
                        icon="add"
                        @click="fnManageLeadSource"
                      />
                    </q-item-section>
                  </q-item>

                  <!-- VAS -->
                  <q-item>
                    <q-item-section>
                      <q-select
                        v-model="formData.vas"
                        :options="dropDown.vasOptions"
                        label="Select VAS"
                        placeholder="Select VAS"
                        color="grey-9"
                        dense
                        clearable
                        outlined
                        emit-value
                        map-options
                      />
                    </q-item-section>
                    <q-item-section side right>
                      <q-btn
                        round
                        dense
                        no-caps
                        size="md"
                        color="purple-9"
                        icon="add"
                        @click="fnManageTxnType"
                      />
                    </q-item-section>
                  </q-item>

                  <!-- Host -->
                  <q-item>
                    <q-item-section>
                      <q-select
                        v-model="formData.masterHost"
                        :options="dropDown.hostOptions"
                        label="Select Host"
                        placeholder="Select Host"
                        color="grey-9"
                        dense
                        clearable
                        outlined
                        emit-value
                        map-options
                      />
                    </q-item-section>
                    <q-item-section side right>
                      <q-btn
                        round
                        dense
                        no-caps
                        size="md"
                        color="purple-9"
                        icon="add"
                        @click="fnManageHost"
                      />
                    </q-item-section>
                  </q-item>

                  <!-- Mars Instance -->
                  <q-item>
                    <q-item-section>
                      <q-select
                        v-model="formData.institution"
                        :options="dropDown.marsinstitutionOptions"
                        label="Select Mars Instance"
                        placeholder="Select Mars Instance"
                        color="grey-9"
                        dense
                        clearable
                        outlined
                        emit-value
                        map-options
                      />
                    </q-item-section>
                    <q-item-section side right>
                      <q-btn
                        round
                        dense
                        no-caps
                        size="md"
                        color="purple-9"
                        icon="add"
                        @click="fnManageInstance"
                      />
                    </q-item-section>
                  </q-item>
                </q-card-section>

                <!-- Submit Button -->
                <q-card-actions align="end" vertical>
                  <q-btn
                    label="Submit"
                    color="purple-9"
                    @click="fnsubmit(formData)"
                    :loading="isSubmitting"
                  />
                </q-card-actions>
              </q-card>
            </div>
          </div>
        </div>
      </q-card>
    </q-dialog>

    <!-- Modals for Nested Components -->
    <showLeadSourceModalComponent
      v-if="showLeadSourceModal"
      :propToggleModal="showLeadSourceModal"
      @emitToggleModal="fnManageLeadSource"
    />
    <showMarsInstanceModalComponent
      v-if="showPlanDetailModal"
      :propToggleModal="showPlanDetailModal"
      @emitToggleModal="fnManageInstance"
    />
    <showTxnTypeModalComponent
      v-if="showTxnDetailModal"
      :propToggleModal="showTxnDetailModal"
      @emitToggleModal="fnManageTxnType"
    />
    <showTIDGroupModalComponent
      v-if="showTIDGroupDetailModal"
      :propToggleModal="showTIDGroupDetailModal"
      @emitToggleModal="fnManageTIDGroup"
    />
    <showHostDetailModalComponent
      v-if="showHostDetailModal"
      :propToggleModal="showHostDetailModal"
      @emitToggleModal="fnManageHost"
    />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

import showLeadSourceModalComponent from "../../components/super_admin/showLeadSourceModalComponents.vue";
import showHostDetailModalComponent from "../../components/super_admin/showHostDetailModalComponent.vue";
import showTxnTypeModalComponent from "../../components/super_admin/showTxnTypeModalComponent.vue";
import showMarsInstanceModalComponent from "../../components/super_admin/showMarsInstanceModalComponent.vue";
import showTIDGroupModalComponent from "../../components/super_admin/showTIDGroupModalComponent.vue";

// Props
const props = defineProps({
  propShowAddNewConfigurarions: Boolean
});

// Emits
const emit = defineEmits();

// Quasar & Vuex
const $q = useQuasar();
const store = useStore();

// Reactive state
const toggleModel = ref(props.propShowAddNewConfigurarions);
const isSubmitting = ref(false);

const showLeadSourceModal = ref(false);
const showHostDetailModal = ref(false);
const showPlanDetailModal = ref(false);
const showTxnDetailModal = ref(false);
const showTIDGroupDetailModal = ref(false);

const formData = reactive({
  leadSource: "",
  vas: "",
  masterHost: "",
  institution: "",
});

const dropDown = reactive({
  hostOptions: [],
  leadSourceOptions: [],
  vasOptions: [],
  marsinstitutionOptions: [],
});

// Watch prop to sync modal
watch(() => props.propShowAddNewConfigurarions, (val) => {
  toggleModel.value = val;
});

const loadDropdowns = async () => {
  try {
    await store.dispatch("Host/GET_HOST_DETAILS");
    const hosts = store.getters["Host/getAllHostDetails"] || [];
    dropDown.hostOptions = hosts.map(
      (item) => ({ label: item.name, value: item })
    );

    await store.dispatch("leadSource/LEAD_SOURCE_ACTIVE_LIST");
    const leadSources = store.getters["leadSource/getActiveLeadSource"] || [];
    dropDown.leadSourceOptions = leadSources.map((item) => ({ label: item.sourceName, value: item }));

    await store.dispatch("vasCreation/GET_ALL_VAS_DETAILS");
    const vasDetails = store.getters["vasCreation/getAllVasDetails"] || [];
    dropDown.vasOptions = vasDetails.map(
      (item) => ({ label: item.name, value: item })
    );

    await store.dispatch("MarsInstance/GET_MARS_INSTITUTION_DETAILS");
    const instances = store.getters["MarsInstance/getMarsInstanceDetails"] || [];
    dropDown.marsinstitutionOptions = instances.map((item) => ({ label: item.institutionName, value: item }));
  } catch (error) {
    console.error("Load dropdowns error:", error);
    $q.notify({ 
      type: "negative", 
      color: "negative",
      position: "bottom",
      message: "Failed to load dropdowns" 
    });
  }
};

onMounted(() => {
  loadDropdowns();
});

const fnsubmit = async (request) => {
  isSubmitting.value = true;
  
  try {
    // Ensure we're sending the right data structure
    const payload = {
      leadSource: request.leadSource?.id || request.leadSource,
      vas: request.vas?.id || request.vas,
      masterHost: request.masterHost?.id || request.masterHost,
      institution: request.institution?.id || request.institution,
    };

    const response = await store.dispatch(
      "lsVasHostInstance/CREATE_LS_VAS_HOST_INSTANCE_DETAILS",
      payload
    );
    
    $q.notify({
      type: "positive",
      color: "positive",
      position: "bottom",
      message: response?.data?.message || "Configuration created successfully",
      icon: "thumb_up",
    });
    
    // Reset form
    Object.keys(formData).forEach((key) => (formData[key] = ""));
    
  } catch (error) {
    console.error("Submit configuration error:", error);
    $q.notify({
      type: "negative",
      color: "negative",
      position: "bottom",
      message: error?.data?.message || 
              error?.response?.data?.message || 
              "Submission failed",
      icon: "thumb_down",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const fnManageLeadSource = () => {
  showLeadSourceModal.value = !showLeadSourceModal.value;
  if (!showLeadSourceModal.value) {
    // Refresh lead sources when modal closes
    loadDropdowns();
  }
};

const fnManageHost = () => {
  showHostDetailModal.value = !showHostDetailModal.value;
  if (!showHostDetailModal.value) {
    // Refresh hosts when modal closes
    loadDropdowns();
  }
};

const fnManageInstance = () => {
  showPlanDetailModal.value = !showPlanDetailModal.value;
  if (!showPlanDetailModal.value) {
    // Refresh instances when modal closes
    loadDropdowns();
  }
};

const fnManageTxnType = () => {
  showTxnDetailModal.value = !showTxnDetailModal.value;
  if (!showTxnDetailModal.value) {
    // Refresh VAS when modal closes
    loadDropdowns();
  }
};

const fnManageTIDGroup = () => {
  showTIDGroupDetailModal.value = !showTIDGroupDetailModal.value;
  // Note: TID Group doesn't appear to be used in this form
  // You might want to add it to formData if needed
};
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #ddd;
}
.q-title {
  font-size: 1.5rem;
  font-weight: 500;
}

/* Make the dialog responsive */
@media (max-width: 768px) {
  .q-card {
    min-width: 90vw !important;
  }
}
</style>