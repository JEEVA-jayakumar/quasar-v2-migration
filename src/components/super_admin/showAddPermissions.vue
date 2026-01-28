<template>
  <div>
    <!-- Desktop / Tablet (Right Side Dialog) -->
    <q-dialog
      v-model="dialogModel"
      position="right"
      persistent
      class="customModalOverlay gt-sm"
      @hide="emitClose"
    >
      <q-card
        class="column full-height"
        style="max-width: 50vw; min-width: 50vw"
      >
        <form class="column full-height">
          <!-- Header -->
          <div class="q-pa-md bottom-border row items-center">
            <div class="col text-h6 text-weight-regular">
              Add Permissions
            </div>
            <q-btn
              flat
              label="Cancel"
              class="text-grey-8 q-mr-sm"
              @click="emitClose"
            />
            <q-btn
              color="purple-9"
              label="Add"
            />
          </div>

          <!-- User Info -->
          <div class="q-pa-md bottom-border row items-center">
            <div class="col-auto">
              <img
                src="https://png.icons8.com/color/260/person-female.png"
                class="avatar"
              />
            </div>

            <div class="col q-ml-md">
              <div class="text-weight-regular text-grey-8">
                Arun Kumar
              </div>
              <div class="q-body-1 text-grey-8">
                <span class="text-light-blue">Employee ID:</span> 2134453
              </div>
            </div>

            <div class="col">
              <div class="text-grey-8">
                +91 9921344530
              </div>
              <div class="q-body-1 text-grey-8">
                arunkumar@gmail.com
              </div>
            </div>
          </div>

          <!-- Permissions -->
          <div class="q-pa-md">
            <div class="text-h6 text-weight-regular q-mb-sm">
              Set Permission
            </div>

            <div
              v-for="permission in radioPermissions"
              :key="permission.value"
              class="q-mb-sm"
            >
              <q-radio
                v-model="radioPermissionChecked"
                :val="permission.value"
                color="purple-9"
              >
                <q-chip
                  color="blue-grey-1"
                  class="text-grey-8"
                >
                  {{ permission.label }}
                </q-chip>
              </q-radio>
            </div>
          </div>
        </form>
      </q-card>
    </q-dialog>

    <!-- Mobile Dialog -->
    <q-dialog
      v-model="dialogModel"
      persistent
      class="lt-md animate-scale"
      @hide="emitClose"
    >
      <q-card class="q-pa-md">
        <div
          v-for="permission in radioPermissions"
          :key="permission.value"
          class="q-mb-sm"
        >
          <q-radio
            v-model="radioPermissionChecked"
            :val="permission.value"
            color="purple-9"
          >
            <q-chip color="blue-grey-2" class="text-black">
              {{ permission.label }}
            </q-chip>
          </q-radio>
        </div>

        <div class="row justify-end q-mt-md">
          <q-btn
            outline
            color="grey-7"
            label="Cancel"
            class="q-mr-sm"
            @click="emitClose"
          />
          <q-btn
            outline
            color="purple-9"
            label="Send"
          />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

/* =========================
   Props & Emits
========================= */
const props = defineProps({
  propShowAddPermissions: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['emitfnshowAddPermissions'])

/* =========================
   State
========================= */
const dialogModel = ref(props.propShowAddPermissions)

const radioPermissionChecked = ref(null)

const radioPermissions = ref([
  { value: 1, label: 'Read' },
  { value: 2, label: 'Write' },
  { value: 3, label: 'Download' },
  { value: 4, label: 'Edit' }
])

/* =========================
   Sync prop → dialog
========================= */
watch(
  () => props.propShowAddPermissions,
  val => {
    dialogModel.value = val
  }
)

/* =========================
   Methods
========================= */
const emitClose = () => {
  emit('emitfnshowAddPermissions', false)
}
</script>

<style scoped>
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.bottom-border {
  border-bottom: 1px solid #e0e0e0;
}
</style>
