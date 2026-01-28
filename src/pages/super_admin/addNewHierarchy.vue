<template>
  <q-page padding>
    <div class="row">
      <div class="col-12 q-title q-pa-md text-weight-regular bottom-border">
        Add New Hierarchy
      </div>

      <!-- START >> Setup Hierarchy Form -->
      <div class="col-md-5 col-sm-4 col-xs-12 q-pa-sm">
        <q-card style="width: 100%">
          <q-card-section>
            <q-list no-border>
              <!-- Hierarchy Name -->
              <q-item>
                <q-item-section>
                  <q-input
                    v-model="formData.hierarchy"
                    label="Enter New Hierarchy"
                    placeholder="Add New Hierarchy"
                    color="grey-9"
                    dense
                    outlined
                    @blur="$v.formData.hierarchy.$touch()"
                    :error="$v.formData.hierarchy.$error"
                  />
                </q-item-section>
              </q-item>

              <!-- Hierarchy Code -->
              <q-item>
                <q-item-section>
                  <q-input
                    v-model="formData.hierarchyCode"
                    label="Enter New Hierarchy Code"
                    placeholder="Add New Hierarchy Code"
                    color="grey-9"
                    dense
                    outlined
                    @blur="$v.formData.hierarchyCode.$touch()"
                    :error="$v.formData.hierarchyCode.$error"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <!-- Submit Button -->
          <q-card-actions align="end" vertical>
            <q-btn
              label="Submit"
              color="purple-9"
              @click="fnAddHierarchy"
            />
          </q-card-actions>
        </q-card>
      </div>
      <!-- END >> Setup Hierarchy Form -->
    </div>
  </q-page>
</template>

<script>
import { reactive } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex"; // Import useStore
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default {
  name: "AddHierarchyPage",
  setup() {
    const $q = useQuasar();
    const store = useStore(); // Initialize store

    const formData = reactive({
      hierarchy: "",
      hierarchyCode: "",
    });

    const rules = {
      formData: {
        hierarchy: { required },
        hierarchyCode: { required },
      },
    };

    const $v = useVuelidate(rules, { formData });

    /**
     * Function: Add Hierarchy
     * Validates form and calls Vuex action SAVE_HIERARCHY
     */
    const fnAddHierarchy = async () => {
      // Trigger validation
      $v.value.formData.$touch();
      
      // Check if form is valid
      if ($v.value.formData.$error) {
        $q.notify({
          type: 'warning',
          message: 'Please fill in all required fields',
          position: 'bottom'
        });
        return;
      }

      try {
        $q.loading.show({
          delay: 100,
          spinnerColor: 'purple-9',
          message: 'Adding hierarchy...'
        });

        // Dispatch Vuex action
        await store.dispatch('Hierarchy/SAVE_HIERARCHY', {
          hierarchyName: formData.hierarchy,
          hierarchyCode: formData.hierarchyCode
        });

        $q.notify({
          type: 'positive',
          message: 'Hierarchy added successfully!',
          position: 'bottom'
        });

        // Reset form
        formData.hierarchy = "";
        formData.hierarchyCode = "";
        $v.value.formData.$reset();

      } catch (error) {
        console.error('Error adding hierarchy:', error);
        $q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Failed to add hierarchy',
          position: 'bottom'
        });
      } finally {
        $q.loading.hide();
      }
    };

    return {
      formData,
      $v,
      fnAddHierarchy,
    };
  },
};
</script>

<style scoped>
.bottom-border {
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.q-card {
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>