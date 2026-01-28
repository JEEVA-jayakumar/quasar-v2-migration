<template>
  <q-page padding>
    <div class="row">
      <div class="col-md-5 col-sm-6 col-xs-12">
        <!--START: table title -->
        <div class="q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">
          Revenue Tracker
        </div>
        <!--END: table title -->

        <!-- START: Role/user selection -->
        <div class="q-px-lg q-py-md text-weight-regular text-grey-8">
          <div class="row group">
            <div class="group">
              <q-chip
                v-for="(item, index) in items"
                :key="index"
                class="capitalize cursor-pointer"
                :class="customComputedClass(item)"
                @click="breadCrumsNavigation(item, index)"
              >
                {{ item.name }} / <small>{{ item.role }}</small>
              </q-chip>
            </div>
          </div>
        </div>
        <!-- END: Role/user selection -->

        <!--START: table aging pending/reject -->
        <q-table
          table-class="customTableClass"
          :rows="tableData.userList"
          :columns="columns"
          :filter="filter"
          row-key="name"
          v-model:pagination="paginationControl"
        >
          <template v-slot:top>
            <div class="col">
              <q-input
                clearable
                v-model="filter"
                outlined
                dense
                placeholder="Search"
                label="Search"
                class="q-mr-lg q-py-sm"
              />
            </div>
          </template>

          <template v-slot:body="props">
            <q-tr
              :props="props"
              :class="rowActiveId === props.row.__index ? 'bg-grey-4 text-dark cursor-pointer' : 'cursor-pointer'"
              @mouseover="rowHover(props.row.__index)"
              @click="rowClick(props.row, props.row.__index)"
            >
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.value }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <!--END: table table aging pending/reject -->
      </div>

      <div class="col-md-7 col-sm-6 col-xs-12">
        <q-card flat class="q-pa-xs bg-light-blue">
          <div class="row items-center">
            <div
              class="col-md-3 col-sm-3 col-xs-6 q-pa-md"
              align="center"
              style="border-right:1px solid #cecece"
            >
              <q-icon size="30px" name="fas fa-money-check-alt" />
            </div>
            <div class="col-md-9 col-sm-9 col-xs-6 q-pa-md">
              <div class="custom-dimmed">Target</div>
              <div class="q-display-1" v-if="tableData.currentUser.incentive.targetRevenue === 0">
                Nil
              </div>
              <div class="q-display-1" v-else>
                <q-icon size="14px" class="custom-dimmed" name="fas fa-rupee-sign" />
                &nbsp;{{ tableData.currentUser.incentive.targetRevenue }}
              </div>
            </div>
          </div>
        </q-card>

        <q-list class="group" dense>
          <q-item v-for="item in incentiveItems" :key="item.label" class="q-pa-lg" multiline>
            <q-item-section>{{ item.label }}</q-item-section>
            <q-item-section side v-if="item.value !== null">
              <template v-if="item.type === 'currency'">
                <q-icon size="14px" name="fas fa-rupee-sign" />
                {{ item.value }}
              </template>
              <template v-else-if="item.type === 'percentage'">
                <RadialProgressBar
                  :diameter="50"
                  :completed-steps="tableData.currentUser.incentive.revenuePercentage"
                  :total-steps="totalSteps"
                  :inner-stroke-color="innerStrokeColor"
                  :start-color="startColor"
                  :stop-color="stopColor"
                  :stroke-width="strokeWidth"
                  :animate-speed="animateSpeed"
                >
                  <p class="no-margin">
                    <small>{{ tableData.currentUser.incentive.revenuePercentage }}%</small>
                  </p>
                </RadialProgressBar>
              </template>
            </q-item-section>
            <q-item-section side v-else>
              Nil
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { mapActions } from "vuex";
import RadialProgressBar from "vue-radial-progress";

export default {
  name: "RevenueTracker",
  components: { RadialProgressBar },
  setup(_, { root }) {
    const strokeWidth = ref(3);
    const animateSpeed = ref(500);
    const startColor = ref("#421551");
    const stopColor = ref("#421551");
    const innerStrokeColor = ref("#cecece");
    const totalSteps = ref(100);
    const paginationControl = ref({ rowsPerPage: 10 });
    const filter = ref("");
    const rowActiveId = ref("");
    const activeId = ref("");
    const items = ref([]);

    const tableData = ref({
      currentUser: {},
      userList: []
    });

    const columns = [
      { name: "name", required: true, label: "Name", align: "left", field: "name" },
      { name: "userRoleName", required: true, label: "Role", align: "left", field: "userRoleName" }
    ];

    const incentiveItems = computed(() => [
      {
        label: "Revenue accrued from implemented merchants",
        value: tableData.value.currentUser?.incentive?.implementedRevenue || null,
        type: "currency"
      },
      {
        label: "Revenue from pending implementations",
        value: tableData.value.currentUser?.incentive?.pendingImplementationRevenue || null,
        type: "currency"
      },
      {
        label: "Revenue percentage from target",
        value: tableData.value.currentUser?.incentive?.targetRevenue || null,
        type: "percentage"
      }
    ]);

    const identifySalesHierarchyRole = computed(() => {
      const roles = JSON.parse(localStorage.getItem("u_i")).roles || [];
      return roles.find(role => role.hierarchy.hierarchyCode.includes(root.$HIERARCHY_SALES));
    });

    const customComputedClass = item => {
      return activeId.value === item.name
        ? "bg-purple-9 text-white no-pointer-events"
        : "bg-grey-5 text-dark";
    };

    const { REVENUE_TRACKER } = mapActions("revenueTracker", ["REVENUE_TRACKER"]);

    const fnLoadAllTableData = item => {
      const userId = item?.id || JSON.parse(localStorage.getItem("u_i")).user.id;
      const requestParams = {
        heirarchyId: identifySalesHierarchyRole.value.hierarchy.id,
        userId
      };

      REVENUE_TRACKER(requestParams).then(() => {
        tableData.value.currentUser = root.$store.getters["revenueTracker/revenueTrackerInfo"].currentUser;
        tableData.value.userList = root.$store.getters["revenueTracker/revenueTrackerInfo"].userList;

        if (items.value.length === 0) {
          items.value.push({
            name: tableData.value.currentUser.name,
            id: tableData.value.currentUser.id,
            role: tableData.value.currentUser.userRoleName,
            hierarchyRoleLevel: tableData.value.currentUser.hierarchyRoleLevel
          });
        }
      });
    };

    const breadCrumsNavigation = (item, index) => {
      activeId.value = item.name;
      items.value.length = index + 1;
      fnLoadAllTableData(item);
    };

    const rowClick = (item, index) => {
      activeId.value = item.name;
      rowActiveId.value = index;

      // For SO role, update items differently
      if (item.hierarchyRoleLevel === root.$ROLE_HIERARCHY_SALES_SO) {
        const getIndex = items.value.findIndex(p => p.name === activeId.value);
        if (items.value[getIndex]?.hierarchyRoleLevel === root.$ROLE_HIERARCHY_SALES_SO) {
          items.value.splice(getIndex, 1);
        }
        items.value.push({
          name: item.name,
          role: item.userRoleName,
          id: item.id,
          hierarchyRoleLevel: item.hierarchyRoleLevel
        });

        const requestParams = {
          heirarchyId: identifySalesHierarchyRole.value.hierarchy.id,
          userId: item.id
        };
        REVENUE_TRACKER(requestParams).then(() => {
          tableData.value.currentUser = root.$store.getters["revenueTracker/revenueTrackerInfo"].currentUser;
        });
      } else {
        items.value.push({
          name: item.name,
          role: item.userRoleName,
          id: item.id,
          hierarchyRoleLevel: item.hierarchyRoleLevel
        });
        fnLoadAllTableData(item);
      }
    };

    const rowHover = index => {
      rowActiveId.value = index;
    };

    onMounted(() => {
      fnLoadAllTableData();
    });

    return {
      strokeWidth,
      animateSpeed,
      startColor,
      stopColor,
      innerStrokeColor,
      totalSteps,
      paginationControl,
      filter,
      columns,
      tableData,
      items,
      rowActiveId,
      activeId,
      incentiveItems,
      identifySalesHierarchyRole,
      customComputedClass,
      fnLoadAllTableData,
      breadCrumsNavigation,
      rowClick,
      rowHover
    };
  }
};
</script>

<style scoped>
.custom-dimmed {
  color: rgba(255, 255, 255, 0.85);
}
.customTableClass {
  width: 100%;
}
</style>
