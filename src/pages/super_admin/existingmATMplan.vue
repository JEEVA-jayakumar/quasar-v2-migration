<template>
  <q-page>
    <div>
      <q-table
        table-class="customTableClass"
        :rows="tableData"
        :columns="columns"
        row-key="id"
        :loading="toggleAjaxLoadFilter"
        :rows-per-page-options="[5, 10, 15, 20]"
        v-model:pagination="paginationControl"
        :filter="filterSearch"
        @request="ajaxLoadAllLeadInfo"
      >
        <!-- Status Column -->
        <template v-slot:body-cell-active="props">
          <span v-if="props.row.leadSourceId.active" class="label text-positive">Active</span>
          <span v-else-if="props.row.leadSourceId.active === false" class="label text-negative">DeActive</span>
          <span v-else>NA</span>
        </template>

        <!-- Lock / Unlock Column -->
        <template v-slot:body-cell-lock="props">
          <q-btn
            v-if="!props.row.leadSourceId.active"
            flat
            color="blue"
            @click="activateMatmUser(props.row.id)"
          >
            <img src="statics/lock.png" style="height:35px;width:35px">
          </q-btn>
          <q-btn
            v-else
            flat
            color="blue"
            @click="deactivateMatmUser(props.row.id)"
          >
            <img src="statics/unlock.png" style="height:35px;width:35px">
          </q-btn>
        </template>

        <!-- Lead Source Column -->
        <template v-slot:body-cell-sourceName="props">
          <span class="label text-primary cursor-pointer"
                @click="toggleLeadInformation(props.row.leadSourceId.sourceName)">
            {{ props.row.leadSourceId.sourceName }}
          </span>
        </template>

        <!-- Device Column -->
        <template v-slot:body-cell-deviceName="props">
          <span class="label text-primary cursor-pointer"
                @click="toggleLeadInformation(props.row.deviceId.deviceName)">
            {{ props.row.deviceId.deviceName }}
          </span>
        </template>

        <!-- Plan Column -->
        <template v-slot:body-cell-planName="props">
          <q-btn
            dense
            flat
            no-wrap
            no-caps
            icon="fas fa-pencil-alt"
            color="primary"
            @click="editPlanDetails(props.row)"
            :label="props.row.planName"
            class="capitalize"
          />
        </template>

        <!-- Delete Column -->
        <template v-slot:body-cell-delete="props">
          <q-btn
            push
            class="q-mx-sm"
            color="positive"
            size="sm"
            @click="deletePlanDetails(props.row)"
          >
            Delete Plan Details
          </q-btn>
        </template>

        <!-- Table Top Slot -->
        <template v-slot:top>
          <div class="row q-pa-sm">
            <div class="col-md-6">
              <q-search
                v-model="filterSearch"
                clearable
                placeholder="Type.."
                float-label="Search by Plan Name"
                color="grey-9"
              />
            </div>
            <div class="col-md-6 text-right">
              <q-btn
                no-caps
                label="Add M-ATM Plan"
                color="purple-9"
                size="md"
                @click="$router.push('/super/admin/manage/mATMplan')"
                class="text-weight-regular"
              />
            </div>
          </div>
        </template>
      </q-table>

      <!-- Delete User Modal -->
      <deleteUsersDetails
        v-if="showDeleteUserDetails"
        :propDeteledUsers="deteledUsers"
        :propToggleModal="showDeleteUserDetails"
        @emitToggleDeleteUsersModal="toggleDeleteUsersModal"
      />

      <!-- Loading Spinner Overlay -->
      <div v-if="toggleAjaxLoadFilter || toggleAjaxLoadFilter1" class="fullscreen spinner-overlay">
        <q-spinner-bars class="absolute-center" size="35" color="#61116a" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import deleteUsersDetails from "../../components/super_admin/deleteUsersDetails.vue";

export default {
  name: "getMatmDatas",
  components: { deleteUsersDetails },
  data() {
    return {
      toggleAjaxLoadFilter: false,
      toggleAjaxLoadFilter1: false,
      showDeleteUserDetails: false,
      filterSearch: "",
      paginationControl: { page: 1, rowsPerPage: 5 },
      tableData: [],
      columns: [
        { name: "planName", label: "Plan Name", align: "left", field: "planName", sortable: false },
        { name: "sourceName", label: "Lead Source", align: "left", field: row => row.leadSourceId.sourceName, sortable: false },
        { name: "deviceName", label: "Device Type", align: "left", field: row => row.deviceId.deviceName, sortable: false },
        { name: "active", label: "Status", align: "left" },
        { name: "action", label: "", align: "center", field: "action", sortable: true },
        { name: "lock", label: "UserLock", align: "center", field: "lock", sortable: true },
        { name: "delete", label: "", align: "center", field: "delete", sortable: true }
      ]
    };
  },
  computed: {
    ...mapGetters("getMatmDatas", ["getMatmDatas", "getMatmPlanDetails"])
  },
  mounted() {
    this.ajaxLoadAllLeadInfo({ pagination: this.paginationControl, filter: this.filterSearch });
  },
  methods: {
    ...mapActions("getMatmDatas", ["FETCH_ALL_MATM_DATAS", "FETCH_ALL_MATM_PLAN_DETAILS"]),
    ...mapActions("deactiveMatmUser", ["DEACTIVATE_MATM_USER_DETAILS"]),
    ...mapActions("activeMatmUser", ["ACTIVATE_MATM_USER_DETAILS"]),
    ...mapActions("deletePlanDetails", ["DELETE_PLAN_DETAILS_DATAS"]),

    async ajaxLoadAllLeadInfo({ pagination, filter }) {
      this.toggleAjaxLoadFilter = true;
      try {
        await this.FETCH_ALL_MATM_DATAS({ pagination, filter });
        this.tableData = this.getMatmDatas;
      } catch (err) {
        console.error(err);
      } finally {
        this.toggleAjaxLoadFilter = false;
      }
    },

    toggleDeleteUsersModal() {
      this.showDeleteUserDetails = !this.showDeleteUserDetails;
    },

    async deactivateMatmUser(id) {
      try {
        await this.$q.dialog({ title: "Alert", message: "Are You Sure want to Deactive the User?", ok: "Ok", cancel: "Cancel" });
        await this.DEACTIVATE_MATM_USER_DETAILS(id);
        await this.FETCH_ALL_MATM_DATAS();
        this.$q.notify({ color: "positive", position: "bottom", message: "Deactive Successfully !", icon: "thumb_up" });
      }  catch {
        this.$q.notify({ color: "negative", position: "bottom", message: "Please try again later!!", icon: "thumb_down" });
      }
    },

    async activateMatmUser(id) {
      try {
        await this.$q.dialog({ title: "Alert", message: "Are You Sure want to Active the User?", ok: "Ok", cancel: "Cancel" });
        await this.ACTIVATE_MATM_USER_DETAILS(id);
        await this.FETCH_ALL_MATM_DATAS();
        this.$q.notify({ color: "positive", position: "bottom", message: "Active Successfully !", icon: "thumb_up" });
      }  catch {
        this.$q.notify({ color: "negative", position: "bottom", message: "Please try again later!!", icon: "thumb_down" });
      }
    },

    async deletePlanDetails(reqData) {
      try {
        await this.DELETE_PLAN_DETAILS_DATAS({ Id: reqData.id });
        this.$q.notify({ color: "positive", position: "bottom", message: "Successfully Deleted the Plan", icon: "thumb_up" });
      } catch {
        this.$q.notify({ color: "negative", position: "bottom", message: "Please try again later!!", icon: "thumb_down" });
      }
    },

    editPlanDetails(reqData) {
      this.$q.dialog({ title: "Confirm", message: "Are you sure want to Edit Plans?", ok: "Continue", cancel: "Cancel" })
        .then(async () => {
          this.$q.loading.show({ spinnerColor: "purple-9", message: "Processing .." });
          await this.FETCH_ALL_MATM_PLAN_DETAILS(reqData);
          this.$q.loading.hide();
          this.$router.push({ name: "editMatmPlans", params: { data: reqData } });
        });
    }
  }
};
</script>

<style>
.customTabActive {
  background: purple;
  color: #fff;
}
</style>
