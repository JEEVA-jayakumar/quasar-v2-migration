<template>
  <q-page>
    <div>
      <q-tabs v-model="activeTab" class="shadow-1" indicator-color="primary">
        <q-tab
          name="tab-1"
          label="Active Issue Mapping"
          @click="ajaxSpareData"
          :ripple="false"
        />
        <q-tab
          name="tab-2"
          label="Deactive Issue Mapping"
          :ripple="false"
        />
      </q-tabs>

      <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel name="tab-1">
          <q-table
            :rows="tableData"
            table-class="customSATableClass"
            :columns="columns1"
            :filter="filterSearch"
            v-model:pagination="paginationControl"
            :filter-method="myCustomSearchFilter1"
            row-key="name"
            color="grey-9"
          >
            <template #body-cell-action="props">
              <q-td :props="props">
                <div class="row no-wrap no-padding">
                  <q-btn
                    dense
                    no-caps
                    no-wrap
                    label="Modify"
                    icon="far fa-plus-square"
                    size="md"
                    @click="fnShowEditIssueMapping(props.row)"
                    flat
                    class="text-light-blue"
                  ></q-btn>
                  <q-btn
                    dense
                    no-caps
                    no-wrap
                    label="Disable"
                    icon="far fa-minus-square"
                    size="md"
                    @click="fnDeleteIssueMapping(props.row)"
                    flat
                    class="text-negative"
                  ></q-btn>
                </div>
              </q-td>
            </template>

            <template #top>
              <div class="row full-width q-pa-md">
                <div class="col-4">
                  <q-input
                    clearable
                    color="grey-9"
                    v-model="filterSearch"
                    placeholder="Search by Issue Name"
                    class="q-mr-lg"
                    dense
                    outlined
                  >
                    <template #prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
                <div class="col-8" style="text-align: right">
                  <q-btn
                    no-caps
                    class="text-weight-regular alignbtn1"
                    label="Add Issue Mapping"
                    @click="fnShowAddNewIssueMapping"
                    color="primary"
                    size="md"
                  />
                </div>
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <q-tab-panel name="tab-2">
          <q-table
            :rows="tableData1"
            table-class="customSATableClass"
            :columns="columns2"
            :filter="filterSearch1"
            v-model:pagination="paginationControl2"
            :filter-method="myCustomSearchFilter2"
            row-key="name"
            color="grey-9"
          >
            <template #body-cell-action1="props">
              <q-td :props="props">
                <div class="row no-wrap no-padding">
                  <q-btn
                    dense
                    no-caps
                    no-wrap
                    label="Active"
                    icon="far fa-plus-square"
                    size="md"
                    @click="fnShowActiveIssueMapping(props.row)"
                    flat
                    class="text-light-blue"
                  ></q-btn>
                </div>
              </q-td>
            </template>

            <template #top>
              <div class="row full-width q-pa-md">
                <div class="col-4">
                  <q-input
                    clearable
                    color="grey-9"
                    v-model="filterSearch1"
                    placeholder="Search by Issue Name"
                    class="q-mr-lg"
                    dense
                    outlined
                  >
                    <template #prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
              </div>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>

      <!--START: Show edit Issue Mapping -->
      <ShowEditIssueMapping
        v-if="propShowEditIssueMapping"
        :propShowEditIssueMapping="propShowEditIssueMapping"
        :propRowDetails2="propRowDetails2"
        @emitfnshowEditIssueMapping="fnShowEditIssueMapping"
      />
      <!-- END: Show edit Issue Mapping -->
      
      <!--START: Show Add Issue Mapping -->
      <ShowAddIssueMapping
        v-if="propShowAddIssueMapping"
        :propShowAddIssueMapping="propShowAddIssueMapping"
        :propRowDetails="propRowDetails"
        @emitfnShowAddNewIssueMapping="fnShowAddNewIssueMapping"
      />
      <!--END: Show Add Issue Mapping -->
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import ShowAddIssueMapping from "../../components/super_admin/ShowAddIssueMapping.vue"
import ShowEditIssueMapping from "../../components/super_admin/ShowEditIssueMapping.vue"

const $q = useQuasar()
const store = useStore()

// Refs
const activeTab = ref('tab-1')
const propShowAddIssueMapping = ref(false)
const propShowEditIssueMapping = ref(false)
const propRowDetails = ref("")
const propRowDetails2 = ref("")
const filterSearch = ref("")
const filterSearch1 = ref("")

const paginationControl = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10
})

const paginationControl2 = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10
})

const tableData = ref([])
const tableData1 = ref([])

// Columns definitions
const columns1 = [
  {
    name: "name",
    required: true,
    label: "Issue Name",
    align: "left",
    field: "name",
    sortable: true
  },
  {
    name: "action",
    required: true,
    label: "",
    align: "left",
    field: "",
    sortable: false
  }
]

const columns2 = [
  {
    name: "name",
    required: true,
    label: "Issue Name",
    align: "left",
    field: "name",
    sortable: true
  },
  {
    name: "action1",
    required: true,
    label: "",
    align: "left",
    field: "",
    sortable: false
  }
]

// Computed getters
const getactiveIssueMapping = computed(() => store.getters['serviceRequest/getactiveIssueMapping'])
const getdeactiveIssueMapping = computed(() => store.getters['serviceRequest/getdeactiveIssueMapping'])

// Methods
const fnShowActiveIssueMapping = async (reqData) => {
  console.log("REQUEST DATA---------->", JSON.stringify(reqData))
  
  $q.dialog({
    title: "Confirm",
    message: "Are you sure want to active this issue?",
    ok: {
      label: "Continue",
      color: "primary"
    },
    cancel: {
      label: "Cancel",
      color: "negative",
      flat: true
    },
    persistent: true
  }).then(async () => {
    $q.loading.show({
      delay: 100,
      message: "Please Wait",
      spinnerColor: "primary",
      customClass: "shadow-none"
    })
    
    try {
      const param = {
        id: reqData.id,
        request: reqData
      }
      
      await store.dispatch('serviceRequest/ACTIVE_ISSUE_MAPPING', param)
      
      $q.loading.hide()
      $q.notify({
        color: "positive",
        position: "bottom",
        message: "Successfully Updated!",
        icon: "thumb_up"
      })
      
      await ajaxSpareData()
    } catch (error) {

      $q.loading.hide()
      $q.notify({
        color: "negative",
        position: "bottom",
        message: error.body?.message || "Please Try Again Later!",
        icon: "thumb_down"
      })
    }
  }).catch(() => {
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "Action cancelled",
      icon: "thumb_down"
    })
  })
}

const fnDeleteIssueMapping = async (rowDetails) => {
  console.log("ROW DETAILS------------->", JSON.stringify(rowDetails))
  
  $q.dialog({
    title: "Confirm",
    message: "Are you sure want to disable?",
    ok: {
      label: "Continue",
      color: "primary"
    },
    cancel: {
      label: "Cancel",
      color: "negative",
      flat: true
    },
    persistent: true
  }).then(async () => {
    $q.loading.show({
      delay: 100,
      message: "Please Wait",
      spinnerColor: "primary",
      customClass: "shadow-none"
    })
    
    try {
      await store.dispatch('serviceRequest/DELETE_ISSUE_MAPPING', rowDetails)
      
      $q.loading.hide()
      $q.notify({
        color: "positive",
        position: "bottom",
        message: "Successfully Removed",
        icon: "thumb_up"
      })
      
      await ajaxSpareData()
    } catch (error) {

      $q.loading.hide()
      $q.notify({
        color: "negative",
        position: "bottom",
        message: error.body?.message || "Please Try Again Later!",
        icon: "thumb_down"
      })
    }
  }).catch(() => {
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "No changes made!",
      icon: "thumb_down"
    })
  })
}

const ajaxSpareData = async () => {
  $q.loading.show({
    delay: 100,
    message: "Loading...",
    spinnerColor: "primary",
    customClass: "shadow-none"
  })
  
  try {
    // Fetch active issue mapping
    await store.dispatch('serviceRequest/FETCH_ACTIVE_ISSUE_MAPPING')
    tableData.value = getactiveIssueMapping.value || []
    console.log("Active tableData------->", JSON.stringify(tableData.value))
    
    // Fetch deactive issue mapping
    await store.dispatch('serviceRequest/FETCH_DEACTIVE_ISSUE_MAPPING')
    tableData1.value = getdeactiveIssueMapping.value || []
    console.log("Deactive tableData------->", JSON.stringify(tableData1.value))
    
    $q.loading.hide()
  } catch {

    $q.loading.hide()
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "Failed to load data",
      icon: "thumb_down"
    })
  }
}

const fnShowAddNewIssueMapping = (token) => {
  propShowAddIssueMapping.value = !propShowAddIssueMapping.value
  if (token === "refresh") {
    ajaxSpareData()
  }
}

const fnShowEditIssueMapping = (rowDetails) => {
  propShowEditIssueMapping.value = !propShowEditIssueMapping.value
  propRowDetails2.value = rowDetails
  if (!propShowEditIssueMapping.value) {
    ajaxSpareData()
  }
}

const myCustomSearchFilter1 = (rows, terms, cols, cellValue) => {
  const lowerTerms = terms ? terms.toLowerCase() : ""
  return rows.filter(row =>
    cols.some(
      col =>
        (cellValue(col, row) + "").toLowerCase().indexOf(lowerTerms) !== -1
    )
  )
}

const myCustomSearchFilter2 = (rows, terms, cols, cellValue) => {
  const lowerTerms = terms ? terms.toLowerCase() : ""
  return rows.filter(row =>
    cols.some(
      col =>
        (cellValue(col, row) + "").toLowerCase().indexOf(lowerTerms) !== -1
    )
  )
}

// Lifecycle
onMounted(() => {
  ajaxSpareData()
})
</script>

<style scoped>
.alignbtn1 {
  margin-right: 254px;
}

/* Custom table styling */
.customSATableClass :deep(.q-table__top) {
  padding: 0;
}

.customSATableClass :deep(.q-table__control) {
  width: 100%;
}
</style>