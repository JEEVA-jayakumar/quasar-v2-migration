<template>
  <q-page>
    <q-pull-to-refresh :distance="30" :handler="PullToRefresh" inline>
      <div class="row">
        <!-- Title -->
        <div
          class="col-md-12 q-title q-px-lg q-py-md text-weight-regular text-grey-9 bottom-border"
        >
          Exception Queue
        </div>

        <!-- KYC Exception Queue -->
        <div class="col-md-4 col-sm-12 col-xs-12">
          <q-card
            :class="[$route.params.id == 1 ? 'seriousActive border-blue' : '']"
            class="shadow-0 q-ma-md"
          >
            <q-item class="bg-light-blue relative-position">
              <q-item-section>
                <div class="text-grey-12 q-ml-sm">KYC exceptions queue</div>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  round
                  color="grey-12"
                  class="shadow-5"
                  style="border: 3px solid rgb(32, 169, 244);"
                  text-color="light-blue"
                  >{{ getExceptionQueueInfo.KYCExceptionCount }}</q-btn
                >
              </q-item-section>
            </q-item>

            <q-scroll-area
              :style="{ height: customKycHeight + 'px' }"
              :thumb-style="{
                right: '0px',
                width: '5px',
                background:'rgba(0,0,0,0.15)',
                opacity: 1
              }"
              :delay="500"
            >
              <template v-if="checkExcpetionQueueKyc">
                <div
                  v-for="(item, index) in getExceptionQueueInfo.KYCExceptionQueue"
                  :key="item.id"
                  class="bottom-border q-pa-sm cursor-pointer"
                  @mouseover="kycActiveItemId = index"
                  @click="fnViewKycLeadDetails(item)"
                  :class="kycActiveItemId === index ? 'bg-grey-4' : 'bg-white'"
                >
                  <div class="row">
                    <div class="col-md-5 col-sm-6 col-xs-12 text-weight-light">
                      <div
                        class="q-caption text-light-blue cursor-pointer"
                        @click.stop="toggleLeadInformation(item)"
                      >
                        #{{ item.leadNumber }}
                      </div>
                      <div class="q-caption no-margin text-dark capitalize">
                        {{ item.leadName }}
                      </div>
                    </div>
                    <div class="col-md-7 col-sm-6 col-xs-12 text-weight-light">
                      <div class="q-caption text-dark">{{ item.SOName }}</div>
                      <div class="q-caption text-dark">
                        Date of Updation :
                        <span class="text-primary">
                          {{ formatDate(item.submitteSATDate) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="bottom-border q-ma-sm">
                  <div class="row">
                    <div
                      class="col-md-12 col-sm-12 col-xs-12 text-weight-light"
                      align="center"
                    >
                      <div class="q-caption text-dark q-pa-md">
                        No data to display
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </q-scroll-area>
          </q-card>
        </div>

        <!-- Bank Subvention Queue -->
        <div class="col-md-4 col-sm-12 col-xs-12">
          <q-card
            :class="[$route.params.id == 2 ? 'seriousActive border-green' : '']"
            class="shadow-0 q-ma-md"
          >
            <q-item class="bg-green-7">
              <q-item-section>
                <div class="text-grey-12 q-ml-sm">Bank Subvention Queue</div>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  round
                  color="grey-12"
                  class="shadow-5"
                  style="border: 3px solid rgb(67, 159, 71);"
                  text-color="green-8"
                  >{{ getExceptionQueueInfo.BankExceptionCount }}</q-btn
                >
              </q-item-section>
            </q-item>

            <q-scroll-area
              :style="{ height: customBankSubventionHeight + 'px' }"
              :thumb-style="{
                right: '0px',
                width: '5px',
                background:'rgba(0,0,0,0.15)',
                opacity: 1
              }"
              :delay="100"
            >
              <template v-if="checkExcpetionQueueBankSubvention">
                <div
                  v-for="(item, index) in getExceptionQueueInfo.BankSubventionQueue"
                  :key="item.id"
                  class="bottom-border q-pa-sm cursor-pointer"
                  @mouseover="bankActiveItemId = index"
                  @click="fnViewBankLeadDetails(item)"
                  :class="bankActiveItemId === index ? 'bg-grey-4' : 'bg-white'"
                >
                  <div class="row">
                    <div class="col-md-5 col-sm-6 col-xs-12 text-weight-light">
                      <div
                        class="q-caption text-light-blue cursor-pointer"
                        @click.stop="toggleLeadInformation(item)"
                      >
                        #{{ item.leadNumber }}
                      </div>
                      <div class="q-caption no-margin text-dark capitalize">
                        {{ item.leadName }}
                      </div>
                    </div>
                    <div class="col-md-7 col-sm-6 col-xs-12 text-weight-light">
                      <div class="q-caption text-dark">{{ item.createdBy.name }}</div>
                      <div class="q-caption text-dark">
                        Date of Updation :
                        <span class="text-primary">
                          {{ formatDate(item.submitteSATDate) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="bottom-border q-ma-sm">
                  <div class="row">
                    <div
                      class="col-md-12 col-sm-12 col-xs-12 text-weight-light"
                      align="center"
                    >
                      <div class="q-caption text-dark q-pa-md">
                        No data to display
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </q-scroll-area>
          </q-card>
        </div>

        <!-- Pricing Exception Queue -->
        <div class="col-md-4 col-sm-12 col-xs-12">
          <q-card
            :class="[$route.params.id == 3 ? 'seriousActive border-red' : '']"
            class="shadow-0 q-ma-md"
          >
            <q-item class="bg-red-7">
              <q-item-section>
                <div class="text-grey-12 q-ml-sm">Pricing Exception Queue</div>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  round
                  color="grey-12"
                  class="shadow-5"
                  style="border: 3px solid rgb(244, 67, 55);"
                  text-color="red-6"
                  >{{ getExceptionQueueInfo.PricingExceptionCount }}</q-btn
                >
              </q-item-section>
            </q-item>

            <q-scroll-area
              :style="{ height: customPricingHeight + 'px' }"
              :thumb-style="{
                right: '0px',
                width: '5px',
                background:'rgba(0,0,0,0.15)',
                opacity: 1
              }"
              :delay="500"
            >
              <template v-if="checkExcpetionQueuePricing">
                <div
                  v-for="(item, index) in getExceptionQueueInfo.PricingExceptionQueue"
                  :key="item.id"
                  class="bottom-border q-pa-sm cursor-pointer"
                  @mouseover="pricingActiveItemId = index"
                  @click="fnViewPricingLeadDetails(item)"
                  :class="pricingActiveItemId === index ? 'bg-grey-4' : 'bg-white'"
                >
                  <div class="row gutter-sm">
                    <div class="col-md-5 col-sm-6 col-xs-12 text-weight-light">
                      <div
                        class="q-caption text-light-blue cursor-pointer"
                        @click.stop="toggleLeadInformation(item)"
                      >
                        #{{ item.leadNumber }}
                      </div>
                      <div class="q-caption no-margin text-dark capitalize">
                        {{ item.leadName }}
                      </div>
                    </div>
                    <div class="col-md-7 col-sm-6 col-xs-12 text-weight-light">
                      <div class="q-caption text-dark capitalize">
                        {{ item.createdBy.name }}
                      </div>
                      <div class="q-caption text-dark capitalize">
                        Assigned to : RSM {{ item.name }}
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="bottom-border q-ma-sm">
                  <div class="row">
                    <div
                      class="col-md-12 col-sm-12 col-xs-12 text-weight-light"
                      align="center"
                    >
                      <div class="q-caption text-dark q-pa-md">
                        No data to display
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </q-scroll-area>
          </q-card>
        </div>
      </div>
    </q-pull-to-refresh>

    <!-- Lead Info Popup -->
    <generalLeadInformation
      v-if="propToggleLeadInformation"
      :leadInformation="addtnLeadInformation"
      :propToggleLeadInformationPop="propToggleLeadInformation"
      @closeLeadInformation="toggleLeadInformation"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import generalLeadInformation from "../../components/generalLeadInformation.vue";
import { date } from 'quasar'

const store = useStore();
const $q = useQuasar();

// ----------------- State -----------------
const propToggleLeadInformation = ref(false);
const addtnLeadInformation = ref(null);

const customPricingHeight = ref(100);
const customBankSubventionHeight = ref(100);
const customKycHeight = ref(100);

const kycActiveItemId = ref("");
const bankActiveItemId = ref("");
const pricingActiveItemId = ref("");

// ----------------- Getters -----------------
const getExceptionQueueInfo = computed(() => store.getters["ExceptionQueue/getExceptionQueueInfo"]);

// Check if data exists
const checkExcpetionQueueKyc = computed(
  () => getExceptionQueueInfo.value?.KYCExceptionQueue?.length > 0
);
const checkExcpetionQueueBankSubvention = computed(
  () => getExceptionQueueInfo.value?.BankSubventionQueue?.length > 0
);
const checkExcpetionQueuePricing = computed(
  () => getExceptionQueueInfo.value?.PricingExceptionQueue?.length > 0
);

// Date formatting method
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return dateString;
    
    return date.formatDate(dateObj, 'MMMM Do YYYY');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// ----------------- Methods -----------------
function toggleLeadInformation(leadDetails) {
  propToggleLeadInformation.value = !propToggleLeadInformation.value;
  if (leadDetails) addtnLeadInformation.value = leadDetails;
}

function PullToRefresh(done) {
  store.dispatch("ExceptionQueue/FETCH_ALL_EXCEPTIONS_DATA")
    .finally(() => done());
}

function ajaxLoadDataForAllExceptionList() {
  $q.loading.show({ delay: 0, spinnerColor: "purple-9", message: "Fetching data .." });

  store.dispatch("ExceptionQueue/FETCH_ALL_EXCEPTIONS_DATA")
    .then(() => {
      const kycLen = getExceptionQueueInfo.value.KYCExceptionQueue?.length || 0;
      customKycHeight.value = kycLen ? Math.min(kycLen * 100, 500) : 100;

      const bankLen = getExceptionQueueInfo.value.BankSubventionQueue?.length || 0;
      customBankSubventionHeight.value = bankLen ? Math.min(bankLen * 100, 500) : 100;

      const pricingLen = getExceptionQueueInfo.value.PricingExceptionQueue?.length || 0;
      customPricingHeight.value = pricingLen ? Math.min(pricingLen * 100, 500) : 100;
    })
    .finally(() => $q.loading.hide());
}

function fnViewKycLeadDetails(item) {
  window.location.href = `/sat/exception/queue/kyc/lead/details/${item.id}`;
}
function fnViewBankLeadDetails(item) {
  window.location.href = `/sat/exception/queue/bank/subvention/lead/details/${item.id}`;
}
function fnViewPricingLeadDetails(item) {
  window.location.href = `/sat/exception/queue/pricing/lead/details/${item.id}`;
}

// ----------------- Lifecycle -----------------
onMounted(() => {
  ajaxLoadDataForAllExceptionList();
});
</script>

<style scoped>
.seriousActive {
  box-shadow: 0px 0px 15px #3a3a3aa8 !important;
}
.border-blue {
  border: 3px solid #20a9f4;
}
.border-green {
  border: 3px solid #43a047;
}
.border-red {
  border: 3px solid #e53835;
}
</style>