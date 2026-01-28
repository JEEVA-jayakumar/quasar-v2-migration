<template>
  <q-page>
    <div class="backgroundimage">
      <!-- Table Title -->
      <div class="row bottom-border q-px-md q-py-md items-center">
        <div class="col-6 col-sm-4 col-md-8 q-title text-weight-regular text-grey-9">
          Assigned To So
        </div>
      </div>

      <!-- Form Section -->
      <div class="row bottom-border group q-px-md q-py-md items-center text-weight-regular text-grey-9">
        <!-- Select SO -->
        <div class="col-md-3">
          <q-select
            v-model="formData.allocate_so"
            :options="regionBasedSo"
            label="Select SO"
            clearable
            filter
            color="grey-9"
            @request="regionBasedSoLoad"
          />
        </div>

        <!-- Spare Parts Types -->
        <div class="col-md-7">
          <p class="caption">Spare Parts Types*</p>
          <div class="row">
            <div
              class="row items-center"
              v-for="menu in sparePartsTypes"
              :key="menu.value.id"
            >
              <input
                type="checkbox"
                :id="menu.value.id + '_CB'"
                :name="menu.value.spare_parts_types"
                style="width:18px; height:18px"
                @click="getSelectedDetails($event, menu.value)"
              />
              <label :for="menu.value.id + '_CB'">{{ menu.value.spare_parts_types }}</label>
            </div>
          </div>

          <div v-for="menu in sparePartsTypes" :key="menu.value.id">
            <div
              :id="menu.value.id + '_DV'"
              style="display: none"
            >
              <label>{{ menu.value.spare_parts_types }}</label>
              <input
                type="number"
                :id="menu.value.id + '_IP'"
                min="1"
                max="5000"
                @blur="getAllCounts($event, menu)"
              />
            </div>
          </div>
        </div>

        <!-- Pod Number -->
        <div class="col-md-7">
          <q-input
            v-model="formData.pod_number"
            label="Pod Number"
            disable
            color="grey-9"
          />
        </div>

        <!-- Total Count -->
        <div class="col-md-7">
          <q-input
            v-model="formData.total_count"
            label="Total Count"
            disable
            color="grey-9"
          />
        </div>

        <!-- Submit Button -->
        <div class="full-width group text-center">
          <q-btn
            label="Submit"
            color="purple-9"
            size="md"
            @click="fnSubmitBankDetails(formData)"
          />
        </div>

        <form id="myfrm" class="full-width group" :disabled="true"></form>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { useQuasar } from "quasar";

export default {
  name: "AllocateDevice",
  setup() {
    const $q = useQuasar();
    return { $q };
  },
  data() {
    return {
      regionBasedSo: [],
      sparePartsTypes: [],
      formData: {
        allocate_region: "",
        allocate_reseller: null,
        total_count: 0,
        allocate_so: "",
        pod_number: "",
        sparePartsSets: []
      }
    };
  },
  computed: {
    ...mapGetters("InventoryCentral", [
      "getRegionBasedSO",
      "getRegionBasedResellar"
    ]),
    ...mapGetters("sparePartsGetTypes", ["getsparePartsGetTypes"])
  },
  onMounted() {
    this.initPodNumber();
    this.regionBasedSoLoad();
    this.fnSparePartsTypes();
  },
  onBeforeUnmount() {
    if (this.$barcodeScanner) this.$barcodeScanner.destroy();
  },
  methods: {
    ...mapActions("InventoryCentral", ["FETCH_REGION_BASED_SO"]),
    ...mapActions("sparePartsGetTypes", ["FETCH_SPARE_PARTS_GET_TYPES"]),
    ...mapActions("sparePartsInventory", ["UPDATE_SPARE_PARTS_INVENTORY_DATAS"]),

    initPodNumber() {
      const d = new Date();
      const number = d.getTime();
      this.formData.pod_number = "SO" + number;
    },

    regionBasedSoLoad() {
      const regionId = JSON.parse(localStorage.getItem("u_i")).region.id;
      this.FETCH_REGION_BASED_SO(regionId).then(() => {
        this.regionBasedSo = this.getRegionBasedSO.map(v => ({
          label: v.name,
          value: JSON.stringify(v)
        }));
      });
    },

    fnSparePartsTypes() {
      this.FETCH_SPARE_PARTS_GET_TYPES().then(() => {
        this.sparePartsTypes = this.getsparePartsGetTypes.map(item => ({
          value: item,
          label: item.spare_parts_types
        }));
      });
    },

    getSelectedDetails(event, menu) {
      const checked = event.target.checked;
      const dv = document.getElementById(menu.id + "_DV");
      if (checked) dv.style.display = "block";
      else {
        dv.style.display = "none";
        this.formData.sparePartsSets = this.formData.sparePartsSets.filter(
          sp => sp.id !== menu.id
        );
        this.updateTotalCount();
      }
    },

    getAllCounts(event, menu) {
      const val = parseInt(event.target.value);
      let spIndex = this.formData.sparePartsSets.findIndex(sp => sp.spareParts.id === menu.value.id);
      if (spIndex > -1) this.formData.sparePartsSets[spIndex].count = val;
      else
        this.formData.sparePartsSets.push({
          count: val,
          spareParts: { id: menu.value.id }
        });
      this.updateTotalCount();
    },

    updateTotalCount() {
      this.formData.total_count = this.formData.sparePartsSets.reduce(
        (acc, sp) => acc + parseInt(sp.count || 0),
        0
      );
    },

    fnSubmitBankDetails(request) {
      request.allocate_so = JSON.parse(request.allocate_so || null);
      request.allocate_region = JSON.parse(localStorage.getItem("u_i")).region;
      request.allocate_reseller = JSON.parse(request.allocate_reseller || null);

      this.$q.loading.show();
      this.UPDATE_SPARE_PARTS_INVENTORY_DATAS(request)
        .then(() => {
          this.$q.loading.hide();
          this.$q.notify({
            color: "positive",
            message: "Successfully updated!",
            icon: "thumb_up"
          });
          this.$router.push("/sat/inventory/allocation");
        })
        .catch(error => {
          this.$q.loading.hide();
          this.$q.notify({
            color: "negative",
            message: error.body?.message || "Please Try Again Later!",
            icon: "thumb_down"
          });
        });
    }
  }
};
</script>

<style scoped>
.activeDeviceTab .q-list-header {
  border-bottom: 1px solid #ccc;
  background: #61116a;
  color: #fff;
}
</style>
