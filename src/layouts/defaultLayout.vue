<template>
  <q-layout view="lHh Lpr lFf">
    <q-header style="margin-left:0px" class="shadow-0 z-top" flat>
      <custom-header @fn-toggle-side-menu="fnMainToggleSideMenu"></custom-header>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      bordered
      :width="250"
      :breakpoint="768"
      :content-style="{ background: getComputedColor }"
      class="no-shadow"
    >
      <q-scroll-area style="height: calc(100% - 65px); margin-top: 65px">
        <q-list padding>
          <!-- Entry point for sat -->
          <template v-if="userInfo && showMenu.includes($ROLE_HIERARCHY_OPERATION_SAT)">
            <template v-if="userInfo.region?.regionAreaName === 'VARANEEK'">
              <q-item
                v-for="menu in menus.varaneekSat"
                :key="menu.id"
                :to="menu.to"
                clickable
                v-ripple
                class="menu-main-item-color"
              >
                <q-item-section>
                  <q-item-label class="menu-item-color">{{ menu.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-else>
              <template v-for="menu in menus.sat" :key="menu.id">
                <q-item
                  v-if="menu.subItems.length === 0"
                  :to="menu.to"
                  clickable
                  v-ripple
                  class="menu-main-item-color"
                >
                  <q-item-section>
                    <q-item-label class="menu-item-color">{{ menu.name }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-else>
                  <q-item-section>
                    <div v-if="menu.name === 'Bijlipay'">
                      <q-select
                        v-model="selectedValueSat"
                        label="Please Select"
                        placeholder="Please Select"
                        :options="options"
                        @update:model-value="fnclickdropdownSat"
                        class="cursor-pointer menu-item-color"
                        filled
                        dense
                        options-dense
                        emit-value
                        map-options
                      />
                    </div>
                    <div v-if="selectedValueSat === menuListNameSat && menu.name === menuListNameSat" align="left">
                      <q-item
                        v-for="subItem in menu.subItems"
                        :key="subItem.id"
                        :to="subItem.to"
                        clickable
                        v-ripple
                        class="menu-main-item-color"
                      >
                        <q-item-section>
                          <q-item-label class="cursor-pointer menu-item-color">{{ subItem.name }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </div>
                    <div
                      v-else-if="selectedValueSat === menuListNameSat && selectedValueSat !== '' && selectedValueSat !== 'Bijlipay' && menu.name === 'Other'"
                      align="left"
                    >
                      <q-item
                        v-for="subItem in menu.subItems"
                        :key="subItem.id"
                        :to="subItem.to"
                        clickable
                        v-ripple
                        class="menu-main-item-color"
                      >
                        <q-item-section>
                          <q-item-label class="cursor-pointer menu-item-color">{{ subItem.name }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </div>
                  </q-item-section>
                </q-item>
              </template>
            </template>
          </template>

          <!-- Entry point for finance manager -->
          <template v-if="userInfo && (showMenu.includes($ROLE_HIERARCHY_FINANCE_HEAD) || showMenu.includes($ROLE_HIERARCHY_FINANCE_MANAGER) || showMenu.includes($ROLE_HIERARCHY_FINANCE_EXECUTIVE))">
            <q-item
              v-for="menu in menus.finance"
              :key="menu.id"
              :to="menu.to"
              clickable
              v-ripple
              class="menu-main-item-color"
            >
              <q-item-section>
                <q-item-label class="menu-item-color">{{ menu.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>


          <!-- Entry point for operations head -->
          <template v-if="userInfo && showMenu.includes($ROLE_HIERARCHY_OPERATIONS_HEAD)">
            <template v-for="menu in menus.opsHead" :key="menu.id">
              <q-item
                v-if="menu.subItems.length === 0"
                :to="menu.to"
                clickable
                v-ripple
                class="menu-main-item-color"
              >
                <q-item-section>
                  <q-item-label class="cursor-pointer menu-item-color">{{ menu.name }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-else>
                <q-item-section>
                  <q-expansion-item
                    dense
                    expand-separator
                    label="Reports"
                    header-class="text-bold"
                  >
                    <q-item
                      v-for="subItem in menu.subItems"
                      :key="subItem.id"
                      :to="subItem.to"
                      clickable
                      v-ripple
                      class="menu-main-item-color"
                    >
                      <q-item-section>
                        <q-item-label class="cursor-pointer menu-item-color">{{ subItem.name }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-expansion-item>
                </q-item-section>
              </q-item>
            </template>
          </template>

          <!-- Entry point for sales manager => RSM/ASM -->
          <template v-if="userInfo && (showMenu.includes($ROLE_HIERARCHY_SALES_RSM) || showMenu.includes($ROLE_HIERARCHY_SALES_ASM) || showMenu.includes($ROLE_HIERARCHY_SALES_NATIONAL_HEAD))">
            <q-item
              v-for="menu in menus.salesManager"
              :key="menu.id"
              :to="menu.to"
              clickable
              v-ripple
              class="menu-main-item-color"
            >
              <q-item-section>
                <q-item-label class="menu-item-color">{{ menu.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>

          <!-- Entry point for sales manager => bank ops -->
          <template v-if="userInfo && showMenu.includes($ROLE_HIERARCHY_BANK_OPS)">
            <q-item
              v-for="menu in menus.bankOps"
              :key="menu.id"
              :to="menu.to"
              clickable
              v-ripple
              class="menu-main-item-color"
            >
              <q-item-section>
                <q-item-label class="menu-item-color">{{ menu.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>

          <!-- Entry point for CRM USERS -->
          <template v-if="userInfo && showMenu.includes($HIERARCHY_CRM1)">
            <q-item
              v-for="menu in menus.crm"
              :key="menu.id"
              :to="menu.to"
              clickable
              v-ripple
              class="menu-main-item-color"
            >
              <q-item-section>
                <q-item-label class="menu-item-color">{{ menu.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>

          <!-- Entry point for super admin/bijlipay management -->
          <template v-if="userInfo && showMenu.includes($ROLE_BIJLIPAY_MANAGER)">
            <q-item
              v-for="menu in menus.superAdmin"
              :key="menu.id"
              :to="menu.to"
              clickable
              v-ripple
            >
              <q-item-section>
                <q-item-label class="menu-item-color-SA">{{ menu.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <custom-body></custom-body>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import _ from 'lodash';
import CustomHeader from '../components/customHeader.vue';
import CustomBody from '../components/customBody.vue';

// Quasar instance
const $q = useQuasar();

// Router and Route instances
const router = useRouter();
const route = useRoute();

// Store instance
const store = useStore();

// Reactive variables
const leftDrawerOpen = ref($q.platform.is.desktop ? route.name !== 'leadDataEntry' : false);
const menuListName = ref('');
const menuListNameSat = ref('');
const options = ref([]);
const showMenu = ref([]);
const selectedValue = ref('');
const selectedValueSat = ref('');

// Computed properties
const userInfo = computed(() => {
  const userData = $q.localStorage.getItem('u_i');
  return userData ? JSON.parse(userData) : null;
});

const getComputedColor = computed(() => {
  return route.fullPath.includes('super/admin') ? '#773581' : '#202c3f';
});

const getActiveCreatedAggregatorList = computed(() => {
  return store.getters['superAdminAggregators/getActiveCreatedAggregatorList'] || [];
});

// Menu data (moved from data() to reactive)
const menus = {
  varaneekSat: [
    {
      id: 3,
      to: '/sat/lead/lead/dataentry',
      name: 'Lead Creation'
    },
    {
      id: 1,
      to: '/sat/lead/validation',
      name: 'Lead Validation'
    },
    {
      id: 8,
      to: '/sat/varaneekimplementationRequest',
      name: 'Lead Status',
      subItems: []
    }
  ],
  sat: [
    {
      id: 1,
      to: "/sat/master/Bijlipay",
      name: "Bijlipay",
      subItems: [
        {
          id: 0,
          to: "/sat/dashboard",
          name: "Dashboard",
        },
        {
          id: 1,
          to: "/sat/lead/validation",
          name: "Lead Validation",
        },
        {
          id: 21,
          to: "/sat/additionalTid",
          name: "Additional Terminals",
        },
        {
          id: 15,
          to: "/sat/change/management",
          name: "Change Management",
        },
        {
          id: 20,
          to: "/sat/internalLostOrStolen",
          name: "Lost/Stolen",
        },
        {
          id: 22,
          to: "/sat/InternalGlobalSearchFilter",
          name: "Global Serial Number/TID Search",
        },
        {
          id: 2,
          to: "/sat/exception/queue",
          name: "Exception Queue",
        },
        {
          id: 3,
          to: "/sat/open/merchant/tracker",
          name: "Open Merchant tracker",
        },
        {
          id: 7,
          to: "/sat/internalRegionalInventory",
          name: "Regional Inventory",
        },
        {
          id: 8,
          to: "/sat/internalimplementationRequest",
          name: "Implementation Queue",
        },
        {
          id: 9,
          to: "/sat/master/tracker",
          name: "Master Tracker-Implemented",
        },
        {
          id: 10,
          to: "/sat/device/recovery/tracker",
          name: "Device Recovery Tracker",
        },
        {
          id: 12,
          to: "/sat/lead/lead/dataentry",
          name: "Lead Creation",
        },
        {
          id: 13,
          to: "/sat/lead/lead/view/audocuments",
          name: "Implemented Verification Queue",
        },
        {
          id: 78,
          to: "/sat/deactivelist",
          name: "Bijlipay De-Active List ",
        },
        {
          id: 14,
          to: "/sat/device/replacement",
          name: "Device Replacement",
        },
        {
          id: 1001,
          to: "/sat/hitachiDetails",
          name: "Hitachi -Upload & Download",
        },
        {
          id: 16,
          to: "/sat/staticQrLeads",
          name: "Static QR Leads",
        },
        {
          id: 17,
          to: "/sat/staticQRinventory",
          name: "Static QR Inventory",
        },
        {
          id: 19,
          to: "/sat/OnboardingExistingMerchants",
          name: "Onboarding Existing Merchants",
        },
        {
          id: 27,
          to: "/sat/hitachiIndianBankOnboarding",
          name: "Hitachi Indian Bank Onboarding",
        },
        {
          id: 28,
          to: "/sat/equitasSoundboxOnboarding",
          name: "Equitas SoundBox Onboarding",
        }
      ],
    },
    {
      id: 28,
      to: "/sat/master/Other",
      name: "Other",
      subItems: [
        {
          id: 30,
          to: "/sat/dashboardPhonepe",
          name: "Dashboard",
        },
        {
          id: 31,
          to: "/sat/aggregator/lead/validation",
          name: "Lead Validation",
        },
        {
          id: 32,
          to: "/sat/AggregatorsLostOrStolen",
          name: "Lost/Stolen",
        },
        {
          id: 33,
          to: "/sat/AggregatorGlobalSearchFilter",
          name: "Global Serial Number/TID Search",
        },
        {
          id: 3,
          to: "/sat/aggOpenMerchantTracker",
          name: "Open Merchant tracker",
        },
        {
          id: 34,
          to: "/sat/AggregatorInventory",
          name: "Regional Inventory",
        },
        {
          id: 41,
          to: "/sat/TestingRecovery",
          name: "PhonePe Device Recovery",
        },
        {
          id: 14,
          to: "/sat/AggregatorDeviceRecovery",
          name: "Mobikwik Device Recovery",
        },
        {
          id: 35,
          to: "/sat/externalimplementationRequest",
          name: "Implementation Queue",
        },
        {
          id: 9,
          to: "/sat/AggregatorMasterTracker",
          name: "Master Tracker-Implemented",
        },
        {
          id: 88,
          to: "/sat/AggregatorServiceTicket",
          name: "SAT - Service Verification",
        },
        {
          id: 13,
          to: "/sat/AggregatorVerificationQueue",
          name: "Implemented Verification Queue",
        },
        {
          id: 73,
          to: "/sat/AggregatorDeactiveList",
          name: "Aggregator De-Active List ",
        },
        {
          id: 36,
          to: "/sat/externalserviceRequest",
          name: "Service Request",
        },
        {
          id: 14,
          to: "/sat/AggregatorDeviceReplacement",
          name: "Device Replacement",
        },
        {
          id: 38,
          to: "/sat/deMapping",
          name: "DE-Mapping",
        },
      ],
    },
  ],
  finance: [
    {
      id: 1,
      to: "/finance/payment/verification/tracker",
      name: "Payment Verification Tracker",
    },
    {
      id: 2,
      to: "/finance/finance/approved/tracker",
      name: "Finance Approved Tracker ",
    },
    {
      id: 3,
      to: "/finance/lost/finance",
      name: "Lost/Stolen",
    },
    {
      id: 3,
      to: '/finance/PosInventory',
      name: 'Pos Inventory'
    }
  ],
  bankOps: [
    {
      id: 1,
      to: "/bank/ops/assign/short/lead",
      name: "Assign Short Lead",
    },
    {
      id: 2,
      to: "/bank/ops/bank/merchant/tracker",
      name: "Merchant Tracker",
    },
  ],
  crm: [
    {
      id: 1,
      to: "phonepePendingCrm",
      name: "Phonepe Service Request",
    },
    {
      id: 2,
      to: "bijlipayCrm",
      name: "Bijlipay Service Request",
    },
    {
      id: 2,
      to: "globalTicketSearch",
      name: "Global Ticket Search",
    },
    {
      id: 288,
      to: "docviewer",
      name: "DOC View",
    },
    {
      id: 888,
      to: "serviceticket",
      name: "Service Ticket",
    },
  ],
  opsHead: [
    {
      id: 2,
      to: "/ops/head/exceptions",
      name: "Exceptions",
      subItems: [],
    },
    {
      id: 3,
      to: null,
      name: "Reports",
      subItems: [
        {
          id: 1,
          name: "Lead Approval Tracker",
          to: "/ops/head/lead/approval/tracker",
        },
        {
          id: 2,
          name: "Sourcewise - Lead Tracker",
          to: "/ops/head/sourcewise/lead/tracker",
        },
        {
          id: 3,
          name: "Source & Region - Lead Tracker",
          to: "/ops/head/source/region/lead/tracker",
        },
        {
          id: 4,
          name: "In - active Merchant",
          to: "/ops/head/inactive/merchant/tracker",
        },
        {
          id: 5,
          name: "Month-old Inactive Merchant ",
          to: "/ops/head/month/old/inactive/merchant/tracker",
        },
        {
          id: 6,
          name: "Proxy Lead / Misselling",
          to: "/ops/head/proxy/lead/tracker",
        },
      ],
    },
  ],
  salesManager: [
    {
      id: 1,
      to: "/sales/manager/lead/allocation/tracker",
      name: "Lead Allocation Tracker",
    },
    {
      id: 2,
      to: "/sales/manager/leads/status",
      name: "Leads Status",
    },
    {
      id: 3,
      to: "/sales/manager/revenue/trackers",
      name: "Revenue Trackers",
    },
    {
      id: 4,
      to: "/sales/manager/pricing/exception/verification",
      name: "Pricing Exception Verification",
    },
    {
      id: 6,
      to: "/sales/manager/aging/tracker/pending/leads",
      name: "Aging Tracker for Pending Leads",
    },
  ],
  superAdmin: [
    {
      id: 1,
      to: "/super/admin/dashboard/",
      name: "Dashboard",
    },
    {
      id: 2,
      to: "/super/admin/users/",
      name: "Users",
    },
    {
      id: 3,
      to: "/super/admin/hierarchy/",
      name: "Hierarchy",
    },
    {
      id: 4,
      to: "/super/admin/roles/permissions/",
      name: "Roles & Permissions",
    },
    {
      id: 5,
      to: "/super/admin/permissions/",
      name: "Permissions",
    },
    {
      id: 6,
      to: "/super/admin/regions/",
      name: "Regions",
    },
    {
      id: 22,
      to: "/super/admin/regionGroup/",
      name: "RegionGroup",
    },
    {
      id: 8,
      to: "/super/admin/pincodes",
      name: "Pincodes",
    },
    {
      id: 9,
      to: "/super/admin/manage/merchant/types",
      name: "Merchant and Document Types",
    },
    {
      id: 10,
      to: "/super/admin/manage/mdrCharges",
      name: "MDR Charges",
    },
    {
      id: 11,
      to: "/super/admin/manage/newRentalCharges",
      name: "Rental Charges",
    },
    {
      id: 14,
      to: "/super/admin/manage/mdr/bankSO",
      name: "Bank SO",
    },
    {
      id: 16,
      to: "/super/admin/manage/notifications",
      name: "Notifications",
    },
    {
      id: 17,
      to: "/super/admin/manage/QR/Sticker",
      name: "QRSticker",
    },
    {
      id: 19,
      to: "/super/admin/manage/existingmATMplan",
      name: "M-ATM",
    },
    {
      id: 20,
      to: "/super/admin/manage/multiTid",
      name: "Multi-TID",
    },
    {
      id: 21,
      to: "/super/admin/manage/prefixConfig",
      name: "prefix Config",
    },
    {
      id: 30,
      to: "/super/admin/sparePartsTypes",
      name: "Spare Parts Types",
    },
    {
      id: 31,
      to: "/super/admin/manage/serviceRequest",
      name: "Service Request",
    },
    {
      id: 25,
      to: "/super/admin/manage/aggregators",
      name: "Aggregators",
    },
    {
      id: 26,
      to: "/super/admin/manage/aggregatorsDevice",
      name: "Aggregators Device",
    },
    {
      id: 38,
      to: "/super/admin/manage/APISync",
      name: "MARS API SYNC",
      subItems: [],
    },
  ],
};

// Lifecycle hooks
onMounted(() => {
  findMenuAuth();
});

onBeforeMount(() => {
  fnAjaxGetAllMenuList();
});

// Methods
const findMenuAuth = () => {
  if (!userInfo.value) return;
  
  const authUserRoles = userInfo.value.roles;
  const menuArr = [];
  
  _.forEach(authUserRoles, (role) => {
    menuArr.push(role.hierarchyRoleLevel);
  });
  
  showMenu.value = menuArr;
};

const fnclickdropdown = (request) => {
  $q.localStorage.set('selectedTab', request);
  
  if (request === 'Bijlipay') {
    menuListName.value = request;
    router.push('/inventory/home');
  } else if (request === 3) {
    menuListName.value = request;
    router.push('/inventory/Phonepehome');
  } else {
    menuListName.value = request;
    router.push('/inventory/Mobikwikhome');
  }
};

const fnclickdropdownSat = (request) => {
  $q.localStorage.set('selectedTab', request);
  
  if (request === 'Bijlipay') {
    menuListNameSat.value = request;
    router.push('/sat/dashboard');
  } else if (request === 3) {
    menuListNameSat.value = request;
    router.push('/sat/dashboardPhonepe');
  } else {
    menuListNameSat.value = request;
    router.push('/sat/dashboardMobikwik');
  }
};

const fnMainToggleSideMenu = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const fnAjaxGetAllMenuList = async () => {
  try {
    await store.dispatch('superAdminAggregators/GET_ACTIVE_CREATED_AGGREGATORS_LIST');
    
    const assumeArr = [
      {
        label: 'Bijlipay',
        value: 'Bijlipay',
      },
    ];
    
    getActiveCreatedAggregatorList.value.forEach((value) => {
      assumeArr.push({
        label: value.name,
        value: value.id,
      });
    });
    
    options.value = assumeArr;
  } catch (error) {

    console.error('Error fetching aggregator list:', error);
    options.value = [];
  }
};
</script>

<style scoped>
.menu-main-item-color {
  color: white !important;
}

.menu-item-color {
  color: white !important;
  font-size: 14px;
}

.menu-item-color-SA {
  color: white !important;
  font-size: 14px;
}

.cursor-pointer {
  cursor: pointer;
}

.q-drawer {
  background: #202c3f;
}

.q-drawer--left.q-drawer--bordered {
  border-right: none;
}

.q-list {
  background: transparent;
}

.q-item {
  background: transparent;
  min-height: 40px;
  padding: 8px 16px;
}

.q-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.q-expansion-item {
  background: transparent;
}

.q-expansion-item__content {
  padding-left: 16px;
}

.q-select {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.q-select :deep(.q-field__control) {
  color: white;
}

.q-select :deep(.q-field__label) {
  color: rgba(255, 255, 255, 0.7);
}

.q-select :deep(.q-field__native) {
  color: white;
}
</style>