<template>
  <q-page>
    <!-- content -->
    <div>
      <div class="row bottom-border q-ma-md q-py-md">
        <div class="col-12 text-weight-regular text-grey-9" align="left">
          Spare Counts
        </div>
        <br />
        <div class="col-md-9 col-sm-12 col-xs-12">
          <div v-if="regionSpareCount.length > 0" class="row">
            <q-card
              class="border-radius-10 q-pa-md q-ma-md"
              style="background-color: #4a148c"
              v-for="menu in regionSpareCount"
              :key="menu.value.id"
            >
              <div>
                <big style="color: white">{{ menu.value.count }}</big>
              </div>
              <div>
                <label style="color: white">{{
                  menu.value.spareParts.spare_parts_types
                }}</label>
              </div>
            </q-card>
          </div>

          <div v-else class="row group">
            <div>
              <q-banner class="bg-primary text-white" rounded>
                <template v-slot:avatar>
                  <q-icon name="info" color="white" />
                </template>
                No data available to display
              </q-banner>
            </div>
          </div>
        </div>
      </div>

      <q-tabs
        v-model="selectedTab"
        class="shadow-1 text-grey-9"
        active-color="grey-9"
        indicator-color="purple-9"
        align="left"
      >
        <q-tab name="incomingPods" label="Incoming Pod's" />
        <q-tab name="stocks" label="Stocks" />
        <q-tab name="allocatedSo" label="So Pod List" />
        <q-tab name="createSoPod" label="Create So Pod" />
      </q-tabs>

      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="allocatedSo">
          <allocatedSo />
        </q-tab-panel>

        <q-tab-panel name="incomingPods">
          <q-table
            :rows="tableData"
            :columns="columns"
            :filter="filterSearch"
            v-model:pagination="paginationControl"
            row-key="id"
            @request="ajaxLoadAllLeadInfo"
            class="customSATableClass"
          >
            <template v-slot:body-cell-createdAt="props">
              <q-td :props="props">
                {{
                  props.row.created_date == null
                    ? "NA"
                    : formatDate(props.row.created_date)
                }}
              </q-td>
            </template>

            <template v-slot:body-cell-updated_date="props">
              <q-td :props="props">
                {{
                  props.row.updated_date == null
                    ? "NA"
                    : formatDate(props.row.updated_date)
                }}
              </q-td>
            </template>

            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <span class="text-positive" v-if="props.row.status == 1"
                  >Created</span
                >
                <span class="text-primary" v-else-if="props.row.status == 2"
                  >Assigned to R.I</span
                >
                <span class="text-orange" v-else-if="props.row.status == 3"
                  >Approved By R.I</span
                >
                <span class="text-orange" v-else-if="props.row.status == 4"
                  >Assigned To SO</span
                >
                <span class="text-orange" v-else-if="props.row.status == 5"
                  >Approved By So</span
                >
                <span class="text-orange" v-else-if="props.row.status == 6"
                  >Rejected</span
                >
                <span class="text-negative" v-else>NA</span>
              </q-td>
            </template>

            <template v-slot:body-cell-owner="props">
              <q-td :props="props">
                <span class="text-positive" v-if="props.row.owner == 1"
                  >Central Inventory</span
                >
                <span class="text-primary" v-else-if="props.row.owner == 2"
                  >Regional Inventory</span
                >
                <span class="text-primary" v-else-if="props.row.owner == 3"
                  >SO</span
                >
              </q-td>
            </template>

            <template v-slot:body-cell-regionAreaName="props">
              <q-td :props="props">
                {{
                  props.row.allocate_region == null
                    ? "NA"
                    : props.row.allocate_region.regionAreaName
                }}
              </q-td>
            </template>

            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <div class="row no-wrap no-padding">
                  <q-btn
                    dense
                    no-caps
                    no-wrap
                    label="Reject"
                    icon="far fa-minus-square"
                    size="md"
                    @click="fnRejectPodDetails(props.row)"
                    flat
                    class="text-negative"
                  />
                  <q-btn
                    dense
                    no-caps
                    no-wrap
                    label="Approve"
                    icon="far fa-plus-square"
                    size="md"
                    @click="fnApprovePodDetails(props.row)"
                    flat
                    class="text-light-blue"
                  />
                </div>
              </q-td>
            </template>

            <template v-slot:top>
              <div class="col-3">
                <q-input
                  clearable
                  v-model="filterSearch"
                  label="Search By POD Number"
                  placeholder="Type.."
                  class="q-mr-lg"
                  outlined
                  dense
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="stocks">
          <q-table
            :rows="tableData1"
            :columns="columns1"
            :filter="filterSearch1"
            v-model:pagination="paginationControl1"
            row-key="id"
            @request="ajaxLoadAllLeadInfo1"
            class="customSATableClass"
          >
            <template v-slot:body-cell-createdAt="props">
              <q-td :props="props">
                {{
                  props.row.created_date == null
                    ? "NA"
                    : formatDate(props.row.created_date)
                }}
              </q-td>
            </template>

            <template v-slot:body-cell-updated_date="props">
              <q-td :props="props">
                {{
                  props.row.updated_date == null
                    ? "NA"
                    : formatDate(props.row.updated_date)
                }}
              </q-td>
            </template>

            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <span class="text-positive" v-if="props.row.status == 1"
                  >Created</span
                >
                <span class="text-primary" v-else-if="props.row.status == 2"
                  >Assigned to R.I</span
                >
                <span class="text-orange" v-else-if="props.row.status == 3"
                  >Approved By R.I</span
                >
                <span class="text-orange" v-else-if="props.row.status == 4"
                  >Assigned To SO</span
                >
                <span class="text-orange" v-else-if="props.row.status == 5"
                  >Approved By So</span
                >
                <span class="text-orange" v-else-if="props.row.status == 6"
                  >Rejected</span
                >
                <span class="text-negative" v-else>NA</span>
              </q-td>
            </template>

            <template v-slot:body-cell-owner="props">
              <q-td :props="props">
                <span class="text-positive" v-if="props.row.owner == 1"
                  >Central Inventory</span
                >
                <span class="text-primary" v-else-if="props.row.owner == 2"
                  >Regional Inventory</span
                >
                <span class="text-primary" v-else-if="props.row.owner == 3"
                  >SO</span
                >
              </q-td>
            </template>

            <template v-slot:body-cell-regionAreaName="props">
              <q-td :props="props">
                {{
                  props.row.allocate_region == null
                    ? "NA"
                    : props.row.allocate_region.regionAreaName
                }}
              </q-td>
            </template>

            <template v-slot:top>
              <div class="col-3">
                <q-input
                  clearable
                  v-model="filterSearch1"
                  label="Search By POD Number"
                  placeholder="Type.."
                  class="q-mr-lg"
                  outlined
                  dense
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="createSoPod">
          <div class="col-sm-12">
            <div class="row">
              <q-select
                v-model="formData.allocate_so"
                :options="regionBasedSoFiltered"
                label="Select SO"
                class="col-md-3"
                outlined
                dense
                use-input
                clearable
                @filter="filterSo"
              />
            </div>

            <div class="col-md-7 q-mt-md">
              <p class="text-caption">Spare Parts Type*</p>
              <div class="row">
                <div
                  class="row items-center"
                  v-for="menu in sparePartsTypes"
                  :key="menu.value.id"
                  style="margin-right: 20px"
                >
                  <q-checkbox
                    v-model="selectedSpares"
                    :val="menu.value.id"
                    @update:model-value="handleSpareSelection"
                  />
                  <label style="margin-left: 5px">{{
                    menu.value.spare_parts_types
                  }}</label>
                </div>
              </div>

              <div v-for="menu in sparePartsTypes" :key="'input-' + menu.value.id">
                <div
                  v-if="selectedSpares.includes(menu.value.id)"
                  class="q-mt-sm"
                >
                  <label>{{ menu.value.spare_parts_types }}</label>
                  <q-input
                    v-model.number="spareCounts[menu.value.id]"
                    type="number"
                    min="0"
                    max="5000"
                    outlined
                    dense
                    style="max-width: 200px"
                    @update:model-value="updateTotalCount"
                  />
                </div>
              </div>
            </div>

            <div class="row q-mt-md">
              <div class="col-md-5">
                <q-input
                  disable
                  v-model="formData.pod_number"
                  label="Pod Number"
                  outlined
                  dense
                />
              </div>
            </div>

            <div class="row q-mt-md">
              <div class="col-md-5">
                <q-input
                  disable
                  v-model="formData.total_count"
                  label="Total Count"
                  outlined
                  dense
                />
              </div>
            </div>

            <div class="full-width group q-mt-md" align="center" id="formData">
              <q-btn
                :disable="formData.total_count == 0"
                size="md"
                type="button"
                style="background-color: #4a148c; color: white"
                @click="fnSubmitBankDetails(formData)"
              >
                Submit
              </q-btn>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <!-- START REJECT fnRejectPodDetails-->
      <rejectPodDetails
        v-if="showRejectModel"
        :showRejectModel="showRejectModel"
        :propShowRejectComponent="propsRejectAppend"
        @reloadPaymentTrackerData="
          ajaxLoadAllLeadInfo({ pagination: paginationControl, filter: filter })
        "
        @closeRejectModel="fnRejectPodDetails"
      />
      <!-- END REJECT-->
    </div>
  </q-page>
</template>

<script>
import { ref, computed, onMounted, watch, reactive } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import _ from "lodash";
import rejectPodDetails from "../../components/sat/rejectPodDetails.vue";
import allocatedSo from "../../components/sat/allocatedSo.vue";

dayjs.extend(customParseFormat);

export default {
  name: "GetServiceRequestGetTypes",
  components: {
    allocatedSo,
    rejectPodDetails,
  },

  setup() {
    const store = useStore();
    const $q = useQuasar();

    // Reactive state
    const propShowAddServiceType = ref(false);
    const propShowEditServiceType = ref(false);
    const propShowEditSubTaskType = ref(false);
    const propShowAddSubTaskType = ref(false);
    const showRejectModel = ref(false);
    const propsRejectAppend = ref([]);
    const propRowDetails = ref("");
    const propRowDetails1 = ref("");
    const propRowDetails2 = ref("");
    const flagField = ref(false);
    const disableSo = ref(false);
    const countFlag = ref(false);
    const filter = ref("");
    const filterSearch = ref("");
    const filterSearch1 = ref("");
    const filterSearch2 = ref("");
    const selectedTab = ref("incomingPods");
    const filter_values = ref("");
    const multipleSelect = ref("");
    const selectedSpares = ref([]);
    const spareCounts = ref({});

    const clearData = ref({
      data: "",
    });

    const paginationControl = ref({
      rowsNumber: 10,
      page: 1,
      sortBy: "updated_date",
      descending: false,
      rowsPerPage: 5,
    });

    const regionBasedSo = ref([]);
    const regionBasedSoFiltered = ref([]);
    const regionSpareCount = ref([]);
    const sparePartsTypes = ref([]);

    const formData = reactive({
      allocate_region: "",
      allocate_reseller: null,
      total_count: 0,
      allocate_so: "",
      pod_number: "",
      sparePartsSets: [],
    });

    const paginationControl1 = ref({
      rowsNumber: 10,
      page: 1,
      sortBy: "updated_date",
      descending: false,
      rowsPerPage: 5,
    });

    const paginationControl2 = ref({
      rowsNumber: 10,
      page: 1,
      sortBy: "updated_date",
      descending: false,
      rowsPerPage: 5,
    });

    const tableData = ref([]);
    const tableData1 = ref([]);
    const tableData2 = ref([]);
    const getsinglePodData = ref([]);

    // Column definitions
    const columns1 = [
      {
        name: "pod_number",
        required: true,
        label: "Pod Number",
        align: "left",
        field: "pod_number",
        sortable: true,
      },
      {
        name: "regionAreaName",
        required: true,
        label: "Region",
        align: "left",
        field: (row) => row.allocate_region?.regionAreaName,
      },
      {
        name: "status",
        required: true,
        label: "Status",
        align: "left",
        field: "status",
        sortable: false,
      },
      {
        name: "owner",
        required: true,
        label: "Owner",
        align: "left",
        field: "owner",
        sortable: false,
      },
      {
        name: "total_count",
        required: true,
        label: "Total Count",
        align: "left",
        field: "total_count",
        sortable: false,
      },
      {
        name: "createdAt",
        required: true,
        label: "Created Date",
        align: "left",
        field: "created_date",
        sortable: false,
      },
      {
        name: "updated_date",
        required: true,
        label: "Updated Date",
        align: "left",
        field: "updated_date",
        sortable: true,
      },
      {
        name: "action",
        required: true,
        label: "",
        align: "left",
        field: "action",
        sortable: false,
      },
    ];

    const columns2 = [
      {
        name: "pod_number",
        required: true,
        label: "Pod Number",
        align: "left",
        field: "pod_number",
        sortable: true,
      },
      {
        name: "regionAreaName",
        required: true,
        label: "Region",
        align: "left",
        field: (row) => row.allocate_region?.regionAreaName,
      },
      {
        name: "name",
        required: true,
        label: "SO Name",
        align: "left",
        field: (row) => row.allocate_so?.name,
      },
      {
        name: "status",
        required: true,
        label: "Status",
        align: "left",
        field: "status",
        sortable: false,
      },
      {
        name: "owner",
        required: true,
        label: "Owner",
        align: "left",
        field: "owner",
        sortable: false,
      },
      {
        name: "total_count",
        required: true,
        label: "Total Count",
        align: "left",
        field: "total_count",
        sortable: false,
      },
      {
        name: "createdAt",
        required: true,
        label: "Created Date",
        align: "left",
        field: "created_date",
        sortable: false,
      },
      {
        name: "updated_date",
        required: true,
        label: "Updated Date",
        align: "left",
        field: "updated_date",
        sortable: true,
      },
      {
        name: "action",
        required: true,
        label: "",
        align: "left",
        field: "action",
        sortable: false,
      },
    ];

    const columns = [
      {
        name: "pod_number",
        required: true,
        label: "Pod Number",
        align: "left",
        field: "pod_number",
        sortable: true,
      },
      {
        name: "regionAreaName",
        required: true,
        label: "Region",
        align: "left",
        field: (row) => row.allocate_region?.regionAreaName,
      },
      {
        name: "status",
        required: true,
        label: "Status",
        align: "left",
        field: "status",
        sortable: false,
      },
      {
        name: "owner",
        required: true,
        label: "Owner",
        align: "left",
        field: "owner",
        sortable: false,
      },
      {
        name: "total_count",
        required: true,
        label: "Total Count",
        align: "left",
        field: "total_count",
        sortable: false,
      },
      {
        name: "createdAt",
        required: true,
        label: "Created Date",
        align: "left",
        field: "created_date",
        sortable: false,
      },
      {
        name: "updated_date",
        required: true,
        label: "Updated Date",
        align: "left",
        field: "updated_date",
        sortable: true,
      },
      {
        name: "action",
        required: true,
        label: "",
        align: "left",
        field: "action",
        sortable: false,
      },
    ];

    // Computed properties from Vuex
    const getserviceRequestGetTypes = computed(
      () => store.getters["serviceRequest/getserviceRequestGetTypes"]
    );

    const getsubTaskDetails = computed(
      () => store.getters["serviceRequest/getsubTaskDetails"]
    );

    const getRegionBasedSO = computed(
      () => store.getters["InventoryCentral/getRegionBasedSO"]
    );

    const getsparePartsGetTypes = computed(
      () => store.getters["sparePartsGetTypes/getsparePartsGetTypes"]
    );

    const getsparePartsSetsAndCounts = computed(
      () =>
        store.getters["regionalInventoryDetails/getsparePartsSetsAndCounts"]
    );

    const getregionalInventoryPodDetails = computed(
      () =>
        store.getters["regionalInventoryDetails/getregionalInventoryPodDetails"]
    );

    const getregionalInventoryStocksPodDetails = computed(
      () =>
        store.getters[
          "regionalInventoryDetails/getregionalInventoryStocksPodDetails"
        ]
    );

    const getregionalInventoryAllocatedSoPodDetails = computed(
      () =>
        store.getters[
          "regionalInventoryDetails/getregionalInventoryAllocatedSoPodDetails"
        ]
    );

    // Methods
    const formatDate = (date) => {
      return dayjs(date).format("Do MMM YYYY");
    };

    const fnRejectPodDetails = (exceptionDetails) => {
      showRejectModel.value = !showRejectModel.value;
      if (exceptionDetails) {
        propsRejectAppend.value = exceptionDetails;
      }
    };

    const fnregionSpareCount = () => {
      regionSpareCount.value = [];
      store
        .dispatch("regionalInventoryDetails/FETCH_SPARE_PARTS_SETS_AND_COUNTS")
        .then(() => {
          regionSpareCount.value = _.map(
            getsparePartsSetsAndCounts.value,
            (item) => ({
              value: item,
              label: item.spare_parts_types,
            })
          );
        });
    };

    const fnApprovePodDetails = (reqdata) => {
      $q.dialog({
        title: "Confirm",
        message: "Are you sure want to Approve?",
        ok: "Continue",
        cancel: "Cancel",
      }).onOk(() => {
        store
          .dispatch("singlePodData/FETCH_SINGLE_POD_DETAILS", reqdata)
          .then((response) => {
            let param = {
              allocate_region: response.data.data.allocate_region,
              created_by: response.data.data.created_by,
              allocate_reseller: response.data.data.allocate_reseller,
              allocate_so: response.data.data.allocate_so,
              sparePartsSets: response.data.data.sparePartsSets,
              total_count: response.data.data.total_count,
              pod_number: response.data.data.pod_number,
              created_date: response.data.data.created_date,
              updated_date: response.data.data.updated_date,
            };
            param.status = reqdata.status;
            param.owner = reqdata.owner;

            store
              .dispatch(
                "regionalInventoryDetails/APPROVE_INCOMING_POD_DETAILS",
                param
              )
              .then(() => {
                $q.notify({
                  color: "positive",
                  position: "bottom",
                  message: "Successfully Approved!",
                  icon: "thumb_up",
                });
                ajaxLoadAllLeadInfo({
                  pagination: paginationControl.value,
                  filter: filterSearch.value,
                });
                fnregionSpareCount();
              })
              .catch((error) => {
                $q.loading.hide();
                $q.notify({
                  color: "negative",
                  position: "bottom",
                  message:
                    error.body?.message == null
                      ? "Please Try Again Later !"
                      : error.body.message,
                  icon: "thumb_down",
                });
              });
          })
          .catch((error) => {
            $q.loading.hide();
            $q.notify({
              color: "negative",
              position: "bottom",
              message:
                error.body?.message == null
                  ? "Please Try Again Later !"
                  : error.body.message,
              icon: "thumb_down",
            });
          });
      });
    };

    const ajaxLoadAllLeadInfo = ({ pagination, filter }) => {
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data ..",
      });

      store
        .dispatch("regionalInventoryDetails/FETCHING_INCOMING_POD_LIST_DETAILS", {
          pagination,
          filter,
        })
        .then(() => {
          paginationControl.value = pagination;
          paginationControl.value.rowsNumber =
            getregionalInventoryPodDetails.value.totalElements;
          paginationControl.value.page =
            getregionalInventoryPodDetails.value.number + 1;
          tableData.value = getregionalInventoryPodDetails.value.content;

          if (getregionalInventoryPodDetails.value.sort != null) {
            paginationControl.value.sortBy =
              getregionalInventoryPodDetails.value.sort[0].property;
            paginationControl.value.descending =
              getregionalInventoryPodDetails.value.sort[0].ascending;
          }

          $q.loading.hide();
        })
        .catch(() => {
          $q.loading.hide();
        });
    };

    const ajaxLoadAllLeadInfo2 = ({ pagination, filter }) => {
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data ..",
      });

      store
        .dispatch(
          "regionalInventoryDetails/FETCHING_INCOMING_ALLOCATED_SO_POD_LIST_DETAILS",
          { pagination, filter }
        )
        .then(() => {
          paginationControl2.value = pagination;
          paginationControl2.value.rowsNumber =
            getregionalInventoryAllocatedSoPodDetails.value.totalElements;
          paginationControl2.value.page =
            getregionalInventoryAllocatedSoPodDetails.value.number + 1;
          tableData2.value =
            getregionalInventoryAllocatedSoPodDetails.value.content;

          if (getregionalInventoryAllocatedSoPodDetails.value.sort != null) {
            paginationControl2.value.sortBy =
              getregionalInventoryAllocatedSoPodDetails.value.sort[0].property;
            paginationControl2.value.descending =
              getregionalInventoryAllocatedSoPodDetails.value.sort[0].ascending;
          }

          $q.loading.hide();
        })
        .catch(() => {
          $q.loading.hide();
        });
    };

    const ajaxLoadAllLeadInfo1 = ({ pagination, filter }) => {
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data ..",
      });

      store
        .dispatch(
          "regionalInventoryDetails/FETCHING_INCOMING_STOCKS_POD_LIST_DETAILS",
          { pagination, filter }
        )
        .then(() => {
          paginationControl1.value = pagination;
          paginationControl1.value.rowsNumber =
            getregionalInventoryStocksPodDetails.value.totalElements;
          paginationControl1.value.page =
            getregionalInventoryStocksPodDetails.value.number + 1;
          tableData1.value = getregionalInventoryStocksPodDetails.value.content;

          if (getregionalInventoryStocksPodDetails.value.sort != null) {
            paginationControl1.value.sortBy =
              getregionalInventoryStocksPodDetails.value.sort[0].property;
            paginationControl1.value.descending =
              getregionalInventoryStocksPodDetails.value.sort[0].ascending;
          }

          $q.loading.hide();
        })
        .catch(() => {
          $q.loading.hide();
        });
    };

    const goToSelectedTab = (tab) => {
      if (tab == "allocatedSo") {
        let request = {
          pagination: paginationControl2.value,
          filter: filterSearch2.value,
        };
        store
          .dispatch(
            "regionalInventoryDetails/FETCHING_INCOMING_ALLOCATED_SO_POD_LIST_DETAILS",
            request
          )
          .then(() => {
            // Success handling
          })
          .catch(() => {
            // Error handling
          });
      } else if (tab == "stocks") {
        ajaxLoadAllLeadInfo1({
          pagination: paginationControl1.value,
          filter: filterSearch1.value,
        });
      } else {
        ajaxLoadAllLeadInfo({
          pagination: paginationControl.value,
          filter: filterSearch.value,
        });
      }
    };

    const fnSubmitBankDetails = (request) => {
      formData.allocate_so = JSON.parse(
        formData.allocate_so == "" ? null : formData.allocate_so
      );
      formData.allocate_region = JSON.parse(
        localStorage.getItem("u_i")
      ).region;
      formData.allocate_reseller = JSON.parse(
        formData.allocate_reseller == "" ? null : formData.allocate_reseller
      );

      $q.loading.show();
      store
        .dispatch("sparePartsInventory/UPDATE_SPARE_PARTS_INVENTORY_DATAS", request)
        .then(() => {
          $q.loading.hide();
          if (formData.allocate_so == null) {
            $q.notify({
              color: "negative",
              position: "bottom",
              message: "Please Select the SO",
              icon: "info",
            });
          } else {
            $q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully updated!",
              icon: "thumb_up",
            });
            // Reset form
            selectedSpares.value = [];
            spareCounts.value = {};
            formData.total_count = 0;
            formData.sparePartsSets = [];
            formData.allocate_so = "";
            podNumberCreation();
          }
        })
        .catch((error) => {
          $q.loading.hide();
          $q.notify({
            color: "negative",
            position: "bottom",
            message:
              error.body?.message == null
                ? "Please Try Again Later !"
                : error.body.message,
            icon: "thumb_down",
          });
        });
    };

    const fnSparePartsTypes = () => {
      store.dispatch("sparePartsGetTypes/FETCH_SPARE_PARTS_GET_TYPES").then(() => {
        sparePartsTypes.value = _.map(getsparePartsGetTypes.value, (item) => ({
          value: item,
          label: item.spare_parts_types,
        }));
      });
    };

    const handleSpareSelection = () => {
      // Clean up counts for unselected spares
      Object.keys(spareCounts.value).forEach((key) => {
        if (!selectedSpares.value.includes(parseInt(key))) {
          delete spareCounts.value[key];
        }
      });
      updateTotalCount();
    };

    const getAllCounts = (event, menu) => {
      const value = parseInt(event.target.value) || 0;
      spareCounts.value[menu.value.id] = value;
      updateTotalCount();
    };

    const updateTotalCount = () => {
      let totalCount = 0;
      formData.sparePartsSets = [];

      selectedSpares.value.forEach((spareId) => {
        const count = spareCounts.value[spareId] || 0;
        if (count > 0) {
          totalCount += count;
          formData.sparePartsSets.push({
            count: count,
            spareParts: {
              id: spareId,
            },
          });
        }
      });

      formData.total_count = totalCount;
    };

    const regionBasedSoLoad = () => {
      let regionArea = JSON.parse(localStorage.getItem("u_i")).region.id;
      store.dispatch("InventoryCentral/FETCH_REGION_BASED_SO", regionArea).then(() => {
        let assumeArr = [];
        getRegionBasedSO.value.map(function (value) {
          assumeArr.push({
            label: value.name + " | " + value.employeeID + " | " + value.email,
            value: JSON.stringify(value),
          });
        });
        regionBasedSo.value = assumeArr;
        regionBasedSoFiltered.value = assumeArr;
      });
    };

    const filterSo = (val, update) => {
      update(() => {
        if (val === "") {
          regionBasedSoFiltered.value = regionBasedSo.value;
        } else {
          const needle = val.toLowerCase();
          regionBasedSoFiltered.value = regionBasedSo.value.filter(
            (v) => v.label.toLowerCase().indexOf(needle) > -1
          );
        }
      });
    };

    const fnDeleteServiceType = (rowDetails) => {
      $q.dialog({
        title: "Confirm",
        message: "Are you sure want to delete?",
        ok: "Continue",
        cancel: "Cancel",
      }).onOk(() => {
        $q.loading.show({
          delay: 100,
          message: "Please Wait",
          spinnerColor: "purple-9",
        });
        store
          .dispatch("serviceRequest/DELETE_SERVICE_REQUEST_TYPES", rowDetails)
          .then(() => {
            $q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully removed",
              icon: "thumb_up",
            });
            $q.loading.hide();
          })
          .catch(() => {
            $q.loading.hide();
          });
      });
    };

    const fnDeleteSubTaskType = (rowDetails) => {
      $q.dialog({
        title: "Confirm",
        message: "Are you sure want to delete?",
        ok: "Continue",
        cancel: "Cancel",
      }).onOk(() => {
        $q.loading.show({
          delay: 100,
          message: "Please Wait",
          spinnerColor: "purple-9",
        });
        store
          .dispatch("serviceRequest/DELETE_SUB_TASK_TYPES", rowDetails)
          .then(() => {
            $q.notify({
              color: "positive",
              position: "bottom",
              message: "Successfully removed",
              icon: "thumb_up",
            });
            $q.loading.hide();
          })
          .catch(() => {
            $q.loading.hide();
          });
      });
    };

    const ajaxSpareData = () => {
      store
        .dispatch("serviceRequest/FETCH_ALL_SERVICE_REQUEST_GET_TYPES")
        .then(() => {
          tableData.value = getserviceRequestGetTypes.value;
        })
        .catch(() => {
          $q.loading.hide();
        });
    };

    const getAllInventoryData = () => {
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data ..",
      });
      store
        .dispatch("InventoryCentral/FETCH_CENTRAL_INVENTORY_DASHBOARD_COUNT")
        .then(() => {
          $q.loading.hide();
        })
        .catch(() => {
          $q.loading.hide();
        });
    };

    const ajaxSpareData1 = () => {
      store
        .dispatch("serviceRequest/FETCH_SUB_TASK_DATAS")
        .then(() => {
          tableData1.value = getsubTaskDetails.value;
        })
        .catch(() => {
          $q.loading.hide();
        });
    };

    const fnShowAddNewSubTaskType = (rowDetails) => {
      propShowAddSubTaskType.value = !propShowAddSubTaskType.value;
      propRowDetails2.value = rowDetails;
    };

    const fnShowEditServiceType = (rowDetails) => {
      propShowEditServiceType.value = !propShowEditServiceType.value;
      propRowDetails.value = rowDetails;
    };

    const fnShowEditSubTaskType = (rowDetails) => {
      propShowEditSubTaskType.value = !propShowEditSubTaskType.value;
      propRowDetails1.value = rowDetails;
    };

    const myCustomSearchFilter = (rows, terms, cols, cellValue) => {
      const lowerTerms = terms ? terms.toLowerCase() : "";
      return rows.filter((row) =>
        cols.some(
          (col) =>
            (cellValue(col, row) + "").toLowerCase().indexOf(lowerTerms) !== -1
        )
      );
    };

    const podNumberCreation = () => {
      const name = "SO";
      const d = new Date();
      let number = d.getTime();
      let finalValue = name.concat(number);
      formData.pod_number = finalValue;
    };

    // Watch for tab changes
    watch(selectedTab, (newVal) => {
      goToSelectedTab(newVal);
    });

    // Lifecycle hooks
    onMounted(() => {
      ajaxSpareData();
      ajaxSpareData1();
      getAllInventoryData();
      regionBasedSoLoad();
      fnSparePartsTypes();
      fnregionSpareCount();
      podNumberCreation();
      ajaxLoadAllLeadInfo({
        pagination: paginationControl.value,
        filter: filterSearch.value,
      });
      ajaxLoadAllLeadInfo1({
        pagination: paginationControl1.value,
        filter: filterSearch1.value,
      });
      ajaxLoadAllLeadInfo2({
        pagination: paginationControl2.value,
        filter: filterSearch2.value,
      });
    });

    return {
      // State
      propShowAddServiceType,
      propShowEditServiceType,
      propShowEditSubTaskType,
      propShowAddSubTaskType,
      showRejectModel,
      propsRejectAppend,
      propRowDetails,
      propRowDetails1,
      propRowDetails2,
      flagField,
      disableSo,
      countFlag,
      filter,
      filterSearch,
      filterSearch1,
      filterSearch2,
      selectedTab,
      filter_values,
      multipleSelect,
      clearData,
      paginationControl,
      paginationControl1,
      paginationControl2,
      regionBasedSo,
      regionBasedSoFiltered,
      regionSpareCount,
      sparePartsTypes,
      formData,
      tableData,
      tableData1,
      tableData2,
      getsinglePodData,
      columns,
      columns1,
      columns2,
      selectedSpares,
      spareCounts,

      // Methods
      fnRejectPodDetails,
      fnregionSpareCount,
      fnApprovePodDetails,
      ajaxLoadAllLeadInfo,
      ajaxLoadAllLeadInfo1,
      ajaxLoadAllLeadInfo2,
      goToSelectedTab,
      fnSubmitBankDetails,
      fnSparePartsTypes,
      handleSpareSelection,
      getAllCounts,
      updateTotalCount,
      regionBasedSoLoad,
      filterSo,
      fnDeleteServiceType,
      fnDeleteSubTaskType,
      ajaxSpareData,
      getAllInventoryData,
      ajaxSpareData1,
      fnShowAddNewSubTaskType,
      fnShowEditServiceType,
      fnShowEditSubTaskType,
      myCustomSearchFilter,
      podNumberCreation,
      formatDate,
    };
  },
};
</script>

<style scoped>
.border-radius-10 {
  border-radius: 10px;
}

.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.customSATableClass {
  /* Custom table styles */
}
</style>