<template>
  <q-page>
    <!-- content -->
    <div>
      <div
        class="col-md-12 text-h6 q-px-lg q-py-md text-weight-regular bottom-border text-grey-9"
      >
        Bijlipay Global Serial Number/TID Search
      </div>
      <div class="row gutter-x-xs gutter-y-xs q-pt-md justify-around items-end">
        <div class="col-md-6">
          <q-input
            clearable
            color="grey-9"
            @blur="formData.searchTerm"
            :error="v$.formData.searchTerm.$error"
            v-model="formData.searchTerm"
            placeholder="Type.."
            label="Search .."
            class="q-mr-lg q-py-sm"
          />
        </div>
        <div class="col-sm-2">
          <q-select
            label="Select Any One"
            placeholder="Select Any One"
            color="grey-9"
            v-model="formData.select"
            :options="dropDown"
            emit-value
            map-options
          />
        </div>
        <div class="col-md-3">
          <div class="group" v-if="formData.select == 1">
            <q-radio
              v-for="(item, index) in flagOptions"
              :key="index"
              color="grey-9"
              v-model="formData.flag"
              :val="item.value"
              :label="item.label"
            />
          </div>
          <div class="group" v-if="formData.select == 2">
            <q-radio
              v-for="(item, index) in flagOptions1"
              :key="index"
              color="grey-9"
              v-model="formData.flag"
              :val="item.value"
              :label="item.label"
            />
          </div>
        </div>
        <div class="col-md-1">
          <q-btn
            class="auto"
            size="md"
            type="button"
            color="purple-9"
            @click="globalSearchSubmit"
          >
            Submit
          </q-btn>
        </div>
      </div>
    </div>
    <div
      v-if="tableData.length == 0"
      class="row gutter-x-xs gutter-y-xs justify-center q-pt-lg q-mr-lg q-ml-lg q-mt-lg q-mb-lg dFont"
      style="min-height: calc(80vh - 52px)"
    >
      <div class="row" align="center">
        <q-icon name="warning" color="warning" size="4rem" />
        <div class="text-subtitle1 text-bold text-grey-9" style="align-self: center">
          No Data Available
        </div>
      </div>
    </div>
    <div
      v-for="tdata in tableData"
      :key="tdata.id"
      class="row gutter-x-xs gutter-y-xs justify-center q-pt-lg q-mr-lg q-ml-lg q-mt-lg q-mb-lg dFont"
    >
      <div class="col-lg-4 col-md-6 col-sm-12">
        <q-card class="q-card q-py-md items-center round-borders q-pa-sm">
          <q-card-section>
            <div
              v-if="tableData.length > 0 && viewopen == 1"
              class="text-subtitle1 text-bold text-grey-9"
            >
              Lead Status
            </div>
            <div
              v-if="tableData.length > 0 && viewopen == 2"
              class="text-subtitle1 text-bold text-grey-9"
            >
              QR Lead Status
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div v-if="tableData.length > 0 && viewopen == 1">
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.leadStatus.leadNumber.label
                }}</span>
                <span class="col-md-8 text-wrap text-primary">{{
                  "# " + tdata.leadNumber
                }}</span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.leadStatus.leadName.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  >{{ tdata.leadName }}</span
                >
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.leadStatus.leadAddress.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  >{{ tdata.leadAddress }}</span
                >
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.leadStatus.contactNumber.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  >{{ tdata.leadContactNumber }}</span
                >
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.leadStatus.leadDevice.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  >{{ tdata.leadDevice }}</span
                >
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.leadStatus.leadDeviceCount.label
                }}</span>
                <span class="col-md-4">{{ tdata.leadDeviceCount }}</span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.leadStatus.leadRegionName.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  >{{ tdata.leadRegionName }}</span
                >
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.leadStatus.leadStatus.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  :style="`background-color:${funcValidate(tdata.leadStatus, 'LS')}; 
                                  border: solid 1px ${funcValidate(
                                    tdata.leadStatus,
                                    'LS'
                                  )}; 
                                  padding: 2px; border-radius: 5px; text-align: center`"
                >
                  {{ processStatus(tdata.leadStatus, "LS") }}
                </span>
              </div>
            </div>
            <div v-if="tableData.length > 0 && viewopen == 2">
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.leadStatus.leadNumber.label
                }}</span>
                <span class="col-md-8 text-wrap text-primary">{{
                  "# " + tdata.qRLeadNumber
                }}</span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.leadStatus.leadName.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  >{{ tdata.qRLeadName }}</span
                >
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.leadStatus.leadAddress.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  >{{ tdata.qRAddress }}</span
                >
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.leadStatus.contactNumber.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  >{{ tdata.contactNumber }}</span
                >
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.leadStatus.vpa.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  >{{ tdata.vPA }}</span
                >
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.leadStatus.leadDevice.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  >{{ tdata.qRDeviceType }}</span
                >
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.leadStatus.leadDeviceCount.label
                }}</span>
                <span class="col-md-4">{{ tdata.leadDeviceCount }}</span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.leadStatus.leadRegionName.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  >{{ tdata.qRregionName }}</span
                >
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.leadStatus.leadStatus.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  :style="`background-color:${funcValidate(tdata.qRLeadStatus, 'QR')}; 
                                  border: solid 1px ${funcValidate(
                                    tdata.qRLeadStatus,
                                    'QR'
                                  )}; 
                                  padding: 2px; border-radius: 5px; text-align: center;`"
                >
                  {{ processStatus(tdata.qRLeadStatus, "QR") }}
                </span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-4 col-md-6 col-sm-12">
        <q-card class="q-card q-py-md round-borders q-pa-sm">
          <q-card-section>
            <div class="text-subtitle1 text-bold text-grey-9">Tid Status</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div v-if="tableData.length > 0">
              <div
                v-if="tdata.tidStatus == 6"
                class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9"
              >
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.tidStatus.tid.label
                }}</span>
                <span class="col-md-8 text-wrap text-primary">{{
                  "# " + tdata.tid
                }}</span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.tidStatus.tidStatus.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  :style="`background-color:${funcValidate(tdata.tidStatus, 'TS')}; 
                                  border: solid 2px ${funcValidate(
                                    tdata.tidStatus,
                                    'TS'
                                  )}; 
                                  padding: 2px; border-radius: 5px; text-align: center`"
                >
                  {{ processStatus(tdata.tidStatus, "TS") }}
                </span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.tidStatus.tidAssignedTo.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  :style="`background-color:${
                    tdata.tidAssignedTo == 'NA' ? 'springgreen' : 'tomato'
                  }; 
                                  padding: 2px; border-radius: 5px; text-align: center`"
                  >{{ tdata.tidAssignedTo }}</span
                >
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.tidStatus.tidImplementedDate.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  >{{ formatDate(tdata.tidImplementedDate) }}</span
                >
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.tidStatus.deviceRecoveryStatus.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  :style="`background-color:${funcValidate(
                    tdata.deviceRecoveryStatus,
                    'TRCS'
                  )}; 
                                  border: solid 2px ${funcValidate(
                                    tdata.deviceRecoveryStatus,
                                    'TRCS'
                                  )}; 
                                  padding: 2px; border-radius: 5px; text-align: center`"
                >
                  {{ processStatus(tdata.deviceRecoveryStatus, "TRCS") }}
                </span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.tidStatus.recoveredBy.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  :style="`background-color:${
                    tdata.recoveredBy == 'NA' ? 'springgreen' : 'tomato'
                  }; 
                                  padding: 2px; border-radius: 5px; text-align: center`"
                  >{{ tdata.recoveredBy }}</span
                >
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.tidStatus.deviceReplacementStatus.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  :style="`background-color:${funcValidate(
                    tdata.deviceReplacementStatus,
                    'TRPS'
                  )}; 
                                  border: solid 2px ${funcValidate(
                                    tdata.deviceReplacementStatus,
                                    'TRPS'
                                  )}; 
                                  padding: 2px; border-radius: 5px; text-align: center`"
                >
                  {{ processStatus(tdata.deviceReplacementStatus, "TRPS") }}
                </span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.tidStatus.replacedBy.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  :style="`background-color:${
                    tdata.replacedBy == 'NA' ? 'springgreen' : 'tomato'
                  }; 
                                  padding: 2px; border-radius: 5px; text-align: center;`"
                  >{{ tdata.replacedBy }}</span
                >
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-4 col-md-6 col-sm-12 no-wrap">
        <q-card class="q-card q-py-md round-borders q-pa-sm">
          <q-card-section>
            <div class="text-subtitle1 text-bold text-grey-9">Serial Number Status</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div v-if="tableData.length > 0">
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.serialNumberStatus.serialNumber.label
                }}</span>
                <span class="col-md-8 text-wrap text-primary">{{
                  "# " + tdata.serialNumber
                }}</span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.serialNumberStatus.ciDeviceType.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  >{{ tdata.ciDeviceType }}</span
                >
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.serialNumberStatus.ciDeviceStauts.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  :style="`background-color:${funcValidate(
                    tdata.ciDeviceStauts,
                    'CIDS'
                  )}; 
                                  border: solid 2px ${funcValidate(
                                    tdata.ciDeviceStauts,
                                    'CIDS'
                                  )}; 
                                  padding: 2px; border-radius: 5px; text-align: center`"
                >
                  {{ processStatus(tdata.ciDeviceStauts, "CIDS") }}
                </span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.serialNumberStatus.deviceAllocatedtoRegion.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  :style="`background-color:${
                    tdata.deviceAllocatedtoRegion ? 'springgreen' : 'tomato'
                  }; 
                                  padding: 2px; border-radius: 5px; text-align: center`"
                >
                  {{
                    tdata.deviceAllocatedtoRegion ? "Allocated" : "Not Allocated"
                  }}</span
                >
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.serialNumberStatus.riDeviceStatus.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  :style="`background-color:${funcValidate(
                    tdata.riDeviceStatus,
                    'RIDS'
                  )}; 
                                  border: solid 2px ${funcValidate(
                                    tdata.riDeviceStatus,
                                    'RIDS'
                                  )}; 
                                  padding: 2px; border-radius: 5px; text-align: center`"
                >
                  {{ processStatus(tdata.riDeviceStatus, "RIDS") }}
                </span>
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.serialNumberStatus.riDeviceAllocatedOrImplemented.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  :style="`background-color:${
                    tdata.riDeviceAllocatedOrImplemented ? 'springgreen' : 'tomato'
                  }; 
                                  padding: 2px; border-radius: 5px; text-align: center`"
                >
                  {{
                    tdata.riDeviceAllocatedOrImplemented
                      ? "Allocated / Implemented"
                      : "Not Allocated / Implemented"
                  }}</span
                >
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.serialNumberStatus.isDeviceReceivedInRi.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  :style="`background-color:${
                    tdata.isDeviceReceivedInRi == 1 ? 'springgreen' : 'tomato'
                  }; 
                                  padding: 2px; border-radius: 5px; text-align: center`"
                >
                  {{
                    tdata.isDeviceReceivedInRi == 1 ? "Received" : "Not Received"
                  }}</span
                >
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.serialNumberStatus.riAssignedSO.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  :style="`background-color:${
                    tdata.isDeviceReceivedInRi == 1 ? 'springgreen' : 'tomato'
                  }; 
                                  padding: 2px; border-radius: 5px; text-align: center`"
                  >{{ tdata.riAssignedSO }}</span
                >
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.serialNumberStatus.riStatusUpdatedDate.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  >{{ formatDate(tdata.riStatusUpdatedDate) }}</span
                >
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.serialNumberStatus.riPodNumber.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  >{{ tdata.riPodNumber }}</span
                >
              </div>
              <div class="row gutter-x-xs gutter-y-xs q-pa-sm text-grey-9">
                <span class="col-md-4 text-weight-medium">{{
                  filedKeys.serialNumberStatus.regionInventoryName.label
                }}</span>
                <span
                  class="col-md-8 text-wrap content-center text-weight-regular text-blue-grey-10"
                  >{{ tdata.regionInventoryName }}</span
                >
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <!--START >> Show Ajax Spinner -->
    <div v-if="toggleAjaxLoadFilter" class="fullscreen spinner-overlay">
      <q-spinner-bars class="absolute-center" style="color: #61116a" :size="35" />
    </div>
    <!--END >> Show Ajax Spinner -->
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, reactive } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { format } from 'date-fns';

export default defineComponent({
  name: "globalSearchFilterValues",

  setup() {
    const $q = useQuasar();
    const store = useStore();

    // Refs
    const toggleAjaxLoadFilter = ref(false);
    const filterSearch = ref("");
    const viewopen = ref("");
    const tableData = ref([]);

    // Form data
    const formData = reactive({
      flag: "",
      select: "",
      searchTerm: "",
    });

    // Validation rules
    const rules = {
      formData: {
        select: { required },
        flag: { required },
        searchTerm: { required },
      },
    };

    const v$ = useVuelidate(rules, { formData });

    // Static data
    const filedKeys = {
      leadStatus: {
        leadNumber: { label: "Lead Number" },
        leadName: { label: "Lead Name" },
        leadAddress: { label: "Address" },
        contactNumber: { label: "Contact Number" },
        vpa: { label: "Vpa" },
        leadDevice: { label: "Device Type" },
        leadDeviceCount: { label: "Device Count" },
        leadRegionName: { label: "Region Name" },
        leadStatus: { label: "Lead Status" },
      },
      tidStatus: {
        tid: { label: "TID" },
        tidStatus: { label: "Status" },
        tidAssignedTo: { label: "Assigned To" },
        tidImplementedDate: { label: "Status Date" },
        deviceRecoveryStatus: { label: "Recovery Status" },
        recoveredBy: { label: "Recovered By" },
        deviceReplacementStatus: { label: "Replacement Status" },
        replacedBy: { label: "Replaced By" },
      },
      serialNumberStatus: {
        serialNumber: { label: "Serial Number" },
        ciDeviceType: { label: "CI Device Type" },
        ciDeviceStauts: { label: "CI Device Status" },
        deviceAllocatedtoRegion: { label: "IS Device Allocated To Region" },
        riDeviceStatus: { label: "RI Device Status" },
        riDeviceAllocatedOrImplemented: {
          label: "RI Device Allocated Or Implemented",
        },
        isDeviceReceivedInRi: { label: "Device Received In RI" },
        riAssignedSO: { label: "RI Assigned SO" },
        riStatusUpdatedDate: { label: "RI Status Updated Date" },
        riPodNumber: { label: "RI POD Number" },
        regionInventoryName: { label: "Regional Inventory Name" },
      },
    };

    const dropDown = [
      {
        label: "POS",
        value: 1,
      },
      {
        label: "QR",
        value: 2,
      },
    ];

    const flagOptions = [
      {
        label: "Tid",
        value: 1,
      },
      {
        label: "Serial Number",
        value: 2,
      },
      {
        label: "Mid",
        value: 3,
      },
      {
        label: "Lead Number",
        value: 4,
      },
      {
        label: "Application Number",
        value: 5,
      },
    ];

    const flagOptions1 = [
      {
        label: "Vpa",
        value: 6,
      },
      {
        label: "Application Number",
        value: 7,
      },
      {
        label: "Qr Lead Number",
        value: 8,
      },
    ];

    // Table pagination control
    const paginationControl = ref({
      rowsNumber: 10,
      page: 1,
      sortBy: "leadNumber",
      descending: false,
      rowsPerPage: 25,
    });

    // Computed properties
    const getGlobalSearchSerialNumber = computed(() => store.getters['globalSearchSerialNumber/getGlobalSearchSerialNumber']);
    
    const GLOBAL_STATUS_FETCH = computed(() => store.getters['GlobalVariables/GLOBAL_STATUS_FETCH']);

    // Helper functions
    const deCapitalizeFirstLetter = (str) => {
      if (!str) return "";
      return str.charAt(0).toLowerCase() + str.slice(1);
    };

    const formatDate = (dateString) => {
      if (!dateString || dateString === 'NA') return 'NA';
      try {
        const date = new Date(dateString);
        return format(date, 'do MMM y');
      } catch {
        return dateString;
      }
    };

    // Methods
    const globalSearchSubmit = async () => {
      const isFormValid = await v$.value.$validate();
      
      if (!isFormValid) {
        $q.notify("Please review fields again.");
        return;
      }

      if (formData.select == 1) {
        if (formData.flag < 6) {
          viewopen.value = 1;
          await performSearch(flagOptions);
        } else {
          $q.notify("Please review fields again.");
        }
      } else if (formData.select == 2) {
        if (formData.flag > 5) {
          viewopen.value = 2;
          await performSearch(flagOptions1);
        } else {
          $q.notify("Please review fields again.");
        }
      }
    };

    const performSearch = async (optionsArray) => {
      $q.loading.show({
        delay: 0,
        spinnerColor: "purple-9",
        message: "Fetching data ..",
      });

      try {
        const sortOption = optionsArray.find(option => option.value === formData.flag);
        paginationControl.value.sortBy = formData.flag != 2
          ? deCapitalizeFirstLetter(sortOption.label.replaceAll(/\s/g, ""))
          : "c.serialNumber";

        const params = {
          select: formData.select,
          flag: formData.flag,
          searchTerm: formData.searchTerm,
          pagination: paginationControl.value,
        };

        await store.dispatch("globalSearchSerialNumber/FETCH_GLOBAL_SEARCH_DATAS", params);

        const searchData = getGlobalSearchSerialNumber.value;
        
        paginationControl.value = {
          ...params.pagination,
          rowsNumber: searchData.totalElements || 0,
          page: searchData.number ? searchData.number + 1 : 1,
          sortBy: searchData.sort?.[0]?.property || paginationControl.value.sortBy,
          descending: !searchData.sort?.[0]?.ascending
        };

        tableData.value = searchData.content || [];
      } catch (error) {

        console.error('Error in search:', error);
        $q.notify({
          color: 'negative',
          message: 'Failed to fetch data'
        });
      } finally {
        $q.loading.hide();
      }
    };

    const processStatus = (obj, key) => {
      let value = "";
      const statusMaps = GLOBAL_STATUS_FETCH.value;
      
      if (!statusMaps) return "NA";

      switch (key) {
        case "LS":
          value = statusMaps.LEAD_STATUS?.[obj];
          break;
        case "TS":
          value = statusMaps.TID_STATUS?.[obj];
          break;
        case "TRPS":
          value = statusMaps.TID_REPLACEMENT_STATUS?.[obj];
          break;
        case "TRCS":
          value = statusMaps.TID_RECOVERY_STATUS?.[obj];
          break;
        case "CIDS":
          value = statusMaps.CENTRAL_INVENTORY_DEVICE_STATUS?.[obj];
          break;
        case "RIDS":
          value = statusMaps.REGIONAL_INVENTORY_DEVICE_STATUS?.[obj];
          break;
        case "QR":
          value = statusMaps.QR_LEAD_STATUS?.[obj];
          break;
        default:
          value = "NA";
      }
      return value == undefined ? "NA" : value;
    };

    const funcValidate = (obj, key) => {
      const colors = [
        "tomato", "pink", "purple", "indigo", "blue", "lightblue",
        "lightsalmon", "teal", "wheat", "lightgreen", "lightcoral",
        "springgreen", "lightseagreen", "amber", "orange", "deep-orange",
        "brown", "grey", "blue-grey", "tomato"
      ];
      
      const tColors = [
        "lightcoral", "lightgreen", "orange", "red", "lightblue",
        "blue", "springgreen", "lightsalmon"
      ];
      
      const riColors = [
        "tomato", "lightgreen", "orange", "indigo", "blue", "lightblue",
        "wheat", "lightsalmon", "lightcoral", "springgreen", "tomato"
      ];
      
      const ciColors = [
        "tomato", "springgreen", "tomato", "lightsalmon",
        "lightcoral", "amber"
      ];
      
      const trpsColors = [
        "tomato", "lightcoral", "lightsalmon", "springgreen", "lightgreen"
      ];
      
      const trcsColors = ["tomato", "lightcoral", "lightgreen", "springgreen"];
      
      const qcolors = [
        "tomato", "pink", "purple", "lightsalmon", "lightblue",
        "lightsalmon", "teal", "wheat", "lightgreen", "lightcoral",
        "springgreen", "lightseagreen", "amber", "orange", "deep-orange",
        "brown", "grey", "blue-grey", "tomato"
      ];

      const status = parseInt(obj);
      
      switch (key) {
        case "LS":
          if (status == 101) return colors[19];
          else if (status == 102) return colors[16];
          else return colors[status] || "tomato";
        case "TS":
          return tColors[status] || "tomato";
        case "TRPS":
          return trpsColors[status] || "tomato";
        case "TRCS":
          return trcsColors[status] || "tomato";
        case "CIDS":
          return ciColors[status] || "tomato";
        case "RIDS":
          return riColors[status] || "tomato";
        case "QR":
          return qcolors[status] || "tomato";
        default:
          return "tomato";
      }
    };

    return {
      // Refs
      toggleAjaxLoadFilter,
      filterSearch,
      viewopen,
      tableData,
      formData,
      paginationControl,
      v$,
      
      // Static data
      filedKeys,
      dropDown,
      flagOptions,
      flagOptions1,
      
      // Computed
      getGlobalSearchSerialNumber,
      GLOBAL_STATUS_FETCH,
      
      // Methods
      globalSearchSubmit,
      processStatus,
      funcValidate,
      formatDate
    };
  }
});
</script>

<style scoped>
.text-wrap {
  overflow-wrap: anywhere;
  color: #242225;
}

.text-h6 {
  font-size: 1.25rem;
  font-weight: 500;
}

.text-subtitle1 {
  font-size: 1rem;
  font-weight: 500;
}

.spinner-overlay {
  background: rgba(255, 255, 255, 0.7);
  z-index: 9999;
}
</style>