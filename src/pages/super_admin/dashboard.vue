<template>
  <q-page class="q-pa-lg">
    <!-- START: Total users -->
    <div>
      <div class="row">
        <div class="col-md-8">
          <div class="q-title text-grey-9">Dashboard</div>
          <div class="q-caption q-mt-md text-grey-8">Welcome to Super Admin!</div>
        </div>
      </div>

      <div class="q-pa-lg">
        <!-- Total Users Card -->
        <div class="row">
          <div class="col-md-4">
            <q-card inline class="bigger q-ma-sm full-width" style="border: 1px solid #3b084b33">
              <q-card-section>
                <div class="ellipsis q-subheading text-purple-9">Total Users</div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div class="col-md-8">
                    <span class="q-display-1 text-grey-9 q-mr-md">{{ dashboardCounts.totalUserCount }}</span>
                    <span class="q-caption text-grey-9 text-weight-light">Users</span>
                  </div>
                  <div class="col-md-4 text-right">
                    <q-icon
                      size="60px"
                      color="white"
                      class="bg-purple-9 q-pa-md border-radius-10"
                      name="fas fa-user-plus"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Role-wise User Cards -->
        <div class="row q-mt-md">
          <div
            class="col-md-12"
            v-for="(item, index) in dashboardCounts.userCountResponse"
            :key="index"
          >
            <q-card flat class="no-padding">
              <q-card-section>
                <div class="q-title">{{ item.hierarchy.hierarchy }}</div>
              </q-card-section>

              <q-card-section class="no-padding">
                <div class="row group">
                  <div
                    v-for="(roleItem, roleIndex) in item.role"
                    :key="roleIndex"
                    class="col-md-3 col-sm-6 col-xs-9"
                  >
                    <q-card inline class="bigger full-width">
                      <q-card-section>
                        <div class="ellipsis q-subheading text-grey-9">{{ roleItem.role }}</div>
                      </q-card-section>
                      <q-card-section>
                        <div class="row">
                          <div class="col-md-8">
                            <span class="q-display-1 text-grey-9 q-mr-md">{{ roleItem.count }}</span>
                            <span class="q-caption text-grey-9 text-weight-light">Users</span>
                          </div>
                          <div class="col-md-4 text-right">
                            <q-icon
                              size="60px"
                              color="white"
                              :style="{ background: roleItem.roleColor }"
                              class="q-pa-md border-radius-10"
                              name="fas fa-user"
                            />
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
    <!-- END: Total users -->
  </q-page>
</template>

<script>
import { onMounted, reactive } from "vue";
import { useStore } from "vuex";

export default {
  name: "SuperAdminDashboard",
  setup() {
    const store = useStore();

    const dashboardCounts = reactive({
      totalUserCount: 0,
      userCountResponse: [],
    });

    // Load data for dashboard counts
    const loadDashboardCounts = async () => {
      try {
        await store.dispatch("SuperAdminUsers/FETCH_ALL_DASHBOARD_COUNTS");
        const data = store.getters["SuperAdminUsers/getAllDashboardCount"];
        dashboardCounts.totalUserCount = data.totalUserCount || 0;
        dashboardCounts.userCountResponse = data.userCountResponse || [];
      } catch (err) {
        console.error("Error fetching dashboard counts:", err);
      }
    };

    onMounted(() => {
      loadDashboardCounts();
    });

    return {
      dashboardCounts,
    };
  },
};
</script>

<style scoped>
.border-radius-10 {
  border-radius: 10px;
}
</style>
