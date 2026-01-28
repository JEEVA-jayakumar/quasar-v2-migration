<template>
  <q-page>
    <div class="text-grey-9">
      <div class="row bottom-border q-pa-sm items-center">
        <div class="col">

          <!-- Tabs -->
          <q-tabs
            v-model="inventoryOptionSelected"
            color="dark"
            class="shadow-1"
            inline-label
            dense
          >
            <q-tab name="serviceRequest" label="Service Request" />
            <q-tab name="issueTypes" label="Issue Types" />
            <q-tab name="serviceStatus" label="Service Status" />
            <q-tab name="cancelled" label="Cancelled" />
            <q-tab name="serviceResolutionRemarks" label="Service Resolution Remarks" />
            <q-tab name="issueMapping" label="Issue Mapping" />
            <q-tab name="csSubIssue" label="CS Sub Issue" />
          </q-tabs>

          <!-- Tab Panels -->
          <q-tab-panels
            v-model="inventoryOptionSelected"
            animated
            keep-alive
          >
            <q-tab-panel name="serviceRequest">
              <serviceRequest />
            </q-tab-panel>

            <q-tab-panel name="issueTypes">
              <issueTypes />
            </q-tab-panel>

            <q-tab-panel name="serviceStatus">
              <serviceStatus />
            </q-tab-panel>

            <q-tab-panel name="cancelled">
              <cancelled />
            </q-tab-panel>

            <q-tab-panel name="serviceResolutionRemarks">
              <serviceResolutionRemarks />
            </q-tab-panel>

            <q-tab-panel name="issueMapping">
              <issueMapping />
            </q-tab-panel>

            <q-tab-panel name="csSubIssue">
              <csSubIssue />
            </q-tab-panel>
          </q-tab-panels>

        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'

/* -----------------------------
   Components
----------------------------- */
import serviceRequest from '../../components/super_admin/serviceRequest.vue'
import issueTypes from '../../components/super_admin/issueTypes.vue'
import serviceStatus from '../../components/super_admin/serviceStatus.vue'
import cancelled from '../../components/super_admin/cancelled.vue'
import serviceResolutionRemarks from '../../components/super_admin/serviceResolutionRemarks.vue'
import issueMapping from '../../components/super_admin/issueMapping.vue'
import csSubIssue from '../../components/super_admin/csSubIssue.vue'

/* -----------------------------
   Store
----------------------------- */
const store = useStore()

/* -----------------------------
   State
----------------------------- */
const inventoryOptionSelected = ref('serviceRequest')
const toggleAjaxLoadFilter = ref(false)


/* -----------------------------
   Lifecycle
----------------------------- */
onMounted(() => {
  fnAjaxFetchAllDeviceDetailsWithCount()
})

/* -----------------------------
   Methods
----------------------------- */
const fnAjaxFetchAllDeviceDetailsWithCount = async () => {
  toggleAjaxLoadFilter.value = true

  try {
    const userInfo = JSON.parse(localStorage.getItem('u_i') || '{}')
    const regionId = userInfo?.region?.id

    if (!regionId) {
      toggleAjaxLoadFilter.value = false
      return
    }

    await store.dispatch(
      'SAT_RegionalInventoryAllocation/FETCH_REGIONAL_INVENTORY_DEVICE_DETAIL_WITH_COUNT',
      regionId
    )

    const requestParams = {
      region: regionId,
      action: store.state?.REGIONAL_INVENTORY_FILTER_ACTION_DEVICE
    }

    await store.dispatch(
      'SAT_RegionalInventoryAllocation/FETCH_REGIONAL_INVENTORY_SERIAL_NUMBER_BY_DEVICE',
      requestParams
    )
  } catch {

    // silent fail (matches existing behavior)
  } finally {
    toggleAjaxLoadFilter.value = false
  }
}
</script>

<style scoped>
.border-1 {
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.border-2 {
  border: 3px solid rgba(48, 48, 48, 0.5);
}
</style>
