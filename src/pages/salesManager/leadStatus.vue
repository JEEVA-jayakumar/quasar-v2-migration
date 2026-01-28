<template>
  <q-page>
    <div>
      <!-- //Common lead information in popup -->
      <generalLeadInformation
        v-if="propToggleLeadInformation"
        :leadInformation="addtnLeadInformation"
        :propToggleLeadInformationPop="propToggleLeadInformation"
        @closeLeadInformation="toggleLeadInformation"
      />
      <!-- //Common lead information in popup -->
      <userLeadInformation
        v-if="propUserLeads"
        :propUserId="propUserId"
        :propAction="propAction"
        :propToggleLeadInformationModal="propUserLeads"
        @fetchCurrentUserLeads="fetchCurrentUserLeads"
      />
      <!--START: table title -->
      <div class="q-title q-px-lg q-py-md text-weight-regular bottom-border text-grey-9">Lead Status</div>
      <!--END: table title -->

      <!-- START: Role/user selection -->
      <div class="q-px-lg q-py-md text-weight-regular text-grey-8">
        <div class="row group">
          <div class="group">
            <q-chip
              @click="breadCrumsNavigation(item,index)"
              v-for="(item,index) in items"
              :key="index"
              class="capitalize cursor-pointer"
              :class="customComputedClass(item)"
            >
              {{item.name}} /
              <small>{{item.role}}</small>
            </q-chip>
          </div>
        </div>
      </div>
      <!-- END: Role/user selection -->

      <!-- START: Lead Stats -->
      <div class="q-px-lg text-weight-regular text-grey-8">
        <q-card class="q-pa-md shadow-4" align="center">
          <div class="row justify-center">
            <div class="col-md-2 col-sm-4 col-xs-6" v-for="(lead,key) in leadStatuses" :key="key">
              <div>{{ lead.label }}</div>
              <div class="q-py-sm">
                <q-btn
                  @click="fetchCurrentUserLeads(activeUserId, lead.envValue)"
                  color="purple-9"
                  size="md"
                  round
                >{{ lead.count }}</q-btn>
              </div>
            </div>
          </div>
        </q-card>
      </div>
      <!-- END: Lead Stats -->

      <div class="q-px-lg q-py-md row items-center">
        <!--START: table title -->
        <div class="col-md-7 q-title text-weight-regular text-grey-9">
          {{getLeadStatusUserDetails?.leadCount?.userRoleName || ''}} List
        </div>
        <!--END: table title -->

        <!--START: table search -->
        <div class="col-md-5">
          <q-input
            clearable
            v-model="filter"
            color="grey-9"
            placeholder="Type.."
            label="Search"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <!--END: table search -->
      </div>

      <!--START: table data -->
      <q-table
        v-if="viewTableFormatAndNotTabs"
        class="customTableClass q-px-lg"
        :rows="tableDataNormal"
        :columns="columns"
        :filter="filter"
        v-model:pagination="paginationControl"
        row-key="name"
      >
        <template v-slot:body="props">
          <q-tr
            :class="[rowActiveId == props.row.__index? 'bg-grey-4 text-dark':'']"
            :props="props"
            @mouseover="rowHover(props.row.__index)"
            @click="rowClick(props.row)"
            class="cursor-pointer"
          >
            <q-td v-for="col in props.cols" :key="col.name">{{ col.value }}</q-td>
          </q-tr>
        </template>
      </q-table>
      <!--END: table data -->

      <!-- content -->
      <q-tabs
        v-if="!viewTableFormatAndNotTabs"
        v-model="tabsModel"
        dense
        align="left"
        class="q-px-lg"
      >
        <!--START: tabs header -->
        <q-tab
          v-for="tabHeader in tabs.tabsHeader"
          :key="tabHeader.value"
          :name="tabHeader.value"
          :label="tabHeader.label"
          class="text-dark"
          @click="fnLoadSOTableData"
        />
        <!--END: tabs header -->
      </q-tabs>

      <!--START: tabs body -->
      <q-tab-panels
        v-if="!viewTableFormatAndNotTabs"
        v-model="tabsModel"
        animated
        class="q-px-lg"
      >
        <q-tab-panel
          v-for="tBodyContent in tabs.tabsBody"
          :key="tBodyContent.value"
          :name="tBodyContent.value"
        >
          <!--START: table aging pending/reject -->
          <q-table
            class="customTableClass"
            :rows="tBodyContent.customData.tableData"
            :columns="tBodyContent.customData.columns"
            :filter="filter"
            v-model:pagination="paginationControl"
            row-key="name"
          >
            <template v-slot:body-cell-shortleadDate="props">
              <q-td :props="props">
                {{ formatDate(props.row.shortleadDate) }}
              </q-td>
            </template>

            <template v-slot:body-cell-id="props">
              <q-td :props="props" class="cursor-pointer" @click="toggleLeadInformation(props.row)">
                <span class="label text-primary">#{{props.row.leadNumber}}</span>
              </q-td>
            </template>
          </q-table>
          <!--END: table table aging pending/reject -->
        </q-tab-panel>
      </q-tab-panels>
      <!--END: tabs body -->
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import moment from 'moment'
import _ from 'lodash'
import generalLeadInformation from '../../components/generalLeadInformation.vue'
import userLeadInformation from '../../components/sat/userLeadInformation.vue'

// Quasar and Vuex setup
const $q = useQuasar()
const store = useStore()

// Refs and reactive
const propToggleLeadInformation = ref(false)
const addtnLeadInformation = ref(null)
const propUserLeads = ref(false)
const propUserId = ref(null)
const propAction = ref(null)
const activeUserId = ref(JSON.parse(localStorage.getItem('u_i'))?.user?.id || '')
const viewTableFormatAndNotTabs = ref(true)
const activeId = ref('')
const rowActiveId = ref('')
const items = ref([])
const currentUserIndex = ref('')
const paginationControl = ref({ rowsPerPage: 10 })
const filter = ref('')
const tableDataNormal = ref([])
const tabsModel = ref('xtab-1')

// Status counts
const statusCount = reactive({
  shortLeadCount: 0,
  wipLeadCount: 0,
  rejectedLeadCount: 0,
  implementationCount: 0,
  submitToSatCount: 0
})

// ======== ENV variables moved to JS scope ========
const WIP_LEADS = import.meta.env.VITE_SALES_MANAGER_STATUS_WIP_LEADS
const SHORT_LEADS = import.meta.env.VITE_SALES_MANAGER_STATUS_SHORT_LEADS
const REJECTED_LEADS = import.meta.env.VITE_SALES_MANAGER_STATUS_REJECTED_LEADS
const IMPLEMENTATION_LEADS = import.meta.env.VITE_SALES_MANAGER_STATUS_IMPLEMENTATION_LEADS
const SUBMIT_TO_SAT_LEADS = import.meta.env.VITE_SALES_MANAGER_STATUS_SUBMIT_TO_SAT_LEADS

// Map for template loop
const leadStatuses = reactive([
  { label: 'Short Lead', envValue: SHORT_LEADS, count: computed(() => statusCount.shortLeadCount) },
  { label: 'WIP Lead', envValue: WIP_LEADS, count: computed(() => statusCount.wipLeadCount) },
  { label: 'Rejected', envValue: REJECTED_LEADS, count: computed(() => statusCount.rejectedLeadCount) },
  { label: 'Implemented', envValue: IMPLEMENTATION_LEADS, count: computed(() => statusCount.implementationCount) },
  { label: 'Submitted to SAT', envValue: SUBMIT_TO_SAT_LEADS, count: computed(() => statusCount.submitToSatCount) }
])

// Columns configuration
const columns = [
  { name: 'name', required: true, label: 'Name', align: 'left', field: 'name', sortable: true },
  { name: 'shortLead', required: true, label: 'Short Lead', align: 'center', field: 'shortLeadCount', sortable: true },
  { name: 'WIPLead', required: true, label: 'WIP Lead', align: 'center', field: 'wipLeadCount', sortable: true },
  { name: 'rejected', required: true, label: 'Rejected', align: 'center', field: 'rejectedLeadCount', sortable: true },
  { name: 'implementation', required: true, label: 'Implementation', align: 'center', field: 'implementationCount', sortable: true },
  { name: 'submittedToSat', required: true, label: 'Submitted to SAT', align: 'center', field: 'submitToSatCount', sortable: true }
]

// Tabs configuration
const tabs = reactive({
  tabsHeader: [
    { label: 'Short Leads', value: 'xtab-1' },
    { label: 'WIP Lead', value: 'xtab-2' },
    { label: 'Rejected', value: 'xtab-3' },
    { label: 'Implementation', value: 'xtab-4' }
  ],
  tabsBody: [
    { value: 'xtab-1', tableFilter: '', customData: { columns: columns, tableData: [] } },
    { value: 'xtab-2', tableFilter: '', customData: { columns: columns, tableData: [] } },
    { value: 'xtab-3', tableFilter: '', customData: { columns: columns, tableData: [] } },
    { value: 'xtab-4', tableFilter: '', customData: { columns: columns, tableData: [] } }
  ]
})

// Computed properties from store
const getLeadStatusUserDetails = computed(() => store.getters['SM_LeadStatusInDetail/getLeadStatusUserDetails'])
const getLeadStatusUserDetails_ShortLeads = computed(() => store.getters['SM_LeadStatusInDetail/getLeadStatusUserDetails_ShortLeads'])
const getLeadStatusUserDetails_WIP = computed(() => store.getters['SM_LeadStatusInDetail/getLeadStatusUserDetails_WIP'])
const getLeadStatusUserDetails_Rejected = computed(() => store.getters['SM_LeadStatusInDetail/getLeadStatusUserDetails_Rejected'])
const getLeadStatusUserDetails_Implementation = computed(() => store.getters['SM_LeadStatusInDetail/getLeadStatusUserDetails_Implementation'])

// Store actions
const LEAD_STATUS_IN_DETAIL = (params) => store.dispatch('SM_LeadStatusInDetail/LEAD_STATUS_IN_DETAIL', params)
const LEAD_STATUS_IN_DETAIL_SO = (params) => store.dispatch('SM_LeadStatusInDetail/LEAD_STATUS_IN_DETAIL_SO', params)

// Computed function for chip classes
const customComputedClass = (item) => {
  if (activeId.value == item.name && item.role == 'SO') return 'bg-purple-9 text-white no-pointer-events'
  if (activeId.value == item.name) return 'bg-purple-9 text-white'
  return 'bg-grey-5 text-dark'
}

// Remaining functions unchanged...
const identifySalesHierarchyRole = () => {
  const userInfo = JSON.parse(localStorage.getItem('u_i'))
  const salesHierarchyCode = import.meta.env.VITE_HIERARCHY_SALES || 'SALES'
  return _.find(userInfo?.roles || [], role => role?.hierarchy?.hierarchyCode?.includes(salesHierarchyCode))
}

// Other functions like fetchCurrentUserLeads, toggleLeadInformation, rowClick, breadCrumsNavigation, fnLoadAllTableData, fnLoadSOTableData etc.
// remain the same as in your original code.
</script>

<style scoped>
.btn-border-radius { border-radius: 20px; padding: 10px; }
.bottom-border { border-bottom: 1px solid #e0e0e0; }
.customTableClass { border: 1px solid #e0e0e0; }
</style>
