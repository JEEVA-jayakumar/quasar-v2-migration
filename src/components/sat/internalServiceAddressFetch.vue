<template>
  <q-page>
    <div class="row">
      <div class="col-12 q-pa-md text-weight-regular bottom-border">
        Enter Latitude & Longitude
      </div>

      <div class="col-md-5 col-sm-4 col-xs-12 q-pa-sm">
        <q-card style="width: 150%">
          <q-card-section>
            <q-list bordered>

              <!-- Address -->
              <q-item>
                <q-item-section>
                  <q-input
                    v-model="formData.address"
                    label="Address"
                    color="grey-9"
                    @blur="v$.formData.address.$touch()"
                    :error="v$.formData.address.$error"
                  />

                  <div class="q-mt-sm">
                    <q-btn
                      label="Search Address"
                      color="purple-9"
                      @click="fnAddress(formData)"
                    />
                  </div>
                </q-item-section>
              </q-item>

              <!-- Latitude -->
              <q-item>
                <q-item-section>
                  <q-input
                    v-model="formData.latitude"
                    label="Enter Latitude"
                    disable
                    color="grey-9"
                    @blur="v$.formData.latitude.$touch()"
                    :error="v$.formData.latitude.$error"
                  />
                </q-item-section>
              </q-item>

              <!-- Longitude -->
              <q-item>
                <q-item-section>
                  <q-input
                    v-model="formData.longitude"
                    label="Enter Longitude"
                    disable
                    color="grey-9"
                    @blur="v$.formData.longitude.$touch()"
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
              @click="fnSubmit(formData)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive, onBeforeMount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'

import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

/* -------------------- PLUGINS -------------------- */
const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const store = useStore()

/* -------------------- STATE -------------------- */
const propRowDetails = reactive({})

const formData = reactive({
  address: '',
  latitude: '',
  longitude: ''
})

/* -------------------- VALIDATION -------------------- */
const rules = {
  formData: {
    address: { required },
    latitude: { required },
    longitude: { required }
  }
}

const v$ = useVuelidate(rules, { formData })

/* -------------------- LIFECYCLE -------------------- */
onBeforeMount(() => {
  Object.assign(propRowDetails, route.params.data)
  formData.address = propRowDetails?.data?.data?.Failed?.address || ''
})

/* -------------------- METHODS -------------------- */
const fnAddress = async (request) => {
  if (!request.address) {
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

  try {
    const params = {
      id: propRowDetails.data.data.Failed.serviceReqTicketId,
      request: {
        deviceAddress: request.address
      }
    }

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
      type: 'warning',
      color: 'amber-9',
      position: 'bottom',
      message: error?.body?.message || 'Please Try Again Later !',
      icon: 'thumb_down'
    })
  } finally {
    $q.loading.hide()
  }
}

const fnSubmit = async (request) => {
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

  try {
    const params = {
      id: propRowDetails.data.data.Failed.serviceReqTicketId,
      deviceAddress: request.address,
      latitude: request.latitude,
      longitude: request.longitude
    }

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
      type: 'warning',
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
