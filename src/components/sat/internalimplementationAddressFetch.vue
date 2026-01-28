<template>
  <q-page>
    <div class="row">
      <div class="col-12 q-pa-md text-weight-regular bottom-border">
        Enter Latitude & Longitude
      </div>

      <div class="col-md-5 col-sm-6 col-xs-12 q-pa-sm">
        <q-card style="width: 150%">
          <q-card-section>
            <q-list bordered>

              <!-- Address -->
              <q-item>
                <q-item-section>
                  <q-input
                    v-model="formData.Address"
                    label="Address"
                    color="grey-9"
                    :error="v$.formData.Address.$error"
                    @blur="v$.formData.Address.$touch()"
                  />

                  <div class="q-mt-sm">
                    <q-btn
                      label="Search Address"
                      color="purple-9"
                      @click="fnAddress"
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
                    :error="v$.formData.latitude.$error"
                    @blur="v$.formData.latitude.$touch()"
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
                    :error="v$.formData.longitude.$error"
                    @blur="v$.formData.longitude.$touch()"
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
import { reactive, onBeforeMount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'

import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

/* ------------------ CORE SETUP ------------------ */
const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const store = useStore()

/* ------------------ STATE ------------------ */
const formData = reactive({
  Address: '',
  latitude: '',
  longitude: ''
})

let propRowDetails = {}

/* ------------------ VALIDATION ------------------ */
const rules = {
  formData: {
    Address: { required },
    latitude: { required },
    longitude: { required }
  }
}

const v$ = useVuelidate(rules, { formData })

/* ------------------ LIFECYCLE ------------------ */
onBeforeMount(() => {
  propRowDetails = route.params.data
  formData.Address =
    propRowDetails?.data?.data?.second?.[0]?.Failed?.deviceAddress || ''
})

/* ------------------ METHODS ------------------ */
const fnAddress = async () => {
  if (!formData.Address) {
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
      id: propRowDetails.data.data.second[0].Failed.tid,
      request: {
        deviceAddress: formData.Address
      }
    }

    const response = await store.dispatch('lat_long/Lat_Long', params)

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
      message: error?.body?.message || 'Please Try Again Later!',
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

  try {
    const params = {
      id: propRowDetails.data.data.second[0].Failed.tid,
      deviceAddress: formData.Address,
      latitude: formData.latitude,
      longitude: formData.longitude
    }

    await store.dispatch('lat_long/Latitude_Longitude', params)

    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Successfully Created',
      icon: 'thumb_up'
    })

    router.push({ name: 'internalimplementationRequest' })
  } catch (error) {

    $q.notify({
      color: 'amber-9',
      position: 'bottom',
      message: error?.body?.message || 'Please Try Again Later!',
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
