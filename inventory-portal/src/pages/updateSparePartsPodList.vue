<template>
  <div>
    <!-- Form Header -->
    <div class="col-md-6 q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"></div>

    <form>
      <div class="col-md-5 col-sm-4 col-xs-12 q-pa-sm">
        <!-- Region select -->
        <div class="col-sm-5">
          <q-select
            color="grey-9"
            v-model="formData.allocate_region"
            :options="regionOptions"
            float-label="Select Region"
            @update:model-value="regionBasedSoLoad"
          />
        </div>

        <!-- SO select -->
        <div class="col-md-5">
          <q-select
            filter
            clearable
            v-model="formData.allocate_so"
            float-label="Select SO"
            color="grey-9"
            :options="regionBasedSo"
          />
        </div>

        <!-- Spare parts count inputs -->
        <div class="row mt-sm">
          <div v-for="menu in sparePartsTypes" :key="menu.spareParts.id" class="col-12 q-mb-sm">
            <label>{{ menu.spareParts.spare_parts_types }}</label>
            <input
              type="number"
              min="1"
              max="5000"
              :value="menu.count"
              @blur="getAllCounts($event, menu)"
              class="q-input"
            />
          </div>
        </div>

        <!-- Pod Number and Total Count -->
        <div class="col-md-6 q-mt-md">
          <q-input
            filled
            disable
            v-model="formData.pod_number"
            float-label="Pod Number"
            color="grey-9"
          />
        </div>
        <div class="col-md-7 q-mt-md">
          <q-input
            filled
            disable
            v-model="formData.total_count"
            float-label="Total Count"
            color="grey-9"
          />
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="full-width group q-mt-lg" align="center">
        <q-btn
          size="md"
          color="purple-9"
          label="Update"
          @click="fnSubmitBankDetails(formData)"
        />
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";

export default {
  name: "SparePartsUpdateForm",
  setup() {
    const store = useStore();

    const regionOptions = ref([]);
    const regionBasedSo = ref([]);
    const sparePartsTypes = ref([]);
    const formData = reactive({
      allocate_region: "",
      allocate_so: "",
      allocate_reseller: null,
      pod_number: "",
      total_count: 0,
      sparePartsSets: []
    });
    const allocate_region1 = ref(null);

    // Load initial data from route and Vuex
    onMounted(async () => {
      const routeData = JSON.parse(localStorage.getItem("propRowDetails") || "{}"); // or use route params
      formData.allocate_region = JSON.stringify(routeData.allocate_region);
      formData.allocate_so = JSON.stringify(routeData.allocate_so);
      formData.pod_number = routeData.pod_number;
      formData.total_count = routeData.total_count;
      formData.sparePartsSets = routeData.sparePartsSets;
      sparePartsTypes.value = routeData.sparePartsSets;

      await loadRegions();
      regionBasedSoLoad(formData.allocate_region);
    });

    const loadRegions = async () => {
      try {
        await store.dispatch("InventoryCentral/FETCH_ALL_REGIONS_DATA");
        regionOptions.value = store.getters["InventoryCentral/getAllRegionsData"].map((item) => ({
          label: item.regionAreaName,
          value: JSON.stringify(item)
        }));
      } catch (err) {
        console.error(err);
        regionOptions.value = [];
      }
    };

    const regionBasedSoLoad = async (regionStr) => {
      if (!regionStr) return;
      const region = JSON.parse(regionStr);
      allocate_region1.value = region.id;
      formData.allocate_region = regionStr;

      try {
        await store.dispatch("InventoryCentral/FETCH_REGION_BASED_SO", allocate_region1.value);
        regionBasedSo.value = store.getters["InventoryCentral/getRegionBasedSO"].map((so) => ({
          label: so.name,
          value: JSON.stringify(so)
        }));
      } catch (err) {
        console.error(err);
        regionBasedSo.value = [];
      }
    };

    const getAllCounts = (event, menu) => {
      const val = parseInt(event.target.value) || 0;
      const spareSet = formData.sparePartsSets.find((s) => s.spareParts.id === menu.spareParts.id);
      if (spareSet) spareSet.count = val;

      // Calculate total
      formData.total_count = formData.sparePartsSets.reduce((acc, s) => acc + (parseInt(s.count) || 0), 0);
    };

    const fnSubmitBankDetails = async (request) => {
      const param = {
        allocate_region: JSON.parse(request.allocate_region),
        allocate_so: JSON.parse(request.allocate_so),
        allocate_reseller: request.allocate_reseller,
        pod_number: request.pod_number,
        total_count: request.total_count,
        sparePartsSets: request.sparePartsSets
      };

      const podDetails = store.getters["getInventoryUpdatedPodDetails/getInventoryUpdatedPodDetails"];
      param.created_by = podDetails.created_by;
      param.status = podDetails.status === "6" ? 2 : podDetails.status;
      param.owner = podDetails.owner;
      param.created_date = podDetails.created_date;

      try {
        store.$q.loading.show();
        await store.dispatch("sparePodUpdateDetails/SPARE_PARTS_POD_UPDATE_DETAILS", param);
        store.$q.notify({
          color: "positive",
          position: "bottom",
          message: "Successfully updated!",
          icon: "thumb_up"
        });
        store.$router.push("/inventory/master/spareParts");
      } catch (err) {
        console.error(err);
        store.$q.notify({
          color: "negative",
          position: "bottom",
          message: err?.body?.message || "Please Try Again Later!",
          icon: "thumb_down"
        });
      } finally {
        store.$q.loading.hide();
      }
    };

    return {
      regionOptions,
      regionBasedSo,
      sparePartsTypes,
      formData,
      regionBasedSoLoad,
      getAllCounts,
      fnSubmitBankDetails
    };
  }
};
</script>

<style scoped>
.q-mt-md {
  margin-top: 1rem;
}
.q-mt-lg {
  margin-top: 1.5rem;
}
</style>
