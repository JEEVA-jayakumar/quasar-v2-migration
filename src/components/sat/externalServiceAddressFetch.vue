<template>
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col-12 text-h6 q-pa-md bottom-border">
        Enter Latitude & Longitude
      </div>

      <div class="col-md-5 col-sm-6 col-xs-12 q-pa-sm">
        <q-card style="width: 150%">
          <q-card-section>
            <q-list bordered>

              <!-- ADDRESS -->
              <q-item>
                <q-item-section>
                  <q-input
                    v-model="formData.address"
                    label="Address"
                    color="grey-9"
                    @blur="v$.formData.address.$touch"
                    :error="v$.formData.address.$error"
                  />
                  <q-btn
                    class="q-mt-sm"
                    label="Search Address"
                    color="purple-9"
                    @click="fnAddress"
                  />
                </q-item-section>
              </q-item>

              <!-- LATITUDE -->
              <q-item>
                <q-item-section>
                  <q-input
                    v-model="formData.latitude"
                    label="Enter Latitude"
                    type="number"
                    disable
                    color="grey-9"
                    @blur="v$.formData.latitude.$touch"
                    :error="v$.formData.latitude.$error"
                  />
                </q-item-section>
              </q-item>

              <!-- LONGITUDE -->
              <q-item>
                <q-item-section>
                  <q-input
                    v-model="formData.longitude"
                    label="Enter Longitude"
                    type="number"
                    disable
                    color="grey-9"
                    @blur="v$.formData.longitude.$touch"
                    :error="v$.formData.longitude.$error"
                  />
                </q-item-section>
              </q-item>

            </q-list>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              label="Submit"
              color="purple-9"
              @click="fnSubmit"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
/* =======================
   IMPORTS
======================= */
import { reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'

import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

/* =======================
   INIT
======================= */
const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const store = useStore()

/* =======================
   STATE
======================= */
const propRowDetails = reactive({})

const formData = reactive({
  address: '',
  latitude: '',
  longitude: ''
})

/* =======================
   VALIDATION
======================= */
const rules = {
  formData: {
    address: { required },
    latitude: { required },
    longitude: { required }
  }
}

const v$ = useVuelidate(rules, { formData })

/* =======================
   LIFECYCLE
======================= */
onMounted(() => {
  Object.assign(propRowDetails, route.params.data)

  formData.address =
    propRowDetails?.data?.data?.Failed?.address || ''
})

/* =======================
   METHODS
======================= */
const fnAddress = async () => {
  if (!formData.address) {
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Please fill Address fields',
      icon: 'info'
    })
    return
  }

  $q.loading.show({
    spinnerColor: 'purple-9',
    message: 'Validating...'
  })

  const params = {
    id: propRowDetails.data.data.Failed.serviceReqTicketId,
    request: {
      deviceAddress: formData.address
    }
  }

  try {
    const response = await store.dispatch(
      'serviceRequestLat_Long/Address_Lat_Long',
      params
    )

    formData.latitude = response.data.data.first
    formData.longitude = response.data.data.second

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Successfully Created',
      icon: 'thumb_up'
    })
  } catch (error) {

    $q.notify({
      color: 'amber-9',
      position: 'bottom',
      message: error?.body?.message || 'Please Try Again Later !',
      icon: 'thumb_down'
    })
  } finally {
    $q.loading.hide()
  }
}

const fnSubmit = async () => {
  v$.value.$touch()

  if (v$.value.$error) {
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Please fill all mandatory fields',
      icon: 'info'
    })
    return
  }

  $q.loading.show({
    spinnerColor: 'purple-9',
    message: 'Validating...'
  })

  const params = {
    id: propRowDetails.data.data.Failed.serviceReqTicketId,
    deviceAddress: formData.address,
    latitude: formData.latitude,
    longitude: formData.longitude
  }

  try {
    await store.dispatch(
      'serviceRequestLat_Long/Submit_Latitude_Longitude',
      params
    )

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Successfully Created',
      icon: 'thumb_up'
    })

    router.push('/sat/service/request')
  } catch (error) {

    $q.notify({
      color: 'amber-9',
      position: 'bottom',
      message: error?.body?.message || 'Please Try Again Later !',
      icon: 'thumb_down'
    })
  } finally {
    $q.loading.hide()
  }
}
</script>

<style scoped>
.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>
