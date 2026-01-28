<template>
  <q-page padding>
    <div class="text-grey-9">
      <div class="row bottom-border q-pa-sm items-center">
        <div class="col">
          <q-tabs
            v-model="selectedTab"
            class="shadow-1"
            color="dark"
            text-color="white"
            dense
          >
            <q-tab name="DeviceModelApiSync" label="DeviceModel" />
            <q-tab name="CityApiSync" label="City" />
            <q-tab name="RegionApiSync" label="Region" />
            <q-tab name="RentalPlanApiSync" label="RentalPlan" />
            <q-tab name="LeadFormApiSync" label="LeadForm" />
            <q-tab name="StateApiSync" label="State" />

            <q-separator />
          </q-tabs>

          <q-tab-panels v-model="selectedTab" animated>
            <q-tab-panel name="DeviceModelApiSync">
              <DeviceModelApiSync />
            </q-tab-panel>

            <q-tab-panel name="CityApiSync">
              <CityApiSync />
            </q-tab-panel>

            <q-tab-panel name="RegionApiSync">
              <RegionApiSync />
            </q-tab-panel>

            <q-tab-panel name="RentalPlanApiSync">
              <RentalPlanApiSync />
            </q-tab-panel>

            <q-tab-panel name="LeadFormApiSync">
              <LeadFormApiSync />
            </q-tab-panel>

            <q-tab-panel name="StateApiSync">
              <StateApiSync />
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";

import DeviceModelApiSync from "../../pages/super_admin/DeviceModelApiSync.vue";
import CityApiSync from "../../pages/super_admin/CityApiSync.vue";
import RegionApiSync from "../../pages/super_admin/RegionApiSync.vue";
import RentalPlanApiSync from "../../pages/super_admin/RentalPlanApiSync.vue";
import LeadFormApiSync from "../../pages/super_admin/LeadFormApiSync.vue";
import StateApiSync from "../../pages/super_admin/StateApiSync.vue";

export default {
  name: "MarsApiSync",
  components: {
    DeviceModelApiSync,
    CityApiSync,
    RegionApiSync,
    RentalPlanApiSync,
    LeadFormApiSync,
    StateApiSync,
  },
  setup() {
    // Default selected tab
    const selectedTab = ref("DeviceModelApiSync");

    return {
      selectedTab,
    };
  },
};
</script>

<style scoped>
.border-1 {
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.border-2 {
  border: 3px solid rgba(48, 48, 48, 0.5);
}
</style>
