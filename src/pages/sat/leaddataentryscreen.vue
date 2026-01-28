<template>
  <q-page>
    <div class="text-grey-9">
      <div class="row bottom-border q-pa-sm items-center">
        <div class="col">
          <q-tabs 
            class="shadow-1" 
            align="justify" 
            v-model="shortlead" 
            active-color="black"
            indicator-color="black"
          >
            <q-tab name="shortlead" label="Short Lead" />
            <q-tab name="wiplead" label="WIP Lead" />
            
            <q-tab-panel name="shortlead">
              <div>
                <div class="col-md-6 q-my-md" align="right">
                  <div class="col group"></div>
                </div>
                <div class="col-12 text-h6 q-my-lg text-weight-regular">
                  Lead Information
                </div>
                <form>
                  <div class="q-px-md">
                    <div class="q-pa-md">
                      <div class="row gutter-sm q-py-sm">
                        <div class="col-md-6">
                          <q-input 
                            v-model="formData.leadName" 
                            @blur="v$.formData.leadName.$touch"
                            :error="v$.formData.leadName.$error" 
                            class="text-weight-regular text-grey-8" 
                            color="grey-9"
                            label="*Merchant Name" 
                            placeholder="Merchant Name" 
                          />
                        </div>
                        <div class="col-md-6">
                          <q-input 
                            v-model="formData.contactName" 
                            @blur="v$.formData.contactName.$touch"
                            :error="v$.formData.contactName.$error" 
                            class="text-weight-regular text-grey-8"
                            label="*Contact Name" 
                            placeholder="Contact Name" 
                          />
                        </div>
                        <div class="col-md-6">
                          <q-input 
                            type="number" 
                            v-model="formData.contactNumber" 
                            class="text-weight-regular text-grey-8" 
                            color="grey-9"
                            @blur="v$.formData.contactNumber.$touch" 
                            :error="v$.formData.contactNumber.$error"
                            label="*Contact Number" 
                            placeholder="Contact Number" 
                          />
                        </div>

                        <div class="col-md-6">
                          <q-input 
                            type="number" 
                            v-model="formData.alternateContactNumber" 
                            class="text-weight-regular text-grey-8"
                            color="grey-9" 
                            label="Alternate Contact Number"
                            placeholder="Alternate Contact Number" 
                          />
                        </div>

                        <div class="col-md-6">
                          <q-input 
                            v-model="formData.email" 
                            @blur="v$.formData.email.$touch"
                            :error="v$.formData.email.$error" 
                            class="text-weight-regular text-grey-8" 
                            color="grey-9"
                            label="*Mail Id" 
                            placeholder="Mail Id" 
                          />
                        </div>
                        <div class="col-md-6">
                          <q-input 
                            v-model="formData.leadAddress" 
                            @blur="v$.formData.leadAddress.$touch"
                            :error="v$.formData.leadAddress.$error" 
                            class="text-weight-regular text-grey-8"
                            color="grey-9" 
                            label="*Merchant Address" 
                            placeholder="Merchant Address" 
                          />
                        </div>
                        <div class="col-md-6">
                          <q-input 
                            type="number" 
                            :error="v$.formData.pincodeTemp.$error"
                            @blur="fnClrPin"
                            clearable 
                            color="grey-9" 
                            v-model="formData.pincodeTemp" 
                            label="Pincode"
                            placeholder="Pincode"
                          >
                            <template #append>
                              <q-icon name="search" />
                            </template>
                          </q-input>
                        </div>
                        
                        <div class="col-md-6">
                          <q-input 
                            disable 
                            v-model="formData.state" 
                            @blur="v$.formData.state.$touch"
                            :error="v$.formData.state.$error" 
                            class="text-weight-regular text-grey-8" 
                            color="grey-9"
                            label="State" 
                            placeholder="State" 
                          />
                        </div>
                        <div class="col-md-6">
                          <q-input 
                            disable 
                            v-model="formData.city" 
                            @blur="v$.formData.city.$touch"
                            :error="v$.formData.city.$error" 
                            class="text-weight-regular text-grey-8" 
                            color="grey-9"
                            label="City/District" 
                            placeholder="City/District" 
                          />
                        </div>
                        <div class="col-md-6">
                          <q-select 
                            v-model="formData.region" 
                            @blur="v$.formData.region.$touch"
                            :error="v$.formData.region.$error" 
                            class="text-weight-regular text-grey-8" 
                            color="grey-9"
                            label="Select Region" 
                            placeholder="Select Region" 
                            :options="dropDown.regionOptions"
                            emit-value
                            map-options
                          />
                        </div>
                        <div class="col-md-6">
                          <q-select 
                            v-model="formData.leadSource" 
                            @blur="v$.formData.leadSource.$touch"
                            :error="v$.formData.leadSource.$error" 
                            class="text-weight-regular text-grey-8"
                            color="grey-9" 
                            label="Lead Source" 
                            placeholder="Lead Source"
                            :options="dropDown.leadSourceOptions" 
                            @update:model-value="getDevice"
                            emit-value
                            map-options
                          />
                        </div>
                        <div class="col-md-6">
                          <q-select 
                            v-model="formData.device" 
                            @update:model-value="devSelected"
                            :error="v$.formData.device.$error" 
                            class="text-weight-regular text-grey-8" 
                            color="grey-9"
                            label="Device Type" 
                            placeholder="Device Type" 
                            :options="dropDown.deviceOptions"
                            emit-value
                            map-options
                          />
                        </div>

                        <div class="col-md-6">
                          <q-option-group 
                            type="checkbox" 
                            :model-value="selectedVas"
                            @update:model-value="handleVasChange" 
                            :disable="vasDisableFlag"
                            class="text-weight-regular text-grey-8" 
                            color="grey-9" 
                            :options="selectBankEnableOptions" 
                          />
                        </div>
                        
                        <div v-if="selectedVas.includes('AMEX')" class="col-md-6">
                          <q-input 
                            v-model="formData.ownerFirstName" 
                            @blur="v$.formData.ownerFirstName.$touch"
                            :error="v$.formData.ownerFirstName.$error" 
                            class="text-weight-regular text-grey-8"
                            color="grey-9" 
                            label="Owner 1 First Name*" 
                            placeholder="Owner 1 First Name*" 
                          />
                        </div>
                        <div v-if="selectedVas.includes('AMEX')" class="col-md-6">
                          <q-input 
                            v-model="formData.ownerLastName" 
                            @blur="v$.formData.ownerLastName.$touch"
                            :error="v$.formData.ownerLastName.$error" 
                            class="text-weight-regular text-grey-8"
                            color="grey-9" 
                            label="Owner 1 Last Name*" 
                            placeholder="Owner 1 Last Name*" 
                          />
                        </div>
                        <div v-if="selectedVas.includes('AMEX')" class="col-md-6">
                          <q-input 
                            v-model="formData.ownerDOB" 
                            @blur="v$.formData.ownerDOB.$touch"
                            :error="v$.formData.ownerDOB.$error" 
                            class="text-weight-regular text-grey-8" 
                            color="grey-9"
                            label="Owner 1 DOB*" 
                            placeholder="Owner 1 DOB*"
                            type="date"
                          />
                        </div>

                        <div class="col-md-6">
                          <q-input 
                            v-model="formData.deviceCount" 
                            @blur="v$.formData.deviceCount.$touch" 
                            :disable="deviceFlag"
                            :error="v$.formData.deviceCount.$error" 
                            class="text-weight-regular text-grey-8"
                            color="grey-9" 
                            @keydown="nameKeydown($event)" 
                            @keyup="trackChange" 
                            label="Device Count" 
                            placeholder="Device Count" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="full-width group" align="center">
                    <q-btn 
                      size="md" 
                      type="button" 
                      color="purple-9" 
                      @click="fnSubmitBankDetails"
                    >
                      Submit
                    </q-btn>
                  </div>
                </form>
              </div>
            </q-tab-panel> <!-- Fixed: Changed from q-tab-pane to q-tab-panel -->
            
            <q-tab-panel name="wiplead">
              <div>
                <q-table 
                  class="my-sticky-header-table" 
                  title="Wip Lead Information" 
                  :rows="getShortLead"
                  :columns="columns" 
                  row-key="name"
                >
                  <template #body-cell-shortleadDate="props">
                    <q-td :props="props">
                      {{ formatDate(props.row.shortleadDate) }}
                    </q-td>
                  </template>

                  <template #body-cell-update="props">
                    <q-td :props="props">
                      <div class="row no-wrap no-padding">
                        <q-btn 
                          dense 
                          no-caps 
                          no-wrap 
                          label="update" 
                          icon="far fa-plus-square" 
                          size="md"
                          @click="fnShowConvertToSat(props.row)" 
                          flat 
                          class="text-light-blue"
                        />
                      </div>
                    </q-td>
                  </template>
                </q-table>
                
                <edit-short-lead 
                  v-if="propShowEditShortLead" 
                  :propShowEditShortLead="propShowEditShortLead"
                  :propRowDetails="propRowDetails" 
                  @emitfnshowEditShortLead="fnShowEditShortLead"
                />
                
                <convert-to-sat 
                  v-if="propShowConvertToSat" 
                  :propShowConvertToSat="propShowConvertToSat"
                  :propRowDetails="propRowDetails" 
                  @emitEditshowConvertToSat="fnShowConvertToSat"
                />
              </div>
            </q-tab-panel> <!-- Fixed: Changed from q-tab-pane to q-tab-panel -->
          </q-tabs>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';
import { useVuelidate } from '@vuelidate/core';
import { required, requiredIf, minLength, maxLength, email } from '@vuelidate/validators';
import { format } from 'date-fns';

import EditShortLead from '../../components/sat/editShortLead.vue';
import ConvertToSat from '../../components/sat/convertToSat.vue';

export default defineComponent({
  name: 'inventoryAllocation',
  
  components: {
    EditShortLead,
    ConvertToSat
  },
  
  setup() {
    const $q = useQuasar();
    const store = useStore();

    // Refs
    const propShowEditShortLead = ref(false);
    const propShowConvertToSat = ref(false);
    const vasDisableFlag = ref(false);
    const propRowDetails = ref('');
    const shortlead = ref('shortlead');
    const deviceFlag = ref(false);
    const pinSelected = ref(false);
    const selectedVas = ref([]);

    // Form data
    const formData = ref({
      leadName: '',
      contactName: '',
      contactNumber: '',
      alternateContactNumber: '',
      email: '',
      deviceSelected: '',
      leadAddress: '',
      region: '',
      pincode: '',
      pincodeTemp: '',
      state: '',
      city: '',
      leadSource: '',
      device: '',
      vasInstanceMapping: '',
      deviceCount: '',
      ownerFirstName: '',
      ownerLastName: '',
      ownerDOB: '',
      data: ''
    });

    // Dropdown options
    const dropDown = ref({
      deviceOptions: [],
      leadSourceOptions: [],
      regionOptions: [],
    });

    const selectBankEnableOptions = ref([]);

    // Table columns
    const columns = [
      {
        name: 'leadName',
        label: 'Lead Name',
        field: 'leadName',
        align: 'center',
        sortable: true
      },
      {
        name: 'leadNumber',
        label: 'Lead Number',
        field: 'leadNumber',
        align: 'center',
        sortable: true
      },
      {
        name: 'contactNumber',
        label: 'Contact Number',
        field: 'contactNumber',
        align: 'center',
        sortable: true
      },
      {
        name: 'shortleadDate',
        label: 'Short Lead Date',
        field: 'shortleadDate',
        align: 'center',
        sortable: true
      },
      {
        name: 'update',
        required: true,
        label: 'Submit to SAT',
        align: 'left',
        field: 'action',
        sortable: false
      }
    ];

    // Validation rules
    const rules = {
      formData: {
        leadName: { required },
        contactName: { required },
        region: { required },
        contactNumber: { 
          required, 
          minLength: minLength(10),
          maxLength: maxLength(10)
        },
        email: { email, required },
        leadAddress: { required },
        pincodeTemp: { 
          required,
          minLength: minLength(6),
          maxLength: maxLength(6)
        },
        state: { required },
        city: { required },
        leadSource: { required },
        device: { required },
        ownerFirstName: { 
          required: requiredIf(() => selectedVas.value.includes('AMEX'))
        },
        ownerDOB: { 
          required: requiredIf(() => selectedVas.value.includes('AMEX'))
        },
        ownerLastName: { 
          required: requiredIf(() => selectedVas.value.includes('AMEX'))
        },
        deviceCount: { required }
      }
    };

    const v$ = useVuelidate(rules, { formData });

    // Computed properties
    const getAllAppDevicesInfo = computed(() => store.getters['appDevice/getAllAppDevicesInfo']);
    const getVasDeviceMapping = computed(() => store.getters['Appvas/getVasDeviceMapping']);
    const getAllAppLeadSource = computed(() => store.getters['appLeadSource/getAllAppLeadSource']);
    const getShortLead = computed(() => store.getters['shortLeadInfo/getShortLead']);
    const getAllStatesData = computed(() => store.getters['SuperAdminUsers/getAllStatesData']);
    const getAllRegionsData = computed(() => store.getters['InventoryCentral/getAllRegionsData']);

    // Helper functions
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        return format(date, 'do MMM y');
      } catch  {
        return dateString;
      }
    };

    // Methods
    const trackChange = () => {
      const count = parseInt(formData.value.deviceCount);
      formData.value.deviceCount = count === 0 ? null : formData.value.deviceCount;
    };

    const handleVasChange = (newVal) => {
      let updated = [...newVal];
      const has = val => updated.includes(val);
      const had = val => selectedVas.value.includes(val);

      // Unselecting EMI → remove Bank EMI + Brand EMI
      if (had('EMI') && !has('EMI')) {
        updated = updated.filter(v => v !== 'Bank EMI' && v !== 'Brand EMI');
      }

      // Selecting EMI → ensure Bank EMI is selected
      if (has('EMI') && !has('Bank EMI')) {
        updated.push('Bank EMI');
      }

      // Selecting Bank EMI → ensure EMI is selected
      if (has('Bank EMI') && !has('EMI')) {
        updated.push('EMI');
      }

      // Selecting Brand EMI → ensure EMI is selected (not Bank EMI)
      if (has('Brand EMI') && !has('EMI')) {
        updated.push('EMI');
      }

      selectedVas.value = [...new Set(updated)];
    };

    const nameKeydown = (e) => {
      if (/^\W$/.test(e.key)) {
        e.preventDefault();
      }
    };

    const getDevice = async (val) => {
      try {
        await store.dispatch('appDevice/FETCH_APP_DEVICES_DATA', val.id);
        
        // Clear existing options
        dropDown.value.deviceOptions = [];
        
        // Map device options
        getAllAppDevicesInfo.value?.forEach(item => {
          dropDown.value.deviceOptions.push({
            value: item,
            label: item.deviceName
          });
        });
      } catch (error) {

        console.error('Error fetching devices:', error);
      }
    };

    const fnSubmitBankDetails = async () => {
      const isValid = await v$.value.$validate();
      
      if (!isValid) {
        $q.notify('Please review fields again.');
        return;
      }

      if (formData.value.leadSource?.multiTidEnabled === true) {
        formData.value.deviceCount = 1;
      }

      formData.value.vasInstanceMapping = JSON.stringify(selectedVas.value);
      
      // Parse region if it's a string
      if (typeof formData.value.region === 'string') {
        try {
          formData.value.region = JSON.parse(formData.value.region);
        } catch (e) {
          console.error('Error parsing region:', e);
        }
      }

      try {
        await store.dispatch('shortLead/STATE_SHORT_LEAD', formData.value);
        shortlead.value = 'wiplead';
        fetchappData();
        
        // Reset form
        resetForm();
      } catch (error) {

        console.error('Error submitting lead:', error);
        $q.notify({
          color: 'negative',
          message: 'Failed to submit lead'
        });
      }
    };

    const resetForm = () => {
      formData.value = {
        leadName: '',
        contactName: '',
        contactNumber: '',
        alternateContactNumber: '',
        email: '',
        deviceSelected: '',
        leadAddress: '',
        region: '',
        pincode: '',
        pincodeTemp: '',
        state: '',
        city: '',
        leadSource: '',
        device: '',
        vasInstanceMapping: '',
        deviceCount: '',
        ownerFirstName: '',
        ownerLastName: '',
        ownerDOB: '',
        data: ''
      };
      selectedVas.value = [];
      vasDisableFlag.value = false;
      deviceFlag.value = false;
      v$.value.$reset();
    };

    const devSelected = async () => {
      $q.loading.show({
        delay: 0,
        spinnerColor: 'purple-9',
        message: 'Fetching data ..'
      });

      try {
        await store.dispatch('Appvas/FETCH_VAS_DATAS', formData.value.device.id);
        
        const deviceArr = getVasDeviceMapping.value?.map(value => ({
          label: value.vas.name,
          value: value.vas.name
        })) || [];

        selectBankEnableOptions.value = deviceArr;

        if (formData.value.device?.deviceName === "Q161_PRO_DQR") {
          vasDisableFlag.value = true;
          const upiOption = deviceArr.find(opt => opt.label === "UPI QR");
          if (upiOption) {
            selectedVas.value = [upiOption.value];
          }
        } else {
          selectedVas.value = [];
          vasDisableFlag.value = false;
        }

        if (formData.value.device?.deviceName === "Q161_PRO_SQR") {
          formData.value.deviceCount = "1";
          deviceFlag.value = true;
        } else {
          deviceFlag.value = false;
        }

      } catch (error) {

        console.error('Error fetching VAS data:', error);
        $q.notify({
          color: 'negative',
          message: 'Error loading VAS options'
        });
        formData.value.device = '';
      } finally {
        $q.loading.hide();
      }
    };

    const pincodeSearch = async (terms, done) => {
      try {
        await store.dispatch('SuperAdminUsers/FETCH_PINCODE_WITH_TERM', terms);
        const filtered = getAllStatesData.value?.filter(item => 
          item.label?.toString().toLowerCase().includes(terms.toLowerCase())
        ) || [];
        done(filtered);
      } catch (error) {

        console.error('Error searching pincode:', error);
        done([]);
      }
    };

    const pincodeSelected = (item) => {
      pinSelected.value = true;
      formData.value.state = item.value?.stateName || '';
      formData.value.city = item.value?.cityName || '';
      formData.value.pincode = item.value?.pincode || '';
      formData.value.pincodeTemp = item.value?.pincode || '';
    };

    const fnClrPin = () => {
      if (!pinSelected.value) {
        formData.value.pincodeTemp = '';
      }
    };

    const fnShowEditShortLead = (rowDetails) => {
      propShowEditShortLead.value = !propShowEditShortLead.value;
      if (rowDetails !== undefined) {
        propRowDetails.value = rowDetails;
      }
    };

    const fnShowConvertToSat = (rowDetails) => {
      propShowConvertToSat.value = !propShowConvertToSat.value;
      if (rowDetails !== undefined) {
        propRowDetails.value = rowDetails;
      }
    };

    const appLoadData = async () => {
      try {
        // Load regions
        await store.dispatch('InventoryCentral/FETCH_ALL_REGIONS_DATA');
        dropDown.value.regionOptions = getAllRegionsData.value?.map(item => ({
          value: JSON.stringify(item),
          label: item.regionAreaName
        })) || [];

        // Load lead sources
        await store.dispatch('appLeadSource/FETCH_APP_LEADSOURCE_DATA');
        const userRegion = JSON.parse(localStorage.getItem("u_i"))?.region?.regionAreaName;
        
        if (userRegion === 'VARANEEK') {
          dropDown.value.leadSourceOptions = getAllAppLeadSource.value
            ?.filter(item => item.active && item.sourceName === 'VARANEEK')
            .map(item => ({
              value: item,
              label: item.sourceName
            })) || [];
        } else {
          dropDown.value.leadSourceOptions = getAllAppLeadSource.value
            ?.filter(item => item.active)
            .map(item => ({
              value: item,
              label: item.sourceName
            })) || [];
        }
      } catch (error) {

        console.error('Error loading app data:', error);
      }
    };

    const fetchappData = async () => {
      try {
        await store.dispatch('shortLeadInfo/FETCH_SHORT_LEAD');
      } catch (error) {

        console.error('Error fetching short lead data:', error);
      }
    };

    const goToSelectedTab = (tab) => {
      if (tab === "wiplead") {
        fetchappData();
      } else if (tab === "shortlead") {
        resetForm();
      }
    };

    // Lifecycle
    onMounted(() => {
      appLoadData();
      fetchappData();
    });

    return {
      // Refs
      propShowEditShortLead,
      propShowConvertToSat,
      vasDisableFlag,
      propRowDetails,
      shortlead,
      deviceFlag,
      pinSelected,
      selectedVas,
      formData,
      dropDown,
      selectBankEnableOptions,
      columns,
      v$,
      
      // Computed
      getShortLead,
      getAllStatesData,
      
      // Methods
      trackChange,
      handleVasChange,
      nameKeydown,
      getDevice,
      fnSubmitBankDetails,
      devSelected,
      pincodeSearch,
      pincodeSelected,
      fnClrPin,
      fnShowEditShortLead,
      fnShowConvertToSat,
      fetchappData,
      goToSelectedTab,
      formatDate
    };
  }
});
</script>

<style scoped>
.border-1 {
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.border-2 {
  border: 3px solid rgba(48, 48, 48, 0.5);
}

.text-h6 {
  font-size: 1.25rem;
  font-weight: 500;
}

.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}

.my-sticky-header-table {
  height: calc(100vh - 300px);
}
</style>