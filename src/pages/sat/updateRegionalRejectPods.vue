<template>
  <q-page padding>

    <!-- Page Title -->
    <div class="col-md-6 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
      Pod Allocation & Spare Parts
    </div>

    <form class="q-gutter-md">

      <!-- Region & SO Select -->
      <div class="row q-gutter-md">
        <div class="col-md-5 col-sm-6 col-xs-12">
          <q-select
            v-model="formData.allocate_region"
            :options="regionOptions"
            color="grey-9"
            label="Select Region"
            emit-value
            map-options
            clearable
            @update:model-value="regionBasedSoLoad"
          />
        </div>

        <div class="col-md-5 col-sm-6 col-xs-12">
          <q-select
            v-model="formData.allocate_so"
            :options="regionBasedSo"
            color="grey-9"
            label="Select SO"
            emit-value
            map-options
            clearable
          />
        </div>
      </div>

      <!-- Spare Parts Inputs -->
      <div class="row q-gutter-md q-mt-md">
        <div
          v-for="sp in formData.sparePartsSets"
          :key="sp.spareParts.id"
          class="col-md-4 col-sm-6"
        >
          <q-input
            v-model.number="sp.count"
            type="number"
            :label="sp.spareParts.spare_parts_types"
            min="1"
            max="5000"
            @blur="updateTotalCount"
          />
        </div>
      </div>

      <!-- Pod Number & Total Count -->
      <div class="row q-gutter-md q-mt-md">
        <div class="col-md-6">
          <q-input
            v-model="formData.pod_number"
            label="Pod Number"
            color="grey-9"
            disable
          />
        </div>

        <div class="col-md-6">
          <q-input
            v-model="formData.total_count"
            label="Total Count"
            color="grey-9"
            disable
          />
        </div>
      </div>

      <!-- Update Button -->
      <div class="row q-mt-lg justify-center">
        <q-btn
          color="purple-9"
          label="Update"
          @click.prevent="fnSubmitBankDetails"
          size="md"
        />
      </div>

    </form>
  </q-page>
</template>

<script>
import { reactive, ref, onMounted } from "vue";
import { useStore } from "vuex";

export default {
  name: "PodAllocationForm",
  setup() {
    const store = useStore();

    const formData = reactive({
      allocate_region: "",
      allocate_so: "",
      allocate_reseller: null,
      pod_number: "",
      total_count: 0,
      sparePartsSets: []
    });

    const regionOptions = ref([]);
    const regionBasedSo = ref([]);
    const allocate_region1 = ref(null);
    const propRowDetails = ref({});

    // Load initial data
    onMounted(() => {
      propRowDetails.value = store.state.route?.params?.data || {};

      formData.allocate_region = JSON.stringify(propRowDetails.value.allocate_region || "");
      formData.allocate_so = JSON.stringify(propRowDetails.value.allocate_so || "");
      formData.pod_number = propRowDetails.value.pod_number || "";
      formData.total_count = propRowDetails.value.total_count || 0;
      formData.sparePartsSets = propRowDetails.value.sparePartsSets || [];

      ajaxLoadDataForDeviceTypeTable();
    });

    const ajaxLoadDataForDeviceTypeTable = async () => {
      try {
        await store.dispatch("InventoryCentral/FETCH_ALL_REGIONS_DATA");
        regionOptions.value = store.getters["InventoryCentral/getAllRegionsData"].map(item => ({
          label: item.regionAreaName,
          value: JSON.stringify(item)
        }));

        regionBasedSoLoad(formData.allocate_region);
      } catch (error) {

        console.error("Failed to load regions", error);
      }
    };

    const regionBasedSoLoad = async (regionStr) => {
      if (!regionStr) return;
      const region = JSON.parse(regionStr);
      allocate_region1.value = region.id;
      formData.allocate_region = regionStr;

      try {
        await store.dispatch("InventoryCentral/FETCH_REGION_BASED_SO", allocate_region1.value);
        regionBasedSo.value = store.getters["InventoryCentral/getRegionBasedSO"].map(item => ({
          label: item.name,
          value: JSON.stringify(item)
        }));
      } catch (error) {

        console.error("Failed to load SO list", error);
      }
    };

    const updateTotalCount = () => {
      formData.total_count = formData.sparePartsSets.reduce(
        (sum, sp) => sum + Number(sp.count || 0),
        0
      );
    };

    const fnSubmitBankDetails = async () => {
      try {
        const payload = {
          allocate_region: JSON.parse(formData.allocate_region),
          allocate_so: JSON.parse(formData.allocate_so),
          allocate_reseller: formData.allocate_reseller,
          pod_number: formData.pod_number,
          total_count: formData.total_count,
          sparePartsSets: formData.sparePartsSets,
          created_by: propRowDetails.value.created_by,
          status: propRowDetails.value.status === "6" ? 4 : propRowDetails.value.status,
          owner: propRowDetails.value.owner,
          created_date: propRowDetails.value.created_date
        };

        this.$q.loading.show();
        await store.dispatch("soPodListDatas/UPDATE_SO_REJECTED_POD_DETAILS", payload);
        this.$q.loading.hide();

        this.$q.notify({
          color: "positive",
          position: "bottom",
          message: "Successfully updated!",
          icon: "thumb_up"
        });
        this.$router.push("/sat/inventory/allocation");
      } catch (error) {

        this.$q.loading.hide();
        this.$q.notify({
          color: "negative",
          position: "bottom",
          message: error?.body?.message || "Please try again later!",
          icon: "thumb_down"
        });
      }
    };

    return {
      formData,
      regionOptions,
      regionBasedSo,
      regionBasedSoLoad,
      fnSubmitBankDetails,
      updateTotalCount
    };
  }
};
</script>

<style scoped>
/* Optional custom styles */
</style>
