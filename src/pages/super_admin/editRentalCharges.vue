<template>
  <q-page>
    <q-dialog
      v-model="toggleModel"
      persistent
      class="customModalOverlay"
      :maximized="false"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="min-width: 40vw; padding: 25px;">
        <q-card-section class="q-pa-md q-title text-weight-regular bottom-border">
          Existing Rental Charge
        </q-card-section>

        <q-card-section>
          <div class="row q-gutter-md">
            <!-- Lead Source -->
            <div class="col-md-5 col-sm-6 col-xs-12">
              <q-select
                v-model="formData.leadSource"
                :options="dropDown.leadSourceOptions"
                label="Select Lead Source"
                color="grey-9"
                @update:model-value="onLeadSourceChange"
              />
            </div>

            <!-- Device -->
            <div class="col-md-5 col-sm-6 col-xs-12">
              <q-select
                v-model="formData.device"
                :options="dropDown.deviceOptions"
                label="Select Device"
                color="grey-9"
                @update:model-value="onDeviceChange"
              />
            </div>

            <!-- Mars Device Model -->
            <div class="col-md-5 col-sm-6 col-xs-12">
              <q-select
                v-model="formData.marsDeviceModel"
                :options="dropDown.marsDeviceOptions"
                label="Mars Device Model"
                color="grey-9"
                @update:model-value="onMarsDeviceModelChange"
              />
            </div>

            <!-- Plan -->
            <div class="col-md-5 col-sm-6 col-xs-12">
              <q-select
                v-model="formData.plan"
                :options="dropDown.planOptions"
                label="Select Plan"
                color="grey-9"
                @update:model-value="onPlanChange"
              />
            </div>

            <!-- Setup Fees -->
            <div class="col-md-5 col-sm-6 col-xs-12">
              <q-input
                v-model.number="formData.setupFees"
                label="Setup Fee"
                type="number"
                color="grey-9"
              />
            </div>

            <!-- Monthly Fees -->
            <div class="col-md-5 col-sm-6 col-xs-12">
              <q-input
                v-model.number="formData.monthlyFees"
                label="Recurring Fee"
                type="number"
                color="grey-9"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat color="grey-8" label="Cancel" @click="emitCloseModal" />
          <q-btn color="purple-9" label="Submit" @click="editRentalPlan" />
        </q-card-actions>
      </q-card>

      <!-- Modals for lead source, device, merchant -->
      <showLeadSourceModalComponent
        v-if="showLeadSourceModal"
        :propToggleModal="showLeadSourceModal"
        @emitToggleModal="toggleLeadSourceModal"
      />
      <showDeviceDetailModalComponent
        v-if="showDeviceDetailModal"
        :propToggleModal="showDeviceDetailModal"
        @emitToggleModal="toggleDeviceModal"
      />
      <showMerchantModalComponent
        v-if="showMerchantModal"
        :propToggleModal="showMerchantModal"
        @emitToggleModal="toggleMerchantModal"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

import showLeadSourceModalComponent from "../../components/super_admin/showLeadSourceModalComponents.vue";
import showDeviceDetailModalComponent from "../../components/super_admin/showDeviceDetailModalComponents.vue";
import showMerchantModalComponent from "../../components/super_admin/merchantTypes.vue";

export default {
  name: "MDRDetails",
  components: {
    showLeadSourceModalComponent,
    showDeviceDetailModalComponent,
    showMerchantModalComponent
  },
  props: {
    propShoweditPlanDetails: Boolean,
    propRowDetails: Object
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const store = useStore();

    const toggleModel = ref(props.propShoweditPlanDetails);

    const showLeadSourceModal = ref(false);
    const showDeviceDetailModal = ref(false);
    const showMerchantModal = ref(false);

    const dropDown = reactive({
      leadSourceOptions: [],
      deviceOptions: [],
      marsDeviceOptions: [],
      planOptions: []
    });

    const formData = reactive({
      leadSource: JSON.stringify(props.propRowDetails.leadSource),
      device: JSON.stringify(props.propRowDetails.device),
      marsDeviceModel: JSON.stringify(props.propRowDetails.marsDeviceModel),
      plan: JSON.stringify(props.propRowDetails.plan),
      setupFees: props.propRowDetails.setupFees,
      monthlyFees: props.propRowDetails.monthlyFees,
      leadSource1: props.propRowDetails.leadSource?.id,
      deviceId: props.propRowDetails.device?.id,
      marsId: "",
      plan1: ""
    });

    const rentalChargeId = ref(props.propRowDetails.id);

    // Load dropdowns on mount
    onMounted(async () => {
      await loadDeviceOptions();
      await loadLeadSourceOptions();
      await loadPlanOptions();
      await loadMarsDeviceOptions();
    });

    // Fetch dropdowns from Vuex
    const loadDeviceOptions = async () => {
      await store.dispatch("SA_Devices/FETCH_DEVICES_DATA", formData.deviceId);
      dropDown.deviceOptions = store.getters["SA_Devices/getAllDevicesInfo"].map(d => ({
        label: d.deviceName,
        value: JSON.stringify(d)
      }));
    };

    const loadLeadSourceOptions = async () => {
      await store.dispatch("leadSource/LEAD_SOURCE_ACTIVE_LIST", formData.leadSource1);
      dropDown.leadSourceOptions = store.getters["leadSource/getActiveLeadSource"].map(d => ({
        label: d.sourceName,
        value: JSON.stringify(d)
      }));
    };

    const loadPlanOptions = async () => {
      await store.dispatch("plan/PLAN_ACTIVE_LIST", formData.plan1);
      dropDown.planOptions = store.getters["plan/getActivePlan"].map(d => ({
        label: d.planName,
        value: JSON.stringify(d)
      }));
    };

    const loadMarsDeviceOptions = async () => {
      await store.dispatch("SA_Devices/FETCH_MARS_DEVICE_MODEL");
      dropDown.marsDeviceOptions = store.getters["SA_Devices/getMarsDeviceModel"].flatMap(mars => 
        mars.map(d => ({ label: d.name, value: JSON.stringify(d) }))
      );
    };

    const emitCloseModal = () => emit("emitfnshowEditRental");

    const toggleLeadSourceModal = () => (showLeadSourceModal.value = !showLeadSourceModal.value);
    const toggleDeviceModal = () => (showDeviceDetailModal.value = !showDeviceDetailModal.value);
    const toggleMerchantModal = () => (showMerchantModal.value = !showMerchantModal.value);

    // Helper: Prepare form payload
    const buildRentalPayload = () => ({
      id: rentalChargeId.value,
      marsDeviceModel: JSON.parse(formData.marsDeviceModel),
      setupFees: formData.setupFees,
      monthlyFees: formData.monthlyFees,
      device: JSON.parse(formData.device),
      plan: JSON.parse(formData.plan),
      leadSource: JSON.parse(formData.leadSource),
      active: true
    });

    const editRentalPlan = async () => {
      try {
        const payload = buildRentalPayload();
        await store.dispatch("categoryBasedRental/EDIT_RENTAL_PLAN", payload);

        $q.notify({
          color: "positive",
          position: "bottom",
          message: "Rental plan updated successfully",
          icon: "thumb_up"
        });

        emitCloseModal();
      } catch (error) {

        console.error(error);
        $q.notify({
          color: "negative",
          position: "bottom",
          message: error?.data?.message || "Failed to update rental plan",
          icon: "thumb_down"
        });
      }
    };

    // Handle dropdown changes
    const handleCategoryBasedRental = async () => {
      const payload = {
        leadSource: formData.leadSource1,
        device: formData.deviceId,
        plan: formData.plan1,
        marsDeviceModel: formData.marsId
      };
      const response = await store.dispatch("categoryBasedRental/CATEGORY_BASED_RENTAL_PLAN", payload);
      if (response?.status === 200) {
        formData.setupFees = store.getters["categoryBasedRental/categoryBasedRental"].setupFees;
        formData.monthlyFees = store.getters["categoryBasedRental/categoryBasedRental"].monthlyFees;
      } else {
        formData.setupFees = 0;
        formData.monthlyFees = 0;
      }
    };

    const onLeadSourceChange = val => {
      formData.leadSource = val;
      formData.leadSource1 = JSON.parse(val).id;
      handleCategoryBasedRental();
    };

    const onDeviceChange = val => {
      formData.device = val;
      formData.deviceId = JSON.parse(val).id;
      handleCategoryBasedRental();
    };

    const onMarsDeviceModelChange = val => {
      formData.marsDeviceModel = val;
      formData.marsId = JSON.parse(val).id;
      handleCategoryBasedRental();
    };

    const onPlanChange = val => {
      formData.plan = val;
      formData.plan1 = JSON.parse(val).id;
      handleCategoryBasedRental();
    };

    return {
      toggleModel,
      formData,
      dropDown,
      editRentalPlan,
      emitCloseModal,
      showLeadSourceModal,
      showDeviceDetailModal,
      showMerchantModal,
      toggleLeadSourceModal,
      toggleDeviceModal,
      toggleMerchantModal,
      onLeadSourceChange,
      onDeviceChange,
      onMarsDeviceModelChange,
      onPlanChange
    };
  }
};
</script>

<style scoped>
.customModalOverlay {
  max-width: 90vw;
}
</style>
