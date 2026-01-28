<template>
  <q-page>
    <div class="row">
      <div class="col-12 text-h6 q-pa-md text-weight-regular bottom-border">
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
                    v-model="formData.Address"
                    label="Address"
                    color="grey-9"
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
                    label="Latitude"
                    disable
                    color="grey-9"
                  />
                </q-item-section>
              </q-item>

              <!-- Longitude -->
              <q-item>
                <q-item-section>
                  <q-input
                    v-model="formData.longitude"
                    label="Longitude"
                    disable
                    color="grey-9"
                  />
                </q-item-section>
              </q-item>

            </q-list>
          </q-card-section>

          <q-card-actions align="end">
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
import { ref, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

/* -------------------- Core -------------------- */
const store = useStore()
const route = useRoute()
const router = useRouter()
const $q = useQuasar()

/* -------------------- State -------------------- */
const propRowDetails = ref({})

const formData = ref({
  Address: '',
  latitude: '',
  longitude: ''
})

/* -------------------- Lifecycle -------------------- */
onBeforeMount(() => {
  propRowDetails.value = route.params.data

  formData.value.Address =
    propRowDetails.value?.data?.data?.second?.[0]?.Failed?.deviceAddress || ''
})

/* -------------------- Methods -------------------- */
const fnAddress = async () => {
  if (!formData.value.Address) {
    $q.notify({
      type: 'negative',
      message: 'Please fill Address fields',
      position: 'bottom'
    })
    return
  }

  $q.loading.show({
    spinnerColor: 'purple-9',
    message: 'Validating...'
  })

  const params = {
    id: propRowDetails.value.data.data.second[0].Failed.tid,
    request: {
      deviceAddress: formData.value.Address
    }
  }

  try {
    const response = await store.dispatch('lat_long/Lat_Long', params)

    formData.value.latitude = response.data.data.first
    formData.value.longitude = response.data.data.second

    $q.notify({
      type: 'positive',
      message: 'Successfully Created',
      position: 'bottom'
    })
  } catch (error) {

    $q.notify({
      type: 'warning',
      message: error?.body?.message ?? 'Please Try Again Later !',
      position: 'bottom'
    })
  } finally {
    $q.loading.hide()
  }
}

const fnSubmit = async () => {
  if (!formData.value.Address || !formData.value.latitude || !formData.value.longitude) {
    $q.notify({
      type: 'negative',
      message: 'Please fill all mandatory fields',
      position: 'bottom'
    })
    return
  }

  $q.loading.show({
    spinnerColor: 'purple-9',
    message: 'Validating...'
  })

  const params = {
    id: propRowDetails.value.data.data.second[0].Failed.tid,
    deviceAddress: formData.value.Address,
    latitude: formData.value.latitude,
    longitude: formData.value.longitude
  }

  try {
    await store.dispatch('lat_long/Latitude_Longitude', params)

    $q.notify({
      type: 'positive',
      message: 'Successfully Created',
      position: 'bottom'
    })

    router.push('/sat/implementation/queue')
  } catch (error) {

    $q.notify({
      type: 'warning',
      message: error?.body?.message ?? 'Please Try Again Later !',
      position: 'bottom'
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
