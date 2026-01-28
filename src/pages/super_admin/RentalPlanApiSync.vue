<template>
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col-12 q-title q-pa-md bottom-border"></div>

      <div class="col-md-5 col-sm-4 col-xs-12 q-pa-sm">
        <div class="q-title q-px-lg q-py-md bottom-border text-grey-9">
          <strong>MARS API SYNC - RENTAL PLAN</strong>
        </div>

        <q-card style="width: 1047px">
          <!-- Text Area -->
          <q-card-section>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-input
                    type="textarea"
                    v-model="formData.tokenRentalPlan"
                    disable
                    rows="5"
                    class="text-grey-8 text-weight-regular"
                    input-style="font-size:14pt"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <!-- Submit Button -->
          <q-card-section class="text-center">
            <q-btn
              class="common-btn"
              color="purple-9"
              label="Submit"
              size="15px"
              @click="fnFinalSubmit"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'

const $q = useQuasar()
const store = useStore()

const formData = ref({
  tokenRentalPlan: '101'
})

onBeforeMount(() => {
  console.log(
    'RENTAL PLAN INIT VALUE -------->',
    formData.value.tokenRentalPlan
  )
})

const fnFinalSubmit = async () => {
  console.log(
    'fnFinalSubmit -------->',
    formData.value.tokenRentalPlan
  )

  $q.loading.show({
    spinnerColor: 'purple-9',
    message: 'Submitting data..'
  })

  try {
    await store.dispatch(
      'MarsApiSync/RENTAL_PLAN_MARS',
      formData.value.tokenRentalPlan
    )

    $q.notify({
      type: 'positive',
      position: 'bottom',
      message: 'Successfully created!',
      icon: 'thumb_up'
    })
  } catch {

    $q.notify({
      type: 'negative',
      position: 'bottom',
      message: 'Please try again later!',
      icon: 'thumb_down'
    })
  } finally {
    $q.loading.hide()
  }
}
</script>

<style scoped>
p {
  text-indent: 30px;
}

label {
  margin-right: 20px;
}

.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>
